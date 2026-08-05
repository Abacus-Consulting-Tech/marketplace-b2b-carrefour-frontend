# Documentación Marketplace B2B Carrefour

Bienvenido a la documentación del **Marketplace B2B Carrefour**, una plataforma privada diseñada para que los franquiciados de Carrefour puedan contratar y comprar productos y servicios necesarios para la operación de sus establecimientos.

## 📋 Índice

- [Descripción General](#descripción-general)
- [Documentación Técnica](#documentación-técnica)
- [Guías de Usuario](#guías-de-usuario)
- [Sprint Planning](./sprint_1/)

### Documentación Técnica

- [Arquitectura](./technical/ARCHITECTURE.md) - Arquitectura frontend y estructura del proyecto
- [Guía de Desarrollo](./technical/DEVELOPMENT.md) - Setup, convenciones y workflow
- [API Documentation](./technical/API.md) - Endpoints y contratos de la API

### Guías de Usuario

- [Guía de Usuario](./guides/USER_GUIDE.md) - Manual para franquiciados y proveedores

### Módulos

- [Módulos y Funcionalidades](./FEATURES.md) - Descripción detallada de cada módulo

## Descripción General

El Marketplace B2B Carrefour es una solución integral que conecta a franquiciados con proveedores para facilitar la adquisición de productos y servicios operativos (no destinados a la venta al consumidor final).

### Objetivo del Proyecto

Crear un ecosistema digital que simplifique y optimice el proceso de compra entre franquiciados Carrefour y sus proveedores aprobados, similar a una plataforma tipo Amazon pero especializada en el contexto B2B.

## 🎯 Funcionalidades Principales

### 1. **Gestión de Franquiciados**
- Registro y administración de franquiciados
- Perfiles de establecimiento
- Gestión de ubicaciones y puntos de venta

### 2. **Gestión de Proveedores**
- Onboarding de proveedores aprobados
- Catálogos de productos y servicios
- Sistema de calificaciones y reseñas

### 3. **Catálogo de Productos**
- Navegación por categorías
- Búsqueda avanzada y filtros
- Comparación de productos
- Gestión de inventario en tiempo real

### 4. **Sistema de Órdenes**
- Creación y seguimiento de pedidos
- Workflow de aprobación
- Estados del pedido (pendiente, aprobado, en tránsito, entregado)
- Historial de compras

### 5. **Gestión de Compras**
- Carrito de compras
- Proceso de checkout
- Múltiples métodos de pago
- Facturas y documentación

### 6. **Gestión de Incidencias**
- Reportes de problemas con pedidos
- Sistema de tickets de soporte
- Seguimiento de resoluciones
- Comunicación franquiciado-proveedor

## 🏗️ Arquitectura General

```
┌─────────────────┐       ┌──────────────────┐       ┌─────────────────┐
│  Franquiciados  │◄─────►│   Frontend App   │◄─────►│   Proveedores   │
│   (Usuarios)    │       │   (React/Vue)    │       │   (Usuarios)    │
└─────────────────┘       └──────────────────┘       └─────────────────┘
                                    │
                                    ▼
                          ┌──────────────────┐
                          │   Backend API    │
                          │   (REST/GraphQL) │
                          └──────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │   Base de   │ │  Servicios  │ │   Sistema   │
            │    Datos    │ │  Externos   │ │    Pago     │
            └─────────────┘ └─────────────┘ └─────────────┘
```

## � Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Shadcn/ui + Tailwind CSS
- **State Management**: React Query + Zustand
- **Forms**: React Hook Form + Zod
- **Data Tables**: TanStack Table
- **Styling**: Tailwind CSS + CSS Modules
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library + Playwright

### Backend (Referencia)
- **Platform**: MercurJS 2.x
- **Database**: PostgreSQL + Redis
- **Authentication**: JWT (via MercurJS)
- **Payments**: Stripe
- **File Storage**: S3-compatible (por definir)

## �📱 Usuarios del Sistema

### Franquiciados
- Navegación y búsqueda de productos
- Realización de pedidos
- Seguimiento de compras
- Gestión de incidencias
- Consulta de facturas

### Proveedores
- Gestión de catálogos
- Procesamiento de pedidos
- Actualización de inventario
- Atención de incidencias
- Gestión de entregas

### Administradores
- Gestión de usuarios (franquiciados y proveedores)
- Configuración de la plataforma
- Reportes y analytics
- Moderación de contenido

## 🚀 Stack Tecnológico

### Frontend
- Framework: [Por definir - React/Vue/Angular]
- State Management: [Por defitechnical/ARCHITECTURE.md)**: Detalles de la arquitectura del sistema
- **[Guía de Desarrollo](./technical/DEVELOPMENT.md)**: Setup del entorno y guías de desarrollo
- **[Funcionalidades](./FEATURES.md)**: Descripción detallada de cada módulo
- **[API Documentation](./technical/API.md)**: Endpoints y contratos de la API
- **[Guía de Usuario](./guides)
- API: [Por definir]
- Base de Datos: [Por definir]
- Autenticación: [Por definir]

## 📚 Documentación Adicional

- **[Arquitectura Técnica](./ARCHITECTURE.md)**: Detalles de la arquitectura del sistema
- **[Guía de Desarrollo](./DEVELOPMENT.md)**: Setup del entorno y guías de desarrollo
- **[Funcionalidades](./FEATURES.md)**: Descripción detallada de cada módulo
- **[API Documentation](./API.md)**: Endpoints y contratos de la API
- **[Guía de Usuario](./USER_GUIDE.md)**: Manual de usuario para franquiciados y proveedores

## 📅 Planificación

La documentación de planificación de sprints se encuentra en la carpeta [sprint_1](./sprint_1/).

## 🤝 Contribución

[Por definir proceso de contribución]

## 📞 Contacto y Soporte

[Por definir información de contacto]

---

**Última actualización**: 5 de agosto de 2026
**Versión**: 1.0.0
