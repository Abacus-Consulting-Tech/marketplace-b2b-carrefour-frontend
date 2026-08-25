# Módulo 8: Franchisee Orders (Mis Pedidos - Franquiciado)

## 📋 Descripción

Vista de pedidos para franquiciados donde pueden:
- Ver historial completo de sus pedidos
- Filtrar por estado y fechas
- Ver detalles de cada pedido
- Descargar facturas
- Rastrear envíos
- Ver estadísticas personales

## 📄 Documentos para Backend

### FRANCHISEE_ORDERS_COMPLETED.md
- **Contenido**: Especificaciones completas del módulo con mock data
- **Incluye**:
  - Descripción del módulo y objetivos
  - Listado de archivos creados (tipos, API client, componentes, páginas)
  - Especificaciones de 9 endpoints backend
  - Datos mock detallados (12 pedidos de ejemplo)
  - Código de ejemplo para respuestas de API
  - Flujo de usuario completo
- **Estado**: ✅ Enviado al backend
- **Ubicación Original**: `docs/FRANCHISEE_ORDERS_COMPLETED.md`

## 🔗 Endpoints Principales

```
GET /store/orders
GET /store/orders/:id
GET /store/orders/:id/invoice
GET /store/orders/:id/tracking
GET /store/orders/stats
POST /store/orders/:id/cancel
POST /store/orders/:id/return
GET /store/returns
GET /store/returns/:id
```

## 📊 Mock Data

- 12 pedidos en diferentes estados:
  - 3 entregados
  - 2 en tránsito
  - 1 procesando
  - 1 pendiente pago
  - 1 cancelado
  - 1 devolución completada
  - 2 devoluciones en proceso
  - 1 devuelto parcial

## 🔄 Relación con Otros Módulos

- **Admin Orders**: Vista administrativa de los mismos pedidos
- **Supplier Orders**: Vista del proveedor de los pedidos
- **Franchisee Catalog**: Pedidos originados desde el catálogo

## ✅ Estado

- **Frontend**: Completado
- **Backend Docs**: Enviado con mock data completo
- **Backend Implementation**: Pendiente

---

**Última Actualización**: 25 de Agosto de 2026
