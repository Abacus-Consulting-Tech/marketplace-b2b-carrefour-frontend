# Carrefour B2B Marketplace — Frontend

El proyecto consiste en crear un marketplace privado para que los franquiciados Carrefour puedan contratar y comprar productos y servicios necesarios para la operación de sus establecimientos, pero que no forman parte de las mercancías destinadas a la venta al consumidor final.

## Stack tecnológico

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** — estilos utilitarios
- **ESLint** — linting

## Módulos implementados

| Ruta | Descripción |
|---|---|
| `/` | Landing page con acceso al login/registro |
| `/login` | Inicio de sesión para franquiciados |
| `/register` | Solicitud de alta de nuevo franquiciado |
| `/dashboard` | Panel de inicio con resumen y alertas |
| `/catalog` | Catálogo de productos y servicios con búsqueda y filtros |
| `/cart` | Carrito de compra |
| `/checkout` | Proceso de pago con tarjeta (3 pasos: dirección, pago, confirmación) |
| `/orders` | Listado de pedidos del franquiciado |
| `/orders/[id]` | Detalle y seguimiento de un pedido concreto |
| `/invoices` | Facturas emitidas por proveedor |
| `/incidents` | Gestión de incidencias (notificación y seguimiento) |
| `/returns` | Solicitudes de devolución |
| `/fees` | Cuota anual del marketplace (pago con tarjeta vía Infocus) |
| `/suppliers` | Gestión de proveedores (panel admin) |
| `/admin` | Panel de información de gestión y liquidaciones |

## Arquitectura del modelo de negocio

- **Infocus** actúa como promotor y operador del marketplace, cobrando la cuota anual y centralizando el cobro de las compras.
- **Proveedores** venden y facturan directamente al franquiciado.
- **Abacus** desarrolla y opera técnicamente la plataforma.

> Los flujos de facturación definitivos deben ser confirmados por los asesores jurídicos y fiscales antes del cierre de contratos.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Build de producción

```bash
npm run build
npm start
```
