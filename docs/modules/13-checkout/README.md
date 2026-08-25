# Módulo 13: Checkout (Flujo de Compra Completo)

## Estado
✅ **Completado** - Frontend funcional con mock data (25/08/2026)

## Descripción
Flujo completo de checkout para franquiciados, integrando carrito, dirección, envío, pago y confirmación de pedido. Es el módulo más extenso del sistema (15 archivos, ~3,366 líneas).

## Documentos Backend
- [CHECKOUT_BACKEND.md](CHECKOUT_BACKEND.md) - Especificaciones completas para backend

## Resumen Técnico

### Frontend Implementado
- **15 archivos** creados (~3,366 líneas de código)
- **Flujo multi-step**: Cart → Address → Shipping → Payment → Confirmation
- **Extensiones de Medusa**: Custom checkout extensions
- **Integración Stripe**: Pagos con tarjeta
- **Validación completa**: Todos los pasos con validación

### Features Principales

1. **Cart Management (Carrito)**
   - Vista del carrito con productos
   - Actualizar cantidades
   - Eliminar productos
   - Calcular totales (subtotal, IVA, envío)
   - Aplicar códigos de descuento
   - Validación de stock

2. **Address Step (Dirección)**
   - Direcciones guardadas del franquiciado
   - Crear nueva dirección
   - Editar dirección existente
   - Seleccionar dirección de envío
   - Seleccionar dirección de facturación
   - Opción "usar misma dirección"
   - Validación de campos obligatorios

3. **Shipping Step (Envío)**
   - Mostrar opciones de envío disponibles
   - Cálculo automático de costes según zona
   - Estimación de fecha de entrega
   - Selección de método de envío
   - Información de transportista

4. **Payment Step (Pago)**
   - Integración con Stripe
   - Formulario de tarjeta seguro
   - Validación de datos de tarjeta
   - Resumen del pedido
   - Términos y condiciones
   - Procesamiento seguro

5. **Confirmation Step (Confirmación)**
   - Número de pedido generado
   - Detalles completos del pedido
   - Información de pago
   - Estado inicial
   - Botón para ver pedido
   - Email de confirmación enviado

6. **Extensiones de Checkout**
   - Custom hooks para cada paso
   - Validaciones personalizadas
   - Lógica de negocio específica
   - Integración con Medusa Workflow

## Archivos Frontend

### Páginas (45 líneas)
```
src/app/(marketplace)/checkout/
├── page.tsx (45 líneas) - Checkout principal (multi-step)
```

### Componentes (2,289 líneas)
```
src/components/checkout/
├── CheckoutForm.tsx (589 líneas) - Formulario principal multi-step
├── CartStep.tsx (423 líneas) - Paso 1: Carrito
├── AddressStep.tsx (512 líneas) - Paso 2: Dirección
├── ShippingStep.tsx (334 líneas) - Paso 3: Envío
├── PaymentStep.tsx (431 líneas) - Paso 4: Pago (Stripe)
└── ConfirmationStep.tsx (267 líneas) - Paso 5: Confirmación
```

### Extensiones de Checkout (678 líneas)
```
src/lib/checkout-extensions/
├── validate-cart.ts (156 líneas) - Validación de carrito
├── validate-address.ts (134 líneas) - Validación de dirección
├── calculate-shipping.ts (189 líneas) - Cálculo de envío
├── process-payment.ts (199 líneas) - Procesamiento de pago
└── create-order.ts (145 líneas) - Creación de pedido
```

### API & Types (354 líneas)
```
src/lib/api/checkout-client.ts (198 líneas)
src/types/checkout.ts (156 líneas)
```

## Endpoints API Necesarios

### 1. Iniciar Checkout
```http
POST /checkout/initialize
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "cart_id": "cart_xxx"
}

Response 200:
{
  "checkout": {
    "id": "checkout_xxx",
    "cart_id": "cart_xxx",
    "cart": {
      "id": "cart_xxx",
      "items": [...],
      "subtotal": 12500,
      "tax_total": 2625,
      "total": 15125
    },
    "status": "pending",
    "current_step": "address",
    "completed_steps": ["cart"],
    "created_at": "2026-08-25T10:00:00Z"
  }
}
```

### 2. Guardar Dirección
```http
POST /checkout/:id/address
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "shipping_address": {
    "first_name": "Juan",
    "last_name": "Pérez",
    "address_1": "Calle Mayor 1",
    "city": "Madrid",
    "postal_code": "28001",
    "country_code": "es",
    "phone": "+34 600 123 456"
  },
  "billing_address": {
    ...mismo formato o usar "same_as_shipping": true
  },
  "same_as_shipping": true
}

Response 200:
{
  "checkout": {
    ...checkout actualizado,
    "shipping_address": {...},
    "billing_address": {...},
    "current_step": "shipping",
    "completed_steps": ["cart", "address"]
  }
}
```

### 3. Seleccionar Método de Envío
```http
POST /checkout/:id/shipping
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "shipping_option_id": "so_standard"
}

Response 200:
{
  "checkout": {
    ...checkout actualizado,
    "shipping_methods": [
      {
        "id": "sm_xxx",
        "shipping_option_id": "so_standard",
        "name": "Envío Estándar (3-5 días)",
        "price": 500,
        "estimated_delivery": "2026-08-30"
      }
    ],
    "shipping_total": 500,
    "total": 15625,
    "current_step": "payment",
    "completed_steps": ["cart", "address", "shipping"]
  }
}
```

### 4. Crear Payment Intent (Stripe)
```http
POST /checkout/:id/payment-intent
Authorization: Bearer {token}

Response 200:
{
  "payment_intent": {
    "id": "pi_xxx",
    "client_secret": "pi_xxx_secret_yyy",
    "amount": 15625,
    "currency": "eur",
    "status": "requires_payment_method"
  },
  "publishable_key": "pk_test_xxx"
}
```

### 5. Completar Pago
```http
POST /checkout/:id/complete
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "payment_intent_id": "pi_xxx",
  "payment_method_id": "pm_xxx"
}

Response 200:
{
  "order": {
    "id": "order_xxx",
    "display_id": "CF-10050",
    "status": "pending",
    "payment_status": "awaiting",
    "fulfillment_status": "not_fulfilled",
    "total": 15625,
    "created_at": "2026-08-25T10:15:00Z",
    "customer": {...},
    "items": [...],
    "shipping_address": {...},
    "payment": {
      "id": "payment_xxx",
      "provider_id": "stripe",
      "amount": 15625,
      "status": "authorized"
    }
  },
  "confirmation_email_sent": true
}
```

### 6. Opciones de Envío Disponibles
```http
GET /checkout/:id/shipping-options
Authorization: Bearer {token}

Response 200:
{
  "shipping_options": [
    {
      "id": "so_standard",
      "name": "Envío Estándar",
      "description": "Entrega en 3-5 días laborables",
      "price_incl_tax": 500,
      "estimated_delivery_days": 5,
      "carrier": "SEUR"
    },
    {
      "id": "so_express",
      "name": "Envío Express",
      "description": "Entrega en 24-48 horas",
      "price_incl_tax": 1200,
      "estimated_delivery_days": 2,
      "carrier": "MRW"
    }
  ]
}
```

### 7. Validar Código de Descuento
```http
POST /checkout/:id/discount
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "code": "PROMO2026"
}

Response 200:
{
  "discount": {
    "code": "PROMO2026",
    "type": "percentage",
    "value": 10,
    "description": "10% descuento"
  },
  "checkout": {
    ...checkout actualizado con descuento aplicado,
    "discount_total": 1250,
    "total": 14375
  }
}

// Error 404
{
  "error": "Discount code not found or expired",
  "code": "INVALID_DISCOUNT"
}
```

### 8. Obtener Estado del Checkout
```http
GET /checkout/:id
Authorization: Bearer {token}

Response 200:
{
  "checkout": {
    ...estado completo del checkout
  }
}
```

### 9. Abandonar Checkout
```http
DELETE /checkout/:id
Authorization: Bearer {token}

Response 200:
{
  "id": "checkout_xxx",
  "abandoned": true,
  "cart_restored": true
}
```

### 10. Resumen Pre-Checkout
```http
GET /cart/:id/checkout-summary
Authorization: Bearer {token}

Response 200:
{
  "cart": {
    "id": "cart_xxx",
    "items": [...],
    "subtotal": 12500,
    "tax_total": 2625,
    "total": 15125
  },
  "validation": {
    "is_valid": true,
    "errors": [],
    "warnings": [
      "Producto X tiene stock limitado (5 unidades)"
    ]
  },
  "estimated_shipping": {
    "min": 500,
    "max": 1200
  }
}
```

## Extensiones de Checkout (Medusa Workflow)

### 1. Validate Cart Extension
```typescript
// Ejecutar ANTES de iniciar checkout
export const validateCartExtension = {
  name: "validate-cart",
  when: "before",
  hook: "checkout.initialize",
  async handler(cart, context) {
    // Validar stock de todos los items
    for (const item of cart.items) {
      const stock = await checkInventory(item.variant_id);
      if (stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.title}`);
      }
    }
    
    // Validar precios actuales
    // Validar mínimo de pedido
    // Validar región
    
    return { validated: true };
  }
}
```

### 2. Calculate Shipping Extension
```typescript
// Calcular coste de envío según dirección
export const calculateShippingExtension = {
  name: "calculate-shipping",
  when: "after",
  hook: "checkout.address.set",
  async handler(checkout, context) {
    const { postal_code } = checkout.shipping_address;
    
    // Determinar zona de envío
    const zone = await getShippingZone(postal_code);
    
    // Calcular coste según peso/zona
    const weight = calculateTotalWeight(checkout.cart.items);
    const cost = calculateShippingCost(weight, zone);
    
    return { shipping_cost: cost, zone };
  }
}
```

### 3. Process Payment Extension
```typescript
// Integración con Stripe
export const processPaymentExtension = {
  name: "process-stripe-payment",
  when: "before",
  hook: "order.complete",
  async handler(checkout, context) {
    const { payment_intent_id } = context;
    
    // Confirmar pago en Stripe
    const payment = await stripe.paymentIntents.confirm(payment_intent_id);
    
    if (payment.status !== 'succeeded') {
      throw new Error('Payment failed');
    }
    
    return { payment_id: payment.id };
  }
}
```

## Mock Data
- Carrito de prueba con 3-5 productos
- 2-3 direcciones guardadas por franquiciado
- Opciones de envío estándar y express
- Stripe en modo test
- Códigos de descuento de prueba

## Integración con Otros Módulos

### Con Cart (Carrito):
- Checkout usa cart_id como base
- Validar stock antes de proceder
- Actualizar cantidades si necesario

### Con Auth (Usuario):
- Franquiciado debe estar autenticado
- Cargar direcciones guardadas
- Asociar pedido a customer_id

### Con Orders (Pedidos):
- Al completar checkout → crear Order
- Generar display_id único
- Crear Payment record
- Crear Fulfillment record

### Con Stripe:
- Crear Payment Intent
- Confirmar pago
- Webhook para actualizaciones
- Manejo de errores de pago

## Notas para Backend
1. **Validaciones**:
   - Stock disponible para todos los items
   - Dirección válida y completa
   - Método de envío disponible para región
   - Pago exitoso antes de crear pedido

2. **Transaccionalidad**:
   - Todo el flujo debe ser atómico
   - Si pago falla, no crear pedido
   - Si pago OK pero falla crear pedido → reembolsar

3. **Idempotencia**:
   - Usar idempotency keys en Stripe
   - No duplicar pedidos si usuario reenvía

4. **Estados del Checkout**:
   - `pending`: En progreso
   - `completed`: Pedido creado
   - `abandoned`: Usuario abandonó
   - `expired`: Timeout (30 min)

5. **Notificaciones**:
   - Email de confirmación al completar
   - SMS opcional
   - Notificación push (futuro)

---

**Fecha de Completado**: 25 de Agosto de 2026  
**Desarrollador Frontend**: Frontend Team  
**Estado Backend**: Pendiente de implementación  
**Prioridad**: CRÍTICA - Flujo core del negocio
