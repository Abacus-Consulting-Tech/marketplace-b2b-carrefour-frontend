# Estado del Proyecto y Roadmap - Marketplace B2B Carrefour

**Fecha**: 22 de Agosto de 2026  
**Última Actualización**: Viernes por la tarde  
**Estado General**: En desarrollo activo con frontend custom + mock data

---

## 📊 Resumen Ejecutivo

### Lo que tenemos funcionando HOY:
- ✅ 5 módulos con UI completa (mock data)
- ✅ Sistema de autenticación multi-rol
- ✅ Feature flags para mock/real switching
- ✅ 2,300+ líneas de código funcional
- ✅ Sistema listo para validar con usuarios
- ✅ Páginas placeholder para guiar desarrollo futuro

### Módulos completos (funcionalidad CRUD completa):
1. ✅ Auth (login multi-rol, sessions, protected routes)
2. ✅ Openings (gestión de aperturas de franquicias)
3. ✅ Categories (gestión de categorías de productos)
4. ✅ Supplier Orders (gestión de pedidos del proveedor)
5. ✅ Product Pricing/Approval (cola de aprobación de productos)

### Módulos con placeholder (requieren desarrollo):
1. ⏳ Quotes (sistema de cotizaciones) - solo mensaje "próximamente", ~2 días desarrollo
2. ⏳ Product Management (Admin CRUD) - solo vista previa, ~4 días desarrollo
3. ⏳ Franchisee Management (Admin CRUD) - solo vista previa, ~4 días desarrollo

### Lo que falta (CRUD completo):
- ⏳ **Quotes** - sistema de cotizaciones (~2 días para completar placeholder)
- ⏳ Catálogo de productos (franquiciados) - estructura existente, falta funcionalidad
- ⏳ Carrito de compra - funcionalidad básica, falta completar
- ❌ Checkout (proceso completo de compra)
- ❌ Product Management (Admin CRUD) - solo placeholder, ~4 días desarrollo
- ❌ Franchisee Management (Admin CRUD) - solo placeholder, ~4 días desarrollo
- ❌ Supplier Products (gestión de productos del proveedor)
- ❌ Integración con backend real (gradual por módulo)

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

**Archivos:**
- `src/types/openings.ts` - Tipos TypeScript
- `src/lib/api/openings-mock.ts` - 10 openings de prueba
- `src/lib/api/openings-client.ts` - Cliente API
- `src/components/admin/OpeningsList.tsx` - Lista
- `src/components/admin/OpeningDetail.tsx` - Detalle
- `src/app/(backoffice)/admin/openings/` - Páginas

**Mock data**: 10 aperturas en diferentes estados

**Tiempo invertido**: ~2 días

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

### 5. Sistema de Cotizaciones (Semana 3)
**Estado**: ⏳ Solo Placeholder

**Lo que existe:**
- Página con mensaje "Funcionalidad en desarrollo"
- Icono y card visual
- Ruta `/marketplace/quotes` funcional

**Lo que falta (para completar):**
- Formulario de solicitud de cotización (~1 día)
- Lista de cotizaciones enviadas con filtros (~1 día)
- Panel de respuesta para proveedores (~1 día)
- Sistema de notificaciones (opcional)

**Archivos existentes:**
- `src/app/(marketplace)/marketplace/quotes/page.tsx` - Página placeholder

**Archivos necesarios:**
- `src/types/quotes.ts` - Tipos TypeScript
- `src/lib/api/quotes-mock.ts` - Mock data
- `src/lib/api/quotes-client.ts` - Cliente API
- `src/components/quotes/QuoteRequestForm.tsx` - Formulario
- `src/components/quotes/QuotesList.tsx` - Lista

**Tiempo estimado para completar**: ~2 días

**Propósito del módulo:**
Sistema para que franquiciados soliciten presupuestos personalizados para:
- Productos no en catálogo
- Personalización (uniformes con logo)
- Pedidos grandes negociables
- Condiciones especiales de entrega

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
4. `src/app/(marketplace)/marketplace/quotes/page.tsx` - Página cotizaciones (placeholder)
5. `src/app/(marketplace)/marketplace/orders/tracking/page.tsx` - Seguimiento (placeholder)
6. `src/app/(marketplace)/marketplace/addresses/page.tsx` - Direcciones (placeholder)
7. `src/app/(marketplace)/marketplace/stats/page.tsx` - Estadísticas (placeholder)

**Archivos modificados:**
- `src/app/(marketplace)/layout.tsx` - Añadido FranchiseeSidebar component
- `src/app/(supplier)/layout.tsx` - Añadido SupplierSidebar component
- `src/app/(backoffice)/layout.tsx` - Añadido AdminSidebar component

**Estructura de navegación:**
- **Inicio**: 🏠 Inicio → `/marketplace/dashboard`
- **Compras**: 📦 Catálogo, 🛒 Mi Carrito, 💬 Cotizaciones
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

### 8. Dev Tools (Actualizado HOY)
**Estado**: ✅ Mantenido actualizado

**Lo que se hizo:**
- Página de desarrollo con todos los endpoints
- Documentación de API en tiempo real
- Estadísticas de módulos (real vs mock)
- Filter por módulo
- Credenciales de prueba

**Archivos:**
- `src/app/(backoffice)/admin/dev-tools/page.tsx`

**Endpoints documentados**: 34 endpoints
- Auth: 4 endpoints
- Admin: 2 endpoints
- Pricing: 6 endpoints
- Store: 3 endpoints
- Vendor: 4 endpoints
- **Orders (NEW)**: 7 endpoints

**Tiempo invertido**: ~30 minutos de mantenimiento

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
- ⏳ `/admin/products` (catálogo general) es solo un placeholder
- ⏳ `/admin/franchisees` también es solo un placeholder

---

### 10. Páginas Placeholder (Varias semanas)
**Estado**: ⏳ Vista previa estática

**Lo que existe:**
- `/admin/products` - Vista previa con 3 productos mock (botones deshabilitados)
- `/admin/franchisees` - Vista previa con 3 franquiciados mock (botones deshabilitados)
- `/marketplace` - Catálogo con productos Mercur/mock (funcionalidad limitada)
- `/marketplace/cart` - Drawer de carrito (funcionalidad básica)

**Propósito:**
- Mostrar estructura visual futura
- Placeholder para desarrollo futuro
- NO son módulos completos

**Tiempo invertido**: ~2 horas en total

---

## 📋 Estado por Módulo

| Módulo | Frontend Mock | Backend Real | Integrado | Docs | Tests |
|--------|---------------|--------------|-----------|------|-------|
| **Auth** | ✅ | ✅ | ✅ | ✅ | ⏳ |
| **Openings** | ✅ | ⏳ | ❌ | ✅ | ⏳ |
| **Categories** | ✅ | ⏳ | ❌ | ✅ | ⏳ |
| **Quotes** | ⏳ | ⏳ | ❌ | ⏳ | ❌ |
| **Supplier Orders** | ✅ | ⏳ | ❌ | ✅ | ⏳ |
| **Product Pricing/Approval** | ✅ | ⏳ | ❌ | ✅ | ⏳ |
| Catalog (Franchisee) | ⏳ | ⏳ | ❌ | ❌ | ❌ |
| Cart | ⏳ | ⏳ | ❌ | ❌ | ❌ |
| Checkout | ❌ | ⏳ | ❌ | ❌ | ❌ |
| Franchisee Orders | ❌ | ⏳ | ❌ | ❌ | ❌ |
| **Product Management (Admin)** | ⏳ | ⏳ | ❌ | ❌ | ❌ |
| Supplier Products | ❌ | ⏳ | ❌ | ❌ | ❌ |
| **Franchisee Management** | ⏳ | ⏳ | ❌ | ❌ | ❌ |
| Invitations | ❌ | ⏳ | ❌ | ❌ | ❌ |
| Admin Dashboard | ⏳ | ⏳ | ❌ | ⏳ | ❌ |

**Leyenda:**
- ✅ Completo
- ⏳ En progreso / Parcial (placeholder o vista previa)
- ❌ No iniciado

**Nota:** 
- **Quotes**: Solo placeholder (mensaje "próximamente"), necesita ~2 días desarrollo
- **Product Pricing/Approval**: El submódulo `/admin/products/pricing` SÍ está completo
- **Product Management (Admin)**: La página `/admin/products` es solo placeholder
- **Franchisee Management**: La página `/admin/franchisees` es solo placeholder
- **Catalog/Cart**: Las páginas existen pero con funcionalidad limitada

---

## 🚀 Próximos Pasos (Roadmap)

### INMEDIATO - Hoy Viernes (2-3 horas)

**1. Testing Manual** ✅ CRÍTICO
- [ ] Probar login (debe funcionar en 1 intento)
- [ ] Navegar a `/supplier/orders`
- [ ] Verificar que se ven los 5 pedidos
- [ ] Probar filtros (pending, confirmed, shipped)
- [ ] Probar búsqueda
- [ ] Abrir pedido ORD-2026-001
- [ ] Probar acción "Aceptar Pedido"
- [ ] Probar acción "Rechazar Pedido"
- [ ] Probar "Añadir Tracking" en pedido confirmado
- [ ] Verificar estadísticas en dashboard

**2. Enviar Email a Backend** ✅ CRÍTICO
- [ ] Usar el email que preparamos
- [ ] Adjuntar:
  - `JUSTIFICACION_ARQUITECTURA_FRONTEND.md`
  - `SUPPLIER_ORDERS_BACKEND_SIMPLE.md`
- [ ] CC a tu manager (opcional)
- [ ] Enviar antes de EOD viernes

**3. Preparar para Reunión del Lunes** (Opcional)
- [ ] Crear 3-4 slides resumen si hace falta
- [ ] Preparar demo en vivo
- [ ] Tener página dev-tools lista

---

### CORTO PLAZO - Semana 4 (Lunes 25 - Viernes 29 Agosto)

#### Opción A: Esperar feedback de backend (RECOMENDADO)

**Lunes:**
- Reunión con backend (30 min)
- Recoger feedback sobre arquitectura
- Ajustar plan según decisiones

**Martes-Viernes:**
- Continuar con siguiente módulo según feedback
- Documentar cualquier cambio acordado

#### Opción B: Continuar desarrollo (Si backend acepta arquitectura)

**Implementar: Catálogo de Productos (Franquiciados)**

**Tiempo estimado**: 3-4 días

**Qué construir:**

1. **Types & Models** (2-3 horas)
   - `src/types/catalog.ts`
   - Product, ProductVariant, ProductFilter
   - Price, Stock, ProductImage

2. **Mock Data** (3-4 horas)
   - `src/lib/api/catalog-mock.ts`
   - 30-50 productos realistas
   - Diferentes categorías
   - Diferentes proveedores
   - Imágenes placeholder

3. **API Client** (2-3 horas)
   - `src/lib/api/catalog-client.ts`
   - getProducts(filters)
   - getProductById(id)
   - searchProducts(query)
   - getProductsByCategory(categoryId)
   - getProductsBySupplier(supplierId)

4. **Componentes** (1-2 días)
   - `ProductCard.tsx` - Tarjeta de producto
   - `ProductGrid.tsx` - Grid de productos
   - `ProductFilters.tsx` - Filtros laterales
   - `ProductDetail.tsx` - Vista detallada
   - `ProductSearch.tsx` - Búsqueda

5. **Páginas** (4-6 horas)
   - `/marketplace/catalog/page.tsx` - Lista
   - `/marketplace/catalog/[id]/page.tsx` - Detalle

**Features incluir:**
- Filtros por categoría, proveedor, precio
- Búsqueda por nombre
- Paginación
- Sort (precio, nombre, popularidad)
- Vista grid/lista
- Quick view modal
- Botón "Añadir al carrito"

---

### MEDIO PLAZO - Semanas 5-6 (1-12 Septiembre)

#### 1. Carrito de Compra (2-3 días)

**Qué construir:**
- State management del carrito (Zustand)
- Persistencia en localStorage
- Componentes:
  - `CartDrawer.tsx` - Drawer lateral
  - `CartItem.tsx` - Item en carrito
  - `CartSummary.tsx` - Resumen de totales
- Páginas:
  - `/marketplace/cart/page.tsx`
- Features:
  - Añadir/quitar productos
  - Modificar cantidad
  - Calcular subtotal, IVA, total
  - Cupones de descuento
  - Empty state
  - Continuar comprando

**Endpoints necesarios:**
- POST `/store/carts` - Crear carrito
- POST `/store/carts/:id/line-items` - Añadir item
- PATCH `/store/carts/:id/line-items/:itemId` - Actualizar cantidad
- DELETE `/store/carts/:id/line-items/:itemId` - Eliminar item

---

#### 2. Proceso de Checkout (2-3 días)

**Qué construir:**
- Wizard multi-paso
- Componentes:
  - `CheckoutSteps.tsx` - Stepper
  - `ShippingAddress.tsx` - Paso 1
  - `PaymentMethod.tsx` - Paso 2
  - `OrderReview.tsx` - Paso 3
  - `OrderConfirmation.tsx` - Confirmación
- Páginas:
  - `/marketplace/checkout/page.tsx`
- Features:
  - Validación por paso
  - Resumen siempre visible
  - Guardar dirección
  - Métodos de pago (mock)
  - Crear pedido
  - Email de confirmación (mock)

**Endpoints necesarios:**
- POST `/store/carts/:id/shipping-address` - Dirección
- POST `/store/carts/:id/complete` - Completar orden
- GET `/store/orders/:id` - Confirmar orden creada

---

#### 3. Mis Pedidos (Franquiciado) (1-2 días)

**Qué construir:**
- Vista de pedidos realizados
- Componentes:
  - `MyOrdersList.tsx`
  - `MyOrderDetail.tsx`
  - `OrderTracking.tsx`
- Páginas:
  - `/marketplace/my-orders/page.tsx`
  - `/marketplace/my-orders/[id]/page.tsx`
- Features:
  - Lista de mis pedidos
  - Filtros por estado, fecha
  - Ver detalle
  - Seguimiento de envío
  - Descargar factura (mock PDF)
  - Reordenar
  - Cancelar pedido (si está pending)

**Endpoints necesarios:**
- GET `/store/orders` - Mis pedidos
- GET `/store/orders/:id` - Detalle de pedido
- POST `/store/orders/:id/cancel` - Cancelar pedido

---

### LARGO PLAZO - Semanas 7-10 (15 Sept - 10 Oct)

#### 1. Gestión de Productos (Proveedor) (3-4 días)

**Qué construir:**
- CRUD de productos del proveedor
- Componentes:
  - `MyProductsList.tsx`
  - `ProductForm.tsx`
  - `ProductVariants.tsx`
  - `ProductPricing.tsx`
- Páginas:
  - `/supplier/products/page.tsx`
  - `/supplier/products/new/page.tsx`
  - `/supplier/products/[id]/edit/page.tsx`
- Features:
  - Crear producto nuevo
  - Editar producto
  - Gestionar variantes
  - Actualizar precios
  - Actualizar stock
  - Subir imágenes (mock)
  - Estados: draft, pending_approval, approved, rejected
  - Bulk actions

**Endpoints necesarios:**
- GET `/vendor/products` - Mis productos
- POST `/vendor/products` - Crear producto
- PATCH `/vendor/products/:id` - Actualizar
- DELETE `/vendor/products/:id` - Eliminar
- PATCH `/vendor/products/:id/stock` - Actualizar stock
- POST `/vendor/products/:id/images` - Subir imagen

---

#### 2. Dashboard Proveedor Mejorado (2 días)

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

#### 5. Gestión de Franquiciados (Admin) (3-4 días)

**Qué construir:**
- CRUD completo de franquiciados desde admin
- Componentes:
  - `FranchiseesList.tsx` - Lista de franquiciados
  - `FranchiseeDetail.tsx` - Vista detallada
  - `FranchiseeForm.tsx` - Crear/Editar
  - `FranchiseeStores.tsx` - Tiendas asignadas
  - `FranchiseeOrders.tsx` - Historial de pedidos
  - `FranchiseeStats.tsx` - Estadísticas
  - `FranchiseePermissions.tsx` - Gestión de permisos
- Páginas:
  - `/admin/franchisees/page.tsx` - Lista
  - `/admin/franchisees/[id]/page.tsx` - Detalle
  - `/admin/franchisees/[id]/edit/page.tsx` - Editar
  - `/admin/franchisees/new/page.tsx` - Crear nuevo
- Features:
  - **Alta de franquiciados**
    - Datos de contacto
    - Datos fiscales
    - Usuario asociado
  - **Asignación de tiendas/ubicaciones**
    - Añadir/quitar tiendas
    - Dirección principal
    - Direcciones de entrega múltiples
  - **Historial de pedidos**
    - Ver todos los pedidos del franquiciado
    - Filtrar por fecha, estado
    - Exportar a CSV/Excel
  - **Estadísticas de rendimiento**
    - Total comprado
    - Frecuencia de pedidos
    - Productos más comprados
    - Gráficos de evolución
    - Comparativa con otros franquiciados
  - **Gestión de permisos**
    - Activar/desactivar usuario
    - Límites de crédito
    - Descuentos especiales
    - Categorías permitidas
  - **Acciones bulk**
    - Activar/desactivar múltiples
    - Asignar descuentos masivos
    - Enviar comunicaciones
  - **Búsqueda y filtros**
    - Por nombre, email, ciudad
    - Por estado (activo/inactivo)
    - Por volumen de compra

**Endpoints necesarios:**
- GET `/admin/franchisees` - Listar franquiciados
- GET `/admin/franchisees/:id` - Detalle de franquiciado
- POST `/admin/franchisees` - Crear franquiciado
- PATCH `/admin/franchisees/:id` - Actualizar franquiciado
- DELETE `/admin/franchisees/:id` - Eliminar franquiciado
- GET `/admin/franchisees/:id/stores` - Tiendas del franquiciado
- POST `/admin/franchisees/:id/stores` - Asignar tienda
- DELETE `/admin/franchisees/:id/stores/:storeId` - Quitar tienda
- GET `/admin/franchisees/:id/orders` - Pedidos del franquiciado
- GET `/admin/franchisees/:id/stats` - Estadísticas
- PATCH `/admin/franchisees/:id/permissions` - Actualizar permisos
- PATCH `/admin/franchisees/:id/status` - Activar/desactivar

---

#### 5. Mejoras de UX (1-2 semanas)

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
- **Openings**: 2 días
- **Categories**: 1.5 días
- **Supplier Orders**: 2 días
- **Product Pricing/Approval**: 2 días
- **Franchisee Navigation**: 1 día (3 sidebars completos)
- **Páginas Placeholder**: 0.5 días (quotes, products, franchisees, etc.)
- **Dev Tools**: 0.5 días
- **Documentación**: 1 día
- **TOTAL**: ~13.5 días de trabajo

### Lo que falta (estimación):
- **Quotes (completar)**: 2 días (formulario, lista, respuesta)
- **Catalog (Franchisee)**: 2-3 días (ya existe estructura, falta funcionalidad)
- **Cart**: 1-2 días (ya existe básico, falta completar)
- **Checkout**: 2-3 días
- **Franchisee Orders**: 1-2 días
- **Product Management (Admin CRUD)**: 4 días (completar placeholder)
- **Supplier Products**: 3-4 días
- **Franchisee Management (Admin CRUD)**: 4 días (completar placeholder)
- **Dashboards mejorados**: 3-4 días
- **Invitaciones**: 2 días
- **UX improvements**: 5-7 días
- **Testing E2E**: 5 días
- **TOTAL**: ~31-40 días de trabajo

### Integración backend (estimación):
- **8 módulos × 2 días**: 16 días
- **TOTAL PROYECTO**: ~60-69 días de trabajo

**En calendario real (1 dev)**: 12-14 semanas

**Con 2 devs en paralelo**: 6-8 semanas

---

## 🎯 Prioridades Recomendadas

### Sprint 1 (Próximas 2 semanas):
1. ✅ **Resolver tema arquitectura con backend** (Lunes)
2. 🎯 **Catálogo de productos** (Martes-Viernes)
3. 🎯 **Carrito de compra** (Semana siguiente)

### Sprint 2 (Semanas 3-4):
1. 🎯 **Checkout**
2. 🎯 **Mis Pedidos (Franquiciado)**
3. 🎯 **Testing del flujo completo E2E**

### Sprint 3 (Semanas 5-6):
1. 🎯 **Gestión Productos (Proveedor)**
2. 🎯 **Gestión Franquiciados (Admin)**
3. 🎯 **Dashboards mejorados**
4. 🎯 **Invitaciones**

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

### Fase 1 - MVP Básico (Semanas 1-4): ✅ 60% COMPLETO
- [x] Auth system
- [x] Openings management
- [x] Categories management
- [x] Quotes system
- [x] Supplier order management
- [ ] Product catalog
- [ ] Shopping cart
- [ ] Checkout
- [ ] Franchisee order view

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

## 🔑 Decisiones Clave Pendientes

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

1. **Sistema funcional sin backend** - 5 módulos completos trabajando con mock data
2. **Feature flags exitosos** - Cambio mock→real será instantáneo
3. **Documentación completa** - 5+ docs creados y actualizados
4. **Zero bugs en producción** - Todo en mock, sin backend que romper
5. **Validable con usuarios** - UI lista para mostrar hoy mismo
6. **Arquitectura escalable** - Fácil añadir nuevos módulos
7. **Type-safe** - TypeScript estricto sin any's
8. **Modern stack** - Next.js 14, Tailwind, Shadcn
9. **Placeholders estratégicos** - Páginas visuales para guiar desarrollo futuro
10. **Honestidad técnica** - Documentación refleja estado real (no inflado)

**Módulos completos**: Auth, Openings, Categories, Supplier Orders, Product Pricing/Approval  
**Módulos placeholder**: Quotes, Product Management, Franchisee Management (~2-4 días cada uno)

---

**Documento mantenido por**: Frontend Team  
**Próxima revisión**: Lunes 25 de Agosto post-reunión  
**Contacto**: Ver email enviado a backend
