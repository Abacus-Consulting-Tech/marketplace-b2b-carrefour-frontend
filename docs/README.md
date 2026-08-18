# Marketplace B2B Carrefour - Índice de Documentación

Esta carpeta contiene toda la documentación del proyecto Marketplace B2B Carrefour.

---

## 📁 Estructura de Documentación

### 🚀 Getting Started
- **[Getting Started](./setup/GETTING_STARTED.md)** - Guía de instalación y configuración inicial

### 🏗️ Arquitectura y Desarrollo
**Carpeta: [`technical/`](./technical/)**
- **[Architecture](./technical/ARCHITECTURE.md)** - Arquitectura del sistema y decisiones de diseño
- **[Development](./technical/DEVELOPMENT.md)** - Setup, convenciones de código y workflow de desarrollo
- **[API Documentation](./technical/API.md)** - Endpoints de la API y contratos (documentación base)
- **[API Specification](./technical/API_SPEC.md)** - Especificación completa de la API

### 🔄 Backend Integration (Medusa)
- **[Stripe Payment Integration](./STRIPE_PAYMENT_INTEGRATION.md)** - 💳 Guía completa de integración de pagos (NUEVO - 18/08/2026)
- **[Regions Update](./REGIONS_UPDATE_18_AUG.md)** - 🌍 Actualización de regiones - checkout desbloqueado
- **[Backend Status Report](./BACKEND_STATUS_18_AUG.md)** - 🔥 Estado actual con datos de verificación (18/08/2026)
- **[Backend Pendiente](./BACKEND_PENDIENTE.md)** - Estado de integración con Medusa backend
- **[Auth Integration](./AUTH_INTEGRATION.md)** - Integración de autenticación
- **[Proxy Configuration](./PROXY_CONFIG.md)** - Sistema de proxy por entornos (patrón Angular)
- **[Proxy Architecture](./PROXY_ARCHITECTURE.md)** - Arquitectura técnica del proxy
- **[CORS Workaround](./CORS_WORKAROUND.md)** - Solución temporal CORS
- **[Roles y Redirecciones](./ROLES_Y_REDIRECCIONES.md)** - Sistema de roles y navegación

### 📦 Deployment
**Carpeta: [`deployment/`](./deployment/)**
- **[Deployment Guide](./deployment/DEPLOYMENT_GUIDE.md)** - Guía completa de despliegue a servidor
- **[Quick Deployment](./deployment/QUICK_DEPLOYMENT.md)** - Guía rápida de despliegue
- **[Vercel Deployment](./deployment/VERCEL_DEPLOYMENT.md)** - Despliegue específico para Vercel

### 🧪 Testing
**Carpeta: [`testing/`](./testing/)**
- **[Testing Guide](./testing/TESTING_GUIDE.md)** - Guía completa de testing
- **[Dashboard Testing](./testing/DASHBOARD_TESTING_GUIDE.md)** - Tests específicos para dashboards

### 📚 User Guides
**Carpeta: [`guides/`](./guides/)**
- **[User Guide](./guides/USER_GUIDE.md)** - Manual de usuario para franquiciados y proveedores (inglés)
- **[Guía de Usuario](./guides/GUIA_USUARIO.md)** - Manual de usuario en español
- **[Mercur Hybrid Setup](./guides/MERCUR_HYBRID_SETUP_GUIDE.md)** - Configuración híbrida con Mercur
- **[Mercur API Migration Backlog](./guides/MERCUR_API_MIGRATION_BACKLOG.md)** - Backlog de migración

### 🎯 Features
- **[Features Overview](./FEATURES.md)** - Descripción detallada de todas las funcionalidades

### 🔧 Backend Documentation (Medusa)
**Carpeta: [`medusa/`](./medusa/)**
- **[Frontend Usage](./medusa/README-front-usage.md)** - Uso del backend Medusa desde frontend
- **[Smoke Test Checklist](./medusa/smoke-test-checklist.md)** - Checklist de tests de integración
- **[Credentials](./medusa/CREDENTIALS.md)** - Credenciales para entornos de desarrollo
- **[Datos Iniciales](./medusa/DATOS_INICIALES.md)** - 📦 Mock data para poblar la base de datos
- **[API Calls Actual](./medusa/API_CALLS_ACTUAL.md)** - 🔌 Todas las llamadas API que hace el frontend

### 📮 Postman Collections
**Carpeta: [`postman/`](./postman/)**
- **[Postman README](./postman/README.md)** - Índice de colecciones disponibles
- **[Testing Guide](./postman/TESTING.md)** - 🧪 Guía completa paso a paso de testing con Postman
- Colección principal: `marketplace-b2b-carrefour.postman_collection 1.json`
- Colección legacy: `mercur-store-api.postman_collection.json`
- Entornos configurados (local, Render DEV)

### 📋 Sprint Planning
**Carpeta: [`sprint_1/`](./sprint_1/)**
- Planificación y especificaciones del Sprint 1
- Bases legales y proveedores

### 📦 Archive
**Carpeta: [`archive/`](./archive/)**
- Documentación obsoleta o histórica
- Guías específicas de semanas pasadas

---

## 🔗 Quick Links

### Para Desarrolladores
1. **Primer día**: [Getting Started](./setup/GETTING_STARTED.md)
2. **Entender arquitectura**: [Architecture](./technical/ARCHITECTURE.md)
3. **Configurar proxy**: [Proxy Config](./PROXY_CONFIG.md)
4. **Hacer tests**: [Testing Guide](./testing/TESTING_GUIDE.md)
5. **Testing con Postman**: [Postman Testing](./postman/TESTING.md) 🧪

### Para Backend Team
1. **Pendientes backend**: [Backend Pendiente](./BACKEND_PENDIENTE.md)
2. **Especificación API**: [API Spec](./technical/API_SPEC.md)
3. **Testing de API**: [Postman Testing](./postman/TESTING.md) 🧪
4. **Tests de integración**: [Smoke Tests](./medusa/smoke-test-checklist.md)
5. **Datos para BD**: [Datos Iniciales](./medusa/DATOS_INICIALES.md) 📦

### Para Deployment
1. **Despliegue rápido**: [Quick Deployment](./deployment/QUICK_DEPLOYMENT.md)
2. **Despliegue completo**: [Deployment Guide](./deployment/DEPLOYMENT_GUIDE.md)

### Para Usuarios Finales
1. **Manual de usuario**: [Guía de Usuario](./guides/GUIA_USUARIO.md)

---

## 📞 Soporte

Para dudas sobre la documentación, contactar al equipo de desarrollo.
