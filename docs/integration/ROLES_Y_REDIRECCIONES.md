# Roles y Redirecciones - Guía de Usuario

## Modos de Autenticación

### 1. Mock Mode (Desarrollo Local)

**Configuración:** `.env.local`
```bash
NEXT_PUBLIC_MOCK_AUTH=true
```

**Credenciales de prueba:**

| Usuario | Email | Contraseña | Rol | Redirige a |
|---------|-------|------------|-----|------------|
| Admin | `admin@test.com` | `admin123` | `admin` | `/admin/dashboard` |
| Franquiciado | `franchisee@test.com` | `franchisee123` | `franchisee` | `/marketplace/dashboard` |
| Proveedor | `supplier@test.com` | `supplier123` | `supplier` | `/supplier/dashboard` |

---

### 2. Backend Medusa (DEV en Render)

**Configuración:** `.env.local`
```bash
NEXT_PUBLIC_MOCK_AUTH=false
NEXT_PUBLIC_API_URL=https://marketplace-b2b-backend-dev.onrender.com
```

**Credenciales Carrefour:**

| Usuario | Email | Contraseña | Rol Detectado | Redirige a |
|---------|-------|------------|---------------|------------|
| Admin Carrefour | `admin@carrefour.dev` | `supersecret` | `admin` | `/admin/dashboard` |
| Admin Operativo | `acano@abacus-consulting.net` | (consultar) | `admin` | `/admin/dashboard` |

**Credenciales Proveedores:**

| Proveedor | Email | Contraseña | Rol Detectado | Redirige a |
|-----------|-------|------------|---------------|------------|
| Sole Society | `seller@mercur.dev` | `supersecret` | `supplier` | `/supplier/dashboard` |
| Kickz Corner | `kickz@mercur.dev` | `supersecret` | `supplier` | `/supplier/dashboard` |
| Trailhead Outfitters | `trailhead@mercur.dev` | `supersecret` | `supplier` | `/supplier/dashboard` |

---

## Detección Automática de Roles (Backend Medusa)

Como el backend actualmente solo retorna un token JWT sin datos del usuario, el frontend **deduce el rol del email**:

```javascript
// Lógica de detección:
if (email.includes('admin') || email.includes('acano')) {
  role = 'admin'
} else if (email.includes('seller') || email.includes('mercur') || 
           email.includes('kickz') || email.includes('trailhead')) {
  role = 'supplier'
} else {
  role = 'franchisee' // Por defecto
}
```

---

## Dashboards Disponibles

### 1. Admin Dashboard
**Ruta:** `/admin/dashboard`  
**Acceso:** Solo usuarios con role `admin`  
**Funcionalidades:**
- Gestión de usuarios
- Estadísticas globales
- Configuración del sistema
- Gestión de proveedores y franquiciados

### 2. Marketplace Dashboard (Franquiciado)
**Ruta:** `/marketplace/dashboard`  
**Acceso:** Usuarios con role `franchisee` o `admin`  
**Funcionalidades:**
- Ver pedidos recientes
- Estadísticas de compras
- Acceso rápido al catálogo
- Gestión de perfil

### 3. Supplier Dashboard (Proveedor)
**Ruta:** `/supplier/dashboard`  
**Acceso:** Solo usuarios con role `supplier`  
**Funcionalidades:**
- Gestión de productos
- Ver pedidos entrantes
- Estadísticas de ventas
- Catálogo de productos

---

## Protección de Rutas

Cada layout verifica automáticamente el rol del usuario:

- **`(marketplace)`**: Requiere `franchisee` o `admin`
- **`(backoffice)/admin`**: Requiere `admin`
- **`(supplier)`**: Requiere `supplier`

Si un usuario intenta acceder a una ruta sin el rol adecuado, es redirigido automáticamente a su dashboard correspondiente.

---

## Cambiar entre Modos

### De Mock a Backend Medusa:

1. Edita `.env.local`:
   ```bash
   NEXT_PUBLIC_MOCK_AUTH=false
   ```

2. Limpia el localStorage:
   ```javascript
   // En DevTools Console:
   localStorage.clear()
   ```

3. Reinicia el dev server:
   ```bash
   npm run dev
   ```

4. Login con credenciales de Medusa

### De Backend Medusa a Mock:

1. Edita `.env.local`:
   ```bash
   NEXT_PUBLIC_MOCK_AUTH=true
   ```

2. Limpia el localStorage:
   ```javascript
   localStorage.clear()
   ```

3. Reinicia el dev server:
   ```bash
   npm run dev
   ```

4. Login con credenciales mock

---

## Troubleshooting

### "404 después de login"
- Verifica que el role esté bien asignado (check DevTools → Application → Local Storage → `auth-storage`)
- Asegúrate de que la ruta del dashboard exista para ese rol

### "Redirigido a dashboard incorrecto"
- El rol se está detectando incorrectamente
- Verifica el patrón del email en el auth proxy ([src/app/api/auth/login/route.ts](../src/app/api/auth/login/route.ts))

### "No puedo acceder a ninguna ruta"
- Verifica que `isAuthenticated: true` en localStorage
- Verifica que `_hasHydrated: true` en el store de Zustand
- Limpia localStorage y vuelve a hacer login

---

## Pendiente (Backend)

Para una solución definitiva, el backend debería retornar:

```json
{
  "token": "...",
  "user": {
    "id": "user_xxx",
    "email": "admin@carrefour.dev",
    "first_name": "Admin",
    "last_name": "User",
    "metadata": {
      "role": "admin"  // ← Rol explícito del backend
    }
  }
}
```

Mientras tanto, la detección por email funciona correctamente para el entorno DEV.
