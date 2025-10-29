import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function HistoryHeader() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Lịch sử nhập/xuất thuốc
        </h1>
        <p className="text-muted-foreground mt-2">
          Theo dõi toàn bộ giao dịch nhập và xuất thuốc
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo mã phiếu, tên thuốc..."
                className="pl-10 bg-background"
              />
            </div>

            {/* Transaction Type Filter */}
            <Select defaultValue="all">
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả giao dịch</SelectItem>
                <SelectItem value="import">Nhập kho</SelectItem>
                <SelectItem value="export">Xuất kho</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <Select defaultValue="30days">
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="7days">7 ngày qua</SelectItem>
                <SelectItem value="30days">30 ngày qua</SelectItem>
                <SelectItem value="90days">90 ngày qua</SelectItem>
                <SelectItem value="custom">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>

            {/* Export Button */}
            <Button className="bg-medical-blue hover:bg-medical-blue/90">
              <Download className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>

          {/* Advanced Filters */}
          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="ghost" size="sm" className="text-medical-blue">
              <Filter className="w-4 h-4 mr-2" />
              Bộ lọc nâng cao
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
