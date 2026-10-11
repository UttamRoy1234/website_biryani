import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from apps.catalog.models import ProductVariant

class Order(models.Model):
    class Status(models.TextChoices):
        PENDING_PAYMENT = 'PENDING_PAYMENT', _('Pending Payment')
        CONFIRMED = 'CONFIRMED', _('Confirmed / Ticket Dispatched')
        PREPARING = 'PREPARING', _('Dum Simmering over Embers')
        READY_FOR_PICKUP = 'READY_FOR_PICKUP', _('Purdah Sealed & Packed')
        OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', _('Out for Delivery')
        DELIVERED = 'DELIVERED', _('Delivered Hot & Intact')
        CANCELLED = 'CANCELLED', _('Cancelled')
        REFUNDED = 'REFUNDED', _('Refunded')

    VALID_TRANSITIONS = {
        Status.PENDING_PAYMENT: [Status.CONFIRMED, Status.CANCELLED],
        Status.CONFIRMED: [Status.PREPARING, Status.CANCELLED],
        Status.PREPARING: [Status.READY_FOR_PICKUP, Status.CANCELLED],
        Status.READY_FOR_PICKUP: [Status.OUT_FOR_DELIVERY, Status.CANCELLED],
        Status.OUT_FOR_DELIVERY: [Status.DELIVERED, Status.CANCELLED],
        Status.DELIVERED: [Status.REFUNDED],
        Status.CANCELLED: [Status.REFUNDED],
        Status.REFUNDED: [],
    }

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=32, unique=True, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING_PAYMENT, db_index=True)

    # Customer Contact Info (Snapshot)
    customer_name = models.CharField(max_length=150)
    customer_phone = models.CharField(max_length=20)
    customer_email = models.EmailField(blank=True)

    # Delivery Address Snapshot
    delivery_address_line = models.CharField(max_length=255)
    delivery_locality = models.CharField(max_length=150)
    delivery_postal_code = models.CharField(max_length=10)
    delivery_instructions = models.TextField(blank=True)

    # Financial Breakdown (All values calculated strictly server-side)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    packing_fee = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="5% GST")
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    coupon_code_applied = models.CharField(max_length=30, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def can_transition_to(self, new_status):
        allowed = self.VALID_TRANSITIONS.get(self.status, [])
        return new_status in allowed

    def transition_to(self, new_status, changed_by=None, notes=""):
        if not self.can_transition_to(new_status):
            raise ValueError(f"Invalid order transition from {self.status} to {new_status}")
        from_st = self.status
        self.status = new_status
        self.save(update_fields=['status'])

        OrderStatusHistory.objects.create(
            order=self,
            from_status=from_st,
            to_status=new_status,
            changed_by=changed_by,
            notes=notes
        )

    def __str__(self):
        return f"Order #{self.order_number} ({self.get_status_display()}) - ₹{self.total_amount}"

class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)

    # Historical Snapshots
    product_name_snapshot = models.CharField(max_length=200)
    variant_name_snapshot = models.CharField(max_length=100)
    serves_snapshot = models.CharField(max_length=50)
    unit_price_snapshot = models.DecimalField(max_digits=10, decimal_places=2)
    packing_fee_snapshot = models.DecimalField(max_digits=10, decimal_places=2)

    quantity = models.PositiveIntegerField(default=1)
    line_total = models.DecimalField(max_digits=10, decimal_places=2)
    selected_accompaniments = models.JSONField(default=list, blank=True)
    special_instructions = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.quantity}x {self.product_name_snapshot} ({self.variant_name_snapshot})"

class OrderStatusHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    from_status = models.CharField(max_length=30)
    to_status = models.CharField(max_length=30)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.order.order_number}: {self.from_status} -> {self.to_status}"
