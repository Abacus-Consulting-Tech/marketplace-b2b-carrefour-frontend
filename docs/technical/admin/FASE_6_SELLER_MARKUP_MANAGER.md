# Fase 6: SellerMarkupManager - Gestión de Markup Global

**Estado**: ✅ Completado  
**Modo**: Mock (Backend Ready: false)  
**Fecha**: 18 Agosto 2026

---

## 📋 Descripción General

El **SellerMarkupManager** permite a los administradores gestionar el markup global de cada proveedor, ver el historial de cambios y entender el impacto de las modificaciones en los productos.

### Características Implementadas

1. **Selector de Proveedor**
   - Vista de todos los proveedores con su markup actual
   - Búsqueda y selección intuitiva

2. **Panel de Markup Actual**
   - Visualización del markup global actual
   - Estadísticas de productos (total, aprobados, pendientes)
   - Formulario de actualización con validación

3. **Historial de Cambios**
   - Registro completo de modificaciones
   - Visualización de cambios con tendencias (↑ ↓ →)
   - Información de productos afectados
   - Motivo del cambio y responsable

4. **Validación y Seguridad**
   - Rango válido: 0% - 500%
   - Validación de cambios duplicados
   - Mensajes de confirmación y error claros

---

## 🗂️ Archivos Creados/Modificados

### Tipos (Types)

#### `src/types/products-pricing.ts`

**Nuevos tipos añadidos**:

```typescript
// Historial de cambios de markup
export interface SellerMarkupHistory {
  id: string;
  seller_id: string;
  previous_markup: number;
  new_markup: number;
  changed_by: string;
  changed_at: string;
  reason?: string;
  affected_products_count: number;
}

// Request para obtener historial
export interface GetSellerMarkupHistoryRequest {
  seller_id: string;
  limit?: number;
  offset?: number;
}

// Response con historial y datos del seller
export interface GetSellerMarkupHistoryResponse {
  history: SellerMarkupHistory[];
  total: number;
  seller: Seller;
}
```

**Tipos actualizados**:

```typescript
// UpdateSellerMarkupRequest ahora incluye reason opcional
export interface UpdateSellerMarkupRequest {
  global_markup_percentage: number;
  reason?: string; // ⬅️ NUEVO
}
```

---

### API Client

#### `src/lib/api/products-pricing-client.ts`

**Nuevo método**:

```typescript
async getSellerMarkupHistory(
  request: GetSellerMarkupHistoryRequest
): Promise<ApiResponse<GetSellerMarkupHistoryResponse>>
```

**Endpoint**: `GET /admin/custom/sellers/:id/markup/history`

**Parámetros**:
- `seller_id` (required): ID del proveedor
- `limit` (optional): Número de registros (default: 10)
- `offset` (optional): Paginación (default: 0)

**Método actualizado**:

```typescript
// Ahora acepta UpdateSellerMarkupRequest completo (con reason)
async updateSellerMarkup(
  sellerId: string,
  request: UpdateSellerMarkupRequest
)
```

---

### Mock Data

#### `src/lib/api/products-pricing-mock.ts`

**Mock data de historial**:

```typescript
export const mockSellerMarkupHistory: SellerMarkupHistory[] = [
  {
    id: 'history_001',
    seller_id: 'sel_uniformes_corp',
    previous_markup: 10,
    new_markup: 8,
    changed_by: 'admin@carrefour.dev',
    changed_at: '2026-08-15T14:30:00Z',
    reason: 'Ajuste según acuerdo comercial Q3',
    affected_products_count: 35,
  },
  // ... 4 registros más
];
```

**Funciones mock actualizadas**:

```typescript
// Ahora guarda el cambio en el historial
export async function mockUpdateSellerMarkup(
  sellerId: string,
  markup: number,
  reason?: string
)

// Nueva función para obtener historial
export async function mockGetSellerMarkupHistory(
  request: GetSellerMarkupHistoryRequest
)
```

**Store mutable**:

```typescript
let mockSellerMarkupHistoryStore = [...mockSellerMarkupHistory];
```

---

### Componente UI

#### `src/app/(backoffice)/admin/pricing/markup/page.tsx`

**Nuevo componente completo** (600+ líneas)

##### Estructura de Tabs:

1. **Markup Actual**:
   - 4 Cards de estadísticas (Markup, Total Productos, Aprobados, Pendientes)
   - Formulario de actualización con validación
   - Input numérico (0-500%)
   - Textarea para motivo opcional
   - Badge de cambio en tiempo real

2. **Historial**:
   - Tabla con columnas:
     - Fecha (con icono)
     - Cambio (con tendencia y badge de diferencia)
     - Productos afectados (con icono)
     - Motivo
     - Modificado por
   - Ordenado por fecha descendente
   - Paginación (20 registros)

##### Características UI:

- Selector de proveedor con badges de markup
- Validación en tiempo real
- Alertas de éxito/error
- Estado vacío cuando no hay historial
- Loading states
- Iconos de Lucide React:
  - `TrendingUp` (↑ aumento)
  - `TrendingDown` (↓ reducción)
  - `Minus` (→ sin cambio)
  - `Package`, `Calendar`, `User`, `History`, etc.

##### Lógica de Estado:

```typescript
const [sellers, setSellers] = useState<Seller[]>([]);
const [selectedSellerId, setSelectedSellerId] = useState<string>('');
const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
const [markupHistory, setMarkupHistory] = useState<SellerMarkupHistory[]>([]);
const [newMarkup, setNewMarkup] = useState<string>('');
const [reason, setReason] = useState<string>('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [success, setSuccess] = useState<string | null>(null);
```

##### Validaciones:

- Markup entre 0% y 500%
- No permitir guardar sin cambios
- Selector de proveedor requerido
- Reason opcional pero guardado en historial

---

### Navegación

#### `src/app/(backoffice)/layout.tsx`

**Link añadido al sidebar**:

```tsx
<a href="/admin/pricing/markup" className="...">
  💰 Markup Global
</a>
```

**Posición**: Entre "Productos" y "Pedidos"

---

## 🧪 Testing

### Probar en Modo Mock

1. **Acceder a la página**:
   ```
   http://localhost:3000/admin/pricing/markup
   ```

2. **Flujo de prueba**:
   
   a. **Seleccionar proveedor**:
   - Elige "Uniformes Corp" (markup actual: 8%)
   - Verifica estadísticas:
     - Total productos: 45
     - Aprobados: 38
     - Pendientes: 4

   b. **Ver historial**:
   - Cambia a tab "Historial"
   - Verifica 2 cambios registrados:
     - 10% → 8% (15 ago, 35 productos)
     - 12% → 10% (10 jul, 28 productos)

   c. **Actualizar markup**:
   - Tab "Markup Actual"
   - Cambia de 8% a 12%
   - Añade motivo: "Ajuste por inflación Q3"
   - Guarda cambios
   - Verifica mensaje de éxito: "Markup global actualizado a 12%. X productos afectados"

   d. **Verificar historial actualizado**:
   - Tab "Historial"
   - Verifica nuevo registro en primera posición:
     - 8% → 12% (hoy)
     - Badge rojo: +4.00%
     - Icono ↑ (TrendingUp)
     - Motivo: "Ajuste por inflación Q3"

3. **Probar otros proveedores**:
   - Tech Supplies (12%)
   - Food Distributor (5%)
   - Office Supplies (15%)

### Casos Edge

✅ **Validación de rango**:
- Intenta markup = -5% → Error: "debe estar entre 0% y 500%"
- Intenta markup = 600% → Error: "debe estar entre 0% y 500%"

✅ **Sin cambios**:
- Deja el mismo markup → Error: "nuevo markup es igual al actual"

✅ **Motivo vacío**:
- Guardar sin motivo → Se guarda como "Actualización manual"

✅ **Estado vacío**:
- Proveedor sin historial → Mensaje: "No hay cambios registrados aún"

---

## 🔄 Flujo de Datos (Mock Mode)

```
1. Usuario selecciona proveedor
   ↓
2. GET /admin/custom/sellers/:id/markup
   ↓ 
3. mockGetSellerMarkup() → { seller_id, global_markup_percentage }
   ↓
4. GET /admin/custom/sellers/:id/markup/history
   ↓
5. mockGetSellerMarkupHistory() → { history[], total, seller }
   ↓
6. Renderiza datos en UI
   ↓
7. Usuario actualiza markup
   ↓
8. PATCH /admin/custom/sellers/:id/markup
   Body: { global_markup_percentage, reason? }
   ↓
9. mockUpdateSellerMarkup()
   - Actualiza mockSellersStore
   - Cuenta productos afectados (markup_percentage = null)
   - Añade registro a mockSellerMarkupHistoryStore
   ↓
10. Respuesta: { seller_markup, affected_products, message }
    ↓
11. Recarga sellers y history
    ↓
12. Muestra mensaje de éxito
```

---

## 📊 Estadísticas de Implementación

- **Líneas de código**: ~850
- **Componentes**: 1 (SellerMarkupManagerPage)
- **Tipos nuevos**: 3 (SellerMarkupHistory, GetSellerMarkupHistoryRequest/Response)
- **Métodos API**: 2 (getSellerMarkupHistory, updateSellerMarkup actualizado)
- **Mock functions**: 2 (mockGetSellerMarkupHistory, mockUpdateSellerMarkup actualizado)
- **Mock data**: 5 registros de historial
- **Iconos Lucide**: 12
- **shadcn/ui componentes**: 10 (Card, Button, Input, Select, Table, Tabs, Badge, Alert, Label, Textarea)

---

## 🚀 Próximos Pasos (Fase 7-9)

### Fase 7: Cola de Aprobación de Precios
- Página admin para aprobar productos con markup específico
- Vista de productos pendientes
- Acciones: Aprobar con markup / Rechazar con motivo
- Filtros por proveedor, categoría

### Fase 8: Vista de Proveedores - Mis Productos
- Dashboard para proveedores
- Ver productos propios (todos los estados)
- Ver markup global actual
- Proponer nuevos productos (formulario manual)

### Fase 9: Carga Masiva CSV
- Subir archivo Excel/CSV con productos
- Parser y validación
- Vista previa de datos
- Importación masiva
- Reporte de éxitos/errores

---

## 🐛 Backend Pendiente (Real Mode)

Cuando el backend implemente los endpoints:

1. **Cambiar feature flag**:
   ```env
   NEXT_PUBLIC_MOCK_PRICING=false
   ```

2. **Verificar endpoints**:
   - `GET /admin/custom/sellers/:id/markup/history`
   - `PATCH /admin/custom/sellers/:id/markup` (con reason opcional)

3. **Validar respuestas**:
   ```typescript
   // Response esperada de history
   {
     data: {
       history: SellerMarkupHistory[],
       total: number,
       seller: Seller
     }
   }
   
   // Response esperada de update
   {
     data: {
       seller_markup: SellerMarkup,
       affected_products: number,
       message: string
     }
   }
   ```

---

## 📝 Notas de Implementación

- ✅ **Responsivo**: Grid adaptable en stats cards
- ✅ **Accesibilidad**: Labels con for, required markers
- ✅ **Loading states**: Disabled durante operaciones
- ✅ **Error handling**: Try/catch en todas las async
- ✅ **Formato español**: Fechas en dd mmm yyyy HH:mm
- ✅ **Validación client-side**: Min/max en inputs
- ✅ **UX**: Confirmación visual de cambios con badges
- ✅ **Historial persistente**: Se guarda en mockStore
- ✅ **Auto-reload**: Datos se recargan después de update

---

## 🎨 Capturas de Pantalla Sugeridas

Para documentación:

1. Vista general con selector de proveedor
2. Tab "Markup Actual" con stats cards y formulario
3. Tab "Historial" con tabla completa
4. Formulario con validación de error
5. Mensaje de éxito después de actualizar
6. Badge de cambio en tiempo real
7. Tendencias en historial (↑ ↓ →)

---

**Desarrollado por**: GitHub Copilot  
**Fecha**: 18 Agosto 2026  
**Versión**: 1.0.0
