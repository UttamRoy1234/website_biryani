from rest_framework import serializers
from .models import Category, Product, ProductVariant, Accompaniment, HandiBatchInventory

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'display_order')

class ProductVariantSerializer(serializers.ModelSerializer):
    remaining_handis = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = (
            'id', 'name', 'serves_count', 'serves_label',
            'weight_grams', 'price', 'packing_fee', 'is_available',
            'remaining_handis'
        )

    def get_remaining_handis(self, obj):
        from django.utils import timezone
        today = timezone.localdate()
        batch = obj.batches.filter(batch_date=today).first()
        return batch.remaining_handis if batch else 25

class AccompanimentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accompaniment
        fields = ('id', 'name', 'price', 'description')

class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    starting_price = serializers.SerializerMethodField()
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'subtitle', 'category',
            'dietary', 'spice_level', 'dum_cooking_hours',
            'clay_handi_type', 'is_bestseller', 'is_chef_special',
            'starting_price', 'variants'
        )

    def get_starting_price(self, obj):
        cheapest = obj.variants.filter(is_available=True).order_by('price').first()
        return cheapest.price if cheapest else None

class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'subtitle', 'description',
            'category', 'dietary', 'spice_level', 'dum_cooking_hours',
            'clay_handi_type', 'ingredients', 'allergens',
            'is_bestseller', 'is_chef_special', 'variants',
            'created_at', 'updated_at'
        )
