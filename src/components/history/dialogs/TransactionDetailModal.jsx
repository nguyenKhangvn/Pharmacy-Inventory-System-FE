import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Calendar,
  User,
  Building,
  Package,
} from "lucide-react";
import { transactionService } from "@/services/transactionService";

function TransactionDetailModal({ id, type, open, onClose }) {
  const [data, setData] = useState(null); 
  const [details, setDetails] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id || !open) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await transactionService.getTransactionDetails(
          id,
          type
        );
        const apiData = response.data || response;

        if (apiData) {
          if (apiData.header) {
            setData(apiData.header);
          } else {
            setData(apiData);
          }

          if (Array.isArray(apiData.details)) {
            setDetails(apiData.details);
          } else {
            setDetails([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch transaction data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      setData(null);
      setDetails([]);
    };
  }, [id, type, open]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header Modal */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Chi tiết phiếu {type === "INBOUND" ? "nhập kho" : "xuất kho"}
            </h2>
            {data && (
              <p className="text-sm text-muted-foreground mt-1">
                Mã phiếu:{" "}
                <span className="font-mono font-medium">
                  {data._id?.toUpperCase().substring(0, 8)}
                </span>
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue mx-auto"></div>
              <p className="text-muted-foreground mt-4">
                Đang tải thông tin...
              </p>
            </div>
          ) : data ? (
            <div className="space-y-8">
              {/* Status Badge */}
              <div className="flex flex-wrap gap-3 items-center">
                {data.type === "INBOUND" ? (
                  <Badge className="bg-green-100 text-green-800 border-0 px-4 py-2">
                    <ArrowDownToLine className="w-4 h-4 mr-2" /> Nhập kho
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800 border-0 px-4 py-2">
                    <ArrowUpFromLine className="w-4 h-4 mr-2" /> Xuất kho
                  </Badge>
                )}

                <Badge variant="outline" className="px-4 py-2">
                  {data.status === "COMPLETED" ? "Đã hoàn thành" : data.status}
                </Badge>
              </div>

              {/* Thông tin chung (Grid 2 cột) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cột Trái: Thời gian & Người dùng */}
                <div className="space-y-6">
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" /> Thông tin chung
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ngày tạo:</span>
                        <span className="font-medium">
                          {formatDate(data.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Người tạo:
                        </span>
                        <span className="font-medium">
                          {data.userId?.fullName} ({data.userId?.username})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cột Phải: Kho & Đối tác */}
                <div className="space-y-6">
                  <div className="bg-muted/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-3 flex items-center">
                      <Building className="w-4 h-4 mr-2" /> Nguồn & Đích
                    </h3>
                    <div className="space-y-2 text-sm">
                      {/* Nếu là Nhập kho */}
                      {data.type === "INBOUND" && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Nhà cung cấp:
                            </span>
                            <span className="font-medium">
                              {data.supplierId?.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Kho nhập:
                            </span>
                            <span className="font-medium">
                              {data.destinationWarehouseId?.name}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Nếu là Xuất kho */}
                      {data.type === "OUTBOUND" && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Kho xuất:
                            </span>
                            <span className="font-medium">
                              {data.sourceWarehouseId?.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Nơi nhận:
                            </span>
                            <span className="font-medium">
                              {data.departmentId?.name ||
                                data.destinationWarehouseId?.name ||
                                "Khác"}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Danh sách thuốc (TABLE) */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" /> Danh sách thuốc (
                  {details.length})
                </h3>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-3 text-left font-medium">Tên thuốc</th>
                        <th className="p-3 text-center font-medium">ĐVT</th>
                        <th className="p-3 text-center font-medium">
                          Số lượng
                        </th>
                        <th className="p-3 text-right font-medium">Đơn giá</th>
                        <th className="p-3 text-right font-medium">
                          Thành tiền
                        </th>
                        <th className="p-3 text-right font-medium">Lô / HSD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {details.map((item, index) => {
                        // Tính toán logic hiển thị dựa trên JSON
                        const productName = item.productId?.name || "N/A";
                        const productSku = item.productId?.sku || "";
                        const unit = item.productId?.unit || "Viên";

                        // JSON: lotNumber và expiryDate nằm trong inventoryLotId
                        const lotNumber = item.inventoryLotId?.lotNumber || "-";
                        const expiryDate = item.inventoryLotId?.expiryDate;

                        const isExpired =
                          expiryDate && new Date(expiryDate) < new Date();

                        return (
                          <tr
                            key={item._id || index}
                            className="hover:bg-muted/10"
                          >
                            <td className="p-3">
                              <div className="font-medium">{productName}</div>
                              <div className="text-xs text-muted-foreground">
                                {productSku}
                              </div>
                            </td>
                            <td className="p-3 text-center">{unit}</td>
                            <td className="p-3 text-center font-bold">
                              {item.quantity}
                            </td>
                            <td className="p-3 text-right">
                              {formatCurrency(item.unitPrice)}
                            </td>
                            <td className="p-3 text-right font-medium">
                              {formatCurrency(item.quantity * item.unitPrice)}
                            </td>
                            <td className="p-3 text-right">
                              <div className="text-xs">Lô: {lotNumber}</div>
                              {expiryDate ? (
                                <div
                                  className={`text-xs ${
                                    isExpired
                                      ? "text-red-500 font-bold"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  HSD:{" "}
                                  {new Date(expiryDate).toLocaleDateString(
                                    "vi-VN"
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-muted/20">
                      <tr>
                        <td colSpan={4} className="p-3 text-right font-bold">
                          Tổng cộng:
                        </td>
                        <td className="p-3 text-right font-bold text-medical-blue">
                          {formatCurrency(
                            details.reduce(
                              (sum, item) =>
                                sum + item.quantity * item.unitPrice,
                              0
                            )
                          )}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Không tìm thấy dữ liệu
            </div>
          )}
        </div>

        <div className="border-t p-4 flex justify-end">
          <Button onClick={onClose}>Đóng</Button>
        </div>
      </div>
    </div>
  );
}

export { TransactionDetailModal };
