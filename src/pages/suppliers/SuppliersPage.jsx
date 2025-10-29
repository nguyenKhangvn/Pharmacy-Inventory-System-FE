import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SuppliersHeader } from "@/components/suppliers/SuppliersHeader";
import { SuppliersTable } from "@/components/suppliers/SuppliersTable";

export default function SuppliersPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 space-y-6">
          <SuppliersHeader />
          <SuppliersTable />
        </main>
      </div>
    </div>
  );
}
