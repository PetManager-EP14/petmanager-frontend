import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Heart,
  PawPrint,
  Home,
  ShoppingBag
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Ventas", url: "/ventas", icon: ShoppingCart },
  { title: "Compras", url: "/consultar-compras", icon: ShoppingBag },
  { title: "Crear Compra", url: "/crear-compra", icon: Package },
  { title: "Inventario", url: "/inventario", icon: TrendingUp },
  { title: "Reportes", url: "/reportes", icon: BarChart3 },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Mascotas", url: "/mascotas", icon: Heart },
];

export function PetManagerSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-muted transition-colors";

  return (
    <Sidebar
      className={`${isCollapsed ? "w-16" : "w-64"} border-r border-border`}
      collapsible="icon"
    >
      <SidebarContent className="bg-card">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <PawPrint className="h-5 w-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-poppins font-bold text-lg pet-gradient-text">
                  PetManager
                </h2>
                <p className="text-xs text-muted-foreground">Sistema de Gestión</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-roboto font-medium">
            {!isCollapsed && "Gestión Principal"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavClass}
                    >
                      <item.icon className="h-5 w-5 text-black" />
                      {!isCollapsed && (
                        <span className="font-roboto font-medium text-foreground">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}