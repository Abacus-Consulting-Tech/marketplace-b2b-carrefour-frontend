'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { openingsApi } from '@/lib/api/openings-client';
import QuotesComparisonTable from '@/components/openings/franchisee/QuotesComparisonTable';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Quote } from '@/types/openings';

interface ComparisonData {
  category_id: string;
  category_name: string;
  budget_estimate: number;
  quotes: any[];
}

export default function QuotesComparisonPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const projectId = params.id as string;
  const categoryId = params.categoryId as string;

  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAwarding, setIsAwarding] = useState(false);

  useEffect(() => {
    loadComparisonData();
  }, [categoryId]);

  const loadComparisonData = async () => {
    try {
      setIsLoading(true);
      const response = await openingsApi.getQuoteComparison(categoryId);

      if (response.success && response.data) {
        setComparisonData({
          category_id: response.data.category_id,
          category_name: response.data.category_name,
          budget_estimate: response.data.budget_estimate || 0,
          quotes: response.data.quotes as Quote[],
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error || 'No se pudo cargar la comparación de presupuestos',
        });
      }
    } catch (error) {
      console.error('Error loading comparison:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error al cargar los presupuestos',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAward = async (quoteId: string) => {
    try {
      setIsAwarding(true);

      const response = await openingsApi.awardQuote(quoteId);

      if (response.success) {
        toast({
          title: 'Presupuesto adjudicado',
          description: response.message || 'El presupuesto ha sido adjudicado exitosamente',
        });

        // Recargar datos para reflejar el cambio
        await loadComparisonData();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error || 'No se pudo adjudicar el presupuesto',
        });
      }
    } catch (error) {
      console.error('Error awarding quote:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error al adjudicar el presupuesto',
      });
    } finally {
      setIsAwarding(false);
    }
  };

  const handleRevert = async (quoteId: string) => {
    try {
      setIsAwarding(true);

      const response = await openingsApi.revertQuote(quoteId);

      if (response.success) {
        toast({
          title: 'Adjudicación revertida',
          description: response.message || 'La adjudicación ha sido revertida exitosamente',
        });

        // Recargar datos para reflejar el cambio
        await loadComparisonData();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error || 'No se pudo revertir la adjudicación',
        });
      }
    } catch (error) {
      console.error('Error reverting quote:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error al revertir la adjudicación',
      });
    } finally {
      setIsAwarding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 py-8 px-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No se encontró información
        </h2>
        <p className="text-gray-600 mb-6">
          No se pudo cargar la comparación de presupuestos
        </p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/franchisee/openings/${projectId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Proyecto
        </Button>
      </div>

      {/* Comparison Table */}
      <QuotesComparisonTable
        categoryId={comparisonData.category_id}
        categoryName={comparisonData.category_name}
        budgetEstimate={comparisonData.budget_estimate}
        quotes={comparisonData.quotes}
        onAward={handleAward}
        onRevert={handleRevert}
        isAwarding={isAwarding}
      />
    </div>
  );
}
