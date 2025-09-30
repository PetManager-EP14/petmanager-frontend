import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-card">
      <div className="text-center pet-card p-8 rounded-lg">
        <h1 className="mb-4 text-4xl font-poppins font-bold text-destructive">404</h1>
        <p className="mb-4 text-xl font-roboto text-muted-foreground">Oops! Página no encontrada</p>
        <a href="/" className="text-accent hover:text-accent/80 font-roboto font-medium underline">
          Volver al Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
