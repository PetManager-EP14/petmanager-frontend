import { useState } from "react";
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

interface Purchase {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  date: string;
  supplier: string;
}

const mockPurchases: Purchase[] = [
  {
    id: "1",
    product: "Alimento Premium para Perro Royal Canin 15kg",
    quantity: 12,
    unitPrice: 180000,
    total: 2160000,
    date: "2024-01-15",
    supplier: "Pet Supply Co."
  },
  {
    id: "2",
    product: "Juguete Kong Classic Mediano",
    quantity: 24,
    unitPrice: 45000,
    total: 1080000,
    date: "2024-01-12",
    supplier: "Mascotas Premium"
  },
  {
    id: "3",
    product: "Collar LED Recargable para Perro",
    quantity: 18,
    unitPrice: 35000,
    total: 630000,
    date: "2024-01-10",
    supplier: "Distribuidora Animal Care"
  },
  {
    id: "4",
    product: "Arena Sanitaria para Gato Fresh Step 20kg",
    quantity: 8,
    unitPrice: 75000,
    total: 600000,
    date: "2024-01-08",
    supplier: "Pet Supply Co."
  },
  {
    id: "5",
    product: "Correa Retráctil Flexi 5m",
    quantity: 15,
    unitPrice: 85000,
    total: 1275000,
    date: "2024-01-05",
    supplier: "VetSupplies"
  },
  {
    id: "6",
    product: "Snacks Dentales para Perro Pedigree",
    quantity: 30,
    unitPrice: 25000,
    total: 750000,
    date: "2024-01-03",
    supplier: "Mascotas Premium"
  },
  {
    id: "7",
    product: "Transportadora Plástica Grande",
    quantity: 6,
    unitPrice: 120000,
    total: 720000,
    date: "2023-12-28",
    supplier: "PetWorld Mayorista"
  },
  {
    id: "8",
    product: "Vitaminas para Gato Whiskas",
    quantity: 20,
    unitPrice: 28000,
    total: 560000,
    date: "2023-12-25",
    supplier: "Distribuidora Animal Care"
  }
];

const suppliers = [
  "Pet Supply Co.",
  "Mascotas Premium", 
  "Distribuidora Animal Care",
  "VetSupplies",
  "PetWorld Mayorista"
];

export default function ConsultPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>(mockPurchases);
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
    supplier: ""
  });
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleFilter = () => {
    let filtered = [...purchases];

    // Filter by supplier
    if (selectedSupplier) {
      filtered = filtered.filter(purchase => purchase.supplier === selectedSupplier);
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(purchase => new Date(purchase.date) >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(purchase => new Date(purchase.date) <= endDate);
    }

    setFilteredPurchases(filtered);
  };

  const clearFilters = () => {
    setSelectedSupplier("");
    setStartDate(undefined);
    setEndDate(undefined);
    setFilteredPurchases(purchases);
  };

  const handleEditClick = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setEditForm(purchase);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPurchase) {
      const updatedPurchases = purchases.filter(p => p.id !== selectedPurchase.id);
      setPurchases(updatedPurchases);
      
      // Update filtered purchases
      const updatedFiltered = filteredPurchases.filter(p => p.id !== selectedPurchase.id);
      setFilteredPurchases(updatedFiltered);
      
      toast({
        title: "Compra eliminada",
        description: "La compra ha sido eliminada exitosamente.",
      });
      setDeleteDialogOpen(false);
      setSelectedPurchase(null);
    }
  };

  const handleEditSubmit = () => {
    if (selectedPurchase) {
      const updatedPurchases = purchases.map(p => 
        p.id === selectedPurchase.id ? editForm : p
      );
      setPurchases(updatedPurchases);
      
      // Update filtered purchases
      const updatedFiltered = filteredPurchases.map(p => 
        p.id === selectedPurchase.id ? editForm : p
      );
      setFilteredPurchases(updatedFiltered);
      
      toast({
        title: "Compra actualizada",
        description: "La compra ha sido actualizada exitosamente.",
      });
      setEditDialogOpen(false);
      setSelectedPurchase(null);
    }
  };

  const handleEditFormChange = (field: keyof Purchase, value: string | number) => {
    const updatedForm = { ...editForm, [field]: value };
    
    // Auto-calculate total when quantity or unitPrice changes
    if (field === 'quantity' || field === 'unitPrice') {
      updatedForm.total = updatedForm.quantity * updatedForm.unitPrice;
    }
    
    setEditForm(updatedForm);
  };

  const totalAmount = filteredPurchases.reduce((sum, purchase) => sum + purchase.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Consultar Compras
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Filtra las compras por proveedor o fecha para consultar el historial de compras de tu tienda de mascotas
          </p>
        </div>

        {/* Filters Card */}
        <Card className="border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-primary" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Supplier Filter */}
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

              {/* Start Date Filter */}
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
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date Filter */}
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
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Filter Buttons */}
              <div className="space-y-2 flex flex-col justify-end">
                <Button 
                  onClick={handleFilter}
                  className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="h-10 border-border/50 hover:bg-secondary/50 rounded-lg"
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50 shadow-md bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{filteredPurchases.length}</p>
                <p className="text-sm text-muted-foreground">Compras encontradas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-md bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
                <p className="text-sm text-muted-foreground">Total invertido</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-md bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {filteredPurchases.reduce((sum, purchase) => sum + purchase.quantity, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Productos comprados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        <Card className="border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Resultados de la Consulta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Producto</TableHead>
                    <TableHead className="font-semibold">Proveedor</TableHead>
                    <TableHead className="font-semibold text-right">Cantidad</TableHead>
                    <TableHead className="font-semibold text-right">Precio Unitario</TableHead>
                    <TableHead className="font-semibold text-right">Total</TableHead>
                    <TableHead className="font-semibold text-center">Fecha</TableHead>
                    <TableHead className="font-semibold text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPurchases.length > 0 ? (
                    filteredPurchases.map((purchase) => (
                      <TableRow key={purchase.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{purchase.product}</TableCell>
                        <TableCell className="text-muted-foreground">{purchase.supplier}</TableCell>
                        <TableCell className="text-right">{purchase.quantity}</TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(purchase.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold">
                          {formatCurrency(purchase.total)}
                        </TableCell>
                        <TableCell className="text-center">
                          {format(new Date(purchase.date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditClick(purchase)}
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteClick(purchase)}
                              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No se encontraron compras con los filtros aplicados
                      </TableCell>
                    </TableRow>
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
          <DialogHeader>
            <DialogTitle>Modificar Compra</DialogTitle>
            <DialogDescription>
              Edita los detalles de la compra. El total se calculará automáticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-product">Producto</Label>
              <Input
                id="edit-product"
                value={editForm.product}
                onChange={(e) => handleEditFormChange('product', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-supplier">Proveedor</Label>
                <Select 
                  value={editForm.supplier} 
                  onValueChange={(value) => handleEditFormChange('supplier', value)}
                >
                  <SelectTrigger id="edit-supplier">
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
                <Label htmlFor="edit-date">Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editForm.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editForm.date ? format(new Date(editForm.date), "dd/MM/yyyy") : "Seleccionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editForm.date ? new Date(editForm.date) : undefined}
                      onSelect={(date) => handleEditFormChange('date', date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-quantity">Cantidad</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={editForm.quantity}
                  onChange={(e) => handleEditFormChange('quantity', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-unitPrice">Precio Unitario</Label>
                <Input
                  id="edit-unitPrice"
                  type="number"
                  value={editForm.unitPrice}
                  onChange={(e) => handleEditFormChange('unitPrice', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-total">Total</Label>
              <Input
                id="edit-total"
                type="text"
                value={formatCurrency(editForm.total)}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSubmit}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la compra de:
              <span className="font-semibold block mt-2">{selectedPurchase?.product}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}