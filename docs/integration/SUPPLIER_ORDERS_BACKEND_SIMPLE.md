# 📦 Gestión de Pedidos de Proveedores - Endpoints Necesarios

> **Nota para Backend**: Este documento describe **QUÉ** necesitamos, no cómo implementarlo. Usa Medusa/MercurJS como prefieras.

## 🎯 ¿Qué hemos construido?

El frontend ya tiene **completa** la interfaz de gestión de pedidos para proveedores:
- ✅ Lista de pedidos con filtros
- ✅ Vista detallada de cada pedido
- ✅ Acciones: Aceptar, Rechazar, Cambiar Estado, Añadir Seguimiento
- ✅ Estadísticas del proveedor

**Todo funciona con datos de prueba**. Solo falta conectar con el backend real.

---

## 📋 Los 7 Endpoints que Necesitamos

### 1️⃣ Listar Pedidos del Proveedor
**Lo que hace**: Muestra todos los pedidos asignados a este proveedor

```
GET /vendor/orders
```

**Filtros opcionales** (query params):
- `status` - ej: `pending`, `confirmed`, `shipped`
- `search` - buscar por número de pedido o cliente

**Respuesta esperada**:
```json
{
  "orders": [
    {
      "id": "order_01M...",
      "orderNumber": "ORD-2026-001",
      "status": "pending",
      "created_at": "2024-01-15T10:30:00Z",
      "franchiseeName": "Carrefour Express Madrid Centro",
      "supplierTotal": 450.50,
      "supplierItems": [
        {
          "id": "item_01...",
          "title": "Aceite de Oliva Virgen Extra 1L",
          "quantity": 24,
          "unit_price": 8.50
        }
      ]
    }
  ]
}
```

---

### 2️⃣ Ver Detalle de un Pedido
**Lo que hace**: Muestra toda la información de un pedido específico

```
GET /vendor/orders/:id
```

**Respuesta esperada**:
```json
{
  "order": {
    "id": "order_01M...",
    "orderNumber": "ORD-2026-001",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z",
    "estimatedDelivery": "2024-01-20",
    "franchiseeName": "Carrefour Express Madrid Centro",
    "franchiseeAddress": "Calle Gran Vía, 28, Madrid",
    "franchiseePhone": "+34 912 345 678",
    "supplierTotal": 450.50,
    "supplierItems": [...],
    "trackingNumber": "ABC123456789",
    "carrier": "SEUR",
    "shipped_at": "2024-01-16T14:00:00Z",
    "delivered_at": null
  }
}
```

---

### 3️⃣ Estadísticas del Proveedor
**Lo que hace**: Números para el dashboard (pendientes, en proceso, enviados, facturación)

```
GET /vendor/orders/stats
```

**Respuesta esperada**:
```json
{
  "stats": {
    "pendingCount": 5,
    "confirmedCount": 3,
    "inPreparationCount": 2,
    "shippedCount": 8,
    "revenueThisMonth": 12450.75,
    "revenueLastMonth": 10300.00
  }
}
```

---

### 4️⃣ Aceptar un Pedido
**Lo que hace**: El proveedor confirma que puede servir el pedido

```
POST /vendor/orders/:id/accept
```

**Datos que enviamos**:
```json
{
  "estimatedDelivery": "2024-01-20",
  "notes": "Pedido confirmado, envío el viernes"
}
```

**Respuesta esperada**:
```json
{
  "order": {
    "id": "order_01M...",
    "status": "confirmed",
    ...
  }
}
```

---

### 5️⃣ Rechazar un Pedido
**Lo que hace**: El proveedor no puede servir el pedido (sin stock, etc.)

```
POST /vendor/orders/:id/reject
```

**Datos que enviamos**:
```json
{
  "reason": "Sin stock disponible hasta febrero",
  "notes": "Contactar con proveedor alternativo"
}
```

**Respuesta esperada**:
```json
{
  "order": {
    "id": "order_01M...",
    "status": "rejected",
    ...
  }
}
```

---

### 6️⃣ Actualizar Estado del Pedido
**Lo que hace**: Cambiar el estado (ej: de "confirmado" a "en preparación" a "enviado")

```
PATCH /vendor/orders/:id/status
```

**Datos que enviamos**:
```json
{
  "status": "in_preparation"
}
```

**Estados posibles**:
- `pending` - Nuevo, sin confirmar
- `confirmed` - Aceptado por proveedor
- `in_preparation` - Preparando el pedido
- `shipped` - Enviado
- `delivered` - Entregado
- `cancelled` - Cancelado
- `rejected` - Rechazado por proveedor

**Respuesta esperada**:
```json
{
  "order": {
    "id": "order_01M...",
    "status": "in_preparation",
    ...
  }
}
```

---

### 7️⃣ Añadir Información de Seguimiento
**Lo que hace**: Guardar número de tracking cuando se envía el pedido

```
POST /vendor/orders/:id/tracking
```

**Datos que enviamos**:
```json
{
  "trackingNumber": "ABC123456789",
  "carrier": "SEUR",
  "trackingUrl": "https://www.seur.com/seguimiento?codigo=ABC123456789"
}
```

**Respuesta esperada**:
```json
{
  "order": {
    "id": "order_01M...",
    "status": "shipped",
    "trackingNumber": "ABC123456789",
    "carrier": "SEUR",
    "trackingUrl": "https://...",
    "shipped_at": "2024-01-16T14:00:00Z",
    ...
  }
}
```

---

## 🔐 Autenticación

Todos los endpoints requieren que el usuario esté autenticado como **proveedor/vendor**.

El frontend envía el token en las cabeceras:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 Campos Importantes del Modelo Order

### Campos básicos de Medusa
- `id` - ID del pedido
- `created_at` - Fecha de creación
- `status` - Estado actual

### Campos que MercurJS debe añadir
- `orderNumber` - Número visible (ej: "ORD-2026-001")
- `franchiseeName` - Nombre de la franquicia que compra
- `franchiseeAddress` - Dirección de entrega
- `franchiseePhone` - Teléfono de contacto
- `supplierTotal` - Total que corresponde a este proveedor
- `supplierItems` - Solo los items de este proveedor (no todo el pedido)
- `estimatedDelivery` - Fecha estimada de entrega
- `trackingNumber` - Número de seguimiento
- `carrier` - Transportista (SEUR, MRW, Correos, etc.)
- `trackingUrl` - URL de seguimiento
- `shipped_at` - Cuándo se envió
- `delivered_at` - Cuándo se entregó

---

## 🎨 Datos de Ejemplo Real

Para probar, aquí tienes un pedido completo de ejemplo:

```json
{
  "id": "order_01M0A8ORDER001",
  "orderNumber": "ORD-2026-001",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z",
  "estimatedDelivery": "2024-01-20",
  "franchiseeName": "Carrefour Express Madrid Centro",
  "franchiseeAddress": "Calle Gran Vía, 28, 28013 Madrid",
  "franchiseePhone": "+34 912 345 678",
  "franchiseeEmail": "madrid.centro@carrefour.es",
  "supplierTotal": 450.50,
  "supplierItems": [
    {
      "id": "item_01M0A8ITEM001",
      "title": "Aceite de Oliva Virgen Extra 1L - Marca Premium",
      "sku": "AOV-001-1L",
      "quantity": 24,
      "unit_price": 8.50,
      "total": 204.00
    },
    {
      "id": "item_01M0A8ITEM002",
      "title": "Vinagre de Jerez Reserva 500ml",
      "sku": "VJR-002-500",
      "quantity": 12,
      "unit_price": 6.50,
      "total": 78.00
    },
    {
      "id": "item_01M0A8ITEM003",
      "title": "Sal Marina Atlántica 1Kg",
      "sku": "SMA-003-1K",
      "quantity": 18,
      "unit_price": 2.50,
      "total": 45.00
    }
  ],
  "trackingNumber": null,
  "carrier": null,
  "trackingUrl": null,
  "shipped_at": null,
  "delivered_at": null
}
```

---

## ✅ Checklist para Backend

- [ ] **Endpoint 1**: GET /vendor/orders (con filtros status y search)
- [ ] **Endpoint 2**: GET /vendor/orders/:id
- [ ] **Endpoint 3**: GET /vendor/orders/stats
- [ ] **Endpoint 4**: POST /vendor/orders/:id/accept
- [ ] **Endpoint 5**: POST /vendor/orders/:id/reject
- [ ] **Endpoint 6**: PATCH /vendor/orders/:id/status
- [ ] **Endpoint 7**: POST /vendor/orders/:id/tracking
- [ ] Verificar que solo se muestren pedidos del proveedor autenticado
- [ ] Enviar solo los items del proveedor en `supplierItems`
- [ ] Calcular `supplierTotal` sumando solo items del proveedor

---

## 🚀 ¿Cuándo activar?

Cuando los endpoints estén listos, nosotros cambiamos esto en el frontend:

```javascript
// En src/config/feature-flags.ts
orders: {
  useMock: false,  // ← Cambiar de true a false
  backendReady: true
}
```

Y automáticamente el frontend empezará a usar el backend real en lugar de datos de prueba.

---

## 💬 Preguntas Frecuentes

**P: ¿Hay que crear nuevas tablas?**  
R: Depende de cómo tengáis estructurado MercurJS. Probablemente solo necesitéis extender la tabla de orders con algunos campos extra.

**P: ¿Los 7 endpoints son obligatorios?**  
R: Sí, el frontend los necesita todos. Pero podéis implementarlos gradualmente si queréis.

**P: ¿Qué pasa si un pedido tiene items de varios proveedores?**  
R: Cada proveedor solo ve SU parte. `supplierItems` contiene solo los items de ese proveedor y `supplierTotal` es solo su subtotal.

**P: ¿Hay que enviar emails cuando se acepta/rechaza?**  
R: No necesariamente desde estos endpoints. Lo podéis hacer con eventos de Medusa si queréis.

---

## 📞 Contacto

Si hay dudas, hablamos. No hace falta implementar todo técnicamente igual que está aquí, solo que los datos que vienen y van sean compatibles.

**Lo importante**: 
- URLs correctas
- JSON con los campos que esperamos
- Autenticación de vendor
- Filtrar por proveedor autenticado

El resto es flexible. 👍
