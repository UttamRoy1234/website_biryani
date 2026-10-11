from rest_framework import serializers
from .models import Coupon

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = (
            'code', 'description', 'discount_type',
            'discount_value', 'max_discount', 'min_order_value'
        )
