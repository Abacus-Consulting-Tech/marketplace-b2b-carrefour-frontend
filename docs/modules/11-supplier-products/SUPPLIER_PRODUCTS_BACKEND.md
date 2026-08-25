# Supplier Products - Backend Implementation Guide

**Módulo**: Gestión de Productos del Proveedor  
**Estado Frontend**: ✅ Completado (25/08/2026)  
**Prioridad Backend**: Alta - Necesario para flujo completo

---

## 📋 Resumen Ejecutivo

Sistema que permite a los proveedores:
- Crear y gestionar sus productos
- Proponer productos para aprobación de admin
- Cargar productos masivamente vía CSV/Excel
- Gestionar imágenes de productos
- Ver estado de aprobación

**Flujo**: Vendor crea → Admin aprueba → Producto disponible en catálogo

---

## 🗄️ Modelo de Datos

### Product (extends Medusa Product)
```typescript
{
  id: string;
  title: string;
  description: string;
  sku: string;
  cost_price: number; // precio de coste (centavos)
  suggested_price: number; // precio sugerido por vendor (centavos)
  markup_percentage: number; // markup del vendor
  final_price: number; // precio final con markup (centavos)
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  seller_id: string; // ID del vendor/seller
  rejection_reason?: string;
  variants: ProductVariant[];
  images: ProductImage[];
  categories: string[];
  tags: string[];
  metadata: {
    pack_size?: number;
    min_order_quantity?: number;
    delivery_time_days?: number;
  };
  created_at: Date;
  updated_at: Date;
  approved_at?: Date;
  approved_by?: string; // admin_id
}
```

---

## 🔌 Endpoints API

### 1. GET /vendor/products
**Descripción**: Listar productos del proveedor autenticado

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
```
?status=pending_approval&search=polo&page=1&limit=20
```

**Response 200**:
```json
{
  "products": [
    {
      "id": "prod_01HMYB7Z8WC9K2N5J4X6P7Q8R9",
      "title": "Polo Corporativo Carrefour",
      "description": "Polo de alta calidad con logo bordado",
      "sku": "POLO-CRF-001",
      "cost_price": 1200,
      "suggested_price": 1850,
      "markup_percentage": 54,
      "final_price": 1850,
      "status": "pending_approval",
      "seller_id": "seller_xxx",
      "variants": [
        {
          "id": "variant_xxx",
          "title": "Talla S",
          "sku": "POLO-CRF-001-S",
          "inventory_quantity": 100,
          "prices": [
            {
              "amount": 1850,
              "currency_code": "eur",
              "region_id": "reg_01M0AAYKP7T4XSM0PWRYHQF0BE"
            }
          ]
        }
      ],
      "images": [
        {
          "id": "img_xxx",
          "url": "https://storage.example.com/polo-s.jpg"
        }
      ],
      "created_at": "2026-08-25T10:00:00Z",
      "updated_at": "2026-08-25T10:00:00Z"
    }
  ],
  "count": 25,
  "limit": 20,
  "offset": 0
}
```

**Filtros**:
- `status`: Filtrar por estado
- `search`: Buscar en title, description, SKU
- `page`: Número de página (default: 1)
- `limit`: Items por página (default: 20, max: 100)

---

### 2. POST /vendor/products
**Descripción**: Crear nuevo producto

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "title": "Nuevo Producto",
  "description": "Descripción detallada",
  "sku": "SKU-UNIQUE-001",
  "cost_price": 1000,
  "suggested_price": 1500,
  "status": "draft",
  "variants": [
    {
      "title": "Talla S",
      "sku": "SKU-001-S",
      "inventory_quantity": 100,
      "prices": [
        {
          "amount": 1500,
          "currency_code": "eur",
          "region_id": "reg_01M0AAYKP7T4XSM0PWRYHQF0BE"
        }
      ]
    }
  ],
  "categories": ["cat_clothing"],
  "tags": ["corporate", "polo"],
  "metadata": {
    "pack_size": 10,
    "min_order_quantity": 5,
    "delivery_time_days": 7
  }
}
```

**Response 201**:
```json
{
  "product": {
    "id": "prod_xxx",
    "title": "Nuevo Producto",
    ...resto de campos
  }
}
```

**Validaciones**:
- ✅ `sku` debe ser único
- ✅ `cost_price` < `suggested_price`
- ✅ `seller_id` se asigna automáticamente del token
- ✅ `title` requerido (min 3 chars)
- ✅ Al menos 1 variante
- ✅ Región EUR debe existir

**Errores**:
```json
// 400 Bad Request
{
  "error": "SKU already exists",
  "code": "DUPLICATE_SKU",
  "field": "sku"
}

// 422 Unprocessable Entity
{
  "errors": [
    {
      "field": "cost_price",
      "message": "Cost price must be less than suggested price"
    }
  ]
}
```

---

### 3. PATCH /vendor/products/:id
**Descripción**: Actualizar producto existente

**Restricción**: Solo productos en estado `draft` o `rejected`

**Body**: Campos parciales a actualizar
```json
{
  "title": "Título actualizado",
  "cost_price": 1200,
  "status": "pending_approval"
}
```

**Response 200**: Producto actualizado

**Errores**:
```json
// 403 Forbidden
{
  "error": "Cannot edit approved products",
  "code": "PRODUCT_APPROVED"
}

// 404 Not Found
{
  "error": "Product not found or not owned by seller",
  "code": "NOT_FOUND"
}
```

---

### 4. DELETE /vendor/products/:id
**Descripción**: Eliminar producto

**Restricción**: Solo productos en estado `draft` o `rejected`

**Response 200**:
```json
{
  "id": "prod_xxx",
  "deleted": true
}
```

---

### 5. POST /vendor/products/bulk-upload
**Descripción**: Carga masiva de productos vía CSV/Excel

**Headers**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body**:
```
file: (archivo CSV/Excel)
```

**Formato CSV**:
```csv
title,description,sku,cost_price,suggested_price,category,tags,pack_size,min_order,delivery_days
"Polo S","Polo talla S","POLO-S",1200,1850,"clothing","corporate,polo",10,5,7
"Polo M","Polo talla M","POLO-M",1200,1850,"clothing","corporate,polo",10,5,7
```

**Response 200**:
```json
{
  "created": 45,
  "failed": 5,
  "total": 50,
  "errors": [
    {
      "row": 3,
      "error": "SKU duplicado: POLO-S",
      "code": "DUPLICATE_SKU"
    },
    {
      "row": 12,
      "error": "cost_price inválido",
      "code": "INVALID_PRICE"
    }
  ],
  "products": [
    { "id": "prod_001", "title": "Polo S", "status": "draft" },
    ...
  ]
}
```

**Notas**:
- Procesar en background si > 100 productos
- Validar cada fila antes de insertar
- Retornar productos creados + errores detallados
- Asignar `seller_id` automáticamente

---

### 6. POST /vendor/products/:id/images
**Descripción**: Subir imágenes del producto

**Headers**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Body**:
```
images[]: (array de archivos)
```

**Restricciones**:
- Máximo 5 imágenes por producto
- Formatos: JPG, PNG, WebP
- Tamaño máximo: 5MB por imagen
- Dimensiones mínimas: 800x800px

**Response 200**:
```json
{
  "product": {
    "id": "prod_xxx",
    "images": [
      {
        "id": "img_xxx",
        "url": "https://cdn.example.com/products/xxx/image1.jpg",
        "metadata": {
          "size": 245678,
          "width": 1200,
          "height": 1200
        }
      }
    ]
  }
}
```

**Errores**:
```json
// 413 Payload Too Large
{
  "error": "Image size exceeds 5MB",
  "code": "IMAGE_TOO_LARGE"
}

// 415 Unsupported Media Type
{
  "error": "Invalid image format. Use JPG, PNG or WebP",
  "code": "INVALID_FORMAT"
}
```

---

## 🔄 Integración con Pricing Queue

Los productos del vendor se integran automáticamente con el sistema de aprobación:

### Flujo Completo:
```
1. Vendor crea producto → status: 'draft'
2. Vendor envía a revisión → PATCH status: 'pending_approval'
3. Producto aparece en /admin/products/pricing (cola de aprobación)
4. Admin revisa y decide:
   a) Aprobar → status: 'approved'
      - Producto visible en catálogo franquiciado
      - Final price calculado con markup del vendor
   b) Rechazar → status: 'rejected'
      - rejection_reason se guarda
      - Vendor puede ver razón y editar
```

### Endpoint de Admin para Aprobar:
```http
PATCH /admin/products/:id/approval
{
  "status": "approved", // o "rejected"
  "rejection_reason": "Precio muy alto", // solo si rejected
  "final_markup": 50 // override del markup si necesario
}
```

---

## 🛡️ Permisos y Seguridad

### Middleware de Autenticación:
```javascript
// Verificar que el usuario es un vendor
if (req.user.role !== 'vendor') {
  return res.status(403).json({ error: 'Vendors only' });
}

// Verificar que el producto pertenece al vendor
const product = await Product.findOne({ 
  id: req.params.id,
  seller_id: req.user.seller_id 
});

if (!product) {
  return res.status(404).json({ error: 'Not found' });
}
```

### Reglas de Negocio:
1. Vendor solo ve sus propios productos
2. Vendor no puede editar productos `approved`
3. Vendor puede eliminar solo productos `draft` o `rejected`
4. SKU debe ser único globalmente
5. Markup se calcula automáticamente: `((suggested_price - cost_price) / cost_price) * 100`

---

## 📊 SQL Schema (extensiones a Medusa)

```sql
-- Tabla adicional para metadata del vendor
CREATE TABLE vendor_products (
  id VARCHAR PRIMARY KEY,
  product_id VARCHAR NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  seller_id VARCHAR NOT NULL,
  cost_price INTEGER NOT NULL,
  suggested_price INTEGER NOT NULL,
  markup_percentage DECIMAL(5,2),
  status VARCHAR CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected')),
  rejection_reason TEXT,
  approved_at TIMESTAMP,
  approved_by VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id)
);

-- Índices
CREATE INDEX idx_vendor_products_seller ON vendor_products(seller_id);
CREATE INDEX idx_vendor_products_status ON vendor_products(status);
CREATE INDEX idx_vendor_products_product ON vendor_products(product_id);

-- Trigger para calcular markup
CREATE OR REPLACE FUNCTION calculate_markup()
RETURNS TRIGGER AS $$
BEGIN
  NEW.markup_percentage := ((NEW.suggested_price - NEW.cost_price)::DECIMAL / NEW.cost_price) * 100;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_vendor_product_insert_or_update
  BEFORE INSERT OR UPDATE ON vendor_products
  FOR EACH ROW
  EXECUTE FUNCTION calculate_markup();
```

---

## 🧪 Testing

### Casos de Prueba Recomendados:

1. **Crear producto exitosamente**
2. **Crear producto con SKU duplicado** → Error 400
3. **Crear producto con cost > suggested** → Error 422
4. **Actualizar producto aprobado** → Error 403
5. **Eliminar producto aprobado** → Error 403
6. **Carga masiva con 50 productos** → 45 OK, 5 errores
7. **Subir imagen > 5MB** → Error 413
8. **Subir 6 imágenes** → Error 400 (máximo 5)

---

**Documentado por**: Frontend Team  
**Fecha**: 25 de Agosto de 2026  
**Próximos pasos**: Implementación backend + integración con Mercurjs
