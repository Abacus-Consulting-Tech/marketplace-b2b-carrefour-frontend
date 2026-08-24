'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus, Euro, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { ProjectCategory } from '@/types/openings';
import { formatCurrency } from '@/types/openings';

interface CategoryListProps {
  categories: ProjectCategory[];
  onAdd: () => void;
  onEdit: (category: ProjectCategory) => void;
  onDelete: (categoryId: string) => void;
  isLoading?: boolean;
}

export function CategoryList({
  categories,
  onAdd,
  onEdit,
  onDelete,
  isLoading = false,
}: CategoryListProps) {
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      onDelete(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-gray-100 p-6 mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No hay categorías</h3>
          <p className="text-gray-600 text-center mb-6 max-w-md">
            Añade categorías al proyecto para poder invitar proveedores y recibir presupuestos.
          </p>
          <Button onClick={onAdd} disabled={isLoading}>
            <Plus className="w-4 h-4 mr-2" />
            Añadir Primera Categoría
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Categorías del Proyecto</h3>
          <p className="text-sm text-gray-600">
            {categories.length} {categories.length === 1 ? 'categoría' : 'categorías'} definidas
          </p>
        </div>
        <Button onClick={onAdd} disabled={isLoading}>
          <Plus className="w-4 h-4 mr-2" />
          Añadir Categoría
        </Button>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {category.description || 'Sin descripción'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(category)}
                    disabled={isLoading}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCategoryToDelete(category.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Presupuesto */}
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Euro className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Presupuesto Estimado</p>
                    <p className="font-semibold">
                      {category.budget_estimate
                        ? formatCurrency(category.budget_estimate)
                        : 'No especificado'}
                    </p>
                  </div>
                </div>

                {/* Presupuestos */}
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-2">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Presupuestos</p>
                    <p className="font-semibold">
                      {category.quotes_count || 0} recibidos
                    </p>
                  </div>
                </div>

                {/* Plazo */}
                {category.specifications?.timeline_days && (
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-purple-100 p-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Plazo Estimado</p>
                      <p className="font-semibold">
                        {category.specifications.timeline_days} días
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Specifications */}
              {category.specifications && (
                <div className="mt-4 pt-4 border-t">
                  {category.specifications.requirements?.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold mb-2">Requisitos:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {category.specifications.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {category.specifications.deliverables?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Entregables:</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.specifications.deliverables.map((del, idx) => (
                          <Badge key={idx} variant="secondary">
                            {del}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar categoría?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Se eliminarán también todas las invitaciones
              y presupuestos asociados a esta categoría.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCategoryToDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
