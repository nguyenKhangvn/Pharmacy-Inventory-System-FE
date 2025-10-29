import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function EditUserDialog({ user, open, onOpenChange }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    status: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      });
    }
  }, [user]);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "Email không được để trống";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "MSG 7: Email sai định dạng";
        }
        break;
      case "phone":
        if (!value.trim()) {
          error = "Số điện thoại không được để trống";
        } else if (!/^(0|\+84)[0-9]{9,10}$/.test(value.replace(/\s/g, ""))) {
          error = "MSG 8: Số điện thoại sai định dạng";
        }
        break;
    }

    return error;
  };

  const handleBlur = (name) => {
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, formData[name]);
    setErrors({ ...errors, [name]: error });
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(
        Object.keys(formData).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        )
      );
      return;
    }

    // Submit form
    console.log(" Form submitted:", formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cho tài khoản:{" "}
            <span className="font-semibold">{user?.username}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fullName">
                Họ và tên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-fullName"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="example@pharmacare.vn"
                className={
                  errors.email && touched.email ? "border-destructive" : ""
                }
              />
              {errors.email && touched.email && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {errors.email}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">
                Số điện thoại <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="0901234567"
                className={
                  errors.phone && touched.phone ? "border-destructive" : ""
                }
              />
              {errors.phone && touched.phone && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {errors.phone}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">
                Vai trò <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quản trị viên">Quản trị viên</SelectItem>
                  <SelectItem value="Dược sĩ">Dược sĩ</SelectItem>
                  <SelectItem value="Kế toán">Kế toán</SelectItem>
                  <SelectItem value="Thủ kho">Thủ kho</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-status">
                Trạng thái <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
