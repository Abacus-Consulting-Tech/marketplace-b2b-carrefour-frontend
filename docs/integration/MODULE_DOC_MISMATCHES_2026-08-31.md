# Matriz de Desajustes de Módulos - 2026-08-31

Cruce entre la documentación modular enviada al backend y la realidad validada en DEV tras la ronda de smoke/frontend proxy del 2026-08-31.

Fuente operativa prioritaria:

- `src/app/(backoffice)/admin/dev-tools/page.tsx`
- `.github/ai/API_STATUS.md`
- `.github/ai/PROJECT_STATE.md`

Regla:

- Los READMEs de `docs/modules/` describen alcance y contrato objetivo.
- No deben interpretarse automáticamente como confirmación de backend operativo en DEV.

## Tabla de desajustes

| Módulo | Lo que dice la documentación modular | Realidad validada en DEV | Impacto actual | Acción recomendada |
|---|---|---|---|---|
| 02 Openings | Frontend completado, endpoints documentados para openings | `GET /admin/openings/projects` devuelve `404`; el módulo sigue en mock | La UI no puede pasar a real sin romper listados y detalle | Implementar y validar `/admin/openings/projects` y superficies relacionadas |
| 07 Franchisee Catalog | Usa `/store/products` y APIs store estándar | `/store/products` no devuelve catálogo utilizable para la UI en DEV | Marketplace catálogo y detalle permanecen en mock | Cargar catálogo usable en DEV y validar detalle/producto |
| 11 Supplier Products | La documentación antigua se apoyaba en `/vendor/products` | El frontend actual usa `/seller/catalog-products`; en DEV sigue vacío y requiere fallback a `/vendor/custom/products` | `/supplier/products` funciona, pero no con el contrato objetivo limpio | Alinear `seller/catalog-products` con datos reales del seller y retirar fallback |
| 12 Franchisee Management | Contrato objetivo documentado como `/admin/franchisees` | La integración real del frontend está alineada a `/admin/customers*`; `GET` devuelve `403` por RBAC | La UI sigue en mock para no romper gestión de franquiciados | Corregir RBAC de `/admin/customers` y confirmar contrato definitivo |
| 13 Checkout | Flujo objetivo descrito como endpoints custom de checkout | El frontend real se apoya en `/store/carts*`, pero no puede validarse end-to-end por falta de catálogo/cart utilizables | Checkout sigue en mock en DEV | Desbloquear catálogo, carrito y datos de `offer_id` para validación real |

## Observaciones clave

- El problema principal ya no es de frontend en estos módulos, sino de disponibilidad real, RBAC o calidad de datos del backend DEV.
- `supplier-products` es el caso con más deriva documental: el frontend ya no debe considerarse basado en `/vendor/products`.
- `franchisee-management` también tiene deriva de contrato: el README habla de `/admin/franchisees`, pero la integración real hoy gira alrededor de `/admin/customers*`.
- `checkout` depende de la salud de `catalog/products`; no puede evaluarse de forma aislada.

## Conclusión operativa

Para la rama `dev`, mantener la decisión híbrida:

- Real: `auth`, `suppliers`, `pricing`, `orders`, `quotes`
- Mock: `openings`, `franchisees`, `products`, `catalog`, `checkout`, `categories`