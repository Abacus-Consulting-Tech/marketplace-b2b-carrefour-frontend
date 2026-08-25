# Guía para Crear Pedidos de Prueba

Esta guía explica cómo poblar la base de datos con pedidos de ejemplo para testing.

## 🚀 Método 1: Script Automatizado (Recomendado)

### Requisitos

- Backend Medusa corriendo (local o remoto)
- Node.js instalado
- Productos ya creados en la base de datos

### Uso

```bash
# Desde la raíz del proyecto frontend
node scripts/seed-orders.mjs
```

### Variables de Entorno (Opcionales)

```bash
# Personalizar configuración
MEDUSA_BACKEND_URL=http://localhost:9000 \
MEDUSA_ADMIN_EMAIL=admin@carrefour.dev \
MEDUSA_ADMIN_PASSWORD=supersecret \
node scripts/seed-orders.mjs
```

### Qué hace el script

1. ✅ Se autentica como admin
2. ✅ Verifica que existan productos
3. ✅ Crea o verifica la región España
4. ✅ Crea 5 pedidos de ejemplo con diferentes productos
5. ✅ Muestra un resumen de los pedidos creados

### Ejemplo de salida

```
============================================================
  SEED DE PEDIDOS - MARKETPLACE B2B CARREFOUR
============================================================

ℹ Backend URL: http://localhost:9000
ℹ Admin Email: admin@carrefour.dev

▸ Autenticando como admin...
✓ Autenticado como admin@carrefour.dev

▸ Obteniendo productos existentes...
✓ Encontrados 14 productos
ℹ   - Polo Corporativo Carrefour (prod_01...)
ℹ   - Chaqueta de Trabajo Unisex (prod_02...)
...

▸ Verificando región España...
✓ Región España encontrada: reg_01M07...

▸ Creando pedidos de ejemplo...

▸ Creando pedido CF-10001...
ℹ   1. Creando carrito...
✓   Carrito creado: cart_01...
ℹ   2. Agregando productos al carrito...
✓   ✓ Agregado: 20x Polo Corporativo Carrefour
✓   ✓ Agregado: 3x Cartel de Precios PVC
ℹ   3. Completando carrito (creando orden)...
✓ ✓ Orden creada: order_01... (pending)

...

============================================================
  RESUMEN
============================================================
✓ Pedidos creados: 5
ℹ Total intentados: 5

✓ ✓ Datos de ejemplo insertados correctamente
ℹ Puedes ver los pedidos en: http://localhost:3000/admin/dashboard
```

---

## 📝 Método 2: Crear Pedidos Manualmente con Postman

Si prefieres crear pedidos manualmente o necesitas más control, usa estos endpoints:

### Paso 1: Autenticarse

```http
POST {{baseUrl}}/auth/user/emailpass
Content-Type: application/json

{
  "email": "admin@carrefour.dev",
  "password": "supersecret"
}
```

Guarda el `token` de la respuesta.

### Paso 2: Obtener ID de Productos

```http
GET {{baseUrl}}/store/products?limit=100
```

Anota los IDs de los productos que quieres incluir en el pedido.

### Paso 3: Crear Carrito

```http
POST {{baseUrl}}/store/carts
Content-Type: application/json

{
  "region_id": "reg_01M07RY98WSVVF2SP0Q7SB8KM0",
  "email": "franchisee@test.com",
  "shipping_address": {
    "first_name": "Juan",
    "last_name": "Pérez",
    "address_1": "Calle Mayor 123, 2º A",
    "city": "Madrid",
    "postal_code": "28001",
    "country_code": "es",
    "phone": "+34 666 123 456"
  }
}
```

Guarda el `cart.id` de la respuesta.

### Paso 4: Agregar Productos al Carrito

```http
POST {{baseUrl}}/store/carts/{{cartId}}/line-items
Content-Type: application/json

{
  "variant_id": "variant_01...",
  "quantity": 10
}
```

Repite para cada producto que quieras agregar.

### Paso 5: Completar el Carrito (Crear Orden)

```http
POST {{baseUrl}}/store/carts/{{cartId}}/complete
Authorization: Bearer {{jwtToken}}
```

Esto convierte el carrito en una orden.

---

## 📊 Pedidos de Ejemplo Incluidos en el Script

El script crea automáticamente estos 5 pedidos:

### Pedido CF-10001
- **Cliente:** franchisee@test.com
- **Productos:**
  - 20x Polo Corporativo Carrefour
  - 3x Cartel de Precios PVC
- **Dirección:** Madrid

### Pedido CF-10002
- **Cliente:** franchisee@test.com
- **Productos:**
  - 5x Bolsa Reutilizable Carrefour
- **Dirección:** Madrid

### Pedido CF-10003
- **Cliente:** admin@carrefour.dev
- **Productos:**
  - 2x Balanza Digital de Mostrador
  - 1x Tótem Expositivo de Pie
- **Dirección:** Barcelona

### Pedido CF-10004
- **Cliente:** franchisee@test.com
- **Productos:**
  - 10x Chaqueta de Trabajo Unisex
  - 15x Delantal de Trabajo
  - 2x Bolígrafo Corporativo
- **Dirección:** Valencia

### Pedido CF-10005
- **Cliente:** admin@carrefour.dev
- **Productos:**
  - 3x Folleto Promocional A5
  - 2x Catálogo de Productos A4
- **Dirección:** Sevilla

---

## 🔧 Troubleshooting

### Error: "No hay productos en la base de datos"

**Solución:** Primero necesitas crear productos. Verifica que el backend tenga productos con:

```bash
curl http://localhost:9000/store/products
```

Si no hay productos, revisa la documentación de seeding de productos en `docs/medusa/DATOS_INICIALES.md`.

### Error: "Unauthorized" o "401"

**Solución:** Verifica las credenciales admin:

```bash
MEDUSA_ADMIN_EMAIL=admin@carrefour.dev \
MEDUSA_ADMIN_PASSWORD=supersecret \
node scripts/seed-orders.mjs
```

### Error: "Producto no encontrado"

**Solución:** El script busca productos por nombre. Si tus productos tienen nombres diferentes, ajusta el array `sampleOrders` en el script.

### Error: "Region not found"

**Solución:** El script crea automáticamente la región España. Si hay un error, verifica que el usuario admin tenga permisos para crear regiones.

---

## 🎯 Verificación

Después de ejecutar el script, verifica los pedidos:

### En el Frontend

1. Abre http://localhost:3000/admin/dashboard
2. Deberías ver los 5 pedidos creados
3. Haz click en cualquier pedido para ver los detalles

### Con API directa

```bash
# Obtener token admin
TOKEN=$(curl -s -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@carrefour.dev","password":"supersecret"}' \
  | jq -r '.token')

# Listar pedidos
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:9000/admin/orders | jq '.orders[] | {id, status, total, email}'
```

---

## 📚 Recursos Adicionales

- Ver estructura completa de datos: [DATOS_INICIALES.md](./DATOS_INICIALES.md)
- Credenciales de usuarios: [CREDENTIALS.md](./CREDENTIALS.md)
- Tests de integración: [smoke-test-checklist.md](./smoke-test-checklist.md)
- Informe auth admin: [INFORME_FRONT_ADMIN_ORDERS_UNAUTHORIZED.md](../technical/admin/INFORME_FRONT_ADMIN_ORDERS_UNAUTHORIZED.md)

---

## 💡 Tips

- **Desarrollo:** Ejecuta el script cada vez que resetees la BD
- **Testing:** Modifica `sampleOrders` en el script para crear pedidos personalizados
- **Automatización:** Añade el script a tu pipeline de setup local
- **Limpieza:** Para limpiar pedidos, resetea la BD y vuelve a ejecutar seeds

---

## ✅ Checklist de Setup Completo

Para un entorno de desarrollo completo:

- [ ] Backend Medusa corriendo en http://localhost:9000
- [ ] Usuario admin creado (`admin@carrefour.dev`)
- [ ] Región España creada
- [ ] Productos creados (mínimo 5-10 productos)
- [ ] **Ejecutar `node scripts/seed-orders.mjs`**
- [ ] Verificar pedidos en http://localhost:3000/admin/dashboard

Una vez completado, tendrás un entorno completo para testing del frontend.
