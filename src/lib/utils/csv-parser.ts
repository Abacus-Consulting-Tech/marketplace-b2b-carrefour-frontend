import { ProductFromCSV } from '@/types';

/**
 * Parse CSV file to ProductFromCSV objects
 * Expected CSV structure:
 * PROVEEDOR,IMAGEN,NOMBRE,DESCRIPCIÓN,CARACTERISTICAS,COSTE UNITARIO,PCB,IMPORTE,IVA,PLAZO ENTREGA
 */
export async function parseProductsCSV(file: File): Promise<ProductFromCSV[]> {
  const text = await file.text();
  const lines = text.split('\n').filter((line) => line.trim());

  // Skip header row
  const dataLines = lines.slice(1);

  const products: ProductFromCSV[] = [];

  for (const line of dataLines) {
    // Split by comma, but respect quotes
    const values = parseCSVLine(line);

    if (values.length < 10) {
      console.warn('Skipping invalid CSV line:', line);
      continue;
    }

    products.push({
      proveedor: values[0].trim(),
      imagen: values[1].trim(),
      nombre: values[2].trim(),
      descripcion: values[3].trim(),
      caracteristicas: values[4].trim(),
      costeUnitario: parseFloat(values[5].replace(',', '.')) || 0,
      pcb: parseInt(values[6]) || 1,
      importe: parseFloat(values[7].replace(',', '.')) || 0,
      iva: parseFloat(values[8].replace(',', '.')) || 0,
      plazoEntrega: values[9].trim(),
    });
  }

  return products;
}

/**
 * Parse a single CSV line respecting quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  // Push last field
  values.push(current);

  return values;
}

/**
 * Validate product CSV data
 */
export function validateProducts(products: ProductFromCSV[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (products.length === 0) {
    errors.push('El archivo CSV está vacío o no tiene productos válidos');
    return { valid: false, errors };
  }

  products.forEach((product, index) => {
    const lineNumber = index + 2; // +2 because index is 0-based and we skip header

    if (!product.nombre) {
      errors.push(`Línea ${lineNumber}: El nombre del producto es obligatorio`);
    }

    if (!product.imagen) {
      errors.push(`Línea ${lineNumber}: El nombre de la imagen es obligatorio`);
    } else if (!product.imagen.endsWith('.png')) {
      errors.push(`Línea ${lineNumber}: La imagen debe ser un archivo PNG (${product.imagen})`);
    }

    if (product.costeUnitario <= 0) {
      errors.push(`Línea ${lineNumber}: El coste unitario debe ser mayor que 0`);
    }

    if (product.pcb <= 0) {
      errors.push(`Línea ${lineNumber}: El PCB debe ser mayor que 0`);
    }

    if (product.iva < 0 || product.iva > 100) {
      errors.push(`Línea ${lineNumber}: El IVA debe estar entre 0 y 100`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if all product images exist in the ZIP file
 */
export async function validateProductImages(
  products: ProductFromCSV[],
  zipFile: File
): Promise<{ valid: boolean; errors: string[] }> {
  // TODO: Implement ZIP validation
  // This would require a ZIP parsing library like JSZip
  // For now, return a placeholder

  const errors: string[] = [];
  const requiredImages = products.map((p) => p.imagen);
  const uniqueImages = [...new Set(requiredImages)];

  console.log('Required images:', uniqueImages);
  console.log('ZIP file size:', zipFile.size);

  // Placeholder validation
  if (zipFile.size === 0) {
    errors.push('El archivo ZIP está vacío');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate a summary of the CSV data
 */
export function generateProductsSummary(products: ProductFromCSV[]) {
  const totalProducts = products.length;
  const uniqueProviders = new Set(products.map((p) => p.proveedor)).size;
  const totalValue = products.reduce((sum, p) => sum + p.importe, 0);
  const avgPrice = totalValue / totalProducts;

  return {
    totalProducts,
    uniqueProviders,
    totalValue,
    avgPrice,
    firstProduct: products[0],
    lastProduct: products[products.length - 1],
  };
}
