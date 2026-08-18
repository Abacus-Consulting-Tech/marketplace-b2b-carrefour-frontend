# Week 4 Testing Guide

## 📋 Overview

Week 4 implements three major features:
1. **Role-Specific Dashboards** - Overview and KPIs for each user type
2. **User Profile Management** - View and edit user information
3. **Settings & Preferences** - Security, notifications, and account management

**Test Accounts:**
- **Franchisee:** `franchisee@test.com` / `franchisee123`
- **Supplier:** `supplier@test.com` / `supplier123`
- **Admin:** `admin@test.com` / `admin123`

---

## 🎯 Feature 1: Dashboards

### Test 1.1: Franchisee Dashboard

**Path:** `/marketplace/dashboard`

**Steps:**
1. Login as franchisee
2. ✅ Verify automatic redirect to dashboard
3. **KPI Cards (4 cards):**
   - ✅ Total Pedidos - Shows order count
   - ✅ Pedidos Pendientes - Shows pending count  
   - ✅ Total Gastado - Shows sum with €
   - ✅ Ticket Medio - Shows average order value
   - ✅ Icons display with correct colors
   - ✅ Cards in 1/2/4 columns on mobile/tablet/desktop
4. **Recent Orders Widget:**
   - ✅ Shows last 5 orders
   - ✅ Order number clickable → detail page
   - ✅ Status badges colored correctly
   - ✅ Date, item count, total displayed
   - ✅ "Ver Todos" → `/marketplace/orders`
   - ✅ Empty state if no orders (after clearing localStorage)
5. **Quick Actions:**
   - ✅ Nuevo Pedido → `/marketplace`
   - ✅ Mis Pedidos → `/marketplace/orders`
   - ✅ Facturas → `/marketplace/orders`
   - ✅ Soporte → `#`
   - ✅ Hover effects work
6. **Info Banner:**
   - ✅ Free shipping message displayed
   - ✅ "Ir al Catálogo" link works

### Test 1.2: Supplier Dashboard

**Path:** `/supplier/dashboard`

**Steps:**
1. Login as supplier
2. ✅ Verify redirect to supplier dashboard
3. **KPI Cards:**
   - ✅ Pedidos Totales - Orders with supplier items
   - ✅ Pendientes de Aceptar - Pending orders
   - ✅ En Preparación - In-prep orders
   - ✅ Ingresos - Revenue from supplier items only
   - ✅ Trend indicator on Ingresos (+15%)
4. **Recent Orders:**
   - ✅ Shows only orders with supplier's items
   - ✅ Totals show supplier portion only (not full order)
   - ✅ Item count shows supplier items only
   - ✅ Click order → detail page
5. **Order Status Overview:**
   - ✅ Breakdown by status (Pendientes, En Preparación, Enviados, Entregados)
   - ✅ Badges with correct counts
   - ✅ Color indicators match status
6. **Info Banner:**
   - ✅ Management tips displayed
   - ✅ "Ver Todos los Pedidos" link
7. **Sidebar Navigation:**
   - ✅ Dashboard, Mis Productos, Pedidos, Mi Perfil links visible

### Test 1.3: Admin Dashboard

**Path:** `/admin/dashboard`

**Steps:**
1. Login as admin
2. ✅ Verify redirect to admin dashboard
3. **KPI Cards:**
   - ✅ Ingresos Totales - Platform-wide revenue
   - ✅ Total Pedidos - All orders
   - ✅ Proveedores Activos - Count (mock: 3)
   - ✅ Pendientes Aprobación - Count (mock: 1)
   - ✅ Trend on Ingresos (+12%)
4. **Recent Activity Widget:**
   - ✅ Shows last 10 orders
   - ✅ Order number, franchisee name, date
   - ✅ Status badge colored
   - ✅ Total amount
   - ✅ "Ver Todo" → `/admin/orders`
5. **Platform Health Widget:**
   - ✅ Sistema: Operativo (green)
   - ✅ Pagos: Activo (green)
   - ✅ API: Mock Mode (green)
   - ✅ All badges green
6. **Pending Actions Widget:**
   - ✅ Aprobar Proveedores button with badge (1)
   - ✅ Pedidos Pendientes button with count
   - ✅ Links work correctly
7. **Sidebar Navigation:**
   - ✅ Dashboard, Proveedores, Franquiciados, Productos, Pedidos

### Test 1.4: Dashboard Responsive Design

**Steps:**
1. Open any dashboard
2. Resize browser window or use DevTools responsive mode
3. **Mobile (375px):**
   - ✅ KPI cards stack vertically (1 column)
   - ✅ Recent orders widget full width
   - ✅ Text readable, no overflow
4. **Tablet (768px):**
   - ✅ KPI cards in 2 columns
   - ✅ Layout adjusts smoothly
5. **Desktop (1024px+):**
   - ✅ KPI cards in 4 columns
   - ✅ Widgets side-by-side
   - ✅ Optimal spacing

### Test 1.5: Dashboard Data Updates

**Steps:**
1. Login as franchisee, note dashboard stats
2. Complete a purchase (add to cart → checkout → success)
3. Return to dashboard
4. **Verify:**
   - ✅ Total Pedidos increased by 1
   - ✅ New order appears first in Recent Orders
   - ✅ Total Gastado updated
   - ✅ Ticket Medio recalculated
5. Login as supplier, check supplier dashboard
6. **Verify:**
   - ✅ Order appears if it contains supplier items
   - ✅ Revenue updated with supplier's portion only
7. Login as admin, check admin dashboard
8. **Verify:**
   - ✅ Order in Recent Activity
   - ✅ Total revenue updated

---

## 👤 Feature 2: User Profiles

### Test 2.1: Franchisee Profile

**Path:** `/marketplace/profile`

**Steps:**
1. Login as franchisee
2. Click avatar with initials in header → redirects to profile
3. **View Mode:**
   - ✅ Name, Email, Phone displayed
   - ✅ Company name shown
   - ✅ Address, City, Postal Code displayed
   - ✅ All fields read-only (disabled)
   - ✅ "Editar" button visible
4. **Account Info Sidebar:**
   - ✅ Tipo de Cuenta: Franquiciado
   - ✅ Estado: Activa (green)
   - ✅ Miembro desde: Enero 2026
5. **Quick Links:**
   - ✅ Configuración → `/marketplace/settings`
   - ✅ Mis Pedidos → `/marketplace/orders`
   - ✅ Dashboard → `/marketplace/dashboard`
6. **Edit Mode:**
   - Click "Editar" button
   - ✅ All fields become editable
   - ✅ "Guardar Cambios" and "Cancelar" buttons appear
   - ✅ "Editar" button hidden
7. **Edit and Save:**
   - Change phone to `+34 611 222 333`
   - Change city to `Barcelona`
   - Click "Guardar Cambios"
   - ✅ "Guardando..." text displays
   - ✅ Success toast appears
   - ✅ Fields return to read-only
   - ✅ Changes persisted (still there after refresh)
8. **Cancel Edit:**
   - Click "Editar"
   - Change name to `Test Name`
   - Click "Cancelar"
   - ✅ Changes discarded
   - ✅ Original name restored
   - ✅ Fields return to read-only

### Test 2.2: Supplier Profile

**Path:** `/supplier/profile`

**Steps:**
1. Login as supplier
2. Navigate to `/supplier/profile` or click avatar
3. **View Mode:**
   - ✅ Company (Nombre Comercial) displayed
   - ✅ CIF/NIF shown
   - ✅ Razón Social displayed
   - ✅ Contact person name
   - ✅ Email, Phone
   - ✅ Address, City, Postal Code
4. **Account Sidebar:**
   - ✅ Tipo: Proveedor
   - ✅ Estado: Aprobada (green)
   - ✅ Productos: 8 productos activos
   - ✅ Miembro desde shown
5. **Quick Links:**
   - ✅ Configuración, Dashboard, Mis Productos links work
6. **Edit and Save:**
   - Click "Editar"
   - Change company to `Productos Premium S.L.`
   - Change phone
   - Click "Guardar Cambios"
   - ✅ Success toast
   - ✅ Changes saved
7. **CIF Field:**
   - ✅ CIF field is editable when in edit mode
   - ✅ Shows B12345678 or similar format

### Test 2.3: Admin Profile

**Path:** `/admin/profile`

**Steps:**
1. Login as admin
2. Navigate to profile
3. **View Mode:**
   - ✅ Name, Email, Phone displayed
   - ✅ Department: Administración Marketplace
   - ✅ Rol: Administrador del Sistema
   - ✅ Department and Role fields disabled (always)
4. **Permissions Sidebar:**
   - ✅ Nivel de Acceso: Acceso Total (red)
   - ✅ Estado: Activo (green)
   - ✅ Último Acceso: Today's time
5. **Quick Links:**
   - ✅ Configuración, Dashboard, Proveedores links work
6. **Edit:**
   - ✅ Can edit Name, Email, Phone
   - ✅ Cannot edit Department or Role (always disabled)
   - ✅ Save works correctly

### Test 2.4: Profile Navigation

**Steps:**
1. **From Header:**
   - Login as franchisee
   - **Avatar with initials** (left icon in user menu box) → redirects to `/marketplace/profile` ✅
   - **User/Settings icon** (right icon in user menu box) → redirects to `/marketplace/settings` ✅
2. **Role-Specific Paths:**
   - Login as supplier
   - **Avatar with initials** → goes to `/supplier/profile` ✅
   - **User/Settings icon** → goes to `/supplier/settings` ✅
3. **Admin Path:**
   - Login as admin
   - **Avatar with initials** → goes to `/admin/profile` ✅
   - **User/Settings icon** → goes to `/admin/settings` ✅
4. **Direct Access:**
   - Try accessing wrong role's profile
   - ✅ ProtectedRoute redirects to correct dashboard

---

## ⚙️ Feature 3: Settings & Preferences

### Test 3.1: Franchisee Settings

**Path:** `/marketplace/settings`

**Steps:**
1. Login as franchisee
2. Click settings icon (User icon, right icon in user menu box) in header → redirects to settings
3. **Security Section:**
   - ✅ "Cambiar Contraseña" button visible
   - Click button
   - ✅ Form appears with 3 password fields
   - ✅ "Mostrar contraseñas" checkbox works
4. **Password Change - Validation:**
   - Enter current: `test123`
   - Enter new: `new123`
   - Enter confirm: `new456` (different)
   - Click "Guardar Contraseña"
   - ✅ Error toast: "Las contraseñas no coinciden"
5. **Password Change - Short Password:**
   - Enter new: `12345` (5 chars)
   - Enter confirm: `12345`
   - Click "Guardar Contraseña"
   - ✅ Error toast: "al menos 6 caracteres"
6. **Password Change - Success:**
   - Enter current: `franchisee123`
   - Enter new: `newpass123`
   - Enter confirm: `newpass123`
   - Click "Guardar Contraseña"
   - ✅ Success toast appears
   - ✅ Form hidden, back to "Cambiar Contraseña" button
   - ✅ Fields cleared
7. **Cancel Password Change:**
   - Click "Cambiar Contraseña"
   - Fill in fields
   - Click "Cancelar"
   - ✅ Form hidden
   - ✅ Fields cleared
8. **Notifications Section:**
   - ✅ 4 toggles visible:
     - Actualizaciones de Pedidos
     - Promociones y Ofertas
     - Boletín Informativo
     - Alertas de Productos
   - Toggle each one
   - ✅ Success toast for each toggle
   - ✅ Checkbox state changes immediately
9. **Email Preferences:**
   - ✅ Frequency dropdown visible
   - ✅ Options: Inmediatamente, Resumen diario, Resumen semanal, Nunca
   - ✅ Default: Inmediatamente
10. **Danger Zone:**
    - ✅ Red bordered card visible
    - ✅ "Cerrar Sesión" button red
    - Click button
    - ✅ Redirects to `/login`
    - ✅ User logged out
    - ✅ Success toast shown
11. **Account Info Sidebar:**
    - ✅ Email displayed
    - ✅ Tipo: Franquiciado

### Test 3.2: Supplier Settings

**Path:** `/supplier/settings`

**Steps:**
1. Login as supplier
2. Navigate to settings
3. **Security:**
   - ✅ Password change works same as franchisee
   - ✅ All validation rules apply
4. **Notifications:**
   - ✅ 3 toggles visible:
     - Nuevos Pedidos
     - Stock Bajo
     - Actualizaciones del Sistema
   - ✅ Each toggle works
   - ✅ Toast on each change
5. **Danger Zone:**
   - ✅ Logout button works
6. **Account Info:**
   - ✅ Shows "Proveedor" as type

### Test 3.3: Admin Settings

**Path:** `/admin/settings`

**Steps:**
1. Login as admin
2. Navigate to settings
3. **Security:**
   - ✅ Password change functionality identical
   - ✅ All validations work
4. **Notifications:**
   - ✅ 4 admin-specific toggles:
     - Alertas del Sistema
     - Aprobaciones de Proveedores
     - Problemas con Pedidos
     - Informes Diarios
   - ✅ All toggles work
5. **System Status Card:**
   - ✅ Amber/yellow bordered card
   - ✅ Shows:
     - Modo API: Mock (Desarrollo)
     - Base de Datos: LocalStorage
     - Versión: 1.0.0 Beta
6. **Danger Zone:**
   - ✅ Logout works
7. **Account Info:**
   - ✅ Shows Admin with shield icon (red)

### Test 3.4: Settings Navigation

**Steps:**
1. **From Header:**
   - Login as any user
   - Click settings icon (User icon, right icon in user menu box)
   - ✅ Redirects to correct settings page
2. **Role-Specific Paths:**
   - ✅ Franchisee → `/marketplace/settings`
   - ✅ Supplier → `/supplier/settings`
   - ✅ Admin → `/admin/settings`
3. **From Profile:**
   - Go to profile page
   - Click "Configuración →" link in sidebar
   - ✅ Navigates to settings

---

## 🔐 Feature 4: Header User Menu

### Test 4.1: User Menu Icons

**Steps:**
1. Login as franchisee
2. **Check Header Right Side:**
   - ✅ Cart icon visible (franchisee only)
   - ✅ Bordered box with 2 icons:
     - **Avatar with user initials** (left icon - profile)
     - **User/Settings icon** (right icon - settings)
   - ✅ Logout icon visible (outside the box)
3. **Hover States:**
   - Hover over each icon
   - ✅ Hover effect works
   - ✅ Icons have tooltip titles
4. **Click Avatar (initials):**
   - Click avatar icon with user initials
   - ✅ Goes to profile page
5. **Click Settings Icon:**
   - Click user/settings icon
   - ✅ Goes to settings page
6. **Click Logout:**
   - Click logout icon
   - ✅ Logs out and redirects to login

### Test 4.2: Role-Specific Menu

**Steps:**
1. **Franchisee:**
   - ✅ Cart icon present
   - ✅ Profile/Settings icons present
   - ✅ Logout present
2. **Supplier:**
   - ✅ NO cart icon
   - ✅ Profile/Settings icons present
   - ✅ Logout present
3. **Admin:**
   - ✅ NO cart icon
   - ✅ Profile/Settings icons present
   - ✅ Logout present

---

## 🎨 UI/UX Testing

### Test 5.1: Consistent Design

**Steps:**
1. Navigate through all dashboards
2. **Verify:**
   - ✅ Same color scheme across all pages
   - ✅ Same button styles
   - ✅ Same card styles
   - ✅ Same spacing and typography
3. Navigate through all profile pages
4. **Verify:**
   - ✅ Same layout (2 columns on desktop, 1 on mobile)
   - ✅ Same form styles
   - ✅ Same sidebar design
5. Navigate through all settings pages
6. **Verify:**
   - ✅ Consistent section cards
   - ✅ Same toggle styles
   - ✅ Same danger zone styling

### Test 5.2: Accessibility

**Steps:**
1. **Keyboard Navigation:**
   - Use Tab to navigate forms
   - ✅ All inputs focusable
   - ✅ Focus indicator visible
   - ✅ Tab order logical
2. **Form Labels:**
   - ✅ All inputs have labels
   - ✅ Labels descriptive
   - ✅ Icons complement, don't replace text
3. **Error Messages:**
   - ✅ Error toasts visible and readable
   - ✅ Red color for destructive actions
   - ✅ Green for success
4. **Responsive Text:**
   - ✅ Text readable on all screen sizes
   - ✅ No text cutoff
   - ✅ Appropriate font sizes

### Test 5.3: Loading States

**Steps:**
1. **Dashboard Loading:**
   - Refresh dashboard
   - ✅ Skeleton/loading state shows briefly
   - ✅ Data loads smoothly
2. **Profile Save:**
   - Edit profile and save
   - ✅ Button shows "Guardando..."
   - ✅ Button disabled during save
   - ✅ Success state after save
3. **Password Change:**
   - Change password
   - ✅ Form stays visible during save
   - ✅ Success toast appears
   - ✅ Form clears and hides

---

## 📊 Data Persistence Testing

### Test 6.1: Profile Changes Persist

**Steps:**
1. Login as franchisee
2. Edit profile, change phone to `+34 700 000 000`
3. Save changes
4. Refresh page
5. ✅ Phone still shows new value
6. Logout and login again
7. Go to profile
8. ✅ Phone still updated
   *(Note: In current implementation, this is simulated. Real persistence would require backend.)*

### Test 6.2: Settings Persist

**Steps:**
1. Change notification preferences
2. Refresh page
3. ✅ Toggles maintain state
   *(Current implementation uses component state, would need localStorage/backend for real persistence)*

### Test 6.3: Dashboard Data

**Steps:**
1. View dashboard statistics
2. Refresh page
3. ✅ Stats remain consistent
4. Complete a purchase
5. Refresh dashboard
6. ✅ Stats updated correctly
7. Clear localStorage: `localStorage.removeItem('mock-orders')`
8. Refresh dashboard
9. ✅ Stats reset to 0 or show only mock orders

---

## 🧪 Integration Testing

### Test 7.1: End-to-End User Journey

**Franchisee Journey:**
1. Login as franchisee
2. ✅ Redirects to dashboard
3. View dashboard stats
4. Click "Nuevo Pedido" quick action
5. ✅ Goes to marketplace
6. Add items to cart
7. Complete checkout
8. ✅ Redirects to success page
9. Click "Ver Mis Pedidos"
10. ✅ New order visible
11. Go to dashboard
12. ✅ Stats updated
13. Click avatar → go to profile
14. ✅ Profile loads correctly
15. Click settings icon → go to settings
16. ✅ Settings loads correctly
17. Change password
18. ✅ Success toast
19. Click logout
20. ✅ Redirected to login

**Supplier Journey:**
1. Login as supplier
2. ✅ Redirects to `/supplier/dashboard`
3. Check incoming orders
4. ✅ Orders with supplier items shown
5. Check revenue calculation
6. ✅ Shows only supplier portion
7. Go to profile
8. ✅ Company info displayed
9. Go to settings
10. ✅ Supplier-specific notifications
11. Logout
12. ✅ Success

**Admin Journey:**
1. Login as admin
2. ✅ Redirects to `/admin/dashboard`
3. Check platform stats
4. ✅ All orders and revenue shown
5. Check pending actions
6. ✅ Supplier approvals count shown
7. Go to profile
8. ✅ Admin permissions displayed
9. Go to settings
10. ✅ System status visible
11. Logout
12. ✅ Success

### Test 7.2: Cross-Role Access

**Steps:**
1. Login as franchisee
2. Try to access `/supplier/dashboard` directly
3. ✅ Redirected to `/marketplace/dashboard`
4. Try `/admin/profile`
5. ✅ Redirected to franchisee area
6. Login as supplier
7. Try `/marketplace/settings`
8. ✅ Redirected to supplier area
9. Try `/admin/dashboard`
10. ✅ Redirected to supplier area
11. Login as admin
12. Try `/marketplace/profile`
13. ✅ Redirected to admin area
14. Try `/supplier/settings`
15. ✅ Redirected to admin area

---

## 🐛 Edge Cases & Error Handling

### Test 8.1: Empty States

**Dashboard:**
1. Clear all orders: `localStorage.removeItem('mock-orders')`
2. Refresh dashboards
3. **Franchisee:**
   - ✅ All KPIs show 0
   - ✅ Recent Orders shows empty state
   - ✅ "Explorar Catálogo" button visible
4. **Supplier:**
   - ✅ All metrics 0
   - ✅ Empty state shown
5. **Admin:**
   - ✅ Revenue and orders 0
   - ✅ "No hay actividad reciente" message

### Test 8.2: Form Validation

**Profile:**
1. Try to save with empty name
2. ✅ (Current: allows, Real app: should validate)

**Settings:**
1. Password mismatch
2. ✅ Error shown
3. Password too short
4. ✅ Error shown
5. Empty passwords
6. ✅ (Current: allows, should validate)

### Test 8.3: Navigation Edge Cases

**Steps:**
1. Not logged in, try to access `/marketplace/profile`
2. ✅ Redirects to `/login`
3. Login, then manually delete auth from localStorage
4. Refresh page
5. ✅ Redirects to login
6. Login, press browser back button
7. ✅ Navigation works correctly

---

## ✅ Week 4 Feature Checklist

### Dashboards
- [x] Franchisee dashboard with 4 KPIs
- [x] Supplier dashboard with filtered orders
- [x] Admin dashboard with platform overview
- [x] Recent orders widgets
- [x] Quick actions
- [x] Status widgets
- [x] Responsive design
- [x] Empty states
- [x] Loading states
- [x] Real data from mockApi

### User Profiles
- [x] Franchisee profile page
- [x] Supplier profile page
- [x] Admin profile page
- [x] Edit mode functionality
- [x] Save changes with toast
- [x] Cancel button
- [x] Account info sidebars
- [x] Quick links
- [x] Responsive layout

### Settings
- [x] Franchisee settings page
- [x] Supplier settings page
- [x] Admin settings page
- [x] Password change with validation
- [x] Show/hide passwords toggle
- [x] Notification preferences
- [x] Email preferences
- [x] Logout functionality
- [x] Danger zone styling
- [x] System status (admin only)

### Navigation
- [x] Header user menu icons
- [x] Role-specific profile links
- [x] Role-specific settings links
- [x] Avatar and settings icons
- [x] Logout icon
- [x] Tooltips/titles
- [x] Protected routes working

### General
- [x] No TypeScript errors
- [x] Consistent UI design
- [x] Toast notifications
- [x] Form validation
- [x] Responsive on all devices
- [x] Accessible forms
- [x] Loading states
- [x] Error handling

---

## 📝 Known Limitations (Mock Implementation)

1. **Profile changes** - Success toast shown, but changes not persisted to backend (would need API)
2. **Settings preferences** - Stored in component state, not persisted across sessions (would need localStorage or API)
3. **Password changes** - Validation works, but doesn't actually change auth (would need backend)
4. **Supplier revenue calculation** - Assumes supplierId '3' for demo purposes
5. **Admin stats** - Some values mocked (active suppliers: 3, pending: 1)

These are expected in the current development phase and would be implemented with real backend integration.

---

## 🚀 Success Criteria

Week 4 is complete when:
- ✅ All 3 dashboards load and display correct data
- ✅ All 3 role-specific profile pages work
- ✅ All 3 role-specific settings pages work
- ✅ Profile editing saves and shows success
- ✅ Password change validates correctly
- ✅ Notification toggles work
- ✅ Header user menu navigates correctly
- ✅ All pages are responsive
- ✅ No TypeScript or console errors
- ✅ Protected routes enforce role access
- ✅ Logout works from all pages

---

**Testing Completed:** ____________  
**Tested By:** ____________  
**Status:** ⏳ Pending / ✅ Passed / ❌ Failed  
**Notes:** ____________
