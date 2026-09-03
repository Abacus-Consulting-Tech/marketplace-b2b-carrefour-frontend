# Guías de Testing - Marketplace B2B Carrefour

📋 **Índice de guías de testing por módulo**

---

## 📚 Guías Disponibles

### Quick Tests

1. **[Quick Test Checkout](QUICK_TEST_CHECKOUT.md)** ⭐ **NUEVO**  
   Validación rápida del checkout actualizado
   - Stripe-only
   - Revisión agrupada por proveedor
   - Confirmación asíncrona
   - Smoke test mock + prueba negativa del bloqueo real

### Módulos Core

2. **[Testing Catalog](TESTING_CATALOG.md)**  
   Pruebas del catálogo de productos del franquiciado
   - Filtros y búsqueda
   - Visualización de productos
   - Navegación por categorías
   - Comparación de productos

3. **[Testing Product Management](TESTING_PRODUCT_MANAGEMENT.md)**  
   Pruebas del CRUD de productos (Admin/Proveedor)
   - Crear productos
   - Editar productos
   - Eliminar productos
   - Gestión de imágenes

4. **[Testing Category Management](TESTING_CATEGORY_MANAGEMENT.md)**  
   Pruebas de gestión de categorías
   - CRUD de categorías de productos
   - CRUD de categorías de aperturas
   - Jerarquías de categorías

5. **[Testing Comparison](TESTING_COMPARISON.md)**  
   Pruebas del comparador de productos
   - Añadir productos a comparar
   - Vista de comparación
   - Exportar comparaciones

### Módulos de Invitaciones y Presupuestos

6. **[Testing Invitations](TESTING_INVITATIONS.md)**  
   Pruebas del sistema de invitaciones a proveedores
   - Crear invitaciones
   - Gestionar respuestas
   - Aceptar/rechazar invitaciones

7. **[Testing Quote Form](TESTING_QUOTE_FORM.md)**  
   Pruebas del formulario de presupuestos
   - Crear presupuestos
   - Enviar a proveedores
   - Gestión de respuestas

### Módulos de Gestión

8. **[Testing Franchisee Management](TESTING_FRANCHISEE_MANAGEMENT.md)**  
   Pruebas de gestión de franquiciados
   - CRUD de franquiciados
   - Perfiles y configuración
   - Activación/desactivación

### Módulos de Openings

9. **[Testing Openings Documents](TESTING_OPENINGS_DOCUMENTS.md)**  
   Pruebas completas del módulo de Openings (Nuevas Aperturas)
   - Descarga de documentos técnicos
   - Filtros por categoría (6 categorías)
   - Control de acceso granular (Franchisee/Supplier)
   - Vista de proyectos y documentos
   - **Estado**: ✅ COMPLETADO AL 100%

---

## 🎯 Cobertura de Testing

| Módulo | Guía Disponible | Tipo Testing |
|--------|----------------|--------------|
| Checkout | ✅ | Quick manual |
| Catálogo | ✅ | Manual |
| Gestión de Productos | ✅ | Manual |
| Gestión de Categorías | ✅ | Manual |
| Comparador | ✅ | Manual |
| Invitaciones | ✅ | Manual |
| Presupuestos | ✅ | Manual |
| Gestión Franquiciados | ✅ | Manual |
| **Aperturas (Openings)** | ✅ | Manual |
| Órdenes (Admin) | ⏳ | Pendiente |
| Órdenes (Proveedor) | ⏳ | Pendiente |

---

## 📝 Convenciones de Testing

### Estructura de Guías

Cada guía de testing incluye:

1. **Descripción del módulo** - Qué se está probando
2. **Prerequisitos** - Configuración necesaria
3. **Casos de prueba** - Escenarios específicos a validar
4. **Resultados esperados** - Comportamiento correcto
5. **Problemas conocidos** - Issues identificados (si aplica)

### Niveles de Prueba

- **Smoke Test**: Pruebas básicas de funcionalidad
- **Integration Test**: Pruebas de integración entre módulos
- **E2E Test**: Pruebas end-to-end de flujos completos
- **Regression Test**: Pruebas de regresión después de cambios

---

## 🔧 Testing con Mock Data

Todas las guías asumen que el frontend está en **modo mock** para permitir testing sin dependencia del backend:

```typescript
// src/config/feature-flags.ts
export const featureFlags = {
  products: { useMock: true, backendReady: false },
  orders: { useMock: true, backendReady: false },
  // ...
}
```

---

## 📊 Testing Automatizado (Futuro)

Próximamente se agregarán tests automatizados con:

- **Vitest** - Unit tests
- **React Testing Library** - Component tests
- **Playwright** - E2E tests

---

## 🔗 Ver También

- **[Guía de Desarrollo](../technical/DEVELOPMENT.md)** - Setup de desarrollo
- **[Estado del Proyecto](../PROJECT_STATUS_AND_ROADMAP.md)** - Roadmap y prioridades
- **[API Specification](../technical/API_SPEC.md)** - Endpoints documentados

---

**Última actualización**: 03 de Septiembre de 2026
