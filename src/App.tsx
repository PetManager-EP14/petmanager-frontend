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

/*  Componente para proteger rutas privadas */
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Aplicar el tema guardado al montar el componente
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
            {/*  Ruta pública (sin layout) */}
            <Route path="/login" element={<Login />} />

            {/*  Rutas protegidas (con layout) */}
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <PetManagerLayout>
                    <Routes>
                      <Route path="/" element={<PetManagerDashboard />} />
                      <Route path="/clientes" element={<Clientes />} />
                      <Route path="/crear-compra" element={<CreatePurchase />} />
                      <Route path="/consultar-compras" element={<ConsultPurchases />} />
                      <Route path="/crear-venta" element={<CreateSale />} />
                      <Route path="/consultar-ventas" element={<ConsultSales />} />
                      <Route path="/control-permisos" element={<RolePermissionsControl />} />
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