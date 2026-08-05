# Funcionalidades - Marketplace B2B Carrefour

## Índice

- [Módulo de Franquiciados](#módulo-de-franquiciados)
- [Módulo de Proveedores](#módulo-de-proveedores)
- [Módulo de Catálogo](#módulo-de-catálogo)
- [Módulo de Órdenes](#módulo-de-órdenes)
- [Módulo de Compras](#módulo-de-compras)
- [Módulo de Incidencias](#módulo-de-incidencias)
- [Funcionalidades Transversales](#funcionalidades-transversales)

---

## Módulo de Franquiciados

### Descripción General
Gestión completa del perfil y actividades de los franquiciados de Carrefour.

### Funcionalidades

#### 1. Dashboard de Franquiciado
**Objetivo**: Proporcionar una visión general de la actividad del franquiciado

**Características**:
- Resumen de pedidos activos
- Estadísticas de compras del mes
- Últimas notificaciones e incidencias
- Productos recomendados
- Indicadores clave (KPIs):
  - Total gastado este mes
  - Número de pedidos realizados
  - Pedidos pendientes de recepción
  - Incidencias abiertas

**Vista Mobile**: Cards deslizables con información resumida

#### 2. Perfil de Franquiciado
**Objetivo**: Gestionar la información del establecimiento

**Información del perfil**:
- Datos de la empresa
  - Nombre del establecimiento
  - NIF/CIF
  - Dirección física
  - Teléfono de contacto
  - Email de contacto
- Datos del representante
- Información de facturación
- Métodos de pago configurados
- Preferencias de notificación

**Acciones**:
- Editar información
- Cambiar contraseña
- Gestionar usuarios adicionales (si aplica)
- Configurar preferencias

#### 3. Gestión de Establecimientos
**Objetivo**: Administrar múltiples puntos de venta (si aplica)

**Características**:
- Listado de establecimientos asociados
- Selección de establecimiento activo
- Configuración por establecimiento
- Pedidos diferenciados por establecimiento

#### 4. Historial de Actividad
**Objetivo**: Consultar el histórico de actividades

**Información disponible**:
- Historial de compras
- Cambios en el perfil
- Comunicaciones con proveedores
- Resolución de incidencias

---

## Módulo de Proveedores

### Descripción General
Gestión de proveedores aprobados y sus catálogos de productos/servicios.

### Funcionalidades

#### 1. Dashboard de Proveedor
**Objetivo**: Visión general de la actividad del proveedor

**Características**:
- Pedidos pendientes de procesar
- Pedidos en preparación
- Métricas de ventas
- Productos más vendidos
- Calificación promedio
- Alertas de stock bajo

**Métricas principales**:
- Ventas del mes
- Número de pedidos
- Tiempo promedio de entrega
- Tasa de satisfacción

#### 2. Perfil de Proveedor
**Objetivo**: Gestionar información del proveedor

**Información del perfil**:
- Datos de la empresa
- Categorías de productos ofrecidos
- Zonas de cobertura
- Políticas de envío
- Términos y condiciones
- Información de contacto

**Documentación**:
- Certificaciones
- Licencias
- Documentos fiscales

#### 3. Gestión de Catálogo
**Objetivo**: Administrar productos y servicios ofrecidos

**Características**:
- Listado de productos
- Agregar nuevos productos
  - Información básica (nombre, descripción)
  - Categoría
  - Precio(s)
  - Stock disponible
  - Imágenes
  - Especificaciones técnicas
  - Tiempos de entrega
- Editar productos existentes
- Activar/desactivar productos
- Gestión de stock
- Precios especiales o promociones
- Import/Export masivo (CSV)

#### 4. Gestión de Pedidos Recibidos
**Objetivo**: Procesar pedidos de franquiciados

**Características**:
- Listado de pedidos por estado
  - Nuevos (pendiente confirmación)
  - Confirmados
  - En preparación
  - Enviados
  - Entregados
  - Cancelados
- Detalles del pedido
- Confirmación/Rechazo de pedidos
- Actualización de estados
- Generación de albaranes
- Comunicación con el franquiciado

#### 5. Métricas y Reportes
**Objetivo**: Análisis de desempeño

**Reportes disponibles**:
- Ventas por período
- Productos más vendidos
- Franquiciados más frecuentes
- Análisis de incidencias
- Tiempos de entrega
- Exportación de datos

---

## Módulo de Catálogo

### Descripción General
Sistema de navegación, búsqueda y visualización de productos y servicios.

### Funcionalidades

#### 1. Navegación por Categorías
**Objetivo**: Explorar productos organizados por categorías

**Estructura de categorías** (ejemplo):
```
Equipamiento
├── Refrigeración
├── Hornos y Cocinas
├── Mobiliario
└── Cajas Registradoras

Suministros
├── Embalajes
├── Etiquetas
├── Bolsas
└── Material de limpieza

Servicios
├── Mantenimiento
├── Seguridad
├── Formación
└── Consultoría

Tecnología
├── Software TPV
├── Hardware
├── Conectividad
└── Sistemas de seguridad
```

**Características**:
- Menú de categorías multinivel
- Breadcrumbs de navegación
- Filtros por categoría
- Contador de productos por categoría

#### 2. Búsqueda de Productos
**Objetivo**: Encontrar productos específicos rápidamente

**Tipos de búsqueda**:
- Búsqueda por texto libre
- Autocompletado
- Sugerencias de búsqueda
- Búsqueda por código de producto
- Búsqueda por proveedor

**Resultados de búsqueda**:
- Listado con vista de grid/lista
- Ordenamiento:
  - Relevancia
  - Precio (ascendente/descendente)
  - Popularidad
  - Nuevos productos
- Paginación

#### 3. Filtros Avanzados
**Objetivo**: Refinar resultados de búsqueda

**Filtros disponibles**:
- Rango de precios
- Proveedor
- Categoría
- Disponibilidad
- Calificación
- Características específicas (según categoría)
- Tiempo de entrega

**Funcionalidad**:
- Filtros múltiples simultáneos
- Contador de resultados por filtro
- Limpiar filtros
- Guardar combinaciones de filtros

#### 4. Listado de Productos
**Objetivo**: Mostrar productos de forma clara y atractiva

**Información mostrada**:
- Imagen del producto
- Nombre
- Proveedor
- Precio
- Calificación (estrellas)
- Disponibilidad
- Badge de "Nuevo", "Oferta", etc.

**Vistas**:
- Vista Grid (tarjetas)
- Vista Lista (más detalle)

#### 5. Detalle de Producto
**Objetivo**: Información completa del producto

**Información detallada**:
- Galería de imágenes
- Nombre del producto
- Descripción completa
- Proveedor (con link a perfil)
- Precio
- Stock disponible
- Tiempo estimado de entrega
- Especificaciones técnicas
- Dimensiones/Peso
- Garantía
- Política de devoluciones

**Interacciones**:
- Añadir al carrito
- Seleccionar cantidad
- Agregar a favoritos
- Compartir
- Solicitar información adicional
- Comparar con otros productos

**Información adicional**:
- Productos relacionados
- Productos del mismo proveedor
- Reseñas y calificaciones de otros franquiciados

#### 6. Comparador de Productos
**Objetivo**: Comparar características de productos similares

**Características**:
- Seleccionar hasta 3-4 productos
- Comparación lado a lado
- Tabla de especificaciones
- Resaltar diferencias
- Recomendación basada en criterios

#### 7. Sistema de Reseñas y Calificaciones
**Objetivo**: Feedback de franquiciados sobre productos

**Características**:
- Calificación con estrellas (1-5)
- Comentarios escritos
- Fecha de la reseña
- Verificación de compra
- Respuestas del proveedor
- Filtrar reseñas (positivas, negativas, recientes)
- Marcar reseñas útiles

---

## Módulo de Órdenes

### Descripción General
Gestión completa del ciclo de vida de los pedidos.

### Funcionalidades

#### 1. Creación de Pedidos
**Objetivo**: Generar nuevos pedidos desde el carrito

**Proceso**:
1. Revisar carrito
2. Seleccionar dirección de entrega
3. Seleccionar método de pago
4. Confirmar pedido
5. Recibir confirmación

**Información requerida**:
- Dirección de entrega
- Fecha deseada de entrega
- Notas especiales
- Método de pago
- Persona de contacto para recepción

#### 2. Estados del Pedido
**Objetivo**: Seguimiento del estado del pedido

**Estados posibles**:
- 🟡 **Pendiente**: Pedido creado, esperando confirmación del proveedor
- 🔵 **Confirmado**: Proveedor ha aceptado el pedido
- 🟠 **En Preparación**: Proveedor está preparando el pedido
- 🚚 **Enviado**: Pedido en tránsito
- ✅ **Entregado**: Pedido recibido por el franquiciado
- ❌ **Cancelado**: Pedido cancelado
- ⚠️ **Incidencia**: Problema con el pedido

**Transiciones de estado**:
- Notificaciones automáticas en cada cambio
- Histórico de cambios de estado
- Timestamps de cada estado

#### 3. Seguimiento de Pedidos
**Objetivo**: Visibilidad del estado actual del pedido

**Características**:
- Timeline visual del pedido
- Información de tracking (si aplica)
- Fecha estimada de entrega
- Información del proveedor
- Detalles del pedido (productos, cantidades, precios)
- Documentos asociados (factura, albarán)
- Contacto del transportista (si aplica)

#### 4. Listado de Pedidos
**Objetivo**: Ver todos los pedidos realizados

**Características**:
- Vista de tabla con información resumida
- Filtros:
  - Por estado
  - Por fecha
  - Por proveedor
  - Por monto
- Búsqueda por número de pedido
- Ordenamiento
- Acciones rápidas (ver detalle, descargar factura)
- Paginación

#### 5. Detalle de Pedido
**Objetivo**: Información completa del pedido

**Información mostrada**:
- Número de pedido
- Fecha de creación
- Estado actual
- Proveedor
- Productos (listado detallado)
  - Nombre
  - Cantidad
  - Precio unitario
  - Subtotal
- Subtotal
- Impuestos
- Costos de envío
- **Total**
- Dirección de entrega
- Método de pago
- Documentos descargables

**Acciones disponibles**:
- Ver seguimiento
- Descargar factura
- Descargar albarán
- Contactar al proveedor
- Reportar incidencia
- Cancelar pedido (si está permitido)
- Re-ordenar (crear nuevo pedido con los mismos productos)

#### 6. Historial de Pedidos
**Objetivo**: Consultar pedidos históricos

**Características**:
- Filtros por rango de fechas
- Exportar a CSV/Excel
- Estadísticas de compras
- Productos más pedidos
- Proveedores frecuentes

---

## Módulo de Compras

### Descripción General
Proceso de compra, desde el carrito hasta el pago.

### Funcionalidades

#### 1. Carrito de Compras
**Objetivo**: Gestionar productos antes de realizar el pedido

**Características**:
- Agregar productos
- Modificar cantidad
- Eliminar productos
- Ver subtotal por producto
- Ver total del carrito
- Productos agrupados por proveedor
- Guardar carrito para más tarde
- Vaciar carrito
- Aplicar cupones/descuentos (si aplica)

**Información mostrada**:
- Imagen del producto
- Nombre
- Proveedor
- Precio unitario
- Cantidad
- Subtotal
- Stock disponible
- Tiempo de entrega estimado

**Validaciones**:
- Stock disponible
- Cantidades mínimas/máximas
- Compatibilidad de productos

#### 2. Proceso de Checkout
**Objetivo**: Completar la compra

**Pasos del checkout**:

**Paso 1: Revisión del carrito**
- Verificar productos y cantidades
- Modificar si es necesario

**Paso 2: Dirección de entrega**
- Seleccionar dirección guardada
- Añadir nueva dirección
- Notas de entrega

**Paso 3: Método de envío** (si aplica)
- Estándar
- Express
- Recoger en almacén

**Paso 4: Método de pago**
- Tarjeta de crédito/débito
- Transferencia bancaria
- Cuenta de crédito (si aplica)
- Pago contra entrega

**Paso 5: Resumen y confirmación**
- Resumen completo del pedido
- Términos y condiciones
- Confirmar compra

**Post-confirmación**:
- Página de confirmación
- Número de pedido generado
- Email de confirmación
- Opción de descargar resumen

#### 3. Métodos de Pago
**Objetivo**: Opciones de pago flexibles

**Métodos soportados**:
- **Tarjeta**: Visa, Mastercard, American Express
- **Transferencia**: Datos bancarios del proveedor
- **Cuenta de crédito**: Línea de crédito pre-aprobada
- **Pago contra entrega**: Para ciertos productos/montos

**Seguridad**:
- Pasarela de pago segura (PCI-DSS compliant)
- Tokenización de tarjetas
- 3D Secure

#### 4. Facturación
**Objetivo**: Gestión de facturas

**Características**:
- Generación automática de factura
- Descarga de factura en PDF
- Envío de factura por email
- Historial de facturas
- Datos fiscales correctos
- Desglose de impuestos

**Información en la factura**:
- Número de factura
- Fecha de emisión
- Datos del proveedor
- Datos del franquiciado
- Detalle de productos/servicios
- Subtotal, impuestos, total
- Condiciones de pago
- Datos bancarios (si aplica)

#### 5. Gestión de Direcciones
**Objetivo**: Administrar direcciones de entrega

**Características**:
- Direcciones guardadas
- Añadir nueva dirección
- Editar direcciones
- Eliminar direcciones
- Marcar dirección por defecto
- Validación de direcciones

---

## Módulo de Incidencias

### Descripción General
Sistema de gestión de problemas, quejas y soporte.

### Funcionalidades

#### 1. Creación de Incidencias
**Objetivo**: Reportar problemas con pedidos o productos

**Tipos de incidencias**:
- Producto no recibido
- Producto defectuoso
- Producto incorrecto
- Cantidad incorrecta
- Retraso en la entrega
- Facturación incorrecta
- Problema de calidad
- Consulta general
- Otro

**Información requerida**:
- Tipo de incidencia
- Pedido relacionado (si aplica)
- Producto afectado (si aplica)
- Descripción detallada
- Adjuntar imágenes/documentos
- Prioridad (baja, media, alta, urgente)

**Proceso**:
1. Seleccionar tipo
2. Completar formulario
3. Adjuntar evidencias
4. Enviar incidencia
5. Recibir número de ticket

#### 2. Sistema de Tickets
**Objetivo**: Seguimiento estructurado de incidencias

**Características**:
- Número de ticket único
- Estados del ticket:
  - 🆕 Nuevo
  - 📖 Abierto
  - 🔄 En proceso
  - ⏸️ Esperando respuesta
  - ✅ Resuelto
  - ❌ Cerrado
- Prioridad
- Fecha de creación
- Última actualización
- Tiempo de respuesta
- SLA (Service Level Agreement)

#### 3. Seguimiento de Incidencias
**Objetivo**: Visibilidad del estado de la incidencia

**Características**:
- Listado de incidencias propias
- Filtros:
  - Por estado
  - Por tipo
  - Por prioridad
  - Por fecha
- Búsqueda por número de ticket
- Vista de detalle de incidencia
- Historial de comunicaciones
- Timeline de acciones

#### 4. Comunicación/Chat
**Objetivo**: Comunicación directa entre franquiciado y proveedor

**Características**:
- Chat en tiempo real (o sistema de mensajería)
- Historial de conversación
- Adjuntar archivos en la conversación
- Notificaciones de nuevos mensajes
- Indicador de lectura
- Respuestas del proveedor
- Respuestas del equipo de soporte (si aplica)

#### 5. Resolución y Cierre
**Objetivo**: Cerrar incidencias satisfactoriamente

**Acciones de resolución**:
- Reemplazo de producto
- Devolución de dinero
- Crédito para próxima compra
- Compensación
- Aclaración/Explicación

**Proceso de cierre**:
- Solución propuesta por el proveedor
- Aceptación por el franquiciado
- Calificación de la resolución
- Comentario final
- Cierre del ticket

**Encuesta de satisfacción**:
- ¿Se resolvió su problema?
- Calificación del servicio (1-5)
- Comentarios adicionales

#### 6. Historial de Incidencias
**Objetivo**: Consultar incidencias pasadas

**Características**:
- Búsqueda de incidencias cerradas
- Filtros históricos
- Estadísticas de incidencias
- Tiempo promedio de resolución
- Exportación de datos

---

## Funcionalidades Transversales

### 1. Autenticación y Autorización

#### Login/Logout
- Inicio de sesión con email y contraseña
- Opción "Recordarme"
- Recuperación de contraseña
- Autenticación de dos factores (opcional)
- Logout seguro

#### Registro
- Registro de franquiciados (proceso de aprobación)
- Registro de proveedores (proceso de validación)
- Verificación de email
- Términos y condiciones

#### Roles y Permisos
- **Franquiciado**: Comprar, ver catálogo, gestionar pedidos
- **Proveedor**: Gestionar catálogo, procesar pedidos
- **Administrador**: Gestión completa de la plataforma
- **Soporte**: Gestión de incidencias

### 2. Notificaciones

#### Tipos de notificaciones
- **Email**: Confirmaciones, actualizaciones importantes
- **In-App**: Notificaciones dentro de la aplicación
- **Push** (opcional): Notificaciones móviles

#### Eventos notificables
- Confirmación de registro
- Confirmación de pedido
- Cambio de estado de pedido
- Respuesta a incidencia
- Promociones (opcional)
- Recordatorios (carrito abandonado, etc.)

#### Configuración
- Preferencias de notificación
- Frecuencia de emails
- Opt-in/opt-out

### 3. Búsqueda Global

- Búsqueda en toda la plataforma
- Resultados categorizados:
  - Productos
  - Proveedores
  - Pedidos
  - Incidencias
- Autocompletado inteligente

### 4. Favoritos/Wishlist

- Guardar productos favoritos
- Crear listas de deseos
- Compartir listas
- Agregar al carrito desde favoritos

### 5. Idiomas y Localización

- Multi-idioma (Español principal)
- Formato de fechas regional
- Moneda (Euro)
- Formato de números

### 6. Ayuda y Soporte

- FAQ (Preguntas frecuentes)
- Centro de ayuda
- Tutoriales/Videos
- Chat en vivo (opcional)
- Formulario de contacto

### 7. Configuración de Usuario

- Preferencias de visualización
- Tema claro/oscuro (opcional)
- Configuración de privacidad
- Gestión de notificaciones
- Datos de perfil

### 8. Analytics y Reportes (Administrador)

- Dashboard de métricas generales
- Reportes de ventas
- Comportamiento de usuarios
- Productos más vendidos
- Proveedores top
- Análisis de incidencias

---

**Última actualización**: 5 de agosto de 2026
