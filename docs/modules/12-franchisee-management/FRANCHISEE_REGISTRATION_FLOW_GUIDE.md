# How a New Franchisee Joins the Platform 🏪

Guide for the backend team, written from the frontend point of view: which screens exist, which API calls we need at each step, and what we expect back. No internal implementation details, only the contract we need.

---

## 🙋 Who's involved

- **Admin** — Carrefour/marketplace staff
- **Franchisee** — the person joining the network
- **Stripe** — handles the credit-card payment; frontend calls it directly
- **Odoo** — the accounting system that issues the official invoice; frontend only needs read access once that data exists

---

## 📖 The flow, step by step — and what we call on the API

### 1. Invitation

An admin decides to onboard a new franchisee. There are two ways to start:
- Using the **"Invite Franchisee"** button in the admin panel — only name + email.
- Or sending the registration link manually by email, without using the button.

**What we call:**
- `POST /admin/franchisees/invitations` — request:
```json
{
  "name": "Maria Garcia",
  "email": "maria.garcia@email.com"
}
```
  Expected response:
```json
{
  "invitation": {
    "id": "inv_123",
    "name": "Maria Garcia",
    "email": "maria.garcia@email.com",
    "registrationUrl": "https://.../franchisee/register?...",
    "status": "pending",
    "createdAt": "2026-09-02T10:00:00Z"
  }
}
```

> This does not exist in backend today. Frontend currently simulates it by generating the registration link locally and showing it to the admin to copy.

### 2. Public registration form

The franchisee opens the link and fills the form. For franchisees, the flow currently has 4 steps: personal data, company data, financial data, and card payment.

**What we call:**
- `POST /franchisee/register` — request:
```json
{
  "firstName": "Maria",
  "lastName": "Garcia Lopez",
  "email": "maria.garcia@email.com",
  "phone": "+34 600 123 456",
  "companyName": "Carrefour Express Sur",
  "taxId": "B12345678",
  "fiscalAddress": "Calle Mayor 123",
  "municipality": "Madrid",
  "postalCode": "28001",
  "country": "Spain",
  "iban": "ES1234567890123456789012",
  "bankHolderName": "Maria Garcia Lopez",
  "swiftBic": "CAIXESBB",
  "cardHolderName": "Maria Garcia Lopez",
  "stripePaymentMethodId": "pm_1AbCdEfGh"
}
```
  Expected response:
```json
{
  "franchisee": {
    "id": "fran_123",
    "email": "maria.garcia@email.com",
    "first_name": "Maria",
    "last_name": "Garcia Lopez",
    "metadata": {
      "company_name": "Carrefour Express Sur",
      "status": "pending_approval",
      "subscription_status": "active",
      "current_period_end": "2027-09-02T10:00:00Z",
      "onboarding_status": "pending_approval"
    }
  }
}
```

> This endpoint still does not exist in backend. It is the most important missing endpoint right now.

### 3. Payment

The franchisee must pay the onboarding fee by credit card before the application can be approved.

**What frontend does:**
- Frontend calls Stripe directly in the browser to validate the card and obtain a `payment_method_id`.
- That reference is then sent inside `POST /franchisee/register`.

**Backend-owned endpoint we still need:**
- `POST /webhooks/stripe` — to receive events such as `customer.subscription.created`, `invoice.paid`, `invoice.payment_failed`, and `customer.subscription.deleted`, and update:
  - `subscription_status`
  - `stripe_customer_id`
  - `stripe_subscription_id`
  - `current_period_end`

> ✅ Decided: the payment is charged at registration time, before admin approval.

### 4. Invoices (Odoo)

This is fully backend-owned. Frontend only needs a place to read invoices that already exist.

**What we need to call:**
- `GET /franchisee/:id/invoices` — expected response:
```json
{
  "invoices": [
    {
      "id": "inv_123",
      "franchiseeId": "fran_123",
      "number": "FAC-2026-0001",
      "issueDate": "2026-09-02T10:00:00Z",
      "amount": 299,
      "currencyCode": "EUR",
      "status": "paid",
      "pdfUrl": "https://.../invoice.pdf"
    }
  ]
}
```

> Frontend already has a profile invoices section waiting for this endpoint.

### 5. Admin validation

An admin reviews the application and approves it. The admin can also edit data, change status, and add internal notes.

**What we call:**
- `GET /admin/customers?q=&limit=20&offset=0&expand=groups,shipping_addresses` — to list franchisees
  - `q` — search text
  - `limit`, `offset` — pagination
  - `expand` — to include groups and stores with each franchisee
  - we would also like server-side filtering by `status=pending_approval`
- `GET /admin/customers/:id?expand=groups,shipping_addresses` — detail view
- `PATCH /admin/franchisees/:id/status` — request:
```json
{ "status": "active" }
```
  `status` can be `pending_approval`, `active`, `suspended`, or `inactive`.

**Important backend rule we expect here:**
- If a transition to `active` is attempted while `subscription_status !== "active"`, backend should reject it consistently.

**Expected side effects on approval:**
- send the credential-activation email or link
- move `onboarding_status` to something like `approved_pending_credentials`
- emit the background event/outbox that will sync the Odoo `partner`

- `POST /admin/customers/:id` — to save edits or internal notes, for example:
```json
{
  "metadata": {
    "notes": "Premium client, review credit limit"
  }
}
```

> We are still using `/admin/customers/*` for list, detail, and update, while backend also has `/admin/franchisees/*`. We still need to confirm which contract is canonical.

### 6. Franchisee profile and stores

An approved franchisee can own several stores and manage them from their profile.

**What we call from the franchisee profile:**
- `GET /franchisee/stores`
- `POST /franchisee/stores` — request:
```json
{
  "name": "Tienda Centro",
  "taxId": "B12345678",
  "address": "Gran Via 1",
  "city": "Madrid",
  "postalCode": "28013"
}
```
- `DELETE /franchisee/stores/:id`

**What we call from admin detail:**
- `POST /admin/customers/:id/addresses`
- `PATCH /admin/customers/:id/addresses/:addressId`
- `DELETE /admin/customers/:id/addresses/:addressId`

> `GET/POST/DELETE /franchisee/stores*` still do not exist in backend. Frontend is currently persisting them only locally.

---

## 📋 All calls in one place

| Step | Method + path | Exists in backend? |
|---|---|---|
| Invite franchisee | `POST /admin/franchisees/invitations` | ❌ No |
| Public registration | `POST /franchisee/register` | ❌ No |
| Payment | *(direct to Stripe, not through your API)* | — |
| Stripe subscription webhook | `POST /webhooks/stripe` | ❌ No |
| Franchisee invoices | `GET /franchisee/:id/invoices` | ❌ No |
| List franchisees | `GET /admin/customers` | ⚠️ Exists, but canonical contract still not confirmed |
| Franchisee detail | `GET /admin/customers/:id` | ⚠️ Same as above |
| Change status / approve | `PATCH /admin/franchisees/:id/status` | ⚠️ Exists, but should validate `subscription_status === active` and trigger email/outbox |
| Edit data / notes | `POST /admin/customers/:id` | ⚠️ Not fully confirmed |
| Stores (franchisee self-service) | `GET / POST / DELETE /franchisee/stores` | ❌ No |
| Stores (from admin) | `POST / PATCH / DELETE /admin/customers/:id/addresses` | ⚠️ Not fully confirmed |

---

## 🚦 What already exists vs. what is new

- ✅ Already exists in frontend: admin franchisee management screens, Stripe card-step pattern, multi-step registration pattern.
- 🆕 Already built in frontend but still missing real backend support: invite by email, self-registration with payment, approval constrained by subscription status, invoices section, and franchisee-owned stores.

---

## ❓ What we still need backend to confirm

1. **What is the canonical admin contract?** `/admin/customers/*` or `/admin/franchisees/*`.
2. **Will backend build `POST /franchisee/register` now?** Without it, public registration stays 100% simulated.
3. **Do we confirm `GET /franchisee/:id/invoices`?** If you prefer another path, we need to lock it now because the UI already exists.
4. **Will `/franchisee/stores*` exist?** Or should stores always be managed from admin and only displayed to the franchisee?
5. **Does credential activation happen as a side effect of `PATCH /admin/franchisees/:id/status`?** If backend wants a separate endpoint for that, we need to agree the contract before building the UI.

---

*This document describes only what frontend needs from the API and what it expects back. It does not prescribe how to implement queues, workers, Odoo synchronization, or internal logic.*
