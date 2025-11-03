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
import { toast } from "@/hooks/use-toast";

interface Purchase {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  date: string;
  supplier: string;
}

const mockRecentPurchases: Purchase[] = [
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
  }
];

const suppliers = [
  "Pet Supply Co.",
  "Mascotas Premium", 
  "Distribuidora Animal Care",
  "VetSupplies",
  "PetWorld Mayorista"
];

export default function CreatePurchase() {
  const navigate = useNavigate();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.product || !formData.quantity || !formData.unitPrice || !formData.supplier || !formData.date) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive"
      });
      return;
    }

    // Simulate saving purchase
    toast({
      title: "Compra creada",
      description: `Compra de ${formData.product} registrada exitosamente`,
    });

    // Reset form
    setFormData({
      product: "",
      quantity: "",
      unitPrice: "",
      supplier: "",
      date: undefined
    });
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const calculateTotal = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    return quantity * unitPrice;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
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
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-pet-primary/10 to-pet-secondary/20 rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-pet-text-primary">
                  Información de la Compra
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Producto */}
                    <div className="space-y-2">
                      <Label htmlFor="product" className="text-pet-text-primary font-medium text-base">
                        Producto *
                      </Label>
                      <Input
                        id="product"
                        placeholder="Ej: Alimento Premium para Perro Royal Canin 15kg"
                        value={formData.product}
                        onChange={(e) => handleInputChange("product", e.target.value)}
                        className="h-12 border-pet-secondary/30 focus:border-pet-accent rounded-lg shadow-sm"
                      />
                    </div>

                    {/* Proveedor */}
                    <div className="space-y-2">
                      <Label htmlFor="supplier" className="text-pet-text-primary font-medium text-base">
                        Proveedor *
                      </Label>
                      <Select value={formData.supplier} onValueChange={(value) => handleInputChange("supplier", value)}>
                        <SelectTrigger className="h-12 border-pet-secondary/30 focus:border-pet-accent rounded-lg shadow-sm">
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
                      <Label htmlFor="quantity" className="text-pet-text-primary font-medium text-base">
                        Cantidad *
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="5"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange("quantity", e.target.value)}
                        className="h-12 border-pet-secondary/30 focus:border-pet-accent rounded-lg shadow-sm"
                      />
                    </div>

                    {/* Precio Unitario */}
                    <div className="space-y-2">
                      <Label htmlFor="unitPrice" className="text-pet-text-primary font-medium text-base">
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
                        className="h-12 border-pet-secondary/30 focus:border-pet-accent rounded-lg shadow-sm"
                      />
                    </div>

                    {/* Fecha de Compra */}
                    <div className="space-y-2 md:col-span-1">
                      <Label className="text-pet-text-primary font-medium text-base">
                        Fecha de Compra *
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 justify-start text-left font-normal border-pet-secondary/30 hover:border-pet-accent rounded-lg shadow-sm",
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
                      <Label className="text-pet-text-primary font-medium text-base">
                        Total Calculado
                      </Label>
                      <div className="h-12 px-4 py-2 bg-pet-secondary/30 border border-pet-secondary/50 rounded-lg flex items-center text-pet-text-primary font-semibold text-lg">
                        {formatCurrency(calculateTotal())}
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-pet-accent hover:bg-pet-accent/90 text-white font-medium text-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Guardar Compra
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1 h-12 border-pet-secondary hover:bg-pet-secondary/20 text-pet-text-primary font-medium text-lg rounded-lg"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Recent Purchases Table */}
          <div className="xl:col-span-1">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-fit">
              <CardHeader className="bg-gradient-to-r from-pet-primary/10 to-pet-secondary/20 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-pet-text-primary">
                  Últimas Compras
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-hidden rounded-lg border border-pet-secondary/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-pet-secondary/30">
                        <TableHead className="font-semibold text-pet-text-primary">Producto</TableHead>
                        <TableHead className="font-semibold text-pet-text-primary">Cantidad</TableHead>
                        <TableHead className="font-semibold text-pet-text-primary">Total</TableHead>
                        <TableHead className="font-semibold text-pet-text-primary">Fecha</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRecentPurchases.map((purchase) => (
                        <TableRow key={purchase.id} className="hover:bg-pet-secondary/10 transition-colors">
                          <TableCell className="font-medium text-pet-text-primary">
                            {purchase.product}
                          </TableCell>
                          <TableCell className="text-pet-text-secondary">
                            {purchase.quantity}
                          </TableCell>
                          <TableCell className="text-pet-text-secondary font-medium">
                            {formatCurrency(purchase.total)}
                          </TableCell>
                          <TableCell className="text-pet-text-secondary text-sm">
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