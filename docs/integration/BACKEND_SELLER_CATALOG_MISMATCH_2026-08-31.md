# Informe de Incidencia Backend - Desajuste en Seller Catalog

Fecha: 2026-08-31
Entorno: Render DEV
URL base del backend: `https://marketplace-b2b-backend-dev.onrender.com`
Seller afectado: `sel_01M0T3BYTKQF7RV18RX93XEAQD`
Estado de la rama frontend afectada: `dev` actual

## Resumen

La migración del frontend movió las lecturas de productos de proveedor desde `GET /vendor/custom/products` hacia `GET /seller/catalog-products`.

El comportamiento actual en Render DEV es inconsistente para el mismo proveedor:

- `GET /vendor/custom/products?limit=5` devuelve un producto del proveedor
- `GET /seller/catalog-products?limit=5` devuelve `200 OK` con cero productos

Esto bloquea el nuevo flujo de catálogo de proveedor aunque los datos del producto sí existen en el almacenamiento del backend.

## Impacto

- El login de proveedor funciona
- La resolución del seller del proveedor funciona
- El listado legacy de productos de proveedor devuelve datos
- El nuevo listado de seller catalog devuelve un dataset vacío para el mismo seller
- El frontend ha tenido que añadir un fallback temporal hacia las lecturas legacy de vendor para mostrar el listado de productos del proveedor

## Datos observados

El endpoint legacy de vendor devuelve un producto para el seller afectado:

```json
{
  "id": "prod_01M0ZGJ2P2CYZ1040PF1J3A82G",
  "title": "Producto Test",
  "status": "proposed",
  "pricing_status": "pending_approval",
  "base_price": 25.5,
  "units_per_pack": 1,
  "metadata": {
    "base_price": 25.5,
    "pricing_status": "pending_approval",
    "units_per_pack": 1,
    "proposed_by": "mem_01M0T3BZG3QZ28CEDK7MTP9TWE"
  }
}
```

El nuevo endpoint de seller catalog no devuelve filas:

```json
{
  "count": 0,
  "products": []
}
```

## Reproducción - Backend directo

1. Autenticarse como el usuario proveedor conocido de DEV usando las credenciales compartidas de prueba.
2. Usar el endpoint específico de proveedor para obtener un token de tipo `member`:

```bash
curl -X POST "https://marketplace-b2b-backend-dev.onrender.com/auth/member/emailpass" \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@mercur.dev","password":"<shared-dev-password>"}'
```

3. Confirmar que la resolución del seller funciona con la cabecera `x-seller-id` configurada:

```bash
curl "https://marketplace-b2b-backend-dev.onrender.com/vendor/sellers/me" \
  -H "Authorization: Bearer <member-token>" \
  -H "x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD"
```

Resultado esperado:

```json
{
  "seller": {
    "id": "sel_01M0T3BYTKQF7RV18RX93XEAQD"
  }
}
```

4. Leer los productos del proveedor a través del endpoint legacy de vendor:

```bash
curl "https://marketplace-b2b-backend-dev.onrender.com/vendor/custom/products?limit=5" \
  -H "Authorization: Bearer <member-token>" \
  -H "x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD"
```

Resultado observado: `200 OK`, `count: 1`

5. Leer los productos del proveedor a través del nuevo endpoint de seller catalog:

```bash
curl "https://marketplace-b2b-backend-dev.onrender.com/seller/catalog-products?limit=5" \
  -H "Authorization: Bearer <member-token>" \
  -H "x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD"
```

Resultado observado: `200 OK`, `count: 0`

## Reproducción - A través del proxy del frontend

Levantar la app de Next.js en local y llamar a las rutas proxy del frontend.

1. Arrancar la app:

```bash
npm run dev
```

2. Hacer login a través del proxy de autenticación del frontend:

```bash
curl -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@mercur.dev","password":"<shared-dev-password>"}'
```

Resultado observado:

- el frontend devuelve `role: supplier`
- el frontend devuelve `seller_id: sel_01M0T3BYTKQF7RV18RX93XEAQD`
- el frontend hace correctamente fallback a `/auth/member/emailpass` porque `/auth/login` devuelve actualmente un token no `member` para este proveedor

3. Comparar los endpoints de productos de proveedor proxificados usando el token devuelto:

```bash
curl "http://localhost:3001/api/vendor/custom/products?limit=5" \
  -H "Authorization: Bearer <frontend-token>" \
  -H "x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD"

curl "http://localhost:3001/api/seller/catalog-products?limit=5" \
  -H "Authorization: Bearer <frontend-token>" \
  -H "x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD"
```

Resultado observado:

- `/api/vendor/custom/products?limit=5` -> `200 OK`, `count: 1`
- `/api/seller/catalog-products?limit=5` -> `200 OK`, `count: 0`

## Comportamiento esperado

Para el mismo proveedor autenticado y el mismo `seller_id`:

- `GET /seller/catalog-products` debería exponer el mismo conjunto de productos del proveedor que necesita el listado migrado del frontend
- Como mínimo, el producto visible vía `GET /vendor/custom/products` debería ser también visible vía `GET /seller/catalog-products`

## Posibles causas

- `seller/catalog-products` está leyendo de una tabla o vista distinta a `vendor/custom/products`
- `seller/catalog-products` está filtrando productos `proposed` o `pending_approval` mientras la UI de proveedor todavía necesita listarlos
- La resolución de identidad del seller difiere entre ambas familias de rutas

## Mitigación temporal aplicada en frontend

Se ha añadido un fallback temporal de compatibilidad en el frontend:

- lectura principal: `GET /seller/catalog-products?limit=100`
- fallback si viene vacío: `GET /vendor/custom/products?limit=100`

Esto mantiene la visibilidad del listado de productos del proveedor hasta que los endpoints del backend queden alineados.