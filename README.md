# DUM & CO. — Premium Biryani Ordering Platform

> **Slow-cooked. Soul-approved.**  
> An enterprise-grade, full-stack food delivery application specializing in authentic Awadhi and Hyderabadi handi biryani slow-simmered in earthen terracotta pots sealed with wheat dough *purdah*.

---

## 1. System Architecture

```
                      ┌────────────────────────────────────────┐
                      │   Next.js 15 Storefront App Router     │
                      │   • Port 3000 / Dynamic SSR & Client   │
                      │   • Tailwind CSS Design Tokens         │
                      │   • Handcrafted Earthen SVG Visuals    │
                      └──────────────────┬─────────────────────┘
                                         │  /api/v1/* (JSON)
                                         ▼
                      ┌────────────────────────────────────────┐
                      │    Django 5 REST Framework Backend     │
                      │   • SimpleJWT Authentication           │
                      │   • drf-spectacular (OpenAPI 3.0)      │
                      │   • 9 Domain Modular Django Apps       │
                      │   • Object-level Security & Isolation  │
                      └───────────┬────────────────┬───────────┘
                                  │                │
            ACID Row Locking      │                │  Async Tasks
            (select_for_update)   ▼                ▼
                      ┌───────────────┐        ┌───────────────┐
                      │  PostgreSQL   │        │ Redis/Celery  │
                      │  16 Database  │        │ Message Broker│
                      └───────────────┘        └───────────────┘
```

---

## 2. Key Modules & Technical Highlights

1. **Artisanal Earthenware Visual Engine:**
   - Zero external raster image dependencies. Built using a reactive component (`BiryaniVisual`) rendering authentic clay handi contours, wheat dough purdah seals, aged basmati layers, Kashmiri saffron strands, and rising steam curls.
2. **ACID Batch Inventory Control:**
   - Every order creation executes within a `@transaction.atomic` block using `HandiBatchInventory.objects.select_for_update()`, guaranteeing finite clay handi portions are never oversold under high concurrency.
3. **Zero-Client-Trust Financial Engine:**
   - Pricing quotes (`POST /api/v1/checkout/quote/`) strictly recalculate portion costs, packaging fees, distance slabs (free delivery above ₹799, otherwise ₹60), 5% food GST, and coupon terms (`FIRSTDUM`, `DUMFEAST`) server-side.
4. **Razorpay Sandbox & HMAC Verification:**
   - Secure payment flow with real-time signature verification (`hmac.sha256`) and idempotency deduplication keys preventing replay attacks.
5. **Kitchen Display System (KDS):**
   - Live multi-column dispatch board (`/admin/kitchen` and in-app modal) enabling restaurant staff to advance tickets through culinary milestones:
     `New Orders` → `In The Dum Pit` → `Purdah Sealed & Packed` → `Out for Delivery` → `Delivered Hot`.
6. **Customer Account & Past Order Reorder:**
   - Order history timeline, downloadable receipts, and single-click **"Reorder This Feast"** that populates the cart with historical portions and sides.

---

## 3. Versioned REST API Specification (`/api/v1/`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/v1/auth/register/` | Register new customer account | No |
| `POST` | `/api/v1/auth/login/` | Obtain JWT access and refresh token pair | No |
| `POST` | `/api/v1/auth/refresh/` | Refresh expired access token | No |
| `POST` | `/api/v1/auth/logout/` | Blacklist JWT refresh token | Yes |
| `GET` | `/api/v1/auth/me/` | Current user profile and loyalty points | Yes |
| `GET` | `/api/v1/products/` | Filterable catalog (category, dietary, spice, search) | No |
| `GET` | `/api/v1/products/{slug}/` | Product details with portion variants and sides | No |
| `GET` | `/api/v1/products/featured/` | Bestseller chef recommendations | No |
| `POST` | `/api/v1/checkout/quote/` | Authoritative server price quote calculator | No |
| `GET` | `/api/v1/coupons/validate/` | Validate coupon code against minimum order rules | No |
| `POST` | `/api/v1/orders/` | Place order with batch reservation | Optional (Guest/User) |
| `GET` | `/api/v1/orders/` | User order history (isolated to caller) | Yes |
| `GET` | `/api/v1/orders/{id}/` | Order details and preparation timeline | Yes (Owner/Staff) |
| `POST` | `/api/v1/orders/{id}/cancel/`| Cancel order (only before rider dispatch) | Yes (Owner) |
| `GET` | `/api/v1/orders/kitchen/` | Real-time KDS tickets board | Staff Only |
| `PATCH` | `/api/v1/orders/{id}/status/`| Transition culinary order stage | Staff Only |
| `POST` | `/api/v1/payments/create-order/`| Initialize Razorpay payment attempt | No |
| `POST` | `/api/v1/payments/verify/` | Verify HMAC signature & capture payment | No |
| `POST` | `/api/v1/payments/webhook/` | Idempotent webhook event listener | No (Signature) |

---

## 4. Local Development & Docker Orchestration

### Option A: Using Docker Compose (Full Stack)

```powershell
# 1. Build and boot all services (PostgreSQL, Redis, Django backend)
docker-compose up --build -d

# 2. Run database migrations
docker-compose exec backend python manage.py migrate

# 3. Seed initial Dum & Co. biryani catalog and daily handi batches
docker-compose exec backend python manage.py seed_catalog

# 4. Start Next.js frontend
npm install
npm run dev
```

### Option B: Native Manual Setup

```powershell
# 1. Frontend setup
npm install
npm run dev
# Accessible at: http://localhost:3000

# 2. Backend setup (in separate terminal)
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements/local.txt
python manage.py migrate
python manage.py seed_catalog
python manage.py runserver 8000
# Backend API at: http://localhost:8000/api/v1/
# OpenAPI Swagger at: http://localhost:8000/api/docs/
```

---

## 5. Automated Test Suites

The test suite exercises all business-critical invariants:

```powershell
# Run Django backend test suite
pytest backend/tests/
# or
python backend/manage.py test tests

# Run Next.js lint checks
npm run lint

# Run Next.js production build verification
npm run build
```

Test coverage includes:
- `test_catalog.py`: Dietary filters, category taxonomy, and portion variant weights.
- `test_orders.py`: Database transactional rollback, `select_for_update` batch reservation, server-side bill breakdowns, and state machine transition rules.
- `test_coupons.py`: Percentage discounts, max discount caps, and expiry invalidation.
- `test_payments.py`: HMAC-SHA256 signature verification, tampered signature rejection, and webhook deduplication.
- `test_permissions.py`: Multi-tenant customer data isolation and staff-only KDS endpoint protection.
