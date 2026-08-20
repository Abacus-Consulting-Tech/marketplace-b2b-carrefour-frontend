# Product Proposal & Pricing System

**Status:** Backend ✅ Complete | Frontend ❌ Not Started  
**Priority:** High - Core marketplace functionality  
**Start Date:** Tomorrow (2026-08-21)

---

## 📚 Documentation Index

### 1. [**FRONTEND_BUILD_GUIDE.md**](./FRONTEND_BUILD_GUIDE.md) ⭐ START HERE
**Your complete implementation guide**
- What to build
- Step-by-step plan (8 phases)
- Component breakdown
- API integration
- Testing strategy
- Success criteria

**Perfect for:** Starting fresh tomorrow morning

---

### 2. [**MANUAL_FRONTEND_PROPUESTA_PRODUCTOS_Y_TARIFICACION.md**](./MANUAL_FRONTEND_PROPUESTA_PRODUCTOS_Y_TARIFICACION.md)
**Backend API reference**
- Complete endpoint documentation
- Request/response examples
- Pricing formula
- Authentication
- Error codes

**Perfect for:** API integration reference

---

### 3. [**marketplace-b2b-carrefour.postman_collection 2.json**](./marketplace-b2b-carrefour.postman_collection%202.json)
**Postman collection for testing**
- Folders 6 & 7: Product proposal flow
- Auto-save tokens and IDs
- Tested on LOCAL + DEV

**Perfect for:** Testing backend before frontend integration

---

### 4. [**intro.txt**](./intro.txt)
**Quick overview from stakeholder**
- Business context
- How the flow works
- What's already done

**Perfect for:** Understanding the "why"

---

## 🚀 Quick Start

```bash
# Tomorrow morning, run these commands:

# 1. Read the build guide
open docs/technical/providers/FRONTEND_BUILD_GUIDE.md

# 2. Create starter files (copy from build guide)
# See "Quick Start Commands" section

# 3. Start with Phase 1: Types & API client
# Goal: 2 hours to complete foundation

# 4. Move to Phase 2: Supplier proposal form
# Goal: 3 hours to complete supplier proposal

# 5. Test in mock mode
npm run dev
# Navigate to /supplier/products/new
```

---

## 🎯 What Gets Built

### Supplier Side
- **Propose Products** with base pricing
- **View My Products** with approval status
- **See Rejection Reasons** and resubmit

### Admin Side
- **Review Pending Products**
- **Approve with Markup** (0-500%)
- **Reject with Reason**
- **Manage Seller Global Markups**

### Storefront
- **Display Final Prices** (base + markup)
- **Show Pricing Breakdown**

---

## 📊 Implementation Timeline

| Week | Focus | Deliverable |
|------|-------|-------------|
| **Week 1** | Foundation + Core Flow | Supplier proposal + Admin approval (mock) |
| **Week 2** | Polish + Integration | All features + Real backend connection |
| **Week 3** | Testing + Deployment | Production ready |

---

## 🔑 Key Concepts

### Pricing Formula (Exclusive)
```
IF product.markup_percentage exists:
  final_price = base_price × (1 + product_markup / 100)
ELSE:
  final_price = base_price × (1 + seller_global_markup / 100)
```

### Product States
- **`proposed`** → Pending admin review (not visible in storefront)
- **`published`** → Approved (visible in storefront)
- **`rejected`** → Rejected (supplier can fix and resubmit)

### Roles
- **Supplier (member)** → Propose products, view status
- **Admin (user)** → Review, approve/reject, manage markups
- **Customer** → See final prices in storefront

---

## ✅ Backend Status

All endpoints working and tested:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/vendor/custom/products` | POST | Propose product |
| `/vendor/custom/products` | GET | View my products |
| `/admin/custom/products/pending` | GET | List pending |
| `/admin/custom/products/:id/pricing-approval` | PATCH | Approve/Reject |
| `/admin/custom/sellers/:id/markup` | GET | View seller markup |
| `/admin/custom/sellers/:id/markup` | PATCH | Update seller markup |

**Base URL DEV:** `https://marketplace-b2b-backend-dev.onrender.com`

---

## 🧪 Testing Resources

### Postman Collection
Import `marketplace-b2b-carrefour.postman_collection 2.json`

**Test Accounts:**
- **Supplier:** `seller@mercur.dev` / (check Postman vars)
- **Admin:** `admin@carrefour.dev` / `supersecret`

### Manual Tests
Complete flow in Postman:
1. Login as supplier → propose product
2. Login as admin → approve with markup
3. Verify product status changed
4. Test rejection flow
5. Test seller markup update

---

## 📝 Notes

### Environment Setup
Add to `.env.local`:
```bash
NEXT_PUBLIC_MOCK_PRICING=true  # Start in mock mode
```

Set to `false` when ready to connect to real backend.

### Existing Patterns
Follow same patterns as **Openings module**:
- Dual mode API client (mock/real)
- TypeScript types in `src/types/`
- Mock data in `src/lib/api/`
- Component structure
- Page routing

### Dependencies
No new packages needed - use existing:
- shadcn/ui components
- Lucide React icons
- Next.js 14 App Router
- TypeScript

---

## 🎓 Learning Resources

If unfamiliar with patterns, reference **Openings module**:
- `src/lib/api/openings-client.ts` → API client pattern
- `src/lib/api/openings-mock.ts` → Mock data pattern
- `src/types/openings.ts` → TypeScript types
- `src/components/openings/` → Component structure

---

## 🤝 Support

**Questions during development?**
- Check backend manual for API details
- Test in Postman first
- Follow build guide phases
- Reference openings module for patterns

**Ready to start tomorrow!** 🚀
