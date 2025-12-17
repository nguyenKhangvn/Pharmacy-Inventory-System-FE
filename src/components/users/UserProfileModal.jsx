import { useState, useEffect } from "react";
import { LogOut, X, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/userService";

export function UserProfileModal({ isOpen, onClose, onLogout, user }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userDetail, setUserDetail] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (user?.id && isOpen) {
        setLoading(true);
        try {
          const data = await userService.getUserById(user.id);
          setUserDetail(data.data);
        } catch (err) {
          setUserDetail(user); // fallback
        } finally {
          setLoading(false);
        }
      } else {
        setUserDetail(user);
      }
    };
    fetchUserDetail();
  }, [user?.id, isOpen]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      onLogout();
      onClose();
    }, 500);
  };

  // Nếu user chưa có, có thể fetch từ API ở component cha và truyền vào
  // Hoặc thêm useEffect để fetch tại đây nếu cần

  if (!isOpen) return null;
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4 p-8 flex flex-col items-center">
          <span className="text-lg font-semibold text-foreground mb-4">
            Đang tải thông tin người dùng...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Thông tin cá nhân
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Avatar and Name */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-medical-blue rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-semibold text-white">
                {userDetail?.fullName
                  ? userDetail.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </span>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {userDetail?.fullName || "Chưa có tên"}
              </p>
              <p className="text-sm text-calm-green font-medium">
                {userDetail?.status === "active" ? "Đang hoạt động" : "Đã khóa"}
              </p>
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Tên đăng nhập
                </p>
                <p className="text-sm font-medium text-foreground">
                  {userDetail?.username || "Chưa có username"}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Briefcase className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Chức vụ
                </p>
                <p className="text-sm font-medium text-foreground">
                  {userDetail?.role === "admin"
                    ? "Quản trị viên"
                    : "Người dùng"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm font-medium text-foreground">
                  {userDetail?.email || "Chưa có email"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Số điện thoại
                </p>
                <p className="text-sm font-medium text-foreground">
                  {userDetail?.phone || "Chưa có số điện thoại"}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Lần đăng nhập cuối
                </p>
                <p className="text-sm font-medium text-foreground">
                  {userDetail?.lastLogin
                    ? new Date(userDetail.lastLogin).toLocaleString()
                    : "Chưa có"}
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Ngày tạo tài khoản
                </p>
                <p className="text-sm font-medium text-foreground">
                  {userDetail?.createdAt
                    ? new Date(userDetail.createdAt).toLocaleString()
                    : "Chưa có"}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-danger hover:bg-danger/90 flex items-center justify-center space-x-2 text-black"
          >
            <LogOut className="w-4 h-4 text-black" />
            <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
