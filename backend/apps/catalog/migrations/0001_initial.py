import uuid
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('slug', models.SlugField(max_length=120, unique=True)),
                ('description', models.TextField(blank=True)),
                ('display_order', models.PositiveIntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name_plural': 'Categories',
                'ordering': ['display_order', 'name'],
            },
        ),
        migrations.CreateModel(
            name='Accompaniment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=150)),
                ('price', models.DecimalField(decimal_places=2, max_digits=8)),
                ('description', models.TextField(blank=True)),
                ('is_active', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(db_index=True, max_length=200)),
                ('slug', models.SlugField(max_length=220, unique=True)),
                ('subtitle', models.CharField(max_length=300)),
                ('description', models.TextField()),
                ('dietary', models.CharField(choices=[('VEG', 'Vegetarian'), ('NON_VEG', 'Non-Vegetarian'), ('EGG', 'Contains Egg')], default='NON_VEG', max_length=15)),
                ('spice_level', models.PositiveSmallIntegerField(default=3, help_text='Rating between 1 and 5')),
                ('dum_cooking_hours', models.DecimalField(decimal_places=1, default=3.0, max_digits=4)),
                ('clay_handi_type', models.CharField(default='Artisanal Terracotta Matka with Wheat Purdah', max_length=150)),
                ('ingredients', models.JSONField(blank=True, default=list)),
                ('allergens', models.JSONField(blank=True, default=list)),
                ('is_bestseller', models.BooleanField(default=False)),
                ('is_chef_special', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='products', to='catalog.category')),
            ],
            options={
                'ordering': ['-is_bestseller', '-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ProductVariant',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(help_text='e.g. Regular Handi, Grand Celebration Handi', max_length=100)),
                ('serves_count', models.PositiveSmallIntegerField(default=2)),
                ('serves_label', models.CharField(default='1 - 2 Persons', max_length=50)),
                ('weight_grams', models.PositiveIntegerField(help_text='Total portion weight in grams')),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('packing_fee', models.DecimalField(decimal_places=2, default=35.0, max_digits=8)),
                ('is_available', models.BooleanField(default=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='variants', to='catalog.product')),
            ],
            options={
                'ordering': ['price'],
            },
        ),
        migrations.CreateModel(
            name='HandiBatchInventory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('batch_date', models.DateField(db_index=True)),
                ('max_handis', models.PositiveIntegerField(default=25)),
                ('reserved_handis', models.PositiveIntegerField(default=0)),
                ('sold_handis', models.PositiveIntegerField(default=0)),
                ('is_sold_out', models.BooleanField(default=False)),
                ('variant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='batches', to='catalog.productvariant')),
            ],
        ),
        migrations.AddConstraint(
            model_name='productvariant',
            constraint=models.UniqueConstraint(fields=('product', 'name'), name='unique_product_variant_name'),
        ),
        migrations.AddConstraint(
            model_name='handibatchinventory',
            constraint=models.UniqueConstraint(fields=('variant', 'batch_date'), name='unique_variant_daily_batch'),
        ),
    ]
