# Quick Test - Checkout Stripe-Only (03/09/2026)

**Fecha**: 03 de Septiembre de 2026  
**URL base**: http://localhost:3000  
**Objetivo**: validar los últimos cambios del checkout frontend  
**Foco**: pago solo con tarjeta, selección de direcciones reales del franquiciado, revisión agrupada por proveedor, confirmación asíncrona  

---

## Alcance

Esta guía comprueba que el frontend del checkout ya se comporta según el flujo objetivo, aunque el backend real siga bloqueado en DEV para una compra end-to-end completa.

Cambios a validar:
- el wizard ahora sigue `Dirección -> Revisión -> Pago seguro`
- el paso de dirección debe cargar las `shipping_addresses` reales del franquiciado autenticado cuando existan
- el checkout visible ya no ofrece transferencia bancaria ni pago diferido
- la revisión agrupa productos por proveedor cuando el carrito contiene varios suppliers
- la success page ya no muestra confirmación inmediata obligatoria; primero puede mostrar estado en proceso
- el checkout no crea nuevas tiendas en backend desde self-service porque `POST /store/customers/me/addresses` sigue bloqueado en DEV

---

## Prerrequisitos

### Modo recomendado para esta prueba

Usar el checkout en mock o híbrido con estas condiciones:

```env
NEXT_PUBLIC_MOCK_CHECKOUT=true
NEXT_PUBLIC_MOCK_CATALOG=false
NEXT_PUBLIC_CART_SOURCE=mercur
```

Si el proyecto ya está arrancado:

```bash
npm run dev
```

### Usuario recomendado

Login como franquiciado:

```text
Email: franchisee@carrefour.dev
Password: supersecret
```

---

## Smoke Test Principal

### 1. Acceder al catálogo y cargar un carrito multi-proveedor

1. Ir a `/marketplace` o `/marketplace/shop`
2. Añadir al carrito al menos 2 productos de proveedores distintos
3. Abrir `/marketplace/cart`

**Resultado esperado**:
- el carrito muestra al menos 2 líneas de producto
- no hay error al navegar a checkout
- el botón para continuar al pago está visible

### 2. Entrar en el checkout nuevo

1. Desde el carrito, hacer clic en `Proceder al Pago`
2. Confirmar navegación a `/marketplace/checkout-new`

**Resultado esperado**:
- se ve el wizard de checkout
- el stepper aparece en este orden:
  - `Dirección de envío`
  - `Revisar pedido`
  - `Pago seguro`
- si el carrito está vacío, redirige fuera del checkout

### 3. Seleccionar la dirección

1. Esperar a que el checkout cargue las direcciones del franquiciado autenticado
2. Si aparecen varias, seleccionar una de ellas
3. Pulsar el botón para continuar

**Resultado esperado**:
- se muestran las direcciones reales guardadas para esa franquicia en base de datos
- si existen varias tiendas/direcciones, el usuario puede elegir una
- el checkout avanza a `Revisar pedido`
- no pasa directamente a pago

**Resultado alternativo permitido**:
- si el franquiciado no tiene ninguna dirección guardada, aparece el formulario manual como fallback

**Resultado no esperado en DEV actual**:
- el checkout no da de alta nuevas tiendas reales en backend desde este paso

### 4. Validar la pantalla de revisión

**Resultado esperado**:
- se muestra la dirección completada
- el método de pago visible es `Tarjeta de crédito`
- no aparece `Transferencia bancaria`
- no aparece `Pago diferido`
- si los productos pertenecen a varios proveedores, aparecen agrupados por proveedor
- si hay varios proveedores, aparece un mensaje indicando que es un pago único con preparación/seguimiento por proveedor
- en mock, o cuando el carrito real sí está sincronizado con backend, el CTA principal dice `Continuar al pago seguro`
- en checkout real sin carrito backend sincronizado, debe aparecer el mensaje `El checkout real requiere un carrito sincronizado con el backend. El catálogo actual todavía no expone identificadores válidos para una compra real completa.`

### 5. Ir al pago seguro

1. Pulsar `Continuar al pago seguro`

**Resultado esperado**:
- el checkout avanza al paso `Pago seguro`
- en modo mock aparece un mensaje indicando que el pago se simulará
- en modo real, si la clave pública existe, se renderiza Stripe Elements
- el botón principal dice `Pagar y enviar pedido`

### 6. Completar el pago

#### En modo mock

1. Pulsar `Pagar y enviar pedido`

**Resultado esperado**:
- aparece estado de procesamiento
- al finalizar, navega a `/marketplace/checkout-new/success`

#### En modo real

Usar una tarjeta de prueba Stripe, por ejemplo:

```text
4242 4242 4242 4242
12/28
123
```

**Resultado esperado**:
- Stripe procesa la tarjeta
- el frontend intenta completar el cart
- si backend sigue bloqueado por catálogo/cart, debe verse un error coherente, no una falsa confirmación

### 7. Validar la success page asíncrona

**Resultado esperado**:
- la página muestra número de pedido e ID de transacción
- el título puede ser uno de estos:
  - `Pago recibido, confirmando pedido`
  - `Pedido confirmado`
  - `Estamos finalizando tu pedido`
  - `No hemos podido confirmar el pedido`
- el mensaje explica que la confirmación final depende del backend
- ya no se muestra siempre `Pedido confirmado` de forma inmediata por defecto
- aparecen acciones para `Ver mis pedidos` y `Seguir comprando`

### 8. Validar limpieza del carrito

1. Tras llegar a success, volver a `/marketplace/cart`

**Resultado esperado**:
- el carrito queda vacío después del flujo exitoso
- no vuelve a inyectar los items anteriores

---

## Prueba Específica del Agrupado por Proveedor

Objetivo: comprobar el cambio UX más importante antes del pago.

1. Añadir un producto del proveedor A
2. Añadir un producto del proveedor B
3. Ir a checkout y seleccionar la dirección
4. Revisar la pantalla `Revisar pedido`

**Resultado esperado**:
- aparecen al menos 2 bloques de proveedor
- cada bloque contiene solo sus productos
- el total final sigue siendo único para todo el pedido
- no se generan múltiples botones de pago

---

## Prueba Negativa Recomendada

### Checkout real bloqueado por catálogo Store

Esta prueba sirve para confirmar que el frontend falla de forma explícita y controlada.

1. Poner `NEXT_PUBLIC_MOCK_CHECKOUT=false`
2. Mantener el catálogo actual de DEV
3. Construir un carrito e intentar llegar al paso de pago

**Resultado esperado**:
- si el carrito no está realmente sincronizado con backend, el frontend muestra un mensaje claro
- no se muestra una confirmación falsa
- el problema se identifica como limitación del catálogo/carrito real, no como fallo silencioso de UI

### Alta self-service de nuevas tiendas no disponible en DEV

Esta prueba sirve para evitar falsas expectativas durante QA.

1. Entrar en `/marketplace/checkout-new` con `franchisee@carrefour.dev`
2. Revisar el paso de dirección
3. Intentar encontrar una acción para crear una nueva tienda persistida en backend

**Resultado esperado**:
- el checkout permite seleccionar direcciones existentes
- puede aparecer formulario manual solo como fallback UX
- no debe asumirse que ese formulario crea una nueva `shipping_address` real en backend
- la integración pendiente sigue siendo `POST /store/customers/me/addresses` en DEV

---

## Checklist Rápido

- [ ] El stepper está en orden `Dirección -> Revisar pedido -> Pago seguro`
- [ ] El paso de dirección carga las `shipping_addresses` reales del franquiciado cuando existen
- [ ] Si hay varias direcciones, se puede seleccionar una
- [ ] No aparece transferencia bancaria
- [ ] No aparece pago diferido
- [ ] La review agrupa por proveedor
- [ ] En mock o con carrito real sincronizado, el CTA de review es `Continuar al pago seguro`
- [ ] En checkout real sin carrito sincronizado, aparece el mensaje de bloqueo de sincronización backend
- [ ] El CTA final es `Pagar y enviar pedido`
- [ ] La success page soporta estado intermedio de confirmación
- [ ] El carrito se limpia tras el flujo exitoso
- [ ] En modo real bloqueado, el error es explícito y coherente
- [ ] QA no espera alta real de nuevas tiendas desde checkout mientras `POST /store/customers/me/addresses` siga bloqueado

---

## Resultado Esperado de la Ronda

Si esta guía pasa, queda validado que el frontend ya está alineado con el flujo objetivo de checkout, incluyendo selección de direcciones reales del franquiciado, aunque backend aún no permita cerrar la compra real end-to-end ni el alta self-service de nuevas tiendas en DEV.