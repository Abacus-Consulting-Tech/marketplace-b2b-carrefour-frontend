# Módulo 10: Quotes (Presupuestos para Aperturas)

## 📋 Descripción

Sistema completo de gestión de presupuestos para proyectos de apertura:
- **Franquiciado**: Recibe, compara, adjudica, rechaza y firma presupuestos
- **Proveedor**: Recibe invitaciones, crea, envía y gestiona presupuestos
- **Admin**: Supervisa todo el proceso de licitación
- **Firmas Digitales**: Sistema legalmente vinculante
- **Expiración**: Presupuestos válidos por 30 días

## 📄 Documentos para Backend

### QUOTES_COMPLETADO.md (ESPAÑOL)
- **Contenido**: Documentación completa en español con SQL seed data
- **Incluye**:
  - Resumen ejecutivo del módulo
  - Archivos creados (11 archivos, ~1,500 líneas)
  - Datos mock detallados (7 presupuestos)
  - **SCRIPT SQL COMPLETO** (840 líneas):
    - CREATE TYPE para enums
    - CREATE TABLE (4 tablas: opening_quotes, quote_items, supplier_invitations, quote_signatures)
    - INSERT con 7 presupuestos completos
    - Queries de verificación
  - Exportación JSON alternativa
  - 13 endpoints de API especificados
- **Estado**: ✅ Enviado al backend

### QUOTES_MODULE_COMPLETED.md (ENGLISH)
- **Contenido**: Documentación completa en inglés
- **Incluye**:
  - Module description and goals
  - Files created
  - Mock data statistics
  - API specifications (13 endpoints)
  - Integration notes
  - Success criteria
- **Estado**: ✅ Enviado al backend (referencia)

**Ubicación Original**: `docs/QUOTES_COMPLETADO.md` y `docs/QUOTES_MODULE_COMPLETED.md`

## 🔗 Endpoints Principales

### Franquiciado (6 endpoints)
```
GET /store/quotes
GET /store/quotes/:id
POST /store/quotes/:id/award
POST /store/quotes/:id/reject
POST /store/quotes/:id/sign
GET /store/quotes/stats
```

### Proveedor (6 endpoints)
```
GET /seller/invitations
GET /seller/quotes
POST /seller/quotes
PATCH /seller/quotes/:id
POST /seller/quotes/:id/submit
POST /seller/invitations/:id/decline
```

### Admin (1 endpoint)
```
GET /admin/quotes
```

## 📊 Mock Data (7 presupuestos)

### Proyecto Barcelona Sur:
1. Mobiliario - €42,750 (adjudicado ✅, con firma)
2. Mobiliario - €52,000 (rechazado ❌)
3. Rotulación - €16,650 (en revisión 👁️)
4. IT - €28,000 (enviado 📤)

### Proyecto Madrid Centro:
5. Mobiliario - €38,000 (borrador ✏️)
6. Rotulación - €15,000 (expirado ⏰)

### Proyecto Valencia Este:
7. Mobiliario - €37,720 (en revisión 👁️)

**Datos adicionales**:
- 6 invitaciones a proveedores
- 1 firma digital
- 9 items de presupuesto detallados

## 🗄️ Tablas de Base de Datos

1. **opening_quotes**: Presupuestos principales
2. **quote_items**: Desglose de items/productos
3. **supplier_invitations**: Invitaciones a proveedores
4. **quote_signatures**: Firmas digitales

## 🔄 Relación con Otros Módulos

- **Openings**: Presupuestos vinculados a proyectos de apertura
- **Categories**: Presupuestos por categoría (mobiliario, rotulación, IT)
- **Supplier Orders**: Presupuestos adjudicados → pedidos

## ✅ Estado

- **Frontend**: Completado (11 archivos, ~1,500 líneas)
- **Backend Docs**: 2 documentos enviados (ES + EN)
- **SQL Seed Script**: ✅ Incluido (840 líneas)
- **Backend Implementation**: Pendiente

---

**Última Actualización**: 25 de Agosto de 2026
