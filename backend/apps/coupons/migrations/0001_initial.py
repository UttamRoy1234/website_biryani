import uuid
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone

class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Coupon',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('code', models.CharField(db_index=True, max_length=30, unique=True)),
                ('description', models.CharField(max_length=200)),
                ('discount_type', models.CharField(choices=[('PERCENTAGE', 'Percentage Discount'), ('FLAT', 'Flat Discount Amount')], default='PERCENTAGE', max_length=20)),
                ('discount_value', models.DecimalField(decimal_places=2, help_text='Percentage or Flat Amount', max_digits=10)),
                ('max_discount', models.DecimalField(blank=True, decimal_places=2, help_text='Max cap for percentage discounts', max_digits=10, null=True)),
                ('min_order_value', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('usage_limit', models.PositiveIntegerField(blank=True, null=True)),
                ('times_used', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('valid_from', models.DateTimeField(default=django.utils.timezone.now)),
                ('valid_to', models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='CouponRedemption',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('discount_applied', models.DecimalField(decimal_places=2, max_digits=10)),
                ('redeemed_at', models.DateTimeField(auto_now_add=True)),
                ('coupon', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='redemptions', to='coupons.coupon')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='coupon_redemptions', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
