# Guía de Testing - Sistema de Invitaciones

## Descripción
Sistema que permite a los administradores invitar proveedores a cotizar en categorías específicas de un proyecto de apertura.

## Estado de Implementación
✅ **COMPLETO** - MVP funcional con mock API

## Datos Mock Disponibles

### Proveedores Mock (6 proveedores)
```typescript
1. Mobiliario Retail S.L. - info@mobiliarioretail.com
   Especialidades: Mobiliario, Estanterías
   Rating: 4.5

2. Equipamiento Express S.A. - comercial@equipamientoexpress.com
   Especialidades: Mobiliario, Equipamiento
   Rating: 4.2

3. Rótulos y Vinilos Madrid - ventas@rotulosmadrid.com
   Especialidades: Rotulación, Señalización
   Rating: 4.7

4. Señalética Profesional - info@senaleticapro.com
   Especialidades: Rotulación, Impresión
   Rating: 4.3

5. Soluciones IT Retail - contacto@solucionesit.com
   Especialidades: Equipamiento Informático, Software
   Rating: 4.6

6. Tech Store Solutions - info@techstore.com
   Especialidades: Equipamiento Informático, TPV
   Rating: 4.4
```

### Invitaciones Mock Existentes
```typescript
// El proyecto "Nueva apertura - Calle Carmen 50" ya tiene 3 invitaciones:
- Mobiliario Retail S.L. → Categoría "Mobiliario" (estado: quote_submitted)
- Rótulos y Vinilos Madrid → Categoría "Rotulación" (estado: pending)
- Soluciones IT Retail → Categoría "Equipamiento Informático" (estado: pending)
```

## Pasos de Testing

### 1. Login y Navegación
```bash
1. Ir a http://localhost:3002/login
2. Login como admin:
   - Email: admin@test.com
   - Password: admin123
3. Navegar a "Nuevas Aperturas" desde el dashboard
4. Seleccionar el proyecto "Nueva apertura - Calle Carmen 50"
```

### 2. Ver Tab de Proveedores
```bash
1. En la página de detalle del proyecto
2. Click en tab "Proveedores"
3. ESPERADO:
   - Se muestran 3 cards (una por categoría: Mobiliario, Rotulación, Equipamiento Informático)
   - Card "Mobiliario": 1 proveedor invitado, 1 cotización recibida
   - Card "Rotulación": 1 proveedor invitado, 0 cotizaciones
   - Card "Equipamiento Informático": 1 proveedor invitado, 0 cotizaciones
   - Botón "Invitar Proveedores" visible
```

### 3. Invitar Nuevos Proveedores
```bash
1. Click en botón "Invitar Proveedores"
2. Modal se abre con formulario
3. CAMPOS:
   - Categoría: dropdown con las 3 categorías del proyecto
   - Proveedores: lista de 6 proveedores con checkboxes
   - Plazo (días): campo numérico (default: 30)
   - Mensaje: textarea opcional

4. PRUEBAS:
   a) Intentar enviar sin seleccionar categoría → Error de validación
   b) Intentar enviar sin seleccionar proveedores → Botón deshabilitado
   c) Seleccionar categoría "Mobiliario"
   d) Seleccionar proveedor:
      - ✓ Equipamiento Express S.A.
   e) Plazo: 15 días
   f) Mensaje: "Les invitamos a cotizar para mobiliario adicional"
   g) Click "Enviar (1)"

5. ESPERADO:
   - Modal se cierra
   - Toast de confirmación: "1 proveedor(es) invitado(s) correctamente"
   - La card "Mobiliario" ahora muestra:
     * 2 proveedores invitados
     * 1 cotización recibida
   - Se ven los 2 proveedores listados con estado "Cotización enviada" y "Pendiente"
```

### 4. Ver Detalles de Invitaciones
```bash
1. En tab "Proveedores"
2. Expandir card "Mobiliario"
3. ESPERADO ver para cada invitación:
   - Nombre del proveedor
   - Email del proveedor
   - Estado (badge):
     * "Pendiente" → badge secondary (gris)
     * "Vista" → badge default (azul)
     * "Cotización enviada" → badge default (azul)
     * "Rechazada" → badge destructive (rojo)
     * "Expirada" → badge outline (gris claro)
   - Icono de estado:
     * Pendiente → reloj naranja
     * Vista → sobre azul
     * Cotización enviada → check verde
     * Rechazada → X roja
     * Expirada → reloj gris
   - Mensaje de invitación (truncado a 100 caracteres)
   - Fecha de invitación
   - Fecha límite (deadline)
   - Si tiene cotización: enlace "Ver cotización"
```

### 5. Invitar a Mismos Proveedores (Duplicados)
```bash
1. Click "Invitar Proveedores"
2. Seleccionar categoría "Mobiliario"
3. Seleccionar "Mobiliario Retail S.L." (ya invitado)
4. Enviar
5. ESPERADO:
   - La invitación se crea (el sistema permite duplicados en MVP)
   - Se añade nueva entrada con estado "Pendiente"
   - En producción con backend: validar duplicados
```

### 6. Validación de Formulario
```bash
CAMPO CATEGORÍA:
- Requerido: Sí
- Validación: Debe seleccionar una categoría

CAMPO PROVEEDORES:
- Requerido: Al menos 1
- Validación: Botón enviar deshabilitado si array vacío
- Multi-selección: Sí

CAMPO PLAZO:
- Requerido: Sí
- Tipo: Número
- Mínimo: 1 día
- Máximo: 90 días
- Default: 30 días

CAMPO MENSAJE:
- Requerido: No
- Tipo: Texto largo
- Se muestra en la lista de invitaciones
```

### 7. Estados de Invitación (Referencia)
```typescript
Estados disponibles:
- pending: Invitación enviada, proveedor no ha abierto
- viewed: Proveedor abrió la invitación
- quote_submitted: Proveedor envió cotización
- declined: Proveedor rechazó la invitación
- expired: Venció el plazo sin respuesta
```

### 8. Persistencia de Datos
```bash
1. Crear varias invitaciones
2. Navegar a otra página del dashboard
3. Volver al proyecto → tab "Proveedores"
4. ESPERADO:
   - Las invitaciones se mantienen (sessionStorage)
5. Refrescar navegador (F5)
6. Login nuevamente
7. Ir al proyecto
8. ESPERADO:
   - Las invitaciones se mantienen (sessionStorage)
9. Cerrar y abrir navegador
10. ESPERADO:
    - Las invitaciones se pierden (sessionStorage se limpia)
```

### 9. Caso Sin Categorías
```bash
1. Crear un proyecto nuevo sin categorías
2. Ir a tab "Proveedores"
3. ESPERADO:
   - Botón "Invitar Proveedores" deshabilitado
   - Mensaje: "No hay categorías definidas"
   - Instrucción: "Primero añade categorías en la pestaña Categorías"
```

### 10. Interfaz Responsiva
```bash
DESKTOP (>768px):
- Modal formulario: ancho máximo 600px
- Lista proveedores en formulario: altura máxima 200px con scroll
- Cards de categorías en grid

MOBILE (<768px):
- Modal ocupa 90% viewport height
- Scroll vertical en lista de proveedores
- Cards apiladas verticalmente
```

## Flujo Completo de Ejemplo

```bash
ESCENARIO: Invitar 3 proveedores de rotulación

1. Login como admin@test.com
2. Dashboard → Nuevas Aperturas
3. Seleccionar "Nueva apertura - Calle Carmen 50"
4. Tab "Proveedores"
5. Verificar que "Rotulación" tiene 1 invitación pendiente
6. Click "Invitar Proveedores"
7. Categoría: "Rotulación"
8. Proveedores:
   ✓ Señalética Profesional
9. Plazo: 20 días
10. Mensaje: "Solicitud de presupuesto para señalización exterior e interior"
11. Click "Enviar (1)"
12. Verificar toast de confirmación
13. Verificar que ahora hay 2 proveedores en "Rotulación"
14. La nueva invitación debe mostrar:
    - Proveedor: Señalética Profesional
    - Email: info@senaleticapro.com
    - Estado: Pendiente (badge gris)
    - Mensaje completo
    - Fecha de hoy
    - Deadline: hoy + 20 días
```

## Puntos de Verificación

### ✅ Funcionalidades Implementadas
- [x] Listado de proveedores disponibles con mock data
- [x] Formulario modal para invitar proveedores
- [x] Selección múltiple de proveedores con checkboxes
- [x] Dropdown de categorías del proyecto
- [x] Campo de plazo en días
- [x] Campo de mensaje opcional
- [x] Lista de invitaciones agrupadas por categoría
- [x] Badges de estado de invitación
- [x] Iconos visuales por estado
- [x] Información completa de cada invitación
- [x] Persistencia en sessionStorage
- [x] Validación de formulario con Zod
- [x] Toast notifications
- [x] Loading states

### 🔄 Comportamiento Mock
- Delay simulado: 300ms
- No validación de duplicados
- No envío real de emails
- Estados no cambian automáticamente (manual en producción)
- sessionStorage como persistencia temporal

### 📝 Notas para Producción
1. **Validación de duplicados**: Backend debe verificar que no se invite dos veces al mismo proveedor en la misma categoría
2. **Envío de emails**: Integrar con servicio de email (SendGrid, SES, etc.)
3. **Cambio de estados**: Los proveedores cambiarán estados al:
   - Abrir el email → `viewed`
   - Enviar cotización → `quote_submitted`
   - Rechazar → `declined`
   - Vencer deadline sin acción → `expired`
4. **Notificaciones**: Avisar al admin cuando proveedor ve invitación o envía cotización
5. **Filtros**: Añadir filtros por estado de invitación
6. **Búsqueda**: Buscar proveedores por nombre/email en el formulario
7. **Historial**: Log de cambios de estado de invitaciones

## Resolución de Problemas

### Problema: No se muestran proveedores en el formulario
**Solución**: Verificar que `mockSuppliers` esté exportado en `openings-mock.ts`

### Problema: Invitaciones no se guardan
**Solución**: 
1. Verificar que `mockInvitations.push()` se ejecuta en `createInvitation`
2. sessionStorage solo persiste en la sesión del navegador

### Problema: Botón "Invitar Proveedores" deshabilitado
**Solución**: Primero crear categorías en el tab "Categorías"

### Problema: Modal no se cierra después de enviar
**Solución**: Verificar que `setInviteFormOpen(false)` se llama en el handler

### Problema: Estados de invitación no se ven correctamente
**Solución**: Verificar badges y función `getInvitationStatusBadge()`

## Próximos Pasos

Después de validar este módulo, continuar con:
1. **Formulario de Cotización** (Feature #3) - Proveedores pueden enviar cotizaciones
2. **Tabla de Comparación** (Feature #4) - Comparar cotizaciones recibidas
3. **Upload de Documentos** (Feature #5) - Adjuntar archivos a cotizaciones
4. **Workflow de Estados** (Feature #6) - Transiciones de estado del proyecto

## Archivos Creados/Modificados

```
src/components/openings/admin/
  ├── InviteSupplierForm.tsx (NUEVO - 245 líneas)
  └── InvitationsList.tsx (NUEVO - 125 líneas)

src/lib/api/
  ├── openings-mock.ts (MODIFICADO - +60 líneas de proveedores mock)
  └── openings-client.ts (MODIFICADO - +145 líneas de funciones invitaciones)

src/app/(backoffice)/admin/openings/[id]/
  └── page.tsx (MODIFICADO - +85 líneas de state e handlers)
```

---
**Versión**: 1.0  
**Fecha**: 2026  
**Autor**: Sistema de Nuevas Aperturas Carrefour B2B
