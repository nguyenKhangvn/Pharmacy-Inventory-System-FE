import api from "./api";

export const inventoryIssueService = {
  async getProductSuggestions(params) {
    const response = await api.get("/inventory-issues/product-suggestions", {
      params,
    });
    return response.data;
  },

  async createInventoryIssue(request) {
    const response = await api.post("/inventory-issues", request);
    return response.data;
  },

  async getInventoryIssueById(id) {
    const response = await api.get(`/inventory-issues/${id}`);
    return response.data;
  },

  async getInventoryIssues(params) {
    const response = await api.get("/inventory-issues", { params });
    return response.data;
  },
};

export default inventoryIssueService;
