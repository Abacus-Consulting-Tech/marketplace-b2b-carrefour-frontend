# Fase 8: Vista de Proveedores - Mis Productos

**Estado**: ✅ Completado  
**Modo**: Mock (Backend Ready: false)  
**Fecha**: 21 Agosto 2026  
**API Endpoints**: Documentados en `/admin/dev-tools` (módulo: pricing)

---

## 📋 Descripción General

La **Vista de Proveedores** permite a los suppliers/vendors gestionar sus productos propuestos, ver el estado de aprobación, entender el markup aplicado y proponer nuevos productos.

### Características Implementadas

1. **Card de Markup Global**
   - Visualización destacada del markup global del proveedor
   - Contador de productos usando markup global vs específico
   - Alert informativo sobre markup específico

2. **Estadísticas en Dashboard**
   - 4 cards con métricas clave:
     - Total Productos
     - Pendientes (naranja)
     - Aprobados (verde)
     - Rechazados (rojo)

3. **Lista Mejorada de Productos**
   - Tabla con 7 columnas informativas
   - Precio base con desglose por unidad
   - Markup aplicado (global o específico) con badge
   - Precio final calculado (solo aprobados)
   - Estado visual con ProductStatusBadge
   - Motivo de rechazo inline (productos rechazados)

4. **Sistema de Filtros**
   - Tabs por estado (Todos, Pendientes, Aprobados, Rechazados)
   - Buscador por título
   - Contador de resultados

5. **Formulario de Propuesta** (ya existente)
   - Formulario completo con validación
   - Campos: título, descripción, precio, unidades, categoría, tags, imagen, EAN, IVA
   - Página dedicada en `/supplier/products/new`

6. **Página de Detalle del Producto** (nuevo)
   - Vista completa de un producto individual
   - Header con botón "Volver" y badge de estado
   - Alertas contextuales según el estado (rechazado/pendiente/aprobado)
   - Card principal con imagen, título, descripción
   - Sección de precios: base, unidades/pack, markup aplicado, precio final
   - Información adicional: categoría, EAN, IVA, tags
   - Timeline con historial de eventos (propuesto, aprobado/rechazado)
   - Ruta: `/supplier/products/[id]`

---

## 🗂️ Archivos Modificados

### Componente Principal

#### `src/components/supplier/ProductsList.tsx`

**Mejoras implementadas** (~400 líneas):

##### Card de Markup Global:

```typescript
{seller && (
  <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Percent className="h-5 w-5 text-blue-600" />
        Mi Markup Global
      </CardTitle>
      // ...
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-blue-700">
        {seller.global_markup_percentage}%
      </div>
      // Contador de productos usando markup global
      // Alert informativo
    </CardContent>
  </Card>
)}
```

##### Stats Cards (4 métricas):

- **Total Productos**: Contador general con icono Package
- **Pendientes**: Color naranja con icono Clock
- **Aprobados**: Color verde con icono CheckCircle2
- **Rechazados**: Color rojo con icono XCircle

##### Tabla Mejorada:

**Columnas**:
1. **Producto**: Imagen + título + "Pack de X uds"
2. **Precio Base**: Precio pack + precio por unidad
3. **Markup**: Porcentaje + badge (Global/Específico)
4. **Precio Final**: Solo si aprobado, con icono TrendingUp + precio pack + precio/ud
5. **Estado**: Badge + Alert con motivo si rechazado
6. **Fecha**: Formato español dd mmm yyyy
7. **Acciones**: Botón "Ver"

##### Lógica de Markup:

```typescript
const getAppliedMarkup = (product: Product): number => {
  // Si tiene markup específico, usarlo
  if (product.markup_percentage !== null && product.markup_percentage !== undefined) {
    return product.markup_percentage;
  }
  // Sino, usar global del seller
  return seller?.global_markup_percentage || 0;
};
```

##### Cálculo de Precio Final:

```typescript
const finalPriceCalc = calculateFinalPrice(product.base_price, appliedMarkup);
// Muestra: €19,98 (pack) y €2,00/ud
```

##### Visualización de Rechazo:

```typescript
{product.status === 'rejected' && product.rejection_reason && (
  <Alert variant="destructive" className="mt-2 max-w-sm">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription className="text-xs">
      <strong>Motivo:</strong> {product.rejection_reason}
    </AlertDescription>
  </Alert>
)}
```

---

### Páginas Existentes (ya funcionales)

#### `src/app/(supplier)/supplier/products/page.tsx`

- Página principal de productos del supplier
- Header con botón "Nuevo Producto"
- Usa componente `<ProductsList sellerId={user.id} />`

#### `src/app/(supplier)/supplier/products/new/page.tsx`

- Página de propuesta de nuevo producto
- Header con botón "Atrás"
- Usa componente `<ProductProposalForm />`

#### `src/app/(supplier)/supplier/products/[id]/page.tsx` **(NUEVO)**

- **Página de detalle del producto** (~400 líneas)
- Muestra información completa de un producto individual
- Características:
  - Header con navegación y badge de estado
  - Alertas contextuales por estado
  - Grid responsive 3 columnas (main card + timeline)
  - Card principal con:
    - Imagen y descripción del producto
    - Sección de precios (base, markup, final con desglose)
    - Información adicional (categoría, EAN, IVA, tags)
  - Card de timeline:
    - Evento "Propuesto" con fecha
    - Evento "Aprobado" con fecha y usuario (si aplica)
    - Evento "Rechazado" con fecha y usuario (si aplica)
    - Evento "En Revisión" con animación (si aplica)
- Obtiene producto via `pricingApi.getMyProducts()` y filtra por ID
- Valida que el producto pertenezca al supplier autenticado
- Error 404 si producto no encontrado

#### `src/components/supplier/ProductProposalForm.tsx`

- Formulario completo con validación Zod
- Campos: title, description, base_price, units_per_pack, category, tags, thumbnail, EAN, tax_rate
- Submit llama a `pricingApi.proposeProduct()`
- Toast de éxito/error
- Redirección a `/supplier/products` después de éxito

#### `src/app/(supplier)/layout.tsx`

- Layout con sidebar de navegación
- Links: Dashboard, Mis Productos, Pedidos, Mi Perfil
- ProtectedRoute con rol "supplier"

#### `src/types/products-pricing.ts` **(ACTUALIZADO)**

- Añadidos campos opcionales al tipo `Product`:
  - `approved_by?: string` - Email del admin que aprobó
  - `rejected_by?: string` - Email del admin que rechazó
- Estos campos se muestran en la timeline de la página de detalle

#### `src/lib/api/products-pricing-mock.ts` **(ACTUALIZADO)**

- Productos mock actualizados con campos `approved_by` y `rejected_by`
- Funciones `mockApproveProduct()` y `mockRejectProduct()` actualizadas para establecer estos campos
- Valor mock: `'admin@carrefour.com'`

---

## 🧪 Testing

### Probar en Modo Mock

1. **Acceder como supplier**:
   ```
   Login: seller@mercur.dev / password
   ```

2. **Ver Dashboard de Productos**:
   ```
   http://localhost:3000/supplier/products
   ```

3. **Flujo de prueba - Ver Mis Productos**:
   
   a. **Card de Markup Global**:
   - Verifica que muestra el markup del proveedor (ej: 8% para Uniformes Corp)
   - Contador de productos usando markup global
   - Alert informativo azul

   b. **Stats Cards**:
   - Total: Todos los productos del seller
   - Pendientes: Productos con status `pending_approval`
   - Aprobados: Productos con status `approved`
   - Rechazados: Productos con status `rejected`

   c. **Filtrar por estado**:
   - Tab "Todos" → Muestra todos
   - Tab "Pendientes" → Solo pending_approval
   - Tab "Aprobados" → Solo approved
   - Tab "Rechazados" → Solo rejected + motivo

   d. **Ver producto aprobado**:
   - Columna "Markup" muestra % y badge "Global" o "Específico"
   - Columna "Precio Final" muestra precio con markup aplicado
   - Badge verde "Aprobado"

   e. **Ver producto rechazado**:
   - Badge rojo "Rechazado"
   - Alert rojo con el motivo del rechazo inline en la tabla

4. **Flujo de prueba - Proponer Producto**:
   
   a. **Click "Nuevo Producto"**:
   - Redirige a `/supplier/products/new`
   
   b. **Llenar formulario**:
   - Título: "Chaqueta Corporativa"
   - Descripción: "Chaqueta resistente para trabajo"
   - Precio Base: 45.00
   - Unidades/Pack: 5
   - Categoría: Uniformes
   - Tags: "chaqueta, trabajo, corporativo"
   - IVA: 21%

   c. **Submit**:
   - Toast verde: "✅ Producto propuesto correctamente"
   - Redirige a `/supplier/products`
   - Producto aparece en la tabla con status "Pendiente"

5. **Flujo de prueba - Ver Detalle de Producto**:
   
   a. **Desde la lista de productos, click en "Ver"**:
   - Redirige a `/supplier/products/[id]`
   
   b. **Producto Aprobado** (ej: Ratón Inalámbrico):
   - Header con botón "Volver" y badge verde "Aprobado"
   - Alert verde: "¡Producto aprobado!"
   - Card principal muestra:
     - Imagen y título
     - Precio base: €18,50 pack + €1,85/ud
     - Unidades por pack: 10
     - Markup aplicado: 12% con badge "Global"
     - Precio final: €20,72 pack + €2,07/ud
     - Desglose en alert gris
     - Categoría, tags, EAN
   - Timeline muestra:
     - Propuesto: 15 ago 2026
     - Aprobado: 17 ago 2026 por admin@carrefour.com
   
   c. **Producto Rechazado** (ej: Reloj Smartwatch):
   - Header con botón "Volver" y badge rojo "Rechazado"
   - Alert rojo prominente: "Precio base excede el límite..."
   - Card principal muestra solo información básica
   - NO muestra precio final ni markup
   - Timeline muestra:
     - Propuesto: 17 ago 2026
     - Rechazado: 18 ago 2026 por admin@carrefour.com
   
   d. **Producto Pendiente**:
   - Header con botón "Volver" y badge naranja "Pendiente"
   - Alert naranja: "Tu producto está pendiente de revisión..."
   - Card principal muestra solo información básica
   - Timeline muestra:
     - Propuesto: fecha
     - En Revisión (con animación pulse)

6. **Mock Data disponible**:
   - Uniformes Corp (sel_uniformes_corp): 8% markup
   - Tech Supplies (sel_tech_supplies): 12% markup
   - Food Distributor (sel_food_distributor): 5% markup
   - Office Supplies (sel_office_supplies): 15% markup

### Casos Edge

✅ **Sin productos**:
- Estado vacío con icono Package
- Mensaje: "Aún no has propuesto productos"

✅ **Filtrado sin resultados**:
- Mensaje: "No se encontraron productos con ese criterio"

✅ **Producto con markup específico**:
- Badge "Específico" en lugar de "Global"
- Precio calculado con el markup específico

✅ **Producto rechazado**:
- Alert rojo con motivo visible
- Badge rojo de estado

✅ **Loading state**:
- Spinner animado
- Mensaje "Cargando productos..."

---

## 🔄 Flujo de Datos (Mock Mode)

### Ver Productos:

```
1. Usuario accede a /supplier/products
   ↓
2. ProductsList component carga
   ↓
3. fetchData() ejecuta dos llamadas paralelas:
   a. pricingApi.getMyProducts(sellerId)
   b. pricingApi.getSellerMarkup(sellerId)
   ↓
4. getMyProducts() filtra mockProductsStore por seller_id
   ↓
5. getSellerMarkup() obtiene global_markup_percentage del seller
   ↓
6. Actualiza estados:
   - setProducts(productos del seller)
   - setSeller({ id, markup, stats })
   ↓
7. Renderiza:
   - Card de Markup Global
   - Stats Cards (4 métricas)
   - Filtros y búsqueda
   - Tabla con productos
```

### Proponer Producto:

```
1. Usuario click "Nuevo Producto"
   ↓
2. Redirige a /supplier/products/new
   ↓
3. ProductProposalForm renderiza
   ↓
4. Usuario llena formulario
   ↓
5. Submit → pricingApi.proposeProduct(request)
   ↓
6. mockProposeProduct() crea nuevo producto:
   - status: 'pending_approval'
   - seller_id: sellerId
   - timestamps: created_at, updated_at
   - Añade a mockProductsStore
   ↓
7. Response: { product, message }
   ↓
8. Toast de éxito
   ↓
9. Redirige a /supplier/products
   ↓
10. Producto aparece en tabla con status "Pendiente"
```

---

## 📊 Estadísticas de Implementación

- **Componentes modificados**: 1 (ProductsList)
- **Páginas nuevas**: 1 (products/[id]/page)
- **Páginas existentes**: 3 (products/page, products/new/page, layout)
- **Tipos actualizados**: 1 (products-pricing.ts)
- **Mock data actualizado**: 1 (products-pricing-mock.ts)
- **Nuevas funcionalidades**: 6 (markup card, stats cards, precio final, motivo rechazo, badges, página de detalle)
- **API Endpoints (dev-tools)**: 3 nuevos endpoints vendor documentados
  - `GET /vendor/custom/products` - Mis productos propuestos
  - `POST /vendor/custom/products` - Proponer nuevo producto
  - `GET /vendor/custom/sellers/me/markup` - Obtener mi markup global
- **Iconos Lucide**: 18 (Percent, TrendingUp, CheckCircle2, XCircle, Clock, Package, Eye, Search, Loader2, AlertCircle, Info, ArrowLeft, Calendar, Tag, Barcode, FileText)
- **shadcn/ui componentes**: 10 (Card, Button, Input, Table, Tabs, Badge, Alert, Label, Textarea)

---

## 🎯 Funcionalidades Clave

### 1. **Información Completa del Markup**

- ✅ Card destacado con markup global del proveedor
- ✅ Gradiente azul para destacar
- ✅ Contador de productos usando markup global vs específico
- ✅ Alert informativo sobre excepciones

### 2. **Visualización Clara del Estado**

- ✅ Stats cards con colores distintivos
- ✅ Badges de estado (Pendiente/Aprobado/Rechazado)
- ✅ Alert inline con motivo de rechazo
- ✅ Iconos que refuerzan el estado

### 3. **Cálculo Transparente de Precios**

- ✅ Precio base con desglose por unidad
- ✅ Markup mostrado con badge Global/Específico
- ✅ Precio final calculado (solo aprobados)
- ✅ Ambos precios: pack y por unidad

### 4. **Experiencia de Usuario Optimizada**

- ✅ Filtrado por estado con tabs
- ✅ Búsqueda en tiempo real
- ✅ Estados vacíos informativos
- ✅ Loading states con spinner
- ✅ Toast notifications

### 5. **Integración con Fases Anteriores**

- ✅ Usa `pricingApi` de Fase 6-7
- ✅ Muestra markup global gestionado en Fase 6
- ✅ Muestra estado de aprobación de Fase 7
- ✅ Muestra motivos de rechazo de Fase 7

---

## 🚀 Próximos Pasos

### ✅ Fase 9: Carga Masiva CSV (COMPLETADA)
- ✅ Componente de subida de archivos Excel/CSV
- ✅ Parser con validación de columnas
- ✅ Vista previa de datos a importar
- ✅ Detección de errores por fila
- ✅ Importación masiva con barra de progreso
- ✅ Reporte detallado de éxitos/errores
- ✅ Template CSV descargable
- ✅ Documentación completa en [FASE_9_BULK_UPLOAD.md](./FASE_9_BULK_UPLOAD.md)

---

## 🐛 Backend Pendiente (Real Mode)

Cuando el backend implemente los endpoints:

1. **Cambiar feature flag**:
   ```env
   NEXT_PUBLIC_MOCK_PRICING=false
   ```

2. **Verificar endpoints** (ver `/admin/dev-tools` para lista completa):
   - `GET /vendor/custom/products` - Devuelve productos del seller autenticado
   - `POST /vendor/custom/products` - Crear propuesta de producto
   - `GET /vendor/custom/sellers/me/markup` - Obtener markup del seller autenticado
   - `GET /admin/custom/sellers/:id/markup` - Admin obtiene markup de un seller

3. **Validar respuestas**:
   ```typescript
   // GET /vendor/custom/products
   {
     data: Product[]  // Todos los productos del seller (todos los estados)
   }
   
   // POST /vendor/custom/products
   {
     data: {
       product: Product,  // status: 'pending_approval'
       message: string
     }
   }
   
   // GET /vendor/custom/sellers/me/markup
   {
     data: {
       seller_id: string,
       global_markup_percentage: number,
       updated_at: string
     }
   }
   
   // GET /admin/custom/sellers/:id/markup
   {
     data: {
       seller_id: string,
       global_markup_percentage: number,
       updated_at: string
     }
   }
   ```

4. **Autenticación**:
   - sellerId debe obtenerse del token JWT del usuario autenticado
   - Backend debe validar que el seller solo acceda a sus propios productos
   - Endpoint `/vendor/custom/sellers/me/markup` usa el seller del token JWT
   - Endpoint `/admin/custom/sellers/:id/markup` permite que admins vean markup de cualquier seller
   - Backend debe verificar roles: vendor solo puede GET sus propios datos, admin puede GET y PATCH cualquier seller

---

## 📝 Notas de Implementación

- ✅ **Responsivo**: Grid adaptable en stats cards (md:grid-cols-4)
- ✅ **Accesibilidad**: Labels, semántica correcta
- ✅ **Loading states**: Spinner centralizado con mensaje
- ✅ **Error handling**: Try/catch en todas las async, toast de errores
- ✅ **Formato español**: Precios (€19,98), fechas (dd mmm yyyy)
- ✅ **Validación**: Formulario con Zod schema
- ✅ **UX**: Colores distintivos por estado (verde/naranja/rojo)
- ✅ **Optimización**: useEffect con dependencias correctas
- ✅ **Código limpio**: Funciones helper (getAppliedMarkup, formatPrice)
- ✅ **Gradientes**: Card de markup con gradiente azul
- ✅ **Inline alerts**: Motivo de rechazo visible sin clicks

---

## 🎨 Capturas de Pantalla Sugeridas

Para documentación:

**Lista de Productos:**
1. Card de Markup Global con gradiente azul
2. Stats cards con las 4 métricas
3. Tabla completa con productos de diferentes estados
4. Producto aprobado mostrando precio final y badge "Global"
5. Producto aprobado con markup específico y badge "Específico"
6. Producto rechazado con alert rojo inline
7. Filtro por estado "Rechazados" activo
8. Estado vacío cuando no hay productos

**Formulario:**
9. Formulario de propuesta de nuevo producto
10. Toast de éxito después de proponer producto

**Página de Detalle:**
11. Detalle de producto aprobado - Vista completa con precios y markup
12. Detalle de producto aprobado - Timeline mostrando aprobación
13. Detalle de producto rechazado - Alert rojo con motivo
14. Detalle de producto rechazado - Timeline mostrando rechazo
15. Detalle de producto pendiente - Alert naranja y timeline con "En Revisión"
16. Sección de precios con desglose completo (base → markup → final)
17. Card de información adicional con tags y categorías

---

## 🔗 Integración con Fases Anteriores

### Con Fase 6 (SellerMarkupManager):
- **Markup Global**: Se obtiene via `getSellerMarkup()` y se muestra en card destacado
- **Datos del Seller**: Usa tipos `Seller` y `SellerMarkup`

### Con Fase 7 (ApprovalQueue):
- **Estados de Aprobación**: Muestra productos pending/approved/rejected
- **Motivo de Rechazo**: `rejection_reason` visible en alert inline
- **Markup Aplicado**: Muestra si es global o específico (establecido al aprobar)

### Flujo Completo del Ciclo de Vida del Producto:

```
1. Supplier propone producto (Fase 8) →
   status: 'pending_approval'
   
2. Admin revisa en Cola de Aprobación (Fase 7) →
   Opción A: Aprueba con markup global del seller (Fase 6)
   Opción B: Aprueba con markup específico
   Opción C: Rechaza con motivo
   
3. Supplier ve resultado (Fase 8) →
   Si aprobado: Ve precio final y markup aplicado
   Si rechazado: Ve motivo en alert rojo
   Puede re-proponer (Fase 9 - CSV bulk)
```

---

**Desarrollado por**: GitHub Copilot  
**Fecha**: 21 Agosto 2026  
**Versión**: 1.0.0
