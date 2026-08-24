'use client';

import { useState } from 'react';
import { productsApi } from '@/lib/api/products-client';
import type { ProductVariant } from '@/types/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface InventoryAdjustmentDialogProps {
  variant: ProductVariant;
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function InventoryAdjustmentDialog({
  variant,
  productId,
  open,
  onOpenChange,
  onSuccess,
}: InventoryAdjustmentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract' | 'set'>('add');
  const [quantity, setQuantity] = useState<string>('0');
  const [reason, setReason] = useState<string>('');

  const calculateNewInventory = () => {
    const current = variant.inventory_quantity;
    const qty = parseInt(quantity) || 0;
    
    switch (adjustmentType) {
      case 'add':
        return current + qty;
      case 'subtract':
        return Math.max(0, current - qty);
      case 'set':
        return qty;
      default:
        return current;
    }
  };

  const handleSubmit = async () => {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 0) {
      setError('La cantidad debe ser un número positivo');
      return;
    }

    if (!reason.trim()) {
      setError('Debe proporcionar una razón para el ajuste');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await productsApi.updateInventory({
        variant_id: variant.id,
        quantity: calculateNewInventory(),
        reason: reason,
      });

      onSuccess?.();
      onOpenChange(false);
      
      // Reset form
      setQuantity('0');
      setReason('');
      setAdjustmentType('add');
    } catch (err) {
      console.error('Error adjusting inventory:', err);
      setError(err instanceof Error ? err.message : 'Error al ajustar inventario');
    } finally {
      setLoading(false);
    }
  };

  const newInventory = calculateNewInventory();
  const inventoryChange = newInventory - variant.inventory_quantity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Ajustar Inventario
          </DialogTitle>
          <DialogDescription>
            {variant.title} - SKU: {variant.sku}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Inventory */}
          <Card className="bg-gray-50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Inventario Actual</span>
                <span className="text-2xl font-bold">{variant.inventory_quantity}</span>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
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

          {/* Adjustment Type */}
          <div className="space-y-2">
            <Label htmlFor="adjustmentType">Tipo de Ajuste</Label>
            <Select value={adjustmentType} onValueChange={(v: any) => setAdjustmentType(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione tipo de ajuste" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Añadir Stock (+)</SelectItem>
                <SelectItem value="subtract">Reducir Stock (-)</SelectItem>
                <SelectItem value="set">Establecer Cantidad (=)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* Preview */}
          <Card className={newInventory > variant.inventory_quantity ? 'bg-green-50 border-green-200' : newInventory < variant.inventory_quantity ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Nuevo Inventario</p>
                  <p className="text-xs text-muted-foreground">
                    {inventoryChange > 0 && `+${inventoryChange} unidades`}
                    {inventoryChange < 0 && `${inventoryChange} unidades`}
                    {inventoryChange === 0 && 'Sin cambios'}
                  </p>
                </div>
                <span className="text-2xl font-bold">{newInventory}</span>
              </div>
            </CardContent>
          </Card>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Razón del Ajuste <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Recepción de mercancía, corrección de inventario, producto dañado..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando...' : 'Confirmar Ajuste'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
