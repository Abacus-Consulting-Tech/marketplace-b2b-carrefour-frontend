# Módulo 12: Franchisee Management (CRUD de Franquiciados - Admin)

## Estado
✅ **Completado** - Frontend funcional con mock data (25/08/2026)

## Descripción
Sistema completo de gestión de franquiciados desde el panel de administración. Permite a los administradores crear, editar, activar/desactivar franquiciados, y ver sus estadísticas de compra.

## Documentos Backend
- [FRANCHISEE_MANAGEMENT_BACKEND.md](FRANCHISEE_MANAGEMENT_BACKEND.md) - Especificaciones completas para backend

## Resumen Técnico

### Frontend Implementado
- **10 archivos** creados (~2,511 líneas de código)
- **CRUD completo**: Listar, Crear, Editar, Ver detalle, Activar/Desactivar
- **Estadísticas**: Total comprado, frecuencia de pedidos, productos favoritos
- **Gestión de permisos**: Activar/desactivar cuentas

### Features Principales
1. **Lista de franquiciados**
   - Vista de todos los franquiciados registrados
   - Filtros por estado (activo/inactivo)
   - Búsqueda por nombre, email, empresa
   - Estadísticas globales (total, activos, inactivos)
   - Paginación y ordenamiento

2. **Formulario de franquiciado**
   - Datos de contacto (nombre, email, teléfono)
   - Información empresarial (empresa, CIF)
   - Dirección principal
   - Usuario asociado (email, contraseña)
   - Estado (activo/inactivo)
   - Modo crear y editar

3. **Vista de detalle**
   - Información completa del franquiciado
   - Estadísticas de pedidos
   - Historial de actividad
   - Productos más comprados
   - Tiendas asignadas
   - Acciones administrativas (editar, desactivar, eliminar)

4. **Gestión de permisos**
   - Activar/desactivar cuenta
   - Límites de crédito (futuro)
   - Descuentos especiales (futuro)
   - Categorías permitidas (futuro)

## Archivos Frontend

### Páginas (35 líneas)
```
src/app/(backoffice)/admin/franchisees/
├── page.tsx (10 líneas) - Lista
├── [id]/page.tsx (15 líneas) - Detalle
├── [id]/edit/page.tsx - Editar
└── new/page.tsx (10 líneas) - Crear
```

### Componentes (1,511 líneas)
```
src/components/admin/
├── FranchiseesList.tsx (454 líneas) - Lista con filtros
├── FranchiseeForm.tsx (543 líneas) - Formulario CRUD
├── FranchiseeDetail.tsx (446 líneas) - Vista detallada
└── FranchiseeStatusBadge.tsx (68 líneas) - Badge de estado
```

### API & Types (965 líneas)
```
src/lib/api/franchisees-client.ts (632 líneas)
src/types/franchisees.ts (333 líneas)
```

## Endpoints API Necesarios

### 1. Listar Franquiciados
```http
GET /admin/franchisees
Authorization: Bearer {token}

Query Params:
- status?: 'active' | 'inactive'
- search?: string
- page?: number
- limit?: number

Response 200:
{
  "franchisees": [
    {
      "id": "fran_xxx",
      "first_name": "Juan",
      "last_name": "Pérez",
      "email": "juan@franquicia.com",
      "phone": "+34 600 123 456",
      "company_name": "Carrefour Express Madrid Centro",
      "tax_id": "B12345678",
      "status": "active",
      "address": {
        "street": "Calle Mayor 1",
        "city": "Madrid",
        "postal_code": "28001",
        "country": "ES"
      },
      "user_id": "user_xxx",
      "created_at": "2026-01-15T10:00:00Z",
      "stats": {
        "total_orders": 45,
        "total_spent": 12500.50,
        "last_order_date": "2026-08-20T14:30:00Z"
      }
    }
  ],
  "count": 120,
  "limit": 20,
  "offset": 0
}
```

### 2. Obtener Detalle de Franquiciado
```http
GET /admin/franchisees/:id
Authorization: Bearer {token}

Response 200:
{
  "franchisee": {
    ...datos completos del franquiciado,
    "stores": [
      {
        "id": "store_xxx",
        "name": "Madrid Centro",
        "address": {...}
      }
    ],
    "recent_orders": [...],
    "favorite_products": [...]
  }
}
```

### 3. Crear Franquiciado
```http
POST /admin/franchisees
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "first_name": "María",
  "last_name": "González",
  "email": "maria@nuevafranquicia.com",
  "phone": "+34 600 987 654",
  "company_name": "Carrefour Express Barcelona",
  "tax_id": "B98765432",
  "address": {
    "street": "Paseo de Gracia 100",
    "city": "Barcelona",
    "postal_code": "08008",
    "country": "ES"
  },
  "user": {
    "email": "maria@nuevafranquicia.com",
    "password": "SecurePass123!"
  },
  "status": "active"
}

Response 201:
{
  "franchisee": { ...franquiciado creado },
  "user": { ...usuario creado }
}
```

### 4. Actualizar Franquiciado
```http
PATCH /admin/franchisees/:id
Authorization: Bearer {token}
Content-Type: application/json

Body: (campos a actualizar)
{
  "phone": "+34 600 111 222",
  "company_name": "Nuevo nombre"
}

Response 200:
{
  "franchisee": { ...franquiciado actualizado }
}
```

### 5. Cambiar Estado (Activar/Desactivar)
```http
PATCH /admin/franchisees/:id/status
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "status": "inactive",
  "reason": "Suspensión temporal por incumplimiento de pagos"
}

Response 200:
{
  "franchisee": {
    ...
    "status": "inactive",
    "status_updated_at": "2026-08-25T15:30:00Z"
  }
}
```

### 6. Obtener Estadísticas del Franquiciado
```http
GET /admin/franchisees/:id/stats
Authorization: Bearer {token}

Query Params:
- from?: ISO date (default: 30 days ago)
- to?: ISO date (default: now)

Response 200:
{
  "stats": {
    "total_orders": 45,
    "total_spent": 12500.50,
    "average_order_value": 277.79,
    "order_frequency_days": 7,
    "last_order_date": "2026-08-20T14:30:00Z",
    "favorite_products": [
      {
        "product_id": "prod_xxx",
        "title": "Polo Corporativo",
        "times_ordered": 12,
        "total_spent": 2200.00
      }
    ],
    "orders_by_month": [
      { "month": "2026-08", "count": 8, "total": 2100.00 },
      { "month": "2026-07", "count": 12, "total": 3400.00 }
    ]
  }
}
```

## Mock Data
- 5-10 franquiciados de prueba con diferentes estados
- Datos realistas (nombres, empresas, direcciones)
- Historial de pedidos vinculado
- Estadísticas calculadas

## Integración con Otros Módulos

### Con Pedidos (Orders):
- Vista de historial de pedidos del franquiciado
- Enlace directo a pedidos desde detalle de franquiciado
- Estadísticas basadas en pedidos reales

### Con Usuarios (Auth):
- Cada franquiciado tiene un usuario asociado
- Crear usuario automáticamente al crear franquiciado
- Sincronizar estado: franquiciado inactivo → usuario deshabilitado

### Con Tiendas (Stores):
- Asignar múltiples tiendas a un franquiciado
- Vista de tiendas en detalle de franquiciado

## Notas para Backend
1. **Validaciones**:
   - Email debe ser único
   - Tax ID (CIF) debe ser único
   - Validar formato de tax ID español (B12345678)
   - Validar formato de teléfono español

2. **Creación de Usuario**:
   - Al crear franquiciado, crear usuario asociado automáticamente
   - Rol del usuario: 'franchisee'
   - Email del usuario = email del franquiciado
   - Enviar email de bienvenida con credenciales

3. **Permisos**:
   - Solo admins pueden gestionar franquiciados
   - Franquiciados solo pueden ver su propio perfil (endpoint diferente)

4. **Soft Delete**:
   - No eliminar físicamente franquiciados
   - Marcar como `deleted_at` para auditoría
   - Pedidos históricos deben seguir vinculados

---

**Fecha de Completado**: 25 de Agosto de 2026  
**Desarrollador Frontend**: Frontend Team  
**Estado Backend**: Pendiente de implementación
