const API_URL = import.meta.env.VITE_API_URL;

export async function getSales(token: string) {
  const response = await fetch(`${API_URL}/api/sales`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener ventas: ${response.status}`);
  }

  return response.json();
}

export async function createSale(token: string, saleData: any) {
  const response = await fetch(`${API_URL}/api/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(saleData),
  });

  if (!response.ok) {
    throw new Error(`Error al registrar la venta: ${response.status}`);
  }

  return response.json();
}