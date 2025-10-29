import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { AlertsSection } from "@/components/dashboard/AlertsSection";
import { KPICards } from "@/components/dashboard/KPICards";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Tổng quan hệ thống quản lý kho dược
            </p>
          </div>

          <KPICards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ActivityChart />
            </div>
            <div className="lg:col-span-1">
              <AlertsSection />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
