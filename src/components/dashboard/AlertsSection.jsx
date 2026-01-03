import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Package, PackageX } from "lucide-react";
import { useState, useEffect } from "react";
import { getDashboardData } from "@/services/dashboardService";

const getAlertIcon = (alertType) => {
  switch (alertType) {
    case "EXPIRING_SOON":
    case "EXPIRED":
      return Clock;
    case "OUT_OF_STOCK":
      return PackageX;
    case "LOW_STOCK":
      return Package;
    default:
      return AlertTriangle;
  }
};

const getAlertPriority = (severity) => {
  switch (severity) {
    case "CRITICAL":
    case "HIGH":
      return "high";
    case "MEDIUM":
      return "medium";
    default:
      return "low";
  }
};

export function AlertsSection() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        const response = await getDashboardData();

        console.log("Raw API response:", response);

        // Xử lý cả 2 trường hợp: data.alerts hoặc data trực tiếp là array
        const alertsData = response.data?.alerts || response.data || [];

        console.log("Alerts data:", alertsData);
        console.log(
          "First alert full object:",
          JSON.stringify(alertsData[0], null, 2)
        );

        if (response.success && alertsData.length > 0) {
          // Lọc bỏ thuốc đã hết hạn, chỉ giữ lại thuốc sắp hết hạn
          const filteredAlerts = alertsData.filter(
            (alert) => alert.alertType !== "EXPIRED" && alert.type !== "EXPIRED"
          );

          // Tính toán daysUntilExpiry nếu chưa có
          const alertsWithDays = filteredAlerts.map((alert) => {
            let daysUntilExpiry = alert.daysUntilExpiry;

            // Parse từ message nếu không có daysUntilExpiry
            if (daysUntilExpiry === undefined && alert.message) {
              const match = alert.message.match(/(\d+)\s*ngày/);
              if (match) {
                daysUntilExpiry = parseInt(match[1], 10);
              }
            }

            // Nếu không có daysUntilExpiry, tính từ expiryDate
            if (daysUntilExpiry === undefined && alert.expiryDate) {
              const expiryDate = new Date(alert.expiryDate);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              expiryDate.setHours(0, 0, 0, 0);
              daysUntilExpiry = Math.ceil(
                (expiryDate - today) / (1000 * 60 * 60 * 24)
              );
            }

            return { ...alert, daysUntilExpiry };
          });
          console.log(
            "Alerts with daysUntilExpiry calculated:",
            alertsWithDays.map((a) => ({
              name: a.productName || a.product?.name,
              days: a.daysUntilExpiry,
              expiryDate: a.expiryDate,
            }))
          );
          // Sắp xếp theo số ngày sắp hết hạn (gần nhất lên trước)
          const sortedAlerts = [...alertsWithDays].sort((a, b) => {
            const daysA = a.daysUntilExpiry ?? 999;
            const daysB = b.daysUntilExpiry ?? 999;
            return daysA - daysB;
          });

          console.log(
            "Sorted alerts by days:",
            sortedAlerts.map((a) => ({
              name: a.productName || a.product?.name,
              days: a.daysUntilExpiry,
              expiryDate: a.expiryDate,
            }))
          );

          // Lấy tối đa 5 cảnh báo đầu tiên sau khi đã sắp xếp
          const limitedAlerts = sortedAlerts.slice(0, 5).map((alert) => ({
            id: alert._id || alert.id,
            type: alert.alertType || alert.type,
            title: alert.productName || alert.product?.name || "N/A",
            description: alert.message,
            priority: getAlertPriority(alert.severity),
            icon: getAlertIcon(alert.alertType || alert.type),
            severity: alert.severity,
            warehouse: alert.warehouseId?.name || alert.warehouse?.name,
            daysUntilExpiry: alert.daysUntilExpiry,
          }));
          setAlerts(limitedAlerts);
        }
      } catch (error) {
        console.error("Error loading alerts:", error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  return (
    <Card className="border-2 border-border shadow-sm">
  <CardHeader className="pb-4">
    <CardTitle className="text-lg font-semibold text-foreground">
      Cảnh báo
    </CardTitle>
    <p className="text-sm text-muted-foreground">
      Các thuốc cần chú ý ngay
    </p>
  </CardHeader>

  <CardContent className="space-y-4">
    {loading ? (
      <div className="text-center py-8 text-muted-foreground">
        Đang tải...
      </div>
    ) : alerts.length === 0 ? (
      <div className="text-center py-8 text-muted-foreground">
        Không có cảnh báo nào
      </div>
    ) : (
      alerts.map((alert) => (
        <div
          key={alert.id}
          className={`
            flex items-start space-x-3 p-4 rounded-xl bg-white
            border-2 border-l-8 shadow-sm
            ${
              alert.priority === "high"
                ? "border-danger"
                : "border-warning"
            }
          `}
        >
          {/* ICON */}
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              alert.priority === "high"
                ? "bg-danger-light"
                : "bg-warning-light"
            }`}
          >
            <alert.icon
              className={`w-4 h-4 ${
                alert.priority === "high"
                  ? "text-danger"
                  : "text-warning"
              }`}
            />
          </div>

          {/* CONTENT */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-foreground truncate">
                {alert.title}
              </p>
              <Badge
                variant={
                  alert.priority === "high"
                    ? "destructive"
                    : "secondary"
                }
                className="text-xs whitespace-nowrap min-w-[70px] justify-center"
              >
                {alert.priority === "high" ? "Cao" : "Trung bình"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {alert.description}
            </p>
          </div>
        </div>
      ))
    )}
  </CardContent>
</Card>

  );
}
