'use client';

/**
 * Seller Markup Manager (Phase 6)
 * 
 * Admin page for managing seller global markup percentages
 * - View current markup per seller
 * - Update markup with reason tracking
 * - View markup change history
 * - See affected products count
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Package, 
  Calendar,
  User,
  History,
  Save,
  AlertCircle,
  CheckCircle,
  Percent,
} from 'lucide-react';
import { pricingApi } from '@/lib/api/products-pricing-client';
import type { 
  Seller, 
  SellerMarkupHistory,
  GetSellerMarkupHistoryResponse,
} from '@/types/products-pricing';

export default function SellerMarkupManagerPage() {
  // State
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState<string>('');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [markupHistory, setMarkupHistory] = useState<SellerMarkupHistory[]>([]);
  const [historyTotal, setHistoryTotal] = useState(0);
  
  // Form state
  const [newMarkup, setNewMarkup] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load sellers on mount
  useEffect(() => {
    loadSellers();
  }, []);

  // Load history when seller changes
  useEffect(() => {
    if (selectedSellerId) {
      const seller = sellers.find(s => s.id === selectedSellerId);
      setSelectedSeller(seller || null);
      setNewMarkup(seller?.global_markup_percentage.toString() || '');
      loadHistory(selectedSellerId);
    }
  }, [selectedSellerId, sellers]);

  /**
   * Load all sellers
   */
  async function loadSellers() {
    try {
      setLoading(true);
      setError(null);
      const response = await pricingApi.getAllSellers();
      
      if (response.data) {
        setSellers(response.data);
        
        // Auto-select first seller
        if (response.data.length > 0 && !selectedSellerId) {
          setSelectedSellerId(response.data[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading sellers:', err);
      setError('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Load markup history for selected seller
   */
  async function loadHistory(sellerId: string) {
    try {
      setLoading(true);
      const response = await pricingApi.getSellerMarkupHistory({
        seller_id: sellerId,
        limit: 20,
        offset: 0,
      });
      
      if (response.data) {
        setMarkupHistory(response.data.history);
        setHistoryTotal(response.data.total);
      }
    } catch (err) {
      console.error('Error loading history:', err);
      setError('Error al cargar historial');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Update seller markup
   */
  async function handleUpdateMarkup(e: React.FormEvent) {
    e.preventDefault();
    
    if (!selectedSellerId || !selectedSeller) {
      setError('Seleccione un proveedor');
      return;
    }

    const markupValue = parseFloat(newMarkup);
    
    if (isNaN(markupValue) || markupValue < 0 || markupValue > 500) {
      setError('El markup debe estar entre 0% y 500%');
      return;
    }

    if (markupValue === selectedSeller.global_markup_percentage) {
      setError('El nuevo markup es igual al actual');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await pricingApi.updateSellerMarkup(selectedSellerId, {
        global_markup_percentage: markupValue,
        reason: reason.trim() || undefined,
      });

      if (response.data) {
        setSuccess(
          `✅ ${response.data.message}`
        );
        
        // Reload data
        await loadSellers();
        await loadHistory(selectedSellerId);
        
        // Clear reason field
        setReason('');
      }
    } catch (err: any) {
      console.error('Error updating markup:', err);
      setError(err.message || 'Error al actualizar markup');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Format date in Spanish
   */
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  /**
   * Get trend icon for markup change
   */
  function getTrendIcon(prev: number, next: number) {
    if (next > prev) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (next < prev) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Markup Global</h1>
        <p className="text-muted-foreground mt-2">
          Configura el markup global por proveedor y revisa el historial de cambios
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-500 bg-green-50 text-green-900">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Seller Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Proveedor</CardTitle>
          <CardDescription>
            Elige el proveedor para gestionar su markup global
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select 
            value={selectedSellerId} 
            onValueChange={setSelectedSellerId}
            disabled={loading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un proveedor..." />
            </SelectTrigger>
            <SelectContent>
              {sellers.map((seller) => (
                <SelectItem key={seller.id} value={seller.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{seller.name}</span>
                    <Badge variant="secondary" className="ml-4">
                      {seller.global_markup_percentage}%
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Main Content - Only show when seller selected */}
      {selectedSeller && (
        <Tabs defaultValue="current" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">
              <Percent className="h-4 w-4 mr-2" />
              Markup Actual
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Historial ({historyTotal})
            </TabsTrigger>
          </TabsList>

          {/* Current Markup Tab */}
          <TabsContent value="current" className="space-y-4">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Markup Global
                  </CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {selectedSeller.global_markup_percentage}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Aplicado por defecto
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Productos
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {selectedSeller.total_products || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    En catálogo
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Aprobados
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {selectedSeller.approved_products || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Productos activos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pendientes
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedSeller.pending_products || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Esperando aprobación
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Update Form */}
            <Card>
              <CardHeader>
                <CardTitle>Actualizar Markup Global</CardTitle>
                <CardDescription>
                  El nuevo markup se aplicará automáticamente a todos los productos que no tengan un markup específico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateMarkup} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-markup">
                        Nuevo Markup (%)
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="new-markup"
                        type="number"
                        step="0.01"
                        min="0"
                        max="500"
                        value={newMarkup}
                        onChange={(e) => setNewMarkup(e.target.value)}
                        placeholder="ej: 15.5"
                        required
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Rango permitido: 0% - 500%
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">
                        Motivo del Cambio
                      </Label>
                      <Textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="ej: Ajuste por acuerdo comercial Q3"
                        rows={3}
                        disabled={loading}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        Opcional - Se guardará en el historial
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <Button 
                      type="submit" 
                      disabled={loading || !selectedSellerId}
                      className="w-full md:w-auto"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                    
                    {parseFloat(newMarkup) !== selectedSeller.global_markup_percentage && (
                      <Badge variant="outline" className="whitespace-nowrap">
                        Cambio: {selectedSeller.global_markup_percentage}% → {newMarkup}%
                      </Badge>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Cambios</CardTitle>
                <CardDescription>
                  Registro completo de modificaciones al markup global de {selectedSeller.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {markupHistory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay cambios registrados aún</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Cambio</TableHead>
                        <TableHead>Productos Afectados</TableHead>
                        <TableHead>Motivo</TableHead>
                        <TableHead>Modificado Por</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {markupHistory.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {formatDate(entry.changed_at)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(entry.previous_markup, entry.new_markup)}
                              <span className="font-medium">
                                {entry.previous_markup}% → {entry.new_markup}%
                              </span>
                              {entry.previous_markup !== entry.new_markup && (
                                <Badge 
                                  variant={entry.new_markup > entry.previous_markup ? 'destructive' : 'default'}
                                  className="text-xs"
                                >
                                  {entry.new_markup > entry.previous_markup ? '+' : ''}
                                  {(entry.new_markup - entry.previous_markup).toFixed(2)}%
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span>{entry.affected_products_count}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {entry.reason || '—'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{entry.changed_by}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Empty State - No seller selected */}
      {!selectedSeller && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Percent className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Selecciona un proveedor para comenzar
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Usa el selector de arriba para elegir un proveedor
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
