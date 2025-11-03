import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

interface Sale {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  date: string;
  customer: string;
}

const mockSales: Sale[] = [
  {
    id: "1",
    product: "Alimento Premium para Perro Royal Canin 15kg",
    quantity: 2,
    unitPrice: 250000,
    total: 500000,
    date: "2024-01-15",
    customer: "Carlos Rodríguez"
  },
  {
    id: "2",
    product: "Juguete Kong Classic Mediano",
    quantity: 1,
    unitPrice: 65000,
    total: 65000,
    date: "2024-01-14",
    customer: "María González"
  },
  {
    id: "3",
    product: "Collar LED Recargable para Perro",
    quantity: 1,
    unitPrice: 55000,
    total: 55000,
    date: "2024-01-13",
    customer: "Jorge Martínez"
  },
  {
    id: "4",
    product: "Arena Sanitaria para Gato Fresh Step 20kg",
    quantity: 3,
    unitPrice: 95000,
    total: 285000,
    date: "2024-01-12",
    customer: "Ana Pérez"
  },
  {
    id: "5",
    product: "Correa Retráctil Flexi 5m",
    quantity: 1,
    unitPrice: 120000,
    total: 120000,
    date: "2024-01-11",
    customer: "Luis Torres"
  },
  {
    id: "6",
    product: "Snacks Dentales para Perro Pedigree",
    quantity: 5,
    unitPrice: 35000,
    total: 175000,
    date: "2024-01-10",
    customer: "Carlos Rodríguez"
  },
  {
    id: "7",
    product: "Transportadora Plástica Grande",
    quantity: 1,
    unitPrice: 180000,
    total: 180000,
    date: "2024-01-08",
    customer: "María González"
  },
  {
    id: "8",
    product: "Vitaminas para Gato Whiskas",
    quantity: 2,
    unitPrice: 42000,
    total: 84000,
    date: "2024-01-07",
    customer: "Jorge Martínez"
  }
];

const customers = [
  "Carlos Rodríguez",
  "María González", 
  "Jorge Martínez",
  "Ana Pérez",
  "Luis Torres"
];

export default function ConsultSales() {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [filteredSales, setFilteredSales] = useState<Sale[]>(mockSales);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [editForm, setEditForm] = useState<Sale>({
    id: "",
    product: "",
    quantity: 0,
    unitPrice: 0,
    total: 0,
    date: "",
    customer: ""
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
    let filtered = [...sales];

    // Filter by customer
    if (selectedCustomer) {
      filtered = filtered.filter(sale => sale.customer === selectedCustomer);
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(sale => new Date(sale.date) >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(sale => new Date(sale.date) <= endDate);
    }

    setFilteredSales(filtered);
  };

  const clearFilters = () => {
    setSelectedCustomer("");
    setStartDate(undefined);
    setEndDate(undefined);
    setFilteredSales(sales);
  };

  const handleEditClick = (sale: Sale) => {
    setSelectedSale(sale);
    setEditForm(sale);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (sale: Sale) => {
    setSelectedSale(sale);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedSale) {
      const updatedSales = sales.filter(s => s.id !== selectedSale.id);
      setSales(updatedSales);
      
      // Update filtered sales
      const updatedFiltered = filteredSales.filter(s => s.id !== selectedSale.id);
      setFilteredSales(updatedFiltered);
      
      toast({
        title: "Venta eliminada",
        description: "La venta ha sido eliminada exitosamente.",
      });
      setDeleteDialogOpen(false);
      setSelectedSale(null);
    }
  };

  const handleEditSubmit = () => {
    if (selectedSale) {
      const updatedSales = sales.map(s => 
        s.id === selectedSale.id ? editForm : s
      );
      setSales(updatedSales);
      
      // Update filtered sales
      const updatedFiltered = filteredSales.map(s => 
        s.id === selectedSale.id ? editForm : s
      );
      setFilteredSales(updatedFiltered);
      
      toast({
        title: "Venta actualizada",
        description: "La venta ha sido actualizada exitosamente.",
      });
      setEditDialogOpen(false);
      setSelectedSale(null);
    }
  };

  const handleEditFormChange = (field: keyof Sale, value: string | number) => {
    const updatedForm = { ...editForm, [field]: value };
    
    // Auto-calculate total when quantity or unitPrice changes
    if (field === 'quantity' || field === 'unitPrice') {
      updatedForm.total = updatedForm.quantity * updatedForm.unitPrice;
    }
    
    setEditForm(updatedForm);
  };

  const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Consultar Ventas
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Filtra las ventas por cliente o fecha para consultar el historial de ventas de tu tienda de mascotas
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
              {/* Customer Filter */}
              <div className="space-y-2">
                <Label htmlFor="customer">Cliente</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger className="h-12 border-border/50 focus:border-primary rounded-lg">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer} value={customer}>
                        {customer}
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
                <p className="text-2xl font-bold text-primary">{filteredSales.length}</p>
                <p className="text-sm text-muted-foreground">Ventas encontradas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-md bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
                <p className="text-sm text-muted-foreground">Total vendido</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 shadow-md bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {filteredSales.reduce((sum, sale) => sum + sale.quantity, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Productos vendidos</p>
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
                    <TableHead className="font-semibold">Cliente</TableHead>
                    <TableHead className="font-semibold text-right">Cantidad</TableHead>
                    <TableHead className="font-semibold text-right">Precio Unitario</TableHead>
                    <TableHead className="font-semibold text-right">Total</TableHead>
                    <TableHead className="font-semibold text-center">Fecha</TableHead>
                    <TableHead className="font-semibold text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.length > 0 ? (
                    filteredSales.map((sale) => (
                      <TableRow key={sale.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{sale.product}</TableCell>
                        <TableCell className="text-muted-foreground">{sale.customer}</TableCell>
                        <TableCell className="text-right">{sale.quantity}</TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(sale.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold">
                          {formatCurrency(sale.total)}
                        </TableCell>
                        <TableCell className="text-center">
                          {format(new Date(sale.date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditClick(sale)}
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteClick(sale)}
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
                        No se encontraron ventas con los filtros aplicados
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
            <DialogTitle>Modificar Venta</DialogTitle>
            <DialogDescription>
              Edita los detalles de la venta. El total se calculará automáticamente.
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
                <Label htmlFor="edit-quantity">Cantidad</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={editForm.quantity}
                  onChange={(e) => handleEditFormChange('quantity', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-unitPrice">Precio Unitario</Label>
                <Input
                  id="edit-unitPrice"
                  type="number"
                  value={editForm.unitPrice}
                  onChange={(e) => handleEditFormChange('unitPrice', parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-customer">Cliente</Label>
              <Select 
                value={editForm.customer} 
                onValueChange={(value) => handleEditFormChange('customer', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer} value={customer}>
                      {customer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Fecha</Label>
              <Input
                id="edit-date"
                type="date"
                value={editForm.date}
                onChange={(e) => handleEditFormChange('date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Calculado</Label>
              <div className="h-10 px-3 py-2 bg-muted border border-border rounded-md flex items-center font-semibold">
                {formatCurrency(editForm.total)}
              </div>
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
              Esta acción no se puede deshacer. Se eliminará permanentemente la venta
              de <strong>{selectedSale?.product}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}