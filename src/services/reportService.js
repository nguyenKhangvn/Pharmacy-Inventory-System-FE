import api from "./api";

export const reportService = {
  // Báo cáo xuất-nhập-tồn
  async getStockSummary(params = {}) {
    const { startDate, endDate } = params;
    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    
    const response = await api.get(`/reports/stock_summary?${queryParams.toString()}`);
    return response.data;
  },

  // Biểu đồ nhập/xuất theo tháng
  async getTrends(params = {}) {
    const { startDate, endDate } = params;
    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    
    const response = await api.get(`/reports/trends?${queryParams.toString()}`);
    return response.data;
  },

  // Biểu đồ phân bổ trạng thái
  async getStatusDistribution(params = {}) {
    const { startDate, endDate } = params;
    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    
    const response = await api.get(`/reports/status_distribution?${queryParams.toString()}`);
    return response.data;
  },

  // Xuất báo cáo PDF
  async exportReport(params = {}) {
    const { type = 'pdf', reportType, startDate, endDate } = params;
    const queryParams = new URLSearchParams();
    
    queryParams.append("type", type);
    if (reportType) queryParams.append("reportType", reportType);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    
    const response = await api.get(`/reports/export?${queryParams.toString()}`, {
      responseType: 'blob', // Important for file download
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `report_${reportType}_${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response.data;
  },
};

export default reportService;
