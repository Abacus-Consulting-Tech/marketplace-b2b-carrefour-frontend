# Frontend Build Guide: Product Proposal & Pricing Workflow

**Created:** 2026-08-20  
**Status:** Ready to implement  
**Backend Status:** ✅ Fully implemented and tested (LOCAL + DEV)  
**Frontend Status:** ❌ Not started  

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [What We're Building](#what-were-building)
3. [Technical Architecture](#technical-architecture)
4. [Implementation Plan](#implementation-plan)
5. [Component Breakdown](#component-breakdown)
6. [API Integration](#api-integration)
7. [Testing Strategy](#testing-strategy)
8. [Phasing & Priorities](#phasing--priorities)

---

## Overview

### Business Context

This workflow enables:
- **Suppliers** to propose products with base pricing
- **Infocus admins** to review and approve/reject with markup percentages
- **Dynamic pricing** in the storefront based on product-specific or seller-global markups

### Current State

✅ **Backend:** All 6 endpoints working, tested with Postman  
✅ **Documentation:** Complete manual with examples  
✅ **Postman Collection:** Folders 6 & 7 with auto-save tokens  
❌ **Frontend:** No implementation exists yet  

### Why This Matters

This is **core marketplace functionality** - without it:
- Suppliers can't onboard their products
- Pricing team can't control margins
- Products won't have correct final prices in storefront

---

## What We're Building

### For Suppliers (Vendor Role)

**Page:** `/supplier/products` (new)

**Features:**
1. **Product Proposal Form**
   - Title, description, base price
   - Units per pack
   - Category selection
   - Optional: image upload
   - Variant builder (sizes, colors, SKUs)
   
2. **My Products List**
   - Table/grid view of all proposed products
   - Status badges: Pending | Approved | Rejected
   - View rejection reasons
   - Filter by status
   - Search by title

3. **Product Detail View**
   - Full product info
   - Approval status timeline
   - If rejected: reason + edit/resubmit option
   - If approved: final price calculation shown

### For Admins (Admin Role)

**Page:** `/admin/products/pricing` (new)

**Features:**
1. **Pending Products Queue**
   - List of products awaiting pricing approval
   - Supplier info, product details, base price
   - Batch selection for bulk actions
   - Filter by supplier, date, category

2. **Product Review Panel**
   - Full product details
   - Base price + proposed markup calculator
   - Live price preview
   - Approve with markup (0-500%)
   - Reject with reason text
   - View supplier profile link

3. **Seller Markup Management**
   - Table of all suppliers with global markup %
   - Edit global markup per supplier
   - History of markup changes
   - Applied to X products indicator

### For Storefront (All Roles)

**Updates to existing pages:**

**`/marketplace/products/[id]`**
- Display final calculated price (not base price)
- Show pricing logic: "Base €18.50 + 15% markup = €21.28"
- Optionally show supplier name

**`/marketplace` (product list)**
- Display final prices
- Ensure cart uses final prices, not base prices

---

## Technical Architecture

### New Files to Create

```
src/
├── types/
│   └── products-pricing.ts              # NEW - TypeScript types
├── lib/
│   ├── api/
│   │   ├── products-pricing-client.ts   # NEW - API client
│   │   └── products-pricing-mock.ts     # NEW - Mock data
│   └── utils/
│       └── pricing-calculator.ts        # NEW - Price calculation logic
├── components/
│   ├── supplier/
│   │   ├── ProductProposalForm.tsx      # NEW - Propose product
│   │   ├── ProductsList.tsx             # NEW - My products list
│   │   ├── ProductStatusBadge.tsx       # NEW - Status indicator
│   │   └── VariantBuilder.tsx           # NEW - Build variants
│   └── admin/
│       ├── PricingQueue.tsx             # NEW - Pending products
│       ├── ProductReviewPanel.tsx       # NEW - Review/approve
│       ├── PriceCalculator.tsx          # NEW - Markup calculator
│       └── SellerMarkupManager.tsx      # NEW - Global markups
└── app/
    ├── (supplier)/
    │   └── supplier/
    │       └── products/
    │           ├── page.tsx             # NEW - List page
    │           ├── new/
    │           │   └── page.tsx         # NEW - Proposal form
    │           └── [id]/
    │               └── page.tsx         # NEW - Detail view
    └── (backoffice)/
        └── admin/
            └── products/
                ├── pricing/
                │   └── page.tsx         # NEW - Pricing queue
                └── suppliers/
                    └── [id]/
                        └── markup/
                            └── page.tsx # NEW - Seller markup
```

### Existing Files to Update

```
src/
├── app/
│   └── (marketplace)/
│       └── marketplace/
│           ├── page.tsx                 # UPDATE - Use final prices
│           └── products/
│               └── [id]/
│                   └── page.tsx         # UPDATE - Show pricing breakdown
└── components/
    └── marketplace/
        └── ProductCard.tsx              # UPDATE - Display final price
```

---

## Implementation Plan

### Phase 1: Foundation (Day 1 - 2 hours)

**Goal:** Set up types, API client, and mock data

**Tasks:**
1. ✅ Create `src/types/products-pricing.ts`
   - Product, Variant, PricingStatus types
   - Request/Response interfaces
   - Seller with markup

2. ✅ Create `src/lib/api/products-pricing-client.ts`
   - Dual mode (mock/real) like openings-client
   - 6 API methods matching backend endpoints
   - Error handling

3. ✅ Create `src/lib/api/products-pricing-mock.ts`
   - Sample suppliers with global markups
   - Sample proposed products (pending/approved/rejected)
   - Helper functions

4. ✅ Create `src/lib/utils/pricing-calculator.ts`
   - `calculateFinalPrice(basePrice, productMarkup?, sellerMarkup?)`
   - `formatPrice(amount, currency)`
   - `getMarkupLabel(markup)`

**Deliverable:** Can call API methods in mock mode, types working

---

### Phase 2: Supplier - Product Proposal (Day 1 - 3 hours)

**Goal:** Suppliers can propose products

**Tasks:**
1. ✅ Create `ProductProposalForm.tsx`
   - Form: title, description, base_price, units_per_pack
   - Category dropdown (use existing categories API)
   - Validation: base_price > 0, required fields
   - Submit → POST /vendor/custom/products
   - Success → redirect to products list

2. ✅ Create `VariantBuilder.tsx` (optional, can be Phase 3)
   - Add/remove variant rows
   - Each: title, base_price, sku
   - Dynamic form array

3. ✅ Create `/supplier/products/new/page.tsx`
   - Render ProductProposalForm
   - Handle success/error states
   - Breadcrumbs

**Testing:**
- Can submit product in mock mode
- Validation works
- Form clears on success

**Deliverable:** Supplier can propose basic product (without variants for now)

---

### Phase 3: Supplier - Products List (Day 1 - 2 hours)

**Goal:** Suppliers can see their products and status

**Tasks:**
1. ✅ Create `ProductStatusBadge.tsx`
   - Pending: yellow
   - Approved: green
   - Rejected: red
   - Icon + label

2. ✅ Create `ProductsList.tsx`
   - Fetch GET /vendor/custom/products
   - Table: thumbnail, title, base_price, status, created_at, actions
   - Filter by status tabs
   - Search by title
   - Click row → detail page

3. ✅ Create `/supplier/products/page.tsx`
   - Render ProductsList
   - "New Product" button → /supplier/products/new

**Testing:**
- List shows mock products
- Status badges display correctly
- Filters work

**Deliverable:** Supplier dashboard showing all products with status

---

### Phase 4: Admin - Pricing Queue (Day 2 - 3 hours)

**Goal:** Admins can see pending products

**Tasks:**
1. ✅ Create `PricingQueue.tsx`
   - Fetch GET /admin/custom/products/pending
   - Table: supplier name, product title, base_price, created_at, action
   - Filter by supplier dropdown
   - Click "Review" → review panel modal/page

2. ✅ Create `PriceCalculator.tsx`
   - Input: base_price (readonly from product)
   - Slider/input: markup_percentage (0-500)
   - Live calculation: final_price = base × (1 + markup/100)
   - Display: Base €18.50 + 15% = €21.28

3. ✅ Create `/admin/products/pricing/page.tsx`
   - Render PricingQueue
   - Stats: X pending, Y approved today, Z rejected

**Testing:**
- Queue loads pending products
- Calculator shows correct math
- Filter by supplier works

**Deliverable:** Admin can see and filter pending products

---

### Phase 5: Admin - Review & Approve (Day 2 - 3 hours)

**Goal:** Admins can approve/reject products

**Tasks:**
1. ✅ Create `ProductReviewPanel.tsx`
   - Product details display (readonly)
   - PriceCalculator embedded
   - Two buttons:
     - Approve (green) → opens markup input dialog
     - Reject (red) → opens rejection reason dialog
   - On approve: PATCH with markup_percentage
   - On reject: PATCH with rejection_reason
   - Success → remove from queue, show toast

2. ✅ Update PricingQueue to use modal/drawer
   - Click "Review" → open ProductReviewPanel in modal
   - Or navigate to `/admin/products/pricing/[id]`

**Testing:**
- Can approve with markup in mock mode
- Can reject with reason
- Product removed from pending list
- Toast notifications work

**Deliverable:** Full approve/reject workflow functional

---

### Phase 6: Admin - Seller Markup Management (Day 2 - 2 hours)

**Goal:** Admins can manage global seller markups

**Tasks:**
1. ✅ Create `SellerMarkupManager.tsx`
   - Table: supplier name, email, global_markup_percentage, products count, edit
   - Edit button → dialog with number input (0-500)
   - Save → PATCH /admin/custom/sellers/:id/markup
   - Show previous vs new markup

2. ✅ Create `/admin/products/suppliers/page.tsx` OR
   - Add tab to existing `/admin/suppliers/page.tsx`

**Testing:**
- List all suppliers with markups
- Edit markup in mock mode
- Validation: 0-500 range

**Deliverable:** Admin can view and edit seller global markups

---

### Phase 7: Supplier - Product Detail & Resubmit (Day 3 - 2 hours)

**Goal:** Suppliers can see detail and resubmit rejected products

**Tasks:**
1. ✅ Create `/supplier/products/[id]/page.tsx`
   - Fetch product detail
   - Show all fields
   - If approved: show final price, pricing breakdown
   - If rejected: show rejection_reason in alert
   - If rejected: "Edit & Resubmit" button
   - Resubmit → prepopulate ProductProposalForm

2. ✅ Update ProductProposalForm to accept initialData prop
   - Edit mode: pre-fill form
   - On submit: create new product (backend doesn't support edit)

**Testing:**
- Detail page loads
- Rejected products show reason
- Resubmit flow works

**Deliverable:** Suppliers can view details and respond to rejections

---

### Phase 8: Storefront Price Display (Day 3 - 3 hours)

**Goal:** Storefront shows correct final prices

**Tasks:**
1. ✅ Update existing product fetch to include pricing metadata
   - Product detail should have `metadata.markup_percentage`
   - Fetch seller markup: GET /admin/custom/sellers/:id/markup

2. ✅ Create pricing display logic
   - Use `pricing-calculator.ts`
   - Show: "€21.28" (prominent)
   - Optionally show: "Base price €18.50 + 15% markup"

3. ✅ Update `/marketplace/products/[id]/page.tsx`
   - Calculate final price
   - Display pricing breakdown (optional, can be tooltip)

4. ✅ Update `/marketplace/page.tsx` (product grid)
   - Show final prices on cards
   - Ensure consistency

5. ✅ Update cart/checkout to use final prices
   - Verify prices are calculated server-side (backend responsibility)
   - Frontend displays what backend sends

**Testing:**
- Product detail shows correct final price
- Product grid shows correct prices
- Different markup scenarios work
- Cart totals are correct

**Deliverable:** Storefront displays accurate pricing

---

## Component Breakdown

### 1. `ProductProposalForm.tsx`

**Purpose:** Form for suppliers to propose new products

**Props:**
```typescript
interface ProductProposalFormProps {
  initialData?: Partial<ProductProposal>;
  onSuccess?: (product: Product) => void;
}
```

**State:**
- Form fields: title, description, base_price, units_per_pack, category_id
- Variants array (optional)
- isSubmitting, errors

**Logic:**
- Validation: base_price > 0.01, title required
- Submit → POST /vendor/custom/products
- On success → callback or redirect

**UI:**
- shadcn/ui: Input, Textarea, Select, Button
- Currency input for base_price (format: €)
- Optional: VariantBuilder section

---

### 2. `ProductsList.tsx`

**Purpose:** Display supplier's products with status

**Props:**
```typescript
interface ProductsListProps {
  supplierId: string;
}
```

**State:**
- products: Product[]
- isLoading
- filters: status, search
- pagination

**Logic:**
- Fetch GET /vendor/custom/products on mount
- Client-side filtering by status
- Search by title
- Click row → navigate to detail

**UI:**
- Tabs for status filter (All | Pending | Approved | Rejected)
- Table with columns: Image, Title, Base Price, Status, Date, Actions
- Search input
- "New Product" button

---

### 3. `ProductStatusBadge.tsx`

**Purpose:** Visual indicator for approval status

**Props:**
```typescript
interface ProductStatusBadgeProps {
  status: 'pending_approval' | 'approved' | 'rejected';
}
```

**UI:**
- Badge component from shadcn/ui
- Colors: yellow (pending), green (approved), red (rejected)
- Icons: Clock, CheckCircle2, XCircle

---

### 4. `PricingQueue.tsx`

**Purpose:** Admin view of pending products

**Props:**
```typescript
interface PricingQueueProps {
  // No props - internal state
}
```

**State:**
- pendingProducts: Product[]
- isLoading
- filters: supplier_id
- selectedProduct: Product | null

**Logic:**
- Fetch GET /admin/custom/products/pending
- Filter by supplier
- Click "Review" → open ProductReviewPanel
- Refresh after approve/reject

**UI:**
- Stats cards: X pending, Y approved today
- Table: Supplier, Product, Base Price, Proposed Date, Actions
- Supplier filter dropdown
- Review button → modal

---

### 5. `ProductReviewPanel.tsx`

**Purpose:** Admin reviews and approves/rejects

**Props:**
```typescript
interface ProductReviewPanelProps {
  product: Product;
  onApprove: () => void;
  onReject: () => void;
}
```

**State:**
- markupPercentage: number
- rejectionReason: string
- showApproveDialog, showRejectDialog
- isSubmitting

**Logic:**
- Approve: validate markup 0-500 → PATCH with status=approved
- Reject: validate reason required → PATCH with status=rejected
- Success → callback to refresh queue

**UI:**
- Product details card
- PriceCalculator
- Two action buttons
- AlertDialog for confirm
- Toast notifications

---

### 6. `PriceCalculator.tsx`

**Purpose:** Live markup calculation

**Props:**
```typescript
interface PriceCalculatorProps {
  basePrice: number;
  markup: number;
  onMarkupChange: (markup: number) => void;
}
```

**State:**
- Internal markup value

**Logic:**
- finalPrice = basePrice × (1 + markup / 100)
- Format currency: €XX.XX

**UI:**
- Base price display (readonly)
- Markup input/slider (0-500)
- Final price display (calculated, prominent)
- Formula explanation

---

### 7. `SellerMarkupManager.tsx`

**Purpose:** Manage global seller markups

**Props:**
```typescript
interface SellerMarkupManagerProps {
  // No props - fetches sellers internally
}
```

**State:**
- sellers: Seller[]
- isLoading
- editingSeller: Seller | null
- newMarkup: number

**Logic:**
- Fetch sellers with GET /admin/custom/sellers (needs new endpoint or use existing)
- Edit → open dialog
- Save → PATCH /admin/custom/sellers/:id/markup

**UI:**
- Table: Supplier Name, Email, Global Markup %, Products Count, Edit
- Dialog with number input
- Validation: 0-500

---

## API Integration

### Environment Variable

Add to `.env.local`:
```bash
NEXT_PUBLIC_MOCK_PRICING=true  # Set to false when backend ready
```

### API Client Structure

```typescript
// src/lib/api/products-pricing-client.ts

const isMockMode = process.env.NEXT_PUBLIC_MOCK_PRICING === 'true';

export const pricingApi = {
  // Supplier endpoints
  async proposeProduct(data: ProposeProductRequest): Promise<ApiResponse<Product>> {
    if (isMockMode) {
      return mockProposeProduct(data);
    }
    const response = await apiClient.post('/vendor/custom/products', data, {
      headers: { 'x-seller-id': data.sellerId }
    });
    return response.data;
  },

  async getMyProducts(sellerId: string): Promise<ApiResponse<Product[]>> {
    if (isMockMode) {
      return mockGetMyProducts(sellerId);
    }
    const response = await apiClient.get('/vendor/custom/products', {
      headers: { 'x-seller-id': sellerId }
    });
    return response.data;
  },

  // Admin endpoints
  async getPendingProducts(filters?: PendingFilters): Promise<ApiResponse<Product[]>> {
    if (isMockMode) {
      return mockGetPendingProducts(filters);
    }
    const response = await apiClient.get('/admin/custom/products/pending', {
      params: filters
    });
    return response.data;
  },

  async approveProduct(productId: string, markup: number): Promise<ApiResponse<Product>> {
    if (isMockMode) {
      return mockApproveProduct(productId, markup);
    }
    const response = await apiClient.patch(
      `/admin/custom/products/${productId}/pricing-approval`,
      { status: 'approved', markup_percentage: markup }
    );
    return response.data;
  },

  async rejectProduct(productId: string, reason: string): Promise<ApiResponse<Product>> {
    if (isMockMode) {
      return mockRejectProduct(productId, reason);
    }
    const response = await apiClient.patch(
      `/admin/custom/products/${productId}/pricing-approval`,
      { status: 'rejected', rejection_reason: reason }
    );
    return response.data;
  },

  async getSellerMarkup(sellerId: string): Promise<ApiResponse<SellerMarkup>> {
    if (isMockMode) {
      return mockGetSellerMarkup(sellerId);
    }
    const response = await apiClient.get(`/admin/custom/sellers/${sellerId}/markup`);
    return response.data;
  },

  async updateSellerMarkup(sellerId: string, markup: number): Promise<ApiResponse<SellerMarkup>> {
    if (isMockMode) {
      return mockUpdateSellerMarkup(sellerId, markup);
    }
    const response = await apiClient.patch(
      `/admin/custom/sellers/${sellerId}/markup`,
      { global_markup_percentage: markup }
    );
    return response.data;
  },
};
```

### Authentication

**Supplier calls need:**
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'x-seller-id': sellerId
}
```

**Admin calls need:**
```typescript
headers: {
  'Authorization': `Bearer ${token}`
}
```

Get from existing auth context/store.

---

## Testing Strategy

### Mock Data Requirements

Create in `products-pricing-mock.ts`:

```typescript
// 3 mock suppliers
const mockSuppliers = [
  { id: 'sel_001', name: 'Uniformes Corp', global_markup: 8 },
  { id: 'sel_002', name: 'Tech Supplies', global_markup: 12 },
  { id: 'sel_003', name: 'Food Distributor', global_markup: 5 },
];

// 10 mock products in different states
const mockProducts = [
  // 4 pending (awaiting approval)
  { id: 'prod_001', title: 'Polo Shirt', status: 'proposed', base_price: 18.50, seller_id: 'sel_001' },
  { id: 'prod_002', title: 'Laptop', status: 'proposed', base_price: 450.00, seller_id: 'sel_002' },
  
  // 4 approved (with markup)
  { id: 'prod_003', title: 'Coffee Beans', status: 'published', base_price: 12.00, markup: 15, seller_id: 'sel_003' },
  { id: 'prod_004', title: 'Mouse', status: 'published', base_price: 25.00, markup: null, seller_id: 'sel_002' }, // uses seller global
  
  // 2 rejected (with reasons)
  { id: 'prod_005', title: 'Expensive Item', status: 'rejected', base_price: 999.00, rejection_reason: 'Price exceeds agreement', seller_id: 'sel_001' },
];
```

### Manual Testing Checklist

**Supplier Flow:**
- [ ] Login as supplier
- [ ] Navigate to /supplier/products
- [ ] Click "New Product"
- [ ] Fill form with valid data
- [ ] Submit → see success toast
- [ ] Redirect to products list
- [ ] See new product with "Pending" badge
- [ ] Filter by status
- [ ] Search by title
- [ ] Click rejected product → see rejection reason

**Admin Flow:**
- [ ] Login as admin
- [ ] Navigate to /admin/products/pricing
- [ ] See pending products queue
- [ ] Filter by supplier
- [ ] Click "Review" on a product
- [ ] See product details
- [ ] Use price calculator
- [ ] Approve with 15% markup
- [ ] See success toast
- [ ] Product removed from pending
- [ ] Reject a product with reason
- [ ] Navigate to seller markup page
- [ ] Edit global markup for a seller
- [ ] Save successfully

**Storefront:**
- [ ] Navigate to marketplace
- [ ] See products with final prices (not base)
- [ ] Product with markup: €21.28
- [ ] Product without markup: uses seller global
- [ ] Add to cart → correct price
- [ ] Checkout → correct total

---

## Phasing & Priorities

### Priority 1 (Must Have - Week 1)

**Goal:** Suppliers can propose, admins can approve

- ✅ Types and API client (mock mode)
- ✅ Supplier: proposal form
- ✅ Supplier: products list
- ✅ Admin: pricing queue
- ✅ Admin: approve/reject workflow
- ✅ Basic storefront price display

**Deliverable:** End-to-end workflow functional in mock mode

---

### Priority 2 (Should Have - Week 2)

**Goal:** Polish and edge cases

- ✅ Seller markup management
- ✅ Product detail page with resubmit
- ✅ Variant builder
- ✅ Image upload
- ✅ Better filtering/search
- ✅ Pagination for large lists
- ✅ Backend integration (switch off mock mode)

**Deliverable:** Production-ready features

---

### Priority 3 (Nice to Have - Week 3+)

**Goal:** Enhanced UX

- ⭕ Bulk approve/reject
- ⭕ Email notifications (backend work)
- ⭕ Activity history/audit log
- ⭕ Advanced analytics (products by status, avg approval time)
- ⭕ Export to CSV
- ⭕ Product templates for common items

**Deliverable:** Power user features

---

## Quick Start Commands

```bash
# Create all type files
touch src/types/products-pricing.ts

# Create API files
touch src/lib/api/products-pricing-client.ts
touch src/lib/api/products-pricing-mock.ts
touch src/lib/utils/pricing-calculator.ts

# Create component files
mkdir -p src/components/supplier
touch src/components/supplier/ProductProposalForm.tsx
touch src/components/supplier/ProductsList.tsx
touch src/components/supplier/ProductStatusBadge.tsx
touch src/components/supplier/VariantBuilder.tsx

mkdir -p src/components/admin
touch src/components/admin/PricingQueue.tsx
touch src/components/admin/ProductReviewPanel.tsx
touch src/components/admin/PriceCalculator.tsx
touch src/components/admin/SellerMarkupManager.tsx

# Create page files
mkdir -p src/app/\(supplier\)/supplier/products/{new,\[id\]}
touch src/app/\(supplier\)/supplier/products/page.tsx
touch src/app/\(supplier\)/supplier/products/new/page.tsx
touch src/app/\(supplier\)/supplier/products/\[id\]/page.tsx

mkdir -p src/app/\(backoffice\)/admin/products/{pricing,suppliers}
touch src/app/\(backoffice\)/admin/products/pricing/page.tsx

# Add env variable
echo "NEXT_PUBLIC_MOCK_PRICING=true" >> .env.local
```

---

## Success Criteria

### Week 1 Complete When:
- [x] Supplier can propose a product in mock mode
- [x] Supplier can see list of products with status badges
- [x] Admin can see pending products queue
- [x] Admin can approve product with markup %
- [x] Admin can reject product with reason
- [x] Product prices calculate correctly
- [x] All components compile without errors
- [x] Basic navigation works

### Week 2 Complete When:
- [x] All Priority 2 features implemented
- [x] Connected to real backend (mock mode = false)
- [x] Error handling in place
- [x] Loading states for all async operations
- [x] Form validation working
- [x] Responsive on mobile
- [x] No console errors

### Production Ready When:
- [x] Tested with real backend on DEV
- [x] Edge cases handled (network errors, validation)
- [x] Accessibility tested
- [x] User acceptance testing passed
- [x] Documentation updated
- [x] Deployed to Vercel

---

## Notes & Considerations

### State Management
- **Option 1:** Use existing patterns (useState in components)
- **Option 2:** Create Zustand store like openings module
- **Recommendation:** Start simple with component state, refactor to Zustand if needed

### Real-Time Updates
- For now: manual refresh after approve/reject
- Future: WebSocket or polling for live queue updates

### Permissions
- Supplier routes: require 'supplier' role
- Admin routes: require 'admin' role
- Use existing RoleGate component

### Error Scenarios
- Product not found → 404 page
- Unauthorized → redirect to login
- Validation error → inline form errors
- Network error → toast notification with retry

### Price Formatting
- Always use 2 decimals: €18.50
- Thousand separator: €1,234.56
- Currency symbol before number
- Handle multiple currencies? (Currently EUR only)

---

## Reference Documentation

- **Backend Manual:** `docs/technical/providers/MANUAL_FRONTEND_PROPUESTA_PRODUCTOS_Y_TARIFICACION.md`
- **Postman Collection:** `docs/technical/providers/marketplace-b2b-carrefour.postman_collection 2.json`
- **Intro Notes:** `docs/technical/providers/intro.txt`

---

## Tomorrow Morning Checklist

Start with:
1. ☕ Review this guide
2. 📖 Re-read backend manual (5 min)
3. 🏗️ Run quick start commands to create files
4. ⚡ Start with Phase 1: Types & API client (easiest wins)
5. 🧪 Create mock data with 10 sample products
6. 🎨 Build ProductProposalForm (most important component)
7. ✅ Test form submission in mock mode
8. 🚀 Keep momentum, one phase at a time

**Expected Day 1 Progress:** Phases 1-3 complete (Foundation + Supplier proposal + Products list)

Good luck! 🎯
