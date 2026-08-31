# `.github/copilot-instructions.md`

# Project Instructions

This repository contains a B2B ecommerce platform for franchisees, suppliers and administrators.

## Stack

Frontend:
- Next.js
- React
- TypeScript
- react-hook-form
- Zod
- shadcn/ui
- Zustand

Backend:
- Medusa / MercurJS
- REST APIs

Main actors:
- Admin
- Franchisee
- Supplier

Main domains:
- Catalog
- Orders
- Franchisees
- Suppliers
- New store openings
- Supplier quotations
- Pricing
- Checkout
- Excel import

---

## 1. Core development rules

Use the minimum context necessary to solve the task.

Do not scan the entire repository for routine work.

Prefer:
1. reuse
2. extend
3. adapt
4. create

Before creating a new component, hook, service, type, utility or API abstraction, search for an existing equivalent.

Prefer small targeted modifications.

Do not perform unrelated refactors.

Do not replace working architecture simply because another implementation would also work.

Once the task is solved, validated and consistent with existing patterns, stop.

Do not continue refactoring, abstracting or documenting without a concrete benefit.

---

## 2. Progressive context rule

Start with the smallest useful context.

Use this order:

1. symbol
2. function
3. relevant fragment
4. file
5. related files
6. module
7. repository

Only expand context when there is evidence that more context is required.

Do not repeatedly read files already inspected during the current task.

Do not rediscover architecture already documented.

---

## 3. Task classification

Before modifying code, classify the task internally as:

- TYPE
- FRONTEND
- API
- DEBUG
- DOCUMENTATION
- ARCHITECTURE

Simple/local tasks should use minimal reasoning.

Use deeper reasoning only when justified by:

- architecture
- authentication
- authorization
- permissions
- multi-role workflows
- checkout
- shared API contracts
- database changes
- migrations
- security
- difficult cross-module bugs
- significant state transitions

---

## 4. API debugging

For API problems inspect in this order:

1. frontend caller
2. endpoint
3. HTTP method
4. parameters
5. request payload
6. TypeScript types
7. Zod schema
8. backend route
9. backend service/workflow
10. actual response
11. frontend consumer

Never assume an API response structure.

Compare the real backend response with frontend expectations.

The authoritative API inventory is:

`src/app/(backoffice)/admin/dev-tools/page.tsx`

Use `.github/ai/API_STATUS.md` only when module-level API context is required.

---

## 5. Shared API contracts

Frontend/backend contracts are shared interfaces.

Do not change a shared API contract unilaterally.

Treat the following as contract changes:

- endpoint path
- HTTP method
- request payload
- response shape
- field names
- field types
- validation behavior
- authentication
- permissions
- HTTP status semantics
- pagination
- filtering

If a task requires one of these changes, explicitly identify it as a contract change before implementation.

A frontend mock or provisional implementation does not automatically define the backend contract.

A backend implementation is authoritative for existing real endpoints unless a contract change has explicitly been agreed.

---

## 6. TypeScript

Do not use `any` to hide errors.

TypeScript interfaces and DTOs must represent actual backend responses.

Do not add a property to an interface only to suppress a compiler error.

Prefer clear shared contract types when appropriate.

---

## 7. Forms

Use:

- react-hook-form
- Zod

Do not introduce a different form or validation library for isolated features.

Reuse existing schemas and patterns where possible.

---

## 8. Frontend

Follow the existing Next.js architecture.

Reuse existing:

- layouts
- components
- hooks
- API clients
- state stores
- validation patterns
- UI patterns

Use shadcn/ui where appropriate.

Avoid unnecessary client components.

Do not introduce another UI framework without a strong architectural reason.

---

## 9. State

Zustand is the existing global state solution.

Do not introduce Redux, another global store or additional state abstraction unless the existing architecture cannot reasonably solve the requirement.

Backend state remains authoritative for business entities.

Avoid duplicate sources of truth.

---

## 10. Medusa / MercurJS

Avoid modifying Medusa core.

Prefer:

- custom modules
- services
- workflows
- API routes
- subscribers
- project-specific extensions

Before proposing a backend change, determine whether it belongs to Medusa ecommerce functionality or project-specific business logic.

Do not modify authentication, permissions or database migrations unless required by the task.

---

## 11. Security

Frontend visibility is not authorization.

Backend rules must enforce role-sensitive operations.

For protected workflows verify:

- who can create
- who can read
- who can update
- who can approve
- who can reject
- who can change status

---

## 12. Documentation context

When project-level context is necessary, use the minimum relevant document.

Current project/module status:

`.github/ai/PROJECT_STATE.md`

Detailed API status:

`.github/ai/API_STATUS.md`

System design:

`.github/ai/ARCHITECTURE.md`

Previous architectural/product decisions:

`.github/ai/DECISIONS.md`

Do not automatically read all four files.

---

## 13. Documentation hierarchy

API facts flow only in this direction:

`src/app/(backoffice)/admin/dev-tools/page.tsx`
→ `.github/ai/API_STATUS.md`
→ `.github/ai/PROJECT_STATE.md`

Never propagate API status information backwards.

`ARCHITECTURE.md` and `DECISIONS.md` are stable context documents and do not participate in routine endpoint synchronization.

---

## 14. Debugging

For build/runtime errors:

1. read the complete error
2. locate the exact file and line
3. inspect the smallest relevant area
4. determine root cause
5. apply the smallest safe fix
6. check directly related errors
7. run build/typecheck/tests where appropriate

Prefer:

measure
→ locate
→ reason
→ modify
→ verify

Avoid speculative cycles of generating multiple alternative fixes.

---

## 15. Verification and stop rule

Use deterministic tools whenever possible:

- compiler
- TypeScript
- ESLint
- tests
- build
- Git
- search
- IDE references
- logs
- network responses

When:

- the requested behavior works
- TypeScript is correct
- relevant tests/build checks pass
- API contracts remain valid
- no known regression has been introduced

STOP.

Do not continue optimizing without a concrete requirement.


## 16. Model cost policy

Do not use GPT-5.5 automatically.

Do not use Claude Opus automatically.

Routine development should use the configured low-cost model.

API tasks should use the API agent.

Debugging tasks should use the Debug agent.

Architecture, shared contracts, permissions and cross-module workflows should use the Architect agent.

GPT-5.5 and Claude Opus require explicit developer selection.

Do not escalate model capability merely because a task is long.

Escalate only when the reasoning complexity genuinely requires it.


# `.github/API_DOCUMENTATION_WORKFLOW.md`

# API Documentation Workflow

## Purpose

Keep API implementation status synchronized without repeatedly scanning the repository.

## Authoritative direction

`dev-tools`
→ `API_STATUS.md`
→ `PROJECT_STATE.md`

### Source of truth

`src/app/(backoffice)/admin/dev-tools/page.tsx`

This file records:

- endpoint path
- method
- module
- real/mock status
- working/broken/untested status
- authentication
- Medusa endpoint
- relevant implementation notes

Update it immediately when an endpoint is added, removed or changes status.

---

## API_STATUS.md

File:

`.github/ai/API_STATUS.md`

Purpose:

Detailed human/AI summary of API implementation.

Update:

- every 3-5 endpoint changes
- after important validation
- before a release
- at the regular documentation sync

Always derive its facts from `dev-tools/page.tsx`.

---

## PROJECT_STATE.md

File:

`.github/ai/PROJECT_STATE.md`

Purpose:

High-level module readiness and business/project context.

Update only when:

- module status changes
- an important blocker changes
- priorities change
- sprint/project state changes

Do not update PROJECT_STATE for every endpoint.

---

## Adding an endpoint

1. Implement the endpoint.
2. Add/update its `EndpointInfo` entry in `dev-tools/page.tsx`.
3. Mark it `untested` until validated.
4. Test it.
5. Change status to `working` or `broken`.
6. After 3-5 endpoint changes, synchronize `API_STATUS.md`.
7. Update `PROJECT_STATE.md` only if module readiness changed.
8. Run consistency validation.

---

## Allowed endpoint statuses

Use only:

- `working`
- `broken`
- `untested`

Real/mock status is separate.

---

## Module status mapping

API_STATUS:

`✅ WORKING`

PROJECT_STATE:

`✅ Ready`

API_STATUS:

`⚠️ PARTIAL`

PROJECT_STATE:

`⚠️ Partial`

API_STATUS:

`🎭 MOCK`

PROJECT_STATE:

`🟡 Mock`

---

## Important rule

Do not change `dev-tools` merely because a derived document disagrees with it.

First determine which information is actually correct.

If `dev-tools` is correct, update the derived document.

If `dev-tools` is wrong, fix the real endpoint registry first and then propagate the correction forward.


# `.github/CONSISTENCY_VALIDATOR.md`

# Documentation Consistency Validator

## Purpose

Prevent contradictions between:

`.github/ai/API_STATUS.md`

and:

`.github/ai/PROJECT_STATE.md`

## Authoritative direction

`dev-tools → API_STATUS → PROJECT_STATE`

---

## Status mapping

| API_STATUS | PROJECT_STATE |
|---|---|
| ✅ WORKING | ✅ Ready |
| ⚠️ PARTIAL | ⚠️ Partial |
| 🎭 MOCK | 🟡 Mock |

---

## Validation checklist

After an API documentation sync:

- [ ] endpoint facts were taken from `dev-tools/page.tsx`
- [ ] API_STATUS endpoint counts reflect dev-tools
- [ ] real/mock state matches implementation
- [ ] known broken endpoints are documented
- [ ] PROJECT_STATE module status matches API_STATUS
- [ ] PROJECT_STATE was changed only if module-level state changed
- [ ] dates were updated when appropriate

---

## Conflict resolution

If documents disagree:

1. Check `dev-tools/page.tsx`.
2. Determine the real implementation state.
3. Correct dev-tools first if it is wrong.
4. Synchronize API_STATUS from dev-tools.
5. Synchronize PROJECT_STATE from API_STATUS if module status changed.

Never resolve a contradiction by guessing.