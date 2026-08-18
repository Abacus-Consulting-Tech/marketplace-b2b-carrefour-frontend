# Authentication Integration Guide

This frontend supports two authentication modes: **Mock Auth** (for development/testing without backend) and **Medusa Backend Auth** (for production-ready integration).

---

## Current Configuration

The app currently uses **Mock Auth** to allow frontend development and testing while the Medusa auth endpoints are being finalized.

### Environment Variables (.env.local)

```bash
# Mock Auth Mode (set to true for mock, false for real Medusa backend)
NEXT_PUBLIC_MOCK_AUTH=true

# Medusa Backend URL (used when MOCK_AUTH=false)
NEXT_PUBLIC_API_URL=https://marketplace-b2b-backend-dev.onrender.com
```

---

## Mock Auth Mode (Current)

When `NEXT_PUBLIC_MOCK_AUTH=true`:

- Auth calls use local mock implementation (`src/lib/api/mock.ts`)
- No backend connection required for login
- Cart and catalog still use real Medusa backend

**Test Credentials:**
- Admin: `admin@test.com` / `admin123`
- Franchisee: `franchisee@test.com` / `franchisee123`
- Supplier: `supplier@test.com` / `supplier123`

---

## Medusa Backend Auth (Production Ready)

When `NEXT_PUBLIC_MOCK_AUTH=false`:

### Setup

1. Update `.env.local`:
   ```bash
   NEXT_PUBLIC_MOCK_AUTH=false
   ```

2. Restart Next.js dev server:
   ```bash
   npm run dev
   ```

### Auth Endpoints (Medusa)

The Medusa auth client (`src/lib/api/medusa-auth.ts`) integrates with these endpoints:

| Endpoint | Method | Purpose |
|---|---|---|
| `/auth/user/emailpass` | POST | Login with email/password |
| `/auth/session` | GET | Get current session |
| `/auth/session` | DELETE | Logout |
| `/auth/user/emailpass/register` | POST | Register new user (if enabled) |

### Backend Credentials (Render DEV)

See [docs/medusa/CREDENTIALS.md](../medusa/CREDENTIALS.md) for available test users:

- `admin@carrefour.dev` / `supersecret`
- `seller@mercur.dev` / `supersecret`
- `kickz@mercur.dev` / `supersecret`
- `trailhead@mercur.dev` / `supersecret`

### Integration Flow

1. User submits login form
2. Frontend calls `medusaLogin({ email, password })`
3. Backend validates and returns user object
4. Frontend stores user in Zustand store
5. Session cookie is managed by Medusa (httpOnly)

### Updating Login Page

To use Medusa auth in the login page, modify `src/app/(auth)/login/page.tsx`:

```typescript
import { medusaLogin } from "@/lib/api/medusa-auth";

// In handleSubmit:
if (!isMockMode) {
  const { user } = await medusaLogin(email, password);
  
  // Map Medusa user to frontend user type
  const frontendUser = {
    id: user.id,
    email: user.email,
    name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
    role: user.metadata?.role || 'customer',
    // ... other fields
  };
  
  login(frontendUser, 'session-token'); // Token managed by httpOnly cookie
}
```

---

## Current Status

✅ **Working:**
- Mock auth for local development
- Cart operations with Medusa backend
- Catalog/products with Medusa backend
- Backend connectivity verified

🚧 **Next Steps for Full Integration:**
1. Test Medusa auth endpoints with Postman (see [docs/medusa/README-front-usage.md](../medusa/README-front-usage.md))
2. Update login/register pages to use `medusa-auth.ts` client
3. Set `NEXT_PUBLIC_MOCK_AUTH=false`
4. Test full auth flow with backend credentials

---

## Testing

### Quick Backend Auth Test (Terminal)

```bash
# Test login endpoint
curl -i -X POST https://marketplace-b2b-backend-dev.onrender.com/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@carrefour.dev","password":"supersecret"}'
```

### Frontend Testing

1. **With Mock Auth** (current):
   - Start dev server: `npm run dev`
   - Login with: `admin@test.com` / `admin123`
   - All auth is simulated locally

2. **With Medusa Auth** (when ready):
   - Set `NEXT_PUBLIC_MOCK_AUTH=false`
   - Restart dev server
   - Login with: `admin@carrefour.dev` / `supersecret`
   - Auth hits real backend

---

## Files Reference

- **Mock Auth**: `src/lib/api/mock.ts`
- **Medusa Auth**: `src/lib/api/medusa-auth.ts`
- **Auth Store**: `src/lib/store/auth.ts`
- **Login Page**: `src/app/(auth)/login/page.tsx`
- **Backend Docs**: `docs/medusa/`
