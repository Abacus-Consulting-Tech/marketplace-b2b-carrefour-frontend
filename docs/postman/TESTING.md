# Guía de Testing con Postman - Marketplace B2B Carrefour

Esta guía te enseña cómo usar la colección de Postman para validar toda la integración frontend → backend.

---

## 🎯 Objetivos

Validar que:
- ✅ El backend responde correctamente
- ✅ La autenticación funciona
- ✅ Los productos se listan correctamente
- ✅ El flujo de carrito completo funciona
- ✅ Los endpoints de admin funcionan

---

## 📦 Setup Inicial

### 1. Importar Colección

1. Abrir Postman
2. Clic en **Import**
3. Seleccionar archivo: `marketplace-b2b-carrefour.postman_collection 1.json`
4. Clic en **Import**

### 2. Configurar Variables

1. En la colección, ir a **Variables** tab
2. Configurar valores **CURRENT VALUE**:

| Variable | Valor a Configurar | Descripción |
|----------|-------------------|-------------|
| `adminEmail` | `acano@abacus-consulting.net` | Tu email de admin |
| `adminPassword` | `[TU_PASSWORD]` | Tu password de admin |

**Variables pre-configuradas** (no tocar):
- `baseUrl`: `https://marketplace-b2b-backend-dev.onrender.com`
- `publishableApiKey`: `pk_15f89d...`
- `regionId`: `reg_01M07RY...`

**Variables auto-capturadas** (se llenan automáticamente):
- `jwtToken`, `productId`, `variantId`, `cartId`, `lineItemId`, `orderId`

3. Clic en **Save**

---

## 🧪 Flujos de Testing

### 🔍 Flujo 1: Health Check (Validar Backend)

**Objetivo:** Confirmar que el backend está activo

1. Expandir folder **0 - Health**
2. Seleccionar `GET /health`
3. Clic en **Send**

**Resultado esperado:**
```json
{
  "status": "ok"
}
```

**Si falla:**
- Backend puede estar dormido (Render free tier)
- Esperar ~1 minuto y reintentar
- Si persiste, verificar que backend esté deployado

---

### 🔐 Flujo 2: Autenticación Completa

**Objetivo:** Validar login, registro y recuperación de password

#### A. Login (Más Importante)

1. Expandir folder **1 - Auth (frontend)**
2. Seleccionar `POST /auth/user/emailpass (login)`
3. Verificar que el body contiene:
   ```json
   {
     "email": "{{adminEmail}}",
     "password": "{{adminPassword}}"
   }
   ```
4. Clic en **Send**

**Resultado esperado:**
```json
{
  "token": "ey..."
}
```

**Verificar captura automática:**
1. Ir a **Variables** tab de la colección
2. Confirmar que `jwtToken` ahora tiene un valor

#### B. Registro de Usuario (Opcional)

1. Seleccionar `POST /auth/register`
2. Modificar `registerEmail` en variables si quieres
3. Clic en **Send**

**Resultado esperado:**
```json
{
  "user": {
    "id": "...",
    "email": "newuser@example.com"
  },
  "token": "ey..."
}
```

#### C. Forgot Password (Opcional)

1. Seleccionar `POST /auth/forgot-password`
2. Clic en **Send**

**Resultado esperado:**
```json
{
  "message": "Password reset email sent"
}
```

---

### 🛍️ Flujo 3: Catálogo de Productos

**Objetivo:** Validar que se pueden listar productos

#### A. Listar Regiones (Opcional)

1. Expandir folder **2 - Store Catalog**
2. Seleccionar `GET /store/regions`
3. Clic en **Send**

**Resultado esperado:**
```json
{
  "regions": [
    {
      "id": "reg_01M07...",
      "name": "España",
      ...
    }
  ]
}
```

#### B. Listar Productos ⭐

1. Seleccionar `GET /store/products`
2. Clic en **Send**

**Resultado esperado (BD vacía - 18/08/2026):**
```json
{
  "products": [],
  "count": 0,
  "offset": 0,
  "limit": 20
}
```

**Resultado esperado (después de poblar BD):**
```json
{
  "products": [
    {
      "id": "prod_...",
      "title": "Polo Corporativo Carrefour",
      "description": "...",
      "variants": [
        {
          "id": "variant_...",
          "title": "S / Azul",
          "prices": [...]
        }
      ],
      ...
    }
  ],
  "count": 14
}
```

**Verificar captura automática:**
1. Ir a **Variables**
2. Confirmar que `productId` y `variantId` se llenaron (si hay productos)

#### C. Detalle de Producto (Solo si hay productos)

1. Seleccionar `GET /store/products/{id}`
2. Clic en **Send**

**Resultado esperado:**
```json
{
  "product": {
    "id": "prod_...",
    "title": "Polo Corporativo Carrefour",
    ...
  }
}
```

---

### 🛒 Flujo 4: Carrito y Checkout Completo

**Objetivo:** Simular flujo completo de compra

**⚠️ Prerequisito:** Necesitas productos en la base de datos (esperar a que backend los inserte)

#### Paso 1: Crear Carrito

1. Expandir folder **3 - Store Cart and Checkout**
2. Seleccionar `POST /store/carts`
3. Clic en **Send**

**Resultado esperado:**
```json
{
  "cart": {
    "id": "cart_...",
    "region_id": "reg_01M07...",
    "items": [],
    "total": 0
  }
}
```

**Verificar:** `cartId` capturado en Variables

#### Paso 2: Ver Carrito Vacío

1. Seleccionar `GET /store/carts/{cartId}`
2. Clic en **Send**

**Resultado esperado:**
```json
{
  "cart": {
    "id": "cart_...",
    "items": [],
    "total": 0
  }
}
```

#### Paso 3: Añadir Producto al Carrito

1. Seleccionar `POST /store/carts/{cartId}/line-items`
2. Verificar body:
   ```json
   {
     "variant_id": "{{variantId}}",
     "quantity": 2
   }
   ```
3. Clic en **Send**

**Resultado esperado:**
```json
{
  "cart": {
    "id": "cart_...",
    "items": [
      {
        "id": "item_...",
        "variant_id": "variant_...",
        "quantity": 2,
        "unit_price": 1500,
        "total": 3000
      }
    ],
    "subtotal": 3000
  }
}
```

**Verificar:** `lineItemId` capturado en Variables

#### Paso 4: Actualizar Cantidad

1. Seleccionar `POST /store/carts/{cartId}/line-items/{lineItemId}`
2. Modificar quantity a 5 en el body
3. Clic en **Send**

**Resultado esperado:**
```json
{
  "cart": {
    "items": [
      {
        "id": "item_...",
        "quantity": 5,
        "total": 7500
      }
    ],
    "subtotal": 7500
  }
}
```

#### Paso 5: Añadir Dirección de Envío

1. Seleccionar `POST /store/carts/{cartId}`
2. Verificar body contiene email y shipping_address
3. Clic en **Send**

**Resultado esperado:**
```json
{
  "cart": {
    "email": "franchisee@test.com",
    "shipping_address": {
      "first_name": "Juan",
      "last_name": "Perez",
      "address_1": "Calle Mayor 123",
      ...
    }
  }
}
```

#### Paso 6: Listar Opciones de Envío

1. Seleccionar `GET /store/shipping-options?cart_id={cartId}`
2. Clic en **Send**

**Resultado esperado:**
```json
{
  "shipping_options": {
    "standard": [
      {
        "id": "so_...",
        "name": "Standard Shipping",
        "amount": 500
      }
    ]
  }
}
```

**Verificar:** `shippingOptionId` capturado en Variables

#### Paso 7: Seleccionar Método de Envío

1. Seleccionar `POST /store/carts/{cartId}/shipping-methods`
2. Verificar body:
   ```json
   {
     "option_id": "{{shippingOptionId}}"
   }
   ```
3. Clic en **Send**

**Resultado esperado:**
```json
{
  "cart": {
    "shipping_methods": [
      {
        "shipping_option_id": "so_...",
        "amount": 500
      }
    ],
    "total": 8000
  }
}
```

#### Paso 8: Completar Orden ⭐

1. Seleccionar `POST /store/carts/{cartId}/complete`
2. Clic en **Send**

**Resultado esperado:**
```json
{
  "type": "order",
  "order": {
    "id": "order_...",
    "status": "pending",
    "cart_id": "cart_...",
    "total": 8000,
    "items": [...]
  }
}
```

**Verificar:** `orderId` capturado en Variables

#### Paso 9: Ver Detalle de Orden

1. Seleccionar `GET /store/orders/{id}`
2. Clic en **Send**

**Resultado esperado:**
```json
{
  "order": {
    "id": "order_...",
    "status": "pending",
    "total": 8000,
    "items": [...],
    "shipping_address": {...}
  }
}
```

---

### 👨‍💼 Flujo 5: Endpoints de Administración

**Objetivo:** Validar endpoints que usa el dashboard de admin

#### Paso 1: Login como Admin

1. Expandir folder **4 - Admin**
2. Seleccionar `POST /auth/user/emailpass (save jwtToken)`
3. Clic en **Send**

**Verificar:** `jwtToken` capturado

#### Paso 2: Obtener Datos del Usuario Actual

1. Seleccionar `GET /admin/users/me`
2. Clic en **Send**

**Resultado esperado:**
```json
{
  "user": {
    "id": "user_...",
    "email": "acano@abacus-consulting.net",
    "role": "admin"
  }
}
```

**⚠️ Nota:** Este endpoint puede no estar implementado todavía (ver [BACKEND_PENDIENTE.md](../BACKEND_PENDIENTE.md))

#### Paso 3: Listar Pedidos

1. Seleccionar `GET /admin/orders`
2. Clic en **Send**

**Resultado esperado (BD vacía):**
```json
{
  "orders": []
}
```

**Resultado esperado (después de completar orden):**
```json
{
  "orders": [
    {
      "id": "order_...",
      "status": "pending",
      "total": 8000,
      "created_at": "2026-08-18T..."
    }
  ]
}
```

---

## 🔄 Ejecutar Colección Completa (Runner)

Para ejecutar todos los tests de una vez:

1. Clic derecho en la colección
2. Seleccionar **Run collection**
3. En Runner, seleccionar folders/requests a ejecutar:
   - ✅ `0 - Health`
   - ✅ `1 - Auth (frontend)` → solo Login
   - ✅ `2 - Store Catalog` → solo GET /store/products
   - ⚠️ `3 - Store Cart and Checkout` → **Desactivar** (requiere datos en BD)
   - ✅ `4 - Admin` → Login + GET /admin/orders
4. Clic en **Run**

**Resultado:** Verás un resumen de requests exitosos/fallidos

---

## 📊 Resultados Esperados por Estado de BD

### Estado Actual (BD Vacía - 18/08/2026)

| Endpoint | Status | Response |
|----------|--------|----------|
| `GET /health` | ✅ 200 | `{status: "ok"}` |
| `POST /auth/user/emailpass` | ✅ 200 | `{token: "ey..."}` |
| `GET /store/products` | ✅ 200 | `{products: [], count: 0}` |
| `POST /store/carts` | ✅ 201 | `{cart: {...}}` |
| `POST .../line-items` | ❌ 400 | Error: variant no existe |
| `GET /admin/orders` | ✅ 200 | `{orders: []}` |

### Después de Poblar BD (Esperado)

| Endpoint | Status | Response |
|----------|--------|----------|
| `GET /store/products` | ✅ 200 | `{products: [14 items], count: 14}` |
| `GET /store/products/{id}` | ✅ 200 | Detalle del producto |
| `POST .../line-items` | ✅ 200 | Item añadido correctamente |
| `POST .../complete` | ✅ 200 | `{order: {...}}` |
| `GET /admin/orders` | ✅ 200 | `{orders: [2+ items]}` |

---

## 🆘 Troubleshooting

### Error: "Could not get any response"

**Causa:** Backend dormido o inactivo

**Solución:**
1. Ejecutar `GET /health`
2. Esperar ~60 segundos (backend en Render DEV tarda en despertar)
3. Reintentar request original

---

### Error: 401 Unauthorized en /admin/*

**Causa:** No hay JWT token o expiró

**Solución:**
1. Ejecutar `POST /auth/user/emailpass` en folder "4 - Admin"
2. Verificar que `jwtToken` se capturó en Variables
3. Reintentar request

---

### Error: 400 Bad Request - "Variant not found"

**Causa:** Base de datos vacía, no hay productos

**Estado actual:** Normal, backend está poblando la BD

**Solución:**
1. Esperar a que backend inserte datos de [DATOS_INICIALES.md](../medusa/DATOS_INICIALES.md)
2. Reintentar después de confirmación del backend

---

### Productos vacíos pero debería haber datos

**Verificar:**
1. Ejecutar `GET /store/products`
2. Ver `count` en response
3. Si `count: 0`:
   - Backend aún no ha poblado la BD
   - Contactar a backend team
4. Si `count > 0` pero `products: []`:
   - Problema de paginación
   - Verificar parámetros `limit` y `offset`

---

### Variables no se capturan automáticamente

**Causa:** Test scripts no se ejecutan o hay error en response

**Solución:**
1. Ir a request → **Tests** tab
2. Verificar que hay código JavaScript
3. Ejecutar request y ver **Test Results**
4. Si hay error en test, revisar formato de response

---

## 📚 Recursos Adicionales

- **[API Calls Actual](../medusa/API_CALLS_ACTUAL.md)** - Documentación completa de todos los endpoints
- **[Datos Iniciales](../medusa/DATOS_INICIALES.md)** - Mock data que se insertará en BD
- **[Backend Pendiente](../BACKEND_PENDIENTE.md)** - Estado de integración con backend
- **[Postman Documentation](https://learning.postman.com/)** - Documentación oficial de Postman

---

## ✅ Checklist de Validación

Después de ejecutar todos los flujos, verificar:

- [ ] Health check responde OK
- [ ] Login devuelve JWT token válido
- [ ] JWT se captura automáticamente en variables
- [ ] Productos se listan (aunque sea array vacío)
- [ ] Se puede crear carrito
- [ ] Variables `cartId`, `productId`, etc. se auto-capturan
- [ ] Endpoints admin requieren autenticación (401 sin token)
- [ ] Endpoints admin funcionan con token válido

**Si todos los checks pasan:** ✅ Integración frontend → backend validada

---

**Última actualización:** 18/08/2026  
**Estado BD:** Vacía (backend poblando datos)  
**Backend:** https://marketplace-b2b-backend-dev.onrender.com
