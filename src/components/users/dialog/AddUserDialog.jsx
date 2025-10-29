import React, { useState } from "react";
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

export function AddUserDialog({ open, onOpenChange }) {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const existingUsernames = ["admin", "duocsi01", "ketoan01", "duocsi02"];

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "username":
        if (!value.trim()) {
          error = "MSG 5: Tên đăng nhập không được để trống";
        } else if (existingUsernames.includes(value.toLowerCase())) {
          error = "MSG 4: Tên đăng nhập đã tồn tại trong hệ thống";
        }
        break;
      case "password":
        if (!value) {
          error = "MSG 3: Mật khẩu không được để trống";
        } else if (value.length < 6) {
          error = "Mật khẩu phải có ít nhất 6 ký tự";
        }
        break;
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
      case "confirmPassword":
        if (value !== formData.password) {
          error = "Mật khẩu xác nhận không khớp";
        }
        break;
      default:
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

    console.log("Form submitted:", formData);
    onOpenChange(false);

    setFormData({
      username: "",
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "",
    });
    setErrors({});
    setTouched({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-black">Thêm người dùng mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin để tạo tài khoản người dùng mới trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-black font-medium">
                Tên đăng nhập <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                onBlur={() => handleBlur("username")}
                placeholder="Nhập tên đăng nhập"
                className={
                  errors.username && touched.username
                    ? "border-destructive"
                    : ""
                }
              />
              {errors.username && touched.username && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {errors.username}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Full name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-black font-medium">
                Họ và tên <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black font-medium">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
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

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-black font-medium">
                Số điện thoại <span className="text-destructive">*</span>
              </Label>
              <Input
                id="phone"
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

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-black font-medium">
                Mật khẩu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                placeholder="Nhập mật khẩu"
                className={
                  errors.password && touched.password
                    ? "border-destructive"
                    : ""
                }
              />
              {errors.password && touched.password && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {errors.password}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-black font-medium"
              >
                Xác nhận mật khẩu <span className="text-destructive">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="Nhập lại mật khẩu"
                className={
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-destructive"
                    : ""
                }
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {errors.confirmPassword}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="role" className="text-black font-medium">
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
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                  <SelectItem value="pharmacist">Dược sĩ</SelectItem>
                  <SelectItem value="accountant">Kế toán</SelectItem>
                  <SelectItem value="warehouse">Thủ kho</SelectItem>
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
              className="bg-medical-blue hover:bg-medical-blue/90 text-white font-medium"
            >
              Thêm người dùng
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
