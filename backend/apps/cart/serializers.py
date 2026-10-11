from rest_framework import serializers
from apps.catalog.models import ProductVariant, Accompaniment
from apps.catalog.serializers import ProductVariantSerializer
from .models import Cart, CartItem

class CartItemSerializer(serializers.ModelSerializer):
    variant_details = ProductVariantSerializer(source='variant', read_only=True)
    accompaniment_details = serializers.SerializerMethodField()
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = (
            'id', 'variant', 'variant_details', 'quantity',
            'selected_accompaniment_ids', 'accompaniment_details',
            'special_instructions', 'line_total', 'created_at'
        )

    def get_accompaniment_details(self, obj):
        acc_ids = obj.selected_accompaniment_ids or []
        items = Accompaniment.objects.filter(id__in=acc_ids)
        return [{'id': str(a.id), 'name': a.name, 'price': str(a.price)} for a in items]

    def get_line_total(self, obj):
        acc_ids = obj.selected_accompaniment_ids or []
        acc_sum = sum(a.price for a in Accompaniment.objects.filter(id__in=acc_ids))
        return (obj.variant.price + acc_sum) * obj.quantity

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    item_subtotal = serializers.SerializerMethodField()
    packing_subtotal = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ('id', 'items', 'item_subtotal', 'packing_subtotal', 'updated_at')

    def get_item_subtotal(self, obj):
        total = 0
        for item in obj.items.all():
            acc_sum = sum(a.price for a in Accompaniment.objects.filter(id__in=item.selected_accompaniment_ids))
            total += (item.variant.price + acc_sum) * item.quantity
        return total

    def get_packing_subtotal(self, obj):
        return sum(item.variant.packing_fee * item.quantity for item in obj.items.all())

class AddCartItemSerializer(serializers.Serializer):
    variant_id = serializers.UUIDField(required=True)
    quantity = serializers.IntegerField(default=1, min_value=1)
    accompaniment_ids = serializers.ListField(child=serializers.UUIDField(), required=False, default=list)
    special_instructions = serializers.CharField(max_length=255, required=False, allow_blank=True)
