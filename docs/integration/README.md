# 📚 Backend Integration Documentation

**Marketplace B2B Carrefour - Pricing & Approval Module**  
**Frontend Team → Backend Team**  
**Fecha:** 21 Agosto 2026

---

## 🎯 Overview

Este directorio contiene la **especificación completa** para que el equipo de backend implemente los endpoints necesarios para las **Fases 6-9** del módulo de Tarificación y Aprobación de Productos.

**Estado actual:**
- ✅ Frontend completamente implementado (Fases 6-9)
- ✅ Funcionando en modo mock
- ❌ Backend pendiente de implementación
- ❌ Error 401 en endpoints admin (bloqueante)

---

## 📋 Documentos en Este Directorio

### 1. 🚀 [BACKEND_CHECKLIST.md](./BACKEND_CHECKLIST.md)
**Leer primero** - Checklist de implementación por día

**Contenido:**
- Sprint 1 breakdown (5 días)
- Checklist de validación
- Tests de performance
- Timeline y definición de "Done"

**Cuándo usar:** Inicio de implementación, tracking diario

---

### 2. 📖 [BACKEND_REQUIREMENTS.md](./BACKEND_REQUIREMENTS.md)
**Especificación completa** - Todo lo que necesitas saber

**Contenido:**
- Resumen ejecutivo y prioridades
- Arquitectura de datos (3 tablas)
- 20 endpoints especificados con Request/Response
- Datos de ejemplo para ingestar
- Validaciones y seguridad
- Testing checklist

**Cuándo usar:** Referencia principal durante implementación

---

### 3. 🗄️ [BACKEND_SQL_MIGRATIONS.md](./BACKEND_SQL_MIGRATIONS.md)
**SQL Scripts completos** - Copy & paste

**Contenido:**
- 3 migrations con CREATE TABLE
- Queries optimizadas para cada endpoint
- Triggers y functions PostgreSQL
- Índices de performance
- Scripts de seed data (10 productos, 4 sellers, etc.)
- Tests de validación SQL

**Cuándo usar:** Día 2 del sprint (crear tablas)

---

### 4. 💻 [BACKEND_CODE_EXAMPLES.md](./BACKEND_CODE_EXAMPLES.md)
**Código TypeScript** - Implementación de referencia

**Contenido:**
- 2 servicios completos (ProductPricingService, SellerMarkupService)
- 9 API routes (Medusa v2 style)
- Middleware de autenticación
- Rate limiting
- Tests con Jest
- Postman collection

**Cuándo usar:** Día 3-5 del sprint (implementar servicios y endpoints)

---

## 🚀 Quick Start (5 minutos)

### Paso 1: Entender el Problema
```
Frontend tiene 4 fases implementadas:
- Fase 6: Admin gestiona markup global por proveedor
- Fase 7: Admin aprueba/rechaza productos propuestos
- Fase 8: Suppliers ven sus productos y proponen nuevos
- Fase 9: Suppliers cargan productos masivamente (CSV)

TODO está en modo mock. Backend debe implementar APIs reales.
```

### Paso 2: Ver el Estado Actual
```bash
# Abrir en navegador
http://localhost:3000/admin/dev-tools

# Verás 20 endpoints listados
# 18 en modo mock (amarillo)
# 2 funcionando en real (verde)
```

### Paso 3: Leer Checklist
```bash
open docs/integration/BACKEND_CHECKLIST.md

# Te da el plan de 5 días paso a paso
```

### Paso 4: Fix Autenticación (P0 - Día 1)
```
Error actual: GET /admin/orders → 401 Unauthorized

Causa: JWT Bearer token no aceptado

Solución: Ver sección "Autenticación" en BACKEND_REQUIREMENTS.md
```

---

## 📊 Estructura de Datos

### Nuevas Tablas

```
custom_product_proposals
├── Propuestas de productos de suppliers
├── Estados: pending_approval, approved, rejected
└── Campos clave: base_price, markup_percentage, variants

sellers (extend)
└── Añadir: global_markup_percentage (0-500%)

seller_markup_history
└── Tracking de cambios administrativos
```

**Total:** 3 migrations

---

## 🔌 Endpoints Requeridos

### Admin (6 endpoints)
```
GET    /admin/custom/products/pending
PATCH  /admin/custom/products/:id/pricing-approval
GET    /admin/custom/sellers
GET    /admin/custom/sellers/:id/markup
PATCH  /admin/custom/sellers/:id/markup
GET    /admin/custom/sellers/:id/markup/history
```

### Vendor (3 endpoints)
```
GET    /vendor/custom/products
POST   /vendor/custom/products
GET    /vendor/custom/sellers/me/markup
```

**Total:** 9 custom endpoints + fix 2 standard endpoints

---

## 🎯 Prioridades

### P0 - Crítico (Bloqueante)
1. **Fix 401 en `/admin/orders`** ← Impide desarrollo
2. **9 custom endpoints de Pricing** ← Core funcionalidad
3. **Sellers con markup field** ← Dependencia crítica

### P1 - Alta
4. Vendor endpoints (3)
5. Historial de markup
6. Creación de productos en Medusa tras aprobación

### P2 - Media
7. Store endpoints (públicos)
8. Optimizaciones de performance
9. Rate limiting

---

## 🧪 Testing

### Credenciales de Prueba

**Admin:**
```
Email: admin@carrefour.com
Password: admin123
```

**Vendor:**
```
Email: proveedor1@example.com
Password: password123
Seller ID: seller_01
```

### Postman Collection

Ver `BACKEND_CODE_EXAMPLES.md` sección "Postman Collection Example"

---

## 📞 Flujo de Comunicación

### Backend necesita aclaración
1. Revisar documentación completa (4 archivos)
2. Buscar en `BACKEND_REQUIREMENTS.md` (especificación)
3. Si no está documentado → contactar Frontend Team

### Frontend necesita cambios
1. **NO cambiar contratos de API sin avisar**
2. Proponer cambio en reunión técnica
3. Actualizar documentación primero
4. Implementar después de aprobación

---

## 🔄 Workflow de Desarrollo

### Día 1: Setup
```bash
# 1. Clonar repo backend
# 2. Leer BACKEND_CHECKLIST.md
# 3. Fix autenticación (401 en admin endpoints)
# 4. Validar con frontend: GET /admin/orders → 200 OK
```

### Día 2: Database
```bash
# 1. Copiar migrations de BACKEND_SQL_MIGRATIONS.md
# 2. Ejecutar migrations
# 3. Ejecutar seed data
# 4. Validar con queries de testing
```

### Día 3: Services
```bash
# 1. Copiar servicios de BACKEND_CODE_EXAMPLES.md
# 2. Adaptar a tu estructura de Medusa
# 3. Unit tests
# 4. Validar lógica de negocio
```

### Día 4-5: Endpoints
```bash
# 1. Copiar routes de BACKEND_CODE_EXAMPLES.md
# 2. Implementar 6 admin endpoints
# 3. Implementar 3 vendor endpoints
# 4. Integration tests con Postman
# 5. Frontend switch a modo real (feature flags)
```

---

## ✅ Definition of Done

Un endpoint está **DONE** cuando:

- [x] Implementado según `BACKEND_REQUIREMENTS.md`
- [x] Request/Response match exactamente la spec
- [x] Autenticación funciona (Bearer token)
- [x] Validaciones implementadas
- [x] Error handling completo (400, 401, 404)
- [x] Tested con Postman → 200/201
- [x] Frontend puede consumirlo sin cambios
- [x] Logs informativos en servidor

---

## 🚨 Errores Conocidos

### Error 1: 401 Unauthorized (Crítico)
**Endpoints afectados:** `/admin/orders`, `/admin/users/me`  
**Causa:** JWT Bearer no validado  
**Fix:** Ver sección autenticación en `BACKEND_REQUIREMENTS.md`  
**Estado:** ❌ Bloqueante

### Error 2: CORS en localhost
**Síntoma:** Frontend no puede hacer requests  
**Fix:** Configurar CORS headers  
**Estado:** ⚠️ Probable

---

## 📅 Timeline Esperado

| Sprint | Duración | Entregables |
|--------|----------|-------------|
| Sprint 1 | 5 días | Fix auth + 9 endpoints pricing |
| Sprint 2 | 5 días | Vendor endpoints + E2E testing |
| Sprint 3 | 3 días | Store endpoints + optimizaciones |

**Meta:** Frontend operativo en modo real en 2 semanas

---

## 📖 Glosario

**Términos clave:**

- **Proposal:** Producto propuesto por supplier, pendiente de aprobación
- **Base Price:** Precio del pack completo (NO precio unitario)
- **Markup:** Porcentaje de incremento aplicado al precio base
- **Global Markup:** Markup por defecto del seller (aplica a todos sus productos)
- **Specific Markup:** Markup específico de un producto (override del global)
- **Units per Pack:** Número de unidades en el pack (ej: 6 botellas)
- **Applied Markup:** El markup que realmente se usa (específico si existe, sino global)
- **Variants:** Variantes de producto (ej: tallas, colores) en JSONB

---

## 🔗 Links Útiles

**Frontend:**
- Dev Tools: http://localhost:3000/admin/dev-tools
- Login Admin: http://localhost:3000/login
- Login Vendor: http://localhost:3000/login

**Backend (actual):**
- API URL: https://marketplace-b2b-backend-dev.onrender.com
- Status: ⚠️ Partial (auth working, admin endpoints broken)

**Documentación Medusa:**
- v2 Docs: https://docs.medusajs.com/v2
- MercurJS: https://mercurjs.com/docs

---

## 🎁 Bonus: CSV Template

El frontend genera un CSV template con 22 columnas para bulk upload. Ver estructura completa en `docs/technical/supplier/FASE_9_BULK_UPLOAD.md`

**Columnas clave:**
```
Producto ID, Título, Descripción, Categoría general, Subcategoría,
Marca, SKU/Referencia, EAN, Variante, Opción 1, Valor 1, Opción 2,
Valor 2, Unidades por pack, Precio proveedor €, IVA %, Stock,
Imagen 1 URL, Imagen 2 URL, Imagen 3 URL, Imagen 4 URL, Imagen 5 URL
```

---

## 📝 Notas Finales

**Frontend Team ha hecho:**
- ✅ 4 fases implementadas (6, 7, 8, 9)
- ✅ Mock data realista
- ✅ 4 documentos de especificación completos
- ✅ Tipos TypeScript completos
- ✅ Ejemplos de código backend
- ✅ SQL migrations listas
- ✅ Testing guide

**Backend Team debe hacer:**
- ❌ Fix autenticación (P0)
- ❌ Crear 3 tablas
- ❌ Implementar 2 servicios
- ❌ Crear 9 endpoints
- ❌ E2E testing

**Timeline:** 5-10 días laborables

---

## 🤝 ¿Preguntas?

1. **Leer documentación completa primero** (4 archivos)
2. Verificar no está respondida en `BACKEND_REQUIREMENTS.md`
3. Contactar Frontend Team con contexto específico

---

**¡Éxito en la implementación! 🚀**

---

**Documentos generados:** 21 Agosto 2026  
**Versión:** 1.0  
**Mantenido por:** Frontend Team  
**Próxima revisión:** Post Sprint 1
