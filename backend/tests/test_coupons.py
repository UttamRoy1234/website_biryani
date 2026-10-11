from decimal import Decimal
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from apps.coupons.models import Coupon

class CouponTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # 20% off with max cap 150 on min order 499
        self.firstdum = Coupon.objects.create(
            code="FIRSTDUM",
            description="20% off on first handi",
            discount_type=Coupon.DiscountType.PERCENTAGE,
            discount_value=Decimal("20.00"),
            max_discount=Decimal("150.00"),
            min_order_value=Decimal("499.00"),
            is_active=True
        )

        # Flat 100 off
        self.feast = Coupon.objects.create(
            code="DUMFEAST",
            description="Flat 100 off",
            discount_type=Coupon.DiscountType.FLAT,
            discount_value=Decimal("100.00"),
            min_order_value=Decimal("599.00"),
            is_active=True
        )

        # Expired coupon
        self.expired = Coupon.objects.create(
            code="OLDDUM",
            description="Expired coupon",
            discount_type=Coupon.DiscountType.FLAT,
            discount_value=Decimal("50.00"),
            valid_to=timezone.now() - timezone.timedelta(days=1),
            is_active=True
        )

    def test_coupon_valid_percentage_discount(self):
        response = self.client.get('/api/v1/coupons/validate/?code=FIRSTDUM&subtotal=600')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_valid'])
        # 20% of 600 = 120.00 (below 150 max cap)
        self.assertEqual(response.data['discount_amount'], 120.00)

    def test_coupon_capped_at_max_discount(self):
        response = self.client.get('/api/v1/coupons/validate/?code=FIRSTDUM&subtotal=1000')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_valid'])
        # 20% of 1000 = 200 -> capped at 150
        self.assertEqual(response.data['discount_amount'], 150.00)

    def test_coupon_rejected_below_min_order_value(self):
        response = self.client.get('/api/v1/coupons/validate/?code=FIRSTDUM&subtotal=300')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.data['is_valid'])

    def test_expired_coupon_rejected(self):
        response = self.client.get('/api/v1/coupons/validate/?code=OLDDUM&subtotal=800')
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.data['is_valid'])
