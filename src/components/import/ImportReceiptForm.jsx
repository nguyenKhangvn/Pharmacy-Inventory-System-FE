import { useState, useEffect } from "react";
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
import { Plus, Trash2, CheckCircle } from "lucide-react";
import { transactionService } from "@/services/transactionService";
import { supplierService } from "@/services/supplierService";
import { categoryService } from "@/services/categoryService";

export function ImportReceiptForm() {
  // Form state
  const [supplierId, setSupplierId] = useState("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");

  // Data state
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);

  // Loading & error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Drug items state
  const [drugItems, setDrugItems] = useState([
    {
      id: "1",
      productName: "",
      categoryId: "",
      categoryName: "",
      unit: "",
      sku: "",
      quantity: "",
      unitPrice: "",
      lotNumber: "",
      expiryDate: "",
      total: 0,
    },
  ]);

  // Load suppliers and categories on mount
  useEffect(() => {
    loadSuppliers();
    loadCategories();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await supplierService.getSuppliers({
        status: "active",
      });
      setSuppliers(response.data || []);
    } catch (err) {
      console.error("Failed to load suppliers:", err);
      setError("Không thể tải danh sách nhà cung cấp");
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories({
        status: "active",
      });
      setCategories(response.data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError("Không thể tải danh sách danh mục");
    }
  };

  const addDrugItem = () => {
    const newItem = {
      id: Date.now().toString(),
      productName: "",
      categoryId: "",
      categoryName: "",
      unit: "",
      sku: "",
      quantity: "",
      unitPrice: "",
      lotNumber: "",
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

  // Thêm useEffect để debug categories
  useEffect(() => {
    console.log("Categories updated:", categories);
  }, [categories]);

  // Thêm useEffect để debug drugItems
  useEffect(() => {
    console.log("Drug items updated:", drugItems);
  }, [drugItems]);

  const updateDrugItem = (id, field, value) => {
    setDrugItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Tính toán total nếu quantity hoặc unitPrice thay đổi
          if (field === "quantity" || field === "unitPrice") {
            const quantity =
              Number.parseFloat(
                field === "quantity" ? value : updatedItem.quantity
              ) || 0;
            const unitPrice =
              Number.parseFloat(
                field === "unitPrice" ? value : updatedItem.unitPrice
              ) || 0;
            updatedItem.total = quantity * unitPrice;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const updateDrugItemMultiple = (id, updates) => {
    setDrugItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, ...updates };

          // Tính toán total nếu quantity hoặc unitPrice thay đổi
          if (
            updates.quantity !== undefined ||
            updates.unitPrice !== undefined
          ) {
            const quantity = Number.parseFloat(updatedItem.quantity) || 0;
            const unitPrice = Number.parseFloat(updatedItem.unitPrice) || 0;
            updatedItem.total = quantity * unitPrice;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleCategoryChange = (itemId, value) => {
    const selectedCategory = categories.find(
      (cat) => String(cat._id) === String(value)
    );

    if (selectedCategory) {
      updateDrugItemMultiple(itemId, {
        categoryId: String(value),
        categoryName: selectedCategory.name,
      });
    }
  };

  const totalQuantity = drugItems.reduce(
    (sum, item) => sum + (Number.parseFloat(item.quantity) || 0),
    0
  );
  const totalAmount = drugItems.reduce((sum, item) => sum + item.total, 0);

  // Handle form submission
  const handleSave = async () => {
    try {
      // Validation
      if (!supplierId) {
        alert("Vui lòng chọn nhà cung cấp");
        return;
      }

      if (drugItems.length === 0) {
        alert("Vui lòng thêm ít nhất một sản phẩm");
        return;
      }

      // Validate each drug item
      for (let i = 0; i < drugItems.length; i++) {
        const item = drugItems[i];
        if (!item.productName.trim()) {
          alert(`Dòng ${i + 1}: Vui lòng nhập tên thuốc`);
          return;
        }
        if (!item.categoryId) {
          alert(`Dòng ${i + 1}: Vui lòng chọn danh mục`);
          return;
        }
        if (!item.unit.trim()) {
          alert(`Dòng ${i + 1}: Vui lòng nhập đơn vị tính`);
          return;
        }
        if (!item.quantity || Number.parseFloat(item.quantity) <= 0) {
          alert(`Dòng ${i + 1}: Số lượng phải lớn hơn 0`);
          return;
        }
        if (item.unitPrice === "" || Number.parseFloat(item.unitPrice) < 0) {
          alert(`Dòng ${i + 1}: Đơn giá không hợp lệ`);
          return;
        }
      }

      setLoading(true);
      setError(null);

      // Transform data to API format
      const transactionData = {
        type: "INBOUND",
        supplierId,
        transactionDate: new Date(transactionDate).toISOString(),
        notes: notes.trim() || undefined,
        details: drugItems.map((item) => ({
          productName: item.productName.trim(),
          sku: item.sku.trim() || undefined,
          unit: item.unit.trim(),
          categoryId: item.categoryId,
          quantity: Number.parseFloat(item.quantity),
          unitPrice: Number.parseFloat(item.unitPrice),
          lotNumber: item.lotNumber.trim() || undefined,
          expiryDate: item.expiryDate
            ? new Date(item.expiryDate).toISOString()
            : undefined,
        })),
      };

      console.log("Submitting transaction:", transactionData);

      const response = await transactionService.createInbound(transactionData);

      console.log("Transaction created:", response);

      alert("Tạo phiếu nhập kho thành công!");

      // Reset form
      setSupplierId("");
      setTransactionDate(new Date().toISOString().split("T")[0]);
      setNotes("");
      setDrugItems([
        {
          id: "1",
          productName: "",
          categoryId: "",
          categoryName: "",
          unit: "",
          sku: "",
          quantity: "",
          unitPrice: "",
          lotNumber: "",
          expiryDate: "",
          total: 0,
        },
      ]);
    } catch (err) {
      console.error("Failed to create transaction:", err);
      setError(err.response?.data?.message || "Không thể tạo phiếu nhập kho");
      alert(err.response?.data?.message || "Không thể tạo phiếu nhập kho");
    } finally {
      setLoading(false);
    }
  };

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
              <Select
                value={supplierId}
                onValueChange={(value) => setSupplierId(String(value))}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Chọn nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem
                      key={String(supplier.id)}
                      value={String(supplier.id)}
                    >
                      {supplier.name}
                    </SelectItem>
                  ))}
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
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
                  <th className="text-left p-3 font-medium text-foreground min-w-[200px]">
                    Danh mục thuốc *
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[150px]">
                    Đơn vị tính *
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[150px]">
                    Mã SKU
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[100px]">
                    Số lượng *
                  </th>
                  <th className="text-left p-3 font-medium text-foreground min-w-[120px]">
                    Đơn giá *
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
                        value={item.productName}
                        onChange={(e) =>
                          updateDrugItem(item.id, "productName", e.target.value)
                        }
                        className="bg-background border-border"
                      />
                    </td>
                    <td className="p-3">
                      <Select
                        value={item.categoryId}
                        onValueChange={(value) =>
                          handleCategoryChange(item.id, value)
                        }
                      >
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={String(category._id)}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        placeholder="Mã SKU (tùy chọn)"
                        value={item.sku}
                        onChange={(e) =>
                          updateDrugItem(item.id, "sku", e.target.value)
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
                        min="0"
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
                        min="0"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        placeholder="Số lô"
                        value={item.lotNumber}
                        onChange={(e) =>
                          updateDrugItem(item.id, "lotNumber", e.target.value)
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
        <Button
          onClick={handleSave}
          disabled={loading}
          className="px-6 hover:bg-calm-green/90"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {loading ? "Đang xử lý..." : "Hoàn thành phiếu nhập"}
        </Button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
