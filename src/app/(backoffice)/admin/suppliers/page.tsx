'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Eye,
  Pencil,
  Trash2,
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Supplier, SupplierStatus } from '@/types';
import { supplierRegistrationApi } from '@/lib/api/supplier-registration-client';

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

function SupplierStatusTable({
  suppliers,
  emptyMessage,
  onView,
  onEdit,
  onDelete,
}: {
  suppliers: Supplier[];
  emptyMessage: string;
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}) {
  if (suppliers.length === 0) {
    return <p className="py-8 text-center text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Proveedor</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Onboarding</TableHead>
            <TableHead>Notas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell>
                <div className="font-medium">{supplier.businessName}</div>
                <div className="text-sm text-muted-foreground">{supplier.legalName}</div>
                <div className="text-sm text-muted-foreground">NIF/CIF: {supplier.nifCif}</div>
              </TableCell>
              <TableCell>
                <div>{supplier.contactName} {supplier.contactSurname}</div>
                <div className="text-sm text-muted-foreground">{supplier.contactEmail}</div>
                <div className="text-sm text-muted-foreground">{supplier.contactPhone}</div>
              </TableCell>
              <TableCell>
                <Badge className={statusColors[supplier.status]}>
                  <span className="mr-1 inline-flex">{statusIcons[supplier.status]}</span>
                  {statusLabels[supplier.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">{supplier.metadata?.onboarding_status || 'pending_approval'}</div>
              </TableCell>
              <TableCell>
                <div className="max-w-[320px] text-sm text-muted-foreground">
                  {supplier.metadata?.approval_notes || 'Sin notas'}
                </div>
              </TableCell>
              <TableCell className="w-[220px]">
                <div className="flex items-center justify-end gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => onView(supplier)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => onEdit(supplier)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button type="button" variant="destructive" size="sm" onClick={() => onDelete(supplier)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'delete' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'rejected' | 'suspended'>('all');

  useEffect(() => {
    let isMounted = true;

    async function loadSuppliers() {
      try {
        setLoading(true);
        const response = await supplierRegistrationApi.listSuppliers();
        if (isMounted) {
          setSuppliers(response.suppliers);
        }
      } catch (error) {
        console.error('Error loading suppliers:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSuppliers();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshSuppliers = async () => {
    const response = await supplierRegistrationApi.listSuppliers();
    setSuppliers(response.suppliers);
  };

  const handleApprove = async () => {
    if (!selectedSupplier) return;

    await supplierRegistrationApi.updateSupplierStatus(selectedSupplier.id, {
      status: 'active',
      approvalNotes: 'Solicitud aprobada. Pendiente de envío de credenciales.',
    });
    await refreshSuppliers();
    
    setSelectedSupplier(null);
    setActionType(null);
  };

  const handleReject = async () => {
    if (!selectedSupplier || !rejectionReason.trim()) {
      alert('Por favor, introduce un motivo de rechazo.');
      return;
    }

    await supplierRegistrationApi.updateSupplierStatus(selectedSupplier.id, {
      status: 'rejected',
      approvalNotes: rejectionReason,
    });
    await refreshSuppliers();
    
    setSelectedSupplier(null);
    setActionType(null);
    setRejectionReason('');
  };

  const handleDelete = async () => {
    if (!selectedSupplier) return;

    await supplierRegistrationApi.deleteSupplier(selectedSupplier.id);
    await refreshSuppliers();

    setSelectedSupplier(null);
    setActionType(null);
  };

  const pendingSuppliers = suppliers.filter((s) => s.status === 'pending');
  const activeSuppliers = suppliers.filter((s) => s.status === 'active');
  const rejectedSuppliers = suppliers.filter((s) => s.status === 'rejected');
  const managedSuppliers = suppliers.filter((s) => s.status !== 'pending');
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredManagedSuppliers = managedSuppliers.filter((supplier) => {
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    if (!matchesStatus) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const searchableFields = [
      supplier.businessName,
      supplier.legalName,
      supplier.nifCif,
      supplier.email,
      supplier.contactEmail,
      supplier.contactName,
      supplier.contactSurname,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableFields.includes(normalizedSearch);
  });

  if (loading) {
    return <div>Cargando proveedores...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Proveedores</h1>
          <p className="text-muted-foreground">
            Revisa y aprueba las solicitudes de registro de nuevos proveedores
          </p>
        </div>
        <Link href="/admin/suppliers/invite">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Invitar proveedor
          </Button>
        </Link>
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

                      <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900">
                        <p className="font-medium">Estado de onboarding</p>
                        <p className="mt-1">
                          {supplier.metadata?.onboarding_status || 'pending_approval'}
                        </p>
                        <p className="mt-2 text-blue-800">
                          La carga de CSV/XLSX e imágenes quedará disponible después de la aprobación.
                        </p>
                      </div>

                      {supplier.metadata?.approval_notes && (
                        <div className="rounded-md bg-muted/50 p-3">
                          <p className="text-sm font-medium">Notas internas</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {supplier.metadata.approval_notes}
                          </p>
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

      <Card>
        <CardHeader>
          <CardTitle>Directorio de Proveedores</CardTitle>
          <CardDescription>
            Consulta proveedores ya revisados con búsqueda por nombre, contacto o CIF y filtro por estado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:max-w-md">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nombre, CIF, email o contacto"
              />
            </div>
            <div className="w-full md:w-56">
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as 'all' | 'active' | 'rejected' | 'suspended')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="rejected">Rechazados</SelectItem>
                  <SelectItem value="suspended">Suspendidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <SupplierStatusTable
            suppliers={filteredManagedSuppliers}
            emptyMessage="No hay proveedores que coincidan con la búsqueda o el filtro"
            onView={(supplier) => router.push(`/admin/suppliers/${supplier.id}`)}
            onEdit={(supplier) => router.push(`/admin/suppliers/${supplier.id}/edit`)}
            onDelete={(supplier) => {
              setSelectedSupplier(supplier);
              setActionType('delete');
            }}
          />
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
              <li>El proveedor quedará aprobado a la espera del envío de credenciales</li>
              <li>Se podrá enviar el email de activación en el siguiente paso</li>
              <li>La carga de catálogo quedará habilitada después del acceso al portal</li>
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

      <Dialog
        open={actionType === 'delete'}
        onOpenChange={() => {
          setActionType(null);
          setSelectedSupplier(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Proveedor</DialogTitle>
            <DialogDescription>
              ¿Seguro que quieres eliminar a {selectedSupplier?.businessName}? Esta acción borrará su registro mock.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionType(null);
                setSelectedSupplier(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar proveedor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
