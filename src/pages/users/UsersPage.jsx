import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { userService } from "@/services/userService";
import { AddUserDialog } from "@/components/users/dialog/AddUserDialog";
import { EditUserDialog } from "@/components/users/dialog/EditUserDialog";

export default function UsersPage() {
  const [actionLoading, setActionLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    q: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    status: "",
    role: "",
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      Object.keys(params).forEach((key) => {
        if (params[key] === "") delete params[key];
      });

      const response = await userService.getUsers(params);
      if (response.success) {
        setUsers(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, filters]);

  const handleSearch = (searchQuery) => {
    setFilters((prev) => ({ ...prev, q: searchQuery }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilter = (filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleAddUser = async (userData) => {
    setActionLoading(true);
    try {
      const response = await userService.createUser(userData);
      if (response.success) {
        alert("Thêm người dùng thành công!");
        setIsAddDialogOpen(false);
        fetchUsers();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Thêm người dùng thất bại";
      alert(message);
      throw error; // Quan trọng: throw error để dialog có thể xử lý
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditUser = async (id, userData) => {
    setActionLoading(true);
    try {
      const response = await userService.updateUser(id, userData);
      if (response.success) {
        alert("Cập nhật người dùng thành công!");
        setIsEditDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Cập nhật người dùng thất bại";
      alert(message);
      throw error; // Quan trọng: throw error để dialog có thể xử lý
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await userService.updateUserStatus(id, status);
      if (response.success) {
        alert("Cập nhật trạng thái thành công!");
        fetchUsers();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Cập nhật trạng thái thất bại";
      alert(message);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 space-y-6">
          <UsersHeader
            onSearch={handleSearch}
            onAddClick={() => setIsAddDialogOpen(true)}
            onFilterChange={handleFilter}
            filters={filters}
          />
          <UsersTable
            users={users}
            loading={loading}
            onEdit={(user) => {
              setSelectedUser(user);
              setIsEditDialogOpen(true);
            }}
            onStatusChange={handleStatusChange}
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </main>
      </div>

      <AddUserDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddUser}
        loading={actionLoading}
      />

      {selectedUser && (
        <EditUserDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={handleEditUser}
          user={selectedUser}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
