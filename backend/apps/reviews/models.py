import uuid
from django.db import models
from django.conf import settings
from apps.catalog.models import Product
from apps.orders.models import Order

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.PositiveSmallIntegerField(default=5)
    comment = models.TextField()
    is_verified_purchase = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.product.name} ({self.rating}★)"
