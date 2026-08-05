# Marketplace B2B Carrefour - Frontend

El proyecto consiste en crear un marketplace privado para que los franquiciados Carrefour puedan contratar y comprar productos y servicios necesarios para la operación de sus establecimientos, pero que no forman parte de las mercancías destinadas a la venta al consumidor final.

## 🎯 Descripción del Proyecto

El Marketplace B2B Carrefour es una plataforma digital integral que conecta a franquiciados con proveedores aprobados, facilitando la adquisición de productos y servicios operativos. Similar a Amazon pero especializado en el contexto B2B, permite:

- **Gestión de Franquiciados**: Registro, perfiles y administración de establecimientos
- **Gestión de Proveedores**: Onboarding de proveedores y gestión de catálogos
- **Catálogo de Productos**: Navegación, búsqueda avanzada y comparación
- **Sistema de Órdenes**: Creación, seguimiento y gestión completa de pedidos
- **Gestión de Compras**: Carrito, checkout y facturación
- **Gestión de Incidencias**: Sistema de tickets y resolución de problemas

## 📚 Documentación

Toda la documentación del proyecto se encuentra en la carpeta [`docs/`](./docs):

### Principal
- **[Documentación Principal](./docs/README.md)**: Visión general del proyecto
- **[Funcionalidades](./docs/FEATURES.md)**: Descripción detallada de cada módulo

### Técnica
- **[Arquitectura](./docs/technical/ARCHITECTURE.md)**: Detalles de arquitectura frontend
- **[Guía de Desarrollo](./docs/technical/DEVELOPMENT.md)**: Setup, convenciones y workflow
- **[API Documentation](./docs/technical/API.md)**: Endpoints y contratos de la API

### Guías
- **[Guía de Usuario](./docs/guides/USER_GUIDE.md)**: Manual para franquiciados y proveedores

### Planificación
- **[Sprint 1](./docs/sprint_1/)**: Planificación y especificaciones técnicas

## 🚀 Inicio Rápido

```bash
# Clonar el repositorio
git clone https://github.com/carrefour/marketplace-b2b-frontend.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
npm run dev
```

Para más detalles, consulta la [Guía de Desarrollo](./docs/DEVELOPMENT.md).

## 🏗️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Shadcn/ui + Tailwind CSS
- **State Management**: React Query (TanStack Query) + Zustand
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table
- **API Client**: Axios + React Query
- **Testing**: Vitest + React Testing Library + Playwright

### Backend (Reference)
- **Platform**: MercurJS 2.x
- **Database**: PostgreSQL + Redis
- **Payments**: Stripe

## 📁 Estructura del Proyecto

```
marketplace-b2b-carrefour-frontend/
├── docs/                  # Documentación completa del proyecto
├── src/                   # Código fuente
│   ├── components/       # Componentes reutilizables
│   ├── pages/            # Páginas/Vistas
│   ├── services/         # Servicios API
│   ├── store/            # Estado global
│   └── ...
├── tests/                # Tests
└── ...
```

## 👥 Usuarios del Sistema

- **Franquiciados**: Realizan compras de productos y servicios
- **Proveedores**: Gestionan catálogos y procesan pedidos
- **Administradores**: Gestionan la plataforma completa

## 🤝 Contribución

Por favor, lee la [Guía de Desarrollo](./docs/DEVELOPMENT.md) para conocer las convenciones de código y el workflow de desarrollo.

## 📞 Soporte

- **Email**: soporte@carrefour-b2b.com
- **Teléfono**: +34 900 XXX XXX

---

**Última actualización**: 5 de agosto de 2026
**Versión**: 1.0.0
