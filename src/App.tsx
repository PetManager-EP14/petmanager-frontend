import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PetManagerLayout } from "./components/layout/PetManagerLayout";
import PetManagerDashboard from "./pages/PetManagerDashboard";
import CreatePurchase from "./pages/CreatePurchase";
import ConsultPurchases from "./pages/ConsultPurchases";
import CreateSale from "./pages/CreateSale";
import ConsultSales from "./pages/ConsultSales";
import RolePermissionsControl from "./pages/RolePermissionsControl";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import Clientes from "./pages/Clientes";
// Importamos el componente PrivateRoute, asumiendo que ahora incluye la lógica JWT/Permisos
import PrivateRoute from "./components/PrivateRoute"; 

/*
 * Inicialización de QueryClient para gestión de caché (React Query)
 */
const queryClient = new QueryClient();

/**
 * Componente principal de la aplicación.
 * Define la estructura de rutas, manejo de estado global (QueryClient) 
 * y aplicación de temas.
 */
const App = () => {
    
    // Simula la aplicación del tema oscuro/claro al montar el componente (como se ve en el source)
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Routes>
                        
                        {/* Ruta pública (Login) */}
                        <Route path="/login" element={<Login />} />
                        
                        {/* 
                         * Rutas Protegidas: Se aplica PrivateRoute en el elemento padre (path="/*") 
                         * para asegurar que solo los usuarios autenticados y autorizados accedan al layout.
                         */}
                        <Route
                            path="/*"
                            element={
                                <PrivateRoute>
                                    <PetManagerLayout>
                                        <Routes>
                                            
                                            {/* Dashboard (Solo requiere estar autenticado) */}
                                            <Route path="/" element={<PetManagerDashboard />} />
                                            
                                            {/* Módulo Clientes */}
                                            <Route path="/clientes" element={<Clientes />} />
                                            
                                            {/* Feature 4: Gestión de Compras */}
                                            <Route 
                                                path="/crear-compra" 
                                                element={<PrivateRoute requiredPermission="purchase.create"><CreatePurchase /></PrivateRoute>} 
                                            />
                                            <Route 
                                                path="/consultar-compras" 
                                                element={<PrivateRoute requiredPermission="purchase.read"><ConsultPurchases /></PrivateRoute>} 
                                            />
                                            
                                            {/* Feature 4: Gestión de Ventas */}
                                            <Route 
                                                path="/crear-venta" 
                                                element={<PrivateRoute requiredPermission="sale.create"><CreateSale /></PrivateRoute>} 
                                            />
                                            <Route 
                                                path="/consultar-ventas" 
                                                element={<PrivateRoute requiredPermission="sale.read"><ConsultSales /></PrivateRoute>} 
                                            />
                                            
                                            {/* Gestión de Roles/Permisos */}
                                            <Route 
                                                path="/control-permisos" 
                                                // Se asume el permiso de administración de usuarios para esta ruta
                                                element={<PrivateRoute requiredPermission="user.assign_permissions"><RolePermissionsControl /></PrivateRoute>} 
                                            />
                                            
                                            {/* Ruta de Not Found para cualquier otra URL */}
                                            <Route path="*" element={<NotFound />} />
                                        </Routes>
                                    </PetManagerLayout>
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;