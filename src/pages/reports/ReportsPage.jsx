import { Header } from "@/components/Header";
import { ReportsChart } from "@/components/reports/ReportsChart";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { Sidebar } from "@/components/Sidebar";

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 space-y-6">
          <ReportsHeader />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ReportsTable />
            </div>
            <div className="lg:col-span-1">
              <ReportsChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
