# Guía de Pruebas - Catálogo de Franquiciado

**Módulo:** Marketplace Catalog (Franchisee)  
**Rutas:** `/marketplace`, `/marketplace/products/[id]`  
**Última actualización:** 24 Agosto 2026  
**Estado:** ✅ Completo

---

## Índice

1. [Vista General](#1-vista-general)
2. [Página de Lista (Catálogo)](#2-página-de-lista-catálogo)
3. [Página de Detalle de Producto](#3-página-de-detalle-de-producto)
4. [Integración con Carrito](#4-integración-con-carrito)
5. [Verificación de Datos Mock](#5-verificación-de-datos-mock)
6. [Casos de Borde](#6-casos-de-borde)
7. [Responsive Design](#7-responsive-design)
8. [Accesibilidad](#8-accesibilidad)
9. [Performance](#9-performance)

---

## 1. Vista General

### Objetivo
El catálogo de franquiciado permite a los usuarios (franchisees) navegar, buscar y agregar productos al carrito de compras. El catálogo muestra solo productos con estado "published" y proporciona filtros avanzados y detalles completos de producto.

### Características Principales
- ✅ Búsqueda por nombre/descripción
- ✅ Filtros por categoría y proveedor
- ✅ Ordenamiento (nombre, precio)
- ✅ Visualización de variantes
- ✅ Información de stock en tiempo real
- ✅ Sistema de precios B2B (pack/unidad)
- ✅ Agregar al carrito con validación de stock
- ✅ Vista detallada con tabs informativos

### Datos de Prueba
El catálogo usa los mismos 7 productos mock del módulo de Product Management:
- **prod_001**: Polo Carrefour - 3 variantes (S: 150, M: 200, L: 180), €18.50-€22.00
- **prod_002**: Folleto promocional - 8 stock (bajo), €89.00
- **prod_003**: Tótem publicitario - 0 stock, €125.00
- **prod_004**: Detergente industrial - 45 stock, €23.50
- **prod_005**: Bolsas papel - 120 stock, €18.50
- **prod_006**: Cartel LED - estado "proposed" (NO visible)
- **prod_007**: Guantes - estado "draft" (NO visible)

**Nota:** Solo productos con status "published" aparecen en el catálogo (5 productos).

---

## 2. Página de Lista (Catálogo)

### Test 2.1: Carga Inicial
**Ruta:** `/marketplace`

**Pasos:**
1. Acceder a `/marketplace`
2. Verificar que se muestran 5 productos (solo published)
3. Verificar que NO aparecen prod_006 (proposed) ni prod_007 (draft)

**Resultado Esperado:**
- ✅ Grid de 5 productos cargados
- ✅ Cada tarjeta muestra: imagen, título, descripción, precio, stock, proveedor
- ✅ Badges de stock con colores correctos (verde >20, amarillo 1-20, rojo 0)
- ✅ Contador: "5 productos encontrados"

---

### Test 2.2: Búsqueda de Productos
**Pasos:**
1. En el campo de búsqueda, escribir "polo"
2. Verificar resultados filtrados
3. Buscar "folleto"
4. Buscar "xyz" (sin resultados)
5. Limpiar búsqueda

**Resultado Esperado:**
- ✅ "polo" → muestra solo Polo Carrefour (1 producto)
- ✅ "folleto" → muestra solo Folleto promocional (1 producto)
- ✅ "xyz" → muestra mensaje "No se encontraron productos con los filtros seleccionados" + botón "Limpiar filtros"
- ✅ Búsqueda es case-insensitive
- ✅ Busca en título y descripción

---

### Test 2.3: Filtro por Categoría
**Pasos:**
1. Seleccionar "Uniformes y Vestuario" en dropdown de categoría
2. Verificar productos filtrados
3. Seleccionar "Limpieza"
4. Seleccionar "Todas las categorías"

**Resultado Esperado:**
- ✅ "Uniformes y Vestuario" → muestra Polo Carrefour (1 producto)
- ✅ "Limpieza" → muestra Detergente industrial (1 producto)
- ✅ "Todas las categorías" → muestra todos (5 productos)
- ✅ Contador se actualiza correctamente

---

### Test 2.4: Filtro por Proveedor
**Pasos:**
1. Seleccionar "Uniformes Pro" en dropdown de proveedor
2. Verificar productos filtrados
3. Seleccionar "Imprenta Digital Plus"
4. Seleccionar "Todos los proveedores"

**Resultado Esperado:**
- ✅ "Uniformes Pro" → muestra Polo Carrefour (1 producto)
- ✅ "Imprenta Digital Plus" → muestra Folleto promocional (1 producto)
- ✅ "Todos los proveedores" → muestra todos (5 productos)
- ✅ Badge muestra nombre del proveedor

---

### Test 2.5: Filtros Combinados
**Pasos:**
1. Buscar "promocional" + categoría "Marketing y Comunicación" + proveedor "Imprenta Digital Plus"
2. Verificar resultado
3. Cambiar proveedor a "Uniformes Pro" (sin cambiar búsqueda)
4. Limpiar todos los filtros

**Resultado Esperado:**
- ✅ Paso 1 → muestra Folleto promocional (1 producto)
- ✅ Paso 3 → muestra "No se encontraron productos"
- ✅ Botón "Limpiar filtros" resetea búsqueda, categoría y proveedor
- ✅ Filtros AND lógico (todos deben cumplirse)

---

### Test 2.6: Ordenamiento
**Pasos:**
1. Localizar el selector "Ordenar:" en la barra de filtros (con divisor vertical antes)
2. Hacer clic en el selector de ordenamiento
3. Seleccionar "Nombre (A-Z)"
4. Verificar orden alfabético de productos
5. Seleccionar "Precio: Menor a Mayor"
6. Verificar productos ordenados por precio ascendente
7. Seleccionar "Precio: Mayor a Menor"
8. Verificar productos ordenados por precio descendente

**Resultado Esperado:**
- ✅ Selector de ordenamiento visible con label "Ordenar:" claramente identificable
- ✅ Divisor vertical separa filtros de ordenamiento
- ✅ "Nombre (A-Z)" → Bolsas, Detergente, Folleto, Polo, Tótem (orden alfabético)
- ✅ "Precio: Menor a Mayor" → Bolsas (€18.50), Polo (€18.50), Detergente (€23.50), Folleto (€89.00), Tótem (€125.00)
- ✅ "Precio: Mayor a Menor" → Tótem (€125.00), Folleto (€89.00), Detergente (€23.50), Polo (€18.50), Bolsas (€18.50)
- ✅ Ordenamiento se aplica después de filtros
- ✅ Selector muestra el valor actualmente seleccionado

---

### Test 2.7: Stock Badges
**Pasos:**
1. Verificar badge de stock en cada producto:
   - Polo: 150 stock
   - Folleto: 8 stock
   - Tótem: 0 stock
   - Detergente: 45 stock
   - Bolsas: 120 stock

**Resultado Esperado:**
- ✅ Stock > 20 → Badge verde "En Stock"
- ✅ Stock 1-20 → Badge amarillo "Stock Bajo (X)"
- ✅ Stock 0 → Badge rojo "Sin Stock"
- ✅ Colores correctos: bg-green-100, bg-yellow-100, bg-red-100

---

### Test 2.8: Precios B2B (Pack/Unidad)
**Pasos:**
1. Verificar Folleto promocional (1.000 unidades por pack)
2. Verificar precio mostrado
3. Verificar precio por unidad

**Resultado Esperado:**
- ✅ Precio principal: €89.00
- ✅ Texto: "/ pack 1000"
- ✅ Precio unitario: "(€0.089 / unidad)"
- ✅ Productos sin pack no muestran texto adicional

---

### Test 2.9: Variantes Múltiples
**Pasos:**
1. Buscar productos con múltiples variantes
2. Verificar indicador de variantes

**Resultado Esperado:**
- ✅ Productos con >1 variante muestran "X variantes disponibles"
- ✅ Precio mostrado es de la primera variante
- ✅ Stock mostrado es de la primera variante

---

### Test 2.10: Botones de Acción
**Pasos:**
1. Click en "Ver Detalle" de cualquier producto
2. Volver al catálogo
3. Click en "Agregar" de Polo Carrefour
4. Click en "Agregar" de Tótem (sin stock)

**Resultado Esperado:**
- ✅ "Ver Detalle" → navega a `/marketplace/products/{id}`
- ✅ "Agregar" → muestra toast "Producto agregado" + cantidad en carrito incrementa
- ✅ Botón de producto sin stock muestra "Sin Stock" y está deshabilitado
- ✅ Producto se agrega con variante por defecto (primera)

---

### Test 2.11: Estado Vacío
**Pasos:**
1. Aplicar filtros que no devuelvan resultados
2. Verificar mensaje y acción

**Resultado Esperado:**
- ✅ Ícono de paquete (Package)
- ✅ Mensaje: "No se encontraron productos con los filtros seleccionados"
- ✅ Botón "Limpiar filtros" visible
- ✅ Click en botón resetea todos los filtros

---

## 3. Página de Detalle de Producto

### Test 3.1: Carga de Producto
**Ruta:** `/marketplace/products/prod_001`

**Pasos:**
1. Acceder a la URL directa
2. Verificar carga de datos
3. Verificar navegación desde catálogo

**Resultado Esperado:**
- ✅ Imagen principal mostrada
- ✅ Título: "Polo Carrefour"
- ✅ Badge de proveedor: "Uniformes Pro"
- ✅ Badge de stock: verde "Stock: 150" (variante S por defecto)
- ✅ Precio: €18.50 (variante S por defecto)
- ✅ Botón "Volver al catálogo" funcional

---

### Test 3.2: Tabs de Información
**Pasos:**
1. Click en tab "Información"
2. Click en tab "Variantes"
3. Click en tab "Detalles"

**Resultado Esperado:**
- ✅ **Información:**
  - Descripción del producto
  - Lista de categorías con badges
  - Lista de etiquetas (si existen)
- ✅ **Variantes:**
  - Cards clickeables para cada variante
  - SKU, precio, stock por variante
  - Badge de stock coloreado
  - Selección visual (ring azul)
- ✅ **Detalles:**
  - Unidades por pack
  - Cantidad mínima
  - SKU de variante seleccionada
  - Código de barras (si existe)

---

### Test 3.3: Selección de Variantes
**Producto:** prod_001 (Polo con variantes S, M, L)

**Pasos:**
1. Verificar variante inicial seleccionada (S)
2. Click en variante M
3. Verificar cambio de precio y stock
4. Click en variante L

**Resultado Esperado:**
- ✅ Variante S seleccionada por defecto (ring azul)
- ✅ Click en M → ring azul en M, precio actualizado, stock actualizado
- ✅ Precio del card de compra se actualiza
- ✅ Stock máximo en selector de cantidad se actualiza

---

### Test 3.4: Galería de Imágenes
**Pasos:**
1. Verificar imagen principal
2. Verificar miniaturas (si existen >1 imagen)
3. Click en miniatura

**Resultado Esperado:**
- ✅ Si no hay imagen → ícono Package placeholder
- ✅ Si hay thumbnail → imagen principal mostrada
- ✅ Si hay múltiples imágenes → grid de miniaturas (máx 4)
- ✅ Click en miniatura (futuro: cambiar imagen principal)

---

### Test 3.5: Selector de Cantidad
**Producto:** prod_002 (Folleto con stock bajo: 8)

**Pasos:**
1. Verificar cantidad inicial = 1
2. Click en botón "+"
3. Click varias veces hasta llegar a stock máximo (8)
4. Intentar incrementar más
5. Click en botón "-" hasta llegar a 1
6. Intentar decrementar más
7. Escribir manualmente "15" en input
8. Escribir "0"

**Resultado Esperado:**
- ✅ Cantidad inicial: 1
- ✅ Botón "+" incrementa cantidad
- ✅ Al llegar a stock máximo (8), botón "+" se deshabilita
- ✅ Botón "-" decrementa cantidad
- ✅ Cantidad mínima: 1 (no permite menos)
- ✅ Input manual de 15 → se ajusta a 8 (máximo stock)
- ✅ Input manual de 0 → se ajusta a 1 (mínimo)

---

### Test 3.6: Cálculo de Total
**Producto:** prod_002 (Folleto €89.00, pack de 1.000)

**Pasos:**
1. Cantidad = 1 → verificar total
2. Cantidad = 5 → verificar total
3. Verificar precio por pack
4. Verificar precio por unidad

**Resultado Esperado:**
- ✅ Cantidad 1 → Total: €89.00
- ✅ Cantidad 5 → Total: €445.00
- ✅ Precio principal: €89.00 / pack 1000
- ✅ Precio unitario: (€0.089 por unidad)
- ✅ Total se actualiza en tiempo real

---

### Test 3.7: Agregar al Carrito
**Pasos:**
1. Seleccionar variante M
2. Cantidad = 3
3. Click "Agregar al carrito"
4. Verificar toast
5. Verificar ícono de carrito en navbar

**Resultado Esperado:**
- ✅ Toast: "Producto agregado" + "3 x Polo Carrefour agregado al carrito"
- ✅ Cantidad en carrito (navbar) incrementa
- ✅ Producto agregado con variantId correcto
- ✅ Usuario permanece en página de detalle (no navega)

---

### Test 3.8: Producto Sin Stock
**Producto:** prod_003 (Tótem con 0 stock)

**Pasos:**
1. Acceder a `/marketplace/products/prod_003`
2. Verificar badge de stock
3. Verificar botón de agregar

**Resultado Esperado:**
- ✅ Badge rojo: "Sin Stock"
- ✅ Botón muestra "Sin stock" (en lugar de "Agregar al carrito")
- ✅ Botón deshabilitado (disabled)
- ✅ Selector de cantidad deshabilitado o limitado a 0

---

### Test 3.9: Producto No Encontrado
**Ruta:** `/marketplace/products/prod_999`

**Pasos:**
1. Acceder a URL de producto inexistente
2. Verificar mensaje de error
3. Click en "Volver"

**Resultado Esperado:**
- ✅ Mensaje: "Producto no encontrado"
- ✅ Botón "Volver" presente
- ✅ Click en "Volver" → navega al catálogo

---

### Test 3.10: Skeleton Loading
**Pasos:**
1. Recargar página de producto
2. Observar estado de carga (puede ser rápido con mock)

**Resultado Esperado:**
- ✅ Skeleton de imagen (izquierda)
- ✅ Skeleton de título, precio, descripción (derecha)
- ✅ Transición suave a contenido real

---

## 4. Integración con Carrito

### Test 4.1: Agregar Desde Catálogo
**Pasos:**
1. En `/marketplace`, click "Agregar" en Polo (prod_001)
2. Verificar toast
3. Click en ícono de carrito en navbar
4. Verificar producto en carrito

**Resultado Esperado:**
- ✅ Toast confirmación
- ✅ Carrito muestra: Polo, cantidad 1, precio €18.50 (variante S por defecto)
- ✅ VariantId almacenado (primera variante por defecto)

---

### Test 4.2: Agregar Desde Detalle con Variante Específica
**Pasos:**
1. Ir a detalle de Polo
2. Seleccionar variante L
3. Cantidad = 2
4. Agregar al carrito
5. Ver carrito

**Resultado Esperado:**
- ✅ Carrito muestra: Polo (L), cantidad 2, precio correcto
- ✅ VariantId correcto almacenado

---

### Test 4.3: Productos Diferentes
**Pasos:**
1. Agregar Polo (prod_001)
2. Agregar Folleto (prod_002)
3. Agregar Detergente (prod_004)
4. Ver carrito

**Resultado Esperado:**
- ✅ Carrito muestra 3 productos separados
- ✅ Cada uno con su imagen, precio, cantidad

---

### Test 4.4: Mismo Producto, Variantes Diferentes
**Pasos:**
1. Agregar Polo variante S, cantidad 2
2. Agregar Polo variante M, cantidad 3
3. Ver carrito

**Resultado Esperado:**
- ✅ Carrito muestra 2 líneas separadas (S y M)
- ✅ Cantidades independientes
- ✅ Cada línea muestra el título de la variante (ej: "Polo Carrefour - Talla S")
- ✅ SKU y stock específicos de cada variante
- ✅ Gestión independiente de cantidades (cambiar cantidad de S no afecta M)

---

### Test 4.5: Validación de Stock en Carrito
**Pasos:**
1. Agregar Folleto (stock 8), cantidad 5
2. Intentar agregar otros 5 del mismo producto
3. Verificar comportamiento

**Resultado Esperado:**
- ✅ Prevención de exceder stock (dependiendo de lógica de cart)
- ✅ Mensaje de error si se excede límite

---

## 5. Verificación de Datos Mock

### Test 5.1: Productos Published Only
**Pasos:**
1. Verificar lista completa de productos mock (7 en total)
2. Verificar catálogo muestra solo 5
3. Intentar acceder directamente a prod_006 y prod_007

**Resultado Esperado:**
- ✅ prod_001 (published) → visible ✓
- ✅ prod_002 (published) → visible ✓
- ✅ prod_003 (published) → visible ✓
- ✅ prod_004 (published) → visible ✓
- ✅ prod_005 (published) → visible ✓
- ✅ prod_006 (proposed) → NO visible en lista, pero accesible por URL directa
- ✅ prod_007 (draft) → NO visible en lista, pero accesible por URL directa

**Nota:** El filtro de status solo aplica a la lista, no a acceso directo por ID.

---

### Test 5.2: Proveedores
**Pasos:**
1. Verificar dropdown de proveedores tiene 5 opciones
2. Verificar nombres correctos

**Resultado Esperado:**
- ✅ Uniformes Pro
- ✅ Imprenta Digital Plus
- ✅ Visual Merchandising SL
- ✅ Suministros Limpieza Pro
- ✅ Embalajes Carrefour

---

### Test 5.3: Categorías
**Pasos:**
1. Verificar dropdown de categorías tiene 5 opciones
2. Verificar nombres correctos

**Resultado Esperado:**
- ✅ Uniformes y Vestuario
- ✅ Marketing y Comunicación
- ✅ Señalización en Tienda
- ✅ Productos de Limpieza
- ✅ Embalaje y Envíos

---

### Test 5.4: Variantes
**Producto:** prod_001 (Polo)

**Pasos:**
1. Ir a detalle de Polo en `/marketplace/products/prod_001`
2. Click en tab "Variantes"
3. Contar variantes y verificar detalles

**Resultado Esperado:**
- ✅ 3 variantes: Talla S, Talla M, Talla L
- ✅ Cada una con SKU, precio, stock diferente
- ✅ **Talla S:** SKU: POLO-CAR-AZ-S, Precio: €18.50, Stock: 150
- ✅ **Talla M:** SKU: POLO-CAR-AZ-M, Precio: €18.50, Stock: 200
- ✅ **Talla L:** SKU: POLO-CAR-AZ-L, Precio: €22.00, Stock: 180
- ✅ Selección visual con ring azul al hacer click en cada variante

---

## 6. Casos de Borde

### Test 6.1: Producto Sin Imagen
**Pasos:**
1. Verificar producto sin thumbnail
2. Verificar placeholder

**Resultado Esperado:**
- ✅ Ícono Package en gris
- ✅ Div con bg-gray-200

---

### Test 6.2: Producto Sin Descripción
**Pasos:**
1. Verificar producto sin description
2. Verificar tab Información

**Resultado Esperado:**
- ✅ Descripción no se muestra (sin error)
- ✅ Tab Información solo muestra categorías/tags

---

### Test 6.3: Producto Sin Categorías
**Pasos:**
1. Producto sin categories
2. Verificar filtro de categoría no lo muestra

**Resultado Esperado:**
- ✅ No aparece en ningún filtro de categoría
- ✅ Solo visible en "Todas las categorías"

---

### Test 6.4: Producto Sin Tags
**Pasos:**
1. Verificar tab Información
2. Verificar sección de tags

**Resultado Esperado:**
- ✅ Sección de tags no se muestra si array vacío

---

### Test 6.5: Búsqueda con Caracteres Especiales
**Pasos:**
1. Buscar "Carrefour & Co"
2. Buscar "50%"
3. Buscar "<script>"

**Resultado Esperado:**
- ✅ Búsqueda funciona con caracteres especiales
- ✅ No hay errores de JavaScript
- ✅ Sin XSS (texto escapado correctamente)

---

### Test 6.6: Navegación Directa con ID Inválido
**Ruta:** `/marketplace/products/abc123`

**Pasos:**
1. Acceder a URL con ID no existente
2. Verificar mensaje de error

**Resultado Esperado:**
- ✅ Mensaje "Producto no encontrado"
- ✅ Botón "Volver" funcional
- ✅ No crash de aplicación

---

## 7. Responsive Design

### Test 7.1: Desktop (>1280px)
**Pasos:**
1. Ajustar ventana a 1920px ancho
2. Verificar grid de productos

**Resultado Esperado:**
- ✅ Grid de 4 columnas (xl:grid-cols-4)
- ✅ Productos bien espaciados
- ✅ Filtros en una sola fila

---

### Test 7.2: Tablet (768px - 1024px)
**Pasos:**
1. Ajustar ventana a 1024px
2. Verificar grid

**Resultado Esperado:**
- ✅ Grid de 3 columnas (lg:grid-cols-3)
- ✅ Filtros pueden hacer wrap

---

### Test 7.3: Mobile (< 768px)
**Pasos:**
1. Ajustar ventana a 375px (iPhone)
2. Verificar layout

**Resultado Esperado:**
- ✅ Grid de 1 columna
- ✅ Filtros en columna vertical
- ✅ Producto detalle: imagen arriba, info abajo
- ✅ Botones de acción apilados verticalmente

---

### Test 7.4: Tablet Detalle
**Pasos:**
1. En tablet (768px), acceder a detalle de producto
2. Verificar layout

**Resultado Esperado:**
- ✅ Grid 2 columnas (md:grid-cols-2)
- ✅ Imagen izquierda, info derecha
- ✅ Tabs responsive

---

## 8. Accesibilidad

### Test 8.1: Navegación con Teclado
**Pasos:**
1. Usar Tab para navegar entre elementos
2. Enter para seleccionar

**Resultado Esperado:**
- ✅ Todos los botones alcanzables con Tab
- ✅ Focus visible (outline)
- ✅ Enter activa botones
- ✅ Dropdowns navegables con flechas

---

### Test 8.2: Atributos Alt en Imágenes
**Pasos:**
1. Inspeccionar imágenes en DevTools
2. Verificar atributos alt

**Resultado Esperado:**
- ✅ Todas las imágenes tienen alt descriptivo
- ✅ Alt incluye nombre del producto

---

### Test 8.3: Contraste de Color
**Pasos:**
1. Verificar contraste de texto
2. Verificar badges

**Resultado Esperado:**
- ✅ Texto negro sobre fondo blanco (WCAG AAA)
- ✅ Badges con contraste suficiente
- ✅ Enlaces distinguibles

---

### Test 8.4: Screen Reader
**Pasos:**
1. Activar VoiceOver (Mac) o NVDA (Windows)
2. Navegar por catálogo

**Resultado Esperado:**
- ✅ Productos anunciados correctamente
- ✅ Precios y stock legibles
- ✅ Botones con etiquetas claras

---

## 9. Performance

### Test 9.1: Tiempo de Carga Inicial
**Pasos:**
1. Abrir DevTools → Network
2. Recargar `/marketplace`
3. Medir tiempo total

**Resultado Esperado:**
- ✅ Carga completa < 2 segundos (con mock data)
- ✅ Sin bloqueos de UI
- ✅ Skeleton visible durante carga

---

### Test 9.2: Rendimiento de Filtros
**Pasos:**
1. Escribir en búsqueda
2. Medir tiempo de respuesta

**Resultado Esperado:**
- ✅ Filtrado instantáneo (< 100ms)
- ✅ No lag al escribir
- ✅ Contador actualizado en tiempo real

---

### Test 9.3: Imágenes Optimizadas
**Pasos:**
1. Verificar tamaño de imágenes cargadas
2. Verificar formato

**Resultado Esperado:**
- ✅ Imágenes responsive (srcset si aplica)
- ✅ Lazy loading en grid
- ✅ Formato WebP recomendado

---

### Test 9.4: Bundle Size
**Pasos:**
1. Ejecutar `npm run build`
2. Verificar tamaño de bundles

**Resultado Esperado:**
- ✅ Página marketplace < 200KB (JS)
- ✅ Code splitting aplicado
- ✅ No duplicación de dependencies

---

## Checklist Final

### Funcionalidad Core
- [ ] Lista de catálogo carga correctamente
- [ ] Solo productos published visibles
- [ ] Búsqueda funcional (nombre + descripción)
- [ ] Filtro por categoría funcional
- [ ] Filtro por proveedor funcional
- [ ] Ordenamiento funcional (nombre, precio asc/desc)
- [ ] Detalle de producto carga correctamente
- [ ] Tabs de información funcionales
- [ ] Selección de variantes funcional
- [ ] Selector de cantidad con validación de stock
- [ ] Agregar al carrito desde catálogo
- [ ] Agregar al carrito desde detalle
- [ ] Stock badges con colores correctos
- [ ] Precios B2B (pack/unidad) correctos

### UI/UX
- [ ] Diseño responsive (mobile, tablet, desktop)
- [ ] Estado de carga (skeleton) visible
- [ ] Estado vacío con mensaje claro
- [ ] Toasts de confirmación funcionan
- [ ] Navegación fluida (volver al catálogo)
- [ ] Botones deshabilitados cuando sin stock
- [ ] Focus visible en navegación con teclado

### Integración
- [ ] Feature flag 'catalog' configurado
- [ ] Dev-tools documenta endpoints de catalog
- [ ] Usa mock data de products-mock.ts
- [ ] Usa tipo Product de types/products.ts
- [ ] Integra con cart store correctamente

### Calidad de Código
- [ ] Sin errores de TypeScript
- [ ] Sin warnings de linter
- [ ] Sin errores de consola
- [ ] Componentes bien estructurados
- [ ] Código limpio y mantenible

---

## Notas de Implementación

### Archivo Principal
`src/app/(marketplace)/marketplace/page.tsx`
- 5 filtros: búsqueda, categoría, proveedor, ordenamiento
- Estado vacío con limpieza de filtros
- Grid responsive 1-4 columnas
- Badges de stock con colores Tailwind custom

### Detalle de Producto
`src/app/(marketplace)/marketplace/products/[id]/page.tsx`
- 3 tabs: Información, Variantes, Detalles
- Selección de variante con card clickeable
- Validación de cantidad con stock máximo
- Precio dinámico según variante seleccionada

### Feature Flags
`src/config/feature-flags.ts`
- Módulo 'catalog' agregado
- Default: NEXT_PUBLIC_MOCK_CATALOG !== 'false'
- Backend: apiBaseUrl '/store/products'

### Dev Tools
`src/app/(backoffice)/admin/dev-tools/page.tsx`
- 2 endpoints de catalog documentados:
  - GET /store/products (lista)
  - GET /store/products/:id (detalle)
- Status: 'working'

---

## Próximos Pasos

1. **Cart Enhancement** → Mejorar vista de carrito con resumen
2. **Checkout Process** → Implementar flujo de checkout
3. **Franchisee Orders** → Vista de pedidos históricos
4. **Real API Integration** → Conectar con Medusa backend
5. **Payment Integration** → Stripe/método de pago
6. **Stock Real-Time** → WebSockets para stock updates
7. **Wishlist** → Lista de deseos
8. **Product Reviews** → Sistema de reseñas

---

**Estado del Módulo:** ✅ **COMPLETO Y LISTO PARA TESTING**

Última actualización: 24 Agosto 2026
