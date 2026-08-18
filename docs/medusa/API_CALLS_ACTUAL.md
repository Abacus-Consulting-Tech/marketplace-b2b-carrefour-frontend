# API Calls Actuales - Frontend a Medusa Backend

Este documento lista **todas las llamadas API** que el frontend está haciendo actualmente al backend Medusa/MercurJS.

---

## 🔐 Autenticación (Auth)

### 1. Login
```
POST /auth/user/emailpass
```
**Usado en:** `src/app/api/auth/login/route.ts`  
**Descripción:** Login de usuario con email y password  
**Body:**
```json
{
  "email": "admin@carrefour.dev",
  "password": "supersecret"
}
```
**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Estado:** ✅ Implementado y funcionando

---

### 2. Forgot Password
```
POST /auth/forgot-password
```
**Usado en:** `src/app/(auth)/forgot-password/page.tsx`  
**Descripción:** Solicitar reset de contraseña  
**Body:**
```json
{
  "email": "user@example.com"
}
```
**Estado:** 🚧 Llamada implementada en frontend, no verificado en backend

---

### 3. Register
```
POST /auth/register
```
**Usado en:** `src/app/(auth)/register/page.tsx`  
**Descripción:** Registro de nuevo usuario  
**Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+34 600 000 000",
  "role": "franchisee"
}
```
**Estado:** 🚧 Llamada implementada en frontend, no verificado en backend

---

## 📦 Admin - Gestión

### 4. Listar Pedidos (Admin)
```
GET /admin/orders
```
**Usado en:** `src/app/(backoffice)/admin/dashboard/page.tsx`  
**Descripción:** Obtener todos los pedidos (vista admin)  
**Headers:**
```
Authorization: Bearer {token}
```
**Response esperada:**
```json
{
  "orders": [
    {
      "id": "order_123",
      "order_number": "CF-10001",
      "status": "delivered",
      "total": 647.35,
      "created_at": "2024-01-15T10:30:00.000Z",
      ...
    }
  ]
}
```
**Response actual del backend DEV (18/08/2026):**
```json
{
  "orders": []
}
```
**Estado:** ✅ Endpoint funcional, ⚠️ BD vacía (usar datos de [DATOS_INICIALES.md](./DATOS_INICIALES.md) para poblar)

---

## 🛍️ Store - Productos (Marketplace)

### 5. Listar Productos
```
GET /store/products
```
**Usado en:** `src/app/(marketplace)/marketplace/page.tsx`  
**Descripción:** Obtener lista de productos del catálogo  
**Headers:**
```
x-publishable-api-key: pk_15f89d436badff43c2366d014c88536fa0307e92aeaeab294a2ee1d29710e1b9
```
**Query params (opcionales):**
```
?limit=20
&offset=0
&category_id=cat_xxx
```
**Response esperada:**
```json
{
  "products": [
    {
      "id": "prod_123",
      "title": "Polo Corporativo Carrefour",
      "description": "...",
      "variants": [...],
      "thumbnail": "https://...",
      ...
    }
  ],
  "count": 14,
  "offset": 0,
  "limit": 20
}
```
**Response actual del backend DEV (18/08/2026):**
```json
{
  "products": [],
  "count": 0,
  "offset": 0,
  "limit": 50
}
```
**Estado:** ✅ Endpoint funcional, ⚠️ BD vacía (usar datos de [DATOS_INICIALES.md](./DATOS_INICIALES.md) para poblar)

---

### 6. Obtener Producto por ID
```
GET /store/products/{id}
```
**Usado en:** `src/app/(marketplace)/marketplace/products/[id]/page.tsx`  
**Descripción:** Obtener detalles de un producto específico  
**Headers:**
```
x-publishable-api-key: pk_15f89d436badff43c2366d014c88536fa0307e92aeaeab294a2ee1d29710e1b9
```
**Response esperada:**
```json
{
  "product": {
    "id": "prod_123",
    "title": "Polo Corporativo Carrefour",
    "description": "...",
    "variants": [...],
    "images": [...],
    ...
  }
}
```
**Estado:** ✅ Endpoint funcional, ⚠️ BD vacía (requiere productos insertados primero)

---

## 🛒 Store - Carrito (Cart)

### 7. Crear Carrito
```
POST /store/carts
```
**Usado en:** `src/lib/api/mercur-store-client.ts` → `createCart()`  
**Descripción:** Crear un nuevo carrito de compras  
**Headers:**
```
x-publishable-api-key: pk_...
```
**Body:**
```json
{
  "region_id": "reg_01M07RY98WSVVF2SP0Q7SB8KM0"
}
```
**Response esperada:**
```json
{
  "cart": {
    "id": "cart_123",
    "region_id": "reg_01M07RY98WSVVF2SP0Q7SB8KM0",
    "items": [],
    "total": 0,
    ...
  }
}
```
**Estado:** ✅ Implementado

---

### 8. Obtener Carrito
```
GET /store/carts/{cartId}
```
**Usado en:** `src/lib/api/mercur-store-client.ts` → `retrieveCart()`  
**Descripción:** Obtener carrito existente por ID  
**Headers:**
```
x-publishable-api-key: pk_...
```
**Response esperada:**
```json
{
  "cart": {
    "id": "cart_123",
    "items": [...],
    "subtotal": 535.00,
    "total": 647.35,
    ...
  }
}
```
**Estado:** ✅ Implementado

---

### 9. Añadir Item al Carrito
```
POST /store/carts/{cartId}/line-items
```
**Usado en:** `src/lib/api/mercur-store-client.ts` → `addLineItem()`  
**Descripción:** Añadir producto al carrito  
**Headers:**
```
x-publishable-api-key: pk_...
```
**Body:**
```json
{
  "variant_id": "variant_123",
  "quantity": 2
}
```
**Response esperada:**
```json
{
  "cart": {
    "id": "cart_123",
    "items": [
      {
        "id": "item_123",
        "variant_id": "variant_123",
        "quantity": 2,
        "unit_price": 18.50,
        ...
      }
    ],
    ...
  }
}
```
**Estado:** ✅ Implementado

---

### 10. Actualizar Item del Carrito
```
POST /store/carts/{cartId}/line-items/{lineItemId}
```
**Usado en:** `src/lib/api/mercur-store-client.ts` → `updateLineItem()`  
**Descripción:** Actualizar cantidad de un item  
**Headers:**
```
x-publishable-api-key: pk_...
```
**Body:**
```json
{
  "quantity": 5
}
```
**Response esperada:**
```json
{
  "cart": {
    "id": "cart_123",
    "items": [...],
    ...
  }
}
```
**Estado:** ✅ Implementado

---

### 11. Eliminar Item del Carrito
```
DELETE /store/carts/{cartId}/line-items/{lineItemId}
```
**Usado en:** `src/lib/api/mercur-store-client.ts` → `removeLineItem()`  
**Descripción:** Eliminar un item del carrito  
**Headers:**
```
x-publishable-api-key: pk_...
```
**Response esperada:**
```json
{
  "parent": {
    "id": "cart_123",
    "items": [...],
    ...
  }
}
```
**Estado:** ✅ Implementado

---

### 12. Actualizar Carrito
```
POST /store/carts/{cartId}
```
**Usado en:** `src/lib/api/mercur-store-client.ts` → `updateCart()`  
**Descripción:** Actualizar información del carrito (email, dirección, etc.)  
**Headers:**
```
x-publishable-api-key: pk_...
```
**Body (ejemplo):**
```json
{
  "email": "customer@example.com",
  "shipping_address": {
    "first_name": "Juan",
    "last_name": "Pérez",
    "address_1": "Calle Mayor 123",
    "city": "Madrid",
    "postal_code": "28001",
    "country_code": "es"
  }
}
```
**Response esperada:**
```json
{
  "cart": {
    "id": "cart_123",
    "email": "customer@example.com",
    "shipping_address": {...},
    ...
  }
}
```
**Estado:** ✅ Implementado

---

### 13. Listar Opciones de Envío
```
GET /store/shipping-options?cart_id={cartId}
```
**Usado en:** `src/lib/api/mercur-store-client.ts` → `listShippingOptions()`  
**Descripción:** Obtener opciones de envío disponibles para el carrito  
**Headers:**
```
x-publishable-api-key: pk_...
```
**Response esperada:**
```json
{
  "shipping_options": {
    "standard": [
      {
        "id": "so_123",
        "name": "Envío estándar",
        "amount": 0,
        ...
      }
    ]
  }
}
```
**Estado:** ✅ Implementado

---

### 14. Añadir Método de Envío
```
POST /store/carts/{cartId}/shipping-methods
```
**Usado en:** `src/lib/api/mercur-store-client.ts` → `addShippingMethod()`  
**Descripción:** Seleccionar método de envío para el carrito  
**Headers:**
```
x-publishable-api-key: pk_...
```
**Body:**
```json
{
  "option_id": "so_123"
}
```
**Response esperada:**
```json
{
  "cart": {
    "id": "cart_123",
    "shipping_methods": [
      {
        "shipping_option_id": "so_123",
        "price": 0,
        ...
      }
    ],
    ...
  }
}
```
**Estado:** ✅ Implementado

---

## � Estado Actual de la Base de Datos (Render DEV)

**Verificado:** 18/08/2026

El backend en Render DEV está **operativo y respondiendo correctamente**, pero la base de datos PostgreSQL está **VACÍA**:

```bash
# Verificación realizada:
curl -X GET "https://marketplace-b2b-backend-dev.onrender.com/store/products" \
  -H "x-publishable-api-key: pk_..."

# Respuesta:
{
  "products": [],
  "count": 0
}
```

### ⚠️ Impacto en el Frontend

| Página | Estado | Qué Ve el Usuario |
|--------|--------|-------------------|
| `/marketplace` | ✅ Funciona | Lista de productos vacía |
| `/marketplace/products/[id]` | ❌ 404 | No hay productos para ver |
| `/admin/dashboard` | ✅ Funciona | Banner: "No hay pedidos todavía" |
| Login | ✅ Funciona | Autenticación operativa |

### 🔧 Solución

**Para poblar la base de datos:**
1. Usar los datos de [DATOS_INICIALES.md](./DATOS_INICIALES.md)
2. Insertar en este orden:
   - ✅ Usuarios
   - ✅ Categorías
   - ✅ Proveedores
   - ✅ Productos ← **Crítico para marketplace**
   - ✅ Pedidos (opcional)

**Backend team:** Una vez insertados los productos, el frontend mostrará el catálogo inmediatamente sin cambios de código.

---

## �📊 Resumen por Módulo

### Autenticación (Auth)
- ✅ `POST /auth/user/emailpass` - Login (funcionando)
- 🚧 `POST /auth/forgot-password` - Reset password (pendiente verificar)
- 🚧 `POST /auth/register` - Registro (pendiente verificar)

### Admin
- ✅ `GET /admin/orders` - Listar pedidos (funcional, BD vacía)

### Store - Productos
- ✅ `GET /store/products` - Listar productos (funcional, BD vacía)
- ✅ `GET /store/products/{id}` - Detalle producto (funcional, requiere productos)

### Store - Carrito
- ✅ `POST /store/carts` - Crear carrito (implementado)
- ✅ `GET /store/carts/{cartId}` - Obtener carrito (implementado)
- ✅ `POST /store/carts/{cartId}/line-items` - Añadir item (implementado)
- ✅ `POST /store/carts/{cartId}/line-items/{lineItemId}` - Actualizar item (implementado)
- ✅ `DELETE /store/carts/{cartId}/line-items/{lineItemId}` - Eliminar item (implementado)
- ✅ `POST /store/carts/{cartId}` - Actualizar carrito (implementado)
- ✅ `GET /store/shipping-options` - Opciones de envío (implementado)
- ✅ `POST /store/carts/{cartId}/shipping-methods` - Añadir método envío (implementado)

---

## 🔧 Configuración Actual

### Base URLs
- **Development:** `/backend` (proxy Next.js)
- **Production:** `https://marketplace-b2b-backend-dev.onrender.com`

### Headers Comunes

**Store API:**
```
x-publishable-api-key: pk_15f89d436badff43c2366d014c88536fa0307e92aeaeab294a2ee1d29710e1b9
```

**Admin/Auth API:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

### Region ID por Defecto
```
reg_01M07RY98WSVVF2SP0Q7SB8KM0
```

---

## ⚠️ Endpoints NO Implementados (Necesarios)

### Pendientes del Backend

1. **GET /admin/users/me**
   - **Descripción:** Obtener datos del usuario autenticado
   - **Prioridad:** Alta
   - **Workaround actual:** Frontend deduce rol desde email

2. **GET /store/regions**
   - **Descripción:** Listar regiones disponibles
   - **Prioridad:** Media
   - **Workaround actual:** Region ID hardcodeado

3. **POST /store/carts/{cartId}/complete**
   - **Descripción:** Completar checkout y crear orden
   - **Prioridad:** Alta
   - **Estado:** No implementado en frontend aún

4. **GET /store/orders/{id}**
   - **Descripción:** Obtener detalles de orden como cliente
   - **Prioridad:** Media
   - **Estado:** No implementado en frontend aún

---

## 📝 Notas Técnicas

### Proxy en Development
Todas las llamadas en desarrollo usan el proxy Next.js:
- `/backend/auth/*` → `https://marketplace-b2b-backend-dev.onrender.com/auth/*`
- `/backend/store/*` → `https://marketplace-b2b-backend-dev.onrender.com/store/*`
- `/backend/admin/*` → `https://marketplace-b2b-backend-dev.onrender.com/admin/*`

Ver configuración en: `proxy.dev.conf.js`

### Logs de Debug
Todos los API clients tienen logging activado:
- `[API Client] Base URL: ...`
- `[Auth Login API] Calling backend: ...`
- `[Admin Dashboard] Fetching real orders...`

### Modo Mock
El frontend puede funcionar sin backend activando:
```bash
NEXT_PUBLIC_MOCK_AUTH=true
```

---

## 🔗 Referencias

- **API Client:** `src/lib/api/client.ts`
- **Store Client:** `src/lib/api/mercur-store-client.ts`
- **Datos Mock:** `src/lib/api/mock.ts`
- **Proxy Config:** `proxy.dev.conf.js`
- **Datos Iniciales:** [DATOS_INICIALES.md](./DATOS_INICIALES.md)
