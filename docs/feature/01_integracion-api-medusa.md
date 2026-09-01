# Feature: integración con el backend Medusa/Mercur

**Estado:** PENDIENTE · **Decisión previa (2026-08-12): este front es el canónico y se conectará al backend.**

## Situación verificada

El front NO está integrado: llama exactamente a 5 endpoints (`POST /auth/login`,
`POST /auth/register`, `POST /auth/forgot-password`, `GET /products`, `GET /products/:id`) contra
`NEXT_PUBLIC_API_URL` (default `http://localhost:4000/api`), un API que **no existe en ningún
repo**. Auth con JWT propio (`auth-token` en localStorage). Carrito y checkout son 100% estado
local (zustand + persist, cero llamadas de red). Sin `NEXT_PUBLIC_API_URL` o con
`NEXT_PUBLIC_MOCK_AUTH=true`, cae a `MOCK_USERS`/`MOCK_PRODUCTS` hardcodeados — el modo en el que
ha vivido siempre.

## Caminos

| Camino | Qué implica |
|---|---|
| **A. Reescribir la capa API contra Medusa** (recomendado) | `client.ts` + páginas: auth `/auth/{actor}/{provider}`, catálogo `/store/products` con header `x-publishable-api-key`, carrito/checkout contra `/store/carts`. Sin piezas nuevas que operar |
| **B. Construir el BFF de `API_SPECIFICATION.md`** | El servicio ":4000" que el front espera, traduciendo a Medusa. Tercera pieza a mantener y dockerizar; solo si el contrato `{success,data,message}` es requisito firme |

## Requisitos cruzados (ya contemplados en Docker)

- El CORS del backend debe listar el origen público de este front (documentado en los dos
  `.env.example`).
- `NEXT_PUBLIC_API_URL` debe ser alcanzable **desde el navegador** (nunca un hostname interno de
  Docker): todas las llamadas nacen client-side.
