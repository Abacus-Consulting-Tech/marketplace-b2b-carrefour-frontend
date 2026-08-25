# Authentication API Integration

**Backend:** Medusa Mercur API  
**Status:** ✅ Live and Integrated  
**Base URL (DEV):** `https://marketplace-b2b-backend-dev.onrender.com`  
**Last Updated:** 2026-08-21

---

## 📋 Overview

The application uses **Medusa authentication** with full backend integration. The auth module supports both mock and real modes via feature flags.

### ✅ Current Status
- **Backend Ready:** Yes ✅
- **Frontend Integration:** Complete
- **Mock Mode:** Available for offline development
- **Real API:** Fully functional

---

## 🔐 Authentication Flow

### User Login Flow
```
User → Frontend Login Page
  ↓
Next.js API Route (/api/auth/login)
  ↓
Medusa Backend (/auth/user/emailpass)
  ↓
Returns: { token, user }
  ↓
Frontend: Store in Zustand + localStorage
  ↓
Redirect to role-specific dashboard
```

### Session Management
- **Storage:** JWT token in localStorage (`auth-token`)
- **State:** Zustand store (`useAuthStore`)
- **Expiration:** Handled by backend
- **Refresh:** Manual re-login required (no refresh token yet)

---

## 🌐 Available Endpoints

### 1. **Login (Email/Password)**

**Backend Endpoint:**
```http
POST /auth/user/emailpass
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Frontend Usage:**
```typescript
// Via Next.js API proxy (recommended - avoids CORS)
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

const data = await response.json();
// { user: { id, email, role, ... }, token: "..." }
```

**Or direct via medusa-auth client:**
```typescript
import { medusaLogin } from '@/lib/api/medusa-auth';

const result = await medusaLogin({ email, password });
// { user: { id, email, ... } }
// Note: token is in session cookie
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "admin",
    "metadata": {
      "role": "admin",
      "company_name": "Carrefour"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. **Get Current Session**

**Backend Endpoint:**
```http
GET /auth/session
Cookie: connect.sid=...
```

**Frontend Usage:**
```typescript
import { getMedusaSession } from '@/lib/api/medusa-auth';

const session = await getMedusaSession();
if (session) {
  console.log('Logged in as:', session.user.email);
} else {
  console.log('Not authenticated');
}
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

---

### 3. **Logout**

**Backend Endpoint:**
```http
DELETE /auth/session
Cookie: connect.sid=...
```

**Frontend Usage:**
```typescript
import { medusaLogout } from '@/lib/api/medusa-auth';

await medusaLogout();
// Session cookie cleared
```

---

### 4. **Register (Optional)**

**Backend Endpoint:**
```http
POST /auth/user/emailpass/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "first_name": "Jane",
  "last_name": "Smith"
}
```

**Frontend Usage:**
```typescript
import { medusaRegister } from '@/lib/api/medusa-auth';

const result = await medusaRegister({
  email: 'newuser@example.com',
  password: 'password123',
  first_name: 'Jane',
  last_name: 'Smith',
});
```

**Note:** Registration may be disabled in production (admin-only user creation).

---

### 5. **Forgot Password**

**Backend Endpoint:**
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Frontend Usage:**
```typescript
// Via Next.js API proxy
const response = await fetch('/api/auth/forgot-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email }),
});
```

**Response:**
```json
{
  "message": "If the email exists, a reset link has been sent."
}
```

---

## 👥 User Roles

### Available Roles

| Role | Email Pattern | Access |
|------|---------------|--------|
| **admin** | `admin@carrefour.dev` | Full admin dashboard, all operations |
| **supplier** | `seller@mercur.dev` | Supplier dashboard, product proposals |
| **franchisee** | `franchisee@carrefour.dev` | Marketplace, orders, store management, openings portal |

### Role Detection

**Method 1: From email (current)**
```typescript
// In /api/auth/login
let role: 'admin' | 'supplier' | 'franchisee' = 'franchisee';
if (email.includes('admin')) role = 'admin';
else if (email.includes('supplier') || email.includes('seller')) role = 'supplier';
```

**Method 2: From backend metadata (future)**
```typescript
const role = user.metadata?.role || user.role || 'franchisee';
```

---

## 🧪 Development Credentials

### Mock Mode (NEXT_PUBLIC_MOCK_AUTH=true)

```
Admin:
  Email: admin@test.com
  Password: admin123

Franchisee:
  Email: franchisee@test.com
  Password: franchisee123

Supplier:
  Email: supplier@test.com
  Password: supplier123
```

### Real API (DEV Environment)

**✅ VERIFIED - Working Credentials:**
```
Admin:
  Email: admin@carrefour.dev
  Password: supersecret
  Status: ✅ Tested and working

Seller/Supplier:
  Email: seller@mercur.dev
  Password: supersecret
  Status: ✅ Tested and working

Franchisee:
  Email: franchisee@carrefour.dev
  Password: supersecret
  Portal: /franchisee/openings
  Status: ✅ Credentials confirmed
```

**Alternative Seller Accounts (untested):**
```
Kickz:
  Email: kickz@mercur.dev
  Password: supersecret

Trailhead:
  Email: trailhead@mercur.dev
  Password: supersecret
```

---

## 🔧 Configuration

### Feature Flags

**File:** `src/config/feature-flags.ts`
```typescript
auth: {
  useMock: process.env.NEXT_PUBLIC_MOCK_AUTH === 'true',
  backendReady: true, // ✅ Backend is live
  apiBaseUrl: '/api/auth',
  notes: 'Medusa auth integrated',
}
```

### Environment Variables

**.env.local (Development):**
```env
# Use mock for fast local development
NEXT_PUBLIC_MOCK_AUTH=true

# Or use real backend
NEXT_PUBLIC_MOCK_AUTH=false
NEXT_PUBLIC_API_URL=https://marketplace-b2b-backend-dev.onrender.com
```

**.env.production (Production):**
```env
# Always use real backend in production
NEXT_PUBLIC_MOCK_AUTH=false
NEXT_PUBLIC_API_URL=https://marketplace-b2b-backend-prod.onrender.com
```

---

## 📁 File Structure

### Frontend Files

```
src/
├── lib/
│   ├── api/
│   │   ├── medusa-auth.ts          # Real Medusa API client
│   │   └── mock.ts                  # Mock auth for development
│   └── store/
│       └── auth.ts                  # Zustand auth store
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx           # Login page (dual-mode)
│   │   ├── forgot-password/page.tsx # Forgot password (dual-mode)
│   │   └── register/page.tsx        # Registration (if enabled)
│   └── api/
│       └── auth/
│           └── login/route.ts       # Next.js API proxy to avoid CORS
└── config/
    └── feature-flags.ts             # Auth feature flag config
```

---

## 🎯 Usage Examples

### Example 1: Login Flow

```typescript
// In login page
import { useAuthStore } from '@/lib/store/auth';
import { featureFlags } from '@/config/feature-flags';

const isMockMode = featureFlags.shouldUseMock('auth');

const handleLogin = async (email: string, password: string) => {
  if (isMockMode) {
    // Mock mode
    const { mockApi } = await import('@/lib/api/mock');
    const { data } = await mockApi.auth.login(email, password);
    login(data.user, data.token);
  } else {
    // Real API via Next.js proxy
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    login(data.user, data.token);
  }
  
  // Redirect based on role
  router.push(`/${data.user.role}/dashboard`);
};
```

---

### Example 2: Protected API Call

```typescript
import { useAuthStore } from '@/lib/store/auth';

const token = useAuthStore.getState().token;

const response = await fetch('/api/some-endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

---

### Example 3: Logout

```typescript
import { useAuthStore } from '@/lib/store/auth';
import { medusaLogout } from '@/lib/api/medusa-auth';
import { featureFlags } from '@/config/feature-flags';

const handleLogout = async () => {
  // Clear backend session if using real API
  if (!featureFlags.shouldUseMock('auth')) {
    await medusaLogout();
  }
  
  // Clear frontend state
  useAuthStore.getState().logout();
  
  // Redirect to login
  router.push('/login');
};
```

---

## 🚦 Switching Between Mock and Real

### Option 1: Environment Variable (Recommended)

```bash
# .env.local
NEXT_PUBLIC_MOCK_AUTH=false  # Use real backend
```

Restart dev server:
```bash
npm run dev
```

---

### Option 2: Feature Flags (Global)

Edit `src/config/feature-flags.ts`:
```typescript
auth: {
  useMock: false,  // Change this
  backendReady: true,
  // ...
}
```

---

### Option 3: Per-Component Override

```typescript
// Force mock for testing
const isMockMode = true; // Override feature flags
```

---

## 🔒 Security Considerations

### ✅ Implemented

1. **HTTPS in Production** - All API calls use HTTPS
2. **HttpOnly Cookies** - Medusa session cookies are HttpOnly
3. **CORS Proxy** - Next.js API routes avoid CORS issues
4. **Token in localStorage** - For client-side auth state (consider httpOnly cookie)
5. **Password Requirements** - Enforced by backend

### ⚠️ TODO

1. **Refresh Tokens** - Currently no token refresh (user must re-login)
2. **Rate Limiting** - Add rate limiting to login endpoint
3. **2FA** - Two-factor authentication not implemented
4. **Session Timeout** - No automatic timeout warning
5. **CSRF Protection** - Consider adding CSRF tokens

---

## 🐛 Troubleshooting

### Issue: "Authentication failed"

**Possible Causes:**
- Wrong credentials
- Backend is down (Render free tier may sleep)
- CORS issues (use Next.js proxy)

**Solution:**
```bash
# Check backend health
curl https://marketplace-b2b-backend-dev.onrender.com/health

# Try mock mode
# .env.local
NEXT_PUBLIC_MOCK_AUTH=true
```

---

### Issue: "Token expired"

**Cause:** Medusa session expired (usually 24 hours)

**Solution:**
```typescript
// Logout and login again
await handleLogout();
router.push('/login');
```

---

### Issue: Backend slow (30+ seconds)

**Cause:** Render free tier wakes up from sleep

**Solution:**
```typescript
// Increase timeout in medusa-auth.ts
const medusaAuthClient = axios.create({
  timeout: 60000, // 60 seconds
  // ...
});
```

Or use mock mode for development:
```bash
NEXT_PUBLIC_MOCK_AUTH=true
```

---

## 📊 API Response Examples

### Success Login Response

```json
{
  "user": {
    "id": "usr_01HQ7XKZVYP8J9F6G2D3E4F5G6",
    "email": "admin@carrefour.dev",
    "first_name": "Admin",
    "last_name": "Carrefour",
    "role": "admin",
    "metadata": {
      "role": "admin",
      "company_name": "Carrefour España"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNyXzAxSFE3WEtaVllQOEo5RjZHMkQzRTRGNUc2IiwiaWF0IjoxNzA5MTIzNDU2LCJleHAiOjE3MDkxMjcwNTZ9.abc123xyz"
}
```

### Error Response

```json
{
  "message": "Invalid email or password",
  "type": "invalid_data"
}
```

---

## 🔗 Related Documentation

- [Feature Flags Guide](./FEATURE_FLAGS.md) - Feature flags system
- [Backend API Manual](../technical/providers/MANUAL_FRONTEND_PROPUESTA_PRODUCTOS_Y_TARIFICACION.md) - Full API docs
- [Postman Collection](../technical/providers/marketplace-b2b-carrefour.postman_collection%202.json) - API testing

---

## ✅ Testing Checklist

### Manual Testing

- [ ] Login with mock credentials (works offline)
- [ ] Login with real credentials (requires backend)
- [ ] Session persists across page refresh
- [ ] Logout clears token and session
- [ ] Redirect to correct dashboard based on role
- [ ] Forgot password sends email (real mode)
- [ ] Protected routes require authentication
- [ ] Token expires after timeout
- [ ] Backend wake-up time acceptable (<30s)

### Automated Testing

- [ ] Unit tests for auth store
- [ ] Integration tests for login flow
- [ ] E2E tests for full auth workflow

---

**Last Updated:** 2026-08-21  
**Status:** ✅ Production Ready  
**Maintained By:** Frontend Team
