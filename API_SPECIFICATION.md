# API Specification - Marketplace B2B Carrefour
## Backend Requirements for MercuryJS 2.x / Medusa

---

## 📋 Overview

This document specifies all API endpoints required by the frontend application. The backend should be implemented using **MercuryJS 2.x** with **Medusa** framework.

**Base URL:** `https://api.your-domain.com/api`

**Authentication:** Bearer token (JWT)

---

## 🔐 Authentication Endpoints

### 1. Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "franchisee@test.com",
  "password": "franchisee123"
}
```

**Response (200 OK):**
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

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### 2. Register
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

**Response (201 Created):**
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
  "message": "Registration successful. Please check your email for verification."
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

### 3. Forgot Password
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "franchisee@test.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

---

## 📦 Products Endpoints

### 4. List Products
```http
GET /products
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `category` (optional): Filter by category ID
- `search` (optional): Search query
- `supplierId` (optional): Filter by supplier

**Example:**
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

### 5. Get Product by ID
```http
GET /products/:id
```

**Example:**
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

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## 🛒 Orders Endpoints

### 6. Create Order
```http
POST /orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
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
  "message": "Order created successfully"
}
```

---

### 7. List Orders
```http
GET /orders
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status (pending, processing, shipped, delivered, cancelled)
- `userId` (optional): Filter by user (admin only)
- `supplierId` (optional): Filter orders containing supplier's products (supplier role)

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

### 8. Get Order by ID
```http
GET /orders/:id
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

### 9. Update Order Status
```http
PATCH /orders/:id/status
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
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
  "message": "Order status updated"
}
```

---

### 10. Cancel Order
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
  "message": "Order cancelled successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Cannot cancel order that has been shipped"
}
```

---

## 👥 User/Profile Endpoints

### 11. Get Current User Profile
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

### 12. Update User Profile
```http
PATCH /users/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
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
  "message": "Profile updated successfully"
}
```

---

### 13. Change Password
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

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

## 📊 Dashboard/Statistics Endpoints

### 14. Get Franchisee Dashboard Stats
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

### 15. Get Supplier Dashboard Stats
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

### 16. Get Admin Dashboard Stats
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

## 🏢 Suppliers Endpoints (Admin Only)

### 17. List Suppliers
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

### 18. Get Supplier by ID
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

### 19. Update Supplier Status
```http
PATCH /suppliers/:id/status
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
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
  "message": "Supplier status updated"
}
```

---

## 🔧 Additional Endpoints

### 20. Get Categories
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

## 🔒 Authorization Rules

### Role Permissions:

**Franchisee:**
- ✅ View products
- ✅ Create orders
- ✅ View own orders
- ✅ Update own profile
- ❌ View other users' orders
- ❌ Access admin endpoints

**Supplier:**
- ✅ View products
- ✅ View orders containing their products
- ✅ Update own products
- ✅ Update own profile
- ❌ View all orders
- ❌ Access admin endpoints

**Admin:**
- ✅ Full access to all endpoints
- ✅ Manage suppliers
- ✅ View all orders
- ✅ View all users
- ✅ Platform statistics

---

## 📝 Data Types

### User
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

### Product
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

### OrderItem
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

### Address
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

## 🚀 Implementation Notes for MercuryJS/Medusa

### 1. Authentication
- Use JWT tokens for authentication
- Token should expire after 24 hours
- Implement refresh token mechanism
- Hash passwords with bcrypt (min 10 rounds)

### 2. Validation
- Validate all request bodies with JSON schema
- Sanitize inputs to prevent XSS/SQL injection
- Return 400 Bad Request for validation errors

### 3. Error Handling
- Use consistent error response format
- Include error codes for client handling
- Log errors server-side

### 4. Rate Limiting
- Implement rate limiting per endpoint
- Auth endpoints: 5 requests/minute
- Other endpoints: 100 requests/minute

### 5. CORS
- Enable CORS for frontend domain
- Allow credentials
- Whitelist specific origins in production

### 6. Database
- Use Medusa's built-in PostgreSQL integration
- Add indexes on frequently queried fields (userId, status, createdAt)
- Implement soft deletes for orders and users

### 7. File Upload (for supplier documents)
- Use Medusa's file service
- Support PDF, JPG, PNG formats
- Max file size: 10MB
- Store in S3 or similar

### 8. Webhooks (Future)
- Implement webhooks for order status changes
- Notify suppliers when order is placed
- Notify franchisees when order is shipped

---

## 📊 Priority Implementation Order

### Phase 1 (MVP - Week 1-2):
1. ✅ Authentication (login, register)
2. ✅ Products (list, get by ID)
3. ✅ User profile (get, update)

### Phase 2 (Orders - Week 3):
4. ✅ Orders (create, list, get by ID)
5. ✅ Order status updates
6. ✅ Order cancellation

### Phase 3 (Dashboard - Week 4):
7. ✅ Dashboard statistics (franchisee, supplier, admin)
8. ✅ Suppliers management (admin)
9. ✅ Password change

---

## 🧪 Testing Requirements

For each endpoint, provide:
- Unit tests for business logic
- Integration tests for API routes
- Test fixtures with sample data
- Postman/Insomnia collection

---

**Last Updated:** August 2026  
**Version:** 1.0.0  
**Frontend Repository:** [marketplace-b2b-carrefour-frontend](https://github.com/Abacus-Consulting-Tech/marketplace-b2b-carrefour-frontend)
