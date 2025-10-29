import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { AddUserDialog } from "./dialog/AddUserDialog";

export function UsersHeader() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Quản lý người dùng
            </h1>
            <p className="text-muted-foreground mt-1">
              Quản lý tài khoản và phân quyền người dùng trong hệ thống
            </p>
          </div>
          <Button
            className="gap-2 bg-medical-blue hover:bg-medical-blue/90 text-black shadow-sm"
            onClick={() => setIsAddDialogOpen(true)}
            size="default"
          >
            <UserPlus className="w-4 h-4" />
            <span className="font-medium">Thêm người dùng</span>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              className="pl-10 bg-background"
            />
          </div>
        </div>
      </div>

      <AddUserDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </>
  );
}
