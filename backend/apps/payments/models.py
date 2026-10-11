import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.orders.models import Order

class Payment(models.Model):
    class Provider(models.TextChoices):
        RAZORPAY = 'RAZORPAY', _('Razorpay Gateway')
        COD = 'COD', _('Cash on Delivery')

    class Status(models.TextChoices):
        INITIATED = 'INITIATED', _('Initiated')
        AUTHORIZED = 'AUTHORIZED', _('Authorized')
        CAPTURED = 'CAPTURED', _('Captured / Success')
        FAILED = 'FAILED', _('Failed')
        REFUNDED = 'REFUNDED', _('Refunded')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    provider = models.CharField(max_length=20, choices=Provider.choices, default=Provider.RAZORPAY)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.INITIATED)

    # Razorpay Specifics
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='INR')

    error_code = models.CharField(max_length=100, blank=True, null=True)
    error_description = models.TextField(blank=True, null=True)

    idempotency_key = models.CharField(max_length=100, unique=True, db_index=True)
    payload_snapshot = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.id} for Order #{self.order.order_number} ({self.get_status_display()})"
