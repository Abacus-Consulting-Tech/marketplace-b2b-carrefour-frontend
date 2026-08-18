# Datos Iniciales para Base de Datos - Marketplace B2B Carrefour

Este documento contiene todos los datos de ejemplo (mock data) que deben insertarse en la base de datos Medusa para testing y desarrollo del frontend.

---

## 👥 Usuarios (Users)

### Admin
```
Email: admin@test.com
Password: admin123
Name: Admin Carrefour
Role: admin
Phone: +34 900 000 001
Status: active
```

### Franquiciado de Ejemplo
```
Email: franchisee@test.com
Password: franchisee123
Name: Juan Pérez
Role: franchisee
Phone: +34 900 000 002
Status: active
```

### Proveedor de Ejemplo
```
Email: supplier@test.com
Password: supplier123
Name: María García
Role: supplier
Phone: +34 900 000 003
Status: active
```

---

## 🏢 Proveedores (Suppliers)

### 1. Uniformes Corporativos S.L.
```
Company Name: Uniformes Corporativos S.L.
CIF: B12345678
Email: info@uniformescorp.com
Phone: +34 950 123 456
Address: Polígono Industrial Las Salinas, Nave 5
City: Almería
Postal Code: 04006
Status: approved
Contact Person: María González (maria@uniformescorp.com)
Categories: Uniformes, Merchandising
Rating: 4.8
```

### 2. Imprenta Corporativa S.L.
```
Company Name: Imprenta Corporativa S.L.
CIF: B87654321
Email: info@imprentacorp.com
Phone: +34 924 654 321
Address: Calle de la Imprenta 45
City: Madrid
Postal Code: 28001
Status: approved
Contact Person: Carlos Martínez (carlos@imprentacorp.com)
Categories: Folletos, Marketing
Rating: 4.7
```

### 3. Visual Retail S.L.
```
Company Name: Visual Retail S.L.
CIF: B11223344
Email: info@visualretail.com
Phone: +34 915 555 666
Address: Avenida del Comercio 89
City: Barcelona
Postal Code: 08001
Status: approved
Contact Person: Laura Sánchez (laura@visualretail.com)
Categories: Señalización en tienda
Rating: 4.9
```

### 4. Equipamiento Retail Pro
```
Company Name: Equipamiento Retail Pro
CIF: B99887766
Email: info@equipretail.com
Phone: +34 963 444 555
Address: Polígono Industrial Sur, Parcela 12
City: Valencia
Postal Code: 46001
Status: approved
Contact Person: Alberto Ruiz (alberto@equipretail.com)
Categories: Equipamientos
Rating: 4.6
```

### 5. Promo Gifts S.L.
```
Company Name: Promo Gifts S.L.
CIF: B55443322
Email: info@promogifts.com
Phone: +34 954 333 222
Address: Calle del Regalo 23
City: Sevilla
Postal Code: 41001
Status: approved
Contact Person: Elena Torres (elena@promogifts.com)
Categories: Merchandising
Rating: 4.8
```

---

## 🌍 Regiones (Regions)

### Región Principal: España

**⚠️ CRÍTICO:** Esta región es **requerida** para que funcione el checkout y el carrito.

```json
{
  "id": "reg_01M07RY98WSVVF2SP0Q7SB8KM0",
  "name": "España",
  "currency_code": "eur",
  "tax_rate": 21.0,
  "tax_code": "IVA_ES_21",
  "countries": ["es"],
  "payment_providers": [],
  "fulfillment_providers": [],
  "metadata": {
    "description": "Región principal para operaciones en España",
    "timezone": "Europe/Madrid"
  }
}
```

**Datos simplificados:**
```
ID: reg_01M07RY98WSVVF2SP0Q7SB8KM0
Nombre: España
Código de moneda: EUR
Tasa de impuesto: 21% (IVA España)
Países: ["ES"]
```

**Dónde se usa:**
- Frontend lo usa en `.env.local`: `NEXT_PUBLIC_MERCUR_REGION_ID=reg_01M07RY98WSVVF2SP0Q7SB8KM0`
- Requerido para crear carritos: `POST /store/carts { region_id: "reg_..." }`
- Necesario para calcular precios con impuestos

**Importante:** Si creáis la región con un ID diferente, avisad al frontend para actualizar la variable de entorno.

---

## 📦 Categorías de Productos

1. **Uniformes** - Ropa corporativa para empleados
2. **Folletos** - Material impreso promocional
3. **Señalización en tienda** - Carteles, vinilos, tótems
4. **Equipamientos** - Mobiliario y equipos para tienda
5. **Merchandising** - Artículos promocionales

---

## 🛍️ Productos

### Categoría: Uniformes

#### 1. Polo Corporativo Carrefour
```
SKU: UNI-001
Name: Polo Corporativo Carrefour
Description: Polo manga corta con bordado corporativo, tejido transpirable 100% algodón piqué
Price: 18.50 EUR
Stock: 500
Supplier: Uniformes Corporativos S.L.
Category: Uniformes
Specifications:
  - Material: 100% algodón piqué
  - Tallas: XS–3XL
  - Colores: Azul corporativo, Blanco
Rating: 4.7 (42 reviews)
Image: https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400
```

#### 2. Chaqueta de Trabajo Unisex
```
SKU: UNI-002
Name: Chaqueta de Trabajo Unisex
Description: Chaqueta con bolsillos laterales y logo bordado, tejido resistente antiestático
Price: 45.00 EUR
Stock: 200
Supplier: Uniformes Corporativos S.L.
Category: Uniformes
Specifications:
  - Material: 65% poliéster, 35% algodón
  - Tallas: XS–3XL
  - Colores: Azul marino
Rating: 4.8 (31 reviews)
Image: https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400
```

#### 3. Delantal de Trabajo
```
SKU: UNI-003
Name: Delantal de Trabajo
Description: Delantal ajustable con bolsillo central y refuerzo en rodillas, fácil limpieza
Price: 12.90 EUR
Stock: 350
Supplier: Uniformes Corporativos S.L.
Category: Uniformes
Specifications:
  - Material: Poliéster reforzado
  - Talla: Única ajustable
  - Colores: Azul / Rojo
Rating: 4.5 (28 reviews)
Image: https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400
```

### Categoría: Folletos

#### 4. Folleto Promocional A5 (Pack 1.000 uds)
```
SKU: FOL-001
Name: Folleto Promocional A5 (Pack 1.000 uds)
Description: Impresión a todo color en papel couché 135g, acabado satinado, doble cara
Price: 89.00 EUR
Stock: 120
Supplier: Imprenta Corporativa S.L.
Category: Folletos
Specifications:
  - Formato: A5 (148×210mm)
  - Papel: Couché 135g satinado
  - Cantidad: 1.000 unidades
  - Caras: Doble cara
Rating: 4.6 (19 reviews)
Image: https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400
```

#### 5. Catálogo de Productos A4 (Pack 500 uds)
```
SKU: FOL-002
Name: Catálogo de Productos A4 (Pack 500 uds)
Description: Catálogo grapado 8 páginas, impresión offset a todo color, portada plastificada brillo
Price: 210.00 EUR
Stock: 60
Supplier: Imprenta Corporativa S.L.
Category: Folletos
Specifications:
  - Formato: A4 (210×297mm)
  - Páginas: 8 páginas grapadas
  - Papel: Couché 150g
  - Cantidad: 500 unidades
Rating: 4.7 (14 reviews)
Image: https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400
```

### Categoría: Señalización en tienda

#### 6. Cartel de Precios PVC (Pack 10 uds)
```
SKU: SEÑ-001
Name: Cartel de Precios PVC (Pack 10 uds)
Description: Cartel rígido de PVC expandido 5mm con impresión UV, bordes redondeados
Price: 55.00 EUR
Stock: 80
Supplier: Visual Retail S.L.
Category: Señalización en tienda
Specifications:
  - Material: PVC expandido 5mm
  - Formato: A4 (210×297mm)
  - Acabado: Impresión UV mate
  - Cantidad: 10 unidades
Rating: 4.6 (22 reviews)
Image: https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400
```

#### 7. Vinilo Adhesivo para Suelo
```
SKU: SEÑ-002
Name: Vinilo Adhesivo para Suelo
Description: Vinilo antideslizante para suelo con laminado protector, fácil instalación y retirada
Price: 38.00 EUR
Stock: 150
Supplier: Visual Retail S.L.
Category: Señalización en tienda
Specifications:
  - Material: Vinilo antideslizante laminado
  - Tamaño: 60×60 cm
  - Instalación: Autoadhesivo
Rating: 4.5 (17 reviews)
Image: https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400
```

#### 8. Tótem Expositivo de Pie
```
SKU: SEÑ-003
Name: Tótem Expositivo de Pie
Description: Tótem de aluminio con pantalla de aluminio y soporte para impresión intercambiable, altura 180cm
Price: 125.00 EUR
Stock: 40
Supplier: Visual Retail S.L.
Category: Señalización en tienda
Specifications:
  - Material: Aluminio anodizado
  - Altura: 180 cm
  - Formato gráfico: 60×160 cm
  - Montaje: Incluido
Rating: 4.8 (11 reviews)
Image: https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400
```

### Categoría: Equipamientos

#### 9. Balanza Digital de Mostrador
```
SKU: EQU-001
Name: Balanza Digital de Mostrador
Description: Balanza electrónica con pantalla LCD, precisión 1g, capacidad 30kg, homologada CE
Price: 189.00 EUR
Stock: 35
Supplier: Equipamiento Retail Pro
Category: Equipamientos
Specifications:
  - Capacidad: 30 kg
  - Precisión: 1 g
  - Pantalla: LCD retroiluminada
  - Homologación: CE
Rating: 4.7 (26 reviews)
Image: https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400
```

#### 10. Expositor Metálico Giratorio 4 Caras
```
SKU: EQU-002
Name: Expositor Metálico Giratorio 4 Caras
Description: Expositor de góndola giratorio en acero lacado, 4 caras con 5 bandejas ajustables por cara
Price: 320.00 EUR
Stock: 20
Supplier: Equipamiento Retail Pro
Category: Equipamientos
Specifications:
  - Material: Acero lacado blanco
  - Caras: 4
  - Bandejas por cara: 5 ajustables
  - Altura: 165 cm
Rating: 4.6 (13 reviews)
Image: https://images.unsplash.com/photo-1606166325683-e6deb697d301?w=400
```

#### 11. Carro de Transporte Plegable
```
SKU: EQU-003
Name: Carro de Transporte Plegable
Description: Carro de almacén plegable con ruedas de goma, carga máxima 150kg, estructura de acero galvanizado
Price: 74.00 EUR
Stock: 9
Supplier: Equipamiento Retail Pro
Category: Equipamientos
Specifications:
  - Material: Acero galvanizado
  - Carga máxima: 150 kg
  - Ruedas: Goma antiarañazos
  - Plegable: Sí
Rating: 4.5 (20 reviews)
Image: https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400
```

### Categoría: Merchandising

#### 12. Bolsa Reutilizable Carrefour (Pack 100 uds)
```
SKU: MER-001
Name: Bolsa Reutilizable Carrefour (Pack 100 uds)
Description: Bolsa de no-tejido con asa larga, serigrafía a 2 colores con logotipo corporativo
Price: 65.00 EUR
Stock: 300
Supplier: Promo Gifts S.L.
Category: Merchandising
Specifications:
  - Material: Non-woven 80g
  - Tamaño: 38×42 cm
  - Impresión: Serigrafía 2 colores
  - Cantidad: 100 unidades
Rating: 4.7 (38 reviews)
Image: https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400
```

#### 13. Bolígrafo Corporativo (Pack 200 uds)
```
SKU: MER-002
Name: Bolígrafo Corporativo (Pack 200 uds)
Description: Bolígrafo retráctil con clip metálico, tinta azul, tampografía con logotipo en 1 color
Price: 48.00 EUR
Stock: 500
Supplier: Promo Gifts S.L.
Category: Merchandising
Specifications:
  - Material: Plástico ABS
  - Tinta: Azul
  - Impresión: Tampografía 1 color
  - Cantidad: 200 unidades
Rating: 4.4 (29 reviews)
Image: https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400
```

#### 14. Taza Cerámica con Logotipo (Pack 24 uds)
```
SKU: MER-003
Name: Taza Cerámica con Logotipo (Pack 24 uds)
Description: Taza cerámica blanca 300ml con impresión digital de alta resolución, apta para lavavajillas
Price: 96.00 EUR
Stock: 150
Supplier: Promo Gifts S.L.
Category: Merchandising
Specifications:
  - Material: Cerámica
  - Capacidad: 300 ml
  - Impresión: Digital 4 colores
  - Cantidad: 24 unidades
  - Lavavajillas: Sí
Rating: 4.8 (21 reviews)
Image: https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400
```

---

## 📝 Pedidos de Ejemplo (Orders)

### Pedido 1: CF-10001
```
Order Number: CF-10001
Franchisee: Juan Pérez (franchisee@test.com)
Status: delivered
Created: 2024-01-15T10:30:00.000Z
Delivered: 2024-01-18T14:20:00.000Z

Items:
  1. Polo Corporativo Carrefour
     - Quantity: 20
     - Unit Price: 18.50 EUR
     - Subtotal: 370.00 EUR
     - Tax: 77.70 EUR
     - Supplier: Uniformes Corporativos S.L.

  2. Cartel de Precios PVC (Pack 10 uds)
     - Quantity: 3
     - Unit Price: 55.00 EUR
     - Subtotal: 165.00 EUR
     - Tax: 34.65 EUR
     - Supplier: Visual Retail S.L.

Total:
  Subtotal: 535.00 EUR
  Tax (21%): 112.35 EUR
  Shipping: 0.00 EUR
  TOTAL: 647.35 EUR

Shipping Address:
  Juan Pérez
  Calle Mayor 123, 2º A
  28001 Madrid, España
  Phone: +34 666 123 456

Payment:
  Method: tarjeta
  Status: paid

Tracking: ES1234567890123456
Estimated Delivery: 2024-01-20
```

### Pedido 2: CF-10002
```
Order Number: CF-10002
Franchisee: Juan Pérez (franchisee@test.com)
Status: shipped
Created: 2024-01-20T09:15:00.000Z
Updated: 2024-01-22T16:45:00.000Z

Items:
  1. Bolsa Reutilizable Carrefour (Pack 100 uds)
     - Quantity: 5
     - Unit Price: 65.00 EUR
     - Subtotal: 325.00 EUR
     - Tax: 68.25 EUR
     - Supplier: Promo Gifts S.L.

Total:
  Subtotal: 325.00 EUR
  Tax (21%): 68.25 EUR
  Shipping: 0.00 EUR
  TOTAL: 393.25 EUR

Shipping Address:
  Juan Pérez
  Calle Mayor 123, 2º A
  28001 Madrid, España
  Phone: +34 666 123 456

Payment:
  Method: tarjeta
  Status: paid

Tracking: ES9876543210987654
Estimated Delivery: 2024-01-25
```

---

## 📊 Resumen de Datos

- **Usuarios**: 3 (1 admin, 1 franquiciado, 1 proveedor)
- **Proveedores**: 5 empresas
- **Categorías**: 5 categorías de productos
- **Productos**: 14 productos
- **Pedidos**: 2 pedidos de ejemplo

---

## 🔧 Notas para Backend

### IVA (Tax)
- Todos los productos tienen IVA del 21% (estándar español)
- Los precios mostrados son **sin IVA**
- El IVA se calcula en el checkout

### Imágenes
- Las URLs de imágenes son de Unsplash (placeholder)
- En producción se deberían usar imágenes reales subidas al servidor

### Estados de Pedido (Order Status)
- `pending` - Pendiente de confirmación
- `confirmed` - Confirmado
- `processing` - En preparación
- `shipped` - Enviado
- `delivered` - Entregado
- `cancelled` - Cancelado

### Estados de Pago (Payment Status)
- `pending` - Pendiente
- `paid` - Pagado
- `failed` - Fallido
- `refunded` - Reembolsado

### Métodos de Pago
- `tarjeta` - Tarjeta de crédito/débito
- `transferencia` - Transferencia bancaria
- `contrareembolso` - Pago contra reembolso

---

## ✅ Checklist de Inserción

Para que el frontend funcione correctamente, asegúrate de insertar los datos en este orden:

1. ✅ Usuarios (3 usuarios de prueba)
2. ✅ Categorías (5 categorías)
3. ✅ Proveedores (5 proveedores)
4. ✅ Productos (14 productos)
5. ✅ Pedidos (2 pedidos de ejemplo) - opcional

---

## 🔗 Referencias

- Ver estructura completa de datos en: `src/lib/api/mock.ts`
- Credenciales de usuarios: `docs/medusa/CREDENTIALS.md`
- Tests de integración: `docs/medusa/smoke-test-checklist.md`
