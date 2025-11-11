import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { AddSupplierDialog } from "./dialogs/AddSupplierDialog";

export function SuppliersHeader({
  onSearch,
  onFilterChange,
  onAddSupplier,
  filterStatus,
}) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const handleAddSuccess = async (supplierData) => {
    await onAddSupplier(supplierData);
    setIsAddDialogOpen(false);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Quản lý nhà cung cấp
            </h1>
            <p className="text-muted-foreground mt-1">
              Quản lý thông tin các nhà cung cấp thuốc và vật tư y tế
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-medical-blue hover:bg-medical-blue/90 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm nhà cung cấp
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm theo tên, mã nhà cung cấp, mã số thuế..."
              className="pl-10"
            />
          </div>
          <Select
            value={filterStatus}
            onValueChange={(value) => onFilterChange("status", value)}
            defaultValue="all"
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="locked">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AddSupplierDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddSuccess}
      />
    </>
  );
}
