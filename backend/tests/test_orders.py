from decimal import Decimal
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from apps.catalog.models import Category, Product, ProductVariant, HandiBatchInventory
from apps.orders.models import Order
from apps.restaurant.models import RestaurantSettings

class OrderTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Restaurant settings
        RestaurantSettings.objects.create(
            free_delivery_threshold=Decimal("799.00"),
            flat_delivery_fee=Decimal("60.00"),
            gst_percentage=Decimal("5.00")
        )

        cat = Category.objects.create(name="Mutton Handi", slug="mutton")
        self.prod = Product.objects.create(
            category=cat,
            name="Nizami Mutton Dum Biryani",
            slug="nizami-mutton",
            subtitle="Prime cuts",
            description="Slow dum"
        )
        self.variant = ProductVariant.objects.create(
            product=self.prod,
            name="Regular Handi",
            serves_count=2,
            serves_label="1 - 2 Persons",
            weight_grams=550,
            price=Decimal("499.00"),
            packing_fee=Decimal("35.00"),
            is_available=True
        )

        today = timezone.localdate()
        self.batch = HandiBatchInventory.objects.create(
            variant=self.variant,
            batch_date=today,
            max_handis=5,
            reserved_handis=0,
            sold_handis=0
        )

    def test_order_creation_calculates_server_totals(self):
        payload = {
            "customer_name": "Aditya Sharma",
            "customer_phone": "9876543210",
            "address_line": "12th Main, Indiranagar",
            "locality": "Indiranagar",
            "postal_code": "560038",
            "items": [
                {
                    "variant_id": str(self.variant.id),
                    "quantity": 1
                }
            ]
        }

        response = self.client.post('/api/v1/orders/', payload, format='json')
        self.assertEqual(response.status_code, 201)

        data = response.data
        self.assertEqual(Decimal(data['subtotal']), Decimal("499.00"))
        self.assertEqual(Decimal(data['packing_fee']), Decimal("35.00"))
        # Below 799 threshold -> delivery fee 60.00
        self.assertEqual(Decimal(data['delivery_fee']), Decimal("60.00"))
        # GST: 5% of (499 + 35) = 26.70
        self.assertEqual(Decimal(data['tax_amount']), Decimal("26.70"))
        # Total: 499 + 35 + 60 + 26.70 = 620.70
        self.assertEqual(Decimal(data['total_amount']), Decimal("620.70"))

        # Check inventory was locked/reserved
        self.batch.refresh_from_db()
        self.assertEqual(self.batch.reserved_handis, 1)

    def test_order_rejected_when_batch_inventory_exceeded(self):
        payload = {
            "customer_name": "Bulk Feast Buyer",
            "customer_phone": "9876543210",
            "address_line": "12th Main, Indiranagar",
            "locality": "Indiranagar",
            "postal_code": "560038",
            "items": [
                {
                    "variant_id": str(self.variant.id),
                    "quantity": 10  # Only 5 available in batch
                }
            ]
        }

        response = self.client.post('/api/v1/orders/', payload, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('left', response.data['error'])

    def test_order_valid_transitions(self):
        order = Order.objects.create(
            order_number="DUM-TEST-100",
            status=Order.Status.CONFIRMED,
            customer_name="Test User",
            customer_phone="9876543210",
            delivery_address_line="Indiranagar",
            delivery_locality="Indiranagar",
            delivery_postal_code="560038",
            subtotal=Decimal("499.00"),
            packing_fee=Decimal("35.00"),
            delivery_fee=Decimal("60.00"),
            tax_amount=Decimal("26.70"),
            total_amount=Decimal("620.70")
        )

        # Transition CONFIRMED -> PREPARING
        order.transition_to(Order.Status.PREPARING)
        self.assertEqual(order.status, Order.Status.PREPARING)

        # Transition PREPARING -> READY_FOR_PICKUP
        order.transition_to(Order.Status.READY_FOR_PICKUP)
        self.assertEqual(order.status, Order.Status.READY_FOR_PICKUP)

        # Attempt invalid backward transition -> ValueError
        with self.assertRaises(ValueError):
            order.transition_to(Order.Status.CONFIRMED)
