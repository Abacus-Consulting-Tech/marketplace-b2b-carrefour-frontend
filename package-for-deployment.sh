#!/bin/bash

# Script de Empaquetado para Deployment
# Marketplace B2B Carrefour - cdmon

echo "🚀 Preparando aplicación para deployment..."

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Limpiar build anterior
echo -e "${BLUE}📦 Paso 1: Limpiando builds anteriores...${NC}"
rm -rf .next
rm -f marketplace-b2b-*.tar.gz

# 2. Instalar dependencias frescas
echo -e "${BLUE}📦 Paso 2: Instalando dependencias...${NC}"
npm install

# 3. Build de producción
echo -e "${BLUE}🔨 Paso 3: Construyendo aplicación...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}❌ Error en el build. Revisa los errores arriba.${NC}"
    exit 1
fi

# 4. Crear directorio temporal
echo -e "${BLUE}📂 Paso 4: Preparando archivos...${NC}"
mkdir -p deployment-temp
cp -r .next deployment-temp/
cp -r public deployment-temp/
cp package.json deployment-temp/
cp package-lock.json deployment-temp/
cp next.config.js deployment-temp/
cp README.md deployment-temp/ 2>/dev/null || true

# 5. Crear archivo .env.production de ejemplo
echo -e "${BLUE}⚙️  Paso 5: Creando .env.production de ejemplo...${NC}"
cat > deployment-temp/.env.production.example << 'EOF'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://api.tudominio.com
# Añade aquí otras variables de entorno necesarias
EOF

# 6. Crear instrucciones de deployment
echo -e "${BLUE}📝 Paso 6: Creando instrucciones...${NC}"
cat > deployment-temp/DEPLOY.md << 'EOF'
# Instrucciones de Deployment

## 1. Descomprimir en el servidor
```bash
tar -xzf marketplace-b2b-*.tar.gz
cd marketplace-b2b
```

## 2. Instalar dependencias de producción
```bash
npm install --production
```

## 3. Configurar variables de entorno
```bash
cp .env.production.example .env.production
nano .env.production  # Editar con tus valores
```

## 4. Iniciar con PM2
```bash
npm install -g pm2
pm2 start npm --name "marketplace-b2b" -- start
pm2 save
pm2 startup
```

## 5. Ver logs
```bash
pm2 logs marketplace-b2b
```

## URL
La aplicación estará disponible en: http://localhost:3000
(Configura Nginx como proxy para usar tu dominio)
EOF

# 7. Comprimir todo
echo -e "${BLUE}🗜️  Paso 7: Comprimiendo archivos...${NC}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="marketplace-b2b-${TIMESTAMP}.tar.gz"

cd deployment-temp
tar -czf "../${FILENAME}" .
cd ..

# 8. Limpiar temporal
rm -rf deployment-temp

# 9. Mostrar tamaño
SIZE=$(du -h "${FILENAME}" | cut -f1)

echo ""
echo -e "${GREEN}✅ ¡Empaquetado completado!${NC}"
echo ""
echo -e "${GREEN}📦 Archivo: ${FILENAME}${NC}"
echo -e "${GREEN}📊 Tamaño: ${SIZE}${NC}"
echo ""
echo -e "${BLUE}📤 Próximos pasos:${NC}"
echo "1. Sube ${FILENAME} a tu servidor cdmon"
echo "2. Conéctate por SSH: ssh usuario@tuservidor.com"
echo "3. Descomprime: tar -xzf ${FILENAME}"
echo "4. Sigue las instrucciones en DEPLOY.md"
echo ""
echo -e "${YELLOW}💡 Tip: Lee DEPLOYMENT_GUIDE.md para instrucciones detalladas${NC}"
echo ""
