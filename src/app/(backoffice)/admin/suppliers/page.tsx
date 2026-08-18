'use client';

import { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  User,
  FileText,
  FileArchive,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Supplier, SupplierStatus } from '@/types';

// Mock data - Replace with API call
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    userId: 'user-1',
    status: 'pending',
    businessName: 'Infoqus Aliado Empresarial',
    legalName: 'Infoqus Aliado Empresarial, S.L.',
    nifCif: 'B12345678',
    fiscalAddress: 'Calle Mayor 123, 4º B',
    municipality: 'Madrid',
    postalCode: '28001',
    country: 'España',
    iban: 'ES1234567890123456789012',
    email: 'info@infoqus.com',
    phone: '+34 912345678',
    website: 'https://www.infoqus.com',
    contactName: 'María',
    contactSurname: 'García López',
    contactPosition: 'Directora Comercial',
    contactEmail: 'maria.garcia@infoqus.com',
    contactPhone: '+34 600123456',
    productsCsvUrl: 'https://example.com/productos.csv',
    imagesZipUrl: 'https://example.com/imagenes.zip',
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-01-15').toISOString(),
  },
];

const statusColors: Record<SupplierStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  suspended: 'bg-gray-100 text-gray-800',
};

const statusIcons: Record<SupplierStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  active: <CheckCircle className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
  suspended: <XCircle className="h-4 w-4" />,
};

const statusLabels: Record<SupplierStatus, string> = {
  pending: 'Pendiente',
  active: 'Activo',
  rejected: 'Rechazado',
  suspended: 'Suspendido',
};

export default function SuppliersPage() {
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = async () => {
    if (!selectedSupplier) return;

    // TODO: API call to approve supplier
    console.log('Approving supplier:', selectedSupplier.id);
    alert('Proveedor aprobado. Pendiente de integración con API.');
    
    setSelectedSupplier(null);
    setActionType(null);
  };

  const handleReject = async () => {
    if (!selectedSupplier || !rejectionReason.trim()) {
      alert('Por favor, introduce un motivo de rechazo.');
      return;
    }

    // TODO: API call to reject supplier
    console.log('Rejecting supplier:', selectedSupplier.id, 'Reason:', rejectionReason);
    alert('Proveedor rechazado. Pendiente de integración con API.');
    
    setSelectedSupplier(null);
    setActionType(null);
    setRejectionReason('');
  };

  const pendingSuppliers = suppliers.filter((s) => s.status === 'pending');
  const activeSuppliers = suppliers.filter((s) => s.status === 'active');
  const rejectedSuppliers = suppliers.filter((s) => s.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Proveedores</h1>
        <p className="text-muted-foreground">
          Revisa y aprueba las solicitudes de registro de nuevos proveedores
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSuppliers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSuppliers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazados</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedSuppliers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Suppliers List */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Pendientes</CardTitle>
          <CardDescription>
            Revisa los datos y archivos de cada proveedor antes de aprobar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingSuppliers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay solicitudes pendientes
            </p>
          ) : (
            <div className="space-y-4">
              {pendingSuppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Company Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">{supplier.businessName}</h3>
                          <Badge className={statusColors[supplier.status]}>
                            {statusLabels[supplier.status]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {supplier.legalName} · NIF/CIF: {supplier.nifCif}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {supplier.fiscalAddress}, {supplier.municipality} ({supplier.postalCode}), {supplier.country}
                        </p>
                      </div>

                      {/* Contact Info */}
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{supplier.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{supplier.phone}</span>
                        </div>
                        {supplier.website && (
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={supplier.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {supplier.website}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Contact Person */}
                      <div className="rounded-md bg-muted/50 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Persona de Contacto</span>
                        </div>
                        <p className="text-sm">
                          {supplier.contactName} {supplier.contactSurname} · {supplier.contactPosition}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {supplier.contactEmail} · {supplier.contactPhone}
                        </p>
                      </div>

                      {/* Files */}
                      {(supplier.productsCsvUrl || supplier.imagesZipUrl) && (
                        <div className="flex gap-3">
                          {supplier.productsCsvUrl && (
                            <a
                              href={supplier.productsCsvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100"
                            >
                              <FileText className="h-4 w-4" />
                              Descargar CSV
                            </a>
                          )}
                          {supplier.imagesZipUrl && (
                            <a
                              href={supplier.imagesZipUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 rounded-md bg-purple-50 px-3 py-2 text-sm text-purple-700 hover:bg-purple-100"
                            >
                              <FileArchive className="h-4 w-4" />
                              Descargar ZIP
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setActionType('approve');
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setActionType('reject');
                        }}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={actionType === 'approve'} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar Proveedor</DialogTitle>
            <DialogDescription>
              ¿Confirmas que quieres aprobar a {selectedSupplier?.businessName}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Al aprobar este proveedor:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
              <li>Se procesará el CSV y se crearán los productos en el catálogo</li>
              <li>Las imágenes se subirán al storage</li>
              <li>El proveedor recibirá un email de confirmación</li>
              <li>Podrá acceder al portal del proveedor</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Cancelar
            </Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              Confirmar Aprobación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={actionType === 'reject'}
        onOpenChange={() => {
          setActionType(null);
          setRejectionReason('');
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Proveedor</DialogTitle>
            <DialogDescription>
              Indica el motivo por el cual rechazas a {selectedSupplier?.businessName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejection-reason">Motivo del Rechazo *</Label>
            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ej: Documentación incompleta, productos no apropiados..."
              className="mt-2 min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionType(null);
                setRejectionReason('');
              }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirmar Rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
