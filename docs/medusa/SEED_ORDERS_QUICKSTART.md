# 🚀 QUICK START - Crear Pedidos de Prueba

## Opción 1: Backend Local (localhost:9000)

```bash
node scripts/seed-orders.mjs
```

## Opción 2: Backend Render DEV

```bash
MEDUSA_BACKEND_URL=https://marketplace-b2b-backend-dev.onrender.com \
node scripts/seed-orders.mjs
```

## Opción 3: Configurar variables de entorno

Crea un archivo `.env.seed` (o usa tus propios valores):

```bash
# .env.seed
MEDUSA_BACKEND_URL=https://marketplace-b2b-backend-dev.onrender.com
MEDUSA_ADMIN_EMAIL=admin@carrefour.dev
MEDUSA_ADMIN_PASSWORD=supersecret
```

Luego ejecuta:

```bash
source .env.seed && node scripts/seed-orders.mjs
```

---

## ⚡ Datos que se crearán

✅ **8 pedidos de ejemplo** con diferentes productos  
✅ Total ~25 items  
✅ Valor estimado: 4500+ EUR  
✅ Clientes: franchisee@test.com y admin@carrefour.dev  

---

## 📋 Requisitos previos

Antes de ejecutar el script, asegúrate de que:

1. ✅ El backend Medusa está corriendo
2. ✅ Ya existen productos en la BD (mínimo 5-10)
3. ✅ El usuario admin existe: `admin@carrefour.dev / supersecret`
4. ✅ Existe la región España con EUR

---

## 🔍 Verificar que funciona

Después de ejecutar el script, verifica en:

**Frontend Admin:**  
http://localhost:3000/admin/dashboard

**API directa:**
```bash
# Obtener token
TOKEN=$(curl -s -X POST https://marketplace-b2b-backend-dev.onrender.com/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@carrefour.dev","password":"supersecret"}' \
  | jq -r '.token')

# Ver pedidos
curl -H "Authorization: Bearer $TOKEN" \
  https://marketplace-b2b-backend-dev.onrender.com/admin/orders | jq
```

---

## 🆘 Troubleshooting

### Error: fetch failed
**Problema:** El backend no está corriendo en la URL especificada  
**Solución:** Verifica que el backend esté corriendo:
```bash
curl http://localhost:9000/health
# o
curl https://marketplace-b2b-backend-dev.onrender.com/health
```

### Error: Unauthorized
**Problema:** Credenciales incorrectas  
**Solución:** Verifica las credenciales admin o usa las por defecto:
```bash
MEDUSA_ADMIN_EMAIL=admin@carrefour.dev \
MEDUSA_ADMIN_PASSWORD=supersecret \
node scripts/seed-orders.mjs
```

### Error: No hay productos
**Problema:** La BD no tiene productos  
**Solución:** Primero necesitas crear productos. Ver `docs/medusa/DATOS_INICIALES.md`

---

## 📚 Documentación completa

Para más detalles, ver:
- [SEED_ORDERS_GUIDE.md](SEED_ORDERS_GUIDE.md) - Guía completa
- [sample-orders.json](sample-orders.json) - JSON con los datos
- [DATOS_INICIALES.md](DATOS_INICIALES.md) - Estructura completa de datos
