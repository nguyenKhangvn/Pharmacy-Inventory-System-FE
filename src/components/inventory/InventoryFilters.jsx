import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { categoryService } from "@/services/categoryService";
import { supplierService } from "@/services/supplierService";

export function InventoryFilters({
  categoryId,
  setCategoryId,
  supplierId,
  setSupplierId,
}) {
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    loadCategories();
    loadSuppliers();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await categoryService.getCategories({ status: "active" });
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategories([]);
    }
  };

  const loadSuppliers = async () => {
    try {
      const res = await supplierService.getSuppliers({ status: "active" });
      setSuppliers(res.data || []);
    } catch (err) {
      console.error("Failed to load suppliers:", err);
      setSuppliers([]);
    }
  };
  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-medium text-foreground">Bộ lọc</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            setCategoryId("all");
            setSupplierId("all");
          }}
        >
          Xóa tất cả
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Danh mục thuốc
          </label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Nhà cung cấp
          </label>
          <Select value={supplierId} onValueChange={setSupplierId}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Chọn nhà cung cấp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {suppliers.map((sup) => (
                <SelectItem key={sup.id || sup._id} value={sup.id || sup._id}>
                  {sup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
