# 🧪 Testing Guide - New Store Openings Module

## ✅ LATEST UPDATES (2026-08-19)

### 🎉 All Critical Issues Fixed!

**Navigation Links Added:**
- ✅ Admin: "Nuevas Aperturas" button in "Acciones Pendientes" card → `/admin/openings`
- ✅ Franchisee: "Proyectos de Apertura" button in Quick Actions → `/franchisee/openings`
- ✅ Supplier: "Invitaciones de Apertura" button in Quick Actions → `/supplier/openings`

**New Pages Implemented:**
- ✅ `/franchisee/openings/[id]` - Franchisee project detail page with quote comparison
- ✅ `/supplier/openings/[categoryId]/quote` - Supplier quote submission form

**Mock Data Fixed:**
- ✅ Invitations now include full project and category data
- ✅ Budget estimate and deadline now display correctly
- ✅ Floor plan download button works

---

## Quick Start

### 1. Environment Setup ✅
The environment variable has been configured in `.env.local`:
```bash
NEXT_PUBLIC_MOCK_OPENINGS=true
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 3. Access the Openings Module 🔗

**Admin Users:**
1. Login as admin: `admin@test.com` / `admin123`
2. Go to Admin Dashboard: `http://localhost:3000/admin/dashboard`
3. Look for "Acciones Pendientes" card (right sidebar)
4. Click **"Nuevas Aperturas"** button → navigates to `/admin/openings`

**Franchisee Users:**
1. Login as franchisee: `franchisee@test.com` / `franchisee123`
2. Go to Marketplace Dashboard: `http://localhost:3000/marketplace/dashboard`
3. Look for "Acciones Rápidas" card (right sidebar)
4. Click **"Proyectos de Apertura"** button → navigates to `/franchisee/openings`

**Supplier Users:**
1. Login as supplier: `supplier@test.com` / `supplier123`
2. Go to Supplier Dashboard: `http://localhost:3000/supplier/dashboard`
3. Look for "Acciones Rápidas" card (right sidebar)
4. Click **"Invitaciones de Apertura"** button → navigates to `/supplier/openings`

---

## 📍 Available Routes & What to Test

### 🔵 ADMIN PORTAL

#### **Route 1: Projects List**
```
URL: http://localhost:3000/admin/openings
```

**What you'll see:**
- ✅ Header with "Nuevo Proyecto" button
- ✅ 4 statistics cards (Total, En Proceso, Pendiente Firma, Aprobados)
- ✅ Grid of project cards (3 mock projects)
- ✅ Each card shows:
  - Project name and franchisee
  - Status badge (color-coded)
  - Planned opening date
  - Categories and quotes count
  - Creation date

**Test Actions:**
1. Click on any project card → should navigate to detail view
2. Click "Nuevo Proyecto" button → ✅ **NOW WORKS!** navigates to `/admin/openings/new`
3. Check statistics are calculating correctly from mock data

---

#### **Route 2: Project Detail**
```
URL: http://localhost:3000/admin/openings/proj_001
```

**What you'll see:**
- ✅ Back button to return to list
- ✅ Project name, description, and status badge
- ✅ 3 info cards: Franchisee, Location, Planned Opening
- ✅ Tabs: Resumen, Categorías, Proveedores, Presupuestos, Documentos
- ✅ Tab "Resumen" shows:
  - Project description
  - Store size and format
  - Fiscal data (CIF, legal name)

**Test Actions:**
1. Click "Volver" → returns to projects list
2. Navigate between tabs → tab content changes
3. Check if project data displays correctly (franchisee, address, dates)
4. Try with different project IDs: `proj_001`, `proj_002`, `proj_003`

---

#### **Route 2b: New Project Form (NEW!)**
```
URL: http://localhost:3000/admin/openings/new
```

**What you'll see:**
- ✅ Header "Nuevo Proyecto de Apertura"
- ✅ Three main sections with cards:
  1. **Información del Proyecto:** Franchisee ID, project name, planned opening date
  2. **Ubicación del Local:** Street, city, province, postal code, country
  3. **Datos Fiscales:** Company name, tax ID, contact name, email, phone
- ✅ All required fields marked with asterisk (*)
- ✅ Cancel and Create buttons at bottom

**Test Actions:**
1. Click "Volver a Proyectos" → returns to projects list
2. Try submitting empty form → validation prevents submission with error message
3. Fill out all required fields with valid data:
   - Franchisee ID: `user_franchisee_test`
   - Project name: `Test Opening - Main Street 456`
   - Street: `Calle Principal 456`
   - City: `Barcelona`
   - Province: `Barcelona`
   - Postal code: `08001`
   - Company name: `Carrefour Test S.L.`
   - Tax ID: `B98765432`
   - Contact name: `Test User`
   - Contact email: `test@carrefour.com`
   - Contact phone: `+34 600 987 654`
4. Optionally add planned opening date
5. Click "Crear Proyecto" → shows loading state, then redirects to new project detail page
6. Verify new project appears in projects list
7. Click "Cancelar" → returns to projects list without creating

---

### 🟢 FRANCHISEE PORTAL

#### **Route 3: My Projects**
```
URL: http://localhost:3000/franchisee/openings
```

**What you'll see:**
- ✅ Header "Mis Proyectos de Apertura"
- ✅ 4 statistics cards (Total, En Proceso, Pendiente Firma, Aprobados)
- ✅ Tabs to filter projects by status:
  - **Activos** - Projects with status: awaiting_quotes, quotes_received, under_review
  - **Pendiente Firma** - Projects with status: pending_signature
  - **Completados** - Projects with status: approved, in_progress, completed
- ✅ Grid of project cards filtered by selected tab

**Test Actions:**
1. Switch between tabs → project list filters accordingly
2. Click on a project card → ✅ **NOW WORKS!** navigates to `/franchisee/openings/{id}`
3. Check statistics match the actual count of projects in each category
4. Verify empty states show when no projects in a tab

#### **Route 3b: Project Detail (NEW!)**
```
URL: http://localhost:3000/franchisee/openings/[id]
Example: http://localhost:3000/franchisee/openings/proj_001
```

**What you'll see:**
- ✅ Project header with name, description, and status badge
- ✅ 4 info cards: Location, Planned Opening, Categories, Total Budget
- ✅ Tabs: Overview, Categories & Quotes, Documents
- ✅ **Overview Tab:** Full project info, address, store details, fiscal data
- ✅ **Categories Tab:** List of categories with quote comparison
  - Each category shows budget estimate, quote count, awarded status
  - "Ver Presupuestos" button opens comparison table
  - Quote comparison shows side-by-side analysis with price highlighting
  - "Seleccionar" button to award quotes (if status allows)
- ✅ **Documents Tab:** Floor plan and additional documents with download buttons

**Test Actions:**
1. Click "Volver" → returns to projects list
2. Navigate between tabs → content changes
3. Click "Ver Presupuestos" on a category → shows quote comparison
4. Compare quotes → lowest price highlighted in yellow, awarded in green
5. Click "Seleccionar" on a quote → awards the quote (if allowed)
6. Download floor plan → opens PDF in new tab
7. Try with different IDs: `proj_001`, `proj_002`, `proj_003`

---

### 🟡 SUPPLIER PORTAL

#### **Route 4: My Invitations**
```
URL: http://localhost:3000/supplier/openings
```

**What you'll see:**
- ✅ Header "Invitaciones a Proyectos"
- ✅ 3 statistics cards (Total, Pendientes, Presupuestos Enviados)
- ✅ List of invitation cards (3 mock invitations)
- ✅ Each card shows:
  - Project name and address
  - Category badge
  - Status badge (Pendiente, Enviado, Adjudicado, Rechazado)
  - Budget estimate
  - Deadline date
  - Requirements text
  - Action buttons based on status

**Test Actions:**
1. Check different invitation statuses (pending, quote_submitted, awarded)
2. Click "Enviar Presupuesto" → ✅ **NOW WORKS!** navigates to `/supplier/openings/{categoryId}/quote`
3. Click "Descargar Plano" → ✅ **NOW WORKS!** downloads floor plan PDF
4. Verify budget and deadline → ✅ **NOW VISIBLE!** display correctly

#### **Route 4b: Quote Submission Form (NEW!)**
```
URL: http://localhost:3000/supplier/openings/[categoryId]/quote
Example: http://localhost:3000/supplier/openings/cat_001/quote
```

**What you'll see:**
- ✅ Header "Enviar Presupuesto" with category name
- ✅ Category details card:
  - Category name and description
  - Budget estimate
  - Expected timeline
  - Requirements list
  - Deliverables list
- ✅ Quote form with fields:
  - **Amount (EUR):** Required, number input
  - **Delivery Days:** Required, number input
  - **Warranty (months):** Optional, number input
  - **Payment Terms:** Optional, text input
  - **Additional Notes:** Optional, textarea
  - **PDF Upload:** Required, file input (accepts .pdf only)
- ✅ Info banner with important notes
- ✅ Submit and Cancel buttons

**Test Actions:**
1. Fill out the form with valid data
2. Try submitting without required fields → validation prevents submission
3. Upload a PDF file → file name displays
4. Try uploading non-PDF → alert shows error
5. Click "Cancelar" → returns to invitations list
6. Submit valid form → shows success message and redirects
7. Try with different category IDs: `cat_001`, `cat_002`, `cat_003`

---

## 🎨 UI Components Testing

### ProjectStatusBadge
**Location:** All project lists

**Test:**
- ✅ Different statuses show different colors
- ✅ Draft → Gray
- ✅ Awaiting Quotes → Yellow
- ✅ Approved → Green
- ✅ Cancelled → Red

### ProjectCard
**Location:** Admin and Franchisee project lists

**Test:**
- ✅ Hover effect (shadow appears)
- ✅ All data displays correctly
- ✅ Icons render properly
- ✅ Click navigates to correct URL

### QuoteComparisonTable
**Location:** Not yet integrated in routes (standalone component)

**Manual test:**
```tsx
import { QuoteComparisonTable } from '@/components/openings/shared/QuoteComparisonTable';
import { mockCategories, mockQuotes } from '@/lib/api/openings-mock';

// Use in a test page
const comparison = {
  category_id: 'cat_001',
  category_name: mockCategories[0].name,
  budget_estimate: mockCategories[0].budget_estimate,
  quotes: mockQuotes,
};

<QuoteComparisonTable data={comparison} canSelectQuote={true} />
```

---

## 🔍 Mock Data Overview

### Projects (3 total)
1. **proj_001** - "Nueva Apertura Carrefour Express Barcelona Centro"
   - Status: `awaiting_quotes`
   - Franchisee: Juan García
   - 3 categories
   
2. **proj_002** - "Apertura Carrefour Market Madrid Norte"
   - Status: `under_review`
   - Franchisee: María López
   - No categories yet
   
3. **proj_003** - "Nuevo Supermercado Carrefour Valencia"
   - Status: `pending_signature`
   - Franchisee: Carlos Martínez
   - No categories yet

### Invitations (3 total)
1. **Mobiliario Comercial** (pending)
2. **Rotulación y Señalética** (quote_submitted)
3. **Equipamiento IT** (awarded)

### Quotes (3 total)
- Supplier 1: €15,000 (30 días, 24 meses garantía)
- Supplier 2: €14,500 (45 días, 12 meses garantía) - Best price
- Supplier 3: €16,200 (25 días, 36 meses garantía)

---

## 🐛 Debugging Tips

### Check Console for Logs
Open browser DevTools (F12) and check:
```
Loading projects... (should see in console)
API call delay: 300ms
Mock data returned
```

### Verify Environment Variable
In browser console:
```javascript
console.log(process.env.NEXT_PUBLIC_MOCK_OPENINGS);
// Should print: "true"
```

### Check Network Tab
- In mock mode, you should NOT see real API calls
- All data loads with 300ms delay (simulated)

### Zustand DevTools
Install [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools) to inspect store state:
- Look for `openings-storage` in persistence
- Check state updates as you navigate

---

## ✅ Functional Testing Checklist

### Admin Routes
- [ ] Projects list loads with 3 projects
- [ ] Statistics cards calculate correctly
- [ ] Can navigate to project detail
- [ ] Project detail shows all tabs
- [ ] Back button returns to list
- [ ] Loading state shows spinner

### Franchisee Routes
- [ ] My projects load correctly
- [ ] Tab filtering works (Activos, Pendiente Firma, Completados)
- [ ] Statistics match filtered counts
- [ ] Empty states show when no projects
- [ ] Can click on project cards

### Supplier Routes
- [ ] Invitations list loads with 3 items
- [ ] Status badges show correct colors
- [ ] Statistics calculate correctly
- [ ] "Enviar Presupuesto" button shows for pending invitations
- [ ] Different status cards render appropriately

---

## 🚀 Development Status

### ✅ Implemented Features

1. ✅ **Admin "New Project" form** (`/admin/openings/new`)
   - Complete project creation form with validation
   - Address and fiscal data input
   - Planned opening date picker
   
2. ✅ **Quote Comparison view** (integrated in `/franchisee/openings/[id]`)
   - Side-by-side quote comparison table
   - Price analysis with best quote highlighting
   - Award quote functionality
   
3. ✅ **Supplier Quote Form** (`/supplier/openings/[categoryId]/quote`)
   - Complete quote submission with PDF upload
   - Category details and requirements display
   - Form validation

### 🔜 Future Development

4. **Digital Signature flow** (future)
   - Electronic signature workflow
   - Legal audit trail
   - Document verification
   
5. **Financial Approval workflow** (future)
   - Carrefour Finanzas integration
   - Multi-level approval process
   - Budget validation

---

## 📝 Expected Behavior Summary

| Route | Expected Result |
|-------|----------------|
| `/admin/openings` | List of 3 projects with statistics |
| `/admin/openings/new` | New project creation form |
| `/admin/openings/proj_001` | Project detail with tabs |
| `/franchisee/openings` | Filtered project list by status |
| `/franchisee/openings/proj_001` | Project detail with quote comparison |
| `/supplier/openings` | 3 invitations with action buttons |
| `/supplier/openings/cat_001/quote` | Quote submission form |

All routes should load in **~300ms** (simulated network delay) and show data from mock files without requiring backend connection.

---

**Happy Testing! 🎉**

If you encounter any issues, check:
1. Environment variable is set (`NEXT_PUBLIC_MOCK_OPENINGS=true`)
2. Dev server is running (`npm run dev`)
3. Console for any errors
4. Network tab shows no failed API calls
