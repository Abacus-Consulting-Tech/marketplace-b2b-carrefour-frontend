# Módulos - Documentación para Backend

> Estado de estas carpetas: documentación de alcance e intención enviada al backend.
> Estado operativo validado en DEV: consultar primero `src/app/(backoffice)/admin/dev-tools/page.tsx`, `.github/ai/API_STATUS.md` y `.github/ai/PROJECT_STATE.md`.

Esta carpeta contiene la documentación organizada por módulos que se ha enviado al equipo de backend.

## 📁 Estructura de Módulos

### ✅ Módulos Documentados (13/13)

| # | Módulo | Carpeta | Documentos Backend |
|---|--------|---------|-------------------|
| 1 | **Auth** | `01-auth/` | AUTH_API_SPEC.md |
| 2 | **Openings** | `02-openings/` | BACKEND_GUIDE.md, EMAIL_PARA_BACKEND.md |
| 3 | **Categories** | `03-categories/` | CATEGORIES_BACKEND.md |
| 4 | **Supplier Orders** | `04-supplier-orders/` | SUPPLIER_ORDERS_BACKEND_SIMPLE.md |
| 5 | **Product Pricing/Approval** | `05-product-pricing/` | BACKEND_REQUIREMENTS.md, BACKEND_SQL_MIGRATIONS.md, BACKEND_CODE_EXAMPLES.md |
| 6 | **Product Management (Admin)** | `06-product-management/` | PRODUCTS_API_REAL_MEDUSA.md |
| 7 | **Franchisee Catalog** | `07-franchisee-catalog/` | _Mock data, sin backend específico_ |
| 8 | **Franchisee Orders** | `08-franchisee-orders/` | FRANCHISEE_ORDERS_COMPLETED.md |
| 9 | **Admin Orders** | `09-admin-orders/` | ADMIN_ORDERS_COMPLETED.md, BACKEND_ORDER_SEED_REQUEST.md |
| 10 | **Quotes** | `10-quotes/` | QUOTES_COMPLETADO.md (ES), QUOTES_MODULE_COMPLETED.md (EN) |
| 11 | **Supplier Products** | `11-supplier-products/` | README.md, SUPPLIER_PRODUCTS_BACKEND.md |
| 12 | **Franchisee Management** | `12-franchisee-management/` | README.md, FRANCHISEE_MANAGEMENT_BACKEND.md, FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md |
| 13 | **Checkout** | `13-checkout/` | README.md, CHECKOUT_BACKEND.md |

---

## 📋 Resumen por Módulo

## ⚠️ Nota de vigencia

Varios READMEs de módulos fueron redactados cuando el frontend estaba completo en mock o cuando el backend objetivo todavía no se había revalidado contra DEV.

Situación validada a 2026-08-31:

- Estables para la UI actual en real: `auth`, `suppliers`, `pricing`, `orders`, `quotes`
- Mantenidos en mock en DEV por bloqueo backend o datos no utilizables: `openings`, `franchisees`, `products`, `catalog`, `checkout`, `categories`
- Caso especial: `supplier/products` funciona con fallback temporal desde `/seller/catalog-products` hacia `/vendor/custom/products`

### 1. Auth (Autenticación)
- **Frontend**: Login, registro, recuperación de contraseña
- **Backend Docs**: Especificaciones de API completas con mock data
- **Estado**: ✅ Enviado al backend

### 2. Openings (Nuevas Aperturas)
- **Frontend**: Gestión de proyectos de apertura de franquicias
- **Backend Docs**: Guía completa de backend + email para backend
- **Estado documental**: ✅ Enviado al backend
- **Estado validado en DEV**: 🎭 Mock, porque `/admin/openings/projects` devuelve `404`

### 3. Categories (Categorías)
- **Frontend**: Gestión de categorías de productos
- **Backend Docs**: Categorías de productos + categorías de aperturas con SQL seed
- **Estado**: ✅ Enviado al backend

### 4. Supplier Orders (Pedidos de Proveedores)
- **Frontend**: Vista de pedidos para proveedores
- **Backend Docs**: Especificaciones simplificadas de API
- **Estado**: ✅ Enviado al backend

### 5. Product Pricing/Approval (Tarificación y Aprobación)
- **Frontend**: Sistema de aprobación de productos y precios
- **Backend Docs**: Requirements, SQL migrations, code examples (3 docs)
- **Estado**: ✅ Enviado al backend

### 6. Product Management (Gestión de Productos Admin)
- **Frontend**: Panel admin para gestión de productos
- **Backend Docs**: API real de Medusa con adaptaciones
- **Estado**: ✅ Enviado al backend

### 7. Franchisee Catalog (Catálogo Franquiciado)
- **Frontend**: Catálogo de productos para franquiciados
- **Backend Docs**: Usa APIs de productos estándar de Medusa
- **Estado documental**: ✅ Sin documentación específica necesaria
- **Estado validado en DEV**: 🎭 Mock, porque `/store/products` no entrega catálogo utilizable para la UI

### 8. Franchisee Orders (Pedidos Franquiciado)
- **Frontend**: Historial de pedidos del franquiciado
- **Backend Docs**: Especificaciones completas con mock data
- **Estado**: ✅ Enviado al backend

### 9. Admin Orders (Pedidos Admin)
- **Frontend**: Vista global de todos los pedidos
- **Backend Docs**: Especificaciones + seed data request (2 docs)
- **Estado**: ✅ Enviado al backend

### 10. Quotes (Presupuestos)
- **Frontend**: Sistema de presupuestos para aperturas
- **Backend Docs**: Documentación completa en ES + EN con SQL seed
- **Estado**: ✅ Enviado al backend

### 11. Supplier Products (Productos del Proveedor)
- **Frontend**: CRUD de productos para proveedores (8 archivos, ~1,634 líneas)
- **Backend Docs**: README.md + SUPPLIER_PRODUCTS_BACKEND.md con 6 endpoints
- **Estado documental**: ✅ Documentación creada (25/08/2026)
- **Estado validado en DEV**: ⚠️ Real usable con fallback temporal; `GET /seller/catalog-products` sigue desalineado

### 12. Franchisee Management (Gestión de Franquiciados)
- **Frontend**: CRUD de franquiciados desde admin (10 archivos, ~2,511 líneas)
- **Backend Docs**: README.md + FRANCHISEE_MANAGEMENT_BACKEND.md + FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md
- **Estado documental**: ✅ Documentación actualizada (03/09/2026) con rutas actuales `/admin/customers*`, onboarding nuevo y rutas legacy `/admin/franchisees*`
- **Estado validado en DEV**: ⚠️ Parcial en backend, mock en UI; `/admin/customers*` GET devuelve `403`, `GET /store/customers/me` sí funciona y `POST /store/customers/me/addresses` devuelve `401`

### 13. Checkout (Flujo de Compra)
- **Frontend**: Checkout multi-step completo (15 archivos, ~3,366 líneas)
- **Backend Docs**: README.md + CHECKOUT_BACKEND.md con 10 endpoints + 5 extensiones
- **Estado documental**: ✅ Documentación creada (25/08/2026)
- **Estado validado en DEV**: 🎭 Mock, porque el catálogo/cart real no puede validarse de extremo a extremo

---

## 📊 Estadísticas

- **Total Módulos**: 13
- **Documentos Enviados**: 22 archivos
- **Módulos con Backend Docs**: 12/13
- **SQL Scripts**: 4 módulos (Categories, Pricing, Orders, Quotes)
- **Endpoints Documentados**: 122+ endpoints totales
- **Inventario operativo actual en source of truth**: 149 endpoints

---

## 🔄 Próximos Pasos

1. [x] ~~Crear documentación de backend para **Categories**~~ ✅ COMPLETADO
2. [ ] Cruzar esta documentación con la validación real de DEV antes de asumir que un módulo está operativo
3. [ ] Actualizar documentos según feedback del backend y según los bloqueos vigentes en `dev-tools`

---

**Última Actualización**: 03 de Septiembre de 2026
**Mantenedor**: Frontend Team
