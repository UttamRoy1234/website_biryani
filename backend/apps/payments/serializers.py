from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = (
            'id', 'order', 'provider', 'status',
            'razorpay_order_id', 'razorpay_payment_id',
            'amount', 'currency', 'created_at'
        )
        read_only_fields = ('id', 'created_at')

class CreatePaymentOrderSerializer(serializers.Serializer):
    order_id = serializers.UUIDField(required=True)

class VerifyPaymentSerializer(serializers.Serializer):
    order_id = serializers.UUIDField(required=True)
    razorpay_order_id = serializers.CharField(required=True)
    razorpay_payment_id = serializers.CharField(required=True)
    razorpay_signature = serializers.CharField(required=True)
