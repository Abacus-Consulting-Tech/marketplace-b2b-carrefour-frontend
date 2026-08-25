# 📋 Datos de Pedidos para Testing - Marketplace B2B Carrefour

Este archivo contiene datos de pedidos listos para insertar en la base de datos.

## 🎯 Opción Recomendada: Crear Pedidos Manualmente

Dado que Medusa requiere payment sessions completas para crear órdenes via API, la forma más rápida de poblar la base de datos con pedidos de ejemplo es:

### Método 1: Admin Dashboard (Más Fácil)

1. Abre http://localhost:3000/admin/dashboard o la URL de tu admin
2. Ve a "Orders" → "Create Order"
3. Usa los datos de abajo para crear pedidos manualmente

### Método 2: SQL Direct Insert (Más Rápido)

Si tienes acceso a la base de datos, puedes insertar directamente los registros de pedidos.

---

## 📦 Pedidos de Ejemplo

### Pedido 1: CF-10001 - Uniformes Madrid
**Cliente:** franchisee@test.com  
**Estado:** completed  
**Total:** ~1,193.50 EUR (IVA incluido)

**Items:**
- 20x Chaqueta de Trabajo Unisex @ 45.00 EUR/u = 900.00 EUR
- 3x Cartel de Precios PVC (Pack 10 uds) @ 55.00 EUR/u = 165.00 EUR
- **Subtotal:** 1,065.00 EUR
- **IVA (21%):** 223.65 EUR
- **Total:** 1,288.65 EUR

**Dirección de envío:**
```
Juan Pérez
Calle Mayor 123, 2º A
28001 Madrid, España
+34 666 123 456
```

---

### Pedido 2: CF-10002 - Bolsas Reutilizables
**Cliente:** franchisee@test.com  
**Estado:** processing  
**Total:** ~393.25 EUR

**Items:**
- 5x Bolsa Reutilizable Carrefour (Pack 100 uds) @ 65.00 EUR/u = 325.00 EUR
- **Subtotal:** 325.00 EUR
- **IVA (21%):** 68.25 EUR
- **Total:** 393.25 EUR

**Dirección de envío:**
```
Juan Pérez
Calle Mayor 123, 2º A
28001 Madrid, España
+34 666 123 456
```

---

### Pedido 3: CF-10003 - Equipamiento Barcelona
**Cliente:** admin@carrefour.dev  
**Estado:** shipped  
**Total:** ~582.25 EUR

**Items:**
- 2x Balanza Digital de Mostrador @ 189.00 EUR/u = 378.00 EUR
- 1x Tótem Expositivo de Pie @ 125.00 EUR/u = 125.00 EUR
- **Subtotal:** 503.00 EUR
- **IVA (21%):** 105.63 EUR
- **Total:** 608.63 EUR

**Dirección de envío:**
```
Admin Carrefour
Avenida Diagonal 123
08001 Barcelona, España
+34 666 999 888
```

---

### Pedido 4: CF-10004 - Uniformes Valencia (Grande)
**Cliente:** franchisee@test.com  
**Estado:** pending  
**Total:** ~839.35 EUR

**Items:**
- 10x Chaqueta de Trabajo Unisex @ 45.00 EUR/u = 450.00 EUR
- 15x Delantal de Trabajo @ 12.90 EUR/u = 193.50 EUR
- 2x Bolígrafo Corporativo (Pack 200 uds) @ 48.00 EUR/u = 96.00 EUR
- **Subtotal:** 739.50 EUR
- **IVA (21%):** 155.30 EUR
- **Total:** 894.80 EUR

**Dirección de envío:**
```
María González
Calle del Sol 45
46001 Valencia, España
+34 666 777 555
```

---

### Pedido 5: CF-10005 - Material Promocional Sevilla
**Cliente:** admin@carrefour.dev  
**Estado:** completed  
**Total:** ~808.47 EUR

**Items:**
- 3x Folleto Promocional A5 (Pack 1.000 uds) @ 89.00 EUR/u = 267.00 EUR
- 2x Catálogo de Productos A4 (Pack 500 uds) @ 210.00 EUR/u = 420.00 EUR
- **Subtotal:** 687.00 EUR
- **IVA (21%):** 144.27 EUR
- **Total:** 831.27 EUR

**Dirección de envío:**
```
Carlos Martínez
Plaza Mayor 10
41001 Sevilla, España
+34 666 444 333
```

---

### Pedido 6: CF-10006 - Señalización Zaragoza
**Cliente:** franchisee@test.com  
**Estado:** processing  
**Total:** ~655.75 EUR

**Items:**
- 10x Vinilo Adhesivo para Suelo @ 38.00 EUR/u = 380.00 EUR
- 5x Cartel de Precios PVC (Pack 10 uds) @ 55.00 EUR/u = 275.00 EUR
- **Subtotal:** 655.00 EUR
- **IVA (21%):** 137.55 EUR
- **Total:** 792.55 EUR

**Dirección de envío:**
```
Ana Rodríguez
Calle de la Paz 88
50001 Zaragoza, España
+34 666 222 111
```

---

### Pedido 7: CF-10007 - Equipamiento Málaga
**Cliente:** admin@carrefour.dev  
**Estado:** completed  
**Total:** ~1,607.00 EUR

**Items:**
- 3x Expositor Metálico Giratorio 4 Caras @ 320.00 EUR/u = 960.00 EUR
- 5x Carro de Transporte Plegable @ 74.00 EUR/u = 370.00 EUR
- **Subtotal:** 1,330.00 EUR
- **IVA (21%):** 279.30 EUR
- **Total:** 1,609.30 EUR

**Dirección de envío:**
```
Laura Fernández
Gran Vía 42
29001 Málaga, España
+34 666 888 777
```

---

### Pedido 8: CF-10008 - Merchandising Barcelona
**Cliente:** franchisee@test.com  
**Estado:** pending  
**Total:** ~659.25 EUR

**Items:**
- 4x Taza Cerámica con Logotipo (Pack 24 uds) @ 96.00 EUR/u = 384.00 EUR
- 3x Bolsa Reutilizable Carrefour (Pack 100 uds) @ 65.00 EUR/u = 195.00 EUR
- **Subtotal:** 579.00 EUR
- **IVA (21%):** 121.59 EUR
- **Total:** 700.59 EUR

**Dirección de envío:**
```
Pedro López
Paseo de Gracia 99
08008 Barcelona, España
+34 666 333 222
```

---

## 📊 Resumen

| Pedido | Cliente | Estado | Items | Subtotal | IVA | Total |
|--------|---------|--------|-------|----------|-----|-------|
| CF-10001 | franchisee | completed | 2 | 1,065.00€ | 223.65€ | 1,288.65€ |
| CF-10002 | franchisee | processing | 1 | 325.00€ | 68.25€ | 393.25€ |
| CF-10003 | admin | shipped | 2 | 503.00€ | 105.63€ | 608.63€ |
| CF-10004 | franchisee | pending | 3 | 739.50€ | 155.30€ | 894.80€ |
| CF-10005 | admin | completed | 2 | 687.00€ | 144.27€ | 831.27€ |
| CF-10006 | franchisee | processing | 2 | 655.00€ | 137.55€ | 792.55€ |
| CF-10007 | admin | completed | 2 | 1,330.00€ | 279.30€ | 1,609.30€ |
| CF-10008 | franchisee | pending | 2 | 579.00€ | 121.59€ | 700.59€ |

**Totales:**
- **8 pedidos**
- **16 line items** (productos distintos)
- **Subtotal total:** 5,883.50€
- **IVA total:** 1,235.54€
- **GRAN TOTAL:** 7,119.04€

---

## 🔧 Estados de Pedido

- `pending` - Pendiente de confirmación (3 pedidos)
- `processing` - En preparación (2 pedidos)
- `shipped` - Enviado (1 pedido)
- `completed` - Completado/Entregado (3 pedidos)

---

## ✅ Uso

1. **Para testing del dashboard admin:** Usa estos datos para crear pedidos manualmente
2. **Para SQL insert:** Contacta al equipo backend para insertar estos datos
3. **Para demo/presentación:** Referencia estos números de pedido y totales

---

## 📝 Notas

- Todos los precios son sin IVA, el IVA se calcula al 21%
- Los productos usan SKUs reales de la base de datos actual
- Las direcciones son ficticias pero realistas
- Los números de teléfono son de ejemplo

---

## 🎯 Próximos Pasos

Si necesitas estos datos en la BD:

1. **Opción A:** Crea los pedidos manualmente en el admin panel
2. **Opción B:** Solicita al backend que implemente un endpoint de seed para órdenes
3. **Opción C:** Usa mock data en el frontend (ya disponible en `src/lib/api/mock.ts`)
