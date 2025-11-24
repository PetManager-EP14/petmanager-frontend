import { useEffect, useState } from "react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button"; 
import { Label } from "@/components/ui/label"; 
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"; 
import { Calendar } from "@/components/ui/calendar"; 
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"; 
import {
    Select,
    SelectContent, 
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"; 
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"; 
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"; 
import {
    CalendarIcon,
    Search,
    Filter,
    Pencil, 
    Trash2,
} from "lucide-react"; 
import { format } from "date-fns"; 
import { cn } from "@/lib/utils"; 
import { useToast } from "@/hooks/use-toast"; 
import { Input } from "@/components/ui/input"; 
// Servicio real
import { getSales } from "@/services/salesService"; 

// Interfaz que representa una fila en la tabla del frontend
interface Sale { 
    id: string;
    product: string;
    quantity: number;
    unitPrice: number;
    total: number;
    date: string;
    customer: string;
}

export default function ConsultSales() {
    const [sales, setSales] = useState<Sale[]>([]); 
    const [filteredSales, setFilteredSales] = useState<Sale[]>([]); 
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
        customer: "", 
    });
    const { toast } = useToast(); 

    // ---------- FORMATEADOR DE MONEDA ----------
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(amount); 

    // ---------- CARGA DE VENTAS DESDE BACKEND (CORRECCIÓN CLAVE) ----------
    const fetchSales = async () => {
        try {
            // data es List<SaleDTO> (donde SaleDTO tiene List<SaleDetailDTO> details)
            const { data } = await getSales(); 

            const mapped: Sale[] = data.map((item) => {
                // ** LÓGICA DE EXTRACCIÓN CORREGIDA **
                // Obtenemos el primer detalle de la venta para resumir en la tabla
                const detail =
                    item.details && item.details.length > 0 ? item.details : {};

                // Asumimos que SaleDetailDTO (mapeado en el backend) contiene productName y unitPrice
                const productName = detail.productName ?? "Producto Desconocido";
                // Aseguramos que unitPrice sea un número (0 si es nulo) para evitar $ NaN
                const unitPrice = detail.unitPrice ?? 0; 
                const quantity = detail.amount ?? 0;

                return {
                    // Usamos saleId como ID (Long en backend, string en frontend)
                    id: item.saleId ? item.saleId.toString() : "",
                    product: productName,
                    quantity: quantity,
                    unitPrice: unitPrice,
                    total: item.total,
                    // customerName ahora se mapea en SaleDTO gracias a SaleMapper.java
                    date: item.date,
                    customer: item.customerName ?? "Cliente",
                };
            });
            setSales(mapped); [8, 19]
            setFilteredSales(mapped); [8, 19]
        } catch (error) {
            toast({
                title: "Error al cargar ventas", 
                description: "No fue posible obtener la información desde el servidor.", 
                variant: "destructive", 
            });
        }
    };
    
    useEffect(() => {
        fetchSales(); 
    }, []); [9, 20]

    // ---------- FILTROS ----------
    const handleFilter = () => { 
        let filtered = [...sales];
        if (selectedCustomer)
            filtered = filtered.filter((s) => s.customer === selectedCustomer); 
        if (startDate)
            filtered = filtered.filter(
                (s) => new Date(s.date) >= new Date(startDate)
            ); [9, 20]
        if (endDate)
            filtered = filtered.filter((s) => new Date(s.date) <= new Date(endDate)); 
        setFilteredSales(filtered); [10, 21]
    };

    const clearFilters = () => { [10, 21]
        setSelectedCustomer("");
        setStartDate(undefined);
        setEndDate(undefined);
        setFilteredSales(sales); [10, 21]
    };

    // ---------- EDICIÓN ----------
    const handleEditClick = (sale: Sale) => { 
        setSelectedSale(sale);
        setEditForm(sale);
        setEditDialogOpen(true); 
    };

    const handleEditFormChange = (
        field: keyof Sale,
        value: string | number
    ) => {
        const updated = { ...editForm, [field]: value }; [10, 21, 22]

        if (field === "quantity" || field === "unitPrice") {
            // Recalcula el total si cambian cantidad o precio
            updated.total = (updated.quantity as number) * (updated.unitPrice as number); 
        }
        setEditForm(updated); 
    };

    const handleEditSubmit = () => { 
        if (!selectedSale) return;
        // Lógica de actualización local simulada (debe ser reemplazada por una llamada PUT/PATCH real)
        const updated = sales.map((s) =>
            s.id === selectedSale.id ? editForm : s
        ); [11, 22]
        setSales(updated); 
        setFilteredSales(updated); 
        toast({
            title: "Venta modificada", 
            description: "Los cambios fueron aplicados exitosamente.", 
        });
        setEditDialogOpen(false); 
    };

    // ---------- ELIMINACIÓN ----------
    const handleDeleteClick = (sale: Sale) => { 
        setSelectedSale(sale);
        setDeleteDialogOpen(true); 
    };

    const handleDeleteConfirm = () => { 
        if (!selectedSale) return;
        // Lógica de eliminación local simulada (debe ser reemplazada por una llamada DELETE real)
        const updated = sales.filter((s) => s.id !== selectedSale.id); 
        setSales(updated); 
        setFilteredSales(updated); 
        toast({
            title: "Venta eliminada", 
            description: "La venta fue eliminada correctamente.", 
        });
        setDeleteDialogOpen(false); [12, 23]
    };

    const totalAmount = filteredSales.reduce(
        (sum, s) => sum + s.total,
        0
    ); [13, 24]
    const customers = [...new Set(sales.map((s) => s.customer))]; [13, 24]

  // -----------------------------------------------------------------------
  // ----------------------------- RENDER ----------------------------------
  // -----------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ------------------------ HEADER ------------------------------ */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Consultar Ventas
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Filtra las ventas por cliente o fecha para consultar el historial de tu tienda.
          </p>
        </div>

        {/* ------------------------ FILTROS ------------------------------ */}
        <Card className="border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-primary" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Cliente */}
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select
                  value={selectedCustomer}
                  onValueChange={setSelectedCustomer}
                >
                  <SelectTrigger className="h-12 rounded-lg">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fecha Inicial */}
              <div className="space-y-2">
                <Label>Fecha Inicial</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 w-full rounded-lg",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy") : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Fecha Final */}
              <div className="space-y-2">
                <Label>Fecha Final</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-12 w-full rounded-lg",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy") : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Botones */}
              <div className="space-y-2 flex flex-col justify-end">
                <Button onClick={handleFilter} className="h-12">
                  <Search className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
                <Button variant="outline" onClick={clearFilters} className="h-10">
                  Limpiar
                </Button>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* ---------------------- RESUMEN -------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-md">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{filteredSales.length}</p>
              <p className="text-muted-foreground text-sm">Ventas encontradas</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
              <p className="text-muted-foreground text-sm">Total vendido</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {filteredSales.reduce((sum, s) => sum + s.quantity, 0)}
              </p>
              <p className="text-muted-foreground text-sm">Productos vendidos</p>
            </CardContent>
          </Card>
        </div>

        {/* ---------------------- TABLA -------------------------- */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Resultados de la Consulta</CardTitle>
          </CardHeader>
          <CardContent>

            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Producto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Precio Unitario</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Fecha</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredSales.length > 0 ? (
                    filteredSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{sale.product}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {sale.customer}
                        </TableCell>
                        <TableCell className="text-right">{sale.quantity}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(sale.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(sale.total)}
                        </TableCell>
                        <TableCell className="text-center">
                          {format(new Date(sale.date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditClick(sale)}
                              className="hover:text-primary"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteClick(sale)}
                              className="hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No se encontraron ventas
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

              </Table>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* ---------------------- EDITAR -------------------------- */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modificar Venta</DialogTitle>
            <DialogDescription>
              Edita los detalles de la venta. El total se calcula automáticamente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">

            {/* Producto */}
            <div className="space-y-2">
              <Label>Producto</Label>
              <Input
                value={editForm.product}
                onChange={(e) =>
                  handleEditFormChange("product", e.target.value)
                }
              />
            </div>

            {/* Cantidad y precio unitario */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  value={editForm.quantity}
                  onChange={(e) =>
                    handleEditFormChange(
                      "quantity",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Precio Unitario</Label>
                <Input
                  type="number"
                  value={editForm.unitPrice}
                  onChange={(e) =>
                    handleEditFormChange(
                      "unitPrice",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            {/* Cliente */}
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input
                value={editForm.customer}
                onChange={(e) =>
                  handleEditFormChange("customer", e.target.value)
                }
              />
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Input
                type="date"
                value={editForm.date}
                onChange={(e) =>
                  handleEditFormChange("date", e.target.value)
                }
              />
            </div>

            {/* Total */}
            <div className="space-y-2">
              <Label>Total Calculado</Label>
              <div className="h-10 px-3 py-2 bg-muted border rounded-md flex items-center font-semibold">
                {formatCurrency(editForm.total)}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSubmit}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------------- ELIMINAR -------------------------- */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estas seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Vas a eliminar la venta de{" "}
              <strong>{selectedSale?.product}</strong>. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
