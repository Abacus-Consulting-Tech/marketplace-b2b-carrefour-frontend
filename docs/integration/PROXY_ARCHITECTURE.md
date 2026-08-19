# Arquitectura de Proxy Next.js

Este proyecto usa **Next.js Rewrites** como proxy transparente al backend Medusa, evitando problemas de CORS en desarrollo sin requerir configuración del backend.

---

## Configuración

### next.config.js

```javascript
async rewrites() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 
                     'https://marketplace-b2b-backend-dev.onrender.com'
  
  // Solo en desarrollo
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  if (!isDevelopment) return []

  return [
    // Todas las llamadas a /backend/* se redirigen al backend real
    { source: '/backend/auth/:path*', destination: `${backendUrl}/auth/:path*` },
    { source: '/backend/store/:path*', destination: `${backendUrl}/store/:path*` },
    { source: '/backend/admin/:path*', destination: `${backendUrl}/admin/:path*` },
    { source: '/backend/vendor/:path*', destination: `${backendUrl}/vendor/:path*` },
    { source: '/backend/health', destination: `${backendUrl}/health` },
  ]
}
```

---

## Flujo de Desarrollo vs Producción

### Desarrollo (localhost:3000)

```
Frontend código:
  fetch('/backend/store/products')
         ↓
  Next.js Rewrite (proxy interno)
         ↓
  https://marketplace-b2b-backend-dev.onrender.com/store/products
         ↓
  Respuesta al frontend
```

**Características:**
- ✅ Same-origin request (sin CORS)
- ✅ Transparente para el código del frontend
- ✅ No requiere configuración en backend
- ✅ Logs de proxy en consola del dev server

### Producción (dominio desplegado)

```
Frontend código:
  fetch('/backend/store/products')
         ↓
  404 (rewrites deshabilitados en producción)
```

En producción, el frontend debe usar URLs completas:

```javascript
const backendUrl = process.env.NEXT_PUBLIC_API_URL
fetch(`${backendUrl}/store/products`)
```

Y el backend **debe tener CORS configurado** con el dominio del frontend.

---

## Uso en el Código

### Clientes API

Los clientes detectan automáticamente el entorno:

**mercur-store-client.ts:**
```typescript
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'development') {
    return '/backend/store'  // Usa proxy
  }
  return process.env.NEXT_PUBLIC_MERCUR_STORE_API  // URL completa
}
```

**api/auth/login/route.ts:**
```typescript
const backendUrl = process.env.NODE_ENV === 'development' 
  ? '/backend/auth/user/emailpass'  // Proxy
  : `${process.env.NEXT_PUBLIC_API_URL}/auth/user/emailpass`  // Directo
```

---

## Ventajas de este Enfoque

### vs CORS en Backend

| Aspecto | Proxy Frontend | CORS Backend |
|---------|----------------|--------------|
| Desarrollo local | ✅ No requiere backend | ❌ Requiere configurar backend |
| Producción | ❌ Necesita CORS | ✅ Nativo |
| Control | ✅ Frontend decide | ❌ Depende de backend |
| Debugging | ✅ Logs en dev server | ⚠️ Solo en backend |

### vs Angular Proxy Config

Next.js rewrites son equivalentes a `proxy.config.js` de Angular:

**Angular:**
```javascript
{
  context: ["/api"],
  target: "https://backend.com",
  changeOrigin: true
}
```

**Next.js:**
```javascript
{
  source: '/api/:path*',
  destination: 'https://backend.com/:path*'
}
```

---

## Debugging

### Ver Logs del Proxy

Cuando arrancas el dev server, verás:

```
🔄 Next.js Proxy enabled for development
📡 Backend URL: https://marketplace-b2b-backend-dev.onrender.com
```

### Verificar Rutas

```bash
# En navegador dev tools - Network tab
# Verás:
Request URL: http://localhost:3000/backend/store/products
Status: 200

# La request va realmente a:
https://marketplace-b2b-backend-dev.onrender.com/store/products
```

### Desactivar Proxy (para testing)

```bash
# .env.local
NODE_ENV=production
npm run dev
```

Esto fuerza llamadas directas al backend (útil para probar CORS).

---

## Variables de Entorno

### Desarrollo

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://marketplace-b2b-backend-dev.onrender.com
NEXT_PUBLIC_MERCUR_STORE_API=https://marketplace-b2b-backend-dev.onrender.com/store
NODE_ENV=development  # (automático con npm run dev)
```

### Producción

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api-produccion.carrefour.com
NEXT_PUBLIC_MERCUR_STORE_API=https://api-produccion.carrefour.com/store
NODE_ENV=production  # (automático con npm run build)
```

---

## Limitaciones

### ❌ No funciona para:
- Server-side requests en producción (usa URL completa siempre)
- Requests desde servicios externos
- Webhooks del backend al frontend

### ✅ Funciona para:
- Client-side requests en desarrollo
- Todas las llamadas fetch/axios desde componentes
- API Routes de Next.js llamando al backend

---

## Migración a Producción

Cuando despliegues a producción:

1. **Frontend:** Las variables de entorno apuntarán al backend de producción
2. **Backend:** Configurar CORS con el dominio del frontend:

```bash
# Backend env vars
STORE_CORS=https://marketplace.carrefour.com
AUTH_CORS=https://marketplace.carrefour.com
ADMIN_CORS=https://marketplace.carrefour.com
VENDOR_CORS=https://marketplace.carrefour.com
```

3. **Rewrites se desactivan automáticamente** (solo corren en development)

---

## Referencias

- [Next.js Rewrites Docs](https://nextjs.org/docs/app/api-reference/next-config-js/rewrites)
- [next.config.js](../next.config.js) - Configuración actual
- [BACKEND_PENDIENTE.md](BACKEND_PENDIENTE.md) - Estado de integración
