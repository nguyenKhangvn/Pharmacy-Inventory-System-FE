import { useCallback, useState } from "react";
import { Header } from "@/components/Header";
import { HistoryHeader } from "@/components/history/HistoryHeader";
import { HistoryTable } from "@/components/history/HistoryTable";
import { Sidebar } from "@/components/Sidebar";

export default function HistoryPage() {
  const [filters, setFilters] = useState({
    search: "",
    type: "INBOUND",
    startDate: "",
    endDate: "",
  });

  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => {
      return { ...prev, ...newFilters };
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 space-y-6">
          <HistoryHeader onFilterChange={handleFilterChange} />
          <HistoryTable filters={filters} />
        </main>
      </div>
    </div>
  );
}
