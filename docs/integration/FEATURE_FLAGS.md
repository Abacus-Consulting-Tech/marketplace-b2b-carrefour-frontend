# Feature Flags System

**Location:** `/src/config/feature-flags.ts`  
**Created:** 2026-08-21  
**Purpose:** Centralized control for module mock/real API modes

---

## 📋 Overview

The Feature Flags system provides **module-level control** for switching between mock data and real API calls. This enables:

- ✅ **Gradual backend integration** - Migrate modules one at a time
- ✅ **Hybrid deployments** - Mix of mock and real APIs in production
- ✅ **Easy rollback** - Instant switch back to mock if issues arise
- ✅ **Clear visibility** - Dashboard shows status of all modules
- ✅ **Team coordination** - Everyone knows what's ready

---

## 🎯 Quick Start

### **Check Current Status**

Visit the dev tools dashboard:
```
http://localhost:3000/admin/dev-tools
```

Or check the console on page load (development mode only):
```
🎛️ Feature Flags Status
🎭 pricing      | Mock       | Backend: ⏳ No  | UI complete, backend API in progress
🌐 products     | Real API   | Backend: ✅ Yes | Live in production
🎭 openings     | Mock       | Backend: ⏳ No  | Mock data ready, backend not started yet
```

---

## 🔧 Configuration

### **Module Configuration Structure**

```typescript
// src/config/feature-flags.ts
modules: {
  pricing: {
    useMock: true,                         // Use mock data?
    backendReady: false,                   // Is backend API ready?
    apiBaseUrl: '/api/products/pricing',   // API endpoint
    notes: 'UI complete, backend in progress',  // Status notes
    lastUpdated: '2026-08-21',             // Last change date
  }
}
```

### **Available Modules**

| Module | Description | Initial State |
|--------|-------------|---------------|
| `auth` | Authentication & SSO | Mock (backend not ready) |
| `pricing` | Product pricing approval | Mock (backend in progress) |
| `openings` | Openings/quotes module | Mock (not started) |
| `products` | Product catalog | Real (live in production) |
| `suppliers` | Supplier management | Mock (planned) |
| `categories` | Category management | Mock (planned) |
| `quotes` | Quote requests | Mock (future release) |

---

## 🚀 Usage in API Clients

### **Pattern: Dual-Mode API Client**

```typescript
// src/lib/api/your-module-client.ts
import { featureFlags } from '@/config/feature-flags';

// Check if should use mock
const isMockMode = featureFlags.shouldUseMock('pricing');
const apiBaseUrl = featureFlags.getApiBaseUrl('pricing');

export const yourApi = {
  async someMethod(data: SomeRequest) {
    // Mock mode
    if (isMockMode) {
      console.log('🎭 Using MOCK data for pricing');
      return mockSomeMethod(data);
    }
    
    // Real API mode
    console.log('🌐 Using REAL API for pricing');
    const response = await fetch(`${apiBaseUrl}/endpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  },
};
```

### **Helper Methods**

```typescript
// Check if using mock
featureFlags.shouldUseMock('pricing')  // → true or false

// Check if backend ready
featureFlags.isBackendReady('pricing')  // → true or false

// Get API base URL
featureFlags.getApiBaseUrl('pricing')  // → '/api/products/pricing'

// Get full config
featureFlags.getModuleConfig('pricing')  // → ModuleConfig object

// Get all status
featureFlags.getStatus()  // → Array of status objects

// Log to console
featureFlags.logStatus()  // Prints formatted table
```

---

## 📅 Migration Workflow

### **Step 1: Backend Development (Week 1-2)**

```typescript
pricing: {
  useMock: true,           // Frontend uses mock
  backendReady: false,     // Backend not ready yet
  notes: 'Backend team building API'
}
```

**Who:** Backend team develops API  
**Frontend:** Continues with mock data

---

### **Step 2: Backend Ready (Week 3)**

```typescript
pricing: {
  useMock: true,           // Still using mock
  backendReady: true,      // ✅ Backend says ready!
  notes: 'Backend ready, preparing to test'
}
```

**Who:** Backend team deploys to dev/staging  
**Frontend:** Can test anytime, no rush

---

### **Step 3: Testing (Week 3-4)**

```typescript
pricing: {
  useMock: false,          // 🔄 Switched to real
  backendReady: true,
  notes: 'Testing real API in development'
}
```

**Who:** Both teams test integration  
**Action:** Find and fix bugs together

---

### **Step 4: Production (Week 4+)**

```typescript
pricing: {
  useMock: false,          // ✅ Live
  backendReady: true,
  notes: 'Live in production'
}
```

**Who:** QA verifies in production  
**Action:** Monitor for issues

---

## 🔄 Common Scenarios

### **Scenario 1: Backend Says "API Ready"**

**Action:** Mark as ready, but keep mock
```typescript
pricing: {
  useMock: true,      // Keep mock for safety
  backendReady: true, // ✅ Update this
  notes: 'Backend ready, will test tomorrow'
}
```

**Why:** Backend is ready, but you can test when convenient

---

### **Scenario 2: Ready to Test**

**Action:** Flip to real API
```typescript
pricing: {
  useMock: false,     // 🔄 Change this
  backendReady: true,
  notes: 'Testing real API in dev'
}
```

**Why:** Ready to see real data and test integration

---

### **Scenario 3: Found a Bug**

**Action:** Instant rollback
```typescript
pricing: {
  useMock: true,      // ⏪ Rollback
  backendReady: true,
  notes: 'Bug in backend /approve endpoint, rolled back'
}
```

**Why:** Backend team can fix while frontend keeps working

---

### **Scenario 4: Different Per Environment**

**Development (.env.local):**
```env
NEXT_PUBLIC_MOCK_PRICING=false  # Test real API
```

**Staging (.env.staging):**
```env
NEXT_PUBLIC_MOCK_PRICING=false  # Real API
NEXT_PUBLIC_MOCK_OPENINGS=true   # Not ready
```

**Production (.env.production):**
```env
# All real (or omit for defaults)
NEXT_PUBLIC_MOCK_PRICING=false
```

---

## 🎨 Dev Tools Dashboard

### **Access**

Navigate to: `http://localhost:3000/admin/dev-tools`

### **Features**

- **Summary Cards:** Quick counts of mock/real/ready modules
- **Status Table:** Full details of each module
- **Instructions:** Copy-paste examples for updates
- **Environment Info:** Current mode and config location

### **What You See**

```
Development Tools
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌─────────────┬────────────┬───────────────┬─────────────┐
│ Module      │ Mode       │ Backend Ready │ Notes       │
├─────────────┼────────────┼───────────────┼─────────────┤
│ pricing     │ 🎭 Mock    │ ✅ Yes        │ Testing...  │
│ products    │ 🌐 Real API│ ✅ Yes        │ Live        │
│ openings    │ 🎭 Mock    │ ⏳ No         │ Planned     │
└─────────────┴────────────┴───────────────┴─────────────┘
```

---

## 🌍 Environment Variables

### **Override Individual Modules**

```env
# .env.local (your local machine)
NEXT_PUBLIC_MOCK_AUTH=true      # Override auth
NEXT_PUBLIC_MOCK_PRICING=false  # Override pricing (test real)
NEXT_PUBLIC_MOCK_OPENINGS=true  # Override openings

# Other modules use feature-flags.ts defaults
```

### **Priority**

1. **Environment variable** (if set) - Highest priority
2. **feature-flags.ts default** - Fallback

### **Example**

```typescript
// feature-flags.ts says:
pricing: { useMock: true }

// .env.local says:
NEXT_PUBLIC_MOCK_PRICING=false

// Result: Uses REAL API (env var wins)
```

---

## 📊 Adding a New Module

### **Step 1: Add to Config**

```typescript
// src/config/feature-flags.ts
modules: {
  // ... existing modules
  
  myNewModule: {
    useMock: true,
    backendReady: false,
    apiBaseUrl: '/api/my-new-module',
    notes: 'New module in development',
    lastUpdated: '2026-08-22',
  } satisfies ModuleConfig,
}
```

### **Step 2: Update Type**

```typescript
type ModuleName = 
  | 'auth' 
  | 'pricing' 
  | 'openings' 
  | 'products'
  | 'myNewModule';  // ← Add here
```

### **Step 3: Create API Client**

```typescript
// src/lib/api/my-new-module-client.ts
import { featureFlags } from '@/config/feature-flags';

const isMockMode = featureFlags.shouldUseMock('myNewModule');
const apiBaseUrl = featureFlags.getApiBaseUrl('myNewModule');

export const myNewModuleApi = {
  async getData() {
    if (isMockMode) {
      return { data: 'mock data' };
    }
    const res = await fetch(`${apiBaseUrl}/data`);
    return res.json();
  },
};
```

### **Step 4: Verify**

- Visit `/admin/dev-tools`
- See your new module in the table
- Test switching mock/real

---

## ✅ Best Practices

### **1. Update Notes**

Always update the `notes` field when changing status:
```typescript
pricing: {
  useMock: false,
  backendReady: true,
  notes: 'Switched to real API on 2026-08-22 - testing' // ← Helpful!
}
```

### **2. Update Date**

Update `lastUpdated` when making changes:
```typescript
lastUpdated: '2026-08-22',  // ← Keep current
```

### **3. Test Before Switching**

```typescript
// Step 1: Mark ready but keep mock
backendReady: true,
useMock: true,  // Safe

// Step 2: Test in isolation first
// (e.g., .env.local override)

// Step 3: Then flip the default
useMock: false,  // Confident
```

### **4. Document Backend Changes**

```typescript
notes: 'Backend v2.1 deployed - added new /bulk endpoint'
```

### **5. Use Console Logging**

The system auto-logs in development:
```
🎭 Pricing API Mode: MOCK (Backend Ready: No ⏳)
```

Look for these logs to verify mode!

---

## 🐛 Troubleshooting

### **Issue: Module using wrong mode**

**Check:**
1. Console logs show correct mode?
2. Environment variable overriding?
3. feature-flags.ts updated?
4. Server restarted after changes?

**Solution:**
```bash
# Clear any env overrides
rm .env.local

# Restart server
npm run dev

# Check /admin/dev-tools dashboard
```

---

### **Issue: Backend ready but still using mock**

**This is expected!** `backendReady: true` means backend is available, but `useMock` controls which mode to use.

**To switch:**
```typescript
useMock: false,  // ← Change this
backendReady: true,
```

---

### **Issue: Environment variable not working**

**Check naming:**
```env
✅ NEXT_PUBLIC_MOCK_PRICING=false  # Correct
❌ NEXT_PUBLIC_MOCK_PRODUCTS=false # Wrong (should be pricing)
❌ MOCK_PRICING=false               # Missing NEXT_PUBLIC_
```

**Restart required:**
```bash
# After editing .env.local
npm run dev  # Must restart
```

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `src/config/feature-flags.ts` | Main configuration |
| `src/lib/api/products-pricing-client.ts` | Example usage |
| `src/app/(backoffice)/admin/dev-tools/page.tsx` | Status dashboard |
| `.env.local` | Environment overrides |
| `docs/integration/FEATURE_FLAGS.md` | This documentation |

---

## 🚦 Status Legend

| Icon | Meaning |
|------|---------|
| 🎭 | Mock mode (using fake data) |
| 🌐 | Real API mode (hitting backend) |
| ✅ | Backend ready |
| ⏳ | Backend not ready yet |
| 🔄 | Switching modes |
| ⏪ | Rolled back to mock |

---

## 📞 Support

**Questions?**
- Check `/admin/dev-tools` dashboard first
- Review this documentation
- Ask in #frontend or #backend channels

**Updates Needed?**
- Edit `src/config/feature-flags.ts`
- Update `lastUpdated` date
- Document in `notes` field

---

**Last Updated:** 2026-08-21  
**Maintained By:** Frontend Team
