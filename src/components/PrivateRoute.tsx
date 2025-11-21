import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

// Definición de la interfaz del componente
interface PrivateRouteProps {
    children: JSX.Element;
    // Permiso requerido 
    requiredPermission?: string; 
}

// Interfaz para la carga útil (Payload) del JWT, que Spring Security genera
interface JwtPayload {
    sub: string;
    roles: string[];
    // Las autoridades son los permisos que se usan en @PreAuthorize
    authorities: string[]; 
    exp: number; // Expiración
}

export default function PrivateRoute({ children, requiredPermission }: PrivateRouteProps) {
    const token = localStorage.getItem("token");

    if (!token) {
        // 1. No hay token: Redirige al login
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
            // Token expirado
            localStorage.removeItem("token");
            return <Navigate to="/login" replace />;
        }
        
        const userPermissions = decodedToken.authorities || [];

        // 2. Se requiere un permiso, pero el usuario no lo tiene (Acceso Denegado)
        if (requiredPermission && !userPermissions.includes(requiredPermission)) {
            // Se asume que redirigir al dashboard es el comportamiento deseado para "Acceso Denegado"
            return <Navigate to="/" replace />; 
        }

    } catch (error) {
        // 3. Error en la decodificación (token corrupto)
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }

    // 4. Token válido y permisos suficientes
    return children;
}