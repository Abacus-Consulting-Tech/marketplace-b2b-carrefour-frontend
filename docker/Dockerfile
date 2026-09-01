# syntax=docker/dockerfile:1
# Front custom (Next 14). Contexto de build: la RAIZ del repo.
#   docker build -f docker/Dockerfile \
#     --build-arg NEXT_PUBLIC_API_URL=https://marketplace-api.abacus-consulting.net \
#     --build-arg NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY=pk_... \
#     -t marketplace-b2b-carrefour-frontend:local .
#
# Estado del repo que condiciona este fichero:
#   - Toda la config es de BUILD (NEXT_PUBLIC_* se inlinea en next build):
#     imagen por entorno (tags :pre-* / :prod-*) hasta docs/feature/02.
#   - Sin output standalone en next.config.js (activarlo = tocar codigo, fuera
#     de alcance): la imagen lleva node_modules de produccion completos (~1 GB)
#     y arranca con `next start`. docs/feature/02 la dejara en ~200 MB.
#   - Sin sharp en package.json: Next 14 optimiza imagenes con squoosh (lento
#     pero funcional). Anadir sharp = tocar codigo -> docs/feature/02.
#   - Sin NEXT_PUBLIC_ENV: next.config.js elige proxy.prod.conf.js (sin
#     rewrites /backend/*), igual que el prod de Vercel.

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-bookworm-slim AS build
WORKDIR /app

# Lockfile limpio (todo contra registry.npmjs.org): npm ci funciona.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# --- Config horneada ---------------------------------------------------------
# Contrato completo de NEXT_PUBLIC_* que lee src/ (inventario 2026-08-28). Los
# valores entran por --build-arg desde las vars del GitHub Environment
# (docs/DEPLOYMENT.md). Un build-arg vacio cuenta como "no definido": aplica el
# default de abajo (mismos defaults que src/config/feature-flags.ts).
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MERCUR_STORE_API
ARG NEXT_PUBLIC_API_TIMEOUT
ARG NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY
ARG NEXT_PUBLIC_MERCUR_REGION_ID
ARG NEXT_PUBLIC_DEFAULT_SELLER_ID
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_MOCK_AUTH
ARG NEXT_PUBLIC_CATALOG_SOURCE
ARG NEXT_PUBLIC_CART_SOURCE
ARG NEXT_PUBLIC_MOCK_PRODUCTS
ARG NEXT_PUBLIC_MOCK_CATALOG
ARG NEXT_PUBLIC_MOCK_ORDERS
ARG NEXT_PUBLIC_MOCK_QUOTES
ARG NEXT_PUBLIC_MOCK_SUPPLIERS
ARG NEXT_PUBLIC_MOCK_PRICING
ARG NEXT_PUBLIC_MOCK_CHECKOUT

# .env.production PROPIO (el del repo queda fuera por .dockerignore): next build
# lo inlinea en el bundle cliente y next start lo carga para el codigo servidor
# (los route handlers /api/auth/login y /api/admin/orders leen process.env).
# Sin NEXT_PUBLIC_API_URL varios clientes caen al Render DEV hardcodeado:
# obligatoria. MERCUR_STORE_API deriva de ella si no se pasa.
RUN test -n "$NEXT_PUBLIC_API_URL" || { echo "Falta --build-arg NEXT_PUBLIC_API_URL"; exit 1; } \
 && printf '%s\n' \
    "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" \
    "NEXT_PUBLIC_MERCUR_STORE_API=${NEXT_PUBLIC_MERCUR_STORE_API:-${NEXT_PUBLIC_API_URL}/store}" \
    "NEXT_PUBLIC_API_TIMEOUT=${NEXT_PUBLIC_API_TIMEOUT:-10000}" \
    "NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY=${NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY}" \
    "NEXT_PUBLIC_MERCUR_REGION_ID=${NEXT_PUBLIC_MERCUR_REGION_ID}" \
    "NEXT_PUBLIC_DEFAULT_SELLER_ID=${NEXT_PUBLIC_DEFAULT_SELLER_ID}" \
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}" \
    "NEXT_PUBLIC_MOCK_AUTH=${NEXT_PUBLIC_MOCK_AUTH:-false}" \
    "NEXT_PUBLIC_CATALOG_SOURCE=${NEXT_PUBLIC_CATALOG_SOURCE:-mercur}" \
    "NEXT_PUBLIC_CART_SOURCE=${NEXT_PUBLIC_CART_SOURCE:-mercur}" \
    "NEXT_PUBLIC_MOCK_PRODUCTS=${NEXT_PUBLIC_MOCK_PRODUCTS:-true}" \
    "NEXT_PUBLIC_MOCK_CATALOG=${NEXT_PUBLIC_MOCK_CATALOG:-true}" \
    "NEXT_PUBLIC_MOCK_ORDERS=${NEXT_PUBLIC_MOCK_ORDERS:-true}" \
    "NEXT_PUBLIC_MOCK_QUOTES=${NEXT_PUBLIC_MOCK_QUOTES:-true}" \
    "NEXT_PUBLIC_MOCK_SUPPLIERS=${NEXT_PUBLIC_MOCK_SUPPLIERS:-true}" \
    "NEXT_PUBLIC_MOCK_PRICING=${NEXT_PUBLIC_MOCK_PRICING:-true}" \
    "NEXT_PUBLIC_MOCK_CHECKOUT=${NEXT_PUBLIC_MOCK_CHECKOUT:-true}" \
    > .env.production \
 && cat .env.production

RUN npm run build

# Solo deps de produccion para el stage runtime.
RUN npm prune --omit=dev

FROM node:${NODE_VERSION}-bookworm-slim AS runtime
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS=--max-old-space-size=512
WORKDIR /app

COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/next.config.js ./next.config.js
# next.config.js los requiere tambien en runtime (next start lo reevalua).
COPY --from=build --chown=node:node /app/proxy.dev.conf.js /app/proxy.staging.conf.js /app/proxy.prod.conf.js ./
COPY --from=build --chown=node:node /app/.env.production ./.env.production
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next ./.next

USER node
EXPOSE 3000

# GET / funciona hoy porque la home responde sin backend; healthcheck fragil
# hasta que exista /api/health (docs/feature/02, punto 4).
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

CMD ["./node_modules/.bin/next", "start"]
