# Documentation Hierarchy (Official)

**Last Updated**: 2026-08-28

**Quick Links**:
- **When to update**: See `.github/ai/UPDATE_CADENCE.md` (frequencies and triggers)
- **How to update**: See `.github/API_DOCUMENTATION_WORKFLOW.md` (procedures)
- **Preventing contradictions**: See `.github/CONSISTENCY_VALIDATOR.md` (validation rules)
- **Quick navigation**: See `.github/DOCUMENTATION_INDEX.md` (all docs reference)

---

## The Official Hierarchy

```
SOURCE OF TRUTH
├─ src/app/(backoffice)/admin/dev-tools/page.tsx
│  (Every endpoint, every status change, real-time)
│
├─────────────────────────────────────────────────┤
│ DATA FLOWS DOWN ONLY                            │
└─────────────────────────────────────────────────┘
│
▼
.github/ai/API_STATUS.md
  (Detailed endpoint inventory, derives FROM dev-tools)
  (Update: Every 3-5 endpoints or weekly)
│
├─────────────────────────────────────────────────┤
│ DATA FLOWS DOWN ONLY                            │
└─────────────────────────────────────────────────┘
│
▼
.github/ai/PROJECT_STATE.md
  (High-level module status, derives FROM API_STATUS.md)
  (Update: Weekly or on major module status change)


CONTEXT LAYERS (Do NOT derive from lower levels)
├─ .github/ai/ARCHITECTURE.md
│  (System design, patterns, constraints)
│  (Update: Quarterly or on major architectural decision)
│  (Consumes: SOURCE OF TRUTH for patterns/approach)
│
└─ .github/ai/DECISIONS.md
   (Persistent decisions, rationale, trade-offs)
   (Update: When decision is made, never delete)
   (Reference: Why we chose this approach)
```

---

## What Each Layer Does

### 🟢 SOURCE OF TRUTH: `dev-tools/page.tsx`
- **What**: `EndpointInfo[]` array with complete metadata
- **Authority**: Single source for all endpoint facts
- **Update**: Immediately when endpoint added/changed/removed
- **Who**: Developer implementing endpoint
- **Example**:
```typescript
{
  path: "POST /admin/orders",
  method: "POST",
  module: "orders",
  description: "Create new order",
  status: "working",
  usesRealAPI: true,
  requiresAuth: true,
  medusaEndpoint: "/admin/orders"
}
```

### 🟡 INVENTORY: `API_STATUS.md`
- **What**: Human-readable endpoint registry organized by module
- **Derives From**: dev-tools/page.tsx
- **Update**: Every 3-5 endpoints (batched Friday 4 PM)
- **Who**: AI agent during sync
- **Example**:
```markdown
### Orders (17 endpoints)
- POST /admin/orders — Create new order (working)
- GET /admin/orders — List orders (working)
**Status**: ✅ WORKING — Complete workflow validated 2026-08-26
```

### 🟡 OVERVIEW: `PROJECT_STATE.md`
- **What**: Strategic project status for agents and planning
- **Derives From**: API_STATUS.md
- **Update**: Weekly (Friday 4 PM) or on major module transition
- **Who**: AI agent during sync
- **Example**:
```markdown
| **Orders** | Multi-role views, fulfillment | ✅ | ✅ Ready |
```

### 🔵 CONTEXT: `ARCHITECTURE.md`
- **What**: System design, layer interactions, patterns, constraints
- **Derives From**: SOURCE OF TRUTH patterns (not instances)
- **Update**: Quarterly or on architectural decision
- **Who**: Architect or lead engineer
- **Example**:
```markdown
Each module implements a dual-mode pattern:
- `-client.ts`: Switches between mock and real API via feature flags
- `-mock.ts`: Fallback test data when real API unavailable
```

### 🔵 CONTEXT: `DECISIONS.md`
- **What**: Persistent record of why decisions were made
- **Derives From**: Problem statement, constraints, trade-offs
- **Update**: Never delete, only add new entries
- **Who**: Decision maker (engineer, architect, PM)
- **Example**:
```markdown
## Decision: Dual-mode API (Mock + Real)

**Date**: 2026-04-15  
**Problem**: Frontend development blocked on backend readiness  
**Options**:
1. Mock everything, switch later → Risk of integration bugs
2. Real API only → Blocked by backend delays  
3. Dual-mode (mock/real switching) → Can develop independently

**Decision**: Dual-mode
**Rationale**: Allows parallel development, easy integration testing
**Trade-offs**: More code complexity, need feature flags
**Status**: Implemented, working well across all modules
```

---

## The Rules

### Rule 1: Data Flows DOWN
```
dev-tools → API_STATUS → PROJECT_STATE
```
Never update a file to sync with a higher-level file. Always update lower.

**❌ WRONG**:
```
Bug found in API_STATUS.md? Fix by updating dev-tools? No!
Fix API_STATUS.md directly, then sync dev-tools later.
```

**✅ CORRECT**:
```
Bug found in API_STATUS.md? Check dev-tools.
If dev-tools is wrong, fix there.
If dev-tools is right but API_STATUS.md missed it, update API_STATUS.md.
Always trust dev-tools.
```

---

### Rule 2: Each Layer Has a Purpose
- **dev-tools**: Technical truth (what exists)
- **API_STATUS.md**: What's implemented and working (for developers)
- **PROJECT_STATE.md**: What's ready for business use (for strategists)
- **ARCHITECTURE.md**: How it's designed (for architects)
- **DECISIONS.md**: Why it's designed that way (for future context)

Don't mix purposes. Don't use PROJECT_STATE.md to list individual endpoints.

---

### Rule 3: Contradictions Mean Something is Wrong
If you see:
```
dev-tools says: endpoint status = "working"
API_STATUS.md says: endpoint status = "broken"
```

Then **one of them is wrong**. Track down which, fix the source.

Use `.github/CONSISTENCY_VALIDATOR.md` to prevent contradictions.

---

### Rule 4: Update Frequency Decreases Down
```
dev-tools:       Every change (real-time)
API_STATUS.md:   Every 3-5 endpoints (weekly batch)
PROJECT_STATE:   Weekly or on major change (Friday 4 PM)
ARCHITECTURE:    Quarterly or on decision (rare)
DECISIONS.md:    When decision made (rare, never delete)
```

**Never violate this**: Don't update PROJECT_STATE for single endpoint.

**See `.github/ai/UPDATE_CADENCE.md` for detailed frequencies and triggers.**

---

## When to Update Each File

### When Adding New Endpoint

```
┌─ Developer writes endpoint in backend
│
├─ ✅ Update: dev-tools/page.tsx (IMMEDIATELY)
│      Add EndpointInfo entry, mark status: "untested"
│
├─ ⏸️  Wait until Friday or 3-5 endpoints accumulated
│
├─ ✅ Update: API_STATUS.md (BATCH, Friday)
│      Add endpoint to correct module section
│      Update endpoint count in header
│
├─ ✅ Check: PROJECT_STATE.md (BATCH, Friday)
│      Does module status need updating?
│      If Mock→Partial or Partial→Ready, update
│
└─ ❌ DO NOT update: ARCHITECTURE.md or DECISIONS.md
```

### When Fixing Bug in Endpoint

```
┌─ Engineer fixes bug in backend/frontend
│
├─ ✅ Update: dev-tools/page.tsx (IMMEDIATELY)
│      Change status from "broken" to "working"
│
├─ ⏸️  Wait until Friday or 3-5 endpoints accumulated
│
├─ ✅ Update: API_STATUS.md (BATCH, Friday)
│      Update status badge
│      Remove from "Known Issues" if applicable
│
└─ ❌ DO NOT immediately update: PROJECT_STATE.md
       (Update in batch with API_STATUS.md)
```

### When Making Architectural Decision

```
┌─ Team decides to change pattern (e.g., switch from Medusa to custom API)
│
├─ ✅ Update: DECISIONS.md (IMMEDIATELY)
│      Record decision, rationale, trade-offs, status
│
├─ ✅ Update: ARCHITECTURE.md (IMMEDIATELY)
│      Change architectural description
│      Update pattern explanations
│
├─ ✅ Update: dev-tools/page.tsx (NEW ENDPOINTS)
│      Reorganize EndpointInfo for new structure
│
├─ ✅ Update: API_STATUS.md (BATCH)
│      Reorganize by new module structure
│
└─ ✅ Update: PROJECT_STATE.md (BATCH)
       Verify all modules still tracked
```

### When Updating Process/Cadence

```
┌─ Team decides to change sync frequency (e.g., daily instead of weekly)
│
├─ ✅ Update: DECISIONS.md (IMMEDIATELY)
│      Record the change and rationale
│
├─ ✅ Update: API_DOCUMENTATION_WORKFLOW.md
│      Change sync frequency in instructions
│
├─ ✅ Update: DOCUMENTATION_CLASSIFICATION.md
│      Reflect new update frequency
│
└─ ✅ Update: CONSISTENCY_VALIDATOR.md
       Reflect new validation schedule
```

---

## Quick Reference: File Roles

| File | Type | Frequency | Owner | Purpose |
|------|------|-----------|-------|---------|
| dev-tools/page.tsx | SOURCE | Real-time | Developer | What exists |
| API_STATUS.md | INVENTORY | Weekly batch | AI agent | What's implemented |
| PROJECT_STATE.md | OVERVIEW | Weekly | AI agent | What's ready |
| ARCHITECTURE.md | CONTEXT | Quarterly | Architect | How it works |
| DECISIONS.md | CONTEXT | Per decision | Decision maker | Why we chose this |

---

## FAQ

**Q: Should ARCHITECTURE.md mention specific endpoint counts?**  
A: No. Mention patterns: "Each module has dual-mode API clients" not "Orders has 17 endpoints".

**Q: When should DECISIONS.md be updated?**  
A: When a decision is made. Never delete entries. Add new entries with date and status.

**Q: What if API_STATUS.md gets too long?**  
A: Only split if exceeds 500 lines. Current: ~150 lines. Keep unified for now.

**Q: Can PROJECT_STATE.md override a status from API_STATUS.md?**  
A: No. PROJECT_STATE.md summarizes API_STATUS.md. They must match exactly.

**Q: If I find dev-tools is wrong, should I fix it or API_STATUS.md?**  
A: Fix dev-tools (source of truth). Then sync API_STATUS.md to match.

**Q: How do I know if a decision should go in DECISIONS.md?**  
A: If it answers "why did we choose X over Y?", it goes in DECISIONS.md.

---

## Example: Adding Feature Flag for New Module

**Step 1: Make Decision** (Day 1)
```markdown
# DECISIONS.md entry added:
- Date: 2026-08-28
- Decision: Add Feature Flag for "franchisees" module
- Rationale: RBAC issues on backend; use mock API while fixing
- Trade-off: Users see mock data instead of real; temporary
- Status: Active (decision made, implementation ongoing)
```

**Step 2: Implement** (Day 1-2)
```typescript
// dev-tools/page.tsx
// Add/update entries for franchisees endpoints

// src/config/feature-flags.ts
// Add franchisees flag with useMock: true
```

**Step 3: Document** (Friday 4 PM)
```markdown
# API_STATUS.md
### Franchisees (9 endpoints)
- GET /admin/customers — Mock, real API returns 403
**Status**: ⚠️ PARTIAL

# PROJECT_STATE.md
| **Franchisees** | ... | ⚠️ Partial |
```

---

## Files in This Hierarchy

### SOURCE OF TRUTH
- `src/app/(backoffice)/admin/dev-tools/page.tsx`

### INVENTORY & OVERVIEW LAYERS
- `.github/ai/API_STATUS.md`
- `.github/ai/PROJECT_STATE.md`

### CONTEXT LAYERS
- `.github/ai/ARCHITECTURE.md`
- `.github/ai/DECISIONS.md` ← NEW

### SUPPORTING DOCUMENTS
- `.github/API_DOCUMENTATION_WORKFLOW.md` (how to sync)
- `.github/CONSISTENCY_VALIDATOR.md` (prevent misalignments)
- `.github/DOCUMENTATION_CLASSIFICATION.md` (update frequencies)

---

## One-Page Visual

```
┌──────────────────────────────────────────────────────────┐
│ SOURCE OF TRUTH                                          │
│ src/app/(backoffice)/admin/dev-tools/page.tsx           │
│ (Every endpoint, real-time update)                       │
└──────────────┬───────────────────────────────────────────┘
               │ derives from
               ▼
┌──────────────────────────────────────────────────────────┐
│ INVENTORY: .github/ai/API_STATUS.md                      │
│ (Detailed, human-readable endpoint registry)             │
│ Update: Every 3-5 endpoints or weekly                    │
└──────────────┬───────────────────────────────────────────┘
               │ summarizes to
               ▼
┌──────────────────────────────────────────────────────────┐
│ OVERVIEW: .github/ai/PROJECT_STATE.md                    │
│ (Strategic status, module summary)                       │
│ Update: Weekly or on major change                        │
└──────────────────────────────────────────────────────────┘

CONTEXT (Parallel, not derived):
┌──────────────────────────────────────────────────────────┐
│ ARCHITECTURE: .github/ai/ARCHITECTURE.md                 │
│ (Design patterns, system layers, constraints)            │
│ Update: Quarterly or on architectural decision           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ DECISIONS: .github/ai/DECISIONS.md                       │
│ (Persistent record of why decisions were made)           │
│ Update: Per decision, never delete entries               │
└──────────────────────────────────────────────────────────┘

KEY RULE: Data flows DOWN only. Never update higher levels
to sync with lower levels. Always update the source of truth.
```

---

## Getting Started

1. ✅ Read this file to understand hierarchy
2. ✅ Bookmark `.github/ai/DECISIONS.md` (coming next)
3. ✅ Use `.github/CONSISTENCY_VALIDATOR.md` weekly
4. ✅ Follow sync schedule in `.github/API_DOCUMENTATION_WORKFLOW.md`
5. ✅ Check `.github/DOCUMENTATION_CLASSIFICATION.md` when in doubt

---

## Last Updated

- **2026-08-28**: Hierarchy formalized, DECISIONS.md created, all cross-references added
