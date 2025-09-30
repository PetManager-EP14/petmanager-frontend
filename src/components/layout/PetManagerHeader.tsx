import { useState } from "react";
import { Bell, Search, User, Menu, LogOut, Settings, UserIcon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutConfirmDialog } from "./LogoutConfirmDialog";
import { useNavigate } from "react-router-dom";

export function PetManagerHeader() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutDialog(false);
    navigate("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          
          <div className="flex items-center gap-2 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar productos, clientes..."
                className="pl-10 w-64 bg-background/50"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-roboto">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card border-border shadow-lg">
              <DropdownMenuLabel className="font-poppins text-card-foreground">Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem className="font-roboto text-card-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">
                <UserIcon className="h-4 w-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="font-roboto text-card-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem 
                className="font-roboto text-card-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onClick={() => navigate("/control-permisos")}
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                Control de Permisos de Rol
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem 
                className="font-roboto text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogout}
      />
    </header>
  );
}