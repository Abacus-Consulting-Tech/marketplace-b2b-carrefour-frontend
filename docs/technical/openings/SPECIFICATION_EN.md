# New Store Openings Module - Technical Specification

**Version:** 1.0  
**Date:** 2026-08-19  
**Status:** Draft  

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Data Model](#data-model)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Frontend Architecture](#frontend-architecture)
7. [State Management](#state-management)
8. [File Management](#file-management)
9. [Access Control](#access-control)
10. [State Machine](#state-machine)
11. [Digital Signature](#digital-signature)
12. [Integration Points](#integration-points)
13. [UI/UX Flows](#uiux-flows)
14. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

### Purpose

The **New Store Openings** module enables Carrefour to manage the complete lifecycle of franchise store openings, from project creation to final approval and payment tracking.

### Key Features

- **Project Management**: Track multiple store opening projects per franchisee
- **Multi-Category Bidding**: Compare quotes from different suppliers for different categories (furniture, signage, IT equipment)
- **Supplier Invitation**: Admin controls which suppliers can bid on each project
- **Quote Comparison**: Side-by-side comparison of supplier proposals
- **Digital Signature**: Legally binding acceptance of quotes
- **Financial Approval**: Carrefour Finance review and approval workflow
- **Audit Trail**: Complete traceability of all actions and state changes

### User Roles

| Role | Access Level |
|---|---|
| **Admin** | Full access - creates projects, invites suppliers, views all data |
| **Franchisee** | Own projects only - views quotes, selects winners, signs documents |
| **Supplier** | Invited projects only - views project details, submits quotes |
| **Finance** | All projects - approves/rejects financing requests |

---

## System Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       Next.js Frontend                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Admin     │  │ Franchisee │  │  Supplier  │            │
│  │  Portal    │  │   Portal   │  │   Portal   │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        │                │                │                   │
│        └────────────────┴────────────────┘                   │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js API Routes (Proxy Layer)                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  /api/openings/*   (Custom Medusa endpoints)        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Medusa.js Backend                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Custom     │  │   Medusa     │  │   Storage    │     │
│  │   Entities   │  │   Core       │  │   Module     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  - Project Entity      - User Entity      - File Storage    │
│  - Quote Entity        - Store Entity     - Email Service   │
│  - Signature Entity                       - Notifications   │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                     │
│                                                              │
│  - opening_projects       - opening_quotes                  │
│  - opening_categories     - opening_signatures              │
│  - opening_invitations    - opening_approvals               │
│  - opening_documents      - opening_audit_logs              │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **State Management** | Zustand with persistence |
| **Form Validation** | React Hook Form + Zod |
| **UI Components** | shadcn/ui |
| **Backend** | Medusa.js 2.x (MercurJS) |
| **Database** | PostgreSQL 16 |
| **File Storage** | Medusa Storage (S3-compatible) |
| **Authentication** | Medusa Auth (JWT) |
| **Digital Signature** | PDF-lib + crypto signatures |

---

## Data Model

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │ (Medusa Core Entity)
│─────────────│
│ id          │
│ email       │
│ role        │──────────┐
└─────────────┘          │
                         │
                         │  1:N
                         │
                         ▼
              ┌──────────────────┐
              │  OpeningProject  │
              │──────────────────│
              │ id               │
              │ franchisee_id    │◄──────┐
              │ store_id         │       │
              │ name             │       │  1:N
              │ status           │       │
              │ planned_opening  │       │
              │ floor_plan_url   │       │
              │ address          │       │
              │ fiscal_data      │       │
              │ created_at       │       │
              │ updated_at       │       │
              └────┬─────────────┘       │
                   │                     │
                   │ 1:N                 │
                   │                     │
                   ▼                     │
        ┌──────────────────┐            │
        │ ProjectCategory  │            │
        │──────────────────│            │
        │ id               │            │
        │ project_id       │────────────┘
        │ name             │
        │ description      │
        │ budget_estimate  │
        └────┬─────────────┘
             │
             │ 1:N
             │
             ▼
  ┌─────────────────────┐
  │ SupplierInvitation  │
  │─────────────────────│
  │ id                  │
  │ category_id         │
  │ supplier_id         │◄──────────┐
  │ status              │           │
  │ invited_at          │           │
  │ invited_by          │           │
  └───────────┬─────────┘           │
              │                     │
              │ 1:N                 │
              │                     │
              ▼                     │
       ┌─────────────┐              │
       │    Quote    │              │
       │─────────────│              │
       │ id          │              │
       │ category_id │              │
       │ supplier_id │──────────────┘
       │ amount      │
       │ pdf_url     │
       │ notes       │
       │ status      │
       │ submitted_at│
       └──────┬──────┘
              │
              │ 0:1
              │
              ▼
    ┌─────────────────┐
    │    Signature    │
    │─────────────────│
    │ id              │
    │ quote_id        │
    │ franchisee_id   │
    │ signed_pdf_url  │
    │ signature_hash  │
    │ signed_at       │
    │ ip_address      │
    │ user_agent      │
    └─────────────────┘
              │
              │ 1:1
              │
              ▼
    ┌──────────────────────┐
    │  FinancialApproval   │
    │──────────────────────│
    │ id                   │
    │ project_id           │
    │ reviewer_id          │
    │ status               │
    │ amount_approved      │
    │ notes                │
    │ approved_at          │
    │ rejected_at          │
    └──────────────────────┘
```

### Core Entities

#### 1. **OpeningProject**

Represents a single store opening project.

```typescript
interface OpeningProject {
  id: string;
  franchisee_id: string; // FK to User (role: franchisee)
  store_id?: string; // FK to Medusa Store (optional - may not exist yet)
  name: string; // e.g., "Nueva apertura - Calle Carmen 50"
  status: ProjectStatus;
  planned_opening_date?: Date;
  
  // Address data
  address: {
    street: string;
    city: string;
    postal_code: string;
    province: string;
    country: string;
  };
  
  // Fiscal data
  fiscal_data: {
    company_name: string;
    tax_id: string; // CIF/NIF
    contact_name: string;
    contact_email: string;
    contact_phone: string;
  };
  
  // Files
  floor_plan_url?: string;
  additional_documents?: DocumentReference[];
  
  // Metadata
  created_at: Date;
  updated_at: Date;
  created_by: string; // Admin user ID
}

type ProjectStatus =
  | 'draft'
  | 'preparing_documentation'
  | 'requesting_quotes'
  | 'quotes_received'
  | 'pending_selection'
  | 'awarded'
  | 'pending_signature'
  | 'signed'
  | 'pending_financing'
  | 'financing_approved'
  | 'financing_rejected'
  | 'in_execution'
  | 'completed'
  | 'cancelled';
```

#### 2. **ProjectCategory**

Different equipment/service categories within a project (furniture, signage, IT, etc.).

```typescript
interface ProjectCategory {
  id: string;
  project_id: string; // FK to OpeningProject
  name: string; // "Mobiliario", "Rotulación", "Equipamiento informático"
  description?: string;
  budget_estimate?: number;
  
  // Technical specifications
  specifications?: {
    requirements: string[];
    deliverables: string[];
    timeline_days?: number;
  };
  
  created_at: Date;
}
```

#### 3. **SupplierInvitation**

Tracks which suppliers are invited to bid on which categories.

```typescript
interface SupplierInvitation {
  id: string;
  category_id: string; // FK to ProjectCategory
  supplier_id: string; // FK to User (role: supplier)
  status: InvitationStatus;
  
  invited_at: Date;
  invited_by: string; // Admin user ID
  
  // Invitation metadata
  message?: string;
  deadline?: Date;
}

type InvitationStatus =
  | 'pending'
  | 'viewed'
  | 'quote_submitted'
  | 'declined'
  | 'expired';
```

#### 4. **Quote**

Supplier's proposal for a specific category.

```typescript
interface Quote {
  id: string;
  category_id: string; // FK to ProjectCategory
  supplier_id: string; // FK to User
  
  // Financial data
  amount: number; // Total amount in cents
  currency: string; // EUR
  
  // Quote details
  pdf_url: string; // Uploaded quote PDF
  notes?: string; // Additional comments from supplier
  
  // Technical details
  delivery_days?: number;
  warranty_months?: number;
  payment_terms?: string;
  
  // Status
  status: QuoteStatus;
  
  submitted_at: Date;
  updated_at: Date;
}

type QuoteStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'awarded'
  | 'rejected'
  | 'expired';
```

#### 5. **Signature**

Digital signature record for accepted quotes.

```typescript
interface Signature {
  id: string;
  quote_id: string; // FK to Quote
  franchisee_id: string; // FK to User
  
  // Signature data
  signed_pdf_url: string; // PDF with signature applied
  signature_hash: string; // SHA-256 hash of signed document
  signature_method: 'digital' | 'electronic'; // Type of signature
  
  // Audit trail
  signed_at: Date;
  ip_address: string;
  user_agent: string;
  
  // Legal metadata
  terms_version: string;
  consent_text: string;
}
```

#### 6. **FinancialApproval**

Carrefour Finance approval/rejection record.

```typescript
interface FinancialApproval {
  id: string;
  project_id: string; // FK to OpeningProject
  reviewer_id: string; // FK to User (role: finance)
  
  status: ApprovalStatus;
  amount_approved?: number; // May differ from requested
  
  notes?: string;
  conditions?: string[]; // Any conditions attached to approval
  
  approved_at?: Date;
  rejected_at?: Date;
  rejection_reason?: string;
}

type ApprovalStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'approved_with_conditions'
  | 'rejected'
  | 'cancelled';
```

#### 7. **AuditLog**

Complete audit trail of all actions.

```typescript
interface AuditLog {
  id: string;
  project_id: string;
  
  action: string; // e.g., "project_created", "quote_submitted", "signature_completed"
  actor_id: string; // User who performed the action
  actor_role: UserRole;
  
  // What changed
  entity_type: string; // "project", "quote", "signature", etc.
  entity_id: string;
  old_value?: Record<string, any>;
  new_value?: Record<string, any>;
  
  // Context
  ip_address?: string;
  user_agent?: string;
  
  created_at: Date;
}
```

---

## Database Schema

### Medusa Migration Files

All custom entities will be created as Medusa migrations.

#### Migration: `create_opening_projects_table.ts`

```typescript
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOpeningProjectsTable1724000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE opening_project_status AS ENUM (
        'draft',
        'preparing_documentation',
        'requesting_quotes',
        'quotes_received',
        'pending_selection',
        'awarded',
        'pending_signature',
        'signed',
        'pending_financing',
        'financing_approved',
        'financing_rejected',
        'in_execution',
        'completed',
        'cancelled'
      );
      
      CREATE TABLE opening_projects (
        id VARCHAR PRIMARY KEY,
        franchisee_id VARCHAR NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
        store_id VARCHAR REFERENCES store(id) ON DELETE SET NULL,
        
        name VARCHAR(255) NOT NULL,
        status opening_project_status NOT NULL DEFAULT 'draft',
        planned_opening_date TIMESTAMP WITH TIME ZONE,
        
        -- Address (JSONB)
        address JSONB NOT NULL,
        
        -- Fiscal data (JSONB)
        fiscal_data JSONB NOT NULL,
        
        -- Files
        floor_plan_url VARCHAR(500),
        additional_documents JSONB,
        
        -- Metadata
        created_by VARCHAR NOT NULL REFERENCES "user"(id),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        deleted_at TIMESTAMP WITH TIME ZONE,
        
        CONSTRAINT valid_address CHECK (
          jsonb_typeof(address) = 'object' AND
          address ? 'street' AND
          address ? 'city' AND
          address ? 'postal_code'
        ),
        
        CONSTRAINT valid_fiscal_data CHECK (
          jsonb_typeof(fiscal_data) = 'object' AND
          fiscal_data ? 'company_name' AND
          fiscal_data ? 'tax_id'
        )
      );
      
      CREATE INDEX idx_opening_projects_franchisee ON opening_projects(franchisee_id);
      CREATE INDEX idx_opening_projects_status ON opening_projects(status);
      CREATE INDEX idx_opening_projects_created_at ON opening_projects(created_at DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS opening_projects;
      DROP TYPE IF EXISTS opening_project_status;
    `);
  }
}
```

#### Migration: `create_project_categories_table.ts`

```typescript
export class CreateProjectCategoriesTable1724000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE opening_categories (
        id VARCHAR PRIMARY KEY,
        project_id VARCHAR NOT NULL REFERENCES opening_projects(id) ON DELETE CASCADE,
        
        name VARCHAR(100) NOT NULL,
        description TEXT,
        budget_estimate INTEGER, -- in cents
        
        -- Technical specs (JSONB)
        specifications JSONB,
        
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        
        CONSTRAINT unique_category_per_project UNIQUE(project_id, name)
      );
      
      CREATE INDEX idx_categories_project ON opening_categories(project_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS opening_categories;`);
  }
}
```

#### Migration: `create_supplier_invitations_table.ts`

```typescript
export class CreateSupplierInvitationsTable1724000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE invitation_status AS ENUM (
        'pending',
        'viewed',
        'quote_submitted',
        'declined',
        'expired'
      );
      
      CREATE TABLE opening_invitations (
        id VARCHAR PRIMARY KEY,
        category_id VARCHAR NOT NULL REFERENCES opening_categories(id) ON DELETE CASCADE,
        supplier_id VARCHAR NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        
        status invitation_status NOT NULL DEFAULT 'pending',
        
        invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        invited_by VARCHAR NOT NULL REFERENCES "user"(id),
        
        message TEXT,
        deadline TIMESTAMP WITH TIME ZONE,
        
        CONSTRAINT unique_supplier_per_category UNIQUE(category_id, supplier_id)
      );
      
      CREATE INDEX idx_invitations_category ON opening_invitations(category_id);
      CREATE INDEX idx_invitations_supplier ON opening_invitations(supplier_id);
      CREATE INDEX idx_invitations_status ON opening_invitations(status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS opening_invitations;
      DROP TYPE IF EXISTS invitation_status;
    `);
  }
}
```

#### Migration: `create_quotes_table.ts`

```typescript
export class CreateQuotesTable1724000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE quote_status AS ENUM (
        'draft',
        'submitted',
        'under_review',
        'awarded',
        'rejected',
        'expired'
      );
      
      CREATE TABLE opening_quotes (
        id VARCHAR PRIMARY KEY,
        category_id VARCHAR NOT NULL REFERENCES opening_categories(id) ON DELETE CASCADE,
        supplier_id VARCHAR NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
        
        -- Financial
        amount INTEGER NOT NULL, -- in cents
        currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
        
        -- Documents
        pdf_url VARCHAR(500) NOT NULL,
        notes TEXT,
        
        -- Technical details
        delivery_days INTEGER,
        warranty_months INTEGER,
        payment_terms TEXT,
        
        -- Status
        status quote_status NOT NULL DEFAULT 'draft',
        
        submitted_at TIMESTAMP WITH TIME ZONE,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        
        CONSTRAINT positive_amount CHECK (amount > 0)
      );
      
      CREATE INDEX idx_quotes_category ON opening_quotes(category_id);
      CREATE INDEX idx_quotes_supplier ON opening_quotes(supplier_id);
      CREATE INDEX idx_quotes_status ON opening_quotes(status);
      CREATE INDEX idx_quotes_submitted ON opening_quotes(submitted_at DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS opening_quotes;
      DROP TYPE IF EXISTS quote_status;
    `);
  }
}
```

#### Migration: `create_signatures_table.ts`

```typescript
export class CreateSignaturesTable1724000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE opening_signatures (
        id VARCHAR PRIMARY KEY,
        quote_id VARCHAR NOT NULL REFERENCES opening_quotes(id) ON DELETE RESTRICT,
        franchisee_id VARCHAR NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
        
        -- Signature data
        signed_pdf_url VARCHAR(500) NOT NULL,
        signature_hash VARCHAR(64) NOT NULL, -- SHA-256
        signature_method VARCHAR(20) NOT NULL, -- 'digital' or 'electronic'
        
        -- Audit trail
        signed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        ip_address VARCHAR(45),
        user_agent TEXT,
        
        -- Legal
        terms_version VARCHAR(20) NOT NULL,
        consent_text TEXT NOT NULL,
        
        CONSTRAINT unique_signature_per_quote UNIQUE(quote_id)
      );
      
      CREATE INDEX idx_signatures_quote ON opening_signatures(quote_id);
      CREATE INDEX idx_signatures_franchisee ON opening_signatures(franchisee_id);
      CREATE INDEX idx_signatures_signed_at ON opening_signatures(signed_at DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS opening_signatures;`);
  }
}
```

#### Migration: `create_financial_approvals_table.ts`

```typescript
export class CreateFinancialApprovalsTable1724000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE approval_status AS ENUM (
        'pending',
        'under_review',
        'approved',
        'approved_with_conditions',
        'rejected',
        'cancelled'
      );
      
      CREATE TABLE opening_financial_approvals (
        id VARCHAR PRIMARY KEY,
        project_id VARCHAR NOT NULL REFERENCES opening_projects(id) ON DELETE CASCADE,
        reviewer_id VARCHAR REFERENCES "user"(id) ON DELETE SET NULL,
        
        status approval_status NOT NULL DEFAULT 'pending',
        amount_approved INTEGER, -- in cents
        
        notes TEXT,
        conditions JSONB, -- Array of condition strings
        
        approved_at TIMESTAMP WITH TIME ZONE,
        rejected_at TIMESTAMP WITH TIME ZONE,
        rejection_reason TEXT,
        
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        
        CONSTRAINT unique_approval_per_project UNIQUE(project_id)
      );
      
      CREATE INDEX idx_approvals_project ON opening_financial_approvals(project_id);
      CREATE INDEX idx_approvals_reviewer ON opening_financial_approvals(reviewer_id);
      CREATE INDEX idx_approvals_status ON opening_financial_approvals(status);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS opening_financial_approvals;
      DROP TYPE IF EXISTS approval_status;
    `);
  }
}
```

#### Migration: `create_audit_logs_table.ts`

```typescript
export class CreateAuditLogsTable1724000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE opening_audit_logs (
        id VARCHAR PRIMARY KEY,
        project_id VARCHAR NOT NULL REFERENCES opening_projects(id) ON DELETE CASCADE,
        
        action VARCHAR(100) NOT NULL,
        actor_id VARCHAR REFERENCES "user"(id) ON DELETE SET NULL,
        actor_role VARCHAR(50),
        
        entity_type VARCHAR(50) NOT NULL,
        entity_id VARCHAR NOT NULL,
        old_value JSONB,
        new_value JSONB,
        
        ip_address VARCHAR(45),
        user_agent TEXT,
        
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
      
      CREATE INDEX idx_audit_project ON opening_audit_logs(project_id);
      CREATE INDEX idx_audit_actor ON opening_audit_logs(actor_id);
      CREATE INDEX idx_audit_action ON opening_audit_logs(action);
      CREATE INDEX idx_audit_created ON opening_audit_logs(created_at DESC);
      CREATE INDEX idx_audit_entity ON opening_audit_logs(entity_type, entity_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS opening_audit_logs;`);
  }
}
```

---

## API Endpoints

All endpoints follow Medusa conventions and are exposed through Next.js API routes acting as proxies.

### Base URL

```
/api/openings
```

### Authentication

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

### Projects

#### **POST** `/api/openings/projects`

Create a new opening project.

**Role:** Admin only

**Request:**
```json
{
  "franchisee_id": "user_01HXQ...",
  "name": "Nueva apertura - Calle Carmen 50",
  "address": {
    "street": "Calle Carmen 50",
    "city": "Madrid",
    "postal_code": "28013",
    "province": "Madrid",
    "country": "ES"
  },
  "fiscal_data": {
    "company_name": "Carrefour Express Madrid Centro S.L.",
    "tax_id": "B12345678",
    "contact_name": "Juan Pérez",
    "contact_email": "juan@carrefour-madrid.com",
    "contact_phone": "+34 600 123 456"
  },
  "planned_opening_date": "2026-12-01T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "proj_01HXQ...",
    "franchisee_id": "user_01HXQ...",
    "name": "Nueva apertura - Calle Carmen 50",
    "status": "draft",
    "address": { ... },
    "fiscal_data": { ... },
    "created_at": "2026-08-19T10:00:00Z",
    "created_by": "user_01HXQ..."
  }
}
```

---

#### **GET** `/api/openings/projects`

List all projects (filtered by role).

**Roles:**
- Admin: sees all projects
- Franchisee: sees only their own projects
- Supplier: sees only projects they're invited to
- Finance: sees all projects

**Query Parameters:**
- `status` (optional): Filter by status
- `franchisee_id` (optional, admin only): Filter by franchisee
- `page` (default: 1)
- `limit` (default: 20)

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "id": "proj_01HXQ...",
      "name": "Nueva apertura - Calle Carmen 50",
      "status": "requesting_quotes",
      "franchisee": {
        "id": "user_01HXQ...",
        "name": "Juan Pérez",
        "email": "juan@example.com"
      },
      "categories_count": 3,
      "quotes_count": 5,
      "created_at": "2026-08-19T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

---

#### **GET** `/api/openings/projects/:id`

Get project details with all related data.

**Roles:** Admin, Franchisee (own), Supplier (invited), Finance

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "proj_01HXQ...",
    "name": "Nueva apertura - Calle Carmen 50",
    "status": "quotes_received",
    "franchisee": { ... },
    "address": { ... },
    "fiscal_data": { ... },
    "floor_plan_url": "https://storage.../floor_plan.pdf",
    "planned_opening_date": "2026-12-01T00:00:00Z",
    
    "categories": [
      {
        "id": "cat_01HXQ...",
        "name": "Mobiliario",
        "budget_estimate": 3500000, // 35,000 EUR in cents
        "quotes_count": 3,
        "awarded_quote_id": null
      },
      {
        "id": "cat_01HXR...",
        "name": "Rotulación",
        "budget_estimate": 1200000,
        "quotes_count": 2,
        "awarded_quote_id": "quote_01HXS..."
      }
    ],
    
    "financial_approval": {
      "status": "pending",
      "amount_approved": null
    },
    
    "created_at": "2026-08-19T10:00:00Z",
    "updated_at": "2026-08-19T15:30:00Z"
  }
}
```

---

#### **PATCH** `/api/openings/projects/:id`

Update project details.

**Role:** Admin only

**Request:**
```json
{
  "status": "requesting_quotes",
  "floor_plan_url": "https://storage.../floor_plan_v2.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "project": { ... }
}
```

---

#### **POST** `/api/openings/projects/:id/upload-floor-plan`

Upload floor plan document.

**Role:** Admin only

**Request:** multipart/form-data
- `file`: PDF file (max 10MB)

**Response:**
```json
{
  "success": true,
  "floor_plan_url": "https://storage.carrefour.com/openings/proj_01HXQ.../floor_plan.pdf"
}
```

---

### Categories

#### **POST** `/api/openings/projects/:projectId/categories`

Add a category to a project.

**Role:** Admin only

**Request:**
```json
{
  "name": "Mobiliario",
  "description": "Muebles y estanterías para la tienda",
  "budget_estimate": 3500000, // 35,000 EUR in cents
  "specifications": {
    "requirements": [
      "Estanterías modulares de 2m de altura",
      "Mostradores de caja",
      "Mobiliario de oficina"
    ],
    "deliverables": [
      "Instalación incluida",
      "Garantía de 2 años"
    ],
    "timeline_days": 30
  }
}
```

**Response:**
```json
{
  "success": true,
  "category": {
    "id": "cat_01HXQ...",
    "project_id": "proj_01HXQ...",
    "name": "Mobiliario",
    "budget_estimate": 3500000,
    "created_at": "2026-08-19T11:00:00Z"
  }
}
```

---

### Invitations

#### **POST** `/api/openings/categories/:categoryId/invite`

Invite suppliers to bid on a category.

**Role:** Admin only

**Request:**
```json
{
  "supplier_ids": [
    "user_01HXQ...",
    "user_01HXR...",
    "user_01HXS..."
  ],
  "message": "Le invitamos a presentar presupuesto para el equipamiento de nuestra nueva tienda.",
  "deadline": "2026-09-15T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "invitations": [
    {
      "id": "inv_01HXQ...",
      "category_id": "cat_01HXQ...",
      "supplier_id": "user_01HXQ...",
      "status": "pending",
      "invited_at": "2026-08-19T11:30:00Z"
    }
  ]
}
```

---

#### **GET** `/api/openings/invitations`

List invitations (supplier view).

**Role:** Supplier only

**Response:**
```json
{
  "success": true,
  "invitations": [
    {
      "id": "inv_01HXQ...",
      "status": "pending",
      "invited_at": "2026-08-19T11:30:00Z",
      "deadline": "2026-09-15T23:59:59Z",
      "category": {
        "id": "cat_01HXQ...",
        "name": "Mobiliario",
        "budget_estimate": 3500000
      },
      "project": {
        "id": "proj_01HXQ...",
        "name": "Nueva apertura - Calle Carmen 50",
        "address": { ... },
        "floor_plan_url": "https://..."
      }
    }
  ]
}
```

---

### Quotes

#### **POST** `/api/openings/categories/:categoryId/quotes`

Submit a quote (supplier).

**Role:** Supplier (must be invited)

**Request:** multipart/form-data
- `amount`: number (in cents)
- `delivery_days`: number
- `warranty_months`: number
- `payment_terms`: string
- `notes`: string
- `file`: PDF file (quote document)

**Response:**
```json
{
  "success": true,
  "quote": {
    "id": "quote_01HXQ...",
    "category_id": "cat_01HXQ...",
    "supplier_id": "user_01HXQ...",
    "amount": 3200000,
    "pdf_url": "https://storage.../quote_01HXQ.pdf",
    "status": "submitted",
    "submitted_at": "2026-08-20T10:00:00Z"
  }
}
```

---

#### **GET** `/api/openings/categories/:categoryId/quotes`

List all quotes for a category.

**Roles:**
- Admin: sees all quotes
- Franchisee: sees all quotes for their projects
- Supplier: sees only their own quote

**Response:**
```json
{
  "success": true,
  "quotes": [
    {
      "id": "quote_01HXQ...",
      "supplier": {
        "id": "user_01HXQ...",
        "name": "Mobiliario Retail S.L.",
        "email": "info@mobiliarioretail.com"
      },
      "amount": 3200000,
      "delivery_days": 30,
      "warranty_months": 24,
      "pdf_url": "https://storage.../quote.pdf",
      "status": "submitted",
      "submitted_at": "2026-08-20T10:00:00Z"
    },
    {
      "id": "quote_01HXR...",
      "supplier": {
        "id": "user_01HXR...",
        "name": "Equipamiento Express S.A."
      },
      "amount": 3450000,
      "delivery_days": 25,
      "warranty_months": 36,
      "status": "submitted",
      "submitted_at": "2026-08-20T14:30:00Z"
    }
  ]
}
```

---

#### **POST** `/api/openings/quotes/:quoteId/award`

Award a quote (franchisee selects winner).

**Role:** Franchisee (project owner)

**Response:**
```json
{
  "success": true,
  "quote": {
    "id": "quote_01HXQ...",
    "status": "awarded",
    "category": {
      "id": "cat_01HXQ...",
      "name": "Mobiliario"
    }
  },
  "other_quotes_updated": 2 // Other quotes marked as 'rejected'
}
```

---

### Signatures

#### **POST** `/api/openings/quotes/:quoteId/sign`

Sign an awarded quote.

**Role:** Franchisee (project owner)

**Request:**
```json
{
  "consent_text": "Acepto los términos y condiciones del presupuesto presentado por Mobiliario Retail S.L. por un importe de 32,000 EUR.",
  "terms_version": "1.0"
}
```

**Response:**
```json
{
  "success": true,
  "signature": {
    "id": "sig_01HXQ...",
    "quote_id": "quote_01HXQ...",
    "signed_pdf_url": "https://storage.../signed_quote_01HXQ.pdf",
    "signature_hash": "a3f5d9b2e1c4...",
    "signed_at": "2026-08-21T09:00:00Z"
  }
}
```

---

### Financial Approvals

#### **POST** `/api/openings/projects/:projectId/request-financing`

Request financial approval (automatic after signature).

**Role:** Franchisee or system (auto-triggered)

**Response:**
```json
{
  "success": true,
  "approval": {
    "id": "appr_01HXQ...",
    "project_id": "proj_01HXQ...",
    "status": "pending",
    "created_at": "2026-08-21T09:05:00Z"
  }
}
```

---

#### **POST** `/api/openings/approvals/:approvalId/review`

Approve or reject financing.

**Role:** Finance only

**Request:**
```json
{
  "status": "approved",
  "amount_approved": 3200000,
  "notes": "Aprobado con las condiciones estándar de financiación.",
  "conditions": [
    "Pago en 3 plazos: 40% inicio, 40% instalación, 20% fin de obra",
    "Seguro de responsabilidad civil requerido"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "approval": {
    "id": "appr_01HXQ...",
    "status": "approved_with_conditions",
    "amount_approved": 3200000,
    "conditions": [...],
    "approved_at": "2026-08-21T15:00:00Z",
    "reviewer": {
      "id": "user_01HXQ...",
      "name": "Ana García - Carrefour Finanzas"
    }
  }
}
```

---

### Audit Logs

#### **GET** `/api/openings/projects/:projectId/audit`

Get complete audit trail for a project.

**Role:** Admin, Finance

**Response:**
```json
{
  "success": true,
  "logs": [
    {
      "id": "log_01HXQ...",
      "action": "project_created",
      "actor": {
        "id": "user_01HXQ...",
        "name": "Admin User",
        "role": "admin"
      },
      "entity_type": "project",
      "entity_id": "proj_01HXQ...",
      "created_at": "2026-08-19T10:00:00Z"
    },
    {
      "action": "category_added",
      "entity_type": "category",
      "entity_id": "cat_01HXQ...",
      "new_value": {
        "name": "Mobiliario",
        "budget_estimate": 3500000
      },
      "created_at": "2026-08-19T11:00:00Z"
    },
    {
      "action": "suppliers_invited",
      "entity_type": "invitation",
      "new_value": {
        "supplier_count": 3
      },
      "created_at": "2026-08-19T11:30:00Z"
    }
  ]
}
```

---

## Frontend Architecture

### Route Structure

```
src/app/
├── (backoffice)/
│   └── admin/
│       └── openings/
│           ├── page.tsx                 # Projects list
│           ├── new/
│           │   └── page.tsx             # Create project
│           └── [id]/
│               ├── page.tsx             # Project detail
│               ├── categories/
│               │   └── page.tsx         # Manage categories
│               ├── invitations/
│               │   └── page.tsx         # Invite suppliers
│               └── approvals/
│                   └── page.tsx         # Financial review
│
├── (franchisee)/
│   └── franchisee/
│       └── openings/
│           ├── page.tsx                 # My projects
│           └── [id]/
│               ├── page.tsx             # Project dashboard
│               ├── quotes/
│               │   └── page.tsx         # Compare quotes
│               └── sign/
│                   └── page.tsx         # Sign selected quote
│
└── (supplier)/
    └── supplier/
        └── openings/
            ├── page.tsx                 # My invitations
            └── [categoryId]/
                ├── page.tsx             # Category details
                └── quote/
                    └── page.tsx         # Submit/edit quote
```

### Components Structure

```
src/components/openings/
├── admin/
│   ├── ProjectForm.tsx              # Create/edit project
│   ├── ProjectsList.tsx             # Admin projects table
│   ├── CategoryForm.tsx             # Add category
│   ├── SupplierInviteDialog.tsx     # Invite suppliers modal
│   └── FinancialReviewDialog.tsx    # Approve/reject financing
│
├── franchisee/
│   ├── MyProjectsList.tsx           # Franchisee's projects
│   ├── ProjectDashboard.tsx         # Project overview
│   ├── QuoteComparison.tsx          # Side-by-side quote table
│   ├── QuoteDetailDialog.tsx        # View quote PDF and details
│   └── SignatureDialog.tsx          # Digital signature flow
│
├── supplier/
│   ├── InvitationsList.tsx          # Supplier invitations
│   ├── CategoryDetails.tsx          # Category specs and floor plan
│   ├── QuoteForm.tsx                # Submit quote form
│   └── QuoteUpload.tsx              # PDF upload component
│
├── shared/
│   ├── ProjectStatusBadge.tsx       # Status indicator
│   ├── ProjectTimeline.tsx          # Visual timeline of stages
│   ├── FloorPlanViewer.tsx          # PDF viewer for floor plans
│   ├── DocumentUpload.tsx           # Drag & drop file upload
│   └── AuditTrail.tsx               # Audit log display
│
└── ui/
    ├── ComparisonTable.tsx          # Generic comparison table
    ├── StateMachine.tsx             # Visual state machine display
    └── SignaturePad.tsx             # Digital signature canvas
```

---

## State Management

### Zustand Stores

#### `openings-store.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OpeningsState {
  // Admin state
  projects: OpeningProject[];
  selectedProject: OpeningProject | null;
  
  // Franchisee state
  myProjects: OpeningProject[];
  activeQuoteComparison: {
    categoryId: string;
    quotes: Quote[];
  } | null;
  
  // Supplier state
  myInvitations: SupplierInvitation[];
  myQuotes: Quote[];
  
  // Actions
  setProjects: (projects: OpeningProject[]) => void;
  selectProject: (project: OpeningProject | null) => void;
  addProject: (project: OpeningProject) => void;
  updateProject: (id: string, updates: Partial<OpeningProject>) => void;
  
  setQuoteComparison: (categoryId: string, quotes: Quote[]) => void;
  clearQuoteComparison: () => void;
  
  setMyInvitations: (invitations: SupplierInvitation[]) => void;
  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
}

export const useOpeningsStore = create<OpeningsState>()(
  persist(
    (set) => ({
      projects: [],
      selectedProject: null,
      myProjects: [],
      activeQuoteComparison: null,
      myInvitations: [],
      myQuotes: [],
      
      setProjects: (projects) => set({ projects }),
      selectProject: (project) => set({ selectedProject: project }),
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      
      setQuoteComparison: (categoryId, quotes) =>
        set({ activeQuoteComparison: { categoryId, quotes } }),
      clearQuoteComparison: () => set({ activeQuoteComparison: null }),
      
      setMyInvitations: (invitations) => set({ myInvitations: invitations }),
      addQuote: (quote) =>
        set((state) => ({ myQuotes: [...state.myQuotes, quote] })),
      updateQuote: (id, updates) =>
        set((state) => ({
          myQuotes: state.myQuotes.map((q) =>
            q.id === id ? { ...q, ...updates } : q
          ),
        })),
    }),
    {
      name: 'openings-storage',
      partialize: (state) => ({
        // Only persist selected project ID, not full data
        selectedProjectId: state.selectedProject?.id,
      }),
    }
  )
);
```

---

## File Management

### Storage Strategy

All files are stored using **Medusa Storage** module (S3-compatible).

#### Storage Buckets

| Bucket | Purpose | Max Size | Retention |
|---|---|---|---|
| `openings-floor-plans` | Floor plan PDFs | 10 MB | Permanent |
| `openings-quotes` | Supplier quote PDFs | 5 MB | Permanent |
| `openings-signatures` | Signed documents | 5 MB | Permanent (legal) |
| `openings-documents` | Additional project docs | 10 MB | Permanent |

#### File Naming Convention

```
{bucket}/{project_id}/{entity_type}_{entity_id}_{timestamp}.pdf

Examples:
openings-floor-plans/proj_01HXQ.../floor_plan_1724000000.pdf
openings-quotes/proj_01HXQ.../quote_quote_01HXS..._1724001000.pdf
openings-signatures/proj_01HXQ.../signature_sig_01HXT..._1724002000.pdf
```

#### Upload Flow

```typescript
// src/lib/api/openings-files.ts
export async function uploadFloorPlan(
  projectId: string,
  file: File
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('project_id', projectId);
  
  const response = await apiClient.post<{ url: string }>(
    `/openings/projects/${projectId}/upload-floor-plan`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
  
  return response.url;
}
```

---

## Access Control

### Role-Based Permissions

| Action | Admin | Franchisee | Supplier | Finance |
|---|---|---|---|---|
| Create project | ✅ | ❌ | ❌ | ❌ |
| View all projects | ✅ | ❌ | ❌ | ✅ |
| View own projects | ✅ | ✅ | ❌ | ✅ |
| Upload floor plan | ✅ | ❌ | ❌ | ❌ |
| Add category | ✅ | ❌ | ❌ | ❌ |
| Invite suppliers | ✅ | ❌ | ❌ | ❌ |
| View invitations | ✅ | ✅ (own) | ✅ (own) | ❌ |
| Submit quote | ❌ | ❌ | ✅ | ❌ |
| View all quotes | ✅ | ✅ (own) | ❌ | ❌ |
| View own quote | ❌ | ❌ | ✅ | ❌ |
| Award quote | ❌ | ✅ (own) | ❌ | ❌ |
| Sign quote | ❌ | ✅ (own) | ❌ | ❌ |
| Approve financing | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ✅ | ❌ | ❌ | ✅ |

### Medusa Permission Guard

```typescript
// src/lib/api/guards/openings-guard.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export function requireAdmin(
  req: MedusaRequest,
  res: MedusaResponse,
  next: () => void
) {
  const user = req.user;
  
  if (!user || user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  next();
}

export function requireProjectOwner(
  req: MedusaRequest,
  res: MedusaResponse,
  next: () => void
) {
  const user = req.user;
  const projectId = req.params.id;
  
  // Query project to verify franchisee_id matches user.id
  // ... implementation
  
  next();
}

export function requireInvitedSupplier(
  req: MedusaRequest,
  res: MedusaResponse,
  next: () => void
) {
  const user = req.user;
  const categoryId = req.params.categoryId;
  
  // Query opening_invitations to verify supplier is invited
  // ... implementation
  
  next();
}
```

---

## State Machine

### Project Status State Machine

```
                    ┌─────────┐
                    │  draft  │
                    └────┬────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ preparing_           │
              │ documentation        │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ requesting_quotes    │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ quotes_received      │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ pending_selection    │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │      awarded         │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ pending_signature    │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │       signed         │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ pending_financing    │
              └──────────┬───────────┘
                         │
                ┌────────┴────────┐
                │                 │
                ▼                 ▼
    ┌──────────────────┐  ┌──────────────────┐
    │ financing_       │  │ financing_       │
    │ approved         │  │ rejected         │
    └─────────┬────────┘  └──────────────────┘
              │
              ▼
    ┌──────────────────┐
    │  in_execution    │
    └─────────┬────────┘
              │
              ▼
    ┌──────────────────┐
    │   completed      │
    └──────────────────┘

    (cancelled state can be reached from any state)
```

### State Transition Rules

```typescript
// src/lib/openings/state-machine.ts
type ProjectStatus = 'draft' | 'preparing_documentation' | /* ... */;

const ALLOWED_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  draft: ['preparing_documentation', 'cancelled'],
  preparing_documentation: ['requesting_quotes', 'draft', 'cancelled'],
  requesting_quotes: ['quotes_received', 'preparing_documentation', 'cancelled'],
  quotes_received: ['pending_selection', 'requesting_quotes', 'cancelled'],
  pending_selection: ['awarded', 'quotes_received', 'cancelled'],
  awarded: ['pending_signature', 'pending_selection', 'cancelled'],
  pending_signature: ['signed', 'awarded', 'cancelled'],
  signed: ['pending_financing', 'cancelled'],
  pending_financing: ['financing_approved', 'financing_rejected', 'cancelled'],
  financing_approved: ['in_execution', 'cancelled'],
  financing_rejected: ['pending_financing', 'cancelled'],
  in_execution: ['completed', 'cancelled'],
  completed: [], // Terminal state
  cancelled: [], // Terminal state
};

export function canTransition(
  currentStatus: ProjectStatus,
  newStatus: ProjectStatus
): boolean {
  return ALLOWED_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

export function getNextAllowedStatuses(
  currentStatus: ProjectStatus
): ProjectStatus[] {
  return ALLOWED_TRANSITIONS[currentStatus] ?? [];
}
```

### Auto-Transitions

Some transitions happen automatically based on events:

| Event | Old Status | New Status | Trigger |
|---|---|---|---|
| All categories have quotes | `requesting_quotes` | `quotes_received` | Quote submitted |
| Franchisee awards quote | `pending_selection` | `awarded` | Award action |
| Quote awarded | `awarded` | `pending_signature` | Auto (immediate) |
| Franchisee signs | `pending_signature` | `signed` | Signature action |
| Document signed | `signed` | `pending_financing` | Auto (immediate) |
| Finance approves | `pending_financing` | `financing_approved` | Approval action |
| Finance rejects | `pending_financing` | `financing_rejected` | Rejection action |

---

## Digital Signature

### Signature Flow

```
1. Franchisee selects quote
   ↓
2. Quote status → 'awarded'
   ↓
3. System generates signature document (original quote + terms)
   ↓
4. Franchisee reviews document
   ↓
5. Franchisee provides consent checkbox
   ↓
6. System captures:
   - Timestamp
   - IP address
   - User agent
   - Consent text
   ↓
7. System generates SHA-256 hash of document
   ↓
8. System stores signature record
   ↓
9. Email confirmation sent to:
   - Franchisee
   - Supplier
   - Admin
```

### Implementation (PDF-lib)

```typescript
// src/lib/openings/signature.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import crypto from 'crypto';

export async function signQuotePDF(params: {
  originalPdfUrl: string;
  franchiseeName: string;
  quoteAmount: number;
  supplierName: string;
  consentText: string;
  signedAt: Date;
}): Promise<{
  signedPdfBuffer: Buffer;
  signatureHash: string;
}> {
  // 1. Load original PDF
  const originalPdfBytes = await fetch(params.originalPdfUrl).then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  
  // 2. Add signature page
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  page.drawText('DOCUMENTO FIRMADO DIGITALMENTE', {
    x: 50,
    y: height - 50,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  page.drawText(`Firmante: ${params.franchiseeName}`, {
    x: 50,
    y: height - 100,
    size: 12,
    font,
  });
  
  page.drawText(`Fecha: ${params.signedAt.toLocaleString('es-ES')}`, {
    x: 50,
    y: height - 120,
    size: 12,
    font,
  });
  
  page.drawText(`Proveedor: ${params.supplierName}`, {
    x: 50,
    y: height - 150,
    size: 12,
    font,
  });
  
  page.drawText(`Importe: ${(params.quoteAmount / 100).toFixed(2)} EUR`, {
    x: 50,
    y: height - 170,
    size: 12,
    font,
  });
  
  // Add consent text (wrapped)
  const consentLines = wrapText(params.consentText, 80);
  let yPos = height - 210;
  page.drawText('Consentimiento:', { x: 50, y: yPos, size: 12, font: boldFont });
  consentLines.forEach((line, i) => {
    page.drawText(line, { x: 50, y: yPos - (i + 1) * 15, size: 10, font });
  });
  
  // 3. Generate hash
  const signedPdfBytes = await pdfDoc.save();
  const signatureHash = crypto
    .createHash('sha256')
    .update(signedPdfBytes)
    .digest('hex');
  
  return {
    signedPdfBuffer: Buffer.from(signedPdfBytes),
    signatureHash,
  };
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    if ((currentLine + word).length <= maxCharsPerLine) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine) lines.push(currentLine);
  return lines;
}
```

### Signature Verification

```typescript
export async function verifySignature(
  signedPdfUrl: string,
  expectedHash: string
): Promise<boolean> {
  const pdfBytes = await fetch(signedPdfUrl).then(res => res.arrayBuffer());
  const actualHash = crypto
    .createHash('sha256')
    .update(Buffer.from(pdfBytes))
    .digest('hex');
  
  return actualHash === expectedHash;
}
```

---

## Integration Points

### Integration with Medusa Core Entities

#### **User Entity**

Extended with custom role field:

```typescript
// Medusa User entity extension
declare module "@medusajs/medusa/dist/models/user" {
  interface User {
    role: 'admin' | 'franchisee' | 'supplier' | 'finance';
  }
}
```

#### **Store Entity**

Projects can optionally link to a Medusa Store:

```typescript
// When franchisee already has a store in Medusa
project.store_id = 'store_01HXQ...';

// When store doesn't exist yet (new opening)
project.store_id = null;
```

After project completion, a new Store entity can be created:

```typescript
// POST /admin/stores (Medusa core endpoint)
{
  "name": "Carrefour Express - Calle Carmen 50",
  "metadata": {
    "opening_project_id": "proj_01HXQ..."
  }
}
```

### Integration with Existing Modules

#### **Supplier Registration Module**

Suppliers registered through the existing supplier registration flow can be invited to projects:

```typescript
// Query approved suppliers
const approvedSuppliers = await getApprovedSuppliers({
  status: 'active',
  category: 'Mobiliario'
});

// Invite them to project category
await inviteSuppliers(categoryId, approvedSuppliers.map(s => s.id));
```

#### **Email Notifications**

Trigger emails at key milestones:

| Event | Recipients | Template |
|---|---|---|
| Supplier invited | Supplier | `opening-invitation` |
| Quote submitted | Admin, Franchisee | `quote-submitted` |
| All quotes received | Franchisee | `quotes-ready-for-review` |
| Quote awarded | Winning supplier | `quote-awarded` |
| Quote rejected | Rejected suppliers | `quote-not-selected` |
| Document signed | All parties | `document-signed` |
| Financing approved | Franchisee, Supplier | `financing-approved` |
| Financing rejected | Franchisee | `financing-rejected` |

---

## UI/UX Flows

### Admin Flow: Create Project

```
1. Navigate to /admin/openings
   ├─ See list of all projects
   └─ Click "Nueva Apertura" button
   
2. Fill project form (/admin/openings/new)
   ├─ Select franchisee from dropdown
   ├─ Enter project name
   ├─ Fill address data (autocomplete with Google Places API)
   ├─ Fill fiscal data
   ├─ Upload floor plan PDF (drag & drop)
   └─ Click "Crear Proyecto"
   
3. Project created → Redirect to /admin/openings/{id}
   ├─ Shows project details
   ├─ Status: "draft"
   └─ Call-to-action: "Añadir Categorías"
   
4. Add categories
   ├─ Click "Añadir Categoría"
   ├─ Enter category name (Mobiliario, Rotulación, etc.)
   ├─ Enter budget estimate
   ├─ Add specifications/requirements
   └─ Save
   
5. Invite suppliers
   ├─ For each category, click "Invitar Proveedores"
   ├─ Multi-select from approved supplier list
   ├─ Optionally add message and deadline
   ├─ Click "Enviar Invitaciones"
   └─ Suppliers receive email notification
   
6. Update project status to "requesting_quotes"
   ├─ System sends notifications
   └─ Wait for supplier quotes
```

### Franchisee Flow: Review and Select Quotes

```
1. Login → Dashboard shows notification
   ├─ "Tu proyecto Calle Carmen 50 tiene 3 presupuestos nuevos"
   └─ Click notification
   
2. Navigate to /franchisee/openings/{id}/quotes
   ├─ See all categories for project
   └─ For each category, see quote count
   
3. Select category (e.g., "Mobiliario")
   ├─ View side-by-side comparison table:
   │  ┌───────────────┬─────────┬──────────┬──────────┐
   │  │ Proveedor     │ Precio  │ Entrega  │ Garantía │
   │  ├───────────────┼─────────┼──────────┼──────────┤
   │  │ Proveedor A   │ 32,000€ │ 30 días  │ 24 meses │
   │  │ Proveedor B   │ 34,500€ │ 25 días  │ 36 meses │
   │  │ Proveedor C   │ 31,800€ │ 35 días  │ 24 meses │
   │  └───────────────┴─────────┴──────────┴──────────┘
   └─ Click any quote to view full PDF
   
4. Select winner
   ├─ Click "Seleccionar" on Proveedor C row
   ├─ Confirmation dialog appears
   ├─ Click "Confirmar Selección"
   └─ Quote status → "awarded", others → "rejected"
   
5. Repeat for all categories
   
6. Once all categories have winners → Auto-redirect to signature
```

### Franchisee Flow: Sign Document

```
1. Navigate to /franchisee/openings/{id}/sign
   ├─ See list of all awarded quotes
   └─ Total amount displayed
   
2. Review each quote
   ├─ Click to view signed quote PDF
   └─ Verify details
   
3. Sign all quotes
   ├─ Read consent text:
   │  "Acepto los términos de los presupuestos seleccionados
   │   por un importe total de 97,300 EUR..."
   ├─ Check "He leído y acepto" checkbox
   ├─ Click "Firmar Documentos"
   └─ System generates signatures
   
4. Confirmation screen
   ├─ "Documentos firmados correctamente"
   ├─ Download signed PDFs
   ├─ Email sent to all parties
   └─ Project status → "pending_financing"
```

### Supplier Flow: Submit Quote

```
1. Login → See invitations
   ├─ Dashboard notification: "Tienes 2 invitaciones pendientes"
   └─ Navigate to /supplier/openings
   
2. View invitation list
   ├─ See project name, category, deadline
   └─ Click invitation
   
3. Review project details (/supplier/openings/{categoryId})
   ├─ Download floor plan PDF
   ├─ Read specifications
   ├─ View budget estimate
   └─ Click "Preparar Presupuesto"
   
4. Fill quote form (/supplier/openings/{categoryId}/quote)
   ├─ Enter amount (EUR)
   ├─ Enter delivery days
   ├─ Enter warranty months
   ├─ Enter payment terms (optional)
   ├─ Add notes (optional)
   ├─ Upload quote PDF (drag & drop)
   └─ Click "Enviar Presupuesto"
   
5. Confirmation
   ├─ "Presupuesto enviado correctamente"
   ├─ Email confirmation
   └─ Invitation status → "quote_submitted"
   
6. Wait for franchisee decision
   ├─ Receive email if awarded
   └─ Receive email if not selected
```

### Finance Flow: Approve Financing

```
1. Login → Dashboard
   ├─ See "Pendiente de aprobación financiera: 5 proyectos"
   └─ Navigate to /admin/openings?status=pending_financing
   
2. Review project list
   ├─ Filter by status, amount, franchisee
   └─ Click project
   
3. Project detail view
   ├─ See franchisee fiscal data
   ├─ See all signed quotes
   ├─ Total project cost
   ├─ Franchisee credit history (external data)
   └─ Click "Revisar Financiación"
   
4. Review dialog
   ├─ Decision: Approve / Approve with conditions / Reject
   ├─ If approve: Enter approved amount (may be less than requested)
   ├─ Add notes
   ├─ Add conditions (if applicable)
   └─ Click "Confirmar Decisión"
   
5. Confirmation
   ├─ Project status updated
   ├─ Email sent to franchisee
   └─ If approved → Project can proceed to execution
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

**Backend:**
- ✅ Create all database migrations
- ✅ Create Medusa entities (Project, Category, Quote, etc.)
- ✅ Implement basic CRUD API endpoints
- ✅ Add authentication guards
- ✅ Set up file storage (Medusa Storage)

**Frontend:**
- ✅ Create route structure
- ✅ Set up Zustand store
- ✅ Create TypeScript types
- ✅ Build basic UI components (status badges, cards)

**Testing:**
- ✅ Database schema validation
- ✅ API endpoint smoke tests
- ✅ Authentication flow tests

---

### Phase 2: Admin Portal (Week 3)

**Features:**
- ✅ Create project flow
- ✅ Upload floor plan
- ✅ Add categories
- ✅ Invite suppliers
- ✅ View all projects list
- ✅ Project detail page

**Components:**
- `ProjectForm.tsx`
- `CategoryForm.tsx`
- `SupplierInviteDialog.tsx`
- `FloorPlanUpload.tsx`

---

### Phase 3: Supplier Portal (Week 4)

**Features:**
- ✅ View invitations
- ✅ Download floor plan
- ✅ Submit quote
- ✅ Upload quote PDF
- ✅ View quote status

**Components:**
- `InvitationsList.tsx`
- `CategoryDetails.tsx`
- `QuoteForm.tsx`
- `QuoteUpload.tsx`

---

### Phase 4: Franchisee Portal (Week 5)

**Features:**
- ✅ View own projects
- ✅ Compare quotes side-by-side
- ✅ Select winning quote
- ✅ Project dashboard

**Components:**
- `MyProjectsList.tsx`
- `QuoteComparison.tsx`
- `QuoteDetailDialog.tsx`
- `ProjectDashboard.tsx`

---

### Phase 5: Digital Signature (Week 6)

**Features:**
- ✅ Generate signature document
- ✅ Signature flow UI
- ✅ PDF signing with hash
- ✅ Signature verification
- ✅ Email notifications

**Components:**
- `SignatureDialog.tsx`
- `SignaturePad.tsx`

**Backend:**
- Signature service (PDF-lib integration)
- Hash generation
- Audit trail

---

### Phase 6: Financial Approval (Week 7)

**Features:**
- ✅ Finance dashboard
- ✅ Review workflow
- ✅ Approve/reject UI
- ✅ Conditional approval
- ✅ Email notifications

**Components:**
- `FinancialReviewDialog.tsx`
- `ApprovalHistory.tsx`

---

### Phase 7: Polish & Production (Week 8)

**Features:**
- ✅ Complete audit trail
- ✅ Email templates
- ✅ State machine validation
- ✅ Comprehensive error handling
- ✅ Performance optimization
- ✅ Security audit
- ✅ User documentation

**Testing:**
- End-to-end testing (Playwright)
- Load testing
- Security testing
- UAT with real users

---

## Success Metrics

### Technical Metrics

- **API Response Time**: < 500ms (p95)
- **File Upload Success Rate**: > 99%
- **Database Query Performance**: < 100ms (p95)
- **Frontend Load Time**: < 2s (First Contentful Paint)
- **Error Rate**: < 0.1%

### Business Metrics

- **Time to Create Project**: < 10 minutes (admin)
- **Time to Submit Quote**: < 30 minutes (supplier)
- **Time to Review Quotes**: < 15 minutes (franchisee)
- **Quote Comparison Clarity**: User satisfaction > 8/10
- **Signature Completion Rate**: > 95%
- **Financial Approval Time**: < 48 hours

### User Experience Metrics

- **Admin Portal**: SUS score > 80
- **Franchisee Portal**: SUS score > 85
- **Supplier Portal**: SUS score > 80
- **Mobile Usability**: Works on iOS/Android (view-only)

---

## Appendix

### A. Example Data Flow

**Complete flow for "Calle Carmen 50" project:**

```json
// 1. Admin creates project
POST /api/openings/projects
{
  "franchisee_id": "user_franchisee_juan",
  "name": "Nueva apertura - Calle Carmen 50",
  "address": { "street": "Calle Carmen 50", "city": "Madrid", ... },
  "fiscal_data": { ... }
}
→ Returns project_id: "proj_carmen50"

// 2. Admin uploads floor plan
POST /api/openings/projects/proj_carmen50/upload-floor-plan
[file: floor_plan.pdf]
→ Returns floor_plan_url

// 3. Admin adds categories
POST /api/openings/projects/proj_carmen50/categories
{ "name": "Mobiliario", "budget_estimate": 3500000 }
→ Returns category_id: "cat_mobiliario"

POST /api/openings/projects/proj_carmen50/categories
{ "name": "Rotulación", "budget_estimate": 1200000 }
→ Returns category_id: "cat_rotulacion"

// 4. Admin invites suppliers
POST /api/openings/categories/cat_mobiliario/invite
{ "supplier_ids": ["supp_a", "supp_b", "supp_c"] }
→ Creates 3 invitations, sends 3 emails

// 5. Suppliers submit quotes
POST /api/openings/categories/cat_mobiliario/quotes
{ "amount": 3200000, "delivery_days": 30, ... }
[file: quote_supplier_a.pdf]
→ Returns quote_id: "quote_supp_a"

// 6. Franchisee reviews quotes
GET /api/openings/categories/cat_mobiliario/quotes
→ Returns 3 quotes for comparison

// 7. Franchisee awards quote
POST /api/openings/quotes/quote_supp_a/award
→ Sets quote_supp_a status → "awarded"
→ Sets other quotes status → "rejected"

// 8. Franchisee signs
POST /api/openings/quotes/quote_supp_a/sign
{ "consent_text": "Acepto...", "terms_version": "1.0" }
→ Generates signed PDF
→ Returns signature_id: "sig_quote_supp_a"

// 9. Auto-request financing
POST /api/openings/projects/proj_carmen50/request-financing
→ Creates approval record
→ Emails finance team

// 10. Finance approves
POST /api/openings/approvals/appr_carmen50/review
{ "status": "approved", "amount_approved": 3200000 }
→ Project status → "financing_approved"
→ Email sent to franchisee
```

### B. Error Codes

| Code | Message | HTTP Status |
|---|---|---|
| `OPENING_001` | Project not found | 404 |
| `OPENING_002` | Unauthorized access to project | 403 |
| `OPENING_003` | Invalid project status transition | 400 |
| `OPENING_004` | Supplier not invited to category | 403 |
| `OPENING_005` | Quote already submitted | 409 |
| `OPENING_006` | Cannot award quote - not submitted | 400 |
| `OPENING_007` | Cannot sign - quote not awarded | 400 |
| `OPENING_008` | Signature verification failed | 400 |
| `OPENING_009` | File upload failed | 500 |
| `OPENING_010` | Invalid file type or size | 400 |

### C. Environment Variables

```env
# Medusa Backend
MEDUSA_BACKEND_URL=https://marketplace-b2b-backend-dev.onrender.com

# Storage (S3-compatible)
S3_BUCKET_OPENINGS_FLOOR_PLANS=carrefour-b2b-openings-floor-plans
S3_BUCKET_OPENINGS_QUOTES=carrefour-b2b-openings-quotes
S3_BUCKET_OPENINGS_SIGNATURES=carrefour-b2b-openings-signatures

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASSWORD=<sendgrid_api_key>
EMAIL_FROM=noreply@carrefour-b2b.com

# Signature
SIGNATURE_TERMS_VERSION=1.0
```

---

**End of Specification**

---

## Next Steps

Once this specification is approved:

1. **Review with stakeholders** (product, legal, finance)
2. **Finalize database schema** and run migrations
3. **Create backend entities** in Medusa
4. **Build MVP** (Phases 1-4) for initial testing
5. **Iterate** based on user feedback
6. **Launch** digital signature and finance modules

**Questions or feedback?** Please contact the development team.
