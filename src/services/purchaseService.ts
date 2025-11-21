import axios from "axios"; //   

// Usa la URL del backend definida en .env o en Vercel
const API_URL = import.meta.env.VITE_API_URL + "/api/purchases"; 

/**
 * Función auxiliar para incluir el token JWT en los encabezados
 */
const authHeader = () => { 
    const token = localStorage.getItem("token"); 
    return token ? { Authorization: `Bearer ${token}` } : {}; 
};

/**
 * Obtener todas las compras del backend
 * Se mapean los nombres reales de la API (PurchaseDTO) al formato que usa el frontend (Purchase)
 */
export const getPurchases = async () => { 
    try {
        const response = await axios.get(API_URL, { 
            headers: { ...authHeader() }, 
        });
        
        // Adaptamos los datos al formato que la tabla espera 
        const purchases = response.data.map((p: any) => { 
            // Si hay detalles, tomamos el primero (el PurchaseDTO del backend incluye detalles) 
            const detail = Array.isArray(p.details) && p.details.length > 0 ? p.details : null; 
            
            const productName = detail?.productName ?? "Sin producto"; 
            const supplierName = p.supplierName ?? "Sin proveedor"; 
            const quantity = Number(detail?.amount ?? 0); 
            const unitPrice = Number(detail?.priceShopping ?? 0); 
            const total = Number(p.total ?? unitPrice * quantity); 
            
            // Formato de fecha esperado por el frontend (YYYY-MM-DD) 
            const date = p.date ? new Date(p.date).toISOString().split("T") : ""; 
            
            return { 
                id: p.id,
                product: productName, 
                supplier: supplierName, 
                quantity, 
                total, 
                date, 
            };
        });
        return purchases; 
    } catch (error: any) {
        console.error("Error al obtener las compras:", error); 
        // Propaga el mensaje de error descriptivo del backend (GlobalExceptionHandler) 
        throw new Error(
            error.response?.data?.message || "Error al obtener las compras" 
        );
    }
};

/**
 * Crear una nueva compra
 * @param purchaseData Objeto con los datos de la compra (debe coincidir con PurchaseDTO)
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
        // Propaga el mensaje de error descriptivo del backend 
        throw new Error(
            error.response?.data?.message || "Error al crear la compra" 
        );
    }
};

/**
 * Actualizar una compra existente
 * @param id ID de la compra a actualizar
 * @param purchaseData Datos actualizados de la compra
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
        // Propaga el mensaje de error descriptivo del backend 
        throw new Error(
            error.response?.data?.message || "Error al actualizar la compra" 
        );
    }
};

/**
 * Eliminar una compra
 * @param id ID de la compra a eliminar
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
        // Propaga el mensaje de error descriptivo del backend 
        throw new Error(
            error.response?.data?.message || "Error al eliminar la compra" 
        );
    }
};