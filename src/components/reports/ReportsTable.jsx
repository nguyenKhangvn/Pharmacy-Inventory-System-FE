import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const reportData = [
  {
    drugName: "Paracetamol 500mg",
    openingStock: 1500,
    totalImport: 2000,
    totalExport: 1250,
    closingStock: 2250,
    value: 4500000,
    status: "normal",
  },
  {
    drugName: "Amoxicillin 250mg",
    openingStock: 800,
    totalImport: 1200,
    totalExport: 1985,
    closingStock: 15,
    value: 30000,
    status: "low",
  },
  {
    drugName: "Vitamin C 1000mg",
    openingStock: 600,
    totalImport: 1500,
    totalExport: 1210,
    closingStock: 890,
    value: 1780000,
    status: "normal",
  },
  {
    drugName: "Aspirin 100mg",
    openingStock: 400,
    totalImport: 800,
    totalExport: 1192,
    closingStock: 8,
    value: 16000,
    status: "critical",
  },
  {
    drugName: "Ibuprofen 400mg",
    openingStock: 300,
    totalImport: 600,
    totalExport: 900,
    closingStock: 0,
    value: 0,
    status: "out",
  },
  {
    drugName: "Cephalexin 500mg",
    openingStock: 1000,
    totalImport: 1500,
    totalExport: 1200,
    closingStock: 1300,
    value: 2600000,
    status: "normal",
  },
];

function getStatusBadge(status) {
  switch (status) {
    case "normal":
      return (
        <Badge className="bg-calm-green-light text-calm-green border-0">
          Bình thường
        </Badge>
      );
    case "low":
      return (
        <Badge className="bg-warning-light text-warning border-0">Thấp</Badge>
      );
    case "critical":
      return (
        <Badge className="bg-danger-light text-danger border-0">Rất thấp</Badge>
      );
    case "out":
      return (
        <Badge className="bg-gray-100 text-gray-600 border-0">Hết hàng</Badge>
      );
    default:
      return <Badge variant="secondary">Không xác định</Badge>;
  }
}

export function ReportsTable() {
  const totalOpeningValue = reportData.reduce(
    (sum, item) =>
      sum + item.openingStock * (item.value / item.closingStock || 0),
    0
  );
  const totalClosingValue = reportData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const totalImport = reportData.reduce(
    (sum, item) => sum + item.totalImport,
    0
  );
  const totalExport = reportData.reduce(
    (sum, item) => sum + item.totalExport,
    0
  );

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          Báo cáo chi tiết
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Khoảng thời gian: 01/01/2024 - 31/12/2024
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">
                  Tên thuốc
                </th>
                <th className="text-right p-4 font-medium text-foreground">
                  Tồn đầu kỳ
                </th>
                <th className="text-right p-4 font-medium text-foreground">
                  Tổng nhập
                </th>
                <th className="text-right p-4 font-medium text-foreground">
                  Tổng xuất
                </th>
                <th className="text-right p-4 font-medium text-foreground">
                  Tồn cuối kỳ
                </th>
                <th className="text-right p-4 font-medium text-foreground">
                  Giá trị (₫)
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr
                  key={item.drugName}
                  className={`border-b border-border ${
                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                  }`}
                >
                  <td className="p-4 font-medium text-foreground">
                    {item.drugName}
                  </td>
                  <td className="p-4 text-right text-muted-foreground">
                    {item.openingStock.toLocaleString()}
                  </td>
                  <td className="p-4 text-right text-calm-green font-medium">
                    +{item.totalImport.toLocaleString()}
                  </td>
                  <td className="p-4 text-right text-danger font-medium">
                    -{item.totalExport.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-medium text-foreground">
                    {item.closingStock.toLocaleString()}
                  </td>
                  <td className="p-4 text-right font-medium text-foreground">
                    {item.value.toLocaleString()}
                  </td>
                  <td className="p-4">{getStatusBadge(item.status)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-muted/30 border-t-2 border-border">
              <tr>
                <td className="p-4 font-semibold text-foreground">Tổng cộng</td>
                <td className="p-4 text-right font-semibold text-foreground">
                  {reportData
                    .reduce((sum, item) => sum + item.openingStock, 0)
                    .toLocaleString()}
                </td>
                <td className="p-4 text-right font-semibold text-calm-green">
                  +{totalImport.toLocaleString()}
                </td>
                <td className="p-4 text-right font-semibold text-danger">
                  -{totalExport.toLocaleString()}
                </td>
                <td className="p-4 text-right font-semibold text-foreground">
                  {reportData
                    .reduce((sum, item) => sum + item.closingStock, 0)
                    .toLocaleString()}
                </td>
                <td className="p-4 text-right font-semibold text-medical-blue">
                  {totalClosingValue.toLocaleString()}
                </td>
                <td className="p-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
