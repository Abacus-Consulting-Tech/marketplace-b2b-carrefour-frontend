# Feature: configuración en runtime, standalone y health endpoint

**Estado:** PENDIENTE · **Habilita:** una sola imagen para pre y prod + imagen ~5× más ligera

## Situación

Toda la configuración del front (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_API_TIMEOUT`,
`NEXT_PUBLIC_MOCK_AUTH`) se inlinea en el bundle en `next build`; el rewrite de `next.config.js` se
congela en `.next/routes-manifest.json`. `docker run -e` no tiene ningún efecto. Por eso hoy:

- el compose usa `build.args` y CI construye **una imagen por entorno**;
- el Dockerfile **no** usa `output: 'standalone'` (no está activado en `next.config.js`) y copia
  `node_modules` completos: imagen ~1 GB.

## Trabajo

1. **Runtime-config**: leer config desde `window.__ENV__`, inyectado por un entrypoint que escribe
   `public/env.js` al arrancar el contenedor (o una route handler `/env.js`). Elimina los
   build-args → una imagen, promoción por digest.
2. **`output: 'standalone'`** en `next.config.js` + `CMD ["node","server.js"]` → imagen ~200 MB.
   Sin trampa de monorepo aquí: lockfile propio único, layout plano.
3. **`sharp`** como dependencia: Next 14 self-hosted sin sharp optimiza imágenes con squoosh
   (lento). Con 7 ficheros usando `next/image` contra hosts remotos, conviene.
4. **`src/app/api/health/route.ts`**: healthcheck estable (hoy el healthcheck usa `GET /`, que
   funciona porque la home cae a mock, pero es frágil).

Encaja hacerlo junto con la integración (`01_integracion-api-medusa.md`): toca los mismos ficheros.

## Al terminar

Actualizar `docker/Dockerfile` (stage runtime → standalone), `docker/compose.yml`
(`build.args` → `environment:`) y los workflows (un solo tag por sha).
