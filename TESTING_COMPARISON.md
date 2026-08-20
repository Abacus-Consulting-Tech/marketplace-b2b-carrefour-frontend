# Guía de Testing - Comparación de Presupuestos (Franchisee Portal)

## Descripción
Sistema que permite al franquiciado comparar los presupuestos recibidos para cada categoría de su proyecto y adjudicar el presupuesto ganador.

## Estado de Implementación
✅ **COMPLETO** - MVP funcional con mock API

## Credenciales de Acceso

### Usuario Franquiciado Mock
```
Email: franchisee@test.com
Password: franchisee123
```

## Datos Mock Disponibles

### Proyecto del Franquiciado
```typescript
Proyecto:
- ID: proj_test_001
- Nombre: "Nueva apertura - Calle Carmen 50"
- Franquiciado: Juan García (franchisee@test.com)
- Estado: quotes_received
- Categorías: 3 (Mobiliario, Rotulación, Equipamiento IT)
```

### Presupuestos Recibidos (Mock)

**Categoría 1: Mobiliario (cat_001)**
- Presupuesto estimado: €35,000
- Presupuestos recibidos: 2

```typescript
Quote 1:
- Proveedor: Mobiliario Retail S.L.
- Importe: €32,500 (ahorro 7.1%)
- Plazo: 30 días
- Garantía: 24 meses
- Estado: submitted
- Mejor precio: ✅ SÍ

Quote 2:
- Proveedor: Equipamientos BCN
- Importe: €34,800 (ahorro 0.6%)
- Plazo: 25 días
- Garantía: 36 meses
- Estado: submitted
```

**Categoría 2: Rotulación (cat_002)**
- Presupuesto estimado: €12,000
- Presupuestos recibidos: 1

```typescript
Quote 1:
- Proveedor: Rótulos y Vinilos Madrid
- Importe: €11,200 (ahorro 6.7%)
- Plazo: 15 días
- Garantía: 12 meses
- Estado: submitted (si supplier envió quote)
- Mejor precio: ✅ SÍ (único)
```

**Categoría 3: Equipamiento IT (cat_003)**
- Presupuesto estimado: €8,000
- Presupuestos recibidos: 1

```typescript
Quote 1:
- Proveedor: Soluciones IT Retail
- Importe: €7,800 (ahorro 2.5%)
- Plazo: 20 días
- Garantía: 12 meses
- Estado: submitted (si supplier envió quote)
- Mejor precio: ✅ SÍ (único)
```

## Pasos de Testing

### 1. Login como Franquiciado
```bash
1. Ir a http://localhost:3002/login
2. Email: franchisee@test.com
3. Password: franchisee123
4. Click "Iniciar sesión"
5. ESPERADO: Redirect a dashboard de franquiciado
```

### 2. Acceder al Proyecto
```bash
1. Desde el dashboard, navegar a "Nuevas Aperturas" o "Mis Proyectos"
2. URL: http://localhost:3002/franchisee/openings
3. ESPERADO:
   - Ver proyecto "Nueva apertura - Calle Carmen 50"
   - Estado: "Presupuestos recibidos" o similar
   - Click en el proyecto para ver detalles
```

### 3. Ver Categorías del Proyecto
```bash
1. En la página de detalles del proyecto
2. URL: http://localhost:3002/franchisee/openings/proj_test_001
3. ESPERADO:
   - Ver tab "Categorías" o lista de categorías
   - Ver 3 categorías:
     * Mobiliario (€35,000) - 2 presupuestos
     * Rotulación (€12,000) - 1 presupuesto
     * Equipamiento IT (€8,000) - 1 presupuesto
   - Cada categoría tiene botón "Comparar Presupuestos"
```

### 4. Abrir Comparación de Presupuestos
```bash
1. Click en "Comparar Presupuestos" de la categoría "Mobiliario"
2. ESPERADO:
   - Redirect a: /franchisee/openings/proj_test_001/categories/cat_001/compare
   - Página se carga mostrando:
     * Header con botón "Volver al Proyecto"
     * Título "Comparación de Presupuestos"
     * Subtítulo "Mobiliario Comercial"
     * Presupuesto estimado: €35,000 (destacado)
```

### 5. Ver Estadísticas de Comparación
```bash
En la parte superior de la tabla:
- ESPERADO:
  * Card azul "Presupuestos recibidos": 2
  * Card verde "Mejor oferta": €32,500
  * Card morado "Ahorro potencial": +7.1%
```

### 6. Analizar Tabla de Comparación
```bash
Columnas de la tabla:
1. Proveedor
   - Nombre de la empresa
   - Email de contacto
   - Teléfono

2. Importe
   - Precio en euros (destacado)
   - Badge "Mejor precio" en el más barato (verde)
   - Porcentaje vs estimado (↓ verde si ahorra, ↑ rojo si excede)

3. Plazo
   - Días de entrega con icono de calendario

4. Garantía
   - Meses con icono de escudo

5. Condiciones de Pago
   - Texto truncado con icono de tarjeta
   - Tooltip muestra texto completo

6. PDF
   - Botón "Ver PDF" con icono de descarga
   - Link se abre en nueva pestaña

7. Estado
   - Badge "Pendiente" (outline)
   - Badge "Adjudicado" (verde con icono de estrella)
   - Badge "Rechazado" (gris)

8. Acción
   - Botón "Adjudicar" (azul, solo si ninguno está adjudicado)
   - Deshabilitado si ya hay uno adjudicado

ESPERADO:
- Fila del presupuesto más barato tiene fondo verde claro
- Presupuestos ordenados por precio (más barato primero)
- Toda la información visible y bien formateada
```

### 7. Ver Notas Adicionales
```bash
Debajo de la tabla:
- ESPERADO (si hay notas):
  * Sección "Notas de los proveedores"
  * Cards con fondo gris mostrando:
    - Nombre del proveedor
    - Texto de las notas
```

### 8. Adjudicar Presupuesto
```bash
1. Click en botón "Adjudicar" del presupuesto más barato (€32,500)
2. ESPERADO:
   - Se abre diálogo de confirmación
   - Título: "Confirmar Adjudicación"
   - Muestra resumen:
     * Proveedor: Mobiliario Retail S.L.
     * Importe: €32,500.00
     * Plazo: 30 días
     * Garantía: 24 meses
   - Botones: "Cancelar" y "Confirmar Adjudicación"
```

### 9. Confirmar Adjudicación
```bash
1. Click en "Confirmar Adjudicación"
2. ESPERADO:
   - Diálogo se cierra
   - Toast de éxito: "Presupuesto adjudicado"
   - Tabla se actualiza:
     * Presupuesto adjudicado muestra badge "Adjudicado" (verde)
     * Otros presupuestos muestran badge "Rechazado"
     * Botón "Adjudicar" desaparece de todos
   - Mock actualiza el estado en sessionStorage
```

### 10. Cancelar Adjudicación
```bash
ANTES DE CONFIRMAR:
1. Click en botón "Adjudicar"
2. En el diálogo, click "Cancelar"
3. ESPERADO:
   - Diálogo se cierra
   - No se realizan cambios
   - No hay toast
   - Estado sigue igual
```

### 11. Volver al Proyecto
```bash
1. Click en botón "Volver al Proyecto"
2. ESPERADO:
   - Redirect a /franchisee/openings/proj_test_001
   - Se mantiene el estado de adjudicación
   - Categoría "Mobiliario" muestra algún indicador de que ya tiene presupuesto adjudicado
```

### 12. Comparar Otra Categoría
```bash
1. Desde los detalles del proyecto, click en "Comparar Presupuestos" de "Rotulación"
2. ESPERADO:
   - Redirect a /franchisee/openings/proj_test_001/categories/cat_002/compare
   - Muestra 1 presupuesto
   - Estadísticas:
     * Presupuestos recibidos: 1
     * Mejor oferta: €11,200
     * Ahorro potencial: +6.7%
   - Único presupuesto tiene badge "Mejor precio" automáticamente
   - Botón "Adjudicar" disponible
```

### 13. Categoría Sin Presupuestos
```bash
Si una categoría no tiene presupuestos recibidos:
1. Acceder a su URL de comparación
2. ESPERADO:
   - Muestra card con mensaje:
     * Icono de documento (gris)
     * "No hay presupuestos recibidos"
     * "Aún no se han recibido presupuestos para esta categoría"
   - No muestra tabla
   - Botón "Volver" disponible
```

## Validaciones Frontend

### Comparación de Presupuestos
```bash
VALIDACIÓN 1: Solo presupuestos submitted o awarded
- No se muestran borradores (status: 'draft')
- Solo se muestran presupuestos enviados finales

VALIDACIÓN 2: Ordenamiento automático
- Presupuestos ordenados por importe ascendente
- El más barato siempre aparece primero

VALIDACIÓN 3: Identificación del mejor precio
- Badge "Mejor precio" solo en el presupuesto de menor importe
- Fondo verde claro en esa fila

VALIDACIÓN 4: Adjudicación única
- Solo se puede adjudicar 1 presupuesto por categoría
- Una vez adjudicado, el botón desaparece de todos
- Los demás se marcan como "Rechazado" automáticamente

VALIDACIÓN 5: Cálculo de ahorro
- Porcentaje correcto vs presupuesto estimado
- Flecha ↓ verde si ahorra (precio < estimado)
- Flecha ↑ roja si excede (precio > estimado)
- Color correcto del texto

VALIDACIÓN 6: Formato de moneda
- Formato español con símbolo €
- 2 decimales siempre
- Separador de miles con punto
- Ejemplo: €32,500.00
```

### Adjudicación
```bash
VALIDACIÓN 1: Diálogo de confirmación
- Siempre se muestra antes de adjudicar
- Muestra datos correctos del presupuesto
- Permite cancelar sin cambios

VALIDACIÓN 2: Estados posteriores
- Quote adjudicado: status = 'awarded'
- Otros quotes: status = 'rejected'
- Cambios reflejados inmediatamente

VALIDACIÓN 3: Botones deshabilitados
- Mientras isAwarding = true, botones disabled
- Texto cambia a "Adjudicando..."
```

## Endpoints Utilizados (Mock)

### GET `/api/franchisee/openings/categories/:categoryId/compare`
**Mock Response:**
```json
{
  "success": true,
  "data": {
    "category_id": "cat_001",
    "category_name": "Mobiliario Comercial",
    "category_description": "Estanterías, mostradores...",
    "budget_estimate": 3500000,
    "quotes": [
      {
        "id": "quote_001",
        "supplier": {
          "id": "supplier_001",
          "name": "Mobiliario Retail S.L.",
          "email": "contacto@mobiliario.com",
          "phone": "+34 600 111 222"
        },
        "amount": 3250000,
        "delivery_days": 30,
        "warranty_months": 24,
        "payment_terms": "50% anticipo, 50% a la entrega",
        "notes": "Incluye instalación",
        "pdf_url": "https://mock-storage.com/quotes/quote_001.pdf",
        "status": "submitted",
        "submitted_at": "2026-01-20T10:00:00Z"
      }
    ],
    "quotes_count": 2,
    "lowest_amount": 3250000,
    "highest_amount": 3480000
  }
}
```

### POST `/api/franchisee/openings/quotes/:quoteId/award`
**Mock Request:** (no body)

**Mock Response:**
```json
{
  "success": true,
  "data": {
    "quote": {
      "id": "quote_001",
      "status": "awarded",
      "awarded_at": "2026-01-26T11:00:00Z"
    },
    "other_quotes_updated": 1
  },
  "message": "Presupuesto adjudicado exitosamente"
}
```

## Casos de Error

### Error 1: Categoría no encontrada
```bash
Acceder a URL con categoryId inválido
ESPERADO:
- Toast error: "No se pudo cargar la comparación"
- Mensaje: "No se encontró información"
- Botón "Volver"
```

### Error 2: No hay presupuestos
```bash
Categoría existe pero sin presupuestos
ESPERADO:
- Card con icono y mensaje
- "No hay presupuestos recibidos"
- No muestra tabla vacía
```

### Error 3: Error al adjudicar
```bash
Simular error en backend (modificar mock temporalmente)
ESPERADO:
- Toast error: "No se pudo adjudicar el presupuesto"
- Estado no cambia
- Diálogo se cierra
- Usuario puede reintentar
```

## Flujo Completo de Prueba

```bash
ESCENARIO COMPLETO:
1. Login como franchisee@test.com
2. Ir a proyecto "Nueva apertura - Calle Carmen 50"
3. Ver 3 categorías con presupuestos
4. Comparar categoría "Mobiliario":
   - Ver 2 presupuestos
   - Identificar mejor precio (€32,500)
   - Ver estadísticas correctas
5. Adjudicar el presupuesto más barato:
   - Confirmar en diálogo
   - Ver toast de éxito
   - Ver cambio de estados
6. Comparar categoría "Rotulación":
   - Ver 1 presupuesto
   - Adjudicar el único disponible
7. Volver al proyecto:
   - Ver que 2 categorías tienen presupuesto adjudicado
   - 1 categoría pendiente (Equipamiento IT)
8. Completar adjudicación del proyecto adjudicando las 3 categorías

TIEMPO ESTIMADO: 10-15 minutos
```

## Notas Técnicas

### Persistencia de Datos (Mock)
- Los estados de adjudicación se guardan en `sessionStorage`
- Persisten durante la sesión del navegador
- Se pierden al cerrar la pestaña
- Para resetear: `sessionStorage.clear()` en consola

### Componentes Principales
- `QuotesComparisonTable.tsx` - Tabla de comparación
- `page.tsx` (compare) - Página de comparación
- `openings-client.ts` - Funciones `compareQuotes()` y `awardQuote()`

### Mock Data
- Archivo: `src/lib/api/openings-mock.ts`
- Arrays: `mockQuotes`, `mockCategories`
- Se puede modificar para crear escenarios de testing específicos

## Troubleshooting

**Problema:** No veo presupuestos en la comparación
- **Solución:** Verificar que los suppliers hayan enviado quotes con `status: 'submitted'`

**Problema:** No puedo adjudicar
- **Solución:** Verificar que no haya otro quote con `status: 'awarded'` en la misma categoría

**Problema:** Los cambios no persisten
- **Solución:** Verificar que `NEXT_PUBLIC_MOCK_OPENINGS=true` en `.env`

**Problema:** Error "Category not found"
- **Solución:** Verificar que el `categoryId` existe en `mockCategories`

---

**¡Testing completo de la funcionalidad de Comparación de Presupuestos! 🎯**
