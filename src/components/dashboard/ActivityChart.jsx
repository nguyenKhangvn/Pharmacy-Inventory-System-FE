import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "T2", nhap: 45, xuat: 32 },
  { day: "T3", nhap: 52, xuat: 28 },
  { day: "T4", nhap: 38, xuat: 41 },
  { day: "T5", nhap: 61, xuat: 35 },
  { day: "T6", nhap: 43, xuat: 29 },
  { day: "T7", nhap: 29, xuat: 18 },
  { day: "CN", nhap: 15, xuat: 12 },
];

export function ActivityChart() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          Hoạt động Nhập/Xuất kho
        </CardTitle>
        <p className="text-sm text-muted-foreground">7 ngày qua</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="nhap"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                name="Nhập kho"
              />
              <Bar
                dataKey="xuat"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="Xuất kho"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
