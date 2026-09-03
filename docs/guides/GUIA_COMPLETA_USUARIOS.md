# 📖 Guía Completa del Usuario - Marketplace B2B Carrefour

**Versión 2.0 - Agosto 2026**

---

## 🎯 ¿Qué es el Marketplace B2B Carrefour?

Es una plataforma digital que conecta a **proveedores**, **franquiciados** y **administradores** de Carrefour para:

- 📦 Proponer y aprobar productos nuevos
- 💰 Gestionar precios y márgenes
- 📊 Realizar pedidos y hacer seguimiento
- 📤 Cargar productos de forma masiva
- ✅ Revisar y validar propuestas

**Todo en un solo lugar, de forma sencilla y organizada.**

---

## 👥 ¿Quién puede usar la plataforma?

### 🏢 **Proveedores**
Los proveedores pueden:
- Proponer nuevos productos individualmente
- Cargar productos masivamente por CSV
- Ver el estado de sus propuestas (pendiente, aprobado, rechazado)
- Consultar el margen aplicado a sus productos

### 🏪 **Franquiciados** 
Los franquiciados pueden:
- Explorar el catálogo de productos aprobados
- Realizar pedidos
- Hacer seguimiento de sus compras

### 👔 **Administradores**
Los administradores pueden:
- Revisar y aprobar/rechazar productos propuestos
- Configurar el margen global para todos los productos
- Asignar márgenes especiales a proveedores específicos
- Ver historial completo de cambios de precios

---

## 🔐 Cómo Acceder a la Plataforma

### Paso 1: Ingresa a la URL
```
https://marketplace-b2b-carrefour.vercel.app
```

### Paso 2: Inicia Sesión

Usa tu correo y contraseña corporativos.

**Credenciales de prueba (solo para evaluación):**
- **Admin:** `admin@test.com` / `admin123`
- **Proveedor:** `supplier@test.com` / `supplier123`
- **Franquiciado:** `franchisee@test.com` / `franchisee123`

### Paso 3: Navega según tu rol

Serás redirigido automáticamente a tu panel correspondiente.

### Altas e invitaciones

Si vas a entrar por primera vez como franquiciado o proveedor invitado, usa siempre el enlace de alta que te haya enviado Carrefour.

Guías recomendadas:

- [Guía de Alta de Franquiciado](GUIA_ONBOARDING_FRANQUICIADO.md)
- [Guía de Onboarding de Proveedor](GUIA_ONBOARDING_PROVEEDOR.md)
- [Guía para Administrar Altas de Franquiciados](GUIA_ADMIN_ONBOARDING_FRANQUICIADO.md)
- [Guía para Administrar Altas de Proveedores](GUIA_ADMIN_ONBOARDING_PROVEEDOR.md)

---

## 📱 Navegación General

### Menú Superior

En todas las pantallas verás:

- **Logo Carrefour** (esquina superior izquierda): Click para volver al inicio
- **Tu nombre y rol** (esquina superior derecha)
- **Botón de configuración** ⚙️: Para cambiar contraseña y preferencias
- **Botón de perfil** 👤: Para editar tus datos
- **Cerrar sesión** 🚪

### Menú Lateral

Aparece a la izquierda con las opciones disponibles según tu rol (ver detalles más abajo).

---

## 🏢 Guía para PROVEEDORES

### 📊 Panel Principal (Dashboard)

**¿Qué ves aquí?**

Cuatro tarjetas informativas:

1. **Productos Propuestos** (Total)  
   Todos los productos que has enviado a revisión

2. **Productos Aprobados** ✅  
   Productos que ya están disponibles en el catálogo

3. **Pendientes de Revisión** ⏳  
   Productos que están esperando aprobación del administrador

4. **Productos Rechazados** ❌  
   Productos que no fueron aprobados (con motivo del rechazo)

**Margen Global:** Tarjeta destacada que muestra el porcentaje de margen aplicado a todos tus productos (ejemplo: 10%)

**Tabla de Productos:**
- Lista completa de tus productos con estado, precios y acciones
- Filtra por estado: Todos | Pendientes | Aprobados | Rechazados
- Busca por nombre de producto
- Click en "Ver detalle" para información completa

---

### 📦 Proponer un Producto (Individual)

**¿Cuándo usar esto?** Cuando quieres proponer UN solo producto nuevo.

**Pasos:**

1. Ve a **"Mis Productos"** en el menú lateral
2. Click en **"Proponer Producto"**
3. Completa el formulario:

   **Información Básica:**
   - Título del producto (obligatorio)
   - Descripción detallada
   - Categoría general (desplegable)
   - Subcategoría
   - Marca
   - SKU/Referencia (código único)

   **Información Comercial:**
   - EAN (código de barras)
   - Unidades por pack (ej: 6 unidades)
   - Precio base del pack (€) - Este es el precio SIN margen
   - IVA (%) - Ejemplo: 21
   - Stock disponible

   **Imágenes:**
   - URL de hasta 5 imágenes del producto

   **Variantes (opcional):**
   - Si tu producto tiene variantes (talla, color, etc.), agrégalas
   - Ejemplo: Opción 1: "Talla" → Valores: S, M, L, XL
   - Ejemplo: Opción 2: "Color" → Valores: Azul, Rojo

4. Click en **"Proponer Producto"**

5. **¡Listo!** El producto pasa a estado "Pendiente de Revisión"

---

### 📤 Carga Masiva de Productos (CSV)

**¿Cuándo usar esto?** Cuando quieres proponer MUCHOS productos a la vez (10, 50, 100+)

**Pasos:**

1. Ve a **"Carga Masiva"** en el menú lateral

2. **Opción A: Descargar Plantilla**
   - Click en **"Descargar Plantilla CSV"**
   - Se descargará un archivo con ejemplos
   - Abre el archivo en Excel o Google Sheets

3. **Completa la Plantilla**
   
   La plantilla tiene 22 columnas:

   | Columna | Descripción | Ejemplo |
   |---------|-------------|---------|
   | Producto ID | Identificador único | PROD-001 |
   | Título | Nombre del producto | Polo Corporativo Carrefour |
   | Descripción | Texto descriptivo | Polo manga corta... |
   | Categoría general | Categoría principal | Uniformes |
   | Subcategoría | Subcategoría | Ropa corporativa |
   | Marca | Marca del producto | Carrefour |
   | SKU/Referencia | Código único | UNI-001 |
   | EAN | Código de barras | 8412345678901 |
   | Variante | Nombre de variante | Talla M / Color Azul |
   | Opción 1 | Primera característica | Talla |
   | Valor 1 | Valor de opción 1 | M |
   | Opción 2 | Segunda característica | Color |
   | Valor 2 | Valor de opción 2 | Azul |
   | Unidades por pack | Cantidad en pack | 6 |
   | Precio proveedor € | Precio base sin IVA | 15.00 |
   | IVA % | Porcentaje de IVA | 21 |
   | Stock | Unidades disponibles | 500 |
   | Imagen 1-5 URL | URLs de imágenes | https://... |

   **Importante sobre variantes:**
   - Si un producto tiene variantes (tallas, colores), crea UNA fila por cada variante
   - Usa el MISMO "Producto ID" para todas las variantes
   - Ejemplo: PROD-001 para Polo Talla S, Talla M, Talla L

4. **Guarda el archivo como CSV**
   - En Excel: "Guardar como" → CSV (delimitado por comas)
   - En Google Sheets: "Archivo" → "Descargar" → CSV

5. **Sube el archivo a la plataforma**
   
   Dos formas:
   
   **A) Click en "Seleccionar archivo CSV"**
   
   **B) Arrastra y suelta el archivo** en el área marcada

6. **Vista Previa**
   - Verás una tabla con todos los productos detectados
   - Número de productos encontrados
   - Variantes agrupadas automáticamente
   - Revisa que todo esté correcto

7. **Importar**
   - Click en **"Importar Productos"**
   - Verás una barra de progreso
   - Al finalizar, aparecerá un resumen:
     - ✅ Productos importados exitosamente
     - ❌ Productos con errores (y el motivo)

8. **Finalizar**
   - Click en **"Finalizar"** para volver al inicio
   - Los productos pasan a estado "Pendiente de Revisión"

**Errores comunes:**
- SKU duplicado (código ya usado en otro producto)
- Precio inválido (debe ser número)
- Campos obligatorios vacíos (Título, SKU, Precio)

---

### 📋 Ver Estado de Productos

**En "Mis Productos":**

Cada producto muestra:

- **Nombre y descripción**
- **Precio base por unidad** (calculado del pack)
- **Margen aplicado:**
  - 🟦 Badge azul "Global" = usa el margen estándar
  - 🟣 Badge morado "Específico XX%" = tiene margen personalizado
- **Precio final:**
  - Solo visible si está **aprobado**
  - Muestra precio del pack y por unidad
- **Estado:**
  - ⏳ **Pendiente** (naranja): Esperando revisión
  - ✅ **Aprobado** (verde): Ya está en catálogo
  - ❌ **Rechazado** (rojo): No fue aprobado
    - Si está rechazado, verás el motivo del rechazo

**Click en "Ver Detalle":**

Abre una página completa con:

**Lado izquierdo (2/3 de la pantalla):**
- Imagen grande del producto
- **Desglose de Precios:**
  - Precio Base (tu precio)
  - Margen Aplicado (%)
  - Margen en € (cantidad añadida)
  - Precio Final (lo que paga el franquiciado)
- Información adicional (SKU, EAN, stock, categoría)

**Lado derecho (1/3 de la pantalla):**
- **Línea de Tiempo:**
  - 📝 Propuesto: Fecha y hora
  - ✅ Aprobado: Quién lo aprobó y cuándo (si aplica)
  - ❌ Rechazado: Quién lo rechazó, cuándo y por qué (si aplica)
  - ⏳ En Revisión: Animación de pulso

---

### 🔔 Notificaciones

Recibirás emails cuando:
- Un producto es aprobado
- Un producto es rechazado
- Hay un cambio en el margen aplicado a tus productos

Configura la frecuencia en **Configuración** → **Notificaciones**

---

## 👔 Guía para ADMINISTRADORES

### 📊 Panel Principal (Dashboard)

**¿Qué ves aquí?**

Tarjetas con estadísticas clave:

1. **Productos Pendientes** ⏳  
   Número de productos esperando tu revisión

2. **Productos Aprobados** ✅  
   Total de productos en catálogo

3. **Proveedores Activos** 🏢  
   Número de proveedores con productos

4. **Dev Tools** 🛠️  
   Acceso a herramientas de desarrollo (solo admins)

### Altas de franquiciados y proveedores

Además de la operativa diaria, los administradores también gestionan altas nuevas.

Para ese proceso, usa estas guías específicas:

- **Franquiciados:** invitación, revisión, aprobación y gestión de tiendas
- **Proveedores:** invitación, revisión de pendientes, aprobación/rechazo y directorio

Si necesitas el paso a paso completo, consulta las guías dedicadas de onboarding administrativo.

---

### 💰 Gestión de Márgenes

**¿Qué es el margen?**

Es el porcentaje que se añade al precio del proveedor para obtener el precio final de venta.

**Ejemplo:**
- Precio proveedor: €10,00
- Margen: 20%
- Precio final: €12,00 (se añaden €2,00)

#### Margen Global

**¿Qué es?** El margen que se aplica POR DEFECTO a TODOS los productos de TODOS los proveedores.

**Cómo configurarlo:**

1. Ve a **"Markup Global"** en el menú lateral

2. Verás la tarjeta **"Margen Global Actual"** con el porcentaje vigente

3. En la pestaña **"Markup Actual"**:
   - Muestra el margen actual
   - Usa el slider para ajustarlo (0% - 500%)
   - El número se actualiza en tiempo real
   - Click en **"Guardar Cambios"**

4. Confirma el cambio

**⚠️ Importante:** 
- Este cambio afecta a TODOS los productos que no tienen margen específico
- Los productos con margen específico NO se ven afectados

#### Margen Específico por Proveedor

**¿Qué es?** Un margen personalizado para UN proveedor en particular (sobreescribe el global).

**¿Cuándo usarlo?**
- Acuerdos especiales con ciertos proveedores
- Productos de alto volumen con margen reducido
- Productos premium con margen mayor

**Cómo configurarlo:**

1. Ve a **"Markup Global"** en el menú lateral

2. En el desplegable **"Seleccionar Proveedor"**:
   - Elige el proveedor específico
   - Aparecerán las mismas tarjetas pero SOLO para ese proveedor

3. Ajusta el margen usando el slider

4. Click en **"Guardar Cambios"**

5. **¡Todos los productos de ese proveedor ahora usan este margen!**

#### Historial de Cambios

**¿Para qué sirve?** Auditoría completa de todos los cambios de margen.

**Cómo verlo:**

1. Ve a **"Markup Global"**

2. Selecciona la pestaña **"Historial"**

3. Verás una tabla con:
   - Fecha y hora exacta del cambio
   - Margen anterior
   - Margen nuevo
   - Diferencia (con flecha ↑ o ↓)
   - Proveedor (o "Global" si aplica a todos)
   - Usuario que hizo el cambio

**Iconos:**
- 📈 TrendingUp (verde): El margen subió
- 📉 TrendingDown (rojo): El margen bajó
- ➖ Minus (gris): El margen se mantuvo igual

---

### ✅ Cola de Aprobación de Productos

**¿Qué es?** La lista de productos que los proveedores han propuesto y están esperando tu revisión.

**Cómo acceder:**
Ve a **"Cola de Aprobación"** en el menú lateral

**¿Qué ves?**

**Tarjetas superiores:**
- Total de productos pendientes
- Productos aprobados (histórico)
- Productos rechazados (histórico)
- Promedio de tiempo de aprobación

**Filtros:**
- **Por Proveedor:** Desplegable para ver productos de un proveedor específico
- **Por Categoría:** Filtrar por tipo de producto

**Tabla de Productos:**

Cada fila muestra:
- Nombre del producto
- Proveedor que lo propuso
- Categoría
- Precio base (del proveedor)
- Stock disponible
- Fecha de propuesta
- Botones de acción: **"Aprobar"** y **"Rechazar"**

#### Aprobar un Producto

**Pasos:**

1. Click en **"Aprobar"** (botón verde)

2. Se abre un diálogo con:
   
   **Vista previa del producto:**
   - Imagen
   - Nombre y descripción
   - Proveedor
   - Precio base

   **Configuración de Margen:**
   
   Dos opciones (radio buttons):
   
   **A) Usar margen global** (recomendado)
   - Aplica el margen configurado para todos
   - Se actualiza automáticamente si cambias el global
   
   **B) Aplicar margen específico**
   - Usa el slider para definir un margen único para este producto
   - Este margen NO cambia aunque cambies el global
   - Útil para productos especiales

   **Vista Previa de Precios:**
   - Precio final pack (X uds): €XX,XX
   - Precio por unidad: €XX,XX
   - Se actualiza en tiempo real al mover el slider

3. Click en **"Aprobar Producto"**

4. **¡El producto pasa a "Aprobado" y ya está disponible en el catálogo!**

#### Rechazar un Producto

**Pasos:**

1. Click en **"Rechazar"** (botón rojo)

2. Se abre un diálogo:
   - Vista previa del producto
   - Campo de texto **"Motivo del rechazo"** (obligatorio)
   - Explica por qué no se aprueba (ej: "Precio muy alto", "Producto duplicado", "No cumple estándares de calidad")

3. Click en **"Rechazar Producto"**

4. El producto pasa a "Rechazado" y el proveedor recibirá el motivo

---

### 📊 Estadísticas y Reportes

**Dev Tools (solo admins):**

Accede a información técnica:
- Estado de conexiones API
- Endpoints disponibles
- Flags de funcionalidades activas
- Diagnóstico del sistema

---

## 🏪 Guía para FRANQUICIADOS

### 📊 Panel Principal (Dashboard)

**¿Qué ves aquí?**

- Total de pedidos realizados
- Pedidos pendientes
- Gasto total
- Acceso rápido al catálogo

### Alta inicial como franquiciado

Si todavía no tienes acceso activo, el alta se hace desde un enlace de invitación enviado por Carrefour.

Qué debes saber:

- primero completas tus datos personales y de empresa
- defines tu contraseña de acceso
- en algunos casos verás también un paso de pago antes de enviar la solicitud
- después tu solicitud queda pendiente de revisión interna

Para instrucciones detalladas, consulta la guía específica de alta de franquiciado.

### 🛒 Catálogo de Productos

**Explorar productos:**
- Busca por nombre
- Filtra por categoría
- Ver detalles de cada producto
- Añadir al carrito

**Información visible:**
- Nombre y descripción
- **Precio final** (ya incluye margen e IVA)
- Stock disponible
- Imágenes
- Valoraciones

### 📦 Realizar un Pedido

1. Navega el catálogo
2. Click en "Añadir al carrito"
3. Ajusta cantidades
4. Revisa el resumen
5. Confirma el pedido

### 📋 Mis Pedidos

- Historial completo de compras
- Estado de cada pedido:
  - ⏳ Pendiente
  - 📦 En preparación
  - 🚚 Enviado
  - ✅ Entregado
- Detalles y facturas

---

## ⚙️ Configuración y Preferencias

### Cambiar Contraseña

1. Click en el **icono de configuración** ⚙️ (arriba derecha)
2. Sección **"Seguridad"**
3. Ingresa contraseña actual
4. Ingresa nueva contraseña (mínimo 6 caracteres)
5. Confirma la nueva contraseña
6. Click en **"Cambiar Contraseña"**

### Notificaciones

**Tipos de notificaciones:**

Según tu rol, puedes activar/desactivar:

**Proveedores:**
- Nuevos pedidos con tus productos
- Productos aprobados/rechazados
- Cambios en márgenes
- Stock bajo

**Administradores:**
- Nuevos productos pendientes de aprobación
- Alertas del sistema
- Informes diarios

**Franquiciados:**
- Actualizaciones de pedidos
- Promociones
- Ofertas especiales

**Frecuencia:**
- Inmediato (cada evento)
- Diario (resumen 1 vez al día)
- Semanal (resumen semanal)
- Nunca (desactivar)

### Mi Perfil

**Editar información:**

1. Click en el **círculo con tus iniciales** (arriba derecha)
2. Click en **"Editar"**
3. Modifica:
   - Nombre
   - Email
   - Teléfono
   - Dirección
   - (Proveedores: CIF, Razón Social)
4. Click en **"Guardar Cambios"**

---

## 📱 Uso desde Móvil y Tablet

La plataforma se adapta automáticamente:

**📱 Móvil:**
- Menú lateral plegable (botón ☰)
- Tarjetas apiladas verticalmente
- Botones grandes táctiles
- Tabla con scroll horizontal

**🖥️ Tablet:**
- Menú lateral visible
- Diseño a 2 columnas
- Navegación optimizada

**💻 Escritorio:**
- Vista completa
- 4 columnas de información
- Todas las funcionalidades visibles

---

## ❓ Preguntas Frecuentes

### ¿Cuánto tarda en aprobarse un producto?

Depende del administrador, pero generalmente 24-48 horas. Recibirás un email cuando se apruebe o rechace.

### ¿Puedo editar un producto ya propuesto?

No. Si un producto está pendiente y necesitas modificarlo, contacta al administrador. Si fue rechazado, puedes proponer uno nuevo con las correcciones.

### ¿Qué pasa si subo un CSV con errores?

La plataforma valida cada producto y te muestra:
- ✅ Productos correctos (se importan)
- ❌ Productos con errores (se rechazan con explicación)

Puedes corregir los errores y volver a subir solo esos productos.

### ¿Puedo cambiar el margen de un producto ya aprobado?

Sí, como administrador:
- Cambia el margen global (afecta a todos)
- Cambia el margen específico del proveedor (afecta a todos sus productos)
- Los cambios aplican inmediatamente

### ¿Cómo funcionan las variantes?

Ejemplo: Un polo en 3 tallas (S, M, L)
- En CSV: 3 filas con mismo Producto ID
- La plataforma los agrupa automáticamente
- Se muestran como UN producto con variantes

### ¿Los precios incluyen IVA?

- **Precio base:** NO incluye IVA (es el precio del proveedor)
- **Precio final:** SÍ incluye margen + IVA (es lo que paga el franquiciado)

---

## 🔒 Seguridad y Privacidad

- **Cierre automático de sesión:** Después de 30 minutos de inactividad
- **Contraseñas encriptadas:** Nunca se almacenan en texto plano
- **Acceso por roles:** Solo ves lo que corresponde a tu rol
- **Auditoría:** Todos los cambios quedan registrados con fecha y usuario

---

## 💡 Consejos y Mejores Prácticas

### Para Proveedores:

✅ **Usa la carga masiva para más de 5 productos** - Ahorra tiempo  
✅ **Escribe descripciones detalladas** - Ayuda a la aprobación  
✅ **Usa imágenes de calidad** - Mejora la presentación  
✅ **Revisa los precios antes de enviar** - Evita rechazos  
✅ **Mantén actualizado el stock** - Evita problemas de disponibilidad

### Para Administradores:

✅ **Revisa la cola de aprobación diariamente** - Los proveedores esperan respuesta  
✅ **Sé claro en los motivos de rechazo** - Ayuda al proveedor a mejorar  
✅ **Configura el margen global primero** - Luego personaliza solo lo necesario  
✅ **Revisa el historial de cambios** - Mantén control de ajustes de precios

### Para Franquiciados:

✅ **Revisa el catálogo regularmente** - Hay productos nuevos frecuentemente  
✅ **Usa los filtros** - Encuentra productos más rápido  
✅ **Verifica el stock antes de ordenar** - Evita pedidos incompletos

---

## 📞 Soporte y Ayuda

**¿Necesitas ayuda?**

- **Email:** soporte@marketplace-carrefour.com
- **Teléfono:** +34 900 XXX XXX
- **Horario:** Lunes a Viernes, 9:00 - 18:00h

**Reportar un problema:**
Incluye:
- Tu rol (proveedor/franquiciado/admin)
- Descripción del problema
- Pasos para reproducirlo
- Capturas de pantalla (si aplica)

---

## 🎓 Glosario

**Margen / Markup:** Porcentaje añadido al precio del proveedor

**SKU:** Stock Keeping Unit - Código único del producto

**EAN:** European Article Number - Código de barras estándar

**Pack:** Conjunto de unidades que se venden juntas

**CSV:** Comma-Separated Values - Archivo de texto con datos separados por comas

**Variante:** Versión del mismo producto con diferente característica (talla, color)

**Producto ID:** Identificador único para agrupar variantes

**Precio base:** Precio sin margen ni IVA (costo del proveedor)

**Precio final:** Precio con margen + IVA (lo que paga el franquiciado)

---

**¡Gracias por usar el Marketplace B2B Carrefour!**

Si tienes sugerencias para mejorar esta guía, por favor contáctanos.

---

**Marketplace B2B Carrefour**  
**Versión:** 2.0  
**Actualización:** Agosto 2026  
**Desarrollado por:** Abacus Consulting
