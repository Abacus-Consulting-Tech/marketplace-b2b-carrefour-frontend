# Smoke test checklist (Backend + Front)

Run this checklist after each deploy or significant backend change.

## Environment setup

1. Select Postman environment:
   - `Marketplace B2B Carrefour - Render DEV` or
   - `Marketplace B2B Carrefour - Local DEV`
2. Ensure `publishableApiKey` is set.
3. Ensure `adminPassword` is set for the active admin account.

## API health and store paths

1. `GET /health`
   - Expected: `200`
2. `GET /store/regions`
   - Expected: `200`
   - Header required: `x-publishable-api-key`
3. `GET /store/custom`
   - Expected: `200`

## Auth and admin paths

1. `POST /auth/user/emailpass (admin operative)`
   - Expected: `200`
   - Stores `jwtToken`
2. `GET /admin/custom`
   - Expected: `200`
   - Header required: `Authorization: Bearer {{jwtToken}}`
3. Optional: `POST /admin/api-keys`
   - Expected: `200`
   - Verify returned `api_key.token` starts with `pk_`

## Frontend integration checks

1. Verify frontend env values:
   - `MEDUSA_BACKEND_URL`
   - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
2. Load storefront home and one product/listing page.
3. Confirm there are no `401/403` API errors in browser network panel.

## Fast terminal probe (Render)

```bash
BASE="https://marketplace-b2b-backend-dev.onrender.com"
PK="<publishable_key>"

curl -i "$BASE/health"
curl -i "$BASE/store/regions" -H "x-publishable-api-key: $PK"
curl -i "$BASE/store/custom" -H "x-publishable-api-key: $PK"
```
