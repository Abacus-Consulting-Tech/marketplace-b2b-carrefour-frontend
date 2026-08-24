'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Star } from 'lucide-react';
import type { ProjectCategory } from '@/types/openings';
import type { MockSupplier } from '@/lib/api/openings-mock';

const inviteFormSchema = z.object({
  category_id: z.string().min(1, 'Debes seleccionar una categoría'),
  supplier_ids: z.array(z.string()).min(1, 'Debes seleccionar al menos un proveedor'),
  message: z.string().optional(),
  deadline_days: z.number().min(1, 'El plazo debe ser mayor a 0').max(90, 'El plazo máximo es 90 días'),
});

type InviteFormData = z.infer<typeof inviteFormSchema>;

interface InviteSupplierFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InviteFormData) => Promise<void>;
  categories: ProjectCategory[];
  suppliers: MockSupplier[];
  isLoading?: boolean;
}

export function InviteSupplierForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  categories,
  suppliers,
  isLoading = false 
}: InviteSupplierFormProps) {
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      category_id: '',
      supplier_ids: [],
      message: '',
      deadline_days: 30,
    },
  });

  const handleSubmit = async (data: InviteFormData) => {
    await onSubmit(data);
    form.reset();
    setSelectedSuppliers([]);
  };

  const handleSupplierToggle = (supplierId: string, checked: boolean) => {
    let newSelection: string[];
    if (checked) {
      newSelection = [...selectedSuppliers, supplierId];
    } else {
      newSelection = selectedSuppliers.filter(id => id !== supplierId);
    }
    setSelectedSuppliers(newSelection);
    form.setValue('supplier_ids', newSelection);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invitar Proveedores</DialogTitle>
          <DialogDescription>
            Selecciona una categoría y los proveedores a los que quieres invitar a cotizar
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplier_ids"
              render={() => (
                <FormItem>
                  <FormLabel>Proveedores *</FormLabel>
                  <div className="border rounded-md p-4 space-y-3 max-h-[200px] overflow-y-auto">
                    {suppliers.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No hay proveedores disponibles
                      </p>
                    ) : (
                      suppliers.map((supplier) => (
                        <div
                          key={supplier.id}
                          className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded"
                        >
                          <Checkbox
                            id={supplier.id}
                            checked={selectedSuppliers.includes(supplier.id)}
                            onCheckedChange={(checked) =>
                              handleSupplierToggle(supplier.id, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={supplier.id}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium">{supplier.name}</div>
                            <div className="text-sm text-gray-600">{supplier.email}</div>
                            {supplier.phone && (
                              <div className="text-sm text-gray-500">{supplier.phone}</div>
                            )}
                            {supplier.categories && (
                              <div className="text-xs text-gray-400 mt-1">
                                {supplier.categories.join(', ')}
                              </div>
                            )}
                            {supplier.rating && (
                              <div className="flex items-center mt-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-600 ml-1">
                                  {supplier.rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                  <FormDescription>
                    Selecciona uno o más proveedores para invitar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plazo (días) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="90"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === '' ? undefined : parseInt(value));
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Días que tendrán los proveedores para enviar su presupuesto
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensaje (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mensaje personalizado para los proveedores"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este mensaje se incluirá en el email de invitación
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSelectedSuppliers([]);
                  onOpenChange(false);
                }}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || selectedSuppliers.length === 0}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar {selectedSuppliers.length > 0 && `(${selectedSuppliers.length})`}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
