# Franchisee Management - Backend API Guide

**Módulo**: Gestión de Franquiciados  
**Versión**: v3.0  
**Última actualización**: 2026-09-04  
**Fuente de verdad del inventario**: `src/app/(backoffice)/admin/dev-tools/page.tsx`

Este documento refleja la decisión de backend validada en DEV el 2026-09-04: la familia canónica para la gestión B2B de franquiciados es `/admin/franchisees*`. El frontend debe dejar de usar `/admin/customers*` para este módulo.

---

## Resumen rápido

### Contrato canónico

1. **Admin B2B**: `/admin/franchisees*`
2. **Onboarding**: `/admin/franchisees/invitations`, `/franchisee/register`
3. **Autoservicio de tiendas**: `/franchisee/stores*`
4. **Checkout store customer**: `/store/customers/me` sigue siendo válido, pero no define el contrato admin B2B

### Estado real en DEV

- `GET /admin/franchisees?limit=1&offset=0` está `working`
- `GET /admin/franchisees/:id/stats` está `working`
- `GET /franchisee/stores` sin sesión devuelve `401`
- `GET /store/customers/me` sigue `working` para checkout
- `POST /store/customers/me/addresses` sigue `broken` para este flujo y ya no es la ruta objetivo de `Mis tiendas`

### Cambio principal para frontend

- dejar de usar `customers/customer/count`
- usar `franchisees/franchisee/total`
- dejar de enviar `metadata`, `groups`, `billing_address_id` y contraseña en CRUD admin
- usar IDs `franchisee_...`, no `cus_...`

---

## Modelo de franquiciado

```ts
type Franchisee = {
  id: string
  name: string
  email: string
  tax_id: string
  contact_person?: string
  phone?: string
  company_name?: string
  store_code?: string
  region?: string
  address?: string
  municipality?: string
  postal_code?: string
  country?: string
  status: 'pending_approval' | 'active' | 'suspended' | 'inactive'
  subscription_status?: 'not_configured' | 'pending' | 'active' | 'past_due' | 'canceled'
  created_at: string
  updated_at: string
}
```

---

## 1. CRUD admin canónico

Todas las rutas admin requieren:

```http
Authorization: Bearer <adminJwt>
Content-Type: application/json
```

### `GET /admin/franchisees`

- Uso: listado admin
- Estado DEV: `working`
- Query aceptadas: `q`, `limit`, `offset`, `search`, `take`, `skip`
- Nota operativa 2026-09-04: la ruta responde `200` con datos cuando se prueba por `curl`, pero una llamada directa desde navegador al dominio Render puede fallar por CORS porque la respuesta no está devolviendo `Access-Control-Allow-Origin`.

```json
{
  "franchisees": [],
  "total": 3,
  "skip": 0,
  "take": 20,
  "offset": 0,
  "limit": 20
}
```

### `GET /admin/franchisees/:id`

- Uso: detalle admin
- Estado DEV: `untested` en esta ronda documental, pero es la ruta canónica

```json
{
  "franchisee": {
    "id": "franchisee_123",
    "name": "Carrefour Express Centro",
    "email": "centro@example.com",
    "tax_id": "B12345678",
    "contact_person": "María García",
    "company_name": "Carrefour Express Centro SL",
    "phone": "+34600123456",
    "region": "Madrid",
    "address": "Gran Via 1",
    "municipality": "Madrid",
    "postal_code": "28013",
    "country": "ES",
    "status": "pending_approval",
    "subscription_status": "pending",
    "created_at": "2026-09-04T09:00:00Z",
    "updated_at": "2026-09-04T09:00:00Z"
  }
}
```

### `POST /admin/franchisees`

- Uso: alta manual admin
- Estado DEV: `untested`

```json
{
  "name": "Carrefour Express Centro",
  "email": "centro@example.com",
  "tax_id": "B12345678",
  "contact_person": "Maria Garcia",
  "company_name": "Carrefour Express Centro SL",
  "phone": "+34600123456",
  "region": "Madrid",
  "address": "Gran Via 1"
}
```

### `PATCH /admin/franchisees/:id`

- Uso: edición admin
- Estado DEV: `untested`
- Regla: usar los mismos nombres `snake_case` del create

No enviar:

- `metadata`
- `groups`
- `billing_address_id`
- `password`

### `DELETE /admin/franchisees/:id`

- Uso: desactivar/eliminar franquiciado
- Estado DEV: `untested`

```json
{
  "id": "franchisee_123",
  "deleted": true,
  "deleted_at": "2026-09-04T09:30:00Z"
}
```

---

## 2. Estado y estadísticas

### `PATCH /admin/franchisees/:id/status`

- Uso: aprobar, suspender o desactivar
- Estado DEV: `untested`

```json
{ "status": "active" }
```

Valores permitidos:

```text
pending_approval
active
suspended
inactive
```

Regla crítica:

- si billing está habilitado y `subscription_status !== active`, backend debe rechazar la activación y frontend debe mostrar el mensaje devuelto

### `GET /admin/franchisees/:id/stats`

- Uso: estadísticas individuales
- Estado DEV: `working`

```json
{
  "stats": {
    "franchisee_id": "franchisee_123",
    "total_orders": 0,
    "total_spent": 0,
    "average_order_value": 0,
    "last_order_date": null,
    "orders_by_status": {}
  }
}
```

### `GET /admin/franchisees/stats`

- Uso: estadísticas globales
- Estado DEV: contrato compartido por backend, todavía no usado por UI actual

---

## 3. Onboarding y autoservicio

### `POST /admin/franchisees/invitations`

- Uso: invitación admin
- Estado DEV: `untested`

```json
{
  "name": "María García",
  "email": "maria.garcia@email.com"
}
```

### `POST /franchisee/register`

- Uso: autorregistro público
- Estado DEV: `untested`
- Observación: cuando billing está habilitado, frontend envía `stripePaymentMethodId`

### `GET /franchisee/stores`
### `POST /franchisee/stores`
### `DELETE /franchisee/stores/:id`

- Uso: `Mis tiendas`
- Estado DEV: contrato confirmado; frontend ya migró fuera de `localStorage`
- Regla: requiere franquiciado `active`
- Sin sesión: `401`

Body esperado para crear:

```json
{
  "name": "Tienda Centro",
  "taxId": "B12345678",
  "address": "Gran Via 1",
  "city": "Madrid",
  "postalCode": "28013",
  "countryCode": "es"
}
```

Respuesta de listado:

```json
{
  "stores": [],
  "total": 0
}
```

### `GET /franchisee/:id/invoices`

- Estado DEV: no migrar aún
- Motivo: depende del contrato Odoo y sigue pendiente

---

## 4. Relación con checkout

### `GET /store/customers/me`

- Sigue siendo `working`
- Se usa para leer `shipping_addresses` reales en checkout
- No sustituye el contrato admin de franquiciados

### `POST /store/customers/me/addresses`

- Sigue `broken` en DEV para token de franquiciado
- Ya no debe ser el camino principal para la pantalla `Mis tiendas`

---

## 5. Matriz consolidada

| Familia | Método y ruta | Frontend hoy | Estado DEV | Notas |
|---|---|---|---|---|
| Admin canónico | `GET /admin/franchisees` | Sí | `working` | Paginación compatible |
| Admin canónico | `GET /admin/franchisees/:id` | Sí | `untested` | Ruta final del detalle |
| Admin canónico | `POST /admin/franchisees` | Sí | `untested` | Alta manual |
| Admin canónico | `PATCH /admin/franchisees/:id` | Sí | `untested` | Editar con `snake_case` |
| Admin canónico | `DELETE /admin/franchisees/:id` | Sí | `untested` | Eliminación/desactivación |
| Admin canónico | `PATCH /admin/franchisees/:id/status` | Sí | `untested` | Debe validar billing |
| Admin canónico | `GET /admin/franchisees/:id/stats` | Sí | `working` | Ruta final de stats |
| Onboarding | `POST /admin/franchisees/invitations` | Sí | `untested` | Real por defecto |
| Onboarding | `POST /franchisee/register` | Sí | `untested` | Real por defecto |
| Onboarding | `POST /webhooks/stripe` | Indirecto | `untested` | Backend-only |
| Autoservicio | `GET /franchisee/stores` | Sí | `untested` | Requiere sesión activa |
| Autoservicio | `POST /franchisee/stores` | Sí | `untested` | Persistencia real |
| Autoservicio | `DELETE /franchisee/stores/:id` | Sí | `untested` | Archivado |
| Checkout | `GET /store/customers/me` | Sí | `working` | Direcciones reales |
| Checkout | `POST /store/customers/me/addresses` | No | `broken` | Ya no es la ruta objetivo |
| Pendiente | `GET /franchisee/:id/invoices` | No migrar | `untested` | Falta contrato Odoo |

---

## 6. Incidencia operativa detectada: CORS en Render DEV

Validación hecha el 2026-09-04 contra:

`https://marketplace-b2b-backend-dev.onrender.com/admin/franchisees?limit=20&offset=0&take=20&skip=0`

Resultado observado:

1. El preflight `OPTIONS` responde `204`.
2. El `GET` autenticado responde `200` y devuelve datos válidos.
3. Ninguna de las dos respuestas devuelve `Access-Control-Allow-Origin` para `http://localhost:3000`.

Conclusión:

- no es un fallo funcional del endpoint
- es un problema de política CORS cuando se llama directamente al dominio Render desde el navegador

Qué necesita backend:

1. Devolver `Access-Control-Allow-Origin` para los orígenes frontend permitidos.
2. Mantener `Access-Control-Allow-Credentials: true` solo junto con un origen explícito, no con ausencia de origen.
3. Asegurar que los preflight `OPTIONS` y la respuesta real `GET/PATCH/POST/DELETE` exponen el mismo set de orígenes permitidos.
4. Incluir al menos `http://localhost:3000` en DEV y los orígenes de staging/producción que correspondan.

Importante para interpretación de pruebas:

- si frontend llama por el proxy interno `/api`, este problema puede quedar oculto
- si alguien prueba la URL directa de Render desde el navegador, verá “CORS error” aunque el endpoint esté devolviendo `200`

---

## 7. Decisiones todavía abiertas

1. Confirmar la ruta admin de edición de tiendas o direcciones desde backoffice.
2. Confirmar si `GET /admin/franchisees/:id` devolverá también un agregado de tiendas o si ese dato vivirá en otra ruta admin.
3. Cerrar la exposición segura de la política de billing para la página pública de registro.
4. Cerrar el contrato final de facturas con Odoo.

---

## 8. Conclusión operativa

El cambio de contrato ya está resuelto: frontend debe vivir sobre `/admin/franchisees*` para gestión admin y sobre `/franchisee/stores*` para autoservicio de tiendas. El principal trabajo restante no es decidir rutas, sino validar end-to-end las superficies todavía marcadas como `untested` y acordar la edición admin de tiendas.
