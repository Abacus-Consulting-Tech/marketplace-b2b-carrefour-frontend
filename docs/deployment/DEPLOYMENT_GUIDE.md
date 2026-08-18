# Guía de Despliegue - Marketplace B2B Carrefour
## Deployment a Servidor cdmon

---

## 📋 Requisitos Previos

### En el servidor cdmon:
- Node.js 18.x o superior instalado
- npm o yarn
- Acceso SSH al servidor
- Puerto disponible (por defecto 3000)

---

## 🚀 Opción 1: Despliegue Manual (Recomendado para cdmon)

### Paso 1: Construir la Aplicación Localmente

```bash
# Limpiar instalación (opcional)
rm -rf node_modules .next

# Instalar dependencias
npm install

# Construir para producción
npm run build
```

### Paso 2: Preparar Archivos para Subir

Necesitas subir estos archivos/carpetas al servidor:

```
✅ .next/                 (carpeta generada por el build)
✅ node_modules/          (dependencias de producción)
✅ public/                (archivos estáticos)
✅ package.json           (configuración de dependencias)
✅ package-lock.json      (versiones exactas)
✅ next.config.js         (configuración de Next.js)
```

**NO subir:**
- `.git/`
- `src/` (código fuente, ya compilado en .next)
- `.env.local` (variables de desarrollo)
- `node_modules/` completo (reinstalar en servidor)

### Paso 3: Comprimir para Subir

```bash
# Crear archivo comprimido (excluye archivos innecesarios)
tar -czf marketplace-b2b.tar.gz \
  .next \
  public \
  package.json \
  package-lock.json \
  next.config.js \
  README.md
```

### Paso 4: Subir al Servidor cdmon

**Opción A - SFTP/FTP:**
1. Conectar via SFTP (FileZilla, Cyberduck, etc.)
2. Crear directorio: `/home/usuario/marketplace-b2b/`
3. Subir `marketplace-b2b.tar.gz`
4. Conectar por SSH y descomprimir:
   ```bash
   ssh usuario@tudominio.com
   cd /home/usuario/marketplace-b2b/
   tar -xzf marketplace-b2b.tar.gz
   ```

**Opción B - SCP desde terminal:**
```bash
scp marketplace-b2b.tar.gz usuario@tudominio.com:/home/usuario/
ssh usuario@tudominio.com
cd /home/usuario/
mkdir marketplace-b2b
mv marketplace-b2b.tar.gz marketplace-b2b/
cd marketplace-b2b
tar -xzf marketplace-b2b.tar.gz
```

### Paso 5: Instalar Dependencias en el Servidor

```bash
# Conectado por SSH en el servidor
cd /home/usuario/marketplace-b2b/

# Instalar SOLO dependencias de producción
npm install --production

# O si quieres todas (desarrollo incluido)
npm install
```

### Paso 6: Configurar Variables de Entorno

Crear archivo `.env.production` en el servidor:

```bash
nano .env.production
```

Contenido mínimo:
```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

### Paso 7: Iniciar la Aplicación

**Iniciar manualmente (para probar):**
```bash
npm start
# O especificando puerto
PORT=3000 npm start
```

**Iniciar con PM2 (recomendado para producción):**
```bash
# Instalar PM2 globalmente (si no está instalado)
npm install -g pm2

# Iniciar la aplicación
pm2 start npm --name "marketplace-b2b" -- start

# Guardar configuración para auto-inicio
pm2 save
pm2 startup

# Ver logs
pm2 logs marketplace-b2b

# Ver estado
pm2 status

# Reiniciar
pm2 restart marketplace-b2b

# Detener
pm2 stop marketplace-b2b
```

---

## 🌐 Opción 2: Configurar Nginx como Proxy Reverso

Si tienes Nginx instalado en cdmon:

```nginx
# /etc/nginx/sites-available/marketplace-b2b

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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activar y reiniciar Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/marketplace-b2b /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 Opción 3: HTTPS con SSL (Let's Encrypt)

```bash
# Instalar certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tudominio.com -d www.tudominio.com

# Renovación automática (ya configurada por certbot)
sudo certbot renew --dry-run
```

---

## 📦 Opción 4: Despliegue con Git (Actualización Fácil)

### Setup inicial en el servidor:

```bash
# En el servidor
cd /home/usuario/
git clone https://github.com/tu-usuario/marketplace-b2b.git
cd marketplace-b2b
npm install
npm run build
pm2 start npm --name "marketplace-b2b" -- start
```

### Para actualizar después:

```bash
cd /home/usuario/marketplace-b2b
git pull
npm install
npm run build
pm2 restart marketplace-b2b
```

---

## 🔧 Script de Actualización Automática

Crear archivo `deploy.sh` en el servidor:

```bash
#!/bin/bash
cd /home/usuario/marketplace-b2b
git pull origin main
npm install --production
npm run build
pm2 restart marketplace-b2b
echo "✅ Deployment completado"
```

Dar permisos de ejecución:
```bash
chmod +x deploy.sh
```

Ejecutar:
```bash
./deploy.sh
```

---

## 📊 Monitorización

### Ver logs en tiempo real:
```bash
pm2 logs marketplace-b2b --lines 100
```

### Monitoreo de recursos:
```bash
pm2 monit
```

### Reinicio automático en caso de error:
PM2 ya lo hace automáticamente.

---

## 🐛 Troubleshooting

### Error: Puerto 3000 ya en uso
```bash
# Encontrar proceso usando el puerto
lsof -i :3000
# O
netstat -tulpn | grep 3000

# Matar proceso
kill -9 <PID>

# O usar otro puerto
PORT=3001 npm start
```

### Error: Falta memoria
```bash
# Aumentar límite de memoria de Node.js
NODE_OPTIONS="--max-old-space-size=2048" npm start

# O con PM2
pm2 start npm --name "marketplace-b2b" --node-args="--max-old-space-size=2048" -- start
```

### Error: Dependencias faltantes
```bash
# Reinstalar todo
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Limpiar caché de Next.js
```bash
rm -rf .next
npm run build
```

---

## ✅ Checklist Pre-Deployment

- [ ] Build local exitoso (`npm run build`)
- [ ] No hay errores de TypeScript (`npm run type-check`)
- [ ] Variables de entorno configuradas
- [ ] Archivos comprimidos correctamente
- [ ] Node.js instalado en servidor (v18+)
- [ ] Puerto 3000 disponible (o el que elijas)
- [ ] PM2 instalado y configurado
- [ ] Nginx configurado (si aplica)
- [ ] SSL configurado (si aplica)
- [ ] Backup de versión anterior (si existe)

---

## 📝 Notas Importantes para cdmon

1. **Verificar soporte Node.js:** Algunos planes de cdmon pueden no soportar Node.js. Asegúrate de tener un plan compatible.

2. **Alternativa Static Export:** Si cdmon solo soporta hosting estático, necesitarás exportar la app como static (requiere cambios en el código).

3. **Base de Datos:** Actualmente la app usa localStorage (solo navegador). Para producción necesitarás una base de datos real.

4. **API Backend:** La app actualmente usa mock data. Necesitarás implementar un backend real.

---

## 🔗 URLs Importantes

- **Producción:** https://tudominio.com
- **PM2 Dashboard:** `pm2 web` (puerto 9615)
- **Logs:** `/home/usuario/.pm2/logs/`

---

## 📞 Contacto Soporte cdmon

- Web: https://www.cdmon.com/es/soporte
- Teléfono: +34 935 316 226

---

**Última actualización:** Agosto 2026  
**Versión:** 1.0.0
