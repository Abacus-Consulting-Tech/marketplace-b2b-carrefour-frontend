# Revisión de Drift en Documentos Internos de Módulo - 2026-08-31

Revisión puntual de la documentación interna más detallada de los módulos que hoy siguen generando contradicción entre contrato objetivo y realidad validada en DEV.

## Resultado

### 02 Openings

- Archivos revisados:
  - `docs/modules/02-openings/BACKEND_GUIDE.md`
  - `docs/modules/02-openings/EMAIL_PARA_BACKEND.md`
- Hallazgo:
  - Documentan un contrato amplio sobre `/api/admin/openings/projects*` y superficies relacionadas.
  - No contradicen el objetivo funcional, pero sí pueden inducir a pensar que el backend DEV está operativo hoy.
- Drift importante:
  - Sí, respecto al estado operativo actual en DEV.
- Recomendación:
  - Mantenerlos como contrato objetivo, pero leerlos junto con la nota de estado en el README y con `API_STATUS.md`.

### 11 Supplier Products

- Archivo revisado:
  - `docs/modules/11-supplier-products/SUPPLIER_PRODUCTS_BACKEND.md`
- Hallazgo:
  - Sigue documentando `/vendor/products*` como contrato principal.
  - El frontend actual alineado usa `/seller/catalog-products*`.
- Drift importante:
  - Sí, alto.
- Recomendación:
  - Este es el documento interno con mayor prioridad de actualización si se quiere evitar más ruido contractual.

### 12 Franchisee Management

- Archivo revisado:
  - `docs/modules/12-franchisee-management/FRANCHISEE_MANAGEMENT_BACKEND.md`
- Hallazgo:
  - Documenta `/admin/franchisees*` como contrato principal.
  - La integración real del frontend hoy está alineada alrededor de `/admin/customers*`.
- Drift importante:
  - Sí, alto.
- Recomendación:
  - Confirmar primero cuál será el contrato backend definitivo antes de reescribir el documento detallado.

### 13 Checkout

- Archivo revisado:
  - `docs/modules/13-checkout/CHECKOUT_BACKEND.md`
- Hallazgo:
  - Documenta un namespace custom `/checkout/*`.
  - El frontend real actual está alineado a superficies Store/Medusa (`/store/carts*`, `/store/shipping-options`, `/store/orders/:id`).
- Drift importante:
  - Sí, alto.
- Recomendación:
  - No tratar este documento como contrato runtime actual sin una decisión explícita de contrato compartido.

## Conclusión

Los READMEs ya quedaron corregidos para no vender como operativa una realidad que hoy sigue bloqueada en DEV.

Los documentos internos detallados deben tratarse así:

- `Openings`: contrato objetivo con backend no validado aún en DEV
- `Supplier Products`: documento desalineado con el contrato frontend actual
- `Franchisee Management`: documento desalineado con la superficie real usada hoy
- `Checkout`: documento desalineado con la estrategia Store/Medusa actual

## Prioridad de limpieza documental

1. `docs/modules/11-supplier-products/SUPPLIER_PRODUCTS_BACKEND.md`
2. `docs/modules/12-franchisee-management/FRANCHISEE_MANAGEMENT_BACKEND.md`
3. `docs/modules/13-checkout/CHECKOUT_BACKEND.md`
4. `docs/modules/02-openings/BACKEND_GUIDE.md`