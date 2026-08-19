# 🔄 Flujo de Trabajo: Desarrollo vs Producción

## 📋 Estrategia de Ramas

### 🎯 Objetivo
Mantener **producción estable en Vercel** para que el equipo backend pueda revisar, mientras continuamos el desarrollo sin afectar la versión desplegada.

---

## 🌿 Ramas de Git

### `medusa-update` - Rama de Producción ⭐
- **Estado actual**: Desplegada en Vercel
- **URL**: https://marketplace-b2b-carrefour.vercel.app
- **Contenido**: Módulo Nuevas Aperturas completo + docs organizados
- **Regla**: ⚠️ **NO HACER PUSH** hasta que backend confirme revisión

### `dev` - Rama de Desarrollo 🚧
- **Uso**: Todo el desarrollo nuevo va aquí
- **Libertad total**: Puedes hacer commits, push, pruebas, etc.
- **Sin impacto**: No afecta a producción en Vercel

---

## 🛠️ Flujo de Trabajo Diario

### 1. Desarrollo Normal (SIEMPRE en rama `dev`)

```bash
# Verificar que estás en dev
git branch --show-current
# Debería mostrar: dev

# Si no estás en dev, cambiar a ella
git checkout dev

# Desarrollar normalmente
# ... hacer cambios en código ...

# Commit de tus cambios
git add .
git commit -m "feat: nueva funcionalidad X"

# Puedes hacer push a dev sin problemas
git push origin dev
```

### 2. Cuando Backend Apruebe y Quieras Actualizar Producción

```bash
# 1. Cambiar a rama de producción
git checkout medusa-update

# 2. Mergear cambios desde dev
git merge dev

# 3. Push a producción (esto triggerea Vercel)
git push origin medusa-update

# 4. Volver a dev para seguir trabajando
git checkout dev
```

### 3. Si Backend Pide Cambios en Producción (Hotfix)

```bash
# 1. Ir a producción
git checkout medusa-update

# 2. Hacer el cambio urgente
# ... editar archivo ...

# 3. Commit y push
git add .
git commit -m "fix: corrección urgente solicitada por backend"
git push origin medusa-update

# 4. Mergear el fix a dev para no perderlo
git checkout dev
git merge medusa-update

# 5. Seguir en dev
```

---

## 🚀 Despliegue Manual a Vercel

### Opción A: Despliegue Manual desde CLI (RECOMENDADO)

```bash
# Desplegar la rama actual a producción
vercel --prod

# Esto crea un deployment sin hacer push a Git
```

### Opción B: Desactivar Auto-Deploy en Vercel Dashboard

1. Ve a: https://vercel.com/dashboard
2. Selecciona el proyecto: `marketplace-b2b-carrefour`
3. Ve a **Settings** → **Git**
4. En **Production Branch**: déjalo como está (`medusa-update`)
5. En **Ignored Build Step**: añadir comando que siempre retorne `true`:
   ```bash
   # Esto hace que Vercel NO construya automáticamente
   exit 1
   ```

Ahora Vercel **NO construirá automáticamente** cuando hagas push. Solo desplegará cuando ejecutes `vercel --prod` manualmente.

---

## 📊 Estado Actual

```
medusa-update (PRODUCCIÓN) ← Vercel
    ↑
    │ (merge solo cuando backend apruebe)
    │
dev (DESARROLLO) ← Trabajas aquí
```

### Verificar Estado

```bash
# Ver ramas locales
git branch

# Ver rama actual (debería ser 'dev')
git branch --show-current

# Ver último commit en producción
git log medusa-update --oneline -1

# Ver último commit en dev
git log dev --oneline -1
```

---

## 🎨 Escenarios Comunes

### Escenario 1: Quiero probar algo rápido sin afectar nada

```bash
# Crear rama temporal desde dev
git checkout dev
git checkout -b experiment/nueva-idea

# Hacer pruebas...
# Si funciona, mergear a dev
git checkout dev
git merge experiment/nueva-idea

# Si no funciona, borrar
git branch -D experiment/nueva-idea
```

### Escenario 2: Backend dice "Actualiza producción con los cambios de dev"

```bash
git checkout medusa-update
git merge dev
git push origin medusa-update
# ⚠️ Esto triggerea auto-deploy en Vercel
```

### Escenario 3: Quiero ver cómo queda mi código en Vercel sin afectar producción

```bash
# Desde rama dev
git checkout dev

# Desplegar preview (no afecta producción)
vercel

# Vercel te dará una URL preview: https://marketplace-b2b-carrefour-xxx.vercel.app
```

---

## 🔧 Configuración de Vercel (Opcional)

### Crear `vercel.json` para Control Fino

```json
{
  "git": {
    "deploymentEnabled": {
      "medusa-update": true,
      "dev": false
    }
  },
  "github": {
    "silent": true,
    "autoJobCancelation": false
  }
}
```

Esto hace que:
- ✅ `medusa-update` → despliega a producción
- ❌ `dev` → NO despliega (solo preview manual con `vercel`)

---

## 📝 Comandos Rápidos

```bash
# Workflow diario
git checkout dev                    # Ir a desarrollo
git add . && git commit -m "..."   # Guardar cambios
git push origin dev                # Subir a GitHub (sin afectar Vercel)

# Actualizar producción (cuando backend apruebe)
git checkout medusa-update         # Ir a producción
git merge dev                      # Traer cambios de dev
git push origin medusa-update      # Desplegar a Vercel

# Preview en Vercel (sin afectar producción)
vercel                             # Desde cualquier rama

# Deploy manual a producción
vercel --prod                      # Desplegar sin push a Git
```

---

## ✅ Checklist de Seguridad

Antes de mergear `dev` → `medusa-update`:

- [ ] ✅ Código compilado sin errores: `npm run build`
- [ ] ✅ Tests pasando (si existen)
- [ ] ✅ Backend aprobó los cambios
- [ ] ✅ Verificado en preview de Vercel: `vercel` (desde dev)
- [ ] ✅ Variables de entorno correctas en `.env.production`
- [ ] ✅ Commit message claro y descriptivo

---

## 🎯 Reglas de Oro

1. **SIEMPRE trabaja en `dev`** - Nunca edites directamente `medusa-update`
2. **Solo mergea a producción cuando backend apruebe**
3. **Usa previews** (`vercel` sin `--prod`) para verificar antes de desplegar
4. **Nunca hagas `git push origin medusa-update`** hasta que backend revise
5. **Haz commits frecuentes en `dev`** - no hay riesgo

---

## 📞 Soporte

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Git Branches**: `git branch -a` para ver todas las ramas
- **Estado actual**: `git status` y `git branch --show-current`

---

**Última actualización**: 2026-08-19  
**Estado**: ✅ Configuración activa - Producción estable en `medusa-update`
