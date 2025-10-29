import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { AddSupplierDialog } from "./dialog/AddSupplierDialog";

export function SuppliersHeader() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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
              placeholder="Tìm kiếm theo tên, mã số thuế, số điện thoại..."
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <AddSupplierDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </>
  );
}
