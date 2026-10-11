from django.contrib import admin
from .models import Category, Product, ProductVariant, Accompaniment, HandiBatchInventory

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'display_order', 'is_active')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('display_order', 'is_active')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'dietary', 'spice_level', 'dum_cooking_hours', 'is_bestseller', 'is_active')
    list_filter = ('category', 'dietary', 'is_bestseller', 'is_chef_special', 'is_active')
    search_fields = ('name', 'subtitle', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductVariantInline]

@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('product', 'name', 'serves_label', 'weight_grams', 'price', 'packing_fee', 'is_available')
    list_filter = ('is_available',)
    search_fields = ('product__name', 'name')

@admin.register(Accompaniment)
class AccompanimentAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_active')
    list_editable = ('price', 'is_active')

@admin.register(HandiBatchInventory)
class HandiBatchInventoryAdmin(admin.ModelAdmin):
    list_display = ('variant', 'batch_date', 'max_handis', 'reserved_handis', 'sold_handis', 'remaining_handis', 'is_sold_out')
    list_filter = ('batch_date', 'is_sold_out')
