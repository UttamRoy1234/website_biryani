from django.contrib import admin
from .models import RestaurantSettings

@admin.register(RestaurantSettings)
class RestaurantSettingsAdmin(admin.ModelAdmin):
    list_display = (
        'brand_name',
        'is_kitchen_accepting_orders',
        'min_order_amount',
        'free_delivery_threshold',
        'gst_percentage',
        'opening_time',
        'closing_time',
    )
    list_editable = ('is_kitchen_accepting_orders', 'free_delivery_threshold')
