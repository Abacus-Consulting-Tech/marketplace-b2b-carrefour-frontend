# Configuración Pendiente - Backend Medusa

## Resumen

El frontend está funcionando con workarounds temporales. Se necesitan 2 ajustes en el backend para la integración completa.

---

## 1️⃣ CORS - Permitir Frontend Local

**Problema:**
```
Origin http://localhost:3000 is not allowed by Access-Control-Allow-Origin
```

**Solución:**

En `medusa-config.js` (o configuración equivalente), añadir el origen del frontend:

```javascript
module.exports = {
  projectConfig: {
    http: {
      cors: "http://localhost:3000,https://tu-dominio-produccion.com"
      // O para desarrollo:
      // cors: /localhost:\d+/
    }
  }
}
```

**Workaround actual en frontend:** Proxy API de Next.js

---

## 2️⃣ Endpoint de Usuario Autenticado

**Problema:**

`POST /auth/user/emailpass` solo retorna:
```json
{
  "token": "eyJhbGci..."
}
```

No incluye datos del usuario (id, email, nombre, rol).

**Solución requerida:**

Una de estas opciones:

### Opción A: Incluir usuario en login
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": "user_xxx",
    "email": "admin@carrefour.dev",
    "first_name": "Admin",
    "last_name": "User",
    "metadata": {
      "role": "admin",
      "company_name": "Carrefour"
    }
  }
}
```

### Opción B: Endpoint GET para datos del usuario
```bash
GET /auth/session
GET /store/auth/me
```

Con header: `Authorization: Bearer {token}`

Retornando el objeto `user` con los campos mínimos necesarios.

**Workaround actual en frontend:** Se crea usuario mock usando el email ingresado

---

## Estado Actual

✅ **Funcionando:**
- Health check
- Store endpoints (regions, products)
- Cart operations
- Login con workarounds

🚧 **Necesita backend:**
- CORS para localhost:3000
- Datos de usuario en auth

---

## Prioridad

**Media-Alta**: Ambos ajustes son necesarios antes de desplegar a producción.

El frontend funciona actualmente con soluciones temporales, pero para un entorno productivo se requieren estas configuraciones en el backend.

---

## Contacto

Para dudas sobre la integración frontend, revisar:
- `docs/medusa/README-front-usage.md`
- `docs/CORS_WORKAROUND.md`
- `docs/AUTH_INTEGRATION.md`
