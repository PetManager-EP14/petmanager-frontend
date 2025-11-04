import axios from "axios";

// Usa la URL del backend definida en .env o en Vercel
const API_URL = import.meta.env.VITE_API_URL + "/api/purchases";

// Función auxiliar para incluir el token JWT en los encabezados
const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Obtener todas las compras del backend
 *    Se mapean los nombres reales de la API al formato que usa el frontend
 */
export const getPurchases = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: { ...authHeader() },
    });

    // Adaptamos los datos al formato que la tabla espera
    const purchases = response.data.map((p: any) => {
      // Si hay detalles, tomamos el primero (normalmente hay uno por compra)
      const detail = Array.isArray(p.details) && p.details.length > 0 ? p.details[0] : null;

      const productName = detail?.productName ?? "Sin producto";
      const supplierName = p.supplierName ?? "Sin proveedor";
      const quantity = Number(detail?.amount ?? 0);
      const unitPrice = Number(detail?.priceShopping ?? 0);
      const total = Number(p.total ?? unitPrice * quantity);
      const date = p.date ? new Date(p.date).toISOString().split("T")[0] : "";

      return {
        id: p.id,
        product: productName,
        supplier: supplierName,
        quantity,
        unitPrice,
        total,
        date,
      };
    });

    return purchases;
  } catch (error: any) {
    console.error("Error al obtener las compras:", error);
    throw new Error(
      error.response?.data?.message || "Error al obtener las compras"
    );
  }
};

/**
 * Crear una nueva compra
 */
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
    throw new Error(
      error.response?.data?.message || "Error al crear la compra"
    );
  }
};

/**
 * Actualizar una compra existente
 */
export const updatePurchase = async (id: string | number, purchaseData: any) => {
  try {
    const response = await axios.put(`${API_URL}/${Number(id)}`, purchaseData, {
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al actualizar la compra:", error);
    throw new Error(
      error.response?.data?.message || "Error al actualizar la compra"
    );
  }
};

/**
 * Eliminar una compra
 */
export const deletePurchase = async (id: string | number) => {
  try {
    const response = await axios.delete(`${API_URL}/${Number(id)}`, {
      headers: {
        ...authHeader(),
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al eliminar la compra:", error);
    throw new Error(
      error.response?.data?.message || "Error al eliminar la compra"
    );
  }
};