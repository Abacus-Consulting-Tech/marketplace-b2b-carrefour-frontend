# Project instructions

This is a B2B ecommerce platform.

Stack:
- Next.js
- React
- TypeScript
- react-hook-form
- Zod
- shadcn/ui
- Medusa / MercurJS backend

Main actors:
- Admin
- Franchisee
- Supplier

Main modules:
- Catalog
- Orders
- Franchisees
- Suppliers
- New store openings
- Supplier quotations

## General rules

Use the minimum context necessary to solve the task.

Do not scan the entire repository for routine errors.

Before modifying code, classify the problem as:

- TYPE
- FRONTEND
- API
- DEBUG
- DOCUMENTATION
- ARCHITECTURE

Prefer small targeted modifications.

Do not perform unrelated refactors.

## API debugging

For API problems inspect in this order:

1. frontend caller
2. endpoint
3. HTTP method
4. request payload
5. TypeScript types
6. Zod schema
7. backend route
8. backend service/workflow
9. response
10. frontend consumer

Never assume the API response structure.

Compare the backend response with the frontend TypeScript interface.

## TypeScript

Do not use `any` to hide errors.

Verify that properties actually exist in the API response before adding them to interfaces.

## Debugging

For build errors:

1. read the exact error
2. locate the file and line
3. inspect only the relevant area
4. identify root cause
5. apply the smallest safe fix
6. check related TypeScript errors
7. build/test

## Medusa

Avoid modifying Medusa core.

Prefer custom modules, services, workflows and API routes.

Do not modify authentication, permissions or migrations unless required by the task.

## Cost optimization

Avoid repeatedly reading files already inspected.

Do not rediscover architecture if it is documented.

Read:

- .github/ai/PROJECT_STATE.md
- .github/ai/API_STATUS.md

when project-level context is necessary.

Use deeper reasoning only for architecture, authentication, permissions, checkout, migrations and cross-module workflows.