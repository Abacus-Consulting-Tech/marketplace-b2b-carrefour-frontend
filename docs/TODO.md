# TODO - Marketplace B2B Carrefour

**Actualizado:** 26 Agosto 2026

---

## 🚨 BUGS CRÍTICOS

### Checkout Success Page No Carga
**Priority:** CRÍTICO  
**Time Spent:** 1 hora  
**Status:** RESUELTO Y VALIDADO

**Problema:**
- Checkout completa correctamente (orden creada en mock mode)
- Logs muestran redirect a `/marketplace/checkout-new/success?orderId=XXX`
- Success page NUNCA se renderiza
- Se queda en spinner infinito o redirige al marketplace
- Probado: `router.push()`, `window.location.href`, Server Component, Client Component con Suspense
- Nada funciona

**Fix aplicado (26/08/2026):**
- Root cause probable: `clearCart()` se ejecutaba antes del redirect y disparaba el guard de carrito vacío (`items.length === 0`) hacia `/marketplace`.
- Cambio: `clearCart()` se mueve a `/marketplace/checkout-new/success` después de montar la página.
- Cambio adicional: el guard de carrito vacío ahora se desactiva mientras el pedido se está enviando o redirigiendo a success.
- Cambio adicional: navegación a success usa `router.replace()` en lugar de `window.location.href`.
- `npm run type-check` pasa correctamente.
- Validado en navegador: `/marketplace/checkout-new/success?orderId=order_mock_1787743309226&display_id=CF-309226` renderiza correctamente.

**Workaround Temporal:**
- No necesario. Bug resuelto.

**Próximos Pasos:**
- [x] Probar sin clearCart() antes del redirect
- [x] Validar flujo completo en navegador
- [x] Confirmar success page renderizada

---

## 🔥 PRIORIDAD MÁXIMA - Flujo E2E Franquiciado

**Objetivo:** Completar el journey de compra end-to-end para franquiciados

### Sprint 1 (Próximos 5 días)
- [ ] **Catálogo de Productos (Franchisee)** - 2-3 días
  - Lista de productos con filtros
  - Vista detallada de producto  
  - Búsqueda y categorías
  - Integrar con productos existentes del admin
  
- [ ] **Carrito de Compra** - 1-2 días
  - Añadir/quitar productos
  - Modificar cantidades
  - Persistencia en localStorage
  - Cálculo de totales

### Sprint 2 (Próximos 5 días después)
- [ ] **Checkout Completo** - 2-3 días
  - Wizard multi-paso
  - Dirección de envío
  - Método de pago (mock)
  - Confirmación de pedido
  
- [ ] **Mis Pedidos (Franquiciado)** - 1-2 días
  - Historial de pedidos
  - Detalle de pedido
  - Estado de envío
  
- [ ] **Testing E2E** - 1 día
  - Probar flujo completo
  - Documentar en testing guide

**Resultado:** Franquiciado puede comprar productos end-to-end

---

## 📋 Estado General del Proyecto

### ✅ Completado (Fases 1-10)

- [x] **Fase 1-5:** Autenticación, dashboard básico, perfiles, navegación
- [x] **Fase 6:** Gestión de Márgenes Global y por Proveedor
- [x] **Fase 7:** Cola de Aprobación de Productos
- [x] **Fase 8:** Dashboard de Proveedor mejorado
- [x] **Fase 9:** Carga Masiva CSV
- [x] **Fase 10:** **Product Management (Admin CRUD)** ⭐ NUEVO 24/08/2026
- [x] Navegación mejorada (sidebars organizados por secciones)
- [x] Sistema de feature flags (modo mock/real API)
- [x] Documentación backend completa
- [x] Guía de usuario no técnica en español

---

## 🚧 En Desarrollo

### Alta Prioridad (Después de Flujo E2E)

#### 1. **Admin Orders - Gestión Global de Pedidos** 📦
**Estado:** ⏳ **PLANIFICADO** (Fase 2 - Sprint 3)  
**Ubicación:** `/admin/orders`  
**Modo:** Placeholder actual - Implementación después de flujo franquiciado  
**Tiempo estimado:** 2-3 días  
**Especificación:** Ver `docs/ADMIN_ORDERS_SPEC.md`

**Propósito:**
- Panel admin para ver TODOS los pedidos (todos franquiciados + proveedores)
- Diferente de `/supplier/orders` (solo pedidos del proveedor - ✅ ya completo)
- Gestión de incidencias, exportación, análisis global

**Por qué esperar:**
- Primero necesitamos que franquiciados puedan crear pedidos
- Entonces Admin Orders tendrá pedidos reales para gestionar
- Mejor ROI: completar flujo E2E primero

---

#### 2. **Gestión de Pedidos - Proveedor** 📦
**Estado:** ✅ **COMPLETADO** (22 Agosto 2026)  
**Ubicación:** `/supplier/orders`  
**Modo:** Mock data (backend pendiente)

**Funcionalidades implementadas:**
- [x] Ver todos los pedidos que contienen productos del proveedor
- [x] Filtrar pedidos por estado:
  - Pendientes (nuevos)
  - Confirmados
  - En preparación
  - Enviados
  - Entregados
  - Cancelados
  - Rechazados
- [x] Aceptar o rechazar pedidos nuevos
- [x] Actualizar estado de preparación
  - Cambiar de "Confirmado" a "En Preparación"
  - Cambiar de "En Preparación" a "Enviado"
- [x] Agregar información de seguimiento:
  - Número de tracking
  - Transportista
  - URL de seguimiento
  - Fecha estimada de entrega
- [x] Vista detalle de pedido:
  - Productos incluidos (solo los del proveedor)
  - Cantidades y precios
  - Cliente (franquiciado)
  - Dirección de entrega completa
  - Fecha de pedido
  - Estado actual con timeline
- [x] Métricas del proveedor:
  - Pedidos pendientes de procesar
  - Pedidos en preparación
  - Pedidos enviados
  - Ingresos del mes
- [x] Búsqueda por número de pedido o cliente
- [x] Mock data con 5 pedidos de ejemplo
- [x] Sistema de feature flags (mock/real)
- [x] Documentación completa

**Pendiente:**
- [ ] Gestión de incidencias completa (estructura creada)
- [ ] Notificaciones por email (requiere backend)
- [ ] Integración con backend real (7 endpoints documentados)

**Dependencias Backend:**
- API `/supplier/orders` - Listar pedidos del proveedor
- API `/supplier/orders/:id` - Detalle de pedido
- API `/supplier/orders/:id/accept` - Aceptar pedido
- API `/supplier/orders/:id/reject` - Rechazar pedido
- API `/supplier/orders/:id/status` - Actualizar estado
- API `/supplier/orders/:id/tracking` - Agregar información de tracking
- API `/supplier/orders/:id/incidents` - Gestionar incidencias
- API `/supplier/orders/stats` - Estadísticas

**Archivos creados:** ✅
- `src/types/orders-supplier.ts` - Tipos TypeScript
- `src/lib/api/orders-supplier-client.ts` - Cliente API
- `src/lib/api/orders-supplier-mock.ts` - Datos mock
- `src/components/supplier/OrdersList.tsx` - Componente listado
- `src/components/supplier/OrderDetail.tsx` - Componente detalle
- `src/components/supplier/OrderStatusBadge.tsx` - Badge de estado
- `src/app/(supplier)/supplier/orders/page.tsx` - Página principal ✅
- `src/app/(supplier)/supplier/orders/[id]/page.tsx` - Página detalle ✅
- `docs/technical/SUPPLIER_ORDERS_IMPLEMENTATION.md` - Documentación

**Prioridad:** ✅ **COMPLETADO** - Funcionando en modo mock

**Documentación:** [SUPPLIER_ORDERS_IMPLEMENTATION.md](./docs/technical/SUPPLIER_ORDERS_IMPLEMENTATION.md)

---

#### 2. **Gestión de Pedidos - Franquiciado** 🛒
**Estado:** Pendiente  
**Ubicación:** `/marketplace` + `/marketplace/orders`

**Funcionalidades requeridas:**
- [ ] Catálogo de productos navegable (ya existe estructura básica)
- [ ] Carrito de compras:
  - Agregar/quitar productos
  - Modificar cantidades
  - Ver subtotal y total
  - Persistencia en localStorage
- [ ] Proceso de checkout:
  - Revisar carrito
  - Dirección de entrega
  - Método de pago
  - Confirmación
- [ ] Mis Pedidos (`/marketplace/orders`):
  - Listado de pedidos realizados
  - Filtros por estado
  - Ver detalle
  - Descargar factura
  - Tracking de envío
- [ ] Notificaciones de estado de pedido

**Dependencias Backend:**
- API `/store/cart` - Gestión de carrito
- API `/store/checkout` - Proceso de compra
- API `/store/orders` - Listar pedidos del franquiciado
- API `/store/orders/:id` - Detalle de pedido

**Prioridad:** 🔴 **ALTA**

**Estimación:** 3-4 días de desarrollo

---

### Media Prioridad

#### 3. **Sistema de Notificaciones** 🔔
**Estado:** Parcial (solo configuración UI)  
**Descripción:** Configuración existe en `/supplier/settings` pero no hay backend

**Funcionalidades pendientes:**
- [ ] Notificaciones in-app (toast/snackbar)
- [ ] Centro de notificaciones (dropdown)
- [ ] Notificaciones por email (backend)
- [ ] Preferencias por tipo de notificación
- [ ] Marcar como leído/no leído

**Prioridad:** 🟡 **MEDIA**

---

#### 4. **Gestión de Stock** 📊
**Estado:** Datos básicos solo  
**Descripción:** Proveedores pueden ver stock, pero no actualizarlo

**Funcionalidades pendientes:**
- [ ] Actualizar stock manualmente
- [ ] Alertas de stock bajo (configurables)
- [ ] Historial de cambios de stock
- [ ] Import/export de niveles de stock

**Prioridad:** 🟡 **MEDIA**

---

#### 5. **Sistema de Incidencias** ⚠️
**Estado:** Mencionado, no implementado

**Funcionalidades pendientes:**
- [ ] Reportar incidencia en pedido
- [ ] Tipos de incidencia:
  - Producto dañado
  - Producto incorrecto
  - Cantidad incorrecta
  - Retraso en entrega
- [ ] Chat/comentarios en incidencia
- [ ] Adjuntar fotos
- [ ] Resolución de incidencias
- [ ] Historial

**Prioridad:** 🟡 **MEDIA**

---

### Baja Prioridad

#### 6. **Analytics y Reportes** 📈
**Estado:** No iniciado

**Funcionalidades pendientes:**
- [ ] Dashboard analítico para admins
- [ ] Reportes de ventas por proveedor
- [ ] Reportes de compras por franquiciado
- [ ] Productos más vendidos
- [ ] Exportación de reportes (PDF, Excel)
- [ ] Gráficos y visualizaciones

**Prioridad:** 🟢 **BAJA**

---

#### 7. **Sistema de Favoritos** ⭐
**Estado:** No iniciado

**Funcionalidades pendientes:**
- [ ] Agregar productos a favoritos
- [ ] Ver lista de favoritos
- [ ] Notificaciones de cambio de precio
- [ ] Compartir favoritos

**Prioridad:** 🟢 **BAJA**

---

#### 8. **Comparador de Productos** ⚖️
**Estado:** No iniciado

**Funcionalidades pendientes:**
- [ ] Seleccionar productos para comparar
- [ ] Vista comparativa (tabla)
- [ ] Resaltar diferencias
- [ ] Comparar precios

**Prioridad:** 🟢 **BAJA**

---

#### 9. **Sistema de Reseñas** ⭐
**Estado:** No iniciado

**Funcionalidades pendientes:**
- [ ] Franquiciados pueden dejar reseñas
- [ ] Calificación con estrellas (1-5)
- [ ] Comentarios
- [ ] Respuestas del proveedor
- [ ] Marcar reseñas útiles
- [ ] Moderar reseñas (admin)

**Prioridad:** 🟢 **BAJA**

---

## 🐛 Bugs Conocidos

### Críticos
- Ninguno actualmente

### Menores
- [ ] Warnings de compilación en Vercel (unused variables, missing dependencies)
  - 30 warnings de imports no usados
  - 15 warnings de dependencies faltantes en useEffect
  - 10 warnings de tags `<img>` (deberían ser `<Image>`)
  - 25 warnings de tipos `any`

---

## 🔧 Mejoras Técnicas

### Deuda Técnica
- [ ] Limpiar imports no usados
- [ ] Agregar dependencies faltantes en hooks
- [ ] Migrar `<img>` a `<Image>` de Next.js
- [ ] Tipar correctamente variables `any`
- [ ] Agregar tests unitarios (0% cobertura actual)
- [ ] Agregar tests E2E
- [ ] Mejorar manejo de errores
- [ ] Optimizar rendimiento (lazy loading, code splitting)

### Infraestructura
- [ ] Configurar CI/CD pipeline
- [ ] Agregar linting automático (pre-commit hooks)
- [ ] Configurar Prettier
- [ ] Agregar Storybook para componentes
- [ ] Documentación técnica de componentes
- [ ] Agregar Sentry para error tracking

---

## 📝 Documentación Pendiente

- [ ] API Reference completa
- [ ] Guía de contribución
- [ ] Guía de deployment
- [ ] Arquitectura técnica
- [ ] Diagramas de flujo
- [ ] Testing guidelines

---

## 🎯 Roadmap Q3-Q4 2026

### Septiembre 2026
- ✅ Fases 6-9 completadas (pricing workflow)
- 🚧 **Gestión de Pedidos - Proveedor** (prioridad #1)
- 🚧 **Gestión de Pedidos - Franquiciado** (prioridad #2)

### Octubre 2026
- Sistema de Notificaciones
- Gestión de Stock mejorada
- Sistema de Incidencias

### Noviembre 2026
- Analytics y Reportes
- Sistema de Favoritos
- Optimizaciones de rendimiento

### Diciembre 2026
- Sistema de Reseñas
- Comparador de Productos
- Polish general y bug fixes

---

## 📊 Estadísticas del Proyecto

**Líneas de código:** ~25,000  
**Componentes:** ~80  
**Páginas:** ~25  
**Tipos TypeScript:** ~150  
**Mock data:** 7 módulos  
**Documentación:** 15+ archivos  

**Cobertura de tests:** 0% (pendiente implementar)  
**Warnings de compilación:** ~80  
**Errores conocidos:** 0  

---

## 🔗 Enlaces Útiles

- [Guía de Usuario](GUIA_COMPLETA_USUARIOS.md)
- [Documentación Backend](docs/integration/BACKEND_REQUIREMENTS.md)
- [Features Completas](docs/FEATURES.md)
- [Deployment Guide](docs/deployment/DEPLOYMENT_GUIDE.md)

---

**Última actualización:** 21 Agosto 2026  
**Mantenido por:** Equipo de Desarrollo
