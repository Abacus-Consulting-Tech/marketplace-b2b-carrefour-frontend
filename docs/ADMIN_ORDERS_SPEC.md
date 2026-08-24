# Admin Orders - Especificación Técnica

**Módulo**: Admin Orders (Gestión Global de Pedidos)  
**Estado**: ⏳ Placeholder - Planificado para Fase 2  
**Prioridad**: Media (después de flujo E2E franquiciado)  
**Tiempo estimado**: 2-3 días de desarrollo  
**Fecha planificada**: Sprint 3 (Semanas 5-6)

---

## 📋 Propósito

Panel de administración para gestionar **TODOS los pedidos** de la plataforma Marketplace B2B Carrefour, con visibilidad completa de:
- Pedidos de todos los franquiciados
- Pedidos de todos los proveedores
- Estado global de la operación
- Resolución de incidencias
- Análisis y reportes

---

## 🎯 Diferencias con Otros Módulos

| Módulo | Usuario | Alcance | Estado |
|--------|---------|---------|--------|
| `/supplier/orders` | Proveedor | Solo pedidos de **MIS productos** | ✅ **COMPLETO** |
| `/marketplace/orders` | Franquiciado | Solo **MIS pedidos** | ❌ Planificado Sprint 2 |
| `/admin/orders` | Admin | **TODOS los pedidos** (global) | ⏳ Planificado Sprint 3 |

---

## 🏗️ Arquitectura Técnica

### **Archivos a Crear**

```
src/
├── types/
│   └── admin-orders.ts                    # Tipos TypeScript
├── lib/
│   └── api/
│       ├── admin-orders-mock.ts           # Mock data (10-15 pedidos cross-platform)
│       └── admin-orders-client.ts         # Cliente API dual-mode
├── components/
│   └── admin/
│       ├── AdminOrdersList.tsx            # Lista con filtros avanzados
│       ├── AdminOrderDetail.tsx           # Vista detallada
│       ├── AdminOrderFilters.tsx          # Panel de filtros
│       ├── AdminOrderExport.tsx           # Dialog de exportación
│       ├── AdminOrderMetrics.tsx          # Dashboard de métricas
│       └── AdminOrderTimeline.tsx         # Timeline de estado
└── app/
    └── (backoffice)/
        └── admin/
            └── orders/
                ├── page.tsx               # Lista (actualizar placeholder)
                └── [id]/
                    └── page.tsx           # Detalle (crear)
```

---

## 📊 Modelo de Datos

### **AdminOrder Interface**

```typescript
export interface AdminOrder {
  id: string;
  order_number: string;
  
  // Relaciones
  franchisee: {
    id: string;
    name: string;
    email: string;
    region: string;
  };
  supplier: {
    id: string;
    name: string;
    email: string;
  };
  
  // Items
  items: AdminOrderItem[];
  
  // Estado
  status: OrderStatus; // pending, confirmed, in_preparation, shipped, delivered, cancelled
  payment_status: 'pending' | 'paid' | 'failed';
  
  // Montos
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  
  // Direcciones
  shipping_address: Address;
  billing_address: Address;
  
  // Tracking
  tracking_number?: string;
  carrier?: string;
  
  // Incidencias
  has_issues: boolean;
  issue_description?: string;
  resolution_notes?: string;
  
  // Fechas
  created_at: string;
  confirmed_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  
  // Metadatos
  metadata?: {
    priority: 'normal' | 'urgent';
    internal_notes?: string;
  };
}

export interface AdminOrderItem {
  id: string;
  product_id: string;
  variant_id: string;
  title: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total: number;
  supplier_id: string;
}
```

---

## 🔌 API Endpoints

### **Mock Mode Endpoints**

```typescript
// src/lib/api/admin-orders-client.ts

export const adminOrdersApi = {
  // Listar pedidos con filtros
  listOrders(filters: AdminOrderFilters): Promise<ApiResponse<ListOrdersResponse>> {
    // Filtros:
    // - franchisee_id, supplier_id
    // - status, payment_status
    // - date_from, date_to
    // - has_issues
    // - search (order_number, franchisee_name)
    // - limit, offset (paginación)
  },
  
  // Obtener pedido por ID
  getOrder(id: string): Promise<ApiResponse<GetOrderResponse>> {
    // Incluye: items, addresses, timeline, notas
  },
  
  // Actualizar estado del pedido
  updateOrderStatus(id: string, status: OrderStatus, notes?: string): Promise<ApiResponse<UpdateOrderResponse>> {
    // Admin puede cambiar estados manualmente
  },
  
  // Marcar/resolver incidencia
  updateOrderIssue(id: string, update: IssueUpdate): Promise<ApiResponse<UpdateOrderResponse>> {
    // has_issues, issue_description, resolution_notes
  },
  
  // Exportar pedidos
  exportOrders(filters: AdminOrderFilters, format: 'csv' | 'excel'): Promise<ApiResponse<ExportResponse>> {
    // Mock: retorna URL de descarga (en real: genera archivo)
  },
  
  // Estadísticas globales
  getOrderStats(filters?: AdminOrderFilters): Promise<ApiResponse<OrderStatsResponse>> {
    // Total pedidos, revenue, promedio, pendientes, con incidencias
  },
  
  // Timeline de eventos
  getOrderTimeline(id: string): Promise<ApiResponse<OrderTimelineResponse>> {
    // Historial completo de cambios de estado
  },
};
```

### **Real Backend Endpoints**

```
GET    /admin/orders                      # Listar con filtros
GET    /admin/orders/:id                  # Detalle de pedido
PATCH  /admin/orders/:id/status           # Actualizar estado
PATCH  /admin/orders/:id/issue            # Gestionar incidencia
GET    /admin/orders/export               # Exportar (query params)
GET    /admin/orders/stats                # Estadísticas
GET    /admin/orders/:id/timeline         # Timeline de eventos
```

---

## 🎨 UI Components

### **1. Lista de Pedidos** (`AdminOrdersList.tsx`)

**Features:**
- Tabla/cards con todos los pedidos
- Filtros avanzados:
  - Por franquiciado (dropdown)
  - Por proveedor (dropdown)
  - Por estado (multi-select)
  - Por rango de fechas
  - Solo con incidencias (checkbox)
- Búsqueda por:
  - Número de pedido
  - Nombre franquiciado
- Ordenamiento:
  - Fecha (más reciente/antiguo)
  - Total (mayor/menor)
  - Estado
- Paginación (20 por página)
- Acciones bulk:
  - Exportar seleccionados
  - Marcar como revisado
- Badges de estado con colores
- Indicador visual de incidencias (⚠️)

**Mock Data Preview:**
```typescript
const mockAdminOrders: AdminOrder[] = [
  {
    id: 'adm_ord_001',
    order_number: 'ORD-2026-10001',
    franchisee: { id: 'fr_001', name: 'Carrefour Centro', email: 'centro@carrefour.es', region: 'Madrid' },
    supplier: { id: 'sup_uniformes', name: 'Uniformes Corp', email: 'contacto@uniformes.com' },
    items: [{ /* ... */ }],
    status: 'confirmed',
    payment_status: 'paid',
    total: 45678,
    has_issues: false,
    created_at: '2026-08-20T10:00:00Z',
  },
  {
    id: 'adm_ord_002',
    order_number: 'ORD-2026-10002',
    franchisee: { id: 'fr_002', name: 'Carrefour Norte', email: 'norte@carrefour.es', region: 'Barcelona' },
    supplier: { id: 'sup_limpieza', name: 'Limpieza Industrial', email: 'pedidos@limpieza.com' },
    items: [{ /* ... */ }],
    status: 'shipped',
    payment_status: 'paid',
    total: 23450,
    has_issues: true,
    issue_description: 'Producto dañado en tránsito',
    created_at: '2026-08-19T14:30:00Z',
  },
  // ... 10-15 pedidos más
];
```

---

### **2. Detalle de Pedido** (`AdminOrderDetail.tsx`)

**Secciones:**

**A. Header**
- Número de pedido
- Estado actual (badge grande)
- Badge de incidencia si aplica
- Botones: "Cambiar Estado", "Gestionar Incidencia", "Ver Timeline"

**B. Información de Participantes**
- Card Franquiciado:
  - Nombre, email, región
  - Link a perfil del franquiciado
  - Total de pedidos históricos
- Card Proveedor:
  - Nombre, email
  - Link a perfil del proveedor
  - Productos en este pedido

**C. Items del Pedido**
- Tabla de productos:
  - Imagen, título, SKU
  - Cantidad, precio unitario, total
  - Proveedor de cada item
  - Links a detalle de producto

**D. Montos y Pagos**
- Subtotal
- IVA
- Envío
- **Total**
- Estado de pago con badge

**E. Direcciones**
- Dirección de envío
- Dirección de facturación

**F. Tracking** (si disponible)
- Número de seguimiento
- Transportista
- Link de tracking

**G. Timeline de Estado**
- Línea temporal con todos los cambios:
  - Creado
  - Confirmado
  - En preparación
  - Enviado
  - Entregado
  - (Cancelado si aplica)
- Fechas y usuario que realizó cada cambio

**H. Incidencias** (si has_issues = true)
- Descripción de la incidencia
- Notas de resolución
- Estado (pendiente/resuelta)
- Botón "Resolver Incidencia"

---

### **3. Panel de Filtros** (`AdminOrderFilters.tsx`)

**Campos:**
```tsx
<AdminOrderFilters>
  {/* Filtros principales */}
  <Select label="Franquiciado" />
  <Select label="Proveedor" />
  <MultiSelect label="Estados" options={orderStatuses} />
  
  {/* Filtros de fecha */}
  <DateRangePicker label="Rango de fechas" />
  
  {/* Filtros adicionales */}
  <Checkbox label="Solo con incidencias" />
  <Select label="Estado de pago" />
  
  {/* Acciones */}
  <Button onClick={applyFilters}>Aplicar Filtros</Button>
  <Button variant="ghost" onClick={clearFilters}>Limpiar</Button>
</AdminOrderFilters>
```

---

### **4. Exportación** (`AdminOrderExport.tsx`)

**Dialog de exportación:**
- Seleccionar formato (CSV / Excel)
- Seleccionar campos a incluir (checkboxes)
- Aplicar filtros actuales o exportar todo
- Botón "Generar Exportación"
- En mock: simula descarga con setTimeout
- En real: llama a `/admin/orders/export`

---

### **5. Métricas** (`AdminOrderMetrics.tsx`)

**Cards de estadísticas:**
- **Total Pedidos**: Número total (con comparativa mes anterior)
- **Revenue Total**: Suma de todos los pedidos en €
- **Promedio por Pedido**: Revenue / Total pedidos
- **Pedidos Pendientes**: Count de pending + confirmed
- **Con Incidencias**: Count de has_issues = true
- **Tasa de Conversión**: % de pedidos completados vs totales

**Gráficos (opcional, Fase 3):**
- Pedidos por día (últimos 30 días)
- Revenue por semana
- Top 5 franquiciados
- Top 5 proveedores

---

## 🔐 Permisos y Roles

**Acceso:**
- ✅ **Admin**: Acceso completo (lectura + escritura)
- ❌ **Supplier**: Sin acceso (tienen su propio `/supplier/orders`)
- ❌ **Franchisee**: Sin acceso (tienen su propio `/marketplace/orders`)

**Acciones permitidas (Admin):**
- Ver todos los pedidos
- Filtrar y buscar
- Ver detalle completo
- Cambiar estado del pedido (override manual)
- Gestionar incidencias
- Exportar datos
- Ver timeline
- Añadir notas internas

---

## 📅 Plan de Implementación

### **Fase 1: Tipos y Mock Data** (3-4 horas)
- [ ] Crear `src/types/admin-orders.ts`
- [ ] Crear `src/lib/api/admin-orders-mock.ts` con 10-15 pedidos
- [ ] Mock incluye pedidos de diferentes franquiciados y proveedores
- [ ] Varios estados (pending, shipped, delivered, con incidencias)

### **Fase 2: API Client** (2-3 horas)
- [ ] Crear `src/lib/api/admin-orders-client.ts`
- [ ] Implementar 7 métodos con mock/real switching
- [ ] Añadir feature flag `orders-admin` en `feature-flags.ts`

### **Fase 3: Componentes Base** (1 día)
- [ ] `AdminOrdersList.tsx` - Lista básica
- [ ] `AdminOrderDetail.tsx` - Vista detallada
- [ ] `AdminOrderFilters.tsx` - Panel de filtros
- [ ] `OrderStatusBadge.tsx` - Reutilizar de supplier orders

### **Fase 4: Features Avanzadas** (1 día)
- [ ] Exportación (dialog + mock implementation)
- [ ] Gestión de incidencias (dialog)
- [ ] Timeline de estados
- [ ] Métricas dashboard
- [ ] Paginación

### **Fase 5: Páginas** (4-6 horas)
- [ ] Actualizar `/admin/orders/page.tsx` (reemplazar placeholder)
- [ ] Crear `/admin/orders/[id]/page.tsx`

### **Fase 6: Testing** (2-3 horas)
- [ ] Crear `TESTING_ADMIN_ORDERS.md`
- [ ] 50+ casos de prueba
- [ ] Probar filtros, búsqueda, exportación
- [ ] Probar incidencias y cambios de estado

---

## 🔄 Integración con Otros Módulos

### **Supplier Orders (ya existe)**
- Cuando supplier acepta/envía pedido → Se refleja en Admin Orders
- Timeline sincronizado

### **Franchisee Orders (Sprint 2)**
- Pedidos creados por franquiciados → Aparecen en Admin Orders
- Admin puede ver qué compró cada franquiciado

### **Product Management (ya existe)**
- Links desde items del pedido → Detalle del producto
- Admin puede verificar stock, precio, proveedor

### **Franchisee Management (Fase 2)**
- Link desde franquiciado en pedido → Perfil del franquiciado
- Admin ve historial de pedidos por franquiciado

---

## 📊 Casos de Uso Principales

### **UC1: Revisar Todos los Pedidos del Día**
1. Admin abre `/admin/orders`
2. Aplica filtro: "Hoy" en rango de fechas
3. Ve lista de todos los pedidos
4. Identifica pedidos con incidencias (badge rojo)
5. Revisa y resuelve

### **UC2: Buscar Pedido Específico**
1. Admin recibe llamada de franquiciado: "Mi pedido ORD-2026-10042"
2. Usa búsqueda: "10042"
3. Abre detalle del pedido
4. Ve estado actual, tracking, timeline
5. Informa al cliente

### **UC3: Resolver Incidencia**
1. Admin ve pedido con badge "⚠️ Incidencia"
2. Abre detalle
3. Lee: "Producto dañado en tránsito"
4. Click "Gestionar Incidencia"
5. Añade notas de resolución: "Reenvío programado para mañana"
6. Cambia estado a "in_preparation" (reenvío)
7. Marca incidencia como resuelta

### **UC4: Exportar Reporte Mensual**
1. Admin necesita reporte de agosto
2. Aplica filtros: 01/08 - 31/08
3. Click "Exportar"
4. Selecciona formato Excel
5. Selecciona campos: order_number, franchisee, total, status
6. Descarga archivo
7. Envía a gerencia

### **UC5: Cambiar Estado Manualmente**
1. Proveedor olvidó actualizar estado
2. Admin verifica que pedido fue entregado (llamada al franquiciado)
3. Abre detalle del pedido
4. Click "Cambiar Estado" → "Entregado"
5. Añade nota interna: "Confirmado por teléfono con franquiciado"
6. Estado actualizado, timeline reflejado

---

## 🎨 UI/UX Consideraciones

### **Diseño Visual**
- Consistente con resto de admin panel
- Colores de badge:
  - 🟡 Pending: Yellow
  - 🔵 Confirmed: Blue
  - 🟠 In Preparation: Orange
  - 🟣 Shipped: Purple
  - 🟢 Delivered: Green
  - 🔴 Cancelled: Red
  - ⚠️ Con incidencia: Red border + icon

### **Performance**
- Lazy loading en lista (paginación)
- Debounce en búsqueda (300ms)
- Cache de resultados en cliente (5 minutos)
- Loading states en todas las acciones

### **Accesibilidad**
- Labels claros en todos los filtros
- Keyboard navigation en tabla
- Screen reader friendly
- ARIA labels en badges

---

## 📚 Documentación Necesaria

1. **TESTING_ADMIN_ORDERS.md** - Guía de testing (50+ casos)
2. **API_ADMIN_ORDERS.md** - Documentación de endpoints
3. Actualizar **BACKEND_REQUIREMENTS.md** con endpoints necesarios
4. Actualizar **dev-tools** con nuevos endpoints

---

## 🚀 Próximos Pasos

**Cuándo implementar:**
- ✅ **Ahora**: Documentado (este archivo)
- ⏳ **Sprint 2**: Flujo franquiciado (crea pedidos reales)
- 🎯 **Sprint 3**: Implementar Admin Orders (con pedidos reales para gestionar)

**Prerrequisitos:**
- ✅ Supplier Orders completo (ya existe)
- ⏳ Franchisee Checkout completo (genera pedidos)
- ⏳ Backend implementa endpoints de admin orders

**Orden recomendado:**
1. Completar flujo franquiciado primero
2. Tener pedidos reales en el sistema
3. Implementar Admin Orders para gestionarlos
4. Mejora continua basada en feedback

---

**Documento creado**: 24 Agosto 2026  
**Autor**: Frontend Team  
**Estado**: Especificación completa - Lista para implementación en Fase 2  
**Referencias**: 
- `/supplier/orders` - Implementación similar ya completa
- `PROJECT_STATUS_AND_ROADMAP.md` - Roadmap general
- `SUPPLIER_ORDERS_IMPLEMENTATION.md` - Guía técnica de referencia
