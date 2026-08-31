# Módulo 7: Franchisee Catalog (Catálogo para Franquiciados)

## 📋 Descripción

Catálogo de productos B2B para franquiciados Carrefour:
- Navegación por categorías
- Búsqueda y filtros avanzados
- Vista de detalles de producto
- Añadir al carrito
- Precios especiales B2B
- Disponibilidad y stock

## 📄 Documentos para Backend

### ✅ Sin Documentación Específica Necesaria

Este módulo utiliza exclusivamente APIs estándar de Medusa para productos y carrito:

- **Products API**: `GET /store/products`
- **Cart API**: `POST /store/carts`, `POST /store/carts/:id/line-items`
- **Regions API**: `GET /store/regions`

Los productos ya incluyen los campos personalizados documentados en el **Módulo 6 (Product Management)**:
- `supplier_id`
- `franchisee_price`
- `margin_percentage`
- `is_approved`

## 🔗 Endpoints Utilizados (Medusa Estándar)

```
GET /store/products
GET /store/products/:id
GET /store/product-categories
POST /store/carts
POST /store/carts/:id/line-items
GET /store/regions/:id
```

## 📊 Datos Requeridos del Backend

El catálogo depende de:
- Productos aprobados (del Módulo 6)
- Categorías (del Módulo 3)
- Precios para franquiciados
- Stock disponible

## 🔄 Relación con Otros Módulos

- **Product Management**: Consume productos gestionados por admin
- **Categories**: Usa categorías para navegación
- **Franchisee Orders**: Crea pedidos desde el catálogo
- **Product Pricing**: Muestra precios aprobados

## ✅ Estado

- **Frontend**: Completado
- **Backend Docs**: ✅ No requiere documentación específica
- **Backend Implementation**: Usa Medusa 2.x estándar

## ⚠️ Realidad validada en DEV (2026-08-31)

- Aunque `/store/products` y rutas relacionadas existen como contrato objetivo, el catálogo real en DEV no está devolviendo datos utilizables para la UI actual.
- Por eso `catalog` y `products` siguen en mock en la configuración híbrida recomendada de `dev`.
- Este README debe leerse como contrato esperado de integración, no como confirmación de disponibilidad real en DEV.

## 📝 Notas

Este módulo es puramente de consumo de APIs estándar de Medusa. Toda la lógica de negocio específica ya está documentada en:
- **Módulo 6**: Product Management (gestión de productos)
- **Módulo 5**: Product Pricing (aprobación de precios)

---

**Última Actualización**: 31 de Agosto de 2026
