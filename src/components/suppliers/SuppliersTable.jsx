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
import { MoreVertical, Edit, Trash2, Phone, Mail, MapPin } from "lucide-react";
import { EditSupplierDialog } from "./dialog/EditSupplierDialog";
import { DeleteSupplierDialog } from "./dialog/DeleteSupplierDialog";

const suppliers = [
  {
    id: "1",
    code: "NCC001",
    name: "Công ty TNHH Dược phẩm Việt Nam",
    taxId: "0123456789",
    contactPerson: "Nguyễn Văn A",
    phone: "0901234567",
    email: "contact@duocphamvn.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    status: "active",
    totalOrders: 156,
    lastOrder: "05/01/2025",
  },
  {
    id: "2",
    code: "NCC002",
    name: "Công ty CP Dược Hậu Giang",
    taxId: "0234567890",
    contactPerson: "Trần Thị B",
    phone: "0912345678",
    email: "sales@dhg.com.vn",
    address: "456 Đường XYZ, Quận 3, TP.HCM",
    status: "active",
    totalOrders: 203,
    lastOrder: "08/01/2025",
  },
  {
    id: "3",
    code: "NCC003",
    name: "Công ty TNHH Thiết bị Y tế Medico",
    taxId: "0345678901",
    contactPerson: "Lê Văn C",
    phone: "0923456789",
    email: "info@medico.vn",
    address: "789 Đường DEF, Quận 5, TP.HCM",
    status: "active",
    totalOrders: 89,
    lastOrder: "10/01/2025",
  },
  {
    id: "4",
    code: "NCC004",
    name: "Công ty CP Dược phẩm Traphaco",
    taxId: "0456789012",
    contactPerson: "Phạm Thị D",
    phone: "0934567890",
    email: "contact@traphaco.com.vn",
    address: "321 Đường GHI, Quận 10, TP.HCM",
    status: "inactive",
    totalOrders: 45,
    lastOrder: "15/12/2024",
  },
];

export function SuppliersTable() {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Mã NCC</TableHead>
              <TableHead className="font-semibold">Tên nhà cung cấp</TableHead>
              <TableHead className="font-semibold">Mã số thuế</TableHead>
              <TableHead className="font-semibold">Người liên hệ</TableHead>
              <TableHead className="font-semibold">Liên hệ</TableHead>
              <TableHead className="font-semibold">Đơn hàng</TableHead>
              <TableHead className="font-semibold">Trạng thái</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium text-medical-blue">
                  {supplier.code}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{supplier.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {supplier.address}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {supplier.taxId}
                </TableCell>
                <TableCell>{supplier.contactPerson}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      {supplier.phone}
                    </div>
                    <div className="text-sm flex items-center gap-1 text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {supplier.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {supplier.totalOrders} đơn
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Gần nhất: {supplier.lastOrder}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {supplier.status === "active" ? (
                    <Badge className="bg-calm-green/10 text-calm-green hover:bg-calm-green/20 border-calm-green/20">
                      Đang hợp tác
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-muted-foreground"
                    >
                      Ngừng hợp tác
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(supplier)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(supplier)}
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

      {selectedSupplier && (
        <>
          <EditSupplierDialog
            supplier={selectedSupplier}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
          />
          <DeleteSupplierDialog
            supplier={selectedSupplier}
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          />
        </>
      )}
    </>
  );
}
