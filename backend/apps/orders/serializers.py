from rest_framework import serializers
from .models import Order, OrderItem, OrderStatusHistory

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = (
            'id', 'product_name_snapshot', 'variant_name_snapshot',
            'serves_snapshot', 'unit_price_snapshot', 'packing_fee_snapshot',
            'quantity', 'line_total', 'selected_accompaniments',
            'special_instructions'
        )

class OrderStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatusHistory
        fields = ('from_status', 'to_status', 'notes', 'created_at')

class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'order_number', 'status', 'customer_name',
            'customer_phone', 'customer_email',
            'delivery_address_line', 'delivery_locality',
            'delivery_postal_code', 'delivery_instructions',
            'subtotal', 'packing_fee', 'delivery_fee',
            'tax_amount', 'discount_amount', 'total_amount',
            'coupon_code_applied', 'items', 'status_history',
            'created_at', 'confirmed_at', 'delivered_at'
        )

class OrderListSerializer(serializers.ModelSerializer):
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            'id', 'order_number', 'status', 'total_amount',
            'customer_name', 'items_count', 'created_at'
        )

    def get_items_count(self, obj):
        return sum(i.quantity for i in obj.items.all())

class OrderCreateItemInputSerializer(serializers.Serializer):
    variant_id = serializers.UUIDField(required=True)
    quantity = serializers.IntegerField(default=1, min_value=1)
    accompaniment_ids = serializers.ListField(child=serializers.UUIDField(), required=False, default=list)
    special_instructions = serializers.CharField(max_length=255, required=False, allow_blank=True)

class OrderCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField(max_length=150)
    customer_phone = serializers.CharField(max_length=20)
    customer_email = serializers.EmailField(required=False, allow_blank=True)
    address_line = serializers.CharField(max_length=255)
    locality = serializers.CharField(max_length=150)
    postal_code = serializers.CharField(max_length=10)
    instructions = serializers.CharField(max_length=255, required=False, allow_blank=True)
    coupon_code = serializers.CharField(max_length=30, required=False, allow_blank=True)
    items = OrderCreateItemInputSerializer(many=True, min_length=1)
