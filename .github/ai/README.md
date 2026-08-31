# `.github/ai/README.md`

# AI Project Context

This directory contains persistent project context for developers and AI agents.

Do not read every file automatically.

Choose the minimum document required for the current task.

## Current project status

Read:

`PROJECT_STATE.md`

Use for:

- module readiness
- current priorities
- known blockers
- business workflows
- key project locations

## Detailed API state

Read:

`API_STATUS.md`

Use for:

- API implementation status
- real vs mock modules
- known endpoint problems
- production readiness

For authoritative endpoint facts use:

`src/app/(backoffice)/admin/dev-tools/page.tsx`

## Architecture

Read:

`ARCHITECTURE.md`

Use for:

- system boundaries
- design patterns
- source-of-truth rules
- frontend/backend responsibilities
- security principles

## Decisions

Read:

`DECISIONS.md`

Use when asking:

- Why was this technology selected?
- Why does this pattern exist?
- Has this approach already been considered?
- Would a proposed change contradict a previous decision?

## Documentation process

`DOCUMENTATION_HIERARCHY.md`

defines authority.

`UPDATE_CADENCE.md`

defines when files should change.

## Core rule

Do not load project documentation unless it materially helps the current task.


# `.github/ai/DOCUMENTATION_HIERARCHY.md`

# Documentation Hierarchy

## Authoritative API data flow

```text
src/app/(backoffice)/admin/dev-tools/page.tsx
                  ↓
        .github/ai/API_STATUS.md
                  ↓
      .github/ai/PROJECT_STATE.md
```

Information propagates forward only.

Do not propagate status information backwards.

## Source of truth — dev-tools

`dev-tools/page.tsx`

contains authoritative endpoint facts:

- endpoint
- method
- module
- implementation status
- real/mock state
- authentication requirements
- backend mapping

Update immediately.

## API inventory — API_STATUS

`API_STATUS.md`

summarizes detailed API readiness.

It derives from dev-tools.

It is not authoritative over dev-tools.

## Project overview — PROJECT_STATE

`PROJECT_STATE.md`

contains module-level readiness and strategic project context.

It derives API readiness from API_STATUS.

It should not contain a complete endpoint inventory.

## Stable context

`ARCHITECTURE.md`

answers:

How is the system designed?

`DECISIONS.md`

answers:

Why was it designed that way?

These documents are not part of routine endpoint synchronization.

## Conflict resolution

When documentation conflicts:

1. verify implementation
2. verify dev-tools
3. correct dev-tools if necessary
4. synchronize API_STATUS
5. synchronize PROJECT_STATE if module-level state changed

Never resolve conflicts by guessing.


# `.github/ai/UPDATE_CADENCE.md`

# Documentation Update Cadence

## dev-tools

Update immediately when:

- endpoint added
- endpoint removed
- path/method changed
- status changed
- real/mock implementation changed

## API_STATUS.md

Update:

- after approximately 3-5 endpoint changes
- after major workflow validation
- before release
- during regular project synchronization

Do not update for every insignificant edit.

## PROJECT_STATE.md

Update when:

- module changes Mock → Partial → Ready
- a ready module regresses
- major blocker appears/disappears
- business priorities change
- sprint/project state materially changes

Do not update for individual endpoint additions.

## ARCHITECTURE.md

Update only when:

- system pattern changes
- major architecture changes
- authentication architecture changes
- source-of-truth ownership changes
- significant infrastructure changes
- major domain boundaries change

## DECISIONS.md

Add an entry when a decision has meaningful future impact.

Do not record trivial implementation choices.

Do not delete historical decisions.

Mark superseded decisions appropriately.


# `.github/ai/PROJECT_STATE.md`

# PROJECT STATE

**Updated:** 2026-08-28

## Purpose

High-level project and module status for developers and AI agents.

API readiness derives from `.github/ai/API_STATUS.md`.

Do not use this file as the authoritative endpoint inventory.

## Stack

Frontend:

- Next.js App Router
- React
- TypeScript strict mode
- react-hook-form
- Zod
- shadcn/ui
- Zustand
- Stripe integration

Backend:

- Medusa
- MercurJS

Quality:

- Vitest
- Playwright
- ESLint

## Actors

### Admin

Area:

`(backoffice)` → `/admin/`

Responsibilities include:

- catalog administration
- order oversight
- product approval
- franchisee management
- supplier management
- new store opening management

### Franchisee

Area:

`(marketplace)` → `/marketplace/`

Responsibilities include:

- product browsing
- orders
- quotations
- approvals

### Supplier

Area:

`(supplier)` → `/supplier/`

Responsibilities include:

- product management
- quotations
- order fulfillment

## Main Modules

| Module | Purpose | Frontend | Backend |
|---|---|---:|---|
| Auth | Login and sessions | ✅ | ✅ Ready |
| Pricing | Product approval and markup | ✅ | ✅ Ready |
| Suppliers | Vendor management | ✅ | ✅ Ready |
| Products | Catalog CRUD and variants | ✅ | 🟡 Mock |
| Openings | Store projects and documents | ✅ | 🟡 Mock |
| Orders | Multi-role orders and fulfillment | ✅ | ✅ Ready |
| Quotes | Quotations and signatures | ✅ | ✅ Ready |
| Franchisees | Franchisee management | ✅ | ⚠️ Partial |
| Categories | Product categories | ✅ | 🟡 Mock |
| Checkout | Cart and payments | ✅ | 🟡 Mock |
| Excel Import | Bulk upload | ✅ | ✅ Ready |

## Architecture summary

Frontend:

Next.js App Router with:

- `(auth)`
- `(backoffice)`
- `(marketplace)`
- `(supplier)`

API layer:

Dual-mode clients support mock/real switching.

Feature flags:

`src/config/feature-flags.ts`

State:

Zustand for relevant application state.

Backend:

Medusa / MercurJS.

## Business workflows

### Quotations

Admin creates opening
→ suppliers invited
→ supplier creates quotation
→ franchisee reviews
→ franchisee selects quotation
→ digital signature
→ administration validation

### Product catalog

Supplier uploads/proposes product
→ pending approval
→ administration reviews
→ markup applied
→ approved product becomes available

### Orders

Franchisee selects products
→ checkout
→ order
→ supplier fulfillment
→ tracking
→ completion

## Current API summary

Ready:

- Auth: 4
- Pricing: 8
- Suppliers: 7
- Excel Import: 8
- Orders: 17
- Quotes: 13

Total ready: 57

Partial:

- Franchisees: 9

Mock:

- Openings: 24
- Products: 8
- Checkout: 15
- Categories: 4

## Current priorities

- quotation workflow integration
- supplier permissions and RBAC
- checkout/Stripe flow
- franchisee dashboard statistics

## Important blockers / decisions

Still requiring definition:

- Stripe Billing
- Stripe Connect
- Odoo integration
- vendor settlement
- refund workflow
- immutable audit logging

## Known issues

### Franchisees

`GET /admin/customers`

and relevant GET operations return 403 due to RBAC.

Temporary workaround:

`franchisees.useMock = true`

### Stripe

PaymentIntents integration is not fully validated.

### API contracts

When changing a module from mock to real API, verify actual backend responses against frontend TypeScript contracts.

### Documents

Real backend download URL generation requires verification.

## Key files

- `src/config/feature-flags.ts`
- `src/app/(backoffice)/admin/dev-tools/page.tsx`
- `.github/ai/API_STATUS.md`
- `src/lib/api/`
- `src/types/`
- `src/app/`

## To verify

- exact Medusa version/deployment details
- PaymentIntent flow
- document storage backend
- Odoo specification
- settlement rules
- MFA approach


# `.github/ai/API_STATUS.md`

# API STATUS

**Updated:** 2026-08-28

## Authority

Source of truth:

`src/app/(backoffice)/admin/dev-tools/page.tsx`

This file derives from that source.

## Current summary

Real endpoints:

66

Fully working:

57

Partial:

9

Status:

🟡 Partially production-ready

## Real API

### Auth — 4 endpoints

Includes:

- admin/franchisee login
- supplier/vendor login
- session
- logout

Status:

✅ Working overall

Some session operations may still require validation.

### Orders — 17 endpoints

Admin and supplier order operations.

Status:

✅ WORKING

Workflow validated 2026-08-26.

### Pricing — 8 endpoints

Product approval and seller markup operations.

Status:

✅ WORKING

### Suppliers — 7 endpoints

Seller/vendor management.

Status:

✅ WORKING

### Excel Import — 8 endpoints

Admin/vendor:

- template
- upload
- job list
- job detail

Status:

✅ WORKING

### Quotes — 13 endpoints

Franchisee:

- list
- detail
- award
- reject
- sign
- statistics

Supplier:

- invitations
- create
- update
- submit
- decline
- list
- detail

Status:

✅ WORKING

### Franchisees — 9 endpoints

Create/update/delete/address operations work.

Known problem:

`GET /admin/customers`

and:

`GET /admin/customers/:id`

return 403 because of RBAC.

Status:

⚠️ PARTIAL

## Mock API

### Openings — 24 endpoints

Includes:

- projects
- categories
- documents
- invitations
- quotations
- financing
- workflow status

Status:

🎭 MOCK

### Products — 8 endpoints

Status:

🎭 MOCK

### Checkout — 15 endpoints

Includes:

- cart
- addresses
- shipping
- payment sessions
- order completion

Status:

🎭 MOCK

### Catalog

Marketplace catalog still uses mock/fallback behavior where real integration is incomplete.

### Categories — 4 endpoints

Status:

🎭 MOCK

## Known issues

- Franchisee GET endpoints: 403 RBAC
- Stripe PaymentIntent flow not fully tested
- document download URL generation requires verification

## Production interpretation

✅ Ready:

Auth, Orders, Pricing, Suppliers, Quotes, Excel Import

⚠️ Partial:

Franchisees

🎭 Not production-ready:

Openings, Products, Checkout, Categories and other modules still using mock API

## Agent rule

Do not assume the whole backend is production-ready.

Check the relevant module before implementation.


# `.github/ai/ARCHITECTURE.md`

# Project Architecture

## Overview

This is a B2B ecommerce platform for:

- administrators
- franchisees
- suppliers

Technology:

- Next.js
- React
- TypeScript
- react-hook-form
- Zod
- shadcn/ui
- Zustand
- Medusa / MercurJS
- REST APIs

## Architectural principles

### Medusa as ecommerce foundation

Medusa / MercurJS remains the backend foundation.

Avoid modifying Medusa core.

Project-specific behavior should use:

- custom modules
- services
- workflows
- API routes
- subscribers
- extensions

### Next.js frontend

Next.js provides role-specific frontend applications.

Frontend responsibilities:

- UI
- forms
- frontend validation
- API interaction
- dashboards
- workflow presentation

Business authorization is enforced by backend rules.

### Dual-mode API

Modules may operate against:

- real backend APIs
- mock/fallback APIs

Switching is controlled centrally through:

`src/config/feature-flags.ts`

Mocks support parallel development but do not define final shared contracts.

### Forms

Forms use:

- react-hook-form
- Zod

Avoid duplicate validation patterns.

### UI

shadcn/ui is the preferred component system.

### State

Zustand is used for global application state where appropriate.

Do not duplicate authoritative backend business state unnecessarily.

## Domains

### Administration

Responsible for:

- franchisees
- suppliers
- catalog administration
- new store openings
- invitations
- quotation supervision
- approvals

### Franchisees

May interact with:

- stores
- openings
- quotations
- orders
- approvals

Access must be restricted to their own authorized data.

### Suppliers

May interact with:

- products
- invitations
- opening projects
- plans
- quotations
- orders

Access must be restricted to assigned resources.

## Core modules

### Catalog

Medusa should remain the main source of ecommerce product truth whenever possible.

### Orders

Medusa owns ecommerce order lifecycle.

Avoid duplicate order state.

### Openings

Openings are project-specific workflow entities.

An opening belongs to a franchisee and may involve multiple suppliers.

### Quotations

Quotations belong to an opening.

Several suppliers may submit quotations.

Backend rules control valid transitions and acceptance.

## Opening conceptual workflow

Admin creates opening
→ plans/documents associated
→ suppliers invited
→ supplier accesses project
→ supplier downloads plans
→ supplier submits quotation
→ franchisee reviews quotations
→ franchisee accepts quotation
→ digital signature
→ administration validation
→ financing approval
→ completion

Exact state names belong in implementation/workflow definitions.

## API contracts

Maintain consistency between:

- route
- method
- request
- response
- TypeScript
- Zod
- permissions

Shared frontend/backend contracts must not change unilaterally.

## Security

Role-sensitive operations must be backend-enforced.

Frontend route/component visibility is not security.

## Data ownership

Whenever possible:

- Medusa owns ecommerce entities
- project modules own project-specific workflow entities
- frontend consumes backend state

Avoid duplicate sources of truth.

## Significant changes

Before architectural changes evaluate:

- actors
- modules
- API contracts
- data model
- permissions
- frontend impact
- backend impact
- migrations
- backwards compatibility

Record meaningful decisions in:

`.github/ai/DECISIONS.md`


# `.github/ai/DECISIONS.md`

# Architecture and Product Decisions

## Purpose

Record decisions whose loss would cause:

- repeated analysis
- contradictory implementations
- duplicated systems
- contract divergence
- unnecessary future AI work

This is not a changelog.

Do not delete historical decisions.

Use statuses such as:

- Active
- Proposed
- Superseded
- Rejected

## DEC-001 — Dual-mode API

Status:

Active

Decision:

Modules may switch independently between mock and real APIs through centralized feature flags.

Reason:

Allows frontend and backend development to proceed in parallel.

Trade-off:

Additional client/mock maintenance.

## DEC-002 — Medusa / MercurJS backend

Status:

Active

Decision:

Medusa / MercurJS remains the ecommerce backend foundation.

Project-specific behavior extends rather than modifies Medusa core.

## DEC-003 — Role-based Next.js layouts

Status:

Active

Decision:

Use separate App Router groups for:

- auth
- administration
- franchisee marketplace
- supplier portal

## DEC-004 — Centralized feature flags

Status:

Active

Decision:

Use:

`src/config/feature-flags.ts`

for module-level real/mock API switching.

## DEC-005 — react-hook-form + Zod

Status:

Active

Decision:

Use react-hook-form for form state and Zod for schema validation.

## DEC-006 — Zustand

Status:

Active

Decision:

Use Zustand for global frontend state where appropriate.

Do not introduce another global state library without architectural justification.

## DEC-007 — shadcn/ui

Status:

Active

Decision:

Use shadcn/ui as the preferred component system.

## DEC-008 — Backend permissions are authoritative

Status:

Active

Decision:

Frontend route/component visibility does not provide sufficient authorization.

Backend rules enforce protected operations.

## DEC-009 — Openings are project workflow entities

Status:

Active

Decision:

New store openings should not be forced into standard ecommerce order entities.

They belong to project-specific workflow modules.

## DEC-010 — Quotations belong to openings

Status:

Active

Decision:

Supplier quotations are associated with opening projects and have explicit backend-controlled states.

## DEC-011 — Minimum AI context

Status:

Active

Decision:

AI agents should inspect the minimum context necessary.

Project documentation should be used instead of repeatedly rediscovering architecture.

Full repository exploration is exceptional.

## DEC-012 — Prefer targeted changes

Status:

Active

Decision:

For bugs, API errors and TypeScript issues, prefer the smallest safe fix.

Do not perform opportunistic unrelated refactors.

## Rejected — GraphQL

Status:

Rejected

Decision:

Do not introduce GraphQL for the current architecture.

REST remains sufficient and aligns with the backend.

## Upcoming decisions

Not yet finalized:

- Stripe Billing
- Stripe Connect
- Odoo integration
- supplier settlement
- refund workflow
- audit logging

Do not treat these as accepted architecture until explicitly decided.

## New decision template

### DEC-XXX — Title

Date:

Status:

Context:

Decision:

Reason:

Consequences:

Alternatives considered:

Frontend/backend impact: