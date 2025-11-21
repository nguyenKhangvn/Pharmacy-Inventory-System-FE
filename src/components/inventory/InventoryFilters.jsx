import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

export function InventoryFilters() {
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
        >
          Xóa tất cả
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Danh mục thuốc
          </label>
          <Select>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="giam-dau">Giảm đau</SelectItem>
              <SelectItem value="khang-sinh">Kháng sinh</SelectItem>
              <SelectItem value="vitamin">Vitamin</SelectItem>
              <SelectItem value="khong-chong-dong">Kháng đông máu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Nhà cung cấp
          </label>
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
      </div>
    </div>
  );
}
