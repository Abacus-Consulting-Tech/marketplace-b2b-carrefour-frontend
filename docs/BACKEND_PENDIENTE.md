# Configuración Pendiente - Backend Medusa (estado real)

## Resumen

El backend ya está desplegado y operativo en Render DEV. Hay dos puntos de integración a alinear entre backend y frontend.

---

## 1) CORS para frontend

### Estado técnico

El backend usa variables separadas para cada tipo de endpoint:

- `STORE_CORS`
- `ADMIN_CORS`
- `VENDOR_CORS`
- `AUTH_CORS`

Definido en [packages/api/medusa-config.ts](packages/api/medusa-config.ts).

### Acción backend

**Para desarrollo local:** ✅ No se requiere acción
- El frontend usa sistema de proxy por entornos
- No hay llamadas directas cross-origin en desarrollo ni staging
- localhost no necesita estar en variables CORS

**Para producción:** 🚧 Configurar CORS
- Añadir **únicamente** el dominio del frontend desplegado a las variables CORS
- No incluir localhost (se maneja con proxy en entornos no-prod)

Ejemplo para producción:

```bash
STORE_CORS=https://marketplace-frontend.carrefour.com,https://marketplace-b2b-backend-dev.onrender.com
AUTH_CORS=https://marketplace-frontend.carrefour.com,https://marketplace-b2b-backend-dev.onrender.com
ADMIN_CORS=https://marketplace-frontend.carrefour.com,https://marketplace-b2b-backend-dev.onrender.com
VENDOR_CORS=https://marketplace-frontend.carrefour.com,https://marketplace-b2b-backend-dev.onrender.com
```

### Acción frontend

✅ **Completado:**
- Sistema de proxy configurado por entornos (patrón Angular):
  - `proxy.dev.conf.js` - Desarrollo local
  - `proxy.staging.conf.js` - Pre-producción
  - `proxy.prod.conf.js` - Producción (sin proxy, requiere CORS)
- Rutas `/backend/*` hacen proxy transparente al backend en dev/staging
- Scripts NPM por entorno: `npm run dev`, `npm run dev:staging`, `npm run dev:prod`
- Logs detallados con banner visual mostrando rutas activas
- En desarrollo/staging: sin problemas de CORS
- En producción: sin proxy, requiere CORS configurado en backend

📖 **Documentación:**
- [PROXY_CONFIG.md](../PROXY_CONFIG.md) - Guía de uso del sistema de proxy
- [PROXY_ARCHITECTURE.md](PROXY_ARCHITECTURE.md) - Arquitectura técnica detallada

---

## 2) Datos de usuario tras login

### Estado técnico

`POST /auth/user/emailpass` devuelve token (comportamiento estándar en este flujo).

Para obtener usuario autenticado, usar endpoint de lectura posterior con bearer token:

- `GET /admin/users/me` para flujo admin

### Acción backend

No es obligatorio cambiar contrato de login para avanzar.

Si frontend requiere un formato unificado, se puede añadir endpoint wrapper dedicado (por ejemplo `/auth/session`) que devuelva `{ token, user }`.

### Acción frontend

Después del login, llamar a `GET /admin/users/me` (u otro endpoint de perfil equivalente según actor) y construir sesión con ese payload.

---

## Estado actual de integración

✅ Backend operativo:

- `GET /health` responde `200`
- Endpoints Store con publishable key responden correctamente
- Flujo auth operativo con cuentas DEV replicadas

🚧 Pendiente de alineación backend/front:

- Configurar CORS para dominio de producción del frontend (no necesario para dev/staging con proxy)
- Definir contrato de sesión que usará front (token-only + me, o wrapper)

---

## Referencias válidas

- [docs/medusa/README-front-usage.md](medusa/README-front-usage.md)
- [docs/medusa/smoke-test-checklist.md](medusa/smoke-test-checklist.md)
- [docs/medusa/DATOS_INICIALES.md](medusa/DATOS_INICIALES.md) - **Datos de ejemplo para poblar la BD**
- [docs/postman/](postman/)

---

## Workarounds actuales en frontend

Mientras se confirma CORS y endpoint de perfil:

1. **Sistema de proxy por entornos** para evitar CORS en dev/staging:
   - Desarrollo: `npm run dev` usa `proxy.dev.conf.js`
   - Staging: `npm run dev:staging` usa `proxy.staging.conf.js`
   - Producción: `npm run dev:prod` usa `proxy.prod.conf.js` (sin rewrites, requiere CORS)
   - Ver [PROXY_CONFIG.md](../PROXY_CONFIG.md) para detalles
2. **Detección de rol por email** (temporal hasta GET /admin/users/me)

Ver documentación completa:
- [PROXY_CONFIG.md](../PROXY_CONFIG.md) - Sistema de proxy por entornos
- [PROXY_ARCHITECTURE.md](PROXY_ARCHITECTURE.md) - Arquitectura técnica del proxy
- [CORS_WORKAROUND.md](CORS_WORKAROUND.md) - Workaround CORS original
- [ROLES_Y_REDIRECCIONES.md](ROLES_Y_REDIRECCIONES.md) - Detección de roles
