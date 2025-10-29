import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

export function DeleteSupplierDialog({ supplier, open, onOpenChange }) {
  const handleDelete = () => {
    console.log("Xóa nhà cung cấp:", supplier.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                Xác nhận xóa nhà cung cấp
              </DialogTitle>
              <DialogDescription className="mt-1">
                Hành động này không thể hoàn tác
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground">
            Bạn có chắc chắn muốn xóa nhà cung cấp{" "}
            <span className="font-semibold text-foreground">
              {supplier.name}
            </span>{" "}
            (Mã: {supplier.code})?
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Tất cả thông tin liên quan đến nhà cung cấp này sẽ bị xóa vĩnh viễn
            khỏi hệ thống.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Xóa nhà cung cấp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
