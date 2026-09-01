# 🚀 Deploy Real API Version to Vercel

This guide helps you deploy the **real API version** as a separate Vercel project, distinct from the mock version.

---

## Current Setup

- **Mock Version**: `marketplace-b2b-carrefour` (from `medusa-update` branch)
- **Real API Version**: To be deployed from `dev` or `main` branch

---

## 📋 Prerequisites

1. Vercel CLI installed: `npm install -g vercel`
2. Authenticated: `vercel login`
3. On the correct branch: `dev` or `main`

---

## Method 1: Vercel Dashboard (Easiest) ⭐

### Step 1: Create New Project

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repository
4. Click **"Import"**

### Step 2: Configure Project

**Project Settings:**
- **Project Name**: `marketplace-b2b-carrefour-real`
- **Framework**: Next.js ✅ (auto-detected)
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto)
- **Install Command**: `npm install`

**Git Branch:**
- Select: `dev` (or `main`)

### Step 3: Environment Variables

Click **"Environment Variables"** and add:

```bash
# API Configuration - Real Mercur Backend
NEXT_PUBLIC_API_URL=https://marketplace-b2b-backend-dev.onrender.com
NEXT_PUBLIC_MERCUR_STORE_API=https://marketplace-b2b-backend-dev.onrender.com/store
NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY=pk_15f89d436badff43c2366d014c88536fa0307e92aeaeab294a2ee1d29710e1b9
NEXT_PUBLIC_MERCUR_REGION_ID=reg_01M0AAYKP7T4XSM0PWRYHQF0BE
NEXT_PUBLIC_CATALOG_SOURCE=mercur
NEXT_PUBLIC_CART_SOURCE=mercur

# DISABLE All Mock Modes (Use Real Backend)
NEXT_PUBLIC_MOCK_AUTH=false
NEXT_PUBLIC_MOCK_OPENINGS=false
NEXT_PUBLIC_MOCK_PRICING=false
NEXT_PUBLIC_MOCK_PRODUCTS=false
NEXT_PUBLIC_MOCK_SUPPLIERS=false
NEXT_PUBLIC_MOCK_CATEGORIES=false
NEXT_PUBLIC_MOCK_QUOTES=false
```

**For each variable:**
- Enter name and value
- Select environment: **Production**, **Preview**, **Development** (or as needed)
- Click "Add"

### Step 4: Deploy

Click **"Deploy"** button.

Vercel will:
1. Clone your repository
2. Install dependencies
3. Build your Next.js app
4. Deploy to production

**Deployment URL:** `https://marketplace-b2b-carrefour-real.vercel.app`

---

## Method 2: Vercel CLI

### Step 1: Switch to Target Branch

```bash
# Switch to dev (or main)
git checkout dev

# Pull latest changes
git pull origin dev
```

### Step 2: Deploy as New Project

```bash
# Deploy (force as new project)
vercel --prod

# When prompted:
# "Link to existing project?" → NO (N)
# "What's your project's name?" → marketplace-b2b-carrefour-real
# "In which directory is your code located?" → ./ (press Enter)
# "Want to modify these settings?" → NO (N)
```

### Step 3: Add Environment Variables

After first deployment, set environment variables:

```bash
# Set production environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://marketplace-b2b-backend-dev.onrender.com

vercel env add NEXT_PUBLIC_MERCUR_STORE_API production
# Enter: https://marketplace-b2b-backend-dev.onrender.com/store

vercel env add NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY production
# Enter: pk_15f89d436badff43c2366d014c88536fa0307e92aeaeab294a2ee1d29710e1b9

vercel env add NEXT_PUBLIC_MERCUR_REGION_ID production
# Enter: reg_01M0AAYKP7T4XSM0PWRYHQF0BE

vercel env add NEXT_PUBLIC_CATALOG_SOURCE production
# Enter: mercur

vercel env add NEXT_PUBLIC_CART_SOURCE production
# Enter: mercur

# Disable all mock modes
vercel env add NEXT_PUBLIC_MOCK_AUTH production
# Enter: false

vercel env add NEXT_PUBLIC_MOCK_OPENINGS production
# Enter: false

vercel env add NEXT_PUBLIC_MOCK_PRICING production
# Enter: false

vercel env add NEXT_PUBLIC_MOCK_PRODUCTS production
# Enter: false

vercel env add NEXT_PUBLIC_MOCK_SUPPLIERS production
# Enter: false

vercel env add NEXT_PUBLIC_MOCK_CATEGORIES production
# Enter: false

vercel env add NEXT_PUBLIC_MOCK_QUOTES production
# Enter: false
```

### Step 4: Redeploy with Environment Variables

```bash
vercel --prod
```

---

## 🔧 Optional: Update vercel.json

If you want automatic deployments from `dev` branch:

**Create**: `vercel.real.json` (or update existing `vercel.json` for this project)

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "dev": true,
      "medusa-update": false
    }
  },
  "github": {
    "silent": false,
    "autoJobCancelation": true
  },
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

---

## ✅ Verification Checklist

After deployment, test:

- [ ] Login works with **real backend authentication**
- [ ] Products load from **Mercur/Medusa backend**
- [ ] Cart operations work
- [ ] Orders module functional
- [ ] Supplier features operational
- [ ] Admin panel connected to real API
- [ ] No mock data appears

### Quick Test Script

```bash
# Test backend connectivity
curl https://marketplace-b2b-backend-dev.onrender.com/health

# Test Medusa store API
curl https://marketplace-b2b-backend-dev.onrender.com/store/products
```

---

## 📊 Your Vercel Projects

After this, you'll have:

1. **marketplace-b2b-carrefour** (Mock)
   - Branch: `medusa-update`
   - Mode: Mock data
   - URL: `https://marketplace-b2b-carrefour.vercel.app`

2. **marketplace-b2b-carrefour-real** (Real API)
   - Branch: `dev` or `main`
   - Mode: Real Mercur/Medusa backend
   - URL: `https://marketplace-b2b-carrefour-real.vercel.app`

---

## 🔄 Future Updates

### Update Mock Version
```bash
git checkout medusa-update
git pull
git push origin medusa-update
# Auto-deploys to mock project
```

### Update Real Version
```bash
git checkout dev
git pull
git push origin dev
# Auto-deploys to real project
```

---

## 🆘 Troubleshooting

### Issue: Build fails

**Check:**
- Environment variables are set correctly
- Branch has latest code: `git pull`
- Local build works: `npm run build`

### Issue: Backend connection errors

**Verify:**
- `NEXT_PUBLIC_API_URL` points to: `https://marketplace-b2b-backend-dev.onrender.com`
- Backend is running: visit URL in browser
- CORS is configured on backend
- All mock flags are `false`

### Issue: Still seeing mock data

**Solution:**
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Verify all `NEXT_PUBLIC_MOCK_*` are set to `false`
4. Redeploy: Deployments → Click "..." → "Redeploy"

---

## 📝 Notes

- Each Vercel project is **independent**
- Can have different branches, environments, settings
- Can be deleted/modified without affecting the other
- Free plan: 100 GB bandwidth/month per account (shared)

---

## 🎯 Next Steps

1. Deploy real API version following this guide
2. Test all features thoroughly
3. Update DNS/domains if needed
4. Share both URLs with team for testing
5. Document any backend issues found
