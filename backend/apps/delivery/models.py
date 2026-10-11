import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from apps.orders.models import Order

class DeliveryZone(models.Model):
    name = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10, unique=True, db_index=True)
    is_active = models.BooleanField(default=True)
    estimated_delivery_minutes = models.PositiveIntegerField(default=40)

    def __str__(self):
        return f"{self.name} ({self.postal_code})"

class Delivery(models.Model):
    class Status(models.TextChoices):
        ASSIGNED = 'ASSIGNED', _('Rider Assigned')
        PICKED_UP = 'PICKED_UP', _('Handi Picked Up from Kitchen')
        EN_ROUTE = 'EN_ROUTE', _('On the Way (Hot Thermal Carrier)')
        DELIVERED = 'DELIVERED', _('Delivered')
        FAILED = 'FAILED', _('Delivery Failed')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='delivery_record')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ASSIGNED)
    rider_name = models.CharField(max_length=150, blank=True)
    rider_phone = models.CharField(max_length=20, blank=True)
    tracking_code = models.CharField(max_length=32, blank=True)
    dispatched_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Delivery for Order #{self.order.order_number} ({self.get_status_display()})"
