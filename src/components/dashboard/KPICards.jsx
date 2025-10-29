import { Card, CardContent } from "@/components/ui/card";
import { Package, DollarSign, AlertTriangle, TrendingDown } from "lucide-react";

const kpis = [
  {
    title: "Tổng số loại thuốc",
    value: "2,847",
    change: "+12%",
    changeType: "positive",
    icon: Package,
    color: "medical-blue",
  },
  {
    title: "Tổng giá trị tồn kho",
    value: "₫2.4B",
    change: "+8.2%",
    changeType: "positive",
    icon: DollarSign,
    color: "calm-green",
  },
  {
    title: "Thuốc sắp hết hạn",
    value: "23",
    change: "-5",
    changeType: "negative",
    icon: AlertTriangle,
    color: "warning",
  },
  {
    title: "Thuốc dưới tồn tối thiểu",
    value: "47",
    change: "+3",
    changeType: "negative",
    icon: TrendingDown,
    color: "danger",
  },
];

export function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {kpi.value}
                </p>
                <p
                  className={`text-xs font-medium ${
                    kpi.changeType === "positive"
                      ? "text-calm-green"
                      : "text-danger"
                  }`}
                >
                  {kpi.change} so với tháng trước
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  kpi.color === "medical-blue"
                    ? "bg-medical-blue-light"
                    : kpi.color === "calm-green"
                    ? "bg-calm-green-light"
                    : kpi.color === "warning"
                    ? "bg-warning-light"
                    : "bg-danger-light"
                }`}
              >
                <kpi.icon
                  className={`w-6 h-6 ${
                    kpi.color === "medical-blue"
                      ? "text-medical-blue"
                      : kpi.color === "calm-green"
                      ? "text-calm-green"
                      : kpi.color === "warning"
                      ? "text-warning"
                      : "text-danger"
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
