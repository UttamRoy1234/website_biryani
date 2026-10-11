from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Review
        fields = (
            'id', 'user_name', 'product', 'product_name',
            'rating', 'comment', 'is_verified_purchase',
            'created_at'
        )
        read_only_fields = ('id', 'is_verified_purchase', 'created_at')

    def get_user_name(self, obj):
        name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return name if name else obj.user.email.split('@')[0]
