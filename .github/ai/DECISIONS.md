# DECISIONS

**Purpose**: Persistent record of architectural and strategic decisions, their rationale, and trade-offs

**Important**: This file is NOT a changelog. Do NOT delete entries. Only add new decisions with date and status.

**Last Updated**: 2026-08-28

**Related Documentation**:
- See `.github/ai/DOCUMENTATION_HIERARCHY.md` for how DECISIONS.md fits in the data flow
- See `.github/ai/UPDATE_CADENCE.md` for when to add new decisions (per decision, never delete)
- See `.github/DOCUMENTATION_INDEX.md` for complete reference to all docs

---

## Active Decisions

### Decision 1: Dual-Mode API (Mock + Real Switching)

**Date Decided**: 2026-04-15  
**Status**: ✅ ACTIVE & WORKING

**Problem**:
- Frontend development was blocked on backend readiness
- Backend team was working on Medusa/MercurJS integration
- Need to unblock frontend without waiting for backend completeness

**Options Evaluated**:
1. **Mock only**: Fully mock all APIs, integrate real API later → ❌ Too risky
2. **Real API only**: Wait for backend → ❌ Unacceptable timeline
3. **Dual-mode (selected)**: Mock + real per module, switch via feature flags → ✅ Best trade-off

**Decision**: Implement dual-mode API with feature flag switching

**Implementation**:
- Each module has `-client.ts` (mock/real switching) and `-mock.ts` (fallback data)
- `src/config/feature-flags.ts` controls per-module mock vs. real

**Trade-offs**:
- ✓ Parallel development, easy testing, gradual integration
- ✗ Code duplication, feature flag maintenance

**Current Status**: 
- ✅ Auth, Orders, Pricing, Suppliers, Quotes, Excel: Real API
- ⚠️ Franchisees: Real + mock (RBAC workaround)
- 🎭 Products, Openings, Checkout, Categories: Mock API

**Review Date**: 2026-12-28

---

### Decision 2: Medusa as Backend Platform

**Date Decided**: 2026-03-01  
**Status**: ✅ ACTIVE

**Problem**: Need ecommerce backend with multi-role support, product catalog, orders in 4 weeks

**Options Evaluated**:
1. **Custom backend** → ❌ 12+ weeks, over timeline
2. **WooCommerce** → ❌ Not designed for B2B
3. **Medusa (selected)** → ✅ Flexible, REST API-first, extensible

**Decision**: Use Medusa 2.x as backend platform

**Implementation**:
- Medusa Core: Auth, Products, Orders, Customers, Sellers
- Custom modules: Quotations, Pricing, Franchisees
- MercurJS: Catalog management (Carrefour-specific)

**Trade-offs**:
- ✓ 4-week timeline achievable, flexible
- ✗ Emerging platform, learning curve, may need custom extensions

**Current Status**: ✅ Working for core modules, ⚠️ Franchisees RBAC needs work

**Review Date**: 2026-12-28

---

### Decision 3: Role-Based Layouts (Next.js App Router)

**Date Decided**: 2026-05-01  
**Status**: ✅ ACTIVE & WORKING

**Problem**: Three distinct user roles (Admin, Franchisee, Supplier) with different UIs

**Options Evaluated**:
1. **Conditional rendering** → ❌ Scattered logic, doesn't scale
2. **Role-based layouts (selected)** → ✅ Clean separation
3. **Feature flag toggles** → ❌ Overkill

**Decision**: Use Next.js App Router with four role-based layouts

**Implementation**:
```
src/app/
├── (auth)/       # Login (all roles)
├── (backoffice)/ # Admin
├── (marketplace)/# Franchisee
└── (supplier)/   # Supplier
```

**Trade-offs**:
- ✓ Perfect separation, maintainable, independent evolution
- ✗ Some code duplication, larger bundle

**Current Status**: ✅ All layouts implemented, clear role separation

**Review Date**: 2026-12-28

---

### Decision 4: Feature Flags for Module Integration

**Date Decided**: 2026-04-20  
**Status**: ✅ ACTIVE

**Problem**: Modules ready at different times, need runtime control without redeployment

**Options Evaluated**:
1. **Hardcoded conditions** → ❌ Must rebuild to change
2. **Feature flags (selected)** → ✅ Runtime, centralized
3. **GraphQL directives** → ❌ Overkill

**Decision**: Use centralized feature flags in `src/config/feature-flags.ts`

**Implementation**: Per-module toggles for mock/real, backendReady flag

**Trade-offs**:
- ✓ Runtime toggles, clear status, easy experimentation
- ✗ Config maintenance, must sync with reality

**Current Status**: ✅ Working, Franchisees.useMock = true (RBAC workaround)

**Review Date**: 2026-12-28

---

### Decision 5: Zod + react-hook-form for Validation

**Date Decided**: 2026-03-15  
**Status**: ✅ ACTIVE

**Problem**: Need client-side form validation with type safety

**Options Evaluated**:
1. **Manual validation** → ❌ Repetitive, error-prone
2. **Yup + Formik** → ⚠️ Viable but less type-safe
3. **Zod + react-hook-form (selected)** → ✅ TypeScript-first

**Decision**: Zod for schema validation + react-hook-form for form state

**Trade-offs**:
- ✓ Type safety, lightweight, great DX
- ✗ Smaller community, less docs

**Current Status**: ✅ All forms using this pattern

**Review Date**: 2026-12-28

---

### Decision 6: Zustand for Global State

**Date Decided**: 2026-03-20  
**Status**: ✅ ACTIVE

**Problem**: Need global state (auth, cart, theme) without overkill

**Options Evaluated**:
1. **Context API** → ❌ Verbose, causes re-renders
2. **Redux** → ❌ Over-engineered
3. **Zustand (selected)** → ✅ Perfect balance

**Decision**: Zustand for auth, cart, UI state

**Trade-offs**:
- ✓ Minimal boilerplate, excellent DX, small bundle
- ✗ Smaller ecosystem

**Current Status**: ✅ Auth, cart, UI state all in Zustand

**Review Date**: 2026-12-28

---

### Decision 7: shadcn/ui (Radix + Tailwind) for Components

**Date Decided**: 2026-02-15  
**Status**: ✅ ACTIVE

**Problem**: Need accessible component library that works with Tailwind

**Options Evaluated**:
1. **Material-UI** → ❌ Heavy, conflicts with Tailwind
2. **Ant Design** → ❌ Too rigid
3. **shadcn/ui (selected)** → ✅ Headless, accessible, flexible

**Decision**: shadcn/ui with Radix components + Tailwind styling

**Trade-offs**:
- ✓ Full control, accessible, lightweight
- ✗ Manual updates if upstream changes

**Current Status**: ✅ All UI using shadcn/ui

**Review Date**: 2026-12-28

---

## Rejected Decisions

### Decision: Use GraphQL for API

**Date Considered**: 2026-02-20  
**Status**: ❌ REJECTED

**Why**: Medusa is REST-first, would add complexity, team knows REST, sufficient for scope

**Revisit If**: API complexity exceeds 200+ endpoints

---

## Upcoming Decisions

### Decision: Payment Processing Integration

**Status**: 🔄 IN PROGRESS  
**Timeline**: 2026-09-15  
**Scope**: Stripe vs. PayPal vs. Local payments; Checkout module impact

---

## How to Add New Decision

1. Create heading: `### Decision N: Title`
2. Fill: Date, Status, Problem, Options, Decision, Implementation, Trade-offs, Current Status, Review Date
3. Do NOT delete old entries; mark RETIRED instead
4. Update "Last Updated" date

**Format Template**:
```markdown
### Decision X: Brief title

**Date Decided**: YYYY-MM-DD  
**Status**: ✅ ACTIVE | ⚠️ PARTIAL | ❌ RETIRED

**Problem**: Why was this needed?

**Options**:
1. Option A → Why rejected
2. Option B → Why rejected
3. Option C (selected) → Why chosen

**Decision**: What was decided

**Implementation**: How it was implemented

**Trade-offs**: What we gained/lost

**Current Status**: Where are we now

**Review Date**: Next review date
```

---

## Last Updated

- **2026-08-28**: Formalized with 7 active decisions, 1 rejected, clear decision record for persistent context

## DEC-001 — Medusa remains the ecommerce backend foundation

Status: Accepted

### Context

The platform requires ecommerce functionality including products, variants, pricing, orders and related business operations.

### Decision

Medusa / MercurJS remains the ecommerce backend foundation.

Project-specific functionality should extend Medusa rather than replace or modify its core.

### Reason

This preserves framework compatibility and reduces maintenance risk.

### Consequences

Custom business functionality should preferably use:

* modules
* services
* workflows
* API routes
* subscribers

Direct modifications to Medusa core should be avoided.

---

## DEC-002 — Next.js is the frontend application layer

Status: Accepted

### Context

The platform requires separate interfaces for administration, franchisees and suppliers.

### Decision

Next.js is used as the frontend application layer.

### Consequences

Frontend functionality should follow the existing Next.js architecture.

New frontend frameworks should not be introduced without a strong reason.

---

## DEC-003 — Forms use react-hook-form and Zod

Status: Accepted

### Context

The project needs consistent form handling and validation.

### Decision

Forms should use:

* react-hook-form
* Zod

### Consequences

Do not introduce alternative form or validation libraries for isolated features.

Reuse existing schemas and patterns when possible.

---

## DEC-004 — shadcn/ui is the preferred UI component system

Status: Accepted

### Decision

Use shadcn/ui components where appropriate.

### Consequences

Avoid introducing additional component libraries unless required.

---

## DEC-005 — Backend permissions are authoritative

Status: Accepted

### Context

The platform contains role-specific and commercially sensitive information.

### Decision

Authorization must be enforced by backend rules.

Frontend route or component visibility is not sufficient security.

### Consequences

Any new protected workflow must define:

* who can read
* who can create
* who can modify
* who can approve
* who can change status

---

## DEC-006 — Avoid duplicate sources of truth

Status: Accepted

### Context

The system combines Medusa ecommerce data and project-specific workflow data.

### Decision

Each business entity should have a clearly defined source of truth.

### Consequences

Avoid storing the same authoritative state independently in several modules.

Frontend state should normally reflect backend state.

---

## DEC-007 — New store openings are project-specific workflow entities

Status: Accepted

### Context

New store openings involve franchisees, suppliers, plans, quotations, approvals and financing.

This workflow extends beyond standard ecommerce order functionality.

### Decision

Store openings should be treated as a project-specific business workflow rather than being forced into standard Medusa order entities.

### Consequences

Opening-specific states and relationships may live in custom modules/services/workflows.

---

## DEC-008 — Quotations belong to the opening workflow

Status: Accepted

### Context

Several suppliers may submit quotations for a single opening.

### Decision

Supplier quotations are associated with an opening project.

The franchisee can review available quotations and accept according to defined business rules.

### Consequences

Quotation states must be explicit.

Acceptance permissions must be enforced on the backend.

---

## DEC-009 — Prefer targeted fixes over broad refactoring

Status: Accepted

### Context

AI agents frequently expand the scope of development tasks unnecessarily.

### Decision

For bugs, API errors and TypeScript problems, prefer the smallest safe modification.

### Consequences

Agents should not perform unrelated refactors during debugging.

---

## DEC-010 — AI agents should use minimum necessary context

Status: Accepted

### Context

Large repository scans increase AI cost and can introduce irrelevant reasoning.

### Decision

AI agents should inspect only the files required for the current task.

They should consult existing project documentation before rediscovering architecture.

### Consequences

Use:

* .github/ai/PROJECT_STATE.md
* .github/ai/API_STATUS.md
* .github/ai/ARCHITECTURE.md
* .github/ai/DECISIONS.md

as the primary project context.

Full repository exploration should be reserved for cases where it is genuinely necessary.
