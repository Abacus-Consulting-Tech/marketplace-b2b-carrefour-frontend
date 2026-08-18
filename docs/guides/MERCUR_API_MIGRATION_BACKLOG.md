# Mercur API Migration Backlog

## Objective

Define a practical migration backlog from current frontend API usage and mock data to Mercur and Medusa Store APIs, with risk control and go or no-go checkpoints.

This document complements [docs/guides/MERCUR_HYBRID_SETUP_GUIDE.md](docs/guides/MERCUR_HYBRID_SETUP_GUIDE.md).

---

## Current Baseline

Current frontend uses a mix of:

- Real API calls through [src/lib/api/client.ts](src/lib/api/client.ts)
- Mock API fallback in [src/lib/api/mock.ts](src/lib/api/mock.ts)
- Mock-first flows across marketplace, supplier, and admin pages

Key entry points today:

- Auth pages in [src/app/(auth)/login/page.tsx](src/app/%28auth%29/login/page.tsx), [src/app/(auth)/register/page.tsx](src/app/%28auth%29/register/page.tsx), [src/app/(auth)/forgot-password/page.tsx](src/app/%28auth%29/forgot-password/page.tsx)
- Catalog and product detail in [src/app/(marketplace)/marketplace/page.tsx](src/app/%28marketplace%29/marketplace/page.tsx) and [src/app/(marketplace)/marketplace/products/[id]/page.tsx](src/app/%28marketplace%29/marketplace/products/%5Bid%5D/page.tsx)
- Checkout flow in [src/app/(marketplace)/marketplace/checkout/page.tsx](src/app/%28marketplace%29/marketplace/checkout/page.tsx), [src/app/(marketplace)/marketplace/checkout/review/page.tsx](src/app/%28marketplace%29/marketplace/checkout/review/page.tsx), [src/app/(marketplace)/marketplace/checkout/payment/page.tsx](src/app/%28marketplace%29/marketplace/checkout/payment/page.tsx), [src/app/(marketplace)/marketplace/checkout/success/page.tsx](src/app/%28marketplace%29/marketplace/checkout/success/page.tsx)
- Order history in [src/app/(marketplace)/marketplace/orders/page.tsx](src/app/%28marketplace%29/marketplace/orders/page.tsx)

---

## Scope and Ownership

- Mercur Admin Panel owns operator workflows
- Mercur Vendor Panel owns supplier workflows
- Next.js app owns franchisee storefront workflows

In scope for migration in this repository:

- Storefront read and transactional flows for franchisee users
- API adapters and model mapping
- Mock decommission for migrated flows

Out of scope for this repository:

- Rebuilding Mercur Admin Panel
- Rebuilding Mercur Vendor Panel

---

## Effort and Risk Scale

### Effort

- S: 1 to 2 days
- M: 3 to 5 days
- L: 6 to 10 days
- XL: more than 10 days

### Risk

- Low: straightforward contract mapping
- Medium: multiple model translations or session dependencies
- High: payment, checkout, split-order semantics, auth redesign

---

## Migration Matrix

## Phase 0 - Foundation and Adapter Layer

| ID | Work Item | Current Source | Target Source | Frontend Impact | Effort | Risk | Dependencies |
|---|---|---|---|---|---|---|---|
| F0-01 | Create Mercur Store API client | [src/lib/api/client.ts](src/lib/api/client.ts) | Mercur Store API base | New client module and shared error handler | S | Low | Mercur local instance |
| F0-02 | Add DTO mappers for Product, Cart, Order | [src/types/index.ts](src/types/index.ts) | Mercur response models | New mapper layer under src/lib/api | M | Medium | F0-01 |
| F0-03 | Add feature flags for mock vs Mercur per domain | mixed | mixed | Env-based switches by domain | S | Low | F0-01 |
| F0-04 | Add integration test harness for API adapters | none | Mercur local | New tests for adapters and contracts | M | Medium | F0-01, F0-02 |

Go or no-go checkpoint for Phase 0:

- Go if product and cart adapters pass tests against real Mercur responses
- No-go if model mismatches block adapter completion

---

## Phase A - Catalog Read Migration

| ID | Work Item | Current Endpoint or Mock | Candidate Mercur Endpoint | Frontend Files | Effort | Risk |
|---|---|---|---|---|---|---|
| A-01 | Product list migration | mockApi.products.list or GET /products | GET /store/products | [src/app/(marketplace)/marketplace/page.tsx](src/app/%28marketplace%29/marketplace/page.tsx) | M | Medium |
| A-02 | Product detail migration | mockApi.products.getById or GET /products/:id | GET /store/products/:id | [src/app/(marketplace)/marketplace/products/[id]/page.tsx](src/app/%28marketplace%29/marketplace/products/%5Bid%5D/page.tsx) | S | Low |
| A-03 | Category and filter mapping | local category labels | store filters and query params | [src/app/(marketplace)/marketplace/page.tsx](src/app/%28marketplace%29/marketplace/page.tsx) | M | Medium |
| A-04 | Catalog empty and error states | local handling | mapped Mercur errors | [src/app/(marketplace)/marketplace/page.tsx](src/app/%28marketplace%29/marketplace/page.tsx) | S | Low |

Go or no-go checkpoint for Phase A:

- Go if catalog pages work without mock data and no blocking UI regression
- No-go if category or pricing semantics cannot be mapped cleanly

---

## Phase B - Cart and Pricing Migration

| ID | Work Item | Current Endpoint or Mock | Candidate Mercur Endpoint | Frontend Files | Effort | Risk |
|---|---|---|---|---|---|---|
| B-01 | Create or load cart session | local Zustand only | POST and GET /store/carts | [src/lib/store/cart.ts](src/lib/store/cart.ts), [src/app/(marketplace)/marketplace/cart/page.tsx](src/app/%28marketplace%29/marketplace/cart/page.tsx) | L | High |
| B-02 | Add line items | local addItem | POST /store/carts/:id/line-items | [src/app/(marketplace)/marketplace/page.tsx](src/app/%28marketplace%29/marketplace/page.tsx), [src/app/(marketplace)/marketplace/products/[id]/page.tsx](src/app/%28marketplace%29/marketplace/products/%5Bid%5D/page.tsx) | M | Medium |
| B-03 | Update and remove line items | local updateQuantity and removeItem | POST and DELETE line item endpoints | [src/app/(marketplace)/marketplace/cart/page.tsx](src/app/%28marketplace%29/marketplace/cart/page.tsx) | M | Medium |
| B-04 | Price totals and taxes source of truth | local calculations | server totals from cart | [src/lib/store/cart.ts](src/lib/store/cart.ts), [src/app/(marketplace)/marketplace/cart/page.tsx](src/app/%28marketplace%29/marketplace/cart/page.tsx) | M | High |

Go or no-go checkpoint for Phase B:

- Go if cart totals match backend and survive refresh and new session
- No-go if tax or split-cart totals are inconsistent

---

## Phase C - Checkout and Order Creation

| ID | Work Item | Current Endpoint or Mock | Candidate Mercur Endpoint | Frontend Files | Effort | Risk |
|---|---|---|---|---|---|---|
| C-01 | Shipping address to cart | local checkout store | cart address update endpoint | [src/app/(marketplace)/marketplace/checkout/page.tsx](src/app/%28marketplace%29/marketplace/checkout/page.tsx), [src/lib/store/checkout.ts](src/lib/store/checkout.ts) | M | Medium |
| C-02 | Payment method mapping | local enum tarjeta or transferencia | payment session endpoints | [src/app/(marketplace)/marketplace/checkout/review/page.tsx](src/app/%28marketplace%29/marketplace/checkout/review/page.tsx), [src/app/(marketplace)/marketplace/checkout/payment/page.tsx](src/app/%28marketplace%29/marketplace/checkout/payment/page.tsx) | L | High |
| C-03 | Complete cart and create order | mockApi.orders.create | POST /store/carts/:id/complete | [src/app/(marketplace)/marketplace/checkout/success/page.tsx](src/app/%28marketplace%29/marketplace/checkout/success/page.tsx) | L | High |
| C-04 | Order confirmation and cleanup | local clearCart and resetCheckout | backend-confirmed order state | [src/app/(marketplace)/marketplace/checkout/success/page.tsx](src/app/%28marketplace%29/marketplace/checkout/success/page.tsx) | M | Medium |

Go or no-go checkpoint for Phase C:

- Go if one full checkout produces persistent order records and consistent totals
- No-go if payment state and order completion diverge

---

## Phase D - Order History and Detail

| ID | Work Item | Current Endpoint or Mock | Candidate Mercur Endpoint | Frontend Files | Effort | Risk |
|---|---|---|---|---|---|---|
| D-01 | Orders list migration | mockApi.orders.list | customer orders endpoint | [src/app/(marketplace)/marketplace/orders/page.tsx](src/app/%28marketplace%29/marketplace/orders/page.tsx) | M | Medium |
| D-02 | Order detail migration | mockApi.orders.getById | order by id endpoint | [src/app/(marketplace)/marketplace/orders/[id]/page.tsx](src/app/%28marketplace%29/marketplace/orders/%5Bid%5D/page.tsx) | M | Medium |
| D-03 | Status label mapping | local status map | backend status codes | [src/app/(marketplace)/marketplace/orders/page.tsx](src/app/%28marketplace%29/marketplace/orders/page.tsx), [src/app/(marketplace)/marketplace/orders/[id]/page.tsx](src/app/%28marketplace%29/marketplace/orders/%5Bid%5D/page.tsx) | S | Low |

Go or no-go checkpoint for Phase D:

- Go if users can track real orders with stable statuses and dates
- No-go if order ownership or visibility rules are not aligned

---

## Phase E - Auth and Session Alignment

| ID | Work Item | Current Endpoint or Mock | Candidate Mercur Endpoint | Frontend Files | Effort | Risk |
|---|---|---|---|---|---|---|
| E-01 | Login flow alignment | /auth/login and mock login | Mercur store auth strategy | [src/app/(auth)/login/page.tsx](src/app/%28auth%29/login/page.tsx), [src/lib/store/auth.ts](src/lib/store/auth.ts) | XL | High |
| E-02 | Registration alignment | /auth/register and mock register | Mercur customer registration flow | [src/app/(auth)/register/page.tsx](src/app/%28auth%29/register/page.tsx) | L | High |
| E-03 | Forgot password alignment | /auth/forgot-password and mock | Mercur password reset flow | [src/app/(auth)/forgot-password/page.tsx](src/app/%28auth%29/forgot-password/page.tsx) | M | Medium |
| E-04 | Route guard validation | local role guards | session aware guard behavior | [src/components/auth/ProtectedRoute.tsx](src/components/auth/ProtectedRoute.tsx), [src/components/auth/RoleGate.tsx](src/components/auth/RoleGate.tsx) | M | High |

Go or no-go checkpoint for Phase E:

- Go if login, refresh, logout, and protected navigation are stable
- No-go if session model forces large UX regressions

---

## Mock Decommission Tasks

| ID | Task | Completion Rule |
|---|---|---|
| M-01 | Remove product mock reads | No catalog screen imports mock product methods |
| M-02 | Remove cart and checkout mock logic | Checkout runs only against real backend cart and order creation |
| M-03 | Remove order history mock reads | Orders screens use only backend order sources |
| M-04 | Remove auth mock fallback | Auth pages use production-like backend flow |

---

## Cross-Functional Dependencies

- Backend must provide confirmed Mercur endpoint list and auth model
- Backend must define required fields for pricing, tax, shipping, and status mapping
- QA must define smoke criteria per phase
- Product must approve status and payment wording changes if backend semantics differ

---

## Recommended Sequence

1. Phase 0
2. Phase A
3. Phase B
4. Phase C
5. Phase D
6. Phase E
7. Mock decommission

Do not start Phase E before at least one full order flow is stable.

---

## Delivery Cadence Proposal

- Weekly checkpoint with backend and frontend leads
- Demo every completed phase in staging-like environment
- Stop and re-estimate when a phase hits a no-go checkpoint

---

## Final Success Criteria

- Franchisee can browse products, place an order, and track it without mock APIs
- Admin and vendor operations run on Mercur native surfaces
- Frontend code has clear adapter boundaries and no direct contract leakage
- Type-check, lint, and critical smoke tests pass in CI
