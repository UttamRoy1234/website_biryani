import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _

class RestaurantSettings(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    brand_name = models.CharField(max_length=100, default='Dum & Co.')
    tagline = models.CharField(max_length=200, default='Slow-cooked. Soul-approved.')
    fssai_license = models.CharField(max_length=50, default='11224333000912')
    is_kitchen_accepting_orders = models.BooleanField(default=True)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=299.00)
    free_delivery_threshold = models.DecimalField(max_digits=10, decimal_places=2, default=799.00)
    flat_delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=60.00)
    gst_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    opening_time = models.TimeField(default='11:30:00')
    closing_time = models.TimeField(default='23:30:00')
    support_phone = models.CharField(max_length=20, default='+91 80 4920 1834')
    support_email = models.EmailField(default='concierge@dumandco.in')

    class Meta:
        verbose_name = _('Restaurant Settings')
        verbose_name_plural = _('Restaurant Settings')

    def __str__(self):
        return f"{self.brand_name} Settings (Kitchen Open: {self.is_kitchen_accepting_orders})"
