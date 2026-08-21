# Fase 7: Cola de Aprobación de Productos

**Estado**: ✅ Completado  
**Modo**: Mock (Backend Ready: false)  
**Fecha**: 21 Agosto 2026

---

## 📋 Descripción General

La **Cola de Aprobación** permite a los administradores revisar y aprobar/rechazar productos propuestos por los proveedores, estableciendo el markup específico para cada producto.

### Características Implementadas

1. **Vista de Productos Pendientes**
   - Tabla completa con información de productos
   - Imagen, título, descripción, precio base
   - Información del proveedor y markup global
   - Precio sugerido con markup global
   - Fecha de propuesta

2. **Sistema de Filtros**
   - Filtrar por proveedor
   - Filtrar por categoría
   - Botón para limpiar filtros
   - Contador de productos filtrados

3. **Aprobación de Productos**
   - Modal con vista previa del producto
   - Opción 1: Usar markup global del proveedor
   - Opción 2: Establecer markup personalizado
   - Cálculo en tiempo real del precio final
   - Vista previa del precio de pack

4. **Rechazo de Productos**
   - Modal con formulario de rechazo
   - Campo obligatorio de motivo
   - Mensaje visible para el proveedor
   - Vista previa del producto a rechazar

5. **Características UX**
   - Estados de carga durante operaciones
   - Mensajes de éxito/error claros
   - Recarga automática después de aprobar/rechazar
   - Validaciones en tiempo real
   - Badges informativos (variantes, unidades/pack)

---

## 🗂️ Archivos Creados/Modificados

### Componente UI

#### `src/app/(backoffice)/admin/pricing/approval-queue/page.tsx`

**Nuevo componente completo** (~900 líneas)

##### Estructura Principal:

1. **Header con Estadísticas**:
   - Contador total de productos pendientes
   - Icono Package

2. **Card de Filtros**:
   - Selector de proveedor (dropdown)
   - Selector de categoría (dropdown)
   - Botón "Limpiar Filtros"

3. **Tabla de Productos**:
   - Columnas:
     - Imagen (thumbnail o placeholder)
     - Producto (título, descripción, badges)
     - Proveedor (con icono User)
     - Precio Base (con desglose de pack)
     - Markup Global (del proveedor)
     - Precio Sugerido (con markup global aplicado)
     - Fecha (formato español)
     - Acciones (botones Aprobar/Rechazar)
   
4. **Modal de Aprobación**:
   - Info del producto (imagen, nombre, proveedor, precio)
   - Radio buttons:
     - Usar markup global (con badge mostrando %)
     - Markup personalizado
   - Input numérico de markup (0-500%)
   - Preview del precio final en verde
   - Cálculo del precio de pack
   - Botones: Cancelar / Aprobar

5. **Modal de Rechazo**:
   - Info del producto (fondo rojo)
   - Textarea para motivo del rechazo
   - Placeholder con ejemplo
   - Indicador "visible para el proveedor"
   - Botones: Cancelar / Rechazar (rojo)

##### Lógica de Estado:

```typescript
// Data
const [products, setProducts] = useState<Product[]>([]);
const [sellers, setSellers] = useState<Seller[]>([]);
const [total, setTotal] = useState(0);

// Filters
const [selectedSellerId, setSelectedSellerId] = useState<string>('');
const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

// Modals
const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

// Form
const [customMarkup, setCustomMarkup] = useState<string>('');
const [useGlobalMarkup, setUseGlobalMarkup] = useState(true);
const [rejectionReason, setRejectionReason] = useState<string>('');

// UI
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);
```

##### Funciones Principales:

```typescript
// Cargar productos con filtros
async function loadPendingProducts()

// Cargar todos los sellers
async function loadSellers()

// Abrir modal de aprobación (pre-llena markup global)
function handleOpenApproval(product: Product)

// Abrir modal de rechazo
function handleOpenRejection(product: Product)

// Aprobar producto con markup
async function handleApprove()

// Rechazar producto con motivo
async function handleReject()

// Limpiar filtros
function handleResetFilters()

// Formatear precio (€12,50)
function formatPrice(price: number): string

// Formatear fecha (dd mmm yyyy HH:mm)
function formatDate(dateString: string): string

// Obtener seller por ID
function getSellerInfo(sellerId: string): Seller | undefined

// Calcular precio preview con markup
function calculatePreviewPrice(basePrice: number, markup: number): number
```

##### Validaciones:

- Markup entre 0% y 500%
- Motivo de rechazo obligatorio (trim)
- Botones disabled durante loading
- Auto-selección de markup global al abrir modal

---

### Navegación

#### `src/app/(backoffice)/layout.tsx`

**Link añadido al sidebar**:

```tsx
<a href="/admin/pricing/approval-queue" className="...">
  ✅ Cola de Aprobación
</a>
```

**Posición**: Entre "Productos" y "Markup Global"

---

## 🧪 Testing

### Probar en Modo Mock

1. **Acceder a la página**:
   ```
   http://localhost:3000/admin/pricing/approval-queue
   ```

2. **Flujo de prueba - Aprobación con Markup Global**:
   
   a. **Ver productos pendientes**:
   - Verifica que aparecen 4 productos en la tabla:
     - Polo Corporativo Manga Corta (Uniformes Corp)
     - Laptop Dell Latitude 5420 (Tech Supplies)
     - Café en Grano Premium 1kg (Food Distributor)
     - Camiseta Corporativa (Uniformes Corp - con variantes)

   b. **Revisar información**:
   - Cada fila muestra imagen, descripción, proveedor
   - Columna "Markup Global" muestra % del proveedor
   - Columna "Precio Sugerido" muestra cálculo automático

   c. **Aprobar con markup global**:
   - Click "Aprobar" en "Polo Corporativo"
   - Modal se abre con radio "Usar markup global" seleccionado
   - Verifica badge muestra "8%" (markup de Uniformes Corp)
   - Preview muestra: €18.50 → €19.98 (con 8%)
   - Click "Aprobar Producto"
   - Ver mensaje: "✅ Producto aprobado con markup del 8%"
   - Producto desaparece de la tabla

3. **Flujo de prueba - Aprobación con Markup Personalizado**:
   
   a. **Abrir aprobación**:
   - Click "Aprobar" en "Laptop Dell"
   - Modal muestra markup global 12% (Tech Supplies)

   b. **Cambiar a personalizado**:
   - Click radio "Markup personalizado"
   - Cambia input a 15%
   - Preview actualiza: €450.00 → €517.50
   - Preview pack: 1 ud = €517.50

   c. **Aprobar**:
   - Click "Aprobar Producto"
   - Ver mensaje de éxito
   - Producto desaparece

4. **Flujo de prueba - Rechazo**:
   
   a. **Abrir rechazo**:
   - Click "Rechazar" en "Café en Grano"
   - Modal se abre con producto en fondo rojo

   b. **Escribir motivo**:
   - Textarea: "El precio base es demasiado alto para esta categoría. Ajustar a máximo €10/kg"
   - Botón "Rechazar" se habilita

   c. **Rechazar**:
   - Click "Rechazar Producto"
   - Ver mensaje: "✅ Producto rechazado"
   - Producto desaparece

5. **Probar filtros**:
   
   a. **Filtrar por proveedor**:
   - Selector "Proveedor" → "Uniformes Corp"
   - Tabla muestra solo productos de Uniformes Corp
   - Contador actualiza

   b. **Filtrar por categoría**:
   - Selector "Categoría" → "Tecnología"
   - Tabla muestra solo productos de categoría tecnología

   c. **Limpiar filtros**:
   - Click "Limpiar Filtros"
   - Todos los filtros se resetean
   - Tabla vuelve a mostrar todos los productos

### Casos Edge

✅ **Validación de markup**:
- Intenta aprobar con markup = -5% → Error en consola (validación client-side)
- Intenta aprobar con markup = 600% → Error en consola
- Markup válido: 0% a 500%

✅ **Validación de rechazo**:
- Intenta rechazar sin motivo → Botón disabled
- Motivo solo espacios → Error: "Debes indicar un motivo de rechazo"
- Motivo válido → Rechaza correctamente

✅ **Estados vacíos**:
- Sin productos pendientes → Mensaje: "No hay productos pendientes"
- Con filtros sin resultados → Mensaje: "Intenta con otros filtros"

✅ **Loading states**:
- Durante aprobación → Botones disabled, texto "Aprobando..."
- Durante rechazo → Botones disabled, texto "Rechazando..."
- Durante carga inicial → Mensaje "Cargando productos..."

---

## 🔄 Flujo de Datos (Mock Mode)

### Aprobación:

```
1. Usuario click "Aprobar" en producto
   ↓
2. handleOpenApproval(product)
   - Busca seller del producto
   - Pre-llena customMarkup con global_markup_percentage
   - Abre modal
   ↓
3. Usuario elige markup (global o personalizado)
   ↓
4. Usuario click "Aprobar Producto"
   ↓
5. handleApprove()
   - Valida markup (0-500%)
   - POST a pricingApi.approveProduct(productId, markup)
   ↓
6. mockApproveProduct()
   - Encuentra producto en mockProductsStore
   - Actualiza status a 'approved'
   - Establece markup_percentage
   - Establece approved_at
   - Guarda en store
   ↓
7. Respuesta: { product, message }
   ↓
8. Muestra mensaje de éxito
   ↓
9. Cierra modal
   ↓
10. Recarga loadPendingProducts()
    ↓
11. Producto ya no aparece (status !== 'pending_approval')
```

### Rechazo:

```
1. Usuario click "Rechazar" en producto
   ↓
2. handleOpenRejection(product)
   - Limpia rejectionReason
   - Abre modal
   ↓
3. Usuario escribe motivo del rechazo
   ↓
4. Usuario click "Rechazar Producto"
   ↓
5. handleReject()
   - Valida que hay motivo (trim)
   - POST a pricingApi.rejectProduct(productId, reason)
   ↓
6. mockRejectProduct()
   - Encuentra producto en mockProductsStore
   - Actualiza status a 'rejected'
   - Establece rejection_reason
   - Establece rejected_at
   - Guarda en store
   ↓
7. Respuesta: { product, message }
   ↓
8. Muestra mensaje de éxito
   ↓
9. Cierra modal
   ↓
10. Recarga loadPendingProducts()
    ↓
11. Producto ya no aparece
```

### Filtros:

```
1. Usuario selecciona proveedor/categoría
   ↓
2. Estado selectedSellerId/selectedCategoryId actualiza
   ↓
3. useEffect detecta cambio
   ↓
4. Llama loadPendingProducts()
   ↓
5. Construye PendingProductsFilters con valores seleccionados
   ↓
6. pricingApi.getPendingProducts(filters)
   ↓
7. mockGetPendingProducts(filters)
   - Filtra mockProductsStore por status='pending_approval'
   - Aplica filtro seller_id si existe
   - Aplica filtro category_id si existe
   - Aplica paginación
   ↓
8. Actualiza products, total
   ↓
9. Tabla se re-renderiza con productos filtrados
```

---

## 📊 Estadísticas de Implementación

- **Líneas de código**: ~900
- **Componentes**: 1 (ApprovalQueuePage)
- **Modales**: 2 (Aprobación, Rechazo)
- **Filtros**: 2 (Proveedor, Categoría)
- **Métodos API usados**: 3 (getPendingProducts, approveProduct, rejectProduct, getAllSellers)
- **Mock data**: 4 productos pendientes en mockProducts
- **Iconos Lucide**: 15 (CheckCircle2, XCircle, AlertCircle, Package, Euro, Percent, User, Calendar, Filter, RotateCcw, TrendingUp)
- **shadcn/ui componentes**: 13 (Card, Button, Input, Label, Textarea, Badge, Select, Table, Dialog, Alert, Tabs)

---

## 🎯 Funcionalidades Clave

### 1. Información Completa del Producto

Cada fila de la tabla muestra:
- ✅ Imagen (thumbnail o placeholder)
- ✅ Título y descripción (line-clamp-2)
- ✅ Badges: unidades/pack, número de variantes
- ✅ Proveedor con icono
- ✅ Precio base con desglose de pack
- ✅ Markup global del proveedor
- ✅ Precio sugerido calculado automáticamente
- ✅ Fecha de propuesta formateada

### 2. Modal de Aprobación Inteligente

- ✅ Pre-selección de markup global del proveedor
- ✅ Radio buttons para elegir tipo de markup
- ✅ Badge mostrando % global del proveedor
- ✅ Input numérico con validación (0-500%)
- ✅ Preview del precio final en tiempo real
- ✅ Cálculo del precio de pack
- ✅ Fondo verde para precio final (UX positiva)

### 3. Modal de Rechazo con Contexto

- ✅ Fondo rojo para indicar acción destructiva
- ✅ Textarea con placeholder de ejemplo
- ✅ Validación de campo obligatorio
- ✅ Indicador de que el mensaje es visible al proveedor
- ✅ Botón rojo destructive

### 4. Sistema de Filtros Funcional

- ✅ Filtro por proveedor (carga dinámica de sellers)
- ✅ Filtro por categoría (valores predefinidos)
- ✅ Botón "Limpiar Filtros" para resetear
- ✅ Indicador visual "(filtrados)" en descripción
- ✅ Recarga automática al cambiar filtros
- ✅ useEffect optimizado

### 5. UX Profesional

- ✅ Estados de loading en botones
- ✅ Mensajes de éxito en verde
- ✅ Mensajes de error en rojo
- ✅ Auto-cierre de modales después de acción
- ✅ Recarga automática de datos
- ✅ Disabled states durante operaciones
- ✅ Estado vacío con ilustración
- ✅ Formato español (fechas, precios)

---

## 🚀 Próximos Pasos (Fase 8-9)

### Fase 8: Vista de Proveedores - Mis Productos
- Dashboard para proveedores (vendor role)
- Ver todos mis productos (pending, approved, rejected)
- Ver mi markup global actual
- Formulario manual para proponer nuevos productos
- Ver motivos de rechazo
- Re-proponer productos rechazados

### Fase 9: Carga Masiva CSV
- Componente de subida de archivos Excel/CSV
- Parser y validador de datos
- Vista previa de productos a importar
- Detección de errores por fila
- Importación masiva con progress bar
- Reporte de éxitos/errores detallado

---

## 🐛 Backend Pendiente (Real Mode)

Cuando el backend implemente los endpoints:

1. **Cambiar feature flag**:
   ```env
   NEXT_PUBLIC_MOCK_PRICING=false
   ```

2. **Verificar endpoints**:
   - `GET /admin/custom/products/pending` (con filtros seller_id, category_id, limit, offset)
   - `PATCH /admin/custom/products/:id/pricing-approval` (body: { status: 'approved', markup_percentage })
   - `PATCH /admin/custom/products/:id/pricing-approval` (body: { status: 'rejected', rejection_reason })
   - `GET /admin/custom/sellers` (para llenar filtro de proveedores)

3. **Validar respuestas**:
   ```typescript
   // GET pending
   {
     data: {
       products: Product[],
       total: number,
       limit: number,
       offset: number
     }
   }
   
   // PATCH approval
   {
     data: {
       product: Product, // con status='approved' y markup_percentage
       message: string
     }
   }
   
   // PATCH rejection
   {
     data: {
       product: Product, // con status='rejected' y rejection_reason
       message: string
     }
   }
   ```

4. **Sincronización en tiempo real**:
   - Considerar WebSockets o polling para actualizar tabla si otro admin aprueba/rechaza
   - Implementar optimistic updates para mejor UX
   - Añadir confirmación si producto ya fue procesado

---

## 📝 Notas de Implementación

- ✅ **Responsivo**: Grid adaptable en filtros (md:grid-cols-3)
- ✅ **Accesibilidad**: Labels con for, required markers, radio buttons nativos
- ✅ **Loading states**: Disabled durante operaciones, texto de loading
- ✅ **Error handling**: Try/catch en todas las async functions
- ✅ **Formato español**: Precios (€12,50), fechas (dd mmm yyyy HH:mm)
- ✅ **Validación client-side**: Min/max en inputs, trim en textarea
- ✅ **UX**: Confirmación visual con colores (verde=éxito, rojo=error/rechazo)
- ✅ **Auto-reload**: Datos se recargan después de aprobar/rechazar
- ✅ **Modales shadcn/ui**: Dialog component con estilos consistentes
- ✅ **Cálculo de precios**: Usa calculateFinalPrice de pricing-calculator
- ✅ **Estado vacío**: Mensaje claro con icono cuando no hay productos
- ✅ **Filtros persistentes**: Se mantienen hasta que se limpian explícitamente

---

## 🎨 Capturas de Pantalla Sugeridas

Para documentación:

1. Vista general de la tabla con productos pendientes
2. Card de filtros con ambos selectores
3. Modal de aprobación con markup global seleccionado
4. Modal de aprobación con markup personalizado y preview
5. Modal de rechazo con motivo escrito
6. Tabla filtrada por proveedor
7. Mensaje de éxito después de aprobar
8. Estado vacío cuando no hay productos
9. Vista de producto con variantes (badges)
10. Cálculo de precio con markup en tiempo real

---

## 🔗 Integración con Fase 6

La Fase 7 se integra perfectamente con la Fase 6 (SellerMarkupManager):

1. **Markup Global como Referencia**:
   - Al aprobar, se muestra el markup global del proveedor
   - Opción de usar ese markup o establecer uno personalizado
   - El markup global se puede consultar/modificar en Fase 6

2. **Flujo Completo**:
   - Proveedor propone producto (Fase 8 - pendiente)
   - Admin revisa en Cola de Aprobación (Fase 7 - ✅)
   - Admin puede aprobar con:
     - Markup global (gestionado en Fase 6 - ✅)
     - Markup personalizado para este producto específico
   - Si rechaza, proveedor recibe motivo

3. **Datos Compartidos**:
   - Ambas fases usan `pricingApi` y tipos de `products-pricing.ts`
   - Sellers con markup global se cargan en ambas
   - Mock data compartido en `products-pricing-mock.ts`

---

**Desarrollado por**: GitHub Copilot  
**Fecha**: 21 Agosto 2026  
**Versión**: 1.0.0
