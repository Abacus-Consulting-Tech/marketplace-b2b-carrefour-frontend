# Manual Frontend: Propuesta de Productos por Proveedor y Flujo de Tarificación Infocus

**Fecha:** 2026-08-20
**Versión:** 2.1 — Flujo real validado en LOCAL y DEV
**Base URL DEV:** `https://marketplace-b2b-backend-dev.onrender.com`

---

## Índice

1. [Visión general del flujo](#1-visión-general-del-flujo)
2. [Autenticación](#2-autenticación)
3. [Flujo del Proveedor — Propuesta de Producto](#3-flujo-del-proveedor--propuesta-de-producto)
4. [Flujo del Admin (Tarificador) — Aprobación](#4-flujo-del-admin-tarificador--aprobación)
5. [Markup global del seller](#5-markup-global-del-seller)
6. [Fórmula de precios completa](#6-fórmula-de-precios-completa)
7. [Referencia completa de endpoints](#7-referencia-completa-de-endpoints)
8. [Ejemplo Postman paso a paso](#8-ejemplo-postman-paso-a-paso)
9. [Códigos de error](#9-códigos-de-error)

---

## 1. Visión general del flujo

```
PROVEEDOR                         TARIFICADOR INFOCUS
─────────────────                 ──────────────────────────────
Propone producto                  
  + precio base                   
  + unidades/pack          →      Ve lista de pendientes
  + descripción, imágenes         
  + variantes opcionales          Revisa: título, descripción,
                                  precio base, unidades/pack
                                  
                          ←      APRUEBA: fija markup %
                                    precio final = base × (1 + markup/100)
                                    producto visible en storefront
                          
                          ←      RECHAZA: motivo escrito
                                    proveedor puede corregir y reproponerlo
```

### Estados de un producto

| Estado | Visible en storefront | Puede editar proveedor |
|--------|-----------------------|------------------------|
| `proposed` | No | Sí (reproponer) |
| `published` | **Sí** | No |
| `rejected` | No | Sí (corregir y reproponerlo) |

En las respuestas API el estado se expone también como `pricing_status`:
- `pending_approval` → `proposed`
- `approved` → `published`
- `rejected` → `rejected`

---

## 2. Autenticación

### Proveedor (member)

```http
POST /auth/member/emailpass
Content-Type: application/json

{
  "email": "proveedor@empresa.com",
  "password": "su_password"
}
```

**Respuesta:**
```json
{ "token": "eyJ..." }
```

El proveedor necesita **dos headers** en todas las llamadas a `/vendor/`:
```
Authorization: Bearer <token>
x-seller-id: sel_XXXXXXXXXXXXXXXX
```

Para obtener el `seller_id`:
```http
GET /vendor/sellers
Authorization: Bearer <token>
```
```json
{
  "seller_members": [
    {
      "seller_id": "sel_01M0A7ZNXHA4G5JE31T0X5SVP0",
      "seller": { "name": "Uniformes Corporativos S.L." }
    }
  ]
}
```

### Admin / Tarificador Infocus

```http
POST /auth/user/emailpass
Content-Type: application/json

{
  "email": "admin@carrefour.dev",
  "password": "su_password"
}
```

Solo necesita:
```
Authorization: Bearer <token>
```

---

## 3. Flujo del Proveedor — Propuesta de Producto

### 3.1 Proponer un producto nuevo

```http
POST /vendor/custom/products
Authorization: Bearer <token>
x-seller-id: sel_XXXXXXXXXXXXXXXX
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Polo Corporativo Carrefour",
  "description": "Polo de manga corta con logo bordado. 100% algodón.",
  "base_price": 18.50,
  "units_per_pack": 1,
  "category_id": "pcat_XXXXXXXX"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `title` | string | ✅ | Nombre del producto |
| `description` | string | — | Descripción detallada |
| `base_price` | number | ✅ | Precio base en euros (sin markup). Mínimo: 0.01 |
| `units_per_pack` | number | — | Unidades por paquete/caja |
| `category_id` | string | — | ID de categoría del catálogo |
| `thumbnail` | string | — | URL de imagen principal |

**Con variantes** (tallas, colores, etc.):
```json
{
  "title": "Polo Corporativo Carrefour",
  "description": "Polo con logo bordado",
  "base_price": 18.50,
  "units_per_pack": 1,
  "variants": [
    { "title": "Talla S", "base_price": 18.50, "sku": "POLO-S" },
    { "title": "Talla M", "base_price": 18.50, "sku": "POLO-M" },
    { "title": "Talla L", "base_price": 19.00, "sku": "POLO-L" },
    { "title": "Talla XL", "base_price": 19.00, "sku": "POLO-XL" }
  ]
}
```

> Si no se envían `variants`, se crea automáticamente una variante "Default".

**Respuesta `201`:**
```json
{
  "product": {
    "id": "prod_01M0FCW64M4RBP6T6S6W5M3KRN",
    "title": "Polo Corporativo Carrefour",
    "status": "proposed",
    "base_price": 18.50,
    "pricing_status": "pending_approval"
  },
  "message": "Product proposed successfully. Pending pricing approval from Infocus."
}
```

---

### 3.2 Ver mis productos

```http
GET /vendor/custom/products
Authorization: Bearer <token>
x-seller-id: sel_XXXXXXXXXXXXXXXX
```

Parámetros opcionales: `?limit=20&offset=0`

**Respuesta:**
```json
{
  "products": [
    {
      "id": "prod_01M0FCW64M4RBP6T6S6W5M3KRN",
      "title": "Polo Corporativo Carrefour",
      "description": "Polo con logo bordado",
      "status": "proposed",
      "pricing_status": "pending_approval",
      "base_price": 18.50,
      "units_per_pack": 1,
      "thumbnail": null,
      "created_at": "2026-08-20T10:00:00.000Z",
      "categories": [{ "id": "pcat_01...", "name": "Uniformes" }],
      "variants": [
        { "id": "variant_01...", "title": "Talla M", "sku": "POLO-M" }
      ]
    }
  ],
  "count": 1,
  "limit": 20,
  "offset": 0
}
```

**Posibles valores de `pricing_status`:**
- `pending_approval` — Esperando revisión del tarificador
- `approved` — Aprobado, visible en storefront
- `rejected` — Rechazado, ver `metadata.rejection_reason` para el motivo

Para ver el motivo de rechazo, leer `product.metadata.rejection_reason` si está disponible.

---

## 4. Flujo del Admin (Tarificador) — Aprobación

### 4.1 Ver productos pendientes de tarificación

```http
GET /admin/custom/products/pending
Authorization: Bearer <token>
```

Parámetros opcionales: `?seller_id=sel_XXXX&limit=50&offset=0`

**Respuesta:**
```json
{
  "products": [
    {
      "id": "prod_01M0FCW64M4RBP6T6S6W5M3KRN",
      "title": "Polo Corporativo Carrefour",
      "description": "Polo con logo bordado",
      "status": "proposed",
      "base_price": 18.50,
      "units_per_pack": 1,
      "seller": {
        "id": "sel_01M0A7ZNXHA4G5JE31T0X5SVP0",
        "name": "Uniformes Corporativos S.L.",
        "email": "maria@uniformescorp.com"
      },
      "categories": [{ "name": "Uniformes" }],
      "variants": [
        { "id": "variant_01...", "title": "Talla M" }
      ]
    }
  ],
  "count": 1,
  "total": 1
}
```

---

### 4.2 Aprobar un producto con markup

```http
PATCH /admin/custom/products/{product_id}/pricing-approval
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved",
  "markup_percentage": 15
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `status` | `"approved"` | ✅ | |
| `markup_percentage` | number | ✅ | Entre 0 y 500. Porcentaje que se añade al precio base |

**Respuesta `200`:**
```json
{
  "product": {
    "id": "prod_01M0FCW64M4RBP6T6S6W5M3KRN",
    "status": "published",
    "metadata": {
      "base_price": 18.50,
      "markup_percentage": 15,
      "pricing_approved_by": "user_01M0...",
      "pricing_approved_at": "2026-08-20T11:00:00.000Z",
      "base_prices": [
        { "variant_id": "variant_01...", "amount": 18.50, "currency_code": "eur" }
      ]
    }
  },
  "pricing_summary": [
    {
      "variant_id": "variant_01...",
      "variant_title": "Talla M",
      "base_price": 18.50,
      "final_price": 21.28,
      "currency_code": "eur"
    }
  ],
  "message": "Product approved with 15% markup and published to storefront"
}
```

Tras la aprobación el producto pasa a `status: "published"` y es **inmediatamente visible en el storefront** al precio calculado.

---

### 4.3 Rechazar un producto

```http
PATCH /admin/custom/products/{product_id}/pricing-approval
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "rejected",
  "rejection_reason": "El precio base supera el acuerdo marco. Por favor revise y reenvíe."
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `status` | `"rejected"` | ✅ | |
| `rejection_reason` | string | ✅ | Motivo visible para el proveedor |

**Respuesta `200`:**
```json
{
  "product": {
    "id": "prod_01M0FCW64M4RBP6T6S6W5M3KRN",
    "status": "rejected"
  },
  "message": "Product rejected: El precio base supera el acuerdo marco..."
}
```

El proveedor puede corregir el producto y crear una nueva propuesta. El producto rechazado permanece con `status: "rejected"`.

---

## 5. Markup global del seller

El markup global del seller es el **markup por defecto** del proveedor. Se aplica en el storefront a los productos que **no tienen un `markup_percentage` específico** asignado en su aprobación. **No se acumula** con el markup de producto — es uno u otro.

### 5.1 Ver el markup de un seller

```http
GET /admin/custom/sellers/{seller_id}/markup
Authorization: Bearer <admin_token>
```

**Respuesta:**
```json
{
  "seller_id": "sel_01M0A7ZN...",
  "seller_name": "Uniformes Corporativos S.L.",
  "global_markup_percentage": 8
}
```

### 5.2 Fijar o modificar el markup del seller

```http
PATCH /admin/custom/sellers/{seller_id}/markup
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "global_markup_percentage": 10
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `global_markup_percentage` | number | Entre 0 y 500. `0` = sin markup adicional |

**Respuesta:**
```json
{
  "seller_id": "sel_01M0A7ZN...",
  "seller_name": "Uniformes Corporativos S.L.",
  "global_markup_percentage": 10,
  "previous_markup_percentage": 8,
  "updated_by": "user_01M0...",
  "message": "Seller markup updated from 8% to 10%"
}
```

> **Dónde leerlo desde el storefront:** El frontend debe llamar a `GET /admin/custom/sellers/:id/markup` (o incluirlo en la carga inicial del catálogo por seller) y guardar el valor para aplicarlo al mostrar cada precio.

---

## 6. Fórmula de precios completa

La lógica es **excluyente**: se aplica el markup de producto si existe; si no, el del seller.

```
SI producto tiene markup_percentage:
  precio_mostrado = base_price × (1 + product_markup / 100)

SI NO:
  precio_mostrado = base_price × (1 + seller_global_markup / 100)
```

| Componente | Quién lo fija | Cuándo | Dónde se guarda |
|------------|---------------|--------|-----------------|
| `base_price` | Proveedor | Al proponer el producto | `product.metadata.base_price` |
| `product_markup_percentage` | Tarificador Infocus | En la aprobación (opcional) | `product.metadata.markup_percentage` |
| `seller_global_markup_percentage` | Admin Infocus | En cualquier momento | `seller.metadata.global_markup_percentage` |

**Lógica para el storefront:**
1. Leer `product.metadata.markup_percentage`
2. Si existe → `precio = base_price × (1 + product_markup/100)`
3. Si no → leer `seller.global_markup_percentage` → `precio = base_price × (1 + seller_markup/100)`

**Ejemplos:**

| Caso | base_price | product_markup | seller_markup | Precio mostrado |
|------|-----------|---------------|---------------|-----------------|
| Con markup de producto | 18.50 € | 15% | 8% | 18.50 × 1.15 = **21.28 €** |
| Sin markup de producto | 18.50 € | — | 8% | 18.50 × 1.08 = **19.98 €** |
| Sin ningún markup | 18.50 € | — | 0% | **18.50 €** |

> Para trazabilidad, el `base_price` original se conserva siempre en `product.metadata.base_price`.

---

### Proveedor

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/vendor/custom/products` | Proponer nuevo producto |
| `GET` | `/vendor/custom/products` | Listar mis productos |

**Headers requeridos para `/vendor/custom/*`:**
```
Authorization: Bearer <member_token>
x-seller-id: sel_XXXXXXXXXXXXXXXX
```

### Admin / Tarificador

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/admin/custom/products/pending` | Listar productos pendientes de tarificación |
| `PATCH` | `/admin/custom/products/:id/pricing-approval` | Aprobar (con markup) o rechazar |
| `GET` | `/admin/custom/sellers/:id/markup` | Ver markup global del seller |
| `PATCH` | `/admin/custom/sellers/:id/markup` | Fijar/modificar markup global del seller |

**Header requerido para `/admin/*`:**
```
Authorization: Bearer <user_token>
```

### Auth

| Método | Endpoint | Actor | Descripción |
|--------|----------|-------|-------------|
| `POST` | `/auth/member/emailpass` | Proveedor | Login |
| `POST` | `/auth/member/emailpass/register` | Proveedor | Registro |
| `POST` | `/auth/user/emailpass` | Admin | Login |
| `GET` | `/vendor/sellers` | Proveedor | Obtener seller_id |

> ⚠️ `POST /auth/user/emailpass/register` está **bloqueado** — los admins solo se crean via CLI o variable de entorno `BOOTSTRAP_ADMIN_EMAIL`.

---

## 7. Ejemplo Postman paso a paso

### Colección sugerida

**1. Login proveedor**
```
POST {{base_url}}/auth/member/emailpass
Body: {"email":"proveedor@empresa.com","password":"password"}
→ Guardar token en variable: pm.environment.set("seller_token", pm.response.json().token)
```

**2. Obtener seller_id**
```
GET {{base_url}}/vendor/sellers
Authorization: Bearer {{seller_token}}
→ Guardar: pm.environment.set("seller_id", pm.response.json().seller_members[0].seller_id)
```

**3. Proponer producto**
```
POST {{base_url}}/vendor/custom/products
Authorization: Bearer {{seller_token}}
x-seller-id: {{seller_id}}
Body: {"title":"Producto Test","base_price":25.00,"units_per_pack":10}
→ Guardar: pm.environment.set("product_id", pm.response.json().product.id)
```

**4. Ver mis productos**
```
GET {{base_url}}/vendor/custom/products
Authorization: Bearer {{seller_token}}
x-seller-id: {{seller_id}}
```

**5. Login admin**
```
POST {{base_url}}/auth/user/emailpass
Body: {"email":"admin@carrefour.dev","password":"supersecret"}
→ Guardar: pm.environment.set("admin_token", pm.response.json().token)
```

**6. Ver pendientes (admin)**
```
GET {{base_url}}/admin/custom/products/pending
Authorization: Bearer {{admin_token}}
```

**7. Aprobar producto**
```
PATCH {{base_url}}/admin/custom/products/{{product_id}}/pricing-approval
Authorization: Bearer {{admin_token}}
Body: {"status":"approved","markup_percentage":15}
```

**8. Rechazar producto**
```
PATCH {{base_url}}/admin/custom/products/{{product_id}}/pricing-approval
Authorization: Bearer {{admin_token}}
Body: {"status":"rejected","rejection_reason":"Precio fuera de rango"}
```

---

## 8. Códigos de error

| HTTP | `type` | Causa |
|------|--------|-------|
| 401 | `unauthorized` | Token ausente, expirado o actor_type incorrecto |
| 403 | `not_allowed` | `x-seller-id` no corresponde al member autenticado; registro admin bloqueado |
| 404 | `not_found` | Producto no existe o no pertenece al proveedor |
| 422 | `invalid_data` | Campo requerido ausente, precio ≤ 0, markup fuera de rango, producto no en estado `proposed` |
| 500 | `unknown_error` | Error interno — revisar logs del servidor |

### Validaciones específicas

- `base_price` debe ser mayor que 0
- `markup_percentage` debe estar entre 0 y 500
- Solo se puede aprobar/rechazar un producto en estado `proposed`
- Si el producto no tiene `base_price` en metadata, el sistema devuelve error 422
