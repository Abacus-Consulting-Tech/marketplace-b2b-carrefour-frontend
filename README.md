# Marketplace B2B Carrefour - Frontend

**Plataforma de comercio electrónico B2B para franquiciados y proveedores Carrefour**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)
[![Medusa](https://img.shields.io/badge/Medusa-2.x-7C3AED)](https://medusajs.com/)

---

## 📋 Estado del Proyecto

**Última Actualización**: 25 de Agosto de 2026  
**Versión**: 1.0.0  
**Estado**: ✅ 13 módulos completados (~19,866 líneas de código)

### 🎯 Fuentes de Verdad (Source of Truth)

Para información actualizada del proyecto, consultar estas **3 fuentes oficiales**:

1. **📊 [Estado y Roadmap](docs/PROJECT_STATUS_AND_ROADMAP.md)** - Documento maestro con estado actual, módulos completados y roadmap
2. **🔧 [Dev Tools Panel](http://localhost:3000/admin/dev-tools)** - Panel en vivo con 122 endpoints API documentados
3. **📚 [Documentación Técnica](docs/technical/)** - Guías técnicas detalladas por módulo

**Documentación Backend**: [docs/modules/](docs/modules/) - 13 módulos documentados para el equipo backend

---

## 🚀 Quick Start

### Prerequisitos

- Node.js 18+
- npm 9+

### Instalación

```bash
# Clonar repositorio
git clone [repository-url]
cd marketplace-b2b-carrefour-frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 🔑 Credenciales de Prueba (Mock Mode)

```
Admin:
  Email: admin@test.com
  Password: admin123

Franquiciado:
  Email: franchisee@test.com
  Password: franchisee123

Proveedor:
  Email: supplier@test.com
  Password: supplier123
```

---

## 📦 Módulos Completados (13/13)

| # | Módulo | Estado Frontend | Docs Backend | Testing |
|---|--------|----------------|--------------|---------|
| 1 | **Auth** | ✅ | ✅ | ⏳ |
| 2 | **Openings + Invitaciones** | ✅ | ✅ | ✅ |
| 3 | **Categories** | ✅ | ✅ | ⏳ |
| 4 | **Supplier Orders** | ✅ | ✅ | ⏳ |
| 5 | **Product Pricing** | ✅ | ✅ | ⏳ |
| 6 | **Product Management** | ✅ | ✅ | ✅ |
| 7 | **Franchisee Catalog** | ✅ | N/A | ✅ |
| 8 | **Franchisee Orders** | ✅ | ✅ | ✅ |
| 9 | **Admin Orders** | ✅ | ✅ | ✅ |
| 10 | **Quotes** | ✅ | ✅ | ⏳ |
| 11 | **Supplier Products** | ✅ | ⏳ | ⏳ |
| 12 | **Franchisee Management** | ✅ | ⏳ | ⏳ |
| 13 | **Checkout (Proceso Pago)** | ✅ | ⏳ | ⏳ |

**Total**: ~18,466 líneas de código, 122 endpoints API, 15 documentos backend

---

## 🏗️ Arquitectura

### Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript (strict mode)
- **Estilos**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand
- **Backend**: Medusa 2.x + Mercur framework
- **Autenticación**: JWT tokens
- **Feature Flags**: Sistema de mock/real switching

### Estructura del Proyecto

```
marketplace-b2b-carrefour-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Rutas de autenticación
│   │   ├── (marketplace)/     # Panel franquiciado
│   │   ├── (supplier)/        # Panel proveedor
│   │   └── (backoffice)/      # Panel administrador
│   ├── components/            # Componentes React reutilizables
│   ├── lib/
│   │   ├── api/              # Clientes API (mock + real)
│   │   └── store/            # Zustand stores
│   ├── types/                # TypeScript types
│   ├── config/               # Configuración (feature flags)
│   └── styles/               # Estilos globales
├── docs/                     # 📚 Documentación
│   ├── PROJECT_STATUS_AND_ROADMAP.md  # ⭐ Documento maestro
│   ├── modules/              # Docs backend por módulo
│   ├── technical/            # Guías técnicas
│   ├── testing/              # Guías de testing
│   ├── guides/               # Guías de usuario
│   └── integration/          # Guías de integración
└── public/                   # Assets estáticos
```

---

## 📚 Documentación Principal

### Para Desarrolladores Frontend

- **[Estado del Proyecto](docs/PROJECT_STATUS_AND_ROADMAP.md)** - Resumen ejecutivo, módulos completados, roadmap
- **[Arquitectura Frontend](docs/JUSTIFICACION_ARQUITECTURA_FRONTEND.md)** - Decisiones arquitectónicas
- **[Guías Técnicas](docs/technical/)** - Desarrollo, API, arquitectura

### Para Backend Team

- **[Módulos Organizados](docs/modules/README.md)** - Índice de 15 documentos backend
- **[Organización Completa](docs/MODULES_ORGANIZATION.md)** - Mapeo de documentos enviados
- **Documentos por módulo**: `docs/modules/01-auth/`, `02-openings/`, `03-categories/`, etc.

### Testing & Guías

- **[Testing](docs/testing/)** - 7 guías de testing por módulo
- **[Guías de Usuario](docs/guides/)** - Manuales completos de usuario

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo (http://localhost:3000)
npm run dev:open         # Servidor de desarrollo + abrir navegador

# Build
npm run build            # Build de producción
npm run start            # Servidor de producción

# Linting
npm run lint             # Ejecutar ESLint

# Deployment
./package-for-deployment.sh  # Crear tarball para deployment
```

---

## 🌐 Rutas Principales

### Autenticación
- `/login` - Login multi-rol

### Panel Franquiciado (`/marketplace`)
- `/marketplace/dashboard` - Dashboard principal
- `/marketplace` - Catálogo de productos
- `/marketplace/cart` - Carrito de compras
- `/marketplace/quotes` - Presupuestos
- `/marketplace/orders` - Mis pedidos

### Panel Proveedor (`/supplier`)
- `/supplier/dashboard` - Dashboard del proveedor
- `/supplier/orders` - Gestión de pedidos recibidos
- `/supplier/products` - Mis productos

### Panel Admin (`/admin`)
- `/admin/dashboard` - Dashboard administrativo
- `/admin/products` - Gestión de productos
- `/admin/products/pricing` - Cola de aprobación de precios
- `/admin/orders` - Vista global de pedidos
- `/admin/openings` - Gestión de aperturas
- `/admin/categories` - Gestión de categorías
- `/admin/dev-tools` - 🔧 Herramientas de desarrollo (95 endpoints documentados)

---

## 🔄 Feature Flags

El proyecto usa un sistema de feature flags para alternar entre datos mock y APIs reales:

```typescript
// src/config/feature-flags.ts
export const featureFlags = {
  auth: { useMock: true, backendReady: true },
  products: { useMock: true, backendReady: false },
  orders: { useMock: true, backendReady: false },
  // ... más flags
}
```

**Modo actual**: Mock (desarrollo)  
**Cambiar a backend real**: Actualizar flags cuando backend esté disponible

---

## 🚦 Estado de Integración Backend

| Módulo | Mock Frontend | Backend API | Integrado |
|--------|---------------|-------------|-----------|
| Auth | ✅ | ✅ | ✅ |
| Productos | ✅ | ⏳ Pendiente | ❌ |
| Pedidos | ✅ | ⏳ Pendiente | ❌ |
| Categorías | ✅ | ⏳ Pendiente | ❌ |
| Aperturas | ✅ | ⏳ Pendiente | ❌ |
| Presupuestos | ✅ | ⏳ Pendiente | ❌ |

**Ver estado completo**: [docs/PROJECT_STATUS_AND_ROADMAP.md](docs/PROJECT_STATUS_AND_ROADMAP.md)

---

## 📊 Métricas del Proyecto

- **Líneas de Código**: ~9,000+
- **Componentes React**: 50+
- **Endpoints API**: 95 documentados
- **Módulos Completados**: 10/10 (100%)
- **Módulos con Docs Backend**: 9/10 (90%)
- **Scripts SQL**: 4 módulos (Categories, Pricing, Orders, Quotes)
- **Guías de Testing**: 7 documentos
- **Tiempo de Desarrollo**: ~4 semanas

---

## 🤝 Contribuir

### Workflow de Desarrollo

1. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Desarrollar y testear localmente
3. Actualizar documentación relevante
4. Commit con mensajes descriptivos
5. Push y crear Pull Request

### Convenciones de Código

- TypeScript strict mode obligatorio
- ESLint para linting
- Prettier para formateo
- Componentes funcionales con hooks
- Naming: PascalCase para componentes, camelCase para funciones

---

## 📞 Soporte

- **Documentación**: Ver carpeta `docs/`
- **API Reference**: [http://localhost:3000/admin/dev-tools](http://localhost:3000/admin/dev-tools)
- **Estado del Proyecto**: [docs/PROJECT_STATUS_AND_ROADMAP.md](docs/PROJECT_STATUS_AND_ROADMAP.md)

---

## 📄 Licencia

Ver archivo [LICENSE](LICENSE)

---

## 🔗 Links Útiles

- **Medusa Documentation**: https://docs.medusajs.com/
- **Mercur Framework**: https://mercurjs.com/
- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Shadcn/ui**: https://ui.shadcn.com/

---

**Desarrollado con ❤️ por el equipo Frontend**  
**Última actualización**: 25 de Agosto de 2026
