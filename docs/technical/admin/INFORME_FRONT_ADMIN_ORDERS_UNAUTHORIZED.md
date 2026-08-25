# Informe para Front - Fix /admin/orders Unauthorized

## Resumen

Se corrigio el bug de autorizacion en el endpoint admin de pedidos.

El problema afectaba al dashboard admin cuando el usuario `admin@carrefour.dev` intentaba cargar el listado de pedidos. El login respondia correctamente, pero la llamada a `/admin/orders` podia devolver `401 Unauthorized`.

## Problema observado

Flujo afectado:

```http
POST /auth/user/emailpass
GET /admin/orders
```

Sintoma:

```json
{
  "message": "Unauthorized"
}
```

Impacto en front:

- El dashboard admin no podia cargar el listado de pedidos.
- Las vistas dependientes de pedidos quedaban bloqueadas.
- El login podia parecer correcto aunque el token no sirviera para endpoints admin OOTB.

## Causa raiz

La auth identity del usuario admin DEV existia, pero no siempre estaba enlazada a un actor interno `user`.

En ese estado, el backend podia emitir un JWT valido pero sin `actor_id`. Medusa requiere ese `actor_id` para autorizar rutas admin OOTB como `/admin/orders`.

## Fix aplicado

Archivo modificado:

- `packages/api/src/scripts/seed-b2b-dev.ts`

Cambio:

- Se incluyo por defecto el admin DEV documentado: `admin@carrefour.dev / supersecret`.
- El seed mantiene la logica existente que detecta si la auth identity ya existe.
- Si la identidad existe pero no esta enlazada a un usuario, el seed ejecuta `setAuthAppMetadataWorkflow` para poblar `app_metadata.user_id`.
- Si el enlace ya existe, no duplica usuarios ni identidades.

Commit desplegado:

```text
5e7a2de fix: ensure dev admin auth identity is linked
```

## Validacion backend local

Se valido el flujo critico contra el backend local:

```text
npm run seed:b2b-dev
POST /auth/user/emailpass -> 200
JWT actor_id present -> true
GET /admin/orders -> 200
```

Resultado: `/admin/orders` ya no devuelve `401 Unauthorized` para `admin@carrefour.dev` con token nuevo.

## Acciones para Front

Cuando el deploy de Render DEV termine:

1. Cerrar sesion en el dashboard admin.
2. Limpiar storage/cookies si habia una sesion anterior al fix.
3. Iniciar sesion de nuevo con:

```text
admin@carrefour.dev
supersecret
```

4. Entrar en la vista de pedidos del admin.
5. Confirmar que la llamada a `/admin/orders` responde `200` y que la pantalla carga datos o estado vacio controlado.

## Nota importante

Si front sigue viendo `401 Unauthorized` despues del despliegue, la primera comprobacion debe ser que no se este reutilizando un JWT antiguo. El token nuevo debe incluir `actor_id`.

No se requiere cambio de contrato frontend para este fix. Es una reparacion backend de seed/autenticacion DEV.