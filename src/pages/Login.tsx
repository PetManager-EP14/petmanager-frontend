import { login } from "@/services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // 🔐 Conexión real al backend
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await login(credentials.username, credentials.password);

      // Guarda el token JWT en localStorage
      localStorage.setItem("token", data.token);

      toast({
        title: "¡Bienvenido!",
        description: `Inicio de sesión exitoso: ${data.username || credentials.username}`,
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Credenciales inválidas o error de conexión con el servidor.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pet-background p-4">
      {/* Fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-pet-primary to-pet-accent"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-pet-primary to-pet-accent rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">🐾</span>
          </div>
          <h1 className="text-pet-h1 font-poppins font-bold text-pet-text-primary mb-2">
            PetManager
          </h1>
          <p className="text-pet-text-secondary font-roboto">
            Bienvenido a PetManager
          </p>
        </div>

        {/* Tarjeta de Login */}
        <Card className="pet-card-hover border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-pet-h3 font-poppins text-center text-pet-text-primary">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-center text-pet-text-secondary font-roboto">
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Usuario */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-pet-text-primary font-roboto font-medium"
                >
                  Usuario
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pet-text-secondary h-4 w-4" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={credentials.username}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        username: e.target.value,
                      })
                    }
                    className="pl-10 font-roboto border-border focus:border-pet-primary focus:ring-pet-primary"
                    required
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-pet-text-primary font-roboto font-medium"
                >
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pet-text-secondary h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    className="pl-10 pr-10 font-roboto border-border focus:border-pet-primary focus:ring-pet-primary"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-pet-text-secondary" />
                    ) : (
                      <Eye className="h-4 w-4 text-pet-text-secondary" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Botón */}
              <Button
                type="submit"
                className="w-full mt-6 bg-pet-primary hover:bg-pet-primary/90 text-white font-roboto font-medium text-pet-btn h-12 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                disabled={
                  isLoading || !credentials.username || !credentials.password
                }
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-pet-text-secondary font-roboto text-sm">
          © 2025 PetManager. Sistema de gestión para tiendas de mascotas.
        </div>
      </div>
    </div>
  );
}