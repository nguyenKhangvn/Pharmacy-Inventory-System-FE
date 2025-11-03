import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SuppliersHeader } from "@/components/suppliers/SuppliersHeader";
import { SuppliersTable } from "@/components/suppliers/SuppliersTable";
import { supplierService } from "@/services/supplierService";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    pages: 1,
  });
  const [filters, setFilters] = useState({
    q: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    status: "all",
  });

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      if (filters.q) {
        params.q = filters.q;
      }

      if (filters.status && filters.status !== "all") {
        params.status = filters.status;
      }

      const response = await supplierService.getSuppliers(params);
      setSuppliers(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        pages: response.pagination.pages,
      });
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      alert("Không thể tải danh sách nhà cung cấp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [pagination.page, pagination.limit, filters]);

  const handleSearch = (searchQuery) => {
    setFilters((prev) => ({ ...prev, q: searchQuery }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleAddSupplier = async (supplierData) => {
    try {
      await supplierService.createSupplier(supplierData);
      alert("Thêm nhà cung cấp thành công");
      fetchSuppliers();
    } catch (error) {
      console.error("Error adding supplier:", error);
      alert(error.response?.data?.message || "Không thể thêm nhà cung cấp");
      throw error;
    }
  };

  const handleEditSupplier = async (id, supplierData) => {
    try {
      await supplierService.updateSupplier(id, supplierData);
      alert("Cập nhật nhà cung cấp thành công");
      fetchSuppliers();
    } catch (error) {
      console.error("Error updating supplier:", error);
      alert(error.response?.data?.message || "Không thể cập nhật nhà cung cấp");
      throw error;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 space-y-6">
          <SuppliersHeader
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onAddSupplier={handleAddSupplier}
            filterStatus={filters.status}
          />
          <SuppliersTable
            suppliers={suppliers}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) =>
              setPagination((prev) => ({ ...prev, page }))
            }
            onLimitChange={handleLimitChange}
            onEditSupplier={handleEditSupplier}
          />
        </main>
      </div>
    </div>
  );
}
