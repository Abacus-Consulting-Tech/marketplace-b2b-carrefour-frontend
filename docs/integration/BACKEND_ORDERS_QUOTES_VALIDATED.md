# Informe de Cambios para Frontend

Fecha: 2026-08-26
Entorno validado: Render DEV (`https://marketplace-b2b-backend-dev.onrender.com`)

## 1. Objetivo

Documentar los cambios efectivos en backend para los modulos de Orders y Quotes y el impacto directo sobre la integracion frontend.

## 2. Resultado de despliegue

Estado general:

- `GET /health` => `200`
- Endpoints de Orders/Quotes desplegados y accesibles en DEV
- Excepcion conocida:
  - `GET /admin/orders/stats` => `403` (RBAC)
  - Ruta operativa equivalente: `GET /admin/custom/orders/stats` => `200`

## 3. Contrato vigente para Front

### Admin Orders

- `GET /admin/orders` (Bearer admin) => `200`
- `GET /admin/custom/orders/stats` (Bearer admin) => `200`
- `GET /admin/orders/stats` => no usar en DEV (puede devolver `403`)

### Franchisee Orders

- `GET /franchisee/orders` => `200`
- `GET /franchisee/orders/stats` => `200`

### Quotes - Customer

- `GET /quotes` => `200`
- `GET /quotes/{id}` => `200`

### Quotes - Admin

- `GET /admin/quotes` (Bearer admin) => `200`
- `GET /admin/quotes/stats` (Bearer admin) => `200`

### Quotes - Seller

- `GET /seller/quotes` => `200`
- `GET /seller/invitations` => `200`

## 4. Impacto en cliente frontend

Cambio requerido en cliente admin orders:

- Antes: `GET /admin/orders/stats`
- Ahora (DEV): `GET /admin/custom/orders/stats`

Motivo:

- Evitar bloqueo por RBAC en la ruta legacy de stats.

Nota de repositorio:

- Este repo aplica validacion backend-only y no versiona cambios en `apps/`.
- Si el frontend se construye desde otro repo o pipeline, este ajuste de URL debe aplicarse alli.

## 5. Postman actualizado

Se actualizaron los siguientes artefactos:

- Coleccion: `docs/postman/marketplace-b2b-carrefour.postman_collection.json`
- Guia: `docs/postman/README-front-usage.md`
- Checklist: `docs/postman/smoke-test-checklist.md`

Cambios principales en Postman:

- Nueva carpeta: `9 - Orders y Quotes B2B (DEV)`
- Nueva variable: `quoteId`
- Requests incluidos para:
  - Admin Orders
  - Franchisee Orders
  - Quotes customer/admin/seller
- Se explicita uso de `GET /admin/custom/orders/stats`

## 6. Recomendacion de rollout Front

1. Cambiar endpoint de stats en front admin a `/admin/custom/orders/stats`.
2. Ejecutar carpeta `9 - Orders y Quotes B2B (DEV)` en Postman contra Render DEV.
3. Verificar en UI:
   - Pantalla Admin Orders Stats
   - Pantalla Franchisee Orders
   - Pantalla Quotes (lista + detalle)
4. Si se reactiva hardening de auth en DEV/PRE, reintroducir headers/tokens para rutas franchisee/seller segun politica final.

## 7. Criterio de aceptacion tecnico

Se considera integrado para frontend cuando:

- Stats admin cargan desde `/admin/custom/orders/stats` sin `403`.
- Listas de Orders/Quotes renderizan sin errores 4xx en Network.
- Smoke Postman de carpeta `9` finaliza con respuestas esperadas.
