import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  Heart
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import heroImage from "@/assets/pet-store-hero.jpg";

export default function PetManagerDashboard() {
  const statsData = [
    {
      title: "Ventas del Mes",
      value: "$12,456",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Productos Vendidos",
      value: "234",
      change: "+8.2%",
      changeType: "positive" as const,
      icon: ShoppingCart,
    },
    {
      title: "Inventario Total",
      value: "1,847",
      change: "-3.1%",
      changeType: "negative" as const,
      icon: Package,
    },
    {
      title: "Clientes Activos",
      value: "89",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: Heart,
    },
  ];

  const lowStockItems = [
    { name: "Alimento Premium Dog Chow 15kg", stock: 3, min: 10 },
    { name: "Arena Sanitaria para Gatos 20kg", stock: 5, min: 15 },
    { name: "Juguetes Kong Originales", stock: 2, min: 8 },
    { name: "Collar Antipulgas Bayer", stock: 4, min: 12 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div 
        className="pet-hero-section rounded-2xl p-8 text-white relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(var(--pet-primary) / 0.85), hsl(var(--pet-accent) / 0.85)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-pet-h1 font-poppins font-bold mb-2">
            Bienvenido a PetManager
          </h1>
          <p className="text-lg font-roboto opacity-90">
            Sistema integral de gestión para tu tienda de mascotas. 
            Controla ventas, compras e inventario desde un solo lugar.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Placeholder */}
        <div className="lg:col-span-1">
          <Card className="pet-card">
            <CardHeader>
              <CardTitle className="font-poppins text-pet-h3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Tendencia de Ventas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-roboto">Gráfico de ventas próximamente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>

        {/* Low Stock Alert */}
        <Card className="pet-card">
          <CardHeader>
            <CardTitle className="font-poppins text-pet-h3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Productos con Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-roboto font-medium text-sm">{item.name}</p>
                    <span className="text-sm text-muted-foreground">
                      {item.stock}/{item.min}
                    </span>
                  </div>
                  <Progress 
                    value={(item.stock / item.min) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}