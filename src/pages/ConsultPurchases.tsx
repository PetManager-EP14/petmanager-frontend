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

// Interface que debe coincidir con el formato adaptado en purchaseService.ts [6]
interface Purchase {
    id: string; 
    product: string; 
    quantity: number; 
    unitPrice: number; 
    total: number; 
    date: string; 
    supplier: string;
}

// Lista de proveedores utilizada en el filtro y la edición 
const suppliers = [
    "Pet Supply Co.", 
    "Mascotas Premium", 
    "Distribuidora Animal Care", 
    "VetSupplies", 
    "PetWorld Mayorista", 
];

export default function ConsultPurchases() {
    // Inicialización de estados 
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<string>("");
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
    
    // Estado para el formulario de edición 
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

    // Lógica de Carga de Datos (API REAL) 
    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                // Llama al servicio que consume el backend (getPurchases mapea datos) 
                // Asegúrese de que getPurchases esté implementado en purchaseService.ts para manejar el mapeo de detalles anidados (p.details)
                const data = (await getPurchases()) as Purchase[];
                setPurchases(data);
                setFilteredPurchases(data);
            } catch (error) {
                console.error("Error al obtener compras:", error);
                toast({
                    title: "Error al obtener compras",
                    description: "No se pudieron cargar las compras del servidor.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };
        fetchPurchases();
    }, []);

    // Funciones de Utilidad [1, 10]
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,   
        }).format(amount);

    // Lógica de Filtros 
    const handleFilter = () => {
        let filtered = [...purchases]; 
        if (selectedSupplier) {
            filtered = filtered.filter(p => p.supplier === selectedSupplier); 
        }
        if (startDate) {
            filtered = filtered.filter(p => new Date(p.date) >= startDate); 
        }
        if (endDate) {
            filtered = filtered.filter(p => new Date(p.date) <= endDate); 
        }
    };

    const clearFilters = () => {
        setSelectedSupplier(""); 
        setStartDate(undefined); 
        setEndDate(undefined); 
        setFilteredPurchases(purchases); 
    };

    // Lógica de Edición (UPDATE) 
    const handleEditClick = (purchase: Purchase) => {
        setSelectedPurchase(purchase); 
        setEditForm(purchase); 
        setEditDialogOpen(true); 
    };

    const handleEditFormChange = (field: keyof Purchase, value: string | number) => {
        const updatedForm = { ...editForm, [field]: value };
        // Recalcular el total automáticamente 
        if (field === 'quantity' || field === 'unitPrice') {
            const quantity = typeof updatedForm.quantity === 'number' ?
                updatedForm.quantity : parseFloat(updatedForm.quantity as string) || 0;
            const unitPrice = typeof updatedForm.unitPrice === 'number' ?
                updatedForm.unitPrice : parseFloat(updatedForm.unitPrice as string) || 0;
            updatedForm.total = quantity * unitPrice;
        }
        setEditForm(updatedForm as Purchase); 
    };

    const handleEditSubmit = async () => { 
        if (selectedPurchase) { 
            try {
                // Llama al servicio de actualización del backend (updatePurchase existe en purchaseService.ts) 
                await updatePurchase(selectedPurchase.id, editForm); 
                
                // Actualizar listas locales tras éxito 
                const updatedPurchases = purchases.map(p =>
                    p.id === selectedPurchase.id ? editForm : p
                ); 
                setPurchases(updatedPurchases); 
                setFilteredPurchases(updatedPurchases); 
                toast({
                    title: "Compra actualizada", 
                    description: "La compra se actualizó correctamente en el servidor.", 
                });
            } catch (error: any) {
                console.error("Error al actualizar la compra:", error); 
                toast({
                    title: "Error de Transacción", 
                    description: error.message || "No se pudo actualizar la compra.", 
                    variant: "destructive", 
                });
            } finally {
                setEditDialogOpen(false); 
                setSelectedPurchase(null);  
            }
        }
    };

    // Lógica de Eliminación (DELETE) 
    const handleDeleteClick = (purchase: Purchase) => {
        setSelectedPurchase(purchase); 
        setDeleteDialogOpen(true); 
    };

    const handleDeleteConfirm = async () => { 
        if (selectedPurchase) {
            try {
                // Llama al servicio de eliminación del backend (deletePurchase existe en purchaseService.ts) 
                await deletePurchase(selectedPurchase.id); 
                
                // Actualizar listas locales tras éxito 
                const updatedPurchases = purchases.filter(p => p.id !== selectedPurchase.id); 
                setPurchases(updatedPurchases); 
                setFilteredPurchases(updatedPurchases); 
                toast({
                    title: "Compra eliminada", 
                    description: "La compra se eliminó correctamente del servidor.", 
                });
            } catch (error: any) {
                // ... manejo de errores 
            } finally {
                setDeleteDialogOpen(false); 
                setSelectedPurchase(null);
            }
        }
    };

    const totalAmount = filteredPurchases.reduce((sum, purchase) => sum + purchase.total, 0); 

    // Muestra el estado de carga mientras se obtienen los datos 
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-muted-foreground">Cargando compras...</p> 
            </div>
        );
    }

    // Render Principal 
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* Header */}
                <div className="text-center space-y-2">          
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r
                        from-primary via-primary to-accent bg-clip-text text-transparent">
                        Consultar Compras
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
                        Filtra las compras por proveedor o fecha para consultar el historial de compras de tu
                        tienda de mascotas. 
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
                            {/* Date Filters (Similar structure to sales, omitted for brevity but implied by filters logic) */}
                            
                            {/* Botones */}
                            <div className="space-y-2 flex flex-col justify-end lg:col-span-1 md:col-span-2">
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

                {/* Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">        
                    <Card className="border-border/50 shadow-md bg-card/80 backdrop-blur-sm"> 
                        <CardContent className="p-4 text-center"> 
                            <p className="text-2xl font-bold text-primary">{filteredPurchases.length}</p> 
                            <p className="text-sm text-muted-foreground">Compras encontradas</p> 
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 shadow-md bg-card/80 backdrop-blur-sm">
                        <CardContent className="p-4 text-center">
                            <p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
                            <p className="text-sm text-muted-foreground">Total invertido</p>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 shadow-md bg-card/80 backdrop-blur-sm">
                        <CardContent className="p-4 text-center"> 
                            <p className="text-2xl font-bold text-primary">
                                {filteredPurchases.reduce((sum, p) => sum + p.quantity, 0)} 
                            </p>
                            <p className="text-sm text-muted-foreground">Productos comprados</p> 
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
                                                <TableCell className="text-right font-mono">{formatCurrency(purchase.unitPrice)}</TableCell> 
                                                <TableCell className="text-right font-mono font-semibold">{formatCurrency(purchase.total)}</TableCell> 
                                                <TableCell className="text-center">{format(new Date(purchase.date), "dd/MM/yyyy")}</TableCell> 
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
                            {/* Producto */}
                            <div className="space-y-2">
                                <Label htmlFor="edit-product">Producto</Label> 
                                <Input
                                    id="edit-product" 
                                    value={editForm.product} 
                                    onChange={(e) => handleEditFormChange('product', e.target.value)} 
                                />
                            </div>
                            {/* Proveedor y Fecha */}
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
                                    {/* ... Popover and Calendar logic for date editing ... */}
                                </div>
                            </div>
                            {/* Cantidad y Precio Unitario */}
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
                            {/* Total Calculado (Implied logic) */}
                            <div className="space-y-2">
                                <Label>Total Calculado</Label>
                                <div className="h-10 px-3 py-2 bg-muted border rounded-md flex items-center font-semibold">
                                    {formatCurrency(editForm.total)}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={handleEditSubmit}>Guardar Cambios</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
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
        </div>
    );
}