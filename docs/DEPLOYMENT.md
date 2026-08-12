# Despliegue — front custom (Next.js)

Guía autocontenida de este repo. La visión cross-repo (backend incluido) vive en el
`docs/DEPLOYMENT.md` del workspace raíz.

## Qué se despliega

Una sola imagen, `ghcr.io/<org>/marketplace-b2b-carrefour-frontend`, con `next start` y
`node_modules` completos (~1 GB): el repo no define `output: 'standalone'` y no se toca
código en esta fase ([docs/feature/02](feature/02_runtime-config-y-standalone.md)
documenta la mejora).

**La imagen es por entorno** (tags `:pre-*` / `:prod-*`): todas las `NEXT_PUBLIC_*` se
hornean en el build.

| Build-arg | Efecto |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL pública del api Medusa. **Obligatoria** — el build falla sin ella (mejor que desplegar en modo mock por accidente) |
| `NEXT_PUBLIC_API_TIMEOUT` | Timeout de las llamadas, default `10000` ms |
| `NEXT_PUBLIC_MOCK_AUTH` | default `false`. Jamás `true` en prod |

La integración real con el backend está pendiente
([docs/feature/01](feature/01_integracion-api-medusa.md)); Docker despliega el front
igual, apuntando `NEXT_PUBLIC_API_URL` a donde se decida.

## Arquitectura en pre/prod

- Pre y prod son **dos máquinas distintas**, mismo compose; solo cambia el `.env`.
- El contenedor escucha en 3000 y se publica **solo en
  `127.0.0.1:${FRONT_PUBLISH_PORT:-3100}`**; un proxy inverso del host termina TLS y
  reenvía.
- No hay red Docker compartida con el backend: todo el tráfico front→api sale del
  navegador del usuario. El único acople es CORS: **el `.env` del backend debe listar el
  origen público de este front en `STORE_CORS` y `AUTH_CORS`**, o el navegador bloqueará
  las llamadas sin que ningún servidor registre error.

## Requisitos previos

- Docker + Compose en la máquina; usuario `deploy` con acceso al socket.
- Proxy inverso del host apuntando `https://front.<dominio>` → `127.0.0.1:3100`.
- `GHCR_PAT` con `read:packages` para hacer pull (repo privado).

## Configuración en GitHub (una vez)

Crear dos **Environments**: `pre` y `prod`.

Variables por environment:

| Variable | Valor |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL pública del api del entorno (`https://api.example.com`) |
| `NEXT_PUBLIC_API_TIMEOUT` (opcional) | default `10000` |
| `NEXT_PUBLIC_MOCK_AUTH` (opcional) | default `false` |

Secrets por environment (pre y prod apuntan a máquinas distintas):

| Secret | Valor |
| --- | --- |
| `VPS_HOST` | IP de la máquina del entorno |
| `VPS_SSH_KEY` | Clave privada del usuario `deploy` de esa máquina |
| `GHCR_PAT` | PAT con `read:packages` |

## Preparación de la máquina (una vez)

```bash
mkdir -p /opt/projects/marketplace-b2b-carrefour-frontend
cd /opt/projects/marketplace-b2b-carrefour-frontend
# 1. copiar docker/compose.yml del repo como docker-compose.yml
# 2. crear .env a partir de docker/.env.example con valores reales:
#    IMAGE_FRONT, FRONT_PUBLISH_PORT, NEXT_PUBLIC_API_URL (+ opcionales)
```

## Flujo de despliegue

1. **Build** (workflow *Build image*): un push a `main` construye la imagen de `pre`
   automáticamente; para prod (o re-buildear pre) lanzarlo a mano con `target`. Publica
   dos tags: `:<target>-<sha7>` (inmutable) y `:<target>` (móvil).
2. **Deploy** (workflow *Deploy*): elegir `target` y opcionalmente `tag` (vacío = tag
   móvil del entorno). Hace SSH, actualiza `IMAGE_FRONT` en el `.env` y ejecuta
   `docker compose pull && up -d --remove-orphans`.

**Rollback** = relanzar *Deploy* con el tag inmutable anterior (`pre-<sha7>`). El front
no tiene estado propio (sin BD), así que el rollback es siempre seguro.

## Deploy manual (sin Actions)

```bash
ssh deploy@<host>
echo '<GHCR_PAT>' | docker login ghcr.io -u <usuario> --password-stdin
cd /opt/projects/marketplace-b2b-carrefour-frontend
sed -i 's|^IMAGE_FRONT=.*|IMAGE_FRONT=ghcr.io/<org>/marketplace-b2b-carrefour-frontend:pre-<sha7>|' .env
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
cp docker/.env.example docker/.env    # y rellenar NEXT_PUBLIC_API_URL
docker compose -f docker/compose.yml up -d --build   # sirve en 127.0.0.1:3100
```

Para desarrollo normal no hace falta Docker: `npm run dev -- -p 3100` en el host.

## Limitaciones conocidas (dependen de otros equipos)

- CI sin gate de tests: no existe infraestructura de tests en el repo
  ([docs/fix/01](fix/01_tests-inexistentes.md)).
- Config horneada en build → imagen por entorno; el paso a runtime-config + standalone
  está descrito en [docs/feature/02](feature/02_runtime-config-y-standalone.md).
