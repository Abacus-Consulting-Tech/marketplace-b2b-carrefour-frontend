> **OBSOLETO** — este flujo ya no se usa. El despliegue real es Docker + GitHub Actions: ver [docs/DEPLOYMENT.md](../DEPLOYMENT.md). Pendiente de borrado (docs/fix/02).

# 🚀 Deploy a Vercel - Marketplace B2B Carrefour

Guía paso a paso para desplegar tu aplicación Next.js a Vercel.

---

## ✅ Paso 1: Preparar el Proyecto

### Verificar que todo funciona localmente

```bash
cd "/Users/JuantxoCruz/Abacus Consulting (Work)/2026-abacus/2026-carrefour/marketplace-b2b-carrefour-frontend"

# Construir para producción
npm run build

# Probar el build
npm start
```

Abre http://localhost:3000 y verifica que funcione correctamente.

Presiona `Ctrl+C` para detener.

---

## 🔧 Paso 2: Instalar Vercel CLI

```bash
# Instalar Vercel globalmente
npm install -g vercel

# Verificar instalación
vercel --version
```

---

## 🎯 Paso 3: Deploy a Vercel

### Opción A: Deploy con CLI (Recomendado para primera vez)

```bash
# Asegúrate de estar en el directorio del proyecto
cd "/Users/JuantxoCruz/Abacus Consulting (Work)/2026-abacus/2026-carrefour/marketplace-b2b-carrefour-frontend"

# Deploy
vercel
```

**El CLI te preguntará:**

1. **Set up and deploy "~/...marketplace-b2b-carrefour-frontend"?**
   - Responde: `Y` (Yes)

2. **Which scope do you want to deploy to?**
   - Selecciona tu cuenta o crea una nueva

3. **Link to existing project?**
   - Responde: `N` (No) → Primera vez

4. **What's your project's name?**
   - Escribe: `marketplace-b2b-carrefour` (o el nombre que quieras)

5. **In which directory is your code located?**
   - Presiona Enter (usa `.` - directorio actual)

6. **Want to modify these settings?**
   - Responde: `N` (No) → Vercel detecta Next.js automáticamente

**¡Deploy iniciado!** ⏳

Verás:
```
Deploying...
✓ Deployment ready [35s]
https://marketplace-b2b-carrefour.vercel.app
```

---

## 🌐 Paso 4: Verificar el Deploy

Abre la URL que te dio Vercel en tu navegador:
```
https://marketplace-b2b-carrefour.vercel.app
```

### Probar funcionalidades:

1. ✅ Login con test accounts
2. ✅ Navegación entre páginas
3. ✅ Dashboards (franchisee, supplier, admin)
4. ✅ Profile y Settings
5. ✅ Checkout flow

---

## 🔄 Paso 5: Conectar con Git (Opcional pero Recomendado)

Para deployar automáticamente cada vez que hagas `git push`:

### 5.1 Inicializar Git (si no lo has hecho)

```bash
git init
git add .
git commit -m "Initial commit - Week 4 complete"
```

### 5.2 Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `marketplace-b2b-carrefour-frontend`
3. **NO** marques "Initialize with README"
4. Click "Create repository"

### 5.3 Conectar y Push

```bash
# Agregar remote (usa la URL que te dio GitHub)
git remote add origin https://github.com/TU-USUARIO/marketplace-b2b-carrefour-frontend.git

# Push
git branch -M main
git push -u origin main
```

### 5.4 Conectar Vercel con GitHub

```bash
# Link proyecto a Git
vercel --prod

# O desde el dashboard:
# 1. Ve a https://vercel.com/dashboard
# 2. Tu proyecto → Settings → Git
# 3. Connect Git Repository
```

**Ahora:** Cada `git push` = Deploy automático 🎉

---

## ⚙️ Paso 6: Configurar Variables de Entorno (Si necesitas)

### Desde la Terminal:

```bash
# Agregar variables de entorno
vercel env add NEXT_PUBLIC_API_URL

# Te preguntará el valor, escribe:
https://api.tudominio.com

# Selecciona environments: Production, Preview, Development (todos)
```

### Desde el Dashboard:

1. https://vercel.com/dashboard
2. Tu proyecto → Settings → Environment Variables
3. Add New
4. Name: `NEXT_PUBLIC_API_URL`
5. Value: `https://api.tudominio.com`
6. Environments: Production ✓ Preview ✓ Development ✓
7. Save

**Redeploy después de agregar variables:**
```bash
vercel --prod
```

---

## 🌍 Paso 7: Configurar Dominio Personalizado (Opcional)

Si quieres usar **botsoul.com** en lugar de `.vercel.app`:

### 7.1 En Vercel Dashboard

1. https://vercel.com/dashboard
2. Tu proyecto → Settings → Domains
3. Add Domain
4. Escribe: `botsoul.com`
5. Click Add

### 7.2 Configurar DNS en cdmon

Vercel te mostrará los registros DNS necesarios:

**En cdmon (Panel de Control):**

1. Login en cdmon
2. Dominios → botsoul.com → DNS
3. Agregar registros:

**Opción A - CNAME (Recomendado):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Opción B - A Record (Dominio raíz):**
```
Type: A
Name: @
Value: 76.76.21.21
```

4. Guardar cambios
5. Esperar propagación (5-30 minutos)

### 7.3 Verificar en Vercel

Vercel verificará automáticamente cuando el DNS esté listo.

**¡Listo!** Tu app estará en https://botsoul.com 🎉

---

## 📊 Comandos Útiles Vercel

```bash
# Deploy a producción
vercel --prod

# Deploy preview (staging)
vercel

# Ver logs en tiempo real
vercel logs https://marketplace-b2b-carrefour.vercel.app

# Listar todos tus proyectos
vercel ls

# Ver información del proyecto
vercel inspect

# Eliminar deployment
vercel remove deployment-url

# Login/Logout
vercel login
vercel logout

# Ver whoami
vercel whoami
```

---

## 🔍 Dashboard de Vercel

Accede a tu dashboard: https://vercel.com/dashboard

**Características:**

- ✅ **Deployments** - Ver todos los deploys (producción y preview)
- ✅ **Analytics** - Estadísticas de uso y performance
- ✅ **Logs** - Logs en tiempo real de tu aplicación
- ✅ **Settings** - Variables de entorno, dominios, Git
- ✅ **Speed Insights** - Métricas de rendimiento (Web Vitals)

---

## 🚨 Troubleshooting

### Error: "No Token Found"

```bash
vercel login
# Sigue las instrucciones para autenticarte
```

### Error: "Build Failed"

```bash
# Ver logs completos
vercel logs

# O en el dashboard: Deployments → Click en el deploy fallido → Building
```

### Error: "Cannot find module"

Verifica que todas las dependencias estén en `package.json`:

```bash
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Página 404 en rutas

Next.js debería manejar esto automáticamente. Verifica:
- Los archivos están en `src/app/` correctamente
- No hay errores de build

### Imágenes no cargan

Si usas `next/image`, agrega dominios en `next.config.js`:

```js
images: {
  domains: ['tu-cdn.com', 'images.unsplash.com'],
}
```

---

## 💰 Planes y Límites

### Plan Hobby (GRATIS) ✅

- ✅ 100GB bandwidth/mes
- ✅ Serverless Functions
- ✅ SSL automático
- ✅ Deployments ilimitados
- ✅ Preview deployments
- ✅ Dominios personalizados ilimitados
- ⚠️ Solo proyectos personales (no comerciales)

### Plan Pro ($20/mes) 🚀

- ✅ 1TB bandwidth/mes
- ✅ Todo lo de Hobby
- ✅ **Proyectos comerciales** ✅
- ✅ Analytics avanzados
- ✅ Soporte prioritario
- ✅ Protección DDoS

**Para este proyecto:** Empieza con Hobby, upgrade a Pro si lo vas a usar comercialmente.

---

## 🎯 Checklist Post-Deploy

Después del deploy, verifica:

- [ ] App accesible en URL de Vercel
- [ ] Login funciona (franchisee@test.com / supplier@test.com / admin@test.com)
- [ ] Dashboards cargan correctamente
- [ ] Navegación entre páginas funciona
- [ ] Profile y Settings funcionan
- [ ] Checkout flow completo funciona
- [ ] localStorage persiste datos
- [ ] Sin errores en consola del navegador
- [ ] Performance aceptable (< 3s carga inicial)
- [ ] Responsive en móvil

---

## 🔄 Workflow de Desarrollo

Con Git + Vercel:

```bash
# 1. Hacer cambios en tu código
nano src/app/page.tsx

# 2. Probar localmente
npm run dev

# 3. Commit y push
git add .
git commit -m "Update homepage"
git push

# 4. Deploy automático ✨
# Vercel lo detecta y deploya automáticamente

# 5. Preview URL
# Vercel te da una URL de preview única para cada commit

# 6. Merge a main
# Solo los commits en main van a producción
```

---

## 📧 Credenciales de Prueba

Para enviar a tu jefe junto con la URL:

```
🌐 URL: https://marketplace-b2b-carrefour.vercel.app

👤 Usuarios de prueba:

Franquiciado:
- Email: franchisee@test.com
- Contraseña: franchisee123

Proveedor:
- Email: supplier@test.com
- Contraseña: supplier123

Administrador:
- Email: admin@test.com
- Contraseña: admin123
```

---

## 🆘 Soporte Vercel

- **Docs:** https://vercel.com/docs
- **Discord:** https://vercel.com/discord
- **GitHub:** https://github.com/vercel/vercel
- **Email:** support@vercel.com (Plan Pro)

---

## ✅ Resumen Rápido

```bash
# 1. Instalar
npm install -g vercel

# 2. Deploy
cd "/Users/JuantxoCruz/Abacus Consulting (Work)/2026-abacus/2026-carrefour/marketplace-b2b-carrefour-frontend"
vercel

# 3. Producción
vercel --prod

# ¡Listo! 🎉
```

---

**¡Éxito con tu deploy!** 🚀

Si tienes problemas, revisa la sección de Troubleshooting o consulta los logs en el dashboard.
