# Documentation Classification

**Purpose**: Define which files change frequently vs. rarely, preventing unnecessary updates and keeping documentation coherent.

---

## Classification: By Update Frequency

### 🔴 STABLE (Update only with architectural changes)

**`.github/ARCHITECTURE.md`**
- **Purpose**: Define system design, layers, patterns, dependencies
- **Update Frequency**: Quarterly or on major refactor (NOT per endpoint)
- **Triggers for Update**:
  - ✓ Switch backend from Medusa to different platform
  - ✓ Change role-based layout structure
  - ✓ Refactor API client pattern (e.g., from `-client.ts`/`-mock.ts` to something else)
  - ✓ Add or remove major infrastructure component
  - ✗ Add new endpoint
  - ✗ Fix endpoint status
  - ✗ Mock API changes
  - ✗ Minor feature flag additions

**Current State**: ✅ Accurate and stable. Do NOT update frequently.

**Related files** (also stable):
- `docs/architecture/` folder
- `JUSTIFICACION_ARQUITECTURA_FRONTEND.md`
- `MEETING_NOTES_BACKEND_ALIGNMENT.md`

---

### 🟡 SEMI-STABLE (Update monthly or on milestone)

**`.github/ai/PROJECT_STATE.md`**
- **Purpose**: High-level module status and business priorities
- **Update Frequency**: Weekly (Friday 4 PM sync) or when module status fundamentally changes
- **Triggers for Update**:
  - ✓ Module transitions from Mock → Partial → Ready
  - ✓ Module has major blocking issue identified
  - ✓ Business priorities change
  - ✓ Main Modules table row status changes
  - ✗ Individual endpoint added/removed (handled in API_STATUS.md)
  - ✗ Minor bug fixes in endpoint

**Current State**: ✅ Accurate. Update weekly in sync with API_STATUS.md.

**Related files** (also semi-stable):
- `.github/API_DOCUMENTATION_WORKFLOW.md`
- `.github/API_QUICK_REFERENCE.md`

---

### 🟢 VOLATILE (Update frequently, every 3-5 endpoints)

**`.github/ai/API_STATUS.md`**
- **Purpose**: Complete, detailed endpoint inventory (source of truth for PROJECT_STATE.md)
- **Update Frequency**: Every 3-5 new endpoints or every week
- **Triggers for Update**:
  - ✓ New endpoint added to dev-tools
  - ✓ Endpoint status changes (working → broken or vice versa)
  - ✓ Known issues discovered or fixed
  - ✓ Module validation status changes
  - ✓ Feature flag status changes

**Current State**: ✅ Accurate. Update in batches every 3-5 endpoints.

**Source of Truth**: `src/app/(backoffice)/admin/dev-tools/page.tsx` (EndpointInfo array)

---

### ⚪ SOURCE OF TRUTH (Real-time, single source)

**`src/app/(backoffice)/admin/dev-tools/page.tsx`**
- **Purpose**: Living inventory of all endpoints
- **Update Frequency**: Immediately when endpoint added/changed/removed
- **Triggers for Update**:
  - ✓ Developer implements new endpoint
  - ✓ Endpoint name or path changes
  - ✓ Status changes (working → broken)
  - ✓ Schema or validation changes

**Current State**: ✅ Source of truth. Update immediately.

**Note**: Other docs derive FROM this; never derive dev-tools from docs.

---

### ⚪ CONFIGURATION (Real-time, tied to dev-tools)

**`src/config/feature-flags.ts`**
- **Purpose**: Control mock vs. real API per module
- **Update Frequency**: As needed when integrating new modules
- **Sync Rule**: Must match dev-tools module list

**Current State**: ✅ Up to date. Sync with dev-tools.

---

## Update Hierarchy

```
STABLE (Foundation)
    ↑
    └── ARCHITECTURE.md (Rarely changes)

SEMI-STABLE (Strategic)
    ↑
    ├── PROJECT_STATE.md (Weekly sync)
    └── API_DOCUMENTATION_WORKFLOW.md (Quarterly review)

VOLATILE (Tactical)
    ↑
    └── API_STATUS.md (Every 3-5 endpoints)

SOURCE OF TRUTH (Real-time)
    ↑
    ├── dev-tools/page.tsx (Every endpoint change)
    └── feature-flags.ts (Sync with dev-tools)
```

**Rule**: Data flows DOWN. Never update a stable doc to sync with a volatile one. Always update volatile docs to sync with source of truth.

---

## Common Mistakes

### ❌ WRONG: Updating ARCHITECTURE.md for each endpoint
```
"Added new endpoint GET /admin/orders/export"
→ Developer updates ARCHITECTURE.md
→ File cluttered with tactical details
→ Strategic document becomes noise
```

### ✅ CORRECT: Update only SOURCE OF TRUTH + API_STATUS.md
```
"Added new endpoint GET /admin/orders/export"
→ Developer updates dev-tools/page.tsx immediately
→ Weekly sync: AI updates API_STATUS.md
→ Weekly sync: AI updates PROJECT_STATE.md if module status changed
→ ARCHITECTURE.md unchanged
```

---

## For AI Agents & Developers

### When Adding a New Endpoint

**DO THIS** (in order):
1. ✅ Implement endpoint in backend
2. ✅ Update `dev-tools/page.tsx` (add to EndpointInfo array, mark status: 'untested')
3. ✅ Update `src/config/feature-flags.ts` if module new
4. ⏸️ Wait until Friday 4 PM or 3-5 endpoints accumulated
5. ✅ (Batch) Update `API_STATUS.md` with new endpoints
6. ✅ (Batch) Update `PROJECT_STATE.md` if module status changed
7. ✅ Commit with message: `feat(module): add endpoint (+N total in module)`

**DO NOT DO THIS**:
- ❌ Update ARCHITECTURE.md (it's stable)
- ❌ Update CONSISTENCY_VALIDATOR.md (it's a validator, not a tracker)
- ❌ Update multiple docs for single endpoint (batch them)

### When Fixing a Bug in Endpoint

**DO THIS**:
1. ✅ Fix bug in backend or frontend
2. ✅ Update dev-tools status from 'broken' to 'working'
3. ⏸️ Wait until Friday sync or 3-5 endpoints accumulated
4. ✅ (Batch) Update API_STATUS.md
5. ✅ Commit: `fix(module): fix endpoint (now working)`

**DO NOT DO THIS**:
- ❌ Update PROJECT_STATE.md immediately (batch it)
- ❌ Update ARCHITECTURE.md

### When Architectural Decision Changes

**DO THIS**:
1. ✅ Make decision (e.g., "Switch from Medusa to custom API")
2. ✅ Implement changes in code
3. ✅ Update ARCHITECTURE.md (describe new pattern)
4. ✅ Update API_DOCUMENTATION_WORKFLOW.md if needed
5. ✅ Create new section in API_STATUS.md if applicable
6. ✅ Commit: `refactor(arch): change from X to Y"

**Example**: If switching from Medusa to custom API:
- ARCHITECTURE.md: Update "Backend" section
- API_STATUS.md: Reorganize endpoint grouping
- PROJECT_STATE.md: Update module descriptions
- feature-flags.ts: Update apiBaseUrl, backendReady flags

---

## Weekly Sync Cadence

**Every Friday 4 PM (15 minutes)**:

1. **Check**: Any new endpoints in dev-tools since last Friday?
   - [ ] Read dev-tools EndpointInfo array
   - [ ] Count real vs. mock
   - [ ] Identify new or status-changed endpoints

2. **Update**: API_STATUS.md in batch
   - [ ] Add new endpoint sections
   - [ ] Update status badges
   - [ ] Update endpoint counts
   - [ ] Update Known Issues if applicable
   - [ ] Update date field

3. **Update**: PROJECT_STATE.md if module status changed
   - [ ] Check Main Modules table
   - [ ] If status badge changed: update it
   - [ ] Update "Current API Status" summary
   - [ ] Update "Known Issues" section
   - [ ] Verify alignment with API_STATUS.md

4. **Validate**: Run consistency check
   - [ ] All modules in PROJECT_STATE.md match API_STATUS.md
   - [ ] Use `.github/CONSISTENCY_VALIDATOR.md` checklist
   - [ ] No contradictions found

5. **Commit**: Single batch commit
   - [ ] Message: `docs(api): sync API_STATUS and PROJECT_STATE (batch of N endpoints)`
   - [ ] Includes dev-tools if needed

---

## Review Schedule

| File | Frequency | Owner | Purpose |
|------|-----------|-------|---------|
| ARCHITECTURE.md | Quarterly | Architect | Ensure design stays coherent |
| PROJECT_STATE.md | Weekly | AI agent | Keep module status current |
| API_STATUS.md | Per 3-5 endpoints | AI agent | Reflect dev-tools reality |
| dev-tools/page.tsx | Real-time | Developer | Add/fix endpoints |
| feature-flags.ts | Per new module | Developer | Track mock vs. real |
| CONSISTENCY_VALIDATOR.md | Weekly | AI agent | Prevent misalignment |

---

## Decision Tree: Which File to Update?

```
┌─ What changed?
├─ New endpoint added
│  └─ → Update dev-tools/page.tsx ONLY (immediately)
│     → Other files updated in batch Friday
│
├─ Endpoint status changed (working → broken)
│  └─ → Update dev-tools/page.tsx (immediately)
│     → Update API_STATUS.md (in batch)
│
├─ Module status changed (Mock → Partial → Ready)
│  └─ → Update API_STATUS.md (when discovered)
│     → Update PROJECT_STATE.md (in batch)
│     → Check CONSISTENCY_VALIDATOR.md alignment
│
├─ Architecture changed (e.g., new pattern or backend swap)
│  └─ → Update ARCHITECTURE.md (immediately)
│     → Update related API_STATUS.md sections
│     → Possibly update PROJECT_STATE.md
│
├─ Feature flag added/changed
│  └─ → Update feature-flags.ts (immediately)
│     → Update API_STATUS.md (in batch) if affects status display
│
└─ Process changed (e.g., new sync frequency)
   └─ → Update API_DOCUMENTATION_WORKFLOW.md
      → Notify team
      → Update CONSISTENCY_VALIDATOR.md if applicable
```

---

## Validation Rules

Before committing changes to any documentation file:

- [ ] **STABLE docs**: Only updated for architectural changes (ARCHITECTURE.md)
- [ ] **SEMI-STABLE docs**: Updated weekly or on status change (PROJECT_STATE.md)
- [ ] **VOLATILE docs**: Updated per 3-5 endpoints (API_STATUS.md)
- [ ] **Derived docs**: Never contradict source of truth (dev-tools)
- [ ] **Alignment**: API_STATUS.md ↔ PROJECT_STATE.md statuses match
- [ ] **Date fields**: Updated to today (not left stale)

---

## FAQ: When Should I Update X?

**Q: I added an endpoint. Should I update ARCHITECTURE.md?**  
A: No. Update dev-tools/page.tsx only. ARCHITECTURE.md changes only for design decisions.

**Q: I found a bug in an endpoint. Should I update PROJECT_STATE.md?**  
A: Not immediately. Update dev-tools, then wait until Friday batch update with API_STATUS.md.

**Q: I'm switching from Medusa to a custom backend. What updates are needed?**  
A: All of them. This is an architectural change: ARCHITECTURE.md + API_STATUS.md + PROJECT_STATE.md + feature-flags.ts. Do in sequence: ARCHITECTURE first, then cascade down.

**Q: API_STATUS.md is getting long. Should I split it?**  
A: Only if it exceeds 500 lines or modules exceed 20. Current: ~150 lines, 11 modules. Keep as-is.

**Q: Should ARCHITECTURE.md mention specific endpoints?**  
A: No. Mention patterns, not instances. Say "Each module has a -client.ts for mock/real switching" not "Orders has GET /admin/orders".

**Q: When should I update CONSISTENCY_VALIDATOR.md?**  
A: Only when validation rules change or new docs added. Not per endpoint or module status change.
