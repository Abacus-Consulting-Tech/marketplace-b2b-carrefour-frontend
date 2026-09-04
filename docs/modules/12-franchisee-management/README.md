# Módulo 12: Franchisee Management (CRUD de Franquiciados - Admin)

## Estado
⚠️ **Frontend completado, backend parcial en DEV** - contrato admin migrado a `/admin/franchisees*`, con validación parcial en 04/09/2026

## Descripción
Sistema completo de gestión de franquiciados desde el panel de administración. Permite a los administradores crear, editar, activar/desactivar franquiciados, y ver sus estadísticas de compra.

## Documentos Backend
- [FRANCHISEE_MANAGEMENT_BACKEND.md](FRANCHISEE_MANAGEMENT_BACKEND.md) - Guía API actualizada con rutas actuales, nuevas y legacy; bodies reales; y estado `working` / `broken` / `untested`
- [FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md](FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md) - Flujo funcional del alta de franquiciado y contrato esperado del onboarding público

## Nota de vigencia

Este módulo ya no puede describirse solo como un CRUD admin clásico.

Situación real a 04/09/2026:

- el frontend admin principal consume `/admin/franchisees*`
- `GET /admin/franchisees` y `GET /admin/franchisees/:id/stats` ya se validaron en DEV
- el cambio de estado sigue saliendo por `/admin/franchisees/:id/status`
- el onboarding público ya documenta `/admin/franchisees/invitations` y `/franchisee/register`
- `Mis tiendas` ya usa `/franchisee/stores*`
- el checkout del franquiciado ya lee direcciones reales por `GET /store/customers/me`
- `POST /store/customers/me/addresses` sigue bloqueado por `401 Unauthorized` en DEV

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

Este README resume el módulo. La referencia canónica de endpoints, bodies y estado validado está ahora en [FRANCHISEE_MANAGEMENT_BACKEND.md](FRANCHISEE_MANAGEMENT_BACKEND.md).

## ⚠️ Realidad validada en DEV (2026-09-04)

- Este README ya no debe usarse como contrato detallado de endpoints.
- El contrato admin canónico validado para este módulo es `/admin/franchisees*`.
- La referencia actual para backend es [FRANCHISEE_MANAGEMENT_BACKEND.md](FRANCHISEE_MANAGEMENT_BACKEND.md).
- La referencia funcional de onboarding y handoff a backend es [FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md](FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md).
- El principal gap abierto ya no es `/admin/customers`, sino la validación pendiente de varias rutas `untested` y el `401` en `POST /store/customers/me/addresses`.

## Estado operativo en DEV

- `GET /admin/franchisees` → `working`
- `GET /admin/franchisees/:id/stats` → `working`
- `GET /admin/franchisees/:id` → `untested`
- `PATCH /admin/franchisees/:id` → `untested`
- `PATCH /admin/franchisees/:id/status` → `untested`
- `GET /franchisee/stores` / `POST /franchisee/stores` / `DELETE /franchisee/stores/:id` → contrato confirmado, smoke autenticado pendiente
- `GET /store/customers/me` → `working`
- `POST /store/customers/me/addresses` → `broken` (`401 Unauthorized`)

## Integración con Otros Módulos

### Con Pedidos (Orders)
- Vista de historial de pedidos del franquiciado
- Enlace directo a pedidos desde detalle de franquiciado
- Estadísticas basadas en pedidos reales

### Con Usuarios (Auth)
- Cada franquiciado tiene un usuario asociado
- La activación de credenciales sigue pendiente de contrato final backend
- Franquiciado inactivo no debe poder operar como usuario activo

### Con Tiendas (Stores)
- El autoservicio usa `/franchisee/stores*`
- La edición administrativa de tiendas o direcciones sigue pendiente de ruta backend confirmada

## Notas para Backend
1. Validaciones mínimas: email único, tax ID único, formato de tax ID y teléfono coherentes.
2. Mantener `snake_case` y evitar volver a contratos `customers` para este módulo.
3. Si billing aplica, `PATCH /admin/franchisees/:id/status` no debe activar sin `subscription_status: active`.
4. Definir el mecanismo final de activación de credenciales y el contrato de facturas.
5. Para el detalle completo del handoff, usar [FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md](FRANCHISEE_REGISTRATION_FLOW_GUIDE_ES.md) y [FRANCHISEE_MANAGEMENT_BACKEND.md](FRANCHISEE_MANAGEMENT_BACKEND.md).

---

**Fecha de sincronización**: 04 de Septiembre de 2026  
**Desarrollador Frontend**: Frontend Team  
**Estado Backend**: Parcial en DEV; contrato admin canónico ya alineado
