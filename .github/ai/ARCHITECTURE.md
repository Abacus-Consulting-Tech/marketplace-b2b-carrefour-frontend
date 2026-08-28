# ARCHITECTURE.md

# Project Architecture

## Overview

This project is a B2B ecommerce platform for franchisees, suppliers and administrators.

The platform combines:

* Next.js frontend
* React
* TypeScript
* react-hook-form
* Zod
* shadcn/ui
* Medusa / MercurJS backend
* REST/API integrations
* Role-based business workflows

The system supports three main actors:

* ADMIN
* FRANCHISEE
* SUPPLIER

---

# Architectural principles

## 1. Medusa as backend foundation

Medusa / MercurJS is the backend foundation for ecommerce functionality.

Avoid modifying Medusa core.

Project-specific business logic should preferably be implemented using:

* custom modules
* services
* workflows
* API routes
* subscribers
* project-specific extensions

---

## 2. Next.js as frontend application layer

Next.js provides the frontend application.

The frontend is responsible for:

* user interfaces
* forms
* validation
* API interaction
* role-specific dashboards
* business workflow presentation

Business-critical authorization must not rely only on frontend visibility.

Backend authorization must enforce permissions.

---

## 3. Validation

Forms use:

* react-hook-form
* Zod

Zod schemas should represent the actual business constraints.

Avoid duplicating validation logic unnecessarily.

Where possible:

Frontend validation
+
Backend validation
should represent the same business rules.

---

# Main domains

## Administration

Administration manages:

* franchisees
* suppliers
* catalog configuration
* new store openings
* supplier invitations
* quotation supervision
* business workflow validation

---

## Franchisees

A franchisee may have one or more stores.

Franchisees can interact with:

* stores
* openings
* quotations
* orders
* approvals

Access must be restricted to data belonging to the corresponding franchisee.

---

## Suppliers

Suppliers interact with:

* product catalog
* invitations
* store opening projects
* plans
* quotations
* orders

Suppliers must only access projects and information they are authorized to view.

---

# Core modules

## Catalog

Responsible for:

* products
* variants
* categories
* pricing
* supplier information
* images
* product metadata

Medusa should remain the main source of truth for ecommerce product data whenever possible.

---

## Orders

Responsible for ecommerce order lifecycle.

Avoid duplicating order state outside Medusa unless project-specific workflow data requires it.

---

## Openings

Represents new store opening projects.

An opening belongs to a franchisee and may involve several suppliers.

Typical data includes:

* franchisee
* store/location
* fiscal data
* plans
* invited suppliers
* quotations
* workflow status

---

## Quotations

Suppliers submit quotations related to an opening.

An opening may receive multiple quotations.

A franchisee may review quotations and accept one according to the business workflow.

Quotation status must be explicit and controlled by backend rules.

---

# Opening workflow

Current conceptual workflow:

ADMIN
creates opening project

→

ADMIN
uploads or associates store plans

→

ADMIN
invites suppliers

→

SUPPLIER
accesses project information

→

SUPPLIER
downloads plans

→

SUPPLIER
submits quotation

→

FRANCHISEE
reviews quotations

→

FRANCHISEE
accepts quotation

→

DIGITAL SIGNATURE

→

ADMINISTRATION VALIDATION

→

FINANCING APPROVAL

→

PROCESS COMPLETION

Exact state names must be maintained in the implementation documentation.

---

# API architecture

Frontend and backend communicate through defined API contracts.

For every endpoint maintain consistency between:

* route
* HTTP method
* request payload
* response payload
* TypeScript types
* Zod schemas
* permissions

Do not assume API response shapes.

Backend implementation is the authoritative reference unless a contract change has explicitly been approved.

---

# Types

TypeScript interfaces and DTOs should reflect real backend responses.

Do not add properties only to suppress TypeScript errors.

Avoid `any`.

Prefer shared or clearly defined contract types where appropriate.

---

# Security and permissions

All role-sensitive operations must be enforced on the backend.

Important permission boundaries include:

ADMIN

* broad administrative access

FRANCHISEE

* access only to own stores/projects/orders where applicable

SUPPLIER

* access only to assigned or authorized projects/catalog/order information

Frontend route protection is not considered sufficient security.

---

# Data ownership

Avoid multiple sources of truth.

Whenever possible:

* Medusa owns ecommerce entities
* project modules own project-specific workflow entities
* frontend consumes backend state

Do not maintain duplicated state in frontend and backend unless there is a documented reason.

---

# Architecture changes

Before significant architecture changes, evaluate:

* affected modules
* affected actors
* database changes
* API changes
* permissions
* frontend impact
* migration requirements
* backwards compatibility

Record important decisions in:

.github/ai/DECISIONS.md
