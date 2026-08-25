# 🔧 Backend Request: Order Seeding for Testing

**Para:** Equipo Backend  
**De:** Frontend Team  
**Fecha:** 2026-08-25  
**Prioridad:** Media  

---

## 📋 Resumen

Necesitamos poblar la base de datos DEV con pedidos de ejemplo para testing del dashboard admin. El frontend ya tiene autenticación funcionando y puede listar productos, pero necesitamos datos de pedidos reales.

---

## ⚠️ Problema Actual

Intentamos crear pedidos via API Store (`POST /store/carts/:id/complete`) pero falla con:

```json
{
  "type": "invalid_data",
  "message": "Payment sessions are required to complete cart"
}
```

**Estado del script frontend:**
- ✅ Autentica correctamente como admin
- ✅ Obtiene productos (16 productos encontrados)
- ✅ Crea carritos con región España
- ✅ Agrega productos usando `offer_id`
- ✅ Inicia payment collection
- ❌ Falla al completar carrito → orden (requiere payment sessions)

---

## 🎯 Request

Necesitamos **8 pedidos de ejemplo** en la base de datos DEV para testing.

### Opciones de Implementación

#### Opción A: Script de Seed Backend (Preferida)
Crear un script similar a `seed-b2b-dev.ts` que:
- Cree órdenes directamente saltando validación de payment
- O configure un payment provider "manual" para testing
- Inserte los datos de pedidos de ejemplo (ver abajo)

#### Opción B: SQL Direct Insert
Insertar directamente en las tablas de Medusa:
- `order`
- `order_item` / `line_item`
- `payment`
- `fulfillment`

#### Opción C: Endpoint Admin Custom
Crear endpoint admin `POST /admin/orders/seed` que:
- Solo funcione en DEV
- Cree órdenes bypass payment validation
- Retorne lista de IDs de órdenes creadas

---

## 📦 Datos de Pedidos Requeridos

### Pedido 1: CF-10001
```json
{
  "display_id": "CF-10001",
  "email": "franchisee@test.com",
  "status": "completed",
  "payment_status": "captured",
  "fulfillment_status": "fulfilled",
  "shipping_address": {
    "first_name": "Juan",
    "last_name": "Pérez",
    "address_1": "Calle Mayor 123, 2º A",
    "city": "Madrid",
    "postal_code": "28001",
    "country_code": "es",
    "phone": "+34 666 123 456"
  },
  "items": [
    {
      "title": "Chaqueta de Trabajo Unisex",
      "sku": "UNI-002",
      "quantity": 20,
      "unit_price": 4500,
      "variant_id": "variant_01M0A8ATK477GEPA69MA4QH3HG"
    },
    {
      "title": "Cartel de Precios PVC (Pack 10 uds)",
      "sku": "SEN-001",
      "quantity": 3,
      "unit_price": 5500,
      "variant_id": "variant_01M0A8BXJT7VS6M02VDZ6SRYGJ"
    }
  ],
  "region_id": "reg_01M0AAYKP7T4XSM0PWRYHQF0BE",
  "currency_code": "eur",
  "tax_rate": 0.21
}
```

### Pedido 2: CF-10002
```json
{
  "display_id": "CF-10002",
  "email": "franchisee@test.com",
  "status": "processing",
  "payment_status": "captured",
  "fulfillment_status": "not_fulfilled",
  "shipping_address": {
    "first_name": "Juan",
    "last_name": "Pérez",
    "address_1": "Calle Mayor 123, 2º A",
    "city": "Madrid",
    "postal_code": "28001",
    "country_code": "es",
    "phone": "+34 666 123 456"
  },
  "items": [
    {
      "title": "Bolsa Reutilizable Carrefour (Pack 100 uds)",
      "sku": "MER-001",
      "quantity": 5,
      "unit_price": 6500,
      "variant_id": "variant_01M0A8DHN57KH7AJJ9FEFRGCSW"
    }
  ],
  "region_id": "reg_01M0AAYKP7T4XSM0PWRYHQF0BE",
  "currency_code": "eur",
  "tax_rate": 0.21
}
```

### Pedido 3: CF-10003
```json
{
  "display_id": "CF-10003",
  "email": "admin@carrefour.dev",
  "status": "shipped",
  "payment_status": "captured",
  "fulfillment_status": "shipped",
  "shipping_address": {
    "first_name": "Admin",
    "last_name": "Carrefour",
    "address_1": "Avenida Diagonal 123",
    "city": "Barcelona",
    "postal_code": "08001",
    "country_code": "es",
    "phone": "+34 666 999 888"
  },
  "items": [
    {
      "title": "Balanza Digital de Mostrador",
      "sku": "EQU-001",
      "quantity": 2,
      "unit_price": 18900,
      "variant_id": "variant_01M0A8CQN8HM98X3D05T01KYFR"
    },
    {
      "title": "Totem Expositivo de Pie",
      "sku": "SEN-003",
      "quantity": 1,
      "unit_price": 12500,
      "variant_id": "variant_01M0A8CF0JM79E5RFRT7W9ESD0"
    }
  ],
  "region_id": "reg_01M0AAYKP7T4XSM0PWRYHQF0BE",
  "currency_code": "eur",
  "tax_rate": 0.21
}
```

### Pedido 4: CF-10004
```json
{
  "display_id": "CF-10004",
  "email": "franchisee@test.com",
  "status": "pending",
  "payment_status": "awaiting",
  "fulfillment_status": "not_fulfilled",
  "shipping_address": {
    "first_name": "María",
    "last_name": "González",
    "address_1": "Calle del Sol 45",
    "city": "Valencia",
    "postal_code": "46001",
    "country_code": "es",
    "phone": "+34 666 777 555"
  },
  "items": [
    {
      "title": "Chaqueta de Trabajo Unisex",
      "sku": "UNI-002",
      "quantity": 10,
      "unit_price": 4500,
      "variant_id": "variant_01M0A8ATK477GEPA69MA4QH3HG"
    },
    {
      "title": "Delantal de Trabajo",
      "sku": "UNI-003",
      "quantity": 15,
      "unit_price": 1290,
      "variant_id": "variant_01M0A8B37JGWS28HF0P0YVS0PT"
    },
    {
      "title": "Boligrafo Corporativo (Pack 200 uds)",
      "sku": "MER-002",
      "quantity": 2,
      "unit_price": 4800,
      "variant_id": "variant_01M0A8DTC2T7JCR3AGQ995299W"
    }
  ],
  "region_id": "reg_01M0AAYKP7T4XSM0PWRYHQF0BE",
  "currency_code": "eur",
  "tax_rate": 0.21
}
```

### Pedido 5: CF-10005
```json
{
  "display_id": "CF-10005",
  "email": "admin@carrefour.dev",
  "status": "completed",
  "payment_status": "captured",
  "fulfillment_status": "fulfilled",
  "shipping_address": {
    "first_name": "Carlos",
    "last_name": "Martínez",
    "address_1": "Plaza Mayor 10",
    "city": "Sevilla",
    "postal_code": "41001",
    "country_code": "es",
    "phone": "+34 666 444 333"
  },
  "items": [
    {
      "title": "Folleto Promocional A5 (Pack 1.000 uds)",
      "sku": "FOL-001",
      "quantity": 3,
      "unit_price": 8900,
      "variant_id": "variant_01M0A8BC0TZKR0QYAPHZDDAJZN"
    },
    {
      "title": "Catalogo de Productos A4 (Pack 500 uds)",
      "sku": "FOL-002",
      "quantity": 2,
      "unit_price": 21000,
      "variant_id": "variant_01M0A8BMNJESMRDQ2BJPW14029"
    }
  ],
  "region_id": "reg_01M0AAYKP7T4XSM0PWRYHQF0BE",
  "currency_code": "eur",
  "tax_rate": 0.21
}
```

### Pedido 6: CF-10006
```json
{
  "display_id": "CF-10006",
  "email": "franchisee@test.com",
  "status": "processing",
  "payment_status": "captured",
  "fulfillment_status": "partially_fulfilled",
  "shipping_address": {
    "first_name": "Ana",
    "last_name": "Rodríguez",
    "address_1": "Calle de la Paz 88",
    "city": "Zaragoza",
    "postal_code": "50001",
    "country_code": "es",
    "phone": "+34 666 222 111"
  },
  "items": [
    {
      "title": "Vinilo Adhesivo para Suelo",
      "sku": "SEN-002",
      "quantity": 10,
      "unit_price": 3800,
      "variant_id": "variant_01M0A8C6C6B1NT11TWWJZ7NPJA"
    },
    {
      "title": "Cartel de Precios PVC (Pack 10 uds)",
      "sku": "SEN-001",
      "quantity": 5,
      "unit_price": 5500,
      "variant_id": "variant_01M0A8BXJT7VS6M02VDZ6SRYGJ"
    }
  ],
  "region_id": "reg_01M0AAYKP7T4XSM0PWRYHQF0BE",
  "currency_code": "eur",
  "tax_rate": 0.21
}
```

### Pedido 7: CF-10007
```json
{
  "display_id": "CF-10007",
  "email": "admin@carrefour.dev",
  "status": "completed",
  "payment_status": "captured",
  "fulfillment_status": "fulfilled",
  "shipping_address": {
    "first_name": "Laura",
    "last_name": "Fernández",
    "address_1": "Gran Vía 42",
    "city": "Málaga",
    "postal_code": "29001",
    "country_code": "es",
    "phone": "+34 666 888 777"
  },
  "items": [
    {
      "title": "Expositor Metalico Giratorio 4 Caras",
      "sku": "EQU-002",
      "quantity": 3,
      "unit_price": 32000,
      "variant_id": "variant_01M0A8D0C3AEZ7CHQ3CPB4QNKP"
    },
    {
      "title": "Carro de Transporte Plegable",
      "sku": "EQU-003",
      "quantity": 5,
      "unit_price": 7400,
      "variant_id": "variant_01M0A8D91E8RJT7EWRK63Q0BCC"
    }
  ],
  "region_id": "reg_01M0AAYKP7T4XSM0PWRYHQF0BE",
  "currency_code": "eur",
  "tax_rate": 0.21
}
```

### Pedido 8: CF-10008
```json
{
  "display_id": "CF-10008",
  "email": "franchisee@test.com",
  "status": "pending",
  "payment_status": "awaiting",
  "fulfillment_status": "not_fulfilled",
  "shipping_address": {
    "first_name": "Pedro",
    "last_name": "López",
    "address_1": "Paseo de Gracia 99",
    "city": "Barcelona",
    "postal_code": "08008",
    "country_code": "es",
    "phone": "+34 666 333 222"
  },
  "items": [
    {
      "title": "Taza Ceramica con Logotipo (Pack 24 uds)",
      "sku": "MER-003",
      "quantity": 4,
      "unit_price": 9600,
      "variant_id": "variant_01M0A8E300KJGQ5Z90BPSN3R7S"
    },
    {
      "title": "Bolsa Reutilizable Carrefour (Pack 100 uds)",
      "sku": "MER-001",
      "quantity": 3,
      "unit_price": 6500,
      "variant_id": "variant_01M0A8DHN57KH7AJJ9FEFRGCSW"
    }
  ],
  "region_id": "reg_01M0AAYKP7T4XSM0PWRYHQF0BE",
  "currency_code": "eur",
  "tax_rate": 0.21
}
```

---

## 📊 Resumen de Datos

| Pedido | Email | Estado | Items | Subtotal (cents) | Estado Pago |
|--------|-------|--------|-------|------------------|-------------|
| CF-10001 | franchisee | completed | 2 | 106500 | captured |
| CF-10002 | franchisee | processing | 1 | 32500 | captured |
| CF-10003 | admin | shipped | 2 | 50300 | captured |
| CF-10004 | franchisee | pending | 3 | 73950 | awaiting |
| CF-10005 | admin | completed | 2 | 68700 | captured |
| CF-10006 | franchisee | processing | 2 | 65500 | captured |
| CF-10007 | admin | completed | 2 | 133000 | captured |
| CF-10008 | franchisee | pending | 2 | 57900 | awaiting |

**Total:** 8 pedidos, 588,350 cents (5,883.50 EUR sin IVA)

---

## 🔑 Información Importante

### IDs Reales de la Base de Datos

**Región:**
- ID: `reg_01M0AAYKP7T4XSM0PWRYHQF0BE`
- Nombre: España
- Currency: EUR

**Usuarios Existentes:**
- `admin@carrefour.dev` (Admin user - ya existe)
- `franchisee@test.com` (Puede necesitar crearse o usar customer existente)

**Variant IDs:**
Todos los `variant_id` son IDs reales de productos existentes en la BD DEV actual.

### Precios

Los precios están en **centavos** (cents):
- 4500 = 45.00 EUR
- 1290 = 12.90 EUR
- etc.

### Estados

**Order Status:**
- `pending` - Pendiente
- `processing` - En proceso
- `shipped` - Enviado
- `completed` - Completado

**Payment Status:**
- `awaiting` - Esperando pago
- `captured` - Pago capturado

**Fulfillment Status:**
- `not_fulfilled` - Sin enviar
- `partially_fulfilled` - Parcialmente enviado
- `shipped` - Enviado
- `fulfilled` - Completado

---

## 💡 Ejemplo de Implementación (TypeScript)

```typescript
// packages/api/src/scripts/seed-orders-dev.ts

import { MedusaContainer } from "@medusajs/framework/types"

export async function seedOrdersDev(container: MedusaContainer) {
  const orderService = container.resolve("orderService")
  const paymentService = container.resolve("paymentService")
  
  const ordersData = [
    {
      display_id: "CF-10001",
      email: "franchisee@test.com",
      status: "completed",
      // ... resto de datos
    },
    // ... más pedidos
  ]

  for (const orderData of ordersData) {
    // Crear orden directamente en la BD
    const order = await orderService.create({
      region_id: orderData.region_id,
      email: orderData.email,
      shipping_address: orderData.shipping_address,
      items: orderData.items,
      currency_code: orderData.currency_code,
      // Bypass payment validation en DEV
      payment_status: orderData.payment_status,
      status: orderData.status,
    })

    console.log(`✓ Orden creada: ${order.display_id}`)
  }
}
```

---

## ✅ Criterios de Aceptación

1. **8 pedidos** insertados en BD DEV
2. IDs de pedidos: CF-10001 a CF-10008
3. Todos los productos referenciados existen
4. Estados variados (pending, processing, shipped, completed)
5. Endpoint `GET /admin/orders` retorna los 8 pedidos
6. Frontend puede listar y visualizar todos los pedidos

---

## 📝 Testing

Una vez implementado, el frontend validará:

```bash
# Test 1: Listar pedidos
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://marketplace-b2b-backend-dev.onrender.com/admin/orders

# Test 2: Obtener pedido específico
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://marketplace-b2b-backend-dev.onrender.com/admin/orders/{order_id}

# Test 3: Verificar en dashboard
# Abrir http://localhost:3000/admin/dashboard
# Debe mostrar 8 pedidos
```

---

## 📞 Contacto

Si hay dudas sobre:
- Los variant IDs
- La estructura de datos
- Alternativas de implementación

Revisar también:
- `docs/medusa/SAMPLE_ORDERS_DATA.md` - Datos detallados en formato humano
- `docs/medusa/sample-orders.json` - JSON completo
- `scripts/seed-orders.mjs` - Script frontend (referencia)

---

## ⏱️ Timeline Sugerido

- **1-2 horas:** Implementar script de seed
- **30 min:** Testing y validación
- **15 min:** Deploy a DEV

**Total:** ~2-3 horas de desarrollo

---

¡Gracias! 🙏
