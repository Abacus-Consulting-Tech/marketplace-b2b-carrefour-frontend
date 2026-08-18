# Configuración Pendiente - Backend Medusa (estado real)

## Resumen

El backend ya está desplegado y operativo en Render DEV. Hay dos puntos de integración a alinear entre backend y frontend.

---

## 1) CORS para frontend local

### Estado técnico

La configuración actual no usa un campo único `cors`; usa variables separadas en la configuración HTTP:

- `STORE_CORS`
- `ADMIN_CORS`
- `VENDOR_CORS`
- `AUTH_CORS`

Definido en [packages/api/medusa-config.ts](packages/api/medusa-config.ts).

### Acción backend

Incluir `http://localhost:3000` en las variables CORS que use el flujo frontend.

Ejemplo recomendado para DEV:

- `STORE_CORS=http://localhost:3000,https://marketplace-b2b-backend-dev.onrender.com`
- `AUTH_CORS=http://localhost:3000,https://marketplace-b2b-backend-dev.onrender.com`

Si el front usa rutas admin/vendedor desde local, añadir también localhost en `ADMIN_CORS` y/o `VENDOR_CORS`.

### Acción frontend

Configurar su entorno local (variables de front) para apuntar al backend DEV. Esto es responsabilidad del equipo frontend.

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

- Confirmar matriz CORS final para localhost del frontend
- Definir contrato de sesión que usará front (token-only + me, o wrapper)

---

## Referencias válidas

- [docs/medusa/README-front-usage.md](medusa/README-front-usage.md)
- [docs/medusa/smoke-test-checklist.md](medusa/smoke-test-checklist.md)
- [docs/postman/](postman/)

---

## Workarounds actuales en frontend

Mientras se confirma CORS y endpoint de perfil:

1. **Proxy API de Next.js** para evitar CORS (`/api/auth/login`)
2. **Detección de rol por email** (temporal hasta GET /admin/users/me)

Ver: [docs/CORS_WORKAROUND.md](CORS_WORKAROUND.md) y [docs/ROLES_Y_REDIRECCIONES.md](ROLES_Y_REDIRECCIONES.md)
