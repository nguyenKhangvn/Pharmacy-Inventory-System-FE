import api from "./api";

export const supplierService = {
  async getSuppliers(params = {}) {
    const response = await api.get("/suppliers", { params });
    return response.data;
  },

  async getSupplierById(id) {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  async createSupplier(supplierData) {
    const response = await api.post("/suppliers", supplierData);
    return response.data;
  },

  async updateSupplier(id, supplierData) {
    const response = await api.put(`/suppliers/${id}`, supplierData);
    return response.data;
  },
};
