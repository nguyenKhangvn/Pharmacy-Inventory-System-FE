import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export function CategoriesHeader({ onAddClick, onSearch }) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    // Debounce search
    setTimeout(() => onSearch(value), 500);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Quản lý danh mục thuốc
        </h1>
        <p className="text-muted-foreground mt-2">
          Quản lý các danh mục thuốc trong hệ thống
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm danh mục..."
            className="pl-10 w-64"
          />
        </div>

        <Button
          className="bg-medical-blue hover:bg-medical-blue/90 text-black"
          onClick={onAddClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>
    </div>
  );
}
