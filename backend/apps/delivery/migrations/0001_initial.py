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
            name='DeliveryZone',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('postal_code', models.CharField(db_index=True, max_length=10, unique=True)),
                ('is_active', models.BooleanField(default=True)),
                ('estimated_delivery_minutes', models.PositiveIntegerField(default=40)),
            ],
        ),
        migrations.CreateModel(
            name='Delivery',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('ASSIGNED', 'Rider Assigned'), ('PICKED_UP', 'Handi Picked Up from Kitchen'), ('EN_ROUTE', 'On the Way (Hot Thermal Carrier)'), ('DELIVERED', 'Delivered'), ('FAILED', 'Delivery Failed')], default='ASSIGNED', max_length=20)),
                ('rider_name', models.CharField(blank=True, max_length=150)),
                ('rider_phone', models.CharField(blank=True, max_length=20)),
                ('tracking_code', models.CharField(blank=True, max_length=32)),
                ('dispatched_at', models.DateTimeField(blank=True, null=True)),
                ('delivered_at', models.DateTimeField(blank=True, null=True)),
                ('order', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='delivery_record', to='orders.order')),
            ],
        ),
    ]
