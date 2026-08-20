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

## 📊 Estados del Proyecto y Workflow

### Estados Principales del Proyecto

El proyecto pasa por estos estados en orden:

| Estado | Descripción | Quién puede cambiar | Condiciones |
|--------|-------------|---------------------|-------------|
| `draft` | Borrador inicial, sin categorías | Admin | Proyecto creado |
| `preparing_documentation` | Añadiendo categorías y documentos | Admin | Al menos 1 categoría creada |
| `requesting_quotes` | Invitando proveedores | Admin | Proveedores invitados |
| `quotes_received` | Proveedores enviando presupuestos | Sistema (automático) | Al menos 1 quote recibido |
| `pending_selection` | Franquiciado comparando ofertas | Sistema | Todas las categorías tienen quotes |
| `awarded` | Presupuestos adjudicados | Franquiciado | Todas las categorías tienen quote awarded |
| `pending_signature` | Esperando firma digital | Sistema | Al menos 1 quote adjudicado |
| `signed` | Firmado, esperando financiación | Franquiciado | Todos los quotes awarded firmados |
| `pending_financing` | Financiación solicitada | Franquiciado | Solicitud de financiación creada |
| `financing_approved` | Financiación aprobada | Admin (Finanzas) | Aprobación de financiación |
| `financing_rejected` | Financiación rechazada | Admin (Finanzas) | Rechazo de financiación |
| `in_execution` | Proyecto en ejecución | Admin | Inicio manual de ejecución |
| `completed` | Completado | Admin | Finalización manual |
| `cancelled` | Cancelado | Admin | Cancelación manual |

### Estados de Categoría

| Estado | Descripción | Transición |
|--------|-------------|------------|
| `pending_quotes` | Esperando presupuestos | Cuando se crea la categoría |
| `quotes_received` | Presupuestos recibidos | Cuando se recibe el primer quote |
| `comparing` | En comparación | Cuando el franquiciado accede a comparar |
| `awarded` | Presupuesto seleccionado | Cuando se adjudica un quote |
| `signed` | Contrato firmado | Cuando el quote se firma |

### Estados de Presupuesto (Quote)

| Estado | Descripción | Puede cambiar a |
|--------|-------------|-----------------|
| `draft` | Borrador guardado | `submitted`, `draft` (actualizar) |
| `submitted` | Enviado al franquiciado | `awarded`, `rejected` |
| `awarded` | Seleccionado como ganador | `signed` |
| `rejected` | No seleccionado | - (final) |
| `signed` | Firmado digitalmente | - (final) |

### Estados de Invitación

| Estado | Descripción |
|--------|-------------|
| `pending` | Invitación enviada, esperando respuesta |
| `quote_submitted` | Proveedor ha enviado presupuesto |
| `awarded` | Presupuesto del proveedor fue seleccionado |
| `rejected` | Presupuesto no seleccionado |

### Diagrama de Flujo de Estados

```
PROYECTO:
draft
  ↓ (admin crea categoría)
preparing_documentation
  ↓ (admin invita proveedores)
requesting_quotes
  ↓ (proveedor envía primer quote)
quotes_received
  ↓ (todas las categorías tienen quotes)
pending_selection
  ↓ (franquiciado adjudica todos los quotes)
awarded
  ↓ (automático)
pending_signature
  ↓ (franquiciado firma todos)
signed
  ↓ (si requiere financiación)
pending_financing
  ↓ (admin finanzas aprueba/rechaza)
financing_approved / financing_rejected
  ↓ (admin inicia ejecución)
in_execution
  ↓ (admin completa)
completed
```

### Transiciones Automáticas (Backend)

El backend debe implementar estas transiciones automáticas:

#### 1. **draft → preparing_documentation**
```javascript
// Cuando se crea la primera categoría
async function createCategory(projectId, categoryData) {
  const category = await db.categories.create(categoryData);
  
  const project = await db.projects.findUnique({ where: { id: projectId } });
  
  if (project.status === 'draft') {
    await db.projects.update({
      where: { id: projectId },
      data: { status: 'preparing_documentation' }
    });
  }
  
  return category;
}
```

#### 2. **preparing_documentation → requesting_quotes**
```javascript
// Cuando se invita al primer proveedor
async function inviteSuppliers(categoryId, supplierIds, deadline) {
  const invitations = await db.invitations.createMany({
    data: supplierIds.map(supplierId => ({
      category_id: categoryId,
      supplier_id: supplierId,
      deadline,
      status: 'pending'
    }))
  });
  
  const category = await db.categories.findUnique({ where: { id: categoryId } });
  const project = await db.projects.findUnique({ where: { id: category.project_id } });
  
  if (project.status === 'preparing_documentation') {
    await db.projects.update({
      where: { id: project.id },
      data: { status: 'requesting_quotes' }
    });
  }
  
  return invitations;
}
```

#### 3. **requesting_quotes → quotes_received**
```javascript
// Cuando se recibe el primer presupuesto
async function createQuote(categoryId, quoteData) {
  const quote = await db.quotes.create(quoteData);
  
  // Actualizar estado de la categoría
  await db.categories.update({
    where: { id: categoryId },
    data: { status: 'quotes_received' }
  });
  
  // Actualizar proyecto si no estaba en quotes_received
  const category = await db.categories.findUnique({ where: { id: categoryId } });
  const project = await db.projects.findUnique({ where: { id: category.project_id } });
  
  if (project.status === 'requesting_quotes') {
    await db.projects.update({
      where: { id: project.id },
      data: { status: 'quotes_received' }
    });
  }
  
  return quote;
}
```

#### 4. **quotes_received → pending_selection**
```javascript
// Cuando TODAS las categorías tienen al menos 1 presupuesto
async function checkIfReadyForSelection(projectId) {
  const categories = await db.categories.findMany({
    where: { project_id: projectId },
    include: {
      quotes: { where: { status: 'submitted' } }
    }
  });
  
  const allCategoriesHaveQuotes = categories.every(cat => cat.quotes.length > 0);
  
  if (allCategoriesHaveQuotes) {
    await db.projects.update({
      where: { id: projectId },
      data: { status: 'pending_selection' }
    });
  }
}

// Llamar esta función cada vez que se crea/actualiza un quote
```

#### 5. **pending_selection → awarded**
```javascript
// Cuando TODAS las categorías tienen un quote adjudicado
async function awardQuote(quoteId) {
  // Adjudicar el quote
  await db.quotes.update({
    where: { id: quoteId },
    data: { 
      status: 'awarded',
      awarded_at: new Date()
    }
  });
  
  // Rechazar otros quotes de la misma categoría
  const quote = await db.quotes.findUnique({ where: { id: quoteId } });
  await db.quotes.updateMany({
    where: {
      category_id: quote.category_id,
      id: { not: quoteId },
      status: 'submitted'
    },
    data: { status: 'rejected' }
  });
  
  // Actualizar categoría
  await db.categories.update({
    where: { id: quote.category_id },
    data: { status: 'awarded' }
  });
  
  // Verificar si TODAS las categorías están awarded
  const categories = await db.categories.findMany({
    where: { project_id: quote.project_id }
  });
  
  const allCategoriesAwarded = categories.every(cat => cat.status === 'awarded');
  
  if (allCategoriesAwarded) {
    await db.projects.update({
      where: { id: quote.project_id },
      data: { status: 'awarded' }
    });
    
    // Transición automática a pending_signature
    await db.projects.update({
      where: { id: quote.project_id },
      data: { status: 'pending_signature' }
    });
  }
}
```

#### 6. **pending_signature → signed**
```javascript
// Cuando TODOS los quotes awarded están firmados
async function signQuote(quoteId, signatureData) {
  const signature = await db.signatures.create({
    data: {
      quote_id: quoteId,
      franchisee_id: signatureData.franchisee_id,
      signature_data: signatureData.signature_data,
      document_hash: signatureData.document_hash,
      signed_at: new Date()
    }
  });
  
  // Actualizar quote
  await db.quotes.update({
    where: { id: quoteId },
    data: { status: 'signed' }
  });
  
  // Verificar si todos los quotes awarded están firmados
  const quote = await db.quotes.findUnique({ where: { id: quoteId } });
  const awardedQuotes = await db.quotes.findMany({
    where: {
      project_id: quote.project_id,
      status: { in: ['awarded', 'signed'] }
    },
    include: { signature: true }
  });
  
  const allSigned = awardedQuotes.every(q => q.signature !== null);
  
  if (allSigned) {
    await db.projects.update({
      where: { id: quote.project_id },
      data: { status: 'signed' }
    });
  }
  
  return signature;
}
```

### Validaciones de Transición

El backend debe validar que las transiciones son válidas:

```javascript
const ALLOWED_TRANSITIONS = {
  'draft': ['preparing_documentation', 'cancelled'],
  'preparing_documentation': ['requesting_quotes', 'cancelled'],
  'requesting_quotes': ['quotes_received', 'cancelled'],
  'quotes_received': ['pending_selection', 'cancelled'],
  'pending_selection': ['awarded', 'cancelled'],
  'awarded': ['pending_signature', 'cancelled'],
  'pending_signature': ['signed', 'cancelled'],
  'signed': ['pending_financing', 'in_execution', 'cancelled'],
  'pending_financing': ['financing_approved', 'financing_rejected', 'cancelled'],
  'financing_approved': ['in_execution', 'cancelled'],
  'financing_rejected': ['signed', 'cancelled'], // Volver a renegociar
  'in_execution': ['completed', 'cancelled'],
  'completed': [], // Estado final
  'cancelled': []  // Estado final
};

async function updateProjectStatus(projectId, newStatus) {
  const project = await db.projects.findUnique({ where: { id: projectId } });
  
  const allowedTransitions = ALLOWED_TRANSITIONS[project.status];
  
  if (!allowedTransitions.includes(newStatus)) {
    throw new Error(
      `Transición inválida: ${project.status} → ${newStatus}`
    );
  }
  
  await db.projects.update({
    where: { id: projectId },
    data: { 
      status: newStatus,
      updated_at: new Date()
    }
  });
  
  // Registrar en audit log
  await logAuditEvent(projectId, 'project', 'status_changed', {
    old_status: project.status,
    new_status: newStatus
  });
}
```

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

---

### 📄 Documentos y Planos Técnicos

#### `POST /api/admin/openings/projects/:id/documents`
Subir documento/plano técnico al proyecto (multipart/form-data).

**Body (FormData):**
- `file` - Archivo PDF (requerido)
- `category` - Categoría del documento (requerido)
- `subcategory` - Subcategoría opcional (string, puede ser null)
- `name` - Nombre descriptivo del documento (requerido)
- `description` - Descripción detallada (opcional)

**Categorías permitidas:**
- `equipamientos` - Planos de equipamiento comercial
- `obras_iluminacion` - Planos de iluminación
- `obras_clima` - Planos de climatización
- `obras_electricidad` - Planos eléctricos
- `obras_general` - Planos generales de obra
- `otros` - Otros documentos técnicos

**Ejemplo de request (curl):**
```bash
curl -X POST http://localhost:3000/api/admin/openings/projects/proj_001/documents \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/plano_iluminacion.pdf" \
  -F "category=obras_iluminacion" \
  -F "subcategory=circuitos" \
  -F "name=Esquema Circuitos Principales" \
  -F "description=Plano detallado de circuitos de iluminación de la zona comercial"
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "doc_001",
    "project_id": "proj_001",
    "category": "obras_iluminacion",
    "subcategory": "circuitos",
    "name": "Esquema Circuitos Principales",
    "description": "Plano detallado de circuitos de iluminación de la zona comercial",
    "file_url": "https://storage.com/docs/obras_iluminacion_proj_001_1234567890.pdf",
    "file_size_bytes": 3145728,
    "uploaded_by": "admin_user_id",
    "uploaded_at": "2026-01-15T11:00:00Z"
  },
  "message": "Documento subido exitosamente"
}
```

**Validaciones:**
- Categoría debe ser una de las permitidas
- Archivo debe ser PDF
- Tamaño máximo 15 MB
- Usuario debe ser admin
- Proyecto debe existir

#### `GET /api/admin/openings/projects/:id/documents`
Listar todos los documentos de un proyecto.

**Query params:**
- `category` - Filtrar por categoría (opcional)
- `subcategory` - Filtrar por subcategoría (opcional)

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "project_id": "proj_001",
    "documents": [
      {
        "id": "doc_001",
        "category": "equipamientos",
        "subcategory": null,
        "name": "Layout Mobiliario Principal",
        "description": "Distribución de estanterías y mostradores",
        "file_url": "https://storage.com/docs/equipamientos_proj_001_123456.pdf",
        "file_size_bytes": 2458624,
        "uploaded_by": "admin_user_id",
        "uploaded_at": "2026-01-15T10:30:00Z"
      },
      {
        "id": "doc_002",
        "category": "obras_iluminacion",
        "subcategory": "circuitos",
        "name": "Esquema Circuitos Iluminación",
        "description": "Plano detallado de circuitos y luminarias",
        "file_url": "https://storage.com/docs/obras_iluminacion_proj_001_123457.pdf",
        "file_size_bytes": 3145728,
        "uploaded_by": "admin_user_id",
        "uploaded_at": "2026-01-15T11:00:00Z"
      }
    ],
    "total_documents": 2,
    "categories": {
      "equipamientos": 1,
      "obras_iluminacion": 1
    }
  }
}
```

#### `GET /api/admin/openings/projects/:id/documents/:documentId`
Obtener URL firmada para descargar un documento específico.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "doc_001",
    "name": "Layout Mobiliario Principal",
    "category": "equipamientos",
    "download_url": "https://storage.com/docs/equipamientos_proj_001_123456.pdf?signature=...",
    "expires_at": "2026-01-15T12:00:00Z"
  }
}
```

#### `DELETE /api/admin/openings/projects/:id/documents/:documentId`
Eliminar un documento del proyecto.

**Respuesta:**
```json
{
  "success": true,
  "message": "Documento eliminado exitosamente"
}
```

**Validaciones:**
- Solo admin puede eliminar
- Documento debe existir
- Se elimina archivo del storage (S3) y registro de BD

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

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "quote_001",
      "supplier_id": "supplier_abc",
      "amount_cents": 1450000,
      "status": "submitted",
      "submitted_at": "2026-01-20T15:30:00Z"
    }
  ]
}
```

#### `GET /api/supplier/openings/invitations/:invitationId/quote`
Obtener el presupuesto existente del proveedor para una invitación específica.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "quote_001",
    "category_id": "cat_001",
    "amount_cents": 1450000,
    "delivery_days": 30,
    "warranty_months": 24,
    "payment_terms": "50% anticipo, 50% a la entrega",
    "notes": "Incluye instalación y formación",
    "pdf_url": "https://storage.com/quotes/quote_001.pdf",
    "status": "draft"
  }
}
```

#### `POST /api/supplier/openings/categories/:categoryId/quote`
Crear un nuevo presupuesto para una categoría (multipart/form-data).

**Body (FormData):**
```
amount_cents: 1450000
delivery_days: 30
warranty_months: 24
payment_terms: "50% anticipo, 50% a la entrega"
notes: "Incluye instalación y formación"
status: "draft" | "submitted"
file: [archivo PDF] (opcional en desarrollo, requerido en producción)
```

**Validaciones:**
- `amount_cents`: Requerido, > 0, máximo 1,000,000,000 (€10M)
- `delivery_days`: Opcional, 1-365
- `warranty_months`: Opcional, 0-120
- `payment_terms`: Opcional, máximo 500 caracteres
- `notes`: Opcional, máximo 1000 caracteres
- `file`: Archivo PDF, máximo 10MB, solo formato PDF
- `status`: "draft" para guardar borrador, "submitted" para enviar final

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "quote_001",
    "category_id": "cat_001",
    "amount_cents": 1450000,
    "pdf_url": "https://storage.com/quotes/quote_001.pdf",
    "status": "draft",
    "created_at": "2026-01-20T15:30:00Z"
  },
  "message": "Borrador guardado" | "Presupuesto enviado correctamente"
}
```

**Errores posibles:**
```json
{
  "success": false,
  "error": "El archivo PDF es requerido"  // Solo en modo producción
}
```

```json
{
  "success": false,
  "error": "El archivo debe ser PDF y no superar 10MB"
}
```

#### `PUT /api/supplier/openings/quotes/:quoteId`
Actualizar un presupuesto existente (solo borradores o antes de deadline).

**Body (FormData):**
```
amount_cents: 1550000
delivery_days: 25
warranty_months: 36
payment_terms: "100% a la entrega"
notes: "Oferta actualizada con mejor garantía"
status: "draft" | "submitted"
file: [nuevo archivo PDF] (opcional - solo si se quiere reemplazar)
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "quote_001",
    "amount_cents": 1550000,
    "pdf_url": "https://storage.com/quotes/quote_001_v2.pdf",
    "status": "submitted",
    "updated_at": "2026-01-21T10:00:00Z"
  },
  "message": "Presupuesto actualizado"
}
```

**Validaciones del backend:**
- No se puede actualizar si `status === 'awarded'`
- No se puede actualizar si `status === 'rejected'`
- No se puede actualizar después del `deadline` de la invitación
- El proveedor solo puede actualizar sus propios presupuestos

#### `GET /api/franchisee/openings/categories/:categoryId/compare`
Comparar presupuestos de una categoría (solo franquiciado del proyecto).

**Descripción:**
Este endpoint permite al franquiciado ver todos los presupuestos recibidos para una categoría específica de su proyecto. La respuesta incluye información completa de cada proveedor para facilitar la comparación.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "category_id": "cat_001",
    "category_name": "Mobiliario Comercial",
    "category_description": "Estanterías, mostradores, refrigeradores...",
    "budget_estimate": 1500000,
    "quotes": [
      {
        "id": "quote_001",
        "supplier": {
          "id": "supplier_abc",
          "name": "Mobiliario Comercial S.L.",
          "email": "contacto@mobiliario.com",
          "phone": "+34 600 111 222"
        },
        "amount_cents": 1450000,
        "delivery_days": 30,
        "warranty_months": 24,
        "payment_terms": "50% anticipo, 50% a la entrega",
        "notes": "Incluye instalación y formación del personal",
        "pdf_url": "https://storage.com/quotes/quote_001.pdf",
        "status": "submitted",
        "submitted_at": "2026-01-20T15:30:00Z"
      },
      {
        "id": "quote_002",
        "supplier": {
          "id": "supplier_xyz",
          "name": "Equipamientos Pro S.A.",
          "email": "ventas@equipamientos.com",
          "phone": "+34 600 333 444"
        },
        "amount_cents": 1620000,
        "delivery_days": 25,
        "warranty_months": 36,
        "payment_terms": "30% anticipo, 70% a 30 días",
        "notes": "Garantía extendida incluida",
        "pdf_url": "https://storage.com/quotes/quote_002.pdf",
        "status": "submitted",
        "submitted_at": "2026-01-21T09:15:00Z"
      }
    ],
    "quotes_count": 2,
    "lowest_amount": 1450000,
    "highest_amount": 1620000
  }
}
```

**Validaciones del backend:**
- Solo el franquiciado propietario del proyecto puede acceder
- Solo se muestran presupuestos con `status === 'submitted'` o `status === 'awarded'`
- No se muestran borradores (`status === 'draft'`)
- Ordenados por `amount_cents` ascendente (más barato primero)

#### `POST /api/franchisee/openings/quotes/:quoteId/award`
Adjudicar presupuesto (seleccionar ganador para una categoría).

**Descripción:**
Este endpoint permite al franquiciado seleccionar el presupuesto ganador para una categoría específica. Al adjudicar un presupuesto, todos los demás presupuestos de la misma categoría se marcan automáticamente como rechazados.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "quote": {
      "id": "quote_001",
      "status": "awarded",
      "awarded_at": "2026-01-26T11:00:00Z"
    },
    "other_quotes_updated": 2
  },
  "message": "Presupuesto adjudicado exitosamente"
}
```

**Lógica del backend:**
1. Verificar que el franquiciado es propietario del proyecto
2. Verificar que el quote existe y tiene `status === 'submitted'`
3. Actualizar el quote seleccionado: `status = 'awarded'`, `awarded_at = NOW()`
4. Actualizar todos los otros quotes de la misma categoría: `status = 'rejected'`
5. Actualizar estado de la categoría: `status = 'awarded'`
6. Si todas las categorías del proyecto están `awarded`, actualizar proyecto a `awarded`
7. Registrar acción en audit log
8. Enviar notificación al proveedor ganador
9. Enviar notificación a proveedores rechazados

**Validaciones:**
- El quote debe existir
- El quote debe estar en estado `submitted`
- El usuario debe ser el franquiciado del proyecto
- No se puede adjudicar si ya hay otro quote `awarded` en la categoría

**Errores posibles:**
```json
{
  "success": false,
  "error": "Presupuesto no encontrado"
}
```

```json
{
  "success": false,
  "error": "Ya existe un presupuesto adjudicado para esta categoría"
}
```

```json
{
  "success": false,
  "error": "No tienes permiso para adjudicar este presupuesto"
}
```

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

### � Gestión de Estados del Proyecto (Workflow)

#### `PATCH /api/admin/openings/projects/:projectId/status`
Actualizar el estado del proyecto manualmente (solo Admin).

**Descripción:**
Este endpoint permite al administrador cambiar el estado del proyecto. El backend debe validar que la transición es válida según la matriz de transiciones permitidas.

**Body:**
```json
{
  "new_status": "quotes_received",
  "notes": "Primer presupuesto recibido de Mobiliario SL"
}
```

**Validación de transiciones permitidas:**
```javascript
const ALLOWED_TRANSITIONS = {
  'draft': ['preparing_documentation', 'cancelled'],
  'preparing_documentation': ['draft', 'requesting_quotes', 'cancelled'],
  'requesting_quotes': ['quotes_received', 'cancelled'],
  'quotes_received': ['pending_selection', 'requesting_quotes', 'cancelled'],
  'pending_selection': ['awarded', 'quotes_received', 'cancelled'],
  'awarded': ['pending_signature', 'cancelled'],
  'pending_signature': ['signed', 'awarded', 'cancelled'],
  'signed': ['pending_financing', 'in_execution', 'cancelled'],
  'pending_financing': ['financing_approved', 'financing_rejected', 'cancelled'],
  'financing_approved': ['in_execution', 'cancelled'],
  'financing_rejected': ['pending_financing', 'cancelled'],
  'in_execution': ['completed', 'cancelled'],
  'completed': [],
  'cancelled': []
};
```

**Lógica del backend:**
1. Verificar que el usuario es Admin
2. Obtener el proyecto y su estado actual
3. Validar que la transición `current_status → new_status` está permitida
4. Actualizar el estado del proyecto
5. Crear entrada en la tabla `opening_status_history`
6. Registrar en audit log
7. Enviar notificaciones si corresponde

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id": "proj_001",
    "status": "quotes_received",
    "updated_at": "2026-01-20T14:30:00Z"
  },
  "message": "Estado del proyecto actualizado"
}
```

**Errores posibles:**
```json
{
  "success": false,
  "error": "Transición inválida: requesting_quotes → completed"
}
```

```json
{
  "success": false,
  "error": "Solo administradores pueden cambiar el estado manualmente"
}
```

#### `GET /api/admin/openings/projects/:projectId/status-history`
Obtener el historial completo de cambios de estado del proyecto.

**Descripción:**
Devuelve todas las transiciones de estado que ha tenido el proyecto, ordenadas de más reciente a más antigua.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "project_id": "proj_001",
    "current_status": "requesting_quotes",
    "history": [
      {
        "id": "hist_003",
        "project_id": "proj_001",
        "from_status": "preparing_documentation",
        "to_status": "requesting_quotes",
        "changed_by_user_id": "admin_001",
        "changed_by_name": "Admin Sistema",
        "changed_by_role": "admin",
        "changed_at": "2026-01-18T09:15:00Z",
        "notes": "Proveedores invitados para cotización",
        "metadata": {
          "categories_count": 3,
          "invitations_sent": 8
        }
      },
      {
        "id": "hist_002",
        "project_id": "proj_001",
        "from_status": "draft",
        "to_status": "preparing_documentation",
        "changed_by_user_id": "admin_001",
        "changed_by_name": "Admin Sistema",
        "changed_by_role": "admin",
        "changed_at": "2026-01-16T14:30:00Z",
        "notes": "Primera categoría añadida"
      },
      {
        "id": "hist_001",
        "project_id": "proj_001",
        "from_status": null,
        "to_status": "draft",
        "changed_by_user_id": "admin_001",
        "changed_by_name": "Admin Sistema",
        "changed_by_role": "admin",
        "changed_at": "2026-01-15T10:00:00Z",
        "notes": "Proyecto creado"
      }
    ]
  }
}
```

**Notas de implementación:**
- `from_status` es `null` para el primer estado (creación del proyecto)
- `changed_by_role` puede ser: `admin`, `franchisee`, o `system` (para cambios automáticos)
- `metadata` es un objeto JSON opcional con información adicional del cambio
- Ordenar por `changed_at DESC` (más reciente primero)

---

### �📝 Auditoría

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

## 📦 Almacenamiento de Archivos y Upload de Documentos

### Tipos de Archivos en el Sistema

#### 1. **Planos Técnicos del Proyecto (Multiple Floor Plans)**

El sistema soporta **múltiples planos categorizados** por tipo de trabajo:

**Categorías de Planos:**

| Categoría | Código | Descripción | Ejemplos |
|-----------|--------|-------------|----------|
| **Equipamientos** | `equipamientos` | Planos de distribución y equipamiento comercial | Layout de estanterías, mostradores, refrigeradores |
| **Obras - Iluminación** | `obras_iluminacion` | Planos del sistema de iluminación | Esquema lumínico, tipos de luminarias, circuitos |
| **Obras - Clima** | `obras_clima` | Planos de climatización y ventilación | HVAC, aire acondicionado, extractores |
| **Obras - Electricidad** | `obras_electricidad` | Planos eléctricos y cableado | Cuadros eléctricos, tomas, circuitos |
| **Obras - General** | `obras_general` | Planos generales de construcción | Planta, alzados, secciones, reformas estructurales |
| **Otros** | `otros` | Otros documentos técnicos | Licencias, permisos, certificaciones |

**Especificaciones técnicas:**
- **Formato:** Solo PDF
- **Tamaño máximo:** 15 MB por archivo
- **Múltiples archivos:** Permitido (un proyecto puede tener varios planos de cada categoría)
- **Subido por:** Administrador
- **Endpoints:** 
  - `POST /api/admin/openings/projects/:id/documents` - Subir nuevo documento/plano
  - `GET /api/admin/openings/projects/:id/documents` - Listar todos los documentos
  - `GET /api/admin/openings/projects/:id/documents?category=obras_iluminacion` - Filtrar por categoría
  - `DELETE /api/admin/openings/projects/:id/documents/:documentId` - Eliminar documento
- **Acceso:** Franquiciado y proveedores invitados pueden descargar todos los planos
- **Nombre de archivo:** `[category]_[project_id]_[timestamp].pdf`

**Ejemplo de estructura de un proyecto:**
```javascript
{
  "project_id": "proj_001",
  "documents": [
    {
      "id": "doc_001",
      "category": "equipamientos",
      "subcategory": null,
      "name": "Layout Mobiliario Principal",
      "description": "Distribución de estanterías y mostradores",
      "file_url": "https://storage.com/docs/equipamientos_proj_001_123456.pdf",
      "file_size_bytes": 2458624,
      "uploaded_by": "admin_user_id",
      "uploaded_at": "2026-01-15T10:30:00Z"
    },
    {
      "id": "doc_002",
      "category": "obras_iluminacion",
      "subcategory": "circuitos",
      "name": "Esquema Circuitos Iluminación",
      "description": "Plano detallado de circuitos y luminarias",
      "file_url": "https://storage.com/docs/obras_iluminacion_proj_001_123457.pdf",
      "file_size_bytes": 3145728,
      "uploaded_by": "admin_user_id",
      "uploaded_at": "2026-01-15T11:00:00Z"
    },
    {
      "id": "doc_003",
      "category": "obras_clima",
      "subcategory": "hvac",
      "name": "Sistema HVAC",
      "description": "Distribución de conductos y equipos de climatización",
      "file_url": "https://storage.com/docs/obras_clima_proj_001_123458.pdf",
      "file_size_bytes": 4194304,
      "uploaded_by": "admin_user_id",
      "uploaded_at": "2026-01-15T11:30:00Z"
    }
  ]
}
```

#### 2. **Presupuestos de Proveedores (Quote PDFs)**
- **Formato:** Solo PDF
- **Tamaño máximo:** 10 MB
- **Subido por:** Proveedor
- **Endpoint:** `POST /api/supplier/openings/categories/:id/quote` (multipart/form-data)
- **Requerido:** OPCIONAL en desarrollo/testing, REQUERIDO en producción
- **Acceso:** El proveedor que lo subió y el franquiciado del proyecto
- **Nombre de archivo:** `quote_[category_id]_[supplier_id]_[timestamp].pdf`
- **Actualización:** Se puede reemplazar subiendo nuevo PDF en `PUT /api/supplier/openings/quotes/:id`

### Validaciones de Archivos

**Validaciones del Backend (OBLIGATORIAS):**

```javascript
// Para documentos de proyecto (planos técnicos)
function validateProjectDocument(file, category, subcategory) {
  // Validación de tipo MIME
  const allowedMimeTypes = ['application/pdf'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return {
      valid: false,
      error: 'Solo se permiten archivos PDF'
    };
  }

  // Validación de tamaño (15 MB para documentos de proyecto)
  const maxSizeBytes = 15 * 1024 * 1024; // 15 MB
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: 'El archivo no debe superar los 15MB'
    };
  }

  // Validación de categoría
  const validCategories = [
    'equipamientos',
    'obras_iluminacion',
    'obras_clima',
    'obras_electricidad',
    'obras_general',
    'otros'
  ];
  
  if (!validCategories.includes(category)) {
    return {
      valid: false,
      error: `Categoría inválida. Debe ser una de: ${validCategories.join(', ')}`
    };
  }

  // Validación de nombre de archivo (seguridad)
  const filename = file.originalname;
  if (!/^[a-zA-Z0-9_\-\. ]+$/.test(filename)) {
    return {
      valid: false,
      error: 'Nombre de archivo inválido. Solo se permiten letras, números, guiones y puntos'
    };
  }

  return { valid: true };
}

// Para presupuestos de proveedores
function validateQuotePDF(file) {
  // Validación de tipo MIME
  const allowedMimeTypes = ['application/pdf'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return res.status(400).json({
      success: false,
      error: 'Solo se permiten archivos PDF'
    });
  }

  // Validación de tamaño (10 MB para quotes)
  const maxSizeBytes = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSizeBytes) {
    return res.status(400).json({
      success: false,
      error: 'El archivo no debe superar los 10MB'
    });
  }

  // Validación de nombre de archivo (seguridad)
  const filename = file.originalname;
  if (!/^[a-zA-Z0-9_\-\. ]+$/.test(filename)) {
    return res.status(400).json({
      success: false,
      error: 'Nombre de archivo inválido'
    });
  }
}
```

**Ejemplo de uso en endpoint:**
```javascript
app.post('/api/admin/openings/projects/:id/documents', upload.single('file'), async (req, res) => {
  const { category, subcategory, name, description } = req.body;
  const file = req.file;

  // Validar archivo y categoría
  const validation = validateProjectDocument(file, category, subcategory);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: validation.error
    });
  }

  // Proceder con el upload...
});
```

**Validaciones del Frontend (recomendadas):**
```javascript
// Componente para subir documentos de proyecto
const handleDocumentUpload = (e) => {
  const file = e.target.files?.[0];
  
  // Validar tipo
  if (file.type !== 'application/pdf') {
    setError('Solo se permiten archivos PDF');
    return;
  }
  
  // Validar tamaño (15MB para documentos de proyecto)
  const maxSize = 15 * 1024 * 1024;
  if (file.size > maxSize) {
    setError('El archivo no debe superar los 15MB');
    return;
  }
  
  setDocumentFile(file);
};

// Componente para presupuestos (QuoteForm.tsx ya implementado)
const handleQuotePDFUpload = (e) => {
  const file = e.target.files?.[0];
  
  // Validar tipo
  if (file.type !== 'application/pdf') {
    setFileError('Solo se permiten archivos PDF');
    return;
  }
  
  // Validar tamaño (10MB para quotes)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    setFileError('El archivo no debe superar los 10MB');
    return;
  }
  
  setPdfFile(file);
};
```

### Almacenamiento Recomendado

**Opción 1: AWS S3 (Producción)**
```javascript
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'eu-west-1'
});

async function uploadQuotePDF(file, categoryId, supplierId) {
  const filename = `quote_${categoryId}_${supplierId}_${Date.now()}.pdf`;
  
  const params = {
    Bucket: 'carrefour-openings-quotes',
    Key: `quotes/${filename}`,
    Body: file.buffer,
    ContentType: 'application/pdf',
    ACL: 'private' // Importante: no público
  };
  
  const result = await s3.upload(params).promise();
  return result.Location; // URL del archivo
}
```

**Opción 2: DigitalOcean Spaces (Alternativa más económica)**
```javascript
import AWS from 'aws-sdk';

const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET
});

// Mismo código que AWS S3
```

**Opción 3: Local Storage (Solo desarrollo)**
```javascript
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/quotes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `quote_${uniqueSuffix}.pdf`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Solo PDF'));
    }
    cb(null, true);
  }
});
```

### URLs Firmadas (Seguridad)

**¿Por qué URLs firmadas?**
- Los archivos contienen información sensible
- No deben ser públicos
- Solo usuarios autorizados pueden descargar

**Implementación con S3:**
```javascript
async function getSignedDownloadUrl(fileKey, expiresInSeconds = 3600) {
  const params = {
    Bucket: 'carrefour-openings-quotes',
    Key: fileKey,
    Expires: expiresInSeconds // 1 hora por defecto
  };
  
  return s3.getSignedUrlPromise('getObject', params);
}

// Endpoint para descargar
app.get('/api/openings/quotes/:quoteId/pdf', async (req, res) => {
  const quote = await getQuoteById(req.params.quoteId);
  
  // Validar permisos
  if (!userCanAccessQuote(req.user, quote)) {
    return res.status(403).json({ error: 'Sin permisos' });
  }
  
  // Generar URL firmada
  const signedUrl = await getSignedDownloadUrl(quote.pdf_key);
  
  // Redirect o retornar URL
  res.json({ download_url: signedUrl });
});
```

### Manejo de Presupuestos con/sin PDF

**Modo Desarrollo (Mock):**
```javascript
// El PDF es OPCIONAL para facilitar testing
if (isMockMode) {
  const quote = {
    id: generateId(),
    amount_cents: data.amount_cents,
    pdf_url: file ? `https://mock-storage.com/quotes/${generateId()}.pdf` : '',
    // ... otros campos
  };
  
  return { success: true, data: quote };
}
```

**Modo Producción:**
```javascript
// El PDF es REQUERIDO
if (!file) {
  return res.status(400).json({
    success: false,
    error: 'El archivo PDF es requerido'
  });
}

// Upload a S3
const pdfUrl = await uploadQuotePDF(file, categoryId, supplierId);

const quote = {
  id: generateId(),
  amount_cents: data.amount_cents,
  pdf_url: pdfUrl,
  pdf_key: extractKeyFromUrl(pdfUrl),
  // ... otros campos
};
```

### Actualización de Presupuestos

**Si el proveedor sube nuevo PDF:**
```javascript
async function updateQuote(quoteId, data, newFile) {
  const existingQuote = await getQuoteById(quoteId);
  
  let pdfUrl = existingQuote.pdf_url;
  
  // Si hay nuevo archivo, reemplazar
  if (newFile) {
    // Borrar el PDF anterior (opcional pero recomendado)
    if (existingQuote.pdf_key) {
      await s3.deleteObject({
        Bucket: 'carrefour-openings-quotes',
        Key: existingQuote.pdf_key
      }).promise();
    }
    
    // Subir nuevo PDF
    pdfUrl = await uploadQuotePDF(newFile, existingQuote.category_id, existingQuote.supplier_id);
  }
  
  // Actualizar en base de datos
  await db.quotes.update({
    where: { id: quoteId },
    data: {
      amount_cents: data.amount_cents,
      pdf_url: pdfUrl,
      updated_at: new Date()
    }
  });
}
```

### Estructura de Carpetas Recomendada en S3

```
carrefour-openings/
├── project-documents/
│   ├── proj_001/
│   │   ├── equipamientos/
│   │   │   ├── equipamientos_proj_001_1234567890.pdf
│   │   │   └── equipamientos_proj_001_1234567891.pdf
│   │   ├── obras_iluminacion/
│   │   │   ├── obras_iluminacion_proj_001_1234567892.pdf
│   │   │   └── obras_iluminacion_proj_001_1234567893.pdf
│   │   ├── obras_clima/
│   │   │   └── obras_clima_proj_001_1234567894.pdf
│   │   ├── obras_electricidad/
│   │   │   └── obras_electricidad_proj_001_1234567895.pdf
│   │   ├── obras_general/
│   │   │   └── obras_general_proj_001_1234567896.pdf
│   │   └── otros/
│   │       └── otros_proj_001_1234567897.pdf
│   ├── proj_002/
│   │   └── ...
│   └── ...
├── quotes/
│   ├── cat_001/
│   │   ├── quote_cat_001_supplier_abc_1234567890.pdf
│   │   ├── quote_cat_001_supplier_xyz_1234567899.pdf
│   │   └── ...
│   ├── cat_002/
│   └── ...
└── signatures/
    ├── signature_quote_001_1234567890.png
    └── ...
```

**Convenciones de nombres:**
- **Documentos de proyecto:** `[category]_[project_id]_[timestamp].pdf`
- **Presupuestos:** `quote_[category_id]_[supplier_id]_[timestamp].pdf`
- **Firmas:** `signature_quote_[quote_id]_[timestamp].png`

### Respuestas de Endpoints con Archivos

**Al crear presupuesto:**
```json
{
  "success": true,
  "data": {
    "id": "quote_001",
    "pdf_url": "https://carrefour-openings.s3.eu-west-1.amazonaws.com/quotes/cat_001/quote_...",
    "pdf_uploaded": true,
    "pdf_size_bytes": 2458934
  }
}
```

**Al obtener presupuesto para descargar:**
```json
{
  "success": true,
  "data": {
    "quote_id": "quote_001",
    "download_url": "https://carrefour-openings.s3.amazonaws.com/quotes/...?signature=...",
    "expires_at": "2026-01-20T16:30:00Z"
  }
}
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

### Tabla: `opening_status_history`

```sql
CREATE TABLE opening_status_history (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL REFERENCES opening_projects(id) ON DELETE CASCADE,
  
  -- Transición de estado
  from_status VARCHAR(50), -- NULL para el primer estado (creación)
  to_status VARCHAR(50) NOT NULL,
  
  -- Usuario que hizo el cambio
  changed_by_user_id VARCHAR(50) NOT NULL,
  changed_by_name VARCHAR(255) NOT NULL,
  changed_by_role VARCHAR(20) NOT NULL, -- 'admin', 'franchisee', 'system'
  
  -- Timestamp
  changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Información adicional
  notes TEXT,
  metadata JSONB, -- Para almacenar información contextual adicional
  
  -- Constraints
  CONSTRAINT valid_status_transition CHECK (
    to_status IN (
      'draft', 'preparing_documentation', 'requesting_quotes',
      'quotes_received', 'pending_selection', 'awarded',
      'pending_signature', 'signed', 'pending_financing',
      'financing_approved', 'financing_rejected',
      'in_execution', 'completed', 'cancelled'
    )
  ),
  
  CONSTRAINT valid_changed_by_role CHECK (
    changed_by_role IN ('admin', 'franchisee', 'system')
  )
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_opening_status_history_project ON opening_status_history(project_id);
CREATE INDEX idx_opening_status_history_timestamp ON opening_status_history(changed_at DESC);
CREATE INDEX idx_opening_status_history_to_status ON opening_status_history(to_status);
CREATE INDEX idx_opening_status_history_user ON opening_status_history(changed_by_user_id);

-- Índice compuesto para obtener historial de un proyecto ordenado
CREATE INDEX idx_opening_status_history_project_time 
  ON opening_status_history(project_id, changed_at DESC);
```

**Notas sobre la tabla:**
- Cada cambio de estado crea una nueva fila (registro inmutable)
- `from_status` es NULL solo para el primer estado (cuando se crea el proyecto)
- `changed_by_role = 'system'` se usa para transiciones automáticas del backend
- `metadata` permite almacenar información contextual (ej: número de categorías, invitaciones enviadas, etc.)
- Los índices están optimizados para obtener el historial de un proyecto ordenado por fecha

**Ejemplo de trigger para crear entrada automática:**
```sql
CREATE OR REPLACE FUNCTION log_project_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo crear entrada si el estado cambió
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO opening_status_history (
      id,
      project_id,
      from_status,
      to_status,
      changed_by_user_id,
      changed_by_name,
      changed_by_role,
      changed_at,
      notes
    ) VALUES (
      'hist_' || gen_random_uuid()::text,
      NEW.id,
      OLD.status,
      NEW.status,
      COALESCE(current_setting('app.current_user_id', true), 'system'),
      COALESCE(current_setting('app.current_user_name', true), 'Sistema'),
      COALESCE(current_setting('app.current_user_role', true), 'system'),
      NOW(),
      COALESCE(current_setting('app.status_change_notes', true), NULL)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Asociar el trigger a la tabla de proyectos
CREATE TRIGGER project_status_change_trigger
  AFTER UPDATE ON opening_projects
  FOR EACH ROW
  EXECUTE FUNCTION log_project_status_change();
```

**Uso del trigger en tu aplicación:**
```javascript
// Antes de actualizar el estado, establece las variables de sesión
await db.$executeRaw`
  SELECT 
    set_config('app.current_user_id', ${userId}, true),
    set_config('app.current_user_name', ${userName}, true),
    set_config('app.current_user_role', ${userRole}, true),
    set_config('app.status_change_notes', ${notes || ''}, true)
`;

// Actualiza el proyecto
await db.projects.update({
  where: { id: projectId },
  data: { status: newStatus }
});

// El trigger creará automáticamente la entrada en opening_status_history
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

### Tabla: `opening_project_documents`

```sql
CREATE TABLE opening_project_documents (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) NOT NULL REFERENCES opening_projects(id) ON DELETE CASCADE,
  
  -- Clasificación
  category VARCHAR(50) NOT NULL,
  subcategory VARCHAR(100),
  
  -- Información del documento
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Archivo
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  file_mime_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
  
  -- Auditoría
  uploaded_by VARCHAR(50) NOT NULL REFERENCES users(id),
  uploaded_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Metadata adicional
  is_active BOOLEAN DEFAULT TRUE,
  version INTEGER DEFAULT 1,
  
  CONSTRAINT valid_document_category CHECK (category IN (
    'equipamientos',
    'obras_iluminacion',
    'obras_clima',
    'obras_electricidad',
    'obras_general',
    'otros'
  ))
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_opening_documents_project ON opening_project_documents(project_id);
CREATE INDEX idx_opening_documents_category ON opening_project_documents(category);
CREATE INDEX idx_opening_documents_active ON opening_project_documents(is_active);
CREATE INDEX idx_opening_documents_uploaded_at ON opening_project_documents(uploaded_at DESC);

-- Índice compuesto para filtrado por proyecto y categoría
CREATE INDEX idx_opening_documents_project_category 
  ON opening_project_documents(project_id, category);
```

**Notas sobre la tabla:**
- Un proyecto puede tener múltiples documentos de cada categoría
- `is_active` permite "soft delete" (marcar como inactivo sin borrar)
- `version` permite controlar versiones si se sube actualización del mismo plano
- `subcategory` es texto libre para clasificación adicional (ej: "circuitos", "hvac", "cuadros")

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

-- 4. Insertar documentos/planos técnicos del proyecto
INSERT INTO opening_project_documents (
  id, project_id, category, subcategory,
  name, description,
  file_url, file_name, file_size_bytes, file_mime_type,
  uploaded_by, uploaded_at
) VALUES 
(
  'doc_test_001',
  'proj_test_001',
  'equipamientos',
  NULL,
  'Layout Mobiliario Principal',
  'Distribución de estanterías, mostradores y equipos refrigerados. Escala 1:50',
  'https://storage.example.com/docs/equipamientos_proj_test_001_1234567890.pdf',
  'layout_mobiliario.pdf',
  2458624, -- ~2.3 MB
  'application/pdf',
  'admin_test_001',
  NOW()
),
(
  'doc_test_002',
  'proj_test_001',
  'obras_iluminacion',
  'circuitos',
  'Esquema de Circuitos de Iluminación',
  'Plano eléctrico de circuitos lumínicos con tipos de luminarias y potencias',
  'https://storage.example.com/docs/obras_iluminacion_proj_test_001_1234567891.pdf',
  'circuitos_iluminacion.pdf',
  3145728, -- 3 MB
  'application/pdf',
  'admin_test_001',
  NOW()
),
(
  'doc_test_003',
  'proj_test_001',
  'obras_clima',
  'hvac',
  'Sistema de Climatización HVAC',
  'Distribución de conductos, difusores y equipos de climatización',
  'https://storage.example.com/docs/obras_clima_proj_test_001_1234567892.pdf',
  'hvac_climatizacion.pdf',
  4194304, -- 4 MB
  'application/pdf',
  'admin_test_001',
  NOW()
),
(
  'doc_test_004',
  'proj_test_001',
  'obras_electricidad',
  'cuadros',
  'Esquema Cuadros Eléctricos',
  'Diagrama unifilar de cuadros eléctricos generales y secundarios',
  'https://storage.example.com/docs/obras_electricidad_proj_test_001_1234567893.pdf',
  'cuadros_electricos.pdf',
  2621440, -- ~2.5 MB
  'application/pdf',
  'admin_test_001',
  NOW()
),
(
  'doc_test_005',
  'proj_test_001',
  'obras_general',
  'planta',
  'Plano Planta General',
  'Distribución general de espacios: zona comercial, almacén, baños, oficina',
  'https://storage.example.com/docs/obras_general_proj_test_001_1234567894.pdf',
  'planta_general.pdf',
  5242880, -- 5 MB
  'application/pdf',
  'admin_test_001',
  NOW()
);

-- 6. Insertar invitaciones a proveedores
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

-- 7. Insertar presupuestos de ejemplo
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

-- 8. Actualizar estado de invitaciones
UPDATE opening_invitations 
SET status = 'quote_submitted' 
WHERE id IN ('inv_test_001', 'inv_test_002');

-- 9. Insertar log de auditoría
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

### 15. Subir documentos/planos técnicos (Admin)

```bash
# Subir plano de equipamiento
curl -X POST http://localhost:3000/api/admin/openings/projects/proj_test_001/documents \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/layout_mobiliario.pdf" \
  -F "category=equipamientos" \
  -F "name=Layout Mobiliario Principal" \
  -F "description=Distribución de estanterías y mostradores. Escala 1:50"

# Subir plano de iluminación
curl -X POST http://localhost:3000/api/admin/openings/projects/proj_test_001/documents \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/circuitos_iluminacion.pdf" \
  -F "category=obras_iluminacion" \
  -F "subcategory=circuitos" \
  -F "name=Esquema de Circuitos de Iluminación" \
  -F "description=Plano eléctrico de circuitos lumínicos con tipos de luminarias"

# Subir plano de climatización
curl -X POST http://localhost:3000/api/admin/openings/projects/proj_test_001/documents \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/hvac.pdf" \
  -F "category=obras_clima" \
  -F "subcategory=hvac" \
  -F "name=Sistema de Climatización HVAC" \
  -F "description=Distribución de conductos y equipos"
```

### 16. Listar documentos del proyecto

```bash
# Listar todos los documentos
curl -X GET http://localhost:3000/api/admin/openings/projects/proj_test_001/documents \
  -H "Authorization: Bearer $TOKEN"

# Filtrar por categoría
curl -X GET "http://localhost:3000/api/admin/openings/projects/proj_test_001/documents?category=obras_iluminacion" \
  -H "Authorization: Bearer $TOKEN"

# Filtrar por categoría y subcategoría
curl -X GET "http://localhost:3000/api/admin/openings/projects/proj_test_001/documents?category=obras_clima&subcategory=hvac" \
  -H "Authorization: Bearer $TOKEN"
```

### 17. Descargar un documento específico

```bash
curl -X GET http://localhost:3000/api/admin/openings/projects/proj_test_001/documents/doc_test_001 \
  -H "Authorization: Bearer $TOKEN"
```

### 18. Eliminar un documento

```bash
curl -X DELETE http://localhost:3000/api/admin/openings/projects/proj_test_001/documents/doc_test_001 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Queries SQL Útiles

### Documentos agrupados por categoría para un proyecto:

```sql
SELECT 
  category,
  subcategory,
  COUNT(*) as total_documentos,
  SUM(file_size_bytes) as total_size_bytes,
  ROUND(SUM(file_size_bytes) / 1024.0 / 1024.0, 2) as total_size_mb
FROM opening_project_documents
WHERE project_id = 'proj_test_001' AND is_active = TRUE
GROUP BY category, subcategory
ORDER BY category, subcategory;
```

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

### Fase 1: CRUD Básico y Documentos (Semana 1)
1. ✅ `POST /api/admin/openings/projects` - Crear proyecto
2. ✅ `GET /api/admin/openings/projects` - Listar proyectos
3. ✅ `GET /api/admin/openings/projects/:id` - Detalle proyecto
4. ✅ `PUT /api/admin/openings/projects/:id` - Actualizar proyecto
5. ✅ `POST /api/admin/openings/projects/:id/documents` - Subir planos/documentos
6. ✅ `GET /api/admin/openings/projects/:id/documents` - Listar documentos
7. ✅ `DELETE /api/admin/openings/projects/:id/documents/:docId` - Eliminar documento

### Fase 2: Categorías e Invitaciones (Semana 2)
8. ✅ `POST /api/admin/openings/projects/:id/categories` - Crear categoría
9. ✅ `GET /api/admin/openings/projects/:id/categories` - Listar categorías
10. ✅ `POST /api/admin/openings/categories/:id/invite` - Invitar proveedores
11. ✅ `GET /api/supplier/openings/invitations` - Mis invitaciones

### Fase 3: Presupuestos (Semana 3)
12. ✅ `POST /api/supplier/openings/categories/:id/quote` - Enviar presupuesto
13. ✅ `GET /api/franchisee/openings/categories/:id/compare` - Comparar presupuestos
14. ✅ `POST /api/franchisee/openings/quotes/:id/award` - Adjudicar

### Fase 4: Firmas y Financiación (Semana 4)
15. ✅ `POST /api/franchisee/openings/quotes/:id/sign` - Firmar
16. ✅ `POST /api/franchisee/openings/projects/:id/financing` - Solicitar financiación
17. ✅ `POST /api/admin/openings/financing/:id/review` - Revisar financiación
18. ✅ `GET /api/admin/openings/projects/:id/audit-logs` - Logs de auditoría

---

## 🎯 Best Practices y Recomendaciones

### Validación de Datos

#### 1. Validación en múltiples capas
```javascript
// Frontend: Validación básica de UX
const validateQuoteForm = (data) => {
  if (!data.amount_cents || data.amount_cents <= 0) {
    throw new Error("El importe debe ser mayor que 0");
  }
  // ... más validaciones
};

// Backend: Validación de seguridad y negocio
const validateQuoteData = (data, category, invitation) => {
  // Verificar que el proveedor está invitado
  if (!invitation || invitation.supplier_id !== req.user.id) {
    throw new UnauthorizedError("No estás invitado a esta categoría");
  }
  
  // Verificar deadline
  if (new Date() > new Date(invitation.deadline)) {
    throw new ValidationError("El plazo para enviar presupuestos ha expirado");
  }
  
  // Validar importes razonables
  if (data.amount_cents > 100000000000) { // €1,000,000
    throw new ValidationError("El importe excede el límite permitido");
  }
  
  return true;
};
```

#### 2. Sanitización de inputs
```javascript
import sanitizeHtml from 'sanitize-html';

// Sanitizar campos de texto
const sanitizeQuoteData = (data) => {
  return {
    ...data,
    notes: sanitizeHtml(data.notes, {
      allowedTags: [], // No permitir HTML
      allowedAttributes: {}
    }),
    payment_terms: sanitizeHtml(data.payment_terms, {
      allowedTags: [],
      allowedAttributes: {}
    })
  };
};
```

### Manejo de Transacciones

#### Usar transacciones para operaciones complejas
```javascript
// Al adjudicar un presupuesto (múltiples updates)
async function awardQuote(quoteId, userId) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 1. Verificar que el quote existe y está submitted
    const quote = await client.query(
      'SELECT * FROM opening_quotes WHERE id = $1 FOR UPDATE',
      [quoteId]
    );
    
    if (!quote.rows[0]) {
      throw new NotFoundError('Presupuesto no encontrado');
    }
    
    if (quote.rows[0].status !== 'submitted') {
      throw new ValidationError('Solo se pueden adjudicar presupuestos enviados');
    }
    
    // 2. Actualizar el quote seleccionado
    await client.query(
      'UPDATE opening_quotes SET status = $1, awarded_at = NOW() WHERE id = $2',
      ['awarded', quoteId]
    );
    
    // 3. Rechazar los demás quotes de la misma categoría
    await client.query(
      'UPDATE opening_quotes SET status = $1 WHERE category_id = $2 AND id != $3',
      ['rejected', quote.rows[0].category_id, quoteId]
    );
    
    // 4. Actualizar estado de la categoría
    await client.query(
      'UPDATE opening_categories SET status = $1 WHERE id = $2',
      ['awarded', quote.rows[0].category_id]
    );
    
    // 5. Verificar si todas las categorías están awarded
    const project = await client.query(
      `SELECT p.id, 
              COUNT(c.id) as total_categories,
              COUNT(CASE WHEN c.status = 'awarded' THEN 1 END) as awarded_categories
       FROM opening_projects p
       JOIN opening_categories c ON c.project_id = p.id
       WHERE p.id = (SELECT project_id FROM opening_categories WHERE id = $1)
       GROUP BY p.id`,
      [quote.rows[0].category_id]
    );
    
    if (project.rows[0].total_categories === project.rows[0].awarded_categories) {
      await client.query(
        'UPDATE opening_projects SET status = $1 WHERE id = $2',
        ['awarded', project.rows[0].id]
      );
    }
    
    // 6. Registrar en audit log
    await client.query(
      `INSERT INTO opening_audit_logs (
        id, project_id, entity_type, entity_id, action, user_id, timestamp
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [
        'log_' + Date.now(),
        project.rows[0].id,
        'quote',
        quoteId,
        'awarded',
        userId
      ]
    );
    
    await client.query('COMMIT');
    
    return quote.rows[0];
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

### Optimización de Consultas

#### 1. Usar índices apropiados
```sql
-- Ya definidos en el schema, pero asegurarse de crearlos:
CREATE INDEX CONCURRENTLY idx_opening_quotes_category 
  ON opening_quotes(category_id);

CREATE INDEX CONCURRENTLY idx_opening_quotes_status_amount 
  ON opening_quotes(status, amount_cents);
```

#### 2. Eager loading para evitar N+1 queries
```javascript
// ❌ MAL: N+1 queries
const projects = await db.query('SELECT * FROM opening_projects');
for (const project of projects.rows) {
  const categories = await db.query(
    'SELECT * FROM opening_categories WHERE project_id = $1',
    [project.id]
  );
  project.categories = categories.rows;
}

// ✅ BIEN: Single query con JOIN
const projects = await db.query(`
  SELECT 
    p.*,
    json_agg(
      json_build_object(
        'id', c.id,
        'name', c.name,
        'budget_estimate', c.budget_estimate,
        'status', c.status
      )
    ) as categories
  FROM opening_projects p
  LEFT JOIN opening_categories c ON c.project_id = p.id
  GROUP BY p.id
`);
```

### Seguridad

#### 1. Validación de permisos
```javascript
// Middleware para verificar rol
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para realizar esta acción'
      });
    }
    next();
  };
};

// Middleware para verificar ownership
const requireProjectOwnership = async (req, res, next) => {
  const projectId = req.params.projectId || req.params.id;
  
  const project = await db.query(
    'SELECT franchisee_id FROM opening_projects WHERE id = $1',
    [projectId]
  );
  
  if (!project.rows[0]) {
    return res.status(404).json({
      success: false,
      error: 'Proyecto no encontrado'
    });
  }
  
  if (req.user.role === 'franchisee' && 
      project.rows[0].franchisee_id !== req.user.id) {
    return res.status(403).json({
      success: false,
      error: 'No tienes acceso a este proyecto'
    });
  }
  
  next();
};

// Uso:
app.post('/api/franchisee/openings/quotes/:id/award', 
  authenticateJWT,
  requireRole(['franchisee']),
  requireProjectOwnership,
  awardQuoteHandler
);
```

#### 2. Rate limiting
```javascript
import rateLimit from 'express-rate-limit';

// Limitar creación de quotes
const quoteCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo 10 presupuestos por 15 minutos
  message: 'Demasiadas solicitudes, intenta más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/supplier/openings/categories/:id/quote',
  quoteCreationLimiter,
  createQuoteHandler
);
```

### Caching

#### 1. Cache de proyectos (Redis)
```javascript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

async function getProject(projectId) {
  // Intentar obtener del cache
  const cached = await redis.get(`project:${projectId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Si no está en cache, obtener de DB
  const result = await db.query(
    'SELECT * FROM opening_projects WHERE id = $1',
    [projectId]
  );
  
  const project = result.rows[0];
  
  // Guardar en cache por 5 minutos
  await redis.setex(
    `project:${projectId}`,
    300,
    JSON.stringify(project)
  );
  
  return project;
}

// Invalidar cache cuando se actualiza
async function updateProject(projectId, data) {
  await db.query(
    'UPDATE opening_projects SET ... WHERE id = $1',
    [projectId]
  );
  
  // Invalidar cache
  await redis.del(`project:${projectId}`);
}
```

---

## 🐛 Troubleshooting y Errores Comunes

### Error 1: "No tienes permiso para adjudicar este presupuesto"

**Causa:** El usuario no es el franquiciado del proyecto.

**Solución:**
```javascript
// Verificar que el quote pertenece a un proyecto del franchisee
const quote = await db.query(`
  SELECT q.*, c.project_id, p.franchisee_id
  FROM opening_quotes q
  JOIN opening_categories c ON c.id = q.category_id
  JOIN opening_projects p ON p.id = c.project_id
  WHERE q.id = $1
`, [quoteId]);

if (quote.rows[0].franchisee_id !== req.user.id) {
  throw new UnauthorizedError('No tienes permiso');
}
```

### Error 2: "El plazo para enviar presupuestos ha expirado"

**Causa:** El proveedor intenta enviar quote después del deadline.

**Solución:**
```javascript
const invitation = await db.query(
  'SELECT deadline FROM opening_invitations WHERE category_id = $1 AND supplier_id = $2',
  [categoryId, supplierId]
);

const now = new Date();
const deadline = new Date(invitation.rows[0].deadline);

if (now > deadline) {
  return res.status(400).json({
    success: false,
    error: 'El plazo ha expirado',
    deadline: invitation.rows[0].deadline,
    extended_message: 'Contacta con el administrador si necesitas una extensión'
  });
}
```

### Error 3: "Ya existe un presupuesto adjudicado para esta categoría"

**Causa:** Se intenta adjudicar cuando ya hay otro quote awarded.

**Solución:**
```javascript
// Verificar antes de adjudicar
const existingAwarded = await db.query(
  `SELECT id FROM opening_quotes 
   WHERE category_id = $1 AND status = 'awarded'`,
  [categoryId]
);

if (existingAwarded.rows.length > 0) {
  return res.status(400).json({
    success: false,
    error: 'Ya existe un presupuesto adjudicado para esta categoría',
    awarded_quote_id: existingAwarded.rows[0].id
  });
}
```

### Error 4: "Archivo PDF muy grande"

**Causa:** El PDF supera el límite de 10 MB.

**Solución:**
```javascript
import multer from 'multer';

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new Error('Solo se permiten archivos PDF'));
      return;
    }
    cb(null, true);
  }
});

// Manejo de errores de multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'El archivo es demasiado grande. Máximo 10 MB.',
        max_size: '10 MB'
      });
    }
  }
  next(error);
});
```

### Error 5: "Transición de estado inválida"

**Causa:** Se intenta cambiar el estado de un proyecto a uno no permitido.

**Solución:**
```javascript
const ALLOWED_TRANSITIONS = {
  'draft': ['preparing_documentation', 'cancelled'],
  'preparing_documentation': ['requesting_quotes', 'cancelled'],
  'requesting_quotes': ['quotes_received', 'cancelled'],
  'quotes_received': ['pending_selection', 'cancelled'],
  'pending_selection': ['awarded', 'cancelled'],
  'awarded': ['pending_signature', 'cancelled'],
  'pending_signature': ['signed', 'cancelled'],
  'signed': ['pending_financing', 'in_execution', 'cancelled'],
  'pending_financing': ['financing_approved', 'financing_rejected', 'cancelled'],
  'financing_approved': ['in_execution', 'cancelled'],
  'financing_rejected': ['cancelled'],
  'in_execution': ['completed', 'cancelled'],
  'completed': [],
  'cancelled': []
};

function validateTransition(currentStatus, newStatus) {
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  
  if (!allowed.includes(newStatus)) {
    throw new ValidationError(
      `No se puede cambiar de ${currentStatus} a ${newStatus}. ` +
      `Transiciones permitidas: ${allowed.join(', ')}`
    );
  }
}
```

---

## ⚡ Consideraciones de Performance

### 1. Paginación

Siempre implementar paginación en endpoints que retornan listas:

```javascript
async function getProjects(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Máximo 100
  const offset = (page - 1) * limit;
  
  // Contar total
  const countResult = await db.query(
    'SELECT COUNT(*) FROM opening_projects WHERE ...'
  );
  const total = parseInt(countResult.rows[0].count);
  
  // Obtener página
  const projects = await db.query(
    'SELECT * FROM opening_projects WHERE ... LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  
  res.json({
    success: true,
    data: projects.rows,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
      has_next: page * limit < total,
      has_prev: page > 1
    }
  });
}
```

### 2. Lazy Loading de Archivos

No cargar PDFs completos en listados, solo URLs:

```javascript
// ✅ BIEN: Solo URLs
SELECT 
  q.id,
  q.amount_cents,
  q.quote_pdf_url  -- Solo la URL, no el contenido
FROM opening_quotes q;

// ❌ MAL: Cargar archivos completos
SELECT 
  q.id,
  q.amount_cents,
  q.quote_pdf_content  -- ¡Muy pesado!
FROM opening_quotes q;
```

### 3. Índices Compuestos

Para queries comunes:

```sql
-- Query frecuente: Buscar quotes de un proveedor por estado
CREATE INDEX idx_quotes_supplier_status 
  ON opening_quotes(supplier_id, status);

-- Query frecuente: Proyectos de un franchisee por fecha
CREATE INDEX idx_projects_franchisee_date 
  ON opening_projects(franchisee_id, planned_opening_date DESC);
```

### 4. Connection Pooling

```javascript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Máximo 20 conexiones concurrentes
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Monitoreo de pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  console.log('New client connected to database');
});
```

---

## 🔮 Mejoras Futuras

### Fase 2: Funcionalidades Avanzadas

#### 1. **Comparación Automática con IA**
```javascript
// Endpoint futuro
POST /api/franchisee/openings/categories/:id/ai-recommendations

// Analiza presupuestos y recomienda el mejor basándose en:
// - Precio
// - Garantía
// - Plazo de entrega
// - Historial del proveedor
// - Reviews anteriores
```

#### 2. **Notificaciones en Tiempo Real (WebSockets)**
```javascript
import { Server } from 'socket.io';

io.on('connection', (socket) => {
  socket.on('subscribe:project', (projectId) => {
    socket.join(`project:${projectId}`);
  });
});

// Emitir cuando llega nuevo presupuesto
io.to(`project:${projectId}`).emit('quote:received', {
  category_id: categoryId,
  quote_id: quoteId,
  supplier_name: supplierName
});
```

#### 3. **Dashboard de Analytics**
```javascript
GET /api/admin/openings/analytics

// Retorna:
// - Tiempo promedio de adjudicación
// - Ahorro promedio vs presupuesto estimado
// - Proveedores más competitivos
// - Categorías con más competencia
```

#### 4. **Integración con ERP de Carrefour**
```javascript
// Sincronizar proyecto awarded con sistema ERP
POST /api/integrations/erp/sync-project

// Exportar datos del proyecto a formato ERP
GET /api/admin/openings/projects/:id/export/erp
```

#### 5. **Firma Electrónica Avanzada**
- Integración con servicios de firma electrónica certificada (DocuSign, Signaturit)
- Validación legal de firmas
- Certificados de autenticidad

#### 6. **Módulo de Reviews**
```sql
CREATE TABLE opening_supplier_reviews (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) REFERENCES opening_projects(id),
  supplier_id VARCHAR(50) REFERENCES users(id),
  category_id VARCHAR(50) REFERENCES opening_categories(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  quality_score INTEGER,
  timing_score INTEGER,
  communication_score INTEGER,
  comments TEXT,
  reviewed_by VARCHAR(50) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 7. **Gestión de Hitos (Milestones)**
```sql
CREATE TABLE opening_milestones (
  id VARCHAR(50) PRIMARY KEY,
  project_id VARCHAR(50) REFERENCES opening_projects(id),
  name VARCHAR(255),
  description TEXT,
  planned_date DATE,
  completed_date DATE,
  status VARCHAR(50),
  responsible_role VARCHAR(50)
);
```

---

## 📊 Monitoreo y Logs

### Logging Estructurado

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Uso
logger.info('Quote awarded', {
  quote_id: quoteId,
  category_id: categoryId,
  project_id: projectId,
  franchisee_id: userId,
  amount_cents: quote.amount_cents
});

logger.error('Failed to award quote', {
  quote_id: quoteId,
  error: error.message,
  stack: error.stack
});
```

### Métricas con Prometheus

```javascript
import client from 'prom-client';

const register = new client.Registry();

// Contador de quotes creados
const quotesCreated = new client.Counter({
  name: 'openings_quotes_created_total',
  help: 'Total de presupuestos creados',
  labelNames: ['category_name']
});

// Histograma de tiempo de adjudicación
const awardingTime = new client.Histogram({
  name: 'openings_awarding_duration_seconds',
  help: 'Tiempo de procesamiento de adjudicación',
  buckets: [0.1, 0.5, 1, 2, 5]
});

register.registerMetric(quotesCreated);
register.registerMetric(awardingTime);

// Endpoint de métricas
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

---

## 📞 Soporte y Referencias

### Documentación Relacionada

- **Especificación completa:** [`docs/technical/openings/NEW_STORE_OPENINGS_SPEC.md`](./NEW_STORE_OPENINGS_SPEC.md)
- **Guía de testing backend:** [`docs/technical/openings/TESTING_GUIDE_OPENINGS.md`](./TESTING_GUIDE_OPENINGS.md)
- **Testing de comparación:** [`/TESTING_COMPARISON.md`](../../../TESTING_COMPARISON.md)
- **Testing de invitaciones:** [`/TESTING_INVITATIONS.md`](../../../TESTING_INVITATIONS.md)
- **Testing de formulario de quotes:** [`/TESTING_QUOTE_FORM.md`](../../../TESTING_QUOTE_FORM.md)
- **Mock data reference:** [`src/lib/api/openings-mock.ts`](../../../src/lib/api/openings-mock.ts)

### Testing del Frontend Mock

El frontend está completamente funcional en modo mock. Para probar:

```bash
# 1. Asegurarse de que mock mode está activo
echo "NEXT_PUBLIC_MOCK_OPENINGS=true" >> .env.local

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Acceder a:
# - Admin: http://localhost:3002/admin/openings
# - Franchisee: http://localhost:3002/franchisee/openings
# - Supplier: http://localhost:3002/supplier/openings

# 4. Credenciales de prueba (ver TESTING_COMPARISON.md)
# Admin: admin@test.com / admin123
# Franchisee: franchisee@test.com / franchisee123
# Supplier: supplier@test.com / supplier123
```

### 8. Actualizar estado del proyecto (Workflow)

```bash
# Cambiar estado de un proyecto
curl -X PATCH http://localhost:3000/api/admin/openings/projects/proj_test_001/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "new_status": "quotes_received",
    "notes": "Primer presupuesto recibido de Mobiliario Comercial SL"
  }'

# Respuesta esperada:
# {
#   "success": true,
#   "data": {
#     "id": "proj_test_001",
#     "status": "quotes_received",
#     "updated_at": "2026-01-20T14:30:00Z"
#   },
#   "message": "Estado del proyecto actualizado"
# }
```

### 9. Obtener historial de estados

```bash
# Ver historial completo de cambios de estado
curl -X GET http://localhost:3000/api/admin/openings/projects/proj_test_001/status-history \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Respuesta esperada:
# {
#   "success": true,
#   "data": {
#     "project_id": "proj_test_001",
#     "current_status": "quotes_received",
#     "history": [
#       {
#         "id": "hist_003",
#         "project_id": "proj_test_001",
#         "from_status": "requesting_quotes",
#         "to_status": "quotes_received",
#         "changed_by_user_id": "admin_001",
#         "changed_by_name": "Admin Sistema",
#         "changed_by_role": "admin",
#         "changed_at": "2026-01-20T14:30:00Z",
#         "notes": "Primer presupuesto recibido de Mobiliario Comercial SL",
#         "metadata": {
#           "quotes_count": 1
#         }
#       },
#       {
#         "id": "hist_002",
#         "project_id": "proj_test_001",
#         "from_status": "preparing_documentation",
#         "to_status": "requesting_quotes",
#         "changed_by_user_id": "admin_001",
#         "changed_by_name": "Admin Sistema",
#         "changed_by_role": "admin",
#         "changed_at": "2026-01-18T09:15:00Z",
#         "notes": "Proveedores invitados para cotización"
#       },
#       {
#         "id": "hist_001",
#         "project_id": "proj_test_001",
#         "from_status": null,
#         "to_status": "draft",
#         "changed_by_user_id": "admin_001",
#         "changed_by_name": "Admin Sistema",
#         "changed_by_role": "admin",
#         "changed_at": "2026-01-15T10:00:00Z",
#         "notes": "Proyecto creado"
#       }
#     ]
#   }
# }
```

### 10. Validación de transiciones inválidas

```bash
# Intentar una transición no permitida (debe fallar)
curl -X PATCH http://localhost:3000/api/admin/openings/projects/proj_test_001/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "new_status": "completed",
    "notes": "Intentando saltar estados"
  }'

# Respuesta esperada (error):
# {
#   "success": false,
#   "error": "Transición inválida: quotes_received → completed. Transiciones permitidas: [pending_selection, requesting_quotes, cancelled]"
# }
```

---

### Cambiar a Backend Real

Una vez implementado el backend:

```bash
# 1. Desactivar mock mode
echo "NEXT_PUBLIC_MOCK_OPENINGS=false" >> .env.local

# 2. Configurar URL del backend
echo "NEXT_PUBLIC_API_URL=https://api.carrefour.com" >> .env.local

# 3. El frontend automáticamente usará el backend real
# No se requieren cambios de código
```

### Stack Tecnológico Recomendado

**Backend:**
- Node.js 18+ con Express o Fastify
- PostgreSQL 14+
- Redis (para caching)
- AWS S3 / DigitalOcean Spaces (para archivos)

**Librerías útiles:**
- `pg` - Cliente PostgreSQL
- `multer` - Upload de archivos
- `aws-sdk` - S3 para almacenamiento
- `jsonwebtoken` - Autenticación JWT
- `bcrypt` - Hashing de passwords
- `express-validator` - Validación de inputs
- `winston` - Logging
- `helmet` - Seguridad HTTP headers
- `cors` - CORS configuration
- `compression` - Compresión gzip

### Contacto

Para consultas técnicas sobre esta implementación:
- **Documentación:** Este archivo y referencias listadas arriba
- **Código mock:** `src/lib/api/openings-mock.ts`
- **Testing:** Archivos `TESTING_*.md` en raíz del proyecto

---

## 🎉 Conclusión

Esta guía proporciona toda la información necesaria para implementar el backend del módulo de **Nuevas Aperturas**:

✅ **Flujo completo de trabajo** - Desde creación hasta ejecución  
✅ **Estructura de datos detallada** - Schema SQL completo  
✅ **Todos los endpoints necesarios** - Con ejemplos de request/response  
✅ **Gestión de archivos** - Upload y storage de PDFs  
✅ **Sistema de estados** - Transiciones automáticas  
✅ **Seguridad y validaciones** - Permisos por rol  
✅ **Best practices** - Transacciones, caching, performance  
✅ **Troubleshooting** - Errores comunes y soluciones  
✅ **Testing completo** - Ejemplos de curl y datos seed  

El frontend ya está 100% implementado en modo mock y listo para conectarse al backend real en cuanto esté disponible.

**¡Éxito con la implementación! 🚀**
