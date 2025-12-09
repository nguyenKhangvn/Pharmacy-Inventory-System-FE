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
import { Search, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAlertsList } from "@/services/alertService";
import { AlertDetailDialog } from "./dialogs/AlertDetailDialog";

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
};

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
      return "Cảnh báo";
  }
};

const getStatusColor = (alertType) => {
  switch (alertType) {
    case "EXPIRING_SOON":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "LOW_STOCK":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "OUT_OF_STOCK":
    case "EXPIRED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function AlertsTable({
  alerts = [],
  loading = false,
  pagination = { page: 1, limit: 10, total: 0, pages: 0 },
  onPageChange,
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleViewDetail = (alert) => {
    setSelectedAlert(alert);
    setDetailOpen(true);
  };

  const handleAlertUpdate = () => {
    // Gọi lại API để refresh data
    onSearch?.(searchQuery);
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <div className="p-8 text-center">
          <div className="text-muted-foreground">Đang tải cảnh báo...</div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
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
                <TableHead className="font-semibold text-foreground">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="p-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <AlertTriangle className="w-12 h-12 text-muted-foreground opacity-50" />
                      <p>Không có cảnh báo nào</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                alerts.map((alert) => {
                  const ratio =
                    alert.daysUntilExpiry !== undefined
                      ? `${alert.daysUntilExpiry} ngày`
                      : alert.currentStock && alert.productId?.minimumStock
                      ? `${Math.round(
                          (alert.currentStock / alert.productId.minimumStock) *
                            100
                        )}%`
                      : "-";

                  const currentStock =
                    alert.currentStock || alert.inventoryLotId?.quantity || 0;
                  const unit = alert.productId?.unit || "viên";

                  return (
                    <TableRow key={alert._id} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground">
                        <div className="max-w-md">
                          <p className="font-medium">{alert.productName}</p>
                          {alert.lotNumber && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Lô: {alert.lotNumber}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {currentStock} {unit}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {alert.productId?.minimumStock || 0} {unit}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            alert.daysUntilExpiry <= 7
                              ? "text-red-600 font-semibold"
                              : "text-muted-foreground"
                          }
                        >
                          {ratio}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(alert.alertType)}`}
                        >
                          {getStatusLabel(alert.alertType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(alert.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleViewDetail(alert)}
                        >
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        {alerts.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hiển thị:</span>
              <select
                value={pagination.limit}
                onChange={(e) => onPageChange?.(1, Number(e.target.value))}
                className="px-3 py-1 border border-input rounded-md bg-background"
                disabled={loading}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-muted-foreground">
                Tổng: {pagination.total} cảnh báo
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
              >
                Trước
              </Button>
              <span className="text-sm">
                Trang {pagination.page} / {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={pagination.page === pagination.pages || loading}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>

      <AlertDetailDialog
        alert={selectedAlert}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onUpdate={handleAlertUpdate}
      />
    </>
  );
}
