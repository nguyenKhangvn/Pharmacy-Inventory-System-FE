import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ExportReceiptForm() {
  const [drugItems, setDrugItems] = useState([
    {
      id: "1",
      drugName: "",
      quantity: "",
      unitPrice: "",
      batchNumber: "",
      expiryDate: "",
      availableStock: 0,
      total: 0,
    },
  ]);

  const addDrugItem = () => {
    const newItem = {
      id: Date.now().toString(),
      drugName: "",
      quantity: "",
      unitPrice: "",
      batchNumber: "",
      expiryDate: "",
      availableStock: 0,
      total: 0,
    };
    setDrugItems([...drugItems, newItem]);
  };

  const removeDrugItem = (id) => {
    if (drugItems.length > 1) {
      setDrugItems(drugItems.filter((item) => item.id !== id));
    }
  };

  const updateDrugItem = (id, field, value) => {
    setDrugItems(
      drugItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Simulate stock lookup when drug is selected
          if (field === "drugName" && value) {
            const stockData = {
              "paracetamol-500": {
                stock: 5000,
                price: 2500,
                batch: "LOT2024001",
                expiry: "2025-12-31",
              },
              "amoxicillin-250": {
                stock: 3000,
                price: 8500,
                batch: "LOT2024002",
                expiry: "2025-10-15",
              },
              "vitamin-c-1000": {
                stock: 2000,
                price: 15000,
                batch: "LOT2024003",
                expiry: "2026-03-20",
              },
              "aspirin-100": {
                stock: 4500,
                price: 3200,
                batch: "LOT2024004",
                expiry: "2025-08-30",
              },
            };

            const stock = stockData[value];
            if (stock) {
              updatedItem.availableStock = stock.stock;
              updatedItem.unitPrice = stock.price.toString();
              updatedItem.batchNumber = stock.batch;
              updatedItem.expiryDate = stock.expiry;
            }
          }

          if (field === "quantity" || field === "unitPrice") {
            const quantity =
              Number.parseFloat(field === "quantity" ? value : item.quantity) ||
              0;
            const unitPrice =
              Number.parseFloat(
                field === "unitPrice" ? value : item.unitPrice
              ) || 0;
            updatedItem.total = quantity * unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const totalQuantity = drugItems.reduce(
    (sum, item) => sum + (Number.parseFloat(item.quantity) || 0),
    0
  );
  const totalAmount = drugItems.reduce((sum, item) => sum + item.total, 0);

  // Check for stock warnings
  const hasStockWarnings = drugItems.some(
    (item) =>
      item.drugName && Number.parseFloat(item.quantity) > item.availableStock
  );

  return (
    <div className="space-y-6">
      {/* General Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Thông tin chung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="department"
                className="text-sm font-medium text-foreground"
              >
                Khoa/Phòng nhận *
              </Label>
              <Select>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Chọn khoa/phòng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noi-khoa">Khoa Nội</SelectItem>
                  <SelectItem value="ngoai-khoa">Khoa Ngoại</SelectItem>
                  <SelectItem value="san-khoa">Khoa Sản</SelectItem>
                  <SelectItem value="nhi-khoa">Khoa Nhi</SelectItem>
                  <SelectItem value="cap-cuu">Khoa Cấp cứu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="exportDate"
                className="text-sm font-medium text-foreground"
              >
                Ngày xuất *
              </Label>
              <Input
                id="exportDate"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="text-sm font-medium text-foreground"
            >
              Ghi chú
            </Label>
            <Textarea
              id="notes"
              placeholder="Ghi chú thêm về phiếu xuất..."
              className="bg-background border-border resize-none"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stock Warning */}
      {hasStockWarnings && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Cảnh báo: Một số thuốc có số lượng xuất vượt quá tồn kho hiện tại.
            Vui lòng kiểm tra lại.
          </AlertDescription>
        </Alert>
      )}

      {/* Drug Items */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Chi tiết phiếu xuất
            </CardTitle>
            <Button
              onClick={addDrugItem}
              className="bg-medical-blue hover:bg-medical-blue/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm dòng
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-foreground min-w-[200px]">
                    Tên thuốc *
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[100px]">
                    Số lượng *
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[120px]">
                    Đơn giá
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[100px]">
                    Số lô
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[120px]">
                    Hạn sử dụng
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[120px]">
                    Thành tiền
                  </th>
                  <th className="text-left p-3 font-medium text-foreground w-[60px]">
                    Xóa
                  </th>
                </tr>
              </thead>
              <tbody>
                {drugItems.map((item, index) => {
                  const isOverStock =
                    item.drugName &&
                    Number.parseFloat(item.quantity) > item.availableStock;
                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-border ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      } ${isOverStock ? "bg-red-50" : ""}`}
                    >
                      <td className="p-3">
                        <Input
                          placeholder="Nhập tên thuốc"
                          value={item.drugName}
                          onChange={(e) =>
                            updateDrugItem(item.id, "drugName", e.target.value)
                          }
                          className="bg-background border-border"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          placeholder="0"
                          value={item.quantity}
                          onChange={(e) =>
                            updateDrugItem(item.id, "quantity", e.target.value)
                          }
                          className={`bg-background border-border ${
                            isOverStock ? "border-red-500" : ""
                          }`}
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-foreground">
                          {item.unitPrice
                            ? `${Number.parseFloat(
                                item.unitPrice
                              ).toLocaleString("vi-VN")} ₫`
                            : "-"}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-muted-foreground">
                          {item.batchNumber || "-"}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-muted-foreground">
                          {item.expiryDate
                            ? new Date(item.expiryDate).toLocaleDateString(
                                "vi-VN"
                              )
                            : "-"}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-foreground">
                          {item.total.toLocaleString("vi-VN")} ₫
                        </div>
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDrugItem(item.id)}
                          disabled={drugItems.length === 1}
                          className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger-light"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Tổng kết
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-lg font-medium text-foreground">
                  Tổng thành tiền:
                </span>
                <span className="text-xl font-bold text-medical-blue">
                  {totalAmount.toLocaleString("vi-VN")} ₫
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6">
        <Button
          className="px-6 hover:bg-calm-green/90 text-white"
          disabled={hasStockWarnings}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Hoàn thành phiếu xuất
        </Button>
      </div>
    </div>
  );
}
