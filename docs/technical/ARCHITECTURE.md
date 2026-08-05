# Arquitectura Técnica - Marketplace B2B Carrefour

## Índice

- [Visión General](#visión-general)
- [Arquitectura Frontend](#arquitectura-frontend)
- [Módulos y Componentes](#módulos-y-componentes)
- [Gestión de Estado](#gestión-de-estado)
- [Routing y Navegación](#routing-y-navegación)
- [Integración con Backend](#integración-con-backend)
- [Seguridad](#seguridad)
- [Performance y Optimización](#performance-y-optimización)

## Visión General

La arquitectura del frontend del Marketplace B2B Carrefour está diseñada siguiendo principios de:
- **Modularidad**: Componentes reutilizables y independientes
- **Escalabilidad**: Preparado para crecer con nuevas funcionalidades
- **Mantenibilidad**: Código limpio y bien documentado
- **Performance**: Carga rápida y experiencia fluida

## Arquitectura Frontend

### Estructura de Capas

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages/     │  │  Components/ │  │   Layouts/   │  │
│  │   Views      │  │     UI       │  │   Templates  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Stores/    │  │   Services/  │  │    Hooks/    │  │
│  │    State     │  │   Business   │  │   Composables│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                     DATA ACCESS LAYER                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │     API      │  │    Cache/    │  │   Storage/   │  │
│  │   Client     │  │  Repository  │  │  LocalData   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Estructura de Directorios (Next.js 14 App Router)

```
marketplace-b2b-frontend/
├── public/                 # Recursos estáticos públicos
│   ├── images/
│   └── fonts/
├── src/
│   ├── app/               # App Router (Next.js 14)
│   │   ├── (auth)/        # Route group para auth
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (franchisee)/  # Route group para franquiciados
│   │   │   ├── dashboard/
│   │   │   ├── orders/
│   │   │   └── profile/
│   │   ├── (supplier)/    # Route group para proveedores
│   │   │   ├── dashboard/
│   │   │   ├── catalog/
│   │   │   └── orders/
│   │   ├── catalog/       # Catálogo público
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # Componentes reutilizables
│   │   ├── ui/           # Componentes Shadcn/ui
│   │   ├── franchisees/  # Componentes específicos
│   │   ├── suppliers/
│   │   ├── catalog/
│   │   ├── orders/
│   │   ├── cart/
│   │   └── issues/
│   ├── lib/              # Utilidades y configuración
│   │   ├── api/          # Cliente API
│   │   │   ├── client.ts
│   │   │   ├── franchisees.ts
│   │   │   ├── suppliers.ts
│   │   │   ├── catalog.ts
│   │   │   ├── orders.ts
│   │   │   └── issues.ts
│   │   ├── hooks/        # Custom React Hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useCart.ts
│   │   │   └── useNotifications.ts
│   │   ├── store/        # Zustand stores
│   │   │   ├── auth.ts
│   │   │   ├── cart.ts
│   │   │   └── ui.ts
│   │   ├── utils.ts      # Utilidades generales
│   │   └── cn.ts         # Shadcn utils
│   ├── types/            # TypeScript types/interfaces
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── index.ts
│   └── styles/           # Estilos globales
│       └── globals.css   # Tailwind + custom styles
├── .env.local            # Variables de entorno
├── .env.example
├── next.config.js        # Configuración Next.js
├── tailwind.config.ts    # Configuración Tailwind
├── tsconfig.json         # Configuración TypeScript
├── components.json       # Configuración Shadcn/ui
└── package.json
```

## Módulos y Componentes

### Componentes Shadcn/ui

Los componentes de Shadcn/ui se instalan bajo demanda en `src/components/ui/`:

```bash
# Ejemplo: Instalar componente Button
npx shadcn-ui@latest add button

# Instalar múltiples componentes
npx shadcn-ui@latest add button input card dialog table
```

Componentes comunes a utilizar:
- **button** - Botones con variantes
- **input** - Campos de entrada
- **card** - Tarjetas de contenido
- **dialog** - Modales y diálogos
- **table** - Tablas de datos
- **form** - Componentes de formulario
- **select** - Selectores dropdown
- **toast** - Notificaciones
- **badge** - Etiquetas y badges
- **avatar** - Avatares de usuario

## Módulos y Componentes

### Módulos Principales

#### 1. Módulo de Autenticación
- Login/Logout (Server Actions)
- Registro de usuarios
- Recuperación de contraseña
- Gestión de sesiones (JWT)
- Middleware de roles y permisos

#### 2. Módulo de Franquiciados
- Dashboard con Server Components
- Perfil y configuración
- Gestión de establecimiento
- Historial de actividad

#### 3. Módulo de Proveedores
- Dashboard de proveedor
- Gestión de catálogo (Client Components para interactividad)
- Gestión de pedidos recibidos
- Métricas y estadísticas

#### 4. Módulo de Catálogo
- Listado de productos
- Búsqueda y filtros avanzados
- Detalle de producto
- Comparador de productos
- Categorías y subcategorías

#### 5. Módulo de Órdenes
- Creación de pedidos
- Seguimiento de pedidos
- Estados del pedido
- Historial de pedidos
- Detalles y documentación

#### 6. Módulo de Compras
- Carrito de compras
- Proceso de checkout
- Métodos de pago
- Confirmación de compra
- Facturación

#### 7. Módulo de Incidencias
- Creación de tickets
- Seguimiento de incidencias
- Chat/Comunicación
- Resolución y cierre
- Historial de incidencias

## Gestión de Estado

### Arquitectura de Estado: React Query + Zustand

```javascript
// Ejemplo de estructura de estado
{
  auth: {
    user: {},
    token: '',
    isAuthenticated: false,
    role: ''
  },
  franchisees: {
    list: [],
    current: {},
    loading: false,
    error: null
  },
  suppliers: {
    list: [],
    current: {},
    loading: false,
    error: null
  },
  catalog: {
    products: [],
    categories: [],
    filters: {},
    pagination: {},
    loading: false
  },
  cart: {
    items: [],
    total: 0,
## Gestión de Estado

### Arquitectura de Estado: React Query + Zustand

**React Query (TanStack Query)** - Para datos del servidor:
- Fetching y caching de datos de la API
- Sincronización automática
- Revalidación optimista
- Gestión de loading y error states

**Zustand** - Para estado de UI y cliente:
- Estado global ligero
- Sin boilerplate
- DevTools integration

### Ejemplo: Zustand Store

```typescript
// src/lib/store/cart.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  productId: string
  quantity: number
  price: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ 
        items: [...state.items, item] 
      })),
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(i => i.productId !== productId)
      })),
      clearCart: () => set({ items: [] })
    }),
    { name: 'cart-storage' }
  )
)
```

### Ejemplo: React Query Hook

```typescript
// src/lib/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/lib/api/catalog'

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
```

### División de Responsabilidades

**React Query** (Datos del servidor):
- Lista de productos
- Pedidos
- Perfil de usuario
- Datos de proveedores

**Zustand** (Estado de UI):
- Carrito de compras
- Estado de auth (token)
- UI (modales, notificaciones)
- Preferencias de usuario

## Routing y Navegación

### App Router (Next.js 14)

Next.js 14 utiliza el App Router basado en el sistema de archivos:

```typescript
// Ejemplo de estructura de rutas
app/
├── (auth)/           # Route Group (no afecta URL)
│   ├── login/
│   │   └── page.tsx  # /login
│   └── register/
│       └── page.tsx  # /register
├── (franchisee)/
│   ├── layout.tsx    # Layout compartido
│   ├── dashboard/
│   │   └── page.tsx  # /dashboard
│   └── orders/
│       ├── page.tsx        # /orders
│       └── [id]/
│           └── page.tsx    # /orders/[id]
├── catalog/
│   ├── page.tsx           # /catalog
│   └── [id]/
│       └── page.tsx       # /catalog/[id]
└── page.tsx               # /
```

### Middleware para Autenticación

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  
  // Rutas protegidas
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/orders/:path*', '/profile/:path*']
}
```

### Navegación Programática

```typescript
// Client Component
'use client'

import { useRouter } from 'next/navigation'

export function ProductCard({ id }: { id: string }) {
  const router = useRouter()
  
  return (
    <button onClick={() => router.push(`/catalog/${id}`)}>
      Ver detalle
    </button>
  )
}
```

### Link Navigation

```typescript
import Link from 'next/link'

export function Navigation() {
  return (
    <nav>
      <Link href="/catalog">Catálogo</Link>
      <Link href="/orders">Pedidos</Link>
      <Link href="/cart">Carrito</Link>
    </nav>
  )
}
    ]
  },
  {
    path: '/supplier',
    component: DefaultLayout,
    meta: { requiresAuth: true, role: 'supplier' },
    children: [
      { path: 'dashboard', name: 'SupplierDashboard', component: SupplierDashboard },
      { path: 'catalog', name: 'SupplierCatalog', component: SupplierCatalog },
      { path: 'orders', name: 'SupplierOrders', component: SupplierOrders },
      { path: 'profile', name: 'SupplierProfile', component: SupplierProfile }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: Login },
      { path: 'register', name: 'Register', component: Register },
      { path: 'forgot-password', name: 'ForgotPassword', component: ForgotPassword }
    ]
  }
]
```

### Guards de Navegación

- **Authentication Guard**: Verifica autenticación
- **Role Guard**: Verifica permisos según rol
- **Data Prefetch Guard**: Carga datos necesarios

## Integración con Backend

### API Client (Axios)

```typescript
// src/lib/api/client.ts
import axios from 'axios'
import { cookies } from 'next/headers'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    // En cliente: obtener de localStorage o cookie
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('auth-token')
      : null
      
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    // Manejo de errores
    if (error.response?.status === 401) {
      // Redirigir a login
    }
    return Promise.reject(error)
  }
)
```

### Endpoints Principales

- **Auth**: `/api/auth/login`, `/api/auth/register`
- **Franchisees**: `/api/franchisees`, `/api/franchisees/:id`
- **Suppliers**: `/api/suppliers`, `/api/suppliers/:id`
- **Catalog**: `/api/products`, `/api/products/:id`, `/api/categories`
- **Orders**: `/api/orders`, `/api/orders/:id`
- **Purchases**: `/api/purchases`, `/api/purchases/:id`
- **Issues**: `/api/issues`, `/api/issues/:id`

## Seguridad

### Medidas de Seguridad

1. **Autenticación JWT**
   - Tokens de acceso y refresh
   - Almacenamiento seguro de tokens

2. **Autorización basada en roles**
   - RBAC (Role-Based Access Control)
   - Guards de navegación

3. **Validación de datos**
   - Validación en frontend y backend
   - Sanitización de inputs

4. **HTTPS**
   - Todas las comunicaciones encriptadas

5. **CSP (Content Security Policy)**
   - Prevención de XSS

6. **CORS**
   - Configuración apropiada de CORS

## Performance y Optimización

### Estrategias de Optimización

1. **Code Splitting**
   - Lazy loading de rutas
   - Carga bajo demanda de componentes

2. **Caching**
   - Service Workers
   - Cache de API responses
   - LocalStorage para datos persistentes

3. **Optimización de imágenes**
   - Lazy loading de imágenes
   - Formatos modernos (WebP)
   - CDN para assets

4. **Bundle optimization**
   - Tree shaking
   - Minificación
   - Compresión Gzip/Brotli

5. **Virtualización**
   - Listas virtualizadas para grandes conjuntos de datos

6. **Debouncing y Throttling**
   - En búsquedas y eventos frecuentes

## Responsive Design

### Breakpoints

```scss
// Mobile first approach
$breakpoints: (
  'mobile': 320px,
  'tablet': 768px,
  'desktop': 1024px,
  'wide': 1440px
);
```

### Estrategia Mobile-First

- Diseño adaptable a todos los dispositivos
- Touch-friendly interfaces
- Progressive enhancement

---

**Última actualización**: 5 de agosto de 2026
