# Franchisee Management - Backend API Guide

**Módulo**: Gestión de Franquiciados  
**Versión**: v2.0  
**Última actualización**: 2026-09-03  
**Fuente de verdad del inventario**: `src/app/(backoffice)/admin/dev-tools/page.tsx`

Este documento sustituye la guía antigua basada en un CRUD idealizado de `/admin/franchisees*` y describe el estado real del módulo desde frontend: qué endpoints usamos hoy, cuáles son legacy, cuáles son nuevos, qué body enviamos y qué está `working`, `broken` o `untested` en DEV.

---

## Resumen rápido

### Familias de endpoints que conviven hoy

1. **Admin actual consumido por frontend**: `/admin/customers*`
2. **Onboarding/autoservicio nuevo**: `/admin/franchisees/invitations`, `/franchisee/register`, `/store/customers/me`
3. **Legacy inventariado**: `/admin/franchisees*`

### Estado real en DEV

- `GET /store/customers/me` está **working** y ya alimenta las direcciones reales del checkout.
- `GET /admin/customers` y `GET /admin/customers/:id` están **broken** por `403 RBAC`.
- `POST /store/customers/me/addresses` está **broken** en DEV: devuelve `401 Unauthorized` con token de franquiciado.
- El resto de endpoints de franquiciados siguen **untested** o son contratos todavía no cerrados con backend.

### Problema de contrato más importante

Frontend administra franquiciados principalmente con `/admin/customers*`, pero todavía existe una familia legacy `/admin/franchisees*` en inventario. Además, el cliente frontend ya llama a `GET /admin/customers/:id/stats`, mientras `dev-tools` solo inventaría `GET /admin/franchisees/:id/stats`. Ese punto debe unificarse.

---

## Leyenda de estado

- `working`: validado en DEV o usable para el flujo actual
- `broken`: probado y falla con error conocido
- `untested`: inventariado, pero no revalidado explícitamente en DEV
- `legacy`: ruta antigua inventariada; no es la familia principal del frontend actual

---

## 1. Endpoints actuales consumidos por frontend

### 1.1 Admin CRUD base sobre customers

#### `GET /admin/customers`

- **Uso en frontend**: listado admin de franquiciados
- **Cliente**: `franchiseesApi.listFranchisees(...)`
- **Estado DEV**: `broken`
- **Error conocido**: `403 Forbidden` por RBAC

**Query params que envía frontend**

```text
q=<search>
limit=<number>
offset=<number>
expand=<string>
has_account=<true|false>
```

**Ejemplo real**

```http
GET /admin/customers?q=madrid&limit=20&offset=0&expand=groups,shipping_addresses&has_account=true
Authorization: Bearer <admin_token>
```

**Respuesta esperada por frontend**

```json
{
  "customers": [
    {
      "id": "cus_123",
      "email": "franchisee@carrefour.dev",
      "first_name": "María",
      "last_name": "García",
      "phone": "+34 600 123 456",
      "has_account": true,
      "shipping_addresses": [],
      "groups": [],
      "metadata": {
        "company_name": "Carrefour Express Sur",
        "tax_id": "B12345678",
        "status": "pending_approval",
        "subscription_status": "pending"
      },
      "created_at": "2026-09-03T10:00:00Z",
      "updated_at": "2026-09-03T10:00:00Z"
    }
  ],
  "count": 1,
  "offset": 0,
  "limit": 20
}
```

#### `GET /admin/customers/:id`

- **Uso en frontend**: detalle admin de un franquiciado
- **Cliente**: `franchiseesApi.getFranchisee({ id, expand })`
- **Estado DEV**: `broken`
- **Error conocido**: `403 Forbidden` por RBAC

**Query params opcionales**

```text
expand=billing_address,shipping_addresses,groups,orders
```

**Respuesta esperada**

```json
{
  "customer": {
    "id": "cus_123",
    "email": "franchisee@carrefour.dev",
    "first_name": "María",
    "last_name": "García",
    "shipping_addresses": [
      {
        "id": "addr_123",
        "address_1": "Gran Vía 1",
        "city": "Madrid",
        "country_code": "es",
        "province": "Madrid",
        "postal_code": "28013",
        "metadata": {
          "store_name": "Tienda Centro",
          "store_code": "CRF-MAD-001"
        },
        "created_at": "2026-09-03T10:00:00Z",
        "updated_at": "2026-09-03T10:00:00Z"
      }
    ],
    "groups": [],
    "metadata": {
      "company_name": "Carrefour Express Sur",
      "tax_id": "B12345678",
      "status": "active"
    },
    "created_at": "2026-09-03T10:00:00Z",
    "updated_at": "2026-09-03T10:00:00Z"
  }
}
```

#### `POST /admin/customers`

- **Uso en frontend**: alta admin directa de franquiciado
- **Cliente**: `franchiseesApi.createFranchisee(request)`
- **Estado DEV**: `untested`

**Body real que construye frontend**

```json
{
  "email": "maria.garcia@email.com",
  "first_name": "María",
  "last_name": "García",
  "phone": "+34 600 123 456",
  "password": "TempPass123!",
  "metadata": {
    "company_name": "Carrefour Express Sur",
    "tax_id": "B12345678",
    "store_name": "Tienda Centro",
    "store_code": "CRF-MAD-001",
    "city": "Madrid",
    "region": "Madrid",
    "country": "ES",
    "credit_limit": 10000,
    "discount_tier": "silver",
    "payment_terms": 30,
    "is_active": true,
    "notes": "Alta manual desde admin"
  },
  "groups": [
    { "id": "group_b2b_franchisees" }
  ]
}
```

**Respuesta esperada**

```json
{
  "customer": {
    "id": "cus_123",
    "email": "maria.garcia@email.com",
    "first_name": "María",
    "last_name": "García",
    "metadata": {
      "company_name": "Carrefour Express Sur"
    },
    "created_at": "2026-09-03T10:00:00Z",
    "updated_at": "2026-09-03T10:00:00Z"
  }
}
```

#### `POST /admin/customers/:id`

- **Uso en frontend**: edición admin de datos y notas
- **Cliente**: `franchiseesApi.updateFranchisee(id, request)`
- **Estado DEV**: `untested`

**Body real**

```json
{
  "first_name": "María",
  "last_name": "García López",
  "phone": "+34 600 123 999",
  "billing_address_id": "addr_billing_123",
  "metadata": {
    "notes": "Cliente premium",
    "status": "active",
    "payment_terms": 30
  },
  "groups": [
    { "id": "group_b2b_franchisees" }
  ]
}
```

**Respuesta esperada**

```json
{
  "customer": {
    "id": "cus_123",
    "email": "maria.garcia@email.com",
    "first_name": "María",
    "last_name": "García López",
    "metadata": {
      "notes": "Cliente premium",
      "status": "active"
    },
    "updated_at": "2026-09-03T10:30:00Z"
  }
}
```

#### `DELETE /admin/customers/:id`

- **Uso en frontend**: eliminación admin de franquiciado
- **Cliente**: `franchiseesApi.deleteFranchisee(id)`
- **Estado DEV**: `untested`

**Respuesta esperada**

```json
{
  "id": "cus_123",
  "object": "customer",
  "deleted": true
}
```

### 1.2 Direcciones del franquiciado gestionadas por admin

#### `GET /admin/customers/:id/addresses`

- **Uso en frontend**: inventariado, pero la UI suele leer las direcciones vía `expand=shipping_addresses`
- **Estado DEV**: `untested`

**Respuesta esperada**

Idealmente debería devolver `customer.shipping_addresses` o una lista compatible con el tipo `Address[]`.

#### `POST /admin/customers/:id/addresses`

- **Uso en frontend**: alta de tienda/dirección desde detalle admin
- **Cliente**: `franchiseesApi.addAddress(franchiseeId, request)`
- **Estado DEV**: `untested`

**Body real**

```json
{
  "address": {
    "first_name": "María",
    "last_name": "García",
    "company": "Carrefour Express Sur",
    "address_1": "Gran Vía 1",
    "address_2": "Local 2",
    "city": "Madrid",
    "country_code": "es",
    "province": "Madrid",
    "postal_code": "28013",
    "phone": "+34 600 123 456",
    "metadata": {
      "store_name": "Tienda Centro",
      "store_code": "CRF-MAD-001"
    }
  }
}
```

**Respuesta esperada**

```json
{
  "customer": {
    "id": "cus_123",
    "shipping_addresses": [
      {
        "id": "addr_123",
        "address_1": "Gran Vía 1",
        "city": "Madrid",
        "country_code": "es",
        "postal_code": "28013",
        "metadata": {
          "store_name": "Tienda Centro",
          "store_code": "CRF-MAD-001"
        },
        "created_at": "2026-09-03T10:00:00Z",
        "updated_at": "2026-09-03T10:00:00Z"
      }
    ]
  }
}
```

#### `PATCH /admin/customers/:id/addresses/:addressId`

- **Uso en frontend**: edición de tienda/dirección desde admin
- **Cliente**: `franchiseesApi.updateAddress(franchiseeId, addressId, request)`
- **Estado DEV**: `untested`

**Body real**

```json
{
  "first_name": "María",
  "last_name": "García",
  "company": "Carrefour Express Sur",
  "address_1": "Gran Vía 3",
  "address_2": "Local 4",
  "city": "Madrid",
  "country_code": "es",
  "province": "Madrid",
  "postal_code": "28013",
  "phone": "+34 600 123 456",
  "metadata": {
    "store_name": "Tienda Centro Reformada",
    "store_code": "CRF-MAD-001"
  }
}
```

**Respuesta esperada**

```json
{
  "customer": {
    "id": "cus_123",
    "shipping_addresses": []
  }
}
```

#### `DELETE /admin/customers/:id/addresses/:addressId`

- **Uso en frontend**: borrado de tienda/dirección desde admin
- **Cliente**: `franchiseesApi.deleteAddress(franchiseeId, addressId)`
- **Estado DEV**: `untested`

**Respuesta esperada**

```json
{
  "customer": {
    "id": "cus_123",
    "shipping_addresses": []
  }
}
```

### 1.3 Cambio de estado y aprobación

#### `PATCH /admin/franchisees/:id/status`

- **Uso en frontend**: aprobar, suspender o desactivar
- **Cliente**: `franchiseesApi.updateFranchiseeStatus(id, status)`
- **Estado DEV**: `untested`
- **Observación**: esta es una ruta de la familia legacy `/admin/franchisees*`, pero el frontend la sigue usando para cambio de estado

**Body real**

```json
{
  "status": "active"
}
```

**Valores esperados**

```text
pending_approval
active
suspended
inactive
```

**Regla de negocio esperada**

- Si `status = active` y `subscription_status !== active`, backend debería rechazar la operación de forma consistente cuando billing esté habilitado.

**Respuesta esperada**

```json
{
  "customer": {
    "id": "cus_123",
    "metadata": {
      "status": "active",
      "subscription_status": "active",
      "onboarding_status": "approved_pending_credentials"
    },
    "updated_at": "2026-09-03T11:00:00Z"
  }
}
```

### 1.4 Lecturas auxiliares que la UI de franquiciados usa o tiene cableadas

#### `GET /admin/orders?customer_id=:id`

- **Uso en frontend**: historial de pedidos asociado al franquiciado desde admin
- **Cliente**: `franchiseesApi.getFranchiseeOrders({ customer_id, limit, offset, status })`
- **Estado DEV**: depende del módulo orders, hoy `working` para la UI actual

**Query params**

```text
customer_id=<id>
limit=<number>
offset=<number>
status=pending,completed,canceled
```

#### `GET /admin/customers/:id/stats`

- **Uso en frontend**: estadísticas del franquiciado
- **Cliente**: `franchiseesApi.getFranchiseeStats(franchiseeId)`
- **Estado DEV**: `untested`
- **Problema**: `dev-tools` no inventaría hoy esta ruta; inventaría `GET /admin/franchisees/:id/stats`

**Respuesta esperada**

```json
{
  "stats": {
    "franchisee_id": "cus_123",
    "total_orders": 12,
    "total_spent": 4200,
    "average_order_value": 350,
    "last_order_date": "2026-09-03T10:00:00Z",
    "orders_by_status": {
      "pending": 1,
      "completed": 10,
      "canceled": 1
    },
    "orders_by_month": []
  }
}
```

#### `POST /admin/customers/bulk`

- **Uso en frontend**: bulk update cableado en cliente, sin UI consolidada
- **Estado DEV**: `untested`

**Body real**

```json
{
  "customer_ids": ["cus_123", "cus_456"],
  "metadata": {
    "payment_terms": 30,
    "discount_tier": "silver"
  },
  "groups": [
    { "id": "group_b2b_franchisees" }
  ]
}
```

---

## 2. Endpoints nuevos de onboarding y autoservicio

### 2.1 Invitación admin del franquiciado

#### `POST /admin/franchisees/invitations`

- **Uso en frontend**: invitar por nombre + email y obtener `registrationUrl`
- **Cliente**: `franchiseesApi.inviteFranchisee(request)`
- **Estado DEV**: `untested`
- **Modo de frontend**: real por defecto salvo `NEXT_PUBLIC_MOCK_FRANCHISEE_INVITATIONS=true`

**Body real**

```json
{
  "name": "María García",
  "email": "maria.garcia@email.com"
}
```

**Respuesta esperada**

```json
{
  "invitation": {
    "id": "inv_123",
    "name": "María García",
    "email": "maria.garcia@email.com",
    "registrationUrl": "https://.../franchisee/register?token=inv_123",
    "invitationToken": "inv_123",
    "status": "pending",
    "createdAt": "2026-09-03T10:00:00Z"
  }
}
```

### 2.2 Registro público

#### `POST /franchisee/register`

- **Uso en frontend**: autorregistro público desde enlace con token
- **Cliente**: `franchiseeRegistrationApi.register(request)`
- **Estado DEV**: `untested`
- **Modo de frontend**: real por defecto salvo `NEXT_PUBLIC_MOCK_FRANCHISEE_REGISTRATION=true`

**Body real sin billing**

```json
{
  "invitationToken": "inv_123",
  "firstName": "María",
  "lastName": "García López",
  "email": "maria.garcia@email.com",
  "password": "supersecret1",
  "phone": "+34 600 123 456",
  "companyName": "Carrefour Express Sur",
  "taxId": "B12345678",
  "fiscalAddress": "Calle Mayor 123",
  "municipality": "Madrid",
  "postalCode": "28001",
  "country": "ES"
}
```

**Body real con billing habilitado**

```json
{
  "invitationToken": "inv_123",
  "firstName": "María",
  "lastName": "García López",
  "email": "maria.garcia@email.com",
  "password": "supersecret1",
  "phone": "+34 600 123 456",
  "companyName": "Carrefour Express Sur",
  "taxId": "B12345678",
  "fiscalAddress": "Calle Mayor 123",
  "municipality": "Madrid",
  "postalCode": "28001",
  "country": "ES",
  "stripePaymentMethodId": "pm_123"
}
```

**Respuesta esperada**

```json
{
  "franchisee": {
    "id": "cus_123",
    "email": "maria.garcia@email.com",
    "first_name": "María",
    "last_name": "García López",
    "metadata": {
      "company_name": "Carrefour Express Sur",
      "status": "pending_approval",
      "subscription_status": "pending",
      "onboarding_status": "pending_approval"
    },
    "created_at": "2026-09-03T10:00:00Z",
    "updated_at": "2026-09-03T10:00:00Z"
  },
  "billing": {
    "client_secret": "pi_..._secret_..."
  }
}
```

### 2.3 Webhook Stripe del onboarding

#### `POST /webhooks/stripe`

- **Uso en frontend**: no lo llama directamente; depende del backend
- **Estado DEV**: `untested`

**Eventos relevantes esperados**

```text
customer.subscription.created
invoice.paid
invoice.payment_failed
customer.subscription.deleted
```

**Efectos esperados en backend**

- actualizar `subscription_status`
- guardar `stripe_customer_id`
- guardar `stripe_subscription_id`
- guardar `current_period_end`

### 2.4 Facturas del franquiciado

#### `GET /franchisee/:id/invoices`

- **Uso en frontend**: sección de facturas del perfil
- **Estado DEV**: `untested`

**Respuesta esperada**

```json
{
  "invoices": [
    {
      "id": "inv_123",
      "franchiseeId": "cus_123",
      "number": "FAC-2026-0001",
      "issueDate": "2026-09-03T10:00:00Z",
      "amount": 299,
      "currencyCode": "EUR",
      "status": "paid",
      "pdfUrl": "https://.../invoice.pdf"
    }
  ]
}
```

### 2.5 Tiendas del franquiciado en autoservicio

#### `GET /franchisee/stores`
#### `POST /franchisee/stores`
#### `DELETE /franchisee/stores/:id`

- **Uso en frontend**: pantalla `Mis tiendas`
- **Estado DEV**: `untested` como contrato backend y actualmente `mock/localStorage` en frontend
- **Observación**: hoy no existe integración real; la pantalla pública persiste localmente

**Body real previsto para `POST /franchisee/stores`**

```json
{
  "name": "Tienda Centro",
  "taxId": "B12345678",
  "address": "Gran Vía 1",
  "city": "Madrid",
  "postalCode": "28013"
}
```

---

## 3. Endpoints self-service Store que ya interactúan con checkout

#### `GET /store/customers/me`

- **Uso en frontend**: checkout del franquiciado para cargar `shipping_addresses`
- **Cliente**: `getCustomer()` en `mercur-store-client`
- **Estado DEV**: `working`

**Headers esperados**

```http
Authorization: Bearer <franchisee_token>
x-publishable-api-key: <publishable_key>
```

**Respuesta usada por frontend**

```json
{
  "customer": {
    "id": "cus_123",
    "email": "franchisee@carrefour.dev",
    "first_name": "María",
    "last_name": "García",
    "shipping_addresses": [
      {
        "id": "addr_123",
        "first_name": "María",
        "last_name": "García",
        "address_1": "Gran Vía 1",
        "city": "Madrid",
        "province": "Madrid",
        "postal_code": "28013",
        "country_code": "es",
        "phone": "+34 600 123 456",
        "metadata": {
          "store_name": "Tienda Centro",
          "store_code": "CRF-MAD-001"
        }
      }
    ]
  }
}
```

#### `POST /store/customers/me/addresses`

- **Uso en frontend**: todavía no consumido como persistencia real; sería el camino lógico para dar de alta nuevas tiendas desde checkout o perfil
- **Estado DEV**: `broken`
- **Error probado**: `401 Unauthorized` con `franchisee@carrefour.dev`

**Body probado**

```json
{
  "address": {
    "first_name": "Carrefour",
    "last_name": "Retiro",
    "address_1": "Calle de Alcalá 120",
    "address_2": "Local 1",
    "city": "Madrid",
    "province": "Madrid",
    "postal_code": "28009",
    "country_code": "es",
    "phone": "+34910000001",
    "metadata": {
      "store_name": "Carrefour Express Retiro",
      "store_code": "CRF-MAD-011"
    }
  }
}
```

**Respuesta real observada en DEV**

```json
{
  "message": "Unauthorized"
}
```

---

## 4. Endpoints legacy todavía inventariados

Estas rutas siguen en `dev-tools`, pero **no son la familia principal del CRUD actual**. Deben mantenerse como referencia hasta que backend confirme si se eliminan o pasan a ser canónicas.

#### `GET /admin/franchisees`
- Estado DEV: `untested`
- Rol: legacy para listado admin

#### `GET /admin/franchisees/:id`
- Estado DEV: `untested`
- Rol: legacy para detalle admin

#### `POST /admin/franchisees`
- Estado DEV: `untested`
- Rol: legacy para alta admin

#### `PATCH /admin/franchisees/:id`
- Estado DEV: `untested`
- Rol: legacy para edición admin

#### `PATCH /admin/franchisees/:id/status`
- Estado DEV: `untested`
- Rol: legacy, pero todavía usada por el frontend actual para aprobar/suspender

#### `GET /admin/franchisees/:id/stats`
- Estado DEV: `untested`
- Rol: legacy para estadísticas
- Conflicto actual: frontend cliente usa `GET /admin/customers/:id/stats`

---

## 5. Matriz consolidada de estado

| Familia | Método y ruta | Frontend hoy | Estado DEV | Notas |
|---|---|---|---|---|
| Admin actual | `GET /admin/customers` | Sí | `broken` | `403 RBAC` |
| Admin actual | `GET /admin/customers/:id` | Sí | `broken` | `403 RBAC` |
| Admin actual | `POST /admin/customers` | Sí | `untested` | Alta admin directa |
| Admin actual | `POST /admin/customers/:id` | Sí | `untested` | Edición admin |
| Admin actual | `DELETE /admin/customers/:id` | Sí | `untested` | Borrado admin |
| Admin actual | `GET /admin/customers/:id/addresses` | Parcial | `untested` | Normalmente se usa `expand` |
| Admin actual | `POST /admin/customers/:id/addresses` | Sí | `untested` | Alta de tienda desde admin |
| Admin actual | `PATCH /admin/customers/:id/addresses/:addressId` | Sí | `untested` | Edición de tienda desde admin |
| Admin actual | `DELETE /admin/customers/:id/addresses/:addressId` | Sí | `untested` | Borrado de tienda desde admin |
| Admin actual | `GET /admin/orders?customer_id=:id` | Sí | `working` | Depende del módulo orders |
| Admin actual | `GET /admin/customers/:id/stats` | Sí | `untested` | No alineado con `dev-tools` |
| Admin actual | `POST /admin/customers/bulk` | Cableado | `untested` | Sin UI consolidada |
| Onboarding nuevo | `POST /admin/franchisees/invitations` | Sí | `untested` | Real por defecto |
| Onboarding nuevo | `POST /franchisee/register` | Sí | `untested` | Real por defecto |
| Onboarding nuevo | `POST /webhooks/stripe` | Indirecto | `untested` | Backend-only |
| Onboarding nuevo | `GET /franchisee/:id/invoices` | Sí | `untested` | UI lista, backend pendiente |
| Onboarding nuevo | `GET /franchisee/stores` | Sí | `untested` | Hoy mock/localStorage |
| Onboarding nuevo | `POST /franchisee/stores` | Sí | `untested` | Hoy mock/localStorage |
| Onboarding nuevo | `DELETE /franchisee/stores/:id` | Sí | `untested` | Hoy mock/localStorage |
| Store self-service | `GET /store/customers/me` | Sí | `working` | Checkout usa `shipping_addresses` reales |
| Store self-service | `POST /store/customers/me/addresses` | No persistente todavía | `broken` | `401 Unauthorized` |
| Legacy | `GET /admin/franchisees` | No principal | `untested` | Ruta antigua |
| Legacy | `GET /admin/franchisees/:id` | No principal | `untested` | Ruta antigua |
| Legacy | `POST /admin/franchisees` | No principal | `untested` | Ruta antigua |
| Legacy | `PATCH /admin/franchisees/:id` | No principal | `untested` | Ruta antigua |
| Legacy | `PATCH /admin/franchisees/:id/status` | Sí | `untested` | Antigua pero aún usada |
| Legacy | `GET /admin/franchisees/:id/stats` | No principal | `untested` | Antigua y solapa stats |

---

## 6. Decisiones que backend debe cerrar

1. **Contrato canónico admin**: si el módulo debe vivir en `/admin/customers*` o `/admin/franchisees*`.
2. **Ruta canónica de stats**: `GET /admin/customers/:id/stats` o `GET /admin/franchisees/:id/stats`.
3. **Alta de tiendas por autoservicio**: si se habilita `POST /store/customers/me/addresses` o una familia propia `/franchisee/stores*`.
4. **Estado del onboarding público**: si `POST /franchisee/register` queda definitivamente adoptado como contrato real.
5. **Facturas del franquiciado**: confirmar si `GET /franchisee/:id/invoices` es la ruta final o si cambia.

---

## 7. Conclusión operativa

Hoy frontend ya tiene cubiertas tres capas del módulo:

- administración de franquiciados
- onboarding público
- selección de direcciones reales del franquiciado en checkout

Lo que bloquea la retirada total del mock no es la UI, sino el contrato backend:

- RBAC en `GET /admin/customers*`
- falta de confirmación entre rutas `customers` y `franchisees`
- falta de persistencia self-service para nuevas tiendas del franquiciado

Si backend quiere priorizar el mínimo camino funcional, el orden recomendado es:

1. arreglar `GET /admin/customers` y `GET /admin/customers/:id`
2. confirmar una sola familia canónica para CRUD y stats
3. cerrar `POST /franchisee/register`
4. habilitar alta real de direcciones por `POST /store/customers/me/addresses` o sustituirla por un contrato oficial de tiendas
        "sku": "POLO-CRF-001",
        "times_ordered": 12,
        "total_quantity": 150,
        "total_spent_cents": 220000
      },
      {
        "product_id": "prod_002",
        "title": "Folleto Promocional A5",
        "sku": "FOLL-A5-001",
        "times_ordered": 8,
        "total_quantity": 5000,
        "total_spent_cents": 450000
      }
    ],
    "orders_by_month": [
      {
        "month": "2026-08",
        "count": 8,
        "total_cents": 210000
      },
      {
        "month": "2026-07",
        "count": 12,
        "total_cents": 340000
      },
      {
        "month": "2026-06",
        "count": 10,
        "total_cents": 280000
      }
    ],
    "orders_by_status": {
      "pending": 2,
      "processing": 1,
      "shipped": 3,
      "delivered": 38,
      "cancelled": 1
    }
  }
}
```

---

### 7. DELETE /admin/franchisees/:id
**Descripción**: Eliminar franquiciado (soft delete)

**Response 200**:
```json
{
  "id": "fran_xxx",
  "deleted": true,
  "deleted_at": "2026-08-25T15:45:00Z"
}
```

**Side Effects**:
- Soft delete: `deleted_at` se marca
- Usuario asociado se desactiva
- Pedidos históricos permanecen intactos
- Franquiciado no aparece en listados normales

**Restricciones**:
- No se puede eliminar si tiene pedidos pendientes
- Solo admin principal puede eliminar

**Error 400**:
```json
{
  "error": "Cannot delete franchisee with pending orders",
  "code": "HAS_PENDING_ORDERS",
  "pending_orders": ["CF-10050", "CF-10051"]
}
```

---

## 🔄 Integración con Otros Módulos

### Con Auth (Usuarios):
```javascript
// Al crear franquiciado:
1. Crear registro en tabla `franchisees`
2. Crear usuario en tabla `users` con rol 'franchisee'
3. Vincular: franchisee.user_id = user.id
4. Enviar email de bienvenida con credenciales temporales

// Al cambiar status:
- franchisee.status = 'inactive' → user.is_active = false
- franchisee.status = 'active' → user.is_active = true
```

### Con Orders (Pedidos):
```javascript
// Relación:
Order.customer_id → Customer.id (Medusa)
Customer.metadata.franchisee_id → Franchisee.id

// Estadísticas:
SELECT COUNT(*), SUM(total) FROM orders
WHERE customer_id IN (
  SELECT id FROM customers 
  WHERE metadata->>'franchisee_id' = :franchisee_id
)
```

### Con Stores (Tiendas):
```javascript
// Asignar tiendas a franquiciado:
POST /admin/franchisees/:id/stores
{
  "store_id": "store_xxx",
  "is_primary": true
}

// Tabla franchisee_stores:
INSERT INTO franchisee_stores (franchisee_id, store_id, is_primary)
VALUES (:franchisee_id, :store_id, :is_primary)
```

---

## 📊 SQL Schema

```sql
-- Tabla principal
CREATE TABLE franchisees (
  id VARCHAR PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  company_name VARCHAR(255) NOT NULL,
  tax_id VARCHAR(20) NOT NULL UNIQUE,
  status VARCHAR(20) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  address_street VARCHAR(255),
  address_city VARCHAR(100),
  address_postal_code VARCHAR(20),
  address_country VARCHAR(2),
  address_province VARCHAR(100),
  user_id VARCHAR REFERENCES users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  status_updated_at TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Índices
CREATE INDEX idx_franchisees_email ON franchisees(email);
CREATE INDEX idx_franchisees_tax_id ON franchisees(tax_id);
CREATE INDEX idx_franchisees_status ON franchisees(status);
CREATE INDEX idx_franchisees_user ON franchisees(user_id);
CREATE INDEX idx_franchisees_deleted ON franchisees(deleted_at) WHERE deleted_at IS NULL;

-- Tabla de relación con tiendas
CREATE TABLE franchisee_stores (
  id VARCHAR PRIMARY KEY,
  franchisee_id VARCHAR NOT NULL REFERENCES franchisees(id),
  store_id VARCHAR NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(franchisee_id, store_id)
);

CREATE INDEX idx_franchisee_stores_franchisee ON franchisee_stores(franchisee_id);
CREATE INDEX idx_franchisee_stores_store ON franchisee_stores(store_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_franchisee_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_franchisee_update
  BEFORE UPDATE ON franchisees
  FOR EACH ROW
  EXECUTE FUNCTION update_franchisee_timestamp();

-- Trigger para desactivar usuario cuando franchisee se desactiva
CREATE OR REPLACE FUNCTION sync_franchisee_user_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    UPDATE users 
    SET is_active = (NEW.status = 'active')
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_franchisee_status_change
  AFTER UPDATE ON franchisees
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION sync_franchisee_user_status();
```

---

## 🧪 Testing

### Casos de Prueba Recomendados:

1. **Crear franquiciado con datos válidos** → 201 Created
2. **Crear con email duplicado** → 400 Bad Request
3. **Crear con tax_id duplicado** → 400 Bad Request
4. **Crear con tax_id formato inválido** → 422 Unprocessable
5. **Actualizar datos básicos** → 200 OK
6. **Intentar actualizar tax_id** → 400 Bad Request
7. **Desactivar franquiciado** → Usuario también se desactiva
8. **Activar franquiciado** → Usuario también se activa
9. **Obtener stats con rango de fechas** → 200 OK
10. **Soft delete** → deleted_at se marca
11. **Intentar eliminar con pedidos pendientes** → 400 Bad Request
12. **Búsqueda por nombre parcial** → Devuelve coincidencias

---

## 📧 Email Templates

### Welcome Email (al crear franquiciado):
```
Asunto: Bienvenido a Carrefour B2B Marketplace

Hola María González,

Tu cuenta de Carrefour B2B Marketplace ha sido creada.

Empresa: Carrefour Express Barcelona Sur
Usuario: maria.gonzalez@carrefour-bcn.com
Contraseña temporal: TempPass123!

Por favor, cambia tu contraseña al iniciar sesión por primera vez.

Accede aquí: https://marketplace.carrefour.es/login

¡Bienvenido a la red Carrefour!
```

---

**Documentado por**: Frontend Team  
**Fecha**: 25 de Agosto de 2026  
**Próximos pasos**: Implementación backend + sincronización con Medusa Customers
