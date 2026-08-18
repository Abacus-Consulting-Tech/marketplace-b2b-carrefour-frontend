# Configuración de Proxy por Entorno

Este proyecto usa archivos de configuración de proxy separados por entorno, similar al patrón de Angular `proxy.conf.js`.

## Archivos de Configuración

```
proxy.dev.conf.js      → Desarrollo local
proxy.staging.conf.js  → Staging/Preproducción
proxy.prod.conf.js     → Producción
```

## Estructura de Configuración

Cada archivo exporta un objeto con:

```javascript
{
  backendUrl: 'https://...',  // URL del backend para este entorno
  verbose: true/false,         // Logs detallados
  rewrites: [                  // Rutas de proxy
    {
      source: '/backend/auth/:path*',
      destination: 'https://backend.com/auth/:path*',
      description: 'Authentication endpoints'
    }
  ]
}
```

## Cambiar de Entorno

### Método 1: Variable de entorno

```bash
# Development (default)
npm run dev

# Staging
NEXT_PUBLIC_ENV=staging npm run dev

# Production
NEXT_PUBLIC_ENV=production npm run dev
```

### Método 2: Script en package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:staging": "NEXT_PUBLIC_ENV=staging next dev",
    "dev:prod": "NEXT_PUBLIC_ENV=production next dev"
  }
}
```

## Variables de Entorno por Archivo

Cada entorno puede sobrescribir la URL del backend:

**.env.local** (development)
```bash
NEXT_PUBLIC_API_URL=https://marketplace-b2b-backend-dev.onrender.com
```

**.env.staging**
```bash
NEXT_PUBLIC_API_URL=https://marketplace-b2b-backend-staging.onrender.com
```

**.env.production**
```bash
NEXT_PUBLIC_API_URL=https://marketplace-b2b-backend.carrefour.com
```

## Comparación con Angular

| Angular | Next.js (este proyecto) |
|---------|-------------------------|
| `proxy.dev.conf.js` | `proxy.dev.conf.js` ✅ |
| `proxy.staging.conf.js` | `proxy.staging.conf.js` ✅ |
| `proxy.prod.conf.js` | `proxy.prod.conf.js` ✅ |
| `context` + `target` | `source` + `destination` |
| `pathRewrite` | Incluido en `destination` |
| `changeOrigin: true` | Automático en Next.js |
| `logLevel: "debug"` | `verbose: true` |

## Ejemplo de Uso

### Development

```bash
npm run dev
```

Verás en consola:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 Next.js Proxy Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Environment: development
🌐 Backend URL: https://marketplace-b2b-backend-dev.onrender.com
🔀 Rewrites: 5 routes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ /backend/auth/:path*         → Authentication endpoints
  ✓ /backend/store/:path*        → Store/catalog endpoints
  ✓ /backend/admin/:path*        → Admin panel endpoints
  ✓ /backend/vendor/:path*       → Vendor/supplier endpoints
  ✓ /backend/health              → Health check endpoint
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Staging

```bash
NEXT_PUBLIC_ENV=staging npm run dev
```

Mismo formato de logs, pero apuntando a backend de staging.

### Production

```bash
NEXT_PUBLIC_ENV=production npm run build
```

Proxy **desactivado** - frontend llama directamente al backend (requiere CORS configurado).

## Debugging

### Ver qué entorno está activo

```javascript
// En cualquier componente o API route
console.log('Environment:', process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV)
console.log('Backend URL:', process.env.NEXT_PUBLIC_API_URL)
```

### Logs de proxy

Los logs automáticos se activan cuando `verbose: true` en el archivo de configuración.

Para logs más detallados, puedes añadir en tus llamadas API:

```javascript
// En componente
fetch('/backend/store/products')
  .then(r => {
    console.log('Proxy request to:', r.url)  // Muestra URL final
    return r.json()
  })
```

## Añadir Nuevas Rutas de Proxy

Edita el archivo de entorno correspondiente:

```javascript
// proxy.dev.conf.js
rewrites: [
  // ... rutas existentes
  {
    source: '/backend/custom/:path*',
    destination: `${BACKEND_URL}/custom/:path*`,
    description: 'Custom endpoints',
  },
]
```

Reinicia el dev server para aplicar cambios.

## Notas Importantes

1. **Development/Staging**: Proxy activado (sin CORS necesario)
2. **Production**: Proxy desactivado (CORS requerido en backend)
3. Los cambios en archivos `proxy.*.conf.js` requieren reiniciar el dev server
4. Las variables de entorno se cargan al iniciar el servidor

## Referencias

- [PROXY_ARCHITECTURE.md](docs/PROXY_ARCHITECTURE.md) - Arquitectura detallada
- [BACKEND_PENDIENTE.md](docs/BACKEND_PENDIENTE.md) - Estado de integración con backend
- [Next.js Rewrites](https://nextjs.org/docs/app/api-reference/next-config-js/rewrites)
