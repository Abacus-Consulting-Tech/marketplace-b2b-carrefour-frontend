# PROJECT STATE

**Updated**: 2026-09-03
**Classification**: 🟡 SEMI-STABLE (update weekly or on module status change, NOT per endpoint)
**Syncs FROM**: `API_STATUS.md` (every Friday 4 PM)
**Hierarchy**: See `.github/ai/DOCUMENTATION_HIERARCHY.md` for official data flow

---

## How to Update This File

**Purpose**: High-level module and project status for AI agents and strategic planning

**Update Frequency**: Weekly (Friday 4 PM) or when module transitions between Mock → Partial → Ready

**Do NOT update** just because an endpoint was added. That's handled in API_STATUS.md.

**See also**: `.github/DOCUMENTATION_CLASSIFICATION.md` (explains why this file is SEMI-STABLE)

**Source of Truth**: `.github/ai/API_STATUS.md` (which syncs from dev-tools)

**Update Frequency**: Weekly or on sprint boundaries (less often than API_STATUS.md)

**Steps**:
1. Review latest API_STATUS.md
2. Update Main Modules table (Backend column)
3. Update Current Priorities based on blockers
4. Update Known Issues if new RBAC/type issues found
5. Update "Uncertain / To Verify" if clarifications occur
6. Update date field above (today's date)

**Related Files**:
- `.github/ai/API_STATUS.md` — Endpoint-level status (update first)
- `.github/API_DOCUMENTATION_WORKFLOW.md` — Full maintenance guide
- `src/app/.../dev-tools/page.tsx` — Source of truth for all endpoints

## Stack

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript (strict mode)
- react-hook-form, Zod, shadcn/ui
- Zustand (state management)
- Stripe integration

**Backend:**
- Medusa + MercurJS

**Testing & Quality:**
- Vitest, Playwright, ESLint

---

## Actors

Three user roles in separate app sections:

- **Admin** (`(backoffice)` → `/admin/`) — Catalog management, order oversight, product approvals
- **Franchisee** (`(marketplace)` → `/marketplace/`) — Product browsing, orders, quotations
- **Supplier** (`(supplier)` → `/supplier/`) — Product management, quotations, fulfillment

---

## Main Modules

| Module | Purpose | Frontend | Backend |
|--------|---------|----------|---------|
| **Auth** | Login, sessions | ✅ | ✅ Ready |
| **Pricing** | Product approval, markup | ✅ | ✅ Ready |
| **Suppliers** | Vendor management + onboarding review | ✅ | ✅ Ready |
| **Products** | Catalog CRUD, variants | ✅ | 🟡 Mock |
| **Catalog** | Marketplace browsing for franchisees | ✅ | 🟡 Mock |
| **Openings** | Store projects, documents | ✅ | 🟡 Mock |
| **Orders** | Multi-role views, fulfillment | ✅ | ✅ Ready |
| **Quotes** | Quotations, signatures | ✅ | ✅ Ready |
| **Franchisees** | Franchisee management | ✅ | ⚠️ Partial |
| **Categories** | Product categories | ✅ | 🟡 Mock |
| **Checkout** | Payment, cart | ✅ | 🟡 Mock |
| **Excel Import** | Bulk upload | ✅ | ✅ Ready |

---

## Architecture

- **Frontend**: Next.js App Router with four role-based layouts (`(auth)`, `(backoffice)`, `(marketplace)`, `(supplier)`)
- **API Layer**: Dual-mode clients (each module has `-client.ts` for mock/real switching and `-mock.ts` for fallback data)
- **Feature Flags**: `src/config/feature-flags.ts` controls which modules use mock vs. real APIs
- **State**: Zustand for cart, auth, UI
- **Integrations**: Medusa (auth, products, orders), Stripe (payments), Excel import (bulk uploads)

---

## Main Business Workflows

1. **Quotations**: Admin creates opening → invites suppliers → supplier creates quotation → franchisee reviews & selects → digital signature → admin validation
2. **Product Catalog**: Supplier uploads products → pending approval → admin reviews markup → approved products visible in catalog
3. **Orders**: Franchisee selects products → review grouped by supplier → Stripe payment → backend webhook confirms order → supplier fulfillment → tracking updates → order complete

---

## Current API Status

See `API_STATUS.md` for detailed endpoint list. Summary:
- **Stable for current DEV UI**: `auth`, `suppliers`, `pricing` (con fallback temporal en seller catalog), `orders`, `quotes`
- **Hybrid in DEV**: `franchisees` (admin CRUD ya migrado a `/admin/franchisees*`; faltan validaciones finales y contrato admin de tiendas), `catalog` (rutas reales sin datos consistentes para cerrar el flujo)
- **Mock in DEV**: `openings` (`/openings/projects` devuelve `404`), `checkout`, `categories`
- **Real in DEV**: `products`
- **Source inventory snapshot**: 143 endpoints total, 80 `working`, 4 `broken`, 59 `untested`

---

## Current Priorities

**Near-term:**
- Backend alignment for `seller/catalog-products` so the supplier fallback can be removed
- Validación completa de `/admin/franchisees*` y cierre del contrato admin de tiendas para franquiciados
- Backend availability for `/openings/projects` and related openings flows
- Store catalog data quality to unlock real cart/checkout validation end-to-end
- Definir contrato específico de estado post-pago para el checkout tras webhook Stripe

**Blocking issues (6 decisions needed):**
- Stripe Billing (annual subscriptions)
- Stripe Connect (vendor account verification)
- Odoo connector (invoicing/accounting)
- Settlement engine (payouts to vendors)
- Refund workflow
- Audit logging (immutable trail)

---

## Known Issues

- **Franchisees Module (⚠️ PARTIAL)**: backend validó `/admin/franchisees*` como contrato canónico y frontend ya migró CRUD admin, stats e integración de `Mis tiendas` fuera de `localStorage`
  - Impact: el contrato principal quedó alineado, pero siguen pendientes la validación documental completa de detail/update/delete/status y la ruta admin para editar tiendas o direcciones
  - Workaround: `franchisees.useMock` queda como override opcional, no como camino por defecto; billing sigue gobernado por `NEXT_PUBLIC_FRANCHISEE_BILLING_ENABLED` hasta exponer una lectura pública segura de la política
  - Remaining questions documented in `docs/modules/12-franchisee-management/FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md` (facturas Odoo, activación de credenciales, ruta admin de tiendas, handoff Odoo/Stripe)

- **Supplier Catalog Mismatch**: `/seller/catalog-products` no devuelve datos utilizables en DEV
  - Impact: `/supplier/products` necesita fallback temporal a `/vendor/custom/products`
  - Workaround: Mantener el fallback frontend hasta alinear el backend

- **Supplier Onboarding / Admin Directory (new 2026-09-03, hybrid)**: alta pública de proveedor, invitación admin, aprobación/rechazo desde cola y directorio admin con acciones Ver/Editar/Eliminar ya existen en frontend
  - Impact: `POST /admin/suppliers/invitations`, `POST /supplier/register` y `PATCH /admin/suppliers/:id/status` siguen mock; `PATCH/DELETE /admin/sellers/:id` se consumen desde UI pero no están revalidados en DEV
  - Workaround: flujo completo funcional en mock/localStorage; mantener `/admin/sellers*` como superficie canónica para lecturas y CRUD administrativo hasta cerrar contrato backend definitivo

- **Openings Module (🟡 Mock)**: `/openings/projects` responde 404 en DEV
  - Impact: UI de openings sigue en mock para no romper navegación y detalle
  
- **Checkout Addresses**: `POST /store/customers/me/addresses` devuelve `401 Unauthorized` en DEV
  - Impact: el checkout solo puede reutilizar `shipping_addresses` existentes; el alta de nuevas direcciones no está disponible dentro del flujo Store API actual
  - Workaround: `Mis tiendas` ya opera sobre `/franchisee/stores`; queda pendiente que backend abra o corrija la superficie Store para direcciones de checkout
  
- **Checkout / Store Catalog**: Store API no devuelve hoy catálogo utilizable para validar carrito y checkout real
  - Impact: `GET /store/products` devuelve `variant_id` no siempre válido para `/store/carts*`, el checkout real sigue sin cerrarse end-to-end en DEV y aún falta un contrato dedicado para consultar el estado final tras webhook Stripe
  - Workaround: Mantener checkout mock en DEV; la UI ya está preparada para Stripe-only con `payment-collections`, agrupación por proveedor y success page de confirmación asíncrona

- **Stripe**: JS integrated but PaymentIntents flow not fully tested

- **Type Contracts**: Backend responses may not match frontend interfaces; verify after switching from mock to real per module

- **Excel Import**: Edge case error handling needs verification

- **Document Downloads**: Real backend URL generation not yet verified

---

## Key Files to Check First

- `src/config/feature-flags.ts` — Module status and mock/real switching
- `.github/ai/API_STATUS.md` — Endpoint implementation status
- `docs/PROJECT_STATUS_AND_ROADMAP.md` — Detailed project progress and blockers
- `src/app/` — Role-based layouts
- `src/lib/api/` — API clients (mock/real pattern)
- `src/types/` — TypeScript interfaces

---

## Uncertain / To Verify

- Exact Medusa version and deployment environment
- Stripe PaymentIntents flow details
- Document storage backend (S3 vs. local file service)
- Odoo integration specifications
- Settlement engine business rules
- MFA implementation approach
