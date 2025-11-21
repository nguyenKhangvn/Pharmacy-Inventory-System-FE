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
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";

export function ImportReceiptForm() {
  const [drugItems, setDrugItems] = useState([
    {
      id: "1",
      drugName: "",
      category: "",
      unit: "",
      description: "",
      quantity: "",
      unitPrice: "",
      batchNumber: "",
      expiryDate: "",
      total: 0,
    },
  ]);

  const addDrugItem = () => {
    const newItem = {
      id: Date.now().toString(),
      drugName: "",
      category: "",
      unit: "",
      description: "",
      quantity: "",
      unitPrice: "",
      batchNumber: "",
      expiryDate: "",
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
                htmlFor="supplier"
                className="text-sm font-medium text-foreground"
              >
                Nhà cung cấp *
              </Label>
              <Select>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Chọn nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dhg">DHG Pharma</SelectItem>
                  <SelectItem value="traphaco">Traphaco</SelectItem>
                  <SelectItem value="imexpharm">Imexpharm</SelectItem>
                  <SelectItem value="pymepharco">Pymepharco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="importDate"
                className="text-sm font-medium text-foreground"
              >
                Ngày nhập *
              </Label>
              <Input
                id="importDate"
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
              placeholder="Ghi chú thêm về phiếu nhập..."
              className="bg-background border-border resize-none"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Drug Items */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Chi tiết phiếu nhập
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
                  <th className="text-left p-3 font-medium text-foreground min-w-[150px]">
                    Tên thuốc *
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[150px]">
                    Danh mục thuốc *
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w=[100px]">
                    Đơn vị tính *
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[150px]">
                    Mô tả
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[100px]">
                    Số lượng *
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[120px]">
                    Đơn giá *
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[100px]">
                    Số lô *
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[120px]">
                    Hạn sử dụng *
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
                {drugItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-border ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
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
                        placeholder="Danh mục"
                        value={item.category}
                        onChange={(e) =>
                          updateDrugItem(item.id, "category", e.target.value)
                        }
                        className="bg-background border-border"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        placeholder="Viên, Hộp..."
                        value={item.unit}
                        onChange={(e) =>
                          updateDrugItem(item.id, "unit", e.target.value)
                        }
                        className="bg-background border-border"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        placeholder="Mô tả thuốc"
                        value={item.description}
                        onChange={(e) =>
                          updateDrugItem(item.id, "description", e.target.value)
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
                        className="bg-background border-border"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        placeholder="0"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateDrugItem(item.id, "unitPrice", e.target.value)
                        }
                        className="bg-background border-border"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        placeholder="Số lô"
                        value={item.batchNumber}
                        onChange={(e) =>
                          updateDrugItem(item.id, "batchNumber", e.target.value)
                        }
                        className="bg-background border-border"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="date"
                        value={item.expiryDate}
                        onChange={(e) =>
                          updateDrugItem(item.id, "expiryDate", e.target.value)
                        }
                        className="bg-background border-border"
                      />
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
                ))}
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
                <span className="text-muted-foreground">Tổng thành tiền:</span>
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
        <Button className="px-6 hover:bg-calm-green/90">
          <CheckCircle className="w-4 h-4 mr-2" />
          Hoàn thành phiếu nhập
        </Button>
      </div>
    </div>
  );
}
