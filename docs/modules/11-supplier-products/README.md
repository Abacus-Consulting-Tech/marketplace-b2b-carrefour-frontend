# Módulo 11: Supplier Products (CRUD de Productos del Proveedor)

## Estado
✅ **Completado** - Frontend funcional con mock data (25/08/2026)

## Descripción
Sistema completo que permite a los proveedores gestionar sus propios productos desde el panel vendor. Incluye CRUD completo, carga masiva de productos, y gestión de imágenes.

## Documentos Backend
- [SUPPLIER_PRODUCTS_BACKEND.md](SUPPLIER_PRODUCTS_BACKEND.md) - Especificaciones completas para backend

## Resumen Técnico

### Frontend Implementado
- **8 archivos** creados (~1,634 líneas de código)
- **CRUD completo**: Listar, Crear, Editar, Eliminar productos
- **Carga masiva**: Upload CSV/Excel para crear múltiples productos
- **Gestión de imágenes**: Subir y gestionar imágenes de productos
- **Estados**: draft, pending_approval, approved, rejected

### Features Principales
1. **Lista de productos del proveedor**
   - Filtros por estado
   - Búsqueda por nombre/SKU
   - Estadísticas (total, pendientes, aprobados)
   - Badges de estado con colores

2. **Formulario de propuesta**
   - Datos básicos (nombre, descripción, SKU)
   - Precios (coste base, precio sugerido)
   - Gestión de variantes
   - Categorías y tags
   - Configuración B2B (packs, mínimos)

3. **Carga masiva**
   - Upload CSV/Excel
   - Template descargable
   - Validación de formato
   - Preview antes de importar

4. **Sistema de aprobación**
   - Integrado con `/admin/products/pricing`
   - Preview de precio final con markup
   - Flujo: draft → pending_approval → approved/rejected

## Archivos Frontend

### Páginas (576 líneas)
```
src/app/(supplier)/supplier/products/
├── page.tsx (46 líneas) - Lista de productos
├── [id]/page.tsx (447 líneas) - Detalle producto
├── new/page.tsx (46 líneas) - Crear producto
└── bulk-upload/page.tsx (37 líneas) - Carga masiva
```

### Componentes (1,058 líneas)
```
src/components/supplier/
├── ProductsList.tsx (417 líneas) - Lista con filtros
├── ProductProposalForm.tsx (342 líneas) - Formulario crear/editar
├── ProductsUploadForm.tsx (257 líneas) - Carga masiva
└── ProductStatusBadge.tsx (42 líneas) - Badge de estado
```

## Endpoints API Necesarios

### 1. Listar Productos del Proveedor
```http
GET /vendor/products
Authorization: Bearer {token}

Query Params:
- status?: 'draft' | 'pending_approval' | 'approved' | 'rejected'
- search?: string
- page?: number
- limit?: number

Response 200:
{
  "products": [
    {
      "id": "prod_xxx",
      "title": "Producto X",
      "description": "...",
      "sku": "SKU-001",
      "cost_price": 1000, // centavos
      "suggested_price": 1500,
      "markup_percentage": 50,
      "final_price": 1500, // con markup aplicado
      "status": "pending_approval",
      "variants": [...],
      "images": [...],
      "seller_id": "seller_xxx",
      "created_at": "2026-08-25T10:00:00Z",
      "updated_at": "2026-08-25T10:00:00Z"
    }
  ],
  "count": 25,
  "limit": 20,
  "offset": 0
}
```

### 2. Crear Producto
```http
POST /vendor/products
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "title": "Nuevo Producto",
  "description": "Descripción del producto",
  "sku": "SKU-001",
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
          "region_id": "reg_xxx"
        }
      ]
    }
  ],
  "categories": ["cat_xxx"],
  "tags": ["tag1", "tag2"],
  "metadata": {
    "pack_size": 10,
    "min_order_quantity": 5,
    "delivery_time_days": 7
  }
}

Response 201:
{
  "product": { ...producto creado }
}
```

### 3. Actualizar Producto
```http
PATCH /vendor/products/:id
Authorization: Bearer {token}
Content-Type: application/json

Body: (campos a actualizar)
{
  "title": "Producto actualizado",
  "cost_price": 1200,
  ...
}

Response 200:
{
  "product": { ...producto actualizado }
}
```

### 4. Eliminar Producto
```http
DELETE /vendor/products/:id
Authorization: Bearer {token}

Response 200:
{
  "id": "prod_xxx",
  "deleted": true
}
```

### 5. Carga Masiva de Productos
```http
POST /vendor/products/bulk-upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
- file: (CSV/Excel file)

CSV Format:
title,description,sku,cost_price,suggested_price,category,tags,pack_size
"Producto 1","Desc 1","SKU-001",1000,1500,"Categoría A","tag1,tag2",10
"Producto 2","Desc 2","SKU-002",2000,3000,"Categoría B","tag3,tag4",20

Response 200:
{
  "created": 15,
  "failed": 2,
  "errors": [
    {
      "row": 3,
      "error": "SKU duplicado: SKU-003"
    }
  ],
  "products": [...]
}
```

### 6. Subir Imágenes de Producto
```http
POST /vendor/products/:id/images
Authorization: Bearer {token}
Content-Type: multipart/form-data

Body:
- images[]: (archivos de imagen)

Response 200:
{
  "product": {
    ...
    "images": [
      {
        "id": "img_xxx",
        "url": "https://...",
        "metadata": {}
      }
    ]
  }
}
```

## Integración con Pricing Queue

Los productos creados por proveedores entran automáticamente en el sistema de aprobación:

1. Proveedor crea producto → `status: 'draft'`
2. Proveedor envía a revisión → `status: 'pending_approval'`
3. Admin revisa en `/admin/products/pricing`
4. Admin aprueba/rechaza → `status: 'approved' | 'rejected'`
5. Si aprobado → producto aparece en catálogo franquiciado

## Mock Data
- 7 productos de ejemplo con diferentes estados
- Vinculados a 5 proveedores mock
- Incluye variantes, precios y configuración B2B

## Notas para Backend
1. **Permisos**: Solo el proveedor dueño puede editar sus productos
2. **Validaciones**:
   - SKU debe ser único
   - cost_price < suggested_price
   - Verificar que seller_id corresponde al usuario autenticado
3. **Carga masiva**:
   - Validar formato CSV
   - Procesar en background si son muchos productos
   - Retornar errores detallados por fila
4. **Imágenes**:
   - Máximo 5 imágenes por producto
   - Formatos: JPG, PNG, WebP
   - Tamaño máximo: 5MB por imagen

---

**Fecha de Completado**: 25 de Agosto de 2026  
**Desarrollador Frontend**: Frontend Team  
**Estado Backend**: Pendiente de implementación
