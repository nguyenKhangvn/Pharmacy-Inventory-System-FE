import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Filter } from "lucide-react";
import { useState } from "react";

export function UsersHeader({ onSearch, onAddClick, onFilterChange, filters }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setTimeout(() => onSearch(value), 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Quản lý người dùng
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý tài khoản và phân quyền người dùng trong hệ thống
          </p>
        </div>
        <Button
          className="gap-2 bg-medical-blue hover:bg-medical-blue/90 text-black shadow-sm"
          onClick={onAddClick}
          size="default"
        >
          <UserPlus className="w-4 h-4" />
          <span className="font-medium">Thêm người dùng</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            className="pl-10 bg-background"
          />
        </div>

        <select
          value={filters?.role || ""}
          onChange={(e) => onFilterChange("role", e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="">Tất cả vai trò</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <select
          value={filters?.status || ""}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="locked">Khóa</option>
        </select>
      </div>
    </div>
  );
}
