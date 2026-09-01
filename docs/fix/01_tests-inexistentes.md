# Fix: los scripts de test declaran una infraestructura que no existe

**Estado:** PENDIENTE · **Bloquea:** gate de tests en CI

## Problema

`package.json` declara `test`, `test:e2e`, `test:ui` y `test:coverage`, pero en el repo no existe
`vitest.config.*`, ni `playwright.config.*`, ni un solo fichero de test. `npm test` falla hoy.

## Consecuencia en CI

Los workflows de `.github/workflows/` **no llevan stage de tests**: el gate provisional es que
`next build` termine. Al crear la infraestructura de tests, añadir el stage antes del build de la
imagen.

## Arreglo

Crear configuración de vitest (unit) y playwright (e2e) coherente con los scripts declarados, más
los primeros tests. Encaja hacerlo junto con la integración contra Medusa
(`docs/feature/01_integracion-api-medusa.md`), que es cuando habrá lógica de red que testear.
