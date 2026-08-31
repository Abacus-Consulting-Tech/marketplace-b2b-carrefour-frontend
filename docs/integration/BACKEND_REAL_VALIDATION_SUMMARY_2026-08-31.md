# Resumen Corto de Validación Real Backend - 2026-08-31

Entorno validado:

- Frontend local en `http://localhost:3000`
- Backend Render DEV en `https://marketplace-b2b-backend-dev.onrender.com`

## Objetivo

Verificar qué módulos del frontend pueden quedarse en modo real de forma estable y cuáles siguen bloqueados por problemas reales de backend o por falta de datos utilizables.

## Resultado ejecutivo

### Estables o suficientemente funcionales en real

- Auth
- Suppliers / seller resolution
- Pricing admin + supplier product list con fallback temporal
- Quotes
- Orders

### No estables todavía en real

- Franchisees
- Openings
- Catalog
- Checkout / cart

## Evidencia principal

### Correcto

- `POST /api/auth/login` -> `200` para admin, franchisee y supplier
- `GET /api/vendor/sellers/me` -> `200`
- `GET /api/admin/custom/sellers?limit=5` -> `200`
- `GET /api/store/quotes?limit=5` -> `200`, `count: 2`
- `GET /api/seller/invitations?limit=5` -> `200`, `count: 2`
- `GET /api/seller/quotes?limit=5` -> `200`, `count: 2`
- `GET /api/admin/quotes?limit=5` -> `200`, `count: 2`
- `GET /api/admin/orders?limit=5` -> `200`
- `GET /api/admin/custom/orders/stats` -> `200`
- `GET /api/franchisee/orders?limit=5` -> `200`
- `GET /api/franchisee/orders/stats` -> `200`
- `GET /api/vendor/orders?limit=5` -> `200`
- `GET /api/vendor/orders/stats` -> `200`

### Incorrecto o incompleto

- `GET /api/admin/customers?limit=5` -> `403 Forbidden`
- `GET /api/openings/projects?limit=5` -> `404 Cannot GET /openings/projects`
- `GET /api/store/products?limit=1&region_id=...` -> `200` pero sin productos
- `GET /api/admin/custom/catalog-products?limit=1` -> `200` pero sin productos
- `GET /api/seller/catalog-products?limit=5` -> `200` pero `count: 0`
- `GET /api/vendor/custom/products?limit=5` -> `200`, `count: 1`

## Impacto frontend

- El desajuste entre `seller/catalog-products` y `vendor/custom/products` sigue vigente y ya está documentado en [docs/integration/BACKEND_SELLER_CATALOG_MISMATCH_2026-08-31.md](docs/integration/BACKEND_SELLER_CATALOG_MISMATCH_2026-08-31.md)
- El carrito/checkout real no puede quedar operativo mientras Store API no exponga productos utilizables para añadir al carrito
- Franchisees y openings no deben activarse en real en `dev` hasta que backend corrija permisos y rutas

## Recomendación backend

Prioridad 1:

- Corregir `GET /seller/catalog-products` para que devuelva los productos del seller ya visibles en `GET /vendor/custom/products`

Prioridad 2:

- Corregir RBAC o permisos de `GET /admin/customers`
- Implementar o exponer correctamente `/openings/projects`

Prioridad 3:

- Cargar datos reales de catálogo Store en DEV o revisar el filtro por región/publicación para que `/store/products` devuelva productos utilizables