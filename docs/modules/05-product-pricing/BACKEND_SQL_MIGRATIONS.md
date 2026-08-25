# SQL Migrations & Queries - Backend Implementation

**Complemento a:** BACKEND_REQUIREMENTS.md  
**Para:** Equipo Backend - SQL Scripts  
**Fecha:** 21 Agosto 2026

---

## 📋 Tabla de Contenidos

1. [Migrations](#migrations)
2. [Queries Optimizadas](#queries-optimizadas)
3. [Triggers & Functions](#triggers--functions)
4. [Índices de Performance](#índices-de-performance)
5. [Data Seeding Scripts](#data-seeding-scripts)

---

## 🗄️ Migrations

### Migration 001: Create `custom_product_proposals` Table

```sql
-- Migration: 001_create_custom_product_proposals
-- Description: Tabla para gestionar propuestas de productos de sellers
-- Date: 2026-08-21

CREATE TABLE custom_product_proposals (
  id VARCHAR(255) PRIMARY KEY,
  
  -- Relaciones
  seller_id VARCHAR(255) NOT NULL,
  medusa_product_id VARCHAR(255) DEFAULT NULL,
  
  -- Información del producto
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id VARCHAR(100),
  subcategory VARCHAR(100),
  tags TEXT[], -- Array de strings
  thumbnail VARCHAR(500),
  images TEXT[], -- Array de URLs
  
  -- Pricing
  base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
  units_per_pack INTEGER NOT NULL DEFAULT 1 CHECK (units_per_pack >= 1),
  ean VARCHAR(13),
  tax_rate DECIMAL(5,2) DEFAULT 21.00 CHECK (tax_rate IN (0, 4, 10, 21)),
  
  -- Estado y aprobación
  status VARCHAR(20) NOT NULL DEFAULT 'pending_approval' 
    CHECK (status IN ('pending_approval', 'approved', 'rejected')),
  markup_percentage DECIMAL(5,2) 
    CHECK (markup_percentage IS NULL OR (markup_percentage >= 0 AND markup_percentage <= 500)),
  rejection_reason TEXT,
  
  -- Variantes (JSON)
  variants JSONB DEFAULT NULL,
  
  -- Auditoría
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by VARCHAR(255),
  rejected_at TIMESTAMP,
  rejected_by VARCHAR(255),
  
  -- Foreign Keys
  CONSTRAINT fk_seller FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE,
  CONSTRAINT fk_medusa_product FOREIGN KEY (medusa_product_id) REFERENCES products(id) ON DELETE SET NULL,
  CONSTRAINT fk_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_rejected_by FOREIGN KEY (rejected_by) REFERENCES users(id) ON DELETE SET NULL,
  
  -- Validaciones lógicas
  CONSTRAINT check_approved CHECK (
    (status = 'approved' AND approved_at IS NOT NULL AND approved_by IS NOT NULL)
    OR (status != 'approved')
  ),
  CONSTRAINT check_rejected CHECK (
    (status = 'rejected' AND rejected_at IS NOT NULL AND rejected_by IS NOT NULL AND rejection_reason IS NOT NULL)
    OR (status != 'rejected')
  )
);

-- Índices de performance
CREATE INDEX idx_proposals_seller_status ON custom_product_proposals(seller_id, status);
CREATE INDEX idx_proposals_status ON custom_product_proposals(status);
CREATE INDEX idx_proposals_created_at ON custom_product_proposals(created_at DESC);
CREATE INDEX idx_proposals_category ON custom_product_proposals(category_id);

-- Índice GIN para búsqueda en arrays
CREATE INDEX idx_proposals_tags ON custom_product_proposals USING GIN(tags);

-- Comentarios
COMMENT ON TABLE custom_product_proposals IS 'Propuestas de productos enviadas por sellers pendientes de aprobación admin';
COMMENT ON COLUMN custom_product_proposals.base_price IS 'Precio del pack completo (NO precio unitario)';
COMMENT ON COLUMN custom_product_proposals.units_per_pack IS 'Número de unidades en el pack';
COMMENT ON COLUMN custom_product_proposals.markup_percentage IS 'Markup específico del producto. NULL = usar global del seller';
COMMENT ON COLUMN custom_product_proposals.variants IS 'JSONB array con variantes: [{title, sku, base_price, options{}, inventory_quantity}]';
```

---

### Migration 002: Extend `sellers` Table

```sql
-- Migration: 002_extend_sellers_with_markup
-- Description: Añadir campo global_markup_percentage a sellers
-- Date: 2026-08-21

-- Añadir columna
ALTER TABLE sellers 
ADD COLUMN global_markup_percentage DECIMAL(5,2) NOT NULL DEFAULT 10.00
  CHECK (global_markup_percentage >= 0 AND global_markup_percentage <= 500);

-- Índice
CREATE INDEX idx_sellers_markup ON sellers(global_markup_percentage);

-- Comentario
COMMENT ON COLUMN sellers.global_markup_percentage IS 'Markup global por defecto para todos los productos del seller (0-500%)';

-- Actualizar sellers existentes con markup inicial
UPDATE sellers SET global_markup_percentage = 10.00 WHERE global_markup_percentage IS NULL;
```

---

### Migration 003: Create `seller_markup_history` Table

```sql
-- Migration: 003_create_seller_markup_history
-- Description: Tracking de cambios en markup global de sellers
-- Date: 2026-08-21

CREATE TABLE seller_markup_history (
  id VARCHAR(255) PRIMARY KEY,
  seller_id VARCHAR(255) NOT NULL,
  
  -- Cambio
  previous_markup DECIMAL(5,2) NOT NULL,
  new_markup DECIMAL(5,2) NOT NULL,
  reason TEXT,
  
  -- Auditoría
  changed_by VARCHAR(255) NOT NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Impacto
  affected_products_count INTEGER DEFAULT 0,
  
  -- Foreign Keys
  CONSTRAINT fk_seller FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE CASCADE,
  CONSTRAINT fk_changed_by FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Índices
CREATE INDEX idx_markup_history_seller ON seller_markup_history(seller_id, changed_at DESC);
CREATE INDEX idx_markup_history_changed_at ON seller_markup_history(changed_at DESC);

-- Comentarios
COMMENT ON TABLE seller_markup_history IS 'Historial de cambios de markup global por seller';
COMMENT ON COLUMN seller_markup_history.affected_products_count IS 'Número de productos que usaban markup global (markup_percentage IS NULL)';
```

---

## 🚀 Queries Optimizadas

### Query 1: Get Pending Products con Seller Info

```sql
-- Usado por: GET /admin/custom/products/pending
-- Optimización: 1 query con JOIN vs 2 queries separadas

SELECT 
  p.id,
  p.title,
  p.description,
  p.base_price,
  p.units_per_pack,
  p.category_id,
  p.subcategory,
  p.tags,
  p.thumbnail,
  p.images,
  p.seller_id,
  s.name as seller_name,
  s.email as seller_email,
  p.variants,
  p.status,
  p.markup_percentage,
  p.rejection_reason,
  p.ean,
  p.tax_rate,
  p.created_at,
  p.updated_at,
  p.approved_at,
  p.approved_by,
  p.rejected_at,
  p.rejected_by
FROM custom_product_proposals p
INNER JOIN sellers s ON s.id = p.seller_id
WHERE p.status = 'pending_approval'
  AND ($1::VARCHAR IS NULL OR p.seller_id = $1) -- Filtro seller opcional
  AND ($2::VARCHAR IS NULL OR p.category_id = $2) -- Filtro categoría opcional
ORDER BY p.created_at DESC
LIMIT $3 OFFSET $4;

-- Ejemplo de uso en Node.js:
-- const result = await db.query(query, [sellerId || null, categoryId || null, limit, offset]);
```

---

### Query 2: Get Sellers con Stats Agregadas

```sql
-- Usado por: GET /admin/custom/sellers
-- Optimización: Agregación en 1 query usando FILTER

SELECT 
  s.id,
  s.name,
  s.email,
  s.global_markup_percentage,
  COUNT(p.id) FILTER (WHERE p.status IN ('pending_approval', 'approved', 'rejected')) as total_products,
  COUNT(p.id) FILTER (WHERE p.status = 'pending_approval') as pending_products,
  COUNT(p.id) FILTER (WHERE p.status = 'approved') as approved_products,
  COUNT(p.id) FILTER (WHERE p.status = 'rejected') as rejected_products,
  s.created_at
FROM sellers s
LEFT JOIN custom_product_proposals p ON p.seller_id = s.id
GROUP BY s.id, s.name, s.email, s.global_markup_percentage, s.created_at
ORDER BY s.name ASC;
```

---

### Query 3: Calculate Affected Products on Markup Update

```sql
-- Usado por: PATCH /admin/custom/sellers/:id/markup
-- Propósito: Contar productos que serán afectados por cambio de markup global

SELECT COUNT(*) as affected_count
FROM custom_product_proposals
WHERE seller_id = $1
  AND status = 'approved' -- Solo productos ya aprobados
  AND markup_percentage IS NULL; -- Que usan markup global

-- Ejemplo: Si retorna 95 → "95 productos afectados"
```

---

### Query 4: Get Vendor Products con Applied Markup

```sql
-- Usado por: GET /vendor/custom/products
-- Optimización: JOIN para traer markup global y calcular final price

SELECT 
  p.id,
  p.title,
  p.description,
  p.base_price,
  p.units_per_pack,
  p.category_id,
  p.subcategory,
  p.tags,
  p.thumbnail,
  p.images,
  p.seller_id,
  s.name as seller_name,
  p.variants,
  p.status,
  p.markup_percentage as specific_markup,
  s.global_markup_percentage,
  -- Calcular markup aplicado
  COALESCE(p.markup_percentage, s.global_markup_percentage) as applied_markup,
  p.ean,
  p.tax_rate,
  p.created_at,
  p.updated_at,
  p.approved_at,
  p.approved_by,
  p.rejected_at,
  p.rejected_by,
  p.rejection_reason
FROM custom_product_proposals p
INNER JOIN sellers s ON s.id = p.seller_id
WHERE p.seller_id = $1 -- Filtro por seller autenticado
  AND ($2::VARCHAR IS NULL OR p.status = $2) -- Filtro status opcional
ORDER BY p.created_at DESC
LIMIT $3 OFFSET $4;
```

---

### Query 5: Search Products by Title/EAN/Tags

```sql
-- Búsqueda full-text en productos
-- Usado por: Filtros de búsqueda en frontend

SELECT *
FROM custom_product_proposals
WHERE seller_id = $1
  AND (
    title ILIKE '%' || $2 || '%' -- Búsqueda en título
    OR ean = $2 -- Búsqueda exacta por EAN
    OR $2 = ANY(tags) -- Búsqueda en tags
  )
ORDER BY created_at DESC
LIMIT 20;

-- Ejemplo: searchProducts('seller_01', 'agua')
-- Retorna productos con "agua" en título o tags
```

---

## ⚙️ Triggers & Functions

### Trigger 1: Auto-update `updated_at` Timestamp

```sql
-- Function: Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger en custom_product_proposals
CREATE TRIGGER trigger_update_proposals_timestamp
BEFORE UPDATE ON custom_product_proposals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

### Trigger 2: Auto-insert Markup History

```sql
-- Function: Insertar en history al cambiar markup global
CREATE OR REPLACE FUNCTION insert_seller_markup_history()
RETURNS TRIGGER AS $$
DECLARE
  affected_count INTEGER;
  admin_user_id VARCHAR(255);
BEGIN
  -- Solo si markup cambió
  IF OLD.global_markup_percentage != NEW.global_markup_percentage THEN
    
    -- Contar productos afectados
    SELECT COUNT(*) INTO affected_count
    FROM custom_product_proposals
    WHERE seller_id = NEW.id
      AND status = 'approved'
      AND markup_percentage IS NULL;
    
    -- Obtener admin user (desde contexto de sesión o parámetro)
    -- En producción: usar session variable set por API
    admin_user_id := current_setting('app.current_user_id', true);
    
    -- Insertar en history
    INSERT INTO seller_markup_history (
      id,
      seller_id,
      previous_markup,
      new_markup,
      reason,
      changed_by,
      changed_at,
      affected_products_count
    ) VALUES (
      'hist_' || gen_random_uuid()::text,
      NEW.id,
      OLD.global_markup_percentage,
      NEW.global_markup_percentage,
      NULL, -- Reason debe venir del API request
      COALESCE(admin_user_id, 'system'),
      NOW(),
      affected_count
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trigger_markup_history
AFTER UPDATE OF global_markup_percentage ON sellers
FOR EACH ROW
EXECUTE FUNCTION insert_seller_markup_history();
```

**Nota:** En producción, el `changed_by` y `reason` deben pasarse explícitamente desde el API, no desde trigger.

---

### Function 3: Calculate Final Price

```sql
-- Function: Calcular precio final con markup
CREATE OR REPLACE FUNCTION calculate_final_price(
  p_base_price DECIMAL(10,2),
  p_markup_percentage DECIMAL(5,2)
)
RETURNS DECIMAL(10,2) AS $$
BEGIN
  RETURN ROUND(p_base_price * (1 + p_markup_percentage / 100), 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Uso:
-- SELECT calculate_final_price(10.00, 15.00); -- Retorna 11.50
-- SELECT calculate_final_price(18.50, 18.50); -- Retorna 21.92
```

---

### Function 4: Get Applied Markup (Specific or Global)

```sql
-- Function: Obtener markup aplicado (específico o global del seller)
CREATE OR REPLACE FUNCTION get_applied_markup(
  p_product_id VARCHAR(255)
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  applied_markup DECIMAL(5,2);
BEGIN
  SELECT COALESCE(p.markup_percentage, s.global_markup_percentage)
  INTO applied_markup
  FROM custom_product_proposals p
  INNER JOIN sellers s ON s.id = p.seller_id
  WHERE p.id = p_product_id;
  
  RETURN applied_markup;
END;
$$ LANGUAGE plpgsql STABLE;

-- Uso:
-- SELECT get_applied_markup('proposal_01'); -- Retorna markup aplicado
```

---

## 📈 Índices de Performance

### Índices Adicionales Recomendados

```sql
-- Búsqueda por seller + fecha
CREATE INDEX idx_proposals_seller_created 
ON custom_product_proposals(seller_id, created_at DESC);

-- Búsqueda por categoría + status
CREATE INDEX idx_proposals_category_status 
ON custom_product_proposals(category_id, status);

-- Búsqueda por status + fecha (admin approval queue ordenado)
CREATE INDEX idx_proposals_status_created 
ON custom_product_proposals(status, created_at DESC) 
WHERE status = 'pending_approval';

-- Full-text search en título (PostgreSQL)
CREATE INDEX idx_proposals_title_trgm 
ON custom_product_proposals 
USING gin(title gin_trgm_ops);
-- Requiere: CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Composite index para vendor dashboard
CREATE INDEX idx_proposals_seller_status_created 
ON custom_product_proposals(seller_id, status, created_at DESC);
```

---

## 🌱 Data Seeding Scripts

### Seed 1: Admin Users

```sql
-- Insertar usuarios admin para testing
-- Password: 'admin123' (bcrypt hash)
INSERT INTO users (id, email, first_name, last_name, password_hash, role) VALUES
('user_admin_01', 'admin@carrefour.com', 'Admin', 'Carrefour', 
 '$2b$10$K1wbsaZQX8eU0Y.j1Z0HZOu7xJ9vQ8RKkT5pG3mN2lP4rH6sO8wXy', 'admin'),
('user_admin_02', 'gestor@carrefour.com', 'Gestor', 'Pricing', 
 '$2b$10$K1wbsaZQX8eU0Y.j1Z0HZOu7xJ9vQ8RKkT5pG3mN2lP4rH6sO8wXy', 'admin');

-- Nota: En producción usar bcrypt real:
-- const hash = await bcrypt.hash('admin123', 10);
```

---

### Seed 2: Sellers & Members

```sql
-- Insertar sellers
INSERT INTO sellers (id, name, email, global_markup_percentage, created_at) VALUES
('seller_01', 'Proveedor Bebidas S.L.', 'proveedor1@example.com', 15.00, '2026-01-15 10:00:00'),
('seller_02', 'Distribuidora Alimentación', 'proveedor2@example.com', 12.50, '2026-01-20 11:00:00'),
('seller_03', 'Textil Industrial S.A.', 'proveedor3@example.com', 20.00, '2026-02-01 09:00:00'),
('seller_04', 'Suministros Oficina', 'proveedor4@example.com', 18.00, '2026-02-10 14:00:00');

-- Insertar members (vendors) vinculados a sellers
-- Password: 'password123'
INSERT INTO members (id, email, password_hash, seller_id) VALUES
('member_01', 'proveedor1@example.com', '$2b$10$X5wY7aB3cZ2dE1fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4B5C6D7', 'seller_01'),
('member_02', 'proveedor2@example.com', '$2b$10$X5wY7aB3cZ2dE1fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4B5C6D7', 'seller_02'),
('member_03', 'proveedor3@example.com', '$2b$10$X5wY7aB3cZ2dE1fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4B5C6D7', 'seller_03'),
('member_04', 'proveedor4@example.com', '$2b$10$X5wY7aB3cZ2dE1fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4B5C6D7', 'seller_04');
```

---

### Seed 3: Product Proposals (Sample Data)

```sql
-- PENDIENTES (4 productos)
INSERT INTO custom_product_proposals (
  id, seller_id, title, description, base_price, units_per_pack,
  category_id, subcategory, ean, tax_rate, status, tags, thumbnail, images, created_at
) VALUES
(
  'proposal_01', 'seller_01',
  'Agua Mineral Natural 1.5L - Pack 6 uds',
  'Pack de 6 botellas de agua mineral natural de manantial',
  3.50, 6, 'cat_bebidas', 'Agua', '8412345678901', 10.00, 'pending_approval',
  ARRAY['agua', 'mineral', 'pack'],
  'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
  ARRAY['https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800'],
  '2026-08-20 09:00:00'
),
(
  'proposal_02', 'seller_01',
  'Refresco Cola 2L - Pack 4 uds',
  'Pack de 4 botellas de refresco de cola',
  5.20, 4, 'cat_bebidas', 'Refrescos', '8412345678902', 21.00, 'pending_approval',
  ARRAY['refresco', 'cola', 'pack'],
  'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
  ARRAY['https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800'],
  '2026-08-20 10:30:00'
),
(
  'proposal_03', 'seller_02',
  'Pan Integral 500g - Pack 2 uds',
  'Pack de 2 unidades de pan integral',
  2.80, 2, 'cat_panaderia', 'Pan', '8412345678903', 4.00, 'pending_approval',
  ARRAY['pan', 'integral'],
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
  ARRAY['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'],
  '2026-08-19 14:00:00'
),
(
  'proposal_04', 'seller_03',
  'Camisa Blanca Hombre Talla L',
  'Camisa blanca de algodón 100%',
  12.50, 1, 'cat_textil', 'Camisas', '8412345678904', 21.00, 'pending_approval',
  ARRAY['camisa', 'blanca', 'algodón'],
  'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400',
  ARRAY['https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800'],
  '2026-08-18 11:00:00'
);

-- APROBADOS (4 productos)
INSERT INTO custom_product_proposals (
  id, seller_id, title, description, base_price, units_per_pack,
  category_id, subcategory, ean, tax_rate, status, markup_percentage,
  tags, thumbnail, created_at, approved_at, approved_by, medusa_product_id
) VALUES
(
  'proposal_05', 'seller_01',
  'Aceite Oliva Virgen Extra 1L',
  'Aceite de oliva virgen extra primera prensada en frío',
  8.50, 1, 'cat_alimentacion', 'Aceites', '8412345678905', 10.00, 'approved', 15.00,
  ARRAY['aceite', 'oliva', 'virgen extra'],
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
  '2026-08-15 09:00:00', '2026-08-16 10:00:00', 'user_admin_01', 'prod_medusa_01'
),
(
  'proposal_06', 'seller_02',
  'Galletas Chocolate 200g - Pack 3 uds',
  'Pack de 3 paquetes de galletas con chips de chocolate',
  4.20, 3, 'cat_alimentacion', 'Galletas', '8412345678906', 10.00, 'approved', NULL,
  ARRAY['galletas', 'chocolate'],
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
  '2026-08-14 11:00:00', '2026-08-15 09:30:00', 'user_admin_01', 'prod_medusa_02'
),
(
  'proposal_07', 'seller_03',
  'Pantalón Trabajo Azul - Pack 2 uds',
  'Pack de 2 pantalones de trabajo resistentes',
  35.00, 2, 'cat_textil', 'Pantalones', '8412345678907', 21.00, 'approved', 22.00,
  ARRAY['pantalón', 'trabajo'],
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
  '2026-08-13 14:00:00', '2026-08-14 11:00:00', 'user_admin_01', 'prod_medusa_03'
),
(
  'proposal_08', 'seller_04',
  'Bolígrafos Azules - Pack 10 uds',
  'Pack de 10 bolígrafos de tinta azul',
  1.50, 10, 'cat_oficina', 'Escritura', '8412345678908', 21.00, 'approved', NULL,
  ARRAY['bolígrafos', 'azules'],
  'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400',
  '2026-08-10 10:00:00', '2026-08-11 15:00:00', 'user_admin_01', 'prod_medusa_04'
);

-- RECHAZADOS (2 productos)
INSERT INTO custom_product_proposals (
  id, seller_id, title, description, base_price, units_per_pack,
  category_id, subcategory, ean, tax_rate, status, rejection_reason,
  tags, thumbnail, created_at, rejected_at, rejected_by
) VALUES
(
  'proposal_09', 'seller_02',
  'Chocolate Negro 100g',
  'Tableta de chocolate negro 85% cacao',
  3.50, 1, 'cat_alimentacion', 'Chocolate', '8412345678909', 10.00, 'rejected',
  'Precio base muy alto comparado con competencia (precio sugerido: €2.80)',
  ARRAY['chocolate', 'negro'],
  'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
  '2026-08-12 09:00:00', '2026-08-13 10:00:00', 'user_admin_01'
),
(
  'proposal_10', 'seller_03',
  'Zapatos Seguridad T.42',
  'Zapatos de seguridad con puntera de acero',
  45.00, 1, 'cat_calzado', 'Seguridad', '8412345678910', 21.00, 'rejected',
  'Falta certificación CE requerida para calzado de seguridad',
  ARRAY['zapatos', 'seguridad'],
  'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400',
  '2026-08-11 14:00:00', '2026-08-12 09:00:00', 'user_admin_01'
);
```

---

### Seed 4: Producto con Variantes (JSON)

```sql
-- Producto con 2 variantes (tallas)
INSERT INTO custom_product_proposals (
  id, seller_id, title, description, base_price, units_per_pack,
  category_id, subcategory, tax_rate, status, variants, created_at
) VALUES
(
  'proposal_11', 'seller_03',
  'Pantalón Hombre Marino',
  'Pantalón de trabajo resistente con bolsillos reforzados',
  0, 1, -- base_price = 0 cuando hay variantes
  'cat_textil', 'Pantalones', 21.00, 'pending_approval',
  '[
    {
      "title": "Talla 40",
      "sku": "PANT-H-MAR-40",
      "base_price": 18.50,
      "inventory_quantity": 50,
      "options": {"Talla": "40", "Color": "Marino"}
    },
    {
      "title": "Talla 42",
      "sku": "PANT-H-MAR-42",
      "base_price": 18.50,
      "inventory_quantity": 75,
      "options": {"Talla": "42", "Color": "Marino"}
    },
    {
      "title": "Talla 44",
      "sku": "PANT-H-MAR-44",
      "base_price": 18.50,
      "inventory_quantity": 60,
      "options": {"Talla": "44", "Color": "Marino"}
    }
  ]'::jsonb,
  '2026-08-21 09:00:00'
);

-- Query para validar variantes:
SELECT 
  id,
  title,
  jsonb_array_length(variants) as variants_count,
  jsonb_array_elements(variants)->>'sku' as variant_skus
FROM custom_product_proposals
WHERE id = 'proposal_11';
```

---

### Seed 5: Markup History

```sql
-- Historial de cambios de markup
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

## 🧪 Testing Queries

### Test 1: Verify Indexes

```sql
-- Ver todos los índices de custom_product_proposals
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'custom_product_proposals'
ORDER BY indexname;
```

---

### Test 2: Performance Test (Explain Analyze)

```sql
-- Test performance de query principal
EXPLAIN ANALYZE
SELECT 
  p.*,
  s.name as seller_name
FROM custom_product_proposals p
INNER JOIN sellers s ON s.id = p.seller_id
WHERE p.status = 'pending_approval'
ORDER BY p.created_at DESC
LIMIT 50;

-- Debe usar: idx_proposals_status_created
```

---

### Test 3: Count Products by Status

```sql
-- Verificar distribución de productos
SELECT 
  status,
  COUNT(*) as count,
  ROUND(AVG(base_price), 2) as avg_price
FROM custom_product_proposals
GROUP BY status;

-- Expected output:
-- status             | count | avg_price
-- -------------------+-------+-----------
-- pending_approval   |   4   |  6.00
-- approved           |   4   |  12.30
-- rejected           |   2   |  24.25
```

---

### Test 4: Validate Variants JSON

```sql
-- Verificar productos con variantes válidas
SELECT 
  id,
  title,
  jsonb_array_length(variants) as variants_count,
  (SELECT COUNT(DISTINCT v->>'sku') FROM jsonb_array_elements(variants) v) as unique_skus
FROM custom_product_proposals
WHERE variants IS NOT NULL
  AND jsonb_array_length(variants) > 0;

-- Validar que variants_count = unique_skus (SKUs únicos)
```

---

## 🔄 Rollback Scripts

### Rollback Migration 003

```sql
DROP TABLE IF EXISTS seller_markup_history CASCADE;
```

### Rollback Migration 002

```sql
ALTER TABLE sellers DROP COLUMN IF EXISTS global_markup_percentage;
DROP INDEX IF EXISTS idx_sellers_markup;
```

### Rollback Migration 001

```sql
DROP TABLE IF EXISTS custom_product_proposals CASCADE;
```

---

## 📝 Notas Finales

### Consideraciones de Performance

1. **Índices GIN para arrays:** Requiere `pg_trgm` extension
2. **JSONB para variantes:** Más eficiente que JSON para queries
3. **Triggers automáticos:** Pueden afectar performance en bulk inserts
4. **Paginación obligatoria:** Siempre usar `LIMIT` + `OFFSET`

### Seguridad

1. **Prepared Statements:** Usar `$1, $2` siempre (prevenir SQL injection)
2. **Foreign Keys:** Cascade deletes configurado correctamente
3. **Constraints:** Validaciones en DB + API layer (doble capa)

### Mantenimiento

1. **Vacuum regular:** `VACUUM ANALYZE custom_product_proposals;`
2. **Monitor query performance:** `pg_stat_statements` extension
3. **Archive old data:** Mover productos > 1 año a tabla histórica

---

**Documento generado:** 21 Agosto 2026  
**Versión:** 1.0  
**PostgreSQL Version:** 14+
