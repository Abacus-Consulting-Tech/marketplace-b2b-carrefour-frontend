# Stripe Payment Integration - Backend Update (18 Agosto 2026)

## 🎉 Backend Update: Flujo de Pago Desbloqueado

**Fecha:** 18 Agosto 2026 - 17:00 UTC  
**Estado:** ✅ Payment flow completamente funcional en DEV

---

## ✅ Cambios Implementados por Backend

### 1. Regiones Alineadas entre Local y DEV

✅ **Completado** - 5 regiones europeas operativas:
- 🇪🇸 España - `reg_01M0AAYKP7T4XSM0PWRYHQF0BE`
- 🇫🇷 Francia - `reg_01M0AAYNZ5KW8J1FTQJ8BHVE4Z`  
- 🇵🇹 Portugal - `reg_01M0AAYR6PJWXWKQTN47N2FJRP`
- 🇮🇹 Italia - `reg_01M0AAYTEDBWHJFN1AAPKZ7CRQ`
- 🇩🇪 Alemania - `reg_01M0AAYWPD3TFRSBSJ6VYFJCVN`

### 2. Inventario Configurado

✅ **Stock locations** configurados para todas las ofertas  
✅ Productos disponibles para compra

### 3. Carrito Actualizado

✅ El carrito ahora acepta **`offer_id`** (no `variant_id`)  
✅ Sistema de ofertas totalmente operativo

### 4. Stripe Payment Provider Configurado

✅ **Stripe** disponible como payment provider en todas las regiones  
✅ `payment_collection` creada correctamente  
✅ `payment_session` generada con éxito  
✅ **`client_secret`** de Stripe `payment_intent` disponible

---

## 🔍 Verificación del Código Frontend

### ✅ Frontend Ya Usa `offer_id` Correctamente

**Archivo:** `src/lib/api/mercur-store-client.ts`

```typescript
export interface AddMercurLineItemInput {
  offer_id: string  // ✅ Ya implementado
  quantity: number
}

export const addLineItem = async (cartId: string, input: AddMercurLineItemInput) => {
  const response = await mercurStoreClient.post<unknown, MercurCartResponse>(
    `/carts/${cartId}/line-items`,
    input
  )
  return response.cart
}
```

**Archivo:** `src/app/(marketplace)/marketplace/page.tsx`

```typescript
addItem({
  productId: product.id,
  name: product.name,
  price: product.price,
  quantity: 1,
  image: product.images?.[0],
  offerId: product.offerId,  // ✅ Ya se captura offerId
  variantId: product.variantId,
});
```

✅ **Estado:** El frontend **ya está preparado** para enviar `offer_id` al backend.

---

## 🚀 Flujo de Pago Completo

### Paso 1: Crear Carrito

```bash
POST /store/carts
{
  "region_id": "reg_01M0AAYKP7T4XSM0PWRYHQF0BE"
}

→ Response:
{
  "cart": {
    "id": "cart_xxx",
    "region_id": "reg_01M0AAYKP7T4XSM0PWRYHQF0BE",
    ...
  }
}
```

### Paso 2: Añadir Productos (con offer_id)

```bash
POST /store/carts/{cartId}/line-items
{
  "offer_id": "offer_xxx",  // ← Usar offer_id (no variant_id)
  "quantity": 2
}

→ Response:
{
  "cart": {
    "id": "cart_xxx",
    "items": [
      {
        "id": "item_xxx",
        "quantity": 2,
        "unit_price": 1850,
        "metadata": {
          "offer_id": "offer_xxx"
        }
      }
    ],
    "total": 3700
  }
}
```

### Paso 3: Añadir Dirección de Envío

```bash
POST /store/carts/{cartId}
{
  "email": "customer@example.com",
  "shipping_address": {
    "first_name": "Juan",
    "last_name": "Pérez",
    "address_1": "Calle Mayor 123",
    "city": "Madrid",
    "postal_code": "28001",
    "country_code": "es",
    "phone": "+34 600 000 000"
  }
}
```

### Paso 4: Seleccionar Método de Envío

```bash
# 1. Obtener opciones de envío
GET /store/shipping-options?cart_id={cartId}

→ Response:
{
  "shipping_options": {
    "standard": [
      {
        "id": "so_xxx",
        "name": "Envío Estándar",
        "calculated_price": {
          "calculated_amount": 500,
          "currency_code": "eur"
        }
      }
    ]
  }
}

# 2. Seleccionar opción de envío
POST /store/carts/{cartId}/shipping-methods
{
  "option_id": "so_xxx"
}
```

### Paso 5: Iniciar Payment Session (NUEVO)

```bash
POST /store/payment-collections
{
  "cart_id": "cart_xxx",
  "provider_id": "stripe"
}

→ Response:
{
  "payment_collection": {
    "id": "paycol_xxx",
    "status": "not_paid",
    "payment_sessions": [
      {
        "id": "ps_xxx",
        "provider_id": "stripe",
        "status": "pending",
        "data": {
          "client_secret": "pi_xxx_secret_yyy"  // ← Usar para Stripe.js
        }
      }
    ]
  }
}
```

### Paso 6: Confirmar Pago con Stripe (Frontend)

```typescript
// Frontend - Usando Stripe.js
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);

const { error, paymentIntent } = await stripe.confirmCardPayment(
  client_secret, // ← Del paso 5
  {
    payment_method: {
      card: cardElement,
      billing_details: {
        name: 'Juan Pérez',
        email: 'customer@example.com'
      }
    }
  }
);

if (error) {
  // Manejar error
  console.error(error.message);
} else if (paymentIntent.status === 'succeeded') {
  // Pago exitoso, completar orden
}
```

### Paso 7: Completar Orden

```bash
POST /store/carts/{cartId}/complete

→ Response:
{
  "type": "order",
  "order": {
    "id": "order_xxx",
    "status": "pending",
    "payment_status": "awaiting",
    "total": 4200,
    "items": [...],
    "shipping_address": {...}
  }
}
```

---

## 📋 Checklist de Integración Frontend

### ✅ Ya Implementado

- [x] Usar `offer_id` en lugar de `variant_id` para añadir items
- [x] Mantener `region_id` válido en todo el flujo
- [x] Crear carrito con región válida
- [x] Añadir productos al carrito
- [x] Actualizar cantidades de items
- [x] Eliminar items del carrito

### 🚧 Pendiente de Implementar

- [ ] **Integración de Stripe.js**
  - [ ] Instalar `@stripe/stripe-js` y `@stripe/react-stripe-js`
  - [ ] Configurar Stripe provider en componente de checkout
  - [ ] Crear formulario de tarjeta con `CardElement`
  
- [ ] **Payment Collection Flow**
  - [ ] Crear payment collection al iniciar checkout
  - [ ] Obtener `client_secret` del backend
  - [ ] Confirmar pago con `stripe.confirmCardPayment`
  
- [ ] **Completar Orden**
  - [ ] Llamar a `POST /store/carts/{cartId}/complete` después de pago exitoso
  - [ ] Manejar errores de pago
  - [ ] Mostrar página de confirmación de orden

- [ ] **UI/UX**
  - [ ] Página de checkout con steps indicator
  - [ ] Formulario de dirección de envío
  - [ ] Selector de método de envío
  - [ ] Formulario de pago con Stripe
  - [ ] Página de confirmación de orden
  - [ ] Manejo de errores de pago

---

## 🛠️ Instalación de Dependencias Stripe

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

---

## 📝 Variables de Entorno Necesarias

Añadir a `.env.local`:

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx...
```

**Nota:** Solicitar la Stripe publishable key al equipo backend.

---

## 🐛 Debugging

Si hay errores en la confirmación final del pago, proporcionar:

1. **Request exacta** a `POST /store/payment-collections`:
   ```json
   {
     "cart_id": "cart_xxx",
     "provider_id": "stripe"
   }
   ```

2. **Response completa** con `client_secret`

3. **Error de Stripe.js** (si aplica):
   ```javascript
   {
     error: {
       type: "...",
       code: "...",
       message: "..."
     }
   }
   ```

4. **Request a** `POST /store/carts/{cartId}/complete`

5. **Response o error** del complete

---

## 🎯 Estado Actual del Backend

| Componente | Estado | Notas |
|------------|--------|-------|
| Catálogo | ✅ Disponible | 14 productos, 5 categorías |
| Regiones | ✅ Operativas | 5 regiones europeas |
| Inventario | ✅ Configurado | Stock locations para ofertas |
| Carrito | ✅ Funcional | Acepta `offer_id` |
| Stripe Provider | ✅ Configurado | En todas las regiones |
| Payment Collection | ✅ Funcional | Genera `client_secret` |
| Payment Session | ✅ Funcional | Stripe `payment_intent` creado |

---

## 🚀 Próximos Pasos Frontend

1. **Instalar dependencias de Stripe**
2. **Crear componente de Checkout** con:
   - Step indicator (Envío → Pago → Confirmación)
   - Formulario de dirección
   - Selector de envío
   - Formulario de pago Stripe
3. **Implementar payment flow**:
   - Crear payment collection
   - Obtener client_secret
   - Confirmar pago con Stripe
   - Completar orden
4. **Testing completo** del flujo de compra
5. **Manejo de errores** y estados de carga

---

**Última actualización:** 18 Agosto 2026 - 17:00 UTC  
**Backend:** https://marketplace-b2b-backend-dev.onrender.com  
**Estado:** ✅ Backend listo para integración frontend de pago
