'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { franchiseesApi } from '@/lib/api/franchisees-client';
import type { Franchisee } from '@/types/franchisees';
import FranchiseeForm from '@/components/admin/FranchiseeForm';
import { RefreshCw } from 'lucide-react';

export default function EditFranchiseePage() {
  const params = useParams();
  const id = params.id as string;
  const [franchisee, setFranchisee] = useState<Franchisee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFranchisee = async () => {
      try {
        setLoading(true);
        const response = await franchiseesApi.getFranchisee({ 
          id, 
          expand: 'groups,shipping_addresses' 
        });
        if (response.data?.customer) {
          setFranchisee(response.data.customer);
        }
      } catch (err) {
        console.error('Error loading franchisee:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar franquiciado');
      } finally {
        setLoading(false);
      }
    };

    loadFranchisee();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (error || !franchisee) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-medium">{error || 'Franquiciado no encontrado'}</p>
      </div>
    );
  }

  return <FranchiseeForm franchisee={franchisee} mode="edit" />;
}
