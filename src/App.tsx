import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Apply saved theme on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Login route - no layout */}
            <Route path="/login" element={<Login />} />
            
            {/* Main app routes - with layout */}
            <Route path="/*" element={
              <PetManagerLayout>
                <Routes>
                  <Route path="/" element={<PetManagerDashboard />} />
                  <Route path="/crear-compra" element={<CreatePurchase />} />
                  <Route path="/consultar-compras" element={<ConsultPurchases />} />
                  <Route path="/crear-venta" element={<CreateSale />} />
                  <Route path="/consultar-ventas" element={<ConsultSales />} />
                  <Route path="/control-permisos" element={<RolePermissionsControl />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PetManagerLayout>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
