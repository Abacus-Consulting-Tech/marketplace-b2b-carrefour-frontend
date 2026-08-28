# Documentation Reference

**Purpose**: Quick reference to all documentation files and their purpose

**Last Updated**: 2026-08-28

---

## Quick Navigation

### � MAIN HUB (Start here first)

- **[`.github/ai/README.md`](ai/README.md)** ← Central documentation hub
  - All documents organized by purpose
  - Choose your path based on what you need
  - Quick answers to common questions
  - Full status summary
- **[`.github/ai/DOCUMENTATION_MAP.md`](ai/DOCUMENTATION_MAP.md)** ← Visual relationships
  - Hierarchy diagrams
  - Data flow charts
  - File relationships
  - Quick access paths
### 🎯 THE TWO OFFICIAL REFERENCES

- **`.github/ai/DOCUMENTATION_HIERARCHY.md`** ← **Understand the hierarchy**
  - Official data flow: dev-tools → API_STATUS → PROJECT_STATE
  - Hierarchy rules and constraints
  - Answer: "Where should I update this?"

- **`.github/ai/UPDATE_CADENCE.md`** ← **Know when to update**
  - When to update each file (real-time vs. weekly vs. quarterly)
  - Triggers for each update
  - Weekly Friday 4 PM sync procedure
  - Answer: "When should I update?"

---

## Documentation Layers

### 🟢 SOURCE OF TRUTH (Real-time)
- **`src/app/(backoffice)/admin/dev-tools/page.tsx`**
  - Every endpoint, live status
  - Update: Immediately on changes
  - Owner: Developer

### 🟡 INVENTORY (Volatile, weekly batch)
- **`.github/ai/API_STATUS.md`**
  - Detailed endpoint registry (derives from dev-tools)
  - 57 working + 9 partial + 51+ mock endpoints
  - Update: Every 3-5 endpoints or weekly Friday
  - Owner: AI agent during sync

### 🟡 OVERVIEW (Semi-stable, weekly)
- **`.github/ai/PROJECT_STATE.md`**
  - High-level module status (derives from API_STATUS.md)
  - For strategic planning and agents
  - Update: Weekly Friday or on major status change
  - Owner: AI agent during sync

### 🔵 CONTEXT (Stable, quarterly)
- **`.github/ai/ARCHITECTURE.md`**
  - System design, patterns, constraints
  - Describes HOW not WHAT
  - Update: Quarterly or on architectural decision
  - Owner: Architect/lead engineer

- **`.github/ai/DECISIONS.md`**
  - Persistent record of decisions and rationale
  - Never delete entries, only add
  - Update: When decision is made
  - Owner: Decision maker

---

## Supporting Documents

### Workflow & Process
- **`.github/ai/UPDATE_CADENCE.md`** ← OFFICIAL FREQUENCIES
  - When to update each file (real-time vs. weekly vs. quarterly)
  - Triggers for each update
  - Weekly Friday 4 PM sync procedure
  - Decision tree: "Which file should I update?"

- **`.github/API_DOCUMENTATION_WORKFLOW.md`**
  - How to keep files in sync
  - Step-by-step sync procedure
  - Weekly cadence

- **`.github/DOCUMENTATION_CLASSIFICATION.md`**
  - Why each file is STABLE vs. VOLATILE vs. SEMI-STABLE
  - Update frequencies explained
  - Decision tree: "Which file should I update?"

- **`.github/CONSISTENCY_VALIDATOR.md`**
  - Prevents misalignment between API_STATUS.md and PROJECT_STATE.md
  - Validation rules and checklist
  - Current Status Matrix

- **`.github/API_QUICK_REFERENCE.md`**
  - One-page developer reference
  - Quick commands, common modules
  - Pre-commit checklist

- **`.github/COST_OPTIMIZATION_GUIDE.md`**
  - 10 strategies to improve efficiency
  - ROI: 30-40% time savings, $450/sprint value
  - Phase 1-3 implementation plan

- **`src/config/feature-flags.ts`**
  - Feature flag configuration
  - Per-module mock vs. real API control
  - Synced with dev-tools module list

---

## The Official Hierarchy (Visual)

```
SOURCE OF TRUTH
├─ src/app/(backoffice)/admin/dev-tools/page.tsx
│  ↓ (Real-time)
│
├─ .github/ai/API_STATUS.md (VOLATILE)
│  ↓ (Weekly batch)
│
└─ .github/ai/PROJECT_STATE.md (SEMI-STABLE)

CONTEXT (Do NOT derive from lower levels):
├─ .github/ai/ARCHITECTURE.md (STABLE - quarterly)
└─ .github/ai/DECISIONS.md (STABLE - per decision)

SUPPORTING PROCESSES:
├─ .github/API_DOCUMENTATION_WORKFLOW.md
├─ .github/DOCUMENTATION_CLASSIFICATION.md
├─ .github/CONSISTENCY_VALIDATOR.md
├─ .github/API_QUICK_REFERENCE.md
└─ .github/COST_OPTIMIZATION_GUIDE.md
```

**KEY RULE: Data flows DOWN only. Never update higher levels to sync with lower levels.**

---

## When in Doubt

### "I added a new endpoint. What do I update?"
→ **`src/app/(backoffice)/admin/dev-tools/page.tsx` ONLY (immediately)**
→ Other files updated in batch Friday 4 PM

### "I want to know what endpoints exist?"
→ **`.github/ai/API_STATUS.md`** (detailed list)
→ or **`.github/ai/PROJECT_STATE.md`** (high-level summary)

### "I want to know the module status?"
→ **`.github/ai/PROJECT_STATE.md`** (overview)
→ For details, check `.github/ai/API_STATUS.md`

### "I want to know why we chose this architecture?"
→ **`.github/ai/DECISIONS.md`** (decision rationale)
→ For how it works, check `.github/ai/ARCHITECTURE.md`

### "I found a contradiction between files?"
→ Check **`.github/CONSISTENCY_VALIDATOR.md`** rules
→ Use **`.github/ai/DOCUMENTATION_HIERARCHY.md`** to resolve

### "Should I update ARCHITECTURE.md for new endpoint?"
→ NO. `.github/ai/ARCHITECTURE.md` is STABLE (only quarterly changes)
→ Update `dev-tools/page.tsx` and let it cascade through API_STATUS.md

### "When do I sync documentation?"
→ **Every Friday 4 PM** (15 minutes)
→ Follow **`.github/API_DOCUMENTATION_WORKFLOW.md`** procedure
→ Check alignment with **`.github/CONSISTENCY_VALIDATOR.md`**

---

## File Status (2026-08-28)

| File | Status | Last Update | Next Review |
|------|--------|-------------|-------------|
| DOCUMENTATION_HIERARCHY.md | ✅ Complete | 2026-08-28 | Quarterly |
| UPDATE_CADENCE.md | ✅ Complete | 2026-08-28 | Quarterly |
| API_STATUS.md | ✅ Complete | 2026-08-28 | Weekly |
| PROJECT_STATE.md | ✅ Complete | 2026-08-28 | Weekly |
| ARCHITECTURE.md | ✅ Complete | 2026-08 | Quarterly |
| DECISIONS.md | ✅ Complete | 2026-08-28 | Monthly |
| API_DOCUMENTATION_WORKFLOW.md | ✅ Complete | 2026-08-28 | Quarterly |
| DOCUMENTATION_CLASSIFICATION.md | ✅ Complete | 2026-08-28 | Quarterly |
| CONSISTENCY_VALIDATOR.md | ✅ Complete | 2026-08-28 | Weekly |
| API_QUICK_REFERENCE.md | ✅ Complete | 2026-08-28 | Quarterly |
| COST_OPTIMIZATION_GUIDE.md | ✅ Complete | 2026-08-28 | Monthly |

---

## For AI Agents

This hierarchy exists to:
1. **Prevent confusion**: Clear data flow, no ambiguity
2. **Prevent waste**: Don't update docs unnecessarily
3. **Prevent contradictions**: Validation rules catch misalignment
4. **Provide context**: DECISIONS.md explains the "why"

When making recommendations:
- ✅ Refer to DOCUMENTATION_HIERARCHY for authority
- ✅ Check DECISIONS.md for historical context
- ✅ Use CONSISTENCY_VALIDATOR to detect issues
- ❌ Don't assume docs are always current (check dev-tools)
- ❌ Don't recommend updating docs outside their cycle

---

## Getting Started (New Team Member)

1. Read **`.github/ai/DOCUMENTATION_HIERARCHY.md`** (5 min)
2. Skim **`.github/ai/DECISIONS.md`** to understand project choices (10 min)
3. Review **`.github/API_DOCUMENTATION_WORKFLOW.md`** for your sync role (5 min)
4. Bookmark **`.github/CONSISTENCY_VALIDATOR.md`** for validation checklist (reference)
5. Check feature flags in **`src/config/feature-flags.ts`** for current API status (2 min)

**Total onboarding: 20 minutes**

---

## Last Updated

**2026-08-28**: Complete documentation hierarchy established, all files cross-referenced, central hub created.

All documents are now connected with clear navigation paths. Start at `.github/ai/README.md` for any documentation need.
