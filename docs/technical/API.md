# API Documentation - Marketplace B2B Carrefour

## Índice

- [Información General](#información-general)
- [Autenticación](#autenticación)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [Franchisees](#franchisees)
  - [Suppliers](#suppliers)
  - [Catalog](#catalog)
  - [Orders](#orders)
  - [Purchases](#purchases)
  - [Issues](#issues)
- [Modelos de Datos](#modelos-de-datos)
- [Códigos de Estado](#códigos-de-estado)
- [Manejo de Errores](#manejo-de-errores)

---

## Información General

### Base URL

```
Development:  http://localhost:3000/api
Staging:      https://staging-api.carrefour-b2b.com/api
Production:   https://api.carrefour-b2b.com/api
```

### Formato de Respuesta

Todas las respuestas de la API siguen este formato:

```json
{
  "success": true,
  "data": { },
  "message": "Success message",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### Versionado

La API utiliza versionado en la URL:

```
/api/v1/...
```

---

## Autenticación

### JWT Bearer Token

La API utiliza JSON Web Tokens (JWT) para autenticación.

**Headers requeridos**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Login

**POST** `/api/v1/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "franchisee",
      "name": "Juan Pérez"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### Refresh Token

**POST** `/api/v1/auth/refresh`

Request:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "refreshToken": "new_refresh_token",
    "expiresIn": 3600
  }
}
```

---

## Endpoints

### Auth

#### Register
**POST** `/api/v1/auth/register`

Request:
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "role": "franchisee",
  "companyName": "Carrefour Express Madrid",
  "taxId": "B12345678",
  "phone": "+34 900 123 456"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "newuser@example.com",
    "status": "pending_approval"
  },
  "message": "Registration successful. Awaiting approval."
}
```

#### Forgot Password
**POST** `/api/v1/auth/forgot-password`

Request:
```json
{
  "email": "user@example.com"
}
```

#### Reset Password
**POST** `/api/v1/auth/reset-password`

Request:
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePass123!"
}
```

#### Logout
**POST** `/api/v1/auth/logout`

Headers:
```http
Authorization: Bearer <token>
```

---

### Franchisees

#### Get Current Franchisee Profile
**GET** `/api/v1/franchisees/me`

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "companyName": "Carrefour Express Madrid",
    "taxId": "B12345678",
    "email": "franchise@example.com",
    "phone": "+34 900 123 456",
    "address": {
      "street": "Calle Principal 123",
      "city": "Madrid",
      "state": "Madrid",
      "zipCode": "28001",
      "country": "España"
    },
    "status": "active",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

#### Update Profile
**PUT** `/api/v1/franchisees/me`

Request:
```json
{
  "phone": "+34 900 999 888",
  "address": {
    "street": "Nueva Calle 456",
    "city": "Madrid",
    "zipCode": "28002"
  }
}
```

#### Get Franchisee Statistics
**GET** `/api/v1/franchisees/me/statistics`

Query Parameters:
- `period`: `week`, `month`, `quarter`, `year`

Response:
```json
{
  "success": true,
  "data": {
    "totalOrders": 45,
    "totalSpent": 15750.50,
    "activeOrders": 3,
    "completedOrders": 42,
    "openIssues": 1,
    "topSuppliers": [
      {
        "id": "uuid",
        "name": "Proveedor A",
        "orderCount": 20,
        "totalSpent": 8500.00
      }
    ]
  }
}
```

---

### Suppliers

#### List Suppliers
**GET** `/api/v1/suppliers`

Query Parameters:
- `page`: número de página (default: 1)
- `limit`: elementos por página (default: 20)
- `search`: búsqueda por nombre
- `category`: filtro por categoría

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Proveedor XYZ",
      "description": "Especialistas en equipamiento de refrigeración",
      "categories": ["Equipamiento", "Refrigeración"],
      "rating": 4.5,
      "reviewCount": 120,
      "logo": "https://cdn.example.com/logos/xyz.png",
      "verified": true
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

#### Get Supplier Details
**GET** `/api/v1/suppliers/:id`

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Proveedor XYZ",
    "description": "Especialistas en equipamiento",
    "email": "contacto@proveedorxyz.com",
    "phone": "+34 900 555 666",
    "address": { },
    "categories": ["Equipamiento", "Refrigeración"],
    "rating": 4.5,
    "reviewCount": 120,
    "certifications": ["ISO 9001", "CE"],
    "policies": {
      "shipping": "Envío en 24-48h",
      "returns": "30 días para devoluciones",
      "warranty": "2 años de garantía"
    }
  }
}
```

---

### Catalog

#### List Products
**GET** `/api/v1/products`

Query Parameters:
- `page`: número de página
- `limit`: elementos por página
- `search`: búsqueda de texto
- `category`: filtro por categoría
- `supplier`: filtro por proveedor
- `minPrice`: precio mínimo
- `maxPrice`: precio máximo
- `inStock`: solo productos en stock
- `sortBy`: `price`, `name`, `popularity`, `rating`
- `sortOrder`: `asc`, `desc`

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Refrigerador Industrial 500L",
      "description": "Refrigerador de alta capacidad ideal para...",
      "sku": "REF-500L-001",
      "category": {
        "id": "cat-uuid",
        "name": "Refrigeración"
      },
      "supplier": {
        "id": "sup-uuid",
        "name": "Proveedor XYZ"
      },
      "price": 1250.00,
      "currency": "EUR",
      "stock": 15,
      "images": [
        "https://cdn.example.com/products/ref-500l-01.jpg",
        "https://cdn.example.com/products/ref-500l-02.jpg"
      ],
      "rating": 4.3,
      "reviewCount": 28,
      "specifications": {
        "capacity": "500L",
        "power": "220V",
        "dimensions": "180x70x65cm"
      },
      "deliveryTime": "3-5 días",
      "isNew": false,
      "onSale": false
    }
  ],
  "meta": {
    "pagination": { },
    "filters": {
      "categories": [ ],
      "priceRange": {
        "min": 10,
        "max": 5000
      }
    }
  }
}
```

#### Get Product Details
**GET** `/api/v1/products/:id`

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Refrigerador Industrial 500L",
    "description": "Descripción completa del producto...",
    "sku": "REF-500L-001",
    "category": { },
    "supplier": { },
    "price": 1250.00,
    "stock": 15,
    "images": [ ],
    "specifications": { },
    "warranty": "2 años",
    "deliveryTime": "3-5 días",
    "relatedProducts": [ ],
    "reviews": [ ]
  }
}
```

#### Get Categories
**GET** `/api/v1/categories`

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Equipamiento",
      "slug": "equipamiento",
      "description": "Equipamiento para establecimientos",
      "icon": "equipment-icon",
      "productCount": 250,
      "subcategories": [
        {
          "id": "sub-uuid",
          "name": "Refrigeración",
          "slug": "refrigeracion",
          "productCount": 45
        }
      ]
    }
  ]
}
```

#### Get Product Reviews
**GET** `/api/v1/products/:id/reviews`

Query Parameters:
- `page`, `limit`
- `rating`: filtro por calificación (1-5)
- `sortBy`: `date`, `rating`, `helpful`

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "user-uuid",
      "userName": "Juan P.",
      "rating": 5,
      "title": "Excelente producto",
      "comment": "Muy buena calidad, entrega rápida...",
      "verified": true,
      "createdAt": "2026-07-15T10:00:00Z",
      "helpful": 12,
      "supplierResponse": {
        "comment": "Gracias por su comentario...",
        "createdAt": "2026-07-16T09:00:00Z"
      }
    }
  ],
  "meta": {
    "pagination": { },
    "ratingDistribution": {
      "5": 80,
      "4": 30,
      "3": 10,
      "2": 5,
      "1": 3
    }
  }
}
```

---

### Orders

#### Create Order
**POST** `/api/v1/orders`

Request:
```json
{
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2,
      "price": 1250.00
    }
  ],
  "shippingAddress": {
    "street": "Calle Principal 123",
    "city": "Madrid",
    "zipCode": "28001"
  },
  "paymentMethod": "card",
  "notes": "Entregar en horario de mañana"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "orderId": "ORD-2026080501",
    "status": "pending",
    "total": 2500.00,
    "createdAt": "2026-08-05T10:30:00Z"
  },
  "message": "Order created successfully"
}
```

#### Get Orders List
**GET** `/api/v1/orders`

Query Parameters:
- `page`, `limit`
- `status`: filtro por estado
- `supplierId`: filtro por proveedor
- `fromDate`, `toDate`: rango de fechas

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderNumber": "ORD-2026080501",
      "status": "confirmed",
      "supplier": {
        "id": "sup-uuid",
        "name": "Proveedor XYZ"
      },
      "itemCount": 3,
      "total": 2500.00,
      "currency": "EUR",
      "createdAt": "2026-08-05T10:30:00Z",
      "estimatedDelivery": "2026-08-10"
    }
  ],
  "meta": {
    "pagination": { }
  }
}
```

#### Get Order Details
**GET** `/api/v1/orders/:id`

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-2026080501",
    "status": "confirmed",
    "supplier": {
      "id": "sup-uuid",
      "name": "Proveedor XYZ",
      "email": "contacto@xyz.com",
      "phone": "+34 900 555 666"
    },
    "items": [
      {
        "id": "item-uuid",
        "product": {
          "id": "prod-uuid",
          "name": "Refrigerador Industrial 500L",
          "sku": "REF-500L-001",
          "image": "url"
        },
        "quantity": 2,
        "unitPrice": 1250.00,
        "subtotal": 2500.00
      }
    ],
    "subtotal": 2500.00,
    "tax": 525.00,
    "shippingCost": 0.00,
    "total": 3025.00,
    "currency": "EUR",
    "shippingAddress": { },
    "paymentMethod": "card",
    "paymentStatus": "paid",
    "notes": "Entregar en horario de mañana",
    "tracking": {
      "carrier": "Transportes ABC",
      "trackingNumber": "TRACK123456",
      "url": "https://track.example.com/TRACK123456"
    },
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2026-08-05T10:30:00Z"
      },
      {
        "status": "confirmed",
        "timestamp": "2026-08-05T11:00:00Z"
      }
    ],
    "documents": [
      {
        "type": "invoice",
        "url": "https://docs.example.com/invoice-001.pdf",
        "createdAt": "2026-08-05T11:00:00Z"
      }
    ],
    "createdAt": "2026-08-05T10:30:00Z",
    "estimatedDelivery": "2026-08-10"
  }
}
```

#### Cancel Order
**POST** `/api/v1/orders/:id/cancel`

Request:
```json
{
  "reason": "Pedido por error"
}
```

---

### Purchases

#### Get Cart
**GET** `/api/v1/cart`

Response:
```json
{
  "success": true,
  "data": {
    "id": "cart-uuid",
    "items": [
      {
        "id": "item-uuid",
        "product": {
          "id": "prod-uuid",
          "name": "Producto A",
          "price": 100.00,
          "image": "url",
          "stock": 50
        },
        "quantity": 2,
        "subtotal": 200.00
      }
    ],
    "itemCount": 2,
    "subtotal": 200.00,
    "tax": 42.00,
    "total": 242.00,
    "currency": "EUR"
  }
}
```

#### Add to Cart
**POST** `/api/v1/cart/items`

Request:
```json
{
  "productId": "prod-uuid",
  "quantity": 2
}
```

#### Update Cart Item
**PUT** `/api/v1/cart/items/:itemId`

Request:
```json
{
  "quantity": 3
}
```

#### Remove from Cart
**DELETE** `/api/v1/cart/items/:itemId`

#### Clear Cart
**DELETE** `/api/v1/cart`

---

### Issues

#### Create Issue
**POST** `/api/v1/issues`

Request:
```json
{
  "type": "product_defective",
  "orderId": "order-uuid",
  "productId": "prod-uuid",
  "title": "Producto defectuoso",
  "description": "El refrigerador no enfría correctamente...",
  "priority": "high",
  "attachments": [
    "https://storage.example.com/images/issue-photo.jpg"
  ]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "issue-uuid",
    "ticketNumber": "TICK-20260805001",
    "status": "new",
    "createdAt": "2026-08-05T14:00:00Z"
  }
}
```

#### Get Issues List
**GET** `/api/v1/issues`

Query Parameters:
- `page`, `limit`
- `status`: `new`, `open`, `in_progress`, `resolved`, `closed`
- `type`: tipo de incidencia
- `priority`: prioridad

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "ticketNumber": "TICK-20260805001",
      "type": "product_defective",
      "title": "Producto defectuoso",
      "status": "open",
      "priority": "high",
      "order": {
        "id": "order-uuid",
        "orderNumber": "ORD-2026080501"
      },
      "supplier": {
        "id": "sup-uuid",
        "name": "Proveedor XYZ"
      },
      "createdAt": "2026-08-05T14:00:00Z",
      "updatedAt": "2026-08-05T15:30:00Z"
    }
  ],
  "meta": {
    "pagination": { }
  }
}
```

#### Get Issue Details
**GET** `/api/v1/issues/:id`

Response:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "ticketNumber": "TICK-20260805001",
    "type": "product_defective",
    "title": "Producto defectuoso",
    "description": "El refrigerador no enfría...",
    "status": "in_progress",
    "priority": "high",
    "order": { },
    "product": { },
    "supplier": { },
    "attachments": [ ],
    "messages": [
      {
        "id": "msg-uuid",
        "sender": {
          "id": "user-uuid",
          "name": "Juan Pérez",
          "role": "franchisee"
        },
        "message": "El refrigerador no funciona...",
        "attachments": [ ],
        "createdAt": "2026-08-05T14:00:00Z"
      }
    ],
    "resolution": null,
    "createdAt": "2026-08-05T14:00:00Z",
    "updatedAt": "2026-08-05T15:30:00Z"
  }
}
```

#### Add Message to Issue
**POST** `/api/v1/issues/:id/messages`

Request:
```json
{
  "message": "¿Cuándo pueden venir a revisar el equipo?",
  "attachments": [ ]
}
```

#### Resolve Issue
**POST** `/api/v1/issues/:id/resolve`

Request:
```json
{
  "resolution": "replacement",
  "notes": "Se enviará producto de reemplazo"
}
```

---

## Modelos de Datos

### User
```typescript
interface User {
  id: string
  email: string
  role: 'franchisee' | 'supplier' | 'admin'
  name: string
  phone: string
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  updatedAt: string
}
```

### Product
```typescript
interface Product {
  id: string
  name: string
  description: string
  sku: string
  categoryId: string
  supplierId: string
  price: number
  currency: string
  stock: number
  images: string[]
  rating: number
  reviewCount: number
  specifications: Record<string, any>
  createdAt: string
  updatedAt: string
}
```

### Order
```typescript
interface Order {
  id: string
  orderNumber: string
  franchiseeId: string
  supplierId: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  shippingCost: number
  total: number
  currency: string
  shippingAddress: Address
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  updatedAt: string
}

type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'in_preparation' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled'
```

### Issue
```typescript
interface Issue {
  id: string
  ticketNumber: string
  type: IssueType
  title: string
  description: string
  status: IssueStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  franchiseeId: string
  orderId?: string
  productId?: string
  supplierId: string
  createdAt: string
  updatedAt: string
}

type IssueStatus = 'new' | 'open' | 'in_progress' | 'resolved' | 'closed'
```

---

## Códigos de Estado

### Success (2xx)
- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado
- `204 No Content`: Operación exitosa sin contenido

### Client Errors (4xx)
- `400 Bad Request`: Solicitud inválida
- `401 Unauthorized`: No autenticado
- `403 Forbidden`: No autorizado
- `404 Not Found`: Recurso no encontrado
- `422 Unprocessable Entity`: Validación fallida

### Server Errors (5xx)
- `500 Internal Server Error`: Error del servidor
- `503 Service Unavailable`: Servicio no disponible

---

## Manejo de Errores

### Formato de Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos proporcionados son inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

### Códigos de Error Comunes

- `AUTHENTICATION_FAILED`: Credenciales inválidas
- `TOKEN_EXPIRED`: Token expirado
- `VALIDATION_ERROR`: Error de validación
- `RESOURCE_NOT_FOUND`: Recurso no encontrado
- `INSUFFICIENT_PERMISSIONS`: Permisos insuficientes
- `DUPLICATE_RESOURCE`: Recurso duplicado
- `BUSINESS_RULE_VIOLATION`: Violación de regla de negocio

---

**Última actualización**: 5 de agosto de 2026
