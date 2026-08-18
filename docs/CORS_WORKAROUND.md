# CORS Workaround for Medusa Backend

## Issue

The Medusa backend on Render does not currently allow `http://localhost:3000` in its CORS configuration, causing authentication requests from the frontend to fail with:

```
Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin
```

## Solution: Next.js API Proxy

We've implemented a Next.js API route that proxies authentication requests to the Medusa backend, bypassing CORS restrictions.

### How it works

```
Frontend (localhost:3000)
    ↓
    POST /api/auth/login (same-origin, no CORS)
    ↓
Next.js API Route (server-side)
    ↓
    POST https://marketplace-b2b-backend-dev.onrender.com/auth/user/emailpass
    ↓
Medusa Backend
```

### Files

- **Proxy route**: [src/app/api/auth/login/route.ts](../src/app/api/auth/login/route.ts)
- **Login page**: [src/app/(auth)/login/page.tsx](../src/app/(auth)/login/page.tsx)

### Configuration

Set `.env.local`:
```bash
NEXT_PUBLIC_MOCK_AUTH=false
```

Now you can login with backend credentials:
- `admin@carrefour.dev` / `supersecret`
- `seller@mercur.dev` / `supersecret`

### Permanent Fix (Backend Team)

The proper solution is to configure the Medusa backend to allow `http://localhost:3000` in CORS origins.

In the backend Medusa configuration, add:

```javascript
// medusa-config.js or similar
module.exports = {
  projectConfig: {
    http: {
      cors: "http://localhost:3000,https://your-production-domain.com",
      // or for development:
      cors: /localhost:\d+/
    }
  }
}
```

Once backend CORS is fixed, the proxy can be removed and the frontend can call Medusa directly.

### Testing

1. Set `NEXT_PUBLIC_MOCK_AUTH=false` in `.env.local`
2. Restart dev server: `npm run dev`
3. Go to http://localhost:3000/login
4. Login with: `admin@carrefour.dev` / `supersecret`
5. Should successfully authenticate via proxy

### Current Status

- ✅ Proxy implemented and working
- ✅ Backend credentials work via proxy
- 🚧 Backend CORS needs to be configured (permanent fix)
