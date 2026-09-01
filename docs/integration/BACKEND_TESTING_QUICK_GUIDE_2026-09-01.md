# Quick Testing Guide - Backend Improvements (2026-09-01)

## What's Fixed

✅ **CORS Configuration** - Vercel deployments now work with backend  
✅ **Seller Catalog Endpoints** - `/seller/catalog-products` returns data correctly  
✅ **Frontend Fallback Removed** - No longer using legacy `/vendor/custom/products`

---

## Test 1: Verify Vercel Deployment with Real API

### Access Vercel Deployment

```
https://marketplace-b2b-carrefour-frontend-mvvfvx7co.vercel.app/
```

### Check Environment Variables

1. Visit: `https://marketplace-b2b-carrefour-frontend-mvvfvx7co.vercel.app/env-check`
2. Verify:
   - ✅ `API_URL`: contains `render.com`
   - ✅ `MOCK_AUTH`: `false`
   - ✅ All `MOCK_*` variables: `false`
   - ✅ `CATALOG_SOURCE`: `mercur`

### Test Login (Real Backend)

1. Go to: `https://marketplace-b2b-carrefour-frontend-mvvfvx7co.vercel.app/login`
2. Try **real backend credentials** (should work now with CORS fixed):

**Admin:**
```
Email: admin@carrefour.dev
Password: supersecret
```

**Supplier:**
```
Email: seller@mercur.dev
Password: supersecret
```

**Franchisee:**
```
Email: franchisee@carrefour.dev
Password: supersecret
```

3. ✅ Login should succeed (no CORS errors)
4. ✅ Redirects to appropriate dashboard

---

## Test 2: Verify Seller Catalog Fix

### Prerequisites

Login as supplier: `seller@mercur.dev` / `supersecret`

### Frontend Test (Vercel or Local)

**Via Vercel:**
1. Login as supplier
2. Navigate to: `/supplier/products`
3. ✅ Products should load (using `/seller/catalog-products` endpoint)
4. ✅ Should see at least 1 product: `prod_01M0ZGJ2P2CYZ1040PF1J3A82G`

**Via Local:**
```bash
npm run dev
# Visit: http://localhost:3000/supplier/products
```

### Backend API Test (Direct)

**Step 1: Get Token**

```bash
curl -X POST "https://marketplace-b2b-backend-dev.onrender.com/auth/member/emailpass" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seller@mercur.dev",
    "password": "supersecret"
  }'
```

Save the `token` from response.

**Step 2: Test Seller Catalog (Fixed Endpoint)**

```bash
curl "https://marketplace-b2b-backend-dev.onrender.com/seller/catalog-products?limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD"
```

**Expected Result:**
```json
{
  "count": 1,
  "products": [
    {
      "id": "prod_01M0ZGJ2P2CYZ1040PF1J3A82G",
      "title": "Producto Test",
      "status": "proposed",
      "pricing_status": "pending_approval"
    }
  ]
}
```

✅ **PASS**: Returns `count: 1` (previously returned `count: 0`)

**Step 3: Test Product Detail**

```bash
curl "https://marketplace-b2b-backend-dev.onrender.com/seller/catalog-products/prod_01M0ZGJ2P2CYZ1040PF1J3A82G" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD"
```

✅ **PASS**: Returns product details

**Step 4: Test Stock Update**

```bash
curl -X PATCH "https://marketplace-b2b-backend-dev.onrender.com/seller/catalog-products/prod_01M0ZGJ2P2CYZ1040PF1J3A82G/stock" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD" \
  -H "Content-Type: application/json" \
  -d '{"stock": 100}'
```

✅ **PASS**: Updates stock successfully

**Step 5: Test Ownership Protection**

```bash
# Try with wrong seller_id
curl "https://marketplace-b2b-backend-dev.onrender.com/seller/catalog-products/prod_01M0ZGJ2P2CYZ1040PF1J3A82G" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "x-seller-id: sel_WRONG_SELLER_ID"
```

✅ **PASS**: Returns `404` (correctly blocked)

---

## Test 3: Verify CORS Headers

```bash
curl -I "https://marketplace-b2b-backend-dev.onrender.com/auth/login" \
  -H "Origin: https://marketplace-b2b-carrefour-frontend-mvvfvx7co.vercel.app"
```

**Expected Headers:**
```
Access-Control-Allow-Origin: https://marketplace-b2b-carrefour-frontend-mvvfvx7co.vercel.app
Access-Control-Allow-Credentials: true
```

✅ **PASS**: CORS headers present

---

## Test 4: Verify Other Real API Modules

### Admin Orders
1. Login as admin: `admin@carrefour.dev` / `supersecret`
2. Visit: `/admin/orders`
3. ✅ Orders should load from real backend

### Supplier Orders
1. Login as supplier: `seller@mercur.dev` / `supersecret`
2. Visit: `/supplier/orders`
3. ✅ Orders should load from real backend

### Quotes
1. Login as supplier or franchisee
2. Visit respective quotes section
3. ✅ Quotes should load from real backend

---

## Quick Checklist

### Vercel Deployment
- [ ] `/env-check` shows correct environment variables
- [ ] Login works with real credentials (no CORS errors)
- [ ] Mock credentials (`admin@test.com`) do NOT work
- [ ] Real credentials work correctly

### Seller Catalog Fix
- [ ] `GET /seller/catalog-products` returns products (count > 0)
- [ ] Product detail loads correctly
- [ ] Stock update works
- [ ] Ownership protection works (404 for wrong seller)

### CORS
- [ ] No CORS errors in browser console
- [ ] CORS headers present in API responses
- [ ] Both localhost and Vercel domains allowed

### Real API Modules (should all work)
- [ ] Auth (login/logout)
- [ ] Admin orders
- [ ] Supplier orders
- [ ] Supplier products (seller catalog)
- [ ] Quotes
- [ ] Sellers/Suppliers management
- [ ] Pricing approval workflow

---

## Known Limitations (Still Mock)

These modules remain in mock mode:
- ⚠️ Franchisees (backend returns 403)
- ⚠️ Openings (backend returns 404)
- ⚠️ Products/Catalog (empty in backend)
- ⚠️ Checkout (depends on catalog)
- ⚠️ Categories

---

## Troubleshooting

### Issue: Still seeing mock data

**Solution:** Clear browser cache or do hard refresh:
- Chrome/Edge: `Cmd+Shift+R` (Mac) / `Ctrl+F5` (Windows)
- Or open in incognito/private window

### Issue: Login fails with CORS error

**Check:**
1. Verify Vercel URL is in backend CORS whitelist
2. Check `/env-check` shows correct `API_URL`
3. Try redeploying Vercel (without cache)

### Issue: Seller catalog still empty

**Verify:**
1. Using correct `x-seller-id` header
2. Token is from `/auth/member/emailpass` (not `/auth/login`)
3. Backend is deployed (check Render dashboard)

---

## Expected Timeline

1. **Immediate**: Local development works (`npm run dev`)
2. **1-2 minutes**: Vercel auto-deploys after git push
3. **Test**: Visit Vercel URL and verify fixes

---

## Support

**Backend Team Contact:** For additional CORS domains or seller IDs  
**Frontend Repository:** `dev` and `main` branches synchronized  
**Backend Environment:** Render DEV (`marketplace-b2b-backend-dev.onrender.com`)
