from decimal import Decimal
from rest_framework import views, status, permissions
from rest_framework.response import Response
from apps.catalog.models import ProductVariant, Accompaniment
from apps.coupons.models import Coupon
from apps.restaurant.models import RestaurantSettings
from .models import Cart, CartItem
from .serializers import CartSerializer, AddCartItemSerializer

def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart
    session_key = request.session.session_key
    if not session_key:
        request.session.create()
        session_key = request.session.session_key
    cart, _ = Cart.objects.get_or_create(session_key=session_key)
    return cart

class CartView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        cart = get_or_create_cart(request)
        return Response(CartSerializer(cart).data)

    def post(self, request):
        serializer = AddCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            variant = ProductVariant.objects.get(id=data['variant_id'], is_available=True)
        except ProductVariant.DoesNotExist:
            return Response({'error': 'Product variant unavailable or does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        cart = get_or_create_cart(request)
        acc_ids = [str(uid) for uid in data.get('accompaniment_ids', [])]

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            variant=variant,
            selected_accompaniment_ids=acc_ids,
            defaults={
                'quantity': data['quantity'],
                'special_instructions': data.get('special_instructions', '')
            }
        )
        if not created:
            item.quantity += data['quantity']
            item.save()

        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

class CartItemDetailView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def patch(self, request, item_id):
        cart = get_or_create_cart(request)
        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found in cart.'}, status=status.HTTP_404_NOT_FOUND)

        qty = request.data.get('quantity')
        if qty is not None:
            if int(qty) <= 0:
                item.delete()
            else:
                item.quantity = int(qty)
                item.save()

        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id):
        cart = get_or_create_cart(request)
        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
            item.delete()
        except CartItem.DoesNotExist:
            pass
        return Response(CartSerializer(cart).data)

class CheckoutQuoteView(views.APIView):
    """
    POST /api/v1/checkout/quote/
    Calculates subtotal, packing fees, distance-based delivery, GST (5%), and coupon deductions.
    Never trusts client calculations.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        items_data = request.data.get('items', [])
        coupon_code = request.data.get('coupon_code', '').strip().upper()

        settings = RestaurantSettings.objects.first()
        free_thresh = settings.free_delivery_threshold if settings else Decimal('799.00')
        flat_delivery = settings.flat_delivery_fee if settings else Decimal('60.00')
        gst_pct = settings.gst_percentage if settings else Decimal('5.00')

        item_subtotal = Decimal('0.00')
        packing_subtotal = Decimal('0.00')

        for entry in items_data:
            variant_id = entry.get('variant_id')
            qty = Decimal(str(entry.get('quantity', 1)))
            try:
                variant = ProductVariant.objects.get(id=variant_id, is_available=True)
            except (ProductVariant.DoesNotExist, ValueError):
                continue

            acc_ids = entry.get('accompaniment_ids', [])
            acc_sum = sum(a.price for a in Accompaniment.objects.filter(id__in=acc_ids))
            item_subtotal += (variant.price + acc_sum) * qty
            packing_subtotal += variant.packing_fee * qty

        if item_subtotal == 0:
            return Response({
                'item_subtotal': '0.00',
                'packing_subtotal': '0.00',
                'delivery_fee': '0.00',
                'tax_amount': '0.00',
                'discount_amount': '0.00',
                'final_total': '0.00',
            })

        delivery_fee = Decimal('0.00') if item_subtotal >= free_thresh else flat_delivery
        taxable_amount = item_subtotal + packing_subtotal
        tax_amount = round((taxable_amount * gst_pct) / Decimal('100.00'), 2)

        # Coupon Validation
        discount_amount = Decimal('0.00')
        applied_coupon_info = None
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code)
                if coupon.is_valid_now() and item_subtotal >= coupon.min_order_value:
                    discount_amount = Decimal(str(coupon.calculate_discount(float(item_subtotal))))
                    applied_coupon_info = {
                        'code': coupon.code,
                        'description': coupon.description,
                        'discount': str(discount_amount)
                    }
            except Coupon.DoesNotExist:
                pass

        final_total = max(Decimal('0.00'), item_subtotal + packing_subtotal + delivery_fee + tax_amount - discount_amount)

        return Response({
            'item_subtotal': str(item_subtotal),
            'packing_subtotal': str(packing_subtotal),
            'delivery_fee': str(delivery_fee),
            'tax_amount': str(tax_amount),
            'discount_amount': str(discount_amount),
            'final_total': str(final_total),
            'free_delivery_threshold': str(free_thresh),
            'applied_coupon': applied_coupon_info
        })
