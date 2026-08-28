# .github/ai/ — Documentation Hub

**Central reference for all project documentation, API status, decisions, and architecture.**

**Date**: 2026-08-28  
**Status**: ✅ Complete hierarchy established

---

## 📋 Want to See the Visual Map?

**[DOCUMENTATION_MAP.md](DOCUMENTATION_MAP.md)** shows how all files connect
- Hierarchy diagram
- Data flow chart
- Weekly sync ritual
- Cross-reference matrix

---

## 🎯 START HERE

Choose your path based on what you need to do:

### "I need to update documentation"
→ **[UPDATE_CADENCE.md](UPDATE_CADENCE.md)** (5 min read)
- When to update each file
- Triggers for updates
- Weekly Friday 4 PM sync procedure
- Decision tree: "Which file should I update?"

### "I want to understand the hierarchy"
→ **[DOCUMENTATION_HIERARCHY.md](DOCUMENTATION_HIERARCHY.md)** (10 min read)
- Official data flow: dev-tools → API_STATUS → PROJECT_STATE
- Hierarchy rules and constraints
- Why each file exists
- How decisions relate to updates

### "I want the quick reference"
→ **[PROJECT_STATE.md](PROJECT_STATE.md)** (2 min read)
- Current module status (Admin, Franchisee, Supplier)
- API ready status: ✅ 57 endpoints ready, ⚠️ 9 partial, 🎭 51+ mock
- Known issues and workarounds
- Business priorities

### "I need detailed endpoint status"
→ **[API_STATUS.md](API_STATUS.md)** (5 min read)
- Complete endpoint inventory (140+ endpoints)
- Grouped by module (Auth, Orders, Pricing, etc.)
- Status indicators: ✅ working, ⚠️ partial, 🎭 mock
- Known issues and troubleshooting

### "I want to understand why we designed this way"
→ **[DECISIONS.md](DECISIONS.md)** (15 min read)
- 7 active decisions documented
- Each with: problem, options, rationale, trade-offs
- Examples: Dual-mode API, Medusa backend, role-based layouts
- How decisions shaped current architecture

### "I want to understand the architecture"
→ **[ARCHITECTURE.md](ARCHITECTURE.md)**
- System design and layers
- API patterns and client structure
- Role-based layouts (Admin, Franchisee, Supplier)
- State management approach

### "I'm lost, show me all documents"
→ **[../DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md)**
- Complete map of all documentation files
- Status of each file
- Cross-references

---

## 📊 The Official Hierarchy

```
SOURCE OF TRUTH (Real-time)
└─ src/app/(backoffice)/admin/dev-tools/page.tsx
   ↓
INVENTORY (Volatile, 3-5 endpoints)
└─ API_STATUS.md (140+ endpoints, 57 working)
   ↓
OVERVIEW (Semi-stable, weekly)
└─ PROJECT_STATE.md (Module status, priorities)

CONTEXT (Stable, quarterly)
├─ ARCHITECTURE.md (System design)
└─ DECISIONS.md (Why we chose this)
```

**Key Rule**: Data flows DOWN. Never update higher levels to sync with lower.

---

## 🔄 Weekly Sync Cadence

Every **Friday 4 PM** (15 minutes):

1. Check `dev-tools/page.tsx` for endpoint changes
2. If changes exist:
   - Update `API_STATUS.md` (endpoints, counts, status)
   - Check if `PROJECT_STATE.md` needs update (module status changes)
   - Validate alignment
3. Commit: `docs(api): sync API_STATUS and PROJECT_STATE (batch of N endpoints)`

See **[UPDATE_CADENCE.md](UPDATE_CADENCE.md)** for complete procedure.

---

## 📁 Files in This Directory

| File | Purpose | Status |
|------|---------|--------|
| **README.md** | Main hub + navigation | ✅ 200+ lines |
| **DOCUMENTATION_MAP.md** | Visual diagram + relationships | ✅ 400+ lines |
| **DOCUMENTATION_HIERARCHY.md** | Official data flow + rules | ✅ 380+ lines |
| **UPDATE_CADENCE.md** | When/why to update each file | ✅ 450+ lines |
| **PROJECT_STATE.md** | Current project status + priorities | ✅ 120+ lines |
| **API_STATUS.md** | Complete endpoint inventory | ✅ 150+ lines |
| **ARCHITECTURE.md** | System design + patterns | ✅ Existing |
| **DECISIONS.md** | Persistent decisions + rationale | ✅ 300+ lines |

---

## 📋 Supporting Documents (in ../)

| File | Purpose |
|------|---------|
| **API_DOCUMENTATION_WORKFLOW.md** | Step-by-step sync procedures |
| **CONSISTENCY_VALIDATOR.md** | Prevents misalignment |
| **DOCUMENTATION_CLASSIFICATION.md** | Explains update frequencies |
| **DOCUMENTATION_INDEX.md** | Complete file directory |
| **API_QUICK_REFERENCE.md** | One-page developer guide |
| **COST_OPTIMIZATION_GUIDE.md** | Efficiency strategies |

---

## 🎯 Common Questions

**Q: I added a new endpoint. What do I do?**
A: Update `src/app/(backoffice)/admin/dev-tools/page.tsx` immediately. Other docs sync Friday.
→ See [UPDATE_CADENCE.md](UPDATE_CADENCE.md#dev-toolspage.tsx)

**Q: Should I update ARCHITECTURE.md?**
A: Only for architectural changes, not for single endpoints.
→ See [DOCUMENTATION_HIERARCHY.md](DOCUMENTATION_HIERARCHY.md#when-to-update-each-file)

**Q: When do I update PROJECT_STATE.md?**
A: When module status changes (Mock → Partial → Ready) or on sprint boundary.
→ See [UPDATE_CADENCE.md](UPDATE_CADENCE.md#project_statemd)

**Q: Why are Franchisees marked as ⚠️ Partial?**
A: RBAC permission issue on GET endpoints. Read details in [PROJECT_STATE.md](PROJECT_STATE.md#known-issues)

**Q: What endpoints are actually working?**
A: 57 endpoints ready + 9 partial (Franchisees). Details in [API_STATUS.md](API_STATUS.md#production-readiness-summary)

**Q: Why did we choose Medusa?**
A: See Decision 2 in [DECISIONS.md](DECISIONS.md#decision-2-medusa-as-backend-platform)

---

## 📈 Status Summary (2026-08-28)

**Documentation**: ✅ Complete hierarchy established
- Jerarquía oficial: dev-tools → API_STATUS → PROJECT_STATE
- Contexto: ARCHITECTURE + DECISIONS
- Frecuencias: Real-time → Weekly → Quarterly
- Validación: Automation para prevenir contradictions

**API Endpoints**: 🟡 Partially production-ready
- ✅ 57 ready (Auth, Orders, Pricing, Suppliers, Quotes, Excel)
- ⚠️ 9 partial (Franchisees - RBAC issue)
- 🎭 51+ mock (Products, Openings, Checkout, Categories)

**Modules by Role**:
- 🔓 Admin (Backoffice): Orders, Pricing, Franchisees, Excel Import
- 🛍️ Franchisee (Marketplace): Products, Orders, Quotes, Categories
- 📦 Supplier (Vendor): Products, Orders, Quotes, Pricing

---

## 🚀 Getting Started (New Team Member)

1. **Read** [DOCUMENTATION_HIERARCHY.md](DOCUMENTATION_HIERARCHY.md) (10 min) ← Understand the hierarchy
2. **Skim** [DECISIONS.md](DECISIONS.md) (10 min) ← Understand design choices
3. **Bookmark** [UPDATE_CADENCE.md](UPDATE_CADENCE.md) (reference) ← Know when to update
4. **Check** [PROJECT_STATE.md](PROJECT_STATE.md) (2 min) ← Know current status
5. **Review** [API_STATUS.md](API_STATUS.md) (5 min) ← Know which endpoints work

**Total onboarding: 30 minutes**

---

## 💡 Key Principles

1. **Data flows DOWN only**: dev-tools → API_STATUS → PROJECT_STATE
2. **Each file has a purpose**: Don't mix concerns
3. **Update frequency decreases down**: Real-time → Weekly → Quarterly
4. **Never delete decisions**: Only add new or mark retired
5. **Validation prevents contradictions**: Weekly consistency check
6. **Batch updates save time**: 3-5 endpoints per sync, not 1 at a time

---

## 📞 Questions?

- **"Which file should I update?"** → [UPDATE_CADENCE.md](UPDATE_CADENCE.md#decision-tree-which-file-to-update)
- **"What's the data flow?"** → [DOCUMENTATION_HIERARCHY.md](DOCUMENTATION_HIERARCHY.md#the-official-hierarchy)
- **"How often do I sync?"** → [UPDATE_CADENCE.md](UPDATE_CADENCE.md#the-rhythm-weekly-sync-friday-4-pm)
- **"Why this design?"** → [DECISIONS.md](DECISIONS.md)
- **"What's working now?"** → [PROJECT_STATE.md](PROJECT_STATE.md) or [API_STATUS.md](API_STATUS.md)

---

**Last Updated**: 2026-08-28
**Maintained By**: AI agents + Development team
**Review Cycle**: Weekly (Friday 4 PM) + Quarterly full review
