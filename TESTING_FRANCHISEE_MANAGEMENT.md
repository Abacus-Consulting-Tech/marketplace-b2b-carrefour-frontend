# Testing Guide - Franchisee Management Module

**Module**: Franchisee Management (Medusa Customer-aligned)  
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
   - Check console for: `🎭 Franchisees API Mode: MOCK`
   - Or open DevTools → Console

## 🧪 Test Scenarios

### 1. List Franchisees Page

**URL**: `/admin/franchisees`

#### Test 1.1: Page Load
- [ ] Page loads without errors
- [ ] Header shows "Gestión de Franquiciados"
- [ ] Stats cards display numbers:
  - Total Franquiciados: 10
  - Platinum: 2
  - Gold & Silver: 4
  - Basic: 4
- [ ] Table shows 10 franchisees with data
- [ ] Yellow banner shows "🎭 Modo de Desarrollo"

#### Test 1.2: Search Functionality
- [ ] Type "Centro" in search box
- [ ] Table filters to show "Carrefour Centro"
- [ ] Clear search → All 10 franchisees return
- [ ] Search by email: "norte@carrefour.es" → Shows Carrefour Norte
- [ ] Search by CIF: "B67890124" → Shows Carrefour Norte

#### Test 1.3: Tier Filter
- [ ] Select "Platinum" from tier dropdown
- [ ] Table shows only 2 franchisees (Centro, Plaza)
- [ ] Select "Gold" → Shows 2 franchisees
- [ ] Select "Silver" → Shows 2 franchisees
- [ ] Select "Basic" → Shows 4 franchisees
- [ ] Select "Todos los tiers" → Shows all 10

#### Test 1.4: Status Filter
- [ ] Select "Activos" from status dropdown
- [ ] All 10 franchisees shown (all are active in mock)
- [ ] Select "Inactivos" → Empty state
- [ ] Select "Todos" → All 10 return

#### Test 1.5: Table Display
For each row, verify:
- [ ] Company name displayed (e.g., "Carrefour Centro SL")
- [ ] Store code shown (e.g., "CF-MAD-001")
- [ ] CIF/NIF shown (e.g., "B12345678")
- [ ] Email and phone displayed
- [ ] City and province shown with map pin icon
- [ ] Tier badge with correct color:
  - Platinum = purple
  - Gold = yellow
  - Silver = gray
  - Basic = blue
- [ ] Status badge shows "Activo" (green)
- [ ] Total spent formatted as currency (€)
- [ ] Order count displayed

#### Test 1.6: Navigation
- [ ] Click "Ver Detalles" → Navigates to detail page
- [ ] Click "Nuevo Franquiciado" → Navigates to create form
- [ ] Click "Actualizar" → Reloads data

---

### 2. Create Franchisee Form

**URL**: `/admin/franchisees/new`

#### Test 2.1: Form Layout
- [ ] Back arrow navigates to list
- [ ] Title shows "Nuevo Franquiciado"
- [ ] 4 cards visible:
  1. Información Personal
  2. Información de la Empresa
  3. Configuración B2B
  4. Estado y Notas

#### Test 2.2: Required Field Validation
Try submitting empty form:
- [ ] Error alert appears
- [ ] "El nombre es obligatorio" shown

Fill fields one by one and test:
- [ ] First name required
- [ ] Last name required
- [ ] Email required
- [ ] Email format validated (@)
- [ ] Password required (min 8 chars)
- [ ] Company name required
- [ ] CIF/NIF required
- [ ] Store code required

#### Test 2.3: Create Valid Franchisee
Fill form with:
- **First Name**: "Test"
- **Last Name**: "Franchisee"
- **Email**: "test@carrefour.es"
- **Phone**: "+34 600 000 000"
- **Password**: "password123"
- **Company Name**: "Test Franchisee SL"
- **CIF/NIF**: "B99999999"
- **Store Code**: "CF-TEST-001"
- **Discount Tier**: "Silver"
- **Credit Limit**: "10000"
- **Payment Terms**: "60"
- **Active**: ON
- **Notes**: "Test franchisee created"

Actions:
- [ ] Click "Crear Franquiciado"
- [ ] Success message appears
- [ ] Redirects to detail page
- [ ] New franchisee ID in URL

#### Test 2.4: Form Controls
- [ ] Tier dropdown shows all 4 options
- [ ] Credit limit accepts decimal numbers
- [ ] Payment terms accepts integers only
- [ ] Active switch toggles ON/OFF
- [ ] Notes textarea expands properly
- [ ] Cancel button returns to list

---

### 3. Franchisee Detail Page

**URL**: `/admin/franchisees/{id}`

Pick any franchisee from the list (e.g., "cus_centro")

#### Test 3.1: Header & Overview
- [ ] Company name in large title
- [ ] Responsible person name shown below
- [ ] Status badge displayed (Activo)
- [ ] Tier badge displayed
- [ ] "Cuenta Activa" badge if has account
- [ ] Edit button visible
- [ ] Delete button visible (red)
- [ ] Refresh button works

#### Test 3.2: Stats Cards
Verify 4 cards show:
- [ ] **Total Pedidos**: Number + "X pendientes"
- [ ] **Total Gastado**: Currency formatted + avg order
- [ ] **Crédito Disponible**: Amount + limit
- [ ] **Último Pedido**: Date + days since

#### Test 3.3: Info Tab (Default)
- [ ] Tab active by default
- [ ] Name, email, phone displayed
- [ ] Company, CIF, store code shown
- [ ] Created and updated dates formatted
- [ ] Notes section visible if exists

#### Test 3.4: Addresses Tab
- [ ] Click "Direcciones" tab
- [ ] Address cards displayed
- [ ] Each shows: company/name, phone, full address
- [ ] "Añadir Dirección" button visible
- [ ] Empty state if no addresses

#### Test 3.5: Orders Tab
- [ ] Click "Pedidos" tab
- [ ] Stats summary shows total orders and spent
- [ ] Placeholder message "próximamente"

#### Test 3.6: B2B Config Tab
- [ ] Click "Configuración B2B" tab
- [ ] Tier badge displayed
- [ ] Credit limit shown as currency
- [ ] Payment terms in days
- [ ] Available credit calculated

#### Test 3.7: Actions
- [ ] Click "Editar" → Goes to edit form
- [ ] Click "Eliminar" → Confirmation dialog
- [ ] Confirm deletion → Returns to list
- [ ] Deleted franchisee removed from list

---

### 4. Edit Franchisee Form

**URL**: `/admin/franchisees/{id}/edit`

#### Test 4.1: Form Pre-population
- [ ] All fields filled with existing data
- [ ] Company name, CIF, store code correct
- [ ] Contact info matches
- [ ] Tier selected correctly
- [ ] Credit limit and payment terms shown
- [ ] Active status matches
- [ ] Notes displayed if exist
- [ ] Password field NOT shown (edit mode)

#### Test 4.2: Update Fields
Change values:
- [ ] Update phone number
- [ ] Change discount tier
- [ ] Modify credit limit
- [ ] Update notes
- [ ] Toggle active status

Actions:
- [ ] Click "Guardar Cambios"
- [ ] Success message appears
- [ ] Redirects to detail page
- [ ] Changes reflected in detail view

#### Test 4.3: Validation on Edit
- [ ] Clear required field → Error shown
- [ ] Invalid email format → Error shown
- [ ] Negative credit limit → Error shown
- [ ] Cancel button discards changes

---

### 5. Advanced Scenarios

#### Test 5.1: Combined Filters
- [ ] Search "Carrefour" + Tier "Platinum"
- [ ] Results show only platinum franchisees with "Carrefour"
- [ ] Search + Status filter works together
- [ ] All 3 filters combined work

#### Test 5.2: Pagination (if >20 results)
In mock mode, only 10 franchisees exist, so:
- [ ] Pagination hidden (total < 20)
- [ ] Create more franchisees to test pagination

#### Test 5.3: Error Handling
Test error scenarios:
- [ ] Navigate to `/admin/franchisees/invalid-id`
- [ ] Error state shown: "Franquiciado no encontrado"
- [ ] "Volver al Listado" button works

#### Test 5.4: Responsive Design
- [ ] Resize browser to mobile (< 768px)
- [ ] Table remains readable
- [ ] Forms stack vertically
- [ ] Buttons accessible
- [ ] Cards stack properly

#### Test 5.5: Navigation Flow
Complete journey:
1. [ ] List → Click "Nuevo"
2. [ ] Create → Fill form → Submit
3. [ ] Detail → View created franchisee
4. [ ] Detail → Click "Editar"
5. [ ] Edit → Modify → Save
6. [ ] Detail → Verify changes
7. [ ] Detail → Click back
8. [ ] List → Find franchisee
9. [ ] List → Search works
10. [ ] List → Filters work

---

## 🎭 Mock Mode Behaviors

**What Works in Mock Mode:**
- ✅ All CRUD operations (in-memory)
- ✅ Search and filters
- ✅ Data persists during session
- ✅ Validation works
- ✅ Form submissions
- ✅ Stats calculations

**Limitations:**
- ⚠️ Data lost on page refresh
- ⚠️ No actual backend persistence
- ⚠️ Stats calculated from mock data
- ⚠️ Orders are placeholder data
- ⚠️ Address management not fully functional yet

---

## 🌐 Testing Real API Mode

**When backend is ready:**

1. **Switch to Real Mode**
   ```typescript
   // src/config/feature-flags.ts
   franchisees: {
     useMock: false,
     backendReady: true,
   }
   ```

2. **Verify Backend Endpoints**
   ```bash
   # Check Medusa backend is running
   curl http://localhost:9000/admin/customers
   ```

3. **Re-run All Tests Above**
   - [ ] Same UI tests apply
   - [ ] Data persists after refresh
   - [ ] Check network tab for API calls
   - [ ] Verify correct endpoints called

4. **Backend-Specific Tests**
   - [ ] Create franchisee → Check DB
   - [ ] Update franchisee → Verify in Medusa Admin
   - [ ] Delete franchisee → Confirm deletion
   - [ ] Address CRUD → Test all operations
   - [ ] Orders query → Verify customer_id filter

---

## ✅ Test Checklist Summary

### Critical Path (Must Pass)
- [ ] List page loads with data
- [ ] Can create new franchisee
- [ ] Can view franchisee details
- [ ] Can edit franchisee
- [ ] Can delete franchisee
- [ ] Search works
- [ ] Filters work
- [ ] Validation prevents bad data

### Nice to Have (Should Pass)
- [ ] Stats calculated correctly
- [ ] Addresses display properly
- [ ] Badges show correct colors
- [ ] Currency formatting correct
- [ ] Dates formatted in Spanish
- [ ] Responsive on mobile
- [ ] Error states handled

### Known Issues / Future Work
- [ ] Address CRUD not yet implemented
- [ ] Orders table is placeholder
- [ ] Bulk operations need testing
- [ ] Custom stats endpoint needs backend
- [ ] Pagination needs >20 records to test

---

## 🐛 Reporting Issues

If you find bugs, document:
1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Browser/environment**
5. **Screenshots if applicable**

---

## 📊 Test Results Template

```
Date: ________
Tester: ________
Environment: Mock / Real API

[ ] Section 1: List Page - PASS / FAIL
[ ] Section 2: Create Form - PASS / FAIL
[ ] Section 3: Detail Page - PASS / FAIL
[ ] Section 4: Edit Form - PASS / FAIL
[ ] Section 5: Advanced - PASS / FAIL

Issues Found: ____
Notes: ____
```

---

**Happy Testing! 🎉**
