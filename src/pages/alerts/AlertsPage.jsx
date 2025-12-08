import { Header } from "@/components/Header";
import { AlertsOverview } from "@/components/alerts/AlertsOverview";
import { AlertsTable } from "@/components/alerts/AlertsTable";
import { Sidebar } from "@/components/Sidebar";

export default function AlertsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-foreground">
              Cảnh báo Tồn kho
            </h1>
            <p className="text-muted-foreground">
              Theo dõi thuốc sắp hết hạn và tồn kho thấp
            </p>
          </div>

          <AlertsOverview />
          <AlertsTable />
        </main>
      </div>
    </div>
  );
}
