# Backend Connection Issues - Quick Fix

## Problem

Login taking forever or timing out? The Render backend (free tier) goes to sleep after inactivity and can take 30+ seconds to wake up.

## Solutions

### Option 1: Use Mock Mode (Fastest for Development)

Edit `.env.local`:
```bash
NEXT_PUBLIC_MOCK_AUTH=true
```

Then restart the dev server:
```bash
npm run dev
```

**Mock Credentials:**
- Admin: `admin@test.com` / `admin123`
- Franchisee: `franchisee@test.com` / `franchisee123`
- Supplier: `supplier@test.com` / `supplier123`

### Option 2: Wait for Backend to Wake Up

Keep `NEXT_PUBLIC_MOCK_AUTH=false` and wait 30 seconds for the first login. Subsequent logins will be fast.

**Real Backend Credentials:**
- Admin: `admin@carrefour.dev` / `supersecret`
- Franchisee: `franchisee@test.com` / `supersecret`
- Seller: `seller@mercur.dev` / `supersecret`

### Option 3: Wake Up Backend First

Open this URL in your browser to wake up the backend before logging in:
```
https://marketplace-b2b-backend-dev.onrender.com/health
```

Wait for it to respond (15-30 seconds), then try logging in.

## Recent Updates

✅ Added 30-second timeout to prevent infinite hanging
✅ Added helpful loading message explaining the wait
✅ API route now shows timeout error instead of hanging forever

## Switching Back to Real Backend

Edit `.env.local`:
```bash
NEXT_PUBLIC_MOCK_AUTH=false
```

Restart dev server:
```bash
npm run dev
```

## Checking Current Mode

The login page shows current mode:
- 🧪 **Modo Mock** = Fast, local data
- 🔌 **Backend Real (DEV)** = Real backend, may be slow on first request
