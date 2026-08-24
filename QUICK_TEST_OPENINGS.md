# 🧪 Quick Test - Módulo Nuevas Aperturas (MVP)
**Fecha:** 2026-08-19  
**Servidor:** http://localhost:3002  
**Modo:** Mock (NEXT_PUBLIC_MOCK_OPENINGS=true)

---

## ⚠️ IMPORTANTE: Este es un MVP

**Estado Actual del Módulo:**
- ✅ **Estructura completa**: Types, API client, Zustand store, routes
- ✅ **Login mock**: 3 roles (admin, franchisee, supplier)
- ✅ **Admin Portal**: Lista, detalles, formulario de creación
- ✅ **Navegación**: Todos los portales accesibles
- ✅ **Persistencia**: sessionStorage para mock data

**Funcionalidades en Desarrollo (Placeholders):**
- 🚧 Gestión de categorías (tab muestra "Funcionalidad en desarrollo...")
- 🚧 Invitación de proveedores (tab muestra "Funcionalidad en desarrollo...")
- 🚧 Presupuestos (tab muestra "Funcionalidad en desarrollo...")
- 🚧 Formulario de presupuesto para suppliers (página no implementada)
- 🚧 Comparación de presupuestos para franchisees (funcionalidad pendiente)

**Objetivo de este Testing:**
Verificar que la **estructura base y navegación funcionan correctamente**, reconociendo que las funcionalidades avanzadas están marcadas explícitamente como "en desarrollo".

---

## ✅ Test 1: Login como Admin

### URL
```
http://localhost:3002/login
```

### Credenciales Mock
```
Email: admin@test.com
Password: admin123
```

### Expected Result
- ✅ Login exitoso
- ✅ Redirect a `/admin/dashboard`
- ✅ Ver quick actions con "Nuevas Aperturas"

---

## ✅ Test 2: Dashboard de Nuevas Aperturas (Admin)

### URL
```
http://localhost:3002/admin/openings
```

### Expected Display
```
Gestión de Proyectos de Nuevas Aperturas

[+ Crear Nuevo Proyecto]

Proyectos (3 proyectos mockup):

┌──────────────────────────────────────┐
│ 🏪 Nueva Tienda Madrid Centro        │
│ [Badge: Solicitando Presupuestos]    │
│                                       │
│ Franquiciado: Carrefour Express MAD  │
│ Ubicación: Madrid                    │
│ Presupuesto: €150,000                │
│ Categorías: 3                        │
│                                       │
│ [Ver Detalles]                       │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ 🏪 Ampliación Barcelona Sur          │
│ [Badge: Presupuestos Recibidos]      │
│ ...                                  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ 🏪 Renovación Valencia Centro        │
│ [Badge: Borrador]                    │
│ ...                                  │
└──────────────────────────────────────┘
```

### Verification
- ✅ 3 proyectos mockup mostrados
- ✅ Badges de estado correctos
- ✅ Información completa de cada proyecto
- ✅ Botón "Crear Nuevo Proyecto" visible

---

## ✅ Test 3: Ver Detalles de Proyecto

### Steps
1. En `/admin/openings`
2. Click "Ver Detalles" en primer proyecto

### Expected URL
```
http://localhost:3002/admin/openings/proj_001
```

### Expected Display
```
🏪 Nueva Tienda Madrid Centro
[Badge: Solicitando Cotizaciones]

Información General:
┌─────────────────────────────────────────┐
│ 🏢 Franquiciado                         │
│ Carrefour Express MAD                   │
│ express-madrid@carrefour.com            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📍 Ubicación                            │
│ Calle Gran Vía 123                      │
│ 28013 Madrid                            │
│ Madrid                                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 📅 Apertura Planificada                 │
│ 15/09/2026                              │
└─────────────────────────────────────────┘

Pestañas:
[Resumen] [Categorías] [Proveedores] [Presupuestos] [Documentos]

Tab "Resumen":
- Descripción del proyecto
- Superficie: 200 m²
- Formato: Express
- Datos Fiscales: CIF, Razón Social

Tab "Categorías":
"Funcionalidad en desarrollo..."

Tab "Proveedores":
"Funcionalidad en desarrollo..."

Tab "Presupuestos":
"Funcionalidad en desarrollo..."

Tab "Documentos":
- Plano del local (si existe)
```

### Verification
- ✅ Detalles básicos del proyecto mostrados
- ✅ 5 pestañas visibles
- ✅ Tab "Resumen" con información completa
- ⚠️ Tabs "Categorías", "Proveedores", "Presupuestos" en desarrollo
- ✅ Tab "Documentos" muestra planos si existen

---

## ✅ Test 4: Crear Nuevo Proyecto

### Steps
1. En `/admin/openings`
2. Click "Crear Nuevo Proyecto"

### Expected URL
```
http://localhost:3002/admin/openings/new
```

### Expected Form
```
Crear Nuevo Proyecto de Apertura

Información del Proyecto

ID Franquiciado *
[Input field]

Nombre del Proyecto *
[Input field]

Fecha de Apertura Planificada
[Date picker: YYYY-MM-DD]

Ubicación del Local

Dirección *
[Input field]

Ciudad *
[Input field]

Código Postal *
[Input field]

Provincia *
[Input field]

País
[Dropdown: España (default)]

Datos Fiscales

Razón Social *
[Input field]

CIF/NIF *
[Input field]

Nombre de Contacto *
[Input field]

Email de Contacto *
[Input field]

Teléfono de Contacto *
[Input field]

[Volver]  [Crear Proyecto]
```

### Test Scenario: Crear Proyecto de Prueba
1. **ID Franquiciado**: `FRAN001`
2. **Nombre**: `Test Tienda Sevilla`
3. **Fecha Apertura**: `2026-12-01`
4. **Dirección**: `Calle Sierpes 45`
5. **Ciudad**: `Sevilla`
6. **Código Postal**: `41001`
7. **Provincia**: `Sevilla`
8. **País**: `ES` (por defecto)
9. **Razón Social**: `Carrefour Express Sevilla S.L.`
10. **CIF**: `B12345678`
11. **Nombre Contacto**: `Juan Martínez`
12. **Email Contacto**: `juan.martinez@sevilla.com`
13. **Teléfono**: `+34 954 123 456`
14. Click "Crear Proyecto"

### Expected Result
- ✅ Validación de campos requeridos (12 campos obligatorios)
- ✅ Mensaje de error si falta algún campo: "Por favor, completa todos los campos obligatorios."
- ✅ Spinner "Creando proyecto..." al enviar
- ✅ Console log: "Submitting project request:"
- ✅ Redirect a `/admin/openings/[id del nuevo proyecto]`
- ✅ Proyecto guardado en sessionStorage (mock)

### ⚠️ Nota Importante
**Categorías, presupuestos y documentos NO se añaden en el formulario de creación.**
Estos se gestionan después, desde la página de detalles del proyecto (funcionalidad en desarrollo).

---

## ✅ Test 5: Login como Franchisee

### URL
```
http://localhost:3002/login
```

### Credenciales Mock
```
Email: franchisee@test.com
Password: franchisee123
```

### Expected Result
- ✅ Login exitoso
- ✅ Redirect a `/franchisee/openings` o `/marketplace/dashboard`

---

## ✅ Test 6: Dashboard de Franchisee

### URL
```
http://localhost:3002/franchisee/openings
```

### Expected Display
```
Mis Proyectos de Nuevas Aperturas

Proyectos Activos (Mock data dependiente)
```

### Verification
- ✅ Página carga sin errores
- ✅ Estructura básica visible
- ⚠️ Datos mock dependen de la implementación

---

## ✅ Test 7: Login como Supplier

### URL
```
http://localhost:3002/login
```

### Credenciales Mock
```
Email: supplier@test.com
Password: supplier123
```

### Expected Result
- ✅ Login exitoso
- ✅ Redirect a `/supplier/openings` o `/supplier/dashboard`

---

## 🔧 Tests 8-10: Funcionalidades en Desarrollo

Las siguientes funcionalidades están **en desarrollo** y no son testeables aún:

### ❌ Test 8: Comparación de Presupuestos (Franchisee)
- Estado: **En desarrollo**
- Ubicación esperada: Tab "Presupuestos" en detalles de proyecto
- Actualmente muestra: "Funcionalidad en desarrollo..."

### ❌ Test 9: Enviar Presupuesto (Supplier)
- Estado: **En desarrollo**
- Ubicación esperada: `/supplier/openings/[categoryId]/quote`
- Actualmente: Página no implementada

### ❌ Test 10: Gestión de Categorías (Admin)
- Estado: **En desarrollo**
- Ubicación esperada: Tab "Categorías" en detalles de proyecto
- Actualmente muestra: "Funcionalidad en desarrollo..."

---

## 📊 Estado del Módulo (MVP)

### ✅ Implementado y Funcional
1. **Auth Mock** - Login con 3 roles
2. **Admin Portal**:
   - Lista de proyectos (mock data)
   - Detalles de proyecto con tabs
   - Formulario de creación (12 campos)
3. **Estructura de Pestañas**:
   - Tab "Resumen" completo
   - Tab "Documentos" funcional (si hay planos)
4. **Mock Data** con sessionStorage
5. **TypeScript Types** completos
6. **API Client** con modo mock/real

### 🚧 En Desarrollo (Mostrado como Placeholder)
1. **Gestión de Categorías**
2. **Invitación de Proveedores**
3. **Recepción de Presupuestos**
4. **Comparación de Presupuestos**
5. **Formulario de Presupuesto (Supplier)**
6. **Upload de Documentos**
7. **Workflow completo de Estados**

### 📝 Notas de Implementación

**El módulo actual es un MVP (Minimum Viable Product) que incluye:**
- ✅ Estructura de datos y tipos completos
- ✅ Autenticación mock
- ✅ Navegación entre portales
- ✅ Formulario de creación básico
- ✅ Vista de detalles con tabs (estructura)
- ✅ Persistencia con sessionStorage

**Próximos pasos de desarrollo:**
1. Implementar gestión de categorías desde detalle
2. Sistema de invitación a proveedores
3. Formulario de presupuesto para suppliers
4. Comparación de presupuestos para franchisees
5. Upload de documentos (planos, presupuestos)
6. Workflow de estados del proyecto
7. Integración con backend real (Medusa)

---

## 📊 Checklist Completo

### Funcionalidad Admin
- [ ] Login como admin
- [ ] Ver lista de proyectos (3 mockup)
- [ ] Ver detalles de proyecto existente
- [ ] Ver pestañas: Resumen, Categorías, Proveedores, Presupuestos, Documentos
- [ ] Tab "Resumen" muestra información completa
- [ ] Crear nuevo proyecto con 12 campos obligatorios
- [ ] Validaciones del formulario funcionando
- [ ] Navegación correcta después de crear

### Funcionalidad Franchisee
- [ ] Login como franchisee
- [ ] Ver proyectos asignados
- [ ] Ver detalles con estructura básica
- [ ] (Comparación de presupuestos: en desarrollo)

### Funcionalidad Supplier
- [ ] Login como supplier
- [ ] Ver invitaciones pendientes (mock data)
- [ ] (Formulario de presupuesto: en desarrollo)

### General
- [ ] Navegación entre portales
- [ ] Badges de estado correctos
- [ ] Formato de moneda correcto (€)
- [ ] Validaciones funcionando
- [ ] No hay errores en consola
- [ ] Mock data persiste en sessionStorage

### ⚠️ Funcionalidades en Desarrollo (NO testeables aún)
- ❌ Añadir categorías desde formulario de creación
- ❌ Gestión de categorías desde detalles
- ❌ Invitar proveedores
- ❌ Ver presupuestos recibidos
- ❌ Comparar presupuestos
- ❌ Enviar presupuestos (supplier portal)
- ❌ Upload de documentos en formulario
- ❌ Gestión completa de documentos

---

## 🐛 Problemas Conocidos

### ✅ Funcionando Correctamente
1. **sessionStorage Persistence**
   - Crear proyecto → Refrescar página → ✅ Sigue ahí
   - Login → Cerrar tab → Reabrir → ✅ Sesión persiste

2. **Validación de Formularios**
   - ✅ 12 campos obligatorios marcados
   - ✅ Mensaje de error claro: "Por favor, completa todos los campos obligatorios."
   - ✅ No permite enviar sin datos válidos
   - ✅ Formato de CIF validado (visual feedback)

3. **Navegación**
   - ✅ Los links funcionan correctamente
   - ✅ Redirect después de crear proyecto
   - ✅ Botón "Volver" funciona
   - ✅ Navegación entre tabs

### ⚠️ Limitaciones del MVP
1. **Tabs con Placeholders**
   - Categorías: "Funcionalidad en desarrollo..."
   - Proveedores: "Funcionalidad en desarrollo..."
   - Presupuestos: "Funcionalidad en desarrollo..."
   - Documentos: Solo muestra planos si existen en el proyecto

2. **Formulario Simplificado**
   - NO permite añadir categorías al crear proyecto
   - NO permite subir documentos al crear proyecto
   - NO tiene campos de presupuesto/plazo
   - Todos estos se gestionarían desde la página de detalles (futuro)

3. **Mock Data Limitado**
   - Solo 3 proyectos de ejemplo en admin
   - Proyectos de franchisee/supplier dependen de IDs hardcoded
   - Categorías, presupuestos, etc. no están en mock actual

---

## 📝 Notas de Testing

**Fecha:** _____________  
**Tester:** _____________  

**Resultado:**
- [ ] ✅ Todos los tests pasaron
- [ ] ⚠️ Algunos tests fallaron (especificar abajo)
- [ ] ❌ Tests bloqueados

**Errores Encontrados:**
```
1. 
2. 
3. 
```

**Observaciones:**
```
1. 
2. 
3. 
```

---

**✨ Happy Testing! 🚀**
