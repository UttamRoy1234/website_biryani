import uuid
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('catalog', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('order_number', models.CharField(db_index=True, max_length=32, unique=True)),
                ('status', models.CharField(choices=[('PENDING_PAYMENT', 'Pending Payment'), ('CONFIRMED', 'Confirmed / Ticket Dispatched'), ('PREPARING', 'Dum Simmering over Embers'), ('READY_FOR_PICKUP', 'Purdah Sealed & Packed'), ('OUT_FOR_DELIVERY', 'Out for Delivery'), ('DELIVERED', 'Delivered Hot & Intact'), ('CANCELLED', 'Cancelled'), ('REFUNDED', 'Refunded')], db_index=True, default='PENDING_PAYMENT', max_length=30)),
                ('customer_name', models.CharField(max_length=150)),
                ('customer_phone', models.CharField(max_length=20)),
                ('customer_email', models.EmailField(blank=True, max_length=254)),
                ('delivery_address_line', models.CharField(max_length=255)),
                ('delivery_locality', models.CharField(max_length=150)),
                ('delivery_postal_code', models.CharField(max_length=10)),
                ('delivery_instructions', models.TextField(blank=True)),
                ('subtotal', models.DecimalField(decimal_places=2, max_digits=10)),
                ('packing_fee', models.DecimalField(decimal_places=2, max_digits=10)),
                ('delivery_fee', models.DecimalField(decimal_places=2, max_digits=10)),
                ('tax_amount', models.DecimalField(decimal_places=2, help_text='5% GST', max_digits=10)),
                ('discount_amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('coupon_code_applied', models.CharField(blank=True, max_length=30)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('confirmed_at', models.DateTimeField(blank=True, null=True)),
                ('delivered_at', models.DateTimeField(blank=True, null=True)),
                ('cancelled_at', models.DateTimeField(blank=True, null=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='orders', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('product_name_snapshot', models.CharField(max_length=200)),
                ('variant_name_snapshot', models.CharField(max_length=100)),
                ('serves_snapshot', models.CharField(max_length=50)),
                ('unit_price_snapshot', models.DecimalField(decimal_places=2, max_digits=10)),
                ('packing_fee_snapshot', models.DecimalField(decimal_places=2, max_digits=10)),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('line_total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('selected_accompaniments', models.JSONField(blank=True, default=list)),
                ('special_instructions', models.CharField(blank=True, max_length=255)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='orders.order')),
                ('variant', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='catalog.productvariant')),
            ],
        ),
        migrations.CreateModel(
            name='OrderStatusHistory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('from_status', models.CharField(max_length=30)),
                ('to_status', models.CharField(max_length=30)),
                ('notes', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('changed_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='status_history', to='orders.order')),
            ],
            options={
                'ordering': ['created_at'],
            },
        ),
    ]
