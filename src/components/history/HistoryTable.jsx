import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";

const historyData = [
  {
    id: "PN-2024-001",
    type: "import",
    date: "2024-01-15 09:30",
    drugName: "Paracetamol 500mg",
    drugCode: "MED001",
    quantity: 500,
    unit: "Viên",
    supplier: "DHG Pharma",
    department: null,
    createdBy: "Nguyễn Văn A",
    totalValue: "5,000,000 ₫",
  },
  {
    id: "PX-2024-045",
    type: "export",
    date: "2024-01-15 14:20",
    drugName: "Amoxicillin 250mg",
    drugCode: "MED002",
    quantity: 100,
    unit: "Viên",
    supplier: null,
    department: "Khoa Nội",
    createdBy: "Trần Thị B",
    totalValue: "1,200,000 ₫",
  },
  {
    id: "PN-2024-002",
    type: "import",
    date: "2024-01-14 10:15",
    drugName: "Vitamin C 1000mg",
    drugCode: "MED003",
    quantity: 1000,
    unit: "Viên",
    supplier: "Imexpharm",
    department: null,
    createdBy: "Nguyễn Văn A",
    totalValue: "8,500,000 ₫",
  },
  {
    id: "PX-2024-044",
    type: "export",
    date: "2024-01-14 16:45",
    drugName: "Aspirin 100mg",
    drugCode: "MED004",
    quantity: 50,
    unit: "Viên",
    supplier: null,
    department: "Khoa Ngoại",
    createdBy: "Lê Văn C",
    totalValue: "450,000 ₫",
  },
  {
    id: "PN-2024-003",
    type: "import",
    date: "2024-01-13 11:00",
    drugName: "Ibuprofen 400mg",
    drugCode: "MED005",
    quantity: 300,
    unit: "Viên",
    supplier: "DHG Pharma",
    department: null,
    createdBy: "Nguyễn Văn A",
    totalValue: "3,600,000 ₫",
  },
  {
    id: "PX-2024-043",
    type: "export",
    date: "2024-01-13 15:30",
    drugName: "Paracetamol 500mg",
    drugCode: "MED001",
    quantity: 200,
    unit: "Viên",
    supplier: null,
    department: "Khoa Sản",
    createdBy: "Trần Thị B",
    totalValue: "2,000,000 ₫",
  },
];

function getTypeBadge(type) {
  if (type === "import") {
    return (
      <Badge className="bg-calm-green-light text-calm-green border-0">
        <ArrowDownToLine className="w-3 h-3 mr-1" />
        Nhập kho
      </Badge>
    );
  }
  return (
    <Badge className="bg-medical-blue-light text-medical-blue border-0">
      <ArrowUpFromLine className="w-3 h-3 mr-1" />
      Xuất kho
    </Badge>
  );
}

export function HistoryTable() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">
                  Mã phiếu
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Loại
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Thời gian
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Thuốc
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Số lượng
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  NCC/Khoa
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Người tạo
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Giá trị
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-border ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                  }`}
                >
                  <td className="p-4">
                    <span className="font-mono text-sm text-medical-blue font-medium">
                      {item.id}
                    </span>
                  </td>
                  <td className="p-4">{getTypeBadge(item.type)}</td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {item.date.split(" ")[0]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.date.split(" ")[1]}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {item.drugName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.drugCode}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-foreground">
                      {item.quantity.toLocaleString()} {item.unit}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {item.type === "import" ? item.supplier : item.department}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {item.createdBy}
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-foreground">
                      {item.totalValue}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Hiển thị <span className="font-medium text-foreground">1-6</span>{" "}
            trong tổng số{" "}
            <span className="font-medium text-foreground">1,247</span> giao dịch
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8 bg-transparent">
              <ChevronLeft className="w-4 h-4" />
              Trước
            </Button>
            <div className="flex items-center space-x-1">
              <Button
                variant="default"
                size="sm"
                className="h-8 w-8 bg-medical-blue hover:bg-medical-blue/90"
              >
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-transparent"
              >
                2
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-transparent"
              >
                3
              </Button>
              <span className="text-muted-foreground">...</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 bg-transparent"
              >
                208
              </Button>
            </div>
            <Button variant="outline" size="sm" className="h-8 bg-transparent">
              Sau
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
