import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Package } from "lucide-react";

const alerts = [
  {
    id: 1,
    type: "expiry",
    title: "Paracetamol 500mg",
    description: "Hết hạn trong 7 ngày",
    priority: "high",
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: "stock",
    title: "Amoxicillin 250mg",
    description: "Còn 15 viên (dưới tồn tối thiểu)",
    priority: "medium",
    icon: Package,
  },
  {
    id: 3,
    type: "expiry",
    title: "Vitamin C 1000mg",
    description: "Hết hạn trong 14 ngày",
    priority: "medium",
    icon: Clock,
  },
  {
    id: 4,
    type: "stock",
    title: "Aspirin 100mg",
    description: "Còn 8 viên (dưới tồn tối thiểu)",
    priority: "high",
    icon: Package,
  },
];

export function AlertsSection() {
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
        {alerts.map((alert) => (
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
        ))}
      </CardContent>
    </Card>
  );
}
