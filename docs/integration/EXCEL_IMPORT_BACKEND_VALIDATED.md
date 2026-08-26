# Manual Frontend: Carga masiva de productos por Excel

**Fecha:** 2026-08-21
**Version:** 1.0
**Backend local:** `http://localhost:9001`
**Backend DEV:** `https://marketplace-b2b-backend-dev.onrender.com`

---

## 1. Objetivo funcional

Esta funcionalidad permite cargar productos de proveedor desde un Excel y procesarlos como un job asincrono.

El caso de uso esperado es B2B para tiendas Carrefour Express franquiciadas: los productos no son el surtido que compra el cliente final, sino suministros, equipamiento, uniformes, limpieza, seguridad, tecnologia, embalaje, senalizacion y servicios necesarios para operar la tienda.

Flujo resumido:

```text
Admin o proveedor autenticado
  descarga plantilla Excel
  rellena productos y variantes
  sube archivo
Backend
  crea job queued
  valida filas y categorias
  ingesta all-or-nothing
  crea productos en estado proposed
Frontend
  muestra progreso del job
  muestra errores por linea o exito
  enlaza con revision/tarificacion existente
```

---

## 2. Que debe montar el frontend

### 2.1 Pantalla proveedor: carga masiva

Ruta sugerida: area proveedor, seccion productos, accion `Importar Excel`.

Componentes minimos:

| Componente | Comportamiento |
|---|---|
| Boton descargar plantilla | Llama a `GET /vendor/custom/products/import/template` |
| Dropzone o selector de archivo | Acepta `.xlsx` y `.xls`; tamano maximo backend: 10 MB |
| Boton subir | Envia `multipart/form-data` a `POST /vendor/custom/products/import` |
| Panel de job | Muestra `queued`, `validating`, `ingesting`, `success`, `failed` |
| Tabla de errores | Muestra `line`, `column`, `reason`, `value` cuando falla |
| Resultado correcto | Muestra productos creados y CTA a “Mis productos” |

### 2.2 Pantalla admin: carga en nombre de proveedor

Ruta sugerida: backoffice admin, ficha de proveedor o gestion de catalogo.

Componentes adicionales:

| Componente | Comportamiento |
|---|---|
| Selector de proveedor | Debe aportar `seller_id` al upload |
| Boton descargar plantilla admin | Llama a `GET /admin/custom/products/import/template` |
| Historial de imports | Llama a `GET /admin/custom/products/import?seller_id=...` |
| Detalle de job | Llama a `GET /admin/custom/products/import/:id` |

### 2.3 Estados visuales recomendados

| Estado job | UI recomendada |
|---|---|
| `queued` | Archivo aceptado, esperando proceso |
| `validating` | Validando columnas, SKUs, precios y categorias |
| `ingesting` | Creando productos; bloquear doble envio |
| `success` | Mostrar `created_product_ids.length` y enlace a revision/tarificacion |
| `failed` | Mostrar errores por linea; permitir descargar/corregir Excel y reintentar |

No conviene simular progreso porcentual real: el backend expone `processed_rows`, pero el job puede completar rapido. Usa estados discretos y polling corto.

---

## 3. Autenticacion y seguridad

### Admin

```http
POST /auth/user/emailpass
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

Usar en endpoints admin:

```http
Authorization: Bearer <jwtToken>
```

El endpoint publico temporal `/custom/products/import` fue eliminado. Resultado esperado:

```http
POST /custom/products/import -> 404
GET /admin/custom/products/import sin token -> 401
```

### Proveedor

```http
POST /auth/member/emailpass
Content-Type: application/json

{
  "email": "seller@mercur.dev",
  "password": "supersecret"
}
```

Usar en endpoints vendor:

```http
Authorization: Bearer <sellerToken>
x-seller-id: sel_XXXXXXXXXXXXXXXX
```

---

## 4. Endpoints backend

### 4.1 Descargar plantilla admin

```http
GET /admin/custom/products/import/template
Authorization: Bearer <jwtToken>
```

Respuesta: archivo Excel `product-import-template.xlsx`.

La plantilla actual genera 100 productos de ejemplo x 4 variantes = 400 filas, distribuidos en 10 categorias B2B.

### 4.2 Descargar plantilla proveedor

```http
GET /vendor/custom/products/import/template
Authorization: Bearer <sellerToken>
x-seller-id: sel_XXXXXXXXXXXXXXXX
```

Respuesta: archivo Excel `product-import-template.xlsx`.

### 4.3 Subir Excel como admin

```http
POST /admin/custom/products/import
Authorization: Bearer <jwtToken>
Content-Type: multipart/form-data
```

Campos `form-data`:

| Campo | Tipo | Requerido | Descripcion |
|---|---:|:---:|---|
| `seller_id` | text | Si | Proveedor al que se asociaran los productos |
| `file` | file | Si | Excel `.xlsx` o `.xls` |

Respuesta `202`:

```json
{
  "job_id": "11c58552-3276-4807-bf69-1c61e14b3992",
  "status": "queued",
  "total_rows": 400,
  "status_url": "/admin/custom/products/import/11c58552-3276-4807-bf69-1c61e14b3992",
  "message": "Import queued"
}
```

### 4.4 Subir Excel como proveedor

```http
POST /vendor/custom/products/import
Authorization: Bearer <sellerToken>
x-seller-id: sel_XXXXXXXXXXXXXXXX
Content-Type: multipart/form-data
```

Campos `form-data`:

| Campo | Tipo | Requerido | Descripcion |
|---|---:|:---:|---|
| `file` | file | Si | Excel `.xlsx` o `.xls` |

El `seller_id` se obtiene del contexto autenticado del proveedor; no debe enviarlo el frontend.

### 4.5 Listar jobs admin

```http
GET /admin/custom/products/import?seller_id=sel_xxx&status=success&limit=20&offset=0
Authorization: Bearer <jwtToken>
```

Filtros opcionales:

| Query | Valores |
|---|---|
| `seller_id` | ID del proveedor |
| `status` | `queued`, `validating`, `ingesting`, `success`, `failed` |
| `limit` | 1 a 100 |
| `offset` | >= 0 |

### 4.6 Listar jobs proveedor

```http
GET /vendor/custom/products/import?status=failed&limit=20&offset=0
Authorization: Bearer <sellerToken>
x-seller-id: sel_XXXXXXXXXXXXXXXX
```

### 4.7 Detalle de job

Admin:

```http
GET /admin/custom/products/import/:id
Authorization: Bearer <jwtToken>
```

Proveedor:

```http
GET /vendor/custom/products/import/:id
Authorization: Bearer <sellerToken>
x-seller-id: sel_XXXXXXXXXXXXXXXX
```

Respuesta final correcta:

```json
{
  "job": {
    "id": "11c58552-3276-4807-bf69-1c61e14b3992",
    "seller_id": "sel_01...",
    "file_name": "Plantilla_ejemplo_proveedores_carga_productos.xlsx",
    "status": "success",
    "total_rows": 400,
    "processed_rows": 400,
    "errors": [],
    "result": {
      "created_product_ids": ["prod_01...", "prod_02..."]
    }
  }
}
```

Respuesta con errores:

```json
{
  "job": {
    "status": "failed",
    "processed_rows": 0,
    "errors": [
      {
        "line": 12,
        "column": "base_price",
        "reason": "Must be a decimal number > 0",
        "value": "0"
      }
    ]
  }
}
```

---

## 5. Contrato del Excel

Columnas esperadas por la plantilla:

| Columna Excel | Mapea a | Requerido |
|---|---|:---:|
| `Producto ID (mismo para variantes)` | Agrupa variantes del mismo producto | No |
| `Titulo producto *` / `Título producto *` | `title` | Si |
| `Descripcion` / `Descripción` | `description` | No |
| `Categoria general` / `Categoría general` | `category_name` | Recomendado |
| `Subcategoria` / `Subcategoría` | Solo informativo por ahora | No |
| `Marca` | `metadata.brand` | No |
| `SKU / Referencia *` | `variant.sku` | Si |
| `EAN / Codigo de barras` | `variant.metadata.ean` | No |
| `Variante` | `variant.title` | No |
| `Opcion 1`, `Valor 1` | Opcion de variante | No |
| `Opcion 2`, `Valor 2` | Opcion de variante | No |
| `Unidades por pack` | `metadata.units_per_pack` | No |
| `Precio proveedor (€) *` | `metadata.base_price` | Si |
| `IVA (%)` | `metadata.iva_percent` | No |
| `Stock` | `variant.metadata.stock_quantity` | No |
| `Imagen 1 URL` a `Imagen 5 URL` | `thumbnail` / `images` | No |

Reglas importantes:

- SKU obligatorio y unico dentro del Excel.
- Precio proveedor debe ser mayor que 0.
- `Producto ID` igual agrupa filas como variantes de un mismo producto.
- Si no hay `Producto ID`, el backend agrupa por titulo y categoria.
- El proceso es all-or-nothing: si una fila falla, no se crean productos.
- Los productos creados quedan en estado `proposed` y `pricing_status: pending_approval`.

---

## 6. Categorias soportadas

Categorias B2B principales para Carrefour Express:

- Suministros de Tienda
- Equipamiento
- Limpieza y Mantenimiento
- Uniformes y Ropa
- Seguridad e Higiene
- Articulos de Consumo Interno
- Embalaje y Logistica
- Senalizacion y Marketing Local
- Tecnologia y Comunicaciones
- Formacion y Servicios

Compatibilidad legacy de plantillas antiguas:

| Categoria Excel antigua | Categoria B2B usada |
|---|---|
| `Alimentacion` / `Alimentación` | Articulos de Consumo Interno |
| `Bebidas` | Articulos de Consumo Interno |
| `Limpieza` | Limpieza y Mantenimiento |
| `Uniformes` | Uniformes y Ropa |
| `Oficina` | Suministros de Tienda |
| `Hosteleria` / `Hostelería` | Embalaje y Logistica |

---

## 7. Polling recomendado

Despues del `POST`, guardar `job_id` y consultar detalle cada 1 o 2 segundos mientras el estado sea `queued`, `validating` o `ingesting`.

Pseudocodigo:

```ts
async function waitImportJob(jobId: string) {
  while (true) {
    const job = await api.getImportJob(jobId)
    if (job.status === "success" || job.status === "failed") {
      return job
    }
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }
}
```

Cancelar el polling al desmontar componente o cambiar de pantalla.

---

## 8. Errores a mostrar al usuario

| HTTP / estado job | Mensaje frontend sugerido |
|---|---|
| `401` | Sesion caducada o usuario sin permisos |
| `404` en `/custom/products/import` | Endpoint publico eliminado; usar admin o vendor autenticado |
| `failed` con errores por linea | Mostrar tabla de errores y CTA para corregir Excel |
| `file too large` | Archivo supera 10 MB |
| `Category name does not exist` | Categoria no existe; usar plantilla actualizada |
| `Duplicated SKU in excel` | SKU repetido dentro del archivo |

---

## 9. Preparacion backend necesaria

En entorno local/dev, ejecutar desde `packages/api`:

```bash
npm run seed:b2b-dev
```

Este seed:

- Asegura usuario admin local `admin@test.com` / `admin123` con `actor_id` correcto.
- Crea de forma idempotente la taxonomia B2B de Carrefour Express.
- Mantiene categorias legacy necesarias para Excel antiguos.

Tambien existe una plantilla local versionada para pruebas:

```text
docs/Plantilla_ejemplo_proveedores_carga_productos.xlsx
```

---

## 10. Validacion local realizada

Validaciones ejecutadas el 2026-08-21:

- `npx tsc -p tsconfig.json --noEmit`: OK.
- Import Excel de 400 filas: `success`.
- Productos creados: 100.
- Variantes creadas: 400.
- Distribucion: 10 productos por cada una de las 10 categorias B2B.
- `/custom/products/import`: 404.
- `/admin/custom/products/import` sin token: 401.
- `/admin/custom/products/import` con token admin: 200.