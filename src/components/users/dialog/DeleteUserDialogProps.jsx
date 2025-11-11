import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function DeleteUserDialog({ user, open, onOpenChange }) {
  const handleDelete = () => {
    console.log(" Deleting user:", user.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa người dùng này khỏi hệ thống?
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold">Thông tin người dùng sẽ bị xóa:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Tên đăng nhập: {user.username}</li>
                <li>Họ và tên: {user.fullName}</li>
              </ul>
              <p className="text-sm mt-2">Hành động này không thể hoàn tác!</p>
            </div>
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Xóa người dùng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
