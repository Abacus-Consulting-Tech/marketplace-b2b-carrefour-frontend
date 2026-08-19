# Módulo de Nuevas Aperturas - Especificación Técnica

**Versión:** 1.0  
**Fecha:** 19 de agosto de 2026  
**Estado:** Borrador  

---

## Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Modelo de Datos](#modelo-de-datos)
4. [Esquema de Base de Datos](#esquema-de-base-de-datos)
5. [Endpoints API](#endpoints-api)
6. [Arquitectura Frontend](#arquitectura-frontend)
7. [Gestión de Estado](#gestión-de-estado)
8. [Gestión de Archivos](#gestión-de-archivos)
9. [Control de Acceso](#control-de-acceso)
10. [Máquina de Estados](#máquina-de-estados)
11. [Firma Digital](#firma-digital)
12. [Puntos de Integración](#puntos-de-integración)
13. [Flujos de UI/UX](#flujos-de-uiux)
14. [Hoja de Ruta de Implementación](#hoja-de-ruta-de-implementación)

---

## Resumen Ejecutivo

### Propósito

El módulo de **Nuevas Aperturas** permite a Carrefour gestionar el ciclo de vida completo de las aperturas de tiendas franquiciadas, desde la creación del proyecto hasta la aprobación final y el seguimiento del pago.

### Características Clave

- **Gestión de Proyectos**: Seguimiento de múltiples proyectos de apertura por franquiciado
- **Licitación Multi-Categoría**: Comparación de presupuestos de diferentes proveedores para distintas categorías (mobiliario, rotulación, equipamiento IT)
- **Invitación de Proveedores**: Administración controla qué proveedores pueden licitar en cada proyecto
- **Comparación de Presupuestos**: Comparativa lado a lado de propuestas de proveedores
- **Firma Digital**: Aceptación legalmente vinculante de presupuestos
- **Aprobación Financiera**: Flujo de revisión y aprobación de Carrefour Finanzas
- **Trazabilidad Completa**: Auditoría completa de todas las acciones y cambios de estado

### Roles de Usuario

| Rol | Nivel de Acceso |
|---|---|
| **Administrador** | Acceso completo - crea proyectos, invita proveedores, visualiza todos los datos |
| **Franquiciado** | Solo proyectos propios - visualiza presupuestos, selecciona ganadores, firma documentos |
| **Proveedor** | Solo proyectos invitados - visualiza detalles del proyecto, envía presupuestos |
| **Finanzas** | Todos los proyectos - aprueba/rechaza solicitudes de financiación |

---

## Arquitectura del Sistema

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Next.js                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Portal    │  │  Portal    │  │  Portal    │            │
│  │  Admin     │  │ Franquicia │  │  Proveedor │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
│        │                │                │                   │
│        └────────────────┴────────────────┘                   │
│                         │                                    │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│         Rutas API Next.js (Capa de Proxy)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  /api/openings/*   (Endpoints personalizados)       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Medusa.js                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Entidades   │  │    Medusa    │  │   Módulo     │     │
│  │  Custom      │  │     Core     │  │   Storage    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  - Entidad Project    - Entidad User     - Almacenamiento  │
│  - Entidad Quote      - Entidad Store    - Servicio Email  │
│  - Entidad Signature                     - Notificaciones  │
└─────────────────────────┼────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Base de Datos PostgreSQL                   │
│                                                              │
│  - opening_projects       - opening_quotes                  │
│  - opening_categories     - opening_signatures              │
│  - opening_invitations    - opening_approvals               │
│  - opening_documents      - opening_audit_logs              │
└─────────────────────────────────────────────────────────────┘
```

### Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Gestión de Estado** | Zustand con persistencia |
| **Validación de Formularios** | React Hook Form + Zod |
| **Componentes UI** | shadcn/ui |
| **Backend** | Medusa.js 2.x (MercurJS) |
| **Base de Datos** | PostgreSQL 16 |
| **Almacenamiento de Archivos** | Medusa Storage (compatible S3) |
| **Autenticación** | Medusa Auth (JWT) |
| **Firma Digital** | PDF-lib + firmas crypto |

---

## Modelo de Datos

### Diagrama de Relación de Entidades

```
┌─────────────┐
│    User     │ (Entidad Core de Medusa)
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

### Entidades Principales

#### 1. **OpeningProject**

Representa un único proyecto de apertura de tienda.

```typescript
interface OpeningProject {
  id: string;
  franchisee_id: string; // FK a User (role: franchisee)
  store_id?: string; // FK a Medusa Store (opcional - puede no existir aún)
  name: string; // ej. "Nueva apertura - Calle Carmen 50"
  status: ProjectStatus;
  planned_opening_date?: Date;
  
  // Datos de dirección
  address: {
    street: string;
    city: string;
    postal_code: string;
    province: string;
    country: string;
  };
  
  // Datos fiscales
  fiscal_data: {
    company_name: string;
    tax_id: string; // CIF/NIF
    contact_name: string;
    contact_email: string;
    contact_phone: string;
  };
  
  // Archivos
  floor_plan_url?: string;
  additional_documents?: DocumentReference[];
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
  created_by: string; // ID de usuario Admin
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

Diferentes categorías de equipamiento/servicios dentro de un proyecto (mobiliario, rotulación, IT, etc.).

```typescript
interface ProjectCategory {
  id: string;
  project_id: string; // FK a OpeningProject
  name: string; // "Mobiliario", "Rotulación", "Equipamiento informático"
  description?: string;
  budget_estimate?: number;
  
  // Especificaciones técnicas
  specifications?: {
    requirements: string[];
    deliverables: string[];
    timeline_days?: number;
  };
  
  created_at: Date;
}
```

#### 3. **SupplierInvitation**

Controla qué proveedores están invitados a licitar en qué categorías.

```typescript
interface SupplierInvitation {
  id: string;
  category_id: string; // FK a ProjectCategory
  supplier_id: string; // FK a User (role: supplier)
  status: InvitationStatus;
  
  invited_at: Date;
  invited_by: string; // ID de usuario Admin
  
  // Metadatos de invitación
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

Propuesta del proveedor para una categoría específica.

```typescript
interface Quote {
  id: string;
  category_id: string; // FK a ProjectCategory
  supplier_id: string; // FK a User
  
  // Datos financieros
  amount: number; // Importe total en céntimos
  currency: string; // EUR
  
  // Detalles del presupuesto
  pdf_url: string; // PDF del presupuesto subido
  notes?: string; // Comentarios adicionales del proveedor
  
  // Detalles técnicos
  delivery_days?: number;
  warranty_months?: number;
  payment_terms?: string;
  
  // Estado
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

Registro de firma digital para presupuestos aceptados.

```typescript
interface Signature {
  id: string;
  quote_id: string; // FK a Quote
  franchisee_id: string; // FK a User
  
  // Datos de firma
  signed_pdf_url: string; // PDF con firma aplicada
  signature_hash: string; // Hash SHA-256 del documento firmado
  signature_method: 'digital' | 'electronic'; // Tipo de firma
  
  // Trazabilidad de auditoría
  signed_at: Date;
  ip_address: string;
  user_agent: string;
  
  // Metadatos legales
  terms_version: string;
  consent_text: string;
}
```

#### 6. **FinancialApproval**

Registro de aprobación/rechazo de Carrefour Finanzas.

```typescript
interface FinancialApproval {
  id: string;
  project_id: string; // FK a OpeningProject
  reviewer_id: string; // FK a User (role: finance)
  
  status: ApprovalStatus;
  amount_approved?: number; // Puede diferir del solicitado
  
  notes?: string;
  conditions?: string[]; // Condiciones adjuntas a la aprobación
  
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

Trazabilidad completa de todas las acciones.

```typescript
interface AuditLog {
  id: string;
  project_id: string;
  
  action: string; // ej. "project_created", "quote_submitted", "signature_completed"
  actor_id: string; // Usuario que realizó la acción
  actor_role: UserRole;
  
  // Qué cambió
  entity_type: string; // "project", "quote", "signature", etc.
  entity_id: string;
  old_value?: Record<string, any>;
  new_value?: Record<string, any>;
  
  // Contexto
  ip_address?: string;
  user_agent?: string;
  
  created_at: Date;
}
```

---

## Esquema de Base de Datos

### Migraciones de Medusa

Todas las entidades personalizadas se crearán como migraciones de Medusa.

#### Migración: `create_opening_projects_table.ts`

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
        
        -- Dirección (JSONB)
        address JSONB NOT NULL,
        
        -- Datos fiscales (JSONB)
        fiscal_data JSONB NOT NULL,
        
        -- Archivos
        floor_plan_url VARCHAR(500),
        additional_documents JSONB,
        
        -- Metadatos
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

#### Migración: `create_project_categories_table.ts`

```typescript
export class CreateProjectCategoriesTable1724000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE opening_categories (
        id VARCHAR PRIMARY KEY,
        project_id VARCHAR NOT NULL REFERENCES opening_projects(id) ON DELETE CASCADE,
        
        name VARCHAR(100) NOT NULL,
        description TEXT,
        budget_estimate INTEGER, -- en céntimos
        
        -- Especificaciones técnicas (JSONB)
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

#### Migración: `create_supplier_invitations_table.ts`

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

#### Migración: `create_quotes_table.ts`

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
        
        -- Financiero
        amount INTEGER NOT NULL, -- en céntimos
        currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
        
        -- Documentos
        pdf_url VARCHAR(500) NOT NULL,
        notes TEXT,
        
        -- Detalles técnicos
        delivery_days INTEGER,
        warranty_months INTEGER,
        payment_terms TEXT,
        
        -- Estado
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

#### Migración: `create_signatures_table.ts`

```typescript
export class CreateSignaturesTable1724000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE opening_signatures (
        id VARCHAR PRIMARY KEY,
        quote_id VARCHAR NOT NULL REFERENCES opening_quotes(id) ON DELETE RESTRICT,
        franchisee_id VARCHAR NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
        
        -- Datos de firma
        signed_pdf_url VARCHAR(500) NOT NULL,
        signature_hash VARCHAR(64) NOT NULL, -- SHA-256
        signature_method VARCHAR(20) NOT NULL, -- 'digital' o 'electronic'
        
        -- Trazabilidad de auditoría
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

#### Migración: `create_financial_approvals_table.ts`

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
        amount_approved INTEGER, -- en céntimos
        
        notes TEXT,
        conditions JSONB, -- Array de strings de condiciones
        
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

#### Migración: `create_audit_logs_table.ts`

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

## Endpoints API

Todos los endpoints siguen las convenciones de Medusa y se exponen a través de rutas API de Next.js actuando como proxies.

### URL Base

```
/api/openings
```

### Autenticación

Todos los endpoints requieren autenticación JWT mediante cabecera `Authorization: Bearer <token>`.

---

### Proyectos

#### **POST** `/api/openings/projects`

Crear un nuevo proyecto de apertura.

**Rol:** Solo Admin

**Petición:**
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

**Respuesta:**
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

Listar todos los proyectos (filtrados por rol).

**Roles:**
- Admin: ve todos los proyectos
- Franquiciado: ve solo sus propios proyectos
- Proveedor: ve solo proyectos a los que está invitado
- Finanzas: ve todos los proyectos

**Parámetros de consulta:**
- `status` (opcional): Filtrar por estado
- `franchisee_id` (opcional, solo admin): Filtrar por franquiciado
- `page` (predeterminado: 1)
- `limit` (predeterminado: 20)

**Respuesta:**
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

Obtener detalles del proyecto con todos los datos relacionados.

**Roles:** Admin, Franquiciado (propio), Proveedor (invitado), Finanzas

**Respuesta:**
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
        "budget_estimate": 3500000, // 35.000 EUR en céntimos
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

Actualizar detalles del proyecto.

**Rol:** Solo Admin

**Petición:**
```json
{
  "status": "requesting_quotes",
  "floor_plan_url": "https://storage.../floor_plan_v2.pdf"
}
```

**Respuesta:**
```json
{
  "success": true,
  "project": { ... }
}
```

---

#### **POST** `/api/openings/projects/:id/upload-floor-plan`

Subir documento de plano de planta.

**Rol:** Solo Admin

**Petición:** multipart/form-data
- `file`: Archivo PDF (máx. 10MB)

**Respuesta:**
```json
{
  "success": true,
  "floor_plan_url": "https://storage.carrefour.com/openings/proj_01HXQ.../floor_plan.pdf"
}
```

---

### Categorías

#### **POST** `/api/openings/projects/:projectId/categories`

Añadir una categoría a un proyecto.

**Rol:** Solo Admin

**Petición:**
```json
{
  "name": "Mobiliario",
  "description": "Muebles y estanterías para la tienda",
  "budget_estimate": 3500000, // 35.000 EUR en céntimos
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

**Respuesta:**
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

### Invitaciones

#### **POST** `/api/openings/categories/:categoryId/invite`

Invitar proveedores a licitar en una categoría.

**Rol:** Solo Admin

**Petición:**
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

**Respuesta:**
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

Listar invitaciones (vista proveedor).

**Rol:** Solo Proveedor

**Respuesta:**
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

### Presupuestos

#### **POST** `/api/openings/categories/:categoryId/quotes`

Enviar un presupuesto (proveedor).

**Rol:** Proveedor (debe estar invitado)

**Petición:** multipart/form-data
- `amount`: number (en céntimos)
- `delivery_days`: number
- `warranty_months`: number
- `payment_terms`: string
- `notes`: string
- `file`: Archivo PDF (documento del presupuesto)

**Respuesta:**
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

Listar todos los presupuestos para una categoría.

**Roles:**
- Admin: ve todos los presupuestos
- Franquiciado: ve todos los presupuestos de sus proyectos
- Proveedor: ve solo su propio presupuesto

**Respuesta:**
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

Adjudicar un presupuesto (franquiciado selecciona ganador).

**Rol:** Franquiciado (propietario del proyecto)

**Respuesta:**
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
  "other_quotes_updated": 2 // Otros presupuestos marcados como 'rejected'
}
```

---

### Firmas

#### **POST** `/api/openings/quotes/:quoteId/sign`

Firmar un presupuesto adjudicado.

**Rol:** Franquiciado (propietario del proyecto)

**Petición:**
```json
{
  "consent_text": "Acepto los términos y condiciones del presupuesto presentado por Mobiliario Retail S.L. por un importe de 32.000 EUR.",
  "terms_version": "1.0"
}
```

**Respuesta:**
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

### Aprobaciones Financieras

#### **POST** `/api/openings/projects/:projectId/request-financing`

Solicitar aprobación financiera (automático después de la firma).

**Rol:** Franquiciado o sistema (auto-disparado)

**Respuesta:**
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

Aprobar o rechazar financiación.

**Rol:** Solo Finanzas

**Petición:**
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

**Respuesta:**
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

### Logs de Auditoría

#### **GET** `/api/openings/projects/:projectId/audit`

Obtener trazabilidad completa de auditoría para un proyecto.

**Rol:** Admin, Finanzas

**Respuesta:**
```json
{
  "success": true,
  "logs": [
    {
      "id": "log_01HXQ...",
      "action": "project_created",
      "actor": {
        "id": "user_01HXQ...",
        "name": "Usuario Admin",
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

## Arquitectura Frontend

### Estructura de Rutas

```
src/app/
├── (backoffice)/
│   └── admin/
│       └── openings/
│           ├── page.tsx                 # Lista de proyectos
│           ├── new/
│           │   └── page.tsx             # Crear proyecto
│           └── [id]/
│               ├── page.tsx             # Detalle del proyecto
│               ├── categories/
│               │   └── page.tsx         # Gestionar categorías
│               ├── invitations/
│               │   └── page.tsx         # Invitar proveedores
│               └── approvals/
│                   └── page.tsx         # Revisión financiera
│
├── (franchisee)/
│   └── franchisee/
│       └── openings/
│           ├── page.tsx                 # Mis proyectos
│           └── [id]/
│               ├── page.tsx             # Dashboard del proyecto
│               ├── quotes/
│               │   └── page.tsx         # Comparar presupuestos
│               └── sign/
│                   └── page.tsx         # Firmar presupuesto seleccionado
│
└── (supplier)/
    └── supplier/
        └── openings/
            ├── page.tsx                 # Mis invitaciones
            └── [categoryId]/
                ├── page.tsx             # Detalles de la categoría
                └── quote/
                    └── page.tsx         # Enviar/editar presupuesto
```

### Estructura de Componentes

```
src/components/openings/
├── admin/
│   ├── ProjectForm.tsx              # Crear/editar proyecto
│   ├── ProjectsList.tsx             # Tabla de proyectos admin
│   ├── CategoryForm.tsx             # Añadir categoría
│   ├── SupplierInviteDialog.tsx     # Modal invitar proveedores
│   └── FinancialReviewDialog.tsx    # Aprobar/rechazar financiación
│
├── franchisee/
│   ├── MyProjectsList.tsx           # Proyectos del franquiciado
│   ├── ProjectDashboard.tsx         # Vista general del proyecto
│   ├── QuoteComparison.tsx          # Tabla comparativa de presupuestos
│   ├── QuoteDetailDialog.tsx        # Ver PDF y detalles del presupuesto
│   └── SignatureDialog.tsx          # Flujo de firma digital
│
├── supplier/
│   ├── InvitationsList.tsx          # Invitaciones del proveedor
│   ├── CategoryDetails.tsx          # Especificaciones y plano
│   ├── QuoteForm.tsx                # Formulario enviar presupuesto
│   └── QuoteUpload.tsx              # Componente subida PDF
│
├── shared/
│   ├── ProjectStatusBadge.tsx       # Indicador de estado
│   ├── ProjectTimeline.tsx          # Línea de tiempo visual de etapas
│   ├── FloorPlanViewer.tsx          # Visor PDF para planos
│   ├── DocumentUpload.tsx           # Subida de archivos drag & drop
│   └── AuditTrail.tsx               # Visualización de logs de auditoría
│
└── ui/
    ├── ComparisonTable.tsx          # Tabla de comparación genérica
    ├── StateMachine.tsx             # Visualización de máquina de estados
    └── SignaturePad.tsx             # Canvas de firma digital
```

---

## Gestión de Estado

### Stores Zustand

#### `openings-store.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OpeningsState {
  // Estado Admin
  projects: OpeningProject[];
  selectedProject: OpeningProject | null;
  
  // Estado Franquiciado
  myProjects: OpeningProject[];
  activeQuoteComparison: {
    categoryId: string;
    quotes: Quote[];
  } | null;
  
  // Estado Proveedor
  myInvitations: SupplierInvitation[];
  myQuotes: Quote[];
  
  // Acciones
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
        // Solo persistir ID del proyecto seleccionado, no datos completos
        selectedProjectId: state.selectedProject?.id,
      }),
    }
  )
);
```

---

## Gestión de Archivos

### Estrategia de Almacenamiento

Todos los archivos se almacenan usando el módulo **Medusa Storage** (compatible con S3).

#### Buckets de Almacenamiento

| Bucket | Propósito | Tamaño Máx. | Retención |
|---|---|---|---|
| `openings-floor-plans` | PDFs de planos | 10 MB | Permanente |
| `openings-quotes` | PDFs de presupuestos | 5 MB | Permanente |
| `openings-signatures` | Documentos firmados | 5 MB | Permanente (legal) |
| `openings-documents` | Docs adicionales | 10 MB | Permanente |

#### Convención de Nombres de Archivos

```
{bucket}/{project_id}/{entity_type}_{entity_id}_{timestamp}.pdf

Ejemplos:
openings-floor-plans/proj_01HXQ.../floor_plan_1724000000.pdf
openings-quotes/proj_01HXQ.../quote_quote_01HXS..._1724001000.pdf
openings-signatures/proj_01HXQ.../signature_sig_01HXT..._1724002000.pdf
```

#### Flujo de Subida

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

## Control de Acceso

### Permisos Basados en Roles

| Acción | Admin | Franquiciado | Proveedor | Finanzas |
|---|---|---|---|---|
| Crear proyecto | ✅ | ❌ | ❌ | ❌ |
| Ver todos los proyectos | ✅ | ❌ | ❌ | ✅ |
| Ver proyectos propios | ✅ | ✅ | ❌ | ✅ |
| Subir plano | ✅ | ❌ | ❌ | ❌ |
| Añadir categoría | ✅ | ❌ | ❌ | ❌ |
| Invitar proveedores | ✅ | ❌ | ❌ | ❌ |
| Ver invitaciones | ✅ | ✅ (propias) | ✅ (propias) | ❌ |
| Enviar presupuesto | ❌ | ❌ | ✅ | ❌ |
| Ver todos los presupuestos | ✅ | ✅ (propios) | ❌ | ❌ |
| Ver presupuesto propio | ❌ | ❌ | ✅ | ❌ |
| Adjudicar presupuesto | ❌ | ✅ (propio) | ❌ | ❌ |
| Firmar presupuesto | ❌ | ✅ (propio) | ❌ | ❌ |
| Aprobar financiación | ❌ | ❌ | ❌ | ✅ |
| Ver logs de auditoría | ✅ | ❌ | ❌ | ✅ |

### Guard de Permisos de Medusa

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
      message: 'Se requiere acceso de administrador'
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
  
  // Consultar proyecto para verificar que franchisee_id coincide con user.id
  // ... implementación
  
  next();
}

export function requireInvitedSupplier(
  req: MedusaRequest,
  res: MedusaResponse,
  next: () => void
) {
  const user = req.user;
  const categoryId = req.params.categoryId;
  
  // Consultar opening_invitations para verificar que el proveedor está invitado
  // ... implementación
  
  next();
}
```

---

## Máquina de Estados

### Máquina de Estados del Proyecto

```
                    ┌─────────┐
                    │ draft   │
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

    (el estado cancelled se puede alcanzar desde cualquier estado)
```

### Reglas de Transición de Estado

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
  completed: [], // Estado terminal
  cancelled: [], // Estado terminal
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

### Auto-Transiciones

Algunas transiciones ocurren automáticamente basadas en eventos:

| Evento | Estado Anterior | Estado Nuevo | Disparador |
|---|---|---|---|
| Todas las categorías tienen presupuestos | `requesting_quotes` | `quotes_received` | Presupuesto enviado |
| Franquiciado adjudica presupuesto | `pending_selection` | `awarded` | Acción adjudicar |
| Presupuesto adjudicado | `awarded` | `pending_signature` | Auto (inmediato) |
| Franquiciado firma | `pending_signature` | `signed` | Acción firmar |
| Documento firmado | `signed` | `pending_financing` | Auto (inmediato) |
| Finanzas aprueba | `pending_financing` | `financing_approved` | Acción aprobar |
| Finanzas rechaza | `pending_financing` | `financing_rejected` | Acción rechazar |

---

## Firma Digital

### Flujo de Firma

```
1. Franquiciado selecciona presupuesto
   ↓
2. Estado del presupuesto → 'awarded'
   ↓
3. Sistema genera documento de firma (presupuesto original + términos)
   ↓
4. Franquiciado revisa documento
   ↓
5. Franquiciado marca checkbox de consentimiento
   ↓
6. Sistema captura:
   - Timestamp
   - Dirección IP
   - User agent
   - Texto de consentimiento
   ↓
7. Sistema genera hash SHA-256 del documento
   ↓
8. Sistema almacena registro de firma
   ↓
9. Email de confirmación enviado a:
   - Franquiciado
   - Proveedor
   - Admin
```

### Implementación (PDF-lib)

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
  // 1. Cargar PDF original
  const originalPdfBytes = await fetch(params.originalPdfUrl).then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(originalPdfBytes);
  
  // 2. Añadir página de firma
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
  
  // Añadir texto de consentimiento (con saltos de línea)
  const consentLines = wrapText(params.consentText, 80);
  let yPos = height - 210;
  page.drawText('Consentimiento:', { x: 50, y: yPos, size: 12, font: boldFont });
  consentLines.forEach((line, i) => {
    page.drawText(line, { x: 50, y: yPos - (i + 1) * 15, size: 10, font });
  });
  
  // 3. Generar hash
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

### Verificación de Firma

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

## Puntos de Integración

### Integración con Entidades Core de Medusa

#### **Entidad User**

Extendida con campo de rol personalizado:

```typescript
// Extensión de entidad User de Medusa
declare module "@medusajs/medusa/dist/models/user" {
  interface User {
    role: 'admin' | 'franchisee' | 'supplier' | 'finance';
  }
}
```

#### **Entidad Store**

Los proyectos pueden enlazarse opcionalmente a una Store de Medusa:

```typescript
// Cuando el franquiciado ya tiene una tienda en Medusa
project.store_id = 'store_01HXQ...';

// Cuando la tienda aún no existe (nueva apertura)
project.store_id = null;
```

Después de completar el proyecto, se puede crear una nueva entidad Store:

```typescript
// POST /admin/stores (endpoint core de Medusa)
{
  "name": "Carrefour Express - Calle Carmen 50",
  "metadata": {
    "opening_project_id": "proj_01HXQ..."
  }
}
```

### Integración con Módulos Existentes

#### **Módulo de Registro de Proveedores**

Los proveedores registrados a través del flujo de registro existente pueden ser invitados a proyectos:

```typescript
// Consultar proveedores aprobados
const approvedSuppliers = await getApprovedSuppliers({
  status: 'active',
  category: 'Mobiliario'
});

// Invitarlos a categoría del proyecto
await inviteSuppliers(categoryId, approvedSuppliers.map(s => s.id));
```

#### **Notificaciones por Email**

Disparar emails en hitos clave:

| Evento | Destinatarios | Plantilla |
|---|---|---|
| Proveedor invitado | Proveedor | `opening-invitation` |
| Presupuesto enviado | Admin, Franquiciado | `quote-submitted` |
| Todos los presupuestos recibidos | Franquiciado | `quotes-ready-for-review` |
| Presupuesto adjudicado | Proveedor ganador | `quote-awarded` |
| Presupuesto rechazado | Proveedores rechazados | `quote-not-selected` |
| Documento firmado | Todas las partes | `document-signed` |
| Financiación aprobada | Franquiciado, Proveedor | `financing-approved` |
| Financiación rechazada | Franquiciado | `financing-rejected` |

---

## Flujos de UI/UX

### Flujo Admin: Crear Proyecto

```
1. Navegar a /admin/openings
   ├─ Ver lista de todos los proyectos
   └─ Clic en botón "Nueva Apertura"
   
2. Rellenar formulario de proyecto (/admin/openings/new)
   ├─ Seleccionar franquiciado del desplegable
   ├─ Introducir nombre del proyecto
   ├─ Rellenar datos de dirección (autocompletado con Google Places API)
   ├─ Rellenar datos fiscales
   ├─ Subir plano PDF (drag & drop)
   └─ Clic en "Crear Proyecto"
   
3. Proyecto creado → Redirigir a /admin/openings/{id}
   ├─ Muestra detalles del proyecto
   ├─ Estado: "draft"
   └─ Call-to-action: "Añadir Categorías"
   
4. Añadir categorías
   ├─ Clic en "Añadir Categoría"
   ├─ Introducir nombre de categoría (Mobiliario, Rotulación, etc.)
   ├─ Introducir presupuesto estimado
   ├─ Añadir especificaciones/requisitos
   └─ Guardar
   
5. Invitar proveedores
   ├─ Para cada categoría, clic en "Invitar Proveedores"
   ├─ Multiselección de lista de proveedores aprobados
   ├─ Opcionalmente añadir mensaje y fecha límite
   ├─ Clic en "Enviar Invitaciones"
   └─ Proveedores reciben notificación por email
   
6. Actualizar estado del proyecto a "requesting_quotes"
   ├─ Sistema envía notificaciones
   └─ Esperar presupuestos de proveedores
```

### Flujo Franquiciado: Revisar y Seleccionar Presupuestos

```
1. Login → Dashboard muestra notificación
   ├─ "Tu proyecto Calle Carmen 50 tiene 3 presupuestos nuevos"
   └─ Clic en notificación
   
2. Navegar a /franchisee/openings/{id}/quotes
   ├─ Ver todas las categorías del proyecto
   └─ Para cada categoría, ver número de presupuestos
   
3. Seleccionar categoría (ej. "Mobiliario")
   ├─ Ver tabla comparativa lado a lado:
   │  ┌───────────────┬─────────┬──────────┬──────────┐
   │  │ Proveedor     │ Precio  │ Entrega  │ Garantía │
   │  ├───────────────┼─────────┼──────────┼──────────┤
   │  │ Proveedor A   │ 32.000€ │ 30 días  │ 24 meses │
   │  │ Proveedor B   │ 34.500€ │ 25 días  │ 36 meses │
   │  │ Proveedor C   │ 31.800€ │ 35 días  │ 24 meses │
   │  └───────────────┴─────────┴──────────┴──────────┘
   └─ Clic en cualquier presupuesto para ver PDF completo
   
4. Seleccionar ganador
   ├─ Clic en "Seleccionar" en fila del Proveedor C
   ├─ Aparece diálogo de confirmación
   ├─ Clic en "Confirmar Selección"
   └─ Estado del presupuesto → "awarded", otros → "rejected"
   
5. Repetir para todas las categorías
   
6. Una vez todas las categorías tienen ganadores → Auto-redirigir a firma
```

### Flujo Franquiciado: Firmar Documento

```
1. Navegar a /franchisee/openings/{id}/sign
   ├─ Ver lista de todos los presupuestos adjudicados
   └─ Importe total mostrado
   
2. Revisar cada presupuesto
   ├─ Clic para ver PDF del presupuesto firmado
   └─ Verificar detalles
   
3. Firmar todos los presupuestos
   ├─ Leer texto de consentimiento:
   │  "Acepto los términos de los presupuestos seleccionados
   │   por un importe total de 97.300 EUR..."
   ├─ Marcar checkbox "He leído y acepto"
   ├─ Clic en "Firmar Documentos"
   └─ Sistema genera firmas
   
4. Pantalla de confirmación
   ├─ "Documentos firmados correctamente"
   ├─ Descargar PDFs firmados
   ├─ Email enviado a todas las partes
   └─ Estado del proyecto → "pending_financing"
```

### Flujo Proveedor: Enviar Presupuesto

```
1. Login → Ver invitaciones
   ├─ Notificación en dashboard: "Tienes 2 invitaciones pendientes"
   └─ Navegar a /supplier/openings
   
2. Ver lista de invitaciones
   ├─ Ver nombre del proyecto, categoría, fecha límite
   └─ Clic en invitación
   
3. Revisar detalles del proyecto (/supplier/openings/{categoryId})
   ├─ Descargar PDF del plano
   ├─ Leer especificaciones
   ├─ Ver presupuesto estimado
   └─ Clic en "Preparar Presupuesto"
   
4. Rellenar formulario de presupuesto (/supplier/openings/{categoryId}/quote)
   ├─ Introducir importe (EUR)
   ├─ Introducir días de entrega
   ├─ Introducir meses de garantía
   ├─ Introducir términos de pago (opcional)
   ├─ Añadir notas (opcional)
   ├─ Subir PDF del presupuesto (drag & drop)
   └─ Clic en "Enviar Presupuesto"
   
5. Confirmación
   ├─ "Presupuesto enviado correctamente"
   ├─ Email de confirmación
   └─ Estado de invitación → "quote_submitted"
   
6. Esperar decisión del franquiciado
   ├─ Recibir email si adjudicado
   └─ Recibir email si no seleccionado
```

### Flujo Finanzas: Aprobar Financiación

```
1. Login → Dashboard
   ├─ Ver "Pendiente de aprobación financiera: 5 proyectos"
   └─ Navegar a /admin/openings?status=pending_financing
   
2. Revisar lista de proyectos
   ├─ Filtrar por estado, importe, franquiciado
   └─ Clic en proyecto
   
3. Vista de detalle del proyecto
   ├─ Ver datos fiscales del franquiciado
   ├─ Ver todos los presupuestos firmados
   ├─ Coste total del proyecto
   ├─ Historial de crédito del franquiciado (datos externos)
   └─ Clic en "Revisar Financiación"
   
4. Diálogo de revisión
   ├─ Decisión: Aprobar / Aprobar con condiciones / Rechazar
   ├─ Si aprobar: Introducir importe aprobado (puede ser menor que solicitado)
   ├─ Añadir notas
   ├─ Añadir condiciones (si aplica)
   └─ Clic en "Confirmar Decisión"
   
5. Confirmación
   ├─ Estado del proyecto actualizado
   ├─ Email enviado al franquiciado
   └─ Si aprobado → Proyecto puede proceder a ejecución
```

---

## Hoja de Ruta de Implementación

### Fase 1: Fundación (Semanas 1-2)

**Backend:**
- ✅ Crear todas las migraciones de base de datos
- ✅ Crear entidades de Medusa (Project, Category, Quote, etc.)
- ✅ Implementar endpoints API CRUD básicos
- ✅ Añadir guards de autenticación
- ✅ Configurar almacenamiento de archivos (Medusa Storage)

**Frontend:**
- ✅ Crear estructura de rutas
- ✅ Configurar store Zustand
- ✅ Crear tipos TypeScript
- ✅ Construir componentes UI básicos (badges de estado, cards)

**Testing:**
- ✅ Validación de esquema de base de datos
- ✅ Smoke tests de endpoints API
- ✅ Tests de flujo de autenticación

---

### Fase 2: Portal Admin (Semana 3)

**Características:**
- ✅ Flujo de creación de proyecto
- ✅ Subida de plano
- ✅ Añadir categorías
- ✅ Invitar proveedores
- ✅ Lista de todos los proyectos
- ✅ Página de detalle de proyecto

**Componentes:**
- `ProjectForm.tsx`
- `CategoryForm.tsx`
- `SupplierInviteDialog.tsx`
- `FloorPlanUpload.tsx`

---

### Fase 3: Portal Proveedor (Semana 4)

**Características:**
- ✅ Ver invitaciones
- ✅ Descargar plano
- ✅ Enviar presupuesto
- ✅ Subir PDF de presupuesto
- ✅ Ver estado del presupuesto

**Componentes:**
- `InvitationsList.tsx`
- `CategoryDetails.tsx`
- `QuoteForm.tsx`
- `QuoteUpload.tsx`

---

### Fase 4: Portal Franquiciado (Semana 5)

**Características:**
- ✅ Ver proyectos propios
- ✅ Comparar presupuestos lado a lado
- ✅ Seleccionar presupuesto ganador
- ✅ Dashboard del proyecto

**Componentes:**
- `MyProjectsList.tsx`
- `QuoteComparison.tsx`
- `QuoteDetailDialog.tsx`
- `ProjectDashboard.tsx`

---

### Fase 5: Firma Digital (Semana 6)

**Características:**
- ✅ Generar documento de firma
- ✅ UI de flujo de firma
- ✅ Firma PDF con hash
- ✅ Verificación de firma
- ✅ Notificaciones por email

**Componentes:**
- `SignatureDialog.tsx`
- `SignaturePad.tsx`

**Backend:**
- Servicio de firma (integración PDF-lib)
- Generación de hash
- Trazabilidad de auditoría

---

### Fase 6: Aprobación Financiera (Semana 7)

**Características:**
- ✅ Dashboard de finanzas
- ✅ Flujo de revisión
- ✅ UI de aprobar/rechazar
- ✅ Aprobación condicional
- ✅ Notificaciones por email

**Componentes:**
- `FinancialReviewDialog.tsx`
- `ApprovalHistory.tsx`

---

### Fase 7: Pulido y Producción (Semana 8)

**Características:**
- ✅ Trazabilidad de auditoría completa
- ✅ Plantillas de email
- ✅ Validación de máquina de estados
- ✅ Manejo completo de errores
- ✅ Optimización de rendimiento
- ✅ Auditoría de seguridad
- ✅ Documentación de usuario

**Testing:**
- Testing end-to-end (Playwright)
- Testing de carga
- Testing de seguridad
- UAT con usuarios reales

---

## Métricas de Éxito

### Métricas Técnicas

- **Tiempo de Respuesta API**: < 500ms (p95)
- **Tasa de Éxito en Subida de Archivos**: > 99%
- **Rendimiento de Consultas a BD**: < 100ms (p95)
- **Tiempo de Carga Frontend**: < 2s (First Contentful Paint)
- **Tasa de Error**: < 0,1%

### Métricas de Negocio

- **Tiempo para Crear Proyecto**: < 10 minutos (admin)
- **Tiempo para Enviar Presupuesto**: < 30 minutos (proveedor)
- **Tiempo para Revisar Presupuestos**: < 15 minutos (franquiciado)
- **Claridad de Comparación de Presupuestos**: Satisfacción usuario > 8/10
- **Tasa de Completitud de Firma**: > 95%
- **Tiempo de Aprobación Financiera**: < 48 horas

### Métricas de Experiencia de Usuario

- **Portal Admin**: Puntuación SUS > 80
- **Portal Franquiciado**: Puntuación SUS > 85
- **Portal Proveedor**: Puntuación SUS > 80
- **Usabilidad Móvil**: Funciona en iOS/Android (solo visualización)

---

## Apéndice

### A. Ejemplo de Flujo de Datos

**Flujo completo para proyecto "Calle Carmen 50":**

```json
// 1. Admin crea proyecto
POST /api/openings/projects
{
  "franchisee_id": "user_franchisee_juan",
  "name": "Nueva apertura - Calle Carmen 50",
  "address": { "street": "Calle Carmen 50", "city": "Madrid", ... },
  "fiscal_data": { ... }
}
→ Devuelve project_id: "proj_carmen50"

// 2. Admin sube plano
POST /api/openings/projects/proj_carmen50/upload-floor-plan
[file: floor_plan.pdf]
→ Devuelve floor_plan_url

// 3. Admin añade categorías
POST /api/openings/projects/proj_carmen50/categories
{ "name": "Mobiliario", "budget_estimate": 3500000 }
→ Devuelve category_id: "cat_mobiliario"

POST /api/openings/projects/proj_carmen50/categories
{ "name": "Rotulación", "budget_estimate": 1200000 }
→ Devuelve category_id: "cat_rotulacion"

// 4. Admin invita proveedores
POST /api/openings/categories/cat_mobiliario/invite
{ "supplier_ids": ["supp_a", "supp_b", "supp_c"] }
→ Crea 3 invitaciones, envía 3 emails

// 5. Proveedores envían presupuestos
POST /api/openings/categories/cat_mobiliario/quotes
{ "amount": 3200000, "delivery_days": 30, ... }
[file: quote_supplier_a.pdf]
→ Devuelve quote_id: "quote_supp_a"

// 6. Franquiciado revisa presupuestos
GET /api/openings/categories/cat_mobiliario/quotes
→ Devuelve 3 presupuestos para comparación

// 7. Franquiciado adjudica presupuesto
POST /api/openings/quotes/quote_supp_a/award
→ Estado quote_supp_a → "awarded"
→ Estado otros presupuestos → "rejected"

// 8. Franquiciado firma
POST /api/openings/quotes/quote_supp_a/sign
{ "consent_text": "Acepto...", "terms_version": "1.0" }
→ Genera PDF firmado
→ Devuelve signature_id: "sig_quote_supp_a"

// 9. Auto-solicitar financiación
POST /api/openings/projects/proj_carmen50/request-financing
→ Crea registro de aprobación
→ Envía email a equipo de finanzas

// 10. Finanzas aprueba
POST /api/openings/approvals/appr_carmen50/review
{ "status": "approved", "amount_approved": 3200000 }
→ Estado del proyecto → "financing_approved"
→ Email enviado al franquiciado
```

### B. Códigos de Error

| Código | Mensaje | Estado HTTP |
|---|---|---|
| `OPENING_001` | Proyecto no encontrado | 404 |
| `OPENING_002` | Acceso no autorizado al proyecto | 403 |
| `OPENING_003` | Transición de estado de proyecto inválida | 400 |
| `OPENING_004` | Proveedor no invitado a la categoría | 403 |
| `OPENING_005` | Presupuesto ya enviado | 409 |
| `OPENING_006` | No se puede adjudicar presupuesto - no enviado | 400 |
| `OPENING_007` | No se puede firmar - presupuesto no adjudicado | 400 |
| `OPENING_008` | Verificación de firma fallida | 400 |
| `OPENING_009` | Fallo en subida de archivo | 500 |
| `OPENING_010` | Tipo o tamaño de archivo inválido | 400 |

### C. Variables de Entorno

```env
# Backend Medusa
MEDUSA_BACKEND_URL=https://marketplace-b2b-backend-dev.onrender.com

# Almacenamiento (compatible S3)
S3_BUCKET_OPENINGS_FLOOR_PLANS=carrefour-b2b-openings-floor-plans
S3_BUCKET_OPENINGS_QUOTES=carrefour-b2b-openings-quotes
S3_BUCKET_OPENINGS_SIGNATURES=carrefour-b2b-openings-signatures

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASSWORD=<sendgrid_api_key>
EMAIL_FROM=noreply@carrefour-b2b.com

# Firma
SIGNATURE_TERMS_VERSION=1.0
```

---

**Fin de la Especificación**

---

## Próximos Pasos

Una vez aprobada esta especificación:

1. **Revisar con stakeholders** (producto, legal, finanzas)
2. **Finalizar esquema de base de datos** y ejecutar migraciones
3. **Crear entidades backend** en Medusa
4. **Construir MVP** (Fases 1-4) para testing inicial
5. **Iterar** basándose en feedback de usuarios
6. **Lanzar** módulos de firma digital y finanzas

**¿Preguntas o feedback?** Por favor contacta con el equipo de desarrollo.
