# Backend API Issues Report

**Date:** 2026-08-26  
**Environment:** Render DEV (`https://marketplace-b2b-backend-dev.onrender.com`)  
**Report Type:** RBAC Permission Issues & API Errors  
**Severity:** HIGH - Blocking frontend integration  
**Reported By:** Frontend Team

---

## Executive Summary

During backend API validation for Orders, Quotes, and Admin modules, we identified **4 critical issues** that are blocking full integration:

- **2 endpoints** return `403 Forbidden` for `/admin/customers/*` (RBAC issue)
- **1 endpoint** returns `403 Forbidden` for `/admin/orders/stats` (workaround exists)
- **ALL endpoints** blocked by CORS policy when accessed from browser at `http://localhost:3000` 🔴 **CRITICAL**

**CORS Issue Impact:**
- ✅ All endpoints work correctly via curl/Postman (validated 39 endpoints)
- ❌ Browser blocks ALL requests due to missing CORS headers
- ❌ Frontend cannot integrate real API in development or production
- 🔴 **BLOCKER** - Must be fixed before production deployment

**RBAC Issues:**
- 2 issues related to **Role-Based Access Control (RBAC)** configuration
- Admin users denied access to endpoints they should have permissions for

---

## ⚠️ Important: Authentication Testing Notes

**JWT Token Expiration:**
- JWT tokens expire after **24 hours**
- Error `{"message":"Unauthorized"}` typically means expired token
- **Always get a fresh token before testing:**

```bash
# Get fresh admin token
TOKEN=$(curl -s -X POST https://marketplace-b2b-backend-dev.onrender.com/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@carrefour.dev","password":"supersecret"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Then use it in your requests
curl -H "Authorization: Bearer $TOKEN" ...
```

**Common Testing Mistakes:**
- ❌ Using hardcoded/old token from documentation → 401 Unauthorized
- ❌ Copy-pasting token from previous test → May be expired
- ✅ Always login first to get fresh token before testing

**All test commands in this report assume you have a fresh valid token.**

---

## 🔴 Critical Issues (403 Forbidden)

### Issue #1: Admin Customers Endpoints - RBAC Permission Denied

**Affected Endpoints:**
- `GET /admin/customers`
- `GET /admin/customers/:id`

**Current Behavior:**
```http
GET https://marketplace-b2b-backend-dev.onrender.com/admin/customers
Authorization: Bearer {admin_token}

Response: 403 Forbidden
{
  "type": "forbidden",
  "message": "Forbidden"
}
```

**Expected Behavior:**
- Admin users should be able to list and view customer (franchisee) details
- Should return `200 OK` with customer data array/object

**Test Credentials Used:**
- Email: `admin@carrefour.dev`
- Password: `supersecret`
- User ID: `user_01M0SP45JAWD6VJRY4A27JBBWC`
- Role: Admin

**Impact:**
- ❌ Cannot implement franchisee management features
- ❌ Frontend must remain in mock mode for customers module
- ❌ Blocking admin dashboard functionality

**Recommended Fix:**
1. Verify RBAC policies for admin role include `customers:read` permission
2. Check if `GET /admin/customers` requires additional scopes
3. Validate admin user has correct role assignments in database

**Test Command:**
```bash
curl -X GET 'https://marketplace-b2b-backend-dev.onrender.com/admin/customers' \
  -H 'Authorization: Bearer {token}' \
  -H 'Content-Type: application/json'
```

---

### Issue #2: Admin Order Stats - RBAC Permission Denied

**Affected Endpoint:**
- `GET /admin/orders/stats` ❌ (Returns 403)

**Workaround Available:**
- `GET /admin/custom/orders/stats` ✅ (Returns 200)

**Current Behavior:**
```http
GET https://marketplace-b2b-backend-dev.onrender.com/admin/orders/stats
Authorization: Bearer {admin_token}

Response: 403 Forbidden
{
  "type": "forbidden",
  "message": "Forbidden"
}
```

**Expected Behavior:**
- Admin users should be able to access order statistics
- Should return `200 OK` with aggregated order stats

**Workaround Implemented:**
Frontend is currently using `/admin/custom/orders/stats` which works correctly and returns `200 OK`.

**Impact:**
- ⚠️ Medium priority (workaround exists)
- Frontend integrated with custom endpoint
- Inconsistent API - two endpoints for same functionality

**Recommended Fix:**
1. Either fix RBAC for `/admin/orders/stats` endpoint
2. Or deprecate `/admin/orders/stats` and document `/admin/custom/orders/stats` as the official endpoint

**Test Commands:**
```bash
# Broken endpoint
curl -X GET 'https://marketplace-b2b-backend-dev.onrender.com/admin/orders/stats' \
  -H 'Authorization: Bearer {token}'
# Expected: 403 Forbidden

# Working workaround
curl -X GET 'https://marketplace-b2b-backend-dev.onrender.com/admin/custom/orders/stats' \
  -H 'Authorization: Bearer {token}'
# Expected: 200 OK
```

---

### Issue #3: CORS Policy Blocking Browser Requests

**Affected Endpoints:**
- ALL endpoints when accessed from browser at `http://localhost:3000`
- Specifically impacting: `/franchisee/orders`, `/admin/orders`, and other frontend features

**Current Behavior:**
```http
GET https://marketplace-b2b-backend-dev.onrender.com/franchisee/orders
Origin: http://localhost:3000
Authorization: Bearer {token}

Response: 200 OK (but CORS headers missing)
Error in Browser Console:
"Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin"
```

**Expected Behavior:**
- Backend should include CORS headers allowing `http://localhost:3000` origin
- Response should include:
  ```
  Access-Control-Allow-Origin: http://localhost:3000
  Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
  Access-Control-Allow-Headers: Authorization, Content-Type, x-seller-id, x-publishable-api-key
  Access-Control-Allow-Credentials: true
  ```

**Technical Details:**
- ✅ Endpoint works correctly via curl/Postman (no CORS enforcement)
- ✅ Returns proper 200 OK response with valid data
- ❌ Browser blocks response due to missing CORS headers
- ❌ Frontend cannot access response data in browser

**Impact:**
- 🔴 **CRITICAL** - Blocks ALL real API integration from browser
- ❌ Frontend must remain in mock mode for all modules
- ❌ End-to-end testing impossible from development environment
- ⚠️ Will also affect production deployment if not fixed

**Recommended Fix:**
Add CORS configuration to backend (Medusa/Express):

```typescript
// medusa-config.js or CORS middleware
module.exports = {
  // ... other config
  projectConfig: {
    // ... other config
    store_cors: process.env.STORE_CORS || "http://localhost:3000,http://localhost:8000",
    admin_cors: process.env.ADMIN_CORS || "http://localhost:3000,http://localhost:7001,http://localhost:9000",
  },
  // Or via custom middleware:
  /*
  cors: {
    origin: ["http://localhost:3000", "https://marketplace-b2b-carrefour.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "x-seller-id", "x-publishable-api-key"],
  }
  */
}
```

**Immediate Workaround:**
- Frontend remains in mock mode until CORS is configured
- Use `NEXT_PUBLIC_MOCK_ORDERS=true` (default) to keep using mock data
- API validation continues via curl/server-side testing

**Test Command (shows CORS issue):**
```bash
# This works in terminal (no CORS):
curl -X GET 'https://marketplace-b2b-backend-dev.onrender.com/franchisee/orders' \
  -H 'Authorization: Bearer {token}'
# Returns: 200 OK with data

# This fails in browser (CORS enforced):
# Open browser console at http://localhost:3000 and run:
fetch('https://marketplace-b2b-backend-dev.onrender.com/franchisee/orders', {
  headers: { 'Authorization': 'Bearer {token}' }
})
# Error: "Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin"
```

**Priority:** 🔴 **CRITICAL - Required for production**

---

## ✅ Working Endpoints (For Reference)

These endpoints work correctly with same admin credentials:

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| /admin/users/me | GET | ✅ 200 | Returns admin user profile |
| /admin/orders | GET | ✅ 200 | Lists all orders |
| /admin/orders/:id | GET | ✅ 200 | Order detail |
| /admin/custom/orders/stats | GET | ✅ 200 | Order statistics (workaround) |
| /admin/sellers | GET | ✅ 200 | Lists all sellers |
| /admin/sellers/:id | GET | ✅ 200 | Seller detail |
| /admin/custom/sellers/:id/markup | GET | ✅ 200 | Get seller markup ✨ TESTED |
| /admin/custom/sellers/:id/markup | PATCH | ✅ 200 | Update seller markup ✨ TESTED |
| /admin/custom/products/pending | GET | ✅ 200 | Pending products ✨ TESTED |
| /admin/quotes | GET | ✅ 200 | Lists all quotes |
| /admin/quotes/stats | GET | ✅ 200 | Quote statistics |
| /franchisee/orders | GET | ✅ 200 | Franchisee orders |
| /franchisee/orders/stats | GET | ✅ 200 | Franchisee order stats |
| /quotes | GET | ✅ 200 | Customer quotes |
| /quotes/:id | GET | ✅ 200 | Quote detail |
| /seller/quotes | GET | ✅ 200 | Seller quotes |
| /seller/invitations | GET | ✅ 200 | Seller invitations |
| /vendor/custom/products | GET | ✅ 200 | Vendor products list ✨ TESTED |
| /vendor/custom/products | POST | ✅ 201 | Propose product ✨ TESTED |

**✨ Workflow Validated End-to-End:**
1. Vendor proposes product → 201 Created ✅
2. Product appears in pending list → 200 OK ✅
3. Admin can see/manage pending products → 200 OK ✅
4. Admin can get/update seller markup → 200 OK ✅
5. Duplicate detection working → Proper error handling ✅

---

## 📋 Testing Details

### Test Environment
- **Backend URL:** `https://marketplace-b2b-backend-dev.onrender.com`
- **Health Check:** `GET /health` → `200 OK` ✅
- **Auth Endpoint:** `POST /auth/user/emailpass` → Working ✅
- **Test Date:** 2026-08-26

### Test User Details
```json
{
  "email": "admin@carrefour.dev",
  "password": "supersecret",
  "user_id": "user_01M0SP45JAWD6VJRY4A27JBBWC",
  "first_name": "Admin",
  "last_name": "Carrefour DEV",
  "role": "admin"
}
```

### Authentication Flow
1. POST `/auth/user/emailpass` with email/password
2. Receive JWT token in response
3. Use token in `Authorization: Bearer {token}` header
4. Some endpoints also require `x-seller-id` header (working correctly)

### Test Script
Frontend team has created automated test script:
- **Location:** `scripts/test-admin-endpoints.mjs`
- **Usage:** `node scripts/test-admin-endpoints.mjs`
- **Coverage:** Tests all admin endpoints and reports status

---

## 🔧 Suggested Investigation Steps

1. **Check RBAC Configuration:**
   ```sql
   -- Example queries (adjust to your schema)
   SELECT * FROM user_roles WHERE user_id = 'user_01M0SP45JAWD6VJRY4A27JBBWC';
   SELECT * FROM role_permissions WHERE role_name = 'admin';
   ```

2. **Review Medusa Admin API Setup:**
   - Verify admin API middleware configuration
   - Check if custom RBAC policies are overriding default Medusa permissions
   - Validate JWT token claims include correct scopes

3. **Compare Working vs Broken Endpoints:**
   - `/admin/sellers` works → `/admin/customers` fails
   - Both should use same admin authentication
   - Check if there's special handling for customers endpoint

4. **Test with Different Admin User:**
   - Create new admin user in database
   - Test if issue is user-specific or role-specific

5. **Review Recent RBAC Changes:**
   - Check git commits around customers and orders/stats endpoints
   - Verify if recent security updates affected these endpoints

---

## 📊 Impact Assessment

### Critical Priority (Production Blocker)
- 🔴 **CORS Policy Missing** - ALL endpoints blocked in browser
  - Affects: ALL modules trying to use real API
  - Workaround: Frontend using mock data for all modules
  - Business Impact: **Cannot deploy to production without CORS fix**
  - Technical Impact: 39 validated endpoints cannot be used from browser
  - Status: ✅ Endpoints work (curl validated), ❌ Browser blocked (CORS missing)

### High Priority (Blocking)
- ❌ **Franchisee Management** - Cannot access customer data
  - Affects: Admin dashboard, customer CRUD operations
  - Workaround: Frontend using mock data
  - Business Impact: Admin users cannot manage franchisees

### Medium Priority (Workaround Exists)
- ⚠️ **Order Statistics** - Legacy endpoint broken, custom endpoint works
  - Affects: Admin order stats widget
  - Workaround: Using `/admin/custom/orders/stats`
  - Business Impact: Minimal (workaround implemented)

### Current Frontend Status
- **Orders Module:** ✅ Integrated (using workaround)
- **Quotes Module:** ✅ Integrated (partial)
- **Sellers Module:** ✅ Integrated
- **Customers Module:** ❌ Mock mode (blocked by RBAC)
- **Admin Profile:** ✅ Integrated

---

## 📝 Request for Backend Team

### Immediate Actions Needed

1. **Fix CORS Configuration** (🔴 CRITICAL - PRODUCTION BLOCKER)
   - Add `http://localhost:3000` to allowed origins for development
   - Add `https://marketplace-b2b-carrefour.vercel.app` for production
   - Configure CORS headers: `Access-Control-Allow-Origin`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Credentials`
   - Test from browser console to confirm CORS headers present
   - **Priority:** HIGHEST - Required before any production deployment

2. **Fix RBAC for `/admin/customers` endpoints** (CRITICAL)
   - Grant `customers:read` permission to admin role
   - Test with admin@carrefour.dev credentials
   - Confirm fix by testing both list and detail endpoints

3. **Clarify `/admin/orders/stats` status** (MEDIUM)
   - Option A: Fix RBAC and keep both endpoints
   - Option B: Deprecate `/admin/orders/stats`, document custom endpoint
   - Let frontend team know which endpoint to use long-term

4. **Validation Response**
   - Test all affected endpoints (CORS + RBAC)
   - Provide updated API documentation
   - Confirm which endpoints should work vs which should be deprecated

### Response Format Requested

Please reply with:
```markdown
## Endpoint Fix Status

### CORS Configuration
- [ ] Added http://localhost:3000 to allowed origins
- [ ] Added https://marketplace-b2b-carrefour.vercel.app to allowed origins  
- [ ] CORS headers configured (Access-Control-Allow-*)
- [ ] Tested from browser console - CORS errors resolved

### GET /admin/customers
- [ ] RBAC permissions updated
- [ ] Tested with admin@carrefour.dev
- [ ] Returns 200 OK with customer array

### GET /admin/customers/:id  
- [ ] RBAC permissions updated
- [ ] Tested with valid customer ID
- [ ] Returns 200 OK with customer object

### GET /admin/orders/stats
- [ ] Option chosen: [Fix | Deprecate]
- [ ] If fixed: RBAC permissions updated
- [ ] If deprecated: Documentation updated
```

---

## 📞 Contact

- **Frontend Team Lead:** Development Team
- **Report Date:** 2026-08-26
- **Environment:** Render DEV
- **Next Review:** 2026-08-27 (24h follow-up)

---

## Appendix A: Complete Test Results

### Test Run Output
```
============================================================
Testing Admin Endpoints - Render DEV
============================================================
🔐 Logging in as admin...
✅ Login successful

📡 Testing: Get current admin user
   Endpoint: GET /admin/users/me
   Status: ✅ 200 OK

📡 Testing: List sellers (MercurJS)
   Endpoint: GET /admin/sellers
   Status: ✅ 200 OK

📡 Testing: List franchisees/customers
   Endpoint: GET /admin/customers
   Status: ❌ 403 Forbidden
   Error: {"type":"forbidden","message":"Forbidden"}

📡 Testing: Get seller detail
   Endpoint: GET /admin/sellers/sel_01M0A89ET1F5NBDER95X09ZPES
   Status: ✅ 200 OK

============================================================
SUMMARY
============================================================
✅ 200 - /admin/users/me
✅ 200 - /admin/sellers
❌ 403 - /admin/customers
✅ 200 - /admin/sellers/sel_01M0A89ET1F5NBDER95X09ZPES
```

### Frontend Documentation
- **Orders/Quotes Validation:** `docs/integration/BACKEND_ORDERS_QUOTES_VALIDATED.md`
- **Admin Endpoints Validation:** `docs/integration/BACKEND_ADMIN_VALIDATED.md`
- **Test Script:** `scripts/test-admin-endpoints.mjs`

---

**End of Report**
