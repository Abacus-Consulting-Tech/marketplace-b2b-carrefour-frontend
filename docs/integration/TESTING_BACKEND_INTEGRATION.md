# Testing Backend Integration - Step-by-Step Guide

**Date**: 2026-08-26  
**Backend**: https://marketplace-b2b-backend-dev.onrender.com  
**Status**: 🧪 Ready for Testing

---

## 📋 Prerequisites

1. **Backend is running** (Render DEV may sleep - first request can take 30s)
2. **Dev server started**: `npm run dev`
3. **Browser DevTools open** (Console + Network tabs)
4. **Clear browser data** (recommended):
   ```javascript
   // Run in browser console
   localStorage.clear()
   ```

---

## 🧪 Test Suite

### Test 1: Admin Login Flow

**Objective**: Verify admin can login with real backend JWT authentication

**Steps**:

1. **Navigate to login page**
   ```
   http://localhost:3000/login
   ```

2. **Open Browser DevTools**
   - Console tab (to see logs)
   - Network tab (to see API calls)

3. **Enter admin credentials**:
   ```
   Email: admin@carrefour.dev
   Password: supersecret
   ```

4. **Click Login**

5. **Check Console for success indicators**:
   ```
   ✅ Look for:
   [Auth] Login attempt for admin@carrefour.dev via /auth/user/emailpass
   [Auth] JWT payload: {actor_type: "user", actor_id: "..."}
   [Auth] Login successful: {email: "admin@carrefour.dev", role: "admin", actor_type: "user"}
   ```

6. **Check Network tab**:
   ```
   ✅ Look for:
   POST https://marketplace-b2b-backend-dev.onrender.com/auth/user/emailpass
   Status: 200 OK
   Response: {"token": "eyJ..."}
   ```

7. **Check localStorage**:
   ```javascript
   // Run in console
   localStorage.getItem('auth-token')  // Should have JWT
   JSON.parse(localStorage.getItem('auth-storage'))  // Should have user object
   ```

8. **Verify redirect**:
   ```
   ✅ Should redirect to: /admin/dashboard (or admin home)
   ```

**Expected Result**: ✅ Admin logged in successfully with real JWT

**If Failed**:
- Check if backend is sleeping (wait 30s and retry)
- Check browser console for errors
- Verify credentials are correct
- Check Network tab for 401/500 errors

---

### Test 2: Vendor Login Flow

**Objective**: Verify vendor can login and seller_id is fetched

**Steps**:

1. **Logout first**:
   - Click logout button OR
   - Run in console: `localStorage.clear()`

2. **Go to login page**:
   ```
   http://localhost:3000/login
   ```

3. **Enter vendor credentials**:
   ```
   Email: seller@mercur.dev
   Password: supersecret
   ```

4. **Click Login**

5. **Check Console**:
   ```
   ✅ Look for:
   [Auth] Login attempt for seller@mercur.dev via /auth/member/emailpass
   [Auth] JWT payload: {actor_type: "member", actor_id: "..."}
   [Auth] Vendor seller_id: sel_01M0T3BYTKQF7RV18RX93XEAQD
   [Auth] Login successful: {..., role: "supplier", seller_id: "sel_..."}
   ```

6. **Check Network tab for seller fetch**:
   ```
   ✅ Look for:
   GET https://marketplace-b2b-backend-dev.onrender.com/vendor/sellers/me
   Headers: Authorization: Bearer eyJ...
   Status: 200 OK
   ```

7. **Verify seller_id in storage**:
   ```javascript
   // Run in console
   const auth = JSON.parse(localStorage.getItem('auth-storage'))
   console.log('Seller ID:', auth.state.user.seller_id)
   // Should be: sel_01M0T3BYTKQF7RV18RX93XEAQD
   ```

8. **Verify redirect**:
   ```
   ✅ Should redirect to: /supplier/dashboard (or supplier home)
   ```

**Expected Result**: ✅ Vendor logged in with seller_id fetched

---

### Test 3: Admin Orders - Real API

**Objective**: Verify admin can fetch real orders from backend

**Steps**:

1. **Login as admin** (if not already)

2. **Navigate to admin orders page**:
   ```
   http://localhost:3000/admin/orders
   ```

3. **Check Console for API mode**:
   ```
   ✅ Look for:
   🌐 Orders (Admin) API Mode: REAL (Backend Ready: Yes ✅)
   🌐 [REAL API] Obteniendo pedidos (admin): {page: 1, limit: 10}
   ```
   
   ❌ If you see:
   🎭 [MOCK] Obteniendo pedidos (admin)
   → Check .env.local has NEXT_PUBLIC_MOCK_ORDERS=false

4. **Check Network tab**:
   ```
   ✅ Look for:
   GET https://marketplace-b2b-backend-dev.onrender.com/admin/orders?limit=10
   Headers:
     - Authorization: Bearer eyJ...
     - Content-Type: application/json
   Status: 200 OK
   Response: {"orders": [...], "count": ...}
   ```

5. **Verify orders display**:
   ```
   ✅ Orders list should show real data from backend
   ✅ Check order IDs, dates, amounts match backend data
   ```

6. **Click on an order to view details**:
   ```
   ✅ Should load order detail page
   ```

7. **Check Network for order detail**:
   ```
   ✅ Look for:
   GET https://marketplace-b2b-backend-dev.onrender.com/admin/orders/{order_id}
   Status: 200 OK
   ```

**Expected Result**: ✅ Real orders loaded from backend

---

### Test 4: Pricing Module - Pending Products

**Objective**: Verify admin can see pending products from real backend

**Steps**:

1. **Login as admin** (if not already)

2. **Navigate to pricing/pending products page**:
   ```
   http://localhost:3000/admin/pricing/pending
   (or wherever your pricing approval page is)
   ```

3. **Check Console for API mode**:
   ```
   ✅ Look for:
   🌐 Pricing API Mode: REAL (Backend Ready: Yes ✅)
   ```

4. **Check Network tab**:
   ```
   ✅ Look for:
   GET https://marketplace-b2b-backend-dev.onrender.com/admin/custom/products/pending?limit=5
   Headers: Authorization: Bearer eyJ...
   Status: 200 OK
   Response: {"products": [...]}
   ```

5. **Verify pending products display**:
   ```
   ✅ Should show products waiting for approval
   ✅ Each product should have seller info, price, status
   ```

**Expected Result**: ✅ Real pending products loaded from backend

---

### Test 5: Seller Markup Management

**Objective**: Verify admin can fetch and update seller markup

**Steps**:

1. **Login as admin**

2. **Navigate to seller markup page** (or use seller_id from backend):
   ```
   http://localhost:3000/admin/sellers/sel_01M0T3BYTKQF7RV18RX93XEAQD/markup
   (adjust URL to your route)
   ```

3. **Check Network for markup fetch**:
   ```
   ✅ Look for:
   GET https://marketplace-b2b-backend-dev.onrender.com/admin/custom/sellers/sel_01M0T3BYTKQF7RV18RX93XEAQD/markup
   Status: 200 OK
   Response: {"markup_percentage": 15.0, "seller": {...}}
   ```

4. **Check Network for markup history**:
   ```
   ✅ Look for:
   GET https://marketplace-b2b-backend-dev.onrender.com/admin/custom/sellers/sel_01M0T3BYTKQF7RV18RX93XEAQD/markup/history
   Status: 200 OK
   Response: {"history": [...]}
   ```

5. **Try updating markup** (if UI available):
   - Change markup percentage
   - Click save

6. **Check Network for update**:
   ```
   ✅ Look for:
   PATCH https://marketplace-b2b-backend-dev.onrender.com/admin/custom/sellers/sel_01M0T3BYTKQF7RV18RX93XEAQD/markup
   Body: {"markup_percentage": 20.0, "reason": "Test update"}
   Status: 200 OK
   ```

**Expected Result**: ✅ Markup fetched and updated on real backend

---

### Test 6: Vendor Products List

**Objective**: Verify vendor can see their products from backend

**Steps**:

1. **Login as vendor**:
   ```
   Email: seller@mercur.dev
   Password: supersecret
   ```

2. **Navigate to vendor products page**:
   ```
   http://localhost:3000/supplier/products
   (or wherever your vendor products list is)
   ```

3. **Check Console**:
   ```
   ✅ Look for:
   🌐 Pricing API Mode: REAL
   ```

4. **Check Network tab**:
   ```
   ✅ Look for:
   GET https://marketplace-b2b-backend-dev.onrender.com/vendor/custom/products?limit=100
   Headers:
     - Authorization: Bearer eyJ...
     - x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD
   Status: 200 OK
   Response: [product1, product2, ...]
   ```

5. **Verify products display**:
   ```
   ✅ Should show vendor's products
   ✅ Check statuses: pending_approval, approved, rejected
   ```

**Expected Result**: ✅ Vendor products loaded from real backend with x-seller-id header

---

### Test 7: Vendor Orders List

**Objective**: Verify vendor can see their orders from real backend

**Steps**:

1. **Login as vendor**:
   ```
   Email: seller@mercur.dev
   Password: supersecret
   ```

2. **Navigate to vendor orders page**:
   ```
   http://localhost:3000/supplier/orders
   (or wherever your vendor orders list is)
   ```

3. **Check Console**:
   ```
   ✅ Look for:
   🌐 Supplier Orders API Mode: REAL (Backend Ready: Yes ✅)
   ```

4. **Check Network tab**:
   ```
   ✅ Look for:
   GET https://marketplace-b2b-backend-dev.onrender.com/vendor/orders?limit=20
   Headers:
     - Authorization: Bearer eyJ...
     - x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD
   Status: 200 OK
   Response: {"orders": [...], "count": 0, "limit": 20, "offset": 0}
   ```

5. **Verify orders display**:
   ```
   ✅ Should show vendor's orders (may be empty if no test data)
   ✅ Check order numbers, franchisee names, amounts
   ```

6. **Check order statistics** (if displayed on page):
   ```
   ✅ Network tab should show:
   GET https://marketplace-b2b-backend-dev.onrender.com/vendor/orders/stats
   Headers: Authorization + x-seller-id
   Response: {"stats": {"pendingCount": 0, "confirmedCount": 0, ...}}
   ```

**Expected Result**: ✅ Vendor orders loaded from real backend with x-seller-id header

**Note**: Backend may have no orders for test vendor. Check response shows `count: 0` which is valid.

---

### Test 8: Vendor Order Actions (if test data available)

**Objective**: Verify vendor can accept/reject/update orders

**Prerequisites**: Need at least one test order assigned to seller@mercur.dev

**Steps** (if order available):

1. **Login as vendor**

2. **Go to orders list, click on a pending order**

3. **Try accepting the order**:
   - Click "Accept Order" button
   - Fill in estimated delivery date
   - Submit

4. **Check Network tab**:
   ```
   ✅ Look for:
   POST https://marketplace-b2b-backend-dev.onrender.com/vendor/orders/{order_id}/accept
   Headers:
     - Authorization: Bearer eyJ...
     - x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD
   Body: {"estimated_delivery": "2026-09-15", "notes": "..."}
   Status: 200 OK
   ```

5. **Try updating order status** (if available):
   - Change status to "In Preparation"
   - Submit

6. **Check Network**:
   ```
   ✅ Look for:
   PATCH https://marketplace-b2b-backend-dev.onrender.com/vendor/orders/{order_id}/status
   Body: {"status": "in_preparation", "notes": "..."}
   ```

7. **Try adding tracking** (if available):
   - Mark as shipped
   - Add tracking number, carrier
   - Submit

8. **Check Network**:
   ```
   ✅ Look for:
   POST https://marketplace-b2b-backend-dev.onrender.com/vendor/orders/{order_id}/tracking
   Body: {"tracking_number": "...", "carrier": "...", ...}
   ```

**Expected Result**: ✅ Order actions work with real backend

**If No Test Data**:
- Actions endpoints validated by backend team (return 404 for non-existent orders)
- UI may show empty state - this is expected and valid

---

### Test 9: Vendor Markup Info

**Old Test 7 - renumbered**

**Steps**:

1. **Login as vendor**

2. **Navigate to vendor markup page** (or dashboard if it shows markup):
   ```
   http://localhost:3000/supplier/markup
   ```

3. **Check Network tab**:
   ```
   ✅ Look for:
   GET https://marketplace-b2b-backend-dev.onrender.com/vendor/custom/sellers/me/markup
   Headers:
     - Authorization: Bearer eyJ...
     - x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD
   Status: 200 OK
   Response: {"markup_percentage": 15.0}
   ```

**Expected Result**: ✅ Vendor sees their markup from real backend

---

### Test 8: Error Handling - 401 Unauthorized

**Objective**: Verify app handles expired tokens correctly

**Steps**:

1. **Login as admin**

2. **Manually expire token**:
   ```javascript
   // Run in console
   localStorage.setItem('auth-token', 'invalid.token.here')
   ```

3. **Navigate to any protected page**:
   ```
   http://localhost:3000/admin/orders
   ```

4. **Check Console**:
   ```
   ✅ Look for:
   [API] 401 Unauthorized - clearing auth and redirecting to login
   ```

5. **Verify redirect**:
   ```
   ✅ Should redirect to: /login
   ✅ localStorage should be cleared
   ```

**Expected Result**: ✅ App handles 401 by clearing auth and redirecting to login

---

### Test 11: Error Handling - Backend Timeout

**Old Test 9 - renumbered**

**Steps**:

1. **Logout completely**

2. **Wait 5+ minutes** (to let Render backend sleep on free tier)

3. **Try to login**:
   ```
   Email: admin@carrefour.dev
   Password: supersecret
   ```

4. **Check Console**:
   ```
   ✅ Look for:
   [Auth] Login attempt...
   (wait up to 30 seconds)
   
   If timeout:
   Backend timeout - servidor arrancando (30s). Intenta de nuevo.
   ```

5. **Retry login after timeout**:
   ```
   ✅ Second attempt should work (backend now awake)
   ```

**Expected Result**: ✅ App shows timeout message, allows retry

---

### Test 12: Feature Flag Toggle

**Old Test 10 - renumbered**

**Steps**:

1. **Edit .env.local**:
   ```env
   # Change from:
   NEXT_PUBLIC_MOCK_ORDERS=false
   
   # To:
   NEXT_PUBLIC_MOCK_ORDERS=true
   ```

2. **Restart dev server**:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Login and go to orders page**

4. **Check Console**:
   ```
   ✅ Look for:
   🎭 Orders (Admin) API Mode: MOCK (Backend Ready: Yes ✅)
   📦 [MOCK] Obteniendo pedidos (admin)
   ```

5. **Verify no backend calls**:
   ```
   ✅ Network tab should NOT show calls to marketplace-b2b-backend-dev.onrender.com
   ✅ Should show mock data instead
   ```

6. **Restore real API**:
   ```env
   NEXT_PUBLIC_MOCK_ORDERS=false
   ```

7. **Restart server again**

**Expected Result**: ✅ Feature flags toggle between mock/real modes correctly

---

### Test 13: Excel Import - Vendor Bulk Upload

**Objective**: Verify vendor can upload Excel file and track import job

**Steps**:

1. **Login as vendor**:
   ```
   Email: seller@mercur.dev
   Password: supersecret
   ```

2. **Navigate to vendor products section** (exact route depends on UI):
   ```
   http://localhost:3000/supplier/products
   (look for "Import Excel" or "Bulk Upload" button)
   ```

3. **Download Excel template**:
   - Click "Download Template" button
   - Check Network tab for:
   ```
   ✅ GET .../vendor/custom/products/import/template
   ✅ Headers: Authorization + x-seller-id
   ✅ Status: 200 OK
   ✅ Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
   ```

4. **Upload test Excel file**:
   - Use provided template: `docs/integration/Plantilla_ejemplo_proveedores_carga_productos.xlsx`
   - Or create minimal Excel with required columns
   - Click "Upload" button

5. **Check upload request**:
   ```
   ✅ POST .../vendor/custom/products/import
   ✅ Headers: Authorization + x-seller-id
   ✅ Content-Type: multipart/form-data
   ✅ Body contains: file field
   ```

6. **Check upload response**:
   ```json
   ✅ Status: 202 Accepted
   ✅ Response: {
     "job_id": "uuid",
     "status": "queued",
     "total_rows": 400,
     "status_url": "/vendor/custom/products/import/{job_id}"
   }
   ```

7. **Monitor job progress** (UI should poll every 1-2s):
   ```
   ✅ GET .../vendor/custom/products/import/{job_id}
   ✅ Status transitions: queued → validating → ingesting → success
   ```

8. **Check final success response**:
   ```json
   ✅ {
     "job": {
       "status": "success",
       "processed_rows": 400,
       "result": {
         "created_product_ids": ["prod_...", ...]
       }
     }
   }
   ```

9. **Verify error handling** (optional - requires invalid Excel):
   - Upload Excel with errors (invalid price, missing SKU)
   - Check for `status: "failed"` with error details:
   ```json
   {
     "errors": [{
       "line": 12,
       "column": "base_price",
       "reason": "Must be a decimal number > 0",
       "value": "0"
     }]
   }
   ```

**Expected Result**: ✅ Excel upload creates async job, UI tracks progress, shows success/errors

**Note**: Full import test requires valid Excel with B2B categories. Backend processes 100 products x 4 variants = 400 rows in ~2-5 seconds.

---

### Test 14: Excel Import - Admin Upload for Seller

**Objective**: Verify admin can upload Excel on behalf of a seller

**Steps**:

1. **Login as admin**:
   ```
   Email: admin@carrefour.dev
   Password: supersecret
   ```

2. **Navigate to admin products or seller management**:
   ```
   http://localhost:3000/admin/suppliers
   (look for seller detail → Import Products)
   ```

3. **Download template as admin**:
   ```
   ✅ GET .../admin/custom/products/import/template
   ✅ Headers: Authorization (no x-seller-id needed)
   ```

4. **Upload Excel with seller_id**:
   ```
   ✅ POST .../admin/custom/products/import
   ✅ Form data includes: seller_id + file
   ✅ seller_id: sel_01M0T3BYTKQF7RV18RX93XEAQD
   ```

5. **List all import jobs** (admin view):
   ```
   ✅ GET .../admin/custom/products/import?seller_id=sel_...&limit=20
   ✅ Should show all jobs for that seller
   ```

6. **Filter by status**:
   ```
   ✅ GET .../admin/custom/products/import?status=success
   ✅ GET .../admin/custom/products/import?status=failed
   ```

**Expected Result**: ✅ Admin can manage Excel imports for any seller, list/filter jobs

---

## 📊 Test Results Checklist

Mark each test as you complete it:

- [ ] ✅ Test 1: Admin Login Flow
- [ ] ✅ Test 2: Vendor Login Flow
- [ ] ✅ Test 3: Admin Orders - Real API
- [ ] ✅ Test 4: Pricing Module - Pending Products
- [ ] ✅ Test 5: Seller Markup Management
- [ ] ✅ Test 6: Vendor Products List
- [ ] ✅ Test 7: Vendor Orders List
- [ ] ✅ Test 8: Vendor Order Actions (if test data available)
- [ ] ✅ Test 9: Vendor Markup Info
- [ ] ✅ Test 10: Error Handling - 401 Unauthorized
- [ ] ✅ Test 11: Error Handling - Backend Timeout
- [ ] ✅ Test 12: Feature Flag Toggle
- [ ] ✅ Test 13: Excel Import - Vendor Bulk Upload ← NEW
- [ ] ✅ Test 14: Excel Import - Admin Upload for Seller ← NEW

---

## 🚨 Common Issues & Solutions

### Issue 1: "Backend timeout"

**Symptom**: Login takes 30+ seconds then fails

**Cause**: Render free tier backend is sleeping

**Solution**: 
1. Wait for timeout message
2. Retry login (backend now awake)
3. Should work on second attempt

---

### Issue 2: "401 Unauthorized" on every request

**Symptom**: All API calls return 401

**Cause**: Old/invalid token in localStorage

**Solution**:
```javascript
// Clear storage and login again
localStorage.clear()
// Then login normally
```

---

### Issue 3: Still seeing mock data

**Symptom**: Console shows 🎭 MOCK instead of 🌐 REAL

**Cause**: Feature flags not updated or server not restarted

**Solution**:
1. Check `.env.local` has `NEXT_PUBLIC_MOCK_ORDERS=false`
2. Restart dev server: `npm run dev`
3. Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

---

### Issue 4: Missing x-seller-id header

**Symptom**: Vendor requests fail with error about missing seller ID

**Cause**: seller_id not fetched during login

**Solution**:
1. Check console for "Vendor seller_id: sel_..."
2. If missing, check `/vendor/sellers/me` endpoint is accessible
3. Verify default seller ID in `.env.local`: `NEXT_PUBLIC_DEFAULT_SELLER_ID=sel_01M0T3BYTKQF7RV18RX93XEAQD`

---

### Issue 5: CORS errors

**Symptom**: Network tab shows CORS policy errors

**Cause**: Backend CORS not configured for localhost:3000

**Solution**:
- Should be configured on backend
- If persists, may need to add proxy in next.config.js
- Check with backend team

---

## 🎯 Success Criteria

Integration is considered **fully working** when:

✅ Admin can login and see real JWT in localStorage  
✅ Vendor can login and seller_id is fetched automatically  
✅ Admin orders page loads data from real backend  
✅ Pricing pending products loads from real backend  
✅ Seller markup can be fetched and updated  
✅ Vendor products list includes x-seller-id header  
✅ 401 errors trigger logout and redirect to login  
✅ Backend timeouts show helpful message  
✅ Feature flags toggle between mock/real modes  
✅ No CORS errors in console  

---

## 📝 Reporting Issues

If tests fail, capture:

1. **Browser console logs** (copy full output)
2. **Network tab** (screenshot of failed request)
3. **Request headers** (from Network tab)
4. **Response body** (from Network tab)
5. **localStorage state**:
   ```javascript
   console.log('Auth token:', localStorage.getItem('auth-token'))
   console.log('Auth storage:', localStorage.getItem('auth-storage'))
   ```

---

## 🔄 Next Steps After Testing

Once all tests pass:

1. **Document any issues found**
2. **Update integration guide with learnings**
3. **Test with real user workflows** (end-to-end scenarios)
4. **Performance testing** (how fast are API calls?)
5. **Integration testing** (multiple modules together)
6. **Prepare for staging deployment**

---

**Last Updated**: 2026-08-26  
**Tester**: _________________  
**Test Date**: _________________  
**Test Status**: 🟡 Pending
