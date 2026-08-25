# Módulo de Categorías - Especificación Backend

**Fecha**: 25 de Agosto de 2026  
**Estado**: ✅ COMPLETADO  
**Versión**: 1.0

---

## 📋 Resumen Ejecutivo

Sistema de categorías para el Marketplace B2B Carrefour con dos tipos de categorías:

1. **Categorías de Productos**: Para organizar el catálogo de productos del marketplace
2. **Categorías de Aperturas**: Para definir necesidades en proyectos de apertura de franquicias

## 🗄️ Tipos de Categorías

### 1. Categorías de Productos (Marketplace)

Organizan el catálogo de productos B2B para franquiciados:

- **Uniformes**: Polos, chaquetas, delantales corporativos
- **Folletos y Publicidad**: Material promocional impreso
- **Señalización en Tienda**: Carteles, vinilos, tótems
- **Equipamientos**: Básculas, expositores, carros de transporte
- **Merchandising**: Bolsas, bolígrafos, tazas corporativas

### 2. Categorías de Aperturas (Opening Projects)

Definen necesidades para proyectos de apertura de franquicias:

- **Mobiliario Comercial**: Estanterías, vitrinas, mostradores
- **Rotulación y Señalética**: Rótulos exteriores e interiores
- **Equipamiento IT**: TPVs, servidores, redes
- **Equipamiento de Cocina**: Hornos, freidoras, cámaras frigoríficas
- **Equipamiento de Limpieza**: Maquinaria industrial de limpieza

---

## 🔗 Endpoints API

### GET /admin/product-categories
Lista todas las categorías de productos (Medusa estándar)

### GET /store/product-categories
Lista categorías visibles para franquiciados (Medusa estándar)

### GET /admin/opening-categories
Lista categorías para proyectos de apertura

### POST /admin/opening-categories
Crear nueva categoría de apertura

### PATCH /admin/opening-categories/:id
Actualizar categoría de apertura

### DELETE /admin/opening-categories/:id
Eliminar categoría de apertura

---

## 🗄️ DATABASE SEED DATA

### Script SQL Completo

```sql
-- ============================================================================
-- CATEGORIES MODULE - DATABASE SEED DATA
-- Sistema de categorías para Marketplace B2B Carrefour
-- Compatible con Medusa + Mercur framework
-- ============================================================================

-- ============================================================================
-- 1. CATEGORÍAS DE PRODUCTOS (Medusa product_category)
-- ============================================================================

-- NOTA: Medusa 2.x ya incluye la tabla product_category
-- Solo insertamos datos de seed

-- Categorías principales de productos
INSERT INTO product_category (id, name, handle, description, is_active, is_internal, created_at, updated_at)
VALUES
    ('pcat_uniformes', 'Uniformes', 'uniformes', 'Uniformes corporativos y ropa de trabajo', true, false, NOW(), NOW()),
    ('pcat_folletos', 'Folletos y Publicidad', 'folletos-publicidad', 'Material promocional impreso', true, false, NOW(), NOW()),
    ('pcat_senalizacion', 'Señalización en Tienda', 'senalizacion-tienda', 'Carteles, vinilos y elementos de señalización', true, false, NOW(), NOW()),
    ('pcat_equipamientos', 'Equipamientos', 'equipamientos', 'Equipamiento para establecimientos comerciales', true, false, NOW(), NOW()),
    ('pcat_merchandising', 'Merchandising', 'merchandising', 'Artículos promocionales y merchandising corporativo', true, false, NOW(), NOW());

-- Subcategorías de Uniformes
INSERT INTO product_category (id, name, handle, description, parent_category_id, is_active, is_internal, created_at, updated_at)
VALUES
    ('pcat_uniformes_polos', 'Polos Corporativos', 'uniformes-polos', 'Polos con bordado corporativo', 'pcat_uniformes', true, false, NOW(), NOW()),
    ('pcat_uniformes_chaquetas', 'Chaquetas de Trabajo', 'uniformes-chaquetas', 'Chaquetas y cazadoras de trabajo', 'pcat_uniformes', true, false, NOW(), NOW()),
    ('pcat_uniformes_delantales', 'Delantales', 'uniformes-delantales', 'Delantales de trabajo', 'pcat_uniformes', true, false, NOW(), NOW());

-- Subcategorías de Equipamientos
INSERT INTO product_category (id, name, handle, description, parent_category_id, is_active, is_internal, created_at, updated_at)
VALUES
    ('pcat_equip_basculas', 'Básculas y Balanzas', 'equipamientos-basculas', 'Equipos de pesaje profesional', 'pcat_equipamientos', true, false, NOW(), NOW()),
    ('pcat_equip_expositores', 'Expositores', 'equipamientos-expositores', 'Mobiliario expositor', 'pcat_equipamientos', true, false, NOW(), NOW()),
    ('pcat_equip_transporte', 'Equipos de Transporte', 'equipamientos-transporte', 'Carros y equipos de transporte', 'pcat_equipamientos', true, false, NOW(), NOW());

-- ============================================================================
-- 2. CATEGORÍAS DE APERTURAS (Custom table: opening_categories)
-- ============================================================================

-- Crear tabla de categorías de aperturas
CREATE TABLE IF NOT EXISTS opening_categories (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    handle VARCHAR NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR,
    
    -- Presupuesto estimado (en céntimos)
    estimated_budget_min INTEGER,
    estimated_budget_max INTEGER,
    
    -- Prioridad en proyectos
    priority INTEGER DEFAULT 0,
    
    -- Estado
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Metadatos
    metadata JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_opening_categories_handle ON opening_categories(handle);
CREATE INDEX IF NOT EXISTS idx_opening_categories_active ON opening_categories(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_opening_categories_priority ON opening_categories(priority DESC);

-- Insertar categorías de aperturas
INSERT INTO opening_categories (
    id, name, handle, description, icon,
    estimated_budget_min, estimated_budget_max, priority,
    is_active, metadata
) VALUES
    (
        'ocat_mobiliario',
        'Mobiliario Comercial',
        'mobiliario-comercial',
        'Estanterías, vitrinas, mostradores, mobiliario general para el establecimiento',
        'sofa',
        3000000,  -- €30,000
        8000000,  -- €80,000
        1,
        true,
        '{"typical_items": ["Estanterías metálicas", "Vitrinas refrigeradas", "Mostradores de caja", "Góndolas", "Mesas de trabajo"]}'
    ),
    (
        'ocat_rotulacion',
        'Rotulación y Señalética',
        'rotulacion-senaletica',
        'Rótulos exteriores e interiores, señalización del establecimiento',
        'signpost',
        1000000,  -- €10,000
        2500000,  -- €25,000
        2,
        true,
        '{"typical_items": ["Rótulo exterior luminoso", "Señalización interior", "Vinilos", "Placas identificativas"]}'
    ),
    (
        'ocat_equipamiento_it',
        'Equipamiento IT',
        'equipamiento-it',
        'TPVs, servidores, redes, cableado, equipamiento informático',
        'monitor',
        1500000,  -- €15,000
        4000000,  -- €40,000
        3,
        true,
        '{"typical_items": ["Terminales TPV", "Servidor local", "Cableado red", "Router y switches", "Impresoras"]}'
    ),
    (
        'ocat_equipamiento_cocina',
        'Equipamiento de Cocina',
        'equipamiento-cocina',
        'Hornos, freidoras, cámaras frigoríficas, equipamiento de cocina industrial',
        'chef-hat',
        2000000,  -- €20,000
        6000000,  -- €60,000
        4,
        true,
        '{"typical_items": ["Horno industrial", "Freidora", "Cámara frigorífica", "Vitrina caliente", "Mesa de trabajo inox"]}'
    ),
    (
        'ocat_equipamiento_limpieza',
        'Equipamiento de Limpieza',
        'equipamiento-limpieza',
        'Maquinaria industrial de limpieza y mantenimiento',
        'spray-can',
        500000,   -- €5,000
        1500000,  -- €15,000
        5,
        true,
        '{"typical_items": ["Fregadora industrial", "Aspirador industrial", "Hidrolimpiadora", "Carros de limpieza"]}'
    ),
    (
        'ocat_sistemas_seguridad',
        'Sistemas de Seguridad',
        'sistemas-seguridad',
        'Cámaras, alarmas, control de accesos',
        'shield',
        800000,   -- €8,000
        2000000,  -- €20,000
        6,
        true,
        '{"typical_items": ["Cámaras de seguridad", "Sistema de alarma", "Control de accesos", "Grabador DVR"]}'
    ),
    (
        'ocat_climatizacion',
        'Climatización',
        'climatizacion',
        'Aire acondicionado, calefacción, ventilación',
        'snowflake',
        1200000,  -- €12,000
        3500000,  -- €35,000
        7,
        true,
        '{"typical_items": ["Unidades de aire acondicionado", "Sistema de ventilación", "Cortinas de aire"]}'
    );

-- ============================================================================
-- 3. RELACIÓN CATEGORÍAS DE APERTURAS CON PROYECTOS
-- ============================================================================

-- Esta tabla ya existe en el módulo de Openings como opening_project_categories
-- pero la documentamos aquí para completar el contexto

-- CREATE TABLE IF NOT EXISTS opening_project_categories (
--     id VARCHAR PRIMARY KEY,
--     project_id VARCHAR NOT NULL REFERENCES opening_projects(id) ON DELETE CASCADE,
--     category_id VARCHAR NOT NULL REFERENCES opening_categories(id) ON DELETE RESTRICT,
--     required BOOLEAN NOT NULL DEFAULT true,
--     notes TEXT,
--     created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
--     CONSTRAINT unique_project_category UNIQUE(project_id, category_id)
-- );

-- ============================================================================
-- 4. DATOS DE PRUEBA - ASIGNACIÓN DE CATEGORÍAS A PROYECTOS
-- ============================================================================

-- Asumiendo que ya existen proyectos de apertura del módulo Openings:
-- - project_bcn_sur (Apertura Barcelona Sur)
-- - project_mad_centro (Apertura Madrid Centro)
-- - project_val_este (Apertura Valencia Este)

INSERT INTO opening_project_categories (id, project_id, category_id, required, notes)
VALUES
    -- Barcelona Sur
    ('opc_bcn_mob', 'project_bcn_sur', 'ocat_mobiliario', true, 'Establecimiento de 400m²'),
    ('opc_bcn_rot', 'project_bcn_sur', 'ocat_rotulacion', true, 'Fachada 15m lineales'),
    ('opc_bcn_it', 'project_bcn_sur', 'ocat_equipamiento_it', true, '4 cajas registradoras'),
    ('opc_bcn_seg', 'project_bcn_sur', 'ocat_sistemas_seguridad', true, 'Cámaras + alarma'),
    ('opc_bcn_clima', 'project_bcn_sur', 'ocat_climatizacion', false, 'Opcional según presupuesto'),
    
    -- Madrid Centro
    ('opc_mad_mob', 'project_mad_centro', 'ocat_mobiliario', true, 'Establecimiento de 350m²'),
    ('opc_mad_rot', 'project_mad_centro', 'ocat_rotulacion', true, 'Fachada 12m lineales'),
    ('opc_mad_it', 'project_mad_centro', 'ocat_equipamiento_it', true, '3 cajas registradoras'),
    ('opc_mad_seg', 'project_mad_centro', 'ocat_sistemas_seguridad', true, NULL),
    
    -- Valencia Este
    ('opc_val_mob', 'project_val_este', 'ocat_mobiliario', true, 'Establecimiento de 450m²'),
    ('opc_val_rot', 'project_val_este', 'ocat_rotulacion', true, 'Fachada 18m lineales'),
    ('opc_val_it', 'project_val_este', 'ocat_equipamiento_it', true, '5 cajas registradoras'),
    ('opc_val_cocina', 'project_val_este', 'ocat_equipamiento_cocina', true, 'Zona de comida preparada'),
    ('opc_val_seg', 'project_val_este', 'ocat_sistemas_seguridad', true, NULL),
    ('opc_val_clima', 'project_val_este', 'ocat_climatizacion', true, 'Climatización completa');

-- ============================================================================
-- 5. VERIFICAR DATOS INSERTADOS
-- ============================================================================

-- Contar categorías de productos
SELECT COUNT(*) as total_product_categories
FROM product_category;

-- Contar categorías de aperturas
SELECT COUNT(*) as total_opening_categories
FROM opening_categories;

-- Ver categorías de aperturas con presupuesto
SELECT 
    id,
    name,
    handle,
    estimated_budget_min / 100.0 as budget_min_euros,
    estimated_budget_max / 100.0 as budget_max_euros,
    priority,
    is_active
FROM opening_categories
ORDER BY priority ASC;

-- Ver proyectos con sus categorías
SELECT 
    op.code as project_code,
    op.name as project_name,
    oc.name as category_name,
    opc.required,
    opc.notes
FROM opening_projects op
JOIN opening_project_categories opc ON op.id = opc.project_id
JOIN opening_categories oc ON opc.category_id = oc.id
ORDER BY op.code, oc.priority;

-- Estadísticas
SELECT 
    'Categorías de Productos' as tipo,
    COUNT(*) as total
FROM product_category
WHERE parent_category_id IS NULL

UNION ALL

SELECT 
    'Subcategorías de Productos' as tipo,
    COUNT(*) as total
FROM product_category
WHERE parent_category_id IS NOT NULL

UNION ALL

SELECT 
    'Categorías de Aperturas' as tipo,
    COUNT(*) as total
FROM opening_categories;
```

---

## 📊 Datos Mock

### Categorías de Productos (5 principales + 6 subcategorías)

**Principales**:
1. Uniformes
2. Folletos y Publicidad
3. Señalización en Tienda
4. Equipamientos
5. Merchandising

**Subcategorías**:
- Uniformes → Polos, Chaquetas, Delantales
- Equipamientos → Básculas, Expositores, Transporte

### Categorías de Aperturas (7 categorías)

| # | Categoría | Presupuesto Estimado | Prioridad |
|---|-----------|---------------------|-----------|
| 1 | Mobiliario Comercial | €30,000 - €80,000 | Alta |
| 2 | Rotulación y Señalética | €10,000 - €25,000 | Alta |
| 3 | Equipamiento IT | €15,000 - €40,000 | Media-Alta |
| 4 | Equipamiento de Cocina | €20,000 - €60,000 | Media |
| 5 | Equipamiento de Limpieza | €5,000 - €15,000 | Media-Baja |
| 6 | Sistemas de Seguridad | €8,000 - €20,000 | Media-Baja |
| 7 | Climatización | €12,000 - €35,000 | Baja |

---

## 🔄 Integración con Otros Módulos

### Con Openings
- Las categorías de aperturas se asignan a proyectos
- Define el alcance de cada proyecto de apertura
- Vincula con presupuestos (Quotes module)

### Con Products
- Las categorías de productos organizan el catálogo
- Permiten navegación y filtrado
- Asignación de productos a categorías

### Con Quotes
- Cada presupuesto pertenece a una categoría de apertura
- Permite comparar presupuestos por categoría
- Seguimiento de adjudicaciones por categoría

---

## 📥 Exportación JSON (Categorías de Aperturas)

```json
{
  "opening_categories": [
    {
      "id": "ocat_mobiliario",
      "name": "Mobiliario Comercial",
      "handle": "mobiliario-comercial",
      "description": "Estanterías, vitrinas, mostradores, mobiliario general para el establecimiento",
      "estimated_budget": {
        "min": 30000,
        "max": 80000,
        "currency": "EUR"
      },
      "priority": 1,
      "typical_items": [
        "Estanterías metálicas",
        "Vitrinas refrigeradas",
        "Mostradores de caja",
        "Góndolas",
        "Mesas de trabajo"
      ]
    },
    {
      "id": "ocat_rotulacion",
      "name": "Rotulación y Señalética",
      "handle": "rotulacion-senaletica",
      "description": "Rótulos exteriores e interiores, señalización del establecimiento",
      "estimated_budget": {
        "min": 10000,
        "max": 25000,
        "currency": "EUR"
      },
      "priority": 2,
      "typical_items": [
        "Rótulo exterior luminoso",
        "Señalización interior",
        "Vinilos",
        "Placas identificativas"
      ]
    },
    {
      "id": "ocat_equipamiento_it",
      "name": "Equipamiento IT",
      "handle": "equipamiento-it",
      "description": "TPVs, servidores, redes, cableado, equipamiento informático",
      "estimated_budget": {
        "min": 15000,
        "max": 40000,
        "currency": "EUR"
      },
      "priority": 3,
      "typical_items": [
        "Terminales TPV",
        "Servidor local",
        "Cableado red",
        "Router y switches",
        "Impresoras"
      ]
    }
  ]
}
```

---

## ✅ Criterios de Éxito

✅ **Completo** - Todos los criterios cumplidos:

1. ✅ Categorías de productos creadas con jerarquía
2. ✅ Categorías de aperturas definidas
3. ✅ Presupuestos estimados por categoría
4. ✅ Prioridades establecidas
5. ✅ Script SQL completo con datos de seed
6. ✅ Relación con proyectos de apertura
7. ✅ Metadatos JSON con items típicos
8. ✅ Índices optimizados
9. ✅ Queries de verificación incluidos
10. ✅ Integración con módulos Openings y Quotes

---

**Versión del Documento**: 1.0  
**Última Actualización**: 25 de Agosto de 2026  
**Autor**: AI Assistant (Claude Sonnet 4.5)
