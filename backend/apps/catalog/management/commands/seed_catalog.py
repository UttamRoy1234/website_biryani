from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.catalog.models import Category, Product, ProductVariant, Accompaniment, HandiBatchInventory

class Command(BaseCommand):
    help = 'Seeds initial artisanal Dum & Co. biryani catalog, portion variants, and handi inventory'

    def handle(self, *args, **options):
        self.stdout.write('Seeding Dum & Co. Catalog...')

        # 1. Categories
        mutton_cat, _ = Category.objects.get_or_create(
            slug='mutton',
            defaults={'name': 'Mutton Handi', 'display_order': 1}
        )
        chicken_cat, _ = Category.objects.get_or_create(
            slug='chicken',
            defaults={'name': 'Chicken Handi', 'display_order': 2}
        )
        veg_cat, _ = Category.objects.get_or_create(
            slug='veg',
            defaults={'name': 'Vegetarian Dum', 'display_order': 3}
        )
        combos_cat, _ = Category.objects.get_or_create(
            slug='combos',
            defaults={'name': 'Royal Feasts', 'display_order': 4}
        )

        # 2. Accompaniments
        salan, _ = Accompaniment.objects.get_or_create(
            name='Mirchi Ka Salan (Classic Hyderabadi)',
            defaults={'price': 45.00, 'description': 'Slow-simmered peanut, sesame and green pepper gravy'}
        )
        raita, _ = Accompaniment.objects.get_or_create(
            name='Burani Garlic Raita',
            defaults={'price': 40.00, 'description': 'Creamy smoked garlic hung curd'}
        )
        gulab, _ = Accompaniment.objects.get_or_create(
            name='Angoori Gulab Jamun (2 pcs)',
            defaults={'price': 65.00, 'description': 'Warm khoya dumplings steeped in saffron syrup'}
        )

        # 3. Products
        # Mutton Biryani
        gosht, _ = Product.objects.get_or_create(
            slug='hyderabadi-gosht-dum-biryani',
            defaults={
                'category': mutton_cat,
                'name': 'Nizami Gosht Mutton Dum Biryani',
                'subtitle': 'Tender baby goat slow-simmered for 4 hours with aged royal basmati',
                'description': 'Bone-in prime goat cuts marinated overnight, layered with fragrant basmati and sealed in an artisanal clay handi with whole-wheat dough.',
                'dietary': Product.Dietary.NON_VEG,
                'spice_level': 3,
                'dum_cooking_hours': 4.0,
                'is_bestseller': True,
                'is_chef_special': True,
                'ingredients': ['Prime Goat Cuts', 'Aged Basmati Rice', 'Kashmiri Saffron', 'Desi Gir Cow Ghee'],
                'allergens': ['Dairy'],
            }
        )
        ProductVariant.objects.get_or_create(
            product=gosht,
            name='Regular Handi',
            defaults={'serves_count': 2, 'serves_label': '1 - 2 Persons', 'weight_grams': 550, 'price': 499.00, 'packing_fee': 35.00}
        )
        ProductVariant.objects.get_or_create(
            product=gosht,
            name='Grand Celebration Handi',
            defaults={'serves_count': 4, 'serves_label': '3 - 4 Persons', 'weight_grams': 1100, 'price': 899.00, 'packing_fee': 50.00}
        )

        # Chicken Biryani
        murgh, _ = Product.objects.get_or_create(
            slug='lucknowi-royal-murgh-dum-biryani',
            defaults={
                'category': chicken_cat,
                'name': 'Royal Awadhi Murgh Chicken Dum Biryani',
                'subtitle': 'Delicate Awadhi dum biryani infused with kewra, saffron, and tender chicken',
                'description': 'Farm-fresh chicken thigh cuts cooked gently in yakhni broth, mace, green cardamom, and ittar, slow-dummed in clay.',
                'dietary': Product.Dietary.NON_VEG,
                'spice_level': 2,
                'dum_cooking_hours': 3.0,
                'is_bestseller': True,
                'ingredients': ['Chicken Thigh & Drumsticks', 'Long Basmati', 'Kewra & Rose', 'Mace & Cardamom'],
                'allergens': ['Dairy'],
            }
        )
        ProductVariant.objects.get_or_create(
            product=murgh,
            name='Regular Handi',
            defaults={'serves_count': 2, 'serves_label': '1 - 2 Persons', 'weight_grams': 550, 'price': 399.00, 'packing_fee': 35.00}
        )
        ProductVariant.objects.get_or_create(
            product=murgh,
            name='Grand Celebration Handi',
            defaults={'serves_count': 4, 'serves_label': '3 - 4 Persons', 'weight_grams': 1100, 'price': 749.00, 'packing_fee': 50.00}
        )

        # Veg Biryani
        subz, _ = Product.objects.get_or_create(
            slug='shahi-subz-paneer-handi-biryani',
            defaults={
                'category': veg_cat,
                'name': 'Shahi Subz & Malai Paneer Dum Biryani',
                'subtitle': 'Charred fresh cottage cheese cubes, sweet peas & saffron',
                'description': 'Artisanal malai paneer cubes tossed with fresh garden vegetables in cashew-saffron gravy, slow-dummed with aged basmati.',
                'dietary': Product.Dietary.VEG,
                'spice_level': 2,
                'dum_cooking_hours': 2.0,
                'is_bestseller': True,
                'ingredients': ['Malai Paneer', 'French Beans', 'Sweet Peas', 'Cashew Saffron Sauce'],
                'allergens': ['Dairy', 'Tree Nuts'],
            }
        )
        ProductVariant.objects.get_or_create(
            product=subz,
            name='Regular Handi',
            defaults={'serves_count': 2, 'serves_label': '1 - 2 Persons', 'weight_grams': 550, 'price': 349.00, 'packing_fee': 35.00}
        )

        # 4. Inventory Batches for today
        today = timezone.localdate()
        for variant in ProductVariant.objects.all():
            HandiBatchInventory.objects.get_or_create(
                variant=variant,
                batch_date=today,
                defaults={'max_handis': 25, 'reserved_handis': 0, 'sold_handis': 3}
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Dum & Co. catalog & batches!'))
