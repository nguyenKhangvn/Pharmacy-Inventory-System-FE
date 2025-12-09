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

  async getTransactions(params = {}) {
    const { type, search, fromDate, toDate, page, limit } = params;
    const queryParams = new URLSearchParams();

    if (type) queryParams.append("type", type);
    if (search) queryParams.append("search", search);
    if (fromDate) queryParams.append("fromDate", fromDate);
    if (toDate) queryParams.append("toDate", toDate);
    if (page) queryParams.append("page", page);
    if (limit) queryParams.append("limit", limit);
    if (params.lotNumber) queryParams.append("lotNumber", params.lotNumber);

    const response = await api.get(`/transactions?${queryParams.toString()}`);
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

  async getTransactionDetails(id, type) {
    try {
      const response = await api.get(`/transactions/${id}`, {
        params: { type },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      throw error;
    }
  },
};

export default transactionService;
