import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { reportService } from "@/services/reportService";

function getStatusBadge(closingStock) {
  if (closingStock === 0) {
    return (
      <Badge className="bg-gray-100 text-gray-600 border-0">Hết hàng</Badge>
    );
  } else if (closingStock < 10) {
    return (
      <Badge className="bg-danger-light text-danger border-0">Rất thấp</Badge>
    );
  } else if (closingStock < 50) {
    return (
      <Badge className="bg-warning-light text-warning border-0">Thấp</Badge>
    );
  }
  return (
    <Badge className="bg-calm-green-light text-calm-green border-0">
      Bình thường
    </Badge>
  );
}

export function ReportsTable({ startDate, endDate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    loadStockSummary();
  }, [startDate, endDate]);

  const loadStockSummary = async () => {
    try {
      setLoading(true);
      const response = await reportService.getStockSummary({
        startDate,
        endDate,
      });

      if (response.success) {
        setProducts(response.data.products || []);
        setTotalProducts(response.data.totalProducts || 0);
      }
    } catch (err) {
      console.error("Failed to load stock summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalOpeningStock = products.reduce(
    (sum, item) => sum + item.openingStock,
    0
  );
  const totalInbound = products.reduce(
    (sum, item) => sum + item.totalInbound,
    0
  );
  const totalOutbound = products.reduce(
    (sum, item) => sum + item.totalOutbound,
    0
  );
  const totalClosingStock = products.reduce(
    (sum, item) => sum + item.closingStock,
    0
  );

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          Báo cáo chi tiết ({totalProducts} sản phẩm)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Khoảng thời gian: {new Date(startDate).toLocaleDateString("vi-VN")} -{" "}
          {new Date(endDate).toLocaleDateString("vi-VN")}
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">
                  Tên thuốc
                </th>
                <th className="text-center p-4 font-medium text-foreground">
                  Đơn vị
                </th>
                <th className="text-right p-4 font-medium text-foreground">
                  Tồn đầu kỳ
                </th>
                <th className="text-right p-4 font-medium text-foreground">
                  Tổng nhập
                </th>
                <th className="text-right p-4 font-medium text-foreground">
                  Tổng xuất
                </th>
                <th className="text-right p-4 font-medium text-foreground">
                  Tồn cuối kỳ
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Trạng thái
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
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-muted-foreground"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                products.map((item, index) => (
                  <tr
                    key={item.productId}
                    className={`border-b border-border ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    <td className="p-4 font-medium text-foreground">
                      {item.productName}
                    </td>
                    <td className="p-4 text-center text-muted-foreground">
                      {item.unit}
                    </td>
                    <td className="p-4 text-right text-muted-foreground">
                      {item.openingStock.toLocaleString()}
                    </td>
                    <td className="p-4 text-right text-calm-green font-medium">
                      +{item.totalInbound.toLocaleString()}
                    </td>
                    <td className="p-4 text-right text-danger font-medium">
                      -{item.totalOutbound.toLocaleString()}
                    </td>
                    <td className="p-4 text-right font-medium text-foreground">
                      {item.closingStock.toLocaleString()}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(item.closingStock)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {!loading && products.length > 0 && (
              <tfoot className="bg-muted/30 border-t-2 border-border">
                <tr>
                  <td className="p-4 font-semibold text-foreground">
                    Tổng cộng
                  </td>
                  <td className="p-4"></td>
                  <td className="p-4 text-right font-semibold text-foreground">
                    {totalOpeningStock.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-semibold text-calm-green">
                    +{totalInbound.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-semibold text-danger">
                    -{totalOutbound.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-semibold text-medical-blue">
                    {totalClosingStock.toLocaleString()}
                  </td>
                  <td className="p-4"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
