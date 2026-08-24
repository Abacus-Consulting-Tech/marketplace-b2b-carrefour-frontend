# Testing Guide - Product Management Module

**Module**: Product Management (Medusa-aligned)  
**Mode**: Mock Data (Feature Flag)  
**Date**: 2026-08-24  
**Status**: ✅ Ready for Testing

## 📋 Prerequisites

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Login as Admin**
   - Navigate to `/admin/login`
   - Use admin credentials

3. **Verify Mock Mode**
   - Check console for: `🎭 Products API Mode: MOCK`
   - Or open DevTools → Console

4. **Test Data Available**
   - 7 mock products
   - 5 mock suppliers
   - 5 mock categories
   - Various stock levels (0 to 200 units)

## 🧪 Test Scenarios

### 1. Product List Page

**URL**: `/admin/products`

#### Test 1.1: Page Load
- [ ] Page loads without errors
- [ ] Header shows "Catálogo de Productos"
- [ ] Subtitle shows "Gestión completa del catálogo de productos B2B"
- [ ] "Nuevo Producto" button visible in header
- [ ] Yellow banner shows "🎭 Modo de Desarrollo - Usando datos de prueba"

#### Test 1.2: Stats Cards Display
- [ ] **Total Productos**: Shows 7
- [ ] **Publicados**: Shows 5 (Polo, Folleto, Tótem, Detergente, Bolsas)
- [ ] **Pendientes**: Shows 1 (Cartel PVC in proposed status)
- [ ] **Sin Stock**: Shows 1 (Tótem Expositivo)

#### Test 1.3: Product Table Display
Verify each product row shows:
- [ ] Checkbox for selection (unchecked by default)
- [ ] Product thumbnail placeholder (package icon)
- [ ] Product title as clickable link
- [ ] Subtitle or description preview
- [ ] Supplier name
- [ ] Category name
- [ ] Stock status badge:
  - Green "Stock: XXX" for >20 units
  - Yellow "Stock Bajo (XX)" for 1-20 units
  - Red "Sin Stock" for 0 units
- [ ] Price with € symbol
- [ ] Variant count (if >1)
- [ ] Status badge (Borrador/Propuesto/Publicado/Rechazado)
- [ ] Edit button (pencil icon)
- [ ] Delete button (trash icon, red)

#### Test 1.4: Search Functionality
- [ ] Type "Polo" in search box
- [ ] Press Enter or click "Actualizar"
- [ ] Table filters to show only "Polo Corporativo"
- [ ] Clear search → All 7 products return
- [ ] Search "Folleto" → Shows "Folleto Promocional A5"
- [ ] Search "limpieza" (category) → Shows "Detergente Industrial"
- [ ] Search with no results → Shows empty state with package icon

#### Test 1.5: Status Filter
- [ ] Select "Borrador" from status dropdown
- [ ] Table shows 1 product (Guantes Nitrilo)
- [ ] Select "Propuesto" → Shows 1 product (Cartel PVC)
- [ ] Select "Publicado" → Shows 5 products
- [ ] Select "Rechazado" → Empty state
- [ ] Select "Todos los estados" → All 7 products return

#### Test 1.6: Supplier Filter
- [ ] Click supplier dropdown
- [ ] Verify 5 suppliers listed:
  - Uniformes Corporativos S.L.
  - Imprenta Corporativa S.L.
  - Visual Retail S.L.
  - Limpieza Industrial S.L.
  - Embalajes y Packaging S.L.
- [ ] Select "Uniformes Corporativos" → Shows "Polo Corporativo"
- [ ] Select "Imprenta Corporativa" → Shows "Folleto A5"
- [ ] Select "Todos los proveedores" → All 7 products return

#### Test 1.7: Low Stock Alert
- [ ] Verify yellow alert card at bottom showing:
  - "1 producto con stock bajo"
  - Warning triangle icon
- [ ] Alert should reference "Folleto Promocional A5" (8 units)

#### Test 1.8: Product Selection (Bulk Operations)
- [ ] Click checkbox on any product → Row gets selected
- [ ] Selected count shows in blue banner: "1 producto(s) seleccionado(s)"
- [ ] Blue banner shows "Cambiar estado..." dropdown
- [ ] Blue banner shows "Cancelar" button
- [ ] Click "Seleccionar Todo" button → All 7 products selected
- [ ] Button text changes to "Deseleccionar Todo"
- [ ] Click "Deseleccionar Todo" → All checkboxes cleared
- [ ] Blue banner disappears

#### Test 1.9: Bulk Status Update
- [ ] Select 2-3 products using checkboxes
- [ ] Click "Cambiar estado..." dropdown
- [ ] Verify 4 options:
  - Cambiar a Borrador
  - Cambiar a Propuesto
  - Cambiar a Publicado
  - Cambiar a Rechazado
- [ ] Select "Cambiar a Publicado"
- [ ] Confirmation dialog appears
- [ ] Click "Aceptar" → Products update (in mock mode)
- [ ] Selection clears automatically
- [ ] Status badges reflect new state

#### Test 1.10: Navigation
- [ ] Click product title → Navigates to detail page
- [ ] Click edit icon → Navigates to edit form
- [ ] Click delete icon → Shows confirmation dialog
- [ ] Click "Actualizar" button → Reloads product list
- [ ] Click "Nuevo Producto" → Navigates to create form

---

### 2. Create Product Form

**URL**: `/admin/products/new`

#### Test 2.1: Page Layout
- [ ] Back arrow navigates to product list
- [ ] Title shows "Nuevo Producto"
- [ ] Subtitle shows "Crear un nuevo producto en el catálogo"
- [ ] 6 cards visible:
  1. Información Básica
  2. Variantes y Precios
  3. Categorías y Etiquetas
  4. Configuración B2B
  5. Imágenes
  6. Form Actions (Cancelar/Crear Producto)

#### Test 2.2: Required Field Validation (Empty Submit)
- [ ] Click "Crear Producto" without filling form
- [ ] Red error alert appears at top
- [ ] "Por favor, corrija los errores en el formulario"
- [ ] Red borders on required fields:
  - Título
  - Proveedor
  - Variant #1 Título
  - Variant #1 SKU
- [ ] Red error messages below each field

#### Test 2.3: Basic Information - Field Validation
**Título (required)**
- [ ] Leave empty and blur → "El título es obligatorio"
- [ ] Type "Test Product" → Error clears
- [ ] Red border removed

**Subtítulo (optional)**
- [ ] Leave empty → No error
- [ ] Type "Subtitle test" → Accepted

**Descripción (optional)**
- [ ] Leave empty → No error
- [ ] Type long text → Textarea expands

**Handle (optional)**
- [ ] Type "TEST123" → Auto-converts to lowercase "test123"
- [ ] Type "test product" → Shows error (no spaces allowed)
- [ ] Type "test-product" → Accepted (valid format)
- [ ] Type "test_product" → Shows error (only hyphens allowed)
- [ ] Help text shows: "Solo letras minúsculas, números y guiones"

**Estado (required)**
- [ ] Default value is "Borrador"
- [ ] Dropdown shows 4 options:
  - Borrador
  - Propuesto
  - Publicado
  - Rechazado
- [ ] Select "Publicado" → Value changes

**Proveedor (required)**
- [ ] Dropdown shows 5 suppliers
- [ ] Leave unselected → Error on submit
- [ ] Select "Uniformes Corporativos S.L." → Error clears

#### Test 2.4: Variants Management
**Default State**
- [ ] 1 variant shown by default
- [ ] Titled "Variante #1"
- [ ] Has delete button (disabled if only 1 variant)
- [ ] "Añadir Variante" button visible

**Add Variant**
- [ ] Click "Añadir Variante"
- [ ] New card appears "Variante #2"
- [ ] Title defaults to "Variant 2"
- [ ] All fields empty

**Variant Fields Validation**
- [ ] **Título**: Required, shows error if empty
- [ ] **SKU**: Required, shows error if empty
- [ ] **Precio**: Must be number ≥ 0, shows error if invalid
- [ ] **Inventario**: Must be number ≥ 0, shows error if invalid

**Remove Variant**
- [ ] Add 3 variants total
- [ ] Click delete on Variante #2
- [ ] Variant removed
- [ ] Cannot delete if only 1 variant remains
- [ ] Alert: "Debe haber al menos una variante"

#### Test 2.5: Categories & Tags
**Categories (badge selection)**
- [ ] 5 category badges shown:
  - Uniformes
  - Folletos
  - Señalización en tienda
  - Limpieza
  - Embalaje
- [ ] All badges have outline style (unselected)
- [ ] Click "Uniformes" → Badge becomes solid (selected)
- [ ] Click again → Badge returns to outline (deselected)
- [ ] Select multiple categories → All highlighted
- [ ] Categories are optional (can leave unselected)

**Tags (comma-separated)**
- [ ] Input field accepts text
- [ ] Type "nuevo, oferta, destacado"
- [ ] Tags saved as array
- [ ] Can be left empty

#### Test 2.6: B2B Configuration
**Unidades por Pack**
- [ ] Default value is "1"
- [ ] Type "0" and blur → "Debe ser mayor que 0"
- [ ] Type "-5" → Error shown
- [ ] Type "10" → Accepted

**Pedido Mínimo**
- [ ] Default value is "1"
- [ ] Type "0" → Error shown
- [ ] Type "abc" → "Debe ser un número"
- [ ] Type "5" → Accepted

**Plazo de Entrega (días)**
- [ ] Default value is "7"
- [ ] Type "0" → Error shown
- [ ] Type "14" → Accepted

#### Test 2.7: Images Section
- [ ] Card shows upload icon
- [ ] Text: "La funcionalidad de carga de imágenes estará disponible próximamente"
- [ ] No active upload functionality (placeholder)

#### Test 2.8: Form Submission - Valid Data
Fill complete form:
- [ ] Título: "Test Product"
- [ ] Proveedor: "Uniformes Corporativos S.L."
- [ ] Estado: "Publicado"
- [ ] Variant: Title="Default", SKU="TEST-001", Price="25.50", Stock="100"
- [ ] Category: "Uniformes"
- [ ] Tags: "nuevo, test"
- [ ] Units per pack: "1"
- [ ] Min order: "5"
- [ ] Lead time: "7"
- [ ] Click "Crear Producto"
- [ ] Success message appears: "✓ Producto creado correctamente"
- [ ] Green banner shows briefly
- [ ] Redirects to product detail page after 1 second

#### Test 2.9: Form Actions
- [ ] Click "Cancelar" → Returns to `/admin/products`
- [ ] No data saved
- [ ] Click "Crear Producto" while loading → Button disabled
- [ ] Button text changes to "Guardando..."

---

### 3. Product Detail Page

**URL**: `/admin/products/:id`

#### Test 3.1: Page Load
Select "Polo Corporativo Carrefour" from list:
- [ ] Page loads without errors
- [ ] Back arrow navigates to list
- [ ] Title shows "Polo Corporativo Carrefour"
- [ ] Subtitle shows product subtitle (if exists)
- [ ] "Editar" button visible
- [ ] "Eliminar" button visible (red)

#### Test 3.2: Stats Cards
- [ ] **Stock Total**: Shows sum of all variants (e.g., 175)
- [ ] Package icon displayed
- [ ] **Precio**: Shows price range or single price with € symbol
- [ ] Dollar icon displayed
- [ ] **Variantes**: Shows count (e.g., 3)
- [ ] Warehouse icon displayed
- [ ] **Estado**: Shows "Activo" or "Inactivo"
- [ ] Tag icon displayed

#### Test 3.3: Tabs Navigation
- [ ] 3 tabs visible: "Información", "Variantes", "Inventario"
- [ ] "Información" tab selected by default
- [ ] Click "Variantes" → Content switches
- [ ] Click "Inventario" → Content switches
- [ ] Click "Información" → Returns to first tab

#### Test 3.4: Information Tab Content
- [ ] **Descripción**: Product description text shown
- [ ] **Proveedor**: Supplier name displayed
- [ ] **Categorías**: Category badges shown
- [ ] **Etiquetas**: Tag badges shown (outline style)
- [ ] All sections properly labeled

#### Test 3.5: Variants Tab Content
For each variant, verify:
- [ ] Variant title displayed (e.g., "M - Azul")
- [ ] SKU shown below title
- [ ] Price formatted with € symbol
- [ ] Stock count displayed
- [ ] "Ajustar Stock" button visible
- [ ] Settings icon on button
- [ ] Variants in bordered cards

**Test 3.5.1: Inventory Adjustment Dialog**
- [ ] Click "Ajustar Stock" on any variant
- [ ] Dialog opens with title "Ajustar Inventario"
- [ ] Shows variant name and SKU
- [ ] Current inventory displayed in gray card
- [ ] Adjustment type dropdown with 3 options:
  - Añadir Stock (+)
  - Reducir Stock (-)
  - Establecer Cantidad (=)
- [ ] Quantity input field
- [ ] Preview card shows new inventory calculation
- [ ] Reason textarea (required)
- [ ] "Cancelar" and "Confirmar Ajuste" buttons

**Test 3.5.2: Inventory Adjustment - Add Stock**
- [ ] Current stock: 150
- [ ] Select "Añadir Stock (+)"
- [ ] Type "25" in quantity
- [ ] Preview shows: New Inventory = 175, "+25 unidades"
- [ ] Preview card has green background
- [ ] Leave reason empty → Click "Confirmar"
- [ ] Error: "Debe proporcionar una razón para el ajuste"
- [ ] Type reason: "Recepción de mercancía"
- [ ] Click "Confirmar Ajuste"
- [ ] Dialog closes
- [ ] Product detail reloads
- [ ] Stock updated to 175

**Test 3.5.3: Inventory Adjustment - Reduce Stock**
- [ ] Current stock: 150
- [ ] Select "Reducir Stock (-)"
- [ ] Type "30" in quantity
- [ ] Preview shows: New Inventory = 120, "-30 unidades"
- [ ] Preview card has yellow background
- [ ] Type reason: "Producto dañado"
- [ ] Click "Confirmar"
- [ ] Stock updated to 120

**Test 3.5.4: Inventory Adjustment - Set Quantity**
- [ ] Current stock: 150
- [ ] Select "Establecer Cantidad (=)"
- [ ] Type "200" in quantity
- [ ] Preview shows: New Inventory = 200, "+50 unidades"
- [ ] Type reason: "Corrección de inventario"
- [ ] Click "Confirmar"
- [ ] Stock updated to 200

**Test 3.5.5: Inventory Adjustment - Validation**
- [ ] Type "-5" in quantity → Error shown
- [ ] Type "abc" → Error shown
- [ ] Type "0" → Accepted (valid)
- [ ] Leave reason empty → Error on submit

#### Test 3.6: Inventory Tab Content
- [ ] Shows "Control de Inventario" title
- [ ] Lists all variants with current stock
- [ ] Each variant shows:
  - Title and SKU
  - Stock badge with color:
    - Green (>20 units)
    - Yellow (1-20 units)
    - Red (0 units)

#### Test 3.7: Delete Product
- [ ] Click "Eliminar" button
- [ ] Confirmation dialog: "¿Estás seguro de eliminar este producto?"
- [ ] Click "Cancelar" → Dialog closes, no action
- [ ] Click "Eliminar" again → Click "Aceptar"
- [ ] Product deleted (in mock mode)
- [ ] Redirects to `/admin/products`
- [ ] Product no longer in list

#### Test 3.8: Edit Navigation
- [ ] Click "Editar" button
- [ ] Navigates to `/admin/products/:id/edit`
- [ ] Form pre-filled with product data

---

### 4. Edit Product Form

**URL**: `/admin/products/:id/edit`

#### Test 4.1: Page Load
Edit "Polo Corporativo":
- [ ] Page loads without errors
- [ ] Back arrow navigates to detail page
- [ ] Title shows "Editar Producto"
- [ ] Subtitle shows product name
- [ ] All form cards visible (same as create)

#### Test 4.2: Form Pre-population
- [ ] **Título**: Shows "Polo Corporativo Carrefour"
- [ ] **Subtítulo**: Shows existing subtitle
- [ ] **Descripción**: Shows existing description
- [ ] **Handle**: Shows existing handle
- [ ] **Estado**: Shows current status (e.g., "Publicado")
- [ ] **Proveedor**: Shows current supplier selected
- [ ] **Categories**: Selected categories are highlighted
- [ ] **Tags**: Shows comma-separated tags
- [ ] **B2B fields**: Show existing values
- [ ] **Variants**: All existing variants displayed

#### Test 4.3: Field-level Validation on Edit
- [ ] Clear "Título" field and blur → Error appears
- [ ] Restore value → Error clears
- [ ] Change handle to invalid format → Error shown
- [ ] Fix handle → Error clears
- [ ] Same validation rules as create form

#### Test 4.4: Update Product - Valid Changes
- [ ] Change título to "Polo Corporativo Carrefour V2"
- [ ] Change stock from 150 to 200 on first variant
- [ ] Add new tag: "actualizado"
- [ ] Change status to "Borrador"
- [ ] Click "Guardar Cambios"
- [ ] Success message: "✓ Producto actualizado correctamente"
- [ ] Redirects to detail page
- [ ] Changes reflected on detail page

#### Test 4.5: Form Actions
- [ ] Click "Cancelar" → Returns to detail page
- [ ] No changes saved
- [ ] Click "Guardar Cambios" while loading → Button disabled
- [ ] Button text: "Guardando..."

---

### 5. Mock Data Verification

#### Test 5.1: Available Mock Products
Verify all 7 products present:
1. [ ] **Polo Corporativo Carrefour**
   - Status: Published
   - Stock: 150-200 (varies by variant)
   - Price: ~18€
   - Supplier: Uniformes Corporativos

2. [ ] **Folleto Promocional A5**
   - Status: Published
   - Stock: 8 (LOW STOCK)
   - Price: ~89€
   - Supplier: Imprenta Corporativa

3. [ ] **Tótem Expositivo de Pie**
   - Status: Published
   - Stock: 0 (OUT OF STOCK)
   - Price: ~125€
   - Supplier: Visual Retail

4. [ ] **Detergente Industrial 5L**
   - Status: Published
   - Stock: 45
   - Price: ~28€
   - Supplier: Limpieza Industrial

5. [ ] **Bolsas de Papel Reciclado**
   - Status: Published
   - Stock: 120
   - Price: ~45€
   - Supplier: Embalajes

6. [ ] **Cartel PVC A3**
   - Status: Proposed (PENDING)
   - Stock: 30
   - Price: ~15€
   - Supplier: Visual Retail

7. [ ] **Guantes de Nitrilo**
   - Status: Draft
   - Stock: 200
   - Price: ~35€
   - Supplier: Limpieza Industrial

#### Test 5.2: Mock Suppliers
Verify all 5 suppliers:
- [ ] Uniformes Corporativos S.L.
- [ ] Imprenta Corporativa S.L.
- [ ] Visual Retail S.L.
- [ ] Limpieza Industrial S.L.
- [ ] Embalajes y Packaging S.L.

#### Test 5.3: Mock Categories
Verify all 5 categories:
- [ ] Uniformes
- [ ] Folletos
- [ ] Señalización en tienda
- [ ] Limpieza
- [ ] Embalaje

---

### 6. API Integration Points

#### Test 6.1: Console Logging (Mock Mode)
Open browser console and verify:
- [ ] On page load: `🎭 Products API Mode: MOCK`
- [ ] On list load: Mock data logged
- [ ] On create: "Creating product (MOCK)"
- [ ] On update: "Updating product (MOCK)"
- [ ] On delete: "Deleting product (MOCK)"
- [ ] On inventory adjust: "Updating inventory (MOCK)"
- [ ] On bulk status: "Bulk updating status (MOCK)"

#### Test 6.2: Feature Flag Verification
Check `/admin/dev-tools`:
- [ ] Products module shows `useMock: true`
- [ ] 8 endpoints listed for products:
  - GET /admin/products
  - GET /admin/products/:id
  - POST /admin/products
  - POST /admin/products/:id
  - DELETE /admin/products/:id
  - GET /admin/products/stats
  - POST /admin/products/bulk-update-status
  - POST /admin/variants/:id/inventory
- [ ] All marked as "working" status
- [ ] All show Medusa endpoint paths

---

### 7. Error Handling

#### Test 7.1: Network Error Simulation
In mock mode, errors are simulated, but verify UI:
- [ ] Loading states show spinner
- [ ] Error states show red error message
- [ ] Retry mechanisms work (refresh button)

#### Test 7.2: Validation Error Display
- [ ] Field errors show red borders
- [ ] Error messages below fields in red text
- [ ] General form error at top in red card
- [ ] Alert icon shown with errors

---

### 8. Responsive Design

#### Test 8.1: Mobile View (< 768px)
- [ ] Stats cards stack vertically
- [ ] Table becomes scrollable
- [ ] Filters stack vertically
- [ ] Form fields stack in single column
- [ ] Buttons stack vertically
- [ ] Product cards remain readable

#### Test 8.2: Tablet View (768px - 1024px)
- [ ] Stats cards in 2 columns
- [ ] Table shows most columns
- [ ] Form uses 2-column grid where appropriate
- [ ] Filters in row with wrapping

#### Test 8.3: Desktop View (> 1024px)
- [ ] Stats cards in 4 columns
- [ ] Full table with all columns
- [ ] Form uses optimal 2-column layout
- [ ] All filters in single row

---

### 9. Accessibility

#### Test 9.1: Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus visible on all elements
- [ ] Enter key submits forms
- [ ] Escape closes dialogs
- [ ] Arrow keys work in dropdowns

#### Test 9.2: Screen Reader
- [ ] Labels properly associated with inputs
- [ ] Error messages announced
- [ ] Success messages announced
- [ ] Button purposes clear
- [ ] Icon-only buttons have aria-labels

---

### 10. Performance

#### Test 10.1: Page Load Times
- [ ] Product list loads < 1 second (mock)
- [ ] Detail page loads < 500ms
- [ ] Form pre-populates instantly
- [ ] Bulk operations complete < 1 second

#### Test 10.2: Re-renders
- [ ] Typing in search doesn't reload until Enter
- [ ] Filter changes trigger single reload
- [ ] Form field changes don't trigger page reload

---

## ✅ Acceptance Criteria

### Must Pass
- [x] All 7 mock products display correctly
- [x] Create product form validates and submits
- [x] Edit product form pre-populates and updates
- [x] Delete product works with confirmation
- [x] Search and filters work correctly
- [x] Bulk status update works for multiple products
- [x] Inventory adjustment dialog works for all variants
- [x] Stats cards calculate correctly
- [x] Mock mode banner visible
- [x] No console errors
- [x] All 77 endpoints documented in dev-tools

### Should Pass
- [ ] Responsive on mobile/tablet
- [ ] Keyboard navigation works
- [ ] Loading states shown during operations
- [ ] Error messages clear and helpful
- [ ] Success messages confirm actions

### Nice to Have
- [ ] Smooth transitions between pages
- [ ] Toast notifications instead of alerts
- [ ] Auto-save draft functionality
- [ ] Export products to CSV

---

## 🐛 Known Issues / Limitations

1. **Image Upload**: Placeholder only, not functional
2. **Mock Data**: Changes don't persist on page reload
3. **Real API**: Not connected yet (controlled by feature flag)
4. **Category Management**: Uses hardcoded categories
5. **Supplier Management**: Uses hardcoded suppliers

---

## 🔄 Next Steps

1. Connect to real Medusa backend
2. Implement image upload functionality
3. Add category management UI
4. Add supplier management UI
5. Implement product approval workflow
6. Add export/import functionality

---

## 📞 Support

- **Issues**: Report in project GitHub
- **Questions**: Contact development team
- **Documentation**: See `/docs/technical/`

---

**Last Updated**: 2026-08-24  
**Tested By**: [Your Name]  
**Version**: 1.0.0
