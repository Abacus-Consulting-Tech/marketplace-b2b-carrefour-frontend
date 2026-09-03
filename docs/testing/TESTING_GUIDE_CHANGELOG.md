# 🧪 Testing Guide - Backend Changelog Implementation
**Fecha:** 18 Agosto 2026  
**Commit:** `dfbec2b`

## 📋 Índice
1. [Prerequisitos](#prerequisitos)
2. [Auth Endpoints Testing](#1-auth-endpoints-testing)
3. [Pack Price Display Testing](#2-pack-price-display-testing)
4. [Multi-Address Selector Testing](#3-multi-address-selector-testing)
5. [Supplier Registration Testing](#4-supplier-registration-testing)
6. [Integration Testing](#5-integration-testing)
7. [Troubleshooting](#6-troubleshooting)

---

## Prerequisitos

### Backend Requirements
- ✅ Backend DEV running: `https://marketplace-b2b-backend-dev.onrender.com`
- ✅ Database seeded with test data
- ✅ Auth endpoints active: `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`

### Frontend Setup
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# App runs on: http://localhost:3000
```

### Test Accounts
| Email | Password | Role | Addresses |
|-------|----------|------|-----------|
| `admin@carrefour.dev` | `supersecret` | Admin | 0 |
| `seller@mercur.dev` | `supersecret` | Seller | 0 |
| `franchisee@test.com` | `supersecret` | Franchisee | 3 stores |

### Test Data Available
- **Products:** 14 (all with pack metadata)
- **Categories:** 5
- **Sellers:** 5
- **Region:** España (reg_01M0AAYKP7T4XSM0PWRYHQF0BE)

---

## 1. Auth Endpoints Testing

### 1.1 Register (Simplified)

#### Test Case: Successful Registration
**URL:** `http://localhost:3000/register`

**Steps:**
1. Navigate to register page
2. Fill ONLY:
   - Email: `test-user-${timestamp}@test.com`
   - Password: `Test123456!`
3. Click "Registrarse"

**Expected Result:**
- ✅ Success message: "Usuario registrado. Redirigiendo al login..."
- ✅ Auto-redirect to `/login` after 2 seconds
- ✅ No fields for: name, role, company, phone

**API Call:**
```bash
POST https://marketplace-b2b-backend-dev.onrender.com/auth/register
Content-Type: application/json

{
  "email": "test-user-1723987654@test.com",
  "password": "Test123456!"
}
```

---

#### Test Case: Duplicate Email
**Steps:**
1. Try to register with existing email: `admin@carrefour.dev`
2. Password: `anything123`
3. Click "Registrarse"

**Expected Result:**
- ❌ Error message: "Este email ya está registrado"
- ❌ No redirect
- ✅ Form stays on screen

**Backend Response:**
```json
{
  "type": "duplicate_error",
  "message": "Email already exists"
}
```

---

### 1.2 Forgot Password

#### Test Case: Request Password Reset
**URL:** `http://localhost:3000/forgot-password`

**Steps:**
1. Enter email: `franchisee@test.com`
2. Click "Enviar enlace de recuperación"

**Expected Result:**
- ✅ Success message (always shown for security)
- ✅ "Si el email existe en nuestro sistema, recibirás un enlace..."
- ✅ Link to return to login

**API Call:**
```bash
POST https://marketplace-b2b-backend-dev.onrender.com/auth/forgot-password
Content-Type: application/json

{
  "email": "franchisee@test.com"
}
```

**Note:** Check backend logs/email service for reset token.

---

### 1.3 Reset Password (NEW)

#### Test Case: Complete Password Reset
**URL:** `http://localhost:3000/reset-password?token=VALID_TOKEN_HERE`

**Steps:**
1. Get reset token from backend (email/logs)
2. Navigate to URL with token
3. Enter new password: `NewPassword123!`
4. Confirm password: `NewPassword123!`
5. Click "Restablecer Contraseña"

**Expected Result:**
- ✅ Success message with checkmark icon
- ✅ "Tu contraseña ha sido restablecida correctamente"
- ✅ Auto-redirect to `/login` after 3 seconds
- ✅ Can login with new password

**API Call:**
```bash
POST https://marketplace-b2b-backend-dev.onrender.com/auth/reset-password
Content-Type: application/json

{
  "token": "TOKEN_FROM_EMAIL",
  "password": "NewPassword123!"
}
```

---

#### Test Case: Invalid/Expired Token
**URL:** `http://localhost:3000/reset-password?token=invalid123`

**Steps:**
1. Use invalid token
2. Try to reset password

**Expected Result:**
- ❌ Error message: "Token inválido o expirado"
- ✅ Link to request new reset email

---

## 2. Pack Price Display Testing

### 2.1 Marketplace Listing

#### Test Case: View Products with Pack Prices
**URL:** `http://localhost:3000/marketplace`

**Steps:**
1. Login as any user
2. Browse product catalog
3. Observe price display on product cards

**Expected Display:**
```
Arroz Integral 5kg
€24,00 / pack 12 unidades
(€2,00 / unidad)

[Badge: Productos Ecológicos]
Vendedor: EcoFresh Supplies
```

**Verification:**
- ✅ Price shows `/100` conversion (cents → euros)
- ✅ Pack label displayed (e.g., "pack 12 unidades")
- ✅ Per-unit price calculated automatically
- ✅ Formula: `(price / 100) / units_per_pack`

**Check Multiple Products:**
| Product | Price (cents) | Units/Pack | Pack Price | Unit Price |
|---------|---------------|------------|------------|------------|
| Arroz Integral 5kg | 2400 | 12 | €24,00 | €2,00 |
| Aceite Oliva Virgen 1L | 850 | 6 | €8,50 | €1,42 |

---

### 2.2 Product Detail Page

#### Test Case: View Pack Details
**URL:** `http://localhost:3000/marketplace/products/{product_id}`

**Steps:**
1. Click on any product
2. View product detail page
3. Change quantity using +/- buttons

**Expected Display:**
```
Arroz Integral 5kg
€24,00 / pack 12 unidades
(€2,00 por unidad)

Cantidad: [–] 2 [+]

Total: €48,00
```

**Verification:**
- ✅ Pack price and label shown
- ✅ Per-unit price calculated
- ✅ Total = pack_price × quantity
- ✅ NO multiplication by units_per_pack in total

**Test Calculation:**
```javascript
// Correct formula
const pack_price = price / 100;  // 2400 / 100 = 24.00
const unit_price = pack_price / units_per_pack;  // 24.00 / 12 = 2.00
const total = pack_price * quantity;  // 24.00 × 2 = 48.00
```

---

## 3. Multi-Address Selector Testing

### 3.1 Franchisee with Multiple Addresses

#### Test Case: Select Saved Address
**Prerequisites:**
- Login as: `franchisee@test.com` / `supersecret`
- This user has 3 saved addresses with store metadata

**URL:** `http://localhost:3000/checkout` (add items to cart first)

**Steps:**
1. Add products to cart
2. Go to checkout
3. Step 1: Shipping Address

**Expected Display:**
```
Selecciona una dirección de envío     [+ Nueva dirección]

○ 🗺️ Tienda Madrid Centro (ES-MAD-001)
     Juan Pérez
     Calle Gran Via 123
     28013 Madrid
     ES
     +34 600 111 222

○ 🗺️ Tienda Barcelona Diagonal (ES-BCN-002)
     Juan Pérez
     Passeig de Gràcia 456
     08008 Barcelona
     ES
     +34 600 333 444

○ 🗺️ Tienda Valencia Puerto (ES-VLC-003)
     Juan Pérez
     Avenida del Puerto 789
     46021 Valencia
     ES
     +34 600 555 666

Email: _________________________
      (required field)

[Continuar al Método de Envío]
```

**Verification:**
- ✅ RadioGroup with 3 address cards
- ✅ Store name displayed: `metadata.store_name`
- ✅ Store code displayed: `metadata.store_code`
- ✅ MapPin icon shown
- ✅ First address selected by default
- ✅ Email field always shown (required)
- ✅ Click card to select
- ✅ Selected card has blue border and bg

---

#### Test Case: Add New Address
**Steps:**
1. Click "Nueva dirección" button
2. Form should toggle to new address mode

**Expected Display:**
```
Nueva dirección de envío              [Cancelar]

Email: _________________________
Nombre: _________  Apellidos: _________
Dirección: _________________________
Dirección 2: _____________________ (opcional)
Ciudad: _______  Provincia: _______  CP: _____
País: [España ▼]
Teléfono: _________________________

[Continuar al Método de Envío]
```

**Verification:**
- ✅ Full form displayed
- ✅ Cancel button shown
- ✅ Click Cancel returns to address selector
- ✅ All validation working (required fields marked)

---

#### Test Case: Submit with Saved Address
**Steps:**
1. Select Madrid Centro address
2. Enter email: `franchisee@test.com`
3. Click "Continuar al Método de Envío"

**Expected Behavior:**
```javascript
// onComplete receives:
{
  id: "addr_01J5XXXXXXXXX",  // ← Existing address ID
  email: "franchisee@test.com",
  first_name: "Juan",
  last_name: "Pérez",
  address_1: "Calle Gran Via 123",
  city: "Madrid",
  postal_code: "28013",
  country_code: "es",
  phone: "+34 600 111 222"
}
```

**Verification:**
- ✅ Address ID included
- ✅ All fields from saved address
- ✅ Email from form input
- ✅ Advances to shipping method step

---

### 3.2 User with No Saved Addresses

#### Test Case: First-Time User
**Prerequisites:**
- Login as: `seller@mercur.dev` / `supersecret`
- This user has 0 saved addresses

**Steps:**
1. Add products to cart
2. Go to checkout
3. Step 1: Shipping Address

**Expected Display:**
```
(No header - goes straight to form)

Email: _________________________
Nombre: _________  Apellidos: _________
Dirección: _________________________
Dirección 2: _____________________ (opcional)
Ciudad: _______  Provincia: _______  CP: _____
País: [España ▼]
Teléfono: _________________________

[Continuar al Método de Envío]
```

**Verification:**
- ✅ No address selector shown
- ✅ No "Nueva dirección" button
- ✅ Form displayed immediately
- ✅ No loading state (or brief loading, then form)

---

### 3.3 Loading State

#### Test Case: Initial Load
**Steps:**
1. Clear localStorage/cookies
2. Login
3. Go to checkout (fast)

**Expected Display:**
```
⟳ Cargando direcciones...
```

**Verification:**
- ✅ Loader2 spinner shown
- ✅ Text: "Cargando direcciones..."
- ✅ Brief display (< 1 second with good connection)
- ✅ Then shows addresses or form

---

### 3.4 API Integration

#### Test Case: Verify API Call
**Steps:**
1. Open DevTools → Network tab
2. Login as franchisee
3. Go to checkout

**Expected API Call:**
```bash
GET https://marketplace-b2b-backend-dev.onrender.com/store/customers/me
Authorization: Bearer eyJhbGc...
```

**Expected Response:**
```json
{
  "customer": {
    "id": "cus_01J5XXXXXXXXX",
    "email": "franchisee@test.com",
    "shipping_addresses": [
      {
        "id": "addr_01J5XXXXXXXXX",
        "first_name": "Juan",
        "last_name": "Pérez",
        "address_1": "Calle Gran Via 123",
        "city": "Madrid",
        "postal_code": "28013",
        "country_code": "es",
        "phone": "+34 600 111 222",
        "metadata": {
          "store_code": "ES-MAD-001",
          "store_name": "Tienda Madrid Centro"
        }
      }
      // ... more addresses
    ]
  }
}
```

**Verification:**
- ✅ GET request sent on mount
- ✅ Authorization header included
- ✅ Response parsed correctly
- ✅ Addresses displayed with metadata

---

## 4. Supplier Registration Testing

### 4.1 Public Registration Form

#### Test Case: Complete 3-Page Supplier Registration
**URL:** `http://localhost:3000/supplier/register`

**Prerequisites:**
- No authentication required (public access)

**Steps - Page 1: Datos Legales**
1. Navigate to `/supplier/register`
2. Verify step indicator shows "Paso 1 de 3"
3. Fill legal data:
   - Nombre Comercial: `Infoqus Aliado Empresarial`
   - Razón Social: `Infoqus Aliado Empresarial, S.L.`
   - NIF/CIF: `B12345678`
   - Dirección Fiscal: `Calle Mayor 123, 4º B`
   - Municipio: `Madrid`
   - Código Postal: `28001`
   - País: `España` (dropdown)
   - IBAN: `ES1234567890123456789012`
   - Email General: `info@test-supplier.com`
   - Teléfono Principal: `+34 912345678`
   - Sitio Web (opcional): `https://www.test-supplier.com`
4. Click "Continuar"

**Expected Result - Page 1:**
- ✅ Form validates all required fields
- ✅ NIF/CIF validation: `[0-9]{8}[A-Z]` or `[A-Z][0-9]{7}[0-9A-J]`
- ✅ IBAN validation: `ES\d{22}` (no spaces)
- ✅ Postal code: 5 digits
- ✅ Email format validated
- ✅ Phone format validated (international)
- ✅ Cannot proceed without valid data
- ✅ Advances to page 2 on success

**Steps - Page 2: Contacto**
1. Verify step indicator shows "Paso 2 de 3"
2. Fill contact person data:
   - Nombre: `María`
   - Apellidos: `García López`
   - Cargo en la Empresa: `Directora Comercial`
   - Email de Contacto: `maria.garcia@test-supplier.com`
   - Teléfono de Contacto: `+34 600123456`
3. Click "Continuar"

**Expected Result - Page 2:**
- ✅ "Anterior" button returns to page 1 (data preserved)
- ✅ All fields required
- ✅ Email and phone validated
- ✅ Cannot proceed without valid data
- ✅ Advances to page 3 on success

**Steps - Page 3: Revisión**
1. Verify step indicator shows "Paso 3 de 3"
2. Review the legal/company summary
3. Review the contact person summary
4. Click "Anterior" and confirm you can return to page 2 with data preserved
5. Return again to page 3
6. Click "Enviar Solicitud"

**Expected Result - Page 3:**
- ✅ "Anterior" button returns to page 2 (data preserved)
- ✅ Summary of company and contact data displayed
- ✅ Informational message explains that approval happens before portal access
- ✅ Informational message explains that catalog/image upload comes after approval
- ✅ Success message after submission
- ✅ Request remains in pending review status

---

#### Test Case: Form Validation Errors
**URL:** `http://localhost:3000/supplier/register`

**Test Invalid NIF/CIF:**
- Input: `123` (too short)
- Expected: ❌ "Introduce un NIF (12345678Z) o CIF (B12345678) válido, sin espacios"

**Test Invalid IBAN:**
- Input: `ES123` (wrong length)
- Expected: ❌ "Formato IBAN ES: ES + 22 dígitos (sin espacios)"

**Test Invalid Postal Code:**
- Input: `280` (3 digits)
- Expected: ❌ "El código postal debe tener 5 dígitos"

**Test Invalid Email:**
- Input: `notanemail`
- Expected: ❌ "Email inválido"

#### Test Case: Form Persistence
**Steps:**
1. Fill page 1 completely
2. Click "Continuar" to page 2
3. Click "Anterior" back to page 1

**Expected Result:**
- ✅ All data from page 1 still filled
- ✅ No data loss on navigation

**Steps:**
1. Fill pages 1 and 2
2. Close browser tab
3. Reopen `/supplier/register`

**Expected Result:**
- ✅ Data persisted in localStorage
- ✅ Returns to last page (step indicator correct)
- ✅ All fields repopulated

**Note:** The request data is persisted in localStorage during the mock flow.

---

### 4.2 Admin Approval Workflow

#### Test Case: View Pending Suppliers
**URL:** `http://localhost:3000/admin/suppliers`

**Prerequisites:**
- Login as admin: `admin@carrefour.dev` / `supersecret`
- At least 1 supplier registration submitted

**Steps:**
1. Navigate to admin suppliers page
2. View dashboard statistics

**Expected Display:**
```
Gestión de Proveedores
Revisa y aprueba las solicitudes de registro de nuevos proveedores

[Card] Pendientes: 1    [Clock icon]
[Card] Activos: 0       [CheckCircle icon]
[Card] Rechazados: 0    [XCircle icon]
```

**Expected Pending Supplier Card:**
```
🏢 Infoqus Aliado Empresarial    [Badge: Pendiente]
Infoqus Aliado Empresarial, S.L. · NIF/CIF: B12345678
Calle Mayor 123, 4º B, Madrid (28001), España

✉️ info@test-supplier.com        📞 +34 912345678
🌐 https://www.test-supplier.com

👤 Persona de Contacto
María García López · Directora Comercial
maria.garcia@test-supplier.com · +34 600123456

[Aprobar]  [Rechazar]
```

**Verification:**
- ✅ All supplier data displayed correctly
- ✅ Company info and contact person shown
- ✅ Status badge shows "Pendiente" (yellow)
- ✅ Action buttons visible

---

#### Test Case: Approve Supplier
**Steps:**
1. Click "Aprobar" button on pending supplier
2. Verify confirmation dialog appears

**Expected Dialog:**
```
Aprobar Proveedor
¿Confirmas que quieres aprobar a Infoqus Aliado Empresarial?

Al aprobar este proveedor:
• El proveedor quedará aprobado pendiente del envío de credenciales
• Se podrá enviar el email de activación en el siguiente paso
• La carga de catálogo quedará habilitada después del acceso al portal

[Cancelar]  [Confirmar Aprobación]
```

3. Click "Confirmar Aprobación"

**Expected Result:**
- ✅ Dialog shows approval checklist
- ✅ Green confirmation button
- ✅ Dialog closes
- ✅ Supplier status changes to 'active'
- ✅ Supplier leaves the pending queue
- ✅ Supplier appears in the full-width admin directory

**Note:** Full backend integration pending:
- Public register endpoint
- Approval workflow endpoint
- Email notification / credential activation

---

#### Test Case: Reject Supplier
**Steps:**
1. Click "Rechazar" button on pending supplier
2. Verify rejection dialog appears

**Expected Dialog:**
```
Rechazar Proveedor
Indica el motivo por el cual rechazas a Infoqus Aliado Empresarial

Motivo del Rechazo *
[Text area: "Ej: Documentación incompleta, productos no apropiados..."]

[Cancelar]  [Confirmar Rechazo]
```

3. Try to submit without reason

**Expected Result:**
- ❌ Alert: "Por favor, introduce un motivo de rechazo."

4. Enter rejection reason: "Documentación fiscal incompleta"
5. Click "Confirmar Rechazo"

**Expected Result:**
- ✅ Rejection reason required
- ✅ Dialog closes
- ✅ Supplier status changes to 'rejected'
- ✅ Supplier leaves the pending queue
- ✅ Supplier remains visible in the full-width admin directory filtered as rejected

---

### 4.3 Admin Directory Testing

#### Test Case: Search and Filter in Supplier Directory
**Steps:**
1. Approve at least 2 suppliers and reject at least 1
2. Go to `/admin/suppliers`
3. Scroll to "Directorio de Proveedores"
4. Search by company name, CIF, and contact email
5. Filter by `Activos`
6. Filter by `Rechazados`

**Expected Result:**
- ✅ The table occupies full width below the pending queue
- ✅ Search filters by company, legal name, CIF, supplier email, and contact person
- ✅ Status filter limits rows correctly
- ✅ Pending suppliers do not appear in this directory

#### Test Case: Row Actions
**Steps:**
1. In the supplier directory, click `Ver`
2. Confirm the detail page opens with company and contact data
3. Click `Editar`
4. Modify one field and save
5. Return to the directory and confirm the updated value appears
6. Click `Eliminar` on a test supplier and confirm the dialog

**Expected Result:**
- ✅ `Ver` opens the admin detail page for that provider
- ✅ `Editar` opens the admin edit page and persists the change in the mock store
- ✅ `Eliminar` removes the provider after confirmation

---

### 4.4 Integration Testing

#### Complete Supplier Onboarding Flow

**Scenario:** New supplier registers and gets approved

**Steps:**

1. **Supplier Registration**
   - Go to `/supplier/register` (no auth)
   - Complete page 1: Legal data
   - Complete page 2: Contact person
   - Complete page 3: Review and submit
   - Submit registration
   - ✅ Status: `pending`

2. **Admin Review**
   - Login as admin
   - Go to `/admin/suppliers`
   - ✅ See supplier in "Pendientes" (1)
   - Review all company and contact data

3. **Approval Process**
   - Click "Aprobar"
   - Review checklist in dialog
   - Confirm approval
   - ✅ Status changes to `active`
   - ✅ Supplier appears in admin directory as active
   - ✅ (Future backend): Email sent to supplier

4. **Post-Approval** (Future)
   - Supplier logs in to portal
   - Uploads catalog and images after approval
   - Manages products and orders

**Verification Points:**
- ✅ No authentication required for registration
- ✅ Form validation works at each step
- ✅ Data persists across pages
- ✅ Admin sees complete supplier information
- ✅ Approval workflow triggers correctly
- ✅ Status updates reflected in UI

---

### 4.5 Edge Cases & Error Handling

#### Test Case: Concurrent Registrations
**Steps:**
1. Open 2 browser tabs
2. Start registration in both (same data)
3. Submit from tab 1
4. Submit from tab 2

**Expected Result:**
- ✅ Both submissions accepted (no duplicate check yet)
- ✅ Admin sees 2 pending suppliers
- ✅ Can approve/reject independently

**Note:** Duplicate detection by NIF/CIF pending backend implementation

---

#### Test Case: Network Failure During Upload
**Steps:**
1. Fill all form data
2. Start CSV upload
3. Disconnect network mid-upload

**Expected Result:**
- ❌ Upload fails gracefully
- ✅ Error message shown
- ✅ Can retry upload
- ✅ Form data preserved

---

#### Test Case: Browser Refresh During Registration
**Steps:**
1. Fill page 1 completely
2. Refresh browser (F5)

**Expected Result:**
- ✅ Returns to page 1
- ✅ Data preserved from localStorage
- ✅ Step indicator resets to 1

**Steps:**
1. Complete page 1, move to page 2
2. Refresh browser

**Expected Result:**
- ✅ Returns to page 2 (currentStep preserved)
- ✅ All data from pages 1 & 2 intact

---

## 5. Integration Testing

### Complete Checkout Flow with Multi-Address

#### Test Scenario: Franchisee Orders for Specific Store

**Story:**
> A franchisee wants to order products for their Barcelona store.

**Steps:**
1. **Login**
   - Email: `franchisee@test.com`
   - Password: `supersecret`
   - ✅ Redirected to dashboard

2. **Browse Products**
   - Go to Marketplace
   - ✅ See pack prices: "€24,00 / pack 12 unidades (€2,00 / unidad)"
   - Click "Arroz Integral 5kg"
   - ✅ Detail shows pack info and correct total

3. **Add to Cart**
   - Quantity: 3 packs
   - ✅ Total: €72,00 (3 × €24,00)
   - Click "Añadir al Carrito"
   - ✅ Cart badge shows "1"

4. **Checkout - Address**
   - Click cart icon → "Proceder al Pago"
   - ✅ See 3 saved addresses
   - ✅ Madrid, Barcelona, Valencia with store codes
   - Select "Tienda Barcelona Diagonal (ES-BCN-002)"
   - ✅ Blue border on selected card
   - Enter email: `franchisee@test.com`
   - Click "Continuar al Método de Envío"

5. **Checkout - Shipping**
   - ✅ Standard shipping shown
   - Click "Continuar al Pago"

6. **Checkout - Payment**
   - ✅ Stripe form shown (if key configured)
   - OR placeholder form
   - Enter test card details
   - Click "Realizar Pago"

7. **Confirmation**
   - ✅ Order created
   - ✅ Delivery address = Barcelona store
   - ✅ Pack quantity and pricing correct

**Verification Points:**
- ✅ Store metadata preserved through checkout
- ✅ Pack pricing displayed correctly
- ✅ No price calculation errors
- ✅ Address selection saves to order

---

## 6. Troubleshooting

### Issue: "Cargando direcciones..." Never Ends

**Possible Causes:**
- Backend not running
- Auth token expired/invalid
- CORS error

**Debug Steps:**
```bash
# Check Network tab for error
# Look for:
GET /store/customers/me → 401 Unauthorized
GET /store/customers/me → Failed to fetch

# Solution: Re-login
# Or check backend status
```

**Fix:**
```javascript
// ShippingAddressForm.tsx already handles errors:
catch (error) {
  console.error("Error loading addresses:", error);
  setShowNewAddressForm(true);  // ← Fallback to form
}
```

---

### Issue: Pack Prices Show Wrong Values

**Symptoms:**
- Price: €2400,00 instead of €24,00
- Unit price: NaN or undefined

**Check:**
```javascript
// Product data must have:
product.price (in cents, e.g., 2400)
product.metadata.units_per_pack (e.g., 12)
product.metadata.pack_label (e.g., "pack 12 unidades")

// Calculation:
const packPrice = product.price / 100;  // Must divide by 100!
const unitPrice = packPrice / units_per_pack;
```

**Verify in Database:**
```sql
SELECT id, title, price, metadata 
FROM product 
WHERE id = 'prod_XXXXX';
```

---

### Issue: Multi-Address Not Showing

**Symptoms:**
- Always shows new address form
- No address selector

**Debug:**
```javascript
// Open Console:
console.log(customer.shipping_addresses);

// Expected:
[
  { id: "addr_01J5...", metadata: { store_code: "ES-MAD-001", ... } },
  { id: "addr_01J6...", metadata: { store_code: "ES-BCN-002", ... } },
]

// If empty array or undefined:
// → User has no saved addresses (correct behavior)
// → Add addresses via backend/admin panel
```

---

### Issue: Reset Password Token Invalid

**Symptoms:**
- "Token inválido o expirado"

**Possible Causes:**
1. Token expired (check backend TTL)
2. Token already used (one-time use)
3. Token malformed (copy/paste error)

**Solutions:**
- Request new forgot-password email
- Check token in URL is complete (no truncation)
- Verify backend logs for token generation

---

## 7. Test Checklist

### Auth Endpoints
- [ ] Register with new email (success)
- [ ] Register with existing email (duplicate_error)
- [ ] Register form has only email + password fields
- [ ] Forgot password sends success message
- [ ] Reset password with valid token (success)
- [ ] Reset password with invalid token (error)
- [ ] Reset password auto-redirects to login

### Pack Pricing
- [ ] Marketplace listing shows pack prices
- [ ] Per-unit price calculated correctly
- [ ] Product detail shows pack info
- [ ] Total price calculation uses pack price × quantity
- [ ] Multiple products display correctly

### Multi-Address
- [ ] Franchisee sees saved addresses (3)
- [ ] Store code and name displayed
- [ ] Address cards selectable
- [ ] Selected address has blue border
- [ ] "Nueva dirección" button toggles form
- [ ] Cancel button returns to selector
- [ ] Email field always shown
- [ ] Submit with saved address includes ID
- [ ] Submit with new address includes form data
- [ ] Users with no addresses see form immediately
- [ ] Loading state shown during API call

### Supplier Registration
- [ ] Page 1 form shows all legal fields (11)
- [ ] NIF/CIF validation works (regex)
- [ ] IBAN validation works (ES + 22 digits)
- [ ] Postal code validation (5 digits)
- [ ] Cannot proceed with invalid data
- [ ] Page 2 shows contact fields (5)
- [ ] "Anterior" button preserves data
- [ ] Page 3 shows file upload areas
- [ ] CSV upload validates type and size (max 5MB)
- [ ] ZIP upload validates type and size (max 50MB)
- [ ] Both files required to enable submit
- [ ] Form data persists in localStorage
- [ ] Files NOT persisted (expected)
- [ ] Step indicator shows correct page
- [ ] Admin can view pending suppliers
- [ ] Admin sees all supplier details
- [ ] CSV and ZIP download links work
- [ ] Approve dialog shows checklist
- [ ] Reject dialog requires reason
- [ ] Status updates correctly after action

### Integration
- [ ] Complete checkout flow works
- [ ] Pack prices persist through cart
- [ ] Multi-address selection saves to order
- [ ] All forms validate correctly
- [ ] Error states handled gracefully

---

## 8. Known Limitations

⚠️ **Stripe Key:**
- Placeholder key in `.env.local`
- Payment form shown but won't process
- **Action:** Get publishable key from backend tomorrow

⚠️ **Admin Endpoints:**
- Still return 401 (backend issue)
- Role detection uses email workaround

⚠️ **Email Delivery:**
- Reset password emails may not send in DEV
- Check backend logs for token

⚠️ **Supplier Registration:**
- Backend API endpoints not yet implemented
- Approval/rejection shows placeholder alerts
- CSV processing and product creation pending
- Image upload to Medusa Storage pending
- Email notifications not functional

---

## 9. Success Criteria

✅ **All Tests Pass:**
- Auth endpoints working (3/3)
- Pack pricing accurate (2/2)
- Multi-address functional (5/5)
- Supplier registration UI complete (20/20)
- Integration smooth (1/1)

✅ **No Console Errors:**
- No TypeScript errors
- No runtime errors
- No network failures (when backend up)

✅ **UX Smooth:**
- Loading states shown
- Errors handled gracefully
- Forms validate correctly
- Navigation flows naturally

---

**Testing Date:** _____________  
**Tested By:** _____________  
**Result:** ☐ PASS  ☐ FAIL (details: ____________)
