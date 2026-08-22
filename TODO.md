# TODO - Marketplace B2B Carrefour

**Actualizado:** 21 Agosto 2026

---

## 📋 Estado General del Proyecto

### ✅ Completado (Fases 1-9)

- [x] **Fase 1-5:** Autenticación, dashboard básico, perfiles, navegación (completado en sesión anterior)
- [x] **Fase 6:** Gestión de Márgenes Global y por Proveedor (SellerMarkupManager)
- [x] **Fase 7:** Cola de Aprobación de Productos (ApprovalQueue)
- [x] **Fase 8:** Dashboard de Proveedor mejorado (ProductsList + detalle con timeline)
- [x] **Fase 9:** Carga Masiva CSV (22 columnas, drag & drop, 4 etapas)
- [x] Navegación mejorada (sidebars organizados por secciones)
- [x] Sistema de feature flags (modo mock/real API)
- [x] Documentación backend completa (5 documentos)
- [x] Guía de usuario no técnica en español

---

## 🚧 En Desarrollo

### Alta Prioridad

#### 1. **Gestión de Pedidos - Proveedor** 📦
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
