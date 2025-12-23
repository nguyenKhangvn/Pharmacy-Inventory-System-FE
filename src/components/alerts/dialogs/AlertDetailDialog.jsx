import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Package,
  Calendar,
  MapPin,
  Check,
  CheckCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import alertService from "@/services/alertService";

const ALERT_TYPE_LABELS = {
  LOW_STOCK: "Tồn kho thấp",
  OUT_OF_STOCK: "Hết hàng",
  EXPIRING_SOON: "Sắp hết hạn",
  EXPIRED: "Đã hết hạn",
};

const SEVERITY_COLORS = {
  CRITICAL: "bg-red-500 text-white hover:bg-red-600",
  HIGH: "bg-orange-500 text-white hover:bg-orange-600",
  MEDIUM: "bg-yellow-500 text-white hover:bg-yellow-600",
  LOW: "bg-blue-500 text-white hover:bg-blue-600",
};

const STATUS_LABELS = {
  ACTIVE: "Đang hoạt động",
  ACKNOWLEDGED: "Đã xác nhận",
  RESOLVED: "Đã giải quyết",
};

const getExpiryInfo = (expiryDate, alertType) => {
  if (!expiryDate) return { daysUntilExpiry: null, isExpired: false, statusLabel: null };
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  const isExpired = daysUntilExpiry < 0;
  
  let statusLabel = null;
  if (isExpired) {
    statusLabel = "Đã hết hạn";
  } else if (alertType === 'EXPIRING_SOON') {
    statusLabel = "Sắp hết hạn";
  }
  
  return { daysUntilExpiry, isExpired, statusLabel };
};

export function AlertDetailDialog({ alert, open, onClose, onUpdate }) {
  const [note, setNote] = useState("");
  const [resolution, setResolution] = useState("");
  const [loading, setLoading] = useState(false);

  if (!alert) return null;

  // Calculate expiry info dynamically
  const expiryInfo = getExpiryInfo(alert.expiryDate, alert.alertType);
  const displayStatus = expiryInfo.statusLabel || ALERT_TYPE_LABELS[alert.alertType] || alert.alertType;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
    } catch {
      return dateString;
    }
  };

  const handleAcknowledge = async () => {
    try {
      setLoading(true);
      await alertService.acknowledgeAlert(alert._id, note || "Đã xác nhận");
      onUpdate && onUpdate();
      setNote("");
      onClose();
    } catch (error) {
      console.error("Error acknowledging alert:", error);
      alert("Không thể xác nhận cảnh báo");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolution.trim()) {
      alert("Vui lòng nhập mô tả giải pháp");
      return;
    }
    try {
      setLoading(true);
      await alertService.resolveAlert(alert._id, resolution);
      onUpdate && onUpdate();
      setResolution("");
      onClose();
    } catch (error) {
      console.error("Error resolving alert:", error);
      alert("Không thể giải quyết cảnh báo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Chi tiết cảnh báo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alert Type and Severity */}
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`text-base px-3 py-1 ${
                expiryInfo.isExpired 
                  ? 'bg-red-100 text-red-800 border-red-200'
                  : expiryInfo.statusLabel === 'Sắp hết hạn'
                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                  : ''
              }`}
            >
              {displayStatus}
            </Badge>
            <Badge
              className={`text-base px-3 py-1 ${
                SEVERITY_COLORS[alert.severity]
              }`}
            >
              {alert.severity}
            </Badge>
            <Badge
              variant={alert.status === "ACTIVE" ? "default" : "secondary"}
              className="text-base px-3 py-1"
            >
              {STATUS_LABELS[alert.status] || alert.status}
            </Badge>
          </div>

          {/* Alert Message */}
          <Card className="p-4 bg-muted/50">
            <p className="text-sm font-medium">{alert.message}</p>
          </Card>

          {/* Product Information */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Sản phẩm</p>
                  <p className="font-semibold">{alert.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    SKU: {alert.productSku}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Kho</p>
                  <p className="font-semibold">
                    {alert.warehouseId?.name || "Chưa xác định"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Stock Information */}
          {(alert.alertType === "LOW_STOCK" ||
            alert.alertType === "OUT_OF_STOCK") && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Thông tin tồn kho
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Tồn kho hiện tại
                  </p>
                  <p className="text-2xl font-bold text-danger">
                    {alert.currentStock}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Mức tối thiểu
                  </p>
                  <p className="text-2xl font-bold">{alert.minimumStock}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tỷ lệ</p>
                  <p className="text-2xl font-bold">
                    {Math.round(
                      (alert.currentStock / alert.minimumStock) * 100
                    )}
                    %
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Expiry Information */}
          {(alert.alertType === "EXPIRING_SOON" ||
            alert.alertType === "EXPIRED") && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Thông tin hạn sử dụng
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Lô hàng</p>
                  <p className="font-semibold">{alert.lotNumber || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Hạn sử dụng
                  </p>
                  <p className="font-semibold">
                    {alert.expiryDate ? formatDate(alert.expiryDate) : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Số ngày còn lại
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      expiryInfo.isExpired
                        ? "text-red-600"
                        : expiryInfo.daysUntilExpiry <= 7
                        ? "text-orange-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {expiryInfo.isExpired
                      ? "Đã hết hạn"
                      : expiryInfo.daysUntilExpiry !== null
                      ? `${expiryInfo.daysUntilExpiry} ngày`
                      : "-"}
                  </p>
                </div>
              </div>
              {alert.inventoryLotId && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-1">
                    Số lượng trong lô
                  </p>
                  <p className="font-semibold">
                    {alert.inventoryLotId.quantity || "-"}
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* Timestamps */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Thông tin thời gian</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Ngày tạo</p>
                <p className="font-medium">{formatDate(alert.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Cập nhật lần cuối</p>
                <p className="font-medium">{formatDate(alert.updatedAt)}</p>
              </div>
            </div>
          </Card>

          {/* Actions Section */}
          {alert.status === "ACTIVE" && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Xác nhận cảnh báo</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
                  <Textarea
                    id="note"
                    placeholder="Nhập ghi chú của bạn..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <Button
                  onClick={handleAcknowledge}
                  disabled={loading}
                  className="w-full gap-2"
                >
                  <Check className="w-4 h-4" />
                  Xác nhận đã biết
                </Button>
              </div>
            </Card>
          )}

          {alert.status !== "RESOLVED" && (
            <Card className="p-4 border-green-200 bg-green-50">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCheck className="w-4 h-4" />
                Giải quyết cảnh báo
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="resolution">
                    Mô tả giải pháp <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="resolution"
                    placeholder="Mô tả cách bạn đã giải quyết vấn đề..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleResolve}
                  disabled={loading || !resolution.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Đánh dấu đã giải quyết
                </Button>
              </div>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            <X className="w-4 h-4 mr-2" />
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
