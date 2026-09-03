# Cómo se da de alta un nuevo proveedor en la plataforma

**Versión**: v1.0
**Última actualización**: 2026-09-03

Guía para el equipo de backend, escrita desde el punto de vista de frontend: qué pantallas existen, qué le pedimos a la API en cada paso, y qué esperamos que nos devuelva. Sin detalles internos de implementación, solo el contrato que necesitamos.

---

## Quién participa

- **Admin** — personal de Carrefour/marketplace
- **Proveedor** — la empresa que quiere vender en la plataforma
- **MercurJS / Medusa** — base del modelo seller/member que queremos reutilizar
- **Odoo** — sistema externo para la sincronización del partner proveedor después de la aprobación

---

## La historia, paso a paso — y qué le pedimos a la API en cada uno

### 1. La invitación

Un admin decide incorporar a un nuevo proveedor. Queremos el mismo patrón que en franquiciados:

- El admin usa el botón **"Invitar proveedor"**.
- Introduce solo nombre y email.
- El proveedor recibe o copia un enlace público para completar su solicitud.

**Qué llamamos:**
- `POST /admin/suppliers/invitations` — enviamos:

```json
{
  "name": "Distribuciones Ejemplo S.L.",
  "email": "contacto@proveedor.com"
}
```

Esperamos recibir algo así:

```json
{
  "invitation": {
    "id": "sup_inv_123",
    "name": "Distribuciones Ejemplo S.L.",
    "email": "contacto@proveedor.com",
    "registrationUrl": "https://.../supplier/register?...",
    "status": "pending",
    "createdAt": "2026-09-03T10:00:00Z"
  }
}
```

> Hoy esto no existe en backend. Frontend lo simula generando el enlace localmente y mostrándolo al admin para que lo copie.

### 2. El formulario de registro público

El proveedor abre el enlace y rellena el formulario. A diferencia del flujo antiguo, ya no pedimos catálogo ni ZIP de imágenes en este momento. El onboarding inicial queda reducido a solicitud de alta, no a carga operativa.

Hoy el flujo público tiene 3 pasos:

- datos legales
- contacto principal
- revisión final de la solicitud

**Qué llamamos:**
- `POST /supplier/register` — al final del formulario enviamos:

```json
{
  "businessName": "Distribuciones Ejemplo",
  "legalName": "Distribuciones Ejemplo S.L.",
  "nifCif": "B12345678",
  "fiscalAddress": "Calle Mayor 123",
  "municipality": "Madrid",
  "postalCode": "28001",
  "country": "España",
  "iban": "ES1234567890123456789012",
  "email": "contacto@proveedor.com",
  "phone": "+34 912 345 678",
  "website": "https://proveedor.com",
  "contactName": "María",
  "contactSurname": "García López",
  "contactPosition": "Directora Comercial",
  "contactEmail": "maria.garcia@proveedor.com",
  "contactPhone": "+34 600 123 456"
}
```

Esperamos recibir algo así:

```json
{
  "supplier": {
    "id": "sup_123",
    "userId": "member_pending_123",
    "status": "pending",
    "businessName": "Distribuciones Ejemplo",
    "legalName": "Distribuciones Ejemplo S.L.",
    "email": "contacto@proveedor.com",
    "contactEmail": "maria.garcia@proveedor.com",
    "metadata": {
      "onboarding_status": "pending_approval",
      "approval_notes": "",
      "credentials_sent_at": null,
      "odoo_sync_status": "pending"
    }
  }
}
```

> Este endpoint todavía no existe en backend. Es el hueco principal para poder cerrar el onboarding real del proveedor.

### 3. La revisión del admin

Un admin revisa la solicitud, valida los datos y decide si aprobar o rechazar.

En frontend ya existe esta estructura:

- **Solicitudes pendientes** arriba, como cards con acciones rápidas de aprobación/rechazo.
- **Directorio de proveedores** debajo, en tabla completa con búsqueda y filtro por estado.
- Cada fila del directorio ya expone acciones **Ver**, **Editar** y **Eliminar**.

**Qué llamamos para leer en admin:**
- `GET /admin/sellers?q=&limit=20&offset=0` — para listar entidades proveedor.
- `GET /admin/sellers/:id` — para el detalle del proveedor.

**Qué llamamos para administración posterior a la revisión:**
- `PATCH /admin/sellers/:id` — edición administrativa de datos legales/comerciales/contacto desde el directorio.
- `DELETE /admin/sellers/:id` — eliminación administrativa del proveedor desde el directorio.

**Qué llamamos para las acciones de workflow:**
- `PATCH /admin/suppliers/:id/status` — enviamos por ejemplo:

```json
{
  "status": "active",
  "approvalNotes": "Solicitud aprobada. Pendiente de envío de credenciales."
}
```

O para rechazo:

```json
{
  "status": "rejected",
  "approvalNotes": "Falta validar CIF y documentación legal."
}
```

**Regla esperada en backend:**
- La lectura de proveedor debería apoyarse en la entidad canónica de MercurJS (`seller`).
- Las acciones de onboarding pueden vivir en rutas custom si la aprobación/rechazo no encajan limpiamente en el CRUD estándar.

> Recomendación frontend: usar `/admin/sellers*` como lectura canónica y `/admin/suppliers/*` o `/admin/custom/sellers/*` para acciones de workflow.

### 4. La aprobación y activación de credenciales

El proveedor no debe definir password al solicitar el alta. Primero se revisa y aprueba. Después se le comunica cómo activar el acceso.

**Qué necesitamos que haga backend al aprobar:**
- mover `onboarding_status` a `approved_pending_credentials`
- preparar o enviar email de activación
- crear o activar las credenciales `member` del proveedor según el patrón de MercurJS

**Qué puede necesitar backend como endpoint adicional o side effect:**
- email con `activation_link` o `reset_password_link`
- transición posterior a `credentials_sent`
- transición final a `active` cuando el acceso quede operativo

> ✅ Decidido: el password no se define en el alta inicial. La activación viene después de la aprobación.

### 5. El rechazo y la resubmisión

Si una solicitud se rechaza, frontend recomienda no borrar la trazabilidad.

**Qué esperamos de backend:**
- conservar motivo de rechazo
- mantener histórico visible para admin
- permitir un nuevo ciclo de revisión a partir de la información previa

La política recomendada es:

- rechazo con motivo
- posibilidad de resubmisión posterior
- nuevo ciclo de revisión sin perder el historial anterior

> Esta parte sigue abierta para confirmación backend, pero es la recomendación operativa desde frontend.

### 6. La sincronización con Odoo

La creación o actualización del partner proveedor en Odoo debe ocurrir después de la aprobación, no durante la solicitud pública.

**Qué esperamos como side effect backend:**
- emitir un evento/outbox al aprobar
- sincronizar el proveedor con Odoo de forma asíncrona
- reflejar ese estado en `odoo_sync_status`

Valores esperados para `odoo_sync_status`:

- `pending`
- `synced`
- `failed`

### 7. La carga de catálogo después del alta

Una vez aprobado y con acceso activo, el proveedor entra en su portal y ya puede hacer la parte operativa:

- login de proveedor
- subida de CSV/XLSX
- subida de ZIP de imágenes
- propuesta/importación de productos

**Importante:**
- CSV/XLSX y ZIP ya no forman parte del onboarding inicial.
- Esa fase queda movida al momento posterior a la aprobación.

**Qué ya existe hoy en backend/flujo operativo relacionado:**
- `POST /auth/member/emailpass` — login de proveedor una vez las credenciales existen
- endpoints de catálogo/productos del proveedor ya documentados en el módulo correspondiente

---

## Todas las llamadas en un solo sitio

| Paso | Método y ruta | ¿Existe en backend? |
|---|---|---|
| Invitar proveedor | `POST /admin/suppliers/invitations` | ❌ No |
| Registro público proveedor | `POST /supplier/register` | ❌ No |
| Listar proveedores en admin | `GET /admin/sellers` | ⚠️ Sí, pero hay que confirmar si cubre también la cola de onboarding |
| Detalle de proveedor | `GET /admin/sellers/:id` | ⚠️ Sí, pero hay que confirmar si expone la metadata de onboarding necesaria |
| Editar proveedor desde admin | `PATCH /admin/sellers/:id` | ⚠️ Posiblemente sí, pero falta validación explícita del contrato final |
| Eliminar proveedor desde admin | `DELETE /admin/sellers/:id` | ⚠️ Posiblemente sí, pero falta validación explícita del contrato final |
| Aprobar / rechazar onboarding | `PATCH /admin/suppliers/:id/status` | ❌ No |
| Activación de credenciales | `email + activation/reset flow` | ❌ No cerrado todavía |
| Login proveedor tras activación | `POST /auth/member/emailpass` | ✅ Sí |
| Sincronización con Odoo | `evento/outbox al aprobar` | ❌ No cerrado todavía |
| Carga de catálogo post-alta | `flujo operativo posterior` | ⚠️ Parcialmente existente |

---

## Qué ya está construido vs. qué es nuevo

- ✅ Ya existe en frontend: página pública de registro de proveedor, formularios de datos legales y contacto, store multi-paso, panel admin de revisión, directorio admin full-width con búsqueda/filtro y acciones por fila, patrón de login proveedor con `member`.
- 🆕 Ya está construido en frontend pero sin backend real: invitación de proveedor, autorregistro sin password inicial, revisión admin con approve/reject, success state pendiente de revisión, metadata de onboarding.
- 🔄 Se ha movido fuera del onboarding inicial: carga de CSV/XLSX e imágenes ZIP. Esa parte ahora pertenece al flujo operativo posterior al alta.

---

## Lo que necesitamos que confirméis

1. **¿La solicitud inicial crea directamente un `seller` de MercurJS en estado pendiente, o preferís una entidad separada tipo `supplier_application`?**
2. **¿Dónde vivirá la metadata de onboarding?** `seller.metadata`, `member.metadata` o una tabla/registro específico.
3. **¿Confirmamos `/admin/sellers` y `/admin/sellers/:id` como lectura canónica en admin?**
4. **¿Qué endpoint queréis para aprobar/rechazar?** `PATCH /admin/suppliers/:id/status`, `/admin/custom/sellers/:id/approve`, otro.
5. **¿Cómo queréis implementar la activación de credenciales tras la aprobación?** email de activación, reset password, invitación de member, otro mecanismo.
6. **¿Qué estados exactos soportará el onboarding?** La propuesta frontend mínima es: `pending_approval`, `approved_pending_credentials`, `credentials_sent`, `active`, `rejected`.
7. **¿Qué side effects son obligatorios al aprobar?** email de activación, outbox Odoo, inicialización comercial, auditoría, otros.
8. **¿Qué reglas de deduplicación debéis aplicar antes de crear la solicitud?** Por ejemplo: CIF/NIF, email legal, nombre de empresa.
9. **¿La invitación será obligatoria o también admitiremos alta pública sin invitación?**
10. **¿Cómo queréis modelar la resubmisión tras rechazo?** misma entidad, nueva solicitud enlazada, estado `changes_requested`, otro patrón.

---

*Este documento describe únicamente qué necesita frontend de la API y qué espera recibir. No prescribe cómo implementar workers, colas, sincronización con Odoo ni detalles internos de MercurJS.*
