import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
  loading,
  pagination,
  onPageChange,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">Đang tải danh mục...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">
                  Mã danh mục
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Tên danh mục
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Mô tả
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Số loại thuốc
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Ngày tạo
                </th>
                <th className="text-left p-4 font-medium text-foreground">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-muted-foreground"
                  >
                    Không có danh mục nào
                  </td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <tr
                    key={category._id}
                    className={`border-b border-border ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm text-medical-blue font-medium">
                        {category._id?.substring(0, 8).toUpperCase() || "N/A"}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">
                        {category.name}
                      </p>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {category.description}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {category.drugCount || 0}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {formatDate(category.createdAt)}
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(category)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(category)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {categories.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Hiển thị{" "}
              <span className="font-medium text-foreground">
                1-{categories.length}
              </span>{" "}
              trong tổng số{" "}
              <span className="font-medium text-foreground">
                {pagination.total}
              </span>{" "}
              danh mục
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-transparent"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {pagination.page} / {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-transparent"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
