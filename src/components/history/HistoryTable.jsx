import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import { transactionService } from "@/services/transactionService";

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
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    loadTransactions();
  }, [pagination.page, filters]);

  const loadTransactions = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
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
                <th className="text-left p-4 font-medium text-foreground">
                  Kho
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Khoa/Phòng
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
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-muted-foreground"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-muted-foreground"
                  >
                    Không có giao dịch nào
                  </td>
                </tr>
              ) : (
                transactions.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`border-b border-border ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    <td className="p-4">{getTypeBadge(item.type)}</td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {formatDate(item.transactionDate)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(item.createdAt)}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {item.sourceWarehouseId?.name || "Kho trung tâm"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {item.departmentId?.name || "-"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {item.userId?.fullName || "-"}
                    </td>
                    <td className="p-4">
                      <Badge
                        className={`${
                          item.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : item.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        } border-0`}
                      >
                        {item.status === "COMPLETED"
                          ? "Hoàn thành"
                          : item.status === "PENDING"
                          ? "Chờ xử lý"
                          : "Đã hủy"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Hiển thị{" "}
            <span className="font-medium text-foreground">
              {(pagination.page - 1) * pagination.limit + 1}-
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-medium text-foreground">
              {pagination.total}
            </span>{" "}
            giao dịch
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-transparent"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Trước
            </Button>
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={
                      pagination.page === pageNum ? "default" : "outline"
                    }
                    size="sm"
                    className={`h-8 w-8 ${
                      pagination.page === pageNum
                        ? "bg-medical-blue hover:bg-medical-blue/90"
                        : "bg-transparent"
                    }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {pagination.totalPages > 5 && (
                <>
                  <span className="text-muted-foreground">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => handlePageChange(pagination.totalPages)}
                  >
                    {pagination.totalPages}
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-transparent"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Sau
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
