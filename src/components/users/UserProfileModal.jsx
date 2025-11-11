import { useState } from "react";
import { LogOut, X, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UserProfileModal({ isOpen, onClose, onLogout }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      onLogout();
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

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
              <span className="text-xl font-semibold text-white">DS</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                Dược sĩ Nguyễn Văn A
              </p>
              <p className="text-sm text-calm-green font-medium">
                Đang hoạt động
              </p>
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Briefcase className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Chức vụ
                </p>
                <p className="text-sm font-medium text-foreground">Dược sĩ</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Phòng ban
                </p>
                <p className="text-sm font-medium text-foreground">Khoa Dược</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-medical-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm font-medium text-foreground">
                  nguyen.van.a@hospital.vn
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
                  0912 345 678
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
            className="w-full bg-danger hover:bg-danger/90 text-white flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
