# Feature: migración a Next.js 16 (retirar el riesgo aceptado de `next` 14.x)

**Estado:** PENDIENTE — bloquea el cierre del punto 2 de [docs/fix/03](../fix/03_build-roto-y-env-production.md).

## Por qué

El proyecto está pinchado en `next` 14.2.x (última: `14.2.35`). A 2026-09-02 `next`
acumula **21 advisories high** (SSRF, cache poisoning, HTTP request smuggling, DoS,
XSS, cache confusion…) con rango afectado `9.5.0 - 15.5.20`: **no existe parche dentro
de 14.x ni de 15.x**. El único fix real es `next >= 16.3.x`.

Mientras tanto el gate `audit` del CI pasa porque `audit-ci.jsonc` allowlistea el módulo
`next` como **riesgo aceptado temporal**. Esta migración es la mitigación planificada;
al terminarla hay que **borrar esa entrada de la allowlist**.

> `postcss` y `nanoid` (que también salían high, anidados bajo `next`) **no** están
> allowlisteados: se arreglaron de verdad con `overrides` en `package.json`
> (postcss `8.5.26`, nanoid `3.3.18`). No hay que tocarlos aquí.

## Alcance del breaking change (14 → 16)

Se salta la 15, así que entran los breaking changes de **ambas** mayores:

| Cambio | Impacto |
| --- | --- |
| `cookies()`, `headers()`, `draftMode()` pasan a **async** | Todo route handler / Server Component que las use |
| `params` y `searchParams` de páginas y layouts pasan a **async** | Rutas dinámicas: `/supplier/orders/[id]`, `/supplier/openings/[id]`, `/supplier/openings/[id]/quote/[categoryId]`, … |
| Caching por defecto: `fetch` y route handlers dejan de cachearse solos | Revisar dónde se asumía cache implícita |
| `next/image`: cambios de defaults y `qualities` | Revisar componentes de imagen |
| ESLint: `eslint-config-next` debe subir a la misma major | `package.json` (hoy pinchado en `14.2.5`) |

## Pasos

- [ ] `npx @next/codemod@canary upgrade latest` (aplica los codemods de async APIs)
- [ ] Subir `eslint-config-next` a la misma major que `next`
- [ ] Revisar a mano lo que el codemod no cubra: `cookies()`/`headers()`/`params` async,
      supuestos de caching en `fetch`, `next/image`
- [ ] `npx tsc --noEmit` y `npm run build` en verde
- [ ] Smoke de las rutas dinámicas y de los dos route handlers del contenedor
- [ ] `npx --yes audit-ci@^7 --config audit-ci.jsonc` sin la entrada `next` → debe pasar
- [ ] **Borrar `"next"` de la allowlist de `audit-ci.jsonc`** y el aviso del header de
      `.github/workflows/build.yml`
- [ ] Actualizar [docs/fix/03](../fix/03_build-roto-y-env-production.md) (punto 2 → resuelto)

## Tests

Hoy no hay tests ([docs/fix/01](../fix/01_tests-inexistentes.md)), así que la red de
seguridad de esta migración es el build + el smoke manual. Si para entonces existen
tests, ejecutarlos y adaptar los que rompan los cambios de async APIs.

## Riesgo

Alto: es una migración de dos majors sobre una app sin tests. Conviene hacerla en rama
propia, con el pipeline construyendo imagen de `pre` y validando en el entorno antes de
tocar `main`.
