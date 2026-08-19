'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { openingsApi } from '@/lib/api/openings-client';
import type { ProjectCategory } from '@/types/openings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  DollarSign,
  Calendar,
  Shield,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/types/openings';

export default function SupplierQuoteFormPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;

  const [category, setCategory] = useState<ProjectCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [amount, setAmount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [notes, setNotes] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Load category details
  useEffect(() => {
    const loadCategory = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, we'd have an API endpoint to get a single category
        // For now, we'll simulate it with mock data
        const response = await openingsApi.getCategoriesByProject('proj_001');
        if (response.success && response.data) {
          const cat = response.data.find(c => c.id === categoryId);
          setCategory(cat || null);
        }
      } catch (error) {
        console.error('Error loading category:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      loadCategory();
    }
  }, [categoryId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      alert('Por favor, selecciona un archivo PDF válido');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      alert('Por favor, introduce un importe válido');
      return;
    }

    if (!deliveryDays || parseInt(deliveryDays) <= 0) {
      alert('Por favor, introduce un plazo de entrega válido');
      return;
    }

    if (!pdfFile) {
      alert('Por favor, adjunta el presupuesto en PDF');
      return;
    }

    try {
      setIsSubmitting(true);

      const quoteData = {
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        delivery_days: parseInt(deliveryDays),
        warranty_months: warrantyMonths ? parseInt(warrantyMonths) : undefined,
        payment_terms: paymentTerms || undefined,
        notes: notes || undefined,
      };

      const response = await openingsApi.createQuote(categoryId, quoteData, pdfFile);

      if (response.success) {
        alert('Presupuesto enviado correctamente');
        router.push('/supplier/openings');
      } else {
        alert('Error al enviar el presupuesto: ' + (response.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Error al enviar el presupuesto');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Categoría no encontrada</h2>
        <p className="text-gray-600 mb-6">La categoría que buscas no existe o no tienes acceso.</p>
        <Button onClick={() => router.push('/supplier/openings')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Invitaciones
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/supplier/openings')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enviar Presupuesto</h1>
          <p className="text-gray-600 mt-1">{category.name}</p>
        </div>
      </div>

      {/* Category Info */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Solicitud</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Categoría</h4>
            <p className="text-gray-700">{category.name}</p>
          </div>

          {category.description && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Descripción</h4>
              <p className="text-gray-700">{category.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Presupuesto Estimado</h4>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(category.budget_estimate || 0)}
              </p>
            </div>

            {category.specifications?.timeline_days && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Plazo Esperado</h4>
                <p className="text-gray-700">{category.specifications.timeline_days} días</p>
              </div>
            )}
          </div>

          {category.specifications?.requirements && category.specifications.requirements.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Requisitos</h4>
              <ul className="list-disc list-inside space-y-1">
                {category.specifications.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">{req}</li>
                ))}
              </ul>
            </div>
          )}

          {category.specifications?.deliverables && category.specifications.deliverables.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Entregables</h4>
              <ul className="list-disc list-inside space-y-1">
                {category.specifications.deliverables.map((del, index) => (
                  <li key={index} className="text-gray-700">{del}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quote Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Tu Presupuesto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Importe Total (EUR) *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="35000.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <p className="text-sm text-gray-600">
                Introduce el importe en euros (ej: 35000.00 para 35.000 €)
              </p>
            </div>

            {/* Delivery Days */}
            <div className="space-y-2">
              <Label htmlFor="deliveryDays" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Plazo de Entrega (días) *
              </Label>
              <Input
                id="deliveryDays"
                type="number"
                min="1"
                placeholder="30"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                required
              />
              <p className="text-sm text-gray-600">
                ¿En cuántos días podrás entregar e instalar?
              </p>
            </div>

            {/* Warranty Months */}
            <div className="space-y-2">
              <Label htmlFor="warrantyMonths" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Garantía (meses)
              </Label>
              <Input
                id="warrantyMonths"
                type="number"
                min="0"
                placeholder="24"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
              />
              <p className="text-sm text-gray-600">
                Opcional: Periodo de garantía en meses
              </p>
            </div>

            {/* Payment Terms */}
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">
                Condiciones de Pago
              </Label>
              <Input
                id="paymentTerms"
                type="text"
                placeholder="50% anticipo, 50% a la entrega"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
              />
              <p className="text-sm text-gray-600">
                Opcional: Describe las condiciones de pago
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">
                Notas Adicionales
              </Label>
              <textarea
                id="notes"
                className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                placeholder="Información adicional sobre tu presupuesto..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* PDF Upload */}
            <div className="space-y-2">
              <Label htmlFor="pdfFile" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Presupuesto Detallado (PDF) *
              </Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  id="pdfFile"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                <label htmlFor="pdfFile" className="cursor-pointer">
                  {pdfFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        {pdfFile.name}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Haz clic para seleccionar un archivo PDF
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Tamaño máximo: 10 MB
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 font-medium mb-1">
                    Información Importante
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• El presupuesto debe incluir todos los costes (materiales, instalación, transporte)</li>
                    <li>• Una vez enviado, no podrás modificar el presupuesto</li>
                    <li>• El cliente podrá comparar tu oferta con otros proveedores</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/supplier/openings')}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Presupuesto'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
