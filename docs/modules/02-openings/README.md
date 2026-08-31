# Módulo 2: Openings (Nuevas Aperturas)

## 📋 Descripción

Gestión de proyectos de apertura de franquicias Carrefour, incluyendo:
- Creación de proyectos de apertura
- Definición de categorías necesarias
- Seguimiento de presupuesto y timeline
- Estados del proyecto (planning, active, completed)
- **Invitación a proveedores para cotizar**
- **Gestión de documentos técnicos (planos, especificaciones)**
- **Sistema de presupuestos con firmas digitales**

## 📄 Documentos para Backend

### BACKEND_GUIDE.md
- **Contenido**: Guía completa de implementación backend
- **Incluye**:
  - Modelo de datos (opening_projects, opening_categories, opening_project_documents)
  - Especificaciones de API (24+ endpoints)
  - Ejemplos de requests/responses
  - Scripts SQL para crear tablas e índices
  - Datos mock de prueba
- **Estado**: ✅ Enviado al backend

### EMAIL_PARA_BACKEND.md
- **Contenido**: Email explicativo del contexto del módulo
- **Incluye**:
  - Contexto del negocio
  - Flujo de trabajo esperado
  - Prioridades de implementación
- **Estado**: ✅ Enviado al backend

## 🔄 Cambios Recientes (August 26, 2026)

### SupplierInvitation Type Update
- **Added**: `project_id: string` field (required)
- **Impact**: All navigation URLs now require project_id
- **Route Pattern**: `/supplier/openings/{project_id}/quote/{category_id}`
- **See**: `src/types/openings.ts` and `API_CHANGES_LOG.md`

### Document Management Features
- Suppliers can now view technical documents while filling quote form
- Component: `ProjectDocumentsViewer` 
- Downloads work with signed URLs
- Categories filterable

## 🔗 Endpoints Principales (24 endpoints)

### Projects (5)
```
GET    /admin/openings/projects
POST   /admin/openings/projects
GET    /admin/openings/projects/:id
PATCH  /admin/openings/projects/:id
DELETE /admin/openings/projects/:id
```

### Categories (2)
```
GET    /admin/openings/projects/:id/categories
POST   /admin/openings/projects/:id/categories
```

### Documents (4)
```
POST   /admin/openings/projects/:id/documents
GET    /admin/openings/projects/:id/documents
GET    /admin/openings/projects/:id/documents/:documentId
DELETE /admin/openings/projects/:id/documents/:documentId
```

### Invitations (4)
```
POST   /admin/openings/projects/:id/invitations
GET    /admin/openings/projects/:id/invitations
GET    /api/openings/my-invitations
DELETE /admin/openings/invitations/:id
```

### Quotes (4)
```
GET    /admin/openings/projects/:id/quotes
PATCH  /admin/openings/quotes/:id/award
PATCH  /admin/openings/quotes/:id/revert
POST   /api/openings/quotes/:id/sign
```

### Project Status (3)
```
PATCH  /admin/openings/projects/:id/status
GET    /admin/openings/projects/:id/status-history
GET    /api/openings/categories/:id/quotes/comparison
```

### Financing (2)
```
POST   /admin/openings/projects/:id/financing
PATCH  /admin/openings/projects/:id/financing/:id
```

## 📊 Mock Data

- **Projects**: 4 proyectos de apertura de ejemplo
  - Barcelona Sur (activo con invitaciones)
  - Madrid Centro (planning)
  - Valencia Este (activo)
  - Sevilla Norte (planning)

- **Suppliers**: 6 proveedores mock
  - Mobiliario Retail S.L.
  - Rótulos y Vinilos Madrid
  - Soluciones IT Retail
  - Equipamientos Comerciales S.L.
  - Electricistas Pro
  - Sistemas Climatización

- **Invitations**: 3+ invitaciones pendientes con estados variados

- **Documents**: 12+ documentos técnicos para proyectos
  - Planos arquitectura
  - Esquemas eléctricos
  - Especificaciones equipamiento
  - Proyectos rotulación
  - HVAC y climatización

## 🧪 Testing

See:
- `docs/testing/TESTING_GUIDE_OPENINGS.md`
- `docs/technical/openings/TESTING_GUIDE_OPENINGS.md`
- `docs/technical/openings/API_CHANGES_LOG.md` (recent changes)


## 🔄 Relación con Otros Módulos

- **Quotes**: Los presupuestos se vinculan a proyectos de apertura
- **Categories**: Define qué categorías necesita cada apertura

## ✅ Estado

- **Frontend**: Completado
- **Backend Docs**: Enviado
- **Backend Implementation**: Pendiente

## ⚠️ Realidad validada en DEV (2026-08-31)

- Este módulo sigue en mock en la UI de `dev`.
- La validación real más reciente encontró `404` en `/admin/openings/projects`.
- Por tanto, la documentación de este módulo describe el contrato objetivo, no un backend hoy operativo en DEV.
- El estado operativo actual se sigue desde `admin/dev-tools` y `.github/ai/API_STATUS.md`.

---

**Última Actualización**: 31 de Agosto de 2026
