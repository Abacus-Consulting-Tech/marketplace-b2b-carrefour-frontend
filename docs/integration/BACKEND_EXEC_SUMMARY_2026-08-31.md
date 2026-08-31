# Resumen Ejecutivo Backend/Frontend DEV - 2026-08-31

## Estado real hoy

La integración frontend/backend no está cerrada al 100% en DEV.

Lo que sí está estable y usable en real para la UI actual:

- `auth`
- `suppliers`
- `pricing` con fallback temporal en seller catalog
- `orders`
- `quotes`

Lo que sigue en mock en la rama `dev` porque el backend actual no soporta todavía la validación real sin romper UI o datos:

- `openings`
- `franchisees`
- `products`
- `catalog`
- `checkout`
- `categories`

## Bloqueos reales que quedan

- `GET /admin/openings/projects` responde `404` en DEV
- `GET /admin/customers` y `GET /admin/customers/:id` responden `403` por RBAC
- `GET /seller/catalog-products` sigue vacío o desalineado; el frontend usa fallback temporal a `/vendor/custom/products`
- `GET /store/products` no devuelve catálogo utilizable para la UI franchisee en DEV
- El checkout real no puede validarse end-to-end mientras el catálogo/cart real siga bloqueado

## Lectura correcta de la documentación

- `docs/modules/` describe alcance y contrato objetivo enviado a backend
- La verdad operativa en DEV está en `admin/dev-tools`, `.github/ai/API_STATUS.md` y `.github/ai/PROJECT_STATE.md`
- Un módulo puede estar "implementado" en frontend y documentado para backend, pero seguir no validado en runtime real

## Prioridad recomendada para backend

1. Arreglar `seller/catalog-products`
2. Corregir RBAC de `admin/customers*`
3. Cargar catálogo usable en `store/products`
4. Desbloquear cart/checkout real
5. Restaurar openings en DEV

## Criterio para pasar un módulo a real en DEV

No cambiar el flag de un módulo a real solo porque exista documentación o endpoint teórico.

Exigir siempre:

- respuesta válida en la ruta que consume realmente el frontend
- validación visual/proxy sin fallback temporal ni mock