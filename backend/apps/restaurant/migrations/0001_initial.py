import uuid
from django.db import migrations, models

class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='RestaurantSettings',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('brand_name', models.CharField(default='Dum & Co.', max_length=100)),
                ('tagline', models.CharField(default='Slow-cooked. Soul-approved.', max_length=200)),
                ('fssai_license', models.CharField(default='11224333000912', max_length=50)),
                ('is_kitchen_accepting_orders', models.BooleanField(default=True)),
                ('min_order_amount', models.DecimalField(decimal_places=2, default=299.0, max_digits=10)),
                ('free_delivery_threshold', models.DecimalField(decimal_places=2, default=799.0, max_digits=10)),
                ('flat_delivery_fee', models.DecimalField(decimal_places=2, default=60.0, max_digits=10)),
                ('gst_percentage', models.DecimalField(decimal_places=2, default=5.0, max_digits=5)),
                ('opening_time', models.TimeField(default='11:30:00')),
                ('closing_time', models.TimeField(default='23:30:00')),
                ('support_phone', models.CharField(default='+91 80 4920 1834', max_length=20)),
                ('support_email', models.EmailField(default='concierge@dumandco.in', max_length=254)),
            ],
            options={
                'verbose_name': 'Restaurant Settings',
                'verbose_name_plural': 'Restaurant Settings',
            },
        ),
    ]
