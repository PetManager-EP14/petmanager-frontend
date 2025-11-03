import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  type: "venta" | "compra";
  description: string;
  amount: number;
  date: string;
  status: "completado" | "pendiente" | "cancelado";
}

const mockTransactions: Transaction[] = [
  {
    id: "V001",
    type: "venta",
    description: "Alimento para perros Royal Canin 15kg",
    amount: 89.99,
    date: "2024-01-15",
    status: "completado",
  },
  {
    id: "C001",
    type: "compra",
    description: "Lote juguetes para gatos x50 unidades",
    amount: 245.50,
    date: "2024-01-15",
    status: "pendiente",
  },
  {
    id: "V002",
    type: "venta",
    description: "Consulta veterinaria + vacunas",
    amount: 65.00,
    date: "2024-01-14",
    status: "completado",
  },
  {
    id: "V003",
    type: "venta",
    description: "Collar antipulgas + correa premium",
    amount: 32.99,
    date: "2024-01-14",
    status: "completado",
  },
];

export function RecentTransactions() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completado":
        return "bg-green-100 text-green-800 border-green-200";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "venta" 
      ? "bg-primary/10 text-primary border-primary/20" 
      : "bg-accent/10 text-accent border-accent/20";
  };

  return (
    <Card className="pet-card">
      <CardHeader>
        <CardTitle className="font-poppins text-pet-h3">Transacciones Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className={getTypeColor(transaction.type)}>
                    {transaction.type.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </div>
                <p className="font-roboto font-medium text-sm">
                  {transaction.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.id} • {transaction.date}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-poppins font-bold ${
                  transaction.type === "venta" ? "text-green-600" : "text-blue-600"
                }`}>
                  {transaction.type === "venta" ? "+" : "-"}${transaction.amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}