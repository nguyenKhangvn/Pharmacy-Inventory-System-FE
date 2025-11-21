import { Header } from "@/components/Header";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { Sidebar } from "@/components/Sidebar";

export default function InventoryPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 space-y-6">
          <InventoryHeader />
          <InventoryFilters />
          <InventoryTable />
        </main>
      </div>
    </div>
  );
}
