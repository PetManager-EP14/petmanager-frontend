import { Plus, ShoppingCart, Package, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function QuickActions() {
  const actions = [
    {
      title: "Nueva Venta",
      description: "Registrar una nueva venta",
      icon: ShoppingCart,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Nueva Compra",
      description: "Registrar compra a proveedor",
      icon: Package,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Agregar Producto",
      description: "Añadir producto al inventario",
      icon: Plus,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Ver Reportes",
      description: "Consultar reportes y estadísticas",
      icon: FileText,
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ];

  return (
    <Card className="pet-card">
      <CardHeader>
        <CardTitle className="font-poppins text-pet-h3">Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-3 flex flex-col items-center gap-2 hover:shadow-md transition-all min-h-[100px]"
            >
              <div className={`p-2 rounded-full ${action.color} text-white`}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="text-center">
                <div className="font-roboto font-medium text-xs leading-tight">{action.title}</div>
                <div className="text-[10px] text-muted-foreground leading-tight mt-1">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}