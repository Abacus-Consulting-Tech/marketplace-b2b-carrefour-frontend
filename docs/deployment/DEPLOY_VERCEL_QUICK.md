# 🚀 Deploy Rápido a Vercel - Módulo Nuevas Aperturas

## 📋 Información del Deploy

**Objetivo:** Desplegar frontend para que equipo de backend vea el módulo de Nuevas Aperturas funcionando.

**Estado:** Modo MOCK (sin backend necesario)

---

## ⚙️ Variables de Entorno Necesarias

Configura estas variables en Vercel Dashboard después del deploy:

```bash
# API Configuration (backend existente - no afecta al módulo de aperturas)
NEXT_PUBLIC_API_URL=https://marketplace-b2b-backend-dev.onrender.com
NEXT_PUBLIC_MERCUR_STORE_API=https://marketplace-b2b-backend-dev.onrender.com/store
NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY=pk_15f89d436badff43c2366d014c88536fa0307e92aeaeab294a2ee1d29710e1b9
NEXT_PUBLIC_MERCUR_REGION_ID=reg_01M0AAYKP7T4XSM0PWRYHQF0BE
NEXT_PUBLIC_CATALOG_SOURCE=mercur
NEXT_PUBLIC_CART_SOURCE=mercur

# ✅ NUEVAS APERTURAS - MODO MOCK (IMPORTANTE!)
NEXT_PUBLIC_MOCK_OPENINGS=true
NEXT_PUBLIC_MOCK_AUTH=true

# Stripe Keys (opcional, para checkout existente)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51U3Z5v1zMcBSmKZjzxd2FjQP0yNMOadfQp4wXzhqLNPTf3Zi1rhjoQ6mkrG5tWvg8zNkfz5899weN1SjhJApkTJF00PZB5DpjW
```

---

## 🎯 Pasos para Deploy

### 1. Instalar Vercel CLI (si no está instalado)

```bash
npm install -g vercel
```

### 2. Login en Vercel

```bash
vercel login
```

### 3. Deploy (Primera vez)

```bash
vercel
```

Respuestas sugeridas:
- **Set up and deploy?** → `Y`
- **Which scope?** → Tu organización/usuario
- **Link to existing project?** → `N`
- **Project name?** → `marketplace-b2b-carrefour-frontend`
- **In which directory?** → `.` (enter)
- **Want to override settings?** → `N`

### 4. Deploy a Producción

```bash
vercel --prod
```

---

## 🔐 Configurar Variables de Entorno en Vercel

### Opción A: Desde CLI (Recomendado)

```bash
# Nuevas Aperturas - MOCK MODE
vercel env add NEXT_PUBLIC_MOCK_OPENINGS production
# Responde: true

vercel env add NEXT_PUBLIC_MOCK_AUTH production
# Responde: true

# API URLs (backend existente)
vercel env add NEXT_PUBLIC_API_URL production
# Responde: https://marketplace-b2b-backend-dev.onrender.com

vercel env add NEXT_PUBLIC_MERCUR_STORE_API production
# Responde: https://marketplace-b2b-backend-dev.onrender.com/store

vercel env add NEXT_PUBLIC_MERCUR_PUBLISHABLE_API_KEY production
# Responde: pk_15f89d436badff43c2366d014c88536fa0307e92aeaeab294a2ee1d29710e1b9

vercel env add NEXT_PUBLIC_MERCUR_REGION_ID production
# Responde: reg_01M0AAYKP7T4XSM0PWRYHQF0BE

vercel env add NEXT_PUBLIC_CATALOG_SOURCE production
# Responde: mercur

vercel env add NEXT_PUBLIC_CART_SOURCE production
# Responde: mercur

vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# Responde: pk_test_51U3Z5v1zMcBSmKZjzxd2FjQP0yNMOadfQp4wXzhqLNPTf3Zi1rhjoQ6mkrG5tWvg8zNkfz5899weN1SjhJApkTJF00PZB5DpjW

# Re-deploy después de configurar variables
vercel --prod
```

### Opción B: Desde Dashboard Web

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Settings → Environment Variables
4. Añade cada variable de la lista de arriba
5. Re-deploy desde el dashboard

---

## 🧪 Credenciales de Prueba (MOCK)

Comparte estas credenciales con el equipo de backend:

### Admin
- **Email:** `admin@test.com`
- **Password:** `admin123`
- **Acceso:** `/admin/openings`

### Franquiciado
- **Email:** `franchisee@test.com`
- **Password:** `franchisee123`
- **Acceso:** `/franchisee/openings`

### Proveedor
- **Email:** `supplier@test.com`
- **Password:** `supplier123`
- **Acceso:** `/supplier/openings`

---

## 📱 Rutas del Módulo Nuevas Aperturas

### Admin:
- Lista: `/admin/openings`
- Detalle: `/admin/openings/proj_001`
- Nuevo proyecto: `/admin/openings/new`

### Franquiciado:
- Lista: `/franchisee/openings`
- Detalle: `/franchisee/openings/proj_001`

### Proveedor:
- Invitaciones: `/supplier/openings`
- Enviar presupuesto: `/supplier/openings/cat_001/quote`

---

## 📚 Documentación para Backend

Comparte estos archivos con el equipo de backend:

1. **`docs/BACKEND_GUIDE_NUEVAS_APERTURAS.md`** ⭐
   - Guía completa en español
   - Esquemas de base de datos SQL
   - Endpoints con ejemplos de curl
   - Queries SQL útiles
   - Datos seed listos para usar

2. **`TESTING_GUIDE_OPENINGS.md`**
   - Guía de testing del módulo
   - Credenciales mock
   - Flujos de prueba

3. **`docs/technical/NEW_STORE_OPENINGS_SPEC.md`**
   - Especificación técnica completa (inglés)

4. **`docs/technical/ESPECIFICACION_NUEVAS_APERTURAS.md`**
   - Especificación técnica completa (español)

---

## ✅ Checklist Post-Deploy

- [ ] Deploy exitoso a Vercel
- [ ] Variables de entorno configuradas
- [ ] Login como admin funciona (`admin@test.com`)
- [ ] Ruta `/admin/openings` carga correctamente
- [ ] Crear nuevo proyecto funciona
- [ ] Login como franquiciado funciona
- [ ] Login como proveedor funciona
- [ ] Compartir URL con equipo de backend
- [ ] Compartir documentación (BACKEND_GUIDE_NUEVAS_APERTURAS.md)

---

## 🔗 URL del Deploy

Después del deploy, obtendrás una URL como:

```
https://marketplace-b2b-carrefour-frontend.vercel.app
```

O si usas dominio personalizado:

```
https://tu-dominio.com
```

---

## 📧 Email para Backend

**Template de email:**

---

Asunto: Frontend Módulo Nuevas Aperturas - Listo para Revisión

Hola equipo,

El frontend del **Módulo de Nuevas Aperturas** ya está desplegado y listo para revisión.

**🔗 URL:** https://marketplace-b2b-carrefour-frontend.vercel.app

**🔐 Credenciales de prueba:**
- Admin: `admin@test.com` / `admin123`
- Franquiciado: `franchisee@test.com` / `franchisee123`
- Proveedor: `supplier@test.com` / `supplier123`

**📱 Rutas principales:**
- Admin: `/admin/openings`
- Franquiciado: `/franchisee/openings`
- Proveedor: `/supplier/openings`

**📚 Documentación técnica completa:**
Ver archivo `docs/BACKEND_GUIDE_NUEVAS_APERTURAS.md` en el repositorio:
- Esquemas de base de datos SQL listos para ejecutar
- Todos los endpoints con ejemplos de curl
- Datos seed de prueba
- Queries SQL útiles
- Roadmap de implementación en 4 fases

**⚙️ Estado actual:**
- Frontend 100% funcional en modo MOCK
- Todos los flujos implementados y probados
- Listo para conectar con backend real cambiando `NEXT_PUBLIC_MOCK_OPENINGS=false`

Cualquier duda, estoy disponible.

Saludos,
[Tu nombre]

---

---

## 🆘 Troubleshooting

### Error: "Vercel CLI not found"
```bash
npm install -g vercel
```

### Error: "Not logged in"
```bash
vercel login
```

### Error de build en Vercel
Revisa los logs en: https://vercel.com/dashboard → Tu proyecto → Deployments → Click en el deploy → Logs

### Variables de entorno no funcionan
Asegúrate de hacer **re-deploy** después de añadir variables:
```bash
vercel --prod
```

---

**¡Listo para compartir con backend! 🚀**
