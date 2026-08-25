# 📋 Guía de Testing - Gestión de Categorías

## 🎯 Funcionalidad Implementada

**Módulo:** Gestión de Categorías (Tab en detalles de proyecto)  
**Alcance:** MVP funcional con UI mock y sessionStorage  
**Fecha:** 19 Agosto 2026

---

## ✅ Checklist de Testing

### 1. Acceso al Módulo

- [ ] **Login como Admin**
  - URL: http://localhost:3002/login
  - Credenciales: `admin@test.com` / `admin123`
  
- [ ] **Navegar a Proyectos**
  - Dashboard Admin → "Ver Nuevas Aperturas"
  - O directamente: http://localhost:3002/admin/openings

- [ ] **Abrir Detalle de Proyecto**
  - Click en cualquier proyecto (ej: "Nueva apertura - Calle Carmen 50")
  - O directamente: http://localhost:3002/admin/openings/proj_001

### 2. Ver Categorías Existentes

**Tab "Categorías":**

- [ ] Ver lista de 3 categorías mock:
  - ✅ **Mobiliario** - €35,000 - 3 presupuestos
  - ✅ **Rotulación** - €12,000 - 2 presupuestos  
  - ✅ **Equipamiento Informático** - €8,000 - 2 presupuestos

- [ ] Cada categoría muestra:
  - ✅ Nombre y descripción
  - ✅ Presupuesto estimado
  - ✅ Número de presupuestos recibidos
  - ✅ Plazo estimado (días)
  - ✅ Lista de requisitos
  - ✅ Badges de entregables
  - ✅ Botones "Editar" (lápiz) y "Eliminar" (papelera)

### 3. Añadir Nueva Categoría

- [ ] **Click en "Añadir Categoría"**
  - Se abre modal "Añadir Categoría"

- [ ] **Completar formulario:**
  ```
  Nombre: Refrigeración
  Descripción: Cámaras frigoríficas y vitrinas refrigeradas
  Presupuesto: 25000
  ```

- [ ] **Validaciones:**
  - ❌ Nombre vacío → Error
  - ❌ Nombre < 3 caracteres → Error
  - ❌ Presupuesto negativo → Error
  - ✅ Descripción opcional

- [ ] **Guardar:**
  - Toast: "Categoría creada"
  - Nueva categoría aparece en la lista
  - sessionStorage actualizado

- [ ] **Recargar página:**
  - ✅ Categoría persiste (sessionStorage)

### 4. Editar Categoría

- [ ] **Click en botón "Editar" (lápiz)** de cualquier categoría
  - Modal se abre con datos prellenados

- [ ] **Modificar datos:**
  ```
  Nombre: Mobiliario Premium
  Presupuesto: 40000
  ```

- [ ] **Guardar:**
  - Toast: "Categoría actualizada"
  - Cambios reflejados en la lista

### 5. Eliminar Categoría

- [ ] **Click en botón "Eliminar" (papelera)**
  - Dialog de confirmación aparece
  - Texto: "Esta acción no se puede deshacer..."

- [ ] **Confirmar eliminación:**
  - Toast: "Categoría eliminada"
  - Categoría desaparece de la lista
  - Contador de categorías actualizado

- [ ] **Cancelar eliminación:**
  - Dialog se cierra sin cambios

### 6. Estado Vacío

- [ ] **Eliminar todas las categorías**
  - Se muestra vista vacía con:
    - ✅ Icono de "+"
    - ✅ Mensaje: "No hay categorías"
    - ✅ Texto explicativo
    - ✅ Botón: "Añadir Primera Categoría"

### 7. Integración con Proyecto

- [ ] **Contador de categorías actualizado:**
  - Al añadir: `categories_count++`
  - Al eliminar: `categories_count--`
  
- [ ] **Actualización en lista de proyectos:**
  - Volver a `/admin/openings`
  - Verificar que el proyecto muestra el contador correcto

---

## 🐛 Casos Edge a Verificar

### Validación de Formulario
- [ ] Nombre con espacios al inicio/final
- [ ] Presupuesto con decimales (ej: 1234.56)
- [ ] Presupuesto = 0 (debería permitirse)
- [ ] Descripción muy larga (>500 caracteres)

### Persistencia
- [ ] Crear 5+ categorías
- [ ] Recargar navegador
- [ ] Todas persisten en sessionStorage

### Navegación
- [ ] Añadir categoría → Navegar a otro tab → Volver
- [ ] Categorías se mantienen cargadas

### Estados de Carga
- [ ] Modal muestra spinner durante guardado
- [ ] Botones disabled mientras se guarda
- [ ] Lista muestra "Cargando categorías..." al inicio

---

## 📊 Datos Mock Disponibles

### Proyecto `proj_001` - Calle Carmen 50
```javascript
{
  id: 'cat_001',
  name: 'Mobiliario',
  budget_estimate: 3500000, // €35,000
  specifications: {
    requirements: [
      'Estanterías modulares de 2m de altura',
      'Mostradores de caja',
      'Mobiliario de oficina',
    ],
    deliverables: [
      'Instalación incluida',
      'Garantía de 2 años',
    ],
    timeline_days: 30,
  },
  quotes_count: 3,
}
```

---

## 🔧 Troubleshooting

### La lista no carga categorías
```bash
# Verificar consola del navegador
# Debe mostrar: "[openingsApi] getCategoriesByProject..."

# Verificar sessionStorage
# Chrome DevTools → Application → Session Storage
# Key: mock_openings_projects
```

### Cambios no persisten
```bash
# Limpiar sessionStorage
sessionStorage.clear()
# Recargar página
```

### Errores TypeScript
```bash
npm run build
# Debe compilar sin errores
```

---

## 🚀 Próximos Pasos

Una vez verificada esta funcionalidad, continuar con:

1. **Sistema de Invitaciones** - Añadir proveedores a categorías
2. **Formulario de Presupuesto** - Supplier portal
3. **Tabla de Comparación** - Franchisee portal
4. **Upload de Documentos** - Planos, presupuestos
5. **Workflow de Estados** - Transiciones automáticas

---

## 📝 Notas de Implementación

### Arquitectura
- **Components:**
  - `CategoryForm.tsx` - Modal add/edit
  - `CategoryList.tsx` - Lista con CRUD actions
  
- **API Client:**
  - `getCategoriesByProject()`
  - `createCategory()`
  - `updateCategory()`
  - `deleteCategory()`

- **Mock Data:**
  - `mockCategories` (3 categorías para proj_001)
  - sessionStorage persistence

### Flujo de Datos
```
1. Page load → getCategoriesByProject(projectId)
2. Add → createCategory() → Update state + storage
3. Edit → updateCategory() → Update state
4. Delete → deleteCategory() → Update state + storage + project counter
```

---

## ✅ Criterios de Aceptación

- ✅ Ver categorías existentes con toda la información
- ✅ Añadir nueva categoría con validación
- ✅ Editar categoría existente
- ✅ Eliminar categoría con confirmación
- ✅ Persistencia en sessionStorage
- ✅ Estado vacío con call-to-action
- ✅ Validaciones de formulario
- ✅ Toasts informativos
- ✅ Loading states
- ✅ Sin errores TypeScript
- ✅ Build exitoso

---

**Estado:** ✅ IMPLEMENTADO  
**Versión:** MVP 1.0  
**Backend:** Mock con sessionStorage  
**Ready for:** Manual testing + Siguiente feature
