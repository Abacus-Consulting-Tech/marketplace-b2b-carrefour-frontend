# Guía de Desarrollo - Marketplace B2B Carrefour

## Índice

- [Requisitos Previos](#requisitos-previos)
- [Configuración del Entorno](#configuración-del-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guías de Código](#guías-de-código)
- [Workflow de Desarrollo](#workflow-de-desarrollo)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Requisitos Previos

### Software Necesario

```bash
# Node.js (LTS version)
node --version  # v18.x o superior

# npm o yarn
npm --version   # v9.x o superior
yarn --version  # v1.22.x o superior (opcional)

# Git
git --version   # v2.x o superior
```

### Herramientas Recomendadas

**Editor de Código**:
- Visual Studio Code (recomendado)
- WebStorm
- Sublime Text

**Extensiones VS Code recomendadas**:
- ESLint
- Prettier
- Vetur (para Vue) / ES7+ React snippets (para React)
- Auto Rename Tag
- GitLens
- Path Intellisense
- TODO Highlight

**Navegadores para Testing**:
- Chrome/Edge (con DevTools)
- Firefox
- Safari (para desarrollo macOS)

---

## Configuración del Entorno

### 1. Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/carrefour/marketplace-b2b-frontend.git

# Navegar al directorio
cd marketplace-b2b-frontend
```

### 2. Instalar Dependencias

```bash
# Usando npm
npm install

# O usando yarn
yarn install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```bash
# .env.local (ejemplo)

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_API_TIMEOUT=10000

# Authentication
NEXT_PUBLIC_TOKEN_KEY=carrefour_b2b_token
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_CHAT=false

# Environment
NODE_ENV=development

# External Services
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx

# Optional
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Iniciar el Servidor de Desarrollo

```bash
# Usando npm
npm run dev

# O usando yarn
yarn dev
```

La aplicación estará disponible en: `http://localhost:8080` (o el puerto configurado)

---

## Estructura del Proyecto

```
marketplace-b2b-carrefour-frontend/
├── .vscode/                    # Configuración de VS Code
├── public/                     # Archivos públicos estáticos
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
├── src/                        # Código fuente
│   ├── assets/                # Recursos (imágenes, fuentes, etc.)
│   ├── components/            # Componentes reutilizables
│   ├── layouts/               # Layouts de la aplicación
│   ├── pages/                 # Páginas/Vistas
│   ├── router/                # Configuración de rutas
│   ├── store/                 # Estado global (Vuex/Pinia/Redux)
│   ├── services/              # Servicios API
│   ├── composables/           # Composables/Hooks
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Utilidades
│   ├── styles/                # Estilos globales
│   ├── config/                # Configuración
│   ├── App.vue               # Componente raíz
│   └── main.js               # Punto de entrada
├── tests/                     # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                      # Documentación
├── .env.example              # Ejemplo de variables de entorno
├── .eslintrc.js              # Configuración ESLint
├── .prettierrc               # Configuración Prettier
├── .gitignore                # Git ignore
├── package.json              # Dependencias y scripts
├── README.md                 # Readme principal
├── tsconfig.json             # Configuración TypeScript (si aplica)
└── vite.config.js            # Configuración del bundler
```

---

## Guías de Código

### Convenciones de Nomenclatura

#### Archivos
```bash
# Componentes: PascalCase
UserProfile.vue
ProductCard.vue
OrderList.vue

# Utilidades/Servicios: camelCase
authService.js
formatters.js
validators.js

# Constantes: UPPER_SNAKE_CASE
API_ENDPOINTS.js
APP_CONSTANTS.js
```

#### Variables y Funciones
```javascript
// Variables: camelCase
const userName = 'Juan'
const orderTotal = 100

// Constantes: UPPER_SNAKE_CASE
const MAX_ITEMS = 100
const API_URL = 'https://api.example.com'

// Funciones: camelCase (verbos)
function getUserData() {}
function calculateTotal() {}
function handleSubmit() {}

// Componentes: PascalCase
const UserProfile = {}
```

#### Clases e Interfaces (TypeScript)
```typescript
// Clases: PascalCase
class UserManager {}
class ProductService {}

// Interfaces: PascalCase con prefijo 'I' (opcional)
interface IUser {}
interface Product {}

// Types: PascalCase
type OrderStatus = 'pending' | 'confirmed' | 'shipped'
```

### Estructura de Componentes

#### Vue (Composition API)
```vue
<template>
  <div class="component-name">
    <!-- Template content -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  title: String,
  items: Array
})

// Emits
const emit = defineEmits(['update', 'delete'])

// State
const isLoading = ref(false)

// Computed
const itemCount = computed(() => props.items.length)

// Methods
const handleClick = () => {
  emit('update', data)
}

// Lifecycle
onMounted(() => {
  // Initialize
})
</script>

<style scoped>
.component-name {
  /* Component styles */
}
</style>
```

#### React (Functional Component)
```jsx
import React, { useState, useEffect } from 'react'
import './ComponentName.css'

interface ComponentNameProps {
  title: string
  items: Item[]
  onUpdate: (data: any) => void
}

const ComponentName: React.FC<ComponentNameProps> = ({ title, items, onUpdate }) => {
  // State
  const [isLoading, setIsLoading] = useState(false)

  // Effects
  useEffect(() => {
    // Initialize
  }, [])

  // Handlers
  const handleClick = () => {
    onUpdate(data)
  }

  return (
    <div className="component-name">
      {/* Component content */}
    </div>
  )
}

export default ComponentName
```

### Estándares de Código

#### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended', // o 'plugin:react/recommended'
    'prettier'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
    'prefer-const': 'error',
    'no-var': 'error'
  }
}
```

#### Prettier Configuration
```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "none",
  "arrowParens": "avoid"
}
```

### Mejores Prácticas

#### Componentes
- Un componente por archivo
- Mantener componentes pequeños y enfocados (Single Responsibility)
- Usar props para datos de entrada
- Usar eventos para comunicación hacia arriba
- Evitar lógica compleja en templates
- Extraer lógica reutilizable a composables/hooks

#### Estado
- Usar estado local cuando sea posible
- Estado global solo para datos compartidos
- Inmutabilidad en actualizaciones de estado
- Normalizar datos complejos

#### Performance
- Lazy loading de componentes
- Virtualización para listas grandes
- Debounce/throttle en eventos frecuentes
- Memoización de cálculos costosos
- Optimización de imágenes

#### Seguridad
- Validar y sanitizar inputs
- Evitar innerHTML sin sanitizar
- No exponer información sensible
- HTTPS en producción
- Validar tokens JWT

---

## Workflow de Desarrollo

### Git Workflow

#### Estructura de Branches
```
main                    # Producción
├── develop            # Desarrollo principal
│   ├── feature/xxx   # Nuevas funcionalidades
│   ├── bugfix/xxx    # Correcciones de bugs
│   ├── hotfix/xxx    # Correcciones urgentes
│   └── release/xxx   # Preparación de releases
```

#### Convenciones de Commits

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Formato
<type>(<scope>): <subject>

# Tipos
feat:      Nueva funcionalidad
fix:       Corrección de bug
docs:      Cambios en documentación
style:     Cambios de formato (no afectan código)
refactor:  Refactorización de código
test:      Agregar o modificar tests
chore:     Tareas de mantenimiento
perf:      Mejoras de performance

# Ejemplos
feat(catalog): add product comparison feature
fix(orders): resolve pagination issue
docs(api): update endpoints documentation
refactor(auth): simplify login logic
test(cart): add unit tests for cart service
```

#### Proceso de Desarrollo

1. **Crear una nueva branch desde develop**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-funcionalidad
```

2. **Desarrollar y hacer commits**
```bash
git add .
git commit -m "feat(module): description"
```

3. **Mantener actualizado con develop**
```bash
git fetch origin
git rebase origin/develop
```

4. **Push y crear Pull Request**
```bash
git push origin feature/nombre-funcionalidad
# Crear PR en GitHub/GitLab
```

5. **Code Review y Merge**
- Al menos un revisor debe aprobar
- Pasar todos los tests
- Resolver conflictos si existen
- Merge a develop

### Code Review Checklist

- [ ] El código funciona correctamente
- [ ] El código sigue las convenciones del proyecto
- [ ] No hay código duplicado
- [ ] Los nombres son descriptivos
- [ ] Los tests pasan
- [ ] No hay console.logs o debuggers
- [ ] La documentación está actualizada
- [ ] No hay código comentado innecesario
- [ ] Performance es aceptable
- [ ] Seguridad: no hay vulnerabilidades

---

## Testing

### Tipos de Tests

#### 1. Unit Tests (Pruebas Unitarias)

**Framework**: Jest, Vitest

```javascript
// Example: productService.test.js
import { describe, it, expect } from 'vitest'
import { calculateTotal } from '@/services/productService'

describe('productService', () => {
  describe('calculateTotal', () => {
    it('should calculate total correctly', () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 5, quantity: 3 }
      ]
      const total = calculateTotal(items)
      expect(total).toBe(35)
    })

    it('should return 0 for empty array', () => {
      const total = calculateTotal([])
      expect(total).toBe(0)
    })
  })
})
```

**Ejecutar tests unitarios**:
```bash
npm run test:unit
npm run test:unit -- --watch  # Modo watch
npm run test:unit -- --coverage  # Con coverage
```

#### 2. Component Tests

```javascript
// Example: ProductCard.test.js
import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'

describe('ProductCard', () => {
  it('renders product information', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: {
          name: 'Test Product',
          price: 100
        }
      }
    })
    
    expect(wrapper.text()).toContain('Test Product')
    expect(wrapper.text()).toContain('100')
  })

  it('emits add-to-cart event', async () => {
    const wrapper = mount(ProductCard, {
      props: { product: { id: 1, name: 'Test' } }
    })
    
    await wrapper.find('.add-to-cart-btn').trigger('click')
    expect(wrapper.emitted('add-to-cart')).toBeTruthy()
  })
})
```

#### 3. Integration Tests

```javascript
// Example: checkout.integration.test.js
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import CheckoutPage from '@/pages/CheckoutPage.vue'

describe('Checkout Integration', () => {
  it('completes checkout flow', async () => {
    const store = createStore({ /* ... */ })
    const wrapper = mount(CheckoutPage, {
      global: { plugins: [store] }
    })
    
    // Fill form
    await wrapper.find('#address').setValue('Test Address')
    await wrapper.find('#payment').setValue('card')
    
    // Submit
    await wrapper.find('form').trigger('submit')
    
    // Verify
    expect(store.state.orders.current).toBeTruthy()
  })
})
```

#### 4. E2E Tests (End-to-End)

**Framework**: Cypress, Playwright

```javascript
// Example: checkout.e2e.js
describe('Checkout Flow', () => {
  it('completes a purchase', () => {
    cy.visit('/catalog')
    
    // Add product to cart
    cy.get('[data-testid="product-card"]').first().click()
    cy.get('[data-testid="add-to-cart"]').click()
    
    // Go to cart
    cy.get('[data-testid="cart-icon"]').click()
    
    // Proceed to checkout
    cy.get('[data-testid="checkout-btn"]').click()
    
    // Fill checkout form
    cy.get('#address').type('Test Address 123')
    cy.get('#payment').select('card')
    
    // Complete purchase
    cy.get('[data-testid="confirm-btn"]').click()
    
    // Verify success
    cy.url().should('include', '/order-confirmation')
    cy.contains('Pedido confirmado').should('be.visible')
  })
})
```

**Ejecutar E2E tests**:
```bash
npm run test:e2e
npm run test:e2e:ci  # Para CI/CD
```

### Coverage

Mantener un coverage mínimo:
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

```bash
npm run test:coverage
```

---

## Deployment

### Build para Producción

```bash
# Build
npm run build

# Preview build localmente
npm run preview
```

### Entornos

#### Development
```bash
npm run dev
# URL: http://localhost:8080
```

#### Staging
```bash
npm run build:staging
# Deploy to staging server
```

#### Production
```bash
npm run build
# Deploy to production server
```

### Variables de Entorno por Ambiente

```bash
# .env.development
VUE_APP_API_URL=http://localhost:3000/api

# .env.staging
VUE_APP_API_URL=https://staging-api.carrefour-b2b.com/api

# .env.production
VUE_APP_API_URL=https://api.carrefour-b2b.com/api
```

### CI/CD Pipeline (Ejemplo)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run test:e2e:ci

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: actions/upload-artifact@v2
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v2
      - name: Deploy to Server
        run: |
          # Deploy script
```

---

## Troubleshooting

### Problemas Comunes

#### 1. Errores de Instalación de Dependencias

```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### 2. Errores de Build

```bash
# Verificar versión de Node
node --version

# Verificar variables de entorno
cat .env.local

# Build con verbose
npm run build -- --verbose
```

#### 3. Problemas con CORS

Configurar proxy en `vite.config.js`:

```javascript
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
}
```

#### 4. Performance Issues

```bash
# Analizar bundle size
npm run build -- --report

# Identificar dependencias grandes
npm run analyze
```

### Logs y Debugging

```javascript
// Development only logs
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}

// Vue DevTools
// Instalar extensión de navegador

// React DevTools
// Instalar extensión de navegador
```

---

## Scripts Disponibles

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .js,.vue",
    "lint:fix": "eslint src --ext .js,.vue --fix",
    "format": "prettier --write \"src/**/*.{js,vue,css,scss}\"",
    "test:unit": "vitest",
    "test:e2e": "cypress open",
    "test:e2e:ci": "cypress run",
    "test:coverage": "vitest --coverage"
  }
}
```

---

**Última actualización**: 5 de agosto de 2026
