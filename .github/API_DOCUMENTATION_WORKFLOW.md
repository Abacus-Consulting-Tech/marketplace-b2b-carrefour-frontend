# API Documentation Workflow

**Purpose**: Keep dev-tools, API_STATUS.md, and PROJECT_STATE.md synchronized as new endpoints are implemented.

**Last Updated**: 2026-08-28

**Official Hierarchy**: See `.github/ai/DOCUMENTATION_HIERARCHY.md` for the authoritative data flow diagram and rules.

**Quick Reference**: Key Principle: Source of truth is `src/app/(backoffice)/admin/dev-tools/page.tsx`. Data flows DOWN only: dev-tools → API_STATUS → PROJECT_STATE. Never update higher levels to sync with lower levels.

---

## File Hierarchy & Purposes

### 1. `src/app/(backoffice)/admin/dev-tools/page.tsx` (🟢 SOURCE OF TRUTH)
- **Purpose**: Comprehensive endpoint registry (140+ endpoints with metadata)
- **Scope**: All endpoints—real, mock, working, broken, untested
- **Authority**: This is the primary reference. All other docs sync FROM this file.
- **Maintainer**: Backend/Frontend integration engineer when adding endpoints
- **Content**:
  - `EndpointInfo` interface with path, method, module, status, etc.
  - Organized by module (Auth, Orders, Pricing, Openings, Products, etc.)
  - Real API status indicators (working, broken, untested)
  - Mock vs. Real API flags
  - Comments explaining RBAC issues or workflow validation

**When to update dev-tools:**
- Every time you add a new API endpoint
- When status changes (untested → working, working → broken)
- When validating complete workflows

---

### 2. `.github/ai/API_STATUS.md` (🟡 SUMMARY REFERENCE)
- **Purpose**: Concise API status for AI agents and quick human reference
- **Scope**: Only implemented endpoints (real + mock)
- **Authority**: Derived FROM dev-tools. Sync every 2-3 days or before major commits.
- **Maintainer**: Integration engineer or tech lead
- **Content**:
  - Organized by readiness: Real (✅) vs. Mock (🎭)
  - Grouped by module with endpoint counts
  - Known issues and RBAC problems
  - Workflow validation status

**When to update API_STATUS.md:**
- After adding 3-5 new endpoints to dev-tools
- When an endpoint status changes (broken/working)
- After workflow validation
- Before creating deployment releases

---

### 3. `.github/ai/PROJECT_STATE.md` (🔵 ARCHITECTURAL OVERVIEW)
- **Purpose**: High-level project state for AI agents and strategic planning
- **Scope**: Modules, architecture, workflows, blocking issues
- **Authority**: Derived FROM API_STATUS.md and dev-tools
- **Maintainer**: Tech lead or project coordinator
- **Content**:
  - Module status table (simpler than API_STATUS)
  - Architecture summary
  - Business workflows
  - Current priorities and blocking issues

**When to update PROJECT_STATE.md:**
- When blocking issues change
- When module status changes (Mock → Real, etc.)
- Weekly or on sprint boundaries
- Less frequently than API_STATUS.md

---

## Workflow: Adding a New Endpoint

### Step 1: Implement in dev-tools (Source of Truth)
**File**: `src/app/(backoffice)/admin/dev-tools/page.tsx`

Add endpoint object in the `allEndpoints` array:

```typescript
{
  path: '/admin/custom/new-resource',
  method: 'POST',
  module: 'your-module',
  description: 'Brief description of what this does',
  usesRealAPI: !featureFlags.shouldUseMock('your-module'),
  status: 'untested', // or 'working' if validated
  requiresAuth: true,
  medusaEndpoint: '/admin/custom/new-resource'
}
```

**Considerations**:
- `status` should initially be 'untested' or 'working' after validation
- Use `module` from existing modules (auth, orders, pricing, etc.)
- Set `usesRealAPI` based on feature flag or backend readiness
- Update JSDoc header comment with new endpoint count

---

### Step 2: Update API_STATUS.md (Every 3-5 endpoints)
**File**: `.github/ai/API_STATUS.md`

#### If endpoint is REAL/WORKING:
Add to appropriate "Real API" section:

```markdown
### Your Module (X endpoints)
- `POST /admin/custom/new-resource` — Brief description (status)
```

Update header counts and section headers.

#### If endpoint is MOCK:
Add to "Mock API - In Development" section:

```markdown
### Your Module (X endpoints)
- Brief description of all endpoints in this category
- **Status**: 🎭 MOCK — Backend pending
```

---

### Step 3: Update PROJECT_STATE.md (Weekly or after major change)
**File**: `.github/ai/PROJECT_STATE.md`

Update the **Main Modules** table:

```markdown
| **Your Module** | Purpose description | ✅ | Status badge |
```

Where status badge is:
- `✅ Ready` — Real API, fully working
- `⚠️ Partial` — Real API, some endpoints broken/untested
- `🟡 Dev` — Real API, still in development
- `🟡 Mock` — Mock API only

**IMPORTANT**: Status MUST match API_STATUS.md exactly. See `.github/CONSISTENCY_VALIDATOR.md` to prevent misalignment.

---

## Quick Reference Checklist

### When adding a new endpoint:
- [ ] Add to `dev-tools/page.tsx` with full metadata
- [ ] Update JSDoc header comment in dev-tools (endpoint count)
- [ ] Test endpoint status (working/broken/untested)
- [ ] Update feature flag in `src/config/feature-flags.ts` if needed

### When syncing documentation (every 3-5 endpoints or after validation):
- [ ] Review dev-tools for new/changed endpoints
- [ ] Update API_STATUS.md with endpoint list and counts
- [ ] Update API_STATUS.md workflow status if applicable
- [ ] Add to "Known Issues" if broken

### When module status changes (weekly):
- [ ] Check API_STATUS.md for summary
- [ ] Update PROJECT_STATE.md Main Modules table
- [ ] Update PROJECT_STATE.md Current Priorities if blocking issues change
- [ ] Update Current API Status section if needed

---

## Sync Frequency

| File | Frequency | Trigger |
|------|-----------|---------|
| dev-tools | Every endpoint add/change | Immediate during dev |
| API_STATUS.md | Every 3-5 endpoints | After batch implementation |
| PROJECT_STATE.md | Weekly or sprint boundary | Strategic reviews |

---

## Example: Adding Orders Module Endpoints

### 1. dev-tools (immediate):
```typescript
// Add to dev-tools/page.tsx
{
  path: '/admin/custom/orders/new',
  method: 'POST',
  module: 'orders',
  description: 'Create order (admin)',
  usesRealAPI: !featureFlags.shouldUseMock('orders'),
  status: 'working',
  requiresAuth: true,
  medusaEndpoint: '/admin/custom/orders'
}

// Update header:
// ✅ Admin Orders: 9 endpoints - REAL API (was 8)
```

### 2. API_STATUS.md (after 2-3 endpoints):
```markdown
### Orders Module (18 endpoints)
- `POST /admin/custom/orders/new` — Create order (working)
- ... other endpoints ...
- **Status**: ✅ WORKING — Complete workflow validated
```

### 3. PROJECT_STATE.md (weekly review):
```markdown
| **Orders** | Multi-role views, fulfillment | ✅ | ✅ Ready |
```

---

## Rules for Consistency

1. **Module names**: Use existing module names (auth, orders, pricing, suppliers, openings, products, catalog, checkout, franchisees, quotes, categories, excel)
2. **Status values**: Only use 'working', 'broken', or 'untested' in dev-tools
3. **Real vs. Mock**: Real API must be validated before marking as "working"
4. **Endpoint counts**: Update header comments when adding endpoints
5. **Feature flags**: Check `src/config/feature-flags.ts` for module configuration

---

## Common Mistakes to Avoid

❌ **Don't**:
- Update only API_STATUS.md without updating dev-tools first
- Leave endpoints marked as "untested" without validating them
- Add new modules without checking existing ones first
- Forget to update endpoint counts in dev-tools header

✅ **Do**:
- Update dev-tools FIRST when adding endpoints
- Validate endpoints before marking as "working"
- Check existing module names in dev-tools
- Keep descriptions brief and consistent
- Update header comments with new counts

---

## Questions?

Refer to:
- **For endpoint structure**: See `src/app/(backoffice)/admin/dev-tools/page.tsx` (EndpointInfo interface)
- **For current status**: Check `http://localhost:3000/admin/dev-tools` (UI view)
- **For architecture**: See `src/config/feature-flags.ts` (module flags)
- **For validation dates**: Check dev-tools header or API_STATUS.md updated dates
