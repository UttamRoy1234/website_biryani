from django.contrib import admin
from .models import Coupon, CouponRedemption

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'discount_value', 'min_order_value', 'times_used', 'is_active', 'valid_to')
    list_filter = ('discount_type', 'is_active')
    search_fields = ('code', 'description')

@admin.register(CouponRedemption)
class CouponRedemptionAdmin(admin.ModelAdmin):
    list_display = ('coupon', 'user', 'discount_applied', 'redeemed_at')
    list_filter = ('coupon', 'redeemed_at')
    search_fields = ('coupon__code', 'user__email')
