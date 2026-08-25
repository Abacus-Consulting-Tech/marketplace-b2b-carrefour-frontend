# Franchisee Management - Backend Implementation Guide

**Módulo**: Gestión de Franquiciados (Admin CRUD)  
**Estado Frontend**: ✅ Completado (25/08/2026)  
**Prioridad Backend**: Alta - Módulo core del sistema

---

## 📋 Resumen Ejecutivo

Sistema administrativo que permite gestionar franquiciados de Carrefour:
- CRUD completo de franquiciados
- Activación/desactivación de cuentas
- Estadísticas de compra y comportamiento
- Integración con sistema de pedidos
- Gestión de usuarios asociados

**Usuarios**: Solo administradores  
**Integración**: Auth, Orders, Stores

---

## 🗄️ Modelo de Datos

### Franchisee
```typescript
{
  id: string;
  first_name: string;
  last_name: string;
  email: string; // único
  phone: string;
  company_name: string;
  tax_id: string; // CIF - único
  status: 'active' | 'inactive';
  address: {
    street: string;
    city: string;
    postal_code: string;
    country: string; // ISO code
    province?: string;
  };
  user_id: string; // FK a tabla users
  metadata: {
    credit_limit?: number;
    special_discount?: number; // porcentaje
    allowed_categories?: string[]; // futuro
    notes?: string; // notas internas admin
  };
  created_at: Date;
  updated_at: Date;
  status_updated_at?: Date;
  deleted_at?: Date; // soft delete
}
```

### FranchiseeStore (relación N:N)
```typescript
{
  id: string;
  franchisee_id: string;
  store_id: string;
  is_primary: boolean;
  created_at: Date;
}
```

---

## 🔌 Endpoints API

### 1. GET /admin/franchisees
**Descripción**: Listar todos los franquiciados

**Headers**:
```
Authorization: Bearer {admin_token}
```

**Query Parameters**:
```
?status=active&search=carrefour&page=1&limit=20&sort=created_at:desc
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `status` | string | `active`, `inactive`, `all` |
| `search` | string | Buscar en nombre, email, empresa, tax_id |
| `page` | number | Número de página (default: 1) |
| `limit` | number | Items por página (default: 20, max: 100) |
| `sort` | string | Campo:dirección (`created_at:desc`) |

**Response 200**:
```json
{
  "franchisees": [
    {
      "id": "fran_01HMYB7Z8WC9K2N5J4X6P7Q8R9",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan.perez@carrefour-madrid.com",
      "phone": "+34 600 123 456",
      "company_name": "Carrefour Express Madrid Centro",
      "tax_id": "B12345678",
      "status": "active",
      "address": {
        "street": "Calle Mayor 1",
        "city": "Madrid",
        "postal_code": "28001",
        "country": "ES",
        "province": "Madrid"
      },
      "user_id": "user_xxx",
      "created_at": "2026-01-15T10:00:00Z",
      "updated_at": "2026-08-25T15:30:00Z",
      "stats": {
        "total_orders": 45,
        "total_spent_cents": 1250050, // en centavos
        "last_order_date": "2026-08-20T14:30:00Z"
      }
    }
  ],
  "count": 120,
  "limit": 20,
  "offset": 0,
  "total": 120
}
```

---

### 2. GET /admin/franchisees/:id
**Descripción**: Obtener detalle completo de un franquiciado

**Response 200**:
```json
{
  "franchisee": {
    "id": "fran_xxx",
    "first_name": "Juan",
    "last_name": "Pérez",
    ...todos los campos,
    "user": {
      "id": "user_xxx",
      "email": "juan.perez@carrefour-madrid.com",
      "role": "franchisee",
      "is_active": true,
      "last_login": "2026-08-25T09:15:00Z"
    },
    "stores": [
      {
        "id": "store_xxx",
        "name": "Madrid Centro",
        "address": {
          "street": "Calle Mayor 1",
          "city": "Madrid",
          "postal_code": "28001"
        },
        "is_primary": true
      }
    ],
    "recent_orders": [
      {
        "id": "order_xxx",
        "display_id": "CF-10045",
        "total_cents": 168795,
        "status": "shipped",
        "created_at": "2026-08-20T14:30:00Z"
      }
    ],
    "favorite_products": [
      {
        "product_id": "prod_xxx",
        "title": "Polo Corporativo",
        "times_ordered": 12,
        "total_spent_cents": 220000
      }
    ]
  }
}
```

---

### 3. POST /admin/franchisees
**Descripción**: Crear nuevo franquiciado

**Headers**:
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Body**:
```json
{
  "first_name": "María",
  "last_name": "González",
  "email": "maria.gonzalez@carrefour-bcn.com",
  "phone": "+34 600 987 654",
  "company_name": "Carrefour Express Barcelona Sur",
  "tax_id": "B98765432",
  "address": {
    "street": "Paseo de Gracia 100",
    "city": "Barcelona",
    "postal_code": "08008",
    "country": "ES",
    "province": "Barcelona"
  },
  "user": {
    "email": "maria.gonzalez@carrefour-bcn.com",
    "password": "TempPass123!",
    "send_welcome_email": true
  },
  "status": "active",
  "metadata": {
    "credit_limit": 10000,
    "notes": "Nueva apertura - priorizar atención"
  }
}
```

**Response 201**:
```json
{
  "franchisee": {
    "id": "fran_new",
    ...datos del franquiciado creado
  },
  "user": {
    "id": "user_new",
    "email": "maria.gonzalez@carrefour-bcn.com",
    "role": "franchisee"
  },
  "welcome_email_sent": true
}
```

**Validaciones**:
- ✅ Email único
- ✅ Tax ID único
- ✅ Formato tax ID español: `[A-Z]\d{8}`
- ✅ Teléfono formato español: `+34 \d{3} \d{3} \d{3}`
- ✅ first_name, last_name, company_name requeridos
- ✅ Password mínimo 8 caracteres (al menos 1 mayúscula, 1 número)

**Errores**:
```json
// 400 Bad Request
{
  "error": "Email already exists",
  "code": "DUPLICATE_EMAIL",
  "field": "email"
}

// 422 Unprocessable Entity
{
  "errors": [
    {
      "field": "tax_id",
      "message": "Invalid Spanish tax ID format"
    },
    {
      "field": "user.password",
      "message": "Password must contain at least 1 uppercase letter and 1 number"
    }
  ]
}
```

---

### 4. PATCH /admin/franchisees/:id
**Descripción**: Actualizar datos del franquiciado

**Body**: Campos parciales a actualizar
```json
{
  "phone": "+34 600 111 222",
  "company_name": "Carrefour Express Madrid Norte",
  "address": {
    "street": "Calle Nueva 50"
  },
  "metadata": {
    "credit_limit": 15000,
    "notes": "Ampliado límite de crédito"
  }
}
```

**Response 200**: Franquiciado actualizado

**Restricciones**:
- No se puede cambiar `email` (requiere endpoint separado)
- No se puede cambiar `tax_id` (inmutable)
- No se puede cambiar `user_id` (inmutable)

---

### 5. PATCH /admin/franchisees/:id/status
**Descripción**: Activar o desactivar franquiciado

**Body**:
```json
{
  "status": "inactive",
  "reason": "Suspensión temporal por incumplimiento de pagos"
}
```

**Response 200**:
```json
{
  "franchisee": {
    ...
    "status": "inactive",
    "status_updated_at": "2026-08-25T15:30:00Z",
    "metadata": {
      ...
      "status_change_reason": "Suspensión temporal por incumplimiento de pagos"
    }
  },
  "user_disabled": true
}
```

**Side Effects**:
- Usuario asociado se desactiva/activa automáticamente
- Si `status = 'inactive'`, franquiciado no puede hacer pedidos
- Pedidos en curso no se cancelan automáticamente

---

### 6. GET /admin/franchisees/:id/stats
**Descripción**: Obtener estadísticas detalladas del franquiciado

**Query Parameters**:
```
?from=2026-07-01&to=2026-08-25
```

**Response 200**:
```json
{
  "stats": {
    "period": {
      "from": "2026-07-01T00:00:00Z",
      "to": "2026-08-25T23:59:59Z"
    },
    "orders": {
      "total_count": 45,
      "total_spent_cents": 1250050,
      "average_order_value_cents": 27779,
      "order_frequency_days": 7,
      "last_order_date": "2026-08-20T14:30:00Z"
    },
    "favorite_products": [
      {
        "product_id": "prod_001",
        "title": "Polo Corporativo Carrefour",
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
