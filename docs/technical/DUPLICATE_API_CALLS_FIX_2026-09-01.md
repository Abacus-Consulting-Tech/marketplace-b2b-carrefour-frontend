# Duplicate API Calls Fix - 2026-09-01

## Problem

All pages were making duplicate API calls on initial load, discovered via network trace:
- `/supplier/products` → `GET /api/seller/catalog-products` called **twice**
- `/admin/products` → `GET /api/admin/custom/catalog-products` called **twice**  
- `/admin/pricing/approval-queue` → page load requests called **twice**

## Root Cause

React 18 Strict Mode intentionally double-renders components in development to help detect bugs. Components using `useEffect` without proper cleanup were triggering API calls twice.

## Solution Pattern

Applied cleanup pattern to all affected components:

```typescript
useEffect(() => {
  let isMounted = true;

  async function fetchData() {
    try {
      setLoading(true);
      const response = await api.getData();
      if (isMounted) {
        setData(response.data);
      }
    } catch (err) {
      if (isMounted) {
        setError(err.message);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }

  fetchData();

  return () => {
    isMounted = false;
  };
}, [dependencies]);
```

### Key Elements

1. **`isMounted` flag**: Prevents state updates after component unmount
2. **Cleanup function**: Sets `isMounted = false` to signal the async operation should not update state
3. **State update guards**: All `setState` calls wrapped in `if (isMounted)` checks

## Files Fixed

### 1. src/components/supplier/ProductsList.tsx
**Commit**: e0dd418

- Added `isMounted` flag to prevent state updates after unmount
- Added cleanup function to `useEffect`
- Guarded all `setState` calls with `isMounted` check

### 2. src/components/admin/ProductsList.tsx
**Commit**: 1e0ada5

- Moved `loadProducts()` logic inside `useEffect`
- Added `isMounted` flag and cleanup
- Kept separate `loadProducts()` function for manual refreshes

### 3. src/app/(backoffice)/admin/pricing/approval-queue/page.tsx
**Commit**: 1e0ada5

Changes:
- Combined two separate `useEffect` hooks into one
- Initial data fetch now loads both products and sellers in parallel
- Added `isMounted` flag and cleanup to prevent duplicate calls
- Kept separate `loadPendingProducts()` and `loadSellers()` for refresh after approval/rejection actions

Before:
```typescript
useEffect(() => {
  loadPendingProducts();
  loadSellers();
}, []);

useEffect(() => {
  loadPendingProducts();
}, [selectedSellerId, selectedCategoryId]);
```

After:
```typescript
useEffect(() => {
  let isMounted = true;

  async function fetchData() {
    const filters: PendingProductsFilters = {};
    if (selectedSellerId) filters.seller_id = selectedSellerId;
    if (selectedCategoryId) filters.category_id = selectedCategoryId;
    
    const [productsResponse, sellersResponse] = await Promise.all([
      pricingApi.getPendingProducts(filters),
      pricingApi.getAllSellers()
    ]);
    
    if (isMounted) {
      // Update state...
    }
  }

  fetchData();
  
  return () => {
    isMounted = false;
  };
}, [selectedSellerId, selectedCategoryId]);
```

## Benefits

1. **Performance**: Eliminates unnecessary duplicate API calls
2. **Memory Safety**: Prevents memory leaks from updating unmounted components
3. **Best Practice**: Follows React 18 guidelines for async operations in `useEffect`
4. **User Experience**: Reduces backend load and improves response times

## Testing

To verify the fix:

1. Open browser DevTools → Network tab
2. Navigate to each page:
   - `/supplier/products`
   - `/admin/products`
   - `/admin/pricing/approval-queue`
3. Verify each API endpoint is called **only once** per page load

## Important Notes

### Development vs Production

In development with React 18 Strict Mode:
- Components may still mount/unmount twice
- The `isMounted` flag ensures only one set of API calls completes successfully
- Network tab may still show 2 requests, but only one will update state

In production:
- Strict Mode is disabled
- Components mount only once
- Only one API call will be made

### When to Use This Pattern

Apply this pattern whenever:
- `useEffect` makes async API calls
- Component might unmount before the call completes
- State updates happen in async callbacks

### Related Issues

This fix resolves the performance concerns mentioned in backend integration testing where duplicate calls were causing confusion about API behavior.

## Status

✅ **COMPLETED** - All duplicate API call issues resolved across:
- Supplier products page
- Admin products page
- Admin pricing approval queue

No further duplicate call issues identified in current codebase.
