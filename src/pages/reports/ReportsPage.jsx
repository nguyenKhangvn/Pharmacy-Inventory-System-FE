import { useState } from "react";
import { Header } from "@/components/Header";
import { ReportsChart } from "@/components/reports/ReportsChart";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { Sidebar } from "@/components/Sidebar";

export default function ReportsPage() {
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");

  const handleApply = ({ startDate: s, endDate: e }) => {
    if (s) setStartDate(s);
    if (e) setEndDate(e);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 space-y-6">
          <ReportsHeader
            initialStartDate={startDate}
            initialEndDate={endDate}
            onApply={handleApply}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ReportsTable startDate={startDate} endDate={endDate} />
            </div>
            <div className="lg:col-span-1">
              <ReportsChart startDate={startDate} endDate={endDate} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
