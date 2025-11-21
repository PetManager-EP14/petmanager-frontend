import { apiClient } from "./apiClient";

export const createSale = (saleData) =>
  apiClient.post("/sales", saleData);

export const getSales = () =>
  apiClient.get("/sales");

export const getSaleById = (id: number) =>
  apiClient.get(`/sales/${id}`);