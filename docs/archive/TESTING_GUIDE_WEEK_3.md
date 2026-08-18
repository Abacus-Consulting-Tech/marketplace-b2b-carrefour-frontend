# Guía de Pruebas - Semana 3: Flujo de Compra y Checkout

## 📋 Resumen de Funcionalidades Implementadas

### ✅ Completado en esta sesión

1. **Store de Checkout** (Zustand con persistencia)
   - Gestión del flujo de checkout en 3 pasos
   - Almacenamiento de dirección de entrega
   - Selección de método de pago
   - Aceptación de términos y condiciones

2. **Flujo de Checkout (3 pasos)**
   - ✅ Paso 1: Dirección de Entrega
   - ✅ Paso 2: Revisión del Pedido
   - ✅ Paso 3: Pago (Mock sin Stripe)

3. **Gestión de Pedidos**
   - ✅ Lista de pedidos del franquiciado
   - ✅ Detalle completo del pedido
   - ✅ Mock API para órdenes

4. **Mejoras en el Carrito**
   - ✅ Botón "Finalizar Compra" funcional
   - ✅ Redirección al checkout

---

## 🧪 Escenarios de Prueba

### Test 1: Flujo Completo de Compra (Happy Path)

**Objetivo**: Completar una compra desde el catálogo hasta la confirmación

**Pasos**:

1. **Iniciar Sesión**
   - Email: `franchisee@test.com`
   - Password: `franchisee123`
   - ✅ Verificar redirección a `/marketplace`

2. **Añadir Productos al Carrito**
   - Navegar al catálogo de productos
   - Hacer clic en un producto (ej: "Aceite de Oliva Virgen Extra")
   - Hacer clic en "Añadir al Carrito"
   - Repetir con 2-3 productos más
   - ✅ Verificar que el badge del carrito muestra el número correcto

3. **Ver Carrito**
   - Hacer clic en el icono del carrito en el header
   - ✅ Verificar que se muestran todos los productos añadidos
   - ✅ Verificar cálculo del subtotal
   - ✅ Verificar cálculo del IVA (21%)
   - ✅ Verificar cálculo del total

4. **Iniciar Checkout - Paso 1: Dirección**
   - Hacer clic en "Proceder al Pago"
   - ✅ Verificar redirección a `/marketplace/checkout`
   - ✅ Verificar que se muestra el indicador de pasos (Paso 1 de 3)
   - Completar el formulario:
     - Nombre Completo: "Juan Pérez García"
     - Teléfono: "666123456"
     - Dirección: "Calle Mayor 123, 2º A"
     - Ciudad: "Madrid"
     - Provincia: "Madrid"
     - Código Postal: "28001"
     - País: "España" (deshabilitado)
     - Información Adicional: "Portal B, Timbre 2A" (opcional)
   - ✅ Verificar validaciones de formulario
   - Hacer clic en "Continuar"
   - ✅ Verificar redirección a `/marketplace/checkout/review`

5. **Paso 2: Revisión del Pedido**
   - ✅ Verificar que se muestra el indicador de pasos (Paso 2 de 3)
   - ✅ Verificar que se muestra la dirección ingresada correctamente
   - ✅ Verificar que se muestran todos los productos del carrito
   - ✅ Verificar agrupación por proveedor
   - ✅ Verificar resumen de totales (subtotal, IVA, envío, total)
   - Seleccionar método de pago: "Tarjeta de Crédito/Débito"
   - Marcar checkbox "Acepto los términos y condiciones"
   - ✅ Verificar que el botón "Proceder al Pago" se habilita
   - Hacer clic en "Proceder al Pago"
   - ✅ Verificar redirección a `/marketplace/checkout/payment`

6. **Paso 3: Pago**
   - ✅ Verificar que se muestra el indicador de pasos (Paso 3 de 3)
   - Completar datos de la tarjeta:
     - Número: "1234 5678 9012 3456"
     - Titular: "JUAN PEREZ"
     - Expiración: "12/28"
     - CVV: "123"
   - ✅ Verificar formateo automático del número de tarjeta (espacios cada 4 dígitos)
   - ✅ Verificar formateo de fecha (MM/AA)
   - Hacer clic en "Pagar [TOTAL] €"
   - ✅ Verificar animación de procesamiento (2 segundos)
   - ✅ Verificar mensaje de "¡Pago Procesado!"
   - ✅ Verificar redirección automática a `/marketplace/checkout/success`

7. **Página de Confirmación**
   - ✅ Verificar icono de éxito (check verde)
   - ✅ Verificar mensaje "¡Pedido Confirmado!"
   - ✅ Verificar número de pedido (formato: CF-XXXXXXXX)
   - ✅ Verificar fecha estimada de entrega (3 días hábiles)
   - ✅ Verificar sección "¿Qué Sigue Ahora?" con 3 pasos
   - ✅ Verificar información de contacto de soporte

8. **Ver Mis Pedidos**
   - Hacer clic en "Ver Mis Pedidos"
   - ✅ Verificar redirección a `/marketplace/orders`
   - ✅ Verificar que aparece el pedido recién creado
   - ✅ Verificar estado "Pendiente" (badge amarillo)
   - ✅ Verificar número de pedido
   - ✅ Verificar fecha de creación
   - ✅ Verificar total del pedido

9. **Detalle del Pedido**
   - Hacer clic en "Ver Detalles" en un pedido
   - ✅ Verificar redirección a `/marketplace/orders/[id]`
   - ✅ Verificar información completa del pedido:
     - Número de pedido
     - Estado con badge de color
     - Lista de productos con imágenes
     - Agrupación por proveedor
     - Dirección de entrega completa
     - Resumen de totales
     - Método de pago
     - Estado del pago
     - Fechas (pedido realizado, entrega estimada)

10. **Verificar Carrito Vacío**
    - Hacer clic en el icono del carrito
    - ✅ Verificar que el carrito está vacío
    - ✅ Verificar mensaje "Tu carrito está vacío"

---

### Test 2: Validaciones del Formulario de Dirección

**Objetivo**: Verificar que todas las validaciones funcionan correctamente

**Pasos**:

1. Iniciar sesión como franquiciado
2. Añadir productos al carrito
3. Ir a checkout
4. **Probar validaciones**:
   - Dejar "Nombre Completo" vacío → ✅ Error: "El nombre debe tener al menos 3 caracteres"
   - Ingresar teléfono con menos de 9 dígitos → ✅ Error: "El teléfono debe tener al menos 9 dígitos"
   - Dejar "Dirección" vacío → ✅ Error: "La dirección debe tener al menos 5 caracteres"
   - Código postal con 4 dígitos → ✅ Error: "El código postal debe tener 5 dígitos"
   - Código postal con letras → ✅ Error: "El código postal debe tener 5 dígitos"
5. ✅ Verificar que no se puede continuar hasta completar todos los campos correctamente

---

### Test 3: Método de Pago - Transferencia Bancaria

**Objetivo**: Verificar el flujo con transferencia bancaria

**Pasos**:

1. Completar pasos 1 y 2 del checkout
2. En "Revisión del Pedido", seleccionar "Transferencia Bancaria"
3. Aceptar términos y condiciones
4. Hacer clic en "Proceder al Pago"
5. **Verificar página de pago**:
   - ✅ Título: "Transferencia Bancaria"
   - ✅ Descripción: "Recibirás las instrucciones de pago por email"
   - ✅ Instrucciones de pago visibles:
     - Beneficiario: Marketplace B2B Carrefour
     - IBAN: ES12 1234 5678 9012 3456 7890
     - Concepto: Pedido #XXXXXXXX
     - Importe: [TOTAL] €
6. Hacer clic en "Pagar [TOTAL] €"
7. ✅ Verificar que se procesa sin pedir datos de tarjeta
8. ✅ Verificar redirección a página de éxito

---

### Test 4: Navegación Entre Pasos del Checkout

**Objetivo**: Verificar que se puede navegar hacia atrás y que los datos se conservan

**Pasos**:

1. Completar Paso 1 (Dirección)
2. En Paso 2 (Revisión), hacer clic en "Cambiar Dirección"
   - ✅ Verificar redirección a Paso 1
   - ✅ Verificar que los datos ingresados se mantienen en el formulario
3. Modificar algún campo (ej: teléfono)
4. Hacer clic en "Continuar"
5. ✅ Verificar que se muestra el dato actualizado en Paso 2
6. Hacer clic en "Volver"
   - ✅ Verificar redirección a Paso 1
   - ✅ Verificar que los datos se conservan

---

### Test 5: Validación de Términos y Condiciones

**Objetivo**: Verificar que no se puede proceder sin aceptar términos

**Pasos**:

1. Completar Paso 1
2. En Paso 2, seleccionar método de pago
3. **NO marcar** el checkbox de términos y condiciones
4. Hacer clic en "Proceder al Pago"
5. ✅ Verificar mensaje de error: "Debes aceptar los términos y condiciones para continuar"
6. ✅ Verificar que NO se avanza al siguiente paso
7. Marcar el checkbox
8. Hacer clic en "Proceder al Pago"
9. ✅ Verificar que ahora sí avanza a Paso 3

---

### Test 6: Carrito Vacío Durante Checkout

**Objetivo**: Verificar protección contra checkout sin productos

**Pasos**:

1. Añadir productos al carrito
2. Ir a `/marketplace/checkout` (Paso 1)
3. **Duplicar la pestaña** (Cmd+D en Mac, Ctrl+D en Windows) o hacer clic derecho → "Duplicar pestaña"
   - **Nota**: No usar "Nueva pestaña" ya que puede causar problemas de hidratación del estado
4. En la pestaña duplicada, hacer clic en el icono del carrito en el header
5. Vaciar el carrito (eliminar todos los productos)
6. **Volver a la pestaña original del checkout**
7. Intentar hacer clic en "Continuar"
8. ✅ Verificar redirección automática al carrito cuando se detecta que está vacío

---

### Test 7: Persistencia del Checkout

**Objetivo**: Verificar que los datos del checkout se conservan al recargar

**Pasos**:

1. Completar Paso 1 (Dirección)
2. Avanzar a Paso 2
3. Seleccionar método de pago
4. **Recargar la página** (F5 o Cmd+R)
5. ✅ Verificar que:
   - Se mantiene en Paso 2
   - La dirección ingresada sigue visible
   - El método de pago sigue seleccionado
   - El carrito sigue con los productos

---

### Test 8: Historial de Pedidos con Diferentes Estados

**Objetivo**: Verificar la visualización de pedidos con diferentes estados

**Pasos**:

1. Iniciar sesión como franquiciado (`franchisee@test.com`)
2. Ir a "Mis Pedidos" (`/marketplace/orders`)
3. ✅ Verificar que se muestran los pedidos mock:
   - **Pedido CF-10001**:
     - Estado: "Entregado" (badge verde)
     - Número de seguimiento visible
     - Fecha de entrega visible
   - **Pedido CF-10002**:
     - Estado: "Enviado" (badge azul índigo)
     - Número de seguimiento visible
     - Fecha estimada de entrega
4. ✅ Verificar que cada pedido muestra:
   - Número de pedido
   - Fecha de creación
   - Estado con badge de color
   - Lista de productos (máximo 3, + X más)
   - Dirección de envío
   - Total del pedido
   - Botón "Ver Detalles"

---

### Test 9: Validaciones del Formulario de Tarjeta

**Objetivo**: Verificar validaciones en el pago con tarjeta

**Pasos**:

1. Completar Pasos 1 y 2 con método de pago "Tarjeta"
2. En Paso 3 (Pago):
   - Dejar campos vacíos → ✅ Error: "Campos incompletos"
   - Número con menos de 16 dígitos → ✅ Error: "Número de tarjeta inválido"
   - ✅ Verificar formateo automático del número (espacios cada 4 dígitos)
   - ✅ Verificar que CVV solo acepta 3 dígitos
   - ✅ Verificar que nombre se convierte a mayúsculas automáticamente
   - ✅ Verificar formateo de fecha (MM/AA)
   - **Validaciones de fecha de expiración**:
     - Mes inválido (00, 13, 99) → ✅ Error: "Mes inválido. Debe estar entre 01 y 12"
     - Fecha vencida (08/24) → ✅ Error: "La tarjeta está vencida"
     - Menos de 3 meses de validez → ✅ Error: "La tarjeta debe tener al menos 3 meses de validez"
     - Fecha válida (12/28) → ✅ Procesamiento exitoso

---

### Test 10: Responsive Design del Checkout

**Objetivo**: Verificar que el checkout funciona en diferentes tamaños de pantalla

**Pasos**:

1. Abrir DevTools (F12)
2. Activar modo responsive
3. Probar en diferentes tamaños:
   - **Mobile** (375px):
     - ✅ Indicador de pasos compacto
     - ✅ Formulario en una columna
     - ✅ Resumen del pedido debajo del formulario
     - ✅ Botones apilados verticalmente
   - **Tablet** (768px):
     - ✅ Layout adaptado
     - ✅ Elementos más espaciados
   - **Desktop** (1024px+):
     - ✅ Formulario a la izquierda (2 columnas)
     - ✅ Resumen a la derecha (1 columna, sticky)
     - ✅ Botones en fila

---

## 🎨 Verificaciones de UI/UX

### Colores de Estados de Pedido

| Estado | Badge | Icono |
|--------|-------|-------|
| Pendiente | Amarillo (yellow-100/800) | ⏱️ Clock |
| Confirmado | Azul (blue-100/800) | ✓ CheckCircle2 |
| En Preparación | Púrpura (purple-100/800) | 📦 Box |
| Enviado | Índigo (indigo-100/800) | 🚚 Truck |
| Entregado | Verde (green-100/800) | ✓ CheckCircle2 |
| Cancelado | Rojo (red-100/800) | ✗ XCircle |

### Textos en Español

✅ Todos los textos de la interfaz están en español:
- Títulos y descripciones
- Mensajes de error
- Notificaciones (toasts)
- Botones
- Labels de formularios
- Placeholders

---

## 📊 Datos de Prueba

### Usuario Franquiciado
- **Email**: `franchisee@test.com`
- **Password**: `franchisee123`

### Dirección de Prueba
```
Nombre: Juan Pérez García
Teléfono: 666 123 456
Dirección: Calle Mayor 123, 2º A
Ciudad: Madrid
Provincia: Madrid
CP: 28001
País: España
```

### Tarjeta de Prueba (Mock)
```
Número: 1234 5678 9012 3456
Titular: JUAN PEREZ
Expiración: 12/28 (válida - más de 3 meses)
CVV: 123
```

**Fechas para probar validaciones:**
- ✅ Válida: 12/28, 06/27, 03/27 (más de 3 meses de validez)
- ❌ Vencida: 08/24, 01/25 (fechas pasadas)
- ❌ Poca validez: 11/26, 12/26 (menos de 3 meses desde hoy)
- ❌ Mes inválido: 00/28, 13/28, 99/99

### Pedidos Mock Existentes
- **CF-10001**: Entregado (2 productos, total: 406.39 €)
- **CF-10002**: Enviado (1 producto, total: 134.31 €)

---

## ✅ Checklist de Funcionalidades

- [x] Store de checkout con Zustand + persist
- [x] Tipos TypeScript completos para Order
- [x] Indicador visual de pasos del checkout
- [x] Página de dirección de entrega con validaciones
- [x] Página de revisión del pedido
- [x] Agrupación de productos por proveedor
- [x] Selección de método de pago (tarjeta/transferencia)
- [x] Checkbox de términos y condiciones
- [x] Página de pago con formulario de tarjeta
- [x] Validaciones de datos de tarjeta
- [x] Simulación de procesamiento de pago
- [x] Página de confirmación de pedido
- [x] Mock API para órdenes (list, getById, create, cancel)
- [x] Página de lista de pedidos
- [x] Página de detalle de pedido
- [x] Navegación entre pasos del checkout
- [x] Persistencia de datos del checkout
- [x] Limpieza del carrito tras completar compra
- [x] Reset del estado de checkout tras completar
- [x] Responsive design en todos los pasos
- [x] Mensajes de error y validaciones en español
- [x] Formateo automático de campos (tarjeta, fecha, teléfono)

---

## 🚀 Próximos Pasos (Semana 4)

- [ ] Integración real con Stripe
- [ ] Webhooks para confirmación de pago
- [ ] Gestión de pedidos para proveedores
- [ ] Estados avanzados de pedidos (preparación, envío)
- [ ] Sistema de notificaciones por email
- [ ] Descargar factura en PDF
- [ ] Tracking en tiempo real de envíos
- [ ] Cancelación de pedidos

---

## 📝 Notas Técnicas

### Arquitectura
- **State Management**: Zustand con persist middleware
- **Validaciones**: React Hook Form + Zod
- **Tipos**: TypeScript strict mode
- **Mock API**: Delay de 500ms para simular latencia real
- **Persistencia**: localStorage con keys específicas

### Performance
- Compilación sin errores ✅
- Type-check exitoso ✅
- Carga de componentes optimizada con lazy loading
- Imágenes optimizadas con Next.js Image

### Accesibilidad
- Labels asociados a inputs
- Mensajes de error claros
- Navegación por teclado funcional
- Colores con contraste adecuado

---

**Última actualización**: 2026-08-06  
**Versión**: 1.0.0  
**Estado**: ✅ Completado y listo para pruebas
