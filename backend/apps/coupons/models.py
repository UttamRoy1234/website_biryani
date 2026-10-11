import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

class Coupon(models.Model):
    class DiscountType(models.TextChoices):
        PERCENTAGE = 'PERCENTAGE', _('Percentage Discount')
        FLAT = 'FLAT', _('Flat Discount Amount')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=30, unique=True, db_index=True)
    description = models.CharField(max_length=200)
    discount_type = models.CharField(max_length=20, choices=DiscountType.choices, default=DiscountType.PERCENTAGE)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, help_text="Percentage (e.g. 20) or Flat Amount (e.g. 100)")
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Max cap for percentage discounts")
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    usage_limit = models.PositiveIntegerField(null=True, blank=True, help_text="Total number of times coupon can be redeemed")
    times_used = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    valid_from = models.DateTimeField(default=timezone.now)
    valid_to = models.DateTimeField(null=True, blank=True)

    def is_valid_now(self):
        now = timezone.now()
        if not self.is_active:
            return False
        if self.valid_from and now < self.valid_from:
            return False
        if self.valid_to and now > self.valid_to:
            return False
        if self.usage_limit is not None and self.times_used >= self.usage_limit:
            return False
        return True

    def calculate_discount(self, subtotal):
        if subtotal < self.min_order_value:
            return 0
        if self.discount_type == self.DiscountType.PERCENTAGE:
            disc = (subtotal * self.discount_value) / 100
            if self.max_discount:
                return min(disc, self.max_discount)
            return disc
        return min(self.discount_value, subtotal)

    def __str__(self):
        return f"{self.code} ({self.get_discount_type_display()} - {self.discount_value})"

class CouponRedemption(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    coupon = models.ForeignKey(Coupon, on_delete=models.PROTECT, related_name='redemptions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='coupon_redemptions')
    discount_applied = models.DecimalField(max_digits=10, decimal_places=2)
    redeemed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} redeemed {self.coupon.code} for ₹{self.discount_applied}"
