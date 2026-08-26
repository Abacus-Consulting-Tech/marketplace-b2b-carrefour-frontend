# Informe para Front - Render DEV validado

## Resumen

El backend de Render DEV queda validado para los flujos admin, vendor y store necesarios para sustituir mocks del front en el modulo de pedidos, sellers y pricing.

Base URL validada:

```text
https://marketplace-b2b-backend-dev.onrender.com
```

Commits backend relevantes:

```text
5e7a2de fix: ensure dev admin auth identity is linked
5604039 feat: implement backend pricing requirements endpoints
8e0125e fix: ensure dev vendor auth identities are linked
```

## Resultado de la prueba en Render DEV

Prueba ejecutada el 2026-08-24 contra Render DEV:

```text
GET /health -> 200 OK

POST /auth/user/emailpass -> 200 token true
admin actor_type -> user
admin actor_id present -> true

GET /auth/session -> 200 OK
GET /admin/users/me -> 200 OK
GET /admin/orders?limit=1 -> 200 OK
GET /admin/sellers?limit=50 -> 200 OK
GET /admin/custom/sellers?limit=50 -> 200 OK
GET /admin/custom/products/pending?limit=5 -> 200 OK
GET /admin/custom/sellers/:sellerId/markup -> 200 OK
GET /admin/custom/sellers/:sellerId/markup/history -> 200 OK

POST /auth/member/emailpass -> 200 token true
vendor actor_type -> member
vendor actor_id present -> true

GET /vendor/sellers/me -> 200 OK
GET /vendor/custom/products?limit=5 -> 200 OK
GET /vendor/custom/sellers/me/markup -> 200 OK

GET /store/regions -> 200 OK
GET /store/products?limit=1 -> 200 OK
```

Seller DEV detectado en Render para `seller@mercur.dev`:

```text
sel_01M0T3BYTKQF7RV18RX93XEAQD
```

## Autenticacion Admin

Credenciales DEV:

```text
admin@carrefour.dev
supersecret
```

Login:

```http
POST {{baseUrl}}/auth/user/emailpass
Content-Type: application/json

{
  "email": "admin@carrefour.dev",
  "password": "supersecret"
}
```

Respuesta esperada:

```json
{
  "token": "<jwt>"
}
```

El JWT admin nuevo debe incluir:

```json
{
  "actor_type": "user",
  "actor_id": "<non-empty>"
}
```

## Autenticacion Vendor

Credenciales DEV:

```text
seller@mercur.dev
supersecret
```

Login:

```http
POST {{baseUrl}}/auth/member/emailpass
Content-Type: application/json

{
  "email": "seller@mercur.dev",
  "password": "supersecret"
}
```

El JWT vendor nuevo debe incluir:

```json
{
  "actor_type": "member",
  "actor_id": "<non-empty>"
}
```

Para rutas `/vendor/*`, ademas del Bearer token, hay que enviar `x-seller-id`.

Ejemplo:

```http
GET {{baseUrl}}/vendor/custom/products?limit=5
Authorization: Bearer {{jwtToken}}
x-seller-id: sel_01M0T3BYTKQF7RV18RX93XEAQD
```

## Endpoints listos para Front

Admin:

```http
GET /auth/session
GET /admin/users/me
GET /admin/orders?limit=1
GET /admin/sellers?limit=50
GET /admin/custom/sellers?limit=50
GET /admin/custom/products/pending?limit=5
GET /admin/custom/sellers/:sellerId/markup
GET /admin/custom/sellers/:sellerId/markup/history
PATCH /admin/custom/sellers/:sellerId/markup
PATCH /admin/custom/products/:productId/pricing-approval
```

Vendor:

```http
GET /vendor/sellers/me
GET /vendor/custom/products?limit=5
POST /vendor/custom/products
GET /vendor/custom/sellers/me/markup
```

Store:

```http
GET /store/regions
GET /store/products?limit=1
POST /store/carts
```

Los endpoints store requieren cabecera `x-publishable-api-key`.

## Script Postman para guardar JWT

Usar en `Scripts > Post-response` de la request de login:

```javascript
let body = {};

try {
  body = pm.response.json();
} catch (e) {
  console.log("Respuesta raw:", pm.response.text());
  throw new Error("La respuesta no es JSON valido");
}

const token = body.token || body.access_token || body.jwt || "";

if (!token) {
  console.log("Status:", pm.response.code);
  console.log("Respuesta login:", body);
  throw new Error("No se encontro token en la respuesta");
}

pm.variables.set("jwtToken", token);
pm.collectionVariables.set("jwtToken", token);

if (pm.environment.name) {
  pm.environment.set("jwtToken", token);
}

pm.test("JWT guardado", function () {
  pm.expect(pm.variables.get("jwtToken")).to.eql(token);
});

console.log("jwtToken guardado");
console.log("local:", Boolean(pm.variables.get("jwtToken")));
console.log("collection:", Boolean(pm.collectionVariables.get("jwtToken")));
console.log("environment:", Boolean(pm.environment.get("jwtToken")));
```

En Postman, para usarlo en una request protegida:

```text
Authorization > Type: Bearer Token
Token: {{jwtToken}}
```

No poner `Bearer {{jwtToken}}` dentro del campo Token de la pestaña Authorization, porque Postman anade `Bearer` automaticamente.

## Notas para integracion Front

- Si front recibe `401`, limpiar storage/cookies y repetir login para obtener un JWT nuevo.
- No reutilizar tokens generados antes de los fixes de auth identity.
- En `/vendor/*`, enviar siempre `x-seller-id` junto al Bearer token.
- En `/store/*`, enviar siempre `x-publishable-api-key`.
- `DELETE /auth/session` es logout OOTB de sesion/cookie Medusa. Si front usa JWT en storage, el logout debe limpiar el token del cliente.

## Estado

Render DEV validado correctamente para los flujos no destructivos de admin, vendor y store.