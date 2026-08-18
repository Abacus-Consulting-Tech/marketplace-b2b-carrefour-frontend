# Instrucciones Rápidas de Deployment
## Marketplace B2B Carrefour → cdmon

---

## 🚀 Pasos para Subir la Aplicación

### 1️⃣ Construir la Aplicación (En tu Mac)

Abre una terminal normal (fuera de VS Code) y ejecuta:

```bash
# Ir al directorio del proyecto
cd "/Users/JuantxoCruz/Abacus Consulting (Work)/2026-abacus/2026-carrefour/marketplace-b2b-carrefour-frontend"

# Construir para producción
npm run build

# Verificar que se creó la carpeta .next
ls -la .next
```

### 2️⃣ Empaquetar para Subir

```bash
# Crear archivo comprimido con todo lo necesario
tar -czf marketplace-b2b-cdmon.tar.gz \
  .next \
  public \
  package.json \
  package-lock.json \
  next.config.js \
  README.md \
  DEPLOYMENT_GUIDE.md \
  GUIA_USUARIO_SEMANA_4.md

# Verificar el tamaño
ls -lh marketplace-b2b-cdmon.tar.gz
```

✅ **Resultado:** Tendrás un archivo `marketplace-b2b-cdmon.tar.gz` listo para subir

---

## 📤 Subir a cdmon

### Opción A: FileZilla / Cyberduck (Más Fácil)

1. Abre FileZilla o Cyberduck
2. Conecta a tu servidor cdmon (SFTP)
   - Host: tu-dominio.com o IP del servidor
   - Usuario: tu usuario cdmon
   - Contraseña: tu contraseña
   - Puerto: 22
3. Navega a tu directorio home: `/home/tu-usuario/`
4. Sube el archivo `marketplace-b2b-cdmon.tar.gz`
5. **Listo!** Ahora continúa con el paso 3

### Opción B: Terminal (SCP)

```bash
# Subir archivo
scp marketplace-b2b-cdmon.tar.gz usuario@tuservidor.cdmon.com:/home/usuario/

# Verificar que se subió
ssh usuario@tuservidor.cdmon.com "ls -lh /home/usuario/marketplace-b2b-cdmon.tar.gz"
```

---

## 🔧 Configurar en el Servidor cdmon

### 3️⃣ Conectarse por SSH

```bash
ssh usuario@tuservidor.cdmon.com
```

### 4️⃣ Descomprimir y Configurar

```bash
# Crear directorio para la app
mkdir -p ~/marketplace-b2b
cd ~/marketplace-b2b

# Mover y descomprimir
mv ~/marketplace-b2b-cdmon.tar.gz .
tar -xzf marketplace-b2b-cdmon.tar.gz

# Instalar dependencias de PRODUCCIÓN (importante!)
npm install --production

# Verificar que todo está
ls -la
```

### 5️⃣ Crear Archivo de Variables de Entorno

```bash
# Crear archivo .env.production
nano .env.production
```

Pegar este contenido (adapta la URL de tu API):

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

Guardar: `Ctrl+X`, luego `Y`, luego `Enter`

### 6️⃣ Iniciar la Aplicación

**Opción A - Inicio Simple (para probar):**
```bash
npm start
```

Debería mostrar:
```
> Ready on http://localhost:3000
```

Presiona `Ctrl+C` para detener y continúa con PM2.

**Opción B - PM2 (Recomendado para Producción):**

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar la app
pm2 start npm --name "marketplace-b2b" -- start

# Guardar configuración
pm2 save

# Auto-inicio al reiniciar servidor
pm2 startup
# (copia y ejecuta el comando que te muestre)

# Ver logs en tiempo real
pm2 logs marketplace-b2b

# Ver estado
pm2 status
```

---

## 🌐 Configurar Nginx (Si aplica)

Si tienes Nginx en cdmon:

```bash
# Editar configuración
sudo nano /etc/nginx/sites-available/marketplace
```

Pegar:
```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activar:
```bash
sudo ln -s /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## ✅ Verificar que Funciona

### En el servidor:

```bash
# Ver si está corriendo
pm2 status

# Ver logs
pm2 logs marketplace-b2b --lines 50

# Probar localmente
curl http://localhost:3000
```

### En tu navegador:

1. **Sin dominio:** `http://IP-DEL-SERVIDOR:3000`
2. **Con Nginx:** `http://tudominio.com`

---

## 🔄 Actualizar la Aplicación Después

Cuando hagas cambios:

**En tu Mac:**
```bash
npm run build
tar -czf marketplace-b2b-cdmon-v2.tar.gz .next public package*.json next.config.js
scp marketplace-b2b-cdmon-v2.tar.gz usuario@servidor:/home/usuario/
```

**En el servidor:**
```bash
cd ~/marketplace-b2b
tar -xzf ~/marketplace-b2b-cdmon-v2.tar.gz
npm install --production
pm2 restart marketplace-b2b
```

---

## 🆘 Comandos Útiles PM2

```bash
# Ver estado
pm2 status

# Ver logs en tiempo real
pm2 logs marketplace-b2b

# Reiniciar app
pm2 restart marketplace-b2b

# Detener app
pm2 stop marketplace-b2b

# Eliminar de PM2
pm2 delete marketplace-b2b

# Ver uso de memoria/CPU
pm2 monit
```

---

## ⚠️ Importante para cdmon

1. **Verifica que tu plan cdmon soporta Node.js**
   - Algunos planes básicos solo permiten PHP/HTML estático
   - Necesitas un plan VPS o Cloud

2. **Puerto 3000**
   - cdmon puede requerir usar puertos específicos
   - Consulta con su soporte si tienes problemas

3. **Memoria**
   - Next.js necesita al menos 512MB RAM
   - Recomendado: 1GB o más

4. **Node.js versión**
   - Verifica: `node -v` (debe ser v18 o superior)
   - Si es menor, actualiza Node.js primero

---

## 📞 Soporte cdmon

- **Web:** https://www.cdmon.com/es/soporte
- **Teléfono:** +34 935 316 226
- **Email:** soporte@cdmon.com

---

## 📋 Checklist Final

Antes de declarar "Listo!":

- [ ] Build completado sin errores
- [ ] Archivo .tar.gz creado y subido
- [ ] Descomprimido en el servidor
- [ ] `npm install --production` ejecutado
- [ ] .env.production creado y configurado
- [ ] App iniciada con PM2
- [ ] PM2 configurado para auto-inicio
- [ ] Nginx configurado (si aplica)
- [ ] App accesible desde navegador
- [ ] Logs sin errores: `pm2 logs`

---

¿Problemas? Consulta el archivo `DEPLOYMENT_GUIDE.md` para troubleshooting detallado.

**¡Éxito!** 🚀
