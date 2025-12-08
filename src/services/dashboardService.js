import api from "./api";

/**
 * Dashboard Service - Quản lý API dashboard
 * Backend endpoint: GET /api/dashboard
 */

/**
 * GET /api/dashboard
 * Lấy toàn bộ dữ liệu dashboard (KPIs, Chart, Alerts)
 *
 * @returns {Promise} Response với {
 *   success: boolean,
 *   message: string,
 *   data: {
 *     kpis: { totalProducts, totalStockValue, expiringCount, lowStockCount },
 *     chart: Array<{ date, day, inbound, outbound }>,
 *     alerts: Array<Alert>
 *   }
 * }
 */
export const getDashboardData = async () => {
  try {
    const response = await api.get("/dashboard");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    throw error.response?.data || error;
  }
};

const dashboardService = {
  getDashboardData,
};

export default dashboardService;
