# Módulo 5: Product Pricing/Approval (Tarificación y Aprobación)

## 📋 Descripción

Sistema de gestión de precios y aprobación de productos donde:
- Proveedores proponen productos con precios
- Admin revisa y aprueba/rechaza propuestas
- Se gestionan márgenes y precios finales
- Se mantiene historial de cambios de precio

## 📄 Documentos para Backend

### BACKEND_REQUIREMENTS.md
- **Contenido**: Requerimientos funcionales completos
- **Incluye**:
  - Casos de uso detallados
  - Reglas de negocio
  - Validaciones necesarias
  - Permisos por rol
- **Estado**: ✅ Enviado al backend

### BACKEND_SQL_MIGRATIONS.md
- **Contenido**: Scripts SQL para crear tablas
- **Incluye**:
  - CREATE TABLE statements
  - Índices optimizados
  - Constraints y foreign keys
  - Datos iniciales/seed
- **Estado**: ✅ Enviado al backend

### BACKEND_CODE_EXAMPLES.md
- **Contenido**: Ejemplos de código backend
- **Incluye**:
  - Implementaciones de referencia
  - Queries SQL complejos
  - Lógica de aprobación
  - Cálculo de márgenes
- **Estado**: ✅ Enviado al backend

**Ubicación Original**: Todos en `docs/integration/`

## 🔗 Endpoints Principales

```
GET /admin/product-proposals
GET /admin/product-proposals/:id
PATCH /admin/product-proposals/:id/approve
PATCH /admin/product-proposals/:id/reject
POST /seller/products/propose
PATCH /seller/products/:id/pricing
GET /seller/products/proposals
```

## 📊 Mock Data

- 15 propuestas de productos en diferentes estados
- Historial de precios
- Comentarios de rechazo/aprobación

## 🔄 Relación con Otros Módulos

- **Product Management**: Admin gestiona productos aprobados
- **Franchisee Catalog**: Solo muestra productos aprobados

## ✅ Estado

- **Frontend**: Completado
- **Backend Docs**: 3 documentos enviados
- **Backend Implementation**: Pendiente

---

**Última Actualización**: 25 de Agosto de 2026
