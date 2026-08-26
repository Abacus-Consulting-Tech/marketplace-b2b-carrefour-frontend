# CORS Troubleshooting Guide

**Date:** 2026-08-26  
**Environment:** Render DEV  
**Status:** 🔴 **CRITICAL BLOCKER** - CORS headers missing on backend

---

## 🚨 Current Issue

**Problem:**  
Backend API endpoints return `200 OK` when tested with curl/Postman, but browser requests fail with CORS error:

```
Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin
```

**Impact:**
- ✅ All 39 validated endpoints work correctly (tested with curl)
- ❌ Browser blocks ALL responses due to missing CORS headers
- ❌ Frontend cannot integrate real API from development environment
- 🔴 **BLOCKER** - Cannot deploy to production until fixed

---

## 📋 Error Details

### Browser Console Error

```
[Error] Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin. Status code: 200
[Error] Fetch API cannot load https://marketplace-b2b-backend-dev.onrender.com/franchisee/orders due to access control checks.
[Error] Failed to load resource: Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin. Status code: 200
```

### Example Request

```javascript
// Frontend code (fails in browser)
fetch('https://marketplace-b2b-backend-dev.onrender.com/franchisee/orders', {
  headers: {
    'Authorization': 'Bearer eyJhbGc...',
    'Content-Type': 'application/json'
  }
})
```

### cURL Request (Works)

```bash
# Same request works in terminal (no CORS enforcement)
curl -X GET 'https://marketplace-b2b-backend-dev.onrender.com/franchisee/orders' \
  -H 'Authorization: Bearer eyJhbGc...' \
  -H 'Content-Type: application/json'

# Returns: 200 OK with valid JSON data
```

---

## 🔧 Root Cause

**CORS (Cross-Origin Resource Sharing) Policy Missing**

The backend server at `https://marketplace-b2b-backend-dev.onrender.com` does not include the required CORS headers in its responses. 

When a browser makes a request from `http://localhost:3000` (or any other origin) to a different domain, the browser enforces the **Same-Origin Policy**. The server must explicitly allow the origin by including CORS headers.

**What's Missing:**
```http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, x-seller-id, x-publishable-api-key
Access-Control-Allow-Credentials: true
```

---

## ✅ Required Backend Fix

### Medusa Backend Configuration

The backend needs to configure CORS in `medusa-config.js`:

```javascript
// medusa-config.js
module.exports = {
  projectConfig: {
    // ... other config
    
    // CORS for Store API (franchisee endpoints)
    store_cors: process.env.STORE_CORS || 
      "http://localhost:3000,http://localhost:8000,https://marketplace-b2b-carrefour.vercel.app",
    
    // CORS for Admin API (admin endpoints)
    admin_cors: process.env.ADMIN_CORS || 
      "http://localhost:3000,http://localhost:7001,http://localhost:9000,https://marketplace-b2b-carrefour.vercel.app",
  },
  
  // ... rest of config
}
```

### Alternative: Express CORS Middleware

If using custom routes or middleware:

```javascript
// Custom CORS configuration
const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:3000',           // Development frontend
    'https://marketplace-b2b-carrefour.vercel.app',  // Production frontend
  ],
  credentials: true,  // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Authorization',
    'Content-Type',
    'x-seller-id',
    'x-publishable-api-key',
  ],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400,  // 24 hours
};

// Apply to all routes
app.use(cors(corsOptions));
```

### Environment Variables

```bash
# .env or Render environment variables
STORE_CORS=http://localhost:3000,https://marketplace-b2b-carrefour.vercel.app
ADMIN_CORS=http://localhost:3000,https://marketplace-b2b-carrefour.vercel.app
```

---

## 🧪 Testing CORS Fix

### 1. Check Response Headers

After backend is updated, verify CORS headers are present:

```bash
# Test with curl -i (include headers)
curl -i -X GET 'https://marketplace-b2b-backend-dev.onrender.com/franchisee/orders' \
  -H 'Origin: http://localhost:3000' \
  -H 'Authorization: Bearer {token}'

# Look for these headers in response:
# Access-Control-Allow-Origin: http://localhost:3000
# Access-Control-Allow-Credentials: true
```

### 2. Browser Console Test

Open browser console at `http://localhost:3000`:

```javascript
// Should work after CORS fix
fetch('https://marketplace-b2b-backend-dev.onrender.com/franchisee/orders', {
  headers: {
    'Authorization': 'Bearer {token}'
  }
})
.then(res => res.json())
.then(data => console.log('✅ CORS working!', data))
.catch(err => console.error('❌ CORS still broken', err));
```

### 3. Frontend Integration Test

Login as franchisee and navigate to orders page:
- URL: `http://localhost:3000/marketplace/orders`
- Expected: Orders load from real API
- Console: No CORS errors

---

## 🔄 Frontend Workaround (Current State)

Until CORS is fixed, frontend remains in **mock mode**:

```typescript
// src/config/feature-flags.ts
orders: {
  useMock: process.env.NEXT_PUBLIC_MOCK_ORDERS !== 'false', // Default: true (mock)
  backendReady: true,  // API works, but CORS blocking browser
  notes: 'CORS headers missing - using mock mode until backend configured'
}
```

**To test real API after CORS fix:**
```bash
# Set environment variable to disable mock mode
NEXT_PUBLIC_MOCK_ORDERS=false npm run dev
```

---

## 📊 Affected Endpoints

**ALL endpoints** are affected by CORS issue when accessed from browser:

- ✅ Work via curl/Postman (39 endpoints validated)
- ❌ Blocked in browser (CORS missing)

### Validated Endpoints (Work with curl, fail in browser):
- Auth: `POST /auth/user/emailpass`, `POST /auth/member/emailpass`
- Admin Orders: `GET /admin/orders`, `GET /admin/custom/orders/stats`
- Franchisee Orders: `GET /franchisee/orders`, `GET /franchisee/orders/stats`
- Vendor Orders: `GET /vendor/orders`, `GET /vendor/orders/stats`
- Pricing: `GET /admin/custom/products/pending`, `PATCH /admin/custom/sellers/:id/markup`
- Sellers: `GET /admin/sellers`, `GET /admin/sellers/:id`
- Quotes: `GET /quotes`, `GET /admin/quotes`, `GET /seller/quotes`
- Excel Import: All 8 endpoints (upload, download, jobs)

---

## 🚦 Priority & Status

**Priority:** 🔴 **CRITICAL** - Production Blocker

**Status Checklist:**
- [ ] Backend team notified of CORS issue
- [ ] CORS configuration added to medusa-config.js
- [ ] Development origin added: `http://localhost:3000`
- [ ] Production origin added: `https://marketplace-b2b-carrefour.vercel.app`
- [ ] CORS headers tested with curl -i
- [ ] Browser console test passes (no CORS errors)
- [ ] Frontend switched from mock to real API mode
- [ ] End-to-end testing completed in browser

**Expected Resolution:** 2026-08-27 (within 24 hours)

---

## 📞 Next Steps

1. **Backend Team:** Add CORS configuration (see example above)
2. **Backend Team:** Deploy to Render DEV
3. **Backend Team:** Notify frontend team when ready
4. **Frontend Team:** Test CORS headers with curl -i
5. **Frontend Team:** Test in browser console
6. **Frontend Team:** Switch feature flags to real API mode
7. **Both Teams:** Conduct end-to-end integration testing

---

## 📚 References

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Medusa CORS Configuration](https://docs.medusajs.com/development/backend/configurations#cors)
- [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)

---

## 📝 Related Documents

- [Backend Issues Report](./BACKEND_ISSUES_REPORT_2026-08-26.md) - Complete list of backend issues
- [Backend Integration Guide](./BACKEND_INTEGRATION_GUIDE.md) - Testing endpoints with curl
- [Backend Testing Results](./BACKEND_TESTING_RESULTS_2026-08-26.md) - 39 endpoints validation results

---

**Last Updated:** 2026-08-26  
**Reported By:** Frontend Team  
**Assigned To:** Backend Team  
**Severity:** CRITICAL - Production Blocker
