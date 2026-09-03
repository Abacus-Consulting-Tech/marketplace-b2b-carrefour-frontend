# API STATUS

**Updated**: 2026-09-03 (from dev-tools)
**Classification**: 🟢 VOLATILE (update every 3-5 endpoints or weekly)
**Source of Truth**: `src/app/(backoffice)/admin/dev-tools/page.tsx` (EndpointInfo array)
**Hierarchy**: See `.github/ai/DOCUMENTATION_HIERARCHY.md` for official data flow
**Backend**: https://marketplace-b2b-backend-dev.onrender.com
**Total Endpoint Inventory**: 146
**Inventory Status**: 77 working, 5 broken, 64 untested
**Status**: ⚠️ HYBRID DEV MODE
  - 🌐 Real en DEV: `auth`, `suppliers`, `pricing`, `orders`, `quotes`
  - 🎭 Mock en DEV: `openings`, `franchisees`, `products`, `catalog`, `checkout`, `categories`
  - ℹ️ `Real API Config` en `dev-tools` significa "apunta al backend", no "validado"

---

## Important: Synchronization Note

⚠️ **This file is the SOURCE for PROJECT_STATE.md**

When statuses change here, PROJECT_STATE.md must be updated to match. Do NOT create contradictions.

Example: If this file says Quotes is ✅ WORKING, PROJECT_STATE.md must say Quotes Backend = ✅ Ready (not ⚠️ Partial).

---

## How to Update This File

**Purpose**: Keep this synced with dev-tools every 3-5 new endpoints

**Source of Truth**: `src/app/(backoffice)/admin/dev-tools/page.tsx` (EndpointInfo array)

**Steps**:
1. Review new endpoints in dev-tools
2. Copy endpoint paths & descriptions from dev-tools
3. Group by module, maintain status indicators (✅/⚠️/🎭)
4. Update endpoint counts in section headers
5. Update "Known Issues" if statuses changed
6. Update date field above (today's date)
7. **After updating**: Also update PROJECT_STATE.md Main Modules table to match

**See also**: `.github/API_DOCUMENTATION_WORKFLOW.md` (full guide)

---

## Validated Or Usable In DEV

### Auth (5 endpoints)
- `POST /auth/login` — Login unificado MVP (working)
- `POST /auth/user/emailpass` — Fallback admin/franchisee (working)
- `POST /auth/member/emailpass` — Fallback supplier/vendor (working)
- `GET /auth/session` — Sesión actual (untested)
- `DELETE /auth/session` — Logout (untested)
- **Status**: ✅ WORKING para el flujo actual de login; sesión/logout pendientes de validación explícita

### Suppliers (3 endpoints)
- `GET /admin/sellers` — Listado de sellers (working)
- `GET /admin/sellers/:id` — Detalle de seller (working)
- `GET /vendor/sellers/me` — Seller actual (working)
- **Status**: ✅ WORKING — Validado en DEV

### Pricing + Excel Import (20 endpoints)
- Cola de aprobaciones, markups, propuestas de producto y 8 endpoints de importación Excel
- `GET /seller/catalog-products` — **BROKEN** en DEV: responde sin los datos esperados para seller catalog
- Fallback temporal en frontend: `/seller/catalog-products` → `/vendor/custom/products` cuando el catálogo seller llega vacío
- **Status**: ⚠️ USABLE — Flujo principal estable con fallback temporal mientras backend alinea seller catalog

### Orders (22 endpoints)
- Incluye superficies de admin, franchisee y supplier/vendor
- `GET /admin/orders` y proxies consumidos por la UI validados
- `GET /admin/orders/stats` — **BROKEN** en el inventario actual
- `/vendor/orders/:id/incidents` — endpoints todavía sin validar
- **Status**: ✅ WORKING para los flujos hoy consumidos por la UI

### Quotes (14 endpoints)
- Lecturas de franchisee por `/store/quotes*` y acciones supplier alineadas
- `POST /store/quotes/:id/award`, `POST /store/quotes/:id/reject`, `POST /store/quotes/:id/sign` permanecen untested
- **Status**: ✅ WORKING para listas, detalle y respuesta supplier; adjudicación/firma siguen pendientes

---

## Kept In Mock In DEV

### Franchisees (17 endpoints)
- `GET /admin/customers` — **BROKEN** (403 RBAC)
- `GET /admin/customers/:id` — **BROKEN** (403 RBAC)
- 8 endpoints adicionales siguen untested
- `GET /store/customers/me` está inventariado pero no revalida el módulo completo
- **Nuevo 2026-09-02 (self-service, propuesto — no construido en backend)**:
  - `POST /admin/franchisees/invitations` — Invitar franquiciado (nombre + email)
  - `POST /franchisee/register` — Autoregistro público (crea `status: pending_approval`, incluye pago Stripe y espera devolver `subscription_status`/`current_period_end`)
  - `POST /webhooks/stripe` — Webhook backend para altas, renovaciones y fallos de suscripción
  - `GET /franchisee/:id/invoices` — Lectura de facturas del franquiciado para el perfil
  - `GET /franchisee/stores`, `POST /franchisee/stores`, `DELETE /franchisee/stores/:id` — Gestión de tiendas del franquiciado (mock, persistido en localStorage, sin endpoint real)
  - `PATCH /admin/franchisees/:id/status` ya inventariado (ver módulo `franchisee-management` más abajo) ahora también usado por la UI de aprobación y debe bloquear activación sin `subscription_status=active`
- **Status**: ⚠️ PARTIAL EN BACKEND, MOCK EN DEV — self-service, facturas y stores siguen mock; contrato backend todavía por cerrar (ver `docs/modules/12-franchisee-management/FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md`)

### Openings (24 endpoints)
- `GET /admin/openings/projects` — **BROKEN** (404 en DEV)
- 7 superficies relacionadas siguen untested
- El resto del inventario se mantiene documentado, pero la UI sigue en mock para no romper el módulo
- **Status**: 🎭 MOCK EN DEV

### Products + Catalog (10 endpoints)
- Admin products mantiene 8 endpoints inventariados como working
- `GET /store/products` — **BROKEN** en la práctica de DEV por catálogo vacío/no utilizable
- Aunque algunas rutas reales responden, la UI de catálogo/producto se mantiene en mock hasta que haya datos válidos
- **Status**: 🎭 MOCK EN DEV

### Cart + Checkout + Store (24 endpoints)
- `store`: 1 endpoint (`/store/regions`) todavía untested
- `cart`: 6 endpoints untested
- `checkout`: 17 endpoints untested, incluyendo `POST /store/checkout/payment-intent` y `POST /store/checkout/complete`
- Los dos endpoints custom de checkout ya están documentados, pero `payment-intent` sigue devolviendo `client_secret` simulado y `complete` deja el pedido en `pending_payment` hasta webhook Stripe
- El checkout real sigue bloqueado porque Store API no devuelve catálogo utilizable de forma consistente y `GET /store/products` entrega `variant_id` que no siempre sirve para el carrito real
- **Status**: 🎭 MOCK EN DEV

### Categories
- No hay inventario activo separado en `dev-tools`; hoy dependen de las superficies de products/catalog
- **Status**: 🎭 MOCK EN DEV

---

## Workflow Status

✅ **Flujos estables en DEV (validados 2026-08-31)**:
1. Login real para admin, franchisee y supplier con fallback por rol
2. Supplier products usable con fallback temporal al catálogo vendor legacy
3. Marketplace quotes con lecturas reales por `/store/quotes`
4. Admin orders cargando contra backend con respuestas `200`
5. Source of truth `admin/dev-tools` aclarada para distinguir configuración real vs estado validado

---

## Known Issues

- `/admin/customers` y `/admin/customers/:id` (GET) — `403 Forbidden` por RBAC; `franchisees` sigue en mock en DEV
- `/admin/openings/projects` — `404` en DEV; `openings` sigue en mock
- `/seller/catalog-products` — Mismatch con backend: el seller catalog llega vacío mientras `/vendor/custom/products` sí devuelve datos
- `/store/products` — Responde sin catálogo utilizable en DEV; `catalog` y `products` siguen en mock para la UI franchisee
- Checkout real bloqueado por dos gaps: `GET /store/products` devuelve `variant_id` no siempre válido para `/store/carts*`, y `POST /store/checkout/payment-intent` todavía responde con `client_secret` simulado en lugar de un PaymentIntent Stripe real
- `/admin/orders/stats` — marcado como broken en el inventario actual
- `/admin/franchisees/invitations`, `/franchisee/register`, `/webhooks/stripe`, `/franchisee/:id/invoices`, `/franchisee/stores*` — superficies de onboarding/autoservicio inventariadas desde frontend; **no existen en backend** o siguen sin contrato cerrado

---

## Readiness Summary

### ✅ Stable For Current DEV UI
- `auth`
- `suppliers`
- `pricing` with temporary seller-catalog fallback
- `orders`
- `quotes`

### ⚠️ Backend Partially Working But Kept Mock In DEV
- `franchisees`

### 🎭 Still Mock In DEV
- `openings`
- `products`
- `catalog`
- `checkout`
- `categories`

---

## For Agents & Developers

**DO NOT assume** this API is fully production-ready. Always check:
1. Module status in "Real API - Partially Ready" section above
2. Known Issues list for your module
3. Feature flags to confirm mock vs. real API

If you see a module marked ✅ but endpoints return unexpected errors, consult Known Issues and the current DEV hybrid recommendation first.