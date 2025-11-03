import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

export function DeleteCategoryDialog({
  category,
  open,
  onOpenChange,
  onConfirm,
  loading,
}) {
  const handleDelete = async () => {
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      // Error đã được xử lý trong parent
      console.error("Error in dialog:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-black flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Xóa danh mục thuốc
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa danh mục{" "}
            <span className="font-semibold text-foreground">
              "{category?.name}"
            </span>
            ? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
