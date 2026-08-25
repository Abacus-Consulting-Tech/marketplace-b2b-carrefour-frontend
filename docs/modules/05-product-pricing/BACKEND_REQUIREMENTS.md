# Backend Requirements - Medusa v2 + MercurJS

**Documento para:** Equipo Backend  
**Fecha:** 21 Agosto 2026  
**Estado:** Frontend implementado en modo mock, pendiente implementación backend  
**Prioridad:** Alta - Fases 6-9 completadas en frontend

---

## 📋 Resumen Ejecutivo

El frontend del Marketplace B2B Carrefour ha completado la implementación de 4 fases críticas del módulo de **Tarificación y Aprobación de Productos**:

- **Fase 6:** Gestión de Markup Global por Proveedor (Admin)
- **Fase 7:** Cola de Aprobación de Productos (Admin)
- **Fase 8:** Dashboard de Productos del Proveedor (Vendor)
- **Fase 9:** Carga Masiva CSV/Excel (Vendor)

Actualmente **todas las funcionalidades operan en modo mock**. Este documento especifica los **20 endpoints** y la **estructura de datos** que el backend debe implementar en Medusa v2 + MercurJS.

---

## 🎯 Prioridades de Implementación

### P0 - Crítico (Bloqueante)
1. **Autenticación Admin** - Fix 401 en `/admin/orders` y `/admin/users/me`
2. **Custom endpoints de Pricing** - 9 endpoints custom (tablas + lógica)
3. **Sellers básico** - GET sellers con campos adicionales

### P1 - Alta
4. **Vendor endpoints** - 3 endpoints para suppliers (mis productos, proponer, markup)
5. **Historial de Markup** - Tracking de cambios administrativos

### P2 - Media
6. **Store endpoints** - Productos públicos, regiones, cart
7. **Validaciones y permisos** - Rate limiting, CORS, roles

---

## 🗄️ Arquitectura de Datos

### 1. Tabla: `custom_product_proposals`

Nueva tabla custom para el flujo de aprobación de productos.

```sql
CREATE TABLE custom_product_proposals (
  id VARCHAR PRIMARY KEY,
  
  -- Relaciones
  seller_id VARCHAR NOT NULL REFERENCES sellers(id),
  medusa_product_id VARCHAR REFERENCES products(id), -- NULL hasta aprobación
  
  -- Información del producto
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id VARCHAR,
  subcategory VARCHAR(100),
  tags VARCHAR[],
  thumbnail VARCHAR(500),
  images VARCHAR(500)[],
  
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL, -- Precio pack propuesto por proveedor
  units_per_pack INTEGER NOT NULL DEFAULT 1,
  ean VARCHAR(13),
  tax_rate DECIMAL(5,2) DEFAULT 21.00, -- IVA: 21%, 10%, 4%, 0%
  
  -- Estado y aprobación
  status VARCHAR(20) NOT NULL DEFAULT 'pending_approval', 
    -- 'pending_approval' | 'approved' | 'rejected'
  markup_percentage DECIMAL(5,2), -- Markup específico (NULL = usar global del seller)
  rejection_reason TEXT,
  
  -- Variantes (JSON)
  variants JSONB, -- Array de {title, sku, base_price, options{}, inventory_quantity}
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by VARCHAR REFERENCES users(id), -- Admin que aprobó
  rejected_at TIMESTAMP,
  rejected_by VARCHAR REFERENCES users(id), -- Admin que rechazó
  
  -- Índices
  INDEX idx_seller_status (seller_id, status),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at DESC)
);
```

**Campos clave:**
- `base_price`: Precio del **pack completo** (NO precio por unidad)
- `units_per_pack`: Número de unidades en el pack (ej: 6 botellas)
- `markup_percentage`: Si es NULL → usar `sellers.global_markup_percentage`
- `medusa_product_id`: Se crea producto en Medusa **solo tras aprobación**

---

### 2. Tabla: `sellers` (MercurJS - Extender)

Añadir campo a tabla existente de MercurJS:

```sql
ALTER TABLE sellers 
ADD COLUMN global_markup_percentage DECIMAL(5,2) NOT NULL DEFAULT 10.00;
  -- Rango permitido: 0.00 - 500.00

-- Índice para búsquedas
CREATE INDEX idx_sellers_markup ON sellers(global_markup_percentage);
```

**Validación:** 0% ≤ markup ≤ 500%

---

### 3. Tabla: `seller_markup_history`

Tracking de cambios administrativos en markup global.

```sql
CREATE TABLE seller_markup_history (
  id VARCHAR PRIMARY KEY,
  seller_id VARCHAR NOT NULL REFERENCES sellers(id),
  
  -- Cambio
  previous_markup DECIMAL(5,2) NOT NULL,
  new_markup DECIMAL(5,2) NOT NULL,
  reason TEXT,
  
  -- Auditoría
  changed_by VARCHAR NOT NULL REFERENCES users(id), -- Admin
  changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Impacto
  affected_products_count INTEGER DEFAULT 0,
  
  -- Índice
  INDEX idx_seller_history (seller_id, changed_at DESC)
);
```

**Trigger:** Al actualizar `sellers.global_markup_percentage` → insertar en history

---

## 🔌 Endpoints Requeridos

### A. Módulo: Autenticación (Auth)

#### 1. POST `/auth/user/emailpass`
**Descripción:** Login de Admin/Franchisee  
**Estado actual:** ✅ Funciona en modo real  
**Requiere autenticación:** No

**Request:**
```json
{
  "email": "admin@carrefour.com",
  "password": "admin123"
}
```

**Response 200:**
```json
{
  "user": {
    "id": "user_01",
    "email": "admin@carrefour.com",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```

**Cookies:** Establecer session cookie con JWT

---

#### 2. POST `/auth/member/emailpass`
**Descripción:** Login de Supplier/Vendor  
**Estado actual:** ✅ Funciona en modo real  
**Requiere autenticación:** No

**Request:**
```json
{
  "email": "proveedor1@example.com",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "user": {
    "id": "member_01",
    "email": "proveedor1@example.com",
    "role": "supplier",
    "seller_id": "seller_01"
  },
  "token": "jwt_token_here"
}
```

---

#### 3. GET `/auth/session`
**Descripción:** Obtener sesión actual  
**Estado actual:** ⚠️ No testeado  
**Requiere autenticación:** Sí (Bearer token)

**Response 200:**
```json
{
  "user": {
    "id": "user_01",
    "email": "admin@carrefour.com",
    "role": "admin"
  }
}
```

---

#### 4. DELETE `/auth/session`
**Descripción:** Cerrar sesión  
**Estado actual:** ⚠️ No testeado  
**Requiere autenticación:** Sí

**Response 200:**
```json
{
  "message": "Session terminated"
}
```

---

### B. Módulo: Admin (Endpoints Medusa Estándar)

#### 5. GET `/admin/orders`
**Descripción:** Listar órdenes  
**Estado actual:** ❌ **BROKEN - 401 Unauthorized**  
**Requiere autenticación:** Sí (Bearer token con role: admin)

**Problema actual:**
```
Authorization: Bearer <jwt_token>
Response: 401 Unauthorized
```

**Verificar:**
1. JWT incluye `domain: 'admin'`
2. Role permissions configurado
3. JWT_SECRET coincide entre frontend/backend

**Response esperada 200:**
```json
{
  "orders": [
    {
      "id": "order_01",
      "display_id": 1001,
      "email": "cliente@example.com",
      "total": 15000,
      "currency_code": "eur",
      "status": "pending",
      "created_at": "2026-08-20T10:00:00Z"
    }
  ],
  "count": 1,
  "limit": 20,
  "offset": 0
}
```

---

#### 6. GET `/admin/users/me`
**Descripción:** Obtener usuario admin actual  
**Estado actual:** ❌ **BROKEN - 401 Unauthorized**  
**Requiere autenticación:** Sí (Bearer token)

**Response esperada 200:**
```json
{
  "user": {
    "id": "user_01",
    "email": "admin@carrefour.com",
    "first_name": "Admin",
    "last_name": "Carrefour",
    "role": "admin",
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

---

#### 7. GET `/admin/sellers`
**Descripción:** Listar sellers (MercurJS)  
**Estado actual:** ⚠️ No testeado  
**Requiere autenticación:** Sí (admin)

**Query params:**
- `limit`: number (default: 20)
- `offset`: number (default: 0)

**Response 200:**
```json
{
  "sellers": [
    {
      "id": "seller_01",
      "name": "Proveedor Bebidas S.L.",
      "email": "proveedor1@example.com",
      "global_markup_percentage": 15.00,
      "total_products": 120,
      "pending_products": 5,
      "approved_products": 115,
      "created_at": "2026-01-15T00:00:00Z"
    }
  ],
  "count": 1,
  "limit": 20,
  "offset": 0
}
```

**Campos adicionales vs MercurJS base:**
- `global_markup_percentage` ← Nuevo campo
- `total_products`, `pending_products`, `approved_products` ← Agregados calculados

---

### C. Módulo: Pricing (Custom Endpoints - P0)

#### 8. GET `/admin/custom/products/pending`
**Descripción:** Productos pendientes de aprobación (Fase 7)  
**Estado actual:** ⚠️ Mock implementado  
**Requiere autenticación:** Sí (admin)

**Query params:**
- `seller_id`: string (filtrar por proveedor)
- `category_id`: string (filtrar por categoría)
- `limit`: number (default: 50)
- `offset`: number (default: 0)

**Response 200:**
```json
{
  "products": [
    {
      "id": "proposal_01",
      "title": "Agua Mineral 1.5L - Pack 6 uds",
      "description": "Pack de 6 botellas de agua mineral natural",
      "base_price": 3.50,
      "units_per_pack": 6,
      "category_id": "cat_bebidas",
      "subcategory": "Agua",
      "tags": ["agua", "mineral", "pack"],
      "thumbnail": "https://example.com/agua.jpg",
      "images": ["https://example.com/agua_1.jpg"],
      "seller_id": "seller_01",
      "seller_name": "Proveedor Bebidas S.L.",
      "variants": null,
      "status": "pending_approval",
      "markup_percentage": null,
      "rejection_reason": null,
      "ean": "8412345678901",
      "tax_rate": 10.00,
      "created_at": "2026-08-20T09:00:00Z",
      "updated_at": "2026-08-20T09:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

**Notas:**
- Devolver solo productos con `status = 'pending_approval'`
- Ordenar por `created_at DESC` (más recientes primero)
- Incluir `seller_name` con JOIN a `sellers`

---

#### 9. PATCH `/admin/custom/products/:id/pricing-approval`
**Descripción:** Aprobar o rechazar tarificación (Fase 7)  
**Estado actual:** ⚠️ Mock implementado  
**Requiere autenticación:** Sí (admin)

**Request (Aprobar):**
```json
{
  "status": "approved",
  "markup_percentage": 18.50
}
```

**Request (Rechazar):**
```json
{
  "status": "rejected",
  "rejection_reason": "El precio base está muy alto comparado con competencia"
}
```

**Response 200 (Aprobado):**
```json
{
  "product": {
    "id": "proposal_01",
    "title": "Agua Mineral 1.5L - Pack 6 uds",
    "status": "approved",
    "markup_percentage": 18.50,
    "approved_at": "2026-08-21T10:30:00Z",
    "approved_by": "user_admin_01",
    "medusa_product_id": "prod_medusa_123"
  },
  "message": "Producto aprobado y publicado en catálogo"
}
```

**Lógica al aprobar:**
1. Actualizar `custom_product_proposals`:
   - `status = 'approved'`
   - `markup_percentage = request.markup_percentage`
   - `approved_at = NOW()`
   - `approved_by = current_user_id`
2. **Crear producto en Medusa:**
   - Calcular `final_price = base_price * (1 + markup_percentage/100)`
   - Insertar en `products` table con precio final
   - Si hay variantes → crear en `product_variants`
   - Actualizar `medusa_product_id` en proposal
3. Devolver producto actualizado

**Lógica al rechazar:**
1. Actualizar `custom_product_proposals`:
   - `status = 'rejected'`
   - `rejection_reason = request.rejection_reason`
   - `rejected_at = NOW()`
   - `rejected_by = current_user_id`

**Validaciones:**
- Si `status = 'approved'` → `markup_percentage` requerido (0-500)
- Si `status = 'rejected'` → `rejection_reason` requerido (min 10 chars)
- Producto debe estar en `status = 'pending_approval'`

---

#### 10. GET `/admin/custom/sellers`
**Descripción:** Listar sellers con info de markup (Fase 6)  
**Estado actual:** ⚠️ Mock implementado  
**Requiere autenticación:** Sí (admin)

**Response 200:**
```json
{
  "sellers": [
    {
      "id": "seller_01",
      "name": "Proveedor Bebidas S.L.",
      "email": "proveedor1@example.com",
      "global_markup_percentage": 15.00,
      "total_products": 120,
      "pending_products": 5,
      "approved_products": 115
    },
    {
      "id": "seller_02",
      "name": "Distribuidora Alimentación",
      "email": "proveedor2@example.com",
      "global_markup_percentage": 12.50,
      "total_products": 85,
      "pending_products": 2,
      "approved_products": 80
    }
  ]
}
```

**Query SQL sugerida:**
```sql
SELECT 
  s.id,
  s.name,
  s.email,
  s.global_markup_percentage,
  COUNT(p.id) FILTER (WHERE p.status IN ('pending_approval', 'approved', 'rejected')) as total_products,
  COUNT(p.id) FILTER (WHERE p.status = 'pending_approval') as pending_products,
  COUNT(p.id) FILTER (WHERE p.status = 'approved') as approved_products
FROM sellers s
LEFT JOIN custom_product_proposals p ON p.seller_id = s.id
GROUP BY s.id, s.name, s.email, s.global_markup_percentage
ORDER BY s.name ASC;
```

---

#### 11. GET `/admin/custom/sellers/:id/markup`
**Descripción:** Obtener markup global de seller (Fase 6)  
**Estado actual:** ⚠️ Mock implementado  
**Requiere autenticación:** Sí (admin)

**Response 200:**
```json
{
  "seller_id": "seller_01",
  "global_markup_percentage": 15.00,
  "updated_at": "2026-08-15T14:20:00Z",
  "updated_by": "admin@carrefour.com"
}
```

---

#### 12. PATCH `/admin/custom/sellers/:id/markup`
**Descripción:** Actualizar markup global de seller (Fase 6)  
**Estado actual:** ⚠️ Mock implementado  
**Requiere autenticación:** Sí (admin)

**Request:**
```json
{
  "global_markup_percentage": 18.50,
  "reason": "Ajuste por incremento costos logísticos Q3 2026"
}
```

**Response 200:**
```json
{
  "seller_markup": {
    "seller_id": "seller_01",
    "global_markup_percentage": 18.50,
    "updated_at": "2026-08-21T11:00:00Z",
    "updated_by": "user_admin_01"
  },
  "affected_products": 95,
  "message": "Markup actualizado. 95 productos afectados (usan markup global)"
}
```

**Lógica:**
1. Obtener `previous_markup` actual del seller
2. Actualizar `sellers.global_markup_percentage`
3. Insertar en `seller_markup_history`:
   ```sql
   INSERT INTO seller_markup_history 
   (seller_id, previous_markup, new_markup, reason, changed_by, affected_products_count)
   VALUES 
   ('seller_01', 15.00, 18.50, 'Ajuste...', 'user_admin_01', 95);
   ```
4. Calcular `affected_products`: productos con `markup_percentage IS NULL`
5. **Opcional:** Re-calcular precios de productos aprobados que usan markup global

**Validaciones:**
- `global_markup_percentage`: 0.00 - 500.00
- `reason`: opcional pero recomendado (max 500 chars)

---

#### 13. GET `/admin/custom/sellers/:id/markup/history`
**Descripción:** Historial de cambios de markup (Fase 6)  
**Estado actual:** ⚠️ Mock implementado  
**Requiere autenticación:** Sí (admin)

**Query params:**
- `limit`: number (default: 20)
- `offset`: number (default: 0)

**Response 200:**
```json
{
  "history": [
    {
      "id": "hist_05",
      "seller_id": "seller_01",
      "previous_markup": 15.00,
      "new_markup": 18.50,
      "changed_by": "Admin Carrefour",
      "changed_at": "2026-08-21T11:00:00Z",
      "reason": "Ajuste por incremento costos logísticos Q3 2026",
      "affected_products_count": 95
    },
    {
      "id": "hist_04",
      "seller_id": "seller_01",
      "previous_markup": 12.00,
      "new_markup": 15.00,
      "changed_by": "Admin Carrefour",
      "changed_at": "2026-06-10T09:15:00Z",
      "reason": "Revisión trimestral Q2",
      "affected_products_count": 87
    }
  ],
  "total": 2,
  "seller": {
    "id": "seller_01",
    "name": "Proveedor Bebidas S.L.",
    "email": "proveedor1@example.com"
  }
}
```

**Ordenar:** `changed_at DESC` (más reciente primero)

---

### D. Módulo: Vendor (Custom Endpoints - P1)

#### 14. GET `/vendor/custom/products`
**Descripción:** Mis productos propuestos (Fase 8)  
**Estado actual:** ⚠️ Mock implementado  
**Requiere autenticación:** Sí (vendor/supplier)

**Query params:**
- `status`: 'pending_approval' | 'approved' | 'rejected' (opcional)
- `limit`: number (default: 50)
- `offset`: number (default: 0)

**Response 200:**
```json
{
  "products": [
    {
      "id": "proposal_01",
      "title": "Agua Mineral 1.5L - Pack 6 uds",
      "description": "Pack de 6 botellas",
      "base_price": 3.50,
      "units_per_pack": 6,
      "category_id": "cat_bebidas",
      "thumbnail": "https://...",
      "seller_id": "seller_01",
      "seller_name": "Proveedor Bebidas S.L.",
      "status": "approved",
      "markup_percentage": 18.50,
      "ean": "8412345678901",
      "tax_rate": 10.00,
      "created_at": "2026-08-20T09:00:00Z",
      "approved_at": "2026-08-21T10:30:00Z",
      "approved_by": "admin@carrefour.com"
    }
  ],
  "total": 1
}
```

**Filtro automático:** Solo productos del `seller_id` autenticado

---

#### 15. POST `/vendor/custom/products`
**Descripción:** Proponer nuevo producto (Fase 8, 9)  
**Estado actual:** ⚠️ Mock implementado  
**Requiere autenticación:** Sí (vendor/supplier)

**Request (Producto simple):**
```json
{
  "title": "Aceite Oliva Extra Virgen 1L",
  "description": "Aceite de oliva virgen extra primera prensada en frío",
  "base_price": 12.50,
  "units_per_pack": 1,
  "category_id": "cat_alimentacion",
  "subcategory": "Aceites",
  "tags": ["aceite", "oliva", "virgen extra"],
  "thumbnail": "https://example.com/aceite.jpg",
  "images": ["https://example.com/aceite_1.jpg", "https://example.com/aceite_2.jpg"],
  "ean": "8412345678902",
  "tax_rate": 10.00
}
```

**Request (Producto con variantes):**
```json
{
  "title": "Pantalón Hombre Marino",
  "description": "Pantalón de trabajo resistente",
  "base_price": 0,
  "units_per_pack": 1,
  "category_id": "cat_textil",
  "subcategory": "Pantalones",
  "variants": [
    {
      "title": "Talla 40",
      "sku": "PANT-H-MAR-40",
      "base_price": 18.50,
      "inventory_quantity": 50,
      "options": { "Talla": "40", "Color": "Marino" }
    },
    {
      "title": "Talla 42",
      "sku": "PANT-H-MAR-42",
      "base_price": 18.50,
      "inventory_quantity": 75,
      "options": { "Talla": "42", "Color": "Marino" }
    }
  ]
}
```

**Response 201:**
```json
{
  "product": {
    "id": "proposal_10",
    "title": "Aceite Oliva Extra Virgen 1L",
    "status": "pending_approval",
    "created_at": "2026-08-21T12:00:00Z"
  },
  "message": "Producto propuesto correctamente. Pendiente de aprobación"
}
```

**Lógica:**
1. Obtener `seller_id` del usuario autenticado
2. Validar campos requeridos
3. Si hay variantes → validar SKUs únicos
4. Insertar en `custom_product_proposals` con `status = 'pending_approval'`
5. Guardar `variants` como JSONB si existen

**Validaciones:**
- `base_price`: >= 0.01 (si no hay variantes)
- `units_per_pack`: >= 1
- `tax_rate`: 0, 4, 10, 21 (valores IVA España)
- `ean`: 13 dígitos (opcional)
- Variantes: `sku` único por variante

---

#### 16. GET `/vendor/custom/sellers/me/markup`
**Descripción:** Obtener mi markup global (Fase 8)  
**Estado actual:** ⚠️ Mock implementado  
**Requiere autenticación:** Sí (vendor/supplier)

**Response 200:**
```json
{
  "seller_id": "seller_01",
  "global_markup_percentage": 15.00,
  "updated_at": "2026-08-15T14:20:00Z"
}
```

**Lógica:** Obtener `seller_id` del usuario autenticado y devolver su markup

---

### E. Módulo: Vendor (MercurJS Estándar)

#### 17. GET `/vendor/sellers/me`
**Descripción:** Obtener seller actual (vendor)  
**Estado actual:** ⚠️ No testeado  
**Requiere autenticación:** Sí (vendor/supplier)

**Response 200:**
```json
{
  "id": "seller_01",
  "name": "Proveedor Bebidas S.L.",
  "email": "proveedor1@example.com",
  "global_markup_percentage": 15.00,
  "created_at": "2026-01-15T00:00:00Z"
}
```

---

### F. Módulo: Store (Endpoints Públicos - P2)

#### 18. GET `/store/regions`
**Descripción:** Listar regiones disponibles  
**Estado actual:** ⚠️ No testeado  
**Requiere autenticación:** No

**Response 200:**
```json
{
  "regions": [
    {
      "id": "reg_spain",
      "name": "España",
      "currency_code": "eur",
      "tax_rate": 21,
      "countries": ["ES"]
    }
  ]
}
```

---

#### 19. GET `/store/products`
**Descripción:** Listar productos del catálogo  
**Estado actual:** ⚠️ No testeado  
**Requiere autenticación:** No

**Query params:**
- `category_id`: string
- `limit`: number (default: 20)
- `offset`: number (default: 0)

**Response 200:**
```json
{
  "products": [
    {
      "id": "prod_medusa_123",
      "title": "Agua Mineral 1.5L - Pack 6 uds",
      "description": "Pack de 6 botellas",
      "thumbnail": "https://...",
      "variants": [
        {
          "id": "variant_01",
          "title": "Default",
          "prices": [
            {
              "amount": 414,
              "currency_code": "eur"
            }
          ]
        }
      ]
    }
  ],
  "count": 1
}
```

**Nota:** Solo productos con `status = 'approved'` en `custom_product_proposals`

---

#### 20. POST `/store/carts`
**Descripción:** Crear carrito de compra  
**Estado actual:** ⚠️ No testeado  
**Requiere autenticación:** No

**Request:**
```json
{
  "region_id": "reg_spain"
}
```

**Response 200:**
```json
{
  "cart": {
    "id": "cart_01",
    "region_id": "reg_spain",
    "items": [],
    "total": 0,
    "currency_code": "eur"
  }
}
```

---

## 📊 Datos de Ejemplo para Ingestar

### Sellers (4 proveedores)

```sql
INSERT INTO sellers (id, name, email, global_markup_percentage) VALUES
('seller_01', 'Proveedor Bebidas S.L.', 'proveedor1@example.com', 15.00),
('seller_02', 'Distribuidora Alimentación', 'proveedor2@example.com', 12.50),
('seller_03', 'Textil Industrial S.A.', 'proveedor3@example.com', 20.00),
('seller_04', 'Suministros Oficina', 'proveedor4@example.com', 18.00);
```

### Usuarios Vendor (4 members)

```sql
INSERT INTO members (id, email, password_hash, seller_id) VALUES
('member_01', 'proveedor1@example.com', '<hash_bcrypt>', 'seller_01'),
('member_02', 'proveedor2@example.com', '<hash_bcrypt>', 'seller_02'),
('member_03', 'proveedor3@example.com', '<hash_bcrypt>', 'seller_03'),
('member_04', 'proveedor4@example.com', '<hash_bcrypt>', 'seller_04');
```

**Passwords sugeridos (testing):**
- `proveedor1@example.com` / `password123`
- `proveedor2@example.com` / `password123`
- `proveedor3@example.com` / `password123`
- `proveedor4@example.com` / `password123`

### Productos Propuestos (10 ejemplos)

```sql
-- PENDIENTES (4)
INSERT INTO custom_product_proposals (
  id, seller_id, title, description, base_price, units_per_pack, 
  category_id, subcategory, ean, tax_rate, status, created_at
) VALUES
(
  'proposal_01', 'seller_01', 
  'Agua Mineral Natural 1.5L - Pack 6 uds',
  'Pack de 6 botellas de agua mineral natural de manantial',
  3.50, 6, 'cat_bebidas', 'Agua', '8412345678901', 10.00,
  'pending_approval', '2026-08-20 09:00:00'
),
(
  'proposal_02', 'seller_01',
  'Refresco Cola 2L - Pack 4 uds',
  'Pack de 4 botellas de refresco de cola',
  5.20, 4, 'cat_bebidas', 'Refrescos', '8412345678902', 21.00,
  'pending_approval', '2026-08-20 10:30:00'
),
(
  'proposal_03', 'seller_02',
  'Pan Integral 500g - Pack 2 uds',
  'Pack de 2 unidades de pan integral',
  2.80, 2, 'cat_panaderia', 'Pan', '8412345678903', 4.00,
  'pending_approval', '2026-08-19 14:00:00'
),
(
  'proposal_04', 'seller_03',
  'Camisa Blanca Hombre Talla L',
  'Camisa blanca de algodón 100%',
  12.50, 1, 'cat_textil', 'Camisas', '8412345678904', 21.00,
  'pending_approval', '2026-08-18 11:00:00'
);

-- APROBADOS (4)
INSERT INTO custom_product_proposals (
  id, seller_id, title, description, base_price, units_per_pack,
  category_id, subcategory, ean, tax_rate, status, markup_percentage,
  created_at, approved_at, approved_by, medusa_product_id
) VALUES
(
  'proposal_05', 'seller_01',
  'Aceite Oliva Virgen Extra 1L',
  'Aceite de oliva virgen extra primera prensada en frío',
  8.50, 1, 'cat_alimentacion', 'Aceites', '8412345678905', 10.00,
  'approved', 15.00,
  '2026-08-15 09:00:00', '2026-08-16 10:00:00', 'user_admin_01', 'prod_medusa_01'
),
(
  'proposal_06', 'seller_02',
  'Galletas Chocolate 200g - Pack 3 uds',
  'Pack de 3 paquetes de galletas con chips de chocolate',
  4.20, 3, 'cat_alimentacion', 'Galletas', '8412345678906', 10.00,
  'approved', NULL, -- Usa markup global del seller (12.50%)
  '2026-08-14 11:00:00', '2026-08-15 09:30:00', 'user_admin_01', 'prod_medusa_02'
),
(
  'proposal_07', 'seller_03',
  'Pantalón Trabajo Azul - Pack 2 uds',
  'Pack de 2 pantalones de trabajo resistentes',
  35.00, 2, 'cat_textil', 'Pantalones', '8412345678907', 21.00,
  'approved', 22.00,
  '2026-08-13 14:00:00', '2026-08-14 11:00:00', 'user_admin_01', 'prod_medusa_03'
),
(
  'proposal_08', 'seller_04',
  'Bolígrafos Azules - Pack 10 uds',
  'Pack de 10 bolígrafos de tinta azul',
  1.50, 10, 'cat_oficina', 'Escritura', '8412345678908', 21.00,
  'approved', NULL, -- Usa markup global (18.00%)
  '2026-08-10 10:00:00', '2026-08-11 15:00:00', 'user_admin_01', 'prod_medusa_04'
);

-- RECHAZADOS (2)
INSERT INTO custom_product_proposals (
  id, seller_id, title, description, base_price, units_per_pack,
  category_id, subcategory, ean, tax_rate, status, rejection_reason,
  created_at, rejected_at, rejected_by
) VALUES
(
  'proposal_09', 'seller_02',
  'Chocolate Negro 100g',
  'Tableta de chocolate negro 85% cacao',
  3.50, 1, 'cat_alimentacion', 'Chocolate', '8412345678909', 10.00,
  'rejected', 'Precio base muy alto comparado con competencia (precio sugerido: €2.80)',
  '2026-08-12 09:00:00', '2026-08-13 10:00:00', 'user_admin_01'
),
(
  'proposal_10', 'seller_03',
  'Zapatos Seguridad T.42',
  'Zapatos de seguridad con puntera de acero',
  45.00, 1, 'cat_calzado', 'Seguridad', '8412345678910', 21.00,
  'rejected', 'Falta certificación CE requerida para calzado de seguridad',
  '2026-08-11 14:00:00', '2026-08-12 09:00:00', 'user_admin_01'
);
```

### Historial de Markup (5 cambios)

```sql
INSERT INTO seller_markup_history (
  id, seller_id, previous_markup, new_markup, reason,
  changed_by, changed_at, affected_products_count
) VALUES
(
  'hist_01', 'seller_01', 12.00, 15.00,
  'Ajuste inicial tras revisión de márgenes Q1 2026',
  'user_admin_01', '2026-03-15 10:00:00', 45
),
(
  'hist_02', 'seller_02', 10.00, 12.50,
  'Incremento por mejora en tiempos de entrega',
  'user_admin_01', '2026-04-20 11:30:00', 38
),
(
  'hist_03', 'seller_03', 18.00, 20.00,
  'Ajuste por incremento costos materia prima textil',
  'user_admin_01', '2026-05-10 09:00:00', 52
),
(
  'hist_04', 'seller_04', 15.00, 18.00,
  'Revisión trimestral Q2 - Aumento volumen ventas',
  'user_admin_01', '2026-06-25 14:00:00', 29
),
(
  'hist_05', 'seller_01', 15.00, 15.00,
  'Sin cambios tras revisión Q3 - Rendimiento satisfactorio',
  'user_admin_01', '2026-08-01 10:00:00', 0
);
```

---

## 🔐 Consideraciones de Seguridad

### Autenticación
- **Admin:** JWT con `domain: 'admin'` y `role: 'admin'`
- **Vendor:** JWT con `domain: 'vendor'` y `seller_id` incluido
- **Bearer Token:** Header `Authorization: Bearer <token>`
- **Session Cookie:** Opcional adicional para SSR

### Permisos
- **Endpoints `/admin/*`:** Requieren `role: 'admin'`
- **Endpoints `/vendor/*`:** Requieren `role: 'supplier'` y filtran por `seller_id`
- **Vendor:** NO puede ver productos de otros sellers
- **Admin:** Puede ver/modificar todo

### Validaciones
- **Markup:** 0% - 500% (DECIMAL(5,2))
- **Precio:** >= €0.01
- **Tax Rate:** Solo valores: 0, 4, 10, 21 (IVA España)
- **EAN:** 13 dígitos numéricos (opcional)
- **SKU:** Único por seller (variantes)

### Rate Limiting
- POST `/vendor/custom/products`: **Max 10 req/min por seller**
- PATCH `/admin/custom/products/:id/pricing-approval`: Max 30 req/min
- PATCH `/admin/custom/sellers/:id/markup`: **Max 5 req/min (cambios críticos)**

---

## 🧪 Testing Checklist

### Fase 0: Autenticación
- [ ] Login admin con `admin@carrefour.com` / `admin123`
- [ ] Login vendor con `proveedor1@example.com` / `password123`
- [ ] GET `/admin/orders` devuelve 200 (NO 401)
- [ ] GET `/admin/users/me` devuelve usuario actual

### Fase 6: Markup Management
- [ ] GET `/admin/custom/sellers` devuelve 4 sellers
- [ ] GET `/admin/custom/sellers/seller_01/markup` devuelve 15.00%
- [ ] PATCH `/admin/custom/sellers/seller_01/markup` con 18.50% → success
- [ ] GET `/admin/custom/sellers/seller_01/markup/history` devuelve historial

### Fase 7: Approval Queue
- [ ] GET `/admin/custom/products/pending` devuelve 4 productos pendientes
- [ ] PATCH aprobar `proposal_01` con markup 18.50% → crea producto Medusa
- [ ] PATCH rechazar `proposal_02` con motivo → status = rejected
- [ ] GET `/admin/custom/products/pending` devuelve 2 productos (filtrados)

### Fase 8: Supplier Dashboard
- [ ] GET `/vendor/custom/products` (vendor auth) → devuelve solo sus productos
- [ ] POST `/vendor/custom/products` con producto simple → created
- [ ] GET `/vendor/custom/sellers/me/markup` → devuelve su markup global

### Fase 9: Bulk Upload
- [ ] POST `/vendor/custom/products` con producto con 2 variantes → created
- [ ] Verificar variantes guardadas en JSONB
- [ ] Validar SKUs únicos por producto

---

## 📞 Contacto & Soporte

**Frontend Team:**
- Repo: `marketplace-b2b-carrefour-frontend`
- Mock mode: ✅ Totalmente funcional
- Documentación: `/docs/technical/supplier/`

**Backend Team - Acción Requerida:**
1. **P0:** Fix autenticación admin (401 en `/admin/orders`)
2. **P0:** Crear tablas custom: `custom_product_proposals`, `seller_markup_history`
3. **P0:** Implementar 9 endpoints custom de pricing
4. **P1:** Implementar 3 endpoints vendor
5. **P2:** Revisar endpoints store

**Testing URL:** `http://localhost:3000/admin/dev-tools`  
**Estado actual:** 20 endpoints documentados, 18 en modo mock

---

## 📅 Timeline Sugerido

**Sprint 1 (1 semana):**
- Día 1-2: Fix autenticación + crear tablas
- Día 3-4: Endpoints admin pricing (8-13)
- Día 5: Testing Fase 6-7

**Sprint 2 (1 semana):**
- Día 1-2: Endpoints vendor pricing (14-16)
- Día 3-4: Testing Fase 8-9 + ajustes
- Día 5: Integración frontend + QA

**Sprint 3 (opcional - 3 días):**
- Endpoints store + optimizaciones
- Performance testing
- Documentación final

---

**Documento generado:** 21 Agosto 2026  
**Versión:** 1.0  
**Próxima revisión:** Tras implementación Sprint 1
