# Sistema de Presupuestos - Flujo Completo del Proveedor

## 📋 Resumen del Sistema

El sistema de presupuestos permite a los proveedores responder a invitaciones de proyectos de apertura, enviando cotizaciones que los franquiciados pueden comparar y adjudicar.

---

## 🔄 Flujo Completo: Cómo Funciona

### **1️⃣ Admin crea Proyecto de Apertura**
- **URL**: `http://localhost:3000/admin/openings/new`
- **Lo que hace**: 
  - Define un nuevo proyecto (nombre, ubicación, formato de tienda, etc.)
  - Carga documentos técnicos (planos, especificaciones)
  - Define categorías (Mobiliario, Rotulación, Electricidad, etc.)
  - Establece presupuestos estimados por categoría

**Mock Data**: Proyectos disponibles:
- `proj_001`: Madrid Carmen 50 (250m²)
- `proj_002`: Barcelona Paseo de Gracia (450m²)
- `proj_003`: Valencia Ruzafa (320m²)

---

### **2️⃣ Admin Invita a Proveedores Calificados** ✅
- **Cómo**: Desde la página de proyecto, admin invita proveedores específicos
- **Qué reciben**: Proveedores reciben invitación con acceso a:
  - Detalles del proyecto
  - Especificaciones técnicas
  - Documentos del proyecto (PDFs, planos, etc.)
  - Categorías disponibles para cotizar

**Mock Data**: Invitaciones disponibles en `/supplier/openings`
```
Mobiliario
  ├─ Proyecto: Madrid Carmen 50
  ├─ Presupuesto: 15,000 EUR
  └─ Status: Pendiente

Rotulación
  ├─ Proyecto: Madrid Carmen 50
  ├─ Presupuesto: 3,500 EUR
  └─ Status: Pendiente
```

---

### **3️⃣ Proveedor Envía Presupuesto** 📝
**NOVEDAD**: Ahora el enlace está visible en navegación

#### **Acceso**:
1. Supplier entra a su dashboard
2. **Nueva opción de menú**: "Gestión → Invitaciones"
3. Ve lista de invitaciones pendientes
4. Hace click en "Enviar Presupuesto"

**URL Directa**: `http://localhost:3000/supplier/openings`

#### **Lo que el Supplier rellena**:
- Importe total (EUR)
- Días de entrega (1-365)
- Meses de garantía (0-120)
- Términos de pago
- Notas técnicas
- PDF adjunto (opcional, max 10MB)

**Opciones**:
- ✅ Guardar como Borrador
- ✅ Enviar Definitivamente

---

### **4️⃣ Franquiciado Compara Ofertas y Adjudica**
- **URL**: `http://localhost:3000/marketplace/quotes`
- **Lo que ve**:
  - Lista de proyectos con cotizaciones recibidas
  - Filtros por proyecto, categoría, proveedor
  - Tabla comparativa con precios, términos, garantía
  - Opción de Ver Detalles de cada presupuesto

**Mock Data**: Múltiples presupuestos por categoría
```
Mobiliario - Madrid Carmen 50:
  ├─ Mobiliario Express: 15,200 EUR (45 días)
  ├─ Equipamientos Comerciales: 14,900 EUR (50 días)
  └─ ProMuebles S.A.: 15,500 EUR (30 días)
```

#### **Acciones Disponibles**:
1. **Rechazar**: Declina el presupuesto
2. **Más Información**: Ve detalles técnicos
3. **Adjudicar**: Selecciona como ganador
4. **Firmar Digitalmente**: Firma la orden de compra

---

### **5️⃣ Franquiciado Firma Digitalmente el Presupuesto** 🔐
**URL**: `http://localhost:3000/marketplace/quotes/[id]` → Botón "Firmar Digitalmente"

**Datos Capturados**:
```
✓ Firma digital (hash criptográfico)
✓ Timestamp exacto
✓ Dirección IP
✓ User Agent
✓ Consent / Términos aceptados
✓ Presupuesto final en PDF firmado
```

**Mock Data**: 3 ejemplos de firmas con diferentes dispositivos
```
sig_001: Maria García (Mac OS)
sig_002: Juan Pérez (Windows)
sig_003: Mobile (iPhone)
```

---

### **6️⃣ [PRÓXIMA FASE] Proveedor Acepta Adjudicación** 
*(Actualmente en desarrollo)*

**Lo que falta implementar**:
- [ ] Notificación a proveedor: "Has ganado el presupuesto de XYZ"
- [ ] Portal de aceptación: Proveedor firma aceptando orden de compra
- [ ] Seguimiento: Estado "Adjudicado - Pendiente Aceptación"
- [ ] Firma del proveedor capturando su conformidad

---

## 📂 Documentos del Proyecto - Mock Data

Cada proyecto incluye documentos técnicos que los proveedores pueden descargar:

### **Proyecto Madrid Carmen 50 (proj_001)**
```
doc_006 - Especificación Mobiliario Tienda (PDF)
doc_007 - Plano Planta - Madrid Carmen 50 (PDF)
doc_008 - Proyecto Rotulación Exterior (PDF)
doc_009 - Esquema Eléctrico Completo (PDF)
```

### **Proyecto Barcelona Paseo de Gracia (proj_002)**
```
doc_010 - Especificación Equipos Frigoríficos (PDF)
doc_011 - Plano de Fachada - Reformado (PDF)
doc_012 - Infraestructura IT y Seguridad (PDF)
```

---

## 🧪 Cómo Testear el Sistema Completo

### **Scenario 1: Desde Cero**
```
1. Admin: http://localhost:3000/admin/openings/new
   → Crear proyecto "Test Madrid" con categorías
   → Subir documentos técnicos (PDFs mock)
   
2. Admin: http://localhost:3000/admin/openings
   → Invitar proveedores a categorías específicas
   
3. Supplier: http://localhost:3000/supplier/openings
   → Ver invitación aparece en lista
   → Click "Enviar Presupuesto"
   → Rellenar forma y enviar
   
4. Franchisee: http://localhost:3000/marketplace/quotes
   → Ver presupuesto de supplier
   → Adjudicarlo
   → Firmar digitalmente
   
5. Supplier: http://localhost:3000/supplier/openings
   → Ver status cambió a "Adjudicado"
```

### **Scenario 2: Usando Mock Data**
```
Ya disponible en el sistema:

SUPPLIER:
  - URL: http://localhost:3000/supplier/openings
  - Ver: 3 invitaciones (Mobiliario, Rotulación, Equipamiento)
  - Cambiar status, enviar presupuestos de prueba

FRANCHISEE (Quotes):
  - URL: http://localhost:3000/marketplace/quotes
  - Ver: Múltiples presupuestos ya cargados
  - Probar filtrado y adjudicación
  - Probar firma digital

DOCUMENTS:
  - 12 documentos técnicos preparados
  - Disponibles en proyectos: proj_001, proj_002, proj_test_001
```

---

## 🔑 URLs Principales

| Rol | Acción | URL |
|-----|--------|-----|
| **Admin** | Ver Aperturas | `/admin/openings` |
| **Admin** | Crear Apertura | `/admin/openings/new` |
| **Admin** | Detalle Proyecto | `/admin/openings/[id]` |
| **Supplier** | Ver Invitaciones | `/supplier/openings` ✨ **AHORA VISIBLE** |
| **Supplier** | Enviar Presupuesto | `/supplier/openings/[id]/quote/[categoryId]` |
| **Franchisee** | Comparar Presupuestos | `/marketplace/quotes` |
| **Franchisee** | Detalle Presupuesto | `/marketplace/quotes/[id]` |

---

## 📊 Estado Actual de Implementación

### ✅ Completado
- Creación de proyectos por admin
- Invitaciones a proveedores
- Formulario de presupuestos
- Vista de comparativa de presupuestos
- Firma digital de franquiciado
- Mock data completa
- Navegación visible para suppliers

### ⚠️ En Desarrollo
- Notificaciones de adjudicación
- Aceptación de presupuesto por proveedor
- Firma del proveedor
- Seguimiento de estado end-to-end

### ❌ Pendiente
- Integración con sistema de pagos
- Emisión de orden de compra automática
- Sistema de entregas y seguimiento
- Resolución de disputas

---

## 🛠️ API Endpoints de Referencia

```typescript
// Obtener invitaciones del supplier
GET /api/openings/my-invitations

// Enviar presupuesto
POST /supplier/openings/{category_id}/quote
Body: {
  amount: number,
  delivery_days: number,
  warranty_months: number,
  payment_terms: string,
  notes?: string,
  pdf_file?: File
}

// Obtener presupuestos de proyecto
GET /api/quotes/project/{project_id}

// Adjudicar presupuesto
PUT /api/quotes/{quote_id}/award

// Firmar digitalmente
POST /api/quotes/{quote_id}/sign
Body: {
  signature_hash: string,
  consent_text: string,
  terms_version: string
}
```

---

## 🎯 Próximos Pasos

Para completar el flujo supplier-to-franchisee:

1. **Agregar Acceptance Portal**: Supplier firma aceptando orden de compra
2. **Notificaciones**: Event system para notificar cambios de estado
3. **Documentos Firmados**: Generar PDF con firmas de ambas partes
4. **Audit Trail**: Historial completo de transacciones
5. **Payment Integration**: Conexión con sistema de pagos

---

**Última Actualización**: 2026-08-26  
**Estado**: Supplier navigation working ✨
