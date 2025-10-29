import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditCategoryDialog } from "./dialog/EditCategoryDialog";
import { DeleteCategoryDialog } from "./dialog/DeleteCategoryDialog";

const categoriesData = [
  {
    id: "CAT001",
    name: "Giảm đau",
    description: "Các loại thuốc giảm đau và hạ sốt",
    drugCount: 12,
    createdDate: "2024-01-15",
  },
  {
    id: "CAT002",
    name: "Kháng sinh",
    description: "Các loại kháng sinh điều trị nhiễm khuẩn",
    drugCount: 28,
    createdDate: "2024-01-10",
  },
  {
    id: "CAT003",
    name: "Vitamin",
    description: "Các loại vitamin và chất bổ sung",
    drugCount: 15,
    createdDate: "2024-01-20",
  },
  {
    id: "CAT004",
    name: "Kháng đông máu",
    description: "Thuốc chống đông máu và chống cục máu",
    drugCount: 8,
    createdDate: "2024-02-01",
  },
  {
    id: "CAT005",
    name: "Kháng viêm",
    description: "Các loại thuốc kháng viêm không steroid",
    drugCount: 10,
    createdDate: "2024-02-05",
  },
];

export function CategoriesTable() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
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
                {categoriesData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`border-b border-border ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm text-medical-blue font-medium">
                        {item.id}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">{item.name}</p>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {item.description}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {item.drugCount}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {item.createdDate}
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
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Hiển thị <span className="font-medium text-foreground">1-5</span>{" "}
              trong tổng số{" "}
              <span className="font-medium text-foreground">5</span> danh mục
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                Trước
              </Button>
              <div className="flex items-center space-x-1">
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 w-8 bg-medical-blue hover:bg-medical-blue/90"
                >
                  1
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-transparent"
              >
                Sau
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedCategory && (
        <>
          <EditCategoryDialog
            category={selectedCategory}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
          <DeleteCategoryDialog
            category={selectedCategory}
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          />
        </>
      )}
    </>
  );
}
