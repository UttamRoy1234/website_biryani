from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'provider', 'status', 'amount', 'razorpay_payment_id', 'created_at')
    list_filter = ('provider', 'status', 'created_at')
    search_fields = ('order__order_number', 'razorpay_order_id', 'razorpay_payment_id', 'idempotency_key')
    readonly_fields = ('id', 'created_at', 'updated_at')
