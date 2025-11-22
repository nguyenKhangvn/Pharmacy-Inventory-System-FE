import { useState, useEffect, useRef } from "react";
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
import { Plus, Trash2, CheckCircle, AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { productService } from "@/services/productService";
import { inventoryIssueService } from "@/services/inventoryIssueService";
import {
  validateInventoryIssueForm,
  validateStockAvailability,
} from "@/utils/inventoryIssueValidation";

export function ExportReceiptForm() {
  // Form state - warehouseId cố định
  const [warehouseId, setWarehouseId] = useState("690aa3041d2d97cd1d239118");
  // Danh sách khoa/phòng cố định
  const DEPARTMENTS = [
    { _id: "690aa3d11d2d97cd1d239122", code: "DEP-ER", name: "Khoa Cấp cứu" },
    { _id: "690aa3d11d2d97cd1d239123", code: "DEP-MED", name: "Khoa Nội" },
    { _id: "690aa3d11d2d97cd1d239124", code: "DEP-PED", name: "Khoa Nhi" },
    {
      _id: "690aa3d11d2d97cd1d239125",
      code: "DEP-LAB",
      name: "Khoa Xét nghiệm",
    },
    { _id: "690aa3d11d2d97cd1d239126", code: "DEP-PHAR", name: "Khoa Dược" },
    {
      _id: "690aa3d11d2d97cd1d239127",
      code: "DEP-ICU",
      name: "Khoa Hồi sức tích cực (ICU)",
    },
    {
      _id: "690aa3d11d2d97cd1d239128",
      code: "DEP-ADMIN",
      name: "Phòng Hành chính",
    },
  ];
  const [department, setDepartment] = useState("");
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");

  // Product search state
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [searchingProduct, setSearchingProduct] = useState("");
  const [showSuggestions, setShowSuggestions] = useState("");
  const searchTimeoutRef = useRef(null);

  // Validation & submission state
  const [validationErrors, setValidationErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdIssue, setCreatedIssue] = useState(null);

  const [drugItems, setDrugItems] = useState([
    {
      id: "1",
      productId: "",
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
      productId: "",
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

  // Search products from API with debounce
  const searchProducts = async (itemId, query) => {
    if (!warehouseId) {
      alert("Vui lòng chọn kho xuất trước");
      return;
    }

    if (!query || query.trim().length < 2) {
      setProductSuggestions([]);
      setShowSuggestions("");
      return;
    }

    try {
      setSearchingProduct(itemId);
      const response = await inventoryIssueService.getProductSuggestions({
        warehouseId,
        q: query.trim(),
      });
      setProductSuggestions(response.data || []);
      setShowSuggestions(itemId);
    } catch (err) {
      console.error("Failed to search products:", err);
      setProductSuggestions([]);
    } finally {
      setSearchingProduct("");
    }
  };

  // Handle product selection from suggestions
  const selectProduct = (itemId, product) => {
    setDrugItems(
      drugItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            productId: product.id,
            drugName: product.name,
            unitPrice: product.unitPrice.toString(),
            availableStock: product.availableQty,
            batchNumber: "", // Will be auto-allocated by FEFO
            expiryDate: product.nearestExpiry || "",
          };
        }
        return item;
      })
    );
    setShowSuggestions("");
    setProductSuggestions([]);
  };

  const updateDrugItem = (id, field, value) => {
    setDrugItems(
      drugItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          // Trigger search when drugName changes
          if (field === "drugName") {
            if (searchTimeoutRef.current) {
              clearTimeout(searchTimeoutRef.current);
            }
            searchTimeoutRef.current = setTimeout(() => {
              searchProducts(id, value);
            }, 300);
          }

          // Auto-calculate total when quantity or unitPrice changes
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

  // Handle form submission
  const handleSubmit = async () => {
    setValidationErrors([]);
    setSubmitError(null);

    // Prepare request payload
    const items = drugItems
      .filter((item) => item.productId && item.quantity)
      .map((item) => ({
        productId: item.productId,
        quantity: Number.parseFloat(item.quantity),
        unitPrice: Number.parseFloat(item.unitPrice) || 0,
      }));

    const payload = {
      warehouseId, // warehouseId cố định vẫn được gửi về backend
      department,
      issueDate: new Date(issueDate).toISOString(),
      notes,
      items,
    };

    // Frontend validation
    const formErrors = validateInventoryIssueForm(payload);
    if (formErrors.length > 0) {
      setValidationErrors(formErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Stock availability validation
    const stockErrors = validateStockAvailability(
      drugItems
        .filter((item) => item.productId)
        .map((item) => ({
          productId: item.productId,
          quantity: Number.parseFloat(item.quantity) || 0,
          availableQty: item.availableStock,
          productName: item.drugName,
        }))
    );

    if (stockErrors.length > 0) {
      setValidationErrors(stockErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Submit to API
    try {
      setIsSubmitting(true);
      const response = await inventoryIssueService.createInventoryIssue(
        payload
      );
      setCreatedIssue(response.data);
      setShowSuccessDialog(true);
    } catch (err) {
      console.error("Failed to create inventory issue:", err);
      setSubmitError(
        err.response?.data?.message ||
          "Không thể tạo phiếu xuất kho. Vui lòng thử lại."
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form after successful creation
  const handleCreateNew = () => {
    // Không reset warehouseId vì nó cố định
    setDepartment("");
    setIssueDate(new Date().toISOString().split("T")[0]);
    setNotes("");
    setDrugItems([
      {
        id: "1",
        productId: "",
        drugName: "",
        quantity: "",
        unitPrice: "",
        batchNumber: "",
        expiryDate: "",
        availableStock: 0,
        total: 0,
      },
    ]);
    setValidationErrors([]);
    setSubmitError(null);
    setCreatedIssue(null);
    setShowSuccessDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="font-medium mb-2">Vui lòng kiểm tra lại:</div>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, idx) => (
                <li key={idx}>{error.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Error */}
      {submitError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {submitError}
          </AlertDescription>
        </Alert>
      )}

      {/* General Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Thông tin chung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Đã xóa phần chọn kho xuất */}
            <div className="space-y-2">
              <Label
                htmlFor="department"
                className="text-sm font-medium text-foreground"
              >
                Khoa/Phòng nhận *
              </Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Chọn khoa/phòng" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dep) => (
                    <SelectItem key={dep.code} value={dep.code}>
                      {dep.name}
                    </SelectItem>
                  ))}
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
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-background border-border resize-none"
              rows={3}
              maxLength={1000}
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
                        <div className="relative">
                          <Input
                            placeholder="Nhập sản phẩm..."
                            value={item.drugName}
                            onChange={(e) =>
                              updateDrugItem(
                                item.id,
                                "drugName",
                                e.target.value
                              )
                            }
                            onFocus={() => {
                              if (item.drugName && item.drugName.length >= 2) {
                                searchProducts(item.id, item.drugName);
                              }
                            }}
                            className="bg-background border-border"
                            // Đã bỏ disabled vì warehouseId luôn có giá trị
                          />
                          {searchingProduct === item.id && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="animate-spin h-4 w-4 border-2 border-medical-blue border-t-transparent rounded-full" />
                            </div>
                          )}
                          {showSuggestions === item.id &&
                            productSuggestions.length > 0 && (
                              <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                                {productSuggestions.map((product) => (
                                  <div
                                    key={product.id}
                                    onClick={() =>
                                      selectProduct(item.id, product)
                                    }
                                    className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                                  >
                                    <div className="font-medium text-foreground">
                                      {product.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      Mã: {product.code} | Tồn kho:{" "}
                                      {product.availableQty} {product.unit} |
                                      Giá:{" "}
                                      {product.unitPrice.toLocaleString(
                                        "vi-VN"
                                      )}
                                      ₫
                                      {product.nearestExpiry && (
                                        <span className="ml-2">
                                          | HSD:{" "}
                                          {new Date(
                                            product.nearestExpiry
                                          ).toLocaleDateString("vi-VN")}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
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
          variant="outline"
          onClick={handleCreateNew}
          disabled={isSubmitting}
        >
          Làm mới
        </Button>
        <Button
          onClick={handleSubmit}
          className="px-6 bg-medical-blue hover:bg-medical-blue/90 text-white"
          disabled={
            hasStockWarnings ||
            isSubmitting ||
            !department || // Đã bỏ điều kiện !warehouseId
            drugItems.every((item) => !item.productId)
          }
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Đang xử lý...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Hoàn thành phiếu xuất
            </>
          )}
        </Button>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <CheckCircle className="w-6 h-6 mr-2" />
              Tạo Phiếu Xuất Kho Thành Công
            </DialogTitle>
            <DialogDescription>
              Phiếu xuất kho đã được tạo và số lượng tồn kho đã được cập nhật.
            </DialogDescription>
          </DialogHeader>
          {createdIssue && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Mã Phiếu</p>
                  <p className="font-semibold text-medical-blue">
                    {createdIssue.issueCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Khoa/Phòng</p>
                  <p className="font-semibold">{createdIssue.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày Xuất</p>
                  <p className="font-semibold">
                    {new Date(createdIssue.issueDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng Tiền</p>
                  <p className="font-semibold text-medical-blue">
                    {createdIssue.totalAmount.toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              </div>

              {/* FEFO Lot Allocations */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">
                  Chi Tiết Phân Bổ Lô (FEFO):
                </h4>
                <div className="max-h-60 overflow-y-auto space-y-3">
                  {createdIssue.details.map((detail, idx) => (
                    <div key={idx} className="border rounded-lg p-3 space-y-2">
                      <div className="font-medium">
                        Sản phẩm #{idx + 1} - Tổng: {detail.totalQuantity} |
                        Giá: {detail.unitPrice.toLocaleString("vi-VN")}₫
                      </div>
                      <div className="text-sm space-y-1">
                        {detail.lotAllocations.map((lot, lotIdx) => (
                          <div
                            key={lotIdx}
                            className="flex justify-between items-center text-xs text-muted-foreground bg-muted/30 p-2 rounded"
                          >
                            <span className="font-mono">{lot.lotNumber}</span>
                            <span>
                              HSD:{" "}
                              {new Date(lot.expiryDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                            <span className="font-semibold">
                              SL: {lot.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowSuccessDialog(false)}
                >
                  Đóng
                </Button>
                <Button
                  onClick={handleCreateNew}
                  className="bg-medical-blue hover:bg-medical-blue/90 text-white"
                >
                  Tạo Phiếu Mới
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
