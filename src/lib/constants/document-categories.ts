import type { DocumentCategoryMetadata } from '@/types/openings';

/**
 * Metadatos de las categorías de documentos
 * Incluye labels, descripciones, iconos y colores para la UI
 */
export const DOCUMENT_CATEGORIES: Record<string, DocumentCategoryMetadata> = {
  equipamientos: {
    code: 'equipamientos',
    label: 'Equipamientos',
    description: 'Planos de distribución y equipamiento comercial',
    icon: 'ShoppingCart',
    color: 'blue',
  },
  obras_iluminacion: {
    code: 'obras_iluminacion',
    label: 'Iluminación',
    description: 'Planos del sistema de iluminación',
    icon: 'Lightbulb',
    color: 'yellow',
  },
  obras_clima: {
    code: 'obras_clima',
    label: 'Climatización',
    description: 'Planos de climatización y ventilación',
    icon: 'Wind',
    color: 'cyan',
  },
  obras_electricidad: {
    code: 'obras_electricidad',
    label: 'Electricidad',
    description: 'Planos eléctricos y cableado',
    icon: 'Zap',
    color: 'orange',
  },
  obras_general: {
    code: 'obras_general',
    label: 'Obras Generales',
    description: 'Planos generales de construcción',
    icon: 'Building2',
    color: 'gray',
  },
  otros: {
    code: 'otros',
    label: 'Otros',
    description: 'Otros documentos técnicos',
    icon: 'FolderOpen',
    color: 'purple',
  },
};

/**
 * Clases de Tailwind para los colores de categorías
 */
export const CATEGORY_COLORS: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  cyan: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-200',
  gray: 'bg-gray-100 text-gray-800 border-gray-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
};
