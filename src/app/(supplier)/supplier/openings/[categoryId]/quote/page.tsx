'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { openingsApi } from '@/lib/api/openings-client';
import { QuoteForm } from '@/components/openings/supplier/QuoteForm';
import type { SupplierInvitation, Quote } from '@/types/openings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  FileText,
  Building2,
  Calendar,
  MapPin,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/types/openings';
import { useToast } from '@/hooks/use-toast';

export default function SupplierQuoteFormPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;
  const { toast } = useToast();

  const [invitation, setInvitation] = useState<SupplierInvitation | null>(null);
  const [existingQuote, setExistingQuote] = useState<Quote | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load invitation and existing quote
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Get all supplier invitations
        const invitationsResponse = await openingsApi.getMyInvitations();
        
        if (invitationsResponse.success && invitationsResponse.data) {
          // Find the invitation for this category
          const inv = invitationsResponse.data.find(i => i.category_id === categoryId);
          
          if (!inv) {
            toast({
              variant: 'destructive',
              title: 'Error',
              description: 'No tienes una invitación para esta categoría',
            });
            router.push('/supplier/openings');
            return;
          }
          
          setInvitation(inv);

          // Check if quote already exists
          if (inv.id) {
            const quoteResponse = await openingsApi.getQuoteByInvitation(inv.id);
            if (quoteResponse.success && quoteResponse.data) {
              setExistingQuote(quoteResponse.data);
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudo cargar la información',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      loadData();
    }
  }, [categoryId, router, toast]);

  const handleSubmit = async (
    data: {
      amount: number;
      delivery_days?: number;
      warranty_months?: number;
      payment_terms?: string;
      notes?: string;
    },
    isDraft: boolean,
    file?: File
  ) => {
    try {
      setIsSubmitting(true);

      const quoteData = {
        amount: Math.round(data.amount * 100), // Convert EUR to cents
        delivery_days: data.delivery_days,
        warranty_months: data.warranty_months,
        payment_terms: data.payment_terms,
        notes: data.notes,
        status: isDraft ? 'draft' : 'submitted',
      };

      let response;

      if (existingQuote) {
        // Update existing quote
        response = await openingsApi.updateQuote(existingQuote.id, quoteData as any, file);
      } else {
        // Create new quote
        response = await openingsApi.createQuote(categoryId, quoteData as any, file);
      }

      if (response.success) {
        toast({
          title: isDraft ? 'Borrador guardado' : 'Presupuesto enviado',
          description: isDraft 
            ? 'El borrador se ha guardado correctamente'
            : 'Tu presupuesto ha sido enviado al administrador',
        });

        // Redirect back to invitations
        router.push('/supplier/openings');
      } else {
        throw new Error(response.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo enviar el presupuesto',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Invitación no encontrada
        </h2>
        <p className="text-gray-600 mb-6">
          No tienes acceso a esta categoría o la invitación no existe
        </p>
        <Button onClick={() => router.push('/supplier/openings')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Invitaciones
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900">
            {existingQuote ? 'Editar Presupuesto' : 'Enviar Presupuesto'}
          </h1>
          <p className="text-gray-600 mt-1">{invitation.category?.name}</p>
        </div>
      </div>

      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Proyecto</CardTitle>
          <CardDescription>
            Detalles de la solicitud de presupuesto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900">
                {invitation.project?.name || 'Proyecto sin nombre'}
              </h4>
              {invitation.project?.address && (
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {invitation.project.address.street}, {invitation.project.address.city}
                </p>
              )}
            </div>
          </div>

          {invitation.category?.description && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Descripción</h4>
              <p className="text-gray-700">{invitation.category.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Presupuesto Estimado</p>
              <p className="text-lg font-bold text-gray-900">
                {invitation.category?.budget_estimate
                  ? formatCurrency(invitation.category.budget_estimate)
                  : 'No especificado'}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Fecha Límite</p>
              <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {invitation.deadline
                  ? formatDate(invitation.deadline)
                  : 'No especificada'}
              </p>
            </div>
          </div>

          {invitation.message && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Mensaje del administrador:
              </p>
              <p className="text-sm text-blue-800">{invitation.message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quote Form */}
      <QuoteForm
        invitation={invitation}
        existingQuote={existingQuote}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
