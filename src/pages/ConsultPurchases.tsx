import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CalendarIcon, Search, Filter, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getPurchases, deletePurchase, updatePurchase } from "@/services/purchaseService";

interface Purchase {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  date: string;
  supplier: string;
}

const suppliers = [
  "Pet Supply Co.",
  "Mascotas Premium",
  "Distribuidora Animal Care",
  "VetSupplies",
  "PetWorld Mayorista",
];

export default function ConsultPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [editForm, setEditForm] = useState<Purchase>({
    id: "",
    product: "",
    quantity: 0,
    unitPrice: 0,
    total: 0,
    date: "",
    supplier: "",
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 🔹 Obtener datos reales del backend
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const data = await getPurchases();
        setPurchases(data);
        setFilteredPurchases(data);
      } catch (error) {
        toast({
          title: "Error al obtener compras",
          description: "No se pudieron cargar las compras del servidor.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  // 🔹 Funciones de utilidad
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);

  const handleFilter = () => {
    let filtered = [...purchases];
    if (selectedSupplier) filtered = filtered.filter(p => p.supplier === selectedSupplier);
    if (startDate) filtered = filtered.filter(p => new Date(p.date) >= startDate);
    if (endDate) filtered = filtered.filter(p => new Date(p.date) <= endDate);
    setFilteredPurchases(filtered);
  };

  const clearFilters = () => {
    setSelectedSupplier("");
    setStartDate(undefined);
    setEndDate(undefined);
    setFilteredPurchases(purchases);
  };

  // 🔹 Editar compra
  const handleEditClick = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setEditForm(purchase);
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (field: keyof Purchase, value: string | number) => {
    const updatedForm = { ...editForm, [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      updatedForm.total = updatedForm.quantity * updatedForm.unitPrice;
    }
    setEditForm(updatedForm);
  };

  const handleEditSubmit = async () => {
    if (selectedPurchase) {
      try {
        await updatePurchase(selectedPurchase.id, editForm);
        const updatedPurchases = purchases.map(p =>
          p.id === selectedPurchase.id ? editForm : p
        );
        setPurchases(updatedPurchases);
        setFilteredPurchases(updatedPurchases);
        toast({
          title: "Compra actualizada",
          description: "La compra se actualizó correctamente en el servidor.",
        });
      } catch {
        toast({
          title: "Error",
          description: "No se pudo actualizar la compra.",
          variant: "destructive",
        });
      } finally {
        setEditDialogOpen(false);
        setSelectedPurchase(null);
      }
    }
  };

  // 🔹 Eliminar compra
  const handleDeleteClick = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPurchase) {
      try {
        await deletePurchase(selectedPurchase.id);
        const updatedPurchases = purchases.filter(p => p.id !== selectedPurchase.id);
        setPurchases(updatedPurchases);
        setFilteredPurchases(updatedPurchases);
        toast({
          title: "Compra eliminada",
          description: "La compra se eliminó correctamente del servidor.",
        });
      } catch {
        toast({
          title: "Error",
          description: "No se pudo eliminar la compra.",
          variant: "destructive",
        });
      } finally {
        setDeleteDialogOpen(false);
        setSelectedPurchase(null);
      }
    }
  };

  const totalAmount = filteredPurchases.reduce((sum, purchase) => sum + purchase.total, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Cargando compras...</p>
      </div>
    );
  }

  // 🔹 Render principal
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Consultar Compras
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Filtra las compras por proveedor o fecha para consultar el historial de tu tienda de mascotas.
          </p>
        </div>

        {/* Filters */}
        <Card className="border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-primary" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Proveedor</Label>
                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger className="h-12 border-border/50 focus:border-primary rounded-lg">
                    <SelectValue placeholder="Seleccionar proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fecha Inicial</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 w-full justify-start text-left font-normal border-border/50 focus:border-primary rounded-lg",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy") : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Fecha Final</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 w-full justify-start text-left font-normal border-border/50 focus:border-primary rounded-lg",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy") : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 flex flex-col justify-end">
                <Button onClick={handleFilter} className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md">
                  <Search className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
                <Button variant="outline" onClick={clearFilters} className="h-10 border-border/50 hover:bg-secondary/50 rounded-lg">
                  Limpiar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{filteredPurchases.length}</p><p className="text-sm text-muted-foreground">Compras encontradas</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</p><p className="text-sm text-muted-foreground">Total invertido</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{filteredPurchases.reduce((sum, p) => sum + p.quantity, 0)}</p><p className="text-sm text-muted-foreground">Productos comprados</p></CardContent></Card>
        </div>

        {/* Table */}
        <Card className="border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader><CardTitle className="text-xl">Resultados de la Consulta</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Producto</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Precio Unitario</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Fecha</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPurchases.length > 0 ? (
                    filteredPurchases.map((purchase) => (
                      <TableRow key={purchase.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>{purchase.product}</TableCell>
                        <TableCell>{purchase.supplier}</TableCell>
                        <TableCell className="text-right">{purchase.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(purchase.unitPrice)}</TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(purchase.total)}</TableCell>
                        <TableCell className="text-center">{format(new Date(purchase.date), "dd/MM/yyyy")}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleEditClick(purchase)}><Pencil className="h-4 w-4" /></Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteClick(purchase)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No se encontraron compras</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader><DialogTitle>Modificar Compra</DialogTitle><DialogDescription>Edita los detalles de la compra. El total se calculará automáticamente.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Producto</Label><Input value={editForm.product} onChange={(e) => handleEditFormChange("product", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Proveedor</Label><Select value={editForm.supplier} onValueChange={(v) => handleEditFormChange("supplier", v)}><SelectTrigger><SelectValue placeholder="Proveedor" /></SelectTrigger><SelectContent>{suppliers.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Fecha</Label><Popover><PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start", !editForm.date && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{editForm.date ? format(new Date(editForm.date), "dd/MM/yyyy") : "Seleccionar"}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={editForm.date ? new Date(editForm.date) : undefined} onSelect={(date) => handleEditFormChange("date", date ? format(date, "yyyy-MM-dd") : "")} /></PopoverContent></Popover></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Cantidad</Label><Input type="number" value={editForm.quantity} onChange={(e) => handleEditFormChange("quantity", parseInt(e.target.value) || 0)} /></div>
              <div className="space-y-2"><Label>Precio Unitario</Label><Input type="number" value={editForm.unitPrice} onChange={(e) => handleEditFormChange("unitPrice", parseInt(e.target.value) || 0)} /></div>
            </div>
            <div className="space-y-2"><Label>Total</Label><Input disabled value={formatCurrency(editForm.total)} className="bg-muted" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancelar</Button><Button onClick={handleEditSubmit}>Guardar Cambios</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará la compra de <span className="font-semibold block mt-2">{selectedPurchase?.product}</span></AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}