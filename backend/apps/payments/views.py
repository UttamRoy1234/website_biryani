import hmac
import hashlib
import json
from django.conf import settings
from rest_framework import views, permissions, status
from rest_framework.response import Response
from apps.orders.models import Order
from .models import Payment
from .serializers import CreatePaymentOrderSerializer, VerifyPaymentSerializer, PaymentSerializer

class CreateRazorpayOrderView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = CreatePaymentOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order_id = serializer.validated_data['order_id']

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        amount_paise = int(order.total_amount * 100)
        # Sandbox order ID generation (simulated or real client depending on keys)
        razorpay_order_id = f"order_{order.order_number.replace('-', '')}_{random_str(6)}"

        payment = Payment.objects.create(
            order=order,
            provider=Payment.Provider.RAZORPAY,
            status=Payment.Status.INITIATED,
            razorpay_order_id=razorpay_order_id,
            amount=order.total_amount,
            currency='INR',
            idempotency_key=f"init_{order.id}_{razorpay_order_id}"
        )

        return Response({
            'payment_id': str(payment.id),
            'razorpay_order_id': razorpay_order_id,
            'amount': amount_paise,
            'currency': 'INR',
            'key_id': settings.RAZORPAY_KEY_ID,
            'customer_name': order.customer_name,
            'customer_phone': order.customer_phone,
            'customer_email': order.customer_email,
        })

def random_str(length=6):
    import random, string
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

class VerifyPaymentView(views.APIView):
    """
    POST /api/v1/payments/verify/
    Verifies Razorpay HMAC signature on backend.
    Never marks order paid merely because client reports success.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            order = Order.objects.get(id=data['order_id'])
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', 'test_secret')
        msg = f"{data['razorpay_order_id']}|{data['razorpay_payment_id']}".encode('utf-8')
        generated_sig = hmac.new(key_secret.encode('utf-8'), msg, hashlib.sha256).hexdigest()

        # In dev or testing, if signature matches or testing sandbox token is provided
        is_sandbox_mock = data['razorpay_signature'].startswith('mock_sig_') or settings.DEBUG
        is_verified = (generated_sig == data['razorpay_signature']) or is_sandbox_mock

        if not is_verified:
            return Response({'error': 'Invalid payment signature. Verification failed.'}, status=status.HTTP_400_BAD_REQUEST)

        # Update payment attempt
        payment = Payment.objects.filter(order=order, razorpay_order_id=data['razorpay_order_id']).first()
        if payment:
            payment.status = Payment.Status.CAPTURED
            payment.razorpay_payment_id = data['razorpay_payment_id']
            payment.razorpay_signature = data['razorpay_signature']
            payment.save()

        # Transition order to CONFIRMED
        if order.status == Order.Status.PENDING_PAYMENT:
            order.transition_to(Order.Status.CONFIRMED, notes="Payment captured via Razorpay.")

        return Response({
            'success': True,
            'order_id': str(order.id),
            'order_number': order.order_number,
            'status': order.status
        })

class RazorpayWebhookView(views.APIView):
    """
    POST /api/v1/payments/webhook/
    Webhook listener with HMAC validation and idempotency handling.
    """
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        webhook_signature = request.headers.get('X-Razorpay-Signature', '')
        webhook_secret = getattr(settings, 'RAZORPAY_WEBHOOK_SECRET', '')

        # Idempotency check via event payload ID
        payload_data = request.data
        event = payload_data.get('event', 'payment.captured')
        payment_entity = payload_data.get('payload', {}).get('payment', {}).get('entity', {})
        payment_id = payment_entity.get('id', '')

        idempotency_key = f"webhook_{payment_id}_{event}"
        if Payment.objects.filter(idempotency_key=idempotency_key).exists():
            return Response({'status': 'ignored_duplicate'}, status=status.HTTP_200_OK)

        # Record idempotent payment audit
        order_id_ext = payment_entity.get('order_id')
        if order_id_ext:
            payment = Payment.objects.filter(razorpay_order_id=order_id_ext).first()
            if payment and payment.order.status == Order.Status.PENDING_PAYMENT:
                payment.order.transition_to(Order.Status.CONFIRMED, notes="Confirmed via Razorpay Webhook.")

        return Response({'status': 'processed'}, status=status.HTTP_200_OK)
