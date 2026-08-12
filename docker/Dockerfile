# syntax=docker/dockerfile:1
# Front custom (Next 14.2.5). Contexto de build: la RAIZ del repo.
#   docker build -f docker/Dockerfile \
#     --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
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

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-bookworm-slim AS build
WORKDIR /app

# Lockfile limpio (733/733 contra registry.npmjs.org): aqui npm ci SI funciona.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Config horneada en el bundle. Sin NEXT_PUBLIC_API_URL el front cae a modo
# mock (isMockMode en login/register/marketplace): obligatoria en pre/prod.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_TIMEOUT=10000
ARG NEXT_PUBLIC_MOCK_AUTH=false
RUN test -n "$NEXT_PUBLIC_API_URL" || { echo "Falta --build-arg NEXT_PUBLIC_API_URL"; exit 1; }

RUN npm run build

# Solo deps de produccion para el stage runtime.
RUN npm prune --omit=dev

FROM node:${NODE_VERSION}-bookworm-slim AS runtime
ENV NODE_ENV=production \
    PORT=3000 \
    NODE_OPTIONS=--max-old-space-size=512
WORKDIR /app

COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/next.config.js ./next.config.js
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next ./.next

USER node
EXPOSE 3000

# GET / funciona hoy porque la home cae a mock sin backend; healthcheck fragil
# hasta que exista /api/health (docs/feature/02, punto 4).
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]

CMD ["./node_modules/.bin/next", "start"]
