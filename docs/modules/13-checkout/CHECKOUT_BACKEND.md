# Checkout - Backend Implementation Guide

**Módulo**: Flujo de Compra Completo (Multi-Step Checkout)  
**Estado Frontend**: ✅ Completado (25/08/2026)  
**Prioridad Backend**: CRÍTICA - Flujo core del negocio

---

## 📋 Resumen Ejecutivo

Flujo completo de checkout multi-paso que convierte un carrito en un pedido confirmado:
1. **Cart**: Validar carrito y productos
2. **Address**: Guardar direcciones de envío y facturación
3. **Shipping**: Seleccionar método de envío
4. **Payment**: Procesar pago con Stripe
5. **Confirmation**: Crear pedido y enviar confirmación

**Integración**: Cart, Customer, Stripe, Shipping, Order  
**Extensiones**: 10 custom checkout extensions para Medusa Workflow  
**SLA**: < 3 segundos por paso, < 10 segundos total

---

## 🗄️ Modelo de Datos

### Checkout Session
```typescript
{
  id: string;
  cart_id: string;
  customer_id: string;
  status: 'pending' | 'completed' | 'abandoned' | 'expired';
  current_step: 'cart' | 'address' | 'shipping' | 'payment' | 'confirmation';
  completed_steps: string[];
  
  // Direcciones
  shipping_address: Address;
  billing_address: Address;
  same_as_shipping: boolean;
  
  // Envío
  shipping_methods: ShippingMethod[];
  shipping_total: number;
  
  // Pago
  payment_intent_id?: string; // Stripe
  payment_method_id?: string; // Stripe
  
  // Descuentos
  discount_code?: string;
  discount_total: number;
  
  // Totales
  subtotal: number;
  tax_total: number;
  total: number;
  
  // Metadata
  metadata: {
    ip_address?: string;
    user_agent?: string;
    referrer?: string;
  };
  
  created_at: Date;
  updated_at: Date;
  expires_at: Date; // 30 minutos desde creación
  completed_at?: Date;
}
```

### Address
```typescript
{
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  province?: string;
  postal_code: string;
  country_code: string; // ISO 3166-1 alpha-2
  phone: string;
}
```

### ShippingMethod
```typescript
{
  id: string;
  shipping_option_id: string;
  name: string;
  description: string;
  price: number;
  estimated_delivery_days: number;
  estimated_delivery_date: Date;
  carrier: string;
}
```

---

## 🔌 Endpoints API

### 1. POST /checkout/initialize
**Descripción**: Iniciar nueva sesión de checkout desde un carrito

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "cart_id": "cart_01HMYB7Z8WC9K2N5J4X6P7Q8R9"
}
```

**Response 201**:
```json
{
  "checkout": {
    "id": "checkout_xxx",
    "cart_id": "cart_xxx",
    "customer_id": "cus_xxx",
    "status": "pending",
    "current_step": "address",
    "completed_steps": ["cart"],
    "cart": {
      "id": "cart_xxx",
      "region_id": "reg_01M0AAYKP7T4XSM0PWRYHQF0BE",
      "items": [
        {
          "id": "item_xxx",
          "title": "Polo Corporativo Carrefour",
          "variant": {
            "id": "variant_xxx",
            "title": "Talla S",
            "sku": "POLO-CRF-001-S",
            "prices": [
              {
                "amount": 1850,
                "currency_code": "eur"
              }
            ]
          },
          "quantity": 10,
          "unit_price": 1850,
          "subtotal": 18500,
          "tax_lines": [
            {
              "rate": 21,
              "name": "IVA",
              "code": "IVA_21",
              "total": 3885
            }
          ],
          "total": 22385
        }
      ],
      "subtotal": 18500,
      "discount_total": 0,
      "tax_total": 3885,
      "shipping_total": 0,
      "total": 22385
    },
    "subtotal": 18500,
    "tax_total": 3885,
    "total": 22385,
    "expires_at": "2026-08-25T10:30:00Z",
    "created_at": "2026-08-25T10:00:00Z"
  }
}
```

**Validaciones Pre-Checkout**:
- ✅ Cart existe y no está vacío
- ✅ Customer está autenticado
- ✅ Stock disponible para todos los items
- ✅ Precios actuales (no desactualizados)
- ✅ Región válida (España - EUR)
- ✅ No hay otro checkout activo para el mismo cart

**Errores**:
```json
// 400 Bad Request
{
  "error": "Cart is empty",
  "code": "EMPTY_CART"
}

// 409 Conflict
{
  "error": "Checkout session already exists for this cart",
  "code": "CHECKOUT_EXISTS",
  "checkout_id": "checkout_existing"
}

// 422 Unprocessable Entity
{
  "errors": [
    {
      "item_id": "item_xxx",
      "message": "Insufficient stock",
      "available": 5,
      "requested": 10
    }
  ],
  "code": "VALIDATION_FAILED"
}
```

---

### 2. POST /checkout/:id/address
**Descripción**: Guardar direcciones de envío y facturación

**Body**:
```json
{
  "shipping_address": {
    "first_name": "Juan",
    "last_name": "Pérez",
    "company": "Carrefour Express Madrid Centro",
    "address_1": "Calle Mayor 1",
    "address_2": "Portal B, 3ºA",
    "city": "Madrid",
    "province": "Madrid",
    "postal_code": "28001",
    "country_code": "es",
    "phone": "+34 600 123 456"
  },
  "billing_address": {
    ...misma estructura
  },
  "same_as_shipping": false,
  "save_addresses": true
}
```

**Response 200**:
```json
{
  "checkout": {
    ...checkout actualizado,
    "shipping_address": {...},
    "billing_address": {...},
    "current_step": "shipping",
    "completed_steps": ["cart", "address"]
  },
  "available_shipping_options": [
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

**Validaciones**:
- ✅ Campos obligatorios presentes
- ✅ Código postal válido para país
- ✅ Teléfono formato válido
- ✅ País soportado (ES)
- ✅ Provincia existe en país
- ✅ Si `same_as_shipping=true`, copiar shipping a billing

**Side Effects**:
- Si `save_addresses=true`, guardar en `customer.addresses`
- Calcular opciones de envío disponibles para esa zona
- Actualizar `expires_at` (extender 30 min más)

---

### 3. POST /checkout/:id/shipping
**Descripción**: Seleccionar método de envío

**Body**:
```json
{
  "shipping_option_id": "so_standard"
}
```

**Response 200**:
```json
{
  "checkout": {
    ...checkout actualizado,
    "shipping_methods": [
      {
        "id": "sm_xxx",
        "shipping_option_id": "so_standard",
        "name": "Envío Estándar (3-5 días)",
        "price": 500,
        "tax_lines": [
          {
            "rate": 21,
            "name": "IVA",
            "total": 105
          }
        ],
        "total": 605,
        "estimated_delivery_date": "2026-08-30T00:00:00Z",
        "carrier": "SEUR",
        "tracking_url": null
      }
    ],
    "shipping_total": 500,
    "shipping_tax_total": 105,
    "total": 23490,
    "current_step": "payment",
    "completed_steps": ["cart", "address", "shipping"]
  }
}
```

**Validaciones**:
- ✅ `shipping_option_id` válido
- ✅ Opción disponible para dirección seleccionada
- ✅ Peso total del pedido dentro de límites del carrier
- ✅ Dirección completa antes de seleccionar envío

**Cálculo de Shipping**:
```javascript
function calculateShipping(cart, address, option) {
  // 1. Determinar zona geográfica
  const zone = getShippingZone(address.postal_code);
  
  // 2. Calcular peso total
  const weight = cart.items.reduce((sum, item) => 
    sum + (item.variant.weight || 500) * item.quantity, 0
  );
  
  // 3. Obtener tarifa base
  const baseRate = getShippingRate(option.id, zone, weight);
  
  // 4. Aplicar IVA
  const tax = baseRate * 0.21;
  
  return {
    subtotal: baseRate,
    tax: tax,
    total: baseRate + tax
  };
}
```

---

### 4. POST /store/checkout/payment-intent
**Descripción**: Crear el PaymentIntent custom del checkout B2B

**Body**:
```json
{
  "cart_id": "cart_..."
}
```

**Response 200**:
```json
{
  "client_secret": "pi_..._secret_test",
  "payment_intent_id": "pi_...",
  "amount": 18500,
  "currency_code": "eur"
}
```

**Estado actual del contrato**:
- El formato de respuesta existe y ya sirve para cablear la secuencia frontend.
- El `client_secret` sigue simulado a fecha de esta guía: backend debe sustituirlo por un PaymentIntent Stripe real antes de usar `stripe.confirmPayment`/`PaymentElement` en producción.
- `400` si falta `cart_id` o el total es cero, `401` si no hay sesión autenticada y `404` si el carrito no existe.

**Backend requerido**:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(cart) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: cart.total,
    currency: 'eur',
    automatic_payment_methods: {
      enabled: true,
    },
    description: `Pedido Carrefour B2B - Cart ${cart.id}`,
    metadata: {
      cart_id: cart.id,
      customer_id: cart.customer_id,
    }
  });

  return {
    client_secret: paymentIntent.client_secret,
    payment_intent_id: paymentIntent.id,
    amount: cart.total,
    currency_code: cart.currency_code,
  };
}
```

---

### 5. POST /store/checkout/complete
**Descripción**: Finalizar el checkout custom y crear el pedido en espera de confirmación de pago

**Body**:
```json
{
  "cart_id": "cart_...",
  "payment_intent_id": "pi_..."
}
```

**Response 200**:
```json
{
  "success": true,
  "order_id": "order_...",
  "status": "pending_payment",
  "total": 18500,
  "payment_intent_id": "pi_...",
  "message": "Order created. Payment processing."
}
```

**Regla de frontend/backend**:
- Esta respuesta no confirma el cobro. La fuente de verdad es el webhook Stripe verificado.
- El frontend debe mostrar `Procesando pago` y volver a consultar el pedido/backend hasta que el estado final exista allí.
- `400` para cuerpo incompleto o carrito vacío, `401` sin sesión y `404` si el carrito no existe.

### 6. Webhook Stripe
**Descripción**: Confirmación definitiva del pago. No lo llama el frontend.

```http
POST /webhooks/stripe
```

- Debe validar `stripe-signature`
- Debe ser idempotente
- Debe marcar el pago/pedido como confirmado solo al procesar el evento firmado
- El navegador nunca debe marcar el pedido como pagado por leer `paymentIntent.status` directamente
    
    "shipping_address": {
      "first_name": "Juan",
      "last_name": "Pérez",
      "company": "Carrefour Express Madrid Centro",
      "address_1": "Calle Mayor 1",
      "city": "Madrid",
      "postal_code": "28001",
      "country_code": "es",
      "phone": "+34 600 123 456"
    },
    
    "billing_address": {...},
    
    "shipping_methods": [
      {
        "shipping_option_id": "so_standard",
        "name": "Envío Estándar",
        "price": 500,
        "tax_total": 105,
        "total": 605
      }
    ],
    
    "payments": [
      {
        "id": "pay_xxx",
        "amount": 23490,
        "currency_code": "eur",
        "provider_id": "stripe",
        "data": {
          "payment_intent_id": "pi_3Nxxx",
          "payment_method_id": "pm_1Nxxx",
          "status": "succeeded"
        },
        "captured_at": "2026-08-25T10:15:00Z"
      }
    ],
    
    "subtotal": 18500,
    "discount_total": 0,
    "shipping_total": 500,
    "tax_total": 3990,
    "total": 23490,
    
    "created_at": "2026-08-25T10:15:00Z",
    "updated_at": "2026-08-25T10:15:00Z"
  },
  "checkout_completed": true,
  "confirmation_email_sent": true
}
```

**Flujo Completo**:
```javascript
async function completeCheckout(checkoutId, paymentData) {
  // 1. Verificar checkout válido
  const checkout = await getCheckout(checkoutId);
  if (!checkout || checkout.status !== 'pending') {
    throw new Error('Invalid checkout');
  }
  
  // 2. Confirmar pago en Stripe
  const payment = await stripe.paymentIntents.confirm(
    paymentData.payment_intent_id,
    { payment_method: paymentData.payment_method_id }
  );
  
  if (payment.status !== 'succeeded') {
    throw new Error('Payment failed');
  }
  
  // TRANSACCIÓN ATÓMICA:
  const transaction = await db.beginTransaction();
  
  try {
    // 3. Crear Order desde Cart
    const order = await createOrderFromCart(checkout.cart_id, {
      shipping_address: checkout.shipping_address,
      billing_address: checkout.billing_address,
      shipping_methods: checkout.shipping_methods,
      payment_data: payment,
    });
    
    // 4. Reducir stock
    await decrementInventory(order.items);
    
    // 5. Marcar checkout como completado
    await updateCheckout(checkoutId, {
      status: 'completed',
      completed_at: new Date(),
    });
    
    // 6. Eliminar/archivar cart
    await archiveCart(checkout.cart_id);
    
    await transaction.commit();
    
    // 7. Enviar email de confirmación (async)
    await sendOrderConfirmationEmail(order);
    
    return order;
    
  } catch (error) {
    await transaction.rollback();
    
    // Reembolsar pago si la orden falló
    await stripe.refunds.create({
      payment_intent: payment.id,
      reason: 'requested_by_customer',
    });
    
    throw error;
  }
}
```

**Validaciones Finales**:
- ✅ Todos los pasos completados
- ✅ Pago confirmado en Stripe
- ✅ Stock sigue disponible (double-check)
- ✅ Checkout no expirado
- ✅ No hay orden duplicada

---

### 6. GET /checkout/:id/shipping-options
**Descripción**: Obtener opciones de envío disponibles

**Query Parameters**:
```
?address_id=addr_xxx (opcional, usar dirección guardada)
```

**Response 200**:
```json
{
  "shipping_options": [
    {
      "id": "so_standard",
      "name": "Envío Estándar",
      "description": "Entrega en 3-5 días laborables",
      "price_incl_tax": 500,
      "estimated_delivery_days": 5,
      "carrier": "SEUR",
      "metadata": {
        "icon": "truck",
        "supports_tracking": true
      }
    },
    {
      "id": "so_express",
      "name": "Envío Express",
      "description": "Entrega en 24-48 horas",
      "price_incl_tax": 1200,
      "estimated_delivery_days": 2,
      "carrier": "MRW",
      "metadata": {
        "icon": "zap",
        "supports_tracking": true
      }
    }
  ],
  "zone": "ES_CENTER",
  "postal_code": "28001"
}
```

---

### 7. POST /checkout/:id/discount
**Descripción**: Aplicar código de descuento

**Body**:
```json
{
  "code": "PROMO2026"
}
```

**Response 200**:
```json
{
  "discount": {
    "code": "PROMO2026",
    "rule": {
      "type": "percentage",
      "value": 10,
      "description": "10% descuento en todo el pedido"
    },
    "amount": 1850 // centavos descontados
  },
  "checkout": {
    ...checkout actualizado,
    "discount_code": "PROMO2026",
    "discount_total": 1850,
    "subtotal": 18500,
    "total": 21640 // subtotal + tax + shipping - discount
  }
}
```

**Validaciones**:
- ✅ Código existe y está activo
- ✅ No expirado
- ✅ Aplicable a región EUR
- ✅ Mínimo de compra cumplido
- ✅ Uso máximo no excedido

**Errores**:
```json
// 404 Not Found
{
  "error": "Discount code not found or expired",
  "code": "INVALID_DISCOUNT"
}

// 400 Bad Request
{
  "error": "Minimum purchase amount not met",
  "code": "MIN_AMOUNT_NOT_MET",
  "required": 5000,
  "current": 3000
}
```

---

### 8. DELETE /checkout/:id/discount
**Descripción**: Eliminar código de descuento aplicado

**Response 200**:
```json
{
  "checkout": {
    ...checkout sin descuento,
    "discount_code": null,
    "discount_total": 0,
    "total": 23490
  }
}
```

---

### 9. GET /checkout/:id
**Descripción**: Obtener estado actual del checkout

**Response 200**:
```json
{
  "checkout": {
    ...estado completo
  }
}
```

---

### 10. DELETE /checkout/:id
**Descripción**: Cancelar/abandonar checkout

**Response 200**:
```json
{
  "id": "checkout_xxx",
  "status": "abandoned",
  "cart_restored": true,
  "payment_intent_cancelled": true
}
```

**Side Effects**:
- Marcar checkout como `abandoned`
- Restaurar cart a estado activo
- Cancelar Payment Intent en Stripe
- No reducir stock (no se llegó a crear orden)

---

## 🔄 Checkout Extensions (Medusa Workflow)

### Extension 1: Validate Cart
**Hook**: `checkout.initialize` (before)  
**Purpose**: Validar carrito antes de iniciar checkout

```javascript
{
  name: "validate-cart-before-checkout",
  when: "before",
  hook: "checkout.initialize",
  
  async handler(cart, context) {
    // Validar items
    if (!cart.items || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }
    
    // Validar stock
    for (const item of cart.items) {
      const variant = await getProductVariant(item.variant_id);
      if (!variant || variant.inventory_quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for ${item.title}. ` +
          `Available: ${variant.inventory_quantity}, Requested: ${item.quantity}`
        );
      }
    }
    
    // Validar región
    if (cart.region_id !== 'reg_01M0AAYKP7T4XSM0PWRYHQF0BE') {
      throw new Error("Only ES region supported");
    }
    
    return { validated: true };
  }
}
```

### Extension 2: Calculate Totals
**Hook**: `checkout.shipping.set` (after)  
**Purpose**: Recalcular totales después de seleccionar envío

```javascript
{
  name: "recalculate-totals-after-shipping",
  when: "after",
  hook: "checkout.shipping.set",
  
  async handler(checkout, context) {
    const subtotal = checkout.cart.subtotal;
    const shipping = checkout.shipping_total;
    const discount = checkout.discount_total || 0;
    
    const taxableAmount = subtotal + shipping - discount;
    const taxTotal = Math.round(taxableAmount * 0.21);
    
    const total = taxableAmount + taxTotal;
    
    await updateCheckout(checkout.id, {
      tax_total: taxTotal,
      total: total,
    });
    
    return { total };
  }
}
```

### Extension 3: Reserve Inventory
**Hook**: `order.create` (before)  
**Purpose**: Reservar stock antes de crear orden

```javascript
{
  name: "reserve-inventory-before-order",
  when: "before",
  hook: "order.create",
  
  async handler(cart, context) {
    const reservations = [];
    
    for (const item of cart.items) {
      const reservation = await createInventoryReservation({
        variant_id: item.variant_id,
        quantity: item.quantity,
        expires_at: new Date(Date.now() + 15 * 60 * 1000), // 15 min
      });
      
      reservations.push(reservation);
    }
    
    return { reservations };
  }
}
```

### Extension 4: Send Confirmation Email
**Hook**: `order.create` (after)  
**Purpose**: Enviar email de confirmación

```javascript
{
  name: "send-order-confirmation-email",
  when: "after",
  hook: "order.create",
  
  async handler(order, context) {
    await sendEmail({
      to: order.email,
      template: 'order-confirmation',
      data: {
        order_id: order.display_id,
        customer_name: `${order.customer.first_name} ${order.customer.last_name}`,
        total: formatCurrency(order.total),
        items: order.items,
        shipping_address: order.shipping_address,
        estimated_delivery: calculateEstimatedDelivery(order),
      },
    });
    
    return { email_sent: true };
  }
}
```

### Extension 5: Create Stripe Webhook
**Hook**: `stripe.payment_intent.succeeded` (webhook)  
**Purpose**: Actualizar estado del pago

```javascript
{
  name: "stripe-payment-intent-succeeded",
  event: "stripe.payment_intent.succeeded",
  
  async handler(paymentIntent, context) {
    const checkoutId = paymentIntent.metadata.checkout_id;
    
    await updateCheckout(checkoutId, {
      payment_status: 'paid',
      payment_confirmed_at: new Date(),
    });
    
    // Crear orden automáticamente
    const order = await completeCheckout(checkoutId, {
      payment_intent_id: paymentIntent.id,
    });
    
    return { order_created: true };
  }
}
```

---

## 📊 SQL Schema

```sql
-- Tabla de sesiones de checkout
CREATE TABLE checkout_sessions (
  id VARCHAR PRIMARY KEY,
  cart_id VARCHAR NOT NULL REFERENCES cart(id),
  customer_id VARCHAR NOT NULL REFERENCES customer(id),
  status VARCHAR CHECK (status IN ('pending', 'completed', 'abandoned', 'expired')),
  current_step VARCHAR,
  completed_steps JSONB DEFAULT '[]',
  
  -- Direcciones
  shipping_address JSONB,
  billing_address JSONB,
  same_as_shipping BOOLEAN DEFAULT true,
  
  -- Envío
  shipping_methods JSONB,
  shipping_total INTEGER DEFAULT 0,
  
  -- Pago
  payment_intent_id VARCHAR,
  payment_method_id VARCHAR,
  payment_status VARCHAR,
  
  -- Descuentos
  discount_code VARCHAR,
  discount_total INTEGER DEFAULT 0,
  
  -- Totales
  subtotal INTEGER NOT NULL,
  tax_total INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  
  UNIQUE(cart_id) -- Solo un checkout activo por cart
);

-- Índices
CREATE INDEX idx_checkout_customer ON checkout_sessions(customer_id);
CREATE INDEX idx_checkout_status ON checkout_sessions(status);
CREATE INDEX idx_checkout_expires ON checkout_sessions(expires_at);
CREATE INDEX idx_checkout_payment_intent ON checkout_sessions(payment_intent_id);

-- Trigger para limpiar checkouts expirados (cron job)
CREATE OR REPLACE FUNCTION expire_old_checkouts()
RETURNS void AS $$
BEGIN
  UPDATE checkout_sessions
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Ejecutar cada 5 minutos
SELECT cron.schedule('expire-checkouts', '*/5 * * * *', 'SELECT expire_old_checkouts()');
```

---

## 🧪 Testing

### Casos de Prueba Recomendados:

1. **Happy Path Completo** → Checkout OK, orden creada
2. **Stock insuficiente al iniciar** → Error 422
3. **Dirección inválida** → Error 400
4. **Método de envío no disponible** → Error 404
5. **Pago rechazado por Stripe** → Error, no crear orden
6. **Código descuento inválido** → Error 404
7. **Código descuento expirado** → Error 400
8. **Checkout expirado (> 30 min)** → Error 410 Gone
9. **Doble submit al completar** → Idempotencia, no duplicar
10. **Abandono en step 2** → Cart restaurado, no orden

---

## 🔒 Seguridad

1. **CSRF Protection**: Usar tokens CSRF en cada paso
2. **Rate Limiting**: Máximo 10 checkouts por hora por usuario
3. **Idempotency**: Usar `Idempotency-Key` header en requests críticos
4. **PCI Compliance**: Nunca guardar datos de tarjeta (usar Stripe)
5. **Input Validation**: Sanitizar todas las direcciones y datos de usuario

---

## 📈 Métricas

Track en analytics:
- Tasa de conversión por paso (cuántos abandonan en cada step)
- Tiempo promedio en cada paso
- Métodos de pago más usados
- Códigos de descuento más populares
- Errores de pago más comunes

---

**Documentado por**: Frontend Team  
**Fecha**: 25 de Agosto de 2026  
**Próximos pasos**: Implementación backend + integración Medusa Workflow + Stripe
