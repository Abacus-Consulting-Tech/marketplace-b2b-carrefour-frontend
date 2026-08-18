# Postman Collections - Marketplace B2B Carrefour

Esta carpeta contiene colecciones de Postman para testing de la API del Marketplace B2B Carrefour.

---

## 📦 Colecciones Disponibles

### 🆕 **Marketplace B2B Carrefour - Front to Back API** (RECOMENDADA)
**Archivo:** `marketplace-b2b-carrefour.postman_collection 1.json`

Colección completa para validar toda la comunicación frontend → backend con el entorno de Render DEV.

**Incluye:**
- ✅ Health check
- ✅ Autenticación completa (login, registro, forgot password)
- ✅ Catálogo de productos (store)
- ✅ Flujo completo de carrito y checkout (10 endpoints)
- ✅ Endpoints de administración

**Variables automáticas:**
- Captura automática de JWT token
- Auto-población de `productId`, `variantId`, `cartId`, `lineItemId`, `orderId`
- Encadenamiento automático de requests

**Ver guía completa:** [TESTING.md](./TESTING.md)

---

### 🔧 **Mercur Store API** (Legacy)
**Archivos:**
- `mercur-store-api.postman_collection.json`
- `mercur-local.postman_environment.json`

Colección anterior para testing con backend local Mercur.

**Uso:**
1. Importar ambos archivos en Postman
2. Seleccionar environment: `Carrefour B2B - Mercur Local`
3. Ejecutar en orden:
   - `Health / API Health`
   - `Catalog / List Regions`
   - `Catalog / List Products`
   - `Catalog / Retrieve Product`
   - `Cart / Create Cart`
   - `Cart / Retrieve Cart`
   - `Cart / Add Line Item`

**Notas:**
- Store API requiere header `x-publishable-api-key`
- Precios requieren `region_id`
- Cart line items requieren `offer_id` (no `variant_id`)

---

## 🚀 Quick Start

### Para Testing del Frontend Actual

1. **Importar colección:**
   ```
   Postman → Import → marketplace-b2b-carrefour.postman_collection 1.json
   ```

2. **Configurar credenciales:**
   - Variables → `adminEmail`: tu email de admin
   - Variables → `adminPassword`: tu password

3. **Ejecutar flujo completo:**
   - Folder `1 - Auth (frontend)` → Login
   - Folder `2 - Store Catalog` → Ver productos
   - Folder `3 - Store Cart and Checkout` → Completar orden
   - Folder `4 - Admin` → Ver pedidos

4. **Ver guía detallada:** [TESTING.md](./TESTING.md)

---

## 🔗 Variables de Entorno

### Variables Predefinidas

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `baseUrl` | `https://marketplace-b2b-backend-dev.onrender.com` | Backend en Render DEV |
| `publishableApiKey` | `pk_15f89d...` | API key para endpoints de store |
| `regionId` | `reg_01M07RY...` | Region ID de Medusa |
| `adminEmail` | `acano@abacus-consulting.net` | Email de admin (configurar) |
| `adminPassword` | `` | Password de admin (configurar) |

### Variables Auto-capturadas

Estas variables se capturan automáticamente durante las requests:

- `jwtToken` - Después de login exitoso
- `productId` - Después de listar productos
- `variantId` - Después de listar productos
- `cartId` - Después de crear carrito
- `lineItemId` - Después de añadir item al carrito
- `shippingOptionId` - Después de listar opciones de envío
- `orderId` - Después de completar orden

---

## 📝 Documentación Relacionada

- **[API Calls Actual](../medusa/API_CALLS_ACTUAL.md)** - Lista completa de endpoints usados por el frontend
- **[Datos Iniciales](../medusa/DATOS_INICIALES.md)** - Mock data para poblar la base de datos
- **[Testing Guide](./TESTING.md)** - Guía paso a paso de testing con Postman

---

## ⚠️ Estado Actual del Backend

**Verificado:** 18/08/2026

El backend en Render DEV está **operativo** pero la base de datos PostgreSQL está **VACÍA**.

**Impacto:**
- ✅ Endpoints responden correctamente (200 OK)
- ⚠️ Respuestas contienen arrays vacíos (`products: []`, `orders: []`)
- 📦 Solución: Backend team debe poblar BD con [DATOS_INICIALES.md](../medusa/DATOS_INICIALES.md)

---

## 🆘 Troubleshooting

### Error: "Could not get response" o timeout
- Verificar que backend esté activo: ejecutar `GET /health`
- Backend en Render puede tardar ~1min en despertar si está inactivo

### Error: 401 Unauthorized en endpoints /admin/*
- Ejecutar primero `POST /auth/user/emailpass` para obtener JWT
- Verificar que `jwtToken` se capturó correctamente en variables

### Productos vacíos
- Es normal: base de datos está vacía
- Backend está trabajando en poblar datos de [DATOS_INICIALES.md](../medusa/DATOS_INICIALES.md)
