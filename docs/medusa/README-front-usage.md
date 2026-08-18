# Postman guide for frontend integration (Render DEV)

This guide explains how to validate frontend -> backend API communication against the deployed Render environment.

## Files

- Collection: docs/postman/marketplace-b2b-carrefour.postman_collection.json
- Environment (Render DEV): docs/postman/marketplace-b2b-carrefour-render-dev.postman_environment.json
- Environment (Local DEV): docs/postman/marketplace-b2b-carrefour-local-dev.postman_environment.json
- Smoke checklist: docs/postman/smoke-test-checklist.md
- Front API client reference: apps/storefront/src/lib/client.ts
- Front middleware API usage: apps/storefront/src/middleware.ts

## 1) Import collection

1. Open Postman.
2. Import the collection file:
   - docs/postman/marketplace-b2b-carrefour.postman_collection.json
3. Import the environment file:
   - docs/postman/marketplace-b2b-carrefour-render-dev.postman_environment.json
   - docs/postman/marketplace-b2b-carrefour-local-dev.postman_environment.json
4. In Postman, select environment: `Marketplace B2B Carrefour - Render DEV`.
5. For local backend tests, select environment: `Marketplace B2B Carrefour - Local DEV`.

## 2) Set collection variables

Set these variables before running requests (environment values take precedence):

- baseUrl: https://marketplace-b2b-backend-dev.onrender.com
- publishableApiKey: preloaded in collection with a valid key
- adminEmail: acano@abacus-consulting.net
- adminPassword: set manually in Postman (left blank in collection on purpose)
- jwtToken: leave empty at first
- localAdminEmail: admin@carrefour.dev
- localReplicaPassword: supersecret
- sellerEmail: seller@mercur.dev
- kickzEmail: kickz@mercur.dev
- trailheadEmail: trailhead@mercur.dev

Tip:

- Keep `adminPassword` empty in Git and fill it only in your local Postman environment.

## 3) Run requests in this order

1. GET /health
   - Expected: 200
2. GET /store/regions
   - Expected: 200 with regions payload
   - Requires header x-publishable-api-key
3. GET /store/custom
   - Expected: 200
4. POST /auth/user/emailpass (admin operative)
   - Uses adminEmail/adminPassword and saves token in jwtToken
5. POST /admin/api-keys (optional)
   - Creates a new publishable key for frontend testing
6. GET /admin/custom
   - Requires Authorization: Bearer {{jwtToken}}
   - Expected: 200

## 4) Replicated credentials in Render

These local-equivalent accounts were created in Render via auth register:

- admin@carrefour.dev / supersecret
- seller@mercur.dev / supersecret
- kickz@mercur.dev / supersecret
- trailhead@mercur.dev / supersecret

Important:

- The account with full admin API permissions used in this environment is acano@abacus-consulting.net.
- The replicated local accounts are valid for auth checks and frontend login flows.

## 5) How frontend uses backend API

The storefront communicates with backend over HTTP:

- Base URL comes from MEDUSA_BACKEND_URL.
- Store requests include x-publishable-api-key.
- Middleware fetches /store/regions for locale/region resolution.

Key references:

- apps/storefront/src/lib/client.ts
- apps/storefront/src/middleware.ts

## 6) Front env values to verify

In apps/storefront/.env.local (or env source), check:

- MEDUSA_BACKEND_URL=https://marketplace-b2b-backend-dev.onrender.com
- NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<publishable key>

If these are missing or wrong, frontend requests can fail with 401/403/connection errors.
