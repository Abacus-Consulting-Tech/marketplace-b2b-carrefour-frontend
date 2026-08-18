# Marketplace B2B Carrefour - Frontend

<div align="center">

**Plataforma digital B2B para franquiciados Carrefour**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Medusa](https://img.shields.io/badge/Backend-Medusa-blueviolet)](https://medusajs.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENSE)

</div>

---

## 📋 Descripción

Marketplace privado que conecta a franquiciados Carrefour con proveedores aprobados, facilitando la adquisición de productos y servicios operativos necesarios para sus establecimientos (no destinados a la venta al consumidor final).

### Funcionalidades Principales

- 🏪 **Gestión de Franquiciados** - Registro, perfiles y administración de establecimientos
- 📦 **Gestión de Proveedores** - Onboarding y gestión de catálogos
- 🛒 **Catálogo de Productos** - Navegación, búsqueda avanzada y comparación
- 📝 **Sistema de Órdenes** - Creación, seguimiento y gestión de pedidos
- 💳 **Gestión de Compras** - Carrito, checkout y facturación
- 🎫 **Gestión de Incidencias** - Tickets y resolución de problemas

Para más detalles, ver [**Features Overview**](./docs/FEATURES.md).

---

## 🚀 Quick Start

### Requisitos Previos

- **Node.js** 18.x o superior
- **npm** 8.x o superior
- Acceso al backend Medusa en Render

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Abacus-Consulting-Tech/marketplace-b2b-carrefour-frontend.git
cd marketplace-b2b-carrefour-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

**Guía detallada:** [Getting Started](./docs/setup/GETTING_STARTED.md)

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.0
- **UI Library:** Shadcn/ui + Tailwind CSS
- **State Management:** Zustand + TanStack Query (React Query)
- **Forms:** React Hook Form + Zod validation
- **Tables:** TanStack Table
- **API Client:** Axios
- **Testing:** Vitest + React Testing Library + Playwright

### Backend
- **Platform:** Medusa 2.x (MercurJS)
- **Database:** PostgreSQL (Supabase)
- **Cache:** Redis (Upstash)
- **Deployment:** Render DEV
- **Auth:** JWT (Bearer token)

**URL Backend DEV:** `https://marketplace-b2b-backend-dev.onrender.com`

---

## 🔧 Environment Configuration

### Proxy por Entornos (Patrón Angular)

El proyecto usa un sistema de configuración de proxy por entornos, similar al patrón Angular:

```bash
# Development (default) - usa proxy local
npm run dev

# Staging - usa backend staging
npm run dev:staging

# Production - llamadas directas (requiere CORS)
npm run dev:prod
```

**Archivos de configuración:**
- `proxy.dev.conf.js` - Development
- `proxy.staging.conf.js` - Staging
- `proxy.prod.conf.js` - Production

**Documentación:** [Proxy Configuration](./docs/PROXY_CONFIG.md)

### Variables de Entorno

```bash
# Backend
NEXT_PUBLIC_API_URL=https://marketplace-b2b-backend-dev.onrender.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxx

# Environment (optional)
NEXT_PUBLIC_ENV=development  # development | staging | production

# Mock Mode (development)
NEXT_PUBLIC_MOCK_AUTH=false
```

---

## 📁 Estructura del Proyecto

```
marketplace-b2b-carrefour-frontend/
├── docs/                      # 📚 Documentación completa
│   ├── setup/                # Getting started
│   ├── technical/            # Arquitectura, API, desarrollo
│   ├── deployment/           # Guías de despliegue
│   ├── testing/              # Guías de testing
│   ├── guides/               # Manuales de usuario
│   ├── medusa/               # Docs backend Medusa
│   └── postman/              # Colecciones API
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Rutas autenticación
│   │   ├── (marketplace)/   # Rutas franquiciados
│   │   ├── (supplier)/      # Rutas proveedores
│   │   ├── (backoffice)/    # Rutas admin
│   │   └── (onboarding)/    # Rutas onboarding
│   ├── components/           # Componentes reutilizables
│   │   ├── ui/              # Componentes Shadcn
│   │   ├── auth/            # Auth components
│   │   ├── dashboard/       # Dashboard widgets
│   │   └── navigation/      # Header, Footer
│   ├── lib/                  # Utilities y helpers
│   │   ├── api/             # Clientes API
│   │   └── store/           # Zustand stores
│   ├── hooks/                # Custom hooks
│   ├── types/                # TypeScript types
│   └── styles/               # Global styles
├── public/                   # Assets estáticos
├── scripts/                  # Utility scripts
├── proxy.dev.conf.js         # Proxy development
├── proxy.staging.conf.js     # Proxy staging
├── proxy.prod.conf.js        # Proxy production
└── next.config.js            # Next.js config
```

---

## 👥 Roles de Usuario

| Rol | Email Pattern | Dashboard | Descripción |
|-----|---------------|-----------|-------------|
| **Admin** | `admin@*`, `acano@*` | `/admin/dashboard` | Administradores de plataforma |
| **Proveedor** | `seller@*`, `mercur@*`, `kickz@*`, `trailhead@*` | `/supplier/dashboard` | Proveedores y vendedores |
| **Franquiciado** | Otros | `/marketplace/dashboard` | Franquiciados Carrefour (default) |

**Credenciales DEV:** Ver [Credentials](./docs/medusa/CREDENTIALS.md)

**Sistema de roles:** [Roles y Redirecciones](./docs/ROLES_Y_REDIRECCIONES.md)

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

**Guía completa:** [Testing Guide](./docs/testing/TESTING_GUIDE.md)

---

## 📦 Deployment

### Opción 1: Vercel (Recomendado)

```bash
# Deploy a Vercel
vercel deploy
```

**Guía:** [Vercel Deployment](./docs/deployment/VERCEL_DEPLOYMENT.md)

### Opción 2: Servidor Propio (cdmon, etc.)

```bash
# Build para producción
npm run build

# Iniciar servidor
npm start
```

**Guía completa:** [Deployment Guide](./docs/deployment/DEPLOYMENT_GUIDE.md)

**Quick deployment:** [Quick Guide](./docs/deployment/QUICK_DEPLOYMENT.md)

---

## 📚 Documentación

### 🔗 Documentación Principal

- 📖 **[Índice de Documentación](./docs/README.md)** - Índice completo
- 🎯 **[Features](./docs/FEATURES.md)** - Funcionalidades detalladas
- 🏗️ **[Architecture](./docs/technical/ARCHITECTURE.md)** - Arquitectura del sistema
- 💻 **[Development](./docs/technical/DEVELOPMENT.md)** - Guía de desarrollo
- 🔌 **[API Specification](./docs/technical/API_SPEC.md)** - Especificación de API

### 🔄 Backend Integration

- 🔗 **[Backend Pendiente](./docs/BACKEND_PENDIENTE.md)** - Estado integración Medusa
- 🔐 **[Auth Integration](./docs/AUTH_INTEGRATION.md)** - Integración autenticación
- 🌐 **[Proxy Config](./docs/PROXY_CONFIG.md)** - Configuración proxy por entornos
- 🏗️ **[Proxy Architecture](./docs/PROXY_ARCHITECTURE.md)** - Arquitectura del proxy

### 📘 Guías Específicas

- 🚀 **[Getting Started](./docs/setup/GETTING_STARTED.md)** - Instalación y setup
- 📮 **[Postman Collections](./docs/postman/README.md)** - Colecciones API
- 👤 **[User Guide](./docs/guides/GUIA_USUARIO.md)** - Manual de usuario

---

## 🔗 Backend API

### Endpoints Principales

| Endpoint | Descripción | Proxy Dev |
|----------|-------------|-----------|
| `POST /auth/user/emailpass` | Login | `/backend/auth/user/emailpass` |
| `GET /store/regions` | Regiones disponibles | `/backend/store/regions` |
| `GET /store/products` | Catálogo productos | `/backend/store/products` |
| `GET /admin/users/me` | Perfil usuario | `/backend/admin/users/me` |
| `GET /health` | Health check | `/backend/health` |

**Documentación completa:** [API Spec](./docs/technical/API_SPEC.md)

**Smoke tests:** [Checklist](./docs/medusa/smoke-test-checklist.md)

---

## 🤝 Contributing

1. Crear branch desde `main`:
   ```bash
   git checkout -b feature/mi-funcionalidad
   ```

2. Hacer commits descriptivos:
   ```bash
   git commit -m "feat: add user profile page"
   ```

3. Push y crear Pull Request:
   ```bash
   git push origin feature/mi-funcionalidad
   ```

**Convenciones:** Ver [Development Guide](./docs/technical/DEVELOPMENT.md)

---

## 📞 Soporte

- **Documentación:** [docs/](./docs/)
- **Issues:** GitHub Issues
- **Email:** soporte@carrefour-b2b.com

---

## 📄 License

Copyright © 2026 Carrefour - Abacus Consulting. Todos los derechos reservados.

Ver [LICENSE](./LICENSE) para más detalles.
