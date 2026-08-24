# Franchisee Management Implementation - In Progress

**Status:** Implementation started - 2 of 6 tasks completed
**Aligned with:** Medusa Customer entity + B2B extensions

## ✅ Completed (2/6)

### 1. TypeScript Types (`src/types/franchisees.ts`)
- ✅ Franchisee interface (extends Medusa Customer)
- ✅ Address, CustomerGroup types
- ✅ FranchiseeMetadata with B2B fields
- ✅ Request/Response types for all operations
- ✅ Stats and Orders types
- ✅ Complete API contracts

### 2. Mock Data (`src/lib/api/franchisees-mock.ts`)
- ✅ 10 realistic franchisees with complete profiles
- ✅ Addresses (billing + shipping)
- ✅ Customer group assignment (B2B Franchisees)
- ✅ Metadata with all B2B fields
- ✅ Helper functions for filtering and stats
- ✅ Mock orders per franchisee

## ⏳ Remaining (4/6)

### 3. API Client (`src/lib/api/franchisees-client.ts`)
**Next task - estimated 1-2 hours**

Will include:
- Feature flag support (mock/real mode)
- List franchisees with filters
- Get franchisee details
- Create/Update/Delete operations
- Address management (add, update, delete)
- Get orders by franchisee
- Get franchisee statistics
- Bulk operations

Medusa endpoints to use:
- `GET /admin/customers`
- `POST /admin/customers`
- `POST /admin/customers/:id`
- `DELETE /admin/customers/:id`
- `GET /admin/customers/:id/addresses`
- `POST /admin/customers/:id/addresses`
- `GET /admin/orders?customer_id=:id`

### 4. UI Components
**Estimated 4-6 hours**

Need to create:
- `FranchiseesList.tsx` - Main list with filters and search
- `FranchiseeDetail.tsx` - Detailed view with tabs
- `FranchiseeForm.tsx` - Create/Edit form
- `FranchiseeStats.tsx` - Statistics dashboard
- `FranchiseeOrders.tsx` - Orders table
- `AddressManager.tsx` - Address CRUD
- `StatusBadge.tsx` - Status indicators

### 5. Admin Pages
**Estimated 2-3 hours**

Pages to create:
- `/admin/franchisees/page.tsx` - List page (replace placeholder)
- `/admin/franchisees/new/page.tsx` - Create form
- `/admin/franchisees/[id]/page.tsx` - Detail view
- `/admin/franchisees/[id]/edit/page.tsx` - Edit form

### 6. Integration & Polish
**Estimated 1-2 hours**

- Update feature flags config
- Add to dev-tools page
- Update documentation
- Test all CRUD operations
- Ensure responsive design

## 📊 Total Estimate

- **Completed**: ~3 hours (types + mock data)
- **Remaining**: ~8-13 hours
- **Total**: ~11-16 hours (approx 2 days of focused work)

## 🎯 Key Design Decisions

### Medusa Alignment
- Uses `Customer` entity as base
- Extends with `metadata` for B2B fields
- Uses `CustomerGroup` for "B2B Franchisees"
- Standard Medusa Address model
- Compatible with Medusa Admin API

### B2B Extensions (in metadata)
- `company_name`, `tax_id`, `store_code`
- `credit_limit`, `discount_tier`, `payment_terms`
- `is_active`, `approved_at`, `approved_by`
- Cached stats: `total_orders`, `total_spent`, `last_order_at`

### Feature Flags
- Mock mode: Uses in-memory mock data
- Real mode: Calls Medusa Admin API
- Instant toggle without code changes

## 📝 Next Steps

To complete this implementation, run:

1. **Create API client**
2. **Build UI components**  
3. **Update admin pages**
4. **Add to feature flags**
5. **Test everything**
6. **Update docs**

Would you like me to continue with step 3 (API Client)?
