import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { transactionService } from "@/services/transactionService";
import { TransactionDetailModal } from "./dialogs/TransactionDetailModal";

function getTypeBadge(type) {
  if (type === "INBOUND") {
    return (
      <Badge className="bg-calm-green-light text-calm-green border-0">
        <ArrowDownToLine className="w-3 h-3 mr-1" />
        Nhập kho
      </Badge>
    );
  }
  return (
    <Badge className="bg-medical-blue-light text-medical-blue border-0">
      <ArrowUpFromLine className="w-3 h-3 mr-1" />
      Xuất kho
    </Badge>
  );
}

export function HistoryTable({ filters }) {
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Reset page khi filters thay đổi
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [
    filters.search,
    filters.type,
    filters.startDate,
    filters.endDate,
    filters.inventoryLotId,
  ]); // Thêm inventoryLotId vào dependency

  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      const response = await transactionService.getTransactions(params);

      if (response.success) {
        setTransactions(response.data.transactions || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        }));
      }
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setTransactions([]);
      setPagination((prev) => ({ ...prev, total: 0, totalPages: 1 }));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({
      ...prev,
      limit: Number(newLimit),
      page: 1,
    }));
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return "-";
    }
  };

  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const handleViewDetail = (item) => {
    setSelectedId(item._id);
    setSelectedType(item.type);
    setDetailOpen(true);
  };

  if (loading && transactions.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">Đang tải dữ liệu...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">
                    Loại
                  </th>
                  <th className="text-left p-4 font-medium text-foreground">
                    Thời gian
                  </th>
                  {/* --- CỘT MỚI: SỐ LÔ --- */}
                  <th className="text-left p-4 font-medium text-foreground">
                    Số lô
                  </th>
                  <th className="text-left p-4 font-medium text-foreground">
                    Kho/Nguồn
                  </th>
                  <th className="text-left p-4 font-medium text-foreground">
                    Nơi nhận
                  </th>
                  <th className="text-left p-4 font-medium text-foreground">
                    Người tạo
                  </th>
                  <th className="text-left p-4 font-medium text-foreground">
                    Trạng thái
                  </th>
                  <th className="text-left p-4 font-medium text-foreground">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-12 text-center text-muted-foreground"
                    >
                      Không có giao dịch nào
                    </td>
                  </tr>
                ) : (
                  transactions.map((item, index) => (
                    <tr
                      key={item._id || index}
                      className={`border-b border-border hover:bg-muted/30 transition-colors ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      }`}
                    >
                      <td className="p-4">{getTypeBadge(item.type)}</td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground">
                            {formatDate(item.transactionDate || item.createdAt)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(item.createdAt)}
                          </p>
                        </div>
                      </td>

                      {/* --- HIỂN THỊ CỘT SỐ LÔ --- */}
                      <td className="p-4">
                        {item.lotNumbers && item.lotNumbers.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {/* Chỉ hiện tối đa 2 lô để bảng không bị dài quá */}
                            {item.lotNumbers.slice(0, 2).map((lot, idx) => {
                              // Nếu bạn đang tìm kiếm lô này, highlight nó lên
                              const isMatch =
                                filters.search && lot.includes(filters.search);
                              return (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className={`font-mono text-[10px] w-fit ${
                                    isMatch
                                      ? "border-red-500 text-red-600 bg-red-50"
                                      : "bg-background"
                                  }`}
                                >
                                  {lot}
                                </Badge>
                              );
                            })}
                            {/* Nếu còn lô khác thì hiện số lượng còn lại */}
                            {item.lotNumbers.length > 2 && (
                              <span className="text-[10px] text-muted-foreground pl-1">
                                +{item.lotNumbers.length - 2} lô khác
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </td>
                      {/* --------------------------- */}

                      <td className="p-4 text-muted-foreground text-sm">
                        {item.type === "INBOUND"
                          ? item.supplierId?.name || "Nhập từ nhà cung cấp"
                          : item.sourceWarehouseId?.name || "Kho trung tâm"}
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {item.type === "INBOUND"
                          ? item.destinationWarehouseId?.name || "Kho trung tâm"
                          : item.departmentId?.name ||
                            item.destinationWarehouseId?.name ||
                            "Xuất tiêu hao"}
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">
                        {item.userId?.fullName || item.createdBy?.name || "-"}
                      </td>
                      <td className="p-4">
                        <Badge
                          className={`${
                            item.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : item.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          } border-0 shadow-none`}
                        >
                          {item.status === "COMPLETED"
                            ? "Hoàn thành"
                            : item.status === "PENDING"
                            ? "Chờ xử lý"
                            : "Đã hủy"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-muted/50"
                          onClick={() => handleViewDetail(item)}
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {transactions.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Hiển thị:</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(e.target.value)}
                  className="px-3 py-1 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-muted-foreground ml-2">
                  Tổng: <strong>{pagination.total}</strong> giao dịch
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                >
                  Trước
                </Button>
                <span className="text-sm font-medium mx-2">
                  Trang {pagination.page} / {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={
                    pagination.page === pagination.totalPages || loading
                  }
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal chi tiết */}
      <TransactionDetailModal
        id={selectedId}
        type={selectedType}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
