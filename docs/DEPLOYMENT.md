# Despliegue — front custom (Next.js)

Guía autocontenida de este repo. La visión cross-repo (backend incluido) vive en el
`docs/DEPLOYMENT.md` del workspace raíz.

## Pipeline

```text
push a main o dev ──► audit ─┐
                             ├─► build imagen (env pre) ─► deploy-pre (autodespliegue)
                     test  ──┘
pull_request       ──► audit ∥ test   (sin imagen)
```

- **`audit`**: `audit-ci` (npm audit high sobre deps de runtime) con la allowlist de
  riesgo aceptado de `audit-ci.jsonc` — hoy solo `next` 14.x, que no tiene parche
  disponible ([docs/feature/03](feature/03_next-16-migration.md)).
- **`test`**: `npm ci` + `vitest run --passWithNoTests` (hoy no hay tests:
  [docs/fix/01](fix/01_tests-inexistentes.md); el flag evita un rojo vacío).
- **`build`**: `next build` dentro de `docker/Dockerfile` (incluye el chequeo de tipos).
- **`deploy-pre`**: reusable `deploy.yml` con health gate (40×5 s sobre el HEALTHCHECK)
  y rollback automático a la imagen anterior si falla.

Hoy `main` y `dev` despliegan ambos a **pre**; cuando exista el servidor de prod, `main`
pasará a prod. Prod nunca se encadena: `workflow_dispatch` de *CI* con `target=prod` y
después *Deploy* con ese `prod-<sha7>` (gate: revisores del environment `prod`).

## Qué se despliega

Una sola imagen, `ghcr.io/abacus-consulting-tech/marketplace-b2b-carrefour-frontend`, con
`next start` y `node_modules` completos (~1 GB): el repo no define `output: 'standalone'`
y no se toca código en esta fase ([docs/feature/02](feature/02_runtime-config-y-standalone.md)
documenta la mejora).

**La imagen es por entorno** (tags `:pre-<sha7>`/`:pre` y `:prod-<sha7>`/`:prod`): todas
las `NEXT_PUBLIC_*` se hornean en `next build`. El Dockerfile escribe un `.env.production`
propio con los valores efectivos (el `.env.production` del repo queda fuera por
`.dockerignore`) para que el bundle cliente y los route handlers vean lo mismo.
Cambiar una var del environment **no cambia nada hasta reconstruir la imagen**.

## Configuración en GitHub (una vez)

Environments `pre` y `prod` (prod con required reviewers).

Secrets por environment: `VPS_HOST`, `VPS_SSH_KEY`, `GHCR_PAT` (`read:packages`).

Vars de despliegue: `SSH_USER` (pre: `marketplace_front_admin`), `SSH_PORT`,
`FRONT_PUBLISH_PORT` (pre: `10110`, estándar de puertos del workspace).

En pre, front y backend comparten máquina Plesk pero **usuario de sistema distinto**
(`marketplace_front_admin` vs `marketplace_admin`); ese usuario debe estar en el grupo
`docker`, tener autorizada la deploy key y ser dueño de `/opt/projects/marketplace-b2b-carrefour-frontend`
(alta de root — runbook del plan 03).

Vars de build (se hornean; vacía = default del Dockerfile):

| Variable | pre | Notas |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://marketplace-api.abacus-consulting.net` | **Obligatoria** — el build falla sin ella. Raíz de Medusa, sin `/api` |
| `NEXT_PUBLIC_MERCUR_STORE_API` | *(vacía)* | Default: `${NEXT_PUBLIC_API_URL}/store` |
| `NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY` | `pk_…` del entorno | Admin → Publishable API Keys |
| `NEXT_PUBLIC_MERCUR_REGION_ID` | `reg_…` del entorno | |
| `NEXT_PUBLIC_DEFAULT_SELLER_ID` | `sel_…` (opcional) | Fallback si el usuario no tiene seller |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | solo con checkout real | |
| `NEXT_PUBLIC_MOCK_AUTH` | `false` | Mock solo si vale `true` |
| `NEXT_PUBLIC_CATALOG_SOURCE` / `NEXT_PUBLIC_CART_SOURCE` | `mercur` | |
| `NEXT_PUBLIC_MOCK_{PRODUCTS,CATALOG,ORDERS,QUOTES,SUPPLIERS,PRICING}` | `false` | Mock salvo `false` explícito |
| `NEXT_PUBLIC_MOCK_CHECKOUT` | `true` | Hasta tener Stripe en pre |
| `NEXT_PUBLIC_API_TIMEOUT` | *(vacía)* | Default `10000` ms |

## Arquitectura en pre/prod

- Pre y prod son **dos servidores Plesk distintos**, mismo compose; solo cambian el
  `.env` de la máquina y la imagen (`pre-*` vs `prod-*`).
- El contenedor escucha en 3000 y se publica **solo en
  `127.0.0.1:${FRONT_PUBLISH_PORT:-10110}`**; el nginx de Plesk termina TLS y reenvía.
- No hay red Docker compartida con el backend: el tráfico front→api sale del navegador
  (y de dos route handlers del propio contenedor). El único acople es CORS: **el `.env`
  del backend debe listar el origen público de este front en `STORE_CORS` y
  `AUTH_CORS`**, o el navegador bloqueará las llamadas sin que ningún servidor registre
  error.

## Preparación de la máquina (una vez)

```bash
mkdir -p /opt/projects/marketplace-b2b-carrefour-frontend
cd /opt/projects/marketplace-b2b-carrefour-frontend
# 1. copiar docker/compose.yml del repo como docker-compose.yml
# 2. crear .env a partir de docker/.env.example (IMAGE_FRONT, FRONT_PUBLISH_PORT=10110)
chmod 600 .env
```

Nginx del dominio en Plesk (*Apache & nginx settings*, **Proxy mode OFF**, *Additional
nginx directives*). Con Proxy mode OFF Plesk fuerza *Smart static files processing*; el
prefijo `^~` evita que sus regex de estáticos intercepten `/_next/static/*`:

```nginx
location ^~ / {
    proxy_pass http://127.0.0.1:10110;
    proxy_http_version 1.1;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Connection "";
    client_max_body_size 20m;
    proxy_read_timeout 60s;
}
```

Si se cambia la var `FRONT_PUBLISH_PORT`, hay que cambiar este `proxy_pass` a la vez.

## Rollback

Relanzar *Deploy* con el tag inmutable anterior (`pre-<sha7>`). El front no tiene estado
propio (sin BD), así que el rollback es siempre seguro. El propio deploy revierte solo
si el contenedor no llega a `healthy`.

## Deploy manual (sin Actions)

```bash
ssh <usuario>@<host>
cd /opt/projects/marketplace-b2b-carrefour-frontend
sed -i 's|^IMAGE_FRONT=.*|IMAGE_FRONT=ghcr.io/abacus-consulting-tech/marketplace-b2b-carrefour-frontend:pre-<sha7>|' .env
docker compose pull && docker compose up -d --remove-orphans
```

## Comandos útiles

```bash
docker compose ps                                 # estado (healthcheck a GET /)
docker compose logs -f app                        # logs
docker ps --filter "label=com.project.stack=marketplace-b2b-carrefour-frontend"
```

## Build local de la imagen (opcional)

```bash
docker build -f docker/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=https://marketplace-api.abacus-consulting.net \
  -t marketplace-b2b-carrefour-frontend:local .
docker run --rm -p 127.0.0.1:10110:3000 marketplace-b2b-carrefour-frontend:local
```

Para desarrollo normal no hace falta Docker: `npm run dev` en el host.

## Limitaciones conocidas (dependen de otros equipos)

- `next` 14.x arrastra 21 advisories high sin parche disponible; el gate `audit` pasa
  gracias a un **riesgo aceptado** declarado en `audit-ci.jsonc`. Retirarlo exige migrar
  a Next 16 ([docs/feature/03](feature/03_next-16-migration.md), [docs/fix/03](fix/03_build-roto-y-env-production.md)).
- `.env.production` con un token OIDC sigue versionado en un repo público
  ([docs/fix/03](fix/03_build-roto-y-env-production.md) punto 3) — no afecta al despliegue.
- CI sin tests reales ([docs/fix/01](fix/01_tests-inexistentes.md)).
- Config horneada en build → imagen por entorno; el paso a runtime-config + standalone +
  `/api/health` está descrito en [docs/feature/02](feature/02_runtime-config-y-standalone.md).
