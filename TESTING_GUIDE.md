# 🧪 Complete Testing Guide - Marketplace B2B Carrefour

**Testing Date**: 2026-08-06  
**Week 2 Status**: 95% Complete  
**Features to Test**: Authentication, Onboarding Flow, Product Catalog, Supplier Management

---

## 📋 Prerequisites

### 1. Start the Development Server

```bash
# Navigate to project directory
cd marketplace-b2b-carrefour-frontend

# Start the dev server
npm run dev
```

✅ **Expected Output**:
```
▲ Next.js 14.2.5
- Local:        http://localhost:3000
- ready started server on [::]:3000, url: http://localhost:3000
```

### 2. Open the Application

Navigate to: **http://localhost:3000**

### 3. Mock API Configuration

The application uses a **mock API system** for development and testing without requiring a backend server.

**What's Included**:
- 3 test users (admin, franchisee, supplier) with different roles
- 6 mock suppliers with various statuses
- 10 sample products with images
- Simulated API delays for realistic behavior
- Full authentication flow (login, register, forgot password)

**Mock Mode Status**:
- Currently **ENABLED** via `.env.local`
- Setting: `NEXT_PUBLIC_MOCK_AUTH=true`
- Login page displays test credentials banner
- All authentication operations use mock API (no external server needed)
- All data resets on page refresh

**To Disable Mock Mode** (when backend is ready):
1. Edit `.env.local`
2. Change to: `NEXT_PUBLIC_MOCK_AUTH=false`
3. Restart dev server: `npm run dev`
4. Update API endpoint in `src/lib/api/client.ts`

---

## 🔐 Test Scenario 1: Authentication System

### **Test 1.1: Login Flow**

**Steps**:
1. Go to http://localhost:3000/login
2. Use test credentials:
   - **Email**: `franchisee@test.com`
   - **Password**: `franchisee123`
3. Click "Iniciar Sesión"

✅ **Expected Result**:
- Redirects to `/marketplace` (marketplace home)
- Header displays with:
  - Navigation links: "Catálogo" and "Mis pedidos" on the left
  - Top-right icons: Shopping cart (basket), user profile icon, and logout button

**Alternative Credentials to Test**:
- Admin: `admin@carrefour.com` / `admin123` → Redirects to `/admin/dashboard`
- Supplier: `supplier@test.com` / `supplier123` → Redirects to `/supplier/dashboard`

---

### **Test 1.2: Registration Flow**

**Steps**:
1. Go to http://localhost:3000/register
2. Fill out the form:
   - **Tipo de cuenta**: Franquiciado
   - **Nombre completo**: Test User
   - **Email**: test@example.com
   - **Empresa**: Test Company SL
   - **Teléfono**: +34 600123456
   - **Contraseña**: test12345678 (minimum 8 characters)
   - **Confirmar contraseña**: test12345678
3. Click "Crear cuenta"

✅ **Expected Result**:
- Redirects to `/login?registered=true`
- Shows login page (registration successful)

**Note**: In mock mode, the account is registered in memory. You can then log in with the credentials you just created.

---

### **Test 1.3: Forgot Password**

**Steps**:
1. Go to http://localhost:3000/forgot-password
2. Enter email: `franchisee@test.com`
3. Click "Enviar enlace"

✅ **Expected Result**:
- Success message appears
- Shows "Revisa tu correo electrónico"

---

### **Test 1.4: Protected Routes**

**Steps**:
1. Log out (click user menu → Cerrar Sesión)
2. Try to access http://localhost:3000/marketplace directly

✅ **Expected Result**:
- Redirects to `/login`
- Shows "Debes iniciar sesión"

---

## 🏢 Test Scenario 2: Franchisee Onboarding Flow (6 Steps)

**Login Required**: Use `franchisee@test.com` / `franchisee123`

**⚠️ IMPORTANT - First Time Setup**:
1. **Restart dev server** if it was running before (the hydration fix requires a restart)
2. **Clear browser data**:
   - Open browser console (F12)
   - Run: `localStorage.clear()`
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
3. **Login fresh** as franchisee

### **Test 2.1: Step 1 - Welcome Page**

**Steps**:
1. **Login as franchisee** (see Test 1.1) - should redirect to `/marketplace`
2. **Manually navigate** to http://localhost:3000/welcome in the address bar
3. You should see a brief loading spinner, then the welcome page loads
4. Review the 4 feature cards:
   - Información de tu empresa
   - Ubicaciones de tus tiendas
   - Equipo de trabajo
   - Método de pago
5. Review "Qué necesitarás" section
6. Click "Comenzar"

✅ **Expected Result**:
- Loading spinner appears briefly (< 1 second)
- Welcome page displays with step indicator "1 of 6" active
- Clicking "Comenzar" redirects to `/company` (Step 2)

❌ **If still redirecting to login**:
- Dev server needs restart: Stop (Ctrl+C) and run `npm run dev` again
- Clear localStorage: `localStorage.clear()` in browser console
- Close all browser tabs and start fresh
- Check browser console for errors

---

### **Test 2.2: Step 2 - Company Information**

**Steps**:
1. Fill out all fields:
   - **Razón Social**: Mi Franquicia Test SL
   - **CIF**: B12345678
   - **Dirección fiscal**: Calle Mayor 123
   - **Ciudad**: Madrid
   - **Código Postal**: 28001
   - **Provincia**: Madrid
   - **Teléfono**: +34 912345678
   - **Email**: contacto@mifranquicia.com
   - **Sitio web** (optional): www.mifranquicia.com
   - **Año de fundación**: 2020
2. Click "Continuar"

✅ **Expected Result**:
- Step indicator shows "2 of 6" active
- Form validates all required fields
- Redirects to `/stores` (Step 3)

---

### **Test 2.3: Step 3 - Store Locations**

**Steps**:
1. Click "Añadir Tienda" button
2. In the dialog, fill out:
   - **Nombre de la tienda**: Tienda Centro
   - **Dirección**: Gran Vía 1
   - **Ciudad**: Madrid
   - **Código Postal**: 28013
   - **Provincia**: Madrid
   - **Teléfono**: +34 911111111
3. Click "Añadir Tienda"
4. Repeat to add a second store:
   - **Nombre**: Tienda Norte
   - **Dirección**: Paseo de la Castellana 200
   - **Ciudad**: Madrid
   - **CP**: 28046
   - **Provincia**: Madrid
   - **Teléfono**: +34 922222222
5. Click "Continuar"

✅ **Expected Result**:
- Both stores appear in the list
- Can delete stores with trash icon
- Shows "2 tiendas añadidas"
- Redirects to `/users` (Step 4)

---

### **Test 2.4: Step 4 - Team Members**

**Steps**:
1. Click "Invitar Usuario"
2. Fill out:
   - **Nombre completo**: María García
   - **Email**: maria@mifranquicia.com
   - **Rol**: Comprador
   - **Tienda asignada**: Tienda Centro
3. Click "Invitar Usuario"
4. Add another member:
   - **Nombre**: Carlos Ruiz
   - **Email**: carlos@mifranquicia.com
   - **Rol**: Encargado de Tienda
   - **Tienda**: Tienda Norte
5. Click "Continuar"

✅ **Expected Result**:
- Team members appear with colored role badges
- Can remove members with trash icon
- Shows "2 usuarios invitados"
- Redirects to `/payment` (Step 5)

---

### **Test 2.5: Step 5 - Subscription & Payment**

**Steps**:
1. Review the 3 subscription plans:
   - **Básico**: €299/mes
   - **Premium**: €599/mes (Recommended)
   - **Enterprise**: €1,299/mes
2. Select "Premium" plan
3. Fill out payment form:
   - **Número de tarjeta**: 4242 4242 4242 4242
   - **Fecha expiración**: 12/28
   - **CVV**: 123
   - **Nombre del titular**: Juan Perez
4. Check "Acepto los términos y condiciones"
5. Click "Completar y Pagar"

✅ **Expected Result**:
- Total shows: €599 + €125.79 IVA = €724.79
- Success toast: "¡Pago procesado con éxito!"
- Redirects to `/complete` (Step 6)

---

### **Test 2.6: Step 6 - Completion**

**Steps**:
1. Review the success message
2. Check stats:
   - Mi Franquicia Test SL
   - 2 tiendas registradas
   - 2 usuarios invitados
   - Plan Premium
3. Review "Próximos Pasos" cards
4. Click "Ir al Marketplace"

✅ **Expected Result**:
- Step indicator shows "6 of 6" complete
- All data is displayed correctly
- Redirects to `/marketplace`

---

## 🛍️ Test Scenario 3: Product Catalog & Shopping

**Login Required**: Use `franchisee@test.com` / `franchisee123`

### **Test 3.1: Browse Products**

**Steps**:
1. Go to http://localhost:3000/marketplace
2. Scroll through product grid
3. Observe:
   - Product images
   - Product names
   - Prices
   - Stock status badges (green "En Stock" or yellow "Stock Bajo")
   - Supplier names (gray badges)

✅ **Expected Result**:
- Shows 10 products in grid layout (4 columns on large screens)
- Stock badges visible on each product card:
  - Green "En Stock" for products with stock > 20
  - Yellow "Stock Bajo" for products with stock ≤ 20
- Each product has image, name, price, supplier badge, and stock badge
- Products include: Aceite de Oliva, Jamón Ibérico, Vino Tinto, Queso Manchego, Café, Pasta, Cerveza, Miel, Chocolate, Zumo

---

### **Test 3.2: Search Products**

**Steps**:
1. In the search bar, type: "aceite"
2. Press Enter

✅ **Expected Result**:
- Filters to show only "Aceite de Oliva Virgen Extra"
- Other products are hidden

**Clear Search**:
1. Clear the search bar
2. All products reappear

---

### **Test 3.3: Filter by Category**

**Steps**:
1. Click "Categoría" dropdown (located next to search bar)
2. Select "Bebidas"

✅ **Expected Result**:
- Shows only beverage products (Vino Tinto, Café, Cerveza, Zumo)
- Filter updates product count (4 bebidas visible)
- Other categories are hidden

**Test Other Filters**:
1. Select "Alimentación": Shows 6 products (Aceite, Jamón, Queso, Pasta, Miel, Chocolate)
2. Select "Todas las categorías": Shows all 10 products again

---

### **Test 3.4: View Product Detail**

**Steps**:
1. Click "Ver Detalle" button on "Aceite de Oliva Virgen Extra" product card
2. Review detail page:
   - Large product image
   - Price: €12.99
   - Description: "Aceite de oliva virgen extra de primera calidad, cosecha 2024"
   - Supplier: Aceites del Sur
   - Stock: 150 unidades
   - Specifications: Volume: 1L, Origin: España
3. Change quantity to 5
4. Click "Añadir al Carrito"

✅ **Expected Result**:
- Success toast: "Producto añadido al carrito"
- Cart icon in header shows badge with "1" (indicating 1 product type, not quantity)

---

### **Test 3.5: Shopping Cart**

**Steps**:
1. Click cart icon in header (basket icon with badge)
2. Redirects to http://localhost:3000/marketplace/cart
3. Review cart items:
   - Product name and image thumbnail
   - Quantity controls (+/-/input)
   - Unit price
   - Subtotal per product
4. Update quantity to 10 using + button or direct input
5. Observe order summary:
   - Subtotal (sum of all items)
   - IVA 21%
   - Total
6. Click "Proceder al Pago"

✅ **Expected Result**:
- Cart page displays with product details and image
- Quantity changes update subtotal and total in real-time
- Subtotal: €12.99 × 10 = €129.90
- IVA (21%): €27.28
- Total: €157.18
- "Proceder al Pago" shows toast: "Función no disponible - El proceso de pago se implementará en la próxima fase"
- Can remove items with trash icon
- Can empty entire cart with "Vaciar carrito" button
- "Volver al catálogo" link returns to marketplace

---

## 👔 Test Scenario 4: Admin - Supplier Management

**Login Required**: Use `admin@carrefour.com` / `admin123`

### **Test 4.1: Admin Dashboard**

**Steps**:
1. Login as admin
2. Should auto-redirect to http://localhost:3000/admin/dashboard
3. Review dashboard:
   - 4 stat cards (Proveedores: 6, Productos: 62, Pedidos: 245, Franquiciados: 28)
   - 6 admin section cards
   - Quick actions section

✅ **Expected Result**:
- Shows "Panel de Administración"
- Stats cards display correctly
- "1 proveedor pendiente de aprobación" in quick actions

---

### **Test 4.2: Suppliers List - All Suppliers**

**Steps**:
1. Click "Gestión de Proveedores" card
2. Or go to http://localhost:3000/admin/suppliers
3. Review the page:
   - 5 stats cards at top (Total, Pendientes, Aprobados, Rechazados, Suspendidos)
   - Search bar
   - Status tabs (Todos, Pendientes, Aprobados, Rechazados, Suspendidos)
   - Suppliers table with fixed-width columns

✅ **Expected Result**:
- Shows all 6 suppliers
- Stats: Total 6, Pendientes 1, Aprobados 3, Rechazados 1, Suspendidos 1
- Table columns: Empresa, CIF, Contacto, Categorías, Estado, Productos, Pedidos, Acciones
- Page width remains stable when switching between status tabs

---

### **Test 4.3: Filter Suppliers by Status**

**Steps**:
1. Click "Pendientes" tab

✅ **Expected Result**:
- Shows only 1 supplier: "Fresh Produce Andalucía"
- Status badge is yellow with "Pendiente"

**Test Other Tabs**:
- **Aprobados**: Shows 3 suppliers (Aceites del Sur, Ibéricos Premium, Bodegas del Valle)
- **Rechazados**: Shows 1 supplier (Lácteos La Granja)
- **Suspendidos**: Shows 1 supplier (Distribuciones MarySol)

---

### **Test 4.4: Search Suppliers**

**Steps**:
1. In search bar, type: "aceite"

✅ **Expected Result**:
- Filters to show only "Aceites del Sur"
- Search works on name, CIF, and email

---

### **Test 4.5: View Supplier Detail - Pending Supplier**

**Steps**:
1. Go back to "Pendientes" tab
2. Click "Ver" button on "Fresh Produce Andalucía"
3. Review detail page:
   - Company name and legal name at top
   - Yellow "Pendiente" status badge below company name
   - 4 stats cards: Productos (0), Pedidos (0), Valoración (N/A), Registro (20/1/2024)
   - Contact information and company details cards
4. Action buttons visible: "Aprobar" (green) and "Rechazar" (red)

✅ **Expected Result**:
- All supplier data displays correctly
- Status badge visible below company name
- Two action buttons available for pending supplier (Aprobar and Rechazar)

---

### **Test 4.6: Approve Supplier**

**Steps**:
1. On "Fresh Produce Andalucía" detail page
2. Click "Aprobar" button (green button with checkmark)
3. Click "Sí, aprobar" in confirmation dialog

✅ **Expected Result**:
- Success toast: "Proveedor aprobado" with message "Fresh Produce Andalucía ha sido aprobado correctamente"
- Status badge changes from yellow "Pendiente" to green "Aprobado"
- Action buttons change from "Aprobar"/"Rechazar" to "Suspender"
- Stats remain: 0 products, 0 pedidos, Valoración N/A

---

### **Test 4.7: View Approved Supplier & Suspend**

**Steps**:
1. Go to http://localhost:3000/admin/suppliers
2. Click "Aprobados" tab
3. Click "Ver" on "Aceites del Sur"
4. Review detail page:
   - Company: "Aceites del Sur S.L." with green "Aprobado" badge
   - Stats: 12 productos, 245 pedidos, 4.8★, Registro 15/6/2023
   - Location: Almería, Almería
5. Click "Suspender" button
6. Click "Sí, suspender" in confirmation

✅ **Expected Result**:
- Success toast: "Proveedor suspendido" with message "Aceites del Sur S.L. ha sido suspendido"
- Status badge changes from green "Aprobado" to gray "Suspendido"
- Action button changes from "Suspender" to "Activar" (green)

---

### **Test 4.8: Reactivate Suspended Supplier**

**Steps**:
1. Still on "Aceites del Sur" detail page (should show gray "Suspendido" badge)
2. Click "Activar" button (green with checkmark)
3. Click "Sí, activar" in confirmation dialog

✅ **Expected Result**:
- Success toast: "Proveedor activado" with message "Aceites del Sur S.L. ha sido activado"
- Status badge changes back from gray "Suspendido" to green "Aprobado"
- Action button changes from "Activar" to "Suspender"
- Returns to normal approved state

---

### **Test 4.9: Reject Supplier with Reason**

**⚠️ Note**: After Test 4.6, there are no pending suppliers. You need to either:
- **Option A**: Refresh the page to reset mock data (all changes are lost)
- **Option B**: View the existing rejected supplier "Lácteos La Granja" to see rejection workflow results

**Steps (Option A - Testing Rejection)**:
1. **Refresh the page** (Cmd+R or Ctrl+R) to reset all suppliers to original state
2. Login again as admin: `admin@carrefour.com` / `admin123`
3. Go to http://localhost:3000/admin/suppliers
4. Click "Pendientes" tab
5. Click "Ver" on "Fresh Produce Andalucía"
6. Click "Rechazar" button (red with X icon)
7. In the dialog, enter rejection reason:
   - **Motivo**: "Documentación incompleta - falta certificado sanitario"
8. Click "Confirmar Rechazo" button

✅ **Expected Result**:
- Success toast: "Proveedor rechazado" with supplier name
- Status badge changes from yellow "Pendiente" to red "Rechazado"
- Red card appears showing "Motivo del Rechazo" with the reason entered
- Only "Aprobar" button available (to reverse the rejection)

**Steps (Option B - View Existing Rejection)**:
1. Go to http://localhost:3000/admin/suppliers
2. Click "Rechazados" tab
3. Click "Ver" on "Lácteos La Granja"
4. Observe:
   - Red "Rechazado" status badge
   - Red card with rejection reason: "Documentación incompleta. Falta certificado sanitario."
   - "Aprobar" button available to reverse rejection

---

## 🔄 Test Scenario 5: Role-Based Access Control

### **Test 5.1: Franchisee Cannot Access Admin**

**Steps**:
1. Login as: `franchisee@test.com` / `franchisee123`
2. Try to access: http://localhost:3000/admin/dashboard

✅ **Expected Result**:
- Shows error toast: "No tienes permisos..."
- Redirects to `/marketplace`

---

### **Test 5.2: Admin Cannot Access Supplier Area**

**Steps**:
1. Login as: `admin@carrefour.com` / `admin123`
2. Try to access: http://localhost:3000/supplier/dashboard

✅ **Expected Result**:
- Shows error toast: "No tienes permisos..."
- Redirects to `/admin/dashboard`

---

### **Test 5.3: Logout & Redirect**

**Steps**:
1. From any logged-in state
2. Click user menu in header
3. Click "Cerrar Sesión"

✅ **Expected Result**:
- Clears authentication state
- Redirects to `/login`
- Cannot access protected routes

---

## 📊 Test Scenario 6: Data Persistence

### **Test 6.1: Onboarding State Persists**

**Steps**:
1. Login as franchisee: `franchisee@test.com` / `franchisee123`
2. Navigate to http://localhost:3000/welcome
3. Complete Step 1 (Welcome) and Step 2 (company info)
4. **Close browser tab** or **refresh page**
5. Navigate back to http://localhost:3000/company

✅ **Expected Result**:
- Brief loading spinner appears (auth hydration from localStorage)
- Form fields are pre-filled with saved data
- Step indicator shows "Step 2 of 6"
- Progress is maintained

---

### **Test 6.2: Cart Persists**

**Steps**:
1. Add 3 products to cart
2. **Refresh the page**

✅ **Expected Result**:
- Cart still shows 3 items
- Quantities and selections maintained
- Uses localStorage for persistence

---

### **Test 6.3: Authentication Persists**

**Steps**:
1. Login as any user
2. **Close browser and reopen**
3. Navigate to http://localhost:3000

✅ **Expected Result**:
- Still logged in
- Redirects to appropriate dashboard
- JWT token persisted in localStorage

---

## 🐛 Common Issues & Troubleshooting

### Issue 1: "Module not found" errors
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: TypeScript errors
**Solution**:
```bash
npm run type-check
```

### Issue 3: Port 3000 already in use
**Solution**:
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Issue 4: Environment variables not loading
**Solution**:
- Check `.env.local` exists
- Verify `NEXT_PUBLIC_MOCK_AUTH=true`
- Restart dev server

### Issue 5: Login not working
**Solution**:
- Clear localStorage: `localStorage.clear()` in browser console
- Verify mock API is enabled
- Check browser console for errors

### Issue 6: Onboarding pages redirect to login even after logging in
**Solution**:
- This was a hydration issue with Zustand persist - **now fixed!** ✅
- The app now waits for localStorage to hydrate before checking authentication
- You'll see a brief loading spinner while the auth state loads
- After login, `/welcome` and other onboarding pages should work correctly
- If still having issues:
  - Clear browser cache and localStorage: `localStorage.clear()` in console
  - Logout and login again
  - Hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

---

## ✅ Test Completion Checklist

### Authentication ✓
- [ ] Login with franchisee credentials
- [ ] Login with admin credentials
- [ ] Registration flow
- [ ] Forgot password
- [ ] Protected route redirects
- [ ] Logout flow

### Franchisee Onboarding ✓
- [ ] Step 1: Welcome page
- [ ] Step 2: Company information
- [ ] Step 3: Add store locations (minimum 2)
- [ ] Step 4: Invite team members (minimum 2)
- [ ] Step 5: Select subscription plan
- [ ] Step 6: Completion and redirect

### Product Catalog ✓
- [ ] Browse products
- [ ] Search products
- [ ] Filter by category
- [ ] View product detail
- [ ] Add to cart
- [ ] Update cart quantities
- [ ] View cart

### Supplier Management (Admin) ✓
- [ ] View admin dashboard
- [ ] List all suppliers
- [ ] Filter by status tabs
- [ ] Search suppliers
- [ ] View pending supplier detail
- [ ] Approve supplier
- [ ] Suspend supplier
- [ ] Activate supplier
- [ ] Reject supplier with reason

### Access Control ✓
- [ ] Franchisee blocked from admin
- [ ] Admin blocked from supplier area
- [ ] Proper role-based redirects

### Data Persistence ✓
- [ ] Onboarding state persists
- [ ] Cart persists
- [ ] Authentication persists

---

## 📝 Testing Notes

**Test Environment**: Development (localhost:3000)  
**Mock API**: Enabled via `NEXT_PUBLIC_MOCK_AUTH=true`  
**Data**: All data is mocked and resets on refresh  

**Test Credentials**:
```
Admin:
  Email: admin@carrefour.com
  Password: admin123
  Redirects to: /admin/dashboard

Franchisee:
  Email: franchisee@test.com
  Password: franchisee123
  Redirects to: /marketplace

Supplier:
  Email: supplier@test.com
  Password: supplier123
  Redirects to: /supplier/dashboard
```

---

## 🎯 What's Working

✅ **100% Complete**:
- Multi-role authentication system
- 6-step franchisee onboarding wizard
- Product catalog with search and filters
- Shopping cart with persistence
- Admin supplier management with approval workflow
- Role-based access control
- Data persistence (localStorage + Zustand)

🚀 **Ready for Week 3**: Purchase & Payment Flow!

---

**Last Updated**: 2026-08-06  
**Version**: Week 2 - v0.2.0
