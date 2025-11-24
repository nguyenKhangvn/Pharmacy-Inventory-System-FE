import { Header } from "@/components/Header";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";

export default function InventoryPage() {
  const [categoryId, setCategoryId] = useState("all");
  const [supplierId, setSupplierId] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 space-y-6">
          <InventoryHeader search={search} setSearch={setSearch} />
          <InventoryFilters
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            supplierId={supplierId}
            setSupplierId={setSupplierId}
          />
          <InventoryTable
            categoryId={categoryId}
            supplierId={supplierId}
            search={search}
          />
        </main>
      </div>
    </div>
  );
}
