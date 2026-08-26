'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { pricingApi } from '@/lib/api/products-pricing-client';
import type { ProposeProductRequest, Product } from '@/types/products-pricing';
import { Loader2, Package } from 'lucide-react';

// ============================================================================
// Validation Schema
// ============================================================================

const productProposalSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres').max(200),
  description: z.string().optional(),
  base_price: z.number().min(0.01, 'El precio debe ser mayor a 0'),
  units_per_pack: z.number().int().min(1, 'Debe haber al menos 1 unidad por paquete'),
  category_id: z.string().optional(),
  subcategory: z.string().optional(),
  tags: z.string().optional(), // Comma-separated, will be split
  thumbnail: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
  ean: z.string().optional(),
  tax_rate: z.number().min(0).max(100).optional(),
});

type ProductProposalFormData = z.infer<typeof productProposalSchema>;

// ============================================================================
// Component Props
// ============================================================================

interface ProductProposalFormProps {
  sellerId: string;
  initialData?: Partial<Product>;
  onSuccess?: (product: Product) => void;
}

// ============================================================================
// Component
// ============================================================================

export function ProductProposalForm({
  sellerId,
  initialData,
  onSuccess,
}: ProductProposalFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductProposalFormData>({
    resolver: zodResolver(productProposalSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      base_price: initialData?.base_price || undefined,
      units_per_pack: initialData?.units_per_pack || 1,
      category_id: initialData?.category_id || '',
      subcategory: initialData?.subcategory || '',
      tags: initialData?.tags?.join(', ') || '',
      thumbnail: initialData?.thumbnail || '',
      ean: initialData?.ean || '',
      tax_rate: initialData?.tax_rate || 21,
    },
  });

  const onSubmit = async (data: ProductProposalFormData) => {
    setIsSubmitting(true);

    try {
      // Parse tags from comma-separated string
      const tagsArray = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : undefined;

      const request: ProposeProductRequest = {
        sellerId,
        title: data.title,
        description: data.description,
        base_price: data.base_price,
        units_per_pack: data.units_per_pack,
        category_id: data.category_id,
        subcategory: data.subcategory,
        tags: tagsArray,
        thumbnail: data.thumbnail || undefined,
        ean: data.ean,
        tax_rate: data.tax_rate,
      };

      const response = await pricingApi.proposeProduct(request);

      toast({
        title: '✅ Producto propuesto correctamente',
        description: response.data.message || 'El producto está pendiente de aprobación por el equipo de Infocus.',
      });

      reset();

      if (onSuccess) {
        onSuccess(response.data.product);
      } else {
        // Redirect to products list
        router.push('/supplier/products');
      }
    } catch (error) {
      console.error('Error proposing product:', error);
      toast({
        title: 'Error al proponer producto',
        description: error instanceof Error ? error.message : 'Ha ocurrido un error inesperado',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <CardTitle>
            {initialData ? 'Editar Producto' : 'Proponer Nuevo Producto'}
          </CardTitle>
        </div>
        <CardDescription>
          Completa la información del producto. El equipo de Infocus revisará y aprobará tu propuesta.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título del Producto *</Label>
            <Input
              id="title"
              placeholder="Ej: Polo Corporativo Manga Corta"
              {...register('title')}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describe las características principales del producto..."
              rows={4}
              {...register('description')}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Base Price & Units per Pack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base_price">Precio Base (€) *</Label>
              <Input
                id="base_price"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="18,50"
                {...register('base_price', { valueAsNumber: true })}
                className={errors.base_price ? 'border-red-500' : ''}
              />
              {errors.base_price && (
                <p className="text-sm text-red-500">{errors.base_price.message}</p>
              )}
              <p className="text-sm text-gray-500">
                Precio de venta propuesto por el proveedor
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="units_per_pack">Unidades por Paquete *</Label>
              <Input
                id="units_per_pack"
                type="number"
                min="1"
                step="1"
                placeholder="10"
                {...register('units_per_pack', { valueAsNumber: true })}
                className={errors.units_per_pack ? 'border-red-500' : ''}
              />
              {errors.units_per_pack && (
                <p className="text-sm text-red-500">{errors.units_per_pack.message}</p>
              )}
              <p className="text-sm text-gray-500">
                Cantidad de unidades por paquete de venta
              </p>
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category_id">Categoría</Label>
              <Input
                id="category_id"
                placeholder="Ej: Uniformes"
                {...register('category_id')}
                className={errors.category_id ? 'border-red-500' : ''}
              />
              {errors.category_id && (
                <p className="text-sm text-red-500">{errors.category_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategoría</Label>
              <Input
                id="subcategory"
                placeholder="Ej: Polos"
                {...register('subcategory')}
                className={errors.subcategory ? 'border-red-500' : ''}
              />
              {errors.subcategory && (
                <p className="text-sm text-red-500">{errors.subcategory.message}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Etiquetas</Label>
            <Input
              id="tags"
              placeholder="polo, corporativo, uniformes (separadas por comas)"
              {...register('tags')}
              className={errors.tags ? 'border-red-500' : ''}
            />
            {errors.tags && (
              <p className="text-sm text-red-500">{errors.tags.message}</p>
            )}
            <p className="text-sm text-gray-500">
              Separa las etiquetas con comas
            </p>
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail">URL de Imagen Principal</Label>
            <Input
              id="thumbnail"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              {...register('thumbnail')}
              className={errors.thumbnail ? 'border-red-500' : ''}
            />
            {errors.thumbnail && (
              <p className="text-sm text-red-500">{errors.thumbnail.message}</p>
            )}
          </div>

          {/* EAN & Tax Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ean">Código EAN (Opcional)</Label>
              <Input
                id="ean"
                placeholder="8421234567890"
                {...register('ean')}
                className={errors.ean ? 'border-red-500' : ''}
              />
              {errors.ean && (
                <p className="text-sm text-red-500">{errors.ean.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_rate">IVA (%)</Label>
              <Input
                id="tax_rate"
                type="number"
                min="0"
                max="100"
                step="1"
                placeholder="21"
                {...register('tax_rate', { valueAsNumber: true })}
                className={errors.tax_rate ? 'border-red-500' : ''}
              />
              {errors.tax_rate && (
                <p className="text-sm text-red-500">{errors.tax_rate.message}</p>
              )}
              <p className="text-sm text-gray-500">
                Típicamente: 21, 10, 4 o 0
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/supplier/products')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="sm:ml-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Package className="mr-2 h-4 w-4" />
                  {initialData ? 'Actualizar Producto' : 'Proponer Producto'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
