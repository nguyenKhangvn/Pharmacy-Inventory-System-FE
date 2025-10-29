import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function EditSupplierDialog({ supplier, open, onOpenChange }) {
  const [formData, setFormData] = useState(supplier);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(supplier);
  }, [supplier]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "MSG 1: Tên nhà cung cấp không được để trống";
    }

    if (!formData.taxId.trim()) {
      newErrors.taxId = "MSG 2: Mã số thuế không được để trống";
    } else if (!/^\d{10,13}$/.test(formData.taxId)) {
      newErrors.taxId = "MSG 3: Mã số thuế phải có 10-13 chữ số";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "MSG 4: Số điện thoại không được để trống";
    } else if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.phone)) {
      newErrors.phone = "MSG 8: Số điện thoại sai định dạng (VD: 0901234567)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "MSG 5: Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "MSG 7: Email sai định dạng";
    }

    if (!formData.address.trim()) {
      newErrors.address = "MSG 6: Địa chỉ không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Cập nhật nhà cung cấp:", formData);
      onOpenChange(false);
    }
  };

  const handleBlur = (field) => {
    const newErrors = { ...errors };

    if (field === "name" && !formData.name.trim()) {
      newErrors.name = "MSG 1: Tên nhà cung cấp không được để trống";
    } else if (field === "name") {
      delete newErrors.name;
    }

    if (field === "taxId") {
      if (!formData.taxId.trim()) {
        newErrors.taxId = "MSG 2: Mã số thuế không được để trống";
      } else if (!/^\d{10,13}$/.test(formData.taxId)) {
        newErrors.taxId = "MSG 3: Mã số thuế phải có 10-13 chữ số";
      } else {
        delete newErrors.taxId;
      }
    }

    if (field === "phone") {
      if (!formData.phone.trim()) {
        newErrors.phone = "MSG 4: Số điện thoại không được để trống";
      } else if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.phone)) {
        newErrors.phone = "MSG 8: Số điện thoại sai định dạng (VD: 0901234567)";
      } else {
        delete newErrors.phone;
      }
    }

    if (field === "email") {
      if (!formData.email.trim()) {
        newErrors.email = "MSG 5: Email không được để trống";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "MSG 7: Email sai định dạng";
      } else {
        delete newErrors.email;
      }
    }

    if (field === "address" && !formData.address.trim()) {
      newErrors.address = "MSG 6: Địa chỉ không được để trống";
    } else if (field === "address") {
      delete newErrors.address;
    }

    setErrors(newErrors);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Chỉnh sửa thông tin nhà cung cấp
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã nhà cung cấp</Label>
              <Input
                id="code"
                value={formData.code}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Trạng thái <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang hợp tác</SelectItem>
                  <SelectItem value="inactive">Ngừng hợp tác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Tên nhà cung cấp <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              onBlur={() => handleBlur("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {errors.name}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxId">
                Mã số thuế <span className="text-destructive">*</span>
              </Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) =>
                  setFormData({ ...formData, taxId: e.target.value })
                }
                onBlur={() => handleBlur("taxId")}
                className={errors.taxId ? "border-destructive" : ""}
              />
              {errors.taxId && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {errors.taxId}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Người liên hệ</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) =>
                  setFormData({ ...formData, contactPerson: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">
                Số điện thoại <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                onBlur={() => handleBlur("phone")}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {errors.phone}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onBlur={() => handleBlur("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {errors.email}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              Địa chỉ <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              onBlur={() => handleBlur("address")}
              className={errors.address ? "border-destructive" : ""}
              rows={3}
            />
            {errors.address && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {errors.address}
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-medical-blue hover:bg-medical-blue/90"
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
