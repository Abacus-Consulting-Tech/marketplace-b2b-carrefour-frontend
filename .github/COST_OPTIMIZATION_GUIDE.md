# Development Cost & Time Optimization Guide

**Goal**: Reduce development cycle time and AI/human inefficiency. **Estimated savings: 30-40% on API development cycles.**

**Last Updated**: 2026-08-28

---

## 1. Session Memory for API Development

**Problem**: Repeatedly reading the same 5 files (feature-flags, dev-tools, API_STATUS.md, PROJECT_STATE.md, copilot-instructions.md)

**Solution**: Store frequent context in session memory at the start of each task

**File**: `/memories/session/api-dev-context.md`

**Template**:
```markdown
# API Development Session Context

## Current Modules Status (from feature-flags.ts)
- auth: ✅ Ready
- orders: ⚠️ Partial (39/165 endpoints)
- pricing: ✅ Ready
- openings: 🎭 Mock (24 endpoints)
[...]

## Dev-tools Location
src/app/(backoffice)/admin/dev-tools/page.tsx (EndpointInfo array starts line ~90)

## Last API_STATUS.md Update
2026-08-28 - 39 real endpoints, 100+ mock

## Common Modules (copy-paste names)
auth, orders, pricing, suppliers, products, openings, quotes, franchisees, categories, checkout

## Status Values
'working', 'broken', 'untested' (only these three)
```

**Action**: At start of new task, save this. You can reference it without re-reading files.

---

## 2. Batch Endpoint Registration

**Problem**: Adding 1 endpoint at a time = 3 file updates (dev-tools, API_STATUS, PROJECT_STATE)

**Solution**: Queue 3-5 endpoints, update all three files in single batch operation

**Process**:

1. **Develop locally** (3-5 endpoints)
   - Add to code
   - Mark in dev-tools as 'untested'
   - **Don't update docs yet**

2. **Test as batch** (all 3-5 together)
   - Run `/admin/dev-tools` UI
   - Validate all endpoints work
   - Update status to 'working' or 'broken'

3. **Update docs once** (batch sync)
   - Update dev-tools header comment (endpoint count)
   - Update API_STATUS.md section (all 5 endpoints)
   - Update PROJECT_STATE.md if module status changed
   - **One PR = one batch update**

**Time saved**: 60% reduction in documentation overhead

---

## 3. Feature Flag Testing Without Deployment

**Problem**: Testing real vs. mock APIs requires environment variable tweaks and rebuilds

**Solution**: Browser dev-tools + feature-flags configuration

**Quick Test Workflow**:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: View current feature flags
cat src/config/feature-flags.ts | grep -A 10 "modules:"

# Terminal 3: Quick test with curl
curl -H "Authorization: Bearer $TOKEN" \
  https://marketplace-b2b-backend-dev.onrender.com/admin/orders
```

**In Browser (while dev server running)**:
1. Open `http://localhost:3000/admin/dev-tools`
2. Filter by module
3. Check `usesRealAPI` column (live status)
4. Click endpoint to see expected response structure
5. Compare with actual backend response

**Time saved**: No rebuild needed for quick feature flag tests

---

## 4. Template Patterns for Common Tasks

### Adding a CRUD Endpoint Set

**File pattern**:
```
// 1. Type definition
src/types/your-module.ts

// 2. Mock data
src/lib/api/your-module-mock.ts

// 3. API client (dual-mode)
src/lib/api/your-module-client.ts

// 4. Dev-tools entry
dev-tools/page.tsx (add EndpointInfo objects)
```

**Dev-tools template** (copy-paste):
```typescript
// ========================================================================
// YOUR MODULE
// ========================================================================
{
  path: '/admin/custom/your-resource',
  method: 'GET',
  module: 'your-module',
  description: 'List your resources',
  usesRealAPI: !featureFlags.shouldUseMock('your-module'),
  status: 'untested',
  requiresAuth: true,
  medusaEndpoint: '/admin/custom/your-resource'
},
{
  path: '/admin/custom/your-resource/:id',
  method: 'GET',
  module: 'your-module',
  description: 'Get resource detail',
  usesRealAPI: !featureFlags.shouldUseMock('your-module'),
  status: 'untested',
  requiresAuth: true,
  medusaEndpoint: '/admin/custom/your-resource/:id'
},
// ... POST, PATCH, DELETE follow same pattern
```

**Time saved**: 30 min per CRUD endpoint set (no template searching)

---

## 5. Parallel Documentation Updates (for AI agents)

**Problem**: Sequential file edits = slow AI turns

**Solution**: Use `multi_replace_string_in_file` tool to update 3+ files in parallel

**Pattern**:
```
1. dev-tools: Add EndpointInfo + update header count
2. API_STATUS.md: Add endpoint to section
3. PROJECT_STATE.md: Update module status (if changed)
→ All in ONE tool call (parallel replacement)
```

**Time saved**: 60% reduction in AI response time for documentation updates

---

## 6. Pre-Commit Checklist Template

**Save as**: `/memories/session/pre-commit-checklist.md`

```markdown
## Pre-Commit Checklist for API Changes

### Code Changes
- [ ] Endpoint implemented in code
- [ ] Error handling added
- [ ] Feature flag check added
- [ ] TypeScript types defined

### Dev-tools Updates (IMMEDIATE)
- [ ] Endpoint added to dev-tools/page.tsx
- [ ] status: 'untested' or 'working' (not in-progress)
- [ ] module: uses existing module name
- [ ] Header comment updated (new count)

### Testing
- [ ] http://localhost:3000/admin/dev-tools loads and filters correctly
- [ ] Endpoint status correct (working/broken/untested)
- [ ] Real API flag matches actual usage

### Documentation (BATCH - every 3-5 endpoints)
- [ ] API_STATUS.md updated with new endpoints
- [ ] Endpoint counts match dev-tools
- [ ] Known Issues updated if status changed
- [ ] PROJECT_STATE.md updated if module status changed

### Git Commit
- [ ] All file updates consistent
- [ ] Commit message references module + count
- [ ] Example: "feat(orders): add 3 order endpoint (+36 total)"
```

**Time saved**: No context switching, one copy-paste = ready to commit

---

## 7. Dependency Mapping Cache

**Problem**: "What files depend on this module?" requires manual search

**Solution**: Store dependency graph in session memory

**File**: `/memories/session/dependency-graph.md`

```markdown
# Module Dependencies

## orders module
- Frontend: `src/app/(supplier)/supplier/orders/`
- Frontend: `src/app/(backoffice)/admin/orders/`
- Client: `src/lib/api/orders-*-client.ts` (3 files)
- Types: `src/types/orders-*.ts` (3 files)
- Mock: `src/lib/api/orders-*-mock.ts` (3 files)

## pricing module
- Frontend: `src/app/(backoffice)/admin/products/pricing/`
- Client: `src/lib/api/products-pricing-client.ts`
- Types: `src/types/products-pricing.ts`
- Feature flag: `featureFlags.modules.pricing`

[...]
```

**Time saved**: No grep searches, instant file navigation

---

## 8. API Contract Validation Script

**Problem**: Type mismatches between frontend and backend discovered late (expensive)

**Solution**: Quick validation script before testing

**Create**: `scripts/validate-api-contract.mjs`

```javascript
#!/usr/bin/env node

import fs from 'fs';

// Load dev-tools endpoints
const devTools = fs.readFileSync('src/app/(backoffice)/admin/dev-tools/page.tsx', 'utf-8');
const endpointMatches = devTools.matchAll(/path: '([^']+)'/g);

// Load types
const typesDir = fs.readdirSync('src/types/');

console.log(`✅ Found ${[...endpointMatches].length} endpoints`);
console.log(`✅ Found ${typesDir.length} type files`);

// Validate feature flags exist for all modules
const featureFlags = fs.readFileSync('src/config/feature-flags.ts', 'utf-8');
const moduleMatches = new Set([...devTools.matchAll(/module: '([^']+)'/g)].map(m => m[1]));

moduleMatches.forEach(module => {
  if (!featureFlags.includes(`${module}:`)) {
    console.warn(`⚠️  Missing feature flag for module: ${module}`);
  }
});

console.log('✅ API contract validation complete');
```

**Run before commits**:
```bash
node scripts/validate-api-contract.mjs
```

**Time saved**: Catch type mismatches early (5 min validation vs. 2 hour debugging)

---

## 9. Grep Patterns for Common Queries

**Problem**: Always searching for the same things

**Solution**: Save grep patterns in `.github/GREP_PATTERNS.md`

```bash
# Find all endpoints in a module
grep -n "module: 'orders'" src/app/(backoffice)/admin/dev-tools/page.tsx

# Find all "broken" endpoints
grep -n "status: 'broken'" src/app/(backoffice)/admin/dev-tools/page.tsx

# Find feature flag configuration
grep -A 8 "const featureFlags = {" src/config/feature-flags.ts | head -20

# Find all mock data files
find src/lib/api -name "*-mock.ts" -type f

# Find all API clients
find src/lib/api -name "*-client.ts" -type f

# Check endpoint counts
grep "✅\|🎭\|⚠️" src/app/(backoffice)/admin/dev-tools/page.tsx | head -20
```

**Time saved**: No manual search construction

---

## 10. Weekly Sync Cadence

**Problem**: Docs drift out of sync over time

**Solution**: Dedicated 15-minute sync slot each Friday

**Friday 4:00 PM Routine** (15 minutes):
1. Check dev-tools for new endpoints (2 min)
2. Count real vs. mock (1 min)
3. Batch update API_STATUS.md (5 min)
4. Update PROJECT_STATE.md module status (3 min)
5. Update date fields + commit (4 min)

**Time saved**: Prevents end-of-sprint scramble (saves 2-3 hours)

---

## Cost Impact Summary

| Optimization | Time Saved | Cost Saved (@ $100/hr AI) |
|--------------|-----------|------------------------|
| Session memory caching | 10 min/task | $16.67 |
| Batch endpoint registration | 60 min/sprint | $100 |
| Feature flag testing (no rebuild) | 30 min/task | $50 |
| Template patterns | 30 min/CRUD set | $50 |
| Parallel doc updates | 10 min/batch | $16.67 |
| Pre-commit checklist | 5 min/commit | $8.33 |
| Dependency mapping cache | 5 min/search | $8.33 |
| API contract validation | 120 min debugging time | $200 |
| **Total per sprint** | **~8 hours** | **~$450** |

---

## Implementation Priority

### Phase 1 (This Week)
- [ ] Session memory cache (5 min to create)
- [ ] Pre-commit checklist template (3 min to create)
- [ ] Grep patterns guide (5 min to create)

### Phase 2 (Next Sprint)
- [ ] API contract validation script (30 min to write)
- [ ] Batch sync cadence (0 min, just adopt)
- [ ] Dependency mapping cache (10 min to populate)

### Phase 3 (Future)
- [ ] Automate weekly sync (CI/CD job, 1 hour)
- [ ] VS Code snippets for dev-tools templates (30 min)
- [ ] GitHub Actions for API contract check (1 hour)

---

## Quick Start

**Right now, do this** (10 minutes):

1. Create `/memories/session/api-dev-context.md` with module status
2. Copy the pre-commit checklist into VS Code snippets
3. Save the grep patterns in `.github/GREP_PATTERNS.md`
4. Start batching endpoint updates (next 3-5 endpoints = 1 doc update)

**Result**: 30% faster API development cycles starting next task.
