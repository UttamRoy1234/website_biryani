from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from apps.accounts.models import User
from apps.orders.models import Order

class PermissionTests(TestCase):
    def setUp(self):
        self.customer_a = User.objects.create_user(
            email="customer.a@example.com",
            password="Password123!",
            role=User.Role.CUSTOMER
        )
        self.customer_b = User.objects.create_user(
            email="customer.b@example.com",
            password="Password123!",
            role=User.Role.CUSTOMER
        )
        self.staff_user = User.objects.create_user(
            email="chef.imran@dumandco.in",
            password="ChefPassword123!",
            role=User.Role.STAFF,
            is_staff=True
        )

        self.order_a = Order.objects.create(
            order_number="DUM-USER-A-01",
            user=self.customer_a,
            status=Order.Status.CONFIRMED,
            customer_name="Customer A",
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

    def test_customer_cannot_see_other_customer_order(self):
        client = APIClient()
        client.force_authenticate(user=self.customer_b)

        # Customer B attempts to retrieve Customer A's order
        response = client.get(f'/api/v1/orders/{self.order_a.id}/')
        # Should be 404 because queryset is filtered to current user
        self.assertEqual(response.status_code, 404)

    def test_non_staff_forbidden_from_kitchen_kds_endpoint(self):
        client = APIClient()
        client.force_authenticate(user=self.customer_a)

        response = client.get('/api/v1/orders/kitchen/')
        self.assertEqual(response.status_code, 403)

    def test_staff_user_can_access_kitchen_kds_endpoint(self):
        client = APIClient()
        client.force_authenticate(user=self.staff_user)

        response = client.get('/api/v1/orders/kitchen/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['order_number'], "DUM-USER-A-01")
