# 🐛 Bug: Endpoint /admin/orders Retorna "Unauthorized"

**Fecha:** 2026-08-21  
**Severidad:** 🔴 Alta  
**Módulo:** Admin Dashboard - Gestión de Pedidos  
**Backend:** Medusa Mercur API (DEV)  
**Estado:** 🔍 Pendiente de Resolución

---

## 📋 Resumen del Problema

Al intentar acceder al endpoint `/admin/orders` después de un login exitoso como administrador, el backend retorna:

```json
{
  "message": "Unauthorized"
}
```

**Impacto:**
- ❌ El dashboard de administrador no puede cargar la lista de pedidos
- ❌ Imposible visualizar estadísticas de ventas
- ❌ No se pueden gestionar pedidos desde el frontend

---

## 🔄 Flujo de Reproducción

### Paso 1: Login Exitoso

**Request:**
```http
POST {{baseUrl}}/auth/user/emailpass
Content-Type: application/json

{
  "email": "admin@carrefour.dev",
  "password": "supersecret"
}
```

**Response:** ✅ **200 OK**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYWRtaW5fMDFNMEE3WktaVllQOEo5RjZHMkQzRTRGNUc2IiwiaWF0IjoxNzA5MTIzNDU2LCJleHAiOjE3MDkxMjcwNTZ9.abc123xyz"
}
```

**Resultado:** Login correcto, token JWT recibido ✅

---

### Paso 2: Intentar Acceder a Orders

**Request:**
```http
GET {{baseUrl}}/admin/orders
Authorization: Bearer {{jwtToken}}
Content-Type: application/json
```

**Response:** ❌ **401 Unauthorized**
```json
{
  "message": "Unauthorized"
}
```

**Resultado:** El endpoint rechaza el token válido ❌

---

## 🔍 Análisis del Problema

### Posibles Causas

#### 1. **Token No Incluido Correctamente**

El header `Authorization` puede no estar formateado correctamente.

**Verificación en Postman:**
```
Headers:
✅ Authorization: Bearer eyJhbGci...
❌ Authorization: eyJhbGci...  (sin "Bearer")
❌ Token: eyJhbGci...  (header incorrecto)
```

---

#### 2. **Token Expirado**

El JWT tiene un tiempo de expiración (`exp` claim).

**Solución:**
- Hacer login nuevamente para obtener un token fresco
- Verificar el timestamp de expiración en el token

**Decodificación del Token (jwt.io):**
```json
{
  "user_id": "admin_01M0A7ZNXHA4G5JE31T0X5SVP0",
  "iat": 1709123456,  // Issued at
  "exp": 1709127056   // Expires at (1 hora después)
}
```

---

#### 3. **Endpoint Requiere Permisos Específicos**

Medusa puede requerir que el usuario tenga un rol o permiso específico.

**Verificación:**
```http
GET {{baseUrl}}/admin/users/me
Authorization: Bearer {{jwtToken}}
```

Respuesta esperada:
```json
{
  "user": {
    "id": "admin_01M0A7ZNXHA4G5JE31T0X5SVP0",
    "email": "admin@carrefour.dev",
    "role": "admin",  // ← Debe ser "admin"
    "metadata": {
      "permissions": ["orders:read", "orders:write"]
    }
  }
}
```

---

#### 4. **CORS o Cookies Requeridas**

Medusa puede usar cookies de sesión (`connect.sid`) además del token JWT.

**Verificación:**
- Revisar si el login retorna una cookie `Set-Cookie: connect.sid=...`
- Incluir la cookie en las siguientes requests

**En Postman:**
1. Activar "Automatically follow redirects"
2. Activar "Save cookies" después del login
3. Las cookies se adjuntarán automáticamente

---

#### 5. **Base URL Incorrecta**

El endpoint puede estar en una ruta diferente.

**Rutas a Probar:**
```
✅ https://marketplace-b2b-backend-dev.onrender.com/admin/orders
❓ https://marketplace-b2b-backend-dev.onrender.com/store/orders
❓ https://marketplace-b2b-backend-dev.onrender.com/api/admin/orders
```

---

## 🧪 Pasos de Debugging en Postman

### Test Completo Paso a Paso

**1. Limpiar Estado**
```
Settings → Cookies → Remove all cookies
Settings → Variables → Clear jwtToken
```

**2. Login y Capturar Token**
```http
POST {{baseUrl}}/auth/user/emailpass
Content-Type: application/json

{
  "email": "admin@carrefour.dev",
  "password": "supersecret"
}
```

**Test Script (Tab "Tests"):**
```javascript
// Guardar el token automáticamente
var jsonData = pm.response.json();
if (jsonData.token) {
    pm.environment.set("jwtToken", jsonData.token);
    console.log("Token guardado:", jsonData.token);
} else {
    console.error("Token no encontrado en respuesta");
}
```

**3. Verificar Usuario Actual**
```http
GET {{baseUrl}}/admin/users/me
Authorization: Bearer {{jwtToken}}
```

Verificar que la respuesta incluya `role: "admin"`

**4. Intentar Acceder a Orders**
```http
GET {{baseUrl}}/admin/orders
Authorization: Bearer {{jwtToken}}
```

**5. Si Falla, Probar con Cookies**
```http
GET {{baseUrl}}/admin/orders
Authorization: Bearer {{jwtToken}}
Cookie: connect.sid={{sessionCookie}}
```

---

## 🔧 Soluciones Propuestas

### Solución 1: Verificar Configuración de Headers

**Postman Collection Pre-request Script:**
```javascript
// Asegurar que el token existe
const token = pm.environment.get("jwtToken");
if (!token) {
    console.error("❌ jwtToken no está definido. Ejecuta el login primero.");
    throw new Error("Token JWT no disponible");
}

console.log("✅ Token JWT encontrado:", token.substring(0, 20) + "...");
```

---

### Solución 2: Actualizar Backend - Middleware de Autenticación

**Backend debe verificar:**
```javascript
// middleware/authenticate.js
const jwt = require('jsonwebtoken');

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  
  const token = authHeader.substring(7); // Quitar "Bearer "
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario es admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

// Aplicar al endpoint
app.get('/admin/orders', authenticateAdmin, async (req, res) => {
  // ... lógica del endpoint
});
```

---

### Solución 3: Frontend - Manejo Robusto de Errores

**Actualización de `/api/admin/orders/route.ts`:**

```typescript
export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://marketplace-b2b-backend-dev.onrender.com';
    const endpoint = `${backendUrl}/admin/orders`;
    
    // Obtener token de headers
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      console.error('[Admin Orders API] No authorization header provided');
      return NextResponse.json(
        { message: 'Token de autenticación requerido', orders: [] },
        { status: 401 }
      );
    }
    
    console.log('[Admin Orders API] Calling backend:', endpoint);
    console.log('[Admin Orders API] Auth header:', authHeader.substring(0, 30) + '...');
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    });
    
    console.log('[Admin Orders API] Backend response status:', response.status);
    
    if (response.status === 401) {
      const errorData = await response.json().catch(() => ({ message: 'Unauthorized' }));
      console.error('[Admin Orders API] Unauthorized:', errorData);
      
      return NextResponse.json(
        { 
          message: 'No autorizado: el token puede haber expirado. Por favor, vuelve a iniciar sesión.',
          details: errorData,
          orders: [] 
        },
        { status: 401 }
      );
    }
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
      console.error('[Admin Orders API] Error:', error);
      
      return NextResponse.json(
        { message: error.message || 'Error al obtener pedidos', orders: [] },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[Admin Orders API] Success, orders:', data.orders?.length || 0);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Admin Orders API] Exception:', error);
    return NextResponse.json(
      { message: error.message || 'Error interno del servidor', orders: [] },
      { status: 500 }
    );
  }
}
```

---

## 📦 Datos de Mockup para Testing

### Mockup 1: Orders Vacíos (200 OK)

**Endpoint:** `GET /admin/orders`  
**Respuesta:**

```json
{
  "orders": [],
  "count": 0,
  "offset": 0,
  "limit": 20
}
```

---

### Mockup 2: Orders con Datos (200 OK)

**Endpoint:** `GET /admin/orders`  
**Respuesta:**

```json
{
  "orders": [
    {
      "id": "order_01M0FCW64M4RBP6T6S6W5M3KRN",
      "display_id": 1001,
      "status": "pending",
      "payment_status": "awaiting",
      "fulfillment_status": "not_fulfilled",
      "email": "franchisee@carrefour.es",
      "total": 12450,
      "subtotal": 10500,
      "tax_total": 1950,
      "shipping_total": 0,
      "currency_code": "eur",
      "created_at": "2026-08-20T10:30:00Z",
      "updated_at": "2026-08-20T10:30:00Z",
      "customer": {
        "id": "cus_01M0FCW64M4RBP6T6S6W5M3KRN",
        "email": "franchisee@carrefour.es",
        "first_name": "Juan",
        "last_name": "García"
      },
      "items": [
        {
          "id": "item_01M0FCW64M4RBP6T6S6W5M3KRN",
          "title": "Polo Corporativo Manga Corta",
          "quantity": 50,
          "unit_price": 210,
          "total": 10500,
          "variant": {
            "id": "variant_01M0FCW64M4RBP6T6S6W5M3KRN",
            "title": "Talla M",
            "sku": "POLO-CORP-M"
          }
        }
      ]
    },
    {
      "id": "order_02M0FCW64M4RBP6T6S6W5M3KRN",
      "display_id": 1002,
      "status": "completed",
      "payment_status": "captured",
      "fulfillment_status": "fulfilled",
      "email": "tienda.madrid@carrefour.es",
      "total": 8900,
      "subtotal": 7500,
      "tax_total": 1400,
      "shipping_total": 0,
      "currency_code": "eur",
      "created_at": "2026-08-19T15:45:00Z",
      "updated_at": "2026-08-20T09:00:00Z",
      "customer": {
        "id": "cus_02M0FCW64M4RBP6T6S6W5M3KRN",
        "email": "tienda.madrid@carrefour.es",
        "first_name": "María",
        "last_name": "López"
      },
      "items": [
        {
          "id": "item_02M0FCW64M4RBP6T6S6W5M3KRN",
          "title": "Camiseta Corporativa Cuello Redondo",
          "quantity": 100,
          "unit_price": 75,
          "total": 7500,
          "variant": {
            "id": "variant_02M0FCW64M4RBP6T6S6W5M3KRN",
            "title": "Talla L",
            "sku": "CAMISETA-CORP-L"
          }
        }
      ]
    },
    {
      "id": "order_03M0FCW64M4RBP6T6S6W5M3KRN",
      "display_id": 1003,
      "status": "pending",
      "payment_status": "awaiting",
      "fulfillment_status": "not_fulfilled",
      "email": "tienda.barcelona@carrefour.es",
      "total": 45000,
      "subtotal": 37500,
      "tax_total": 7500,
      "shipping_total": 0,
      "currency_code": "eur",
      "created_at": "2026-08-21T08:15:00Z",
      "updated_at": "2026-08-21T08:15:00Z",
      "customer": {
        "id": "cus_03M0FCW64M4RBP6T6S6W5M3KRN",
        "email": "tienda.barcelona@carrefour.es",
        "first_name": "Carlos",
        "last_name": "Martínez"
      },
      "items": [
        {
          "id": "item_03M0FCW64M4RBP6T6S6W5M3KRN",
          "title": "Laptop Dell Latitude 5420",
          "quantity": 10,
          "unit_price": 3750,
          "total": 37500,
          "variant": {
            "id": "variant_03M0FCW64M4RBP6T6S6W5M3KRN",
            "title": "Default",
            "sku": "LAPTOP-DELL-5420"
          }
        }
      ]
    }
  ],
  "count": 3,
  "offset": 0,
  "limit": 20
}
```

---

### Mockup 3: Error 401 Unauthorized

**Endpoint:** `GET /admin/orders`  
**Headers:** Sin `Authorization` o token inválido  
**Respuesta:**

```json
{
  "message": "Unauthorized",
  "type": "unauthorized",
  "code": "TOKEN_INVALID"
}
```

---

### Mockup 4: Error 403 Forbidden (No es Admin)

**Endpoint:** `GET /admin/orders`  
**Headers:** Token válido pero usuario no es admin  
**Respuesta:**

```json
{
  "message": "Forbidden: Admin access required",
  "type": "forbidden",
  "code": "INSUFFICIENT_PERMISSIONS",
  "required_role": "admin",
  "current_role": "customer"
}
```

---

## 🛠️ Script SQL para Crear Datos de Prueba (Backend)

```sql
-- Crear pedidos de prueba en la base de datos
INSERT INTO orders (
  id, display_id, email, status, payment_status, fulfillment_status,
  total, subtotal, tax_total, shipping_total, currency_code,
  created_at, updated_at
) VALUES
(
  'order_01M0FCW64M4RBP6T6S6W5M3KRN',
  1001,
  'franchisee@carrefour.es',
  'pending',
  'awaiting',
  'not_fulfilled',
  12450,
  10500,
  1950,
  0,
  'eur',
  '2026-08-20 10:30:00',
  '2026-08-20 10:30:00'
),
(
  'order_02M0FCW64M4RBP6T6S6W5M3KRN',
  1002,
  'tienda.madrid@carrefour.es',
  'completed',
  'captured',
  'fulfilled',
  8900,
  7500,
  1400,
  0,
  'eur',
  '2026-08-19 15:45:00',
  '2026-08-20 09:00:00'
),
(
  'order_03M0FCW64M4RBP6T6S6W5M3KRN',
  1003,
  'tienda.barcelona@carrefour.es',
  'pending',
  'awaiting',
  'not_fulfilled',
  45000,
  37500,
  7500,
  0,
  'eur',
  '2026-08-21 08:15:00',
  '2026-08-21 08:15:00'
);

-- Crear line items para los pedidos
INSERT INTO line_items (
  id, order_id, title, quantity, unit_price, total,
  variant_id, created_at, updated_at
) VALUES
(
  'item_01M0FCW64M4RBP6T6S6W5M3KRN',
  'order_01M0FCW64M4RBP6T6S6W5M3KRN',
  'Polo Corporativo Manga Corta',
  50,
  210,
  10500,
  'variant_01M0FCW64M4RBP6T6S6W5M3KRN',
  '2026-08-20 10:30:00',
  '2026-08-20 10:30:00'
),
(
  'item_02M0FCW64M4RBP6T6S6W5M3KRN',
  'order_02M0FCW64M4RBP6T6S6W5M3KRN',
  'Camiseta Corporativa Cuello Redondo',
  100,
  75,
  7500,
  'variant_02M0FCW64M4RBP6T6S6W5M3KRN',
  '2026-08-19 15:45:00',
  '2026-08-20 09:00:00'
),
(
  'item_03M0FCW64M4RBP6T6S6W5M3KRN',
  'order_03M0FCW64M4RBP6T6S6W5M3KRN',
  'Laptop Dell Latitude 5420',
  10,
  3750,
  37500,
  'variant_03M0FCW64M4RBP6T6S6W5M3KRN',
  '2026-08-21 08:15:00',
  '2026-08-21 08:15:00'
);
```

---

## 📝 Checklist de Verificación para Backend

### Configuración de Autenticación

- [ ] El endpoint `/admin/orders` tiene middleware de autenticación
- [ ] El middleware verifica el header `Authorization: Bearer <token>`
- [ ] El token JWT es verificado con la clave secreta correcta
- [ ] El usuario tiene rol `admin` o permisos `orders:read`
- [ ] El token no ha expirado (verificar `exp` claim)
- [ ] Las cookies de sesión se propagan correctamente (si aplica)

### Configuración CORS

- [ ] El backend permite requests desde `http://localhost:3000`
- [ ] El header `Authorization` está en la lista de headers permitidos
- [ ] CORS permite credenciales (`credentials: 'include'`)

### Base de Datos

- [ ] La tabla `orders` existe y tiene datos
- [ ] Hay al menos un pedido en la base de datos para testing
- [ ] Las relaciones con `line_items`, `customers` funcionan correctamente

### Respuesta del Endpoint

- [ ] Retorna JSON válido
- [ ] Estructura: `{ orders: [...], count, offset, limit }`
- [ ] Cada order incluye: `id`, `display_id`, `status`, `email`, `total`, `items`

---

## 🎯 Siguientes Pasos

### Para el Equipo Frontend

1. ✅ Documentar el bug con este MD
2. ⏳ Esperar respuesta del equipo backend
3. ⏳ Probar endpoint cuando esté corregido
4. ⏳ Verificar que el dashboard carga pedidos correctamente

### Para el Equipo Backend

1. ⏳ Revisar middleware de autenticación en `/admin/orders`
2. ⏳ Verificar que el token JWT se está validando correctamente
3. ⏳ Añadir logging detallado del proceso de autenticación
4. ⏳ Crear datos de prueba en la base de datos DEV
5. ⏳ Probar endpoint con Postman usando el token del login
6. ⏳ Confirmar que retorna 200 OK con datos de prueba

---

## 📧 Contacto

**Reportado por:** Frontend Team  
**Fecha:** 2026-08-21  
**Canal:** #backend-support  

**Información para el equipo backend:**
- URL del endpoint: `https://marketplace-b2b-backend-dev.onrender.com/admin/orders`
- Token de prueba generado en: 2026-08-21 (verificar si sigue válido)
- Postman collection: `docs/technical/providers/marketplace-b2b-carrefour.postman_collection 2.json`

---

## 📚 Referencias

- [Postman Collection](../providers/marketplace-b2b-carrefour.postman_collection%202.json)
- [Documentación de Auth API](./AUTH_API.md)
- [Guía de Integración Auth](./AUTH_INTEGRATION.md)
- [Resultados de Tests](../../testing/AUTH_REAL_API_TEST_RESULTS.md)
