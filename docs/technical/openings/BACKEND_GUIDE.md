# 📘 Guía para Backend - Módulo de Nuevas Aperturas

## 🎯 Resumen Ejecutivo

El **Módulo de Nuevas Aperturas** gestiona el proceso completo de apertura de nuevas tiendas Carrefour, desde que se crea el proyecto hasta que se ejecuta la obra. Permite que franquiciados, proveedores y administradores colaboren en un sistema de licitación competitiva por categorías.

**Concepto clave:** Un proyecto puede tener múltiples categorías (mobiliario, rotulación, IT...) y cada categoría recibe presupuestos de diferentes proveedores. El franquiciado compara y selecciona el mejor presupuesto para cada categoría independientemente.

---

## 🔄 Flujo de Trabajo General

### 1. Creación del Proyecto (Admin)
El administrador crea un nuevo proyecto de apertura con:
- Información básica (nombre, franquiciado, fecha prevista)
- Ubicación del local
- Datos fiscales
- Planos del local (PDF)

### 2. Definición de Categorías (Admin)
El administrador divide el proyecto en categorías según las necesidades:
- **Mobiliario Comercial** (estanterías, mostradores, refrigeradores...)
- **Rotulación y Señalética** (letreros, rótulos, viniles...)
- **Equipamiento IT** (TPVs, servidores, cableado...)
- **Obra Civil** (construcción, reformas...)
- Etc.

Cada categoría tiene:
- Presupuesto estimado
- Plazo de entrega esperado
- Requisitos específicos
- Lista de entregables

### 3. Invitación a Proveedores (Admin)
Para cada categoría, el admin invita a proveedores especializados:
- El proveedor recibe una notificación
- Puede descargar el plano del local
- Ve los requisitos de su categoría
- Tiene una fecha límite para enviar presupuesto

### 4. Envío de Presupuestos (Proveedores)
Cada proveedor invitado envía su presupuesto:
- Importe total (en céntimos)
- Días de entrega
- Meses de garantía
- Condiciones de pago
- Notas adicionales
- PDF con el presupuesto detallado

### 5. Comparación de Ofertas (Franquiciado)
El franquiciado accede a su proyecto y:
- Ve todas las categorías
- Para cada categoría, compara los presupuestos recibidos
- La interfaz resalta el mejor precio automáticamente
- Puede ver detalles de garantía, entrega y condiciones

### 6. Adjudicación (Franquiciado)
El franquiciado selecciona el proveedor ganador para cada categoría:
- Puede elegir diferentes proveedores para diferentes categorías
- El presupuesto pasa a estado "adjudicado"
- Los demás presupuestos pasan a "rechazado"

### 7. Firma Digital (Franquiciado)
El franquiciado firma digitalmente cada presupuesto adjudicado:
- Se genera un hash del documento
- Se registra la firma con timestamp
- Queda registrado en el audit log

### 8. Solicitud de Financiación (Franquiciado)
Si necesita financiación, el franquiciado solicita aprobación:
- Indica el importe solicitado
- Añade justificación
- Carrefour Finanzas revisa y aprueba/rechaza

### 9. Ejecución (Proveedores)
Una vez aprobado todo:
- Los proveedores ejecutan sus trabajos
- El proyecto pasa por diferentes estados hasta completarse

---

## 👥 Roles y Permisos

### 🔵 Administrador (Carrefour)
**Puede hacer:**
- ✅ Crear proyectos de apertura
- ✅ Definir categorías para cada proyecto
- ✅ Invitar proveedores a categorías específicas
- ✅ Ver todos los proyectos y presupuestos
- ✅ Cancelar proyectos
- ✅ Acceder al historial de auditoría completo

**NO puede:**
- ❌ Adjudicar presupuestos (solo el franquiciado)
- ❌ Firmar contratos (solo el franquiciado)

### 🟢 Franquiciado
**Puede hacer:**
- ✅ Ver sus proyectos asignados
- ✅ Ver y comparar presupuestos de cada categoría
- ✅ Adjudicar presupuestos (elegir ganador)
- ✅ Firmar contratos digitalmente
- ✅ Solicitar financiación
- ✅ Ver estado del proyecto

**NO puede:**
- ❌ Crear proyectos (solo admin)
- ❌ Invitar proveedores (solo admin)
- ❌ Ver proyectos de otros franquiciados

### 🟡 Proveedor
**Puede hacer:**
- ✅ Ver invitaciones recibidas (solo de su empresa)
- ✅ Descargar planos y requisitos
- ✅ Enviar presupuestos
- ✅ Actualizar presupuestos (antes de la fecha límite)
- ✅ Ver si su presupuesto fue adjudicado

**NO puede:**
- ❌ Ver presupuestos de otros proveedores
- ❌ Ver proyectos donde no fue invitado
- ❌ Cambiar presupuesto después de ser adjudicado

---

## 📊 Estados del Proyecto

El proyecto pasa por estos estados en orden:

| Estado | Descripción | Quién puede cambiar |
|--------|-------------|---------------------|
| `draft` | Borrador inicial, sin categorías | Admin |
| `preparing_documentation` | Añadiendo categorías y documentos | Admin |
| `requesting_quotes` | Invitando proveedores | Admin |
| `quotes_received` | Proveedores enviando presupuestos | Sistema (automático) |
| `pending_selection` | Franquiciado comparando ofertas | Sistema |
| `awarded` | Presupuestos adjudicados | Franquiciado |
| `pending_signature` | Esperando firma digital | Sistema |
| `signed` | Firmado, esperando financiación | Franquiciado |
| `pending_financing` | Financiación solicitada | Franquiciado |
| `financing_approved` | Financiación aprobada | Admin (Finanzas) |
| `financing_rejected` | Financiación rechazada | Admin (Finanzas) |
| `in_execution` | Proyecto en ejecución | Admin |
| `completed` | Completado | Admin |
| `cancelled` | Cancelado | Admin |

**Nota:** El backend debe validar las transiciones de estado. Por ejemplo, no se puede pasar de `draft` directamente a `signed`.

---

## 🗄️ Estructura de Datos

### Proyecto (OpeningProject)

```javascript
{
  id: "proj_001",
  franchisee_id: "user_franchisee_123",
  store_id: null,                    // Opcional, se asigna después
  name: "Carrefour Express Barcelona Centro",
  description: "Nueva apertura en zona comercial...",
  status: "requesting_quotes",
  planned_opening_date: "2026-03-15",
  store_size_sqm: 250,
  store_format: "Express",           // Express, Market, Hipermercado
  
  // Dirección del local
  address: {
    street: "Calle Mayor 123",
    city: "Barcelona",
    province: "Barcelona",
    postal_code: "08001",
    country: "España"
  },
  
  // Datos fiscales del franquiciado
  fiscal_data: {
    company_name: "Carrefour Express BCN S.L.",
    tax_id: "B12345678",
    contact_name: "Juan García",
    contact_email: "juan@franquicia.com",
    contact_phone: "+34 600 123 456"
  },
  
  floor_plan_url: "https://storage.com/planos/proj_001.pdf",
  additional_documents: [
    {
      name: "Licencia de apertura",
      url: "https://storage.com/docs/licencia.pdf",
      size_bytes: 245678
    }
  ],
  
  created_at: "2026-01-15T10:30:00Z",
  updated_at: "2026-01-16T14:20:00Z",
  created_by: "admin_user_id"
}
```

### Categoría (ProjectCategory)

```javascript
{
  id: "cat_001",
  project_id: "proj_001",
  name: "Mobiliario Comercial",
  description: "Estanterías, mostradores, refrigeradores...",
  budget_estimate: 1500000,          // €15,000 en céntimos
  timeline_days: 45,
  requirements: [
    "Estanterías modulares de 2m de altura",
    "Refrigeradores de bebidas (3 unidades)",
    "Mostrador de caja (2 puestos)"
  ],
  deliverables: [
    "Plano de distribución del mobiliario",
    "Certificados de calidad de equipos",
    "Manual de mantenimiento"
  ],
  status: "pending_quotes",
  created_at: "2026-01-15T11:00:00Z"
}
```

### Invitación (SupplierInvitation)

```javascript
{
  id: "inv_001",
  project_id: "proj_001",
  category_id: "cat_001",
  supplier_id: "supplier_abc_123",
  status: "pending",                 // pending, quote_submitted, awarded, rejected
  invited_at: "2026-01-15T12:00:00Z",
  deadline: "2026-01-25T23:59:59Z",
  invited_by: "admin_user_id"
}
```

### Presupuesto (Quote)

```javascript
{
  id: "quote_001",
  category_id: "cat_001",
  supplier_id: "supplier_abc_123",
  
  // Detalles de la oferta
  amount_cents: 1450000,             // €14,500 en céntimos
  delivery_days: 30,
  warranty_months: 24,
  payment_terms: "50% anticipo, 50% a la entrega",
  notes: "Incluye instalación y formación del personal",
  
  quote_pdf_url: "https://storage.com/quotes/quote_001.pdf",
  
  status: "submitted",               // draft, submitted, awarded, rejected
  submitted_at: "2026-01-20T15:30:00Z",
  awarded_at: null,
  
  created_at: "2026-01-20T15:30:00Z",
  updated_at: "2026-01-20T15:30:00Z"
}
```

### Firma Digital (Signature)

```javascript
{
  id: "sig_001",
  quote_id: "quote_001",
  franchisee_id: "user_franchisee_123",
  
  signature_data: "base64_encoded_signature_image",
  document_hash: "sha256_hash_of_the_quote_pdf",
  signed_at: "2026-01-26T10:00:00Z",
  ip_address: "192.168.1.100",
  
  created_at: "2026-01-26T10:00:00Z"
}
```

### Aprobación Financiera (FinancialApproval)

```javascript
{
  id: "fin_001",
  project_id: "proj_001",
  requested_amount_cents: 5000000,   // €50,000 en céntimos
  justification: "Necesario para cubrir inversión inicial...",
  
  status: "pending",                 // pending, approved, rejected
  requested_at: "2026-01-27T09:00:00Z",
  requested_by: "user_franchisee_123",
  
  reviewed_at: null,
  reviewed_by: null,
  reviewer_notes: null,
  
  created_at: "2026-01-27T09:00:00Z",
  updated_at: "2026-01-27T09:00:00Z"
}
```

### Registro de Auditoría (AuditLog)

```javascript
{
  id: "log_001",
  project_id: "proj_001",
  entity_type: "quote",              // project, category, quote, signature, etc.
  entity_id: "quote_001",
  action: "awarded",                 // created, updated, deleted, awarded, etc.
  
  user_id: "user_franchisee_123",
  user_role: "franchisee",
  
  old_value: { status: "submitted" },
  new_value: { status: "awarded" },
  
  timestamp: "2026-01-26T11:00:00Z",
  ip_address: "192.168.1.100"
}
```

---

## 🔌 Endpoints Necesarios

### 📋 Proyectos

#### `GET /api/admin/openings/projects`
Lista todos los proyectos (admin) o los proyectos del franquiciado.

**Query params:**
- `status` - Filtrar por estado
- `franchisee_id` - Filtrar por franquiciado
- `page` - Paginación
- `limit` - Tamaño de página

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "proj_001",
      "name": "Carrefour Express Barcelona",
      "status": "requesting_quotes",
      "franchisee": {
        "id": "user_123",
        "name": "Juan García"
      },
      "categories_count": 3,
      "quotes_count": 5,
      "created_at": "2026-01-15T10:30:00Z"
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

#### `GET /api/admin/openings/projects/:id`
Detalle completo de un proyecto.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "proj_001",
    "franchisee_id": "user_123",
    "name": "Carrefour Express Barcelona Centro",
    "status": "requesting_quotes",
    "address": { ... },
    "fiscal_data": { ... },
    "floor_plan_url": "https://...",
    "franchisee": {
      "id": "user_123",
      "name": "Juan García",
      "email": "juan@franquicia.com"
    },
    "created_at": "2026-01-15T10:30:00Z"
  }
}
```

#### `POST /api/admin/openings/projects`
Crear nuevo proyecto.

**Body:**
```json
{
  "franchisee_id": "user_123",
  "name": "Carrefour Express Madrid Centro",
  "planned_opening_date": "2026-06-15",
  "address": {
    "street": "Calle Mayor 456",
    "city": "Madrid",
    "province": "Madrid",
    "postal_code": "28001",
    "country": "España"
  },
  "fiscal_data": {
    "company_name": "Carrefour Madrid S.L.",
    "tax_id": "B87654321",
    "contact_name": "María López",
    "contact_email": "maria@franquicia.com",
    "contact_phone": "+34 600 987 654"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "proj_new_123",
    "status": "draft",
    "created_at": "2026-01-20T10:00:00Z",
    ...
  },
  "message": "Proyecto creado exitosamente"
}
```

#### `PUT /api/admin/openings/projects/:id`
Actualizar proyecto existente.

#### `POST /api/admin/openings/projects/:id/floor-plan`
Subir plano del local (multipart/form-data).

**Body:**
- `file` - Archivo PDF del plano

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "floor_plan_url": "https://storage.com/planos/proj_001.pdf"
  }
}
```

---

### 🏷️ Categorías

#### `GET /api/admin/openings/projects/:projectId/categories`
Lista las categorías de un proyecto.

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_001",
      "project_id": "proj_001",
      "name": "Mobiliario Comercial",
      "budget_estimate": 1500000,
      "status": "pending_quotes",
      "quotes_count": 3,
      "created_at": "2026-01-15T11:00:00Z"
    }
  ]
}
```

#### `POST /api/admin/openings/projects/:projectId/categories`
Crear nueva categoría para un proyecto.

**Body:**
```json
{
  "name": "Equipamiento IT",
  "description": "TPVs, servidores, cableado de red...",
  "budget_estimate": 800000,
  "timeline_days": 30,
  "requirements": [
    "2 TPVs táctiles",
    "Servidor central",
    "Cableado estructurado"
  ],
  "deliverables": [
    "Certificación de instalación",
    "Manuales de usuario"
  ]
}
```

---

### 📧 Invitaciones

#### `POST /api/admin/openings/categories/:categoryId/invite`
Invitar proveedores a una categoría.

**Body:**
```json
{
  "supplier_ids": [
    "supplier_abc_123",
    "supplier_xyz_456"
  ],
  "deadline": "2026-02-15T23:59:59Z"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "invitations_sent": 2,
    "invitations": [
      {
        "id": "inv_001",
        "supplier_id": "supplier_abc_123",
        "status": "pending"
      },
      {
        "id": "inv_002",
        "supplier_id": "supplier_xyz_456",
        "status": "pending"
      }
    ]
  }
}
```

#### `GET /api/supplier/openings/invitations`
Invitaciones recibidas por el proveedor (requiere autenticación de proveedor).

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "inv_001",
      "status": "pending",
      "deadline": "2026-02-15T23:59:59Z",
      "project": {
        "id": "proj_001",
        "name": "Carrefour Express Barcelona",
        "address": { ... },
        "floor_plan_url": "https://..."
      },
      "category": {
        "id": "cat_001",
        "name": "Mobiliario Comercial",
        "description": "...",
        "budget_estimate": 1500000,
        "requirements": [ ... ]
      }
    }
  ]
}
```

---

### 💰 Presupuestos

#### `GET /api/admin/openings/categories/:categoryId/quotes`
Ver todos los presupuestos de una categoría (solo admin).

#### `POST /api/supplier/openings/categories/:categoryId/quote`
Enviar presupuesto para una categoría (multipart/form-data).

**Body:**
```json
{
  "amount_cents": 1450000,
  "delivery_days": 30,
  "warranty_months": 24,
  "payment_terms": "50% anticipo, 50% a la entrega",
  "notes": "Incluye instalación y formación",
  "quote_pdf": [archivo PDF]
}
```

#### `GET /api/franchisee/openings/categories/:categoryId/compare`
Comparar presupuestos de una categoría (solo franquiciado del proyecto).

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "category_id": "cat_001",
    "category_name": "Mobiliario Comercial",
    "budget_estimate": 1500000,
    "quotes": [
      {
        "id": "quote_001",
        "supplier": {
          "id": "supplier_abc",
          "name": "Mobiliario Comercial S.L."
        },
        "amount_cents": 1450000,
        "delivery_days": 30,
        "warranty_months": 24,
        "payment_terms": "...",
        "status": "submitted"
      },
      {
        "id": "quote_002",
        "supplier": {
          "id": "supplier_xyz",
          "name": "Equipamientos Pro S.A."
        },
        "amount_cents": 1620000,
        "delivery_days": 25,
        "warranty_months": 36,
        "payment_terms": "...",
        "status": "submitted"
      }
    ]
  }
}
```

#### `POST /api/franchisee/openings/quotes/:quoteId/award`
Adjudicar presupuesto (seleccionar ganador).

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "quote_001",
    "status": "awarded",
    "awarded_at": "2026-01-26T11:00:00Z"
  },
  "message": "Presupuesto adjudicado exitosamente"
}
```

**Nota:** Este endpoint debe:
- Cambiar el estado del quote a `awarded`
- Cambiar los otros quotes de la misma categoría a `rejected`
- Actualizar el estado del proyecto si es necesario
- Registrar en el audit log

---

### ✍️ Firmas Digitales

#### `POST /api/franchisee/openings/quotes/:quoteId/sign`
Firmar digitalmente un presupuesto adjudicado.

**Body:**
```json
{
  "signature_data": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "document_hash": "sha256_hash_calculated_by_frontend"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "sig_001",
    "quote_id": "quote_001",
    "signed_at": "2026-01-26T10:00:00Z"
  }
}
```

---

### 💳 Financiación

#### `POST /api/franchisee/openings/projects/:projectId/financing`
Solicitar financiación.

**Body:**
```json
{
  "requested_amount_cents": 5000000,
  "justification": "Inversión inicial para equipamiento completo..."
}
```

#### `POST /api/admin/openings/financing/:approvalId/review`
Revisar solicitud de financiación (Carrefour Finanzas).

**Body:**
```json
{
  "approved": true,
  "notes": "Aprobado según política de financiación..."
}
```

---

### 📝 Auditoría

#### `GET /api/admin/openings/projects/:projectId/audit-logs`
Historial completo de cambios del proyecto.

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "log_001",
      "action": "awarded",
      "entity_type": "quote",
      "user": {
        "id": "user_123",
        "name": "Juan García",
        "role": "franchisee"
      },
      "old_value": { "status": "submitted" },
      "new_value": { "status": "awarded" },
      "timestamp": "2026-01-26T11:00:00Z"
    }
  ]
}
```

---

## 🔐 Autenticación y Seguridad

### Headers Requeridos
Todos los endpoints requieren autenticación JWT:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Permisos por Rol

**Admin:**
- Acceso total a todos los proyectos
- Puede crear, editar y cancelar proyectos
- Puede ver todos los presupuestos

**Franchisee:**
- Solo puede ver sus propios proyectos (filtrar por `franchisee_id`)
- No puede crear proyectos
- Puede adjudicar y firmar presupuestos de sus proyectos

**Supplier:**
- Solo ve invitaciones donde fue invitado
- No puede ver proyectos completos, solo info de su categoría
- No puede ver presupuestos de otros proveedores

### Validaciones Importantes

1. **Transiciones de Estado:** Validar que las transiciones son válidas
2. **Fechas Límite:** No permitir envío de presupuestos después del deadline
3. **Adjudicación:** Solo un presupuesto por categoría puede estar adjudicado
4. **Firma:** Solo se puede firmar un presupuesto adjudicado
5. **Financiación:** Solo se puede solicitar si todos los presupuestos están firmados

---

## 📦 Almacenamiento de Archivos

### Archivos que se suben:
- **Planos del local:** PDF grande (2-10 MB)
- **Presupuestos de proveedores:** PDF (500 KB - 5 MB)
- **Documentos adicionales:** PDF/imágenes

### Recomendación:
Usar **S3-compatible storage** (AWS S3, DigitalOcean Spaces, MinIO...)

### URL firmadas:
Para descargas, generar URLs firmadas temporales (válidas por 1 hora):

```javascript
GET /api/openings/files/:fileId/download
→ Redirect to signed URL
→ https://storage.com/file.pdf?signature=abc123&expires=1234567890
```

---

## 🔔 Notificaciones

El sistema debe enviar notificaciones en estos eventos:

| Evento | Destinatario | Mensaje |
|--------|--------------|---------|
| Proveedor invitado | Proveedor | "Has sido invitado a cotizar para [Categoría]" |
| Presupuesto recibido | Franquiciado | "Nuevo presupuesto recibido para [Categoría]" |
| Presupuesto adjudicado | Proveedor | "¡Felicidades! Tu presupuesto ha sido seleccionado" |
| Presupuesto rechazado | Proveedor | "Tu presupuesto no ha sido seleccionado" |
| Documento firmado | Admin + Proveedor | "Contrato firmado para [Categoría]" |
| Financiación aprobada | Franquiciado | "Tu solicitud de financiación ha sido aprobada" |

**Canales:**
- Email
- Notificaciones push (futuro)
- Dashboard interno

---

## 🎨 Frontend Actual (Mock)

El frontend YA está implementado con datos mock. Actualmente:

- ✅ **Mock Mode:** `NEXT_PUBLIC_MOCK_OPENINGS=true`
- ✅ Datos de ejemplo pre-cargados
- ✅ Delay de 300ms simulado
- ✅ Todas las pantallas funcionando

### Para cambiar a backend real:

1. Cambiar variable de entorno: `NEXT_PUBLIC_MOCK_OPENINGS=false`
2. El frontend automáticamente hará llamadas a `/api/admin/openings/*`
3. No requiere cambios de código

### Estructura del API Client:

```javascript
// src/lib/api/openings-client.ts
const isMockMode = process.env.NEXT_PUBLIC_MOCK_OPENINGS === 'true';

export const openingsApi = {
  async getProjects(filters) {
    if (isMockMode) {
      // Retorna mock data
      return mockProjects;
    } else {
      // Llama al backend real
      const response = await apiClient.get('/admin/openings/projects', { params: filters });
      return response.data;
    }
  }
  // ... más métodos
}
```

---

## 🧪 Testing

### Datos de prueba sugeridos:

**Crear este usuario de prueba:**
```json
{
  "email": "franchisee@test.com",
  "password": "franchisee123",
  "role": "franchisee",
  "name": "Juan García Test"
}
```

**Proyecto de prueba:**
```json
{
  "id": "proj_test_001",
  "name": "Test - Carrefour Express Barcelona Centro",
  "franchisee_id": "[id del usuario test]",
  "status": "requesting_quotes"
}
```

**Categoría de prueba:**
```json
{
  "id": "cat_test_001",
  "project_id": "proj_test_001",
  "name": "Mobiliario Comercial",
  "budget_estimate": 1500000
}
```

### Endpoints prioritarios para empezar:

1. ✅ `POST /api/admin/openings/projects` - Crear proyecto
2. ✅ `GET /api/admin/openings/projects` - Listar proyectos
3. ✅ `GET /api/admin/openings/projects/:id` - Detalle
4. ✅ `POST /api/admin/openings/projects/:projectId/categories` - Crear categoría
5. ✅ `GET /api/admin/openings/projects/:projectId/categories` - Listar categorías

Con estos 5 endpoints ya se puede probar el flujo básico desde el frontend.

---

## �️ Esquema de Base de Datos (PostgreSQL)

### Tabla: `opening_projects`

```sql
CREATE TABLE opening_projects (
  id VARCHAR(50) PRIMARY KEY,
  franchisee_id VARCHAR(50) NOT NULL REFERENCES users(id),
  store_id VARCHAR(50) REFERENCES stores(id),
  
  -- Información básica
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  
  -- Fechas y tamaños
  planned_opening_date DATE,
  store_size_sqm INTEGER,
  store_format VARCHAR(50),
  
  -- Dirección (JSON)
  address JSONB NOT NULL,
  
  -- Datos fiscales (JSON)
  fiscal_data JSONB NOT NULL,
  
  -- Documentos
  floor_plan_url TEXT,
  additional_documents JSONB DEFAULT '[]',
  
  -- Auditoría
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by VARCHAR(50) NOT NULL REFERENCES users(id),
  
  -- Índices
  CONSTRAINT valid_status CHECK (status IN (
    'draft', 'preparing_documentation', 'requesting_quotes', 
    'quotes_received', 'pending_selection', 'awarded', 
    'pending_signature', 'signed', 'pending_financing', 
    'financing_approved', 'financing_rejected', 'in_execution', 
    'completed', 'cancelled'
  )),
  CONSTRAINT valid_format CHECK (store_format IN (
    'Express', 'Market', 'Hipermercado', NULL
  ))
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_opening_projects_franchisee ON opening_projects(franchisee_id);
CREATE INDEX idx_opening_projects_status ON opening_projects(status);
CREATE INDEX idx_opening_projects_created_at ON opening_projects(created_at DESC);
CREATE INDEX idx_opening_projects_planned_date ON opening_projects(planned_opening_date);

-- Índice GIN para búsquedas en JSON
CREATE INDEX idx_opening_projects_address ON opening_projects USING GIN (address);
```

### Tabla: `opening_categories`

```sql
CREATE TABLE opening_categories (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL REFERENCES opening_projects(id) ON DELETE CASCADE,
  
  -- Información
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Presupuesto y tiempo
  budget_estimate BIGINT NOT NULL, -- En céntimos
  timeline_days INTEGER,
  
  -- Requisitos (array JSON)
  requirements JSONB DEFAULT '[]',
  deliverables JSONB DEFAULT '[]',
  
  -- Estado
  status VARCHAR(50) NOT NULL DEFAULT 'pending_quotes',
  
  -- Auditoría
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_category_status CHECK (status IN (
    'pending_quotes', 'quotes_received', 'awarded', 'cancelled'
  ))
);

CREATE INDEX idx_opening_categories_project ON opening_categories(project_id);
CREATE INDEX idx_opening_categories_status ON opening_categories(status);
```

### Tabla: `opening_invitations`

```sql
CREATE TABLE opening_invitations (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL REFERENCES opening_projects(id) ON DELETE CASCADE,
  category_id VARCHAR(50) NOT NULL REFERENCES opening_categories(id) ON DELETE CASCADE,
  supplier_id VARCHAR(50) NOT NULL REFERENCES users(id),
  
  -- Estado y fechas
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  invited_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deadline TIMESTAMP NOT NULL,
  
  -- Auditoría
  invited_by VARCHAR(50) NOT NULL REFERENCES users(id),
  
  CONSTRAINT valid_invitation_status CHECK (status IN (
    'pending', 'quote_submitted', 'awarded', 'rejected'
  )),
  
  -- No duplicar invitaciones
  UNIQUE(category_id, supplier_id)
);

CREATE INDEX idx_opening_invitations_supplier ON opening_invitations(supplier_id);
CREATE INDEX idx_opening_invitations_category ON opening_invitations(category_id);
CREATE INDEX idx_opening_invitations_status ON opening_invitations(status);
CREATE INDEX idx_opening_invitations_deadline ON opening_invitations(deadline);
```

### Tabla: `opening_quotes`

```sql
CREATE TABLE opening_quotes (
  id VARCHAR(50) PRIMARY KEY,
  category_id VARCHAR(50) NOT NULL REFERENCES opening_categories(id) ON DELETE CASCADE,
  supplier_id VARCHAR(50) NOT NULL REFERENCES users(id),
  
  -- Detalles de la oferta
  amount_cents BIGINT NOT NULL,
  delivery_days INTEGER NOT NULL,
  warranty_months INTEGER,
  payment_terms TEXT,
  notes TEXT,
  
  -- Documento
  quote_pdf_url TEXT NOT NULL,
  
  -- Estado y fechas
  status VARCHAR(50) NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  awarded_at TIMESTAMP,
  
  -- Auditoría
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_quote_status CHECK (status IN (
    'draft', 'submitted', 'awarded', 'rejected'
  )),
  
  -- Solo un presupuesto por proveedor por categoría
  UNIQUE(category_id, supplier_id)
);

CREATE INDEX idx_opening_quotes_category ON opening_quotes(category_id);
CREATE INDEX idx_opening_quotes_supplier ON opening_quotes(supplier_id);
CREATE INDEX idx_opening_quotes_status ON opening_quotes(status);
CREATE INDEX idx_opening_quotes_amount ON opening_quotes(amount_cents);
```

### Tabla: `opening_signatures`

```sql
CREATE TABLE opening_signatures (
  id VARCHAR(50) PRIMARY KEY,
  quote_id VARCHAR(50) NOT NULL REFERENCES opening_quotes(id) ON DELETE CASCADE,
  franchisee_id VARCHAR(50) NOT NULL REFERENCES users(id),
  
  -- Firma
  signature_data TEXT NOT NULL, -- Base64 de la imagen
  document_hash VARCHAR(64) NOT NULL, -- SHA-256 hash
  
  -- Metadata
  signed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  ip_address VARCHAR(45), -- IPv4 o IPv6
  user_agent TEXT,
  
  -- Auditoría
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Solo una firma por presupuesto
  UNIQUE(quote_id)
);

CREATE INDEX idx_opening_signatures_quote ON opening_signatures(quote_id);
CREATE INDEX idx_opening_signatures_franchisee ON opening_signatures(franchisee_id);
```

### Tabla: `opening_financial_approvals`

```sql
CREATE TABLE opening_financial_approvals (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL REFERENCES opening_projects(id) ON DELETE CASCADE,
  
  -- Solicitud
  requested_amount_cents BIGINT NOT NULL,
  justification TEXT NOT NULL,
  requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
  requested_by VARCHAR(50) NOT NULL REFERENCES users(id),
  
  -- Revisión
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  reviewed_at TIMESTAMP,
  reviewed_by VARCHAR(50) REFERENCES users(id),
  reviewer_notes TEXT,
  
  -- Auditoría
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_approval_status CHECK (status IN (
    'pending', 'approved', 'rejected'
  ))
);

CREATE INDEX idx_opening_financial_project ON opening_financial_approvals(project_id);
CREATE INDEX idx_opening_financial_status ON opening_financial_approvals(status);
CREATE INDEX idx_opening_financial_requested_by ON opening_financial_approvals(requested_by);
```

### Tabla: `opening_audit_logs`

```sql
CREATE TABLE opening_audit_logs (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL REFERENCES opening_projects(id) ON DELETE CASCADE,
  
  -- Entidad afectada
  entity_type VARCHAR(50) NOT NULL, -- 'project', 'category', 'quote', etc.
  entity_id VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'deleted', 'awarded', etc.
  
  -- Usuario
  user_id VARCHAR(50) REFERENCES users(id),
  user_role VARCHAR(50),
  
  -- Cambios
  old_value JSONB,
  new_value JSONB,
  
  -- Metadata
  timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  ip_address VARCHAR(45),
  
  CONSTRAINT valid_entity_type CHECK (entity_type IN (
    'project', 'category', 'invitation', 'quote', 
    'signature', 'financial_approval'
  ))
);

CREATE INDEX idx_opening_audit_project ON opening_audit_logs(project_id);
CREATE INDEX idx_opening_audit_entity ON opening_audit_logs(entity_type, entity_id);
CREATE INDEX idx_opening_audit_timestamp ON opening_audit_logs(timestamp DESC);
CREATE INDEX idx_opening_audit_user ON opening_audit_logs(user_id);
```

---

## 🌱 Datos Seed (Ejemplo)

### Script SQL para datos de prueba:

```sql
-- 1. Insertar usuarios de prueba (asumiendo que la tabla users ya existe)
INSERT INTO users (id, email, password_hash, role, name, created_at) VALUES
('admin_test_001', 'admin@test.com', '$2b$10$...', 'admin', 'Admin Test', NOW()),
('franchisee_test_001', 'franchisee@test.com', '$2b$10$...', 'franchisee', 'Juan García', NOW()),
('supplier_test_001', 'supplier1@test.com', '$2b$10$...', 'supplier', 'Mobiliario Comercial S.L.', NOW()),
('supplier_test_002', 'supplier2@test.com', '$2b$10$...', 'supplier', 'Equipamientos Pro S.A.', NOW()),
('supplier_test_003', 'supplier3@test.com', '$2b$10$...', 'supplier', 'IT Solutions S.L.', NOW())
ON CONFLICT (id) DO NOTHING;

-- 2. Insertar proyecto de prueba
INSERT INTO opening_projects (
  id, franchisee_id, name, description, status,
  planned_opening_date, store_size_sqm, store_format,
  address, fiscal_data, floor_plan_url,
  created_by, created_at, updated_at
) VALUES (
  'proj_test_001',
  'franchisee_test_001',
  'Nueva Apertura Carrefour Express Barcelona Centro',
  'Apertura de nuevo establecimiento Carrefour Express en el centro de Barcelona, zona comercial de alto tráfico.',
  'requesting_quotes',
  '2026-03-15',
  250,
  'Express',
  '{
    "street": "Calle Mayor 123",
    "city": "Barcelona",
    "province": "Barcelona",
    "postal_code": "08001",
    "country": "España"
  }',
  '{
    "company_name": "Carrefour Express BCN S.L.",
    "tax_id": "B12345678",
    "contact_name": "Juan García",
    "contact_email": "juan@franquicia.com",
    "contact_phone": "+34 600 123 456"
  }',
  'https://storage.example.com/planos/proj_test_001.pdf',
  'admin_test_001',
  NOW(),
  NOW()
);

-- 3. Insertar categorías
INSERT INTO opening_categories (
  id, project_id, name, description,
  budget_estimate, timeline_days,
  requirements, deliverables,
  status, created_at, updated_at
) VALUES 
(
  'cat_test_001',
  'proj_test_001',
  'Mobiliario Comercial',
  'Estanterías, mostradores, refrigeradores y mobiliario general del establecimiento.',
  1500000, -- €15,000
  45,
  '["Estanterías modulares de 2m de altura", "Refrigeradores de bebidas (3 unidades)", "Mostrador de caja (2 puestos)", "Mobiliario de almacén"]',
  '["Plano de distribución del mobiliario", "Certificados de calidad de equipos", "Manual de mantenimiento", "Garantía de 24 meses"]',
  'pending_quotes',
  NOW(),
  NOW()
),
(
  'cat_test_002',
  'proj_test_001',
  'Rotulación y Señalética',
  'Rótulos exteriores, señalización interna, viniles y elementos de comunicación visual.',
  500000, -- €5,000
  30,
  '["Rótulo exterior luminoso Carrefour", "Señalización de secciones", "Viniles de escaparate", "Señalización de emergencia"]',
  '["Diseño aprobado por Carrefour", "Certificado de instalación", "Manual de mantenimiento"]',
  'pending_quotes',
  NOW(),
  NOW()
),
(
  'cat_test_003',
  'proj_test_001',
  'Equipamiento IT',
  'TPVs, servidores, cableado de red y sistemas informáticos.',
  800000, -- €8,000
  30,
  '["2 TPVs táctiles con impresora", "Servidor central", "Cableado estructurado Cat 6", "Router empresarial", "Cámaras de seguridad (4 unidades)"]',
  '["Certificación de instalación", "Manuales de usuario", "Configuración completa", "Soporte técnico 12 meses"]',
  'pending_quotes',
  NOW(),
  NOW()
);

-- 4. Insertar invitaciones a proveedores
INSERT INTO opening_invitations (
  id, project_id, category_id, supplier_id,
  status, invited_at, deadline, invited_by
) VALUES 
(
  'inv_test_001',
  'proj_test_001',
  'cat_test_001',
  'supplier_test_001',
  'pending',
  NOW(),
  NOW() + INTERVAL '15 days',
  'admin_test_001'
),
(
  'inv_test_002',
  'proj_test_001',
  'cat_test_001',
  'supplier_test_002',
  'pending',
  NOW(),
  NOW() + INTERVAL '15 days',
  'admin_test_001'
),
(
  'inv_test_003',
  'proj_test_001',
  'cat_test_003',
  'supplier_test_003',
  'pending',
  NOW(),
  NOW() + INTERVAL '15 days',
  'admin_test_001'
);

-- 5. Insertar presupuestos de ejemplo
INSERT INTO opening_quotes (
  id, category_id, supplier_id,
  amount_cents, delivery_days, warranty_months,
  payment_terms, notes, quote_pdf_url,
  status, submitted_at, created_at, updated_at
) VALUES 
(
  'quote_test_001',
  'cat_test_001',
  'supplier_test_001',
  1450000, -- €14,500
  30,
  24,
  '50% anticipo, 50% a la entrega',
  'Incluye instalación y formación del personal. Transporte gratuito.',
  'https://storage.example.com/quotes/quote_test_001.pdf',
  'submitted',
  NOW(),
  NOW(),
  NOW()
),
(
  'quote_test_002',
  'cat_test_001',
  'supplier_test_002',
  1620000, -- €16,200
  25,
  36,
  '30% anticipo, 70% a 30 días',
  'Incluye garantía extendida y mantenimiento preventivo anual.',
  'https://storage.example.com/quotes/quote_test_002.pdf',
  'submitted',
  NOW(),
  NOW(),
  NOW()
);

-- 6. Actualizar estado de invitaciones
UPDATE opening_invitations 
SET status = 'quote_submitted' 
WHERE id IN ('inv_test_001', 'inv_test_002');

-- 7. Insertar log de auditoría
INSERT INTO opening_audit_logs (
  id, project_id, entity_type, entity_id,
  action, user_id, user_role,
  old_value, new_value,
  timestamp, ip_address
) VALUES 
(
  'log_test_001',
  'proj_test_001',
  'project',
  'proj_test_001',
  'created',
  'admin_test_001',
  'admin',
  NULL,
  '{"status": "draft", "name": "Nueva Apertura Carrefour Express Barcelona Centro"}',
  NOW(),
  '192.168.1.100'
),
(
  'log_test_002',
  'proj_test_001',
  'quote',
  'quote_test_001',
  'submitted',
  'supplier_test_001',
  'supplier',
  NULL,
  '{"amount_cents": 1450000, "status": "submitted"}',
  NOW(),
  '192.168.1.200'
);
```

---

## 🧪 Ejemplos de Curl para Testing

### 1. Login (obtener JWT token)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'

# Respuesta esperada:
# {
#   "success": true,
#   "data": {
#     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#     "user": {
#       "id": "admin_test_001",
#       "email": "admin@test.com",
#       "role": "admin",
#       "name": "Admin Test"
#     }
#   }
# }
```

### 2. Listar proyectos (Admin)

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET "http://localhost:3000/api/admin/openings/projects?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### 3. Crear nuevo proyecto

```bash
curl -X POST http://localhost:3000/api/admin/openings/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "franchisee_id": "franchisee_test_001",
    "name": "Carrefour Market Madrid Sur",
    "planned_opening_date": "2026-09-01",
    "store_size_sqm": 600,
    "store_format": "Market",
    "address": {
      "street": "Avenida de Andalucía 789",
      "city": "Madrid",
      "province": "Madrid",
      "postal_code": "28021",
      "country": "España"
    },
    "fiscal_data": {
      "company_name": "Carrefour Market Madrid S.L.",
      "tax_id": "B98765432",
      "contact_name": "María López",
      "contact_email": "maria@franquicia.com",
      "contact_phone": "+34 600 987 654"
    }
  }'
```

### 4. Obtener detalle de proyecto

```bash
curl -X GET http://localhost:3000/api/admin/openings/projects/proj_test_001 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### 5. Crear categoría para proyecto

```bash
curl -X POST http://localhost:3000/api/admin/openings/projects/proj_test_001/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Obra Civil",
    "description": "Reformas estructurales, fontanería, electricidad",
    "budget_estimate": 2500000,
    "timeline_days": 60,
    "requirements": [
      "Reforma de baños según normativa",
      "Instalación eléctrica certificada",
      "Pintura completa del establecimiento"
    ],
    "deliverables": [
      "Certificado de obra",
      "Boletín eléctrico",
      "Licencia de actividad"
    ]
  }'
```

### 6. Invitar proveedores a categoría

```bash
curl -X POST http://localhost:3000/api/admin/openings/categories/cat_test_001/invite \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_ids": [
      "supplier_test_001",
      "supplier_test_002"
    ],
    "deadline": "2026-02-15T23:59:59Z"
  }'
```

### 7. Listar mis invitaciones (Proveedor)

```bash
# Login como proveedor
TOKEN_SUPPLIER="..."

curl -X GET http://localhost:3000/api/supplier/openings/invitations \
  -H "Authorization: Bearer $TOKEN_SUPPLIER" \
  -H "Content-Type: application/json"
```

### 8. Enviar presupuesto (Proveedor)

```bash
curl -X POST http://localhost:3000/api/supplier/openings/categories/cat_test_001/quote \
  -H "Authorization: Bearer $TOKEN_SUPPLIER" \
  -F "amount_cents=1450000" \
  -F "delivery_days=30" \
  -F "warranty_months=24" \
  -F "payment_terms=50% anticipo, 50% a la entrega" \
  -F "notes=Incluye instalación y formación" \
  -F "quote_pdf=@/path/to/presupuesto.pdf"
```

### 9. Comparar presupuestos (Franquiciado)

```bash
# Login como franquiciado
TOKEN_FRANCHISEE="..."

curl -X GET http://localhost:3000/api/franchisee/openings/categories/cat_test_001/compare \
  -H "Authorization: Bearer $TOKEN_FRANCHISEE" \
  -H "Content-Type: application/json"
```

### 10. Adjudicar presupuesto (Franquiciado)

```bash
curl -X POST http://localhost:3000/api/franchisee/openings/quotes/quote_test_001/award \
  -H "Authorization: Bearer $TOKEN_FRANCHISEE" \
  -H "Content-Type: application/json"
```

### 11. Firmar contrato (Franquiciado)

```bash
curl -X POST http://localhost:3000/api/franchisee/openings/quotes/quote_test_001/sign \
  -H "Authorization: Bearer $TOKEN_FRANCHISEE" \
  -H "Content-Type: application/json" \
  -d '{
    "signature_data": "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "document_hash": "a3f5d8c9e2b1f4a6d7e8c9b2a1f5d8c..."
  }'
```

### 12. Solicitar financiación (Franquiciado)

```bash
curl -X POST http://localhost:3000/api/franchisee/openings/projects/proj_test_001/financing \
  -H "Authorization: Bearer $TOKEN_FRANCHISEE" \
  -H "Content-Type: application/json" \
  -d '{
    "requested_amount_cents": 5000000,
    "justification": "Necesario para cubrir inversión inicial de equipamiento IT y mobiliario comercial."
  }'
```

### 13. Revisar financiación (Admin - Carrefour Finanzas)

```bash
curl -X POST http://localhost:3000/api/admin/openings/financing/fin_test_001/review \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "approved": true,
    "notes": "Aprobado según política de financiación. Tasa: 5% anual, plazo: 36 meses."
  }'
```

### 14. Obtener logs de auditoría (Admin)

```bash
curl -X GET http://localhost:3000/api/admin/openings/projects/proj_test_001/audit-logs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### 15. Subir plano del local (Admin)

```bash
curl -X POST http://localhost:3000/api/admin/openings/projects/proj_test_001/floor-plan \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/plano_local.pdf"
```

---

## 📊 Queries SQL Útiles

### Proyectos con más presupuestos recibidos:

```sql
SELECT 
  p.id,
  p.name,
  p.status,
  COUNT(DISTINCT q.id) as total_quotes,
  SUM(c.budget_estimate) as total_estimated_budget
FROM opening_projects p
LEFT JOIN opening_categories c ON c.project_id = p.id
LEFT JOIN opening_quotes q ON q.category_id = c.id
GROUP BY p.id, p.name, p.status
ORDER BY total_quotes DESC;
```

### Proveedores más activos:

```sql
SELECT 
  u.id,
  u.name,
  COUNT(DISTINCT i.id) as total_invitations,
  COUNT(DISTINCT q.id) as total_quotes,
  COUNT(CASE WHEN q.status = 'awarded' THEN 1 END) as awarded_quotes,
  AVG(q.amount_cents) as avg_quote_amount
FROM users u
LEFT JOIN opening_invitations i ON i.supplier_id = u.id
LEFT JOIN opening_quotes q ON q.supplier_id = u.id
WHERE u.role = 'supplier'
GROUP BY u.id, u.name
ORDER BY awarded_quotes DESC, total_quotes DESC;
```

### Presupuestos pendientes de revisar por franquiciado:

```sql
SELECT 
  p.id as project_id,
  p.name as project_name,
  p.franchisee_id,
  c.id as category_id,
  c.name as category_name,
  COUNT(q.id) as quotes_count,
  MIN(q.amount_cents) as lowest_quote,
  MAX(q.amount_cents) as highest_quote
FROM opening_projects p
JOIN opening_categories c ON c.project_id = p.id
JOIN opening_quotes q ON q.category_id = c.id
WHERE p.status IN ('quotes_received', 'pending_selection')
  AND q.status = 'submitted'
GROUP BY p.id, p.name, p.franchisee_id, c.id, c.name
HAVING COUNT(q.id) > 0;
```

### Invitaciones próximas a vencer:

```sql
SELECT 
  i.id,
  i.deadline,
  p.name as project_name,
  c.name as category_name,
  u.name as supplier_name,
  u.email as supplier_email,
  EXTRACT(DAY FROM (i.deadline - NOW())) as days_remaining
FROM opening_invitations i
JOIN opening_projects p ON p.id = i.project_id
JOIN opening_categories c ON c.id = i.category_id
JOIN users u ON u.id = i.supplier_id
WHERE i.status = 'pending'
  AND i.deadline > NOW()
  AND i.deadline < NOW() + INTERVAL '3 days'
ORDER BY i.deadline ASC;
```

### Histórico de cambios de un proyecto:

```sql
SELECT 
  l.id,
  l.entity_type,
  l.action,
  u.name as user_name,
  u.email as user_email,
  l.user_role,
  l.old_value,
  l.new_value,
  l.timestamp
FROM opening_audit_logs l
LEFT JOIN users u ON u.id = l.user_id
WHERE l.project_id = 'proj_test_001'
ORDER BY l.timestamp DESC;
```

---

## 🔄 Triggers Recomendados

### Trigger: Actualizar `updated_at` automáticamente

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_opening_projects_updated_at 
  BEFORE UPDATE ON opening_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opening_categories_updated_at 
  BEFORE UPDATE ON opening_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opening_quotes_updated_at 
  BEFORE UPDATE ON opening_quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opening_financial_updated_at 
  BEFORE UPDATE ON opening_financial_approvals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Trigger: Registro automático en audit log

```sql
CREATE OR REPLACE FUNCTION log_project_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO opening_audit_logs (
      id,
      project_id,
      entity_type,
      entity_id,
      action,
      user_id,
      old_value,
      new_value,
      timestamp
    ) VALUES (
      'log_' || gen_random_uuid(),
      NEW.id,
      'project',
      NEW.id,
      'updated',
      NEW.updated_by, -- Asume que existe columna updated_by
      row_to_json(OLD),
      row_to_json(NEW),
      NOW()
    );
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO opening_audit_logs (
      id,
      project_id,
      entity_type,
      entity_id,
      action,
      user_id,
      new_value,
      timestamp
    ) VALUES (
      'log_' || gen_random_uuid(),
      NEW.id,
      'project',
      NEW.id,
      'created',
      NEW.created_by,
      row_to_json(NEW),
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_opening_projects 
  AFTER INSERT OR UPDATE ON opening_projects
  FOR EACH ROW EXECUTE FUNCTION log_project_changes();
```

---

## 🎯 Endpoints Prioritarios (Roadmap de Implementación)

### Fase 1: CRUD Básico (Semana 1)
1. ✅ `POST /api/admin/openings/projects` - Crear proyecto
2. ✅ `GET /api/admin/openings/projects` - Listar proyectos
3. ✅ `GET /api/admin/openings/projects/:id` - Detalle proyecto
4. ✅ `PUT /api/admin/openings/projects/:id` - Actualizar proyecto
5. ✅ `POST /api/admin/openings/projects/:id/floor-plan` - Subir plano

### Fase 2: Categorías e Invitaciones (Semana 2)
6. ✅ `POST /api/admin/openings/projects/:id/categories` - Crear categoría
7. ✅ `GET /api/admin/openings/projects/:id/categories` - Listar categorías
8. ✅ `POST /api/admin/openings/categories/:id/invite` - Invitar proveedores
9. ✅ `GET /api/supplier/openings/invitations` - Mis invitaciones

### Fase 3: Presupuestos (Semana 3)
10. ✅ `POST /api/supplier/openings/categories/:id/quote` - Enviar presupuesto
11. ✅ `GET /api/franchisee/openings/categories/:id/compare` - Comparar presupuestos
12. ✅ `POST /api/franchisee/openings/quotes/:id/award` - Adjudicar

### Fase 4: Firmas y Financiación (Semana 4)
13. ✅ `POST /api/franchisee/openings/quotes/:id/sign` - Firmar
14. ✅ `POST /api/franchisee/openings/projects/:id/financing` - Solicitar financiación
15. ✅ `POST /api/admin/openings/financing/:id/review` - Revisar financiación
16. ✅ `GET /api/admin/openings/projects/:id/audit-logs` - Logs de auditoría

---

## 📞 Soporte

Para dudas técnicas:
- **Documentación completa:** `docs/technical/NEW_STORE_OPENINGS_SPEC.md`
- **Guía de testing:** `TESTING_GUIDE_OPENINGS.md`
- **Mock data reference:** `src/lib/api/openings-mock.ts`

---

**¡Toda la información técnica necesaria para implementar el backend! 🚀**
