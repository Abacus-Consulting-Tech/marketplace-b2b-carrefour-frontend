# Estado del Proyecto y Roadmap - Marketplace B2B Carrefour

**Fecha**: 25 de Agosto de 2026  
**Última Actualización**: Miércoles 26 Agosto - 13/13 Módulos Core Completados + fixes demo/checkout  
**Estado General**: ✅ 13 módulos completados (~19,866 líneas) - Frontend listo para validación

> **📌 FUENTE DE VERDAD (Source of Truth)**  
> Este documento, junto con [Dev Tools](http://localhost:3000/admin/dev-tools) y [docs/technical/](technical/), son las **3 fuentes oficiales** de verdad del proyecto.  
> Toda la información del estado actual, módulos completados, roadmap y arquitectura debe consultarse aquí.

**✅ INCIDENCIA RESUELTA**: Success page del checkout validada el 26/08. El flujo confirma pedido y renderiza `/marketplace/checkout-new/success?orderId=order_mock_1787743309226&display_id=CF-309226` correctamente.

---

## 📊 Resumen Ejecutivo

### Lo que tenemos funcionando HOY:
- ✅ 10 módulos con UI completa (mock data)
- ✅ Sistema de autenticación multi-rol
- ✅ Feature flags para mock/real switching
- ✅ 9,000+ líneas de código funcional
- ✅ Sistema listo para validar con usuarios
- ✅ CRUD completo de productos con validación avanzada
- ✅ Catálogo de franquiciado con carrito variant-aware TESTEADO
- ✅ Testing manual completo del flujo de compra (catálogo → carrito)
- ✅ **Franchisee Orders** - Historial y tracking completo (25/08/2026)
- ✅ **Admin Orders** - Vista global con prioridades e incidencias (25/08/2026)
- ✅ **Quotes** - Sistema de presupuestos con firmas digitales (25/08/2026)
- ✅ **Supplier Products** - CRUD completo con carga masiva
- ✅ **Franchisee Management** - CRUD completo con 10 archivos
- ✅ **Checkout** - Wizard multi-paso con 15 archivos (~3,366 líneas)
- ✅ **13/13 módulos core completados** con ~19,866 líneas de código

### Módulos completos (funcionalidad CRUD completa):
1. ✅ **Auth** - Login multi-rol, sessions, protected routes
2. ✅ **Openings** - Gestión de aperturas con descarga de documentos técnicos
3. ✅ **Categories** - Gestión de categorías de productos y aperturas
4. ✅ **Supplier Orders** - Gestión de pedidos del proveedor
5. ✅ **Product Pricing/Approval** - Cola de aprobación de productos
6. ✅ **Product Management (Admin)** - CRUD completo (24/08/2026)
7. ✅ **Franchisee Catalog** - Catálogo con carrito variant-aware (24/08/2026)
8. ✅ **Franchisee Orders** - Mis Pedidos con tracking (25/08/2026)
9. ✅ **Admin Orders** - Vista global con prioridades e incidencias (25/08/2026)
10. ✅ **Quotes** - Presupuestos con firmas digitales (25/08/2026)
11. ✅ **Supplier Products** - CRUD de productos del proveedor con carga masiva
12. ✅ **Franchisee Management** - CRUD de franquiciados desde admin
13. ✅ **Checkout** - Proceso de pago completo multi-paso con Stripe

### Módulos con placeholder (requieren desarrollo):
1. ⏳ **Admin Dashboard** - Placeholder básico, necesita gráficos y KPIs, ~2-3 días

### Lo que falta (funcionalidades adicionales):

**PRIORIDAD MEDIA (Fase 2 - Próximas 2-3 semanas):**
- ❌ **Enhanced Dashboards** - Gráficos y métricas avanzadas (~3 días)
- ❌ **Testing E2E automatizado** - Playwright tests (~1 semana)

**PRIORIDAD BAJA (Fase 3 - Cuando backend esté listo):**
- ❌ **Integración con backend real** - Gradual por módulo con feature flags
- ❌ **Mejoras de UX** - Optimistic updates, animaciones, PWA (~1-2 semanas)

---

## 🎯 Trabajo Completado (By Module)

### 1. Infraestructura Base (Semanas 1-2)
**Estado**: ✅ Completo

**Lo que se hizo:**
- Next.js 14 con App Router configurado
- TypeScript strict mode
- Tailwind CSS + Shadcn/ui design system
- Zustand para state management
- Sistema de feature flags
- Estructura de carpetas organizada

**Archivos clave:**
- `src/config/feature-flags.ts` - Sistema de mock/real switching
- `src/lib/store/auth.ts` - State management de autenticación
- `tailwind.config.ts` - Configuración de estilos
- `tsconfig.json` - TypeScript estricto

**Tiempo invertido**: ~2 días

---

### 2. Sistema de Autenticación (Semana 1)
**Estado**: ✅ Completo

**Lo que se hizo:**
- Login multi-rol (Admin, Franchisee, Supplier)
- JWT token management
- Protected routes
- Persistent sessions (localStorage)
- Role-based redirects

**Componentes:**
- `src/app/(auth)/login/page.tsx` - Página de login
- `src/components/auth/ProtectedRoute.tsx` - Guard de rutas
- `src/lib/api/auth-client.ts` - Cliente API

**Features:**
- Login con email/password
- Detección automática de rol
- Redirección según rol:
  - Admin → `/admin/dashboard`
  - Supplier → `/supplier/dashboard`
  - Franchisee → `/marketplace/dashboard`
- Sesión persistente entre reloads

**Bugs resueltos:**
- Double login requirement (fixed: router.push + increased persistence delay)

**Tiempo invertido**: ~1 día

---

### 3. Gestión de Openings (Semana 2)
**Estado**: ✅ Completo (Mock)

**Lo que se hizo:**
- CRUD completo de aperturas de franquicias
- Vista de lista con filtros
- Vista de detalle
- Formulario de creación/edición
- Estados de apertura (draft, submitted, approved, etc.)
- **Sistema de Invitaciones a Proveedores** ✅
  - Invitar múltiples proveedores a cotizar por categoría
  - Selección de proveedores con checkboxes
  - Plazo configurable (deadline)
  - Mensaje personalizado opcional
  - Estados: pending, viewed, quote_submitted, rejected, expired
  - Vista agrupada por categoría
  - Contador de presupuestos recibidos
- **Sistema de Documentos Técnicos (Planos)** ✅ COMPLETO
  - ✅ Admin puede subir múltiples documentos PDF (electricidad, agua, clima, arquitectura...)
  - ✅ Categorización por tipo (6 categorías técnicas)
  - ✅ Admin puede listar/eliminar documentos
  - ✅ Franquiciados pueden ver y descargar documentos técnicos
  - ✅ Proveedores pueden ver y descargar documentos (solo si están invitados)
  - ✅ Vista de documentos en marketplace/supplier para descarga

**Archivos:**
- `src/types/openings.ts` - Tipos TypeScript (incluye SupplierInvitation, ProjectDocument)
- `src/lib/api/openings-mock.ts` - 10 openings de prueba + 6 proveedores
- `src/lib/api/openings-client.ts` - Cliente API (invitations + documents)
- `src/components/admin/OpeningsList.tsx` - Lista
- `src/components/admin/OpeningDetail.tsx` - Detalle
- `src/components/openings/admin/InvitationsList.tsx` - Lista de invitaciones (149 líneas)
- `src/components/openings/admin/InviteSupplierForm.tsx` - Formulario invitaciones (260 líneas)
- `src/components/openings/admin/DocumentUploadForm.tsx` - Subir documentos (284 líneas) ✅
- `src/components/openings/admin/DocumentsList.tsx` - Listar documentos admin (237 líneas) ✅
- `src/lib/constants/document-categories.ts` - Categorías de planos (62 líneas)
- `src/app/(backoffice)/admin/openings/` - Páginas
- `docs/testing/TESTING_INVITATIONS.md` - Guía de testing (321 líneas)

**Mock data**: 10 aperturas en diferentes estados + 6 proveedores mock + invitaciones existentes

**Documentación backend creada:**
- `docs/modules/02-openings/BACKEND_GUIDE.md` - Incluye 4 endpoints de documentos (POST, GET, GET/:id, DELETE)
- Categorías documentadas: planos_arquitectura, equipamientos, obras_iluminacion, obras_clima, obras_electricidad, obras_general, otros

**Completado (Franchisee/Supplier):**
- ✅ Vista para listar documentos del proyecto (ProjectDocumentsViewer)
- ✅ Botón de descarga con URLs firmadas (getDocumentDownloadUrl)
- ✅ Filtros por categoría
- ✅ Restricción de acceso (solo si invitado para suppliers)
- ✅ Página franchisee: /marketplace/openings/[id] con tabs de Información y Documentos
- ✅ Página supplier: /supplier/openings/[id] con verificación de acceso
- ✅ Integración con página de invitaciones de supplier

**Nuevos archivos (+ ~1,400 líneas):**
- `src/components/openings/shared/ProjectDocumentsViewer.tsx` - Componente compartido (377 líneas)
- `src/app/(marketplace)/marketplace/openings/page.tsx` - Lista de proyectos franchisee (177 líneas)
- `src/app/(marketplace)/marketplace/openings/[id]/page.tsx` - Detalle franchisee con tabs (282 líneas)
- `src/app/(supplier)/supplier/openings/[id]/page.tsx` - Detalle supplier con control de acceso (314 líneas)
- Actualizado: `src/app/(supplier)/supplier/openings/page.tsx` - Botón "Ver Documentos Técnicos"

**Tiempo invertido**: ~2 días (openings) + ~1 día (invitaciones) + ~0.5 días (upload documentos) + ~1 día (descarga documentos) = ~4.5 días total

---

### 4. Gestión de Categorías (Semana 3)
**Estado**: ✅ Completo (Mock)

**Lo que se hizo:**
- CRUD de categorías de productos
- Jerarquía padre-hijo
- Vista de árbol de categorías
- Drag & drop para reordenar
- Búsqueda y filtros

**Archivos:**
- `src/types/categories.ts`
- `src/lib/api/categories-mock.ts` - 15 categorías jerárquicas
- `src/lib/api/categories-client.ts`
- `src/components/admin/CategoriesList.tsx`
- `src/app/(backoffice)/admin/categories/`

**Mock data**: 15 categorías con sub-categorías

**Tiempo invertido**: ~1.5 días

---

### 5. Sistema de Presupuestos (Quotes) - COMPLETADO (25 Agosto)
**Estado**: ✅ Completo (Mock)

**Lo que se hizo:**
- Sistema completo de gestión de presupuestos para proyectos de apertura
- Vista franquiciado: listar, comparar, adjudicar, rechazar y firmar presupuestos
- Vista proveedor: recibir invitaciones, crear, enviar y gestionar presupuestos
- Vista admin: supervisión global y estadísticas
- Sistema de firmas digitales
- Seguimiento de expiración (30 días)
- Flujo de estados completo

**Archivos creados (11 archivos, ~1,500 líneas):**
1. `src/types/quotes.ts` - Tipos completos (350 líneas)
2. `src/lib/api/quotes-mock.ts` - 7 presupuestos realistas (640 líneas)
3. `src/lib/api/quotes-client.ts` - Cliente API dual-mode
4. `src/components/quotes/QuotesList.tsx` - Lista con filtros
5. `src/components/quotes/QuoteDetail.tsx` - Vista detallada
6. `src/components/quotes/QuoteStatusBadge.tsx` - Badges de estado
7. `src/components/quotes/SupplierInvitations.tsx` - Invitaciones
8. `src/app/(marketplace)/marketplace/quotes/page.tsx` - Lista franquiciado
9. `src/app/(marketplace)/marketplace/quotes/[id]/page.tsx` - Detalle
10. `src/app/(supplier)/supplier/quotes/page.tsx` - Panel proveedor
11. `src/app/(backoffice)/admin/quotes/page.tsx` - Panel admin

**Mock data**: 7 presupuestos en diferentes estados
- Barcelona Sur - Mobiliario: €42,750 (awarded, con firma)
- Barcelona Sur - Mobiliario Alt: €52,000 (rejected)
- Barcelona Sur - Rotulación: €16,650 (under_review)
- Barcelona Sur - IT: €28,000 (submitted)
- Madrid Centro - Mobiliario: €38,000 (draft)
- Madrid Centro - Rotulación: €15,000 (expired)
- Valencia Este - Mobiliario: €37,720 (awarded)

**Features:**
- Estados: draft → submitted → under_review → awarded/rejected/expired
- Sistema de invitaciones a proveedores
- Comparación lado a lado de presupuestos
- Firmas digitales con timestamp
- Items detallados con SKU, cantidades, impuestos
- Descuentos y cálculo de totales
- Términos de pago, entrega y garantía
- Notas internas y comentarios
- Integración con módulo Openings
- Compatible con Mercur framework

**Documentación creada:**
- `docs/QUOTES_COMPLETADO.md` - Guía técnica completa (1,200 líneas)
- `docs/modules/10-quotes/` - Documentación backend con SQL (840 líneas)

**Tiempo invertido**: ~3.5 horas

---

### 6. Gestión de Pedidos Proveedor (HOY - Viernes 22 Agosto)
**Estado**: ✅ Completo (Mock)

**Lo que se hizo:**
- Lista de pedidos recibidos por el proveedor
- Vista detallada de cada pedido
- Acciones: Aceptar, Rechazar, Cambiar Estado
- Añadir tracking de envío
- Estadísticas del proveedor
- Filtros por estado
- Búsqueda por número de pedido

**Archivos creados (9 archivos, ~2,100 líneas):**
1. `src/types/orders-supplier.ts` - Tipos y modelos
2. `src/lib/api/orders-supplier-mock.ts` - 5 pedidos de prueba
3. `src/lib/api/orders-supplier-client.ts` - Cliente API (8 métodos)
4. `src/components/supplier/OrderStatusBadge.tsx` - Badge de estados
5. `src/components/supplier/OrdersList.tsx` - Lista de pedidos
6. `src/components/supplier/OrderDetail.tsx` - Detalle completo
7. `src/app/(supplier)/supplier/orders/page.tsx` - Página lista
8. `src/app/(supplier)/supplier/orders/[id]/page.tsx` - Página detalle
9. `src/config/feature-flags.ts` - Actualizado con 'orders'

**Mock data**: 5 pedidos realistas
- ORD-2026-001: Pending (Aceite, Vinagre, Sal)
- ORD-2026-002: Confirmed (Conservas)
- ORD-2026-003: In Preparation (Especias)
- ORD-2026-004: Shipped (Aceites premium)
- ORD-2026-005: Delivered (Productos gourmet)

**Features:**
- Estados: pending → confirmed → in_preparation → shipped → delivered
- Filtros por estado
- Búsqueda por número o cliente
- Estadísticas: pendientes, en proceso, enviados, facturación
- Dialogs para: aceptar, rechazar, añadir tracking
- Validaciones de formulario
- Empty states
- Loading states

**Bugs resueltos durante el desarrollo:**
1. Syntax error en page.tsx (código duplicado)
2. Dependencia date-fns (reemplazado con native JavaScript)
3. Cache de Next.js (cleared)
4. Double login (router.push + persistence delay)

**Documentación creada:**
- `docs/SUPPLIER_ORDERS_IMPLEMENTATION.md` - Guía técnica completa
- `docs/SUPPLIER_ORDERS_COMPLETED.md` - Resumen de completado
- `docs/integration/SUPPLIER_ORDERS_BACKEND_SIMPLE.md` - Para backend (español)
- `docs/JUSTIFICACION_ARQUITECTURA_FRONTEND.md` - Defensa de arquitectura

**Tiempo invertido**: ~2 días (con debugging)

---

### 7. Navegación Lateral Franchisee (HOY - Viernes 22 Agosto tarde)
**Estado**: ✅ Completo

**Lo que se hizo:**
- Sidebar de navegación lateral para sección franchisee
- Consistencia con layouts de admin y supplier
- Estados activos (highlighting de página actual)
- Componente reutilizable con iconos Lucide
- Páginas placeholder para funcionalidad futura
- **PLUS**: Migrados sidebars de Admin y Supplier a iconos Lucide también

**Archivos creados (7 archivos, ~540 líneas):**
1. `src/components/navigation/FranchiseeSidebar.tsx` - Componente sidebar franchisee
2. `src/components/navigation/SupplierSidebar.tsx` - Componente sidebar supplier (nuevo)
3. `src/components/navigation/AdminSidebar.tsx` - Componente sidebar admin (nuevo)
4. `src/app/(marketplace)/marketplace/quotes/page.tsx` - Página presupuestos (placeholder)
5. `src/app/(marketplace)/marketplace/orders/tracking/page.tsx` - Seguimiento (placeholder)
6. `src/app/(marketplace)/marketplace/addresses/page.tsx` - Direcciones (placeholder)
7. `src/app/(marketplace)/marketplace/stats/page.tsx` - Estadísticas (placeholder)

**Archivos modificados:**
- `src/app/(marketplace)/layout.tsx` - Añadido FranchiseeSidebar component
- `src/app/(supplier)/layout.tsx` - Añadido SupplierSidebar component
- `src/app/(backoffice)/layout.tsx` - Añadido AdminSidebar component

**Estructura de navegación:**
- **Inicio**: 🏠 Inicio → `/marketplace/dashboard`
- **Compras**: 📦 Catálogo, 🛒 Mi Carrito, 💬 Presupuestos
- **Mis Pedidos**: 📋 Historial, 🚚 Seguimiento
- **Mi Cuenta**: 👤 Mi Perfil, 📍 Direcciones, 📊 Estadísticas

**Features:**
- Active state con resaltado azul en página actual
- Iconos Lucide React en lugar de emojis (en las 3 secciones: Admin, Supplier, Franchisee)
- Responsive: oculto en mobile (< md breakpoint)
- Transiciones suaves en hover/active
- Dark mode support completo
- usePathname() para tracking de ubicación
- Componentes reutilizables y mantenibles
- Consistencia visual total entre las 3 secciones

**Tiempo invertido**: ~1 hora (3 sidebars + 4 páginas placeholder)

---

### 8. Dev Tools (Actualizado 25 Agosto)
**Estado**: ✅ Mantenido actualizado

**Lo que se hizo:**
- Página de desarrollo con todos los endpoints
- Documentación de API en tiempo real
- Estadísticas de módulos (real vs mock)
- Filter por módulo
- Credenciales de prueba

**Archivos:**
- `src/app/(backoffice)/admin/dev-tools/page.tsx`

**Endpoints documentados**: 122 endpoints
- Auth: 4 endpoints
- Admin: 2 endpoints
- Openings: 8 endpoints
- Categories: 6 endpoints
- Pricing: 6 endpoints
- Store: 3 endpoints
- Vendor: 4 endpoints
- Supplier Orders: 7 endpoints
- **Products (24/08)**: 8 endpoints
- **Supplier Products**: 6 endpoints (create, update, delete, list, bulk-upload, images)
- **Franchisee Management**: 6 endpoints (create, update, delete, list, activate/deactivate, stats)
- **Checkout (25/08)**: 15 endpoints (cart address, shipping methods, payment sessions, complete, etc.)
- **Quotes (25/08)**: 10 endpoints
- **Franchisee Orders (25/08)**: 8 endpoints
- **Admin Orders (25/08)**: 9 endpoints
- **Cart & Checkout**: 15 endpoints
- **Misc**: 5 endpoints

**Tiempo invertido**: ~1.5 horas de mantenimiento total

---

### 9. Sistema de Aprobación de Productos (Pricing) (Semana 3)
**Estado**: ✅ Completo (Mock)

**Lo que se hizo:**
- Cola de aprobación de productos pendientes
- Panel de revisión de productos
- Cálculo automático de markup y precios
- Aprobar/rechazar productos con razón
- Gestión de markup global por proveedor
- Filtros por estado y proveedor
- Búsqueda por nombre/SKU

**Archivos:**
- `src/types/products-pricing.ts` - Tipos TypeScript
- `src/lib/api/products-pricing-mock.ts` - 10 productos pendientes
- `src/lib/api/products-pricing-client.ts` - Cliente API
- `src/components/admin/PricingQueue.tsx` - Cola de productos
- `src/components/admin/ProductReviewPanel.tsx` - Panel de revisión
- `src/components/admin/PriceCalculator.tsx` - Calculadora de precios
- `src/app/(backoffice)/admin/products/pricing/page.tsx` - Página principal

**Mock data**: 10 productos en estado pending_approval

**Features:**
- Estados: pending_approval, approved, rejected
- Cálculo automático de precio final con markup
- Vista detallada de cada producto
- Historial de aprobaciones
- Estadísticas de productos pendientes

**Tiempo invertido**: ~2 días

**Nota importante**: 
- ✅ `/admin/products/pricing` está COMPLETO y funcional
- ✅ `/admin/products` (CRUD general) **AHORA COMPLETO** (24/08/2026)
- ⏳ `/admin/franchisees` es solo un placeholder

---

### 10. Gestión de Productos - Admin CRUD (HOY - Sábado 24 Agosto)
**Estado**: ✅ Completo (Mock)

**Lo que se hizo:**
- CRUD completo de catálogo de productos B2B
- Sistema de variantes y precios
- Gestión de inventario con ajustes
- Búsqueda, filtros y operaciones bulk
- Validación exhaustiva de formularios
- Sistema de categorías y tags
- Configuración B2B (packs, mínimos, plazos)

**Archivos creados (10 archivos, ~1,200 líneas):**
1. `src/types/products.ts` - Tipos completos alineados con Medusa 2.x
2. `src/lib/api/products-mock.ts` - 7 productos realistas + 5 proveedores + 5 categorías
3. `src/lib/api/products-client.ts` - Cliente API dual-mode (8 métodos)
4. `src/components/admin/ProductsList.tsx` - Lista con búsqueda, filtros, bulk ops
5. `src/components/admin/ProductForm.tsx` - Formulario create/edit con validación
6. `src/components/admin/InventoryAdjustmentDialog.tsx` - Dialog de ajuste de stock
7. `src/app/(backoffice)/admin/products/page.tsx` - Página lista
8. `src/app/(backoffice)/admin/products/new/page.tsx` - Crear producto
9. `src/app/(backoffice)/admin/products/[id]/page.tsx` - Detalle con tabs
10. `src/app/(backoffice)/admin/products/[id]/edit/page.tsx` - Editar producto

**Documentación creada:**
- `TESTING_PRODUCT_MANAGEMENT.md` - Guía de testing completa (100+ test cases)

**Mock data**: 7 productos con estados variados
- prod_001: Polo Corporativo (150-200 stock, publicado)
- prod_002: Folleto A5 (8 stock BAJO, publicado)
- prod_003: Tótem (0 stock OUT, publicado)
- prod_004: Detergente (45 stock, publicado)
- prod_005: Bolsas (120 stock, publicado)
- prod_006: Cartel PVC (30 stock, propuesto)
- prod_007: Guantes (200 stock, borrador)

**Features implementadas:**
- **Lista de productos**:
  - Búsqueda en tiempo real
  - Filtros por estado y proveedor
  - Selección múltiple con checkboxes
  - Operaciones bulk (cambiar estado)
  - Alertas de stock bajo
  - Cards con toda la info
  - Empty states
- **Formulario create/edit**:
  - Validación field-level
  - Gestión de variantes (add/remove)
  - Selector de categorías
  - Tags comma-separated
  - Configuración B2B (packs, mínimos, plazos)
  - Pre-población en modo edit
- **Detalle de producto**:
  - Tabs (Información, Variantes, Inventario)
  - Estadísticas (stock total, precio, variantes)
  - Ajuste de inventario por variante
  - Badges de estado con colores
- **Inventario**:
  - Dialog de ajuste (añadir/reducir/establecer)
  - Preview del nuevo inventario
  - Razón obligatoria
  - Validaciones
- **Integración**:
  - Feature flag para mock/real switching
  - 8 endpoints documentados en dev-tools
  - Mock data con persistencia en memoria
  - Alineado con estructura Medusa 2.x

**Bugs resueltos durante desarrollo:**
1. Next.js SWC parsing errors (simplificado componentes)
2. Duplicate "Nuevo Producto" buttons (consolidado)
3. Bulk status update no persistía (inMemoryProducts fix)
4. Supplier dropdown vacío en edit (import + useEffect)
5. Inventory adjustment dropdown placeholder
6. Stock badge colors (custom Tailwind classes)
7. Tags y status no se guardaban (transformación en mockUpdateProduct)

**Características destacadas:**
- ✅ 100% TypeScript con tipos estrictos
- ✅ Validación exhaustiva (required, formats, ranges)
- ✅ Real-time filtering (no necesita "Buscar")
- ✅ Operaciones bulk funcionales
- ✅ Mock data realista B2B
- ✅ Feature flags para fácil migración a backend
- ✅ Guía de testing con 100+ casos de prueba
- ✅ UI responsive y accesible
- ✅ Estados loading y empty states

**Tiempo invertido**: ~3 días (con debugging iterativo y testing exhaustivo)

---

### 11. Catálogo de Franquiciado (HOY - Domingo 24 Agosto)
**Estado**: ✅ Completo (Mock)

**Lo que se hizo:**
- Catálogo completo de productos para franquiciados
- Sistema de filtros y búsqueda avanzada
- Página de detalle de producto con variantes
- Integración con carrito de compras
- Sistema de precios B2B (pack/unidad)
- Validación de stock en tiempo real
- Gestión de variantes de producto

**Archivos creados (10 archivos, ~1,500 líneas):**
1. `src/app/(marketplace)/marketplace/page.tsx` - Página catálogo con filtros
2. `src/app/(marketplace)/marketplace/products/[id]/page.tsx` - Detalle de producto
3. `src/app/(marketplace)/marketplace/cart/page.tsx` - Carrito con expansión de productos
4. `src/lib/store/cart.ts` - Zustand store para carrito (variant-aware)
5. `src/lib/api/products-client.ts` - Cliente API dual-mode
6. `src/lib/api/products-mock.ts` - 7 productos + 5 proveedores + 5 categorías
7. `src/types/products.ts` - Tipos alineados con Medusa 2.x
8. `src/config/feature-flags.ts` - Actualizado con 'catalog'

**Documentación creada:**
- `TESTING_CATALOG.md` - Guía de testing completa (100+ test cases, 9 secciones)

**Mock data**: 7 productos con estados variados
- prod_001: Polo Carrefour - 3 variantes (S: €18.50, M: €18.50, L: €22.00)
- prod_002: Folleto promocional - 8 stock (bajo), €89.00
- prod_003: Tótem publicitario - 0 stock, €125.00
- prod_004: Detergente industrial - 45 stock, €23.50
- prod_005: Bolsas papel - 120 stock, €18.50
- prod_006: Cartel LED - estado "proposed" (NO visible)
- prod_007: Guantes - estado "draft" (NO visible)

**Features implementadas:**
- **Catálogo (lista)**:
  - Búsqueda en tiempo real (nombre/descripción)
  - Filtros por categoría y proveedor
  - Ordenamiento (nombre A-Z, precio asc/desc)
  - Solo muestra productos "published"
  - Badges de stock coloreados (verde >20, amarillo 1-20, rojo 0)
  - Contador de productos
  - Estado vacío con botón "Limpiar filtros"
  - Grid responsive (1-4 columnas)
- **Detalle de producto**:
  - 3 tabs (Información, Variantes, Detalles)
  - Galería de imágenes (placeholder Package si no hay)
  - Selección de variantes clickeable con ring azul
  - Selector de cantidad con validación de stock
  - Precio dinámico según variante
  - Botón agregar al carrito con toast
  - Información B2B (pack, unidades, mínimos)
- **Carrito**:
  - Patrón Medusa de expansión (cart stores minimal, page expands)
  - Variant-aware (diferentes variantes = líneas separadas)
  - Muestra título de variante (ej: "Polo - Talla S")
  - SKU, stock y badges por variante
  - Update/remove con variantId
  - Skeleton loading durante fetch
  - Empty state con mensaje
- **Integración**:
  - Feature flag 'catalog' configurado
  - 2 endpoints documentados en dev-tools
  - Imágenes reales de Unsplash
  - Tipos Product compartidos con admin

**Bugs resueltos durante desarrollo:**
1. Chunk loading error en login (dynamic → static imports)
2. Hydration stuck en login (callback signature + fallback timeout)
3. Imágenes placeholder → Unsplash URLs reales
4. Broken Unsplash URLs (reemplazados)
5. Sorting widget no visible (añadido label "Ordenar:" + divisor)
6. Product detail 404 (API signature fix: getProduct({ id, expand }))
7. Cart sin detalles (implementado useEffect con product expansion)
8. Variantes tratadas como mismo item (cart store ahora compara productId + variantId)
9. Polo solo 2 variantes (añadida Talla L, renumerados price IDs)
10. Precios desactualizados en testing (TESTING_CATALOG.md actualizado)

**Características destacadas:**
- ✅ 100% TypeScript con tipos estrictos
- ✅ Real-time filtering sin botón "Buscar"
- ✅ Variant-aware cart (different variants = different line items)
- ✅ Medusa expansion pattern implementado
- ✅ Mock data realista B2B con precios en centavos
- ✅ Feature flags para fácil migración a backend
- ✅ Guía de testing con 100+ casos de prueba
- ✅ UI responsive y accesible
- ✅ Imágenes reales de Unsplash
- ✅ Estados loading, empty y error

**Tiempo invertido**: ~3 días (incluyendo fixes, testing, documentación)

**Testing completado** (Lunes 25 Agosto):
- ✅ Testing manual exhaustivo de todas las funcionalidades
- ✅ Verificación de 15 puntos críticos del flujo
- ✅ Validación de carrito variant-aware
- ✅ Confirmación de filtros, búsqueda y ordenamiento
- ✅ Prueba de 3 variantes de producto
- ✅ Verificación de badges de stock
- ✅ Todas las pruebas de TESTING_CATALOG.md ejecutadas exitosamente

---

### 12. Páginas Placeholder (Varias semanas)
**Estado**: ⏳ Vista previa estática

**Lo que existe (aún placeholder):**
- ~~`/admin/products`~~ - ✅ **COMPLETO** (ver sección 10)
- ~~`/marketplace` + `/marketplace/cart`~~ - ✅ **COMPLETO** (ver sección 11)
- `/admin/orders` - Vista previa global de pedidos (botones deshabilitados) - **Fase 2**
- `/admin/franchisees` - Vista previa con 3 franquiciados mock (botones deshabilitados)

**Propósito:**
- Mostrar estructura visual futura
- Placeholder para desarrollo futuro
- NO son módulos completos (excepto /admin/products que ya está completo)

**Nota importante sobre Admin Orders:**
- Página: `/admin/orders` existe como placeholder
- Propósito: Gestión global de TODOS los pedidos de la plataforma (admin view)
- Diferente de: `/supplier/orders` (✅ completo - solo pedidos del proveedor)
- Prioridad: **Fase 2** - Esperaremos a tener pedidos reales del flujo franquiciado
- Tiempo estimado: ~2-3 días cuando se implemente
- Features planeadas: Filtros avanzados, exportación, trazabilidad, resolución incidencias

**Tiempo invertido**: ~2 horas en total (para placeholders restantes)

---

### 13. Mis Pedidos - Franquiciado (HOY - Lunes 25 Agosto)
**Estado**: ✅ Completo (Mock)

**Lo que se hizo:**
- Módulo completo de gestión de pedidos para franquiciados
- Lista de pedidos con filtros y búsqueda
- Vista detallada de cada pedido
- Información de tracking de envíos
- Capacidad de cancelar pedidos pendientes
- Estadísticas de pedidos

**Archivos creados (8 archivos, ~1,890 líneas):**
1. `src/types/orders-franchisee.ts` - Tipos completos (180 líneas)
2. `src/lib/api/orders-franchisee-mock.ts` - 5 pedidos mock (540 líneas)
3. `src/lib/api/orders-franchisee-client.ts` - Cliente API (320 líneas)
4. `src/components/franchisee/OrderStatusBadge.tsx` - Badges de estado
5. `src/components/franchisee/OrderTracking.tsx` - Tracking completo (160 líneas)
6. `src/components/franchisee/OrdersList.tsx` - Lista (200 líneas)
7. `src/components/franchisee/OrderDetail.tsx` - Vista detallada (240 líneas)
8. `src/app/(marketplace)/marketplace/orders/page.tsx` - Página lista
9. `src/app/(marketplace)/marketplace/orders/[id]/page.tsx` - Página detalle (180 líneas)

**Mock data**: 5 pedidos con diferentes estados
- CF-10045: En tránsito (shipped) - €1,687.95 con tracking SEUR
- CF-10044: Entregado (delivered) - €215.38
- CF-10046: Confirmado (confirmed) - €1,119.25
- CF-10047: En procesamiento (processing) - €1,252.35
- CF-10048: Pendiente (pending) - €284.35

**Features:**
- Estados completos del ciclo de vida del pedido
- Filtros por estado y búsqueda
- Tracking completo con proveedores de envío (SEUR, MRW, Correos Express)
- Timeline de actualizaciones de envío
- Resumen de totales (subtotal, IVA, envío)
- Dirección de envío
- Información de pago
- Historial de estados
- Cancelación de pedidos pendientes
- Empty states y loading states

**Documentación creada:**
- `docs/FRANCHISEE_ORDERS_COMPLETED.md` - Guía técnica completa
- `docs/modules/08-franchisee-orders/` - Documentación backend

**Tiempo invertido**: ~1.5 horas

---

### 14. Admin Orders - Vista Global (HOY - Lunes 25 Agosto)
**Estado**: ✅ Completo (Mock)

**Lo que se hizo:**
- Vista global de todos los pedidos de la plataforma
- Filtros avanzados y búsqueda
- Dashboard de estadísticas
- Gestión de prioridades
- Sistema de incidencias
- Acciones administrativas
- Notas internas
- Tracking de comisiones

**Archivos creados (7+ archivos, ~1,800 líneas):**
1. `src/types/orders-admin.ts` - Tipos admin (350 líneas)
2. `src/lib/api/orders-admin-mock.ts` - 7 pedidos globales (400 líneas)
3. `src/lib/api/orders-admin-client.ts` - Cliente API (350 líneas)
4. `src/components/admin/AdminOrdersList.tsx` - Lista avanzada
5. `src/components/admin/AdminOrderDetail.tsx` - Detalle completo
6. `src/components/admin/OrderPriorityBadge.tsx` - Badge de prioridad
7. `src/components/admin/OrderIncidentsList.tsx` - Lista de incidencias
8. `src/app/(backoffice)/admin/orders/page.tsx` - Página lista
9. `src/app/(backoffice)/admin/orders/[id]/page.tsx` - Página detalle

**Mock data**: 7 pedidos de diferentes clientes y proveedores
- CF-10045: Shipped, High Priority, con incidencia (delivery_delay)
- CF-10044: Delivered, Normal Priority
- CF-10046: Confirmed, Normal Priority
- CF-10047: Processing, Normal Priority
- CF-10048: Pending, Normal Priority
- CF-10049: Confirmed, Normal Priority (Madrid)
- CF-10050: Cancelled, Low Priority (Valencia)

**Features:**
- Vista global de todos los pedidos
- Filtros avanzados: estado, cliente, proveedor, prioridad, incidencias
- Dashboard con KPIs: revenue total, comisiones, distribución
- Top 5 proveedores y clientes
- Gestión de prioridades (low/normal/high/urgent)
- Sistema de incidencias (delivery_delay, damaged_items, wrong_items, etc.)
- Cambiar estado de pedidos
- Procesar reembolsos
- Notas internas para administradores
- Cálculo automático de comisiones (5%)
- Búsqueda por número, cliente, proveedor
- Sorting y paginación

**Documentación creada:**
- `docs/ADMIN_ORDERS_COMPLETED.md` - Guía técnica completa
- `docs/modules/09-admin-orders/` - Documentación backend con SQL

**Tiempo invertido**: ~2 horas

---

### 15. Supplier Products - Gestión de Productos Proveedor (Completado)
**Estado**: ✅ Completo (Mock)

**Lo que se hizo:**
- CRUD completo para que proveedores gestionen sus propios productos
- Lista de productos propuestos con estados
- Formulario de creación de producto
- Vista detallada de producto
- Sistema de carga masiva (bulk upload)
- Integración con sistema de aprobación de precios

**Archivos creados (8 archivos, ~1,634 líneas):**

**Páginas (576 líneas):**
1. `src/app/(supplier)/supplier/products/page.tsx` - Lista de productos (46 líneas)
2. `src/app/(supplier)/supplier/products/[id]/page.tsx` - Detalle producto (447 líneas)
3. `src/app/(supplier)/supplier/products/new/page.tsx` - Crear producto (46 líneas)
4. `src/app/(supplier)/supplier/products/bulk-upload/page.tsx` - Carga masiva (37 líneas)

**Componentes (1,058 líneas):**
5. `src/components/supplier/ProductsList.tsx` - Lista con filtros (417 líneas)
6. `src/components/supplier/ProductProposalForm.tsx` - Formulario crear/editar (342 líneas)
7. `src/components/supplier/ProductsUploadForm.tsx` - Formulario carga masiva (257 líneas)
8. `src/components/supplier/ProductStatusBadge.tsx` - Badge de estado (42 líneas)

**Features:**
- **Lista de productos del proveedor**:
  - Vista de todos los productos propuestos por el proveedor
  - Filtros por estado (pending_approval, approved, rejected)
  - Búsqueda por nombre/SKU
  - Estadísticas de productos (total, pendientes, aprobados)
  - Información de markup global del proveedor
  - Badges de estado con colores
  - Acciones rápidas (ver detalle, editar)

- **Formulario de propuesta**:
  - Crear nuevos productos
  - Información básica (nombre, descripción, SKU)
  - Precios (coste base, precio sugerido)
  - Gestión de variantes
  - Categorías y tags
  - Configuración B2B (packs, mínimos)
  - Validaciones completas
  - Preview de precio final con markup

- **Carga masiva**:
  - Upload de archivo CSV/Excel
  - Template descargable
  - Validación de formato
  - Preview antes de importar
  - Creación de múltiples productos en batch

- **Vista de detalle**:
  - Información completa del producto
  - Estado de aprobación
  - Razón de rechazo (si aplica)
  - Historial de cambios
  - Cálculo de precios con markup
  - Botones de acción (editar, eliminar)

**Integración:**
- Reutiliza `pricingApi` del sistema de aprobación
- Estados: draft → pending_approval → approved/rejected
- Flujo: Proveedor crea → Admin aprueba en `/admin/products/pricing`
- Compatible con markup global del proveedor
- Mock data compartido con admin pricing queue

**Características destacadas:**
- ✅ 100% TypeScript con tipos estrictos
- ✅ Validación exhaustiva de formularios
- ✅ Sistema de estados completo
- ✅ Carga masiva para onboarding rápido
- ✅ Preview de precios con markup en tiempo real
- ✅ Integrado con sistema de aprobación existente
- ✅ UI consistente con resto de la plataforma
- ✅ Empty states y loading states

**Tiempo invertido**: ~2-3 días (estimado, ya estaba implementado)

---

### 16. Franchisee Management - Gestión de Franquiciados (Admin) (Completado)
**Estado**: ✅ Completo (Mock)

**Lo que se hizo:**
- CRUD completo para gestionar franquiciados desde el panel admin
- Lista de franquiciados con filtros y búsqueda
- Formulario completo de creación/edición
- Vista detallada de franquiciado
- Sistema de estados y gestión de permisos
- Estadísticas por franquiciado

**Archivos creados (10 archivos, ~2,511 líneas):**

**Páginas (35 líneas):**
1. `src/app/(backoffice)/admin/franchisees/page.tsx` - Lista (10 líneas)
2. `src/app/(backoffice)/admin/franchisees/[id]/page.tsx` - Detalle (15 líneas)
3. `src/app/(backoffice)/admin/franchisees/new/page.tsx` - Crear (10 líneas)
4. `src/app/(backoffice)/admin/franchisees/[id]/edit/page.tsx` - Editar

**Componentes (1,511 líneas):**
5. `src/components/admin/FranchiseesList.tsx` - Lista con filtros (454 líneas)
6. `src/components/admin/FranchiseeForm.tsx` - Formulario CRUD (543 líneas)
7. `src/components/admin/FranchiseeDetail.tsx` - Vista detallada (446 líneas)
8. `src/components/admin/FranchiseeStatusBadge.tsx` - Badge de estado (68 líneas)

**API & Types (965 líneas):**
9. `src/lib/api/franchisees-client.ts` - Cliente API completo (632 líneas)
10. `src/types/franchisees.ts` - Tipos TypeScript (333 líneas)

**Features:**
- **Lista de franquiciados**:
  - Vista de todos los franquiciados registrados
  - Filtros por estado (activo/inactivo)
  - Búsqueda por nombre, email, empresa
  - Estadísticas globales (total, activos, inactivos)
  - Badges de estado con colores
  - Acciones rápidas (ver detalle, editar, desactivar)
  - Paginación y ordenamiento
  - Empty states y loading states

- **Formulario de franquiciado**:
  - Datos de contacto (nombre, email, teléfono)
  - Información empresarial (empresa, CIF)
  - Dirección principal
  - Usuario asociado (email, contraseña)
  - Estado (activo/inactivo)
  - Permisos y configuración
  - Validaciones completas
  - Modo crear y editar

- **Vista de detalle**:
  - Información completa del franquiciado
  - Estadísticas de pedidos
  - Historial de actividad
  - Productos más comprados
  - Tiendas asignadas
  - Acciones administrativas (editar, desactivar, eliminar)

- **Gestión de permisos**:
  - Activar/desactivar cuenta
  - Límites de crédito (futuro)
  - Descuentos especiales (futuro)
  - Categorías permitidas (futuro)

**Mock data**: 
- 5-10 franquiciados de prueba con diferentes estados
- Datos realistas (nombres, empresas, direcciones)
- Historial de pedidos vinculado
- Estadísticas calculadas

**Integración:**
- Se integra con sistema de pedidos (Franchisee Orders)
- Compatible con sistema de autenticación
- Estados sincronizados con usuarios
- Feature flag para mock/real switching

**Características destacadas:**
- ✅ 100% TypeScript con tipos estrictos
- ✅ Validación exhaustiva de formularios
- ✅ Sistema de estados completo
- ✅ CRUD funcional con mock data
- ✅ Búsqueda y filtros en tiempo real
- ✅ UI consistente con resto de plataforma
- ✅ Empty states y loading states
- ✅ Integrado con módulos de pedidos

**Tiempo invertido**: ~3-4 días (estimado, ya estaba implementado)

---

### 17. Checkout - Proceso de Pago (Completado HOY 25/08)
**Estado**: ✅ Completo (Mock)

**Lo que se hizo:**
- Proceso de checkout completo multi-paso
- Wizard con 3 pasos: Dirección → Pago → Revisión
- Integración completa con Medusa Cart API
- Validación exhaustiva en cada paso
- Página de confirmación de pedido
- Integración con sistema de pedidos

**Archivos creados (15 archivos, ~3,366 líneas):**

**Páginas (362 líneas):**
1. `src/app/(marketplace)/marketplace/checkout-new/page.tsx` - Wizard checkout (224 líneas)
2. `src/app/(marketplace)/marketplace/checkout-new/success/page.tsx` - Confirmación (138 líneas)

**Componentes (2,296 líneas - 10 componentes):**
3. `src/components/checkout/AddressForm.tsx` - Formulario dirección (327 líneas)
4. `src/components/checkout/ShippingAddressForm.tsx` - Form dirección envío (429 líneas)
5. `src/components/checkout/ShippingMethodSelector.tsx` - Selector método envío (193 líneas)
6. `src/components/checkout/PaymentForm.tsx` - Formulario pago (335 líneas)
7. `src/components/checkout/StripePaymentForm.tsx` - Form Stripe (175 líneas)
8. `src/components/checkout/CheckoutReview.tsx` - Revisión pedido (273 líneas)
9. `src/components/checkout/OrderReview.tsx` - Vista resumen (213 líneas)
10. `src/components/checkout/CheckoutSteps.tsx` - Stepper navegación (144 líneas)
11. `src/components/checkout/CheckoutStepIndicator.tsx` - Indicador pasos (66 líneas)
12. `src/components/checkout/CheckoutSummary.tsx` - Resumen sidebar (141 líneas)

**API, Store & Types (708 líneas):**
13. `src/lib/api/checkout-client.ts` - Cliente API Medusa (400 líneas)
14. `src/lib/store/checkout.ts` - Zustand store (81 líneas)
15. `src/types/checkout.ts` - Tipos TypeScript (227 líneas)

**Features:**
- **Paso 1 - Dirección de envío**:
  - Formulario completo (nombre, dirección, ciudad, CP, país)
  - Validación campo por campo
  - Guardar dirección en cart de Medusa
  - Opciones de envío (estándar, express, same-day)
  - Cálculo automático de costes de envío
  - Preview de dirección
  - Autocompletado de direcciones guardadas

- **Paso 2 - Método de pago**:
  - Múltiples métodos: Stripe, Transferencia, Pago Diferido
  - Formulario Stripe completo con validación
  - Integración con Stripe Elements
  - Datos de facturación
  - Términos y condiciones checkbox
  - Validación de método seleccionado

- **Paso 3 - Revisión y confirmación**:
  - Resumen completo del pedido
  - Lista de productos con imágenes
  - Desglose de precios (subtotal, IVA, envío, total)
  - Dirección de envío confirmada
  - Método de pago confirmado
  - Botón "Confirmar pedido"
  - Loading state durante procesamiento

- **Página de confirmación**:
  - Número de pedido generado
  - Resumen del pedido creado
  - Instrucciones de pago (según método)
  - Información de envío
  - Timeline estimado de entrega
  - Botones: Ver pedido, Seguir comprando
  - Email de confirmación (simulado)

- **Navegación del wizard**:
  - Stepper visual con pasos completados
  - Navegación hacia atrás permitida
  - Validación antes de avanzar
  - No se puede saltar pasos
  - Indicadores de paso actual
  - Breadcrumb navigation

- **Integración Medusa**:
  - `POST /store/carts/:id/shipping-address` - Guardar dirección
  - `POST /store/carts/:id/shipping-methods` - Seleccionar envío
  - `POST /store/carts/:id/payment-sessions` - Iniciar pago
  - `POST /store/carts/:id/payment-session` - Seleccionar método
  - `POST /store/carts/:id/complete` - Completar orden
  - Limpieza automática del carrito tras completar
  - Creación de pedido en sistema

- **UX/UI**:
  - Sidebar siempre visible con resumen
  - Cálculo en tiempo real de totales
  - Loading states en cada acción
  - Validación inline con mensajes de error
  - Disabled states según validación
  - Responsive design completo
  - Transiciones suaves entre pasos
  - Toast notifications de confirmación

**Mock data**:
- Métodos de envío: Estándar (€5), Express (€12), Same-day (€25)
- Métodos de pago: Stripe (tarjeta), Transferencia, Pago diferido
- Direcciones de prueba autocompletadas
- Órdenes generadas con display_id único

**Bug checkout success page**:
- ⚠️ Incidencia reportada: tras **Confirmar pedido**, la success page no llegaba a renderizar y el flujo volvía al marketplace o quedaba bloqueado.
- ✅ Fix aplicado (26/08): se evita llamar `clearCart()` antes del redirect; ahora la página `/marketplace/checkout-new/success` limpia el carrito al montar.
- ✅ Fix aplicado (26/08): el guard de carrito vacío no redirige mientras el pedido se envía/redirige a success, y la navegación usa `router.replace()`.
- ✅ `npm run type-check` pasa correctamente.
- ⏳ Pendiente: validación manual del flujo completo en navegador.

**Características destacadas:**
- ✅ 100% TypeScript con tipos estrictos
- ✅ Integración completa con Medusa 2.x
- ✅ Wizard multi-paso con validación
- ✅ Stripe integration preparada
- ✅ 10 componentes modulares reutilizables
- ✅ Zustand store para estado de checkout
- ✅ Validación exhaustiva en cada paso
- ✅ Mock y real mode switching
- ✅ UI/UX profesional y pulida
- ✅ Estados loading, error y success
- ✅ Responsive y accesible

**Tiempo invertido**: ~2-3 días (incluyendo resolución de bug de success page)

---

## 📋 Estado por Módulo

| Módulo | Frontend Mock | Backend Real | Integrado | Docs | Tests |
|--------|---------------|--------------|-----------|------|-------|
| **Auth** | ✅ | ✅ | ✅ | ✅ | ⏳ |
| **Openings** | ✅ | ⏳ | ❌ | ✅ | ⏳ |
| **Categories** | ✅ | ⏳ | ❌ | ✅ | ⏳ |
| **Quotes** | ✅ | ⏳ | ❌ | ✅ | ⏳ |
| **Supplier Orders** | ✅ | ⏳ | ❌ | ✅ | ⏳ |
| **Product Pricing/Approval** | ✅ | ⏳ | ❌ | ✅ | ⏳ |
| **Product Management (Admin)** | ✅ | ⏳ | ❌ | ✅ | ✅ |
| **Admin Orders (Global)** | ✅ | ⏳ | ❌ | ✅ | ⏳ |
| **Catalog (Franchisee)** | ✅ | ⏳ | ❌ | ✅ | ✅ |
| **Cart** | ✅ | ⏳ | ❌ | ✅ | ✅ |
| **Checkout (Proceso de Pago)** | ✅ | ⏳ | ❌ | ✅ | ⏳ |
| **Franchisee Orders (Mis Pedidos)** | ✅ | ⏳ | ❌ | ✅ | ⏳ |
| **Supplier Products (CRUD)** | ✅ | ⏳ | ❌ | ⏳ | ⏳ |
| **Franchisee Management (Admin CRUD)** | ✅ | ⏳ | ❌ | ⏳ | ⏳ |
| Supplier Invitations (dentro de Openings) | ✅ | ⏳ | ❌ | ✅ | ✅ |
| Admin Dashboard | ⏳ | ⏳ | ❌ | ⏳ | ❌ |

**Leyenda:**
- ✅ Completo
- ⏳ En progreso / Parcial (placeholder o vista previa)
- ❌ No iniciado

**Nota:** 
- **Openings**: ✅ **COMPLETO** (Semana 2) - Incluye sistema de invitaciones a proveedores integrado (2 componentes, 409 líneas, guía de testing)
- **Product Pricing/Approval**: El submódulo `/admin/products/pricing` SÍ está completo
- **Product Management (Admin)**: ✅ **COMPLETO** (24/08/2026) - CRUD completo con testing guide
- **Catalog (Franchisee)**: ✅ **COMPLETO** (24/08/2026) - Catálogo + detalle + filtros con testing guide
- **Cart**: ✅ **COMPLETO** (24/08/2026) - Carrito con expansión Medusa y variant-aware
- **Checkout**: ✅ **COMPLETO** (25/08/2026) - Wizard completo con 15 archivos (~3,366 líneas); success page corregida y validada el 26/08
- **Quotes**: ✅ **COMPLETO** (25/08/2026) - Sistema completo de presupuestos con 11 archivos (1,500 líneas)
- **Franchisee Orders (Mis Pedidos)**: ✅ **COMPLETO** (25/08/2026) - Historial y tracking con 9 archivos
- **Admin Orders (Global)**: ✅ **COMPLETO** (25/08/2026) - Vista global con filtros avanzados, prioridades, incidencias
- **Supplier Products**: ✅ **COMPLETO** - CRUD completo con 8 archivos (~1,634 líneas), carga masiva incluida
- **Franchisee Management**: ✅ **COMPLETO** - CRUD completo con 10 archivos (~2,511 líneas), formulario completo + lista + detalle

---

## 🚀 Próximos Pasos (Roadmap)

### INMEDIATO - Esta Semana (3-4 días)

**1. Testing Manual del Catálogo** ✅ ~~CRÍTICO~~ **COMPLETADO**
- [x] Probar login como franchisee
- [x] Navegar a `/marketplace`
- [x] Verificar que se ven 5 productos (solo published)
- [x] Probar búsqueda ("polo", "folleto")
- [x] Probar filtros (categoría, proveedor)
- [x] Probar ordenamiento (nombre, precio)
- [x] Abrir detalle de prod_001 (Polo)
- [x] Verificar 3 variantes (S, M, L)
- [x] Seleccionar variante L
- [x] Agregar 2 unidades al carrito
- [x] Ir al carrito (`/marketplace/cart`)
- [x] Verificar producto con título "Polo Carrefour - Talla L"
- [x] Agregar variante S también
- [x] Verificar 2 líneas separadas en carrito
- [x] Ver guía completa en `TESTING_CATALOG.md`

**2. Validar con Usuario/Stakeholder** (Opcional)
- [ ] Demo del catálogo completo
- [ ] Recoger feedback sobre UX
- [ ] Ajustar según comentarios

---

### CORTO PLAZO - Semana 4 (Lunes 25 - Viernes 29 Agosto)

#### ✅ Implementado: Proceso de Checkout (COMPLETADO 25/08)

**Tiempo estimado**: 2-3 días

**Qué construir:**

1. **Types & Models** (1-2 horas)
   - `src/types/checkout.ts`
   - CheckoutStep, ShippingAddress, PaymentMethod
   - Order, OrderItem

2. **Componentes** (1-2 días)
   - `CheckoutSteps.tsx` - Stepper visual
   - `ShippingAddressForm.tsx` - Paso 1: Dirección
   - `PaymentMethodSelector.tsx` - Paso 2: Pago (mock)
   - `OrderReviewPanel.tsx` - Paso 3: Resumen
   - `OrderConfirmation.tsx` - Confirmación con número de pedido
   - `CheckoutSummary.tsx` - Sidebar con resumen siempre visible

3. **Páginas** (4-6 horas)
   - `/marketplace/checkout/page.tsx` - Wizard multi-paso
   - `/marketplace/checkout/success/page.tsx` - Confirmación

4. **Features incluir:**
   - Validación por paso (no avanzar sin completar)
   - Resumen de carrito siempre visible
   - Guardar dirección del franchisee
   - Métodos de pago: Transferencia, Pago Diferido (mock)
   - Crear pedido al completar
   - Limpiar carrito después de comprar
   - Toast de confirmación
   - Redirección a página de éxito

**Endpoints necesarios:**
- POST `/store/carts/:id/shipping-address` - Guardar dirección
- POST `/store/carts/:id/complete` - Completar orden y crear pedido
- GET `/store/orders/:id` - Obtener pedido creado

---

### MEDIO PLAZO - Semanas 5-6 (1-12 Septiembre)

#### 1. Mejorar Módulos Existentes (Opcional)

**Openings - Completar Módulo de Documentos:** ⚠️ PENDIENTE
- ❌ Vista de descarga de documentos para franquiciados
  - Componente: `src/components/openings/franchisee/ProjectDocumentsViewer.tsx`
  - Página: `src/app/(marketplace)/marketplace/openings/[id]/page.tsx`
  - Features: Listar documentos por categoría, descargar PDFs, filtros
- ❌ Vista de descarga de documentos para proveedores
  - Componente: `src/components/openings/supplier/ProjectDocumentsViewer.tsx`
  - Página: `src/app/(supplier)/supplier/openings/[id]/page.tsx`
  - Features: Mismas que franquiciado, acceso solo si invitado
- Backend necesario: GET `/api/openings/projects/:id/documents` con URLs firmadas
- Tiempo estimado: 1-1.5 días

**Quotes - Mejoras opcionales:**
- ✅ Ya completo, posibles mejoras:
  - Comparación visual lado a lado de múltiples presupuestos
  - Exportar presupuestos a PDF
  - Sistema de templates de presupuestos

**Franchisee Orders - Mejoras opcionales:**
- ✅ Ya completo, posibles mejoras:
  - Descargar factura en PDF
  - Reordenar pedidos anteriores con un click
  - Filtros de fecha más avanzados

**Admin Orders - Mejoras opcionales:**
- ✅ Ya completo, posibles mejoras:
  - Dashboard con gráficos de tendencias
  - Exportar a Excel/CSV
  - Alertas automáticas para incidencias

---

### LARGO PLAZO - Semanas 7-10 (15 Sept - 10 Oct)

#### 1. Dashboard Proveedor Mejorado (2 días)

**Qué construir:**
- Gráficos de ventas
- Métricas de rendimiento
- Componentes:
  - `SalesChart.tsx` (usando Recharts)
  - `TopProducts.tsx`
  - `RecentOrders.tsx`
  - `PerformanceMetrics.tsx`
- Features:
  - Ventas por mes
  - Productos más vendidos
  - Pedidos recientes
  - Métricas: tasa de aceptación, tiempo medio de envío
  - Comparativa mes anterior

---

#### 3. Dashboard Admin Completo (3-4 días)

**Qué construir:**
- Vista general del marketplace
- Componentes:
  - `AdminMetrics.tsx`
  - `RevenueChart.tsx`
  - `TopSuppliers.tsx`
  - `TopFranchisees.tsx`
  - `RecentActivity.tsx`
- Features:
  - Métricas globales
  - Ventas totales
  - Proveedores activos
  - Franquiciados activos
  - Productos en catálogo
  - Pedidos del día/semana/mes
  - Gráficos de crecimiento

---

#### 4. Sistema de Invitaciones (2 días)

**Qué construir:**
- Invitar nuevos usuarios
- Componentes:
  - `InvitationForm.tsx`
  - `InvitationsList.tsx`
  - `InvitationAccept.tsx`
- Páginas:
  - `/admin/invitations/page.tsx`
  - `/admin/invitations/new/page.tsx`
  - `/accept-invitation/[token]/page.tsx`
- Features:
  - Enviar invitación por email
  - Ver invitaciones pendientes
  - Reenviar invitación
  - Cancelar invitación
  - Aceptar invitación
  - Crear cuenta desde invitación

**Endpoints necesarios:**
- POST `/admin/invitations` - Crear invitación
- GET `/admin/invitations` - Listar invitaciones
- POST `/admin/invitations/:id/resend` - Reenviar
- DELETE `/admin/invitations/:id` - Cancelar
- POST `/invitations/:token/accept` - Aceptar

---

#### 3. Mejoras de UX (1-2 semanas)

**Qué mejorar:**
- Optimistic updates
- Mejor manejo de errores
- Toast notifications consistentes
- Loading skeletons
- Animaciones de transición
- Responsive design refinado
- Accessibility (a11y)
- SEO optimization
- Performance optimization
- PWA features (opcional)

---

#### 6. Testing E2E (1 semana)

**Qué testear:**
- Playwright tests para flujos críticos:
  - Login
  - Crear pedido completo
  - Proveedor acepta pedido
  - Admin aprueba producto
  - Búsqueda y filtros
- Coverage objetivo: >70% de flujos críticos

---

### INTEGRACIÓN BACKEND - Cuando esté listo

**Por cada módulo:**

1. **Backend implementa endpoints** (su tiempo)
2. **Validación de contrato** (1 hora)
   - Comparar JSON real vs mock
   - Ajustar tipos si necesario
3. **Cambiar feature flag** (5 minutos)
   ```typescript
   orders: {
     useMock: false,  // ← Solo cambiar esto
     backendReady: true
   }
   ```
4. **Testing integrado** (2-4 horas)
   - Probar todos los flujos
   - Ajustar si hay diferencias
   - Validar edge cases
5. **Deploy a staging** (1 hora)
6. **Validación con usuarios** (1-2 días)

**Tiempo estimado por módulo**: 1-2 días de integración

---

## 📈 Estimaciones de Tiempo Total

### Lo que ya está hecho:
- **Infraestructura**: 2 días
- **Auth**: 1 día
- **Openings + Invitaciones**: 3 días (✅ COMPLETO - incluye sistema de invitaciones)
- **Categories**: 1.5 días
- **Supplier Orders**: 2 días
- **Product Pricing/Approval**: 2 días
- **Product Management (Admin CRUD)**: 3 días (✅ COMPLETO 24/08/2026)
- **Franchisee Catalog + Cart**: 3 días (✅ COMPLETO 24/08/2026)
- **Testing Manual Catalog**: 0.5 días (✅ COMPLETO 25/08/2026)
- **Franchisee Navigation**: 1 día (3 sidebars completos)
- **Páginas Placeholder**: 0.5 días (quotes, franchisees)
- **Dev Tools**: 1 día (mantenimiento continuo)
- **Documentación**: 2 días (guías de testing completas)
- **Quotes**: 2 días (✅ COMPLETO 25/08)
- **Checkout**: 3 días (✅ COMPLETO 25/08)
- **Franchisee Orders**: 1.5 días (✅ COMPLETO 25/08)
- **Admin Orders**: 2 días (✅ COMPLETO 25/08)
- **Supplier Products**: 3 días (✅ COMPLETO 25/08)
- **Franchisee Management**: 4 días (✅ COMPLETO 25/08)
- **TOTAL**: ~41 días de trabajo

### Lo que falta (estimación):
- **Dashboards mejorados**: 3-4 días
- **UX improvements**: 5-7 días
- **Testing E2E**: 5 días
- **TOTAL**: ~13-16 días de trabajo restante

### Integración backend (estimación):
- **13 módulos × 2 días**: 26 días
- **TOTAL PROYECTO**: ~80-83 días de trabajo

**Progreso actual**: ~41 días completados de ~80-83 días = **49-51% del proyecto total**

**En calendario real (1 dev)**: 16-17 semanas  
**Tiempo transcurrido**: ~3 semanas  
**Tiempo restante estimado**: ~3 semanas de frontend + integración backend

**Con 2 devs en paralelo**: 8-9 semanas

---

## 🎯 Prioridades Recomendadas

### 🔥 PRIORIDAD #1 - Flujo E2E Franquiciado (Próximas 2 semanas)

**Objetivo**: Completar el journey de compra completo para franquiciados

**Sprint 1 (Semana 1 - 5 días):** ✅ **COMPLETADO 24-25/08**
1. ✅ **Catálogo de productos (Franchisee)** - 3 días COMPLETO
   - ✅ Lista de productos con filtros
   - ✅ Vista detallada de producto
   - ✅ Búsqueda y categorías
   - ✅ Integrado con productos existentes del admin
   
2. ✅ **Carrito de compra** - 3 días COMPLETO
   - ✅ Añadir/quitar productos
   - ✅ Modificar cantidades (variant-aware)
   - ✅ Persistencia en Zustand store
   - ✅ Cálculo de totales
   - ✅ Medusa expansion pattern

3. ✅ **Testing manual** - 0.5 días COMPLETO
   - ✅ 15 puntos de testing verificados
   - ✅ Todas las funcionalidades validadas

**Sprint 2 (Semana 2 - 5 días):** ✅ **COMPLETADO** (25/08/2026)

1. ✅ **Checkout completo** - 2-3 días **COMPLETADO 25/08**
   - ✅ Wizard multi-paso (3 pasos funcionando)
   - ✅ Validación exhaustiva por paso
   - ✅ Integración Medusa completa
  - ✅ Success page corregida y validada el 26/08
   - ✅ 15 archivos (~3,366 líneas)
  - ✅ Bug de success page resuelto moviendo `clearCart()` a la página success

2. ✅ **Mis Pedidos (Franquiciado)** - Ya completado (ver sección 13)
   - ✅ Historial de pedidos
   - ✅ Detalle de pedido
   - ✅ Estado de envío

3. 🎯 **Testing E2E del flujo** - Pendiente
   - Probar flow completo: login → catálogo → carrito → checkout → confirmación
   - Documentar flujo en testing guide

**Resultado logrado**: 
- ✅ Franquiciado puede comprar productos end-to-end
- ✅ Se generan pedidos que aparecen en `/supplier/orders` (implementado)
- ✅ Admin Orders ya implementado (sección 14)

---

### Sprint 3 (Semanas 5-6) - Fase 2:
1. ✅ **Admin Orders (Global)** - Ya completado (ver sección 14)
2. ✅ **Gestión Productos (Proveedor)** - Ya completado (ver sección 15)
3. ✅ **Gestión Franquiciados (Admin)** - Ya completado (ver sección 16)
4. ✅ **Quotes (completar)** - Ya completado (ver sección 5)
5. 🎯 **Dashboards mejorados** - Métricas y gráficos

### Sprint 4 (Semanas 7-8):
1. 🎯 **UX improvements**
2. 🎯 **Testing E2E con Playwright**
3. 🎯 **Performance optimization**

### Sprint 5+ (Semanas 9-12):
1. 🎯 **Integración backend** (módulo por módulo)
2. 🎯 **Testing integrado**
3. 🎯 **Deploy a staging**
4. 🎯 **Validación con usuarios reales**

---

## 📦 Entregables por Fase

### Fase 1 - MVP Básico (Semanas 1-4): ✅ 78% COMPLETO
- [x] Auth system
- [x] Openings management ⚠️ (falta vista descarga documentos para franchisee/supplier)
- [x] Categories management
- [x] Quotes system (placeholder - falta completar)
- [x] Supplier order management
- [x] **Product Management (Admin CRUD)** ✅ 24/08
- [x] **Product catalog (Franchisee)** ✅ 24/08
- [x] **Shopping cart** ✅ 24/08
- [x] **Testing manual catalog** ✅ 25/08
- [ ] Checkout (PRÓXIMO - 2-3 días)

### Fase 2 - Funcionalidad Completa (Semanas 5-8): ⏳ 0% COMPLETO
- [ ] Supplier product management
- [ ] Franchisee management (admin)
- [ ] Enhanced dashboards
- [ ] Invitation system
- [ ] UX improvements
- [ ] E2E testing

### Fase 3 - Integración & Polish (Semanas 9-12): ⏳ 0% COMPLETO
- [ ] Backend integration (all modules)
- [ ] Performance optimization
- [ ] A11y improvements
- [ ] SEO optimization
- [ ] User validation
- [ ] Bug fixes
- [ ] Production deploy

---

## � Guía de Implementación de API Calls (Mock → Real Backend)

Esta guía explica cómo migrar cada módulo de mock a real API cuando el backend esté listo.

### 📚 Referencia: Dev Tools Panel

**URL Local**: http://localhost:3000/admin/dev-tools  
**Qué contiene:**
- 77 endpoints documentados (Auth, Admin, Pricing, Store, Vendor, Orders, Products)
- Estructura de requests/responses para cada endpoint
- Feature flags de cada módulo
- Credenciales de testing
- Ejemplos de curl para cada endpoint

**Úsalo para:**
- Ver qué endpoints están disponibles
- Copiar estructura de requests
- Verificar feature flags actuales
- Testear endpoints con curl antes de integrar

---

### 🛠️ Proceso de Migración por Módulo (5 Pasos)

#### **Paso 1: Verificar Backend Ready (15-30 min)**

1. **Revisar Dev Tools**
   ```
   http://localhost:3000/admin/dev-tools
   ```
   - Buscar sección del módulo (ej: "Products")
   - Copiar todos los endpoints que necesitas
   - Verificar estructura JSON de requests/responses

2. **Probar endpoints con curl**
   ```bash
   # Ejemplo: Login para obtener token
   curl -X POST https://marketplace-b2b-backend-dev.onrender.com/auth/user/emailpass \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@carrefour.dev", "password": "supersecret"}'
   
   # Ejemplo: Listar productos
   curl -X GET https://marketplace-b2b-backend-dev.onrender.com/store/products \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

3. **Comparar JSON real vs mock**
   - Abre `src/lib/api/[modulo]-mock.ts`
   - Compara estructura con response del backend
   - Anota diferencias (campos extra, nombres diferentes, etc.)

4. **Actualizar types si necesario**
   ```typescript
   // src/types/products.ts
   export interface Product {
     id: string;
     title: string;
     // ... campos actuales
     
     // ⬇️ Añadir campos nuevos del backend si los tiene
     merchant_id?: string; // Ejemplo: campo nuevo del backend
   }
   ```

---

#### **Paso 2: Crear Cliente API Real (1-2 horas)**

1. **Ubicación del archivo**
   ```
   src/lib/api/[modulo]-client.ts
   ```
   Ejemplo: `src/lib/api/products-client.ts` (ya existe)

2. **Estructura del archivo** (copiar del existente y modificar)

```typescript
import { featureFlags } from '@/config/feature-flags';
import { 
  mockGetProducts,   // ⬅️ Funciones mock existentes
  mockGetProduct,
  mockCreateProduct,
  // ... resto
} from './products-mock';

// ⬇️ Nueva función para llamar al backend real
async function realGetProducts(params: GetProductsParams) {
  const { search, status, supplierId, expand } = params;
  
  // Construir query string
  const queryParams = new URLSearchParams();
  if (search) queryParams.append('q', search);
  if (status) queryParams.append('status', status);
  if (supplierId) queryParams.append('supplier_id', supplierId);
  if (expand) queryParams.append('expand', expand);
  
  const url = `${process.env.NEXT_PUBLIC_API_URL}/store/products?${queryParams}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      // Añadir auth si necesario:
      // 'Authorization': `Bearer ${getToken()}`
    },
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching products: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data; // Devolver en formato esperado por componentes
}

// ⬇️ Exportar versión dual (usa feature flag)
export async function getProducts(params: GetProductsParams = {}) {
  if (featureFlags.shouldUseMock('products')) {
    return mockGetProducts(params);
  }
  return realGetProducts(params);
}
```

3. **Implementar cada método**
   - GET endpoints: usar `fetch()` con query params
   - POST/PATCH/DELETE: incluir body como JSON
   - Manejo de errores con try/catch
   - Headers de autenticación si necesario

4. **Helpers comunes** (crear una vez, reutilizar)

```typescript
// src/lib/api/api-helpers.ts
export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
}

// Uso:
const products = await apiRequest<{ products: Product[] }>(
  `${API_URL}/store/products`
);
```

---

#### **Paso 3: Actualizar Feature Flag (5 minutos)**

1. **Abrir archivo de configuración**
   ```
   src/config/feature-flags.ts
   ```

2. **Cambiar a modo real**
   ```typescript
   products: {
     useMock: false,        // ⬅️ Cambiar de true a false
     backendReady: true,    // ⬅️ Confirmar que backend está listo
     apiBaseUrl: process.env.NEXT_PUBLIC_API_URL,
     notes: 'Real API - Migrado 25/08/2026' // ⬅️ Actualizar fecha
   }
   ```

3. **Verificar en Dev Tools**
   - Refresh http://localhost:3000/admin/dev-tools
   - Buscar el módulo
   - Debe decir "Real API" en verde ✅

---

#### **Paso 4: Testing Integrado (2-4 horas)**

1. **Testing manual de cada endpoint**
   
   **Lista de testing:**
   - [ ] GET list - Listar todos los items
   - [ ] GET by ID - Obtener item específico
   - [ ] POST create - Crear nuevo item
   - [ ] PATCH update - Actualizar item existente
   - [ ] DELETE - Eliminar item
   - [ ] Filtros - Búsqueda, filtros por campo
   - [ ] Paginación - Si aplica
   - [ ] Validaciones - Errores de validación
   - [ ] Auth - Permisos por rol

2. **Flujo de testing:**
   ```bash
   # 1. Login
   http://localhost:3000/login
   # Email: admin@carrefour.dev
   # Password: supersecret
   
   # 2. Ir al módulo
   http://localhost:3000/admin/products
   
   # 3. Probar CRUD
   - Crear nuevo producto ✓
   - Editar producto ✓
   - Listar productos ✓
   - Filtrar/buscar ✓
   - Eliminar producto ✓
   
   # 4. Verificar errores
   - Campos requeridos vacíos → debe mostrar error
   - Item no encontrado → debe mostrar 404
   - Sin permisos → debe redirigir
   ```

3. **Verificar consola del navegador**
   - Abrir DevTools (F12)
   - Pestaña Network
   - Verificar que llama al backend real (no mock)
   - Verificar status codes (200, 201, 400, 404, etc.)
   - Ver structure de JSON responses

4. **Testing de edge cases**
   - [ ] Stock bajo → debe mostrar warning
   - [ ] Campos vacíos → validación client-side
   - [ ] Backend down → mostrar error gracefully
   - [ ] Token expirado → redirigir a login
   - [ ] Respuesta lenta → mostrar loading state

---

#### **Paso 5: Rollback Plan (si algo falla)**

1. **Volver a mock inmediatamente**
   ```typescript
   // src/config/feature-flags.ts
   products: {
     useMock: true,  // ⬅️ Volver a true
     backendReady: false,
     notes: 'Rollback - Backend tenía issue XYZ'
   }
   ```

2. **Documentar el problema**
   ```markdown
   ## Issues encontrados durante migración:
   
   **Fecha**: 25/08/2026
   **Módulo**: Products
   **Issue**: 
   - Campo `merchant_id` no viene en response
   - Endpoint `/admin/products` devuelve 500
   
   **Solución temporal**: Rollback a mock
   **Próximo paso**: Coordinar con backend para fix
   ```

3. **Comunicar a backend**
   - Email con detalles del error
   - Screenshots si aplica
   - Request/response examples
   - Fecha estimada para re-intentar

---

### 📋 Checklist de Migración por Módulo

Usa esta checklist cada vez que migres un módulo:

```markdown
## Migración de [MÓDULO] a Real API

**Fecha inicio**: __/__/____
**Backend ready**: [ ] Sí / [ ] No
**Responsable**: ________

### Pre-migración
- [ ] Backend confirma endpoints listos
- [ ] Probado todos los endpoints con curl
- [ ] Comparado JSON mock vs real
- [ ] Actualizado types si necesario
- [ ] Revisado docs en Dev Tools

### Implementación
- [ ] Creadas funciones realXxx() en api client
- [ ] Añadido manejo de errores
- [ ] Añadido auth headers si necesario
- [ ] Testeado cada función en aislamiento
- [ ] Feature flag cambiado a false

### Testing
- [ ] Login funciona
- [ ] GET list funciona
- [ ] GET by ID funciona
- [ ] POST create funciona
- [ ] PATCH update funciona
- [ ] DELETE funciona
- [ ] Filtros funcionan
- [ ] Búsqueda funciona
- [ ] Validaciones funcionan
- [ ] Loading states correctos
- [ ] Error handling correcto

### Edge Cases
- [ ] Backend down → error graceful
- [ ] Token expirado → redirect login
- [ ] 404 → mensaje amigable
- [ ] 500 → mensaje de error
- [ ] Slow response → loading spinner

### Documentación
- [ ] Actualizado feature-flags.ts
- [ ] Actualizado PROJECT_STATUS_AND_ROADMAP.md
- [ ] Commit con mensaje descriptivo
- [ ] Email a equipo confirmando migración

### Post-migración
- [ ] Monitoreado por 24h
- [ ] Sin errores reportados
- [ ] Performance aceptable
- [ ] Usuarios notificados (si aplica)

**Fecha completado**: __/__/____
**Status**: ✅ Exitoso / ⚠️ Con issues / ❌ Rollback
```

---

### 🚨 Problemas Comunes y Soluciones

#### **1. CORS Errors**

**Síntoma:**
```
Access to fetch at 'https://backend.com/api' has been blocked by CORS policy
```

**Solución:**
- Backend debe añadir headers CORS
- O usar proxy de Next.js en `next.config.js`:

```javascript
// next.config.js
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'https://backend.com/:path*'
    }
  ]
}
```

---

#### **2. Token JWT Expirado**

**Síntoma:**
```
401 Unauthorized
```

**Solución:**
```typescript
// src/lib/api/api-helpers.ts
export async function apiRequest<T>(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options);
  
  if (response.status === 401) {
    // Token expirado → logout y redirect
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  
  // ... resto del código
}
```

---

#### **3. Estructura JSON Diferente**

**Síntoma:**
```
Cannot read property 'title' of undefined
```

**Solución:**
```typescript
// Backend devuelve: { data: { products: [...] } }
// Pero esperábamos: { products: [...] }

// Adaptar response:
async function realGetProducts() {
  const response = await fetch(url);
  const json = await response.json();
  
  // ⬇️ Transformar a formato esperado
  return {
    products: json.data.products || []
  };
}
```

---

#### **4. Campo Required Faltante**

**Síntoma:**
```
400 Bad Request: "merchant_id is required"
```

**Solución:**
```typescript
// Añadir campo al request:
async function realCreateProduct(data: CreateProductRequest) {
  const body = {
    ...data,
    merchant_id: getCurrentMerchantId(), // ⬅️ Añadir campo requerido
  };
  
  return apiRequest('/admin/products', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}
```

---

### 📊 Orden Recomendado de Migración

Según dependencias y prioridad:

1. **Auth** ✅ (YA MIGRADO - 25/08/2026)
2. **Products (Store)** - Catálogo público, sin auth
3. **Cart** - Depende de Products
4. **Orders (Supplier)** - Proveedores ven sus pedidos
5. **Categories** - Independiente, bajo riesgo
6. **Openings** - Módulo admin, independiente
7. **Franchisees** - CRUD admin
8. **Product Pricing/Approval** - Workflow complejo
9. **Admin Orders** - Vista global, depende de todo
10. **Quotes** - Último, menos crítico

**Tiempo estimado**: 1-2 días por módulo × 9 módulos = **2-3 semanas**

---

### 🎯 Quick Start: Migrar tu Primer Módulo

**Ejemplo: Migrar Products en 1 hora**

1. **Minuto 0-5**: Probar endpoints en Dev Tools
   ```bash
   curl https://backend.com/store/products
   ```

2. **Minuto 5-30**: Crear funciones real en `products-client.ts`
   ```typescript
   async function realGetProducts() { ... }
   async function realGetProduct() { ... }
   async function realCreateProduct() { ... }
   ```

3. **Minuto 30-35**: Cambiar feature flag
   ```typescript
   products: { useMock: false }
   ```

4. **Minuto 35-55**: Testing manual
   - Login → Ir a /admin/products
   - Crear producto → ✓
   - Editar → ✓
   - Eliminar → ✓

5. **Minuto 55-60**: Commit y documentar
   ```bash
   git commit -m "feat: Migrate products to real API"
   ```

**Done!** 🎉

---

### 📱 Dev Tools Reference

**Secciones disponibles en** http://localhost:3000/admin/dev-tools:

1. **Overview**
   - Feature flags status
   - Módulos en mock vs real
   - Estadísticas generales

2. **Auth Endpoints** (4)
   - POST /auth/user/emailpass - Admin login
   - POST /auth/member/emailpass - Vendor login
   - POST /auth/register
   - POST /auth/forgot-password

3. **Admin Endpoints** (2)
   - GET /admin/users/me
   - GET /admin/orders

4. **Pricing Endpoints** (6)
   - GET /admin/pricing/queue
   - PATCH /admin/pricing/:id/approve
   - etc.

5. **Store Endpoints** (3)
   - GET /store/products
   - GET /store/products/:id
   - GET /store/regions

6. **Vendor Endpoints** (4)
   - POST /vendor/products
   - GET /vendor/products
   - etc.

7. **Orders Endpoints** (7)
   - Supplier orders CRUD

8. **Products Endpoints** (8)
   - Admin products CRUD

**Total**: 77 endpoints documentados

---

## �🔑 Decisiones Clave Pendientes

1. **Arquitectura Frontend** 🔥 CRÍTICO - LUNES
   - ¿Continuar con custom frontend?
   - ¿Usar plantilla MercurJS?
   - Decisión afecta todo el roadmap

2. **Prioridad de módulos**
   - ¿Catálogo primero o Productos proveedor?
   - Recomendación: Catálogo (completa flujo E2E)

3. **Integración backend**
   - ¿Módulo por módulo o big-bang?
   - Recomendación: Gradual con feature flags

4. **Testing strategy**
   - ¿Solo E2E o también unit tests?
   - ¿Cuándo empezar con tests?
   - Recomendación: E2E para flujos críticos ahora, unit tests después

5. **Deploy strategy**
   - ¿Staging environment?
   - ¿CI/CD pipeline?
   - Recomendación: Vercel para frontend, staging primero

---

## 📞 Acciones Inmediatas (Checklist)

### HOY Viernes (antes de EOD):
- [ ] Probar todo el módulo de Supplier Orders
- [ ] Verificar que login funciona en 1 intento
- [ ] Enviar email a backend con docs
- [ ] Commit & push todos los cambios
- [ ] Actualizar TODO.md si hace falta

### Lunes:
- [ ] Reunión con backend (30 min)
- [ ] Decidir si continuar con arquitectura custom
- [ ] Planificar sprint siguiente según decisión
- [ ] Documentar decisiones tomadas

### Martes (si arquitectura aprobada):
- [ ] Empezar Catálogo de Productos
- [ ] Crear types, mock data, API client
- [ ] Empezar componentes básicos

---

## 🎉 Logros Destacables

1. **Sistema funcional sin backend** - 7 módulos completos trabajando con mock data
2. **Feature flags exitosos** - Cambio mock→real será instantáneo
3. **Documentación completa** - 8+ docs creados y actualizados con testing guides
4. **Zero bugs en producción** - Todo en mock, sin backend que romper
5. **Validable con usuarios** - UI lista para mostrar hoy mismo
6. **Arquitectura escalable** - Fácil añadir nuevos módulos
7. **Type-safe** - TypeScript estricto sin any's
8. **Modern stack** - Next.js 14, Tailwind, Shadcn
9. **CRUD completo de productos** - Gestión completa con variantes, inventario, validaciones
10. **Testing exhaustivo** - Guías con 200+ casos de prueba totales
11. **Honestidad técnica** - Documentación refleja estado real (no inflado)
12. **Catálogo completo E2E** - Flujo de compra funcionando de inicio a fin (falta solo checkout)
13. **Variant-aware cart** - Carrito con patrón Medusa correctamente implementado
14. **Testing manual completo** - Todas las funcionalidades del catálogo verificadas exitosamente

**Módulos completos**: Auth, Openings, Categories, Supplier Orders, Product Pricing/Approval, **Product Management (Admin)**, **Franchisee Catalog + Cart**, **Franchisee Orders**, **Admin Orders**, **Quotes**  
**Módulos placeholder**: Franchisee Management (~4 días)  
**Testing completado**: Product Management, Franchisee Catalog  
**Próximo objetivo**: Checkout (2-3 días) para completar flujo E2E

---

## 📚 Documentación - Reorganización Completa

**Reorganización completada**: 25 de Agosto de 2026

El proyecto ha sido reorganizado para establecer **3 fuentes oficiales de verdad**:

### 🎯 Fuentes de Verdad (Source of Truth)

1. **📊 Este Documento** (`docs/PROJECT_STATUS_AND_ROADMAP.md`)  
   Estado del proyecto, módulos completados, roadmap y próximos pasos

2. **🔧 Dev Tools Panel** (`http://localhost:3000/admin/dev-tools`)  
   95 endpoints API documentados en tiempo real con ejemplos

3. **📚 Documentación Técnica** (`docs/technical/`)  
   Guías técnicas detalladas, arquitectura, desarrollo

### 📁 Nueva Estructura de Documentación

```
docs/
├── PROJECT_STATUS_AND_ROADMAP.md  ⭐ Master document (FUENTE DE VERDAD)
├── TODO.md                         # Tareas pendientes consolidadas
├── modules/                        # Documentación backend por módulo
│   ├── README.md                  # Índice de 15 documentos backend
│   ├── 01-auth/
│   ├── 02-openings/
│   ├── 03-categories/             ✅ Actualizado (7 opening categories + SQL)
│   ├── 04-supplier-orders/
│   ├── 05-product-pricing/
│   ├── 06-product-management/
│   ├── 07-franchisee-catalog/
│   ├── 08-franchisee-orders/
│   ├── 09-admin-orders/
│   └── 10-quotes/
├── technical/                      # Guías técnicas (FUENTE DE VERDAD)
│   ├── CHECKOUT_IMPLEMENTATION.md  ✅ Movido desde root
│   ├── MEDUSA_INTEGRATION_COMPLETE.md  ✅ Movido desde root
│   └── ...
├── testing/                        # Guías de testing por módulo
│   ├── README.md                  ✅ Nuevo índice
│   ├── TESTING_CATALOG.md         ✅ Movido desde root
│   ├── TESTING_PRODUCT_MANAGEMENT.md  ✅ Movido desde root
│   ├── TESTING_CATEGORY_MANAGEMENT.md  ✅ Movido desde root
│   ├── TESTING_COMPARISON.md      ✅ Movido desde root
│   ├── TESTING_FRANCHISEE_MANAGEMENT.md  ✅ Movido desde root
│   ├── TESTING_INVITATIONS.md     ✅ Movido desde root
│   └── TESTING_QUOTE_FORM.md      ✅ Movido desde root
├── guides/                         # Guías de usuario
│   ├── GUIA_COMPLETA_USUARIOS.md  ✅ Movido desde root
│   ├── QUICK_TEST_OPENINGS.md     ✅ Movido desde root
│   └── ...
├── integration/                    # Guías de integración backend
├── deployment/                     # Guías de deployment
└── medusa/                         # Documentación Medusa
```

### ✅ Mejoras Realizadas

1. **Root Folder Limpio** - Solo README.md y archivos esenciales en raíz
2. **Docs Centralizados** - Toda documentación en `docs/`
3. **Testing Indexado** - 7 guías de testing con README índice
4. **Backend Organizado** - 15 documentos en `docs/modules/`
5. **Fuentes de Verdad Claras** - 3 referencias oficiales bien definidas

### 📊 Estadísticas de Documentación

- **Backend**: 15 documentos organizados en modules/
- **Testing**: 7 guías de testing
- **Technical**: 10+ documentos técnicos
- **Guides**: 3+ guías de usuario
- **SQL Scripts**: 4 módulos (Categories, Pricing, Orders, Quotes)
- **README Files**: 12 índices (1 root + 1 testing + 10 modules)

### 🔗 Referencias

- **Organización Completa**: `docs/MODULES_ORGANIZATION.md`
- **Backend Modules**: `docs/modules/README.md`
- **Testing Guides**: `docs/testing/README.md`

---

**Documento mantenido por**: Frontend Team  
**Última actualización**: 25 Agosto 2026 - Documentación reorganizada y consolidada  
**Próxima revisión**: Fin de Semana 4 (completar Checkout)  
**Contacto**: Ver email enviado a backend
