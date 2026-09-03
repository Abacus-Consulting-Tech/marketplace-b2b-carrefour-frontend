# Cómo se da de alta un nuevo franquiciado en la plataforma 🏪

**Versión**: v1.1
**Última actualización**: 2026-09-03

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
- `GET /admin/customers?q=&limit=20&offset=0&expand=groups,shipping_addresses` — para listar franquiciados.
  - `q`: texto de búsqueda
  - `limit`, `offset`: paginación
  - `expand`: para traer grupos y tiendas
  - además nos gustaría filtro backend por `status=pending_approval`
- `GET /admin/customers/:id?expand=groups,shipping_addresses` — para el detalle.
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

- `POST /admin/customers/:id` — para guardar cambios de datos o notas internas, por ejemplo:
```json
{
  "metadata": {
    "notes": "Cliente premium, revisar límite de crédito"
  }
}
```

> Seguimos usando `/admin/customers/*` para listar, ver detalle y editar, pero también existe `/admin/franchisees/*` en backend. Necesitamos confirmar cuál es el contrato canónico.

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
- `POST /admin/customers/:id/addresses`
- `PATCH /admin/customers/:id/addresses/:addressId`
- `DELETE /admin/customers/:id/addresses/:addressId`

> `GET/POST/DELETE /franchisee/stores*` no existe todavía en backend. Hoy frontend lo persiste solo localmente para pruebas.

---

## 📋 Todas las llamadas en un solo sitio

| Paso | Método y ruta | ¿Existe en backend? |
|---|---|---|
| Invitar franquiciado | `POST /admin/franchisees/invitations` | ❌ No |
| Registro público | `POST /franchisee/register` | ❌ No |
| Pago | *(frontend ya tokeniza tarjeta con Stripe; falta cobro real backend)* | ⚠️ Parcial |
| Webhook Stripe suscripciones | `POST /webhooks/stripe` | ❌ No |
| Facturas del franquiciado | `GET /franchisee/:id/invoices` | ❌ No |
| Listar franquiciados | `GET /admin/customers` | ⚠️ Existe pero sin confirmar si es el contrato correcto |
| Detalle de franquiciado | `GET /admin/customers/:id` | ⚠️ Igual que arriba |
| Cambiar estado / aprobar | `PATCH /admin/franchisees/:id/status` | ⚠️ Existe, pero debe validar `subscription_status === active` y disparar email/outbox |
| Editar datos / notas | `POST /admin/customers/:id` | ⚠️ Sin confirmar |
| Tiendas (autoservicio franquiciado) | `GET / POST / DELETE /franchisee/stores` | ❌ No |
| Tiendas (desde admin) | `POST / PATCH / DELETE /admin/customers/:id/addresses` | ⚠️ Sin confirmar |

---

## 🚦 Qué ya está construido vs. qué es nuevo

- ✅ Ya existe en frontend: pantallas de gestión de franquiciados, patrón de pago con tarjeta, formulario multi-paso.
- 🆕 Ya está construido en frontend pero sin backend real: invitación por email, autorregistro con Stripe Elements, aprobación condicionada a suscripción, sección de facturas y autoservicio de tiendas.
- ⚠️ En el onboarding de pago, lo único real hoy es la obtención del `payment_method_id`; el cobro/suscripción real sigue pendiente de backend.

---

## ❓ Lo que necesitamos que confirméis

1. **¿Cuál es el contrato real de admin?** `/admin/customers/*` o `/admin/franchisees/*`.
2. **¿Vais a construir `POST /franchisee/register` ahora?** Sin él, el registro público seguirá siendo 100% simulado.
3. **¿Confirmamos `GET /franchisee/:id/invoices`?** Si queréis otro path, necesitamos cerrarlo ya porque la UI ya existe.
4. **¿Existirá `/franchisee/stores*`?** O preferís que las tiendas se gestionen siempre desde admin y el franquiciado solo las vea.
5. **¿La activación de credenciales sale como efecto de `PATCH /admin/franchisees/:id/status`?** Si preferís un endpoint separado para eso, hay que acordarlo antes de construir esa UI.
6. **¿Cómo queréis materializar el cobro real de onboarding?** Ahora mismo frontend ya puede enviar `stripePaymentMethodId`, pero falta decidir e implementar en backend la creación real de cliente/suscripción/cobro antes de activar el flujo end-to-end.

---

*Este documento describe únicamente qué necesita frontend de la API y qué espera recibir. No prescribe cómo implementar colas, workers, sincronización con Odoo ni lógica interna.*
