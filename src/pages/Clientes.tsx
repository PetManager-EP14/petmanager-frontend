import { useEffect, useState } from "react";
import { getClientes } from "@/services/clienteService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Cliente {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getClientes();
        setClientes(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los clientes.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  if (loading) return <p className="text-center mt-8">Cargando clientes...</p>;

  return (
    <div className="p-8">
      <Card className="pet-card-hover border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-poppins text-pet-text-primary">
            Lista de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clientes.length > 0 ? (
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">ID</th>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Correo</th>
                  <th className="p-3">Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{cliente.id}</td>
                    <td className="p-3">{cliente.nombre}</td>
                    <td className="p-3">{cliente.correo}</td>
                    <td className="p-3">{cliente.telefono}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No hay clientes registrados.</p>
          )}
          <div className="mt-4 text-right">
            <Button className="bg-pet-primary hover:bg-pet-primary/90 text-white">
              Nuevo Cliente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}