# Modo Híbrido Recomendado en DEV - 2026-08-31

Configuración recomendada para la rama `dev` tras validar qué módulos están estables contra Render DEV y cuáles siguen rompiendo la UI o dependen de datos/backend incompletos.

## Módulos en real

- `auth`
- `suppliers`
- `pricing`
- `orders`
- `quotes`

## Módulos en mock

- `openings`
- `franchisees`
- `products`
- `catalog`
- `checkout`
- `categories`

## Matriz ruta -> modo esperado

### Auth

- `/login` -> real

### Supplier

- `/supplier/dashboard` -> real
- `/supplier/products` -> real
- `/supplier/products/[id]` -> real
- `/supplier/products/new` -> real
- `/supplier/products/bulk-upload` -> real
- `/supplier/orders` -> real
- `/supplier/orders/[id]` -> real
- `/supplier/openings` -> mock
- `/supplier/openings/[id]` -> mock
- `/supplier/openings/[id]/quote/[categoryId]` -> mock

### Marketplace / Franchisee

- `/marketplace/quotes` -> real
- `/marketplace/quotes/[id]` -> real
- `/marketplace/orders` -> real
- `/marketplace/orders/[id]` -> real
- `/marketplace/shop` -> mock
- `/marketplace/products/[id]` -> mock
- `/marketplace/cart` -> mock
- `/marketplace/checkout-new` -> mock
- `/marketplace/openings` -> mock
- `/marketplace/openings/[id]` -> mock

### Admin

- `/admin/orders` -> real
- `/admin/orders/[id]` -> real
- `/admin/pricing/approval-queue` -> real
- `/admin/pricing/markup` -> real
- `/admin/pricing/product-markups` -> real
- `/admin/suppliers` -> real
- `/admin/products` -> mock
- `/admin/products/[id]` -> mock
- `/admin/products/[id]/edit` -> mock
- `/admin/franchisees` -> mock
- `/admin/franchisees/new` -> mock
- `/admin/franchisees/[id]` -> mock
- `/admin/franchisees/[id]/edit` -> mock
- `/admin/openings` -> mock
- `/admin/openings/new` -> mock
- `/admin/openings/[id]` -> mock

## Motivos para mantener ciertos módulos en mock

- `openings`: backend devuelve `404` en `/openings/projects`
- `franchisees`: backend devuelve `403` en `/admin/customers`
- `catalog` y `products`: rutas reales responden, pero actualmente sin datos utilizables en DEV
- `checkout`: el flujo real de carrito no puede validarse mientras Store API no devuelva productos con datos utilizables para añadir al carrito
- `categories`: no se validó un backend funcional dedicado en este pase y depende de las superficies anteriores

## Nota operativa

Después de cambiar `.env.local`, reiniciar `npm run dev` o `npm run dev:open` para que Next.js vuelva a cargar los `NEXT_PUBLIC_*`.

Nota de inventario:

- El bloque `supplier-products` basado en `/vendor/products*` se retiró de `admin/dev-tools` porque era documentación legacy sin consumidores activos en el frontend actual.