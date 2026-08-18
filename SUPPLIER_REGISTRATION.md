# Registro de Proveedores - Documentación

## Resumen

Sistema completo de registro de proveedores para el marketplace B2B Carrefour, que reemplaza el proceso anterior basado en Google Forms con una solución integrada en Next.js.

## Arquitectura

### Flujo de Registro

1. **Registro Público** (`/supplier/register`)
   - Formulario multi-paso (3 páginas)
   - Sin autenticación requerida
   - Estado inicial: `pending`

2. **Revisión Admin** (`/admin/suppliers`)
   - Visualización de solicitudes pendientes
   - Descarga de archivos CSV y ZIP
   - Aprobar/Rechazar proveedores

3. **Aprobación**
   - Procesamiento de CSV
   - Creación de productos en Medusa
   - Upload de imágenes a Medusa Storage
   - Cambio de estado a `active`
   - Notificación por email

## Estructura de Archivos

### Tipos (`src/types/index.ts`)

```typescript
// Estado del proveedor
type SupplierStatus = 'pending' | 'active' | 'rejected' | 'suspended'

// Entidad Supplier completa
interface Supplier {
  id: string
  userId: string
  status: SupplierStatus
  
  // Datos legales (página 1)
  businessName: string
  legalName: string
  nifCif: string
  fiscalAddress: string
  municipality: string
  postalCode: string
  country: string
  iban: string
  email: string
  phone: string
  website?: string
  
  // Contacto (página 2)
  contactName: string
  contactSurname: string
  contactPosition: string
  contactEmail: string
  contactPhone: string
  
  // Archivos (página 3)
  productsCsvUrl?: string
  imagesZipUrl?: string
  
  // Gestión admin
  approvedBy?: string
  approvedAt?: Date | string
  rejectionReason?: string
  
  createdAt: string
  updatedAt: string
}
```

### Store Zustand (`src/lib/store/supplier-registration.ts`)

**Estado:**
- `currentStep`: Página actual (0-2)
- `formData`: Datos del formulario
- `productsCsv`: Archivo CSV (no persistido)
- `imagesZip`: Archivo ZIP (no persistido)

**Acciones:**
- `setCurrentStep(step)`: Cambiar página
- `nextStep()`: Avanzar (con validación)
- `prevStep()`: Retroceder
- `updateLegalData(data)`: Actualizar página 1
- `updateContactData(data)`: Actualizar página 2
- `setProductsCsv(file)`: Guardar CSV
- `setImagesZip(file)`: Guardar ZIP
- `reset()`: Limpiar formulario
- `isStepValid(step)`: Validar página

### Componentes

#### 1. Indicador de Progreso
**Archivo:** `src/components/supplier/SupplierStepIndicator.tsx`
- Muestra 3 pasos: Datos Legales → Contacto → Productos
- Responsive: barra de progreso en móvil
- Estados: completado, actual, pendiente

#### 2. Formulario Página 1 - Datos Legales
**Archivo:** `src/components/supplier/LegalDataForm.tsx`

**Campos:**
- Nombre Comercial
- Razón Social
- NIF/CIF (validación regex: `[0-9]{8}[A-Z]` o `[A-Z][0-9]{7}[0-9A-J]`)
- Dirección Fiscal (textarea)
- Municipio
- Código Postal (5 dígitos)
- País (select: España, Portugal, Francia)
- IBAN (validación: ES + 22 dígitos)
- Email (validación email)
- Teléfono (formato internacional)
- Website (opcional, validación URL)

**Validación:** react-hook-form + zod

#### 3. Formulario Página 2 - Contacto
**Archivo:** `src/components/supplier/ContactDataForm.tsx`

**Campos:**
- Nombre
- Apellidos
- Cargo en la Empresa
- Email de Contacto
- Teléfono de Contacto

**Navegación:** Botones Anterior/Continuar

#### 4. Formulario Página 3 - Productos
**Archivo:** `src/components/supplier/ProductsUploadForm.tsx`

**Archivos:**
- CSV/XLSX (máx 5MB)
  - Estructura: `PROVEEDOR,IMAGEN,NOMBRE,DESCRIPCIÓN,CARACTERISTICAS,COSTE UNITARIO,PCB,IMPORTE,IVA,PLAZO ENTREGA`
- ZIP (máx 50MB)
  - Contiene imágenes PNG
  - Nombres deben coincidir con columna IMAGEN del CSV

**Características:**
- Drag & drop
- Validación de tipo y tamaño
- Preview de archivos cargados
- Indicador visual de estado

#### 5. Página Principal de Registro
**Archivo:** `src/app/(supplier)/supplier/register/page.tsx`
- Orquesta los 3 formularios
- Header informativo
- Indicador de progreso
- Renderiza formulario según `currentStep`

#### 6. Panel Admin - Gestión de Proveedores
**Archivo:** `src/app/(backoffice)/admin/suppliers/page.tsx`

**Características:**
- Dashboard con estadísticas (pendientes, activos, rechazados)
- Lista de proveedores pendientes con:
  - Información completa de la empresa
  - Datos de contacto
  - Enlaces para descargar CSV y ZIP
- Botones de acción:
  - **Aprobar**: Confirmación con diálogo, procesa productos
  - **Rechazar**: Requiere motivo de rechazo

**Diálogos:**
1. **Aprobar Proveedor**: Confirmación con checklist de acciones
2. **Rechazar Proveedor**: Campo de texto para motivo (obligatorio)

### Utilidades

#### CSV Parser (`src/lib/utils/csv-parser.ts`)

**Funciones:**

1. `parseProductsCSV(file: File): Promise<ProductFromCSV[]>`
   - Lee archivo CSV/XLSX
   - Parsea líneas respetando comillas
   - Retorna array de productos

2. `parseCSVLine(line: string): string[]`
   - Parsea línea individual
   - Maneja valores entre comillas
   - Escapa comillas dobles

3. `validateProducts(products): { valid, errors }`
   - Valida campos obligatorios
   - Verifica tipos de datos
   - Valida formato de imagen (PNG)
   - Retorna lista de errores

4. `validateProductImages(products, zipFile): Promise<{ valid, errors }>`
   - TODO: Implementar con librería JSZip
   - Verificar que todas las imágenes existan en el ZIP

5. `generateProductsSummary(products)`
   - Calcula totales y promedios
   - Útil para preview antes de enviar

## Validaciones

### Página 1 - Datos Legales
- ✅ NIF/CIF: Formato español válido
- ✅ Código Postal: 5 dígitos
- ✅ IBAN: ES + 22 dígitos
- ✅ Email: Formato válido
- ✅ Teléfono: Formato internacional
- ✅ Website: URL válida (opcional)

### Página 2 - Contacto
- ✅ Todos los campos obligatorios
- ✅ Email: Formato válido
- ✅ Teléfono: Formato internacional

### Página 3 - Archivos
- ✅ CSV: Tipo .csv/.xlsx, máx 5MB
- ✅ ZIP: Tipo .zip, máx 50MB
- ✅ Ambos archivos obligatorios

### CSV de Productos
- ✅ Nombre obligatorio
- ✅ Imagen obligatoria (formato PNG)
- ✅ Coste unitario > 0
- ✅ PCB > 0
- ✅ IVA entre 0-100

## Integración Pendiente

### Backend API

**Endpoints necesarios:**

```typescript
// Crear proveedor
POST /api/suppliers
Body: FormData {
  // Datos del formulario
  businessName, legalName, nifCif, ...
  // Archivos
  productsCsv: File
  imagesZip: File
}
Response: { id, status: 'pending', ... }

// Listar proveedores (admin)
GET /api/suppliers?status=pending
Response: { suppliers: Supplier[] }

// Aprobar proveedor
POST /api/suppliers/:id/approve
Body: { approvedBy: string }
Response: { success: true }
// Triggers:
// 1. Parse CSV
// 2. Create products in Medusa
// 3. Upload images to Medusa Storage
// 4. Update supplier status to 'active'
// 5. Send email notification

// Rechazar proveedor
POST /api/suppliers/:id/reject
Body: { rejectionReason: string }
Response: { success: true }
// Triggers:
// 1. Update supplier status to 'rejected'
// 2. Send email notification
```

### Medusa Backend

**Entidades:**

1. **Custom Entity: Supplier**
   - Mapea a `Supplier` interface
   - Relación con `User` (1:1)
   - Campos adicionales para gestión

2. **Productos**
   - Creados desde CSV al aprobar
   - Vinculados al supplier
   - Imágenes subidas a Medusa Storage

**Storage:**
- Usar Medusa Storage para:
  - CSV original (audit trail)
  - ZIP de imágenes (backup)
  - Imágenes individuales procesadas

**Ejemplo CSV → Medusa Product:**
```typescript
{
  title: row.nombre,
  description: row.descripcion,
  variants: [{
    prices: [{ amount: row.costeUnitario * 100, currency_code: 'eur' }],
    sku: generateSKU(row),
    inventory_quantity: row.pcb,
  }],
  images: [{ url: uploadedImageUrl }],
  metadata: {
    proveedor: row.proveedor,
    caracteristicas: row.caracteristicas,
    plazoEntrega: row.plazoEntrega,
    iva: row.iva,
  }
}
```

## UI/UX

### Layout
- **Registro:** Utiliza layout `(supplier)` - sin navbar/footer
- **Admin:** Utiliza layout `(backoffice)` - con sidebar admin

### Diseño
- Gradiente de fondo en registro
- Cards con bordes y sombras
- Indicadores visuales de progreso
- Estados de archivos (pendiente/cargado)
- Botones con iconos
- Badges de estado con colores

### Responsive
- Grid adaptativo (1 col móvil, 2 cols desktop)
- Indicador de progreso diferente en móvil (barra)
- Tabla de admin con scroll horizontal

### Accesibilidad
- Labels apropiados
- ARIA attributes
- Navegación por teclado
- Mensajes de error descriptivos

## Testing

### Casos de Prueba

**Registro:**
1. ✅ Completar formulario paso a paso
2. ✅ Validación en cada página
3. ✅ No permitir avanzar sin datos válidos
4. ✅ Botón "Anterior" funciona
5. ✅ Persistencia de datos entre páginas
6. ✅ Upload de archivos
7. ✅ Validación de tipos de archivo
8. ✅ Límites de tamaño

**Admin:**
1. ✅ Listar proveedores pendientes
2. ✅ Descargar CSV y ZIP
3. ✅ Aprobar proveedor
4. ✅ Rechazar proveedor (con motivo)
5. ✅ Estadísticas actualizadas

## Próximos Pasos

1. **Integración Backend:**
   - [ ] Crear endpoints en Medusa
   - [ ] Implementar subida de archivos
   - [ ] Procesar CSV y crear productos
   - [ ] Sistema de notificaciones por email

2. **CSV Processor:**
   - [ ] Integrar librería JSZip para validar ZIP
   - [ ] Implementar extracción de imágenes
   - [ ] Upload batch de imágenes a Storage
   - [ ] Manejo de errores en procesamiento

3. **Portal del Proveedor:**
   - [ ] Dashboard del proveedor
   - [ ] Gestión de catálogo
   - [ ] Pedidos recibidos
   - [ ] Estadísticas

4. **Mejoras:**
   - [ ] Preview de CSV antes de enviar
   - [ ] Edición de datos antes de aprobar (admin)
   - [ ] Historial de cambios
   - [ ] Notificaciones en tiempo real
   - [ ] Búsqueda y filtros en admin

## Comandos de Desarrollo

```bash
# Instalar dependencias (si es necesario)
npm install react-hook-form @hookform/resolvers zod

# Ejecutar en desarrollo
npm run dev

# Acceder al registro
http://localhost:3000/supplier/register

# Acceder al admin (requiere autenticación)
http://localhost:3000/admin/suppliers
```

## Notas

- El sistema NO migra datos existentes del Google Forms
- El portal del proveedor ya existe, solo se implementa el registro
- Los archivos no se persisten en localStorage (solo metadatos)
- La validación del ZIP está pendiente de implementación completa
- Las llamadas a API son placeholders (`alert()` temporales)
