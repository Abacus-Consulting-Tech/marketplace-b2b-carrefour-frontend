# Fix: build roto en dev, npm audit rojo y .env.production versionado

**Estado:** PENDIENTE

Los tres puntos bloquean o comprometen el pipeline de CI/CD (`.github/workflows/build.yml`).
Hasta resolver 1 y 2, todo push a `main`/`dev` quedará rojo en los gates `audit` y `build`
— es el comportamiento esperado, no un fallo del pipeline.

1. **`dev` no compila.** `src/lib/api/orders-supplier-client.ts:295-300` quedó con un
   artefacto de merge en el commit `a149b35` ("feat: integrate supplier orders backend
   endpoints"): `return data.order || data.toISOString(),` seguido de código mock huérfano.
   Reproducir: `npx tsc --noEmit` (8 errores TS1005/TS1109) o `npm run build`. Bloquea el
   job `build`. Propuesta: comparar con la versión del mismo fichero en
   `origin/medusa-update`, que no arrastra el artefacto.
2. **`npm audit` rojo.** 3 vulnerabilidades high por `postcss < 8.4.31` anidado en
   `next@14.2.5`. Fix: `npm i next@14.2.35` (es exactamente lo que propone
   `npm audit fix --force`; parche de la misma minor, sin breaking changes esperables).
   Bloquea el job `audit`.
3. **`.env.production` versionado con un `VERCEL_OIDC_TOKEN`** (commit `be89f23`) en un
   repo público. Los token OIDC de Vercel caducan en horas, pero aun así: sacarlo del
   índice (`git rm --cached .env.production`), añadir `.env.production` a `.gitignore` y
   mover los `NEXT_PUBLIC_MOCK_*=true` que contiene a la configuración del proyecto en
   Vercel. El `.dockerignore` ya evita que este fichero entre en las imágenes Docker (el
   Dockerfile genera el suyo propio).
