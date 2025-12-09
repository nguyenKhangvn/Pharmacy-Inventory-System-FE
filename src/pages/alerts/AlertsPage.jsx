import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { AlertsOverview } from "@/components/alerts/AlertsOverview";
import { AlertsTable } from "@/components/alerts/AlertsTable";
import { Sidebar } from "@/components/Sidebar";
import { getAlertsList, getAlertSummary } from "@/services/alertService";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [summary, setSummary] = useState({
    expiringSoon: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  useEffect(() => {
    fetchAlerts();
    fetchSummary();
  }, [pagination.page, pagination.limit, searchQuery]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await getAlertsList({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        status: "ACTIVE",
        sortBy: "daysUntilExpiry",
        order: "asc",
      });

      if (response.success) {
        setAlerts(response.data || []);
        setPagination({
          page: response.pagination?.page || 1,
          limit: response.pagination?.limit || 10,
          total: response.pagination?.total || 0,
          pages: response.pagination?.pages || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await getAlertSummary();
      if (response.success && response.data) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage, newLimit = null) => {
    if (newLimit && newLimit !== pagination.limit) {
      setPagination((prev) => ({
        ...prev,
        page: 1,
        limit: newLimit,
      }));
      return;
    }

    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

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

          <AlertsOverview summary={summary} />

          <AlertsTable
            alerts={alerts}
            loading={loading}
            pagination={pagination}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
          />
        </main>
      </div>
    </div>
  );
}
