const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Obtiene todos los clientes del backend
 */
export const getClientes = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/clientes`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener los clientes");
  }

  return await response.json();
};

/**
 * Crea un nuevo cliente
 */
export const createCliente = async (clienteData: any) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(clienteData),
  });

  if (!response.ok) {
    throw new Error("Error al crear el cliente");
  }

  return await response.json();
};
