# Módulo 3: Categories (Categorías de Productos)

## 📋 Descripción

Gestión de categorías de productos para el marketplace:
- Creación y edición de categorías
- Jerarquía de categorías (padre-hijo)
- Asignación de productos a categorías
- Gestión de metadatos y atributos
- Control de visibilidad

## 📄 Documentos para Backend

### CATEGORIES_BACKEND.md
- **Contenido**: Especificación completa con SQL seed data
- **Incluye**:
  - **Dos tipos de categorías**:
    1. Categorías de Productos (marketplace): 5 principales + subcategorías
    2. Categorías de Aperturas (opening projects): 7 categorías con presupuestos
  - Script SQL completo con INSERT statements
  - Presupuestos estimados por categoría de apertura (€5K - €80K)
  - Sistema de prioridades
  - Metadatos JSON con items típicos
  - Relación con proyectos de apertura
  - Queries de verificación
- **Estado**: ✅ Enviado al backend
- **Ubicación Original**: `docs/modules/03-categories/CATEGORIES_BACKEND.md`

**Categorías de Productos**:
- Uniformes (Polos, Chaquetas, Delantales)
- Folletos y Publicidad
- Señalización en Tienda
- Equipamientos (Básculas, Expositores, Transporte)
- Merchandising

**Categorías de Aperturas**:
- Mobiliario Comercial (€30K-€80K)
- Rotulación y Señalética (€10K-€25K)
- Equipamiento IT (€15K-€40K)
- Equipamiento de Cocina (€20K-€60K)
- Equipamiento de Limpieza (€5K-€15K)
- Sistemas de Seguridad (€8K-€20K)
- Climatización (€12K-€35K)

## 🔗 Endpoints (Medusa Estándar)

```
GET /admin/product-categories
POST /admin/product-categories
GET /admin/product-categories/:id
POST /admin/product-categories/:id
DELETE /admin/product-categories/:id
GET /store/product-categories
GET /store/product-categories/:id
```

## 📊 Mock Data Actual

Actualmente usando categorías mock del frontend:
- Mobiliario Comercial
- Rotulación y Señalética
- Equipamiento IT

## 🔄 Relación con Otros Módulos

- **Openings**: Define categorías necesarias para aperturas
- **Quotes**: Presupuestos organizados por categoría
- **Product Management**: Productos asignados a categorías
- **Franchisee Catalog**: Navegación por categorías

## ✅ Estado

- **Frontend**: Completado (usa APIs Medusa estándar)
- **Backend Docs**: ✅ Enviado (CATEGORIES_BACKEND.md)
- **Backend Implementation**: Medusa 2.x + tabla custom opening_categories

## 📊 Datos Incluidos en SQL Seed

- 5 categorías principales de productos
- 6 subcategorías de productos
- 7 categorías de aperturas con presupuestos
- 15 asignaciones de categorías a proyectos de ejemplo

---

**Última Actualización**: 25 de Agosto de 2026
