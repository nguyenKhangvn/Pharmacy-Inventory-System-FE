import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Package, DollarSign, AlertTriangle, TrendingDown } from "lucide-react";
import { getDashboardData } from "@/services/dashboardService";

export function KPICards() {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      const response = await getDashboardData();

      if (response.success && response.data?.kpis) {
        const { totalProducts, totalStockValue, expiringCount, lowStockCount } =
          response.data.kpis;

        setKpis([
          {
            title: "Tổng số loại thuốc",
            value: totalProducts.toLocaleString("vi-VN"),
            icon: Package,
            color: "medical-blue",
          },
          {
            title: "Tổng giá trị tồn kho",
            value: `${(totalStockValue / 1000000).toFixed(1)}M đ`,
            icon: DollarSign,
            color: "calm-green",
          },
          {
            title: "Thuốc sắp hết hạn",
            value: expiringCount.toString(),
            icon: AlertTriangle,
            color: "warning",
          },
          {
            title: "Thuốc dưới tồn tối thiểu",
            value: lowStockCount.toString(),
            icon: TrendingDown,
            color: "danger",
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching KPIs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 shadow-sm animate-pulse">
            <CardContent className="p-6">
              <div className="h-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="border-2 border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              {/* TEXT */}
              <div className="flex flex-col justify-center space-y-1 flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </p>
                <p className="text-2xl font-bold text-foreground tracking-tight">
                  {kpi.value}
                </p>
              </div>

              {/* ICON */}
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
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
                      ? "text-foreground"
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
