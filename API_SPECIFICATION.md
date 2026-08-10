# Especificación de API - Marketplace B2B Carrefour
## Requisitos Backend para MercuryJS 2.x / Medusa

---

## 📋 Resumen General

Este documento especifica todos los endpoints de API requeridos por la aplicación frontend. El backend debe implementarse usando **MercuryJS 2.x** con el framework **Medusa**.

**URL Base:** `https://api.tu-dominio.com/api`

**Autenticación:** Bearer token (JWT)

---

## 🔐 Endpoints de Autenticación

### 1. Inicio de Sesión (Login)
```http
POST /auth/login
```

**Cuerpo de la Petición:**
```json
{
  "email": "franchisee@test.com",
  "password": "franchisee123"
}
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_123abc",
      "email": "franchisee@test.com",
      "name": "Juan Pérez",
      "role": "franchisee",
      "phone": "+34 600 000 000",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "message": "Login successful"
}
```

**Respuesta de Error (401 No Autorizado):**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

---

### 2. Registro
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "Juan Pérez",
  "email": "franchisee@test.com",
  "password": "franchisee123",
  "role": "franchisee",
  "company": "Carrefour Express Barcelona",
  "phone": "+34 600 000 000"
}
```

**Respuesta (201 Creado):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123abc",
      "email": "franchisee@test.com",
      "name": "Juan Pérez",
      "role": "franchisee",
      "status": "pending"
    }
  },
  "message": "Registro exitoso. Por favor revisa tu email para verificación."
}
```

**Respuesta de Error (400 Petición Incorrecta):**
```json
{
  "success": false,
  "message": "El email ya existe"
}
```

---

### 3. Recuperar Contraseña
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "franchisee@test.com"
}
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Enlace de recuperación enviado a tu email"
}
```

---

## 📦 Endpoints de Productos

### 4. Listar Productos
```http
GET /products
```

**Parámetros de Consulta:**
- `page` (opcional): Número de página (por defecto: 1)
- `limit` (opcional): Elementos por página (por defecto: 20)
- `category` (opcional): Filtrar por ID de categoría
- `search` (opcional): Búsqueda de texto
- `supplierId` (opcional): Filtrar por proveedor

**Ejemplo:**
```
GET /products?page=1&limit=20&category=cat_123&search=aceite
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "prod_123abc",
      "name": "Aceite de Oliva Virgen Extra",
      "description": "Aceite de oliva virgen extra de primera calidad, cosecha 2024",
      "sku": "AOL-001",
      "categoryId": "cat_123",
      "supplierId": "sup_456",
      "price": 12.99,
      "currency": "EUR",
      "stock": 150,
      "images": [
        "https://cdn.example.com/products/aceite-001.jpg"
      ],
      "rating": 4.8,
      "reviewCount": 24,
      "specifications": {
        "volume": "1L",
        "origin": "España"
      },
      "category": "Alimentación",
      "supplier": {
        "id": "sup_456",
        "name": "Aceites del Sur"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

---

### 5. Obtener Producto por ID
```http
GET /products/:id
```

**Ejemplo:**
```
GET /products/prod_123abc
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "prod_123abc",
    "name": "Aceite de Oliva Virgen Extra",
    "description": "Aceite de oliva virgen extra de primera calidad, cosecha 2024",
    "sku": "AOL-001",
    "categoryId": "cat_123",
    "supplierId": "sup_456",
    "price": 12.99,
    "currency": "EUR",
    "stock": 150,
    "images": [
      "https://cdn.example.com/products/aceite-001.jpg",
      "https://cdn.example.com/products/aceite-002.jpg"
    ],
    "rating": 4.8,
    "reviewCount": 24,
    "specifications": {
      "volume": "1L",
      "origin": "España",
      "certification": "DOP"
    },
    "category": "Alimentación",
    "supplier": {
      "id": "sup_456",
      "name": "Aceites del Sur",
      "rating": 4.9
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Respuesta de Error (404 No Encontrado):**
```json
{
  "success": false,
  "message": "Producto no encontrado"
}
```

---

## 🛒 Endpoints de Pedidos

### 6. Crear Pedido
```http
POST /orders
```

**Cabeceras:**
```
Authorization: Bearer <token>
```

**Cuerpo de la Petición:**
```json
{
  "items": [
    {
      "productId": "prod_123abc",
      "quantity": 10,
      "price": 12.99
    },
    {
      "productId": "prod_456def",
      "quantity": 5,
      "price": 89.99
    }
  ],
  "shippingAddress": {
    "street": "Calle Mayor 123",
    "city": "Barcelona",
    "postalCode": "08001",
    "country": "España",
    "phone": "+34 600 000 000"
  },
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardLast4": "4242",
    "cardBrand": "visa"
  },
  "notes": "Entrega por la mañana"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "ord_789xyz",
    "userId": "usr_123abc",
    "items": [
      {
        "id": "item_001",
        "productId": "prod_123abc",
        "productName": "Aceite de Oliva Virgen Extra",
        "quantity": 10,
        "price": 12.99,
        "total": 129.90
      }
    ],
    "subtotal": 579.85,
    "tax": 121.77,
    "shipping": 15.00,
    "total": 716.62,
    "currency": "EUR",
    "status": "pending",
    "paymentStatus": "paid",
    "shippingAddress": {
      "street": "Calle Mayor 123",
      "city": "Barcelona",
      "postalCode": "08001",
      "country": "España",
      "phone": "+34 600 000 000"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Pedido creado exitosamente"
}
```

---

### 7. Listar Pedidos
```http
GET /orders
```

**Cabeceras:**
```
Authorization: Bearer <token>
```

**Parámetros de Consulta:**
- `page` (opcional): Número de página
- `limit` (opcional): Elementos por página
- `status` (opcional): Filtrar por estado (pending, processing, shipped, delivered, cancelled)
- `userId` (opcional): Filtrar por usuario (solo admin)
- `supplierId` (opcional): Filtrar pedidos que contengan productos del proveedor (rol supplier)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "ord_789xyz",
      "userId": "usr_123abc",
      "userName": "Juan Pérez",
      "items": [
        {
          "id": "item_001",
          "productId": "prod_123abc",
          "productName": "Aceite de Oliva Virgen Extra",
          "quantity": 10,
          "price": 12.99,
          "total": 129.90,
          "supplierId": "sup_456"
        }
      ],
      "subtotal": 579.85,
      "tax": 121.77,
      "shipping": 15.00,
      "total": 716.62,
      "currency": "EUR",
      "status": "processing",
      "paymentStatus": "paid",
      "shippingAddress": {
        "street": "Calle Mayor 123",
        "city": "Barcelona",
        "postalCode": "08001"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T14:20:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

---

### 8. Obtener Pedido por ID
```http
GET /orders/:id
```

**Cabeceras:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "ord_789xyz",
    "orderNumber": "ORD-2024-00123",
    "userId": "usr_123abc",
    "userName": "Juan Pérez",
    "userEmail": "franchisee@test.com",
    "items": [
      {
        "id": "item_001",
        "productId": "prod_123abc",
        "productName": "Aceite de Oliva Virgen Extra",
        "productImage": "https://cdn.example.com/products/aceite-001.jpg",
        "sku": "AOL-001",
        "quantity": 10,
        "price": 12.99,
        "total": 129.90,
        "supplierId": "sup_456",
        "supplierName": "Aceites del Sur"
      }
    ],
    "subtotal": 579.85,
    "tax": 121.77,
    "shipping": 15.00,
    "total": 716.62,
    "currency": "EUR",
    "status": "processing",
    "paymentStatus": "paid",
    "paymentMethod": "credit_card",
    "shippingAddress": {
      "street": "Calle Mayor 123",
      "city": "Barcelona",
      "postalCode": "08001",
      "country": "España",
      "phone": "+34 600 000 000"
    },
    "trackingNumber": null,
    "notes": "Entrega por la mañana",
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "note": "Pedido creado"
      },
      {
        "status": "processing",
        "timestamp": "2024-01-15T14:20:00.000Z",
        "note": "En preparación"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:20:00.000Z"
  }
}
```

---

### 9. Actualizar Estado del Pedido
```http
PATCH /orders/:id/status
```

**Cabeceras:**
```
Authorization: Bearer <token>
```

**Cuerpo de la Petición:**
```json
{
  "status": "shipped",
  "trackingNumber": "1Z999AA10123456784",
  "note": "Enviado con mensajería express"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "ord_789xyz",
    "status": "shipped",
    "trackingNumber": "1Z999AA10123456784",
    "updatedAt": "2024-01-16T09:15:00.000Z"
  },
  "message": "Estado del pedido actualizado"
}
```

---

### 10. Cancelar Pedido
```http
POST /orders/:id/cancel
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Cliente cambió de opinión"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "ord_789xyz",
    "status": "cancelled"
  },
  "message": "Pedido cancelado exitosamente"
}
```

**Respuesta de Error (400 Petición Incorrecta):**
```json
{
  "success": false,
  "message": "No se puede cancelar un pedido que ya ha sido enviado"
}
```

---

## 👥 Endpoints de Usuario/Perfil

### 11. Obtener Perfil del Usuario Actual
```http
GET /users/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "usr_123abc",
    "email": "franchisee@test.com",
    "name": "Juan Pérez",
    "role": "franchisee",
    "phone": "+34 600 000 000",
    "status": "active",
    "company": "Carrefour Express Barcelona",
    "address": {
      "street": "Calle Mayor 123",
      "city": "Barcelona",
      "postalCode": "08001",
      "country": "España"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 12. Actualizar Perfil de Usuario
```http
PATCH /users/me
```

**Cabeceras:**
```
Authorization: Bearer <token>
```

**Cuerpo de la Petición:**
```json
{
  "name": "Juan Pérez García",
  "phone": "+34 600 111 222",
  "address": {
    "street": "Avenida Diagonal 456",
    "city": "Barcelona",
    "postalCode": "08008",
    "country": "España"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "usr_123abc",
    "email": "franchisee@test.com",
    "name": "Juan Pérez García",
    "phone": "+34 600 111 222",
    "updatedAt": "2024-01-20T15:30:00.000Z"
  },
  "message": "Perfil actualizado exitosamente"
}
```

---

### 13. Cambiar Contraseña
```http
POST /users/me/change-password
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "message": "Contraseña cambiada exitosamente"
}
```

**Respuesta de Error (400 Petición Incorrecta):**
```json
{
  "success": false,
  "message": "La contraseña actual es incorrecta"
}
```

---

## 📊 Endpoints de Dashboard/Estadísticas

### 14. Obtener Estadísticas del Dashboard de Franquiciado
```http
GET /dashboard/franchisee
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalOrders": 45,
    "pendingOrders": 3,
    "totalSpent": 12456.78,
    "averageOrderValue": 276.82,
    "recentOrders": [
      {
        "id": "ord_789xyz",
        "orderNumber": "ORD-2024-00123",
        "total": 716.62,
        "status": "processing",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "monthlyStats": {
      "currentMonth": {
        "orders": 12,
        "spent": 3245.67
      },
      "previousMonth": {
        "orders": 10,
        "spent": 2890.45
      }
    }
  }
}
```

---

### 15. Obtener Estadísticas del Dashboard de Proveedor
```http
GET /dashboard/supplier
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 45678.90,
    "totalOrders": 234,
    "pendingOrders": 12,
    "activeProducts": 45,
    "recentOrders": [
      {
        "id": "ord_789xyz",
        "orderNumber": "ORD-2024-00123",
        "items": [
          {
            "productId": "prod_123abc",
            "productName": "Aceite de Oliva Virgen Extra",
            "quantity": 10,
            "total": 129.90
          }
        ],
        "supplierRevenue": 129.90,
        "status": "processing",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "monthlyStats": {
      "currentMonth": {
        "revenue": 12345.67,
        "orders": 89
      },
      "previousMonth": {
        "revenue": 11234.56,
        "orders": 82
      }
    }
  }
}
```

---

### 16. Obtener Estadísticas del Dashboard de Administrador
```http
GET /dashboard/admin
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 156789.45,
    "totalOrders": 567,
    "activeSuppliers": 23,
    "activeFranchisees": 45,
    "pendingApprovals": 5,
    "recentActivity": [
      {
        "type": "order",
        "id": "ord_789xyz",
        "orderNumber": "ORD-2024-00123",
        "userName": "Juan Pérez",
        "total": 716.62,
        "status": "processing",
        "createdAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "type": "supplier_registered",
        "id": "sup_999",
        "supplierName": "Aceites Premium S.L.",
        "status": "pending_approval",
        "createdAt": "2024-01-14T16:45:00.000Z"
      }
    ],
    "monthlyStats": {
      "revenue": {
        "current": 45678.90,
        "previous": 42345.67,
        "growth": 7.9
      },
      "orders": {
        "current": 189,
        "previous": 176,
        "growth": 7.4
      }
    }
  }
}
```

---

## 🏢 Endpoints de Proveedores (Solo Admin)

### 17. Listar Proveedores
```http
GET /suppliers
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional)
- `limit` (optional)
- `status` (optional): active, inactive, pending

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "sup_456",
      "name": "Aceites del Sur",
      "businessName": "Aceites del Sur S.L.",
      "email": "contact@aceitesdelsur.com",
      "phone": "+34 900 123 456",
      "cif": "B12345678",
      "status": "active",
      "rating": 4.8,
      "totalProducts": 23,
      "totalRevenue": 45678.90,
      "address": {
        "street": "Polígono Industrial Sur, Nave 12",
        "city": "Sevilla",
        "postalCode": "41010",
        "country": "España"
      },
      "createdAt": "2023-06-15T00:00:00.000Z",
      "updatedAt": "2024-01-10T12:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 23,
      "totalPages": 2
    }
  }
}
```

---

### 18. Obtener Proveedor por ID
```http
GET /suppliers/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "sup_456",
    "name": "Aceites del Sur",
    "businessName": "Aceites del Sur S.L.",
    "email": "contact@aceitesdelsur.com",
    "phone": "+34 900 123 456",
    "cif": "B12345678",
    "status": "active",
    "rating": 4.8,
    "reviewCount": 156,
    "totalProducts": 23,
    "totalRevenue": 45678.90,
    "address": {
      "street": "Polígono Industrial Sur, Nave 12",
      "city": "Sevilla",
      "postalCode": "41010",
      "country": "España"
    },
    "bankAccount": {
      "iban": "ES********************",
      "swift": "CAIXESBB"
    },
    "documents": [
      {
        "type": "cif",
        "url": "https://cdn.example.com/documents/cif-b12345678.pdf",
        "verified": true
      }
    ],
    "products": [
      {
        "id": "prod_123abc",
        "name": "Aceite de Oliva Virgen Extra",
        "sku": "AOL-001",
        "price": 12.99,
        "stock": 150
      }
    ],
    "createdAt": "2023-06-15T00:00:00.000Z",
    "updatedAt": "2024-01-10T12:00:00.000Z"
  }
}
```

---

### 19. Actualizar Estado del Proveedor
```http
PATCH /suppliers/:id/status
```

**Cabeceras:**
```
Authorization: Bearer <token>
```

**Cuerpo de la Petición:**
```json
{
  "status": "active",
  "note": "Documentación verificada correctamente"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "sup_456",
    "status": "active",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  },
  "message": "Estado del proveedor actualizado"
}
```

---

## 🔧 Endpoints Adicionales

### 20. Obtener Categorías
```http
GET /categories
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_123",
      "name": "Alimentación",
      "slug": "alimentacion",
      "description": "Productos alimenticios",
      "productCount": 234
    },
    {
      "id": "cat_456",
      "name": "Bebidas",
      "slug": "bebidas",
      "description": "Bebidas alcohólicas y no alcohólicas",
      "productCount": 156
    }
  ]
}
```

---

## 🔒 Reglas de Autorización

### Permisos por Rol:

**Franquiciado:**
- ✅ Ver productos
- ✅ Crear pedidos
- ✅ Ver sus propios pedidos
- ✅ Actualizar su propio perfil
- ❌ Ver pedidos de otros usuarios
- ❌ Acceder a endpoints de admin

**Proveedor:**
- ✅ Ver productos
- ✅ Ver pedidos que contengan sus productos
- ✅ Actualizar sus propios productos
- ✅ Actualizar su propio perfil
- ❌ Ver todos los pedidos
- ❌ Acceder a endpoints de admin

**Administrador:**
- ✅ Acceso completo a todos los endpoints
- ✅ Gestionar proveedores
- ✅ Ver todos los pedidos
- ✅ Ver todos los usuarios
- ✅ Estadísticas de la plataforma

---

## 📝 Tipos de Datos

### Usuario (User)
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'franchisee' | 'supplier' | 'admin';
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  company?: string;
  address?: Address;
  createdAt: string;
  updatedAt: string;
}
```

### Producto (Product)
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  categoryId: string;
  supplierId: string;
  price: number;
  currency: string;
  stock: number;
  images: string[];
  rating: number;
  reviewCount: number;
  specifications: Record<string, any>;
  category?: string;
  supplier?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

### Order
```typescript
interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: Address;
  trackingNumber?: string;
  notes?: string;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}
```

### Item del Pedido (OrderItem)
```typescript
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
  supplierId: string;
  supplierName: string;
}
```

### Dirección (Address)
```typescript
interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}
```

---

## 🚀 Notas de Implementación para MercuryJS/Medusa

### 1. Autenticación
- Usar tokens JWT para autenticación
- El token debe expirar después de 24 horas
- Implementar mecanismo de refresh token
- Hashear contraseñas con bcrypt (mínimo 10 rondas)

### 2. Validación
- Validar todos los cuerpos de petición con esquema JSON
- Sanitizar inputs para prevenir XSS/SQL injection
- Retornar 400 Bad Request para errores de validación

### 3. Manejo de Errores
- Usar formato consistente de respuesta de error
- Incluir códigos de error para manejo en cliente
- Registrar errores del lado del servidor

### 4. Rate Limiting (Límite de Tasa)
- Implementar rate limiting por endpoint
- Endpoints de auth: 5 peticiones/minuto
- Otros endpoints: 100 peticiones/minuto

### 5. CORS
- Habilitar CORS para el dominio del frontend
- Permitir credenciales
- Whitelist de orígenes específicos en producción

### 6. Base de Datos
- Usar la integración PostgreSQL integrada de Medusa
- Agregar índices en campos consultados frecuentemente (userId, status, createdAt)
- Implementar soft deletes para pedidos y usuarios

### 7. Subida de Archivos (para documentos de proveedores)
- Usar el servicio de archivos de Medusa
- Soportar formatos PDF, JPG, PNG
- Tamaño máximo de archivo: 10MB
- Almacenar en S3 o similar

### 8. Webhooks (Futuro)
- Implementar webhooks para cambios de estado de pedidos
- Notificar a proveedores cuando se realiza un pedido
- Notificar a franquiciados cuando el pedido es enviado

---

## 📊 Orden de Implementación Prioritario

### Fase 1 (MVP - Semana 1-2):
1. ✅ Autenticación (login, registro)
2. ✅ Productos (listar, obtener por ID)
3. ✅ Perfil de usuario (obtener, actualizar)

### Fase 2 (Pedidos - Semana 3):
4. ✅ Pedidos (crear, listar, obtener por ID)
5. ✅ Actualizar estado de pedidos
6. ✅ Cancelación de pedidos

### Fase 3 (Dashboard - Semana 4):
7. ✅ Estadísticas de dashboard (franquiciado, proveedor, admin)
8. ✅ Gestión de proveedores (admin)
9. ✅ Cambio de contraseña

---

## 🧪 Requisitos de Testing

Para cada endpoint, proporcionar:
- Tests unitarios para lógica de negocio
- Tests de integración para rutas de API
- Test fixtures con datos de ejemplo
- Colección Postman/Insomnia

---

**Última Actualización:** Agosto 2026  
**Versión:** 1.0.0  
**Repositorio Frontend:** [marketplace-b2b-carrefour-frontend](https://github.com/Abacus-Consulting-Tech/marketplace-b2b-carrefour-frontend)
