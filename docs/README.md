# Marketplace B2B Carrefour - Índice de Documentación

**Última actualización**: 03 de Septiembre de 2026

Esta carpeta contiene toda la documentación del proyecto Marketplace B2B Carrefour, reorganizada para mejor navegación.

---

## 🎯 Fuentes de Verdad (Source of Truth)

Para información actualizada del proyecto, consultar estas **3 fuentes oficiales**:

1. **📊 [Estado y Roadmap](PROJECT_STATUS_AND_ROADMAP.md)** ⭐ - Documento maestro con estado actual, módulos completados, roadmap y alineación con Especificación Técnica v1.0
2. **🔧 [Dev Tools Panel](http://localhost:3000/admin/dev-tools)** - Panel en vivo con el inventario actual de endpoints y flags activos
3. **📚 [Documentación Técnica](technical/)** - Guías técnicas detalladas por módulo

---

## 📁 Estructura de Documentación (Reorganizada 26/08/2026)

### ⭐ Documentos Maestros (Raíz)

- **[PROJECT_STATUS_AND_ROADMAP.md](PROJECT_STATUS_AND_ROADMAP.md)** - 📊 Estado del proyecto, roadmap completo, alineación con spec
- **[TODO.md](TODO.md)** - 📝 Tareas pendientes consolidadas

### 📋 [specs/](specs/) - Especificaciones y Requisitos

Documentos de especificación funcional y técnica del proyecto.

- **[FEATURES.md](specs/FEATURES.md)** - Lista completa de features del marketplace
- **[MODULES_ORGANIZATION.md](specs/MODULES_ORGANIZATION.md)** - Organización de módulos
- **[ADMIN_ORDERS_SPEC.md](specs/ADMIN_ORDERS_SPEC.md)** - Especificación módulo Admin Orders
- **Especificación Técnica v1.0** (PDF 23 páginas) - Documento oficial Infocus/Abacus con 18 módulos, 7 fases, 6 decisiones bloqueantes

### ✅ [completed/](completed/) - Módulos Completados

Documentación de módulos ya implementados y testeados.

- **[ADMIN_ORDERS_COMPLETED.md](completed/ADMIN_ORDERS_COMPLETED.md)** - Vista global de pedidos (7 archivos, 1,800 líneas)
- **[FRANCHISEE_ORDERS_COMPLETED.md](completed/FRANCHISEE_ORDERS_COMPLETED.md)** - Mis Pedidos franchisee (9 archivos, 1,890 líneas)
- **[QUOTES_COMPLETADO.md](completed/QUOTES_COMPLETADO.md)** - Sistema de presupuestos (11 archivos, 1,500 líneas)
- **[QUOTES_MODULE_COMPLETED.md](completed/QUOTES_MODULE_COMPLETED.md)** - Documentación técnica completa quotes
- **[FRANCHISEE_MANAGEMENT_PROGRESS.md](completed/FRANCHISEE_MANAGEMENT_PROGRESS.md)** - Gestión de franquiciados (10 archivos, 2,511 líneas)

### 🏗️ [architecture/](architecture/) - Decisiones de Arquitectura

Documentos sobre decisiones técnicas, alineación con backend y reuniones.

- **[JUSTIFICACION_ARQUITECTURA_FRONTEND.md](architecture/JUSTIFICACION_ARQUITECTURA_FRONTEND.md)** - Defensa de arquitectura custom vs plantilla
- **[BACKEND_ROADMAP.md](architecture/BACKEND_ROADMAP.md)** - Roadmap de integración con backend Medusa/MercurJS
- **[MEETING_NOTES_BACKEND_ALIGNMENT.md](architecture/MEETING_NOTES_BACKEND_ALIGNMENT.md)** - Notas de reuniones técnicas y alineación

### 📦 Documentación Backend (Para Backend Team)

**Carpeta: [`modules/`](modules/)** - 15 documentos organizados por módulo

- **[Índice de Módulos](modules/README.md)** - Resumen de 10 módulos con documentación
- `01-auth/` - Autenticación y autorización
- `02-openings/` - Gestión de aperturas (2 documentos)
- `03-categories/` - Categorías (productos + aperturas) ✅ 840 líneas SQL
- `04-supplier-orders/` - Pedidos de proveedores
- `05-product-pricing/` - Aprobación de precios (3 documentos + SQL)
- `06-product-management/` - CRUD de productos
- `07-franchisee-catalog/` - Catálogo de franquiciado
- `08-franchisee-orders/` - Pedidos de franquiciados
- `09-admin-orders/` - Vista global de pedidos (2 documentos + SQL)
- `10-quotes/` - Presupuestos (2 documentos + SQL 840 líneas)

**Ver detalles completos**: [modules/README.md](modules/README.md)

### 🏗️ Arquitectura y Desarrollo

**Carpeta: [`technical/`](technical/)** ⭐ FUENTE DE VERDAD

- **[Architecture](technical/ARCHITECTURE.md)** - Arquitectura del sistema
- **[Development](technical/DEVELOPMENT.md)** - Setup y workflow de desarrollo
- **[API Specification](technical/API_SPEC.md)** - Especificación completa de la API
- **[CHECKOUT_IMPLEMENTATION.md](technical/CHECKOUT_IMPLEMENTATION.md)** - Implementación del checkout
- **[MEDUSA_INTEGRATION_COMPLETE.md](technical/MEDUSA_INTEGRATION_COMPLETE.md)** - Integración con Medusa
- **`openings/`** - Módulo de nuevas aperturas (guías completas)

### 🔄 Backend Integration & Status

**Carpeta: [`integration/`](integration/)**

- **[Backend Status Report](integration/BACKEND_STATUS.md)** - Estado actual de integración
- **[Backend Pendiente](integration/BACKEND_PENDIENTE.md)** - Tareas pendientes backend
- **[Backend Connection Troubleshooting](integration/BACKEND_CONNECTION_TROUBLESHOOTING.md)** - Solución de problemas
- **[Proxy Configuration](integration/PROXY_CONFIG.md)** - Sistema de proxy por entornos
- **[Proxy Architecture](integration/PROXY_ARCHITECTURE.md)** - Arquitectura del proxy
- **[Roles y Redirecciones](integration/ROLES_Y_REDIRECCIONES.md)** - Sistema de roles
- **[Stripe Payment Integration](integration/STRIPE_PAYMENT_INTEGRATION.md)** - Integración de pagos

### 🧪 Testing

**Carpeta: [`testing/`](testing/)** - 7 guías de testing por módulo

- **[Índice de Testing](testing/README.md)** - Resumen de todas las guías
- `TESTING_CATALOG.md` - Testing del catálogo
- `TESTING_PRODUCT_MANAGEMENT.md` - Testing CRUD de productos
- `TESTING_CATEGORY_MANAGEMENT.md` - Testing de categorías
- `TESTING_COMPARISON.md` - Testing del comparador
- `TESTING_FRANCHISEE_MANAGEMENT.md` - Testing gestión franquiciados
- `TESTING_INVITATIONS.md` - Testing de invitaciones
- `TESTING_QUOTE_FORM.md` - Testing de presupuestos

### 📚 Guías de Usuario

**Carpeta: [`guides/`](guides/)**

- **[Guía Completa de Usuarios](guides/GUIA_COMPLETA_USUARIOS.md)** - Manual completo en español
- **[User Guide](guides/USER_GUIDE.md)** - Manual en inglés
- **[Guía Onboarding Franquiciado](guides/GUIA_ONBOARDING_FRANQUICIADO.md)** - Alta paso a paso para franquiciados
- **[Guía Onboarding Proveedor](guides/GUIA_ONBOARDING_PROVEEDOR.md)** - Alta paso a paso para proveedores
- **[Guía Admin Onboarding Franquiciado](guides/GUIA_ADMIN_ONBOARDING_FRANQUICIADO.md)** - Proceso administrativo de alta de franquiciados
- **[Guía Admin Onboarding Proveedor](guides/GUIA_ADMIN_ONBOARDING_PROVEEDOR.md)** - Proceso administrativo de alta de proveedores
- Versiones PDF disponibles en la misma carpeta para compartir con cliente cuando sea necesario
- **[Quick Test Openings](guides/QUICK_TEST_OPENINGS.md)** - Guía rápida de testing de aperturas
- **[Supplier Registration](guides/SUPPLIER_REGISTRATION.md)** - Contrato backend del onboarding de proveedores
- **[Mercur Hybrid Setup](guides/MERCUR_HYBRID_SETUP_GUIDE.md)** - Configuración híbrida

### 📦 Deployment

**Carpeta: [`deployment/`](deployment/)**

- **[Workflow Guide](deployment/WORKFLOW.md)** - Flujo de trabajo: dev vs producción
- **[Deployment Guide](deployment/DEPLOYMENT_GUIDE.md)** - Guía completa de despliegue
- **[Quick Deployment](deployment/QUICK_DEPLOYMENT.md)** - Despliegue rápido
- **[Vercel Deployment](deployment/VERCEL_DEPLOYMENT.md)** - Despliegue en Vercel

### 🔧 Backend Medusa

**Carpeta: [`medusa/`](medusa/)**

- **[Frontend Usage](medusa/README-front-usage.md)** - Uso del backend desde frontend
- **[Smoke Test Checklist](medusa/smoke-test-checklist.md)** - Tests de integración
- **[Credentials](medusa/CREDENTIALS.md)** - Credenciales de desarrollo
- **[Datos Iniciales](medusa/DATOS_INICIALES.md)** - Mock data para BD
- **[API Calls Actual](medusa/API_CALLS_ACTUAL.md)** - Todas las llamadas API

### 📮 Postman Collections

**Carpeta: [`postman/`](postman/)**

- **[Postman README](postman/README.md)** - Índice de colecciones
- **[Testing Guide](postman/TESTING.md)** - Guía de testing con Postman
- Colecciones y entornos configurados

### 🚀 Setup Inicial

**Carpeta: [`setup/`](setup/)**

- **[Getting Started](setup/GETTING_STARTED.md)** - Instalación y configuración inicial

---

## 🔗 Quick Links

### Para Desarrolladores Frontend

1. **Primer día**: [Getting Started](setup/GETTING_STARTED.md)
2. **Estado del proyecto**: [PROJECT_STATUS_AND_ROADMAP.md](PROJECT_STATUS_AND_ROADMAP.md) ⭐
3. **Arquitectura**: [Architecture](technical/ARCHITECTURE.md)
4. **Dev Tools**: [http://localhost:3000/admin/dev-tools](http://localhost:3000/admin/dev-tools) 🔧
5. **Proxy Config**: [Proxy Configuration](integration/PROXY_CONFIG.md)
6. **Testing**: [Testing README](testing/README.md)

### Para Backend Team

1. **Documentación Backend Completa**: [modules/README.md](modules/README.md) ⭐
2. **Estado del Proyecto**: [PROJECT_STATUS_AND_ROADMAP.md](PROJECT_STATUS_AND_ROADMAP.md) ⭐
3. **Especificación API**: [API Spec](technical/API_SPEC.md)
4. **Módulo Aperturas**: [Backend Guide](technical/openings/BACKEND_GUIDE.md)
5. **Pendientes Backend**: [Backend Pendiente](integration/BACKEND_PENDIENTE.md)
6. **Testing API**: [Postman Testing](postman/TESTING.md)
7. **Smoke Tests**: [Smoke Test Checklist](medusa/smoke-test-checklist.md)

### Para Deployment

1. **Workflow**: [Workflow Guide](deployment/WORKFLOW.md)
2. **Despliegue Rápido**: [Quick Deployment](deployment/QUICK_DEPLOYMENT.md)
3. **Despliegue Completo**: [Deployment Guide](deployment/DEPLOYMENT_GUIDE.md)

### Para Usuarios Finales

1. **Manual de Usuario**: [Guía Completa](guides/GUIA_COMPLETA_USUARIOS.md)
2. **User Guide (EN)**: [User Guide](guides/USER_GUIDE.md)

---

## 📊 Estadísticas de Documentación

- **Backend Docs**: 15 documentos en `modules/`
- **Testing Guides**: 7 guías en `testing/`
- **Technical Docs**: 10+ documentos en `technical/`
- **User Guides**: 3+ guías en `guides/`
- **SQL Scripts**: 4 módulos (Categories, Pricing, Orders, Quotes)
- **README Files**: 12 índices

---

## 📞 Soporte

Para dudas sobre la documentación:
- **Dev Tools Panel**: [http://localhost:3000/admin/dev-tools](http://localhost:3000/admin/dev-tools)
- **Estado del Proyecto**: [PROJECT_STATUS_AND_ROADMAP.md](PROJECT_STATUS_AND_ROADMAP.md)
- **Contacto Backend**: Ver email enviado al equipo backend

---

**Última actualización**: 25 de Agosto de 2026  
**Mantenido por**: Frontend Team
