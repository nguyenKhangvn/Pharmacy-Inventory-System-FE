import api from "./api";

export const getAlertStats = async () => {
  try {
    const response = await api.get("/alerts/summary");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching alert stats:", error);
    throw error.response?.data || error;
  }
};

export const getAlertsList = async (params = {}) => {
  try {
    // Chuẩn hóa params trước khi gửi
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      ...(params.search && { search: params.search }),
      ...(params.type && { type: params.type }),
      ...(params.status && { status: params.status }),
      ...(params.severity && { severity: params.severity }),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.order && { order: params.order }),
    };

    const response = await api.get("/alerts/details", { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching alerts list:", error);
    throw error.response?.data || error;
  }
};

export const acknowledgeAlert = async (id, note = "") => {
  try {
    const payload = note ? { note } : {};
    const response = await api.patch(`/alerts/${id}/acknowledge`, payload);
    return response.data;
  } catch (error) {
    console.error(`❌ Error acknowledging alert ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const resolveAlert = async (id, note = "") => {
  try {
    const payload = note ? { note } : {};
    const response = await api.patch(`/alerts/${id}/resolve`, payload);
    return response.data;
  } catch (error) {
    console.error(`❌ Error resolving alert ${id}:`, error);
    throw error.response?.data || error;
  }
};

export const manualScan = async () => {
  try {
    const response = await api.post("/alerts/scan");
    return response.data;
  } catch (error) {
    console.error("❌ Error running manual scan:", error);
    throw error.response?.data || error;
  }
};

export const exportAlertsToExcel = async (filters = {}) => {
  try {
    // Lấy tất cả data (không phân trang)
    const response = await getAlertsList({
      ...filters,
      page: 1,
      limit: 9999, // Lấy hết
    });

    if (response.success && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("❌ Error exporting alerts:", error);
    throw error;
  }
};

export const getAlertSummary = getAlertStats;


export const getAlertDetails = getAlertsList;


const alertService = {
  // Main functions (mapping với backend)
  getAlertStats,
  getAlertsList,
  acknowledgeAlert,
  resolveAlert,
  manualScan,

  // Helper functions
  exportAlertsToExcel,

  // Backward compatibility
  getAlertSummary,
  getAlertDetails,
};

export default alertService;
