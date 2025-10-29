import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Lock, Unlock } from "lucide-react";
import { EditUserDialog } from "./dialog/EditUserDialog";
import { DeleteUserDialog } from "./dialog/DeleteUserDialog";

const users = [
  {
    id: "1",
    username: "admin",
    fullName: "Nguyễn Văn A",
    email: "admin@pharmacare.vn",
    phone: "0901234567",
    role: "Quản trị viên",
    status: "active",
    lastLogin: "10/01/2025 14:30",
  },
  {
    id: "2",
    username: "duocsi01",
    fullName: "Trần Thị B",
    email: "duocsi01@pharmacare.vn",
    phone: "0912345678",
    role: "Dược sĩ",
    status: "active",
    lastLogin: "10/01/2025 09:15",
  },
  {
    id: "3",
    username: "ketoan01",
    fullName: "Lê Văn C",
    email: "ketoan01@pharmacare.vn",
    phone: "0923456789",
    role: "Kế toán",
    status: "active",
    lastLogin: "09/01/2025 16:45",
  },
  {
    id: "4",
    username: "duocsi02",
    fullName: "Phạm Thị D",
    email: "duocsi02@pharmacare.vn",
    phone: "0934567890",
    role: "Dược sĩ",
    status: "inactive",
    lastLogin: "05/01/2025 11:20",
  },
];

export function UsersTable() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Tên đăng nhập</TableHead>
              <TableHead className="font-semibold">Họ và tên</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Số điện thoại</TableHead>
              <TableHead className="font-semibold">Vai trò</TableHead>
              <TableHead className="font-semibold">Trạng thái</TableHead>
              <TableHead className="font-semibold">Đăng nhập cuối</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.phone}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.status === "active" ? (
                    <Badge className="bg-calm-green/10 text-calm-green hover:bg-calm-green/20 border-calm-green/20">
                      <Unlock className="w-3 h-3 mr-1" />
                      Hoạt động
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-muted-foreground"
                    >
                      <Lock className="w-3 h-3 mr-1" />
                      Khóa
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {user.lastLogin}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(user)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(user)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <>
          <EditUserDialog
            user={selectedUser}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
          <DeleteUserDialog
            user={selectedUser}
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          />
        </>
      )}
    </>
  );
}
