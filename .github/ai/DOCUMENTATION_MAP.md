# Documentation Map (Visual)

**Purpose**: Visual representation of how all documentation files connect

**Date**: 2026-08-28

---

## 🗺️ The Complete Documentation Ecosystem

```
                                    ┌─────────────────────┐
                                    │  .github/ai/        │
                                    │  README.md          │
                                    │ (MAIN HUB)          │
                                    └──────────┬──────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
        ┌────────────────────┐     ┌────────────────────┐     ┌────────────────────┐
        │ DOCUMENTATION_     │     │ UPDATE_            │     │ DOCUMENTATION_     │
        │ HIERARCHY.md       │     │ CADENCE.md         │     │ INDEX.md           │
        │                    │     │                    │     │                    │
        │ ⚙️ RULES           │     │ ⏰ FREQUENCIES     │     │ 📋 DIRECTORY       │
        │ • Data flows DOWN  │     │ • When to update   │     │ • All files listed │
        │ • No contradict    │     │ • Triggers         │     │ • Status & links   │
        │ • Hierarchy clear  │     │ • Cadence (Fri)    │     │                    │
        └────────┬───────────┘     └────────┬───────────┘     └────────────────────┘
                 │                          │
                 └──────────────┬───────────┘
                                │
                    ┌───────────────────────────┐
                    │ OFFICIAL REFERENCE PAIR   │
                    └───────────────┬───────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
     ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
     │ SOURCE OF TRUTH     │  │ INVENTORY           │  │ OVERVIEW            │
     │                     │  │                     │  │                     │
     │ dev-tools/page.tsx  │  │ API_STATUS.md       │  │ PROJECT_STATE.md    │
     │                     │  │                     │  │                     │
     │ 🟢 VOLATILE         │  │ 🟢 VOLATILE         │  │ 🟡 SEMI-STABLE      │
     │ Update: Real-time   │  │ Update: 3-5 eps    │  │ Update: Weekly      │
     │                     │  │ or Weekly           │  │                     │
     │ Endpoints + status  │  │                     │  │ Module status       │
     │ (140+ documented)   │  │ 57 working + 9 par  │  │ Priorities          │
     │                     │  │ + 51+ mock          │  │ Known Issues        │
     └──────────┬──────────┘  └────────────────────┘  └────────────────────┘
                │
                │ (derives from)
                ▼
     ┌─────────────────────┐
     │ CONTEXT LAYERS      │
     │ (Parallel, stable)  │
     └────────┬────────┬───┘
              │        │
              ▼        ▼
      ┌─────────────┐ ┌──────────────┐
      │ ARCHITECTURE│ │ DECISIONS.md │
      │ .md         │ │              │
      │             │ │ 🔵 STABLE    │
      │ 🔵 STABLE   │ │ Update: Per  │
      │ Update:     │ │ decision     │
      │ Quarterly   │ │              │
      │             │ │ 7 decisions  │
      │ Design      │ │ with rationale
      │ Patterns    │ │              │
      └─────────────┘ └──────────────┘


SUPPORTING DOCUMENTS (Process & Validation)
└─ .github/
   ├─ API_DOCUMENTATION_WORKFLOW.md
   │  (How to keep files in sync - procedures)
   │
   ├─ CONSISTENCY_VALIDATOR.md
   │  (Prevent misalignment - rules & checklist)
   │
   ├─ DOCUMENTATION_CLASSIFICATION.md
   │  (Explain update frequencies - rationale)
   │
   ├─ DOCUMENTATION_INDEX.md
   │  (Reference all docs - directory)
   │
   ├─ API_QUICK_REFERENCE.md
   │  (Quick developer guide - 1 page)
   │
   └─ COST_OPTIMIZATION_GUIDE.md
      (Efficiency strategies - 10 strategies)
```

---

## 📊 File Relationships

### Hierarchy & Rules (Must Read First)
```
START
  │
  ├─→ .github/ai/README.md (Hub)
  │     └─→ "What should I read?"
  │
  ├─→ .github/ai/DOCUMENTATION_HIERARCHY.md (Rules)
  │     └─→ "How does data flow?"
  │
  └─→ .github/ai/UPDATE_CADENCE.md (Frequencies)
        └─→ "When should I update?"
```

### Working with Documentation
```
Need to UPDATE?
  │
  ├─→ .github/ai/UPDATE_CADENCE.md (Find your file)
  │     ├─→ "When to update" ✓
  │     └─→ "What are triggers?" ✓
  │
  ├─→ .github/API_DOCUMENTATION_WORKFLOW.md (How to do it)
  │     └─→ Step-by-step procedures
  │
  └─→ .github/CONSISTENCY_VALIDATOR.md (Validate)
        └─→ Checklist before commit
```

### Understanding Project State
```
What's the STATUS?
  │
  ├─→ .github/ai/PROJECT_STATE.md (Quick: 2 min)
  │     ├─→ 11 modules + status
  │     ├─→ Priorities
  │     └─→ Known issues
  │
  ├─→ .github/ai/API_STATUS.md (Detailed: 5 min)
  │     ├─→ 140+ endpoints
  │     ├─→ 57 working + 9 partial + 51+ mock
  │     └─→ Troubleshooting
  │
  └─→ src/app/(backoffice)/admin/dev-tools/page.tsx (Source truth)
        └─→ Live endpoint registry
```

### Understanding Design Choices
```
Why DID we design this way?
  │
  ├─→ .github/ai/DECISIONS.md (Decisions + rationale)
  │     ├─→ Decision 1: Dual-mode API
  │     ├─→ Decision 2: Medusa backend
  │     ├─→ Decision 3: Role-based layouts
  │     ├─→ Decision 4: Feature flags
  │     ├─→ Decision 5: Zod + react-hook-form
  │     ├─→ Decision 6: Zustand state
  │     └─→ Decision 7: shadcn/ui components
  │
  └─→ .github/ai/ARCHITECTURE.md (Design + patterns)
        └─→ How it's built
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ SOURCE OF TRUTH: Everything starts here                         │
│ (Real-time, as soon as anything changes)                        │
│                                                                 │
│ src/app/(backoffice)/admin/dev-tools/page.tsx                  │
│ • EndpointInfo array                                           │
│ • New endpoint added? → Update immediately                      │
│ • Status changed? → Update immediately                          │
│ • Endpoint removed? → Update immediately                        │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                        (derives from)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ INVENTORY: Detailed endpoint registry                           │
│ (Every 3-5 endpoints or Every Friday 4 PM)                      │
│                                                                 │
│ .github/ai/API_STATUS.md                                        │
│ • 140+ endpoints documented                                     │
│ • 57 working + 9 partial + 51+ mock                             │
│ • Batched update: 3-5 endpoints per sync                        │
│ • Status: ✅ WORKING or ⚠️ PARTIAL or 🎭 MOCK                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                        (summarized into)
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│ OVERVIEW: Module status & priorities                            │
│ (Weekly Friday 4 PM or on major module change)                  │
│                                                                 │
│ .github/ai/PROJECT_STATE.md                                     │
│ • 11 modules with status badges                                 │
│ • Business priorities                                           │
│ • Known issues & workarounds                                    │
│ • For strategic planning & agents                               │
└─────────────────────────────────────────────────────────────────┘
```

**KEY RULE**: Data flows DOWN only. 
- Never update PROJECT_STATE to sync with dev-tools
- Always update the SOURCE, not the derivative

---

## 🗓️ Weekly Sync Ritual

```
FRIDAY 4:00 PM
│
├─ 1. Review
│  │  └─ Check dev-tools/page.tsx for changes since last Friday
│  │     └─ Count: new endpoints, status changes
│  │
├─ 2. Update (if changes found)
│  │  ├─ API_STATUS.md
│  │  │  └─ Add new endpoints, update counts, status badges
│  │  │
│  │  ├─ PROJECT_STATE.md
│  │  │  └─ If any module status transitioned (Mock→Partial→Ready)
│  │  │
│  │  └─ feature-flags.ts
│  │     └─ Verify matches reality
│  │
├─ 3. Validate
│  │  └─ CONSISTENCY_VALIDATOR.md
│  │     └─ Check all modules aligned
│  │
└─ 4. Commit
   └─ "docs(api): sync API_STATUS and PROJECT_STATE (batch of N endpoints)"
```

---

## 📱 Quick Access Paths

### For Developers
```
"I just implemented an endpoint"
→ dev-tools/page.tsx (IMMEDIATELY)
→ Wait until Friday
→ API_STATUS.md + PROJECT_STATE.md (BATCH)
```

### For Architects
```
"I need to understand the design"
→ DECISIONS.md (decisions + rationale)
→ ARCHITECTURE.md (system design)
```

### For Project Managers
```
"What's the project status?"
→ PROJECT_STATE.md (module status, priorities)
→ DECISIONS.md (strategic choices)
```

### For New Team Members
```
1. .github/ai/README.md (5 min orientation)
2. DOCUMENTATION_HIERARCHY.md (understand flow)
3. UPDATE_CADENCE.md (know when to touch what)
4. PROJECT_STATE.md (current status)
5. DECISIONS.md (design choices)
```

---

## 📋 File Categories

### 🎯 Decision & Strategy
- DECISIONS.md
- DOCUMENTATION_HIERARCHY.md
- DOCUMENTATION_CLASSIFICATION.md

### 📊 Status & Inventory
- PROJECT_STATE.md
- API_STATUS.md
- dev-tools/page.tsx (source)

### ⚙️ Operations & Process
- UPDATE_CADENCE.md
- API_DOCUMENTATION_WORKFLOW.md
- CONSISTENCY_VALIDATOR.md

### 📖 Reference & Navigation
- README.md (hub)
- DOCUMENTATION_INDEX.md
- API_QUICK_REFERENCE.md

### 💡 Context & Background
- ARCHITECTURE.md
- COST_OPTIMIZATION_GUIDE.md

---

## ✅ Validation Checklist

Before committing to ANY documentation file:

- [ ] I identified which file needs updating (UPDATE_CADENCE.md)
- [ ] This is the right TIME to update (not too early, not too late)
- [ ] Data flows DOWN (source → derivative)
- [ ] No contradictions with other files (CONSISTENCY_VALIDATOR.md)
- [ ] Date field updated
- [ ] Cross-references correct
- [ ] Commit message is clear

---

## 🔗 Cross-Reference Matrix

| File | Links To |
|------|----------|
| README.md | All others (hub) |
| DOCUMENTATION_HIERARCHY.md | UPDATE_CADENCE, DECISIONS, ARCHITECTURE |
| UPDATE_CADENCE.md | DOCUMENTATION_HIERARCHY, API_DOCUMENTATION_WORKFLOW |
| PROJECT_STATE.md | API_STATUS, DECISIONS |
| API_STATUS.md | dev-tools, PROJECT_STATE, CONSISTENCY_VALIDATOR |
| DECISIONS.md | DOCUMENTATION_HIERARCHY, ARCHITECTURE |
| ARCHITECTURE.md | DECISIONS, dev-tools patterns |
| API_DOCUMENTATION_WORKFLOW.md | UPDATE_CADENCE, CONSISTENCY_VALIDATOR |
| CONSISTENCY_VALIDATOR.md | API_STATUS, PROJECT_STATE |

---

## 📌 Latest Updates

**2026-08-28**:
- ✅ DOCUMENTATION_HIERARCHY.md created (official data flow)
- ✅ UPDATE_CADENCE.md created (official frequencies)
- ✅ DECISIONS.md populated (7 decisions)
- ✅ README.md created (main hub)
- ✅ Cross-references added throughout
- ✅ Weekly Friday 4 PM cadence established

**Status**: All documentation files connected, no orphans, clear navigation paths.

---

**Last Updated**: 2026-08-28  
**Use this as**: Visual reference, navigation aid, relationship diagram
