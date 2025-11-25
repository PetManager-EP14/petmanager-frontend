import { useState, useEffect } from "react";
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
import axios from "axios";

export default function CreatePurchase() {
    const navigate = useNavigate();
    const { toast } = useToast();

    // ---------------------------
    // Productos & Proveedores
    // ---------------------------
    const [products, setProducts] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const prodRes = await axios.get(import.meta.env.VITE_API_URL + "/api/products");
                const supRes = await axios.get(import.meta.env.VITE_API_URL + "/api/suppliers");

                setProducts(prodRes.data || []);
                setSuppliers(supRes.data || []);
            } catch (e) {
                toast({
                    title: "Error al cargar datos",
                    description: "No se pudieron cargar productos/proveedores",
                    variant: "destructive",
                });
            }
        };

        loadData();
    }, []);

    // --------------------------------------
    // Estado del Formulario
    // --------------------------------------
    const [formData, setFormData] = useState({
        product: "",    // productId
        quantity: "",
        unitPrice: "",
        supplier: "",   // supplierId
        date: undefined as Date | undefined
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDateSelect = (date: Date | undefined) => {
        setFormData(prev => ({ ...prev, date }));
    };

    const calculateTotal = () => {
        const quantity = parseFloat(formData.quantity) || 0;
        const price = parseFloat(formData.unitPrice) || 0;
        return quantity * price;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // --------------------------------------
    // SUBMIT — Crear Compra REAL
    // --------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.product || !formData.quantity || !formData.unitPrice || !formData.supplier || !formData.date) {
            toast({
                title: "Campos incompletos",
                description: "Debe llenar todos los campos del formulario.",
                variant: "destructive",
            });
            return;
        }

        const purchaseBody = {
            supplierId: Number(formData.supplier),
            date: formData.date.toISOString(), // OffsetDateTime compatible
            status: "REGISTERED",
            total: calculateTotal(),
            details: [
                {
                    productId: Number(formData.product),
                    quantity: Number(formData.quantity),
                    price: Number(formData.unitPrice)
                }
            ]
        };

        try {
            await createPurchase(purchaseBody);

            toast({
                title: "Compra registrada",
                description: "La compra fue creada correctamente.",
            });

            navigate("/consultar-compras");

        } catch (error: any) {
            toast({
                title: "Error al registrar la compra",
                description: error.message || "Verifique los datos o intente nuevamente.",
                variant: "destructive",
            });
        }
    };

    const handleCancel = () => navigate("/dashboard");

    return (
        <div className="min-h-screen bg-pet-background">
            <div className="container mx-auto px-6 py-8 max-w-7xl">
                
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-pet-text-primary mb-2">
                        Crear Compra
                    </h1>
                    <p className="text-pet-text-secondary text-lg">
                        Registra una nueva compra en el sistema de inventario
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* FORMULARIO */}
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
                                            <Label className="text-foreground font-medium text-base">Producto *</Label>
                                            <Select
                                                value={formData.product}
                                                onValueChange={(value) => handleInputChange("product", value)}
                                            >
                                                <SelectTrigger className="h-12 rounded-lg shadow-sm">
                                                    <SelectValue placeholder="Seleccionar producto" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map(prod => (
                                                        <SelectItem key={prod.id} value={String(prod.id)}>
                                                            {prod.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Proveedor */}
                                        <div className="space-y-2">
                                            <Label className="text-foreground font-medium text-base">Proveedor *</Label>
                                            <Select
                                                value={formData.supplier}
                                                onValueChange={(value) => handleInputChange("supplier", value)}
                                            >
                                                <SelectTrigger className="h-12 rounded-lg shadow-sm">
                                                    <SelectValue placeholder="Seleccionar proveedor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {suppliers.map(sup => (
                                                        <SelectItem key={sup.id} value={String(sup.id)}>
                                                            {sup.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Cantidad */}
                                        <div className="space-y-2">
                                            <Label className="text-foreground font-medium text-base">Cantidad *</Label>
                                            <Input
                                                type="number"
                                                value={formData.quantity}
                                                onChange={(e) => handleInputChange("quantity", e.target.value)}
                                                placeholder="5"
                                                min="1"
                                                className="h-12 rounded-lg shadow-sm"
                                            />
                                        </div>

                                        {/* Precio Unitario */}
                                        <div className="space-y-2">
                                            <Label className="text-foreground font-medium text-base">Precio Unitario *</Label>
                                            <Input
                                                type="number"
                                                value={formData.unitPrice}
                                                onChange={(e) => handleInputChange("unitPrice", e.target.value)}
                                                placeholder="20000"
                                                min="0"
                                                className="h-12 rounded-lg shadow-sm"
                                            />
                                        </div>

                                        {/* Fecha */}
                                        <div className="space-y-2">
                                            <Label className="text-foreground font-medium text-base">Fecha *</Label>
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
                                                        {formData.date
                                                            ? format(formData.date, "PPP")
                                                            : "Seleccionar fecha"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={formData.date}
                                                        onSelect={handleDateSelect}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        {/* Total */}
                                        <div className="space-y-2">
                                            <Label className="text-foreground font-medium text-base">Total</Label>
                                            <div className="h-12 px-4 py-2 bg-muted border rounded-lg flex items-center font-semibold text-lg">
                                                {formatCurrency(calculateTotal())}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                        <Button type="submit" className="flex-1 h-12 bg-accent hover:bg-accent/90 text-white font-medium text-lg rounded-lg shadow-md">
                                            Guardar Compra
                                        </Button>
                                        <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 h-12 font-medium text-lg rounded-lg">
                                            Cancelar
                                        </Button>
                                    </div>

                                </form>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
