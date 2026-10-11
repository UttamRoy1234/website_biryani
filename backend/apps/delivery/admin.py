from django.contrib import admin
from .models import DeliveryZone, Delivery

@admin.register(DeliveryZone)
class DeliveryZoneAdmin(admin.ModelAdmin):
    list_display = ('name', 'postal_code', 'is_active', 'estimated_delivery_minutes')
    list_filter = ('is_active',)
    search_fields = ('name', 'postal_code')

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = ('order', 'status', 'rider_name', 'rider_phone', 'dispatched_at', 'delivered_at')
    list_filter = ('status',)
    search_fields = ('order__order_number', 'rider_name', 'rider_phone')
