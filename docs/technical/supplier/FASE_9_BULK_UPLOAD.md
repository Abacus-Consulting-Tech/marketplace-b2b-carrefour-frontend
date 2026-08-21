# Fase 9: Carga Masiva CSV - Bulk Upload

**Estado**: ✅ Completado  
**Modo**: Mock (Backend Ready: false)  
**Fecha**: 21 Agosto 2026  
**Ruta**: `/supplier/products/bulk-upload`

---

## 📋 Descripción General

La **Carga Masiva CSV** permite a los proveedores importar múltiples productos simultáneamente desde archivos CSV, con validación automática, vista previa de datos y reporte detallado de resultados. **Soporta productos con variantes** (múltiples SKUs del mismo producto).

### Características Implementadas

1. **Subida de Archivos**
   - Soporte para CSV (.csv)
   - Descarga de plantilla con formato correcto (22 columnas)
   - Drag & drop y selector de archivos
   - Guía de formato inline

2. **Parser y Validación**
   - Parsing de 22 columnas según plantilla oficial
   - **Agrupación automática por Producto ID**
   - **Detección de variantes** (múltiples filas con mismo Producto ID)
   - Validación de producto completo con todas sus variantes
   - Detección de errores por campo
   - Validación de SKUs únicos por variante

3. **Vista Previa con Tabs**
   - Tab "Todos" - Todos los productos encontrados
   - Tab "Válidos" - Solo productos sin errores
   - Tab "Errores" - Solo productos con problemas
   - Tabla con Producto ID, título, número de variantes, precio, estado
   - Display de categoría y subcategoría

4. **Importación con Progreso**
   - Barra de progreso en tiempo real
   - Importación secuencial con delay anti-saturación
   - Alert de advertencia (no cerrar ventana)
   - Manejo individual de errores por producto
   - **Un solo producto con N variantes se importa como 1 request**

5. **Reporte de Resultados**
   - Resumen con éxitos vs errores
   - Tabla detallada producto por producto
   - Estado visual (badge verde/rojo)
   - Mensajes específicos indicando número de variantes
   - Opciones para importar más o ver productos

---

## � Estructura del CSV (22 Columnas)

El archivo CSV debe contener exactamente **22 columnas** en el siguiente orden:

### Columnas del Producto Principal

| # | Columna | Tipo | Obligatorio | Descripción | Ejemplo |
|---|---------|------|-------------|-------------|---------|
| 1 | **Producto ID** | String | ✅ Sí | Código común para agrupar todas las variantes del mismo producto. Si un producto tiene múltiples tallas, todas comparten este ID. | `PANT-H-MAR` |
| 2 | **Título producto** | String | ✅ Sí | Nombre descriptivo del producto (mínimo 3 caracteres). | `Pantalón hombre marino con logo` |
| 3 | **Descripción** | String | No | Descripción completa del producto con detalles adicionales. | `Pantalón de uniforme color marino con logo corporativo` |
| 4 | **Categoría general** | String | ✅ Sí | Categoría principal del catálogo. Seleccionar entre las disponibles. | `Uniformes` |
| 5 | **Subcategoría** | String | No | Subcategoría o tipo específico de producto dentro de la categoría. | `Confección` |
| 6 | **Marca** | String | No | Marca, fabricante o proveedor del producto. | `Pomares` |

### Identificadores y Variantes

| # | Columna | Tipo | Obligatorio | Descripción | Ejemplo |
|---|---------|------|-------------|-------------|---------|
| 7 | **SKU / Referencia** | String | ✅ Sí | Código único de cada variante o referencia comercial. **Debe ser único por variante**. | `FPANH-38` |
| 8 | **EAN / Código de barras** | String | No | Código de barras estándar (EAN-13, UPC, etc.) | `1234567890123` |
| 9 | **Variante** | String | No | Nombre legible de la variante para mostrar al usuario. | `Talla S`, `Pack 250`, `Color Azul` |
| 10 | **Opción 1** | String | No | Nombre de la primera opción de variante. | `Talla`, `Color`, `Formato` |
| 11 | **Valor 1** | String | No | Valor específico de la primera opción. | `S`, `Marino`, `18.5x9.5cm` |
| 12 | **Opción 2** | String | No | Nombre de la segunda opción de variante (opcional). | `Color`, `Acabado` |
| 13 | **Valor 2** | String | No | Valor específico de la segunda opción. | `Marino`, `Mate` |

### Precios y Stock

| # | Columna | Tipo | Obligatorio | Descripción | Ejemplo |
|---|---------|------|-------------|-------------|---------|
| 14 | **Unidades por pack** | Integer | ✅ Sí | Número de unidades que contiene cada pack (mínimo 1). | `1`, `12`, `250` |
| 15 | **Precio proveedor (€)** | Decimal | ✅ Sí | Precio neto del proveedor **SIN aplicar margen de plataforma**. Usar punto (.) como separador decimal. | `18.70`, `7.77` |
| 16 | **IVA (%)** | Integer | ✅ Sí | Tipo de IVA aplicable. Valores permitidos: **0, 10 o 21**. | `21`, `10`, `0` |
| 17 | **Stock** | Integer | No | Unidades disponibles en inventario. Si está vacío, no se gestiona stock. | `20`, `100` |

### Imágenes

| # | Columna | Tipo | Obligatorio | Descripción | Ejemplo |
|---|---------|------|-------------|-------------|---------|
| 18 | **Imagen 1 URL** | URL | No | URL pública de la imagen principal (HTTPS recomendado). **Imagen 1 es la principal**. | `https://cdn.ejemplo.com/pant-1.jpg` |
| 19 | **Imagen 2 URL** | URL | No | URL de imagen adicional (galería). | `https://cdn.ejemplo.com/pant-2.jpg` |
| 20 | **Imagen 3 URL** | URL | No | URL de imagen adicional (galería). | — |
| 21 | **Imagen 4 URL** | URL | No | URL de imagen adicional (galería). | — |
| 22 | **Imagen 5 URL** | URL | No | URL de imagen adicional (galería). | — |

---

### 📝 Notas Importantes

- **Producto ID**: Es la clave para agrupar variantes. Múltiples filas con el mismo Producto ID se convierten en 1 producto con N variantes.
- **SKU**: Debe ser único. Si tienes 2 variantes del mismo producto (ej: Talla S y M), cada una debe tener un SKU diferente.
- **Opciones**: Puedes usar hasta 2 pares de Opción/Valor por variante (ej: Talla+Color, Formato+Acabado).
- **Precio**: Es el precio del **proveedor**, NO el precio final de venta. El markup se aplica después en la plataforma.
- **Imágenes**: No insertar imágenes dentro del Excel. Solo URLs públicas HTTPS.
- **Separador**: Usar coma (,) como separador. Si un campo contiene comas, enciérralo entre comillas: `"valor1,valor2"`.
- **Codificación**: Guardar el archivo en UTF-8 para evitar problemas con acentos.

---

### Página Principal

#### `src/app/(supplier)/supplier/products/bulk-upload/page.tsx`

- **Página de carga masiva** (~30 líneas)
- Header con navegación y título
- Usa componente `<BulkUploadForm />`

### Componente Principal

#### `src/components/supplier/BulkUploadForm.tsx`

- **Componente de carga masiva completo** (~750 líneas)
- Gestiona 4 etapas: upload → preview → importing → results

##### Tipos y Estructuras:

```typescript
// Fila CSV (22 columnas de la plantilla oficial)
interface CSVRow {
  producto_id: string;        // Código común para agrupar variantes
  titulo: string;
  descripcion?: string;
  categoria: string;           // Categoría general
  subcategoria?: string;
  marca?: string;
  sku: string;                 // SKU único por variante
  ean?: string;                // EAN / Código de barras
  variante?: string;           // Nombre legible (ej: "Talla M")
  opcion1?: string;            // Nombre de opción 1 (ej: "Talla")
  valor1?: string;             // Valor de opción 1 (ej: "M")
  opcion2?: string;            // Nombre de opción 2 (ej: "Color")
  valor2?: string;             // Valor de opción 2 (ej: "Marino")
  unidades_pack: string;
  precio: string;              // Precio proveedor (€)
  iva: string;                 // IVA (%)
  stock?: string;
  imagen1?: string;
  imagen2?: string;
  imagen3?: string;
  imagen4?: string;
  imagen5?: string;
}

// Producto agrupado (puede tener múltiples variantes)
interface GroupedProduct {
  producto_id: string;
  title: string;
  description?: string;
  category_id: string;
  subcategoria?: string;
  marca?: string;
  base_price: number;
  units_per_pack: number;
  tax_rate?: number;
  images: string[];
  rows: CSVRow[];             // Todas las filas CSV de este producto
  hasVariants: boolean;        // true si tiene más de un SKU
}

interface ParsedProduct {
  producto_id: string;
  rowNumbers: number[];        // Filas del CSV que componen este producto
  data: GroupedProduct;
  isValid: boolean;
  errors: string[];
  parsedData?: ProposeProductRequest;
}

interface ImportResult {
  row: number;
  title: string;
  status: 'success' | 'error';
  message: string;
}

type UploadStage = 'upload' | 'preview' | 'importing' | 'results';
```

##### Funciones Clave:

**`parseCSV(text: string)`**
- Split por líneas y parsing manual con manejo de comillas
- Mapea 22 columnas a objetos CSVRow
- **Agrupa filas por Producto ID**
- Para cada grupo crea un GroupedProduct
- Detecta si tiene variantes (rows.length > 1)
- Retorna array de ParsedProduct agrupados

**`validateProduct(grouped: GroupedProduct, rowNumbers: number[])`**
- Valida título (mín 3 chars)
- Valida categoría (obligatoria)
- Valida precio (número > 0)
- Valida unidades/pack (entero >= 1)
- Valida IVA (0-100) si presente
- Valida URLs de imágenes si presentes
- **Valida SKUs únicos en variantes**
- Retorna objeto ParsedProduct con errores

**`handleFileSelect()`**
- Lee archivo con FileReader API
- Llama a parseCSV()
- Actualiza estado con productos parseados (agrupados)
- Cambia stage a 'preview'

**`handleImport()`**
- Filtra productos válidos
- Loop secuencial con progreso
- Llama a pricingApi.proposeProduct() por cada producto
  - Si tiene variantes, envía array `variants` en el request
  - Si no tiene variantes, envía producto simple
- Delay de 100ms entre llamadas
- Captura errores individuales
- Actualiza resultados y cambia a stage 'results'

**`downloadTemplate()`**
- Genera CSV de ejemplo con 22 columnas
- Incluye 3 filas de ejemplo:
  - 2 variantes del mismo producto (PANT-H-MAR con Talla S y M)
  - 1 producto sin variantes (PREIMP-001)
- Crea Blob y download link

---

## 🔄 Sistema de Variantes

### Concepto

El sistema permite que **múltiples filas del CSV con el mismo Producto ID** se agrupen como **variantes del mismo producto**. Esto es ideal para productos con:
- Diferentes tallas (S, M, L, XL)
- Diferentes colores
- Diferentes formatos o presentaciones

### Ejemplo Práctico

**CSV con variantes:**
```csv
Producto ID,Título producto,...,SKU / Referencia,Variante,Opción 1,Valor 1,Opción 2,Valor 2,...
PANT-H-MAR,Pantalón hombre marino,...,FPANH-38,Talla S,Talla,S,Color,Marino,...
PANT-H-MAR,Pantalón hombre marino,...,FPANH-40,Talla M,Talla,M,Color,Marino,...
PANT-H-MAR,Pantalón hombre marino,...,FPANH-42,Talla L,Talla,L,Color,Marino,...
```

**Resultado:**
- Parser detecta 3 filas con `producto_id = "PANT-H-MAR"`
- Las agrupa en **1 solo producto** con **3 variantes**
- En preview aparece: `"PANT-H-MAR | Pantalón hombre marino | 3 SKUs"`
- Al importar, hace **1 solo request** a la API con:
  ```json
  {
    "title": "Pantalón hombre marino",
    "variants": [
      { "sku": "FPANH-38", "title": "Talla S", "options": {"Talla": "S", "Color": "Marino"} },
      { "sku": "FPANH-40", "title": "Talla M", "options": {"Talla": "M", "Color": "Marino"} },
      { "sku": "FPANH-42", "title": "Talla L", "options": {"Talla": "L", "Color": "Marino"} }
    ]
  }
  ```

### Validaciones de Variantes

- ✅ Todos los SKUs dentro del mismo Producto ID deben ser únicos
- ✅ Cada variante puede tener hasta 2 opciones (Opción 1/Valor 1, Opción 2/Valor 2)
- ✅ El precio puede ser diferente por variante
- ✅ El stock se gestiona por variante individual

---

## 📝 Ejemplos Completos de CSV

### Ejemplo 1: Producto con Variantes (Tallas)

**Caso de uso**: Pantalón que viene en tallas S, M, L

```csv
Producto ID,Título producto,Descripción,Categoría general,Subcategoría,Marca,SKU / Referencia,EAN / Código de barras,Variante,Opción 1,Valor 1,Opción 2,Valor 2,Unidades por pack,Precio proveedor (€),IVA (%),Stock,Imagen 1 URL,Imagen 2 URL,Imagen 3 URL,Imagen 4 URL,Imagen 5 URL
PANT-H-MAR,Pantalón hombre marino con logo,Pantalón de uniforme color marino con logo corporativo,Uniformes,Confección,Pomares,FPANH-38,1234567890123,Talla S,Talla,S,Color,Marino,1,18.70,21,20,https://placehold.co/400x400,https://placehold.co/400x400/blue,,,
PANT-H-MAR,Pantalón hombre marino con logo,Pantalón de uniforme color marino con logo corporativo,Uniformes,Confección,Pomares,FPANH-40,1234567890124,Talla M,Talla,M,Color,Marino,1,18.70,21,15,https://placehold.co/400x400,https://placehold.co/400x400/blue,,,
PANT-H-MAR,Pantalón hombre marino con logo,Pantalón de uniforme color marino con logo corporativo,Uniformes,Confección,Pomares,FPANH-42,1234567890125,Talla L,Talla,L,Color,Marino,1,18.70,21,10,https://placehold.co/400x400,https://placehold.co/400x400/blue,,,
```

**Resultado**: 1 producto ("Pantalón hombre marino") con 3 variantes (S, M, L)

---

### Ejemplo 2: Producto sin Variantes

**Caso de uso**: Preimpreso en pack de 250 unidades (no tiene variantes)

```csv
Producto ID,Título producto,Descripción,Categoría general,Subcategoría,Marca,SKU / Referencia,EAN / Código de barras,Variante,Opción 1,Valor 1,Opción 2,Valor 2,Unidades por pack,Precio proveedor (€),IVA (%),Stock,Imagen 1 URL,Imagen 2 URL,Imagen 3 URL,Imagen 4 URL,Imagen 5 URL
PREIMP-001,Super Precio Express,Preimpreso promocional para tienda,Preimpresos,Material,Altavia,67524,9876543210987,Pack 250,Formato,18.5x9.5cm,,,250,7.77,21,100,https://placehold.co/400x400,,,,
```

**Resultado**: 1 producto simple sin variantes

---

### Ejemplo 3: Producto con 2 Opciones (Talla + Color)

**Caso de uso**: Camisa que viene en múltiples tallas y colores

```csv
Producto ID,Título producto,Descripción,Categoría general,Subcategoría,Marca,SKU / Referencia,EAN / Código de barras,Variante,Opción 1,Valor 1,Opción 2,Valor 2,Unidades por pack,Precio proveedor (€),IVA (%),Stock,Imagen 1 URL,Imagen 2 URL,Imagen 3 URL,Imagen 4 URL,Imagen 5 URL
CAM-CORP-01,Camisa corporativa,Camisa de uniforme manga larga,Uniformes,Confección,TextilPro,CAM-S-BL,1111111111111,Talla S Blanca,Talla,S,Color,Blanco,1,22.50,21,30,https://placehold.co/400x400/white,,,,
CAM-CORP-01,Camisa corporativa,Camisa de uniforme manga larga,Uniformes,Confección,TextilPro,CAM-M-BL,1111111111112,Talla M Blanca,Talla,M,Color,Blanco,1,22.50,21,40,https://placehold.co/400x400/white,,,,
CAM-CORP-01,Camisa corporativa,Camisa de uniforme manga larga,Uniformes,Confección,TextilPro,CAM-S-AZ,1111111111113,Talla S Azul,Talla,S,Color,Azul,1,22.50,21,25,https://placehold.co/400x400/blue,,,,
CAM-CORP-01,Camisa corporativa,Camisa de uniforme manga larga,Uniformes,Confección,TextilPro,CAM-M-AZ,1111111111114,Talla M Azul,Talla,M,Color,Azul,1,22.50,21,35,https://placehold.co/400x400/blue,,,,
```

**Resultado**: 1 producto ("Camisa corporativa") con 4 variantes (S Blanco, M Blanco, S Azul, M Azul)

---

### Ejemplo 4: CSV con Múltiples Productos

**Caso de uso**: Importar varios productos diferentes en un solo archivo

```csv
Producto ID,Título producto,Descripción,Categoría general,Subcategoría,Marca,SKU / Referencia,EAN / Código de barras,Variante,Opción 1,Valor 1,Opción 2,Valor 2,Unidades por pack,Precio proveedor (€),IVA (%),Stock,Imagen 1 URL,Imagen 2 URL,Imagen 3 URL,Imagen 4 URL,Imagen 5 URL
PANT-H-MAR,Pantalón hombre marino,Pantalón de uniforme,Uniformes,Confección,Pomares,FPANH-38,1234567890123,Talla S,Talla,S,,,1,18.70,21,20,https://placehold.co/400x400,,,,
PANT-H-MAR,Pantalón hombre marino,Pantalón de uniforme,Uniformes,Confección,Pomares,FPANH-40,1234567890124,Talla M,Talla,M,,,1,18.70,21,15,https://placehold.co/400x400,,,,
PREIMP-001,Super Precio Express,Preimpreso promocional,Preimpresos,Material,Altavia,67524,9876543210987,Pack 250,Formato,18.5x9.5cm,,,250,7.77,21,100,https://placehold.co/400x400,,,,
CARTEL-A4,Cartel A4 Promocional,Cartel impreso A4,Señalética,Impresión,GraficSol,CARTA4-001,5555555555555,,,,,,,1,2.50,21,500,https://placehold.co/400x400,,,,
```

**Resultado**: 
- Producto 1: "Pantalón hombre marino" con 2 variantes (Talla S y M)
- Producto 2: "Super Precio Express" sin variantes
- Producto 3: "Cartel A4 Promocional" sin variantes

**Total**: 3 productos, 4 SKUs

---

##### Etapa 1: Upload

- Card con título "Subir Archivo CSV"
- Alert azul con botón de descarga de plantilla
- Drop zone con input file (CSV/Excel)
- Guía de formato con columnas obligatorias y opcionales
- Loader mientras procesa

##### Etapa 2: Preview

- Stats cards: Total, Válidos (verde), Errores (rojo)
- Tabs: Todos / Válidos / Errores
- Tabla con columnas:
  - Producto ID (código del producto)
  - Título (con categoría > subcategoría en texto pequeño)
  - Variantes (badge mostrando "N SKUs")
  - Precio (€)
  - Unid/Pack
  - Estado (badge verde "Válido" o rojo "Error")
  - Errores (lista de bullets)
- Botones: "Cancelar" / "Importar N Productos"

##### Etapa 3: Importing

- Card con loader animado
- Progress bar con porcentaje
- Alert: "No cierres esta ventana"

##### Etapa 4: Results

- Stats cards: Exitosos (verde), Errores (rojo)
- Tabla de resultados:
  - Fila (#N)
  - Producto
  - Estado (badge success/error)
  - Mensaje
- Botones: "Importar Más Productos" / "Ver Mis Productos"

---

### Página Actualizada

#### `src/app/(supplier)/supplier/products/page.tsx`

**Cambios**:
- Añadido botón "Carga Masiva" con icono Upload
- Dos botones en header: "Carga Masiva" (outline) + "Nuevo Producto" (primary)
- Navegación a `/supplier/products/bulk-upload`

---

## 🧪 Testing

### Probar Flujo Completo

1. **Acceder como supplier**:
   ```
   Login: seller@mercur.dev / password
   ```

2. **Ir a Mis Productos**:
   ```
   http://localhost:3000/supplier/products
   ```

3. **Click en "Carga Masiva"**

4. **Etapa 1: Upload**:
   
   a. **Descargar plantilla**:
   - Click en "Descargar Plantilla"
   - Verifica que descarga `plantilla_productos.csv`
   - Abre el archivo y revisa formato

   b. **Preparar archivo CSV**:
   ```csv
   title,description,base_price,units_per_pack,category_id,subcategory,tags,thumbnail,ean,tax_rate
   Camisa Blanca Manga Larga,Camisa de vestir 100% algodón,25.50,12,cat_uniformes,camisas,"camisa,blanca,vestir",https://placehold.co/400x400,1234567890123,21
   Pantalón Negro Oficina,Pantalón de vestir con pinzas,35.00,10,cat_uniformes,pantalones,"pantalon,negro,oficina",https://placehold.co/400x400,9876543210987,21
   Producto Inválido,,0.00,0,,,,,,
   ```

   c. **Subir archivo**:
   - Click en zona de drop o selector
   - Selecciona el CSV
   - Verifica que muestra "Procesando archivo..."

5. **Etapa 2: Preview**:
   
   a. **Revisar stats**:
   - Total Filas: 3
   - Válidos: 2 (verde)
   - Con Errores: 1 (rojo)

   b. **Tab "Todos"**:
   - Ver las 3 filas
   - Fila #2 con badge verde "Válido"
   - Fila #3 con badge rojo "Error"
   - Fila #4 con errores: "Título debe tener al menos 3 caracteres", "Precio base debe ser un número mayor a 0", etc.

   c. **Tab "Válidos"**:
   - Solo filas #2 y #3
   - Todos con badge verde

   d. **Tab "Errores"**:
   - Solo fila #4
   - Lista de errores visible

   e. **Click "Importar 2 Productos"**

6. **Etapa 3: Importing**:
   
   a. **Barra de progreso**:
   - Verifica que avanza de 0% → 100%
   - Alert naranja: "No cierres esta ventana"

7. **Etapa 4: Results**:
   
   a. **Revisar stats**:
   - Exitosos: 2 (verde)
   - Errores: 0 (rojo)

   b. **Tabla de resultados**:
   - Fila #2: Badge verde "Éxito" + "Producto propuesto correctamente"
   - Fila #3: Badge verde "Éxito" + "Producto propuesto correctamente"

   c. **Click "Ver Mis Productos"**:
   - Redirige a `/supplier/products`
   - Los 2 nuevos productos aparecen con status "Pendiente"

### Casos Edge

✅ **Archivo vacío**:
- Muestra toast de error
- No avanza a preview

✅ **Solo headers (sin datos)**:
- Preview muestra 0 productos
- Botón "Importar" deshabilitado

✅ **Todos los productos inválidos**:
- Stats: Válidos = 0, Errores = N
- Tab "Válidos" vacío
- Botón "Importar" deshabilitado

✅ **Archivo con 100 filas**:
- Parsea correctamente
- Progress bar fluida
- Delay de 100ms entre cada producto = ~10s total

✅ **Errores de API durante importación**:
- Captura error individual
- Continúa con siguientes productos
- Result table muestra badge rojo + mensaje de error específico

---

## 🔄 Flujo de Datos (Mock Mode)

### Parseo de CSV:

```
1. Usuario selecciona archivo CSV
   ↓
2. FileReader lee contenido como texto
   ↓
3. parseCSV(text) ejecuta:
   a. Split por líneas
   b. Primera línea = headers
   c. Resto = datos
   d. Map cada fila a objeto CSVRow
   ↓
4. validateRow() por cada fila:
   a. Valida campos obligatorios
   b. Valida formatos (número, URL, etc.)
   c. Crea ParsedProduct con errores[]
   ↓
5. setParsedProducts(array de ParsedProduct)
   ↓
6. setStage('preview')
```

### Importación:

```
1. Usuario click "Importar N Productos"
   ↓
2. Filtrar solo productos válidos
   ↓
3. setStage('importing')
   ↓
4. Loop secuencial (for i = 0; i < validProducts.length; i++):
   a. pricingApi.proposeProduct(product.parsedData)
   b. Captura resultado (success/error)
   c. Añade a results[]
   d. setImportProgress((i+1)/total * 100)
   e. await delay(100ms)
   ↓
5. setImportResults(results)
   ↓
6. setStage('results')
   ↓
7. Toast: "X de Y productos importados correctamente"
```

---

## 📊 Estadísticas de Implementación

- **Páginas nuevas**: 1 (bulk-upload/page)
- **Componentes nuevos**: 2 (BulkUploadForm, ProductsPreviewTable)
- **Páginas modificadas**: 1 (products/page - botón carga masiva)
- **Líneas de código**: ~800 líneas
- **Etapas del flujo**: 4 (upload → preview → importing → results)
- **Validaciones**: 6 (título, precio, unidades, IVA, URL, formato)
- **Iconos Lucide**: 11 (Upload, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle, Download, Loader2, FileText, TrendingUp, Plus)
- **shadcn/ui componentes**: 11 (Card, Button, Alert, Badge, Progress, Table, Tabs, Input[file], Label, Checkbox)

---

## 🎯 Funcionalidades Clave

### 1. **Template CSV Descargable**

- ✅ Botón de descarga en etapa upload
- ✅ CSV con headers correctos
- ✅ 2 filas de ejemplo con datos realistas
- ✅ Toast de confirmación

### 2. **Parsing Robusto**

- ✅ Split por comas para CSV simple
- ✅ Manejo de líneas vacías
- ✅ Trim de espacios en valores
- ✅ Conversión de tipos (string → number)

### 3. **Validación Exhaustiva**

- ✅ Campos obligatorios (title, base_price, units_per_pack)
- ✅ Formatos numéricos
- ✅ Rangos válidos (IVA 0-100)
- ✅ URLs bien formadas
- ✅ Múltiples errores por fila

### 4. **Vista Previa Detallada**

- ✅ Tabs para filtrar (Todos/Válidos/Errores)
- ✅ Stats cards visuales
- ✅ Tabla con estado por fila
- ✅ Lista de errores específicos
- ✅ Contador de productos a importar

### 5. **Importación Progresiva**

- ✅ Barra de progreso en tiempo real
- ✅ Loop secuencial con delay
- ✅ No bloquea UI (async/await)
- ✅ Captura errores individuales
- ✅ Alert de advertencia

### 6. **Reporte Completo**

- ✅ Stats de éxitos vs errores
- ✅ Tabla fila por fila con resultados
- ✅ Badges visuales (verde/rojo)
- ✅ Mensajes de error específicos
- ✅ Acciones post-importación

---

## 🚀 Mejoras Futuras

### Fase 9.1: Parser Avanzado
- Usar librería `papaparse` para CSVs complejos
- Soporte para comillas y escapes
- Detección automática de delimitador
- Soporte para Excel (.xlsx) real usando `xlsx` library

### Fase 9.2: Validación Avanzada
- Validación contra catálogo de categorías real
- Verificación de EAN duplicados
- Validación de imágenes (URL accesible)
- Límite de tamaño de archivo

### Fase 9.3: Edición Inline
- Permitir corregir errores en preview
- Editar valores directamente en tabla
- Re-validar después de cambios
- Guardar CSV corregido

### Fase 9.4: Historial de Importaciones
- Guardar logs de importaciones previas
- Ver productos importados por sesión
- Estadísticas de uso
- Rollback de importaciones

---

## 🐛 Backend Pendiente (Real Mode)

Cuando el backend implemente la carga masiva:

1. **Cambiar feature flag**:
   ```env
   NEXT_PUBLIC_MOCK_PRICING=false
   ```

2. **Nuevo endpoint (opcional)**:
   ```
   POST /vendor/custom/products/bulk
   Body: { products: ProposeProductRequest[] }
   Response: { 
     results: Array<{id: string, status: 'success'|'error', message: string}>,
     summary: { total: number, success: number, errors: number }
   }
   ```

3. **Ventajas del endpoint bulk**:
   - Transacción atómica (todo o nada)
   - Más rápido (1 request vs N requests)
   - Validación en batch
   - Mejor manejo de errores

4. **Alternativa actual**:
   - Funciona con endpoint individual: `POST /vendor/custom/products`
   - Frontend hace N llamadas secuenciales
   - Delay de 100ms para no saturar
   - Manejo individual de errores

---

## 📝 Notas de Implementación

- ✅ **Parser nativo**: Usa split(',') simple - funciona para CSV básicos
- ✅ **Sin librerías externas**: No requiere papaparse ni xlsx (por ahora)
- ✅ **Responsivo**: Grid adapta en móvil
- ✅ **Accesibilidad**: Labels, file input oculto con label visible
- ✅ **UX**: Loader states, progress bar, colores distintivos
- ✅ **Error handling**: Try/catch en parsing e importación
- ✅ **Validación client-side**: No envía datos inválidos al backend
- ✅ **Template incluido**: Usuario no necesita buscar formato
- ✅ **Formato español**: Precios con €, fechas localizadas
- ✅ **Delay anti-saturación**: 100ms entre requests
- ✅ **No bloqueante**: Async/await permite UI responsiva

---

## 🔗 Integración con Fases Anteriores

### Con Fase 8 (Vista de Proveedores):
- **Botón "Carga Masiva"**: Añadido en header de `/supplier/products`
- **Misma API**: Usa `pricingApi.proposeProduct()` igual que formulario individual
- **Productos importados**: Aparecen en tabla de productos con status "Pendiente"

### Con Fase 7 (Approval Queue):
- **Productos masivos**: Llegan a cola de aprobación igual que individuales
- **Aprobación uno a uno**: Admin puede aprobar/rechazar cada producto importado
- **Sin diferencia**: Backend no distingue origen (formulario vs CSV)

### Flujo Completo del Ciclo:

```
1. Supplier carga CSV masiva (Fase 9) →
   N productos con status: 'pending_approval'
   
2. Admin revisa en Cola de Aprobación (Fase 7) →
   Aprueba/rechaza uno por uno o en batch
   
3. Supplier ve resultados (Fase 8) →
   Productos aprobados: precio final visible
   Productos rechazados: motivo visible
   
4. Puede re-importar productos rechazados →
   Corrige CSV y vuelve a importar (Fase 9)
```

---

## 🎨 Capturas de Pantalla Sugeridas

Para documentación:

**Etapa Upload:**
1. Vista inicial con drop zone y guía de formato
2. Alert azul con botón de descarga de plantilla
3. Loader procesando archivo

**Etapa Preview:**
4. Stats cards: Total / Válidos / Errores
5. Tab "Todos" con productos mixtos
6. Tab "Válidos" solo productos correctos
7. Tab "Errores" con lista de errores por fila
8. Tabla mostrando estado y errores específicos

**Etapa Importing:**
9. Progress bar al 50%
10. Alert "No cierres esta ventana"

**Etapa Results:**
11. Stats de éxitos y errores
12. Tabla de resultados con badges de estado
13. Botones de acción final

**Navegación:**
14. Botón "Carga Masiva" en página de productos
15. Productos importados en lista con status "Pendiente"

---

**Desarrollado por**: GitHub Copilot  
**Fecha**: 21 Agosto 2026  
**Versión**: 1.0.0
