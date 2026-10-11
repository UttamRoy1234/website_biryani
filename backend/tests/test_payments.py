import hmac
import hashlib
from decimal import Decimal
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from apps.orders.models import Order
from apps.payments.models import Payment

class PaymentTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.order = Order.objects.create(
            order_number="DUM-PAY-100",
            status=Order.Status.PENDING_PAYMENT,
            customer_name="Aditya Sharma",
            customer_phone="9876543210",
            delivery_address_line="Indiranagar",
            delivery_locality="Indiranagar",
            delivery_postal_code="560038",
            subtotal=Decimal("499.00"),
            packing_fee=Decimal("35.00"),
            delivery_fee=Decimal("60.00"),
            tax_amount=Decimal("26.70"),
            total_amount=Decimal("620.70")
        )

    def test_create_razorpay_order_initiates_payment_record(self):
        payload = {"order_id": str(self.order.id)}
        response = self.client.post('/api/v1/payments/create-order/', payload, format='json')
        self.assertEqual(response.status_code, 200)

        data = response.data
        self.assertIn('razorpay_order_id', data)
        self.assertEqual(data['amount'], 62070)  # in paise

        # Check DB payment record
        payment = Payment.objects.filter(order=self.order).first()
        self.assertIsNotNone(payment)
        self.assertEqual(payment.status, Payment.Status.INITIATED)

    @override_settings(RAZORPAY_KEY_SECRET="test_secret_key_123", DEBUG=False)
    def test_verify_payment_valid_signature(self):
        razorpay_order_id = "order_DUMPAY100_abc123"
        razorpay_payment_id = "pay_live_test_9981"
        secret = "test_secret_key_123"

        msg = f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8')
        valid_sig = hmac.new(secret.encode('utf-8'), msg, hashlib.sha256).hexdigest()

        Payment.objects.create(
            order=self.order,
            provider=Payment.Provider.RAZORPAY,
            status=Payment.Status.INITIATED,
            razorpay_order_id=razorpay_order_id,
            amount=self.order.total_amount,
            idempotency_key="init_test_verify"
        )

        payload = {
            "order_id": str(self.order.id),
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": valid_sig
        }

        response = self.client.post('/api/v1/payments/verify/', payload, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['success'])

        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.Status.CONFIRMED)

    @override_settings(RAZORPAY_KEY_SECRET="test_secret_key_123", DEBUG=False)
    def test_verify_payment_tampered_signature_rejected(self):
        razorpay_order_id = "order_DUMPAY100_abc123"
        razorpay_payment_id = "pay_live_test_9981"

        payload = {
            "order_id": str(self.order.id),
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": "tampered_fake_signature"
        }

        response = self.client.post('/api/v1/payments/verify/', payload, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('Verification failed', response.data['error'])
