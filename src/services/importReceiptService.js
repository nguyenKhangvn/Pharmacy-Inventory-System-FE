import api from "./api";

export const importReceiptService = {

  async getImportReceipts(params = {}) {
    const response = await api.get("/import-receipts", { params });
    return response.data;
  },


  async getImportReceiptById(id) {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },


  async getImportReceiptByCode(code) {
    const response = await api.get(`/import-receipts/code/${code}`);
    return response.data;
  },

  async createImportReceipt(data) {
    const response = await api.post("/transactions", {
      ...data,
      type: "INBOUND",
    });
    return response.data;
  },


  async updateImportReceipt(id, data) {
    const response = await api.put(`/import-receipts/${id}`, data);
    return response.data;
  },

  /**
   * Complete import receipt (update inventory)
   * @param {string} id - Import receipt ID
   * @param {Object} data - Completion data
   * @returns {Promise<Object>} Completed import receipt
   */
  async completeImportReceipt(id, data = {}) {
    const response = await api.post(`/import-receipts/${id}/complete`, data);
    return response.data;
  },

  /**
   * Cancel import receipt
   * @param {string} id - Import receipt ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancelled import receipt
   */
  async cancelImportReceipt(id, reason) {
    const response = await api.post(`/import-receipts/${id}/cancel`, {
      reason,
    });
    return response.data;
  },

  /**
   * Delete import receipt (only if not completed)
   * @param {string} id - Import receipt ID
   * @returns {Promise<Object>} Delete confirmation
   */
  async deleteImportReceipt(id) {
    const response = await api.delete(`/import-receipts/${id}`);
    return response.data;
  },

  /**
   * Get import receipt statistics
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date
   * @param {string} params.endDate - End date
   * @param {string} params.supplierId - Supplier ID
   * @returns {Promise<Object>} Import statistics
   */
  async getImportStats(params = {}) {
    const response = await api.get("/import-receipts/stats", { params });
    return response.data;
  },

  /**
   * Get import receipts by supplier
   * @param {string} supplierId - Supplier ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Import receipts from supplier
   */
  async getImportReceiptsBySupplier(supplierId, params = {}) {
    const response = await api.get(`/import-receipts/supplier/${supplierId}`, {
      params,
    });
    return response.data;
  },

  /**
   * Get import receipts by product
   * @param {string} productId - Product ID
   * @param {Object} params - Additional parameters
   * @returns {Promise<Object>} Import receipts containing product
   */
  async getImportReceiptsByProduct(productId, params = {}) {
    const response = await api.get(`/import-receipts/product/${productId}`, {
      params,
    });
    return response.data;
  },

  /**
   * Get import receipt items/details
   * @param {string} id - Import receipt ID
   * @returns {Promise<Object>} Import receipt items
   */
  async getImportReceiptItems(id) {
    const response = await api.get(`/import-receipts/${id}/items`);
    return response.data;
  },

  /**
   * Export import receipt as PDF
   * @param {string} id - Import receipt ID
   * @returns {Promise<Blob>} PDF blob
   */
  async exportImportReceiptPDF(id) {
    const response = await api.get(`/import-receipts/${id}/export/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Export import receipts report
   * @param {Object} params - Export parameters
   * @param {string} params.format - Format (excel, pdf, csv)
   * @param {string} params.startDate - Start date
   * @param {string} params.endDate - End date
   * @returns {Promise<Blob>} File blob
   */
  async exportImportReport(params = {}) {
    const response = await api.get("/import-receipts/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Validate import receipt data
   * @param {Object} data - Import receipt data to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateImportReceipt(data) {
    const response = await api.post("/import-receipts/validate", data);
    return response.data;
  },

  /**
   * Get pending import receipts (not completed)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Pending import receipts
   */
  async getPendingImportReceipts(params = {}) {
    const response = await api.get("/import-receipts/pending", { params });
    return response.data;
  },

  /**
   * Approve import receipt (for workflow)
   * @param {string} id - Import receipt ID
   * @param {Object} data - Approval data
   * @returns {Promise<Object>} Approved import receipt
   */
  async approveImportReceipt(id, data = {}) {
    const response = await api.post(`/import-receipts/${id}/approve`, data);
    return response.data;
  },

  /**
   * Reject import receipt (for workflow)
   * @param {string} id - Import receipt ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<Object>} Rejected import receipt
   */
  async rejectImportReceipt(id, reason) {
    const response = await api.post(`/import-receipts/${id}/reject`, {
      reason,
    });
    return response.data;
  },
};
