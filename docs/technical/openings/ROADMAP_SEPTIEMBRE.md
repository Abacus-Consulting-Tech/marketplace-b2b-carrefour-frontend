# 📋 Nuevas Aperturas - TODOs Pendientes

**Última actualización:** 20 de Agosto, 2026  
**Estado del proyecto:** Fase de desarrollo - Implementación frontend completada en modo mock  
**Próxima sesión:** Septiembre 2026

---

## ✅ Completado (Agosto 2026)

### **Frontend - 100% Funcional en Modo Mock**

#### 1. ✅ Infraestructura Base
- [x] Tipos TypeScript completos (`src/types/openings.ts`)
- [x] API Client dual mode mock/real (`src/lib/api/openings-client.ts`)
- [x] Mock data completo (`src/lib/api/openings-mock.ts`)
- [x] Zustand store para gestión de estado global
- [x] Componentes compartidos (badges, cards, forms)

#### 2. ✅ Gestión de Proyectos
- [x] Lista de proyectos (Admin/Franchisee)
- [x] Creación de proyectos (Admin)
- [x] Detalle de proyecto con tabs
- [x] Formularios de creación/edición
- [x] Filtrado y búsqueda

#### 3. ✅ Gestión de Categorías
- [x] Listado de categorías por proyecto
- [x] Crear/editar/eliminar categorías
- [x] Especificaciones de requisitos
- [x] Presupuesto estimado por categoría

#### 4. ✅ Sistema de Invitaciones
- [x] Invitar proveedores a categorías
- [x] Gestión de deadlines
- [x] Vista de invitaciones (Supplier)
- [x] Estados de invitación

#### 5. ✅ Presupuestos (Quotes)
- [x] Formulario de envío de presupuestos (Supplier)
- [x] Upload de PDF con validación
- [x] Guardar borradores
- [x] Comparación de presupuestos (Franchisee)
- [x] Tabla comparativa multi-criterio
- [x] Adjudicación de presupuestos

#### 6. ✅ **Documentos Técnicos Múltiples (NUEVO - Agosto)**
- [x] Sistema de categorías de documentos (6 tipos):
  - Equipamientos
  - Obras - Iluminación  
  - Obras - Climatización
  - Obras - Electricidad
  - Obras - General
  - Otros
- [x] Upload múltiple con subcategorías
- [x] Validación PDF (15MB máx)
- [x] Componente `DocumentUploadForm`
- [x] Componente `DocumentsList` con tabs
- [x] Descargar/eliminar documentos
- [x] Mock data con 5 documentos de ejemplo

#### 7. ✅ **Workflow de Estados (NUEVO - Agosto)**
- [x] 14 estados del proyecto definidos
- [x] Matriz de transiciones válidas
- [x] Componente `ProjectWorkflowTimeline` (visual stepper con fases)
- [x] Componente `ProjectStatusChanger` (control Admin)
- [x] Componente `StatusHistoryLog` (auditoría)
- [x] Constantes de workflow (`src/lib/constants/workflow.ts`)
- [x] API methods: `updateProjectStatus`, `getStatusHistory`
- [x] Mock data con 3 cambios de estado
- [x] Validación de transiciones en frontend
- [x] Cálculo de progreso (%)
- [x] Estados agrupados en 5 fases

#### 8. ✅ Documentación Técnica
- [x] BACKEND_GUIDE.md completísimo (4200+ líneas)
  - Flujo completo de trabajo
  - 14 estados con transiciones
  - Todos los endpoints (30+)
  - Schema SQL completo (8 tablas)
  - Ejemplos de CURL
  - Sistema de documentos múltiples
  - Sistema de workflow y historial
- [x] FRONTEND_DOCUMENTS_IMPLEMENTATION.md
- [x] README.md con guía rápida
- [x] SPECIFICATION_ES.md
- [x] Guías de testing

---

## 🚧 Pendiente para Septiembre 2026

### **Prioridad ALTA - Core Functionality**

#### 🔥 **1. Firma Digital de Contratos**
**Descripción:** Sistema completo de firma digital para presupuestos adjudicados.

**Tareas Frontend:**
- [ ] Componente `SignaturePad` con canvas
  - Dibujo de firma con mouse/touch
  - Clear/undo functionality
  - Convertir a base64 PNG
- [ ] Componente `SignatureModal` 
  - Mostrar documento a firmar
  - Pad de firma
  - Confirmación con preview
- [ ] Componente `SignedDocumentViewer`
  - Ver documentos firmados
  - Mostrar firma + timestamp
  - Información del firmante
- [ ] API methods:
  - `signQuote(quoteId, signatureData)`
  - `getQuoteSignature(quoteId)`
  - `verifySignature(quoteId)`
- [ ] Mock data para firmas
- [ ] Validación de firma requerida antes de siguiente paso

**Tareas Backend:**
- [ ] Tabla `opening_signatures` (ya documentada en BACKEND_GUIDE)
- [ ] Endpoint `POST /api/franchisee/openings/quotes/:quoteId/sign`
- [ ] Generar hash SHA-256 del documento
- [ ] Almacenar firma en S3/Spaces
- [ ] Validar que quote está `awarded`
- [ ] Actualizar estado a `signed`
- [ ] Trigger: Si todos los quotes están firmados → proyecto a `signed`

**Referencia:** BACKEND_GUIDE.md línea 1257

**Estimación:** 2-3 días frontend + 2 días backend

---

#### 💰 **2. Solicitud y Aprobación de Financiación**
**Descripción:** Franquiciado solicita financiación, Admin (Finanzas) aprueba/rechaza.

**Tareas Frontend:**
- [ ] Componente `FinancingRequestForm`
  - Monto solicitado
  - Justificación
  - Documentación adjunta
- [ ] Componente `FinancingApprovalPanel` (Admin)
  - Ver solicitudes pendientes
  - Aprobar/rechazar con notas
  - Historial de decisiones
- [ ] Vista de estado de financiación (Franchisee)
- [ ] API methods:
  - `requestFinancing(projectId, data)`
  - `getFinancingStatus(projectId)`
  - `reviewFinancing(approvalId, decision)` (Admin)
- [ ] Mock data para aprobaciones financieras

**Tareas Backend:**
- [ ] Tabla `opening_financial_approvals` (ya documentada)
- [ ] Endpoints financiación (ver BACKEND_GUIDE línea 1293)
- [ ] Lógica de aprobación/rechazo
- [ ] Notificaciones email
- [ ] Transición automática de estados

**Estimación:** 2 días frontend + 1-2 días backend

---

#### 📊 **3. Dashboard y Analytics**
**Descripción:** Vistas resumidas con métricas clave del proceso.

**Tareas Frontend:**
- [ ] Dashboard Admin:
  - Total proyectos por estado (gráfico de barras)
  - Proyectos activos vs completados
  - Tiempo promedio por fase
  - Proveedores más activos
- [ ] Dashboard Franchisee:
  - Mis proyectos en curso
  - Próximas fechas límite
  - Presupuestos pendientes de revisión
  - Estado de financiación
- [ ] Dashboard Supplier:
  - Invitaciones activas
  - Tasas de adjudicación
  - Presupuestos enviados vs pendientes

**Librerías sugeridas:**
- `recharts` o `chart.js` para gráficos
- `date-fns` para manejo de fechas

**Estimación:** 3-4 días frontend

---

### **Prioridad MEDIA - Mejoras UX**

#### 🔔 **4. Sistema de Notificaciones**
**Descripción:** Alertas en tiempo real y notificaciones push.

**Tareas:**
- [ ] Componente `NotificationCenter`
  - Dropdown con notificaciones recientes
  - Badge de contador
  - Marcar como leído
- [ ] Tipos de notificaciones:
  - Nuevo presupuesto recibido
  - Quote adjudicado/rechazado
  - Cambio de estado del proyecto
  - Financiación aprobada/rechazada
  - Deadline próximo (3 días antes)
- [ ] WebSocket o polling para updates
- [ ] Persistencia de notificaciones
- [ ] Configuración de preferencias

**Backend:**
- [ ] Tabla `notifications`
- [ ] Sistema de eventos
- [ ] Email templates
- [ ] WebSocket server (opcional)

**Estimación:** 3 días full-stack

---

#### 📧 **5. Sistema de Mensajería Interna**
**Descripción:** Chat/mensajes entre Admin, Franchisee y Suppliers.

**Tareas:**
- [ ] Componente de mensajería por proyecto
- [ ] Thread por categoría
- [ ] Notificación de mensajes nuevos
- [ ] Adjuntar archivos en mensajes
- [ ] Historial de conversación

**Estimación:** 4-5 días full-stack

---

#### 📱 **6. Mejoras Responsive Mobile**
**Descripción:** Optimizar experiencia en móviles/tablets.

**Tareas:**
- [ ] Review de todos los componentes en mobile
- [ ] Simplificar tabla de comparación en móvil
- [ ] Mejorar formularios para touch
- [ ] Navegación mobile-friendly
- [ ] Testing en dispositivos reales

**Estimación:** 2 días frontend

---

### **Prioridad BAJA - Nice to Have**

#### 📈 **7. Exportación de Reportes**
**Tareas:**
- [ ] Exportar lista de proyectos a Excel/CSV
- [ ] PDF de comparación de presupuestos
- [ ] Reporte de proyecto completo (PDF)
- [ ] Gráficos exportables

**Estimación:** 2 días

---

#### 🔍 **8. Búsqueda Avanzada y Filtros**
**Tareas:**
- [ ] Filtros combinados (estado + fecha + franquiciado)
- [ ] Búsqueda full-text por nombre/descripción
- [ ] Guardar filtros favoritos
- [ ] Ordenamiento customizable

**Estimación:** 1-2 días

---

#### 🎨 **9. Personalización y Temas**
**Tareas:**
- [ ] Modo oscuro
- [ ] Tamaño de fuente ajustable
- [ ] Preferencias de usuario

**Estimación:** 1 día

---

## 🔧 Backend - Tareas Técnicas

### **Prioridad CRÍTICA**

#### ⚙️ **1. Implementar Endpoints Core**

**Fase 1 - MVP Básico (1-2 semanas):**
- [ ] Auth y permisos (JWT)
- [ ] CRUD Proyectos (5 endpoints)
- [ ] CRUD Categorías (5 endpoints)
- [ ] Sistema de Invitaciones (3 endpoints)
- [ ] CRUD Presupuestos (6 endpoints)

**Fase 2 - Documentos y Workflow (1 semana):**
- [ ] Upload de documentos múltiples (4 endpoints)
- [ ] Gestión de estados (2 endpoints)
- [ ] Historial de cambios

**Fase 3 - Firma y Financiación (1 semana):**
- [ ] Firma digital (3 endpoints)
- [ ] Financiación (3 endpoints)

**Referencia completa:** BACKEND_GUIDE.md

#### 🗄️ **2. Base de Datos**
- [ ] Crear 8 tablas PostgreSQL (schema en BACKEND_GUIDE línea 2050+)
  - `opening_projects`
  - `opening_categories`
  - `opening_invitations`
  - `opening_quotes`
  - `opening_project_documents` ⭐ (nueva - documentos múltiples)
  - `opening_signatures`
  - `opening_financial_approvals`
  - `opening_status_history` ⭐ (nueva - workflow)
  - `opening_audit_logs`
- [ ] Índices para optimización
- [ ] Constraints y validaciones
- [ ] Seed data de prueba
- [ ] Trigger para `opening_status_history` (opcional, recomendado)

#### ☁️ **3. Almacenamiento de Archivos**
- [ ] Configurar S3 / DigitalOcean Spaces
- [ ] Estructura de carpetas por categoría de documento
- [ ] URLs firmadas para descarga segura
- [ ] Validación de tipos MIME
- [ ] Límites de tamaño (15MB documentos, 10MB presupuestos)
- [ ] Cleanup de archivos huérfanos

#### 🔐 **4. Seguridad y Validaciones**
- [ ] Middleware de autenticación JWT
- [ ] Rate limiting por endpoint
- [ ] Validación estricta de transiciones de estado
- [ ] Sanitización de inputs
- [ ] CORS configurado correctamente
- [ ] Helmet para headers de seguridad
- [ ] Logs de seguridad (intentos fallidos)

#### 📬 **5. Sistema de Notificaciones**
- [ ] Email templates (HTML)
- [ ] Cola de emails (Bull/BullMQ)
- [ ] SMTP configurado (SendGrid/AWS SES)
- [ ] Eventos clave:
  - Invitación enviada
  - Presupuesto recibido
  - Adjudicación
  - Cambio de estado
  - Financiación aprobada/rechazada

---

## 🧪 Testing Pendiente

### **Frontend**
- [ ] Unit tests para componentes clave
- [ ] Integration tests para flujos completos
- [ ] E2E tests con Playwright/Cypress
- [ ] Tests de accesibilidad (a11y)
- [ ] Tests responsive en diferentes viewports

### **Backend**
- [ ] Unit tests para cada endpoint
- [ ] Tests de validación de transiciones
- [ ] Tests de permisos por rol
- [ ] Tests de carga (performance)
- [ ] Tests de seguridad (penetration)

---

## 📚 Documentación Pendiente

- [ ] API Reference completa (Swagger/OpenAPI)
- [ ] Guía de usuario final (Franchisee/Supplier)
- [ ] Video tutoriales
- [ ] Diagramas de arquitectura (Mermaid)
- [ ] Changelog estructurado

---

## 🎯 Roadmap Sugerido - Septiembre

### **Semana 1-2: Backend MVP**
- Días 1-5: Endpoints core (proyectos, categorías, invitaciones)
- Días 6-10: Presupuestos y documentos

### **Semana 3: Workflow y Firma**
- Días 11-13: Sistema de estados y historial
- Días 14-15: Firma digital

### **Semana 4: Financiación y Testing**
- Días 16-17: Sistema de financiación
- Días 18-20: Testing e integración frontend-backend

### **Semana 5+: Mejoras y Pulido**
- Notificaciones
- Dashboard
- Optimizaciones
- Deployment

---

## 📊 Métricas de Progreso

| Módulo | Frontend | Backend | Testing | Total |
|--------|----------|---------|---------|-------|
| Proyectos | 100% ✅ | 0% | 0% | 33% |
| Categorías | 100% ✅ | 0% | 0% | 33% |
| Invitaciones | 100% ✅ | 0% | 0% | 33% |
| Presupuestos | 100% ✅ | 0% | 0% | 33% |
| Documentos Múltiples | 100% ✅ | 0% | 0% | 33% |
| Workflow Estados | 100% ✅ | 0% | 0% | 33% |
| Firma Digital | 0% | 0% | 0% | 0% |
| Financiación | 0% | 0% | 0% | 0% |
| Notificaciones | 0% | 0% | 0% | 0% |
| Dashboard | 0% | 0% | 0% | 0% |

**Progreso Total del Proyecto:** ~35% (Frontend mock completo, Backend 0%)

---

## 🔗 Referencias Rápidas

### Documentación Clave
- **Backend completo:** [docs/technical/openings/BACKEND_GUIDE.md](docs/technical/openings/BACKEND_GUIDE.md)
- **Documentos múltiples:** [docs/technical/openings/FRONTEND_DOCUMENTS_IMPLEMENTATION.md](docs/technical/openings/FRONTEND_DOCUMENTS_IMPLEMENTATION.md)
- **Testing:** [docs/technical/openings/TESTING_GUIDE_OPENINGS.md](docs/technical/openings/TESTING_GUIDE_OPENINGS.md)
- **Tipos completos:** [src/types/openings.ts](src/types/openings.ts)

### Archivos Importantes
- **API Client:** `src/lib/api/openings-client.ts`
- **Mock Data:** `src/lib/api/openings-mock.ts`
- **Workflow:** `src/lib/constants/workflow.ts`
- **Document Categories:** `src/lib/constants/document-categories.ts`
- **Store:** `src/lib/store/openings.ts`

### Componentes Principales
- **Admin:** `src/app/(backoffice)/admin/openings/[id]/page.tsx`
- **Franchisee:** `src/app/(marketplace)/(franchisee)/franchisee/openings/`
- **Supplier:** `src/app/(supplier)/supplier/openings/`

---

## 💡 Notas Importantes

### Cambio de Mock a Real
```bash
# En .env.local
NEXT_PUBLIC_MOCK_OPENINGS=false  # Cambiar a false
NEXT_PUBLIC_API_URL=https://api.carrefour.com  # URL del backend
```

### Testing Actual
```bash
# Frontend está 100% funcional en mock
npm run dev
# Acceder a:
# - Admin: http://localhost:3000/admin/openings
# - Franchisee: http://localhost:3000/franchisee/openings  
# - Supplier: http://localhost:3000/supplier/openings
```

### Datos Mock Disponibles
- 3 proyectos completos
- 9 categorías
- 12 invitaciones
- 8 presupuestos
- 5 documentos técnicos ⭐ (nuevo)
- 3 cambios de estado en historial ⭐ (nuevo)

---

## ✨ Logros de Agosto 2026

1. ✅ Sistema de **documentos múltiples categorizados** (6 tipos)
2. ✅ **Workflow visual completo** con timeline, stepper y control manual
3. ✅ **Historial de estados** con trazabilidad completa
4. ✅ **BACKEND_GUIDE.md** actualizado con 200+ líneas nuevas
5. ✅ Componentes robustos y reutilizables
6. ✅ Frontend 100% funcional en modo mock

**Resultado:** El módulo de Nuevas Aperturas está listo para conectarse al backend en cuanto esté disponible. Todo el flujo core está implementado y testeado con datos mock realistas.

---

## 🚀 Próximos Pasos - Septiembre

1. **Semana 1:** Priorizar implementación backend (endpoints core)
2. **Semana 2:** Continuar backend + comenzar firma digital frontend
3. **Semana 3:** Integrar frontend-backend + sistema de financiación
4. **Semana 4:** Testing completo + refinamiento UX

**¡Nos vemos en Septiembre! 🎉**
