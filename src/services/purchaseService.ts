import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/purchases";

const authHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPurchases = async () => {
    try {
        const response = await axios.get(API_URL, {
            headers: { ...authHeader() },
        });

        const purchases = response.data.map((p: any) => {

            // Asegurar array
            const detailsList = Array.isArray(p.details) ? p.details : [];

            // Tomar SOLO EL PRIMER DETALLE
            const singleDetail = detailsList.length > 0 ? detailsList[0] : null;

            const productName = singleDetail?.productName ?? "Sin producto";
            const quantity = Number(singleDetail?.amount ?? 0);
            const unitPrice = Number(singleDetail?.unitPrice ?? 0);

            const total = Number(p.total ?? quantity * unitPrice);

            return {
                id: p.id,
                product: productName,
                supplier: "Proveedor " + p.supplierId, // hasta que confirmemos API real
                quantity,
                unitPrice,
                total,
                date: p.date,
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
 * Actualizar una compra existente (updatePurchase)
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
 * Eliminar una compra (deletePurchase)
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
