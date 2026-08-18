# Mercur + Next.js Hybrid Setup Guide

## Purpose

This guide explains how to implement the recommended hybrid architecture:

1. Use Mercur for Admin and Vendor surfaces.
2. Keep the existing Next.js app for franchisee/customer storefront experience.
3. Connect Next.js to Mercur Store APIs progressively.

This approach minimizes migration risk and preserves your current frontend investment.

---

## Target Architecture

- Mercur project (separate folder/repo)
  - Marketplace engine on Medusa modules
  - Admin Panel at `/dashboard`
  - Vendor Panel at `/seller`
  - Store API at `/store/*`
- Existing Next.js project (this repository)
  - Franchisee/customer UI
  - Product discovery, cart, checkout, profile, etc.
  - API integration layer updated to consume Mercur endpoints

---

## Step 0 - Preconditions

Ensure these tools are installed:

- Node.js 20+
- Bun 1.3+
- Docker (recommended)
- Git

Validation commands:

```bash
node -v
bun -v
docker -v
git --version
```

---

## Step 1 - Create Local Infrastructure (Postgres + Redis)

Start required services for Mercur locally:

```bash
docker run -d --name mercur-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mercur \
  -p 5432:5432 postgres:16

docker run -d --name mercur-redis -p 6379:6379 redis:7
```

Verify both are running:

```bash
docker ps --filter name=mercur-
```

---

## Step 2 - Bootstrap Mercur in a Separate Folder

From the parent directory of your current frontend repository:

```bash
cd ..
bun create mercur-app@latest carrefour-mercur
cd carrefour-mercur
```

Choose the basic template for the first setup unless you already need plugin authoring.

---

## Step 3 - Configure Mercur Environment

In the Mercur project, configure environment variables according to the generated `.env` template.

Typical values (adapt to your template variable names):

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/mercur
REDIS_URL=redis://localhost:6379
```

Run migrations/seeds if requested by template docs, then start Mercur:

```bash
bun dev
```

Expected local surfaces:

- API: http://localhost:9000
- Admin Panel: http://localhost:9000/dashboard
- Vendor Panel: http://localhost:9000/seller

---

## Step 4 - Access Admin and Vendor Surfaces

1. Open the admin invite URL shown by Mercur startup logs (usually under `/dashboard/invite`).
2. Set admin password.
3. Sign in to Admin Panel.
4. Test seeded vendor users in Vendor Panel if present.

Minimum validation checklist:

- Admin can view marketplace configuration.
- Vendor can sign in and navigate seller dashboard.
- Products/offers are visible in Mercur data model.

---

## Step 5 - Keep This Next.js Storefront Running

Keep your existing frontend unchanged initially.

In this repository:

```bash
npm install
npm run dev
```

Your Next.js app remains the UI for franchisee/customer workflows while Mercur powers platform logic.

---

## Step 6 - Add Mercur API Config to Next.js

Create or update `.env.local` in this repository:

```env
# Existing vars...
NEXT_PUBLIC_API_URL=http://localhost:9000
NEXT_PUBLIC_MERCUR_STORE_API=http://localhost:9000/store
NEXT_PUBLIC_MOCK_AUTH=false
```

Notes:

- Keep `NEXT_PUBLIC_API_URL` aligned with your API client migration strategy.
- Disable mock mode when starting integration tests against Mercur.

---

## Step 7 - Introduce a Dedicated Mercur Store API Client

Recommended pattern:

1. Keep current client for backward compatibility.
2. Add a new Mercur-specific client module.
3. Migrate feature screens incrementally.

Suggested new file:

- `src/lib/api/mercur-store-client.ts`

Example skeleton:

```ts
import axios from "axios";

export const mercurStoreClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MERCUR_STORE_API || "http://localhost:9000/store",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

---

## Step 8 - Migrate Frontend Features in Safe Order

Migrate by domain, not all at once.

### Phase A - Read-only catalog

- Product list
- Product detail
- Categories/filters

Goal: Replace mock product reads first.

### Phase B - Cart + pricing

- Cart create/retrieve
- Add/remove line items
- Totals validation

Goal: Validate split-cart behavior and multi-vendor totals.

### Phase C - Checkout and orders

- Address/shipping flow
- Payment handoff model
- Order creation and order history

Goal: End-to-end order flow through Mercur API.

### Phase D - Account and operational hardening

- Session lifecycle and logout
- Error mapping and fallback UX
- Observability and audit events

---

## Step 9 - Role and Surface Boundaries

Define clear ownership to avoid duplicate UI work:

- Mercur Admin Panel: operator users only
- Mercur Vendor Panel: supplier users only
- Next.js storefront: franchisee/customer users only

If needed, add direct links from Next.js to Mercur admin/vendor URLs for authorized internal users.

---

## Step 10 - Mock Decommission Plan

As each feature migrates, remove mock dependencies in this order:

1. Auth mock fallback
2. Product mock endpoints
3. Order mock endpoints
4. Supplier/admin mock-only logic

Exit criteria for each removal:

- Feature works against Mercur in local and staging.
- Type-check and lint pass.
- Regression test or smoke test exists.

---

## Step 11 - Testing Strategy

Minimum test gates per migration phase:

- Unit tests for data mapping/adapters
- Integration tests for API client methods
- E2E smoke tests:
  - Browse products
  - Add to cart
  - Checkout
  - View orders

Suggested commands in this repository:

```bash
npm run type-check
npm run lint
npm run test
```

---

## Step 12 - Deployment Topology (Recommended)

- Mercur backend deployed as its own service
- Next.js storefront deployed separately
- Environment-specific API base URLs configured per environment

Typical environments:

- Local: Mercur `:9000` + Next.js `:3000`
- Staging: separate Mercur and Next domains
- Production: separate Mercur and Next domains behind managed DNS/TLS

---

## Troubleshooting

### Mercur does not start

- Check Postgres and Redis containers are running.
- Verify Mercur env variables and port availability.

### Next.js still uses mock data

- Ensure `NEXT_PUBLIC_MOCK_AUTH=false`.
- Confirm screens call Mercur client, not mock imports.

### CORS/auth issues

- Validate Mercur CORS/session settings for your Next.js origin.
- Confirm token/cookie strategy is consistent between clients.

---

## Rollback Strategy

If an integration phase fails:

1. Keep Mercur running and data intact.
2. Re-enable old endpoint path only for affected feature.
3. Use feature flag to switch between legacy and Mercur client.
4. Fix mapping gaps and retry phase.

---

## Final Acceptance Checklist

- Mercur Admin and Vendor surfaces running and accessible.
- Next.js storefront connected to Mercur Store API for target phases.
- No critical flows depend on mock APIs.
- Type-check, lint, and baseline tests pass.
- Team has documented environment variables and runbook.

---

## Suggested Next Document

After finishing this setup, create an endpoint mapping matrix:

- Current frontend endpoint/use case
- Mercur endpoint equivalent
- Request/response mapping
- UI impact
- Test cases

This matrix is the most effective way to de-risk the full migration.