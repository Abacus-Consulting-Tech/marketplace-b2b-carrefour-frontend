# Frontend Roadmap - Marketplace B2B Carrefour (4 Weeks)

**Project:** Marketplace B2B Carrefour Frontend  
**Duration:** 4 weeks (Sprint 0 - Sprint 3)  
**Tech Stack:** Next.js 14 + TypeScript + Shadcn/ui + Tailwind CSS + React Query + Zustand  
**Team:** 1 Senior Frontend Developer  
**Status:** Week 1 COMPLETE ✅

---

## 📊 Overview

| Week | Focus | Status | Effort |
|------|-------|--------|--------|
| **Week 1** | Foundation & Setup | ✅ Complete | 4 days |
| **Week 2** | Sellers & Catalog | 🚧 In Progress (60%) | 5 days |
| **Week 3** | Purchase & Payment | ⏳ Pending | 5 days |
| **Week 4** | Stabilization & Polish | ⏳ Pending | 4 days |

**Total Frontend Effort:** 18 days

---

## ✅ Week 1: Foundation MercurJS (COMPLETED)

### Objectives
- ✅ Setup Next.js + TypeScript project
- ✅ Configure Tailwind CSS + Shadcn/ui
- ✅ Establish base architecture and routing
- ✅ Implement state management (Zustand + React Query)
- ✅ Create API client with authentication
- ✅ Setup development environment

### Deliverables Completed

#### 1. Project Configuration
- [x] Next.js 14.2.5 with App Router
- [x] TypeScript 5.5.3 strict mode
- [x] Tailwind CSS 3.4.6 + tailwindcss-animate
- [x] Shadcn/ui components configuration
- [x] ESLint + Prettier + Husky (optional)
- [x] CI/CD pipeline scripts (package.json)

#### 2. Base Structure
- [x] `src/app/layout.tsx` - Root layout with Inter font
- [x] `src/app/page.tsx` - Landing page
- [x] `src/styles/globals.css` - Theme variables (light/dark)
- [x] `src/components/ui/` - Shadcn components (button, input, card, dialog, table, form, label)

#### 3. State Management
- [x] `src/lib/store/auth.ts` - Authentication store (Zustand)
- [x] `src/lib/store/cart.ts` - Shopping cart store (Zustand)
- [x] React Query setup for server state

#### 4. API Integration
- [x] `src/lib/api/client.ts` - Axios client with JWT interceptors
- [x] `src/types/index.ts` - TypeScript interfaces (User, Product, Order, CartItem, etc.)
- [x] Environment variables configuration (.env.local)

#### 5. Utilities
- [x] `src/lib/utils.ts` - cn() utility for className merging
- [x] Error boundary setup (Next.js error.tsx)

#### 6. Development Tools
- [x] npm scripts (dev, dev:open, build, start, test, lint)
- [x] Browser auto-open functionality
- [x] Hot reload working

### Week 1 Milestone ✅
**Deployable project in DEV with authentication base and stable technical foundation**

---

## 🚧 Week 2: Sellers & Catalog (CURRENT SPRINT)

### Objectives
- Implement supplier management screens (backoffice)
- Build catalog display and search functionality
- Create franchisee onboarding flow
- Develop product detail views

### Tasks Breakdown

#### 2.1 Authentication & Authorization (2 days) ✅ 90% Complete

**Pages to Create:**
- [x] `src/app/(auth)/login/page.tsx` - Login page with JWT + mock mode
- [x] `src/app/(auth)/register/page.tsx` - Franchisee/supplier registration
- [x] `src/app/(auth)/forgot-password/page.tsx` - Password recovery
- [x] `src/app/(auth)/layout.tsx` - Auth layout (centered, gradient background)

**Components:**
- [x] `src/components/auth/ProtectedRoute.tsx` - Route guard HOC with role-based redirect
- [x] `src/components/auth/RoleGate.tsx` - Role-based conditional rendering
- [x] Forms built inline with React Hook Form patterns
- [x] `src/components/navigation/Header.tsx` - Main navigation with cart, user menu

**State & API:**
- [x] `src/lib/api/mock.ts` - Mock API with 3 test users + 4 products
- [x] `src/lib/store/auth.ts` - Already has role-based state management
- [x] Mock mode enabled via `NEXT_PUBLIC_MOCK_AUTH=true`
- [ ] `src/hooks/useAuth.ts` - Custom auth hook (optional refinement)

**Validation:**
- [x] Email and password validation (inline)
- [x] Password confirmation matching
- [x] Minimum password length (8 chars)
- [ ] Zod schemas (can be extracted later)
- [ ] Tax ID (CIF) validation for Spain (deferred)

#### 2.2 Franchisee Onboarding (1 day)

**Pages:**
- [ ] `src/app/(onboarding)/welcome/page.tsx` - Welcome screen
- [ ] `src/app/(onboarding)/company/page.tsx` - Company details (CIF, name, address)
- [ ] `src/app/(onboarding)/stores/page.tsx` - Add stores/locations
- [ ] `src/app/(onboarding)/users/page.tsx` - Add team members
- [ ] `src/app/(onboarding)/payment/page.tsx` - Annual subscription payment
- [ ] `src/app/(onboarding)/complete/page.tsx` - Confirmation & activation

**Components:**
- [ ] `src/components/onboarding/StepIndicator.tsx` - Progress stepper
- [ ] `src/components/onboarding/CompanyForm.tsx` - Company data form
- [ ] `src/components/onboarding/StoreForm.tsx` - Store location form
- [ ] `src/components/onboarding/UserInviteForm.tsx` - Invite team members

**State:**
- [ ] `src/lib/store/onboarding.ts` - Zustand store for multi-step form state
- [ ] `src/lib/api/onboarding.ts` - On ✅ 70% Complete

**Pages:**
- [x] `src/app/(marketplace)/marketplace/page.tsx` - Catalog listing with search
- [x] `src/app/(marketplace)/marketplace/products/[id]/page.tsx` - Product detail page
- [x] `src/app/(marketplace)/layout.tsx` - Marketplace layout with ProtectedRoute
- [ ] `src/app/(marketplace)/marketplace/categories/[slug]/page.tsx` - Category view (optional)

**Components:**
- [x] ProductCard component (built inline in marketplace page)
- [x] Product grid with responsive layout (grid-cols-1 md:2 lg:3 xl:4)
- [x] Search bar with icon (inline)
- [x] Product detail with image gallery
- [x] Add to cart button with quantity selector (+/- controls)
- [x] Loading skeletons for all async states
- [x] Empty states for no products
- [ ] Separate reusable components (can refactor later)
- [ ] ProductFilters component with advanced filtering

**State & API:**
- [x] Mock products API with 4 sample products (Aceite, Jamón, Vino, Queso)
- [x] Product fetching with mock mode support
- [x] Cart store integration (add to cart working)
- [x] Toast notifications for cart actions
- [ ] `src/hooks/useProducts.ts` - React Query hooks (can add later)
- [ ] `src/hooks/useSearch.ts` - Debounced search (basic search works)

**Features:**
- [x] Basic text search (filter by name/description)
- [x] Product images with fallback
- [x] Supplier badge display
- [x] Stock indicator
- [x] Price formatting (EUR)
- [ ] Pagination with React Query
- [ ] Advanced filters (category, supplier, price range)
- [ ] Sort options
- [ ] Filter by: category, supplier, price range, availability
- [ ] Sort by: name, price, newest, popular
- [ ] Favorites/wishlist functionality

#### 2.4 Supplier Management (Backoffice) (0.5 days)

**Pages:**
- [ ] `src/app/(backoffice)/admin/suppliers/page.tsx` - Supplier list
- [ ] `src/app/(backoffice)/admin/suppliers/[id]/page.tsx` - Supplier detail
- [ ] `src/app/(backoffice)/admin/suppliers/new/page.tsx` - Create supplier
- [ ] `src/app/(backoffice)/admin/suppliers/[id]/approval/page.tsx` - Approval workflow

**Cx] Working authentication (login/register/logout) ✅
- [x] Mock authentication system for testing ✅
- [x] Route protection with role-based access ✅
- [x] Catalog navigation with basic search ✅
- [x] Product detail page with add to cart ✅
- [x] Responsive header with cart badge ✅
- [x] Layouts for all sections (marketplace, backoffice, supplier, onboarding) ✅
- [ ] Franchisee can complete onboarding flow (not started)
- [ ] Advanced filters and sorting (deferred)
- [ ] Admin can view and approve suppliers (not started)
- [x] Responsive design (mobile, tablet, desktop) ✅ (basic
**State & API:**
- [ ] `src/lib/api/suppliers.ts` - Supplier endpoints
- [ ] `src/hooks/useSuppliers.ts` - React Query hooks

### Week 2 Deliverables

- [ ] Working authentication (login/register/logout)
- [ ] Franchisee can complete onboarding flow
- [ ] Catalog navigation with search and filters
- [ ] Product detail page with add to cart
- [ ] Admin can view and approve suppliers
- [ ] Responsive design (mobile, tablet, desktop)

### Week 2 Milestone
**Supplier and catalog operational in test environment. Franchisee can browse products.**

---

## ⏳ Week 3: Purchase & Payment (SPRINT 2)

### Objectives
- Build multi-vendor shopping cart
- Implement checkout flow with Stripe
- Create order management views for franchisees and suppliers
- Handle order states and tracking

### Tasks Breakdown

#### 3.1 Shopping Cart (1 day)

**Pages:**
- [ ] `src/app/(marketplace)/cart/page.tsx` - Cart view

**Components:**
- [ ] `src/components/cart/CartDrawer.tsx` - Sliding cart drawer
- [ ] `src/components/cart/CartItem.tsx` - Item with quantity controls
- [ ] `src/components/cart/CartSummary.tsx` - Subtotal, shipping, tax, total
- [ ] `src/components/cart/CartEmpty.tsx` - Empty state
- [ ] `src/components/cart/MultiVendorWarning.tsx` - Show split by supplier

**State:**
- [ ] Update `src/lib/store/cart.ts` - Add validation, MOQ checks, supplier grouping
- [ ] `src/hooks/useCart.ts` - Cart operations hook

**Features:**
- [ ] Group items by supplier
- [ ] Calculate shipping per supplier
- [ ] Apply MOQ (Minimum Order Quantity) validation
- [ ] Update quantity with +/- controls
- [ ] Remove items
- [ ] Calculate tax (IVA) per item
- [ ] Persist cart to localStorage
- [ ] Sync cart with backend on login

#### 3.2 Checkout Flow (2 days)

**Pages:**
- [ ] `src/app/(marketplace)/checkout/page.tsx` - Checkout landing
- [ ] `src/app/(marketplace)/checkout/address/page.tsx` - Delivery address
- [ ] `src/app/(marketplace)/checkout/review/page.tsx` - Order review
- [ ] `src/app/(marketplace)/checkout/payment/page.tsx` - Payment with Stripe
- [ ] `src/app/(marketplace)/checkout/success/page.tsx` - Order confirmation
- [ ] `src/app/(marketplace)/checkout/failed/page.tsx` - Payment failed

**Components:**
- [ ] `src/components/checkout/CheckoutStepper.tsx` - Step indicator
- [ ] `src/components/checkout/AddressForm.tsx` - Delivery address form
- [ ] `src/components/checkout/OrderReview.tsx` - Final review before payment
- [ ] `src/components/checkout/PaymentForm.tsx` - Stripe Elements integration
- [ ] `src/components/checkout/OrderSummaryCard.tsx` - Summary sidebar
- [ ] `src/components/checkout/TermsCheckbox.tsx` - T&C acceptance

**State & API:**
- [ ] `src/lib/store/checkout.ts` - Checkout state (address, payment method)
- [ ] `src/lib/api/checkout.ts` - Create order, payment intent
- [ ] `src/lib/stripe.ts` - Stripe client setup
- [ ] `src/hooks/useCheckout.ts` - Checkout flow hook

**Stripe Integration:**
- [ ] Install `@stripe/stripe-js` and `@stripe/react-stripe-js`
- [ ] Create PaymentIntent on checkout
- [ ] Handle 3DS/SCA authentication
- [ ] Webhook confirmation (backend handles, frontend polls status)
- [ ] Error handling (card declined, network errors)

#### 3.3 Order Management (1.5 days)

**Pages:**
- [ ] `src/app/(marketplace)/orders/page.tsx` - Order list for franchisee
- [ ] `src/app/(marketplace)/orders/[id]/page.tsx` - Order detail
- [ ] `src/app/(supplier)/orders/page.tsx` - Orders for supplier (their items only)
- [ ] `src/app/(supplier)/orders/[id]/page.tsx` - Supplier order detail

**Components:**
- [ ] `src/components/orders/OrderTable.tsx` - Filterable order table
- [ ] `src/components/orders/OrderCard.tsx` - Order summary card
- [ ] `src/components/orders/OrderTimeline.tsx` - Order status timeline
- [ ] `src/components/orders/OrderItems.tsx` - Items in order
- [ ] `src/components/orders/OrderStatus.tsx` - Status badge with colors
- [ ] `src/components/orders/TrackingInfo.tsx` - Shipping tracking
- [ ] `src/components/orders/CancelOrderDialog.tsx` - Cancel order confirmation

**State & API:**
- [ ] `src/lib/api/orders.ts` - Order endpoints (list, get, cancel)
- [ ] `src/hooks/useOrders.ts` - React Query hooks with real-time updates

**Features:**
- [ ] Filter orders by: status, date range, supplier, store
- [ ] Real-time status updates (polling or WebSocket)
- [ ] Download invoice/receipt
- [ ] Cancel order (if allowed)
- [ ] Track shipment
- [ ] View split sub-orders by supplier

#### 3.4 Supplier Portal - Orders (0.5 days)

**Components:**
- [ ] `src/components/supplier/OrderAcceptance.tsx` - Accept/reject order
- [ ] `src/components/supplier/FulfillmentForm.tsx` - Mark as shipped
- [ ] `src/components/supplier/TrackingForm.tsx` - Add tracking number

**Features:**
- [ ] Supplier sees only their items from split orders
- [ ] Accept/reject order within timeframe
- [ ] Mark order as "preparing"
- [ ] Mark order as "shipped" with tracking
- [ ] Mark order as "delivered"
- [ ] Upload proof of delivery

### Week 3 Deliverables

- [ ] Functional multi-vendor cart
- [ ] Complete checkout flow with Stripe
- [ ] Order confirmation and success page
- [ ] Franchisee order history
- [ ] Supplier order management
- [ ] Order status tracking
- [ ] Payment error handling

### Week 3 Milestone
**Complete purchase operational: catalog → cart → payment → order split**

---

## ⏳ Week 4: Stabilization & Polish (SPRINT 3)

### Objectives
- Fix bugs and refine UX
- Implement incident management
- Add basic reporting dashboards
- Responsive design refinement
- Performance optimization
- Prepare for pilot

### Tasks Breakdown

#### 4.1 Incident Management (1 day)

**Pages:**
- [ ] `src/app/(marketplace)/incidents/page.tsx` - Incident list
- [ ] `src/app/(marketplace)/incidents/[id]/page.tsx` - Incident detail
- [ ] `src/app/(marketplace)/incidents/new/page.tsx` - Create incident

**Components:**
- [ ] `src/components/incidents/IncidentForm.tsx` - Report incident
- [ ] `src/components/incidents/IncidentCard.tsx` - Incident summary
- [ ] `src/components/incidents/IncidentTimeline.tsx` - Resolution timeline
- [ ] `src/components/incidents/UploadEvidence.tsx` - File upload for evidence
- [ ] `src/components/incidents/IncidentStatus.tsx` - Status badge

**Features:**
- [ ] Link incident to order/item
- [ ] Upload evidence (photos, documents)
- [ ] Track resolution status
- [ ] Add comments/notes
- [ ] Request refund/compensation

#### 4.2 User Profile & Settings (0.5 days)

**Pages:**
- [ ] `src/app/(marketplace)/profile/page.tsx` - User profile
- [ ] `src/app/(marketplace)/settings/page.tsx` - Account settings
- [ ] `src/app/(marketplace)/settings/notifications/page.tsx` - Notification preferences

**Components:**
- [ ] `src/components/profile/ProfileForm.tsx` - Edit user data
- [ ] `src/components/profile/PasswordForm.tsx` - Change password
- [ ] `src/components/profile/NotificationSettings.tsx` - Notification toggles
- [ ] `src/components/profile/PaymentMethods.tsx` - Saved cards

#### 4.3 Dashboards & Reporting (1 day)

**Pages:**
- [ ] `src/app/(backoffice)/admin/dashboard/page.tsx` - Admin dashboard
- [ ] `src/app/(supplier)/dashboard/page.tsx` - Supplier dashboard
- [ ] `src/app/(marketplace)/dashboard/page.tsx` - Franchisee dashboard

**Components:**
- [ ] `src/components/dashboard/StatCard.tsx` - KPI card (revenue, orders, etc.)
- [ ] `src/components/dashboard/RevenueChart.tsx` - Chart.js/Recharts revenue chart
- [ ] `src/components/dashboard/OrdersChart.tsx` - Orders over time
- [ ] `src/components/dashboard/TopProducts.tsx` - Best sellers
- [ ] `src/components/dashboard/RecentOrders.tsx` - Latest orders widget
- [ ] `src/components/dashboard/QuickActions.tsx` - Quick action buttons

**Features:**
- [ ] KPIs: Total orders, revenue, active suppliers, pending approvals
- [ ] Charts for trends (orders, revenue by month)
- [ ] Export data to CSV/Excel
- [ ] Date range selector

#### 4.4 UX/UI Refinement (1 day)

**Tasks:**
- [ ] Responsive design audit (mobile, tablet, desktop)
- [ ] Loading states for all async operations
- [ ] Error boundaries for graceful failures
- [ ] Empty states for all lists
- [ ] Skeleton loaders (React Suspense)
- [ ] Toast notifications for actions (success, error, info)
- [ ] Confirm dialogs for destructive actions
- [ ] Keyboard navigation (a11y)
- [ ] Focus management in modals
- [ ] ARIA labels and roles

**Components to Create:**
- [ ] `src/components/ui/Loading.tsx` - Loading spinner
- [ ] `src/components/ui/EmptyState.tsx` - Empty state component
- [ ] `src/components/ui/Toast.tsx` - Toast notification (or use Shadcn toast)
- [ ] `src/components/ui/ConfirmDialog.tsx` - Confirmation dialog
- [ ] `src/components/ui/ErrorBoundary.tsx` - Error boundary wrapper

#### 4.5 Performance Optimization (0.5 days)

**Tasks:**
- [ ] Code splitting with dynamic imports
- [ ] Image optimization (Next.js Image component)
- [ ] Lazy load components not in viewport
- [ ] Optimize bundle size (analyze with `@next/bundle-analyzer`)
- [ ] Implement React.memo for heavy components
- [ ] Debounce search inputs
- [ ] Throttle scroll events
- [ ] Use React Query caching effectively
- [ ] Optimize re-renders (React DevTools Profiler)

#### 4.6 Testing & QA (1 day)

**Tasks:**
- [ ] Write unit tests for critical utils
- [ ] Write integration tests for auth flows
- [ ] Write E2E tests for checkout (Playwright)
- [ ] Test responsive design on real devices
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Accessibility audit (WAVE, Lighthouse)
- [ ] Performance audit (Lighthouse)
- [ ] Security headers check

**Test Files:**
- [ ] `src/__tests__/utils.test.ts`
- [ ] `src/__tests__/auth.test.tsx`
- [ ] `src/__tests__/cart.test.tsx`
- [ ] `tests/e2e/checkout.spec.ts`

### Week 4 Deliverables

- [ ] Incident management working
- [ ] User profiles and settings ✅
- ✅ Button
- ✅ Input
- ✅ Card
- ✅ Dialog
- ✅ Table
- ✅ Form
- ✅ Label
- ✅ Badge (Week 2)
- ✅ Select (Week 2)
- ✅ Checkbox (Week 2)
- ✅ Radio Group (Week 2)
- ✅ Tabs (Week 2)
- ✅ Avatar (Week 2)
- ✅ Toast + Toaster (Week 2)
- ✅ Alert (Week 2)
- ✅ Skeleton (Week 2)
- ✅ Progress (Week 2)

### Additional Shadcn Components Needed (Week 3+)
- [ ] Popover - For filters
- [ ] Command - For advanced search
- [ ] Calendar - For date pickers
- [ ] Dropdown Menu - For action menu
### Additional Shadcn Components Needed
- [ ] Badge - For status indicators
- [ ] Select - For dropdowns
- [ ] Checkbox - For filters and forms
- [ ] Radio Group - For payment methods
- [ ] Tabs - For product details
- [ ] Avatar - For user profiles
- [ ] Toast - For notifications
- [ ] Alert - For warnings/errors
- [ ] Skeleton - For loading states
- [ ] Progress - For multi-step forms
- [ ] Popover - For filters
- [ ] Command - For search
- [ ] Calendar - For date pickers
- [ ] Dropdown Menu - For actions
- [ ] Sheet - For mobile drawer

**Install Command:**
```bash
npx shadcn@latest add badge select checkbox radio-group tabs avatar toast alert skeleton progress popover command calendar dropdown-menu sheet
```

---

## 🎨 Design System Checklist

### Colors
- [ ] Primary: Carrefour blue (#0052A3)
- [ ] Secondary: Carrefour red (#E42F1B)
- [ ] Success: Green (#10B981)
- [ ] Warning: Yellow (#F59E0B)
- [ ] Error: Red (#EF4444)
- [ ] Neutral grays

### Typography
- [x] Font: Inter (installed)
- [ ] Headings: H1-H6 classes
- [ ] Body text sizes: sm, base, lg
- [ ] Font weights: normal, medium, semibold, bold

### Spacing
- [x] Tailwind spacing scale
- [ ] Consistent padding/margins
- [ ] Gap utilities for flex/grid

### Breakpoints
- [x] sm: 640px
- [x] md: 768px
- [x] lg: 1024px
- [x] xl: 1280px
- [x] 2xl: 1536px

---

## 🔗 API Integration Points

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Users
- `GET /api/users/me`
- `PUT /api/users/me`
- `POST /api/users/invite`
- `GET /api/users/:id`

### Onboarding
- `POST /api/onboarding/company`
- `POST /api/onboarding/stores`
- `POST /api/onboarding/users`
- `POST /api/onboarding/payment`

### Products
- `GET /api/products` (with filters, search, pagination)
- `GET /api/products/:id`
- `GET /api/products/categories`
- `GET /api/products/search?q=`

### Cart
- `POST /api/cart/add`
- `PUT /api/cart/update/:itemId`
- `DELETE /api/cart/remove/:itemId`
- `GET /api/cart`
- `POST /api/cart/validate`

### Orders
- `POST /api/orders` (create)
- `GET /api/orders`
- `GET /api/orders/:id`
- `PUT /api/orders/:id/cancel`
- `GET /api/orders/:id/invoice`

### Suppliers
- `GET /api/suppliers`
- `GET /api/suppliers/:id`
- `POST /api/suppliers`
- `PUT /api/suppliers/:id/approve`
- `PUT /api/suppliers/:id/reject`

### Checkout
- `POST /api/checkou ✅
- next: 14.2.5
- react: 18.3.1
- react-dom: 18.3.1
- typescript: 5.5.3

### State Management (Installed) ✅
- zustand: 4.5.4
- @tanstack/react-query: 5.51.1

### UI (Installed) ✅
- tailwindcss: 3.4.6
- tailwindcss-animate: 1.0.7
- lucide-react: 0.414.0 ✅ (Week 2)
- class-variance-authority: 0.7.0
- clsx: 2.1.1
- tailwind-merge: 2.4.0

### Radix UI (Installed) ✅ (Week 2)
- @radix-ui/react-label
- @radix-ui/react-slot
- @radix-ui/react-dialog
- @radix-ui/react-select
- @radix-ui/react-checkbox
- @radix-ui/react-radio-group
- @radix-ui/react-tabs
- @radix-ui/react-avatar
- @radix-ui/react-toast
- @radix-ui/react-progress

### Forms (Installed) ✅
- react-hook-form: 7.52.1
- zod: 3.23.8
- @hookform/resolvers: 3.9.0

### HTTP (Installed) ✅
- axios: 1.7.2

### Tables (Installed) ✅
- tailwindcss-animate: 1.0.7
- lucide-react: 0.408.0
- class-variance-authority: 0.7.0
- clsx: 2.1.1
- tailwind-merge: 2.4.0

### Forms (Installed)
- react-hook-form: 7.52.1
- zod: 3.23.8
- @hookform/resolvers: 3.9.0

### HTTP (Installed)
- axios: 1.7.2

### Tables (Installed)
- @tanstack/react-table: 8.19.3

### Additional Dependencies Needed
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install recharts # For charts
npm install date-fns # For date formatting
npm install react-hot-toast # Alternative to Shadcn toast
npm install @tanstack/react-query-devtools --save-dev
```

---

## 🚀 Deployment Checklist

### Environment Variables
- [ ] `NEXT_PUBLIC_API_URL`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `NEXT_PUBLIC_ENVIRONMENT` (dev/pre/pro)

### Build Optimization
- [ ] Enable TypeScript strict mode
- [ ] Enable ESLint checks
- [ ] Run `npm run build` successfully
- [ ] Check bundle size (`npm run analyze`)
- [ ] Optimize images (WebP format)
- [ ] Enable Next.js Image optimization

### Security
- [ ] HTTPS only
- [ ] Secure headers (CSP, HSTS)
- [ ] No hardcoded secrets
- [ ] XSS prevention
- [ ] CSRF tokens for mutations
- [ ] Rate limiting on API calls

---

## 📊 Success Metrics

### Week 2
- [ ] Auth flows: 100% functional
- [ ] Catalog: 50+ products visible
- [ ] Search: <200ms response time
- [ ] Mobile responsive: 100%

### ✅ Week 2 Progress Summary (60% Complete)

**Completed:**
1. ✅ Installed 12 additional Shadcn components
2. ✅ Installed Radix UI peer dependencies
3. ✅ Installed lucide-react for icons
4. ✅ Created route groups: `(auth)`, `(marketplace)`, `(backoffice)`, `(supplier)`, `(onboarding)`
5. ✅ Built authentication pages (login, register, forgot-password)
6. ✅ Created auth layout with gradient design
7. ✅ Implemented ProtectedRoute and RoleGate components
8. ✅ Created Header with navigation, cart badge, user menu
9. ✅ Created layouts for all sections
10. ✅ Built marketplace catalog page with search
11. ✅ Built product detail page with add to cart
12. ✅ Created mock authentication system (3 test users)
13. ✅ Added 4 sample products with images
14. ✅ Fixed toaster import path bug

**Test Credentials Available:**
- Admin: `admin@carrefour.com` / `admin123`
- Franchisee: `franchisee@test.com` / `franchisee123`
- Supplier: `supplier@test.com` / `supplier123`

### Next Steps (Week 2 Remaining ~40%)
1. **Franchisee Onboarding Flow** (1 day) - Multi-step wizard
2. **Supplier Management (Backoffice)** (0.5 days) - Admin CRUD for suppliers
3. **Refine Catalog** - Extract components, add advanced filters
4. **Optional:** Category pages, favorites/wishlist

### Commands for Week 3
```bash- [ ] Zero P1 bugs

---

## 🎯 Next Actions

### Immediate (Week 2 Start)
1. **Install additional Shadcn components** needed for Week 2
2. **Create route groups**: `(auth)`, `(marketplace)`, `(backoffice)`, `(supplier)`, `(onboarding)`
3. **Setup authentication pages** (login, register)
4. **Create base layouts** for each section
5. **Implement navigation** (header, sidebar, mobile menu)

### Commands to Run
```bash
# Install additional Shadcn components
npx shadcn@latest add badge select checkbox radio-group tabs avatar toast alert skeleton progress

# Install Stripe
npm install @stripe/stripe-js @stripe/react-stripe-js

# Install charts
npm install recharts

# Install date utilities
npm install date-fns

# Start development
npm run dev:open
```

---

## 📝 Notes

### Backend Dependencies
- Authentication API must be ready by Week 2 Day 1
- Product catalog API must be ready by Week 2 Day 3
- Stripe webhook must be configured by Week 3 Day 2
- Order management API must be ready by Week 3 Day 3

## 🎉 Week 2 Achievements

### What's Working Now:
- ✅ **Login/Register:** Full authentication flow with mock data
- ✅ **Product Catalog:** Browse 4 sample products with search
- ✅ **Product Detail:** View full product info, adjust quantity, add to cart
- ✅ **Cart Integration:** Shopping cart synced with localStorage
- ✅ **Role-Based Access:** Different views for admin/franchisee/supplier
- ✅ **Responsive Design:** Works on mobile, tablet, desktop
- ✅ **Toast Notifications:** User feedback for all actions
- ✅ **Mock Mode:** Test without backend at http://localhost:3001

### Files Created This Session:
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/layout.tsx`
- `src/app/(marketplace)/marketplace/page.tsx`
- `src/app/(marketplace)/marketplace/products/[id]/page.tsx`
- `src/app/(marketplace)/layout.tsx`
- `src/app/(backoffice)/layout.tsx`
- `src/app/(supplier)/layout.tsx`
- `src/app/(onboarding)/layout.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/auth/RoleGate.tsx`
- `src/components/navigation/Header.tsx`
- `src/lib/api/mock.ts`
- 12 new Shadcn UI components

---

**Last Updated:** 2026-08-05  
**Version:** 1.1 (SVG)
- Carrefour brand colors
- Product placeholder images
- User avatar placeholders
- Empty state illustrations
- Error state illustrations

### Documentation to Maintain
- Component Storybook (optional but recommended)
- API integration guide
- Deployment guide
- User manual (for pilot users)

---

## ✅ Definition of Done

A feature is considered complete when:
- [ ] Code is written and follows TypeScript/ESLint rules
- [ ] Component is responsive (mobile, tablet, desktop)
- [ ] Loading and error states are handled
- [ ] Form validation is implemented (where applicable)
- [ ] API integration is working
- [ ] Manual testing completed
- [ ] PR reviewed and merged
- [ ] Deployed to DEV environment
- [ ] No console errors or warnings

---

**Last Updated:** 2026-08-05  
**Version:** 1.0  
**Next Review:** End of Week 2
