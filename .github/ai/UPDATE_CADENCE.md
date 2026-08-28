# UPDATE CADENCE

**Purpose**: Official schedule for updating documentation files

**Last Updated**: 2026-08-28

**Golden Rule**: Each file has a specific update frequency. Respect it. Don't update more or less frequently.

**Quick Links**:
- **Hierarchy & rules**: See `.github/ai/DOCUMENTATION_HIERARCHY.md` (data flow, constraints)
- **How to implement**: See `.github/API_DOCUMENTATION_WORKFLOW.md` (step-by-step procedures)
- **Preventing misalignment**: See `.github/CONSISTENCY_VALIDATOR.md` (validation checklist)
- **All files reference**: See `.github/DOCUMENTATION_INDEX.md` (complete directory)

---

## The Official Cadence

| File | Update Frequency | Trigger | Owner | Examples |
|------|-----------------|---------|-------|----------|
| **dev-tools/page.tsx** | Every endpoint change | Endpoint added / status changed / removed | Developer | New POST endpoint, changed path, "working" → "broken" |
| **API_STATUS.md** | Every 3-5 endpoints OR weekly | Batch accumulation or Friday sync | AI agent | After 3 new endpoints, update section + counts |
| **PROJECT_STATE.md** | Important module change OR sprint | Module transits state or business milestone | AI agent | Mock → Partial → Ready, new business priority |
| **ARCHITECTURE.md** | Architectural decision only | Pattern change, layer refactor, major redesign | Architect | Switch backend, change API pattern, new layer |
| **DECISIONS.md** | Only relevant decisions | Decision that affects future choices | Decision maker | "Use Medusa", "dual-mode API", "role-based layouts" |

---

## Detailed Cadence by File

### 🟢 dev-tools/page.tsx
**Update Frequency**: Every endpoint change (REAL-TIME)

**When to Update**:
- ✅ New endpoint implemented
- ✅ Endpoint path changed
- ✅ Endpoint status: "untested" → "working" → "broken" → "working"
- ✅ Endpoint removed

**Do NOT update**:
- ❌ Just because API_STATUS.md was updated
- ❌ Batch updates from other docs

**Example Triggers**:
```
"Just implemented POST /admin/franchisees"
→ Add EndpointInfo entry to dev-tools immediately
→ Mark status: "untested"
→ Wait for testing before marking "working"
```

**Validation**: 
- Check: Is this endpoint documented in dev-tools/page.tsx?
- If No → Update dev-tools first
- If Yes but status wrong → Update dev-tools
- Then sync other docs in batch

---

### 🟡 API_STATUS.md
**Update Frequency**: Every 3-5 endpoints OR Every Friday 4 PM (whichever comes first)

**Trigger 1: Accumulation (Every 3-5 endpoints)**
```
Endpoint 1 added → (wait)
Endpoint 2 added → (wait)
Endpoint 3 added → (wait)
Endpoint 4 added → (wait)
Endpoint 5 added → UPDATE API_STATUS.md in batch
```

**Trigger 2: Validation Cadence (Every Friday 4 PM)**
```
Friday 4 PM → Check dev-tools for new endpoints since last Friday
           → Count real vs. mock
           → If ANY changes → Batch update API_STATUS.md
           → Run consistency check
           → Commit
```

**When to Update**:
- ✅ 3-5 new endpoints accumulated
- ✅ Friday 4 PM if ANY changes exist
- ✅ Endpoint status changed
- ✅ Known issue discovered/fixed
- ✅ Module validation date needs update

**Do NOT update**:
- ❌ For single endpoint (wait for batch)
- ❌ Just to match PROJECT_STATE.md (source is dev-tools, not reverse)
- ❌ Outside of batch windows

**Example Triggers**:
```
Monday: POST /orders added (status: untested)
Tuesday: PATCH /orders/:id added (status: untested)
Wednesday: GET /orders/export added (status: untested)
Friday: 3 endpoints accumulated
  → Update API_STATUS.md
  → Add Orders section with 3 new endpoints
  → Run consistency check
  → Commit "docs(api): sync API_STATUS (batch of 3 new endpoints)"
```

**Validation**:
- Check: All dev-tools endpoints documented in API_STATUS.md?
- Check: Endpoint counts match dev-tools?
- Check: Status badges align?
- Use `.github/CONSISTENCY_VALIDATOR.md` checklist

---

### 🟡 PROJECT_STATE.md
**Update Frequency**: Important module change OR Sprint boundary (approximately weekly)

**Trigger 1: Module Status Transition**
```
Module status in API_STATUS.md changes:
  Mock → Partial (enough endpoints working) → UPDATE
  Partial → Ready (all core endpoints working) → UPDATE
  Ready → Partial (regression/known issue) → UPDATE
```

**Trigger 2: Sprint Boundary (Every Friday or sprint end)**
```
Friday 4 PM weekly sync:
  → Check if any module status changed in API_STATUS.md
  → If Yes → Also update PROJECT_STATE.md Main Modules table
  → Update "Current API Status" summary
  → Update "Known Issues" if applicable
```

**Trigger 3: Business Priority Change**
```
Business requirement changes:
  "Franchisees now critical path"
  → Update Priorities section
  → Update Main Modules table if needed
  → Commit message explains business reason
```

**When to Update**:
- ✅ Module transitions between Mock / Partial / Ready
- ✅ Weekly sync (if module status changed in API_STATUS.md)
- ✅ Business priorities shifted
- ✅ Major blocker added/removed
- ✅ Known issue significantly impacts module status

**Do NOT update**:
- ❌ Single endpoint added (that's API_STATUS.md)
- ❌ Endpoint status changed (wait for module-level impact)
- ❌ Outside of Friday sync or sprint boundary
- ❌ Just because you fixed a bug (wait for it to be working)

**Example Triggers**:
```
Friday 4 PM sync:
  → Review API_STATUS.md changes
  → Found: Quotes now has 13 working endpoints (was 9)
  → Conclusion: Module transitioned Mock → Partial
  → ACTION: Update PROJECT_STATE.md
    - Main Modules table: Quotes 🟡 Mock → ✅ Ready
    - Current API Status: Update endpoint count
    - Commit: "docs(project): Quotes now ready (13 endpoints)"
```

**Validation**:
- Check: MODULE STATUS in PROJECT_STATE matches API_STATUS?
- Check: ENDPOINT COUNTS are consistent?
- Use `.github/CONSISTENCY_VALIDATOR.md` checklist

---

### 🔵 ARCHITECTURE.md
**Update Frequency**: Architectural decision only (RARE - quarterly or major refactor)

**When to Update**:
- ✅ Major pattern change (e.g., switch from dual-mode to single API)
- ✅ Layer restructuring (e.g., add new service layer)
- ✅ New infrastructure component (e.g., cache layer, async queue)
- ✅ Authentication mechanism change
- ✅ Data flow fundamentally changes

**Do NOT update**:
- ❌ New endpoint added
- ❌ Endpoint status changed
- ❌ Module integration changed (that's API status change)
- ❌ Bug fixed
- ❌ Feature flag toggled
- ❌ Styling or component changes

**Example Triggers** (SHOULD update):
```
Decision made: "Switch from Medusa to custom backend"
→ Update ARCHITECTURE.md Backend section
→ Update API layer description
→ Cascade to API_STATUS.md and PROJECT_STATE.md
→ Commit: "refactor(arch): switch to custom backend"
```

**Example Non-Triggers** (DO NOT update):
```
"Added GET /admin/franchisees endpoint"
→ This goes in dev-tools/page.tsx only
→ API_STATUS.md updated in batch Friday
→ ARCHITECTURE.md stays unchanged

"Franchisees module now using real API instead of mock"
→ This goes in feature-flags.ts + API_STATUS.md
→ ARCHITECTURE.md unchanged (no pattern change)

"Fixed 403 RBAC error in Franchisees"
→ Update dev-tools status from "broken" to "working"
→ API_STATUS.md updated in batch
→ ARCHITECTURE.md unchanged
```

**Review Schedule**: Quarterly (every 3 months) or when major decision made

---

### 🔵 DECISIONS.md
**Update Frequency**: Only relevant decisions (RARE - per decision, never delete)

**When to Update**:
- ✅ New strategic decision made (e.g., "use Zustand instead of Redux")
- ✅ Architectural decision made (e.g., "dual-mode API")
- ✅ Platform decision (e.g., "Medusa as backend")
- ✅ Pattern decision (e.g., "role-based layouts")
- ✅ Technology choice (e.g., "Zod + react-hook-form")

**Do NOT update**:
- ❌ Endpoint added
- ❌ Bug fixed
- ❌ Status changed
- ❌ Feature developed
- ❌ Process changed (unless it's a major decision)
- ❌ Delete existing decisions

**Example Triggers** (Should add):
```
Decision made: "Use PayPal instead of Stripe for payments"
→ Add new decision to DECISIONS.md
→ Document: Problem, Options, Decision, Trade-offs, Status
→ Reference: Why PayPal over Stripe (cost, integration, etc.)
→ Status: Active (or if later rejected: Superseded)
```

**Example Non-Triggers** (DO NOT add):
```
"Implemented payment retry logic"
→ This is implementation, not decision
→ (Only add to DECISIONS.md if it was a "retry vs. fail fast" decision)

"Fixed Stripe webhook listener"
→ Bug fix, not a decision
→ (Only if decision was "use webhooks vs. polling")

"Updated feature flag frequency"
→ Process change, not strategic decision
→ (Unless it affects architecture: "real-time flags vs. build-time")
```

**Update Pattern**:
- New decision: Add to "Active Decisions" section
- Superseded decision: Move to "Retired Decisions" section (ADD reason, don't delete)
- Never delete: Only mark as Retired with date and reason

**Review Schedule**: Monthly skim for stale decisions, Quarterly full review

---

## Quick Decision Tree: Which File to Update?

```
I made a change. Where do I document it?

┌─ What changed?
│
├─ New endpoint or endpoint status changed
│  └─ → dev-tools/page.tsx (IMMEDIATELY)
│     → API_STATUS.md (in batch, Fri or 3-5 endpoints)
│
├─ Module status changed (Mock → Partial)
│  └─ → API_STATUS.md (when discovered)
│     → PROJECT_STATE.md (in batch, Fri or sprint)
│
├─ Business priorities changed
│  └─ → PROJECT_STATE.md (immediately or weekly)
│     → DECISIONS.md (if strategic decision)
│
├─ Architectural pattern changed
│  └─ → ARCHITECTURE.md (immediately)
│     → DECISIONS.md (record the decision)
│     → dev-tools/page.tsx (if affects endpoints)
│     → Cascade: API_STATUS.md, PROJECT_STATE.md
│
└─ Strategic decision made
   └─ → DECISIONS.md (immediately)
      → Related docs as needed (ARCH, API_STATUS, etc.)
```

---

## The Rhythm: Weekly Sync (Friday 4 PM)

Every Friday at 4 PM, this is the ONLY time multiple docs are updated in batch:

```
FRIDAY 4 PM SYNC (15 minutes):

1. Review dev-tools/page.tsx for changes since last Friday
   ├─ Count new endpoints
   ├─ Count status changes
   └─ Check: Any accumulated endpoints?

2. If changes exist:
   ├─ Update API_STATUS.md
   │  ├─ Add new endpoint sections
   │  ├─ Update status badges
   │  ├─ Update endpoint counts
   │  └─ Update date field
   │
   ├─ Check PROJECT_STATE.md for module status changes
   │  ├─ Did any module transition state?
   │  ├─ If Yes → Update Main Modules table
   │  └─ Update "Current API Status" summary
   │
   └─ Run consistency check
      └─ Use .github/CONSISTENCY_VALIDATOR.md

3. Commit (if changes made)
   └─ Message: "docs(api): sync API_STATUS and PROJECT_STATE (batch of N endpoints)"

4. If no changes:
   └─ Skip (no commit needed)
```

**Outside Friday Sync**:
- Only update dev-tools/page.tsx (real-time)
- Only update ARCHITECTURE.md or DECISIONS.md (major decisions)
- Batch all other updates for Friday

---

## Update Frequency Matrix

```
FREQUENCY                    FILES
═════════════════════════════════════════════════════════════
Real-time (per change)   → dev-tools/page.tsx
Every 3-5 endpoints      → API_STATUS.md
Weekly (Friday 4 PM)     → API_STATUS.md, PROJECT_STATE.md
On module transition     → PROJECT_STATE.md
On architectural change  → ARCHITECTURE.md
On strategic decision    → DECISIONS.md
Quarterly review         → All files (validation sweep)
```

---

## Why These Frequencies?

**dev-tools REAL-TIME**
- It's the source of truth
- Developers must update immediately as they implement
- Lag here breaks everything downstream

**API_STATUS.md EVERY 3-5 ENDPOINTS**
- Batching reduces documentation overhead
- Still keeps docs current (max 3-day lag)
- Weekly minimum ensures Friday catch-up

**PROJECT_STATE.md WEEKLY OR MODULE CHANGE**
- Module transitions are business milestones
- Weekly sync captures accumulated changes
- Prevents noise from single endpoint changes

**ARCHITECTURE.md QUARTERLY**
- Patterns don't change often
- Only update on major decisions
- Keeps it stable and authoritative

**DECISIONS.md PER DECISION**
- Decisions are infrequent but important
- Record immediately to capture context
- Never delete (permanent record)

---

## Validation: Are You Updating Too Frequently?

**❌ RED FLAGS** (You're updating too much):
- "I update PROJECT_STATE.md every day"
  → Should be weekly + module changes only
- "I update ARCHITECTURE.md for each new module"
  → Should be quarterly + architectural decisions only
- "I updated API_STATUS.md for single endpoint"
  → Should batch 3-5, not per endpoint

**✅ GREEN FLAGS** (You're on track):
- "I updated dev-tools and waited until Friday to sync other docs"
  → Perfect
- "I only updated ARCHITECTURE.md when we switched from Medusa to custom API"
  → Correct pattern
- "PROJECT_STATE.md updated Friday when Quotes transitioned to Ready"
  → Exactly right

---

## Enforcement & Exceptions

### Standard Exceptions:
- **Emergency**: Critical bug fix or production issue → Update immediately
- **Release**: Release notes may require immediate updates
- **Urgent Decision**: Time-critical decision → Record in DECISIONS.md immediately

### No Exceptions:
- Never violate hierarchy (data flows DOWN only)
- Never update ARCHITECTURE.md for single endpoint
- Never delete DECISIONS.md entries

---

## Last Updated

**2026-08-28**: Official cadence established with clear frequencies, triggers, and weekly sync rhythm.
