'use client';

import { Mail, Clock, CheckCircle2, XCircle, FileText, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { SupplierInvitation, ProjectCategory } from '@/types/openings';
import { formatDate } from '@/types/openings';

interface InvitationsListProps {
  categories: ProjectCategory[];
  invitationsByCategory: Record<string, SupplierInvitation[]>;
}

function getInvitationStatusBadge(status: string) {
  const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Pendiente', variant: 'secondary' },
    viewed: { label: 'Vista', variant: 'default' },
    quote_submitted: { label: 'Presupuesto enviado', variant: 'default' },
    declined: { label: 'Rechazada', variant: 'destructive' },
    expired: { label: 'Expirada', variant: 'outline' },
  };

  const config = variants[status] || variants.pending;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending':
      return <Clock className="w-4 h-4 text-orange-500" />;
    case 'viewed':
      return <Mail className="w-4 h-4 text-blue-500" />;
    case 'quote_submitted':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'declined':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'expired':
      return <Clock className="w-4 h-4 text-gray-400" />;
    default:
      return <Mail className="w-4 h-4 text-gray-400" />;
  }
}

export function InvitationsList({ categories, invitationsByCategory }: InvitationsListProps) {
  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const invitations = invitationsByCategory[category.id] || [];
        
        return (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>
                    {invitations.length} {invitations.length === 1 ? 'proveedor invitado' : 'proveedores invitados'}
                  </CardDescription>
                </div>
                <div className="text-sm text-gray-600">
                  {invitations.filter(i => i.status === 'quote_submitted').length} presupuesto(s) recibido(s)
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay proveedores invitados para esta categoría</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Usa el botón &quot;Invitar Proveedores&quot; para añadir proveedores
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getStatusIcon(invitation.status)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">
                            {invitation.supplier?.name || 'Proveedor desconocido'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {invitation.supplier?.email}
                          </div>
                          {invitation.message && (
                            <div className="text-sm text-gray-500 mt-1 italic">
                              &quot;{invitation.message.substring(0, 100)}
                              {invitation.message.length > 100 && '...'}&quot;
                            </div>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Invitado: {formatDate(invitation.invited_at)}
                            </div>
                            {invitation.deadline && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Plazo: {formatDate(invitation.deadline)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getInvitationStatusBadge(invitation.status)}
                        {invitation.status === 'quote_submitted' && invitation.quote && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <FileText className="w-3 h-3" />
                            Ver presupuesto
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {categories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hay categorías definidas</p>
            <p className="text-sm text-gray-400 mt-1">
              Primero añade categorías al proyecto en la pestaña &quot;Categorías&quot;
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
