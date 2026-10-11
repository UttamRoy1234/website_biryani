import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _

class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    description = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = _('Categories')
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name

class Product(models.Model):
    class Dietary(models.TextChoices):
        VEG = 'VEG', _('Vegetarian')
        NON_VEG = 'NON_VEG', _('Non-Vegetarian')
        EGG = 'EGG', _('Contains Egg')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    name = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=220, unique=True, db_index=True)
    subtitle = models.CharField(max_length=300)
    description = models.TextField()
    dietary = models.CharField(max_length=15, choices=Dietary.choices, default=Dietary.NON_VEG)
    spice_level = models.PositiveSmallIntegerField(default=3, help_text="Rating between 1 and 5")
    dum_cooking_hours = models.DecimalField(max_digits=4, decimal_places=1, default=3.0)
    clay_handi_type = models.CharField(max_length=150, default="Artisanal Terracotta Matka with Wheat Purdah")
    ingredients = models.JSONField(default=list, blank=True)
    allergens = models.JSONField(default=list, blank=True)
    is_bestseller = models.BooleanField(default=False)
    is_chef_special = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_bestseller', '-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_dietary_display()})"

class ProductVariant(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=100, help_text="e.g. Regular Handi, Grand Celebration Handi")
    serves_count = models.PositiveSmallIntegerField(default=2)
    serves_label = models.CharField(max_length=50, default="1 - 2 Persons")
    weight_grams = models.PositiveIntegerField(help_text="Total portion weight in grams")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    packing_fee = models.DecimalField(max_digits=8, decimal_places=2, default=35.00)
    is_available = models.BooleanField(default=True)

    class Meta:
        ordering = ['price']
        constraints = [
            models.UniqueConstraint(fields=['product', 'name'], name='unique_product_variant_name')
        ]

    def __str__(self):
        return f"{self.product.name} - {self.name} (₹{self.price})"

class Accompaniment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=150)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} (+₹{self.price})"

class HandiBatchInventory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name='batches')
    batch_date = models.DateField(db_index=True)
    max_handis = models.PositiveIntegerField(default=25)
    reserved_handis = models.PositiveIntegerField(default=0)
    sold_handis = models.PositiveIntegerField(default=0)
    is_sold_out = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['variant', 'batch_date'], name='unique_variant_daily_batch')
        ]

    @property
    def remaining_handis(self):
        return max(0, self.max_handis - (self.reserved_handis + self.sold_handis))

    def __str__(self):
        return f"{self.variant} [{self.batch_date}]: {self.remaining_handis} left"
