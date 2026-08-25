# Módulo 9: Admin Orders (Vista Global de Pedidos - Admin)

## 📋 Descripción

Panel administrativo para supervisión completa de pedidos:
- Vista global de todos los pedidos de la plataforma
- Filtros avanzados (estado, franquiciado, proveedor, fechas)
- Estadísticas y KPIs globales
- Acciones administrativas (cancelar, reembolsar)
- Gestión de incidencias
- Exportación de reportes

## 📄 Documentos para Backend

### ADMIN_ORDERS_COMPLETED.md
- **Contenido**: Especificaciones completas del módulo con API calls
- **Incluye**:
  - Descripción del módulo y funcionalidades
  - Listado de archivos creados
  - 10 endpoints de API especificados
  - Datos mock para testing (15 pedidos globales)
  - Estadísticas y métricas
  - Criterios de éxito
- **Estado**: ✅ Enviado al backend

### BACKEND_ORDER_SEED_REQUEST.md
- **Contenido**: Solicitud de ingesta de datos de pedidos en base de datos
- **Incluye**:
  - Script SQL completo para crear tablas
  - INSERT statements con 15 pedidos de prueba
  - Datos relacionados (items, direcciones, pagos)
  - Queries de verificación
  - Índices y constraints
- **Estado**: ✅ Enviado al backend

**Ubicaciones Originales**: 
- `docs/ADMIN_ORDERS_COMPLETED.md`
- `docs/medusa/BACKEND_ORDER_SEED_REQUEST.md`

## 🔗 Endpoints Principales

```
GET /admin/orders
GET /admin/orders/:id
PATCH /admin/orders/:id/cancel
PATCH /admin/orders/:id/refund
POST /admin/orders/:id/note
GET /admin/orders/stats
GET /admin/orders/export
GET /admin/orders/issues
PATCH /admin/orders/:id/reassign
POST /admin/orders/:id/split
```

## 📊 Mock Data (15 pedidos globales)

- **Por Estado**:
  - 4 entregados
  - 3 en tránsito
  - 2 procesando
  - 2 pendientes
  - 1 cancelado
  - 2 devoluciones
  - 1 reembolsado

- **Por Franquiciado**: 4 franquiciados diferentes
- **Por Proveedor**: 5 proveedores diferentes
- **Valor Total**: ~€45,000

## 🔄 Relación con Otros Módulos

- **Franchisee Orders**: Muestra pedidos de todos los franquiciados
- **Supplier Orders**: Muestra pedidos a todos los proveedores
- **Categories**: Análisis por categorías de productos

## ✅ Estado

- **Frontend**: Completado
- **Backend Docs**: 2 documentos enviados (specs + SQL seed)
- **Backend Implementation**: Pendiente

---

**Última Actualización**: 25 de Agosto de 2026
