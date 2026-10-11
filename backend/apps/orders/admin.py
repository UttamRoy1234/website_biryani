from django.contrib import admin
from .models import Order, OrderItem, OrderStatusHistory

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = (
        'product_name_snapshot',
        'variant_name_snapshot',
        'serves_snapshot',
        'unit_price_snapshot',
        'packing_fee_snapshot',
        'quantity',
        'line_total',
    )

class OrderStatusHistoryInline(admin.TabularInline):
    model = OrderStatusHistory
    extra = 0
    readonly_fields = ('from_status', 'to_status', 'changed_by', 'notes', 'created_at')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_number',
        'customer_name',
        'customer_phone',
        'status',
        'total_amount',
        'coupon_code_applied',
        'created_at',
    )
    list_filter = ('status', 'created_at')
    search_fields = ('order_number', 'customer_name', 'customer_phone', 'customer_email', 'delivery_postal_code')
    readonly_fields = ('order_number', 'created_at', 'confirmed_at', 'delivered_at', 'cancelled_at')
    inlines = [OrderItemInline, OrderStatusHistoryInline]
