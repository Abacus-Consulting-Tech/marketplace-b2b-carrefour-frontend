# Backend Implementation Checklist

**Para:** Equipo Backend - Quick Reference  
**Fecha:** 21 Agosto 2026  
**Prioridad:** P0 - Crítico

---

## ✅ Sprint 1 - Autenticación + Pricing Module (5 días)

### Día 1: Fix Autenticación ❌ **BLOQUEANTE**

- [ ] **Fix 401 en `/admin/orders`**
  - [ ] Verificar JWT incluye `domain: 'admin'`
  - [ ] Confirmar `role: 'admin'` en token
  - [ ] Validar JWT_SECRET coincide frontend/backend
  - [ ] Probar: `Authorization: Bearer <token>` funciona

- [ ] **Fix 401 en `/admin/users/me`**
  - [ ] Same checks que `/admin/orders`
  - [ ] Test con token real de login

- [ ] **Validar login funcionan**
  - [ ] `POST /auth/user/emailpass` (admin) → 200 OK
  - [ ] `POST /auth/member/emailpass` (vendor) → 200 OK
  - [ ] Session cookies se establecen correctamente

**Output esperado:** Frontend puede acceder a `/admin/orders` sin 401

---

### Día 2: Crear Tablas + Seed Data

- [ ] **Migration 001: `custom_product_proposals`**
  ```sql
  CREATE TABLE custom_product_proposals (...)
  ```
  - [ ] Tabla creada con todos los campos
  - [ ] Constraints: CHECK, FOREIGN KEYS
  - [ ] Índices: 6 índices creados
  - [ ] Comentarios en columnas

- [ ] **Migration 002: Extend `sellers`**
  ```sql
  ALTER TABLE sellers ADD COLUMN global_markup_percentage
  ```
  - [ ] Columna añadida con default 10.00
  - [ ] Constraint CHECK (0-500)
  - [ ] Índice creado

- [ ] **Migration 003: `seller_markup_history`**
  ```sql
  CREATE TABLE seller_markup_history (...)
  ```
  - [ ] Tabla creada
  - [ ] Foreign keys configuradas
  - [ ] Índices creados

- [ ] **Seed Data**
  - [ ] 4 sellers insertados
  - [ ] 4 vendor members insertados
  - [ ] 10 product proposals (4 pending, 4 approved, 2 rejected)
  - [ ] 5 markup history entries
  - [ ] 2 admin users

**Output esperado:** DB tiene estructura completa con data de prueba

---

### Día 3: Implementar Servicios

- [ ] **ProductPricingService**
  - [ ] `getPendingProducts()` - Query con JOIN
  - [ ] `proposeProduct()` - INSERT con validaciones
  - [ ] `approveProduct()` - UPDATE + crear producto Medusa
  - [ ] `rejectProduct()` - UPDATE con reason
  - [ ] `getVendorProducts()` - Query filtrado por seller
  - [ ] Helper: `calculateFinalPrice()`
  - [ ] Helper: `validateProductInput()`

- [ ] **SellerMarkupService**
  - [ ] `getAllSellers()` - Query con stats agregadas
  - [ ] `getSellerMarkup()` - Query simple
  - [ ] `updateSellerMarkup()` - Transaction con history
  - [ ] `getMarkupHistory()` - Query paginado

**Output esperado:** Servicios probados con unit tests

---

### Día 4: Implementar Endpoints Admin

- [ ] **GET `/admin/custom/products/pending`**
  - [ ] Route creada
  - [ ] Query params: seller_id, category_id, limit, offset
  - [ ] Auth middleware
  - [ ] Test con Postman → 200 OK

- [ ] **PATCH `/admin/custom/products/:id/pricing-approval`**
  - [ ] Route creada
  - [ ] Body: status, markup_percentage OR rejection_reason
  - [ ] Aprobar → crea producto Medusa
  - [ ] Rechazar → guarda reason
  - [ ] Test con Postman → 200 OK

- [ ] **GET `/admin/custom/sellers`**
  - [ ] Route creada
  - [ ] Devuelve sellers con stats
  - [ ] Test → 200 OK

- [ ] **GET/PATCH `/admin/custom/sellers/:id/markup`**
  - [ ] GET route → devuelve markup actual
  - [ ] PATCH route → actualiza markup + inserta history
  - [ ] Test → 200 OK

- [ ] **GET `/admin/custom/sellers/:id/markup/history`**
  - [ ] Route creada
  - [ ] Paginación: limit, offset
  - [ ] Test → 200 OK

**Output esperado:** 6 endpoints admin funcionando

---

### Día 5: Implementar Endpoints Vendor + Testing

- [ ] **GET `/vendor/custom/products`**
  - [ ] Route creada
  - [ ] Filtra automáticamente por seller_id del usuario
  - [ ] Query param: status (optional)
  - [ ] Test con vendor token → 200 OK

- [ ] **POST `/vendor/custom/products`**
  - [ ] Route creada
  - [ ] Valida input
  - [ ] Soporta variantes (JSONB)
  - [ ] Rate limiting: max 10/min
  - [ ] Test → 201 Created

- [ ] **GET `/vendor/custom/sellers/me/markup`**
  - [ ] Route creada
  - [ ] Devuelve markup del seller autenticado
  - [ ] Test → 200 OK

- [ ] **Integration Testing**
  - [ ] Flujo completo: Vendor propone → Admin aprueba → Producto en catálogo
  - [ ] Flujo rechazo: Vendor propone → Admin rechaza → Reason guardado
  - [ ] Markup update: Admin cambia markup → History insertado → Affected count correcto

**Output esperado:** 3 endpoints vendor + flujos E2E probados

---

## 📊 Checklist de Validación

### Autenticación ✅
- [ ] Admin login → token válido
- [ ] Vendor login → token válido con seller_id
- [ ] GET `/admin/orders` → 200 (NO 401)
- [ ] GET `/admin/users/me` → 200 (NO 401)

### Fase 6: Markup Management ✅
- [ ] GET `/admin/custom/sellers` → 4 sellers con stats
- [ ] GET `/admin/custom/sellers/seller_01/markup` → 15.00%
- [ ] PATCH markup a 18.50% → affected_products calculado
- [ ] GET history → entrada insertada automáticamente

### Fase 7: Approval Queue ✅
- [ ] GET pending products → 4 productos
- [ ] PATCH aprobar con markup 18.50% → status = approved
- [ ] Producto creado en Medusa → medusa_product_id guardado
- [ ] PATCH rechazar con reason → status = rejected
- [ ] GET pending products → 2 productos (filtrado)

### Fase 8: Supplier Dashboard ✅
- [ ] GET `/vendor/custom/products` (vendor auth) → solo sus productos
- [ ] Filtro status=approved → solo aprobados
- [ ] GET `/vendor/custom/sellers/me/markup` → su markup global

### Fase 9: Bulk Upload ✅
- [ ] POST producto simple → created
- [ ] POST producto con 2 variantes → variants guardadas en JSONB
- [ ] Validar SKUs únicos → error si duplicados
- [ ] Rate limiting → error tras 10 requests/min

---

## 🔍 Tests de Performance

### Query Optimization
```sql
-- Debe usar idx_proposals_status_created
EXPLAIN ANALYZE
SELECT * FROM custom_product_proposals
WHERE status = 'pending_approval'
ORDER BY created_at DESC
LIMIT 50;
```
- [ ] Index Scan (NO Seq Scan)
- [ ] Execution time < 10ms

### Concurrent Approvals
```bash
# Aprobar 10 productos simultáneamente
ab -n 10 -c 10 -p approve.json -T application/json \
  -H "Authorization: Bearer $TOKEN" \
  https://api.example.com/admin/custom/products/proposal_01/pricing-approval
```
- [ ] 10/10 requests successful
- [ ] No deadlocks
- [ ] History entries creadas correctamente

---

## 🚨 Critical Errors to Fix

### Error 1: 401 Unauthorized en Admin Endpoints ❌
**Status:** BLOQUEANTE  
**Archivos afectados:** `/admin/orders`, `/admin/users/me`  
**Solución:**
1. Verificar JWT middleware incluye `domain: 'admin'`
2. Confirmar role permissions configurado
3. Validar JWT_SECRET

### Error 2: Seller ID Missing en Vendor Session ⚠️
**Status:** Potencial issue  
**Solución:**
- En login vendor, incluir `seller_id` en JWT payload
- Middleware debe extraer y añadir a `req.user.seller_id`

---

## 📞 Contactos

**Frontend Team:**
- Mock mode: ✅ Funcionando
- Test URL: http://localhost:3000/admin/dev-tools
- Docs: `/docs/integration/BACKEND_REQUIREMENTS.md`

**Backend Team - Próximos Pasos:**
1. ✅ Leer `BACKEND_REQUIREMENTS.md` (especificación completa)
2. ✅ Revisar `BACKEND_SQL_MIGRATIONS.md` (SQL scripts)
3. ✅ Copiar código de `BACKEND_CODE_EXAMPLES.md` (TypeScript examples)
4. ⚠️ **Fix 401 en admin endpoints (P0 - Día 1)**
5. 📅 **Sprint planning:** 5 días de implementación

---

## 📦 Entregables Sprint 1

**Al finalizar Sprint 1 debes tener:**

✅ **Database:**
- 3 tablas nuevas creadas
- Seed data insertada (4 sellers, 10 productos, 5 history)

✅ **Backend:**
- 2 servicios implementados (ProductPricingService, SellerMarkupService)
- 9 endpoints funcionando (6 admin + 3 vendor)
- Tests E2E pasando

✅ **Integración:**
- Frontend conectado a backend real
- Feature flags `NEXT_PUBLIC_MOCK_PRICING=false`
- No errores 401
- Flujos Fase 6-9 funcionando end-to-end

---

## 🎯 Definición de "Done"

Un endpoint está **DONE** cuando:
- [x] Implementado según spec
- [x] Tests unitarios pasando
- [x] Test con Postman → 200/201
- [x] Documentado en Postman collection
- [x] Error handling completo
- [x] Logs informativos
- [x] Frontend puede consumirlo sin cambios

---

## 📅 Timeline

| Día | Tarea | Entregable |
|-----|-------|------------|
| 1 | Fix autenticación | Admin endpoints 200 OK |
| 2 | Crear tablas + seed | DB con estructura completa |
| 3 | Implementar servicios | Unit tests pasando |
| 4 | Endpoints admin | 6 endpoints funcionando |
| 5 | Endpoints vendor + E2E | 9 endpoints + flujos completos |

**Meta:** 100% Fase 6-9 operativa en modo real

---

**Documento generado:** 21 Agosto 2026  
**Versión:** 1.0 - Quick Start  
**Próxima revisión:** Diaria durante Sprint 1
