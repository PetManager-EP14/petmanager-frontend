import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>(mockPurchases);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleFilter = () => {
    let filtered = [...mockPurchases];

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
    setFilteredPurchases(mockPurchases);
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
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
    </div>
  );
}