import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { reportService } from "@/services/reportService";

const MONTH_NAMES = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

const STATUS_COLORS = {
  COMPLETED: "#10b981",
  PENDING: "#f59e0b",
  CANCELLED: "#ef4444",
};

export function ReportsChart({ startDate, endDate }) {
  const [trendsData, setTrendsData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChartsData();
  }, [startDate, endDate]);

  const loadChartsData = async () => {
    try {
      setLoading(true);
      const [trendsResponse, statusResponse] = await Promise.all([
        reportService.getTrends({ startDate, endDate }),
        reportService.getStatusDistribution({ startDate, endDate }),
      ]);

      if (trendsResponse.success) {
        const formatted = trendsResponse.data.trends.map((item) => ({
          month: `T${item.month}`,
          inbound: item.inbound.totalQuantity,
          outbound: item.outbound.totalQuantity,
        }));
        setTrendsData(formatted);
      }

      if (statusResponse.success) {
        const formatted = statusResponse.data.distribution.map((item) => ({
          name: item.status === "COMPLETED" ? "Hoàn thành" : item.status === "PENDING" ? "Chờ xử lý" : "Đã hủy",
          value: item.percentage,
          color: STATUS_COLORS[item.status] || "#6b7280",
        }));
        setStatusData(formatted);
      }
    } catch (err) {
      console.error("Failed to load charts data:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Xu hướng theo tháng
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Đang tải...
            </div>
          ) : trendsData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Không có dữ liệu
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
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
                  <Line
                    type="monotone"
                    dataKey="inbound"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                    name="Nhập kho"
                  />
                  <Line
                    type="monotone"
                    dataKey="outbound"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    name="Xuất kho"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Phân bổ trạng thái giao dịch
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Đang tải...
            </div>
          ) : statusData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Không có dữ liệu
            </div>
          ) : (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {statusData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-muted-foreground">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
