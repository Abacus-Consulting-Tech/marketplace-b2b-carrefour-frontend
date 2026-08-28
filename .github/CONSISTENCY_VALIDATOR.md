# Documentation Consistency Validator

**Purpose**: Prevent status misalignment between API_STATUS.md and PROJECT_STATE.md

**Last Checked**: 2026-08-28

**Official Hierarchy**: See `.github/ai/DOCUMENTATION_HIERARCHY.md` for complete data flow and rules

**Quick Fact**: Data flows DOWN only. API_STATUS.md (source of truth for statuses) → PROJECT_STATE.md. Never contradict.

---

## Consistency Rules

### Rule 1: Module Status Alignment

**If API_STATUS.md says a module is:**
- `✅ WORKING` (in "Real API" section) → PROJECT_STATE.md MUST show `✅ Ready` in Backend column
- `⚠️ PARTIAL` (in "Real API" section) → PROJECT_STATE.md MUST show `⚠️ Partial` in Backend column
- `🎭 MOCK` (in "Mock API" section) → PROJECT_STATE.md MUST show `🟡 Mock` in Backend column

**Violation Impact**: Agents misinterpret project status, duplicate work, waste time investigating resolved issues

---

## Current Status Matrix (2026-08-28)

| Module | API_STATUS.md | PROJECT_STATE.md | Status | Validated |
|--------|---------------|------------------|--------|-----------|
| Auth | ✅ WORKING (4) | ✅ Ready | ✓ Aligned | 2026-08-28 |
| Orders | ✅ WORKING (17) | ✅ Ready | ✓ Aligned | 2026-08-28 |
| Pricing | ✅ WORKING (8) | ✅ Ready | ✓ Aligned | 2026-08-28 |
| Suppliers | ✅ WORKING (7) | ✅ Ready | ✓ Aligned | 2026-08-28 |
| Excel Import | ✅ WORKING (8) | ✅ Ready | ✓ Aligned | 2026-08-28 |
| Quotes | ✅ WORKING (13) | ✅ Ready | ✓ Aligned | 2026-08-28 |
| Franchisees | ⚠️ PARTIAL (9) | ⚠️ Partial | ✓ Aligned | 2026-08-28 |
| Products | 🎭 MOCK (8) | 🟡 Mock | ✓ Aligned | 2026-08-28 |
| Openings | 🎭 MOCK (24) | 🟡 Mock | ✓ Aligned | 2026-08-28 |
| Checkout | 🎭 MOCK (15) | 🟡 Mock | ✓ Aligned | 2026-08-28 |
| Categories | 🎭 MOCK (4) | 🟡 Mock | ✓ Aligned | 2026-08-28 |

**Total**: 11 modules, all aligned ✓

---

## How to Verify Consistency

### Quick Check (1 minute)

```bash
# 1. Count modules in API_STATUS.md
grep "^### " .github/ai/API_STATUS.md | wc -l

# 2. Count modules in PROJECT_STATE.md Main Modules table
grep "| \*\*" .github/ai/PROJECT_STATE.md | wc -l

# 3. They should match
```

### Detailed Check (5 minutes)

Manually verify the "Current Status Matrix" table above by:
1. Reading each module in API_STATUS.md
2. Checking the status badge (✅/⚠️/🎭)
3. Confirming PROJECT_STATE.md shows the same status
4. If mismatch found: Update PROJECT_STATE.md immediately

### Automated Validation Script (Optional)

```bash
#!/bin/bash
# Place in scripts/validate-consistency.sh

echo "Validating API_STATUS.md ↔ PROJECT_STATE.md alignment..."

# Extract modules from API_STATUS.md
api_modules=$(grep "^### " .github/ai/API_STATUS.md | sed 's/### //' | sed 's/ .*//')

# For each module, check PROJECT_STATE.md has matching status
while read -r module; do
  api_status=$(grep -A 1 "^### $module" .github/ai/API_STATUS.md | tail -1)
  
  if [[ $api_status == *"✅ WORKING"* ]]; then
    expected="✅ Ready"
  elif [[ $api_status == *"⚠️ PARTIAL"* ]]; then
    expected="⚠️ Partial"
  elif [[ $api_status == *"🎭 MOCK"* ]]; then
    expected="🟡 Mock"
  fi
  
  # Check if PROJECT_STATE.md has the expected status for this module
  if grep "| \*\*$module\*\*" .github/ai/PROJECT_STATE.md | grep -q "$expected"; then
    echo "✓ $module: $expected"
  else
    echo "✗ $module: MISMATCH (expected $expected)"
  fi
done <<< "$api_modules"
```

---

## When to Validate

### Automatic Triggers:
- [ ] After each batch endpoint update (every 3-5 endpoints)
- [ ] Before any sprint boundary or release
- [ ] When syncing API_STATUS.md from dev-tools
- [ ] When updating PROJECT_STATE.md priorities

### Weekly Cadence:
- [ ] **Every Friday 4 PM**: Run consistency check (5 min)
- [ ] If misalignment found: Fix immediately before commit

---

## Prevention Checklist

Use this checklist **BEFORE committing changes** to API_STATUS.md or PROJECT_STATE.md:

### When updating API_STATUS.md:
- [ ] Change made to module status
- [ ] I checked PROJECT_STATE.md Main Modules table
- [ ] Status badge in PROJECT_STATE.md matches API_STATUS.md
- [ ] If mismatch: I updated PROJECT_STATE.md
- [ ] I updated "Current API Status" summary in PROJECT_STATE.md

### When updating PROJECT_STATE.md Main Modules table:
- [ ] I checked API_STATUS.md for this module's current status
- [ ] Backend column in table matches API_STATUS.md status
- [ ] If changed: I also updated "Current API Status" summary
- [ ] I updated "Known Issues" if status affected troubleshooting

### When validating consistency:
- [ ] All 11 modules checked against Current Status Matrix
- [ ] Any misalignments fixed immediately
- [ ] Timestamp updated in Current Status Matrix
- [ ] "Last Checked" date updated at top of file

---

## Common Alignment Mistakes

❌ **WRONG**:
```
API_STATUS.md: "✅ WORKING — 17 endpoints validated"
PROJECT_STATE.md: "⚠️ Partial"  ← Misleads agent into thinking Orders is incomplete
```

❌ **WRONG**:
```
API_STATUS.md: "🎭 MOCK — Backend pending"
PROJECT_STATE.md: "✅ Ready"  ← Agent tries to use non-existent real API
```

✅ **CORRECT**:
```
API_STATUS.md: "✅ WORKING — 17 endpoints validated"
PROJECT_STATE.md: "✅ Ready"  ← Clear, consistent, no ambiguity
```

---

## Cost Impact of Misalignment

| Scenario | Time Wasted | Cost |
|----------|------------|------|
| Agent investigates "incomplete" Orders (actually ready) | 30 min | $50 |
| Team debates module status multiple times | 1 hour | $100 |
| Release delayed due to false status report | 4+ hours | $400+ |
| **Prevention via consistency check** | 5 min/week | $8/week |

**ROI**: $50-400 saved per misalignment detected = 6250% ROI on 5 min validation

---

## Quick Reference: Status Mapping

| API_STATUS.md | Means | PROJECT_STATE.md | Reason |
|---------------|-------|------------------|--------|
| ✅ WORKING | Real API, all endpoints functional | ✅ Ready | Production-ready |
| ⚠️ PARTIAL | Real API, some endpoints broken | ⚠️ Partial | Use with caution, known issues |
| 🎭 MOCK | Mock data only, no real backend | 🟡 Mock | Not ready for production |

---

## For AI Agents: How to Detect Misalignment

If you encounter a module marked `⚠️ Partial` in PROJECT_STATE.md but you see it listed as `✅ WORKING` in API_STATUS.md:

1. **DO NOT assume** the PROJECT_STATE.md is outdated
2. **CHECK**: Read both files carefully for discrepancies
3. **REPORT**: If misalignment found, note it and ask human to verify
4. **PREVENT**: After fixing, update this "Current Status Matrix" table

---

## Files Affected by This Validator

- `.github/ai/API_STATUS.md` — Source of truth for endpoint status
- `.github/ai/PROJECT_STATE.md` — Derived module status (must stay aligned)
- `.github/API_DOCUMENTATION_WORKFLOW.md` — Instructions for sync process

Related but not directly affected:
- `src/app/(backoffice)/admin/dev-tools/page.tsx` — Source of truth for all endpoints
- `src/config/feature-flags.ts` — Feature flag configuration
