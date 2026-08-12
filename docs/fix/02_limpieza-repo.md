# Fix: limpieza del repositorio

**Estado:** PENDIENTE

1. **`marketplace-b2b-deployment.tar.gz` (93 KB) commiteado.** Borrarlo del repo y añadir
   `*.tar.gz` a `.gitignore`. (El `.dockerignore` ya lo excluye de las imágenes.)
2. **Guías de despliegue obsoletas**: `DEPLOYMENT_GUIDE.md` y `QUICK_DEPLOYMENT.md` (PM2 + Nginx +
   certbot), `VERCEL_DEPLOYMENT.md` (Vercel, con rutas absolutas del portátil del autor) y
   `package-for-deployment.sh` (PM2/cdmon). El despliegue real es Docker (ver `docker/` y el
   `docs/DEPLOYMENT.md` del workspace). Marcar como obsoletas o borrarlas.
3. **`.env.example` mayormente muerto**: solo 2 de sus 12 variables se usan
   (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_API_TIMEOUT`) y falta la más importante
   (`NEXT_PUBLIC_MOCK_AUTH`). Variables sin ningún uso en `src/`: `NEXT_PUBLIC_TOKEN_KEY`,
   `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_ENABLE_ANALYTICS`, `NEXT_PUBLIC_ENABLE_CHAT`,
   `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_KEY`,
   `NEXT_PUBLIC_APP_URL`. Reescribirlo tomando `docker/.env.example` como referencia.
4. **Sin `engines` ni `.nvmrc`**: la versión de Node no tiene contrato en el repo (el Dockerfile
   fija Node 24). Añadir `engines` al `package.json`.
