# Testing Guide: Product Proposal & Pricing Approval Workflow

**Created:** 2026-08-21  
**Module:** Products Pricing - Supplier to Admin workflow  
**Status:** ✅ Ready to test  

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Test Scenarios Overview](#test-scenarios-overview)
3. [Test Scenario 1: Supplier - Propose Product](#test-scenario-1-supplier---propose-product)
4. [Test Scenario 2: Supplier - View Products List](#test-scenario-2-supplier---view-products-list)
5. [Test Scenario 3: Admin - Review Pending Queue](#test-scenario-3-admin---review-pending-queue)
6. [Test Scenario 4: Admin - Approve Product](#test-scenario-4-admin---approve-product)
7. [Test Scenario 5: Admin - Reject Product](#test-scenario-5-admin---reject-product)
8. [Test Scenario 6: Verify Price Calculations](#test-scenario-6-verify-price-calculations)
9. [Test Scenario 7: Edge Cases & Validations](#test-scenario-7-edge-cases--validations)
10. [Expected Behaviors Summary](#expected-behaviors-summary)
11. [Known Mock Data](#known-mock-data)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### 0. **IMPORTANT: Fix Dependencies First** ⚠️

**Before starting the dev server**, ensure `@radix-ui/react-slider` is installed:

```bash
# Check if installed
npm list @radix-ui/react-slider

# If missing, install it
npm install @radix-ui/react-slider
```

**If you get permission or 403 errors:**
```bash
sudo chown -R $(whoami) ~/.npm-cache
npm cache clean --force
npm install
```

**✅ Verify:** Run `npm run dev` - should compile without errors

---

### 1. Environment Setup

**Verify `.env.local` has:**
```bash
NEXT_PUBLIC_MOCK_PRICING=true  # MUST be true for testing
NEXT_PUBLIC_MOCK_AUTH=true     # MUST be true for testing
```

### 2. Start Development Server

```bash
npm run dev
```

Server should start at: `http://localhost:3000`

### 3. Test Users

| Role     | Email                | Password     | ID                    |
|----------|----------------------|--------------|-----------------------|
| Supplier | supplier@test.com    | supplier123  | sel_uniformes_corp    |
| Admin    | admin@test.com       | admin123     | admin_001             |

---

## Test Scenarios Overview

**📌 IMPORTANT NOTE:**
- **Suppliers** only see **their own products** (filtered by seller_id)
- **Admins** see **all products** from all suppliers
- Test user `supplier@test.com` belongs to "Uniformes Corp" and sees only 3 products initially

| # | Scenario | Role | Duration | Priority |
|---|----------|------|----------|----------|
| 1 | Propose New Product | Supplier | 5 min | ⭐⭐⭐ |
| 2 | View Products List | Supplier | 3 min | ⭐⭐⭐ |
| 3 | Review Pending Queue | Admin | 3 min | ⭐⭐⭐ |
| 4 | Approve Product | Admin | 5 min | ⭐⭐⭐ |
| 5 | Reject Product | Admin | 3 min | ⭐⭐⭐ |
| 6 | Price Calculations | Admin | 5 min | ⭐⭐ |
| 7 | Edge Cases | Both | 10 min | ⭐⭐ |

**Total Time:** ~35 minutes

---

## Test Scenario 1: Supplier - Propose Product

**⚠️ IMPORTANT NOTE:** Products created in this scenario **will NOT appear** in Test Scenario 3 (Admin Queue) due to mock state reset when switching users. This is a known limitation of the current mock implementation. You can either:
- Skip this scenario and use pre-existing mock products for testing
- Test this scenario independently to verify the form works
- Use two browser windows (normal + incognito) to test both roles simultaneously

### Objective
Verify that a supplier can successfully propose a new product.

### Steps

#### 1.1 Login as Supplier

1. Navigate to: `http://localhost:3000/login`
2. Enter credentials:
   - Email: `supplier@test.com`
   - Password: `supplier123`
3. Click **"Iniciar Sesión"**

**✅ Expected:**
- Redirect to `/supplier/dashboard`
- Header shows "supplier@test.com" in user menu

---

#### 1.2 Navigate to Products

1. In sidebar, click **"Mis Productos"**
2. Or navigate to: `http://localhost:3000/supplier/products`

**✅ Expected:**
- Page title: "Mis Productos"
- Button: "Nuevo Producto" (top right)
- See existing mock products in table

---

#### 1.3 Create New Product

1. Click **"Nuevo Producto"** button
2. Verify redirect to: `/supplier/products/new`

**✅ Expected:**
- Page title: "Nuevo Producto"
- Form with all fields visible
- Back button with arrow

---

#### 1.4 Fill Product Form

**Fill with these test values:**

| Field | Value |
|-------|-------|
| Título del Producto * | `Gorra Corporativa Ajustable` |
| Descripción | `Gorra de alta calidad con cierre ajustable. Logo bordado. Varios colores disponibles.` |
| Precio Base (€) * | `12,50` (Spanish format - you can also type `12.50` and it will be accepted) |
| Unidades por Paquete * | `20` |
| Categoría | `Uniformes` |
| Subcategoría | `Accesorios` |
| Etiquetas | `gorra, corporativo, bordado, accesorios` |
| URL de Imagen Principal | `https://placehold.co/400x400/e3f2fd/1976d2?text=Gorra` |
| Código EAN | `8425678901234` |
| IVA (%) | `21` |

**✅ Expected:**
- All fields accept input
- Numeric fields accept numbers with both comma (,) and dot (.) as decimal separator
- URL field validates format

---

#### 1.5 Submit Product

1. Click **"Proponer Producto"** button

**✅ Expected:**
- Loading spinner appears
- Button shows "Enviando..."
- After ~500ms:
  - ✅ **Success toast:** "Producto propuesto correctamente"
  - ✅ **Message:** "El producto está pendiente de aprobación por el equipo de Infocus."
  - ✅ **Redirect** to `/supplier/products`

---

#### 1.6 Verify Product in List

1. On products list page, check the table

**✅ Expected:**
- New product "Gorra Corporativa Ajustable" appears **at the top** of the list
- Badge shows: **"Pendiente"** (yellow)
- Price shows: **"€12,50"**
- Units/Pack shows: **"20"**
- Date shows: **today's date**
- Total products now: **4** (3 existing + 1 new)
- Pendientes count updated to: **3**

---

### Test Case 1 - Validation Errors

**Objective:** Test form validation

1. Click "Nuevo Producto" again
2. Leave **Título** empty
3. Enter `0` in **Precio Base**
4. Click "Proponer Producto"

**✅ Expected:**
- Red error message under Título: "El título debe tener al menos 3 caracteres"
- Red error message under Precio: "El precio debe ser mayor a 0"
- Form does NOT submit
- Stays on same page

---

### Test Case 2 - Cancel Flow

1. Click "Nuevo Producto"
2. Fill some fields
3. Click **"Cancelar"** button

**✅ Expected:**
- Redirect back to `/supplier/products`
- No product created

---

## Test Scenario 2: Supplier - View Products List

### Objective
Test filtering, searching, and viewing product status.

### Steps

#### 2.1 View All Products

1. Go to: `http://localhost:3000/supplier/products`

**✅ Expected:**
- See **3 products total** from Uniformes Corp (supplier only sees their own products)
- Filter tabs show counts:
  - **Todos (3)**
  - **Pendientes (2)** - "Polo Corporativo" + "Camiseta Corporativa"
  - **Aprobados (1)** - "Pantalón de Trabajo"
  - **Rechazados (0)** - This supplier has no rejected products

---

#### 2.2 Filter by Status

1. Click tab **"Pendientes"**

**✅ Expected:**
- Shows only 2 products with yellow badge
- "Polo Corporativo Manga Corta"
- "Camiseta Corporativa Cuello Redondo"

2. Click tab **"Aprobados"**

**✅ Expected:**
- Shows only 1 approved product (green badge)
- "Pantalón de Trabajo Multibolsillos"

3. Click tab **"Rechazados"**

**✅ Expected:**
- Empty state: "No hay productos rechazados"
- Package icon displayed
- This supplier (Uniformes Corp) has no rejected products
- *Note: Other suppliers have rejected products, but suppliers only see their own*

---

#### 2.3 Search Functionality

1. Go back to **"Todos"** tab
2. In search box, type: `polo`

**✅ Expected:**
- Filter instantly shows only "Polo Corporativo Manga Corta"
- Other products hidden

3. Clear search (delete text)

**✅ Expected:**
- All 3 products visible again

4. Type: `camiseta`

**✅ Expected:**
- Shows only "Camiseta Corporativa Cuello Redondo"

5. Type: `pantalon`

**✅ Expected:**
- Shows only "Pantalón de Trabajo Multibolsillos"

6. Type: `corporativ` (partial match)

**✅ Expected:**
- Shows 2 products: "Polo Corporativo" and "Camiseta Corporativa"

---

#### 2.4 View Product Details

1. Click **"Ver"** button on any product

**✅ Expected (future implementation):**
- Opens product detail page
- Shows full information
- For now: This will error (not implemented yet)

---

## Test Scenario 3: Admin - Review Pending Queue

### Objective
Verify admin can see and filter pending products.

### Steps

#### 3.1 Login as Admin

1. **Logout** from supplier account
   - Click user menu (top right)
   - Click "Cerrar Sesión"

2. Login with admin credentials:
   - Email: `admin@test.com`
   - Password: `admin123`

**✅ Expected:**
- Redirect to `/admin/dashboard`

---

#### 3.2 Navigate to Pricing Queue

1. Navigate to: `http://localhost:3000/admin/products/pricing`
   - ⚠️ **Important:** The sidebar link doesn't exist yet - you MUST type the URL manually
   - Alternative: Add bookmark in browser for quick access

**✅ Expected:**
- Page title: "Aprobación de Productos"
- Blue package icon in header

**❌ If compilation fails:**
- Error: "Module not found: Can't resolve '@radix-ui/react-slider'"
- **Solution:** Run `npm install @radix-ui/react-slider`
- See [Troubleshooting Issue 7](#issue-7-slider-not-moving-smoothly) for details

---

#### 3.3 Verify Stats Cards

**✅ Expected - 3 stat cards:**

| Card | Value | Description |
|------|-------|-------------|
| Productos Pendientes | **4** | 2 from Uniformes Corp + 1 Tech Supplies + 1 Food Distributor |
| Proveedores Activos | **3** | Uniformes Corp, Tech Supplies, Food Distributor |
| Valor Total Propuesto | **€489,40** | Sum of all pending base prices (18.50 + 450 + 12 + 8.90) |

**⚠️ Note:** The "Gorra Corporativa" product created in Test Scenario 1 **does NOT appear here**. This is expected in mock mode - products created in one user session don't persist when switching to a different user (logout/login resets mock state). This is a limitation of the current mock implementation.

---

#### 3.4 View Products Table

**✅ Expected - Table shows 4 pending products:**

| Producto | Proveedor | Precio Base | Unidades/Pack | Fecha |
|----------|-----------|-------------|---------------|-------|
| Camiseta Corporativa | Uniformes Corp | €8,90 | 25 | 2026-08-20 |
| Café en Grano Premium 1kg | Food Distributor | €12,00 | 6 | 2026-08-20 |
| Laptop Dell Latitude 5420 | Tech Supplies | €450,00 | 1 | 2026-08-19 |
| Polo Corporativo Manga Corta | Uniformes Corp | €18,50 | 10 | 2026-08-18 |

Each row has a **"Revisar"** button.

**Note:** Products are sorted by creation date (newest first). The "Gorra Corporativa" you created earlier is NOT shown here due to mock state reset when switching users.

---

#### 3.5 Filter by Supplier

1. Click **"Filtrar por proveedor"** dropdown
2. See available options:
   - **"Todos los proveedores"**
   - **"Uniformes Corp (2 pendientes)"** - Camiseta, Polo
   - **"Tech Supplies (1 pendiente)"** - Laptop
   - **"Food Distributor (1 pendiente)"** - Café
   - Office Supplies Pro (0 pendientes)

3. Select **"Uniformes Corp"**

**✅ Expected:**
- Shows 2 products (Camiseta, Polo)
- Stats update:
  - Productos Pendientes: **2**
  - Proveedores Activos: **1**
  - Valor Total: **€27,40** (8.90 + 18.50)

4. Select **"Tech Supplies"**

**✅ Expected:**
- Shows 1 product: "Laptop Dell Latitude 5420"
- Stats update:
  - Productos Pendientes: **1**
  - Valor Total: **€450,00**

5. Select **"Office Supplies Pro"**

**✅ Expected:**
- Empty state message: "Este proveedor no tiene productos pendientes"
- Package icon displayed
- Stats show 0

6. Select **"Todos los proveedores"** again

**✅ Expected:**
- Back to showing 4 products
- Stats reset to original values (Pendientes: 4, Valor: €489,40)

---

#### 3.6 Refresh Queue

1. Click **"Actualizar"** button

**✅ Expected:**
- Loading state briefly
- Same data loads again
- No errors in console

---

## Test Scenario 4: Admin - Approve Product

### Objective
Test the complete approval workflow with markup calculation.

### Steps

#### 4.1 Open Review Panel

1. On Pricing Queue page
2. Click **"Revisar"** on "Polo Corporativo Manga Corta"

**✅ Expected:**
- Modal/dialog opens
- Modal is **large** (max-w-4xl)
- Modal has scroll if content is long
- "Volver a la Cola" button in header

---

#### 4.2 Verify Product Details Card

**✅ Expected - Product card shows:**
- Placeholder image (blue with text "Polo")
- Title: "Polo Corporativo Manga Corta"
- Description: "Polo de alta calidad para uso corporativo. 100% algodón peinado."
- Proveedor: "Uniformes Corp" with user icon
- Precio Base: **€18,50** (large, bold)
- Unidades/Pack: **10 unidades**
- Fecha Propuesta: 18 ago 2026 with calendar icon
- Categoría: "cat_uniformes" badge
- Tags badges (polo, uniformes, corporativo)
- EAN: `8421234567890` in monospace font

---

#### 4.3 Test Price Calculator

**✅ Expected - Calculator card shows:**
- Title: "Calculadora de Precio Final" with calculator icon
- **Precio Base (readonly):** €18,50 (large, bold)
- **Markup slider:** From 0 to 500
- **Markup input:** Number field showing current markup
- **Calculation breakdown box** (gray background):
  - Precio Base: €18,50
  - Markup (X%): +€Y.YY (green)
  - Divider line
  - Precio Final: €Z.ZZ (green, large, with trending up icon)
- **Formula display** (blue background, monospace)
- **Quick shortcuts:** Buttons for 5%, 10%, 15%, 20%, 25%, 30%

---

#### 4.4 Test Markup Calculation - Manual Input

1. In markup input field, type: `15`
2. Press Enter or tab

**✅ Expected:**
- Slider moves to position 15
- Calculation updates:
  - Precio Base: €18,50
  - Markup (15%): **+€2,78** (green)
  - Precio Final: **€21,28** (green, large)
- Formula shows: `€18,50 × (1 + 15%) = €21,28`

---

#### 4.5 Test Markup Calculation - Slider

1. Drag slider to approximately 25%

**✅ Expected:**
- Input field updates to match slider value
- Calculation updates in real-time:
  - Markup (25%): **+€4,63**
  - Precio Final: **€23,13**
- Formula updates: `€18,50 × (1 + 25%) = €23,13`

---

#### 4.6 Test Quick Shortcuts

1. Click **"10%"** quick button

**✅ Expected:**
- Slider jumps to 10
- Input shows 10
- Calculation:
  - Markup (10%): **+€1,85**
  - Precio Final: **€20,35**
- Button "10%" is highlighted (primary color)

2. Click **"30%"** quick button

**✅ Expected:**
- Updates to 30%
- Precio Final: **€24,05**

---

#### 4.7 Verify Global Markup Notice

**✅ Expected:**
- Since this supplier has global markup of 8%
- You should see a badge: **"Usando markup global del proveedor"** if you set markup to 8%
- If markup ≠ 8%, you see warning: "ℹ️ El proveedor tiene un markup global del 8%. Estás aplicando un markup específico del X% para este producto."

---

#### 4.8 Approve Product

1. Set markup to **15%**
2. Verify final price is **€21,28**
3. Click **"Aprobar"** button (green, bottom right)

**✅ Expected:**
- Confirmation dialog opens:
  - Title: "Aprobar Producto"
  - Description mentions 15% markup
  - Green box shows price breakdown:
    - Precio Base: €18,50
    - Markup: 15%
    - Precio Final: €21,28 (green, large)
  - Two buttons: "Cancelar" and "Confirmar Aprobación"

---

#### 4.9 Confirm Approval

1. Click **"Confirmar Aprobación"**

**✅ Expected:**
- Button shows loading: "Aprobando..." with spinner
- After ~500ms:
  - ✅ **Success toast:** "Producto aprobado"
  - ✅ **Message:** "Polo Corporativo Manga Corta ha sido aprobado con un markup del 15%"
  - ✅ **Modal closes** automatically
  - ✅ **Product removed from queue table**
  - ✅ **Stats update:** Productos Pendientes now shows **3** (Camiseta, Laptop, Café)

---

#### 4.10 Verify Product Gone

**✅ Expected:**
- "Polo Corporativo Manga Corta" removed from queue table
- Remaining products: **3 pending** (Camiseta, Laptop, Café)
- Stats card updated:
  - Productos Pendientes: **3**
  - Proveedores Activos: **3** (Uniformes Corp, Tech Supplies, Food Distributor)
  - Valor Total Propuesto: **€470,90** (8.90 + 450 + 12)

---

## Test Scenario 5: Admin - Reject Product

### Objective
Test product rejection workflow.

### Steps

#### 5.1 Review Remaining Product

1. Click **"Revisar"** on "Camiseta Corporativa Cuello Redondo"

**✅ Expected:**
- Modal opens
- Shows product: Camiseta Corporativa with placeholder image

---

#### 5.2 Initiate Rejection

1. Click **"Rechazar"** button (red, bottom left)

**✅ Expected:**
- Rejection dialog opens:
  - Title: "Rechazar Producto"
  - Description: "Proporciona un motivo para el rechazo. Esto será enviado al proveedor."
  - Textarea field: "Motivo del Rechazo *"
  - Placeholder text visible
  - Two buttons: "Cancelar" and "Confirmar Rechazo" (red)

---

#### 5.3 Test Validation - Empty Reason

1. Leave textarea **empty**
2. Click **"Confirmar Rechazo"**

**✅ Expected:**
- Toast error: "Motivo requerido"
- Message: "Debes proporcionar un motivo para el rechazo"
- Dialog stays open
- No product rejected

---

#### 5.4 Reject with Valid Reason

1. In textarea, type:
   ```
   El diseño del producto no cumple con los estándares de calidad requeridos. 
   La imagen proporcionada no es suficientemente clara.
   ```

2. Click **"Confirmar Rechazo"**

**✅ Expected:**
- Button shows: "Rechazando..." with spinner
- After ~500ms:
  - ✅ **Toast:** "Producto rechazado"
  - ✅ **Message:** "Camiseta Corporativa Cuello Redondo ha sido rechazado"
  - ✅ **Modal closes**
  - ✅ **Product removed from queue**

---

#### 5.5 Verify Product Removed

**✅ Expected:**
- "Camiseta Corporativa Cuello Redondo" removed from queue
- Remaining products: **2 pending** (Laptop, Café)
- Stats cards updated:
  - Productos Pendientes: **2**
  - Proveedores Activos: **2** (Tech Supplies, Food Distributor)
  - Valor Total Propuesto: **€462,00** (450 + 12)
- Table shows remaining 2 pending products

**Note:** The queue is NOT empty yet - there are still 2 products to review.

---

## Test Scenario 6: Verify Price Calculations

### Objective
Test various markup percentages and verify calculations are correct.

**⚠️ IMPORTANT NOTE:** Due to mock state persistence limitation, use **one of the existing pending products** for this test instead of creating a new one. We recommend using **"Laptop Dell Latitude 5420"** (€450,00) or any other pending product.

**Alternative:** If you want to test with a clean €100 base price, use the two-browser-window method:
1. Normal window: Login as supplier, create product with €100 base
2. Incognito window: Login as admin, review the product immediately
3. Both sessions stay active simultaneously

### Steps

#### 6.1 Skip Product Creation (Use Existing Mock Data)

~~1. Logout from admin~~
~~2. Login as supplier (`supplier@test.com`)~~
~~3. Create a new product with €100 base~~

**Instead:** Proceed directly to 6.2 and use an existing pending product.

---

#### 6.2 Login as Admin and Review Existing Product

1. Login as admin (if not already)
2. Go to `/admin/products/pricing`
3. Click **"Revisar"** on any pending product:
   - **Recommended:** "Laptop Dell Latitude 5420" (€450,00) - easier to verify large numbers
   - **OR:** "Café en Grano Premium 1kg" (€12,00) - smaller numbers
   - **OR:** "Polo Corporativo" (€18,50) - already used in Scenario 4
   - **OR:** "Camiseta Corporativa" (€8,90) - if not already rejected in Scenario 5

---

#### 6.3 Test Specific Markups

**Note:** The exact final prices will depend on which product you selected. Below are calculation tables for different base prices.

**Option A: Using "Laptop Dell Latitude 5420" (€450,00)**

| Markup % | Base Price | Markup Amount | Final Price | Formula |
|----------|------------|---------------|-------------|---------|
| 0%       | €450,00    | €0,00         | €450,00     | 450 × 1.00 |
| 10%      | €450,00    | €45,00        | €495,00     | 450 × 1.10 |
| 25%      | €450,00    | €112,50       | €562,50     | 450 × 1.25 |
| 50%      | €450,00    | €225,00       | €675,00     | 450 × 1.50 |
| 100%     | €450,00    | €450,00       | €900,00     | 450 × 2.00 |

**Option B: Using "Polo Corporativo" (€18,50)**

| Markup % | Base Price | Markup Amount | Final Price | Formula |
|----------|------------|---------------|-------------|---------|
| 0%       | €18,50     | €0,00         | €18,50      | 18.50 × 1.00 |
| 10%      | €18,50     | €1,85         | €20,35      | 18.50 × 1.10 |
| 25%      | €18,50     | €4,63         | €23,13      | 18.50 × 1.25 |
| 50%      | €18,50     | €9,25         | €27,75      | 18.50 × 1.50 |
| 100%     | €18,50     | €18,50        | €37,00      | 18.50 × 2.00 |

**Option C: Using "Café en Grano" (€12,00)**

| Markup % | Base Price | Markup Amount | Final Price | Formula |
|----------|------------|---------------|-------------|---------|
| 0%       | €12,00     | €0,00         | €12,00      | 12 × 1.00 |
| 10%      | €12,00     | €1,20         | €13,20      | 12 × 1.10 |
| 25%      | €12,00     | €3,00         | €15,00      | 12 × 1.25 |
| 50%      | €12,00     | €6,00         | €18,00      | 12 × 1.50 |
| 100%     | €12,00     | €12,00        | €24,00      | 12 × 2.00 |

**For each markup:**
1. Set the markup value (using slider or input field)
2. Verify the calculation matches the table for your selected product
3. Verify formula is correct
4. Verify markup amount (green text) is accurate

**✅ Expected:**
- All calculations accurate to 2 decimal places
- No rounding errors
- Formula matches calculation
- Markup amount = Base Price × (Markup% ÷ 100)
- Final Price = Base Price + Markup Amount

---

#### 6.4 Test Edge Cases

**Using the product you selected in 6.2**, test these edge case markups:

**Test 1: Decimal Markup**
- Set markup: **15,5%** (Spanish format with comma - recommended)
- Expected formula: `Base × 1.155`
- **Input behavior:** Type "15,5" - shows exactly "15,5" (Spanish format preserved!)
- You can also type "15.5" (dot) - it will convert to "15,5" on blur
- Example with €450: **€519,75**
- Example with €18.50: **€21,37**
- Example with €12: **€13,86**

**Test 2: Very Small Markup**
- Set markup: **0,5%** (Spanish format)
- Expected formula: `Base × 1.005`
- **Input behavior:** Type "0,5" - displays exactly "0,5" ✓ (Spanish format!)
- Example with €450: **€452,25**
- Example with €18.50: **€18,59**
- Example with €12: **€12,06**

**Test 3: Maximum Markup**
- Set markup: **500%**
- Expected formula: `Base × 6.00`
- Example with €450: **€2.700,00**
- Example with €18.50: **€111,00**
- Example with €12: **€72,00**

**Test 4: Slider Limits**
- Try to drag slider beyond 500 → **Should stop at 500**
- Try to type `501` in input → **Accepts but clamps to 500 on blur**
- Try to type `-5` in input → **Accepts but clamps to 0 on blur**
- Clear the input completely → **Shows 0 on blur**

**Test 5: Input Field Format (Spanish Locale)**
- Type "25" → **Shows exactly "25"** ✓
- Type "25,5" (comma) → **Shows exactly "25,5"** ✓ (Spanish format preserved!)
- Type "25.5" (dot) → Shows "25.5" while typing, **converts to "25,5" on blur** ✓
- Type "8" → **Shows exactly "8"** ✓
- Type "100" → **Shows exactly "100"** ✓
- Type "0,5" → **Shows exactly "0,5"** ✓ (no leading zeros, Spanish comma!)
- **Slider movement:** Displays with comma (e.g., "12,5" not "12.5") ✓
- **Quick buttons:** Whole numbers show as-is (e.g., "10"), decimals use comma ✓

**Test 6: Quick Shortcuts Precision**
- Click each quick button (5%, 10%, 15%, 20%, 25%, 30%)
- Verify exact percentage is set (not approximated)
- Verify active button is highlighted
- Verify calculation updates instantly
- Input field shows whole numbers cleanly (e.g., "5", "10", "15")

**✅ Expected for all tests:**
- Calculations accurate to 2 decimal places
- **Spanish locale format throughout: comma (,) as decimal separator**
- Input accepts both comma and dot, but **displays with comma**
- No rounding errors
- Formula display matches calculation
- Slider and input stay synchronized
- **Input displays numbers cleanly without leading zeros**
- **Spanish format (0,5) preserved, not British format (0.5)**

---

## Test Scenario 7: Edge Cases & Validations

### Objective
Test boundary conditions and error handling.

### Steps

#### 7.1 Product Form Validations

**Test as Supplier:**

1. Go to "Nuevo Producto"

**Test Case 1.1: Required Fields**
- Submit form completely empty
- **Expected:** Error messages on all required fields (*)

**Test Case 1.2: Minimum Values**
- Precio Base: `-10`
- **Expected:** Error "El precio debe ser mayor a 0"

**Test Case 1.3: Zero Price**
- Precio Base: `0`
- **Expected:** Error "El precio debe ser mayor a 0"

**Test Case 1.4: Units per Pack**
- Unidades por Paquete: `0`
- **Expected:** Error "Debe haber al menos 1 unidad por paquete"

**Test Case 1.5: Invalid URL**
- URL Imagen: `not-a-url`
- **Expected:** Error "URL de imagen inválida"

**Test Case 1.6: Very Large Price**
- Precio Base: `999999,99` (Spanish format with comma)
- **Expected:** Accepts (no maximum limit)
- Note: Input field should accept both `999999.99` (dot) and `999999,99` (comma)

**Test Case 1.7: Title Length**
- Título: `AB` (2 characters)
- **Expected:** Error "El título debe tener al menos 3 caracteres"

- Título: `ABC` (3 characters)
- **Expected:** Valid ✅

---

#### 7.2 Admin Markup Validations

**Test as Admin:**

1. Review any product

**Test Case 2.1: Negative Markup**
- Try to set markup: `-5`
- **Expected:** Input field prevents negative values OR clamped to 0

**Test Case 2.2: Over Maximum**
- Try to set markup: `501`
- **Expected:** Clamped to 500 (maximum allowed)

**Test Case 2.3: Non-numeric Input**
- Try to type letters in markup input
- **Expected:** Input field only accepts numbers

---

#### 7.3 Filter & Search Edge Cases

**Test as Supplier:**

1. Go to Products List

**Test Case 3.1: No Results**
- Search: `xxxxyyyy123`
- **Expected:** 
  - Message: "No se encontraron productos con ese criterio"
  - Package icon shown
  - Empty table

**Test Case 3.2: Case Insensitive**
- Search: `POLO` (uppercase)
- **Expected:** Finds "Polo Corporativo Manga Corta" (case-insensitive match) ✓
- **Note:** Search is case-insensitive - "POLO", "polo", "PoLo" all work

**Test Case 3.3: Partial Match**
- Search: `Cor` 
- **Expected:** Finds "Polo Corporativo" and "Camiseta Corporativa" (both match "Cor")

**Test Case 3.4: Filter + Search Combined**
- Set filter: "Pendientes"
- Search: "polo"
- **Expected:** Shows only pending products matching "polo"

---

#### 7.4 Empty States

**Test Case 4.1: Supplier with No Products**
- In mock mode, this won't happen
- But you can verify the empty state code exists in ProductsList.tsx

**Test Case 4.2: Admin with No Pending Products**
- Approve or reject all pending products
- **Expected:** 
  - Empty state message: "¡Excelente! No hay productos pendientes de aprobación"
  - Package icon
  - Stats show 0

**Test Case 4.3: Filter by Supplier with No Pending**
- Filter by "Tech Supplies"
- **Expected:** "Este proveedor no tiene productos pendientes"

---

#### 7.5 Modal/Dialog Behaviors

**Test Case 5.1: Close with X**
- Open product review modal
- Click X button (top right)
- **Expected:** Modal closes, back to queue

**Test Case 5.2: Close with Overlay**
- Open modal
- Click outside modal (on dark overlay)
- **Expected:** Modal closes

**Test Case 5.3: Close with "Volver a la Cola"**
- Open modal
- Click "Volver a la Cola" button
- **Expected:** Modal closes

**Test Case 5.4: Nested Dialogs**
- Open product review modal
- Click "Aprobar"
- **Expected:** Confirmation dialog opens on top
- Click "Cancelar"
- **Expected:** Confirmation closes, review modal still open

**Test Case 5.5: ESC Key**
- Open modal
- Press ESC key
- **Expected:** Modal closes

---

#### 7.6 Loading States

**Test Case 6.1: Form Submission Loading**
- Fill product form
- Click "Proponer Producto"
- **During loading:**
  - Button disabled
  - Shows "Enviando..."
  - Spinner icon visible
  - Cannot click again

**Test Case 6.2: Approval Loading**
- Click "Aprobar"
- Click "Confirmar Aprobación"
- **During loading:**
  - Button shows "Aprobando..."
  - Spinner visible
  - Buttons disabled

**Test Case 6.3: Page Loading**
- Navigate to `/supplier/products`
- **Expected:** 
  - Loading spinner while fetching
  - "Cargando productos..." message
  - Then data appears

---

## Expected Behaviors Summary

### ✅ Supplier Functionality

| Action | Expected Result |
|--------|-----------------|
| Create product | Product added with `pending_approval` status |
| View products list | See all own products with correct badges |
| Filter by status | Only matching products shown |
| Search products | Case-insensitive partial match |
| View approved product | Green badge, shows final price if available |
| View rejected product | Red badge, shows rejection reason |

### ✅ Admin Functionality

| Action | Expected Result |
|--------|-----------------|
| View pending queue | See all pending products from all suppliers |
| Filter by supplier | Show only products from selected supplier |
| Review product | Modal opens with full details |
| Use price calculator | Real-time calculation updates |
| Set markup via slider | Smooth interaction, instant update |
| Set markup via input | Validates range 0-500 |
| Use quick shortcuts | Jumps to preset markup values |
| Approve product | Product removed from queue, toast shown |
| Reject product | Requires reason, product removed, toast shown |
| Refresh queue | Reloads data without errors |

### ✅ Data Integrity

| Scenario | Expected |
|----------|----------|
| Markup calculation | Always accurate to 2 decimals |
| Price formatting | Always shows € symbol, 2 decimals |
| Date formatting | Spanish locale (dd mmm yyyy) |
| Stats accuracy | Counts match visible products |
| Filter consistency | Multiple filters work together |

---

## Known Mock Data

### Mock Sellers

| ID | Name | Email | Global Markup |
|----|------|-------|---------------|
| sel_uniformes_corp | Uniformes Corp | contacto@uniformescorp.com | 8% |
| sel_tech_supplies | Tech Supplies | ventas@techsupplies.com | 12% |
| sel_food_distributor | Food Distributor S.L. | admin@fooddist.es | 5% |
| sel_office_supplies | Office Supplies Pro | info@officesupplies.com | 15% |

### Initial Mock Products

**Pending (4):**
1. **Polo Corporativo Manga Corta** - €18.50 - Uniformes Corp
2. **Laptop Dell Latitude 5420** - €450.00 - Tech Supplies
3. **Café en Grano Premium 1kg** - €12.00 - Food Distributor
4. **Camiseta Corporativa** (with 4 variants) - €8.90 - Uniformes Corp

**Approved (4):**
5. **Ratón Inalámbrico Logitech** - €25.00 (markup: uses global 12%) - Tech Supplies
6. **Aceite de Oliva Virgen Extra** - €24.50 (markup: 15% specific) - Food Distributor
7. **Pantalón de Trabajo** - €32.00 (markup: uses global 8%) - Uniformes Corp
8. **Pack 10 Bolígrafos** - €3.50 (markup: uses global 15%) - Office Supplies

**Rejected (2):**
9. **Reloj Smartwatch Luxury** - €999.00 - Tech Supplies
   - Reason: "Precio base excede el límite acordado en contrato (máx. €800)"
10. **Vino Tinto Reserva** - €45.00 - Food Distributor
   - Reason: "No tenemos licencia para venta de bebidas alcohólicas en este momento"

---

### Products by Supplier

**Uniformes Corp (sel_uniformes_corp):**
- ✅ Pending: Polo Corporativo, Camiseta Corporativa
- ✅ Approved: Pantalón de Trabajo
- ❌ Rejected: (none)

**Tech Supplies (sel_tech_supplies):**
- ✅ Pending: Laptop Dell
- ✅ Approved: Ratón Inalámbrico
- ❌ Rejected: Reloj Smartwatch

**Food Distributor (sel_food_distributor):**
- ✅ Pending: Café en Grano
- ✅ Approved: Aceite de Oliva
- ❌ Rejected: Vino Tinto

**Office Supplies Pro (sel_office_supplies):**
- ✅ Pending: (none)
- ✅ Approved: Pack Bolígrafos
- ❌ Rejected: (none)

---

## Troubleshooting

### Issue 1: "Cannot read property of undefined"

**Cause:** Mock mode not enabled  
**Solution:** 
1. Check `.env.local` has `NEXT_PUBLIC_MOCK_PRICING=true`
2. Restart dev server: `npm run dev`

---

### Issue 2: Products not showing

**Cause:** API client error or auth issue  
**Solution:**
1. Check browser console for errors
2. Verify logged in as correct user
3. Check network tab for API calls
4. Verify mock data in `products-pricing-mock.ts`
5. **Important:** Suppliers only see their own products (filtered by seller_id)

---

### Issue 2b: Supplier sees different products than expected

**Cause:** Each supplier only sees their own products  
**Solution:**
- `supplier@test.com` (Uniformes Corp) sees: 2 pending + 1 approved + 0 rejected = **3 total**
- Rejected products belong to other suppliers (Tech Supplies, Food Distributor)
- This is correct behavior - suppliers are isolated to their own catalog

---

### Issue 2c: Product created in Test Scenario 1 doesn't appear in Admin queue

**Cause:** Mock data doesn't persist across user sessions (logout/login)  
**Symptoms:**
- Created "Gorra Corporativa" as supplier
- Logged out and logged in as admin
- Product not visible in `/admin/products/pricing`

**Solution:** This is **expected behavior** in current mock implementation:
- Mock data store (`mockProductsStore`) is in-memory only
- Logging out/logging in resets the authentication state
- The product you created exists in the store but the queue doesn't refresh properly

**Workaround for testing:**
1. Use the 4 pre-existing mock products for Test Scenarios 3-5
2. Skip Test Scenario 1 (product creation) when testing admin flow
3. **OR** test creation and approval in a single session without logout:
   - Login as supplier
   - Create product
   - **Don't logout** - open new incognito/private window
   - Login as admin in the new window
   - Review the product there

**This will be fixed** when:
- Real backend is connected (products persist in database)
- Mock implementation uses localStorage or sessionStorage for persistence

---

### Issue 3: Markup calculation incorrect

**Cause:** JavaScript precision issues  
**Solution:**
1. Verify formula: `finalPrice = basePrice * (1 + markup / 100)`
2. Check `formatPrice()` uses 2 decimal places
3. Test with simple numbers (100, 10%) first

---

### Issue 4: Modal not opening

**Cause:** Dialog component issue  
**Solution:**
1. Check console for errors
2. Verify `@radix-ui/react-dialog` is installed
3. Check dialog state in React DevTools

---

### Issue 5: Stats not updating after approve/reject

**Cause:** State not refreshing  
**Solution:**
1. Verify `refreshTrigger` state is incrementing in AdminPricingPage
2. Check `key={refreshTrigger}` prop on PricingQueue
3. This forces component remount and data refetch

---

### Issue 6: Toast not appearing

**Cause:** Toaster component not rendered  
**Solution:**
1. Check `layout.tsx` has `<Toaster />` component
2. Verify `useToast()` hook is imported correctly

---

### Issue 7: Slider not moving smoothly

**Cause:** Radix UI slider not installed  
**Solution:**
```bash
npm install @radix-ui/react-slider
```

**If npm fails with 403 or permission errors:**
1. Fix npm cache permissions:
```bash
sudo chown -R $(whoami) ~/.npm-cache
```

2. Clear cache:
```bash
npm cache clean --force
```

3. Try install again:
```bash
npm install @radix-ui/react-slider
```

**If still fails:**
```bash
# Nuclear option - reinstall all packages
rm -rf node_modules package-lock.json
npm install
```

**Alternative:** The package is already added to `package.json`, so a fresh `npm install` should work once permissions are fixed.

---

### Issue 8: Currency formatting wrong

**Cause:** Locale issue  
**Solution:**
1. Check `pricing-calculator.ts` uses locale `'es-ES'`
2. Verify currency is set to `'EUR'`
3. Format should be: `€12,50` (comma as decimal separator)

---

### Issue 9: "Failed to compile" - Module not found @radix-ui/react-slider

**Cause:** Missing dependency for PriceCalculator component  
**Symptoms:**
- Compilation error when accessing `/admin/products/pricing`
- Error message: "Can't resolve '@radix-ui/react-slider'"
- Import trace shows: PriceCalculator.tsx → ProductReviewPanel.tsx → pricing/page.tsx

**Solution:**
1. **Quick fix:** Install the missing package
```bash
npm install @radix-ui/react-slider
```

2. **If Step 1 fails:** Fix npm permissions first
```bash
sudo chown -R $(whoami) ~/.npm-cache
npm cache clean --force
npm install @radix-ui/react-slider
```

3. **If still failing:** Complete reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

**Verification:**
- Check `package.json` has `"@radix-ui/react-slider": "^1.2.1"`
- Run `npm run dev` - should compile without errors
- Navigate to `/admin/products/pricing` - should load successfully

---

## Success Criteria Checklist

Use this checklist to verify all functionality works:

### Supplier Features
- [ ] Can login as supplier
- [ ] Can navigate to products page
- [ ] Can click "Nuevo Producto" button
- [ ] Can fill complete product form
- [ ] Form validation works for all fields
- [ ] Can submit product successfully
- [ ] Success toast appears
- [ ] Redirects to products list
- [ ] New product appears in list with "Pendiente" badge
- [ ] Can filter products by status (Todos/Pendientes/Aprobados/Rechazados)
- [ ] Filter counts are accurate
- [ ] Can search products by title
- [ ] Search is case-insensitive
- [ ] Can see product details in table
- [ ] Can see rejection reason for rejected products
- [ ] Images display correctly (or placeholder shown)

### Admin Features
- [ ] Can login as admin
- [ ] Can navigate to pricing queue
- [ ] Stats cards show correct numbers
- [ ] Can see all pending products in table
- [ ] Can filter by supplier
- [ ] Filter updates table and stats
- [ ] Can refresh queue
- [ ] Can click "Revisar" to open product review
- [ ] Modal opens with full product details
- [ ] Product image displays (or placeholder)
- [ ] All product metadata visible
- [ ] Price calculator displays correctly
- [ ] Can move markup slider smoothly
- [ ] Can type markup percentage manually
- [ ] Markup value syncs between slider and input
- [ ] Quick shortcut buttons work (5%, 10%, etc.)
- [ ] Price calculation updates in real-time
- [ ] Calculation breakdown is accurate
- [ ] Formula display is correct
- [ ] Notice about global markup shows when applicable
- [ ] Can click "Aprobar" button
- [ ] Approval confirmation dialog opens
- [ ] Price breakdown in confirmation is correct
- [ ] Can confirm approval
- [ ] Success toast appears
- [ ] Modal closes automatically
- [ ] Product removed from queue
- [ ] Stats update correctly
- [ ] Can click "Rechazar" button
- [ ] Rejection dialog opens
- [ ] Cannot submit without reason
- [ ] Validation error shows for empty reason
- [ ] Can enter rejection reason
- [ ] Can confirm rejection
- [ ] Success toast appears
- [ ] Product removed from queue
- [ ] Empty state shows when no pending products

### Edge Cases & Validations
- [ ] Cannot submit form with invalid data
- [ ] Price must be > 0
- [ ] Units per pack must be >= 1
- [ ] Title must be >= 3 characters
- [ ] URL validation works
- [ ] Markup range 0-500 enforced
- [ ] Search returns empty state when no matches
- [ ] Filter + search work together
- [ ] Modal can be closed with X, overlay, button, ESC
- [ ] Loading states show during async operations
- [ ] Buttons disabled during submission
- [ ] No console errors during normal flow

### Data & Calculations
- [ ] All mock products load correctly
- [ ] Prices format as €X,XX (Spanish format)
- [ ] Dates format as dd mmm yyyy
- [ ] Markup calculations accurate to 2 decimals
- [ ] Formula matches calculation
- [ ] Stats counts match visible data
- [ ] Product count badges accurate in filters

---

## Test Report Template

Use this template to document your testing results:

```
# Test Report: Products Pricing Module

**Tester:** [Your Name]
**Date:** [Date]
**Environment:** Local Development
**Mock Mode:** Enabled

## Test Results Summary

| Scenario | Status | Notes |
|----------|--------|-------|
| 1. Supplier - Propose Product | ✅ PASS / ❌ FAIL | |
| 2. Supplier - View Products List | ✅ PASS / ❌ FAIL | |
| 3. Admin - Review Pending Queue | ✅ PASS / ❌ FAIL | |
| 4. Admin - Approve Product | ✅ PASS / ❌ FAIL | |
| 5. Admin - Reject Product | ✅ PASS / ❌ FAIL | |
| 6. Price Calculations | ✅ PASS / ❌ FAIL | |
| 7. Edge Cases & Validations | ✅ PASS / ❌ FAIL | |

## Issues Found

1. [Issue description]
   - **Severity:** High / Medium / Low
   - **Steps to reproduce:**
   - **Expected:**
   - **Actual:**
   - **Screenshot:**

## Recommendations

1. [Recommendation]

## Overall Assessment

✅ Ready for production / ⚠️ Needs fixes / ❌ Major issues
```

---

## Next Steps After Testing

Once testing is complete:

1. ✅ Document any bugs found
2. ✅ Create GitHub issues for bugs
3. ✅ Test on different browsers (Chrome, Firefox, Safari)
4. ✅ Test on mobile/tablet
5. ✅ Switch to real backend (set `NEXT_PUBLIC_MOCK_PRICING=false`)
6. ✅ Test with real API endpoints
7. ✅ Performance testing with many products
8. ✅ Implement Phase 6: Seller Markup Manager
9. ✅ Implement Phase 9: Excel Bulk Upload
10. ✅ Deploy to staging environment

---

**Happy Testing! 🚀**
