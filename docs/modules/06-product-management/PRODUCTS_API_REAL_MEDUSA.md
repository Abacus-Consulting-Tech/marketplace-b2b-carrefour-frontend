# Products API - Medusa Real Backend (Corregido)

**Fecha**: 25 Agosto 2026  
**Backend**: https://marketplace-b2b-backend-dev.onrender.com  
**Basado en**: Pruebas reales en Postman

---

## 📊 Endpoints que FUNCIONAN

### 1️⃣ GET /admin/products/:id - Detalle de producto ✅

**Request**:
```http
GET /admin/products/prod_01M0A8ACRV1WQVEHBWXEB3H2MM
Authorization: Bearer {token}
```

**Response 200 OK**:
```json
{
  "product": {
    "id": "prod_01M0A8ACRV1WQVEHBWXEB3H2MM",
    "title": "Polo Corporativo Carrefour",
    "subtitle": null,
    "status": "published",
    "description": "Polo manga corta con bordado corporativo...",
    "handle": "uni-001-polo-corporativo-carrefour",
    "thumbnail": "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
    "metadata": {
      "sell_unit": "pack",
      "pack_label": "Pack 12 uds",
      "units_per_pack": 12
    },
    "categories": [
      {
        "id": "pcat_01M0A89521S1FAFP5CG3D68YTK",
        "name": "Uniformes",
        "handle": "uniformes"
      }
    ],
    "variants": [
      {
        "id": "variant_01M0A8AHN59HCS3VW4AZKDTWRT",
        "title": "Default",
        "sku": "UNI-001",
        "manage_inventory": false,
        "allow_backorder": false,
        "variant_rank": 0
      }
    ],
    "created_at": "2026-08-18T10:57:48.834Z",
    "updated_at": "2026-08-18T14:29:04.890Z"
  }
}
```

**Notas**:
- ✅ Estructura: `{ product: {...} }` (singular, no array)
- ⚠️ Variantes NO incluyen `prices` (necesitan expansión adicional)
- ⚠️ Variantes NO incluyen `inventory_quantity` (gestión separada)
- ✅ Categories incluidas por defecto
- ✅ Metadata disponible

---

### 2️⃣ DELETE /admin/products/:id - Eliminar producto ✅

**Request**:
```http
DELETE /admin/products/prod_01M0A8ACRV1WQVEHBWXEB3H2MM
Authorization: Bearer {token}
```

**Response 200 OK**:
```json
{
  "id": "prod_01M0A8ACRV1WQVEHBWXEB3H2MM",
  "object": "product",
  "deleted": true
}
```

**Notas**:
- ✅ Funciona perfectamente
- ✅ Soft delete automático (deleted_at se marca)

---

### 3️⃣ GET /admin/products - Listar productos ⚠️ REQUIERE AJUSTES

**❌ NO FUNCIONA**:
```http
GET /admin/products?status=published
```
**Error**:
```json
{
  "type": "invalid_data",
  "message": "Expected type: 'array' for field 'status', got: 'published'"
}
```

**✅ CORRECTO**:
```http
GET /admin/products?status[]=published&limit=20&offset=0
```

**Filtros corregidos**:
```typescript
// ❌ INCORRECTO
?status=published
?category_id=cat_123

// ✅ CORRECTO (Medusa espera arrays)
?status[]=published
?status[]=draft          // Múltiples valores
?category_id[]=cat_123
```

**Response 200 OK**:
```json
{
  "products": [
    {
      "id": "prod_01M0A8ACRV1WQVEHBWXEB3H2MM",
      "title": "Polo Corporativo Carrefour",
      // ... mismo formato que GET /:id
    }
  ],
  "count": 7,
  "offset": 0,
  "limit": 20
}
```

**Query parameters**:
```typescript
{
  q?: string;              // Búsqueda texto
  status[]?: string[];     // Array de estados (¡atención a los corchetes!)
  limit?: number;          // Default: 10
  offset?: number;         // Default: 0
}
```

---

## ❌ Endpoints con ERRORES

### 4️⃣ GET con expand parameter ❌

**❌ NO FUNCIONA**:
```http
GET /admin/products/prod_123?expand=variants,categories,supplier
```
**Error**:
```json
{
  "type": "invalid_data",
  "message": "Unrecognized fields: 'expand'"
}
```

**✅ CORRECTO (Medusa v2 usa `fields`)**:
```http
GET /admin/products/prod_123?fields=+variants,+categories
```

**Sintaxis de fields**:
- `+field` = Añadir campo adicional
- `-field` = Excluir campo
- Sin + ni - = Solo esos campos

**Nota importante**: 
- Medusa v2 NO usa `expand`
- Usa `fields` con sintaxis especial
- `supplier` NO es campo de Medusa (custom metadata)

---

### 5️⃣ POST /admin/products - Crear producto ❌

**Request enviado**:
```json
{
  "title": "Guantes Nitrilo Profesional",
  "subtitle": "Pack de 100 unidades",
  "description": "Guantes de nitrilo de alta resistencia...",
  "handle": "guantes-nitrilo-profesional",
  "status": "draft",
  "thumbnail": "https://images.unsplash.com/photo-...",
  "images": ["https://images.unsplash.com/photo-..."],
  "supplier_id": "sup_003",
  "categories": ["cat_004"],
  "tags": ["protección", "higiene"],
  "variants": [
    {
      "title": "Talla M",
      "sku": "GUAN-NIT-M",
      "inventory_quantity": 200,
      "manage_inventory": true,
      "prices": [...]
    }
  ]
}
```

**Error**:
```json
{
  "code": "unknown_error",
  "type": "unknown_error",
  "message": "An unknown error occurred."
}
```

**Problemas posibles**:
1. ❌ `images` debe ser estructura de objetos, no URLs simples
2. ❌ `supplier_id` NO es campo nativo (debe ir en metadata)
3. ❌ `categories` debe ser array de objetos con `id`, no strings simples
4. ❌ `tags` estructura incorrecta
5. ❌ `variants.prices` estructura incorrecta para Medusa

**✅ ESTRUCTURA CORRECTA para Medusa** (pendiente confirmar):
```json
{
  "title": "Guantes Nitrilo Profesional",
  "description": "Guantes de nitrilo...",
  "status": "draft",
  "thumbnail": "https://images.unsplash.com/photo-...",
  "metadata": {
    "supplier_id": "sup_003",
    "units_per_pack": 100,
    "min_order_quantity": 5
  },
  "categories": [
    { "id": "pcat_01M0A89521S1FAFP5CG3D68YTK" }
  ],
  "variants": [
    {
      "title": "Talla M",
      "sku": "GUAN-NIT-M",
      "manage_inventory": true,
      "options": [
        {
          "option_id": "opt_size",
          "value": "M"
        }
      ]
    }
  ]
}
```

**NOTA**: Los precios se gestionan separadamente en Medusa v2 (pricing module)

---

### 6️⃣ POST /admin/products/:id - Actualizar producto ❌

**Request enviado**:
```json
{
  "title": "Polo Carrefour Premium",
  "description": "Nueva descripción actualizada",
  "status": "published",
  "categories": ["cat_001", "cat_002"],
  "tags": ["corporativo", "premium"],
  "metadata": {
    "min_order_quantity": 20,
    "lead_time_days": 5
  }
}
```

**Error**:
```json
{
  "code": "unknown_error",
  "type": "unknown_error",
  "message": "An unknown error occurred."
}
```

**Problemas**:
- Similar al CREATE
- `categories` y `tags` con estructura incorrecta

**✅ ESTRUCTURA CORRECTA**:
```json
{
  "title": "Polo Carrefour Premium",
  "description": "Nueva descripción actualizada",
  "status": "published",
  "metadata": {
    "min_order_quantity": 20,
    "lead_time_days": 5
  }
}
```

**Nota**: Categories y tags se actualizan con endpoints separados

---

### 7️⃣ POST /admin/variants/:id/inventory ❌ NO EXISTE

**Request**:
```http
POST /admin/variants/variant_01M0A8ATK477GEPA69MA4QH3HG/inventory
```

**Error**:
```html
Cannot POST /admin/variants/variant_01M0A8ATK477GEPA69MA4QH3HG/inventory
```

**Solución**: Medusa v2 usa **Inventory Module** separado

**✅ Alternativas**:

**Opción A: Actualizar variante directamente**
```http
POST /admin/products/:product_id/variants/:variant_id
Content-Type: application/json

{
  "inventory_quantity": 75
}
```

**Opción B: Usar Inventory Items API (más complejo)**
```http
POST /admin/inventory-items/:inventory_item_id/location-levels
```

**Recomendación**: Usar Opción A (más simple para MVP)

---

### 8️⃣ POST /admin/products/bulk-update-status ❌ NO EXISTE

**Request**:
```json
{
  "product_ids": ["prod_123", "prod_456"],
  "status": "published"
}
```

**Error**:
```json
{
  "type": "invalid_data",
  "message": "Unrecognized fields: 'product_ids'"
}
```

**Confirmado**: NO es endpoint nativo de Medusa

**✅ Soluciones**:

**Opción A: Loop en frontend** (rápido, sin backend custom)
```typescript
for (const id of productIds) {
  await fetch(`/admin/products/${id}`, {
    method: 'POST',
    body: JSON.stringify({ status: 'published' })
  });
}
```

**Opción B: Batch API de Medusa** (si está disponible)
```http
POST /admin/batch/products
```

**Opción C: Custom endpoint backend** (óptimo)
```http
POST /admin/custom/products/bulk-status
```

---

### 9️⃣ GET /admin/products/stats ❌ NO EXISTE

**Request**:
```http
GET /admin/products/stats
```

**Error**:
```json
{
  "type": "not_found",
  "message": "Product with id stats was not found"
}
```

**Problema**: Medusa interpreta "stats" como ID de producto

**Confirmado**: NO es endpoint nativo

**✅ Soluciones**:

**Opción A: Calcular en frontend**
```typescript
const { products } = await fetch('/admin/products?limit=1000');
const stats = {
  total: products.length,
  by_status: products.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {})
};
```

**Opción B: Custom endpoint backend**
```http
GET /admin/custom/products/stats
```

---

## 📋 Resumen de Correcciones Necesarias

### Frontend debe ajustar:

1. **Query params con arrays**:
   ```typescript
   // ❌ Antes
   ?status=published
   
   // ✅ Ahora
   ?status[]=published
   ```

2. **Usar `fields` en lugar de `expand`**:
   ```typescript
   // ❌ Antes
   ?expand=variants,categories
   
   // ✅ Ahora
   ?fields=+variants,+categories
   ```

3. **Estructura response**:
   ```typescript
   // GET /:id retorna:
   { product: {...} }  // singular
   
   // GET / retorna:
   { products: [...] }  // plural
   ```

4. **Crear producto - estructura simplificada**:
   - Mover `supplier_id` a `metadata`
   - Simplificar `categories` y `tags`
   - Gestionar `prices` separadamente

5. **Actualizar inventario**:
   ```http
   POST /admin/products/:product_id/variants/:variant_id
   Body: { "inventory_quantity": 100 }
   ```

6. **Bulk operations - hacer loop**:
   ```typescript
   for (const id of ids) {
     await updateProduct(id, { status });
   }
   ```

7. **Stats - calcular en frontend**:
   ```typescript
   const stats = calculateStats(products);
   ```

---

## 🎯 Plan de Implementación Corregido

### Fase 1: Endpoints nativos que funcionan (1 hora)

1. ✅ GET /admin/products/:id
2. ✅ DELETE /admin/products/:id
3. ⚠️ GET /admin/products (ajustar query params)

### Fase 2: Endpoints nativos con ajustes (2 horas)

4. ⚠️ POST /admin/products (simplificar estructura)
5. ⚠️ POST /admin/products/:id (simplificar estructura)
6. ⚠️ POST /admin/products/:id/variants/:id (inventario)

### Fase 3: Workarounds frontend (1 hora)

7. 🔄 Bulk update → Loop en frontend
8. 🔄 Stats → Calcular en frontend

### Total: ~4 horas de desarrollo frontend

---

## 🔧 Siguiente Paso

**Probar CREATE correcto**:

```bash
curl -X POST "https://marketplace-b2b-backend-dev.onrender.com/admin/products" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Product Simple",
    "description": "Test description",
    "status": "draft",
    "metadata": {
      "supplier_id": "test_supplier"
    }
  }'
```

Si esto funciona, luego añadir:
- Categories (con estructura correcta)
- Variants (sin prices inicialmente)
- Metadata adicional

---

**Documento creado**: 25/08/2026  
**Próximo update**: Después de probar CREATE correcto
