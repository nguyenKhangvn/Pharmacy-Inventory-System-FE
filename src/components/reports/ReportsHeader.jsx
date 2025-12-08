import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, Download, Calendar } from "lucide-react";
import { reportService } from "@/services/reportService";

export function ReportsHeader({ initialStartDate, initialEndDate, onApply }) {
  const [startDate, setStartDate] = useState(initialStartDate || "2024-01-01");
  const [endDate, setEndDate] = useState(initialEndDate || "2024-12-31");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (initialStartDate) setStartDate(initialStartDate);
    if (initialEndDate) setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  const handleApply = () => {
    if (onApply) {
      onApply({ startDate, endDate });
    }
  };

  const handleExport = async (reportType) => {
    try {
      setExporting(true);
      await reportService.exportReport({
        type: 'pdf',
        reportType,
        startDate,
        endDate,
      });
    } catch (err) {
      console.error("Failed to export report:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">
          Báo cáo Xuất-Nhập-Tồn
        </h1>
        <p className="text-muted-foreground">
          Theo dõi và phân tích hoạt động kho dược
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-end justify-between gap-6">
            <div className="flex items-end gap-4 flex-1">
              <div className="space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-sm font-medium text-foreground"
                >
                  Từ ngày
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="endDate"
                  className="text-sm font-medium text-foreground"
                >
                  Đến ngày
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>
              </div>

              <Button
                className="bg-medical-blue hover:bg-medical-blue/90 text-white"
                onClick={handleApply}
              >
                <FileText className="w-4 h-4 mr-2" />
                Tạo báo cáo
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() => handleExport('stock_summary')}
                disabled={exporting}
              >
                <Download className="w-4 h-4 mr-2" />
                {exporting ? "Đang xuất..." : "Xuất PDF"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
