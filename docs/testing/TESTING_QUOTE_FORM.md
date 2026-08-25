# Guía de Testing - Formulario de Presupuesto (Supplier Portal)

## Descripción
Sistema que permite a los proveedores enviar presupuestos para las categorías a las que han sido invitados. Incluye funcionalidad de borradores y envío final.

## Estado de Implementación
✅ **COMPLETO** - MVP funcional con mock API

## Credenciales de Acceso

### Usuario Proveedor Mock
```
Email: supplier@test.com
Password: supplier123
```

## Datos Mock Disponibles

### Invitaciones Existentes para supplier@test.com
```typescript
// En producción, esto vendría del backend basado en el usuario actual
// Para testing mock, se usan las invitaciones de mockInvitations

Invitación 1:
- Proyecto: "Nueva apertura - Calle Carmen 50"
- Categoría: "Mobiliario" (cat_001)
- Proveedor: Mobiliario Retail S.L.
- Presupuesto estimado: €35,000
- Plazo: 15 sep 2026
- Estado: quote_submitted (ya tiene presupuesto enviado)
- Mensaje: "Le invitamos a presentar presupuesto para el mobiliario..."

Invitación 2:
- Proyecto: "Nueva apertura - Calle Carmen 50"
- Categoría: "Rotulación" (cat_002)
- Proveedor: Rótulos y Vinilos Madrid
- Presupuesto estimado: €12,000
- Plazo: 15 sep 2026
- Estado: pending (puede enviar presupuesto)
- Mensaje: "Necesitamos presupuesto para rotulación interior y exterior..."

Invitación 3:
- Proyecto: "Nueva apertura - Calle Carmen 50"  
- Categoría: "Equipamiento Informático" (cat_003)
- Proveedor: Soluciones IT Retail
- Presupuesto estimado: €8,000
- Plazo: 15 sep 2026
- Estado: pending (puede enviar presupuesto)
- Mensaje: "Solicitamos presupuesto para equipamiento informático completo..."
```

### Presupuestos Mock Existentes
```typescript
// quote_001 y quote_002 ya existen para demostración
// Se muestran en el admin como presupuestos recibidos
```

## Pasos de Testing

### 1. Login como Proveedor
```bash
1. Ir a http://localhost:3002/login
2. Email: supplier@test.com
3. Password: supplier123
4. Click "Iniciar sesión"
5. ESPERADO: Redirect a dashboard de proveedor
```

### 2. Ver Invitaciones Pendientes
```bash
1. Desde el dashboard, navegar a "Nuevas Aperturas" o "Invitaciones"
2. URL: http://localhost:3002/supplier/openings
3. ESPERADO:
   - Ver estadísticas en la parte superior:
     * Total Invitaciones: 3
     * Pendientes: 2 (Rotulación y Equipamiento IT)
     * Presupuestos Enviados: 1 (Mobiliario)
   - Ver lista de 3 invitaciones en cards:
     * Nueva apertura - Calle Carmen 50 - Mobiliario (estado: Enviado)
     * Nueva apertura - Calle Carmen 50 - Rotulación (estado: Pendiente)
     * Nueva apertura - Calle Carmen 50 - Equipamiento Informático (estado: Pendiente)
   - Cada card muestra:
     * Nombre del proyecto
     * Dirección
     * Categoría (badge)
     * Estado (badge)
     * Presupuesto estimado
     * Fecha límite
     * Botón "Enviar Presupuesto" (azul) o "Ver Presupuesto" (outline)
```

### 3. Acceder al Formulario de Presupuesto
```bash
1. Click en "Enviar Presupuesto" de la categoría "Rotulación"
2. ESPERADO:
   - Redirect a: /supplier/openings/cat_002/quote
   - Página se carga mostrando:
     * Header con botón "Volver"
     * Título "Enviar Presupuesto"
     * Subtítulo "Rotulación"
```

### 4. Ver Información del Proyecto
```bash
En la sección "Información del Proyecto":
- ESPERADO:
  * Card con detalles del proyecto:
    - Icono de edificio + nombre del proyecto
    - Dirección completa
    - Descripción de la categoría: "Señalización interior y exterior"
    - Presupuesto estimado: €12,000.00 (en card gris)
    - Fecha límite (en card gris con icono calendario)
    - Mensaje del administrador: "Necesitamos presupuesto para rotulación..." (card azul)
```

### 5. Completar Formulario - Caso Exitoso
```bash
En la sección "Enviar Presupuesto":

1. Campo "Importe Total *":
   - Ver referencia: "Presupuesto estimado: €12,000.00" (banner azul)
   - Ingresar: 11500.00
   - ESPERADO: Input grande con "EUR" a la derecha

2. Campo "Plazo de Entrega":
   - Default: 30
   - Cambiar a: 20
   - ESPERADO: Input con "días" a la derecha

3. Campo "Garantía":
   - Default: 12
   - Cambiar a: 12
   - ESPERADO: Input con "meses" a la derecha

4. Campo "Condiciones de Pago":
   - Ingresar: "100% a la entrega"
   - ESPERADO: Textarea expandible

5. Campo "Notas Adicionales":
   - Ingresar: "Incluye diseño, impresión e instalación de todos los rótulos."
   - ESPERADO: Textarea grande

6. Campo "Archivo PDF del Presupuesto":
   - Click en "Seleccionar archivo" o arrastrar PDF
   - Seleccionar un archivo PDF
   - ESPERADO: 
     * Vista previa del archivo con nombre y tamaño
     * Botón "X" para remover archivo
     * Si el presupuesto ya existe, mensaje "Presupuesto actual subido" con link
   - NOTA: El archivo PDF es opcional, se puede enviar el presupuesto sin archivo

7. Botones disponibles:
   - "Guardar Borrador" (outline)
   - "Enviar Presupuesto" (azul)
```

### 6. Guardar Borrador
```bash
1. Click en botón "Guardar Borrador"
2. ESPERADO:
   - Botón muestra spinner
   - Después de 300ms (mock delay):
     * Toast: "Borrador guardado" + "El borrador se ha guardado correctamente"
     * Redirect a /supplier/openings
   - En lista de invitaciones:
     * Estado sigue siendo "Pendiente"
     * Puede volver a editar
```

### 7. Volver a Editar Borrador
```bash
1. Click nuevamente en "Enviar Presupuesto" de "Rotulación"
2. ESPERADO:
   - Título cambia a "Editar Presupuesto"
   - Formulario pre-lleno con datos guardados:
     * Importe: 11500.00
     * Plazo: 20 días
     * Garantía: 12 meses
     * Condiciones de pago: texto guardado
     * Notas: texto guardado
     * PDF: Si se subió PDF, muestra mensaje "Presupuesto actual subido" con link
   - Puede subir un nuevo PDF para reemplazar el anterior
```

### 8. Enviar Presupuesto Final
```bash
1. Modificar algún campo (opcional)
2. Click en "Enviar Presupuesto"
3. ESPERADO:
   - Botón muestra spinner
   - Después de 300ms:
     * Toast: "Presupuesto enviado" + "Tu presupuesto ha sido enviado al administrador"
     * Redirect a /supplier/openings
   - En lista de invitaciones:
     * Estado cambia a "Enviado" (badge azul con icono de envío)
     * Botón cambia a "Ver Presupuesto" (outline)
```

### 9. Validaciones del Formulario
```bash
CAMPO IMPORTE TOTAL:
- Requerido: Sí
- Tipo: Número decimal
- Mínimo: 0.01 EUR
- Máximo: 10,000,000 EUR
- Error si <= 0: "El monto debe ser mayor a 0"
- Error si > 10M: "El monto máximo es 10,000,000 EUR"

CAMPO PLAZO DE ENTREGA:
- Requerido: No (pero tiene default)
- Tipo: Número entero
- Mínimo: 1 día
- Máximo: 365 días
- Error si < 1: "Mínimo 1 día"
- Error si > 365: "Máximo 365 días"

CAMPO GARANTÍA:
- Requerido: No (pero tiene default)
- Tipo: Número entero
- Mínimo: 0 meses
- Máximo: 120 meses
- Error si < 0: "Mínimo 0 meses"
- Error si > 120: "Máximo 120 meses"

CAMPO CONDICIONES DE PAGO:
- Requerido: No
- Tipo: Texto
- Máximo: 500 caracteres
- Error si > 500: "Máximo 500 caracteres"

CAMPO NOTAS:
- Requerido: No
- Tipo: Texto
- Máximo: 1000 caracteres
- Error si > 1000: "Máximo 1000 caracteres"

CAMPO ARCHIVO PDF:
- Requerido: No (opcional en modo mock, requerido en producción)
- Tipo: Archivo PDF
- Formato: Solo .pdf (application/pdf)
- Tamaño máximo: 10MB
- Error si no es PDF: "Solo se permiten archivos PDF"
- Error si > 10MB: "El archivo no debe superar los 10MB"
- Nota: Si ya existe un presupuesto con PDF, se muestra link al PDF actual
```

### 10. Pruebas de Validación
```bash
PRUEBA 1: Importe inválido
1. Dejar importe vacío
2. Click "Enviar Presupuesto"
3. ESPERADO: No se envía, validación Zod bloquea

PRUEBA 2: Importe negativo
1. Importe: -100
2. Click "Enviar Presupuesto"
3. ESPERADO: Error "El monto debe ser mayor a 0"

PRUEBA 3: Plazo muy largo
1. Plazo: 500
2. Click "Enviar Presupuesto"
3. ESPERADO: Error "Máximo 365 días"

PRUEBA 4: Texto muy largo
1. Notas: Pegar texto de 1500 caracteres
2. Click "Enviar Presupuesto"
3. ESPERADO: Error "Máximo 1000 caracteres"

PRUEBA 5: Archivo no PDF
1. Intentar subir archivo .jpg o .docx
2. ESPERADO: Error "Solo se permiten archivos PDF"
3. Archivo no se carga

PRUEBA 6: Archivo PDF muy grande
1. Intentar subir PDF > 10MB
2. ESPERADO: Error "El archivo no debe superar los 10MB"
3. Archivo no se carga

PRUEBA 7: Remover archivo PDF
1. Subir un PDF válido
2. Ver vista previa con nombre y tamaño
3. Click en botón "X"
4. ESPERADO: Archivo removido, vuelve a mostrar área de carga
```

### 11. Navegación y Cancelación
```bash
1. Estando en el formulario
2. Click botón "Volver"
3. ESPERADO:
   - Redirect a /supplier/openings
   - No se guarda el formulario
   - Si había datos, se pierden

RECOMENDACIÓN: Añadir confirmación antes de salir si hay cambios sin guardar
```

### 12. Ver Presupuesto Enviado (Modo Read-Only)
```bash
1. Invitación con estado "Enviado"
2. Click "Ver Presupuesto"
3. ESPERADO (para MVP):
   - Muestra formulario pre-lleno
   - Campos en modo solo lectura (para futuro)
   - Por ahora, permite editar y reenviar
   
NOTA: En producción, presupuestos enviados no deberían editarse
      o solo permitir antes de que admin los revise
```

### 13. Persistencia de Datos
```bash
1. Guardar borrador
2. Navegar a otra página
3. Volver a /supplier/openings
4. Volver al presupuesto
5. ESPERADO:
   - Datos del borrador persisten (sessionStorage)

6. Enviar presupuesto
7. Navegar y volver
8. ESPERADO:
   - Estado "Enviado" persiste
   - Presupuesto guardado en mockQuotes

9. Refrescar navegador (F5)
10. Login nuevamente
11. ESPERADO:
    - Datos persisten (sessionStorage)

12. Cerrar y abrir navegador
13. ESPERADO:
    - Datos se pierden (sessionStorage se limpia)
```

### 14. Caso: Sin Invitaciones
```bash
1. Login con usuario que no tiene invitaciones
2. Navegar a /supplier/openings
3. ESPERADO:
   - Estadísticas: 0, 0, 0
   - Mensaje: "No tienes invitaciones pendientes"
   - No hay cards
```

### 15. Caso: Invitación Expirada
```bash
1. Modificar mock data para que deadline sea pasado
2. Ver invitación
3. ESPERADO (para futuro):
   - Badge "Expirada"
   - Botón "Enviar Presupuesto" deshabilitado
   
NOTA MVP: Actualmente no valida fechas de expiración
```

## Flujo Completo de Ejemplo

```bash
ESCENARIO: Proveedor envía presupuesto para Rotulación

1. Login: supplier@test.com / supplier123
2. Dashboard → Nuevas Aperturas
3. Ver 3 invitaciones pendientes
4. Seleccionar "Rotulación"
5. Click "Enviar Presupuesto"
6. Ver información del proyecto:
   - Categoría: Rotulación
   - Presupuesto estimado: €12,000
   - Fecha límite: 15 sep 2026
7. Completar formulario:
   - Importe: 11500.00
   - Plazo: 20 días
   - Garantía: 12 meses
   - Pago: "100% a la entrega"
   - Notas: "Incluye diseño, impresión e instalación"
8. Click "Guardar Borrador"
9. Toast: "Borrador guardado"
10. Volver a la lista
11. Volver a editar
12. Verificar datos pre-llenos
13. Click "Enviar Presupuesto"
14. Toast: "Presupuesto enviado"
15. Estado cambia a "Enviado"
16. Botón cambia a "Ver Presupuesto"
```

## Integración con Admin Portal

```bash
1. Login como admin (admin@test.com / admin123)
2. Ir a proyecto "Nueva apertura - Calle Carmen 50"
3. Tab "Proveedores"
4. ESPERADO:
   - Ver invitación de "Mobiliario" con estado "Presupuesto enviado"
   - Ver datos del proveedor
   - Mostrar que tiene presupuesto disponible
5. Tab "Presupuestos" (Feature #4 - próximo):
   - Podrá ver y comparar presupuestos recibidos
```

## Puntos de Verificación

### ✅ Funcionalidades Implementadas
- [x] Componente QuoteForm reutilizable
- [x] Página de envío de presupuesto
- [x] Carga de datos de invitación
- [x] Formulario con validación Zod
- [x] Guardar como borrador
- [x] Enviar presupuesto final
- [x] Editar borrador existente
- [x] Actualizar estado de invitación
- [x] Convertir EUR a céntimos automáticamente
- [x] Toast notifications
- [x] Loading states
- [x] Persistencia en sessionStorage
- [x] Referencia visual de presupuesto estimado

### 🔄 Comportamiento Mock
- Delay simulado: 300ms
- No requiere PDF (Feature #5)
- Estados: draft, submitted
- No validación de fechas de expiración
- sessionStorage como persistencia temporal
- Supplier ID hardcodeado: 'user_supplier_current'

### 📝 Notas para Producción
1. **Autenticación**: Obtener supplier_id del contexto de auth
2. **Upload de PDF**: Integrar con Feature #5 (Upload de Documentos)
3. **Validación de deadline**: Bloquear envío si fecha expirada
4. **Confirmación**: Añadir dialog de confirmación antes de enviar
5. **Email notifications**: Notificar al admin cuando proveedor envía presupuesto
6. **Edición limitada**: Bloquear edición de presupuestos ya enviados (o solo permitir antes de revisión)
7. **Historial de versiones**: Guardar historial si se permiten ediciones
8. **Cálculos automáticos**: Añadir calculadora de IVA, descuentos
9. **Comparación con estimado**: Destacar si presupuesto excede el presupuesto estimado
10. **Adjuntos múltiples**: Permitir varios documentos (catálogos, certificaciones)

## Resolución de Problemas

### Problema: No se cargan las invitaciones
**Solución**: 
1. Verificar que `getMyInvitations()` devuelve datos en modo mock
2. Verificar que user_supplier_current está en mockInvitations
3. Console log: `response.data` para debug

### Problema: Formulario no guarda
**Solución**:
1. Verificar validación Zod pasando
2. Verificar que `createQuote` o `updateQuote` se llama
3. Verificar que mockQuotes.push() se ejecuta

### Problema: Botón "Enviar" deshabilitado
**Solución**:
1. Verificar que importe tiene valor
2. Verificar que validación pasa
3. isLoading puede estar en true

### Problema: Redirect no funciona
**Solución**:
1. Verificar que response.success === true
2. Verificar que router.push() se ejecuta
3. Check console errors

### Problema: Toast no se muestra
**Solución**:
1. Verificar que Toaster component está en layout
2. Verificar imports de useToast
3. Check console errors

## API Endpoints (Mock)

```typescript
// Obtener invitaciones del proveedor actual
GET /openings/invitations
→ openingsApi.getMyInvitations()

// Obtener quote existente por invitación
GET /openings/invitations/:invitationId/quote
→ openingsApi.getQuoteByInvitation(invitationId)

// Crear nuevo presupuesto
POST /openings/categories/:categoryId/quotes
Body: { amount, delivery_days, warranty_months, payment_terms, notes, status }
→ openingsApi.createQuote(categoryId, data)

// Actualizar presupuesto existente
PATCH /openings/quotes/:quoteId
Body: { amount, delivery_days, warranty_months, payment_terms, notes, status }
→ openingsApi.updateQuote(quoteId, data)
```

## Próximos Pasos

Después de validar este módulo, continuar con:
1. **Tabla de Comparación** (Feature #4) - Admin compara presupuestos recibidos
2. **Upload de Documentos** (Feature #5) - Adjuntar PDFs y otros archivos
3. **Workflow de Estados** (Feature #6) - Gestión de transiciones de estado

## Archivos Creados/Modificados

```
src/components/openings/supplier/
  └── QuoteForm.tsx (NUEVO - 260 líneas)

src/app/(supplier)/supplier/openings/[categoryId]/quote/
  └── page.tsx (REEMPLAZADO - 240 líneas)

src/lib/api/
  └── openings-client.ts (MODIFICADO - +130 líneas)
     - createQuote: file opcional, status draft/submitted
     - getQuoteByInvitation: nueva función
     - updateQuote: nueva función
```

---
**Versión**: 1.0  
**Fecha**: 2026-08-19  
**Autor**: Sistema de Nuevas Aperturas Carrefour B2B
