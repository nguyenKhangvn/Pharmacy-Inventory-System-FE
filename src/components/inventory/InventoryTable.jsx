import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const inventoryData = [
  {
    id: "MED001",
    name: "Paracetamol 500mg",
    category: "Giảm đau",
    description: "Thuốc giảm đau, hạ sốt",
    unit: "Viên",
    supplier: "DHG Pharma",
    expiryDate: "2025-12-15",
  },
  {
    id: "MED002",
    name: "Amoxicillin 250mg",
    category: "Kháng sinh",
    description: "Kháng sinh nhóm Penicillin",
    unit: "Viên",
    supplier: "Traphaco",
    expiryDate: "2025-08-20",
  },
  {
    id: "MED003",
    name: "Vitamin C 1000mg",
    category: "Vitamin",
    description: "Bổ sung vitamin C",
    unit: "Viên",
    supplier: "Imexpharm",
    expiryDate: "2024-03-10",
  },
  {
    id: "MED004",
    name: "Aspirin 100mg",
    category: "Kháng đông máu",
    description: "Thuốc chống đông máu",
    unit: "Viên",
    supplier: "Pymepharco",
    expiryDate: "2025-06-30",
  },
  {
    id: "MED005",
    name: "Ibuprofen 400mg",
    category: "Giảm đau",
    description: "Thuốc giảm đau, kháng viêm",
    unit: "Viên",
    supplier: "DHG Pharma",
    expiryDate: "2025-09-15",
  },
];

export function InventoryTable() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">
                  Mã thuốc
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Tên thuốc
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Danh mục thuốc
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Mô tả
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Đơn vị
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Nhà cung cấp
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Hạn sử dụng
                </th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, index) => (
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
                  <td className="p-4">
                    <p className="font-medium text-foreground">{item.name}</p>
                  </td>
                  <td className="p-4 text-muted-foreground">{item.category}</td>
                  <td className="p-4 text-muted-foreground">
                    {item.description}
                  </td>
                  <td className="p-4 text-muted-foreground">{item.unit}</td>
                  <td className="p-4 text-muted-foreground">{item.supplier}</td>
                  <td className="p-4 text-muted-foreground">
                    {item.expiryDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Hiển thị <span className="font-medium text-foreground">1-5</span>{" "}
            trong tổng số{" "}
            <span className="font-medium text-foreground">2,847</span> thuốc
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
                570
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
