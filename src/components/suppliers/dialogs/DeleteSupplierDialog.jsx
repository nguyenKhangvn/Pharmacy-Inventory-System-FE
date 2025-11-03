import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function DeleteSupplierDialog({
  open,
  onOpenChange,
  onConfirm,
  supplier,
  loading,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa nhà cung cấp</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Hành động này không thể hoàn tác. Dữ liệu nhà cung cấp sẽ bị xóa
              vĩnh viễn.
            </AlertDescription>
          </Alert>

          {supplier && (
            <div className="space-y-2 p-4 bg-muted rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="font-medium">Mã NCC:</span>
                <span>{supplier.code}</span>

                <span className="font-medium">Tên:</span>
                <span>{supplier.name}</span>

                <span className="font-medium">Số đơn hàng:</span>
                <span>{supplier.orders?.count || 0} đơn</span>
              </div>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            Bạn có chắc chắn muốn xóa nhà cung cấp{" "}
            <span className="font-semibold">{supplier?.name}</span>?
          </p>

          <div className="flex justify-end space-x-2 pt-4">
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
              variant="destructive"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Đang xóa..." : "Xóa"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
