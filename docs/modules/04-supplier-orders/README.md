# Módulo 4: Supplier Orders (Pedidos de Proveedores)

## 📋 Descripción

Vista de pedidos para proveedores (sellers) donde pueden:
- Ver listado de pedidos recibidos
- Filtrar por estado (pending, confirmed, shipped, delivered)
- Ver detalles de cada pedido
- Actualizar estado de pedidos
- Ver estadísticas de ventas

## 📄 Documentos para Backend

### SUPPLIER_ORDERS_BACKEND_SIMPLE.md
- **Contenido**: Especificaciones simplificadas de API
- **Incluye**:
  - Endpoints necesarios para panel de proveedor
  - Estructura de datos de pedidos
  - Filtros y búsquedas
  - Acciones disponibles (confirmar, enviar)
  - Datos mock de ejemplo
- **Estado**: ✅ Enviado al backend
- **Ubicación Original**: `docs/integration/SUPPLIER_ORDERS_BACKEND_SIMPLE.md`

## 🔗 Endpoints Principales

```
GET /seller/orders
GET /seller/orders/:id
PATCH /seller/orders/:id/confirm
PATCH /seller/orders/:id/ship
GET /seller/orders/stats
```

## 📊 Mock Data

- 8 pedidos de ejemplo en diferentes estados
- Diferentes franquiciados compradores
- Productos variados de cada proveedor

## 🔄 Relación con Otros Módulos

- **Admin Orders**: Vista administrativa de los mismos pedidos
- **Franchisee Orders**: Vista del franquiciado de los pedidos

## ✅ Estado

- **Frontend**: Completado
- **Backend Docs**: Enviado
- **Backend Implementation**: Pendiente

---

**Última Actualización**: 25 de Agosto de 2026
