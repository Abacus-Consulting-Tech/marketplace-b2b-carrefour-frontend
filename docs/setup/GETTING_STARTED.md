# Setup Instructions

## Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm

## Installation

Since there may be network restrictions, you have two options:

### Option 1: Install with npm (if network allows)

```bash
npm install
```

### Option 2: Manual Installation (if network is restricted)

If you're behind a corporate firewall or have npm registry access issues, you can:

1. **Use a different registry** (if available in your organization):
```bash
npm config set registry https://your-corporate-registry.com
npm install
```

2. **Install dependencies offline** (if you have a cache):
```bash
npm install --prefer-offline
```

3. **Contact your IT department** to allowlist:
   - `https://registry.npmjs.org`
   - `https://registry.yarnpkg.com` (if using Yarn)

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your actual values:
   - `NEXT_PUBLIC_API_URL`: Your MercurJS backend URL
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `STRIPE_SECRET_KEY`: Your Stripe keys (from dashboard)

## Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Check TypeScript types
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests
- `npm run test:e2e` - Run E2E tests

## Installing Shadcn/ui Components

Once npm works, install UI components as needed:

```bash
# Install a single component
npx shadcn-ui@latest add button

# Install multiple components
npx shadcn-ui@latest add button input card dialog table form
```

## Project Structure

```
src/
├── app/              # Next.js 14 App Router
├── components/       # React components
│   └── ui/          # Shadcn/ui components
├── lib/             # Utilities and configuration
│   ├── api/         # API client
│   ├── hooks/       # Custom hooks
│   └── store/       # Zustand stores
├── types/           # TypeScript types
└── styles/          # Global styles
```

## Next Steps

1. ✅ Install dependencies (when network allows)
2. ✅ Set up environment variables
3. ✅ Install Shadcn/ui components you need
4. 📝 Start building features according to Sprint Plan
5. 🧪 Write tests as you develop

## Troubleshooting

### npm install fails with 403 error

**Cause**: Corporate firewall or npm registry access restriction

**Solutions**:
1. Check with IT to allowlist npm registry
2. Use a corporate npm proxy if available
3. Use yarn or pnpm as alternative package managers

### Cannot find module errors

**Cause**: Dependencies not installed

**Solution**: Run `npm install` successfully first

## Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest/docs/react)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)

## Support

For project-specific questions, refer to the docs folder:
- [Architecture](./docs/technical/ARCHITECTURE.md)
- [Development Guide](./docs/technical/DEVELOPMENT.md)
- [Features](./docs/FEATURES.md)
- [API Documentation](./docs/technical/API.md)
