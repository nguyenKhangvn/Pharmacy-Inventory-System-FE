import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getAlertDetails } from "@/services/alertService";

const getStatusLabel = (alertType) => {
  switch (alertType) {
    case "OUT_OF_STOCK":
      return "Hết hàng";
    case "LOW_STOCK":
      return "Tồn kho thấp";
    case "EXPIRING_SOON":
      return "Sắp hết hạn";
    case "EXPIRED":
      return "Đã hết hạn";
    default:
      return "Tồn kho thấp";
  }
};

const getStatusType = (alertType) => {
  if (alertType === "OUT_OF_STOCK" || alertType === "EXPIRED") {
    return "out-of-stock";
  }
  return "low-stock";
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

export function AlertsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        const response = await getAlertDetails({ search: searchQuery });

        if (response.success && response.data) {
          setAlerts(response.data);
        }
      } catch (error) {
        console.error("Error loading alerts:", error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadAlerts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <Card className="border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Danh sách cảnh báo
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm thuốc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted border-0"
              />
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Các loại thuốc cần nhập thêm hoặc xem xét
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold text-foreground">
                Tên thuốc
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Tồn kho hiện tại
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Mức tồn tối thiểu
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Tỷ lệ
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Trạng thái
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Ngày cảnh báo
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : alerts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Không có cảnh báo nào
                </TableCell>
              </TableRow>
            ) : (
              alerts.map((alert) => {
                const statusType = getStatusType(alert.alertType);
                const status = getStatusLabel(alert.alertType);
                const ratio =
                  alert.currentStock && alert.minimumStock
                    ? `${Math.round(
                        (alert.currentStock / alert.minimumStock) * 100
                      )}%`
                    : "-";

                return (
                  <TableRow key={alert._id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">
                      {alert.productName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {alert.currentStock || 0} viên
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {alert.minimumStock || 0} viên
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          statusType === "out-of-stock"
                            ? "text-danger font-semibold"
                            : "text-muted-foreground"
                        }
                      >
                        {ratio}
                      </span>
                    </TableCell>
                    <TableCell>
                      {statusType === "out-of-stock" ? (
                        <Badge
                          variant="destructive"
                          className="bg-danger hover:bg-danger/90"
                        >
                          {status}
                        </Badge>
                      ) : (
                        <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">
                          {status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(alert.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
