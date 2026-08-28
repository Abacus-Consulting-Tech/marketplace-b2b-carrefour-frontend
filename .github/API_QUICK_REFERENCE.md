# API Documentation Quick Reference

**TL;DR**: Keep these three files in sync as you develop APIs.

---

## The Three Files

| File | Purpose | When to Update | Who Updates |
|------|---------|-----------------|------------|
| `src/app/.../dev-tools/page.tsx` | 🟢 **SOURCE OF TRUTH** — Full endpoint registry (140+) | Every endpoint add/change | Dev/DevOps |
| `.github/ai/API_STATUS.md` | 🟡 Summary for AI agents & quick ref | Every 3-5 endpoints | Integrator |
| `.github/ai/PROJECT_STATE.md` | 🔵 Module-level overview & priorities | Weekly or sprint boundary | Tech Lead |

---

## Workflow When Adding an Endpoint

```
You implement a new endpoint
         ↓
1. Add EndpointInfo object to dev-tools/page.tsx ✅
   - path, method, module, description, status
   - Mark status as: 'untested' → test → 'working' or 'broken'
         ↓
2. After 3-5 new endpoints, update API_STATUS.md 🟡
   - Copy endpoint names from dev-tools
   - Group by module
   - Update counts
         ↓
3. Weekly: update PROJECT_STATE.md 🔵
   - Review module status
   - Update Main Modules table
   - Update Priorities if needed
```

---

## Quick Commands

### View live status:
```
http://localhost:3000/admin/dev-tools
```

### Check module status:
```bash
grep -n "module:" src/app/(backoffice)/admin/dev-tools/page.tsx | head -20
```

### Check current feature flags:
```bash
cat src/config/feature-flags.ts | grep -A 5 "modules:"
```

---

## Status Values in dev-tools

```typescript
status: 'working'    // ✅ Tested & working
status: 'broken'     // ❌ Returns error or 403
status: 'untested'   // ⚠️ Implemented but not validated
```

---

## Real vs. Mock in dev-tools

```typescript
usesRealAPI: true   // ✅ Connected to Medusa backend
usesRealAPI: false  // 🎭 Using mock data (fallback)
```

---

## File Location Reminder

```
.github/
├── API_DOCUMENTATION_WORKFLOW.md  ← Full guide (read first)
├── API_QUICK_REFERENCE.md         ← This file
├── ai/
│   ├── API_STATUS.md              ← Endpoint summary (update every 3-5 endpoints)
│   └── PROJECT_STATE.md           ← Module overview (update weekly)

src/app/(backoffice)/admin/dev-tools/page.tsx  ← Source of truth (update immediately)
src/config/feature-flags.ts                     ← Feature switches (update when needed)
```

---

## Examples

### Adding an endpoint to dev-tools:
```typescript
{
  path: '/admin/custom/orders/bulk-update',
  method: 'PATCH',
  module: 'orders',
  description: 'Bulk update order statuses',
  usesRealAPI: !featureFlags.shouldUseMock('orders'),
  status: 'working',  // after testing
  requiresAuth: true,
  medusaEndpoint: '/admin/custom/orders/bulk-update'
}
```

### Adding to API_STATUS.md (after testing):
```markdown
### Orders (18 endpoints)
- `PATCH /admin/custom/orders/bulk-update` — Bulk update statuses (working)
```

### Updating PROJECT_STATE.md:
```markdown
| **Orders** | Multi-role views, fulfillment | ✅ | ✅ Ready |
```

---

## Common Modules

Use these exact names in `module: '...'`:
- `auth` — Authentication
- `orders` — Orders (admin, supplier, franchisee)
- `pricing` — Product approval & markup
- `suppliers` — Vendor management
- `products` — Catalog CRUD
- `openings` — Store projects
- `quotes` — Quotations
- `franchisees` — Franchisee management
- `categories` — Product categories
- `checkout` — Payment & cart
- `catalog` — Franchisee catalog view
- `excel` — Excel import/export

---

## Critical: Status Alignment Rule

⚠️ **If API_STATUS.md says `✅ WORKING`, PROJECT_STATE.md MUST say `✅ Ready`**

Misalignment causes agents to waste time investigating resolved issues.

See `.github/CONSISTENCY_VALIDATOR.md` for alignment rules and checklist.

---

## Checklist Before Commit

- [ ] New endpoint in dev-tools with correct status
- [ ] Endpoint status is 'working' or 'broken' (not "in progress")
- [ ] API_STATUS.md updated (if 3+ new endpoints)
- [ ] PROJECT_STATE.md updated (if module status changed)
- [ ] Feature flags checked (if new module)

---

## Need More Help?

See `.github/API_DOCUMENTATION_WORKFLOW.md` for:
- Detailed explanation of each file
- Sync frequency guidelines
- Example workflow walkthrough
- Rules for consistency
- Common mistakes to avoid
