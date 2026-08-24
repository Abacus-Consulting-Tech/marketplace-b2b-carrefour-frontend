'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productsApi } from '@/lib/api/products-client';
import { mockSuppliers, mockCategories } from '@/lib/api/products-mock';
import type { Product, ProductVariant, CreateProductRequest } from '@/types/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Save, ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
  product?: Product;
  mode: 'create' | 'edit';
}

interface VariantFormData {
  id?: string;
  title: string;
  sku: string;
  price: string;
  inventory_quantity: string;
  manage_inventory: boolean;
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Form state
  const [formData, setFormData] = useState({
    // Basic Info
    title: product?.title || '',
    subtitle: product?.subtitle || '',
    description: product?.description || '',
    handle: product?.handle || '',
    
    // Status & Assignment
    status: product?.status || 'draft',
    supplier_id: product?.supplier?.id || '',
    
    // Categories & Tags
    category_ids: product?.categories?.map((c) => c.id) || [],
    tags: product?.tags?.map((t) => t.value) || [],
    
    // Metadata B2B
    units_per_pack: product?.metadata?.units_per_pack?.toString() || '1',
    min_order_quantity: product?.metadata?.min_order_quantity?.toString() || '1',
    lead_time_days: product?.metadata?.lead_time_days?.toString() || '7',
  });

  // Variants state
  const [variants, setVariants] = useState<VariantFormData[]>(
    product?.variants.map((v) => ({
      id: v.id,
      title: v.title,
      sku: v.sku || '',
      price: (v.prices[0]?.amount / 100).toString() || '0',
      inventory_quantity: v.inventory_quantity.toString(),
      manage_inventory: v.manage_inventory,
    })) || [
      {
        title: 'Default',
        sku: '',
        price: '0',
        inventory_quantity: '0',
        manage_inventory: true,
      },
    ]
  );

  // Update form data when product prop changes (for edit mode)
  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        title: product.title || '',
        subtitle: product.subtitle || '',
        description: product.description || '',
        handle: product.handle || '',
        status: product.status || 'draft',
        supplier_id: product.supplier?.id || '',
        category_ids: product.categories?.map((c) => c.id) || [],
        tags: product.tags?.map((t) => t.value) || [],
        units_per_pack: product.metadata?.units_per_pack?.toString() || '1',
        min_order_quantity: product.metadata?.min_order_quantity?.toString() || '1',
        lead_time_days: product.metadata?.lead_time_days?.toString() || '7',
      });

      setVariants(
        product.variants.map((v) => ({
          id: v.id,
          title: v.title,
          sku: v.sku || '',
          price: (v.prices[0]?.amount / 100).toString() || '0',
          inventory_quantity: v.inventory_quantity.toString(),
          manage_inventory: v.manage_inventory,
        }))
      );
    }
  }, [product, mode]);

  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case 'title':
        return !value?.trim() ? 'El título es obligatorio' : null;
      case 'handle':
        if (value && !/^[a-z0-9-]+$/.test(value)) {
          return 'El handle solo puede contener letras minúsculas, números y guiones';
        }
        return null;
      case 'supplier_id':
        return !value ? 'Debe seleccionar un proveedor' : null;
      case 'units_per_pack':
      case 'min_order_quantity':
      case 'lead_time_days':
        const num = parseInt(value);
        if (isNaN(num)) return 'Debe ser un número';
        if (num < 1) return 'Debe ser mayor que 0';
        return null;
      default:
        return null;
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleVariantChange = (index: number, field: keyof VariantFormData, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        title: `Variant ${variants.length + 1}`,
        sku: '',
        price: '0',
        inventory_quantity: '0',
        manage_inventory: true,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    if (variants.length === 1) {
      alert('Debe haber al menos una variante');
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate all fields
    const errors: Record<string, string> = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        errors[field] = error;
      }
    });

    // Validate variants
    variants.forEach((variant, index) => {
      if (!variant.title.trim()) {
        errors[`variant_${index}_title`] = 'El título de la variante es obligatorio';
      }
      if (!variant.sku.trim()) {
        errors[`variant_${index}_sku`] = 'El SKU es obligatorio';
      }
      const price = parseFloat(variant.price);
      if (isNaN(price) || price < 0) {
        errors[`variant_${index}_price`] = 'El precio debe ser un número válido';
      }
      const inventory = parseInt(variant.inventory_quantity);
      if (isNaN(inventory) || inventory < 0) {
        errors[`variant_${index}_inventory`] = 'El inventario debe ser un número válido';
      }
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Por favor, corrija los errores en el formulario');
      return;
    }

    try {
      setLoading(true);

      const productData: CreateProductRequest = {
        title: formData.title,
        subtitle: formData.subtitle || undefined,
        description: formData.description || undefined,
        handle: formData.handle || undefined,
        status: formData.status as any,
        supplier_id: formData.supplier_id,
        category_ids: formData.category_ids,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        variants: variants.map((v) => ({
          title: v.title,
          sku: v.sku,
          prices: [
            {
              amount: Math.round(parseFloat(v.price) * 100),
              currency_code: 'EUR',
            },
          ],
          inventory_quantity: parseInt(v.inventory_quantity),
          manage_inventory: v.manage_inventory,
        })),
        metadata: {
          units_per_pack: parseInt(formData.units_per_pack),
          min_order_quantity: parseInt(formData.min_order_quantity),
          lead_time_days: parseInt(formData.lead_time_days),
        },
      };

      if (mode === 'create') {
        const response = await productsApi.createProduct(productData);
        if (response.data?.product) {
          setSuccess(true);
          setTimeout(() => {
            router.push(`/admin/products/${response.data.product.id}`);
          }, 1000);
        }
      } else if (product) {
        const response = await productsApi.updateProduct(product.id, productData);
        if (response.data?.product) {
          setSuccess(true);
          setTimeout(() => {
            router.push(`/admin/products/${product.id}`);
          }, 1000);
        }
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="py-3">
            <p className="text-sm font-medium text-green-800">
              ✓ Producto {mode === 'create' ? 'creado' : 'actualizado'} correctamente
            </p>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
          <CardDescription>Datos principales del producto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Título <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                onBlur={() => handleBlur('title')}
                className={fieldErrors.title ? 'border-red-500' : ''}
                placeholder="Ej: Polo Corporativo Carrefour"
              />
              {fieldErrors.title && (
                <p className="text-sm text-red-600">{fieldErrors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Ej: Manga corta, varios tamaños"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              placeholder="Descripción detallada del producto..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="handle">Handle (URL)</Label>
              <Input
                id="handle"
                value={formData.handle}
                onChange={(e) => handleChange('handle', e.target.value.toLowerCase())}
                onBlur={() => handleBlur('handle')}
                className={fieldErrors.handle ? 'border-red-500' : ''}
                placeholder="polo-corporativo-carrefour"
              />
              {fieldErrors.handle && (
                <p className="text-sm text-red-600">{fieldErrors.handle}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Solo letras minúsculas, números y guiones
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Estado <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="proposed">Propuesto</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="rejected">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier_id">
              Proveedor <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.supplier_id}
              onValueChange={(v) => handleChange('supplier_id', v)}
            >
              <SelectTrigger className={fieldErrors.supplier_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Seleccione un proveedor" />
              </SelectTrigger>
              <SelectContent>
                {mockSuppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.supplier_id && (
              <p className="text-sm text-red-600">{fieldErrors.supplier_id}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Variantes y Precios</CardTitle>
              <CardDescription>Gestión de SKUs, precios e inventario</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Variante
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {variants.map((variant, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Variante #{index + 1}</h4>
                {variants.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`variant_title_${index}`}>
                    Título <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`variant_title_${index}`}
                    value={variant.title}
                    onChange={(e) => handleVariantChange(index, 'title', e.target.value)}
                    className={fieldErrors[`variant_${index}_title`] ? 'border-red-500' : ''}
                  />
                  {fieldErrors[`variant_${index}_title`] && (
                    <p className="text-sm text-red-600">
                      {fieldErrors[`variant_${index}_title`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`variant_sku_${index}`}>
                    SKU <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`variant_sku_${index}`}
                    value={variant.sku}
                    onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                    className={fieldErrors[`variant_${index}_sku`] ? 'border-red-500' : ''}
                    placeholder="SKU-001"
                  />
                  {fieldErrors[`variant_${index}_sku`] && (
                    <p className="text-sm text-red-600">{fieldErrors[`variant_${index}_sku`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`variant_price_${index}`}>
                    Precio (€) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`variant_price_${index}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                    className={fieldErrors[`variant_${index}_price`] ? 'border-red-500' : ''}
                  />
                  {fieldErrors[`variant_${index}_price`] && (
                    <p className="text-sm text-red-600">
                      {fieldErrors[`variant_${index}_price`]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`variant_inventory_${index}`}>
                    Inventario <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`variant_inventory_${index}`}
                    type="number"
                    min="0"
                    value={variant.inventory_quantity}
                    onChange={(e) =>
                      handleVariantChange(index, 'inventory_quantity', e.target.value)
                    }
                    className={fieldErrors[`variant_${index}_inventory`] ? 'border-red-500' : ''}
                  />
                  {fieldErrors[`variant_${index}_inventory`] && (
                    <p className="text-sm text-red-600">
                      {fieldErrors[`variant_${index}_inventory`]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories & Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Categorías y Etiquetas</CardTitle>
          <CardDescription>Clasificación del producto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Categorías</Label>
            <div className="flex flex-wrap gap-2">
              {mockCategories.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={formData.category_ids.includes(cat.id) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    const newCategories = formData.category_ids.includes(cat.id)
                      ? formData.category_ids.filter((id) => id !== cat.id)
                      : [...formData.category_ids, cat.id];
                    handleChange('category_ids', newCategories);
                  }}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
            <Input
              id="tags"
              value={formData.tags.join(', ')}
              onChange={(e) =>
                handleChange(
                  'tags',
                  e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                )
              }
              placeholder="nuevo, oferta, destacado"
            />
          </div>
        </CardContent>
      </Card>

      {/* B2B Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración B2B</CardTitle>
          <CardDescription>Parámetros específicos para el canal B2B</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="units_per_pack">
                Unidades por Pack <span className="text-red-500">*</span>
              </Label>
              <Input
                id="units_per_pack"
                type="number"
                min="1"
                value={formData.units_per_pack}
                onChange={(e) => handleChange('units_per_pack', e.target.value)}
                onBlur={() => handleBlur('units_per_pack')}
                className={fieldErrors.units_per_pack ? 'border-red-500' : ''}
              />
              {fieldErrors.units_per_pack && (
                <p className="text-sm text-red-600">{fieldErrors.units_per_pack}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_order_quantity">
                Pedido Mínimo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="min_order_quantity"
                type="number"
                min="1"
                value={formData.min_order_quantity}
                onChange={(e) => handleChange('min_order_quantity', e.target.value)}
                onBlur={() => handleBlur('min_order_quantity')}
                className={fieldErrors.min_order_quantity ? 'border-red-500' : ''}
              />
              {fieldErrors.min_order_quantity && (
                <p className="text-sm text-red-600">{fieldErrors.min_order_quantity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lead_time_days">
                Plazo de Entrega (días) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lead_time_days"
                type="number"
                min="1"
                value={formData.lead_time_days}
                onChange={(e) => handleChange('lead_time_days', e.target.value)}
                onBlur={() => handleBlur('lead_time_days')}
                className={fieldErrors.lead_time_days ? 'border-red-500' : ''}
              />
              {fieldErrors.lead_time_days && (
                <p className="text-sm text-red-600">{fieldErrors.lead_time_days}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Imágenes</CardTitle>
          <CardDescription>Subir imágenes del producto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              La funcionalidad de carga de imágenes estará disponible próximamente
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Link href={mode === 'edit' && product ? `/admin/products/${product.id}` : '/admin/products'}>
          <Button type="button" variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </Link>
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Guardando...' : mode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
}
