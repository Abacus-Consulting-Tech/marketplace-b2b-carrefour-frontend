# API Clients Migration to Feature Flags

**Date:** 2026-08-21  
**Status:** ✅ Complete  
**Migration Type:** Internal implementation change (no breaking changes)

---

## 📋 Overview

All API clients have been migrated from direct environment variable checks to use the centralized **Feature Flags system** (`src/config/feature-flags.ts`).

### ✅ Benefits
- **Centralized control** - All mock/real mode configuration in one place
- **Consistent logging** - All modules log their mode on initialization
- **Easy backend readiness tracking** - Know which APIs are ready to use
- **Flexible overrides** - Environment variables still work for per-env overrides
- **No breaking changes** - All existing code continues to work

---

## 🔄 Migrated Clients

### 1. **Products Pricing API** ✅
**File:** `src/lib/api/products-pricing-client.ts`

**Before:**
```typescript
const isMockMode = process.env.NEXT_PUBLIC_MOCK_PRICING === 'true';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
```

**After:**
```typescript
import { featureFlags } from '@/config/feature-flags';

const isMockMode = featureFlags.shouldUseMock('pricing');
const API_BASE_URL = featureFlags.getApiBaseUrl('pricing') || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

// Log mode on initialization
if (typeof window !== 'undefined') {
  console.log(
    `${isMockMode ? '🎭' : '🌐'} Pricing API Mode: ${isMockMode ? 'MOCK' : 'REAL'}`,
    `(Backend Ready: ${featureFlags.isBackendReady('pricing') ? 'Yes ✅' : 'No ⏳'})`
  );
}
```

**Used by:** 30+ components
- Supplier: Product proposal form, products list
- Admin: Pricing queue, product review panel
- All pricing-related workflows

---

### 2. **Openings API** ✅
**File:** `src/lib/api/openings-client.ts`

**Before:**
```typescript
const isMockMode = process.env.NEXT_PUBLIC_MOCK_OPENINGS === 'true';
```

**After:**
```typescript
import { featureFlags } from '@/config/feature-flags';

const isMockMode = featureFlags.shouldUseMock('openings');
const API_BASE_URL = featureFlags.getApiBaseUrl('openings') || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

// Log mode on initialization
if (typeof window !== 'undefined') {
  console.log(
    `${isMockMode ? '🎭' : '🌐'} Openings API Mode: ${isMockMode ? 'MOCK' : 'REAL'}`,
    `(Backend Ready: ${featureFlags.isBackendReady('openings') ? 'Yes ⏳' : 'No ⏳'})`
  );
}
```

**Used by:** 10+ pages
- Admin: Project management, documents, status changes
- Franchisee: Project view, quote comparison
- Supplier: Invitations, quote submission

---

### 3. **Auth API (Mock)** ✅
**File:** `src/lib/api/mock.ts`

**Before:**
```typescript
export const mockApi = {
  isMockMode: () => {
    return process.env.NEXT_PUBLIC_MOCK_AUTH === "true";
  },
  // ...
}
```

**After:**
```typescript
import { featureFlags } from '@/config/feature-flags';

export const mockApi = {
  isMockMode: () => {
    return featureFlags.shouldUseMock('auth');
  },
  // ...
}
```

**Used by:** 15+ pages
- Login, forgot password, registration flows
- Dashboard pages (all roles)
- Order management
- Profile pages

---

## 🎯 Current Module Status

| Module | Mode | Backend Ready | API Base URL | Notes |
|--------|------|---------------|--------------|-------|
| **auth** | 🎭 Mock | ⏳ No | `/api/auth` | SSO integration pending |
| **pricing** | 🎭 Mock | ⏳ No | `/api/products/pricing` | Backend API documented, not deployed |
| **openings** | 🎭 Mock | ⏳ No | `/api/openings` | Mock data ready, backend not started |
| **products** | 🌐 Real | ✅ Yes | `/api/products` | Live in production |
| **suppliers** | 🎭 Mock | ⏳ No | `/api/suppliers` | Planned for next sprint |
| **categories** | 🎭 Mock | ⏳ No | `/api/categories` | Planned for next sprint |
| **quotes** | 🎭 Mock | ⏳ No | `/api/quotes` | Future release |

---

## 🔍 How to Verify

### 1. **Check Console Logs**

Start the dev server:
```bash
npm run dev
```

Open browser console, you should see:
```
🎛️ Feature Flags Status
🎭 pricing      | Mock       | Backend: ⏳ No  | UI complete, backend in progress
🌐 products     | Real API   | Backend: ✅ Yes | Live in production
🎭 openings     | Mock       | Backend: ⏳ No  | Mock data ready
🎭 auth         | Mock       | Backend: ⏳ No  | Waiting for SSO integration
...
```

### 2. **Test Each Module**

Navigate to different sections and check console:
- Login → See "Auth API Mode: MOCK"
- Supplier Products → See "Pricing API Mode: MOCK"
- Admin Openings → See "Openings API Mode: MOCK"

### 3. **Visit Dev Tools Dashboard**

```
http://localhost:3000/admin/dev-tools
```

See all modules in one place with:
- Summary cards (Mock count, Real count, Backend ready count)
- Detailed table with all module information
- Instructions for switching modes

---

## 🔄 How to Switch a Module from Mock to Real

### Step 1: Backend Says "Ready"

Backend team deploys the API and confirms it's ready for testing.

**Update:** `src/config/feature-flags.ts`
```typescript
pricing: {
  useMock: true,           // Keep mock for safety
  backendReady: true,      // ✅ Mark as ready
  apiBaseUrl: '/api/products/pricing',
  notes: 'Backend deployed to dev, ready for testing',
  lastUpdated: '2026-08-22',
}
```

### Step 2: Test Real API

When ready to test integration:

**Update:** `src/config/feature-flags.ts`
```typescript
pricing: {
  useMock: false,          // 🔄 Switch to real
  backendReady: true,
  apiBaseUrl: '/api/products/pricing',
  notes: 'Testing real API in development',
  lastUpdated: '2026-08-22',
}
```

### Step 3: Verify in Console

Restart dev server and check console:
```
🌐 Pricing API Mode: REAL (Backend Ready: Yes ✅)
```

### Step 4: Test Workflow

Test all features using real backend:
- Create products
- Review queue
- Approve/reject
- Check data persists

### Step 5: Rollback if Issues

If bugs found, instant rollback:
```typescript
pricing: {
  useMock: true,           // ⏪ Back to mock
  backendReady: true,
  notes: 'Bug found in /approve endpoint, rolled back',
  lastUpdated: '2026-08-22',
}
```

---

## 🌍 Environment-Specific Overrides

### Development (.env.local)
```env
# Test pricing with real API locally
NEXT_PUBLIC_MOCK_PRICING=false

# Keep others in mock
NEXT_PUBLIC_MOCK_OPENINGS=true
NEXT_PUBLIC_MOCK_AUTH=true
```

### Staging (.env.staging)
```env
# Real APIs that are ready
NEXT_PUBLIC_MOCK_PRICING=false
NEXT_PUBLIC_MOCK_PRODUCTS=false

# Mock for not-ready modules
NEXT_PUBLIC_MOCK_OPENINGS=true
NEXT_PUBLIC_MOCK_AUTH=true
```

### Production (.env.production)
```env
# All real (or omit for feature-flags.ts defaults)
NEXT_PUBLIC_MOCK_AUTH=false
NEXT_PUBLIC_MOCK_PRICING=false
NEXT_PUBLIC_MOCK_OPENINGS=false
NEXT_PUBLIC_MOCK_PRODUCTS=false
```

---

## 📊 Usage Statistics

### Files Updated
- `src/config/feature-flags.ts` - Created (200 lines)
- `src/lib/api/products-pricing-client.ts` - Updated (5 lines changed)
- `src/lib/api/openings-client.ts` - Updated (10 lines changed)
- `src/lib/api/mock.ts` - Updated (5 lines changed)
- `src/app/(backoffice)/admin/dev-tools/page.tsx` - Created (280 lines)
- `docs/integration/FEATURE_FLAGS.md` - Created (500+ lines)
- `docs/integration/API_CLIENTS_MIGRATION.md` - This file

### Files Using These Clients
- **Pricing API:** 30+ files (components + pages)
- **Openings API:** 10+ files (admin + franchisee + supplier)
- **Auth Mock:** 15+ files (all auth flows + dashboards)

### Zero Breaking Changes
All existing imports and usage continue to work:
```typescript
import { pricingApi } from '@/lib/api/products-pricing-client';
import { openingsApi } from '@/lib/api/openings-client';
import { mockApi } from '@/lib/api/mock';
```

---

## 🧪 Testing Checklist

### ✅ Pricing Module
- [ ] Supplier can propose products (mock mode)
- [ ] Admin can review pending queue (mock mode)
- [ ] Approve/reject works correctly
- [ ] Console shows "🎭 Pricing API Mode: MOCK"
- [ ] Switch to real mode updates console to "🌐 Pricing API Mode: REAL"

### ✅ Openings Module
- [ ] Admin can create projects (mock mode)
- [ ] Franchisee can view projects
- [ ] Supplier can submit quotes
- [ ] Console shows "🎭 Openings API Mode: MOCK"

### ✅ Auth Module
- [ ] Login works with mock users
- [ ] Session persists correctly
- [ ] Logout clears state
- [ ] mockApi.isMockMode() returns true

### ✅ Dev Tools Dashboard
- [ ] Accessible at `/admin/dev-tools`
- [ ] Shows all 7 modules
- [ ] Summary cards show correct counts
- [ ] Table displays all module details
- [ ] Instructions are clear

---

## 📞 Troubleshooting

### Issue: Console not showing mode logs

**Cause:** Server not restarted after changes  
**Solution:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

### Issue: Module using wrong mode

**Debug:**
1. Check `src/config/feature-flags.ts` - What's the default?
2. Check `.env.local` - Any overrides?
3. Check browser console - What mode is logged?
4. Visit `/admin/dev-tools` - What does dashboard show?

**Solution:**
```bash
# Clear any env overrides
rm .env.local

# Restart server
npm run dev
```

---

### Issue: Environment variable not working

**Check:**
```env
✅ NEXT_PUBLIC_MOCK_PRICING=false  # Correct
❌ NEXT_PUBLIC_MOCK_PRODUCTS=false # Wrong module name
❌ MOCK_PRICING=false               # Missing NEXT_PUBLIC_
```

**Remember:** Must restart server after changing `.env.local`

---

## 🎯 Next Steps

### Immediate
1. ✅ All API clients migrated to feature flags
2. ✅ Dev tools dashboard created
3. ✅ Documentation complete
4. ⏳ Test all modules in mock mode
5. ⏳ Coordinate with backend team on API readiness

### When Backend Ready
1. ⏳ Backend team deploys pricing API
2. ⏳ Mark `backendReady: true` in feature flags
3. ⏳ Flip `useMock: false` when ready to test
4. ⏳ Test integration thoroughly
5. ⏳ Fix any issues, rollback if needed
6. ⏳ Deploy to production when stable

### Future
1. ⏳ Migrate remaining modules (suppliers, categories, quotes)
2. ⏳ Add metrics/monitoring per module
3. ⏳ Consider A/B testing capabilities
4. ⏳ Add automated tests for feature flag behavior

---

## 📚 Related Documentation

- [Feature Flags System](./FEATURE_FLAGS.md) - Complete guide
- [Testing Guide](../technical/TESTING_PRODUCTS_PRICING.md) - Test all features
- [Backend API Docs](../technical/providers/MANUAL_FRONTEND_PROPUESTA_PRODUCTOS_Y_TARIFICACION.md) - API endpoints

---

**Last Updated:** 2026-08-21  
**Maintained By:** Frontend Team  
**Status:** ✅ Migration Complete
