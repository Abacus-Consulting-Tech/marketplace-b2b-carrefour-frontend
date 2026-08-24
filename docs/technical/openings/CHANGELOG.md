# Changelog - Módulo de Nuevas Aperturas

Todos los cambios notables del módulo de Nuevas Aperturas están documentados aquí.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.0.0] - 2026-08-20

### 🎉 Añadido - Sistema de Documentos Múltiples

#### Frontend
- **Sistema completo de documentos técnicos categorizados** con 6 tipos:
  - `equipamientos` - Mobiliario, estanterías, vitrinas
  - `obras_iluminacion` - Circuitos, luminarias
  - `obras_clima` - HVAC, ventilación
  - `obras_electricidad` - Cuadros, instalaciones
  - `obras_general` - Plantas generales, estructura
  - `otros` - Documentos diversos

#### Componentes Nuevos
- `DocumentUploadForm.tsx` - Upload con drag & drop, validación PDF 15MB
- `DocumentsList.tsx` - Lista categorizada con tabs, descarga/eliminación
- `src/lib/constants/document-categories.ts` - Metadata de categorías

#### API Methods
- `uploadProjectDocument(projectId, data)` - Subir documento
- `getProjectDocuments(projectId, filters?)` - Listar con filtros
- `getDocumentDownloadUrl(projectId, documentId)` - URL firmada
- `deleteProjectDocument(projectId, documentId)` - Eliminar (soft delete)

#### Mock Data
- 5 documentos de ejemplo precargados
- Funciones helper: `getMockDocumentsByProject`, `addMockDocument`, `deleteMockDocument`

#### Backend Specs
- Nueva tabla SQL `opening_project_documents` con 13 campos
- 4 endpoints documentados en BACKEND_GUIDE.md (línea 743-878)
- Validaciones: tipo MIME, tamaño máximo, categorías permitidas
- Estructura de carpetas en S3 por categoría

---

### 🎉 Añadido - Workflow de Estados

#### Sistema Completo de Gestión de Estados
- **14 estados del proyecto** definidos en orden secuencial
- **5 fases del workflow**: Preparación, Presupuesto, Adjudicación, Financiación, Ejecución
- **Matriz de transiciones válidas** - validación estricta de cambios permitidos

#### Constantes y Utilidades
- `src/lib/constants/workflow.ts` (281 líneas):
  - `PROJECT_STATUS_ORDER` - Orden de estados
  - `WORKFLOW_PHASES` - Agrupación visual por fases
  - `VALID_TRANSITIONS` - Matriz completa de transiciones
  - `STATUS_METADATA` - Iconos, descripción, actor responsable
  - Funciones: `isValidTransition`, `getNextStates`, `calculateProgress`, etc.

#### Componentes Nuevos
- `ProjectWorkflowTimeline.tsx` (192 líneas):
  - Timeline visual con estados completados/actuales/pendientes
  - Barra de progreso con porcentaje
  - Agrupación por fases con badges
  - Estados especiales (cancelado/rechazado) destacados
  
- `ProjectStatusChanger.tsx` (263 líneas):
  - Selector de estado con solo transiciones válidas
  - Alertas diferenciadas (normal vs crítico)
  - Campo de notas opcional
  - Diálogo de confirmación
  - Indicadores visuales de cambios finales
  
- `StatusHistoryLog.tsx` (180 líneas):
  - Timeline cronológico de cambios
  - Usuario, rol y timestamp de cada cambio
  - Notas adjuntas
  - Metadata expandible
  - Estado actual destacado

#### Tipos TypeScript
- `StatusHistoryEntry` - Entrada en historial de cambios
- `UpdateProjectStatusRequest` - Request para cambiar estado
- `StatusHistoryResponse` - Respuesta con historial completo

#### API Methods
- `updateProjectStatus(projectId, { new_status, notes })` - Cambiar estado
- `getStatusHistory(projectId)` - Obtener historial completo

#### Mock Data
- 3 entradas de historial de ejemplo
- Funciones: `getMockStatusHistory`, `addMockStatusHistory`

#### Backend Specs
- Nueva tabla SQL `opening_status_history` con 9 campos
- 2 endpoints documentados (línea 1310-1435 BACKEND_GUIDE.md)
- Trigger PostgreSQL opcional para crear entradas automáticas
- Índices optimizados para queries frecuentes
- 3 ejemplos de CURL para testing

#### Integración
- Nuevo tab "Workflow" en admin detail page con 3 componentes
- Auto-refresh del historial al cambiar estado
- Estado sincronizado con store global

---

### 📝 Mejorado

#### Documentación
- **BACKEND_GUIDE.md** expandido:
  - +200 líneas nuevas
  - Sistema de documentos múltiples completo
  - Sistema de workflow y estados
  - Trigger PostgreSQL incluido
  - 3 ejemplos CURL adicionales
  - Total: 4200+ líneas

- **FRONTEND_DOCUMENTS_IMPLEMENTATION.md** creado (1100+ líneas):
  - Guía completa de implementación de documentos
  - Templates de código completos
  - Checklist de pasos
  - Instrucciones de integración

- **README.md** actualizado:
  - Estado del proyecto actualizado
  - Referencias al nuevo roadmap
  - Logros de agosto documentados
  - Versión 2.0.0

#### API Client
- Imports ampliados en `openings-client.ts`:
  - `getMockStatusHistory`, `addMockStatusHistory`
  - `getMockProjects` (helper adicional)

#### Types
- Ampliación de `src/types/openings.ts` con:
  - Tipos de workflow
  - Tipos de historial de estados
  - Interfaces de request/response

---

### 🔧 Cambiado

#### Admin Detail Page
- Nuevo tab "Workflow" agregado a la navegación
- Orden de tabs reorganizado: Overview, **Workflow**, Categorías, Proveedores, Presupuestos, Documentos
- Estado `workflowRefreshTrigger` para sincronización

#### Mock Data Structure
- `mockProjectDocuments` array agregado
- `mockStatusHistory` array agregado
- Funciones helper exportadas

---

### 🐛 Corregido

- Componente `alert-dialog` faltante agregado (`src/components/ui/alert-dialog.tsx`)
- Dependencia `@radix-ui/react-alert-dialog` instalada
- Imports corregidos en componentes que usan AlertDialog

---

## [1.0.0] - 2026-01-15

### ✨ Añadido - Release Inicial

#### Infraestructura Base
- Tipos TypeScript completos (`src/types/openings.ts`)
- API Client dual mode (mock/real)
- Zustand store para gestión de estado
- Mock data completo con 3 proyectos, 9 categorías, 12 invitaciones, 8 presupuestos

#### Portales Completos
- Portal Admin: Gestión completa de proyectos
- Portal Franchisee: Comparación y adjudicación
- Portal Supplier: Envío de presupuestos

#### Componentes Core
- `ProjectCard` - Card de proyecto
- `ProjectStatusBadge` - Badge de estado
- `QuoteComparisonTable` - Tabla comparativa
- `CategoryForm` - Formulario de categorías
- `InviteSupplierForm` - Invitación de proveedores
- `QuoteForm` - Formulario de presupuestos

#### Documentación
- BACKEND_GUIDE.md (4000 líneas)
- SPECIFICATION_ES.md
- SPECIFICATION_EN.md
- TESTING_GUIDE_OPENINGS.md
- README.md completo

---

## Roadmap

### [2.1.0] - Septiembre 2026 (Planificado)

#### Añadido (Planificado)
- Sistema de firma digital de contratos
- Sistema de financiación (solicitud/aprobación)
- Dashboard con analytics
- Notificaciones en tiempo real
- Backend completo (todos los endpoints)
- Base de datos PostgreSQL (8 tablas)
- Testing E2E completo

#### Mejorado (Planificado)
- Responsive mobile optimizado
- Búsqueda y filtros avanzados
- Exportación de reportes (Excel/PDF)
- Mensajería interna entre roles

---

## Versionado

- **MAJOR**: Cambios incompatibles con versión anterior
- **MINOR**: Nueva funcionalidad compatible hacia atrás
- **PATCH**: Bug fixes compatibles

**Versión actual:** 2.0.0  
**Última actualización:** 20 Agosto 2026

---

## Enlaces

- [Roadmap Septiembre 2026](./ROADMAP_SEPTIEMBRE.md)
- [Backend Guide](./BACKEND_GUIDE.md)
- [Frontend Docs Implementation](./FRONTEND_DOCUMENTS_IMPLEMENTATION.md)
- [Testing Guide](./TESTING_GUIDE_OPENINGS.md)
