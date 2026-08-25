# Módulo 2: Openings (Nuevas Aperturas)

## 📋 Descripción

Gestión de proyectos de apertura de franquicias Carrefour, incluyendo:
- Creación de proyectos de apertura
- Definición de categorías necesarias
- Seguimiento de presupuesto y timeline
- Estados del proyecto (planning, active, completed)

## 📄 Documentos para Backend

### BACKEND_GUIDE.md
- **Contenido**: Guía completa de implementación backend
- **Incluye**:
  - Modelo de datos (opening_projects, opening_categories)
  - Especificaciones de API
  - Ejemplos de requests/responses
  - Scripts SQL para crear tablas
  - Datos mock de prueba
- **Estado**: ✅ Enviado al backend

### EMAIL_PARA_BACKEND.md
- **Contenido**: Email explicativo del contexto del módulo
- **Incluye**:
  - Contexto del negocio
  - Flujo de trabajo esperado
  - Prioridades de implementación
- **Estado**: ✅ Enviado al backend

## 🔗 Endpoints Principales

```
GET /store/openings
POST /store/openings
GET /store/openings/:id
PATCH /store/openings/:id
DELETE /store/openings/:id
GET /admin/openings
GET /admin/openings/:id
```

## 📊 Mock Data

- 4 proyectos de apertura de ejemplo:
  - Barcelona Sur (activo)
  - Madrid Centro (planning)
  - Valencia Este (activo)
  - Sevilla Norte (planning)

## 🔄 Relación con Otros Módulos

- **Quotes**: Los presupuestos se vinculan a proyectos de apertura
- **Categories**: Define qué categorías necesita cada apertura

## ✅ Estado

- **Frontend**: Completado
- **Backend Docs**: Enviado
- **Backend Implementation**: Pendiente

---

**Última Actualización**: 25 de Agosto de 2026
