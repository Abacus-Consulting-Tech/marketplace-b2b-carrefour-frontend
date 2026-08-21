# Especificación API de Autenticación
## Marketplace B2B Carrefour - Módulo Auth (Medusa MercurJS)

**Versión:** 1.0  
**Fecha:** 2026-08-21  
**Backend:** Medusa + MercurJS Multi-vendor Marketplace  
**Base URL:** `https://marketplace-b2b-backend-dev.onrender.com`  
**Equipo:** Backend Development  
**Contacto:** Frontend Team

---

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura de Autenticación](#arquitectura-de-autenticación)
3. [Endpoints Existentes](#endpoints-existentes)
4. [Endpoints Requeridos](#endpoints-requeridos)
5. [Modelos de Datos](#modelos-de-datos)
6. [Códigos de Error](#códigos-de-error)
7. [Headers y Seguridad](#headers-y-seguridad)
8. [Flujos de Usuario](#flujos-de-usuario)

---

## 🎯 Resumen Ejecutivo

Este documento especifica **todos los endpoints de autenticación** necesarios para el funcionamiento completo del frontend del Marketplace B2B Carrefour.

### Estado Actual
- ✅ **Login funciona**: POST `/auth/user/emailpass` y `/auth/member/emailpass`
- ✅ **JWT tokens se generan** correctamente
- ❌ **Protección de endpoints**: `/admin/orders` devuelve 401 Unauthorized
- ⏳ **Endpoints faltantes**: Refresh token, forgot password, reset password

### Prioridades
1. **CRÍTICO**: Arreglar validación de JWT en endpoints `/admin/*`
2. **ALTA**: Implementar refresh token
3. **MEDIA**: Completar flujo de recuperación de contraseña
4. **BAJA**: Endpoints de gestión de usuarios

---

## 🏗️ Arquitectura de Autenticación

### Tecnologías Backend

- **Framework:** Medusa v2 (Node.js/Express)
- **Multi-vendor:** MercurJS Marketplace Plugin
- **Autenticación:** Medusa Auth Module (JWT + Session)
- **Base de datos:** PostgreSQL
- **Cache/Session:** Redis (opcional)

### Endpoints Medusa Relevantes

```
/auth/*           → Autenticación de usuarios
/admin/*          → Admin API (requiere JWT Bearer token)
/vendor/*         → Vendor/Supplier API (requiere JWT Bearer token)
/store/*          → Store API pública (requiere x-publishable-api-key)
```

### Flujo de Autenticación

```
┌─────────────┐         ┌──────────────┐         ┌──────────────────┐
│   Frontend  │         │  Next.js API │         │   Medusa Backend │
│   (React)   │         │    Proxy     │         │   + MercurJS     │
└─────────────┘         └──────────────┘         └──────────────────┘
       │                        │                        │
       │  1. Login Request      │                        │
       ├───────────────────────>│                        │
       │                        │  2. Forward Request    │
       │                        ├───────────────────────>│
       │                        │                        │
       │                        │  3. JWT Token          │
       │                        │<───────────────────────┤
       │  4. Token + User       │                        │
       │<───────────────────────┤                        │
       │                        │                        │
       │  5. API Call + Token   │                        │
       ├───────────────────────>│                        │
       │                        │  6. Bearer Token       │
       │                        ├───────────────────────>│
       │                        │                        │
       │                        │  7. Validate + Data    │
       │                        │<───────────────────────┤
       │  8. Response           │                        │
       │<───────────────────────┤                        │
```

### Roles de Usuario

| Role | Login Endpoint | Dashboard | Permisos |
|------|---------------|-----------|----------|
| `admin` | `/auth/user/emailpass` | `/admin/dashboard` | Gestión completa, tarificación, aprobaciones |
| `franchisee` | `/auth/user/emailpass` | `/marketplace/dashboard` | Compra de productos, gestión de pedidos |
| `supplier` | `/auth/member/emailpass` | `/supplier/dashboard` | Propuesta de productos, gestión de ofertas |

---

## ✅ Endpoints Existentes

### 1. Login Admin/Franchisee

**Status:** ✅ FUNCIONANDO

```http
POST /auth/user/emailpass
Content-Type: application/json

{
  "email": "admin@carrefour.dev",
  "password": "supersecret"
}
```

**Response 200 OK:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_01H...",
    "email": "admin@carrefour.dev",
    "role": "admin"
  }
}
```

**Errores:**
- `401` - Credenciales inválidas
- `400` - Email o password faltante
- `429` - Demasiados intentos de login

---

### 2. Login Supplier/Vendor

**Status:** ✅ FUNCIONANDO

```http
POST /auth/member/emailpass
Content-Type: application/json

{
  "email": "seller@mercur.dev",
  "password": "DevSeller123!"
}
```

**Response 200 OK:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "member_01H...",
    "email": "seller@mercur.dev",
    "role": "supplier",
    "seller_id": "sel_01M0A89ET1F5NBDER95X09ZPES"
  }
}
```

---

### 3. Get Session

**Status:** ✅ FUNCIONANDO (pero no usado actualmente)

```http
GET /auth/session
Cookie: connect.sid=...
```

**Response 200 OK:**
```json
{
  "user": {
    "id": "user_01H...",
    "email": "admin@carrefour.dev",
    "role": "admin"
  }
}
```

**Response 401 Unauthorized:**
```json
{
  "message": "Unauthorized"
}
```

---

### 4. Logout

**Status:** ✅ FUNCIONANDO

```http
DELETE /auth/session
Cookie: connect.sid=...
```

**Response 200 OK:**
```json
{
  "message": "Logged out successfully"
}
```

---

### 5. Register New User

**Status:** ⚠️ IMPLEMENTADO (no probado desde frontend)

```http
POST /auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "Password123!",
  "name": "Juan Pérez",
  "phone": "+34 600 000 000",
  "role": "franchisee"
}
```

**Response 201 Created:**
```json
{
  "user": {
    "id": "user_01H...",
    "email": "newuser@example.com",
    "name": "Juan Pérez",
    "role": "franchisee"
  },
  "message": "User created successfully. Please verify your email."
}
```

**Validaciones:**
- Email único (no puede existir)
- Password mínimo 8 caracteres
- Role debe ser: `admin`, `franchisee`, o `supplier`
- Phone formato internacional opcional

---

### 6. Forgot Password

**Status:** ⚠️ IMPLEMENTADO (no probado desde frontend)

```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response 200 OK:**
```json
{
  "message": "Password reset email sent"
}
```

**Nota:** Siempre devolver 200 OK aunque el email no exista (seguridad)

---

## ⚠️ Endpoints Requeridos

### 1. Get Current User (ME)

**Status:** ⚠️ IMPLEMENTADO pero retorna 401  
**Prioridad:** CRÍTICA  
**Endpoint Medusa:** `/admin/users/me`

```http
GET /admin/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200 OK:**
```json
{
  "user": {
    "id": "user_01H...",
    "email": "admin@carrefour.dev",
    "first_name": "Admin",
    "last_name": "Carrefour",
    "role": "admin",
    "api_token": "...",
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-08-20T15:45:00Z",
    "deleted_at": null,
    "metadata": {}
  }
}
```

**PROBLEMA ACTUAL:** Este endpoint existe en Medusa pero está devolviendo 401 cuando se llama con Bearer token.

**Solución requerida:**
- ✅ El endpoint debe aceptar `Authorization: Bearer {token}` en los headers
- ✅ Debe validar el JWT correctamente
- ✅ Debe devolver el usuario completo con su rol y metadatos
- ✅ Debe devolver 401 con mensaje claro si el token es inválido o expirado

**Alternativa para Vendors:**
```http
GET /vendor/sellers/me
Authorization: Bearer {token}
```

---

### 2. Refresh Token

**Status:** ❌ NO IMPLEMENTADO en Medusa por defecto  
**Prioridad:** ALTA  
**Requiere:** Custom endpoint o usar session cookies

**Opción A: Custom Endpoint (Recomendado para JWT)**

```http
POST /auth/refresh
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200 OK:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

**Opción B: Re-login con Session Cookie**

```http
GET /auth/session
Cookie: connect.sid=...
```

Si la sesión es válida, devuelve un nuevo JWT.

**Lógica Requerida:**
- Si el token actual es válido pero está cerca de expirar (< 5 minutos), devolver nuevo token
- Si el token expiró hace menos de 7 días, permitir refresh
- Si el token expiró hace más de 7 días, rechazar (401)

**Nota:** Medusa por defecto usa session cookies. Para soporte completo de JWT refresh, se requiere implementar un custom endpoint.

---

### 3. Reset Password

**Status:** ⚠️ IMPLEMENTADO (necesita verificación)  
**Prioridad:** MEDIA  
**Endpoint Medusa:** `/auth/user/password-token` o custom

```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "email": "user@example.com",
  "password": "NewPassword123!"
}
```

**Response 200 OK:**
```json
{
  "message": "Password updated successfully"
}
```

**Response 400 Bad Request:**
```json
{
  "message": "Invalid or expired reset token"
}
```

**Validaciones:**
- Token de reset válido y no expirado (< 1 hora)
- Password nuevo cumple requisitos (min 8 caracteres)
- Password nuevo diferente del anterior

**Nota:** Medusa tiene soporte para password reset. Verificar que el flujo completo (forgot-password + reset-password) esté configurado correctamente con el email service.

---

### 4. Change Password (Authenticated)

**Status:** ❌ NO IMPLEMENTADO (requiere custom endpoint)  
**Prioridad:** BAJA  
**Alternativa Medusa:** Usar `/admin/users/{id}` para actualizar password

```http
PATCH /auth/password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "current_password": "OldPassword123!",
  "new_password": "NewPassword123!"
}
```

**O usando Medusa Admin API:**

```http
POST /admin/users/{user_id}/password-token
Authorization: Bearer {token}
Content-Type: application/json

{
  "password": "NewPassword123!"
}
```

**Response 200 OK:**
```json
{
  "message": "Password changed successfully"
}
```

**Response 401 Unauthorized:**
```json
{
  "message": "Current password is incorrect"
}
```

---

## 🔐 Admin Endpoints (Protegidos)

### PROBLEMA CRÍTICO ⚠️

**Endpoint:** `GET /admin/orders` (Medusa Admin API)  
**Status:** ❌ DEVUELVE 401 UNAUTHORIZED  
**Prioridad:** CRÍTICA  
**Módulo afectado:** Medusa Admin + MercurJS Orders

**Request del Frontend:**
```http
GET /admin/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response Actual:**
```json
{
  "message": "Unauthorized"
}
```

**Response Esperada (Medusa Orders):**
```json
{
  "orders": [
    {
      "id": "order_01H...",
      "display_id": 1001,
      "email": "franchisee@test.com",
      "status": "pending",
      "total": 15000,
      "currency_code": "eur",
      "created_at": "2026-08-20T10:00:00Z",
      "region": {
        "id": "reg_01M...",
        "name": "España",
        "currency_code": "eur"
      },
      "items": [
        {
          "id": "item_01H...",
          "title": "Producto de prueba",
          "quantity": 2,
          "unit_price": 7500,
          "variant": {
            "id": "variant_01H...",
            "product_id": "prod_01H..."
          }
        }
      ],
      "customer": {
        "id": "cus_01H...",
        "email": "franchisee@test.com"
      },
      "seller": {
        "id": "sel_01M...",
        "name": "Proveedor Test"
      }
    }
  ],
  "count": 1,
  "limit": 20,
  "offset": 0
}
```

### Diagnóstico del Problema (Medusa Auth)

**Posibles Causas (Medusa Auth Module):**

1. **Middleware de autenticación de Medusa no valida Bearer token correctamente**
   ```javascript
   // ❌ Incorrecto - Medusa solo valida session cookies por defecto
   // middlewares/authenticate.ts
   if (!req.session || !req.session.user) {
     return res.status(401).json({ message: 'Unauthorized' });
   }
   
   // ✅ Correcto - Medusa debe validar Bearer token también
   // src/api/middlewares/authenticate-admin.ts
   import { authenticate } from "@medusajs/medusa"
   
   export default authenticate({
     allowCookie: true,  // Permitir cookies de sesión
     allowBearer: true   // ⚠️ DEBE ESTAR HABILITADO para JWT
   })
   
   // O implementar custom middleware:
   const authHeader = req.headers.authorization;
   if (authHeader && authHeader.startsWith('Bearer ')) {
     const token = authHeader.substring(7);
     // Validar JWT token con jwt.verify()
   } else if (req.session && req.session.user) {
     // Validar sesión de Medusa
   } else {
     return res.status(401).json({ message: 'Unauthorized' });
   }
   ```

2. **Token JWT no incluye los claims necesarios de Medusa**
   ```json
   {
     "sub": "user_01H...",
     "email": "admin@carrefour.dev",
     "role": "admin",
     "domain": "admin",
     "userId": "user_01H...",
     "iat": 1692619200,
     "exp": 1692622800
   }
   ```
   
   **Nota:** Medusa requiere el claim `domain` para distinguir entre `admin`, `store`, y `vendor`.

3. **Configuración de rutas `/admin/*` en Medusa**
   ```typescript
   // medusa-config.js
   module.exports = {
     projectConfig: {
       jwt_secret: process.env.JWT_SECRET,
       cookie_secret: process.env.COOKIE_SECRET,
       // ...
     },
     // Verificar que las rutas admin estén protegidas correctamente
   }
   ```

4. **MercurJS Multi-vendor plugin no está configurado para admin access**
   - Verificar que role `admin` tenga acceso a órdenes de todos los sellers
   - Verificar permisos en el plugin de MercurJS

---

### Otros Endpoints Admin Requeridos (Medusa Admin API)

#### 1. Get Admin Orders

**Medusa Endpoint:** `/admin/orders`

```http
GET /admin/orders?limit=20&offset=0&status=pending
Authorization: Bearer {token}
```

**Query Parameters (Medusa):**
- `limit` (opcional): Número de resultados (default: 20, max: 100)
- `offset` (opcional): Paginación (default: 0)
- `status` (opcional): Filtrar por estado (`pending`, `completed`, `cancelled`, `archived`)
- `q` (opcional): Búsqueda por texto
- `created_at[lt]` (opcional): Filtrar por fecha de creación (antes de)
- `created_at[gt]` (opcional): Filtrar por fecha de creación (después de)

**Nota:** Medusa usa parámetros de query específicos. Ver [Medusa Orders API](https://docs.medusajs.com/api/admin#orders).

#### 2. Get Admin Users

**Medusa Endpoint:** `/admin/users`

```http
GET /admin/users?limit=50&offset=0
Authorization: Bearer {token}
```

**Response incluye roles de Medusa:**
- `admin` - Full access
- `member` - Limited access
- `developer` - API access

#### 3. Get Admin Sellers (MercurJS)

**MercurJS Custom Endpoint:** `/admin/sellers`

```http
GET /admin/sellers?limit=50&offset=0
Authorization: Bearer {token}
```

**✅ Ya implementado según Postman collection**

Este es un endpoint personalizado del plugin MercurJS para gestión de sellers/vendors.

#### 4. Get Admin Products Pending (MercurJS)

**MercurJS Custom Endpoint:** `/admin/custom/products/pending`

```http
GET /admin/custom/products/pending?limit=50&offset=0
Authorization: Bearer {token}
```

**✅ Ya implementado según Postman collection**

Endpoint personalizado de MercurJS para productos pendientes de aprobación de tarificación.

---

## 📊 Modelos de Datos (Medusa)

### User Model (Medusa Admin User)

```typescript
interface MedusaUser {
  id: string;                    // user_01H...
  email: string;                 // Único, formato válido
  first_name?: string;           // Opcional
  last_name?: string;            // Opcional
  role: 'admin' | 'member' | 'developer';  // Medusa roles
  api_token?: string;            // Para autenticación API
  created_at: string;            // ISO 8601
  updated_at: string;            // ISO 8601
  deleted_at?: string | null;    // Soft delete de Medusa
  metadata?: Record<string, any>; // Custom fields
}
```

### Member Model (MercurJS Seller Member)

```typescript
interface SellerMember {
  id: string;                    // member_01H...
  email: string;                 // Único
  name?: string;                 // Opcional
  seller_id: string;             // sel_01M... (MercurJS)
  role: 'supplier';              // Custom role
  created_at: string;            // ISO 8601
  updated_at: string;            // ISO 8601
  metadata?: Record<string, any>;
}
```

### JWT Token Payload (Medusa Auth)

```typescript
interface MedusaJWTPayload {
  // Claims estándar de Medusa
  userId: string;                // User ID (user_01H... o member_01H...)
  domain: 'admin' | 'store' | 'vendor';  // Medusa domain
  
  // Claims adicionales
  email: string;                 // User email
  role?: 'admin' | 'member' | 'supplier';  // Custom role
  seller_id?: string;            // Para domain=vendor (MercurJS)
  
  // Claims JWT estándar
  iat: number;                   // Issued at (timestamp)
  exp: number;                   // Expires at (timestamp)
  iss?: string;                  // Issuer (opcional)
}
```

**Configuración Recomendada para Medusa:**
- **Expiración:** 1 hora (3600 segundos) para admin, 24 horas para store
- **Algoritmo:** HS256 (por defecto en Medusa)
- **Secret:** Configurar `JWT_SECRET` en `medusa-config.js`
- **Refresh:** Usar session cookies o implementar custom refresh endpoint

**Ejemplo de token decodificado:**
```json
{
  "userId": "user_01HQZXYZ123",
  "domain": "admin",
  "email": "admin@carrefour.dev",
  "role": "admin",
  "iat": 1692619200,
  "exp": 1692622800
}
```

---

## ❌ Códigos de Error

### HTTP Status Codes

| Code | Nombre | Cuándo Usar |
|------|--------|-------------|
| `200` | OK | Request exitoso |
| `201` | Created | Usuario creado exitosamente |
| `400` | Bad Request | Datos inválidos o faltantes |
| `401` | Unauthorized | Credenciales inválidas o token expirado |
| `403` | Forbidden | Usuario autenticado pero sin permisos |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Email ya existe (registro) |
| `422` | Unprocessable Entity | Validación de datos falló |
| `429` | Too Many Requests | Rate limit excedido |
| `500` | Internal Server Error | Error del servidor |

### Error Response Format

**Formato Estándar:**
```json
{
  "message": "Error message in Spanish",
  "code": "ERROR_CODE",
  "details": {
    "field": "email",
    "constraint": "Email already exists"
  }
}
```

**Ejemplos:**

```json
// 401 - Credenciales inválidas
{
  "message": "Email o contraseña incorrectos",
  "code": "INVALID_CREDENTIALS"
}

// 401 - Token expirado
{
  "message": "Token expirado. Por favor, inicia sesión nuevamente.",
  "code": "TOKEN_EXPIRED"
}

// 401 - Token inválido
{
  "message": "Token inválido",
  "code": "INVALID_TOKEN"
}

// 403 - Sin permisos
{
  "message": "No tienes permisos para acceder a este recurso",
  "code": "FORBIDDEN"
}

// 409 - Email duplicado
{
  "message": "El email ya está registrado",
  "code": "EMAIL_EXISTS",
  "details": {
    "field": "email"
  }
}

// 422 - Validación falló
{
  "message": "Datos inválidos",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Email format is invalid",
    "password": "Password must be at least 8 characters"
  }
}
```

---

## 🔒 Headers y Seguridad

### Headers Requeridos en Requests

#### Autenticación con JWT (Preferido)

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Dónde usar:**
- Todos los endpoints `/admin/*`
- Todos los endpoints `/vendor/*`
- Cualquier endpoint que requiera autenticación

#### Autenticación con Session Cookie (Alternativa)

```http
Cookie: connect.sid=s%3A...
```

**Nota:** El frontend usa principalmente **Bearer tokens**, no cookies.

#### Publishable API Key (Store endpoints)

```http
x-publishable-api-key: pk_15f89d436badff43c2366d014c88536fa0307e92aeaeab294a2ee1d29710e1b9
```

**Dónde usar:**
- Todos los endpoints `/store/*`
- Endpoints públicos que no requieren autenticación

---

### CORS Configuration

**Requerido para desarrollo:**

```javascript
// Backend debe permitir estos headers
{
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-publishable-api-key, x-seller-id",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400"
}
```

**Producción:**
```javascript
{
  "Access-Control-Allow-Origin": "https://marketplace-b2b.carrefour.com",
  // ... resto igual
}
```

---

### Security Best Practices

1. **JWT Storage:**
   - Frontend guarda token en `localStorage` con key `auth-storage`
   - Backend debe validar token en cada request
   - Implementar token blacklist para logout

2. **Password Requirements:**
   - Mínimo 8 caracteres
   - Al menos 1 mayúscula
   - Al menos 1 número
   - Caracteres especiales recomendados

3. **Rate Limiting:**
   - Login: Máximo 5 intentos por IP en 15 minutos
   - Forgot password: Máximo 3 requests por hora
   - API calls: Máximo 100 requests por minuto

4. **Token Expiration:**
   - Access token: 1 hora
   - Refresh token: 7 días
   - Reset password token: 1 hora

---

## 🔄 Flujos de Usuario

### Flujo 1: Login y Acceso al Dashboard

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API Proxy
    participant B as Backend
    
    U->>F: Ingresar email/password
    F->>A: POST /api/auth/login
    A->>B: POST /auth/user/emailpass
    B->>A: 200 OK + JWT token
    A->>F: { token, user: { role } }
    F->>F: Guardar token en localStorage
    F->>F: Redirect según role
    
    alt role = admin
        F->>A: GET /api/admin/orders
        A->>B: GET /admin/orders (Bearer token)
        B->>A: 200 OK + orders
        A->>F: { orders: [...] }
    else role = franchisee
        F->>A: GET /api/marketplace/products
        A->>B: GET /store/products
        B->>A: 200 OK + products
        A->>F: { products: [...] }
    else role = supplier
        F->>A: GET /api/vendor/products
        A->>B: GET /vendor/custom/products
        B->>A: 200 OK + products
        A->>F: { products: [...] }
    end
```

### Flujo 2: Token Expirado - Refresh

```mermaid
sequenceDiagram
    participant F as Frontend
    participant A as API Proxy
    participant B as Backend
    
    F->>A: GET /api/admin/orders (token expirado)
    A->>B: GET /admin/orders (Bearer token)
    B->>A: 401 Unauthorized
    A->>F: 401 Unauthorized
    
    F->>F: Detectar 401
    F->>A: POST /api/auth/refresh (old token)
    A->>B: POST /auth/refresh
    
    alt Token refreshable
        B->>A: 200 OK + new token
        A->>F: { token: "new_token..." }
        F->>F: Actualizar token en localStorage
        F->>A: GET /api/admin/orders (nuevo token)
        A->>B: GET /admin/orders
        B->>A: 200 OK + orders
        A->>F: { orders: [...] }
    else Token no refreshable
        B->>A: 401 Unauthorized
        A->>F: 401 Unauthorized
        F->>F: Redirect a /login
    end
```

### Flujo 3: Forgot Password

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant E as Email Service
    
    U->>F: Click "¿Olvidaste tu contraseña?"
    F->>F: Mostrar formulario de email
    U->>F: Ingresar email
    F->>B: POST /auth/forgot-password
    B->>E: Enviar email con token
    B->>F: 200 OK "Email enviado"
    F->>U: "Revisa tu email"
    
    U->>E: Abrir email
    U->>F: Click en link (con token)
    F->>F: Mostrar formulario nueva contraseña
    U->>F: Ingresar nueva contraseña
    F->>B: POST /auth/reset-password
    
    alt Token válido
        B->>B: Actualizar password
        B->>F: 200 OK
        F->>U: "Contraseña actualizada"
        F->>F: Redirect a /login
    else Token inválido/expirado
        B->>F: 400 Bad Request
        F->>U: "Token inválido. Solicita uno nuevo"
    end
```

---

## 🧪 Testing

### Credenciales de Prueba DEV

```bash
# Admin
Email: admin@carrefour.dev
Password: supersecret
Expected Role: admin

# Franchisee
Email: franchisee@carrefour.dev
Password: supersecret
Expected Role: franchisee

# Supplier
Email: seller@mercur.dev
Password: DevSeller123!
Expected Role: supplier
Seller ID: sel_01M0A89ET1F5NBDER95X09ZPES
```

### Casos de Prueba Críticos

#### Test 1: Login Admin + Access Orders

```bash
# 1. Login
curl -X POST https://marketplace-b2b-backend-dev.onrender.com/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@carrefour.dev",
    "password": "supersecret"
  }'

# Guardar el token de la respuesta
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Acceder a /admin/orders
curl -X GET https://marketplace-b2b-backend-dev.onrender.com/admin/orders \
  -H "Authorization: Bearer $TOKEN"

# ✅ Debe devolver 200 OK con lista de orders
# ❌ Actualmente devuelve 401 Unauthorized
```

#### Test 2: Token Inválido

```bash
curl -X GET https://marketplace-b2b-backend-dev.onrender.com/admin/orders \
  -H "Authorization: Bearer invalid_token_12345"

# ✅ Debe devolver 401 Unauthorized
# Response esperada:
# {
#   "message": "Token inválido",
#   "code": "INVALID_TOKEN"
# }
```

#### Test 3: Token Expirado

```bash
# Usar un token expirado (más de 1 hora)
curl -X GET https://marketplace-b2b-backend-dev.onrender.com/admin/orders \
  -H "Authorization: Bearer $EXPIRED_TOKEN"

# ✅ Debe devolver 401 Unauthorized
# Response esperada:
# {
#   "message": "Token expirado. Por favor, inicia sesión nuevamente.",
#   "code": "TOKEN_EXPIRED"
# }
```

#### Test 4: Sin Token

```bash
curl -X GET https://marketplace-b2b-backend-dev.onrender.com/admin/orders

# ✅ Debe devolver 401 Unauthorized
# Response esperada:
# {
#   "message": "Unauthorized",
#   "code": "NO_TOKEN"
# }
```

---

## 📝 Checklist de Implementación Backend (Medusa + MercurJS)

### Prioridad CRÍTICA ⚠️

- [ ] **Arreglar validación de Bearer token en `/admin/orders` (Medusa Admin API)**
  - [ ] Verificar que middleware `authenticate` esté configurado con `allowBearer: true`
  - [ ] Validar que JWT tokens se generen con el claim `domain: 'admin'`
  - [ ] Verificar `JWT_SECRET` en `medusa-config.js`
  - [ ] Devuelve 200 OK con órdenes cuando token es válido
  - [ ] Devuelve 401 con mensaje claro cuando token inválido

- [ ] **Verificar configuración de Medusa Auth Module**
  - [ ] `projectConfig.jwt_secret` está definido en medusa-config.js
  - [ ] `projectConfig.cookie_secret` está definido
  - [ ] Auth middleware está aplicado a todas las rutas `/admin/*`

- [ ] **Crear datos de prueba en DEV (Medusa DB)**
  - [ ] Al menos 5 órdenes de ejemplo con `display_id` secuencial
  - [ ] Órdenes asignadas a diferentes sellers (MercurJS)
  - [ ] Estados variados (pending, completed, cancelled, archived)
  - [ ] Productos con variants y offers (MercurJS)

### Prioridad ALTA 🔴

- [ ] **Verificar `/admin/users/me` con Bearer token (Medusa)**
  - [ ] Endpoint devuelve usuario actual basado en JWT
  - [ ] Incluye `api_token`, `role`, `metadata`
  - [ ] Devuelve 401 si token inválido

- [ ] **Implementar o verificar refresh token (Custom o Medusa Session)**
  - [ ] Opción A: Custom endpoint `/auth/refresh`
  - [ ] Opción B: Usar session cookies con `/auth/session`
  - [ ] Generar nuevo JWT cuando sea necesario

- [ ] **Verificar todos los endpoints `/admin/*` con Bearer token**
  - [ ] `/admin/orders` ✅
  - [ ] `/admin/users/me`
  - [ ] `/admin/sellers` (MercurJS)
  - [ ] `/admin/custom/products/pending` (MercurJS)
  - [ ] `/admin/custom/products/:id/pricing-approval` (MercurJS)

### Prioridad MEDIA 🟡

- [ ] **Completar flujo de recuperación de contraseña (Medusa)**
  - [ ] Verificar `/auth/forgot-password` envía email
  - [ ] Verificar `/auth/reset-password` funciona con token
  - [ ] Configurar email service en medusa-config.js
  - [ ] Tokens con expiración de 1 hora

- [ ] **Implementar cambio de contraseña**
  - [ ] Custom endpoint `/auth/password` o
  - [ ] Usar `/admin/users/{id}/password-token` de Medusa
  - [ ] Validar contraseña actual

### Prioridad BAJA 🟢

- [ ] **Gestión de usuarios (Medusa Admin API)**
  - [ ] Verificar `/admin/users` funciona
  - [ ] Verificar `/admin/users/:id` devuelve usuario específico
  - [ ] Implementar actualización de usuarios si es necesario

- [ ] **MercurJS Vendor Routes**
  - [ ] Verificar `/vendor/sellers/me` funciona con Bearer token
  - [ ] Verificar `/vendor/custom/products` para proveedores
  - [ ] Verificar autenticación con `/auth/member/emailpass`

- [ ] **Auditoría y logs (Medusa)**
  - [ ] Log de todos los intentos de login (success/failure)
  - [ ] Log de tokens JWT generados
  - [ ] Log de accesos a endpoints protegidos
  - [ ] Integrar con Medusa logging system

---

## 📞 Contacto y Soporte

**Frontend Team:**
- **Lead Developer:** [Tu nombre]
- **Email:** [Tu email]
- **Slack:** [Canal de Slack]

**Documentación Relacionada:**
- [BUG_ADMIN_ORDERS_UNAUTHORIZED.md](./BUG_ADMIN_ORDERS_UNAUTHORIZED.md) - Bug report detallado del problema 401
- [AUTH_INTEGRATION.md](../integration/AUTH_INTEGRATION.md) - Integración de auth en frontend
- [Postman Collection](../../postman/marketplace-b2b-carrefour.postman_collection.json) - Colección completa de endpoints

**Postman Environment Variables:**
```json
{
  "baseUrl": "https://marketplace-b2b-backend-dev.onrender.com",
  "adminEmail": "admin@carrefour.dev",
  "adminPassword": "supersecret",
  "jwtToken": "{{token_from_login}}"
}
```

---

## 📚 Referencias

### Medusa Documentation
- [Medusa Authentication](https://docs.medusajs.com/modules/users/admin/manage-profile)
- [Medusa Admin API](https://docs.medusajs.com/api/admin)
- [Medusa Auth Module](https://docs.medusajs.com/modules/users/backend/module-options)
- [Medusa JWT Configuration](https://docs.medusajs.com/development/backend/configurations)

### MercurJS Multi-vendor
- [MercurJS GitHub](https://github.com/mercurjs/mercur)
- [MercurJS Seller Management](https://github.com/mercurjs/mercur#seller-management)
- [MercurJS API Extensions](https://github.com/mercurjs/mercur#api-routes)

### Security Best Practices
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

### Medusa Configuration Example

```javascript
// medusa-config.js
module.exports = {
  projectConfig: {
    jwt_secret: process.env.JWT_SECRET || "supersecret",
    cookie_secret: process.env.COOKIE_SECRET || "supersecret",
    database_url: process.env.DATABASE_URL,
    redis_url: process.env.REDIS_URL,
  },
  plugins: [
    {
      resolve: "@mercurjs/mercur",
      options: {
        // MercurJS configuration
        enableSellers: true,
        enableVendorRoutes: true,
      },
    },
    // ... other plugins
  ],
}
```

---

**Última actualización:** 2026-08-21  
**Versión del documento:** 1.0  
**Backend:** Medusa v2 + MercurJS  
**Estado:** EN REVISIÓN - Pendiente implementación backend
