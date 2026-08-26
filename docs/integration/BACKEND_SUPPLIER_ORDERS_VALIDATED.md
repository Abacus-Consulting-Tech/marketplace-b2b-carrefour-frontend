# Informe para Front - Supplier Orders Render DEV

## Resumen

El bloque de endpoints de gestion de pedidos de proveedor solicitado en `docs/SUPPLIER_ORDERS_BACKEND_SIMPLE.md` esta desplegado en Render DEV y responde correctamente para autenticacion vendor, listado y estadisticas.

Base URL validada:

```text
https://marketplace-b2b-backend-dev.onrender.com
```

Commit backend desplegado:

```text
9294f47 feat: add supplier orders vendor endpoints
```

## Credenciales vendor usadas

```text
email: seller@mercur.dev
password: supersecret
seller_id: sel_01M0T3BYTKQF7RV18RX93XEAQD
```

El login vendor devuelve JWT correcto:

```text
POST /auth/member/emailpass -> 200 token true
vendor actor_type -> member
vendor actor_id present -> true
```

## Cabeceras necesarias

Todas las rutas `/vendor/*` requieren:

```http
Authorization: Bearer {{jwtToken}}
x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD
```

Si falta `x-seller-id`, MercurJS rechaza la llamada.

## Endpoints validados en Render DEV

Prueba ejecutada el 2026-08-24:

```text
GET /health -> 200 OK
POST /auth/user/emailpass -> 200 token true
GET /admin/sellers?limit=50 -> 200 OK

POST /auth/member/emailpass -> 200 token true
GET /vendor/orders?limit=5 -> 200 OK
GET /vendor/orders/stats -> 200 OK
```

Tambien se comprobaron las rutas de accion de forma no destructiva usando un pedido inexistente. El resultado esperado es `404 not_found`, lo que confirma que las rutas estan desplegadas, autenticadas y validan pertenencia del pedido al seller:

```text
POST /vendor/orders/order_missing/accept -> 404 not_found
POST /vendor/orders/order_missing/reject -> 404 not_found
PATCH /vendor/orders/order_missing/status -> 404 not_found
POST /vendor/orders/order_missing/tracking -> 404 not_found
```

## Endpoints disponibles para conectar Front

```http
GET    /vendor/orders
GET    /vendor/orders/:id
GET    /vendor/orders/stats
POST   /vendor/orders/:id/accept
POST   /vendor/orders/:id/reject
PATCH  /vendor/orders/:id/status
POST   /vendor/orders/:id/tracking
```

## Contrato de respuesta principal

`GET /vendor/orders` devuelve:

```json
{
  "orders": [
    {
      "id": "order_...",
      "orderNumber": "ORD-2026-001",
      "status": "pending",
      "created_at": "2026-08-24T00:00:00.000Z",
      "estimatedDelivery": null,
      "franchiseeName": "...",
      "franchiseeAddress": "...",
      "franchiseePhone": null,
      "franchiseeEmail": "...",
      "supplierTotal": 0,
      "supplierItems": [],
      "trackingNumber": null,
      "carrier": null,
      "trackingUrl": null,
      "shipped_at": null,
      "delivered_at": null
    }
  ],
  "count": 0,
  "limit": 5,
  "offset": 0
}
```

`GET /vendor/orders/stats` devuelve:

```json
{
  "stats": {
    "pendingCount": 0,
    "confirmedCount": 0,
    "inPreparationCount": 0,
    "shippedCount": 0,
    "revenueThisMonth": 0,
    "revenueLastMonth": 0
  }
}
```

## Nota de validacion

En Render DEV, `GET /vendor/orders?limit=5` respondio `200`, pero no habia pedidos reales para `seller@mercur.dev` en el momento de la prueba. Por eso no se pudo validar `GET /vendor/orders/:id` con un pedido real ni ejecutar acciones sobre un pedido existente sin modificar datos de prueba.

Las acciones estan desplegadas y registradas; cuando exista un pedido asignado al seller, front puede probar:

```http
POST /vendor/orders/:id/accept
POST /vendor/orders/:id/reject
PATCH /vendor/orders/:id/status
POST /vendor/orders/:id/tracking
```

## Recomendacion para Front

Actualizar feature flag:

```javascript
orders: {
  useMock: false,
  backendReady: true
}
```

Antes de validar, hacer login vendor de nuevo para obtener un JWT posterior al fix. El token debe contener `actor_type: "member"` y `actor_id` no vacio.