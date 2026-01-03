import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";

export function HistoryHeader({ onFilterChange }) {
  const searchTimeoutRef = useRef(null);
  const currentFiltersRef = useRef({});
  const [isCustom, setIsCustom] = useState(false);
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [dateRange, setDateRange] = useState("30days");
  const [transactionType, setTransactionType] = useState("INBOUND");

  const updateFilters = (newFilters) => {
    currentFiltersRef.current = { ...currentFiltersRef.current, ...newFilters };
    onFilterChange(currentFiltersRef.current);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      updateFilters({ lotNumber: value });
    }, 500);
  };

  // Hàm tạo thời gian bắt đầu của ngày (00:00:00)
  const getStartOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Hàm tạo thời gian kết thúc của ngày (23:59:59.999)
  const getEndOfDay = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  // Format date thành ISO string đúng chuẩn
  const toISOStringLocal = (date) => {
    return date.toISOString();
  };

  const getDateRange = (value) => {
    const now = new Date();
    const end = getEndOfDay(now);

    if (value === "today") {
      const start = getStartOfDay(now);
      return {
        startDate: toISOStringLocal(start),
        endDate: toISOStringLocal(end),
      };
    } else if (value === "7days") {
      const start = new Date();
      start.setDate(now.getDate() - 6); // -6 để bao gồm cả hôm nay (7 ngày)
      return {
        startDate: toISOStringLocal(getStartOfDay(start)),
        endDate: toISOStringLocal(end),
      };
    } else if (value === "30days") {
      const start = new Date();
      start.setDate(now.getDate() - 29); // -29 để bao gồm cả hôm nay (30 ngày)
      return {
        startDate: toISOStringLocal(getStartOfDay(start)),
        endDate: toISOStringLocal(end),
      };
    } else if (value === "90days") {
      const start = new Date();
      start.setDate(now.getDate() - 89); // -89 để bao gồm cả hôm nay (90 ngày)
      return {
        startDate: toISOStringLocal(getStartOfDay(start)),
        endDate: toISOStringLocal(end),
      };
    }

    return null;
  };
  const handleTypeChange = (value) => {
    setTransactionType(value);
    updateFilters({ type: value });
  };

  const handleDateChange = (value) => {
    setDateRange(value);

    if (value === "custom") {
      setIsCustom(true);
      return;
    }

    setIsCustom(false);
    const range = getDateRange(value);

    updateFilters({
      ...range,
      dateRange: value,
    });
  };

  const handleCustomDateChange = (type, value) => {
    const updated = { ...customRange, [type]: value };
    setCustomRange(updated);

    if (updated.start && updated.end) {
      const startDate = getStartOfDay(new Date(updated.start));
      const endDate = getEndOfDay(new Date(updated.end));

      updateFilters({
        startDate: toISOStringLocal(startDate),
        endDate: toISOStringLocal(endDate),
        dateRange: "custom",
      });
    }
  };

  // Format ngày cho input date (YYYY-MM-DD)
  const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Default load: INBOUND + 30 ngày
  useEffect(() => {
    const range = getDateRange("30days");
    const initialFilters = {
      type: "INBOUND",
      dateRange: "30days",
      ...range,
    };

    currentFiltersRef.current = initialFilters;
    onFilterChange(initialFilters);

    // Set default custom range là 30 ngày gần nhất
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    setCustomRange({
      start: formatDateForInput(thirtyDaysAgo),
      end: formatDateForInput(today),
    });
  }, []);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo số lô: LOT..."
                className="pl-10 bg-background"
                onChange={handleSearchChange}
              />
            </div>

            {/* Loại giao dịch */}
            <Select value={transactionType} onValueChange={handleTypeChange}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INBOUND">Nhập kho</SelectItem>
                <SelectItem value="OUTBOUND">Xuất kho</SelectItem>
              </SelectContent>
            </Select>

            {/* Lọc thời gian */}
            <Select value={dateRange} onValueChange={handleDateChange}>
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
          </div>

          {/* Custom Date Range */}
          {isCustom && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Từ ngày
                </label>
                <Input
                  type="date"
                  value={customRange.start}
                  onChange={(e) =>
                    handleCustomDateChange("start", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Đến ngày
                </label>
                <Input
                  type="date"
                  value={customRange.end}
                  onChange={(e) =>
                    handleCustomDateChange("end", e.target.value)
                  }
                  max={formatDateForInput(new Date())}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
