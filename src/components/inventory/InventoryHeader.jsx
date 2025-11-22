import { Plus, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function InventoryHeader({ search, setSearch }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Danh mục thuốc
        </h1>
        <p className="text-muted-foreground">Quản lý toàn bộ thuốc trong kho</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên thuốc hoặc mã thuốc..."
            className="pl-12 h-12 text-base bg-card border-border focus-visible:ring-2 focus-visible:ring-medical-blue"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        
      </div>
    </div>
  );
}
