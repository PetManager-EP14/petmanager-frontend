import axios from "axios";

// Usa la URL del backend definida en tu entorno (.env o Vercel)
const API_URL = import.meta.env.VITE_API_URL + "/api/purchases";

// Configura axios para incluir el token JWT automáticamente
const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Obtener todas las compras
export const getPurchases = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener las compras:", error);
    throw new Error(error.response?.data?.message || "Error al obtener las compras");
  }
};

// Crear una nueva compra
export const createPurchase = async (purchaseData: any) => {
  try {
    const response = await axios.post(API_URL, purchaseData, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al crear la compra:", error);
    throw new Error(error.response?.data?.message || "Error al crear la compra");
  }
};

// Actualizar una compra existente
export const updatePurchase = async (id: string, purchaseData: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, purchaseData, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al actualizar la compra:", error);
    throw new Error(error.response?.data?.message || "Error al actualizar la compra");
  }
};

// Eliminar una compra
export const deletePurchase = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al eliminar la compra:", error);
    throw new Error(error.response?.data?.message || "Error al eliminar la compra");
  }
};