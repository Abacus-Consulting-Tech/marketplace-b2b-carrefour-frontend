/**
 * Portal Proveedor - Invitaciones a Proyectos
 */

'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOpenings } from '@/lib/store/openings';
import { openingsApi } from '@/lib/api/openings-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Building2,
  FileText,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/types/openings';

export default function SupplierInvitationsPage() {
  const router = useRouter();
  const {
    myInvitations,
    setMyInvitations,
    isLoadingInvitations,
    setLoadingInvitations,
    getPendingInvitations,
    getInvitationsWithQuotes,
  } = useOpenings();

  useEffect(() => {
    async function loadInvitations() {
      try {
        setLoadingInvitations(true);
        const response = await openingsApi.getMyInvitations();
        if (response.success && response.data) {
          setMyInvitations(response.data);
        }
      } catch (error) {
        console.error('Error loading invitations:', error);
      } finally {
        setLoadingInvitations(false);
      }
    }

    loadInvitations();
  }, [setMyInvitations, setLoadingInvitations]);

  const pendingInvitations = getPendingInvitations();
  const submittedInvitations = getInvitationsWithQuotes();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case 'quote_submitted':
        return (
          <Badge className="bg-blue-600 text-white">
            <Send className="w-3 h-3 mr-1" />
            Enviado
          </Badge>
        );
      case 'awarded':
        return (
          <Badge className="bg-green-600 text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Adjudicado
          </Badge>
        );
      case 'rejected':
        return <Badge variant="outline">Rechazado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Invitaciones a Proyectos</h1>
        <p className="text-gray-600 mt-1">
          Gestiona tus invitaciones y envía presupuestos
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">Total Invitaciones</p>
          <p className="text-2xl font-bold">{myInvitations.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">
            {pendingInvitations.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600">Presupuestos Enviados</p>
          <p className="text-2xl font-bold text-blue-600">
            {submittedInvitations.length}
          </p>
        </div>
      </div>

      {/* Lista de invitaciones */}
      {isLoadingInvitations ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : myInvitations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No tienes invitaciones pendientes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myInvitations.map((invitation) => (
            <Card key={invitation.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {invitation.project?.name || 'Proyecto sin nombre'}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Building2 className="w-4 h-4" />
                      <span>{invitation.project?.address?.street || 'Dirección no disponible'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{invitation.category?.name || 'Categoría'}</Badge>
                      {getStatusBadge(invitation.status)}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Información de la categoría */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Presupuesto estimado</p>
                      <p className="font-semibold">
                        {invitation.category?.budget_estimate
                          ? formatCurrency(invitation.category.budget_estimate)
                          : 'No especificado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fecha límite</p>
                      <p className="font-semibold">
                        {invitation.deadline
                          ? formatDate(invitation.deadline)
                          : 'No especificada'}
                      </p>
                    </div>
                  </div>

                  {/* Requisitos */}
                  {invitation.category?.description && (
                    <div>
                      <p className="text-sm font-semibold mb-1">Requisitos</p>
                      <p className="text-sm text-gray-600">
                        {invitation.category.description}
                      </p>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-2 pt-2">
                    {invitation.status === 'pending' && (
                      <Button
                        onClick={() =>
                          router.push(
                            `/supplier/openings/${invitation.category_id}/quote`
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Presupuesto
                      </Button>
                    )}

                    {invitation.status === 'quote_submitted' && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          router.push(
                            `/supplier/openings/${invitation.category_id}/quote`
                          )
                        }
                      >
                        Ver mi presupuesto
                      </Button>
                    )}

                    {/* Ver documentos técnicos del proyecto */}
                    {invitation.project_id && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          router.push(`/supplier/openings/${invitation.project_id}`)
                        }
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Ver Documentos Técnicos
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
