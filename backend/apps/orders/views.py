import random
from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.accounts.permissions import IsOwnerOrStaff, IsStaffUser
from apps.catalog.models import ProductVariant, Accompaniment, HandiBatchInventory
from apps.coupons.models import Coupon, CouponRedemption
from apps.restaurant.models import RestaurantSettings
from .models import Order, OrderItem, OrderStatusHistory
from .serializers import (
    OrderDetailSerializer,
    OrderListSerializer,
    OrderCreateSerializer
)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().prefetch_related('items', 'status_history')
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrStaff)

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        if self.action == 'retrieve':
            return OrderDetailSerializer
        return OrderListSerializer

    def get_queryset(self):
        user = self.request.user
        if not user or not user.is_authenticated:
            return Order.objects.none()
        if user.is_staff or getattr(user, 'role', '') in ['STAFF', 'ADMIN']:
            return Order.objects.all()
        return Order.objects.filter(user=user)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = request.user if request.user.is_authenticated else None
        today = timezone.localdate()

        # 1. Fetch settings for pricing calculation
        settings = RestaurantSettings.objects.first()
        free_thresh = settings.free_delivery_threshold if settings else Decimal('799.00')
        flat_delivery = settings.flat_delivery_fee if settings else Decimal('60.00')
        gst_pct = settings.gst_percentage if settings else Decimal('5.00')

        subtotal = Decimal('0.00')
        packing_fee = Decimal('0.00')
        order_items_to_create = []

        # 2. Iterate items with ACID select_for_update locking on batch inventory
        for item_data in data['items']:
            variant_id = item_data['variant_id']
            qty = item_data['quantity']

            try:
                variant = ProductVariant.objects.select_related('product').get(id=variant_id, is_available=True)
            except ProductVariant.DoesNotExist:
                return Response(
                    {'error': f'Product variant {variant_id} is unavailable.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check and lock daily batch inventory
            batch = HandiBatchInventory.objects.select_for_update().filter(
                variant=variant,
                batch_date=today
            ).first()

            if batch:
                if batch.remaining_handis < qty:
                    return Response(
                        {'error': f'Only {batch.remaining_handis} portions left for {variant.product.name}.'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                batch.reserved_handis += qty
                batch.save()

            # Accompaniments
            acc_ids = item_data.get('accompaniment_ids', [])
            accompaniments = list(Accompaniment.objects.filter(id__in=acc_ids))
            acc_sum = sum(a.price for a in accompaniments)

            line_unit_price = variant.price + acc_sum
            line_total = line_unit_price * qty
            subtotal += line_total
            packing_fee += variant.packing_fee * qty

            acc_snapshots = [{'id': str(a.id), 'name': a.name, 'price': str(a.price)} for a in accompaniments]

            order_items_to_create.append({
                'variant': variant,
                'product_name_snapshot': variant.product.name,
                'variant_name_snapshot': variant.name,
                'serves_snapshot': variant.serves_label,
                'unit_price_snapshot': line_unit_price,
                'packing_fee_snapshot': variant.packing_fee,
                'quantity': qty,
                'line_total': line_total,
                'selected_accompaniments': acc_snapshots,
                'special_instructions': item_data.get('special_instructions', '')
            })

        # 3. Calculate taxes and delivery
        delivery_fee = Decimal('0.00') if subtotal >= free_thresh else flat_delivery
        taxable_amount = subtotal + packing_fee
        tax_amount = round((taxable_amount * gst_pct) / Decimal('100.00'), 2)

        # 4. Coupon Calculation
        discount_amount = Decimal('0.00')
        applied_coupon_code = ''
        coupon_code = data.get('coupon_code', '').strip().upper()

        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code)
                if coupon.is_valid_now() and subtotal >= coupon.min_order_value:
                    discount_amount = Decimal(str(coupon.calculate_discount(float(subtotal))))
                    applied_coupon_code = coupon.code
                    coupon.times_used += 1
                    coupon.save()
                    if user:
                        CouponRedemption.objects.create(
                            coupon=coupon,
                            user=user,
                            discount_applied=discount_amount
                        )
            except Coupon.DoesNotExist:
                pass

        total_amount = max(Decimal('0.00'), subtotal + packing_fee + delivery_fee + tax_amount - discount_amount)
        order_number = f"DUM-{random.randint(100000, 999999)}"

        # 5. Create Order
        order = Order.objects.create(
            order_number=order_number,
            user=user,
            status=Order.Status.CONFIRMED,
            customer_name=data['customer_name'],
            customer_phone=data['customer_phone'],
            customer_email=data.get('customer_email', ''),
            delivery_address_line=data['address_line'],
            delivery_locality=data['locality'],
            delivery_postal_code=data['postal_code'],
            delivery_instructions=data.get('instructions', ''),
            subtotal=subtotal,
            packing_fee=packing_fee,
            delivery_fee=delivery_fee,
            tax_amount=tax_amount,
            discount_amount=discount_amount,
            total_amount=total_amount,
            coupon_code_applied=applied_coupon_code,
            confirmed_at=timezone.now()
        )

        for item_dict in order_items_to_create:
            OrderItem.objects.create(order=order, **item_dict)

        OrderStatusHistory.objects.create(
            order=order,
            from_status=Order.Status.PENDING_PAYMENT,
            to_status=Order.Status.CONFIRMED,
            notes="Order placed and confirmed in kitchen."
        )

        return Response(OrderDetailSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status not in [Order.Status.CONFIRMED, Order.Status.PENDING_PAYMENT]:
            return Response(
                {'error': f'Orders in {order.get_status_display()} state cannot be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        order.transition_to(Order.Status.CANCELLED, changed_by=request.user, notes="Cancelled by customer.")
        return Response(OrderDetailSerializer(order).data)

    @action(detail=False, methods=['get'], permission_classes=[IsStaffUser])
    def kitchen(self, request):
        active_statuses = [
            Order.Status.CONFIRMED,
            Order.Status.PREPARING,
            Order.Status.READY_FOR_PICKUP,
            Order.Status.OUT_FOR_DELIVERY
        ]
        kitchen_orders = Order.objects.filter(status__in=active_statuses).order_by('created_at')
        serializer = OrderDetailSerializer(kitchen_orders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], permission_classes=[IsStaffUser])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        notes = request.data.get('notes', '')

        if not new_status:
            return Response({'error': 'New status is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order.transition_to(new_status, changed_by=request.user, notes=notes)
            return Response(OrderDetailSerializer(order).data)
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
