# Cómo se da de alta un nuevo franquiciado en la plataforma 🏪

**Versión**: v1.3
**Última actualización**: 2026-09-04

Guía para el equipo de backend, escrita desde el punto de vista de frontend: qué pantallas existen, qué le pedimos a la API en cada paso, y qué esperamos que nos devuelva. Sin detalles internos de implementación, solo el contrato que necesitamos.

---

## 🙋 Quién participa

- **Admin** — personal de Carrefour/marketplace
- **Franquiciado** — la persona que se incorpora a la red
- **Stripe** — gestiona el pago con tarjeta de crédito; lo llamamos directamente desde el frontend
- **Odoo** — el sistema contable que emite la factura oficial; frontend solo necesita endpoints de lectura una vez exista la información

---

## 📖 La historia, paso a paso — y qué le pedimos a la API en cada uno

### 1. La invitación

Un admin decide incorporar a un nuevo franquiciado. Hay dos formas de empezar:
- Usando el botón **"Invitar franquiciado"** en el panel de admin — solo un nombre y un email.
- O enviando el enlace de registro manualmente por email, sin usar el botón.

**Qué llamamos:**
- `POST /admin/franchisees/invitations` — enviamos:
```json
{
  "name": "María García",
  "email": "maria.garcia@email.com"
}
```
  Esperamos recibir algo así:
```json
{
  "invitation": {
    "id": "inv_123",
    "name": "María García",
    "email": "maria.garcia@email.com",
    "registrationUrl": "https://.../franchisee/register?token=inv_123...",
    "status": "pending",
    "createdAt": "2026-09-02T10:00:00Z"
  }
}
```

> Backend ya ha compartido el contrato esperado. En DEV el frontend sigue pudiendo simular este enlace para QA cuando el endpoint real no esté disponible.

### 2. El formulario de registro público

El franquiciado abre el enlace y rellena el formulario. El contrato actual exige `invitationToken` y `password`. El paso de pago con Stripe solo debe mostrarse cuando billing esté habilitado.

**Qué llamamos:**
- `POST /franchisee/register` — al final del formulario enviamos:
```json
{
  "invitationToken": "inv_123",
  "firstName": "María",
  "lastName": "García López",
  "email": "maria.garcia@email.com",
  "password": "<minimo 8 caracteres>",
  "phone": "+34 600 123 456",
  "companyName": "Carrefour Express Sur",
  "taxId": "B12345678",
  "fiscalAddress": "Calle Mayor 123",
  "municipality": "Madrid",
  "postalCode": "28001",
  "country": "ES"
}
```

Cuando billing está habilitado, el frontend crea primero `stripePaymentMethodId` en navegador y lo añade a la petición. La respuesta puede incluir:
```json
{
  "franchisee": {
    "id": "fran_123",
    "email": "maria.garcia@email.com",
    "first_name": "María",
    "last_name": "García López",
    "metadata": {
      "company_name": "Carrefour Express Sur",
      "status": "pending_approval",
      "subscription_status": "pending",
      "onboarding_status": "pending_approval"
    }
  },
  "billing": {
    "client_secret": "pi_..._secret_..."
  }
}
```

> Si billing está deshabilitado, frontend no debe pedir ni enviar `stripePaymentMethodId`.

### 3. El pago

El franquiciado solo ve el paso de pago cuando billing está habilitado.

**Qué llama frontend:**
- Frontend llama directamente a Stripe en el navegador mediante Stripe Elements para validar la tarjeta y obtener un `payment_method_id`.
- Esa referencia viaja dentro de `POST /franchisee/register` como `stripePaymentMethodId`.
- Si backend devuelve `billing.client_secret`, frontend debe confirmar el pago con Stripe Elements.

**Estado real hoy en frontend:**
- ✅ El formulario de pago y la tokenización de tarjeta con `stripe.createPaymentMethod(...)` ya están implementados.
- ✅ El flujo ya no envía IBAN ni datos de tarjeta al backend; solo `stripePaymentMethodId` cuando billing está activo.
- ⚠️ En DEV la validación end-to-end con backend real sigue pendiente; el frontend mantiene modo mock para QA.

**Qué necesitamos en backend aunque no lo llame el frontend directamente:**
- `POST /webhooks/stripe` — para recibir eventos como `customer.subscription.created`, `invoice.paid`, `invoice.payment_failed` y `customer.subscription.deleted`, y actualizar:
  - `subscription_status`
  - `stripe_customer_id`
  - `stripe_subscription_id`
  - `current_period_end`

> ✅ Decidido a nivel de contrato: el pago debe cobrarse en el momento del registro, antes de que el admin vea la solicitud, pero solo cuando billing esté activado en la política administrable.
>
> ⚠️ Estado actual de implementación: hasta exponer de forma segura la política de billing a la página pública, frontend refleja esa activación con `NEXT_PUBLIC_FRANCHISEE_BILLING_ENABLED`.

### 4. La factura (Odoo)

La generación y sincronización de la factura es cosa del backend. Frontend solo necesita un endpoint de lectura cuando la factura ya exista.

**Qué esperamos poder llamar:**
- `GET /franchisee/:id/invoices` — para mostrar en el perfil del franquiciado la lista de facturas emitidas.

  Esperamos algo así:
```json
{
  "invoices": [
    {
      "id": "inv_123",
      "franchiseeId": "fran_123",
      "number": "FAC-2026-0001",
      "issueDate": "2026-09-02T10:00:00Z",
      "amount": 299,
      "currencyCode": "EUR",
      "status": "paid",
      "pdfUrl": "https://.../invoice.pdf"
    }
  ]
}
```

> El perfil del franquiciado ya tiene esta sección montada en frontend y ahora mismo está mockeada.

### 5. Validación del admin

Un admin revisa la solicitud y la aprueba. También puede editar datos, cambiar estado y añadir notas internas.

**Qué llamamos:**
- `GET /admin/franchisees?q=&limit=20&offset=0` — para listar franquiciados.
  - `q`: texto de búsqueda
  - `limit`, `offset`: paginación
  - backend acepta también `search`, `take`, `skip`
- `GET /admin/franchisees/:id` — para el detalle.
- `PATCH /admin/franchisees/:id/status` — enviamos:
```json
{ "status": "active" }
```
  `status` puede ser `pending_approval`, `active`, `suspended` o `inactive`.

**Regla importante esperada en backend:**
- Si se intenta pasar a `active` y `subscription_status !== "active"`, el backend debería rechazar la operación de forma consistente.

**Efectos secundarios esperados al aprobar:**
- enviar el email o enlace de activación de credenciales
- mover `onboarding_status` a algo tipo `approved_pending_credentials`
- emitir el evento/outbox para sincronizar el partner en Odoo

- `PATCH /admin/franchisees/:id` — para guardar cambios de datos del franquiciado usando `snake_case`, por ejemplo:
```json
{
  "company_name": "Carrefour Express Sur SL",
  "contact_person": "María García",
  "phone": "+34 600 123 456",
  "region": "Madrid",
  "address": "Gran Vía 1"
}
```

> Confirmado por backend en DEV el 2026-09-04: la familia canónica para la gestión admin B2B es `/admin/franchisees/*`. Frontend ya no debe depender de `/admin/customers/*` para este módulo.

### 6. El perfil y las tiendas del franquiciado

Un franquiciado aprobado puede tener varias tiendas y quiere gestionarlas desde su perfil.

**Qué llamamos desde su perfil:**
- `GET /franchisee/stores`
- `POST /franchisee/stores` — enviamos:
```json
{
  "name": "Tienda Centro",
  "taxId": "B12345678",
  "address": "Gran Vía 1",
  "city": "Madrid",
  "postalCode": "28013"
}
```
- `DELETE /franchisee/stores/:id`

**Qué llamamos desde admin en el detalle:**
- Pendiente de contrato explícito backend para edición admin de tiendas o direcciones.

> `GET/POST/DELETE /franchisee/stores*` ya existe como contrato canónico de autoservicio. El frontend ya no debe persistir `Mis tiendas` en localStorage.

---

## 📋 Todas las llamadas en un solo sitio

| Paso | Método y ruta | Estado DEV |
|---|---|---|
| Invitar franquiciado | `POST /admin/franchisees/invitations` | ⚠️ `untested` |
| Registro público | `POST /franchisee/register` | ⚠️ `untested` |
| Pago | *(frontend ya tokeniza tarjeta con Stripe; falta cobro real backend)* | ⚠️ Parcial |
| Webhook Stripe suscripciones | `POST /webhooks/stripe` | ⚠️ `untested` |
| Facturas del franquiciado | `GET /franchisee/:id/invoices` | ⚠️ Pendiente de contrato |
| Listar franquiciados | `GET /admin/franchisees` | ✅ `working` |
| Detalle de franquiciado | `GET /admin/franchisees/:id` | ⚠️ `untested` |
| Cambiar estado / aprobar | `PATCH /admin/franchisees/:id/status` | ⚠️ `untested` y con validación de billing requerida |
| Editar datos | `PATCH /admin/franchisees/:id` | ⚠️ `untested` |
| Tiendas (autoservicio franquiciado) | `GET / POST / DELETE /franchisee/stores` | ⚠️ Contrato confirmado; smoke autenticado pendiente |
| Tiendas (desde admin) | Ruta pendiente | ⚠️ Sin confirmar |

---

## 🚦 Qué ya está construido vs. qué es nuevo

- ✅ Ya existe en frontend: pantallas de gestión de franquiciados, patrón de pago con tarjeta, formulario multi-paso.
- 🆕 Ya está construido en frontend pero sin backend real: invitación por email, autorregistro con Stripe Elements, aprobación condicionada a suscripción, sección de facturas y autoservicio de tiendas.
- ⚠️ En el onboarding de pago, lo único real hoy es la obtención del `payment_method_id`; el cobro/suscripción real sigue pendiente de backend.

---

## ✅ Lo que ya no está abierto

1. La familia canónica de admin para franquiciados es `/admin/franchisees/*`.
2. El autoservicio de tiendas del franquiciado vive en `/franchisee/stores*`.
3. `GET /store/customers/me` queda reservado al flujo Store/checkout para leer `shipping_addresses`; no sustituye el contrato admin ni el de `Mis tiendas`.
4. Frontend ya no debe volver a `/admin/customers/*` ni a persistencia local de `Mis tiendas`.

## 🧩 Instrucciones concretas para backend

### Prioridad 1: cerrar el flujo que ya existe en frontend

1. Validar end-to-end `POST /admin/franchisees/invitations`.
2. Validar end-to-end `POST /franchisee/register` con y sin `stripePaymentMethodId`.
3. Validar `GET /admin/franchisees/:id`, `PATCH /admin/franchisees/:id`, `DELETE /admin/franchisees/:id` y `PATCH /admin/franchisees/:id/status`.
4. Mantener `GET /admin/franchisees` y `GET /admin/franchisees/:id/stats` con el shape actual, ya consumido por frontend.
5. Confirmar si `PATCH /admin/franchisees/:id/status` es la acción que también dispara activación de credenciales, o definir un endpoint separado antes de que frontend construya esa acción explícita.
6. Corregir la política CORS del dominio Render DEV para que las llamadas directas desde navegador a `/admin/franchisees*` no queden bloqueadas pese a responder `200`.

### Prioridad 2: cerrar los huecos que hoy bloquean UX

1. Definir la ruta admin para ver/editar tiendas o direcciones del franquiciado desde backoffice.
2. Corregir o habilitar `POST /store/customers/me/addresses` para que el checkout pueda dar de alta nuevas direcciones.
3. Confirmar el contrato final de `GET /franchisee/:id/invoices` para dejar de mockear la sección de facturas.
4. Confirmar cómo se expone de forma segura la política de billing a la pantalla pública de registro, para no depender indefinidamente de `NEXT_PUBLIC_FRANCHISEE_BILLING_ENABLED`.

## 📌 Comportamientos mínimos que frontend espera

### `POST /franchisee/register`

1. Si `invitationToken` no existe o expiró, responder `400` o `404` con mensaje legible.
2. Si billing está deshabilitado, ignorar o rechazar de forma consistente `stripePaymentMethodId` no esperado.
3. Si billing está habilitado y falta `stripePaymentMethodId`, responder `400` con error de validación claro.
4. Si el alta queda creada pero pendiente de aprobación, devolver el `franchisee` ya persistido con `status: pending_approval`.
5. Si backend necesita confirmación adicional de Stripe, puede devolver `billing.client_secret`.

### `PATCH /admin/franchisees/:id/status`

1. Si se intenta activar sin suscripción activa cuando billing aplica, responder `409` o `400` con mensaje explícito.
2. Si la transición es válida, devolver el franquiciado actualizado o una respuesta inequívoca de éxito.
3. Si la operación dispara efectos secundarios como email, credenciales u Odoo, la respuesta no debe dejar al frontend en duda sobre si el cambio principal quedó aplicado.

### CORS para pruebas directas contra Render

1. Detectamos un caso real donde `OPTIONS` devolvió `204` y `GET /admin/franchisees` devolvió `200`, pero el navegador bloqueó la petición por ausencia de `Access-Control-Allow-Origin`.
2. Si backend quiere permitir pruebas directas desde frontend o desde DevTools del navegador contra el dominio Render, debe devolver `Access-Control-Allow-Origin` para `http://localhost:3000` y demás orígenes permitidos.
3. Si la política deliberada es obligar al proxy `/api`, conviene documentarlo explícitamente para evitar falsos negativos en QA.

### `POST /store/customers/me/addresses`

1. Si la ruta no va a soportarse para franquiciados autenticados, necesitamos decisión explícita para retirar esa UX del checkout.
2. Si sí va a soportarse, debe aceptar un address payload coherente con las `shipping_addresses` que luego devuelve `GET /store/customers/me`.

## 🧪 Smoke test mínimo para backend

1. Crear invitación con un admin JWT y abrir el `registrationUrl` generado.
2. Registrar un franquiciado desde frontend con billing desactivado.
3. Verificar que aparece en `GET /admin/franchisees` con `status: pending_approval`.
4. Verificar `GET /admin/franchisees/:id` y `GET /admin/franchisees/:id/stats`.
5. Intentar `PATCH /admin/franchisees/:id/status` a `active` con y sin `subscription_status: active`.
6. Entrar como franquiciado y probar `GET /franchisee/stores`, `POST /franchisee/stores` y `DELETE /franchisee/stores/:id`.
7. En checkout, probar `GET /store/customers/me` y confirmar si `POST /store/customers/me/addresses` sigue devolviendo `401`.

## ❓ Lo que seguimos necesitando que confirméis

1. ¿Confirmamos definitivamente `GET /franchisee/:id/invoices` o queréis otro path?
2. ¿Cuál será la ruta admin para editar tiendas o direcciones?
3. ¿La activación de credenciales sale como efecto de `PATCH /admin/franchisees/:id/status` o necesita endpoint separado?
4. ¿Cómo queréis materializar el cobro real de onboarding con Stripe antes de aprobar al franquiciado?

---

*Este documento describe únicamente qué necesita frontend de la API y qué espera recibir. No prescribe cómo implementar colas, workers, sincronización con Odoo ni lógica interna.*
