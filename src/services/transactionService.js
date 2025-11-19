import api from "./api";

export const transactionService = {
  async createInbound(data) {
    const response = await api.post("/transactions", {
      ...data,
      type: "INBOUND",
    });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  async getList(params = {}) {
    const response = await api.get("/transactions", { params });
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },


  async delete(id) {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  async cancel(id, reason) {
    const response = await api.post(`/transactions/${id}/cancel`, { reason });
    return response.data;
  },
};

export default transactionService;
