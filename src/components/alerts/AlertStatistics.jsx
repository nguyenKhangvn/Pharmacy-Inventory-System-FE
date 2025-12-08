import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import alertService from "@/services/alertService";
import {
  AlertTriangle,
  TrendingUp,
  Package,
  Calendar,
  Activity,
} from "lucide-react";

export function AlertStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await alertService.getStatistics();
        if (response.success) {
          setStatistics(response.data);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading || !statistics) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Thống kê chi tiết</h3>
      </div>

      <div className="space-y-6">
        {/* Severity Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Phân loại theo mức độ
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {statistics.critical}
              </p>
              <p className="text-xs text-red-600 mt-1">Nghiêm trọng</p>
            </div>
            <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {statistics.high}
              </p>
              <p className="text-xs text-orange-600 mt-1">Cao</p>
            </div>
            <div className="flex flex-col items-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {statistics.medium}
              </p>
              <p className="text-xs text-yellow-600 mt-1">Trung bình</p>
            </div>
            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {statistics.low}
              </p>
              <p className="text-xs text-blue-600 mt-1">Thấp</p>
            </div>
          </div>
        </div>

        {/* Alert Type Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Phân loại theo loại cảnh báo
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-danger" />
                <span className="text-sm">Tồn kho thấp</span>
              </div>
              <Badge variant="outline">{statistics.lowStock}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm">Hết hàng</span>
              </div>
              <Badge variant="outline">{statistics.outOfStock}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-warning" />
                <span className="text-sm">Sắp hết hạn</span>
              </div>
              <Badge variant="outline">{statistics.expiringSoon}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-600" />
                <span className="text-sm">Đã hết hạn</span>
              </div>
              <Badge variant="outline">{statistics.expired}</Badge>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Tổng cảnh báo</span>
            <Badge className="text-lg px-3 py-1">{statistics.total}</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
