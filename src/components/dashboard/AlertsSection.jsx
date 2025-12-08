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

        if (response.success && response.data?.alerts) {
          // Lấy tối đa 5 cảnh báo đầu tiên
          const limitedAlerts = response.data.alerts
            .slice(0, 5)
            .map((alert) => ({
              id: alert.id,
              type: alert.type,
              title: alert.product?.name || "N/A",
              description: alert.message,
              priority: getAlertPriority(alert.severity),
              icon: getAlertIcon(alert.type),
              severity: alert.severity,
              warehouse: alert.warehouse?.name,
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
    <Card className="border-0 shadow-sm">
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
              className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  alert.priority === "high"
                    ? "bg-danger-light"
                    : "bg-warning-light"
                }`}
              >
                <alert.icon
                  className={`w-4 h-4 ${
                    alert.priority === "high" ? "text-danger" : "text-warning"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {alert.title}
                  </p>
                  <Badge
                    variant={
                      alert.priority === "high" ? "destructive" : "secondary"
                    }
                    className="text-xs"
                  >
                    {alert.priority === "high" ? "Cao" : "Trung bình"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
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
