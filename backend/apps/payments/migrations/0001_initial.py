import uuid
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('provider', models.CharField(choices=[('RAZORPAY', 'Razorpay Gateway'), ('COD', 'Cash on Delivery')], default='RAZORPAY', max_length=20)),
                ('status', models.CharField(choices=[('INITIATED', 'Initiated'), ('AUTHORIZED', 'Authorized'), ('CAPTURED', 'Captured / Success'), ('FAILED', 'Failed'), ('REFUNDED', 'Refunded')], default='INITIATED', max_length=20)),
                ('razorpay_order_id', models.CharField(blank=True, db_index=True, max_length=100, null=True)),
                ('razorpay_payment_id', models.CharField(blank=True, db_index=True, max_length=100, null=True)),
                ('razorpay_signature', models.CharField(blank=True, max_length=255, null=True)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('currency', models.CharField(default='INR', max_length=10)),
                ('error_code', models.CharField(blank=True, max_length=100, null=True)),
                ('error_description', models.TextField(blank=True, null=True)),
                ('idempotency_key', models.CharField(db_index=True, max_length=100, unique=True)),
                ('payload_snapshot', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payments', to='orders.order')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
