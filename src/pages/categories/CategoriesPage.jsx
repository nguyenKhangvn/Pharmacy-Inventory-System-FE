import { useState, useEffect } from "react";
import { CategoriesHeader } from "@/components/categories/CategoriesHeader";
import { CategoriesTable } from "@/components/categories/CategoriesTable";
import { AddCategoryDialog } from "@/components/categories/dialog/AddCategoryDialog";
import { EditCategoryDialog } from "@/components/categories/dialog/EditCategoryDialog";
import { DeleteCategoryDialog } from "@/components/categories/dialog/DeleteCategoryDialog";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { categoryService } from "@/services/categoryService";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [pagination.page, searchQuery]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
      });

      if (response.success) {
        setCategories(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert(
        error.response?.data?.message || "Không thể tải danh sách danh mục"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPagination({ ...pagination, page: 1 });
  };

  const handleAddCategory = async (data) => {
    try {
      setActionLoading(true);
      const response = await categoryService.createCategory(data);

      if (response.success) {
        alert("Tạo danh mục thành công!");
        setIsAddDialogOpen(false);
        fetchCategories();
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert(error.response?.data?.message || "Không thể tạo danh mục");
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCategory = async (data) => {
    try {
      setActionLoading(true);
      const response = await categoryService.updateCategory(
        selectedCategory._id,
        data
      );

      if (response.success) {
        alert("Cập nhật danh mục thành công!");
        setIsEditDialogOpen(false);
        setSelectedCategory(null);
        fetchCategories();
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert(error.response?.data?.message || "Không thể cập nhật danh mục");
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      setActionLoading(true);
      const response = await categoryService.deleteCategory(
        selectedCategory._id
      );

      if (response.success) {
        alert("Xóa danh mục thành công!");
        setIsDeleteDialogOpen(false);
        setSelectedCategory(null);
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(error.response?.data?.message || "Không thể xóa danh mục");
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 space-y-6">
          <CategoriesHeader
            onAddClick={() => setIsAddDialogOpen(true)}
            onSearch={handleSearch}
          />

          <CategoriesTable
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
          />

          <AddCategoryDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSubmit={handleAddCategory}
            loading={actionLoading}
          />

          <EditCategoryDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            category={selectedCategory}
            onSubmit={handleEditCategory}
            loading={actionLoading}
          />

          <DeleteCategoryDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            category={selectedCategory}
            onConfirm={handleDeleteCategory}
            loading={actionLoading}
          />
        </main>
      </div>
    </div>
  );
}
