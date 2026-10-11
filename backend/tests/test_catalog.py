from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from apps.catalog.models import Category, Product, ProductVariant, Accompaniment

class CatalogTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.mutton_category = Category.objects.create(
            name="Mutton Handi",
            slug="mutton",
            display_order=1
        )
        self.veg_category = Category.objects.create(
            name="Vegetarian Dum",
            slug="veg",
            display_order=2
        )

        self.gosht = Product.objects.create(
            category=self.mutton_category,
            name="Nizami Gosht Mutton Dum Biryani",
            slug="nizami-gosht-mutton",
            subtitle="Tender baby goat",
            description="Authentic slow-dum in clay pot",
            dietary=Product.Dietary.NON_VEG,
            spice_level=3,
            dum_cooking_hours=Decimal("4.0"),
            is_bestseller=True
        )

        self.gosht_regular = ProductVariant.objects.create(
            product=self.gosht,
            name="Regular Handi",
            serves_count=2,
            serves_label="1 - 2 Persons",
            weight_grams=550,
            price=Decimal("499.00"),
            packing_fee=Decimal("35.00"),
            is_available=True
        )

        self.gosht_grand = ProductVariant.objects.create(
            product=self.gosht,
            name="Grand Celebration Handi",
            serves_count=4,
            serves_label="3 - 4 Persons",
            weight_grams=1100,
            price=Decimal("899.00"),
            packing_fee=Decimal("50.00"),
            is_available=True
        )

        self.subz = Product.objects.create(
            category=self.veg_category,
            name="Shahi Malai Paneer Dum Biryani",
            slug="shahi-malai-paneer",
            subtitle="Fresh cottage cheese",
            description="Vegetarian dum biryani",
            dietary=Product.Dietary.VEG,
            spice_level=2,
            dum_cooking_hours=Decimal("2.0"),
            is_bestseller=False
        )

        self.subz_regular = ProductVariant.objects.create(
            product=self.subz,
            name="Regular Handi",
            serves_count=2,
            serves_label="1 - 2 Persons",
            weight_grams=550,
            price=Decimal("349.00"),
            packing_fee=Decimal("35.00"),
            is_available=True
        )

    def test_list_products_returns_all(self):
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data.get('results', response.data)), 2)

    def test_filter_products_by_dietary(self):
        response = self.client.get('/api/v1/products/?dietary=VEG')
        self.assertEqual(response.status_code, 200)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['name'], "Shahi Malai Paneer Dum Biryani")

    def test_filter_products_by_category_slug(self):
        response = self.client.get('/api/v1/products/?category=mutton')
        self.assertEqual(response.status_code, 200)
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['slug'], "nizami-gosht-mutton")

    def test_retrieve_product_detail(self):
        response = self.client.get('/api/v1/products/nizami-gosht-mutton/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], "Nizami Gosht Mutton Dum Biryani")
        self.assertEqual(len(response.data['variants']), 2)
