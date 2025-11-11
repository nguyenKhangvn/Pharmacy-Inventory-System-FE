import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const alertsData = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    currentStock: "10 viên",
    minStock: "100 viên",
    ratio: "10%",
    status: "Hết hàng",
    statusType: "out-of-stock",
    date: "30/11/2025",
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    currentStock: "75 viên",
    minStock: "150 viên",
    ratio: "50%",
    status: "Tồn kho thấp",
    statusType: "low-stock",
    date: "30/11/2025",
  },
  {
    id: 3,
    name: "Vitamin C 1000mg",
    currentStock: "200 viên",
    minStock: "200 viên",
    ratio: "100%",
    status: "Tồn kho thấp",
    statusType: "low-stock",
    date: "30/11/2025",
  },
  {
    id: 4,
    name: "Ibuprofen 400mg",
    currentStock: "25 viên",
    minStock: "150 viên",
    ratio: "17%",
    status: "Hết hàng",
    statusType: "out-of-stock",
    date: "30/11/2025",
  },
  {
    id: 5,
    name: "Omeprazole 20mg",
    currentStock: "50 viên",
    minStock: "100 viên",
    ratio: "50%",
    status: "Tồn kho thấp",
    statusType: "low-stock",
    date: "30/11/2025",
  },
  {
    id: 6,
    name: "Metformin 500mg",
    currentStock: "30 viên",
    minStock: "150 viên",
    ratio: "20%",
    status: "Hết hàng",
    statusType: "out-of-stock",
    date: "01/12/2025",
  },
];

export function AlertsTable() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = alertsData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Danh sách cảnh báo
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm thuốc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted border-0"
              />
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Các loại thuốc cần nhập thêm hoặc xem xét
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold text-foreground">
                Tên thuốc
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Tồn kho hiện tại
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Mức tồn tối thiểu
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Tỷ lệ
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Trạng thái
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Ngày cảnh báo
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30">
                <TableCell className="font-medium text-foreground">
                  {item.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.currentStock}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.minStock}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      item.statusType === "out-of-stock"
                        ? "text-danger font-semibold"
                        : "text-muted-foreground"
                    }
                  >
                    {item.ratio}
                  </span>
                </TableCell>
                <TableCell>
                  {item.statusType === "out-of-stock" ? (
                    <Badge
                      variant="destructive"
                      className="bg-danger hover:bg-danger/90"
                    >
                      {item.status}
                    </Badge>
                  ) : (
                    <Badge className="bg-warning text-warning-foreground hover:bg-warning/90">
                      {item.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
