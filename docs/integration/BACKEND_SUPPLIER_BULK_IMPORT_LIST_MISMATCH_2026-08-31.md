# Backend mismatch: importacion masiva supplier vs listado de Mis Productos

Fecha: 2026-08-31
Entorno: DEV Render
Frontend: http://localhost:3000
Backend: https://marketplace-b2b-backend-dev.onrender.com

## Resumen

La importacion masiva de productos para supplier funciona y crea productos en backend, pero esos productos no aparecen despues en la pantalla de supplier "Mis Productos".

El problema no esta en el upload ni en el polling del job. El problema esta en el read-side del catalogo supplier.

## Reproduccion validada

1. Login supplier correcto con `seller@mercur.dev / supersecret`.
2. Upload correcto del archivo `Plantilla_ejemplo_proveedores_carga_productos (1).xlsx`.
3. `POST /vendor/custom/products/import` responde `202 queued`.
4. Polling a `GET /vendor/custom/products/import/:id` termina en `success`.
5. El job exitoso devuelve `created_product_ids` con 100 productos creados.
6. Despues de eso, la pantalla frontend `http://localhost:3000/supplier/products` sigue mostrando solo 1 producto legacy.

## Evidencia concreta

Job exitoso validado:

```json
{
  "id": "f29e4a47-0fb1-42ae-80f1-5ca0852d0774",
  "status": "success",
  "total_rows": 400,
  "processed_rows": 400,
  "created_count": 100,
  "file_name": "Plantilla_ejemplo_proveedores_carga_productos (1).xlsx"
}
```

Para el mismo seller autenticado:

```text
GET /seller/catalog-products?limit=3 -> { "products": [], "total": 0 }
GET /vendor/custom/products?limit=3 -> devuelve 1 producto antiguo legacy
```

## Resultado actual

- El import async crea productos correctamente.
- El endpoint de lectura supplier catalog no devuelve esos productos.
- El fallback legacy `/vendor/custom/products` tampoco refleja la importacion nueva; solo devuelve el registro antiguo.

## Resultado esperado

- Tras un upload exitoso, los productos creados deben ser visibles para el mismo supplier en el listado de Mis Productos.
- `GET /seller/catalog-products` debe devolver los productos creados por `POST /vendor/custom/products/import`.
- Ademas, los productos creados deben exponer su propiedad `state` con valor `started` desde el alta inicial tras la importacion.
- En paralelo, `pricing_status` o equivalente debe seguir permitiendo el flujo de revision/tarificacion pendiente.

## Posible desajuste backend

Ahora mismo parece haber una inconsistencia entre:

- el write-side del import Excel vendor
- y el read-side del seller catalog supplier

Las posibilidades mas probables son:

1. Los productos se crean en otra superficie/modelo que no consume `GET /seller/catalog-products`.
2. El seller catalog filtra por algun campo no inicializado en importacion.
3. La propiedad `state` no se esta seteando en `started` al crear por import y el read-side la excluye.
4. El fallback legacy `/vendor/custom/products` no esta sincronizado con la nueva importacion.

## Peticion a backend

Revisar el flujo completo para que, despues de una importacion `success` de supplier:

1. los productos creados queden asociados al `seller_id` autenticado;
2. `GET /seller/catalog-products` devuelva esos productos;
3. cada producto creado salga con `state = started`;
4. el estado de revision/tarificacion siga siendo pendiente para el flujo B2B actual.

## Impacto frontend

El usuario ve una importacion correcta, pero interpreta que ha fallado porque la pantalla de Mis Productos no muestra los productos nuevos.

Mientras backend no alinee ese read-side, el frontend solo puede mostrar un warning explicando que la importacion puede haber sido correcta aunque el listado no refleje todavia los productos creados.