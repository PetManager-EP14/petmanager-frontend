import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react"; 
import { format } from "date-fns"; 
import { cn } from "@/lib/utils"; 
import { useToast } from "@/hooks/use-toast"; 
import { createPurchase } from "@/services/purchaseService"; 


interface Purchase {
    id: number;
    productName: string;
    supplierName: string;
    quantity: number;
    price: number;
    total: number;
    date: string;
}

// Datos de ejemplo para la tabla de "Últimas Compras" 
const mockRecentPurchases: Purchase[] = [
    {
        id: 1,
        productName: "Alimento Premium para Perro Royal Canin 15kg",
        quantity: 12,
        price: 180000,
        total: 2160000,
        date: "2024-01-15",
        supplierName: "Pet Supply Co."
    },
    {
        id: 2,
        productName: "Juguete Kong Classic Mediano",
        quantity: 24,
        price: 45000,
        total: 1080000,
        date: "2024-01-12",
        supplierName: "Mascotas Premium"
    },
    {
        id: 3,
        productName: "Collar LED Recargable para Perro",
        quantity: 18,
        price: 35000,
        total: 630000,
        date: "2024-01-10",
        supplierName: "Distribuidora Animal Care"
    }
];

// Lista de proveedores disponibles 
const suppliers = [
    "Pet Supply Co.",
    "Mascotas Premium",
    "Distribuidora Animal Care",
    "VetSupplies",
    "PetWorld Mayorista"
];

export default function CreatePurchase() {
    const navigate = useNavigate();
    const { toast } = useToast();

    // Estado del formulario [6]
    const [formData, setFormData] = useState({
        product: "",
        quantity: "",
        unitPrice: "",
        supplier: "",
        date: undefined as Date | undefined
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDateSelect = (date: Date | undefined) => {
        setFormData(prev => ({ ...prev, date }));
    };

    // Función que calcula el total [7]
    const calculateTotal = () => {
        const quantity = parseFloat(formData.quantity) || 0;
        const unitPrice = parseFloat(formData.unitPrice) || 0;
        return quantity * unitPrice;
    };

    // Función de formato de moneda [7]
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Lógica integrada de envío del formulario (API call y manejo de errores) 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validación de campos obligatorios 
        if (!formData.product || !formData.quantity || !formData.unitPrice || !formData.supplier || !formData.date) {
            toast({
                title: "Error",
                description: "Por favor complete todos los campos",
                variant: "destructive"
            });
            return;
        }
        // 2. Preparar el cuerpo de la solicitud 
        const purchaseBody = {
            productName: formData.product,
            supplierName: formData.supplier,
            quantity: Number(formData.quantity),
            price: Number(formData.unitPrice),
            total: Number(formData.quantity) * Number(formData.unitPrice),
            date: formData.date.toISOString().split("T"), // yyyy-MM-dd 
        };

        try {
            // 3. Llamada al servicio real [3]
            await createPurchase(purchaseBody);

            toast({
                title: "Compra registrada",
                description: `La compra de ${formData.product} fue creada correctamente`,
            });
            
            // 4. Resetear formulario 
            setFormData({
                product: "",
                quantity: "",
                unitPrice: "",
                supplier: "",
                date: undefined
            });

            // 5. Redirección 
            navigate("/consultar-compras");

        } catch (error: any) {
            // 6. Manejo de errores detallado, capturando el mensaje del backend (ej: "El estado es obligatorio") [3, 9]
            toast({
                title: "Error al registrar la compra",
                description: error.message || "Intenta nuevamente",
                variant: "destructive",
            });
        }
    };

    const handleCancel = () => {
        navigate("/dashboard"); 
    };

  return (
    <div className="min-h-screen bg-pet-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-pet-text-primary mb-2">
            Crear Compra
          </h1>
          <p className="text-pet-text-secondary text-lg">
            Registra una nueva compra en el sistema de inventario
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Form Section */}
          <div className="xl:col-span-2">
            <Card className="shadow-lg border-0 bg-card backdrop-blur-sm">
              <CardHeader className="bg-muted rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-card-foreground">
                  Información de la Compra
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Producto */}
                    <div className="space-y-2">
                      <Label htmlFor="product" className="text-foreground font-medium text-base">
                        Producto *
                      </Label>
                      <Input
                        id="product"
                        placeholder="Ej: Alimento Premium para Perro Royal Canin 15kg"
                        value={formData.product}
                        onChange={(e) => handleInputChange("product", e.target.value)}
                        className="h-12 rounded-lg shadow-sm"
                      />
                    </div>

                    {/* Proveedor */}
                    <div className="space-y-2">
                      <Label htmlFor="supplier" className="text-foreground font-medium text-base">
                        Proveedor *
                      </Label>
                      <Select value={formData.supplier} onValueChange={(value) => handleInputChange("supplier", value)}>
                        <SelectTrigger className="h-12 rounded-lg shadow-sm">
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

                    {/* Cantidad */}
                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-foreground font-medium text-base">
                        Cantidad *
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="5"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange("quantity", e.target.value)}
                        className="h-12 rounded-lg shadow-sm"
                      />
                    </div>

                    {/* Precio Unitario */}
                    <div className="space-y-2">
                      <Label htmlFor="unitPrice" className="text-foreground font-medium text-base">
                        Precio Unitario (COP) *
                      </Label>
                      <Input
                        id="unitPrice"
                        type="number"
                        placeholder="180000"
                        min="0"
                        step="1000"
                        value={formData.unitPrice}
                        onChange={(e) => handleInputChange("unitPrice", e.target.value)}
                        className="h-12 rounded-lg shadow-sm"
                      />
                    </div>

                    {/* Fecha */}
                    <div className="space-y-2 md:col-span-1">
                      <Label className="text-foreground font-medium text-base">
                        Fecha de Compra *
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 justify-start text-left font-normal rounded-lg shadow-sm",
                              !formData.date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.date ? format(formData.date, "PPP") : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={handleDateSelect}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Total Calculado */}
                    <div className="space-y-2">
                      <Label className="text-foreground font-medium text-base">
                        Total Calculado
                      </Label>
                      <div className="h-12 px-4 py-2 bg-muted border border-border rounded-lg flex items-center text-foreground font-semibold text-lg">
                        {formatCurrency(calculateTotal())}
                      </div>
                    </div>

                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-medium text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Guardar Compra
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1 h-12 font-medium text-lg rounded-lg"
                    >
                      Cancelar
                    </Button>
                  </div>

                </form>
              </CardContent>
            </Card>
          </div>

          {/* Últimas Compras */}
          <div className="xl:col-span-1">
            <Card className="shadow-lg border-0 bg-card backdrop-blur-sm h-fit">
              <CardHeader className="bg-muted rounded-t-lg">
                <CardTitle className="text-xl font-bold text-card-foreground">
                  Últimas Compras
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-hidden rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted">
                        <TableHead className="font-semibold text-foreground">Producto</TableHead>
                        <TableHead className="font-semibold text-foreground">Cantidad</TableHead>
                        <TableHead className="font-semibold text-foreground">Total</TableHead>
                        <TableHead className="font-semibold text-foreground">Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRecentPurchases.map((purchase) => (
                        <TableRow key={purchase.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="font-medium text-foreground">
                            {purchase.productName}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {purchase.quantity}
                          </TableCell>
                          <TableCell className="text-muted-foreground font-medium">
                            {formatCurrency(purchase.total)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(purchase.date), "dd/MM/yyyy")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
