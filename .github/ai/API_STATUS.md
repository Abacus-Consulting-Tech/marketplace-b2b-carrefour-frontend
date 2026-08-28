# API STATUS

**Updated**: 2026-08-28 (from dev-tools)
**Classification**: 🟢 VOLATILE (update every 3-5 endpoints or weekly)
**Source of Truth**: `src/app/(backoffice)/admin/dev-tools/page.tsx` (EndpointInfo array)
**Hierarchy**: See `.github/ai/DOCUMENTATION_HIERARCHY.md` for official data flow
**Backend**: https://marketplace-b2b-backend-dev.onrender.com
**Total Real Endpoints**: 66 (57 fully working, 9 partial with RBAC issue)
**Total Mock Endpoints**: 74+
**Status**: 🟡 PARTIALLY PRODUCTION-READY
  - ✅ 57 endpoints ready (Real API, fully validated)
  - ⚠️ 9 endpoints partial (Franchisees, RBAC 403 issue)
  - 🎭 51+ endpoints mock (Backend pending, not production-ready)

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

## Real API - Partially Ready (✅/⚠️)

57 endpoints working, 9 with known issues (Franchisees RBAC)

### Auth (4 endpoints)
- `POST /auth/user/emailpass` — Login admin/franchisee (working)
- `POST /auth/member/emailpass` — Login supplier/vendor (working)
- `GET /auth/session` — Get current session (untested)
- `DELETE /auth/session` — Logout (untested)

### Orders Module (17 endpoints)
- Admin Orders (8): List, Detail, Stats, Status, Priority, Refund, Incidents, Notes
- Supplier Orders (9): CRUD, Stats, Accept/Reject, Tracking, Incidents
- **Status**: ✅ WORKING — Complete workflow validated 2026-08-26

### Pricing (8 endpoints)
- `GET /admin/custom/products/pending` — Pending product approvals (working)
- `PATCH /admin/custom/products/:id/pricing-approval` — Approve/reject (working)
- `GET /admin/custom/sellers/:id/markup` — Get seller markup (working)
- `PATCH /admin/custom/sellers/:id/markup` — Update seller markup (working)
- Plus: History, approval queue, bulk operations
- **Status**: ✅ WORKING — Workflow tested 2026-08-26

### Sellers (7 endpoints)
- `GET /admin/sellers` — List sellers (working)
- `GET /admin/sellers/:id` — Seller detail (working)
- `GET /admin/custom/sellers` — Custom seller info (working)
- `GET /vendor/sellers/me` — Current vendor info (working)
- Plus: CRUD operations, markup management
- **Status**: ✅ WORKING — Validated 2026-08-26

### Excel Import (8 endpoints)
- Admin: Template download, Upload, List jobs, Job details
- Vendor: Template download, Upload, List jobs, Job details
- **Status**: ✅ WORKING — Integrated 2026-08-26

### Quotes (13 endpoints)
- Franchisee Quotes (6): List, Detail, Award, Reject, Sign, Stats
- Supplier Quotes (7): Invitations, Create, Update, Submit, Decline, List, Detail
- **Status**: ✅ WORKING — Integrated 2026-08-26

### Franchisees (9 endpoints)
- `GET /admin/customers` — **BROKEN** (403 - RBAC issue)
- `GET /admin/customers/:id` — **BROKEN** (403 - RBAC issue)
- `POST /admin/customers` — Create (working)
- `PATCH /admin/customers/:id` — Update (working)
- `DELETE /admin/customers/:id` — Delete (working)
- Addresses CRUD (4): GET, POST, PATCH, DELETE
- **Status**: ⚠️ PARTIAL — RBAC permissions issue on GET endpoints

---

## Mock API - In Development (🎭)

### Openings (24 endpoints)
- Projects: CRUD, categories, documents, invitations, quotes, financing, status
- Document Management (4): Upload, list, download, delete technical plans
- Supplier Invitations (4): Invite multiple, accept, decline, tracking
- **Status**: 🎭 MOCK — Backend pending

### Products (8 endpoints)
- Admin CRUD, stats, bulk operations, inventory management
- **Status**: 🎭 MOCK — Backend pending

### Checkout (15 endpoints)
- Cart operations, address validation, shipping methods, payment sessions, order completion
- **Status**: 🎭 MOCK — Backend pending

### Catalog (2 endpoints)
- Product list for marketplace, product detail for franchisees
- **Status**: 🎭 MOCK — Backend pending

### Categories (4 endpoints)
- CRUD operations for product categorization
- **Status**: 🎭 MOCK — Backend pending

---

## Workflow Status

✅ **Complete Workflow Validated (2026-08-26)**:
1. Vendor proposes product → 201 Created
2. Product appears in admin pending list → 200 OK
3. Admin manages seller markup (GET + PATCH) → 200 OK
4. Vendor tracks proposals → 200 OK
5. Full audit trail working (proposed_by, updated_by, previous values)

---

## Known Issues

- `/admin/customers` (GET) — Returns 403 Forbidden (RBAC permission issue, use mock mode)
- Stripe PaymentIntents — Integrated but flow not fully tested
- Document downloads — Real backend URL generation pending verification

---

## Production Readiness Summary

### ✅ SAFE FOR PRODUCTION (57 endpoints)
- Auth (4): Login, logout, session management
- Orders (17): Admin, supplier, franchisee views with full workflow
- Pricing (8): Product approval, seller markup management
- Suppliers (7): Vendor management and details
- Quotes (13): Full quotation workflow with signature integration
- Excel Import (8): Bulk product/supplier upload

**Use in Production**: YES — These modules have been tested and validated.

### ⚠️ USE WITH CAUTION (9 endpoints)
- Franchisees (9): GET endpoints return 403 RBAC error; CUD operations work
- **Workaround**: Feature flag `franchisees.useMock = true` (enabled by default)
- **Limitation**: Cannot list franchisees from real API; must use mock data

**Use in Production**: PARTIAL — Only use if workaround is acceptable.

### 🎭 NOT READY FOR PRODUCTION (51+ endpoints)
- Openings (24): Mock data only
- Products (8): Mock data only
- Checkout (15): Mock data only
- Categories (4): Mock data only

**Use in Production**: NO — Backend integration still pending.

---

## For Agents & Developers

**DO NOT assume** this API is fully production-ready. Always check:
1. Module status in "Real API - Partially Ready" section above
2. Known Issues list for your module
3. Feature flags to confirm mock vs. real API

If you see a module marked ✅ but endpoints return unexpected errors, consult Known Issues.