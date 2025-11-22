import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { productService } from "@/services/productService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InventoryTable({ categoryId, supplierId, search }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    loadProducts();
  }, [pagination.page, pagination.limit, categoryId, supplierId, search]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [categoryId, supplierId, search]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (categoryId && categoryId !== "all") params.categoryId = categoryId;
      if (supplierId && supplierId !== "all") params.supplierId = supplierId;
      if (search) params.search = search;
      const response = await productService.getProducts(params);
      setProducts(response.data || []);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        pages: response.pagination.pages,
      }));
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        {/* Bộ lọc */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Mã thuốc</th>
                <th className="text-left p-4 font-medium text-foreground">Tên thuốc</th>
                <th className="text-left p-4 font-medium text-foreground">Danh mục thuốc</th>
                <th className="text-left p-4 font-medium text-foreground">Mô tả</th>
                <th className="text-left p-4 font-medium text-foreground">Đơn vị</th>
                <th className="text-left p-4 font-medium text-foreground">Nhà cung cấp</th>
                <th className="text-left p-4 font-medium text-foreground">Hạn sử dụng</th>
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
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-muted-foreground"
                  >
                    Không có sản phẩm nào
                  </td>
                </tr>
              ) : (
                products.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`border-b border-border ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm text-medical-blue font-medium">
                        {item.sku}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">{item.name}</p>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {item.category?.name || "Chưa phân loại"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {item.description || "-"}
                    </td>
                    <td className="p-4 text-muted-foreground">{item.unit}</td>
                    <td className="p-4 text-muted-foreground">
                      {item.supplier?.name || "-"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {item.expiryDate
                        ? new Date(item.expiryDate).toLocaleDateString("vi-VN")
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="flex items-center gap-4">
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
              sản phẩm
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Số dòng/trang:</span>
              <Select
                value={pagination.limit.toString()}
                onValueChange={(value) =>
                  setPagination({ ...pagination, limit: parseInt(value), page: 1 })
                }
              >
                <SelectTrigger className="h-8 w-20 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
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
              {pagination.pages > 5 && (
                <>
                  <span className="text-muted-foreground">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => handlePageChange(pagination.pages)}
                  >
                    {pagination.pages}
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-transparent"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
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
