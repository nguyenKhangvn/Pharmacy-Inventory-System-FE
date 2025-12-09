import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, PackageX } from "lucide-react";
import { useState, useEffect } from "react";
import { getAlertSummary } from "@/services/alertService";

export function AlertsOverview() {
  const [summary, setSummary] = useState({
    expiringSoon: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const response = await getAlertSummary();

        if (response.success && response.data) {
          const {
            expiringSoon = 0,
            lowStock = 0,
            outOfStock = 0,
          } = response.data;
          setSummary({ expiringSoon, lowStock, outOfStock });
        }
      } catch (error) {
        console.error("Error loading alert summary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 border-border hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Sắp hết hạn sử dụng</p>
            <p className="text-4xl font-bold text-foreground">
              {loading ? "..." : summary.expiringSoon}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-warning" />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Thuốc sắp hết tồn kho
            </p>
            <p className="text-4xl font-bold text-foreground">
              {loading ? "..." : summary.lowStock}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-danger/10 flex items-center justify-center">
            <Package className="w-6 h-6 text-danger" />
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Cảnh báo hết tồn kho
            </p>
            <p className="text-4xl font-bold text-foreground">
              {loading ? "..." : summary.outOfStock}
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
            <PackageX className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
      </Card>
    </div>
  );
}
