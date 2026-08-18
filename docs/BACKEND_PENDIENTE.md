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
- El frontend usa Next.js rewrites como proxy
- No hay llamadas directas cross-origin en desarrollo

**Para producción:** 🚧 Configurar CORS
- Añadir el dominio del frontend desplegado a las variables CORS

Ejemplo para producción:

```bash
STORE_CORS=https://marketplace-frontend.carrefour.com,https://marketplace-b2b-backend-dev.onrender.com
AUTH_CORS=https://marketplace-frontend.carrefour.com,https://marketplace-b2b-backend-dev.onrender.com
ADMIN_CORS=https://marketplace-frontend.carrefour.com,https://marketplace-b2b-backend-dev.onrender.com
VENDOR_CORS=https://marketplace-frontend.carrefour.com,https://marketplace-b2b-backend-dev.onrender.com
```

### Acción frontend

✅ **Completado:**
- Proxy Next.js configurado en `next.config.js`
- Rutas `/backend/*` hacen proxy transparente al backend
- En desarrollo: sin problemas de CORS
- En producción: necesita CORS configurado en backend

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

- Configurar CORS para dominio de producción del frontend
- Definir contrato de sesión que usará front (token-only + GET /admin/users/me, o wrapper)

---

## Referencias válidas

- [docs/medusa/README-front-usage.md](medusa/README-front-usage.md)
- [docs/medusa/smoke-test-checklist.md](medusa/smoke-test-checklist.md)
- [docs/postman/](postman/)

---

## Arquitectura de integración

### Desarrollo (localhost)

Frontend usa Next.js rewrites como proxy:

```
Frontend (localhost:3000)
    ↓
    /backend/auth/* → proxy Next.js
    ↓
    https://marketplace-b2b-backend-dev.onrender.com/auth/*
```

**Ventajas:**
- ✅ Sin problemas de CORS en desarrollo
- ✅ Frontend controla su configuración
- ✅ No requiere cambios en backend para desarrollo local

### Producción

Frontend hace llamadas directas al backend:

```
Frontend (https://marketplace-frontend.carrefour.com)
    ↓
    Llamada directa HTTPS
    ↓
    https://marketplace-b2b-backend-dev.onrender.com
```

**Requisitos:**
- 🚧 Backend debe tener CORS configurado con dominio del frontend
- Variables: STORE_CORS, AUTH_CORS, ADMIN_CORS, VENDOR_CORS

Ver configuración en: [next.config.js](../next.config.js)
