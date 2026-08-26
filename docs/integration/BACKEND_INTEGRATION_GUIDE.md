# Backend Integration Guide - Render DEV

**Status**: ✅ Infrastructure Complete - Ready for Testing  
**Date**: 2026-08-26  
**Backend**: https://marketplace-b2b-backend-dev.onrender.com

---

## 📋 What's Been Integrated

### ✅ Completed

1. **Authentication System**
   - JWT-based auth for admin and vendor users
   - Auto-detection of user role based on email
   - Seller ID fetching for vendor users
   - Session validation and logout

2. **API Infrastructure**
   - Common API utilities (`api-utils.ts`)
   - Automatic header management
   - 401 handling with logout
   - Query string builders

3. **Feature Flags**
   - Pricing: `NEXT_PUBLIC_MOCK_PRICING=false` ✅
   - Orders: `NEXT_PUBLIC_MOCK_ORDERS=false` ✅
   - Suppliers: `NEXT_PUBLIC_MOCK_SUPPLIERS=false` ✅

4. **API Clients Updated**
   - `auth-client.ts` - New JWT authentication
   - `orders-admin-client.ts` - Real API for orders
   - `products-pricing-client.ts` - Real API for pricing
   - `api-utils.ts` - Common utilities

5. **Type System**
   - Extended `User` type with JWT claims
   - `actor_type`: 'user' (admin) | 'member' (vendor)
   - `actor_id`: User/member ID from backend
   - `seller_id`: Required for vendor endpoints

---

## 🔑 Credentials (DEV Environment)

### Admin
```
Email: admin@carrefour.dev
Password: supersecret
Endpoint: POST /auth/user/emailpass
```

### Vendor
```
Email: seller@mercur.dev
Password: supersecret
Endpoint: POST /auth/member/emailpass
Seller ID: sel_01M0T3BYTKQF7RV18RX93XEAQD
```

---

## 🧪 Testing Checklist

### 1. Authentication

**Admin Login**:
```bash
# Test admin login
curl -X POST https://marketplace-b2b-backend-dev.onrender.com/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@carrefour.dev","password":"supersecret"}'

# Expected: {"token":"eyJ..."}
# JWT should contain: actor_type="user", actor_id="<id>"
```

**Vendor Login**:
```bash
# Test vendor login
curl -X POST https://marketplace-b2b-backend-dev.onrender.com/auth/member/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@mercur.dev","password":"supersecret"}'

# Expected: {"token":"eyJ..."}
# JWT should contain: actor_type="member", actor_id="<id>"
```

### 2. Orders Module

**List Orders (Admin)**:
```bash
curl -X GET "https://marketplace-b2b-backend-dev.onrender.com/admin/orders?limit=10" \
  -H "Authorization: Bearer <admin_token>"
```

**Order Detail**:
```bash
curl -X GET "https://marketplace-b2b-backend-dev.onrender.com/admin/orders/<order_id>" \
  -H "Authorization: Bearer <admin_token>"
```

### 3. Sellers Module

**List Sellers (Admin)**:
```bash
curl -X GET "https://marketplace-b2b-backend-dev.onrender.com/admin/sellers?limit=50" \
  -H "Authorization: Bearer <admin_token>"
```

**My Seller Info (Vendor)**:
```bash
curl -X GET "https://marketplace-b2b-backend-dev.onrender.com/vendor/sellers/me" \
  -H "Authorization: Bearer <vendor_token>" \
  -H "x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD"
```

### 4. Pricing Module

**Pending Products (Admin)**:
```bash
curl -X GET "https://marketplace-b2b-backend-dev.onrender.com/admin/custom/products/pending?limit=5" \
  -H "Authorization: Bearer <admin_token>"
```

**Get Seller Markup (Admin)**:
```bash
curl -X GET "https://marketplace-b2b-backend-dev.onrender.com/admin/custom/sellers/<seller_id>/markup" \
  -H "Authorization: Bearer <admin_token>"
```

**Update Seller Markup (Admin)**:
```bash
curl -X PATCH "https://marketplace-b2b-backend-dev.onrender.com/admin/custom/sellers/<seller_id>/markup" \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"markup_percentage":15.0,"reason":"Ajuste trimestral"}'
```

**My Products (Vendor)**:
```bash
curl -X GET "https://marketplace-b2b-backend-dev.onrender.com/vendor/custom/products?limit=5" \
  -H "Authorization: Bearer <vendor_token>" \
  -H "x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD"
```

**Propose Product (Vendor)**:
```bash
curl -X POST "https://marketplace-b2b-backend-dev.onrender.com/vendor/custom/products" \
  -H "Authorization: Bearer <vendor_token>" \
  -H "x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Producto Test",
    "description":"Descripción del producto",
    "base_price":25.50
  }'
```

---

## 🔧 Frontend Testing Steps

### 1. Login Flow

1. Start dev server: `npm run dev`
2. Navigate to `/login`
3. Test admin login: `admin@carrefour.dev` / `supersecret`
4. Verify redirect to `/admin/dashboard`
5. Check browser console for:
   - `[Auth] Login successful`
   - JWT payload with `actor_type: "user"`
6. Logout and test vendor login: `seller@mercur.dev` / `supersecret`
7. Verify redirect to `/supplier/dashboard`
8. Check for `actor_type: "member"` and `seller_id`

### 2. Orders Module

**Admin View**:
1. Login as admin
2. Navigate to `/admin/orders`
3. Check browser console for `🌐 [REAL API] Obteniendo pedidos (admin)`
4. Verify orders list loads from real backend
5. Click on an order to view details
6. Check Network tab for `GET /admin/orders/<id>` with 200 response

**Vendor View** (if implemented):
1. Login as vendor
2. Navigate to `/supplier/orders`
3. Verify `x-seller-id` header is sent

### 3. Pricing Module

**Admin View**:
1. Login as admin
2. Navigate to `/admin/pricing/pending` (or pricing management page)
3. Check console for `🌐 Pricing API Mode: REAL`
4. Verify pending products load
5. Test approve/reject functionality
6. Navigate to seller markup management
7. Test markup update

**Vendor View**:
1. Login as vendor
2. Navigate to product proposal page
3. Test creating new product proposal
4. Verify `x-seller-id` header in Network tab
5. Check product appears in backend

### 4. Error Handling

1. Test with invalid credentials → Should show error message
2. Test with expired token → Should redirect to login
3. Test with network offline → Should show error state
4. Test backend timeout (if Render is sleeping) → Should show timeout message

---

## 🚨 Known Issues & Limitations

### Current Limitations

1. **Render Free Tier Cold Starts**:
   - Backend may sleep after inactivity
   - First request may take 30+ seconds
   - Implemented 30s timeout with user feedback

2. **Store Endpoints**:
   - `/store/*` endpoints require `x-publishable-api-key`
   - Not yet fully integrated (catalog, checkout still in mock mode)

3. **Seller ID**:
   - Currently using hardcoded default for vendor
   - Should be fetched from `GET /vendor/sellers/me`
   - Implemented in auth-client.ts but may need adjustment

4. **Incomplete Endpoints**:
   - Some admin operations (refunds, incidents) may not have backend endpoints yet
   - Graceful fallback to mock for unsupported operations

### Troubleshooting

**401 Unauthorized**:
- Clear localStorage and login again
- Check JWT expiration
- Verify correct endpoint for role (user vs member)

**Missing x-seller-id**:
- Check auth-storage in localStorage
- Verify seller_id was fetched during login
- Check Network tab for missing header

**CORS Errors**:
- Backend should have CORS configured
- If issues persist, may need proxy in next.config.js

**Timeout Errors**:
- Normal for Render free tier first request
- Retry after 30 seconds
- Consider keeping backend warm with health checks

---

## 📝 Next Steps

### Immediate (Priority 1)

1. **Test Real Login**:
   - Verify admin login works
   - Verify vendor login works
   - Check JWT claims are correct

2. **Test Orders Module**:
   - Admin orders list
   - Order detail view
   - Verify data matches backend

3. **Test Pricing Module**:
   - Pending products list
   - Markup management
   - Product proposal

### Soon (Priority 2)

4. **Update Login Page**:
   - Replace proxy route with direct auth-client usage
   - Better error messages for backend timeouts

5. **Add Sellers Management**:
   - Create sellers-client.ts if not exists
   - Implement GET /admin/sellers
   - Implement GET /admin/custom/sellers

6. **Complete API Clients**:
   - Finish all pricing-client methods with new api-utils
   - Add vendor orders endpoint
   - Implement store API integration

### Later (Priority 3)

7. **Monitoring & Logging**:
   - Add Sentry or similar for error tracking
   - Log API performance metrics
   - Track mock vs real usage

8. **Optimization**:
   - Implement request caching
   - Add retry logic for failed requests
   - Background token refresh

9. **Documentation**:
   - API client usage examples
   - Common error scenarios
   - Migration guide for other modules

---

## 📚 References

- Backend Validation: [BACKEND_RENDER_DEV_VALIDATED.md](./BACKEND_RENDER_DEV_VALIDATED.md)
- Feature Flags: [src/config/feature-flags.ts](../../src/config/feature-flags.ts)
- Auth Client: [src/lib/api/auth-client.ts](../../src/lib/api/auth-client.ts)
- API Utils: [src/lib/api/api-utils.ts](../../src/lib/api/api-utils.ts)
- Environment Config: [.env.local](../../.env.local)

---

## 🎯 Success Criteria

Integration is considered successful when:

- ✅ Admin can login and see real orders from backend
- ✅ Vendor can login and see real products from backend
- ✅ Pricing workflow (propose → approve/reject) works end-to-end
- ✅ Seller markup management works
- ✅ Error handling gracefully handles network/auth issues
- ✅ No CORS or authentication errors in console
- ✅ Feature flags allow switching between mock/real modes

---

**Last Updated**: 2026-08-26  
**Integration Status**: 🟡 In Progress - Infrastructure Complete, Testing Pending  
**Commit**: 93f7c44
