import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddCategoryDialog } from "./dialog/AddCategoryDialog";

export function CategoriesHeader() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Quản lý danh mục thuốc
          </h1>
          <p className="text-muted-foreground mt-2">
            Quản lý các danh mục thuốc trong hệ thống
          </p>
        </div>
        <Button
          className="bg-medical-blue hover:bg-medical-blue/90 text-black"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      <AddCategoryDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </>
  );
}
