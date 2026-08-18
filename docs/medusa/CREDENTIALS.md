# Credenciales de desarrollo — Marketplace B2B Carrefour

> **Solo para entorno local / DEV.** Nunca usar estas contraseñas en PRE o producción.

---

## URLs

| Servicio | URL |
|---|---|
| Backend API | http://localhost:9001 |
| Admin Panel (operador) | http://localhost:9001/dashboard |
| Vendor Portal (proveedor) | http://localhost:9001/seller |
| Storefront (cliente) | http://localhost:8000 |

---

## Operador / Admin

| Campo | Valor |
|---|---|
| Email | `admin@carrefour.dev` |
| Contraseña | `supersecret` |
| Rol | Super Admin |

Creado con: `npx medusa user --email admin@carrefour.dev --password supersecret`

---

## Vendors / Sellers (Portal proveedor)

| Seller | Email | Contraseña | Estado |
|---|---|---|---|
| Sole Society | `seller@mercur.dev` | `supersecret` | open |
| Kickz Corner | `kickz@mercur.dev` | `supersecret` | open |
| Trailhead Outfitters | `trailhead@mercur.dev` | `supersecret` | open |

---

## Storefront (cliente)

No hay usuario pre-creado. Registro disponible en `/account` del storefront.

---

## Base de datos y servicios

| Servicio | Conexión |
|---|---|
| PostgreSQL | `postgres://arturocanojaraba@localhost:5432/marketplace_b2b_carrefour_backend` |
| Redis | `redis://localhost:6379` |

---

## Publishable API Key (storefront)

```
pk_5f531d8da4b9713729fdd59156319ad55307008198145fd680d24890e750224c
```

Usar en cabecera: `x-publishable-api-key: <key>`

---

## Render DEV (entorno remoto)

| Servicio | URL |
|---|---|
| Backend API | `https://marketplace-b2b-backend-dev.onrender.com` |
| Health | `https://marketplace-b2b-backend-dev.onrender.com/health` |

### Publishable API Key activa (Render DEV)

```
pk_15f89d436badff43c2366d014c88536fa0307e92aeaeab294a2ee1d29710e1b9
```

### Usuarios replicados desde local en Render

| Usuario | Contraseña | Notas |
|---|---|---|
| `admin@carrefour.dev` | `supersecret` | Usuario replicado para pruebas de auth/frontend |
| `seller@mercur.dev` | `supersecret` | Usuario replicado |
| `kickz@mercur.dev` | `supersecret` | Usuario replicado |
| `trailhead@mercur.dev` | `supersecret` | Usuario replicado |

### Cuenta operativa con permisos admin API

| Usuario | Notas |
|---|---|
| `acano@abacus-consulting.net` | Cuenta usada para operaciones admin (por ejemplo crear API keys) |
