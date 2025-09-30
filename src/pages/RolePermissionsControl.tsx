import { useState } from "react";
import { Search, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface UserPermission {
  id: string;
  usuario: string;
  rol: string;
  permisos: string[];
  ultimaSesion: string;
}

const rolesDisponibles = ["Gerente", "Responsable", "Vendedor"];
const permisosDisponibles = ["Ventas", "Compras", "Reportes", "Inventario"];

// Datos de ejemplo
const usuariosEjemplo: UserPermission[] = [
  {
    id: "1",
    usuario: "juan.perez@petstore.com",
    rol: "Gerente",
    permisos: ["Ventas", "Compras", "Reportes", "Inventario"],
    ultimaSesion: "2025-01-15 14:30",
  },
  {
    id: "2",
    usuario: "maria.garcia@petstore.com",
    rol: "Responsable",
    permisos: ["Ventas", "Inventario"],
    ultimaSesion: "2025-01-15 10:15",
  },
  {
    id: "3",
    usuario: "carlos.ruiz@petstore.com",
    rol: "Vendedor",
    permisos: ["Ventas"],
    ultimaSesion: "2025-01-14 18:45",
  },
];

export default function RolePermissionsControl() {
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState<UserPermission[]>(usuariosEjemplo);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UserPermission | null>(null);
  const [rolTemp, setRolTemp] = useState("");
  const [permisosTemp, setPermisosTemp] = useState<string[]>([]);
  const { toast } = useToast();

  const usuariosFiltrados = usuarios.filter((u) =>
    u.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSeleccionarUsuario = (usuario: UserPermission) => {
    setUsuarioSeleccionado(usuario);
    setRolTemp(usuario.rol);
    setPermisosTemp([...usuario.permisos]);
  };

  const handleTogglePermiso = (permiso: string) => {
    setPermisosTemp((prev) =>
      prev.includes(permiso)
        ? prev.filter((p) => p !== permiso)
        : [...prev, permiso]
    );
  };

  const handleGuardarCambios = () => {
    if (!usuarioSeleccionado) return;

    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === usuarioSeleccionado.id
          ? { ...u, rol: rolTemp, permisos: permisosTemp }
          : u
      )
    );

    toast({
      title: "Cambios guardados",
      description: `Los permisos de ${usuarioSeleccionado.usuario} han sido actualizados.`,
    });

    setUsuarioSeleccionado(null);
  };

  const handleCancelar = () => {
    setUsuarioSeleccionado(null);
    setRolTemp("");
    setPermisosTemp([]);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-poppins font-bold text-foreground">
          Control de Permisos de Rol
        </h1>
        <p className="text-muted-foreground mt-2 font-roboto">
          Gestiona los roles y permisos de los usuarios del sistema
        </p>
      </div>

      {/* Buscador */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins">Buscar Usuario</CardTitle>
          <CardDescription className="font-roboto">
            Ingresa el correo o nombre del usuario para gestionar sus permisos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar usuario por correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins">Usuarios del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-poppins font-semibold text-foreground">
                    Usuario
                  </th>
                  <th className="text-left py-3 px-4 font-poppins font-semibold text-foreground">
                    Rol
                  </th>
                  <th className="text-left py-3 px-4 font-poppins font-semibold text-foreground">
                    Permisos de Transacciones
                  </th>
                  <th className="text-left py-3 px-4 font-poppins font-semibold text-foreground">
                    Última Sesión
                  </th>
                  <th className="text-left py-3 px-4 font-poppins font-semibold text-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr
                    key={usuario.id}
                    className="border-b border-border hover:bg-accent/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-roboto text-foreground">
                      {usuario.usuario}
                    </td>
                    <td className="py-3 px-4 font-roboto text-foreground">
                      {usuario.rol}
                    </td>
                    <td className="py-3 px-4 font-roboto text-foreground">
                      {usuario.permisos.join(", ")}
                    </td>
                    <td className="py-3 px-4 font-roboto text-muted-foreground">
                      {usuario.ultimaSesion}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSeleccionarUsuario(usuario)}
                      >
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Panel de edición */}
      {usuarioSeleccionado && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="font-poppins flex items-center justify-between">
              Editar Permisos - {usuarioSeleccionado.usuario}
              <Button variant="ghost" size="sm" onClick={handleCancelar}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Selector de Rol */}
            <div className="space-y-2">
              <Label htmlFor="rol" className="font-poppins">
                Rol del Usuario
              </Label>
              <Select value={rolTemp} onValueChange={setRolTemp}>
                <SelectTrigger id="rol">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {rolesDisponibles.map((rol) => (
                    <SelectItem key={rol} value={rol}>
                      {rol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Permisos de Transacciones */}
            <div className="space-y-3">
              <Label className="font-poppins">Permisos de Transacciones</Label>
              <div className="space-y-2">
                {permisosDisponibles.map((permiso) => (
                  <div key={permiso} className="flex items-center space-x-2">
                    <Checkbox
                      id={permiso}
                      checked={permisosTemp.includes(permiso)}
                      onCheckedChange={() => handleTogglePermiso(permiso)}
                    />
                    <Label
                      htmlFor={permiso}
                      className="font-roboto cursor-pointer"
                    >
                      {permiso}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleGuardarCambios} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar Cambios
              </Button>
              <Button variant="outline" onClick={handleCancelar}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
