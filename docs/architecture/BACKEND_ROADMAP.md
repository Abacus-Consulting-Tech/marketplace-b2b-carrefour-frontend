# Backend Implementation Roadmap

**Fecha**: 22 de Agosto de 2026  
**Audiencia**: Equipo Backend  
**Propósito**: Plan de implementación de endpoints para soportar módulos frontend

---

## 📊 Estado Actual

### Frontend Módulos Completos (esperando backend):
1. ✅ **Openings** - Gestión de aperturas de franquicias
2. ✅ **Categories** - Gestión de categorías de productos
3. ✅ **Supplier Orders** - Gestión de pedidos del proveedor
4. ✅ **Product Pricing/Approval** - Cola de aprobación de productos

### Frontend con Placeholder (requiere desarrollo):
1. ⏳ **Quotes** - Sistema de presupuestos (página placeholder, ~2 días desarrollo)
2. ⏳ **Product Management** - CRUD de productos admin (placeholder, ~4 días desarrollo)
3. ⏳ **Franchisee Management** - CRUD de franquiciados (placeholder, ~4 días desarrollo)

### Frontend funcionando con Mock Data:
- Todos los módulos tienen datos mock para desarrollo
- Feature flags permiten cambio instantáneo mock → real
- Contratos de API ya definidos en TypeScript

---

## 🎯 Prioridades de Implementación

### PRIORIDAD 1 - Flujo E2E Crítico (2-3 semanas)

#### 1. Catálogo de Productos (Store API)
**Endpoints necesarios:**
```
GET    /store/products
GET    /store/products/:id
GET    /store/products?region_id=...&category_id=...
```

**Campos requeridos:**
- id, name, description, sku
- price, currency
- stock, images[]
- category_id, supplier_id
- offer_id, variant_id (para Mercur cart)

**Tiempo estimado**: 2-3 días

---

#### 2. Carrito de Compra (Store API)
**Endpoints necesarios:**
```
POST   /store/carts
GET    /store/carts/:id
POST   /store/carts/:id/line-items
PATCH  /store/carts/:id/line-items/:itemId
DELETE /store/carts/:id/line-items/:itemId
POST   /store/carts/:id/shipping-address
POST   /store/carts/:id/complete
```

**Tiempo estimado**: 3-4 días

---

#### 3. Pedidos Franquiciado (Store API)
**Endpoints necesarios:**
```
GET    /store/orders
GET    /store/orders/:id
POST   /store/orders/:id/cancel
```

**Tiempo estimado**: 2 días

---

### PRIORIDAD 2 - Gestión Proveedor (2-3 semanas)

#### 4. Pedidos Recibidos por Proveedor (Vendor API)
**Endpoints necesarios:**
```
GET    /vendor/orders
GET    /vendor/orders/:id
POST   /vendor/orders/:id/accept
POST   /vendor/orders/:id/reject
PATCH  /vendor/orders/:id/status
POST   /vendor/orders/:id/tracking
GET    /vendor/orders/stats
```

**Estados**: pending → confirmed → in_preparation → shipped → delivered

**Tiempo estimado**: 3-4 días

---

#### 5. Productos del Proveedor (Vendor API)
**Endpoints necesarios:**
```
GET    /vendor/products
GET    /vendor/products/:id
POST   /vendor/products
PATCH  /vendor/products/:id
DELETE /vendor/products/:id
PATCH  /vendor/products/:id/stock
POST   /vendor/products/:id/images
```

**Estados**: draft → pending_approval → approved → rejected

**Tiempo estimado**: 4-5 días

---

### PRIORIDAD 3 - Gestión Admin (3-4 semanas)

#### 6. Aperturas de Franquicias (Admin API)
**Endpoints necesarios:**
```
GET    /admin/openings
GET    /admin/openings/:id
POST   /admin/openings
PATCH  /admin/openings/:id
DELETE /admin/openings/:id
PATCH  /admin/openings/:id/status
```

**Estados**: draft → submitted → under_review → approved → rejected → in_progress → completed

**Tiempo estimado**: 3-4 días

---

#### 7. Categorías de Productos (Admin API)
**Endpoints necesarios:**
```
GET    /admin/categories
GET    /admin/categories/:id
POST   /admin/categories
PATCH  /admin/categories/:id
DELETE /admin/categories/:id
PATCH  /admin/categories/:id/reorder
```

**Soporte jerarquía**: parent_id para sub-categorías

**Tiempo estimado**: 2-3 días

---

#### 8. Sistema de Presupuestos (Admin/Store API)

**¿Qué es?**  
Sistema para que franquiciados soliciten presupuestos personalizados a proveedores para productos especiales, grandes volúmenes o condiciones particulares.

**Caso de uso típico:**
1. Franquiciado necesita un producto que:
   - No está en catálogo estándar
   - Requiere personalización (ej: uniformes con logo específico)
   - Es pedido grande con precio negociable
   - Necesita condiciones especiales de entrega

2. Franquiciado envía solicitud con:
   - Descripción del producto
   - Cantidad deseada
   - Especificaciones/requisitos
   - Fecha límite de respuesta

3. Proveedor/Admin responde con:
   - Precio propuesto
   - Disponibilidad y plazo
   - Condiciones (mínimo pedido, etc.)

4. Franquiciado acepta o rechaza el presupuesto

**Endpoints necesarios:**
```
# Franquiciado
POST   /store/quotes                # Crear solicitud de presupuesto
GET    /store/quotes                # Ver mis solicitudes
GET    /store/quotes/:id            # Ver detalle de solicitud

# Admin/Proveedor
GET    /admin/quotes                # Ver todas las solicitudes recibidas
POST   /admin/quotes/:id/respond    # Responder con precio y condiciones
PATCH  /admin/quotes/:id/status     # Marcar como accepted/rejected
```

**Estados**: pending → responded → accepted → rejected

**Campos requeridos:**
- Solicitud: description, quantity, specifications, deadline, franchisee_id
- Respuesta: proposed_price, availability, delivery_time, conditions

**Tiempo estimado**: 3 días

---

#### 9. Aprobación de Productos (Admin API)
**Endpoints necesarios:**
```
GET    /admin/products/pending-approval
GET    /admin/products/:id
POST   /admin/products/:id/approve
POST   /admin/products/:id/reject
PATCH  /admin/products/:id/markup
GET    /admin/sellers/:id/markup
PATCH  /admin/sellers/:id/markup
```

**Tiempo estimado**: 3-4 días

---

#### 10. Gestión de Franquiciados (Admin API)
**Endpoints necesarios:**
```
GET    /admin/franchisees
GET    /admin/franchisees/:id
POST   /admin/franchisees
PATCH  /admin/franchisees/:id
DELETE /admin/franchisees/:id
GET    /admin/franchisees/:id/stores
POST   /admin/franchisees/:id/stores
DELETE /admin/franchisees/:id/stores/:storeId
GET    /admin/franchisees/:id/orders
GET    /admin/franchisees/:id/stats
PATCH  /admin/franchisees/:id/permissions
```

**Tiempo estimado**: 4-5 días

---

#### 11. Catálogo de Productos Admin (Admin API)
**Endpoints necesarios:**
```
GET    /admin/products
GET    /admin/products/:id
POST   /admin/products
PATCH  /admin/products/:id
DELETE /admin/products/:id
PATCH  /admin/products/:id/stock
POST   /admin/products/bulk-import
GET    /admin/products/export
```

**Tiempo estimado**: 4-5 días

---

### PRIORIDAD 4 - Features Adicionales (2-3 semanas)

#### 12. Sistema de Invitaciones
**Endpoints necesarios:**
```
POST   /admin/invitations
GET    /admin/invitations
POST   /admin/invitations/:id/resend
DELETE /admin/invitations/:id
POST   /invitations/:token/accept
```

**Tiempo estimado**: 2-3 días

---

#### 13. Dashboards y Estadísticas
**Endpoints necesarios:**
```
GET    /admin/dashboard/stats
GET    /admin/dashboard/recent-activity
GET    /vendor/dashboard/stats
GET    /vendor/dashboard/top-products
GET    /store/dashboard/stats
```

**Tiempo estimado**: 3-4 días

---

## 📋 Contratos de API

### Formato de Respuesta Estándar

**Success:**
```json
{
  "data": { ... },
  "message": "Success"
}
```

**Error:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

### Paginación
```
GET /resource?page=1&limit=20&sort=created_at&order=desc
```

**Response:**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

### Filtros
```
GET /products?category_id=1&supplier_id=2&min_price=10&max_price=100
```

---

## ⏱️ Estimación Total por Prioridad

| Prioridad | Módulos | Tiempo Estimado | Notas |
|-----------|---------|-----------------|-------|
| **P1** | Catálogo + Carrito + Pedidos Franchisee | 7-9 días | Crítico para MVP |
| **P2** | Pedidos Proveedor + Productos Proveedor | 7-9 días | Depende de P1 |
| **P3** | Openings + Categorías + Quotes* + Pricing + Franchisees* + Products* | 18-23 días | *Requiere frontend primero |
| **P4** | Invitaciones + Dashboards | 5-7 días | Nice to have |
| **TOTAL** | 11 módulos principales | **37-48 días** | Solo backend |

**Nota**: Módulos marcados con * (Quotes, Franchisees, Products) necesitan desarrollo frontend (~2-4 días cada uno) antes de integración backend.

**En calendario real** (considerando reuniones, reviews, bugs):
- **1 dev backend**: 9-12 semanas
- **2 devs backend**: 5-7 semanas

---

## 🚀 Plan de Integración Recomendado

### Fase 1 - MVP (Semanas 1-3)
1. ✅ Catálogo de productos
2. ✅ Carrito de compra
3. ✅ Pedidos franquiciado

**Resultado**: Flujo E2E completo (Franchisee puede comprar)

---

### Fase 2 - Proveedor (Semanas 4-6)
1. ✅ Pedidos recibidos por proveedor
2. ✅ Productos del proveedor

**Resultado**: Proveedor puede gestionar pedidos y productos

---

### Fase 3 - Admin (Semanas 7-10)
1. ✅ Openings
2. ✅ Categorías
3. ✅ Presupuestos
4. ✅ Aprobación de productos
5. ✅ Gestión de franquiciados
6. ✅ Catálogo admin

**Resultado**: Admin puede gestionar toda la plataforma

---

### Fase 4 - Polish (Semanas 11-12)
1. ✅ Invitaciones
2. ✅ Dashboards
3. ✅ Optimizaciones
4. ✅ Testing

**Resultado**: Sistema completo y optimizado

---

## 🔄 Proceso de Integración por Módulo

### Paso 1: Implementación Backend (su tiempo)
- Implementar endpoints según contrato
- Testing unitario backend
- Documentar en Swagger/Postman

### Paso 2: Validación de Contrato (1-2 horas)
- Frontend prueba endpoints reales
- Comparar JSON real vs mock
- Ajustar tipos TypeScript si necesario

### Paso 3: Feature Flag Switch (5 minutos)
```typescript
// En src/config/feature-flags.ts
orders: {
  useMock: false,  // Cambiar de true a false
  backendReady: true
}
```

### Paso 4: Testing Integrado (2-4 horas)
- Probar flujos completos
- Validar edge cases
- Corregir diferencias

### Paso 5: Deploy a Staging (1 hora)
- Deploy frontend + backend
- Smoke tests
- Validación QA

---

## 📦 Dependencias Tecnológicas

### Framework Backend
- **Medusa 2.x** / **MercurJS** (según decisión arquitectura)
- PostgreSQL para base de datos
- Redis para cache/sessions

### Autenticación
- JWT tokens
- Roles: admin, supplier, franchisee
- Permisos por endpoint

### Storage
- Imágenes de productos (S3 o similar)
- Archivos de importación/exportación

### Email
- Servicio para invitaciones
- Notificaciones de pedidos
- Confirmaciones

---

## 📞 Coordinación Frontend-Backend

### Canales de Comunicación
- **Bloqueantes**: Slack/Teams (respuesta < 2 horas)
- **Dudas de contrato**: Reunión sync 30 min
- **Reviews**: Pull Request comments

### Entregables por Módulo
1. ✅ Swagger/Postman collection actualizada
2. ✅ Endpoints funcionando en staging
3. ✅ Tests unitarios pasando
4. ✅ Documentación de campos/validaciones

### Definición de "Done"
- ✅ Endpoints implementados según contrato
- ✅ Tests unitarios escritos y pasando
- ✅ Documentación actualizada
- ✅ Deploy en staging
- ✅ Frontend probó y validó
- ✅ Feature flag activado
- ✅ QA aprobó

---

## 🎯 Métricas de Éxito

### Por Módulo
- ✅ Tiempo de respuesta < 500ms (p95)
- ✅ Error rate < 1%
- ✅ Test coverage > 70%
- ✅ Frontend integrado sin issues

### Global
- ✅ 11 módulos implementados
- ✅ Flujo E2E funcionando
- ✅ Performance aceptable
- ✅ 0 breaking changes post-integración

---

## 📝 Notas Importantes

1. **Todos los contratos** ya están definidos en tipos TypeScript del frontend
2. **Mock data** está disponible para referencia de estructura
3. **Feature flags** permiten rollback instantáneo si hay problemas
4. **No hay dependencias circulares** - cada módulo es independiente
5. **Validación temprana** - frontend puede probar cada endpoint en staging
6. **Módulos con placeholder**: Quotes, Product Management y Franchisee Management tienen página visual pero requieren desarrollo frontend (~2-4 días cada uno) antes de integración backend

---

**Documento mantenido por**: Frontend Team  
**Próxima actualización**: Post-reunión Lunes 25 Agosto  
**Contacto**: Ver canales de comunicación del equipo
