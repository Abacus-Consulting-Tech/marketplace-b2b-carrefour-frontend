# Punch List Backend por Módulo - 2026-08-31

Lista corta y accionable de bloqueos backend que impiden pasar más módulos de `mock` a `real` en la rama `dev`.

## M02 Openings

- Restaurar `GET /admin/openings/projects` en DEV; ahora responde `404`.
- Validar también detalle de proyecto y superficies mínimas relacionadas antes de pedir cambio de flag frontend.
- Objetivo de salida: poder cargar listados y detalle sin mock.

## M07 Franchisee Catalog

- Hacer que `/store/products` y `/store/products/:id` devuelvan catálogo utilizable en DEV.
- Confirmar presencia de datos mínimos para la UI: productos visibles, variantes/precio y campos requeridos por el frontend.
- Objetivo de salida: habilitar catálogo y detalle franchisee en real.

## M11 Supplier Products

- Alinear `GET /seller/catalog-products` con los datos reales del seller.
- Confirmar que el seller `sel_01M0T3BYTKQF7RV18RX93XEAQD` recibe al menos los productos que hoy aparecen en `/vendor/custom/products`.
- Mantener `/vendor/custom/products` solo como compatibilidad temporal, no como contrato principal.
- Objetivo de salida: retirar el fallback frontend en `/supplier/products`.

## M12 Franchisee Management

- Resolver RBAC de `GET /admin/customers` y `GET /admin/customers/:id`.
- Confirmar si el contrato backend definitivo del módulo será `/admin/customers*` o un alias `/admin/franchisees*`.
- Objetivo de salida: poder listar y consultar franquiciados desde backend real sin mock.

## M13 Checkout

- Desbloquear los prerequisitos del checkout real: catálogo utilizable, cart add y datos necesarios para completar compra.
- Verificar que las rutas Store/Medusa de carrito devuelven la información que espera el frontend para line items, shipping y pago.
- Confirmar disponibilidad de `offer_id` o equivalente requerido por el flujo real actual.
- Objetivo de salida: smoke end-to-end de carrito y checkout sin mock.

## Orden recomendado de trabajo

1. M11 Supplier Products
2. M12 Franchisee Management
3. M07 Franchisee Catalog
4. M13 Checkout
5. M02 Openings

## Criterio de cierre

No mover un módulo a `real` en `dev` hasta cumplir ambos puntos:

- respuesta backend válida en la ruta consumida realmente por el frontend
- validación de UI/proxy sin fallback ni mock para ese módulo