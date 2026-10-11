from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Address

class AddressInline(admin.StackedInline):
    model = Address
    extra = 0

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'phone', 'role', 'is_staff', 'is_active')
    list_filter = ('role', 'is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    ordering = ('-date_joined',)
    inlines = [AddressInline]
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone')}),
        ('Permissions & Roles', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'locality', 'postal_code', 'is_default', 'created_at')
    search_fields = ('full_name', 'address_line', 'locality', 'postal_code', 'phone')
    list_filter = ('city', 'is_default')
