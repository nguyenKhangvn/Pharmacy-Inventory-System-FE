import { useState } from "react";
import { Bell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserProfileModal } from "./users/UserProfileModal";

export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logging out...");
    // Add actual logout logic here
  };

  const notifications = [
    {
      id: 1,
      message: "Paracetamol 500mg sắp hết hạn",
      time: "5 phút trước",
      type: "expiry",
    },
    {
      id: 2,
      message: "Vitamin C 1000mg tồn kho thấp",
      time: "15 phút trước",
      type: "low-stock",
    },
    {
      id: 3,
      message: "Amoxicillin 250mg hết hàng",
      time: "1 giờ trước",
      type: "out-of-stock",
    },
    {
      id: 4,
      message: "Phiếu nhập từ DHG Pharma đã được duyệt",
      time: "2 giờ trước",
      type: "approved",
    },
    {
      id: 5,
      message: "Aspirin 100mg sắp hết hạn",
      time: "3 giờ trước",
      type: "expiry",
    },
    {
      id: 6,
      message: "Ibuprofen 400mg tồn kho thấp",
      time: "4 giờ trước",
      type: "low-stock",
    },
  ];

  return (
    <header className="bg-card border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1"></div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <Bell className="w-5 h-5" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                6
              </Badge>
            </Button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-border sticky top-0 bg-card">
                  <h3 className="font-semibold text-foreground">Thông báo</h3>
                </div>
                <div className="divide-y divide-border">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-3 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <p className="text-sm text-foreground">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notif.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Hôm nay</p>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 bg-medical-blue rounded-full flex items-center justify-center hover:bg-medical-blue/90 transition-colors cursor-pointer"
            >
              <span className="text-sm font-medium text-white">DS</span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-medical-blue rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">DS</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Dược sĩ Nguyễn Văn A
                      </p>
                      <p className="text-xs text-muted-foreground">Khoa Dược</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Thông tin cá nhân</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={handleLogout}
      />
    </header>
  );
}
