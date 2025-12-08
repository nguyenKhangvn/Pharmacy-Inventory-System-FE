import { useState, useEffect } from "react";
import { Bell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserProfileModal } from "./users/UserProfileModal";
import { useAuth } from "@/context/AuthContext";
import { getAlertsList } from "@/services/alertService";

export function Header() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch alerts khi component mount
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await getAlertsList({
        page: 1,
        limit: 10,
        status: "ACTIVE", // Chỉ lấy alerts active
        sortBy: "createdAt",
        order: "desc",
      });

      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.fullName) {
      const names = user.fullName.split(" ");
      return names.length > 1
        ? names[0][0] + names[names.length - 1][0]
        : names[0][0];
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  // Helper để format thời gian
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now - past) / 60000);

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  // Helper để lấy màu badge theo severity
  const getSeverityColor = (severity) => {
    const colors = {
      CRITICAL: "bg-red-500",
      HIGH: "bg-orange-500",
      MEDIUM: "bg-yellow-500",
      LOW: "bg-blue-500",
    };
    return colors[severity] || "bg-gray-500";
  };

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
              {notifications.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notifications.length}
                </Badge>
              )}
            </Button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-border sticky top-0 bg-card">
                  <h3 className="font-semibold text-foreground">
                    Thông báo cảnh báo
                  </h3>
                </div>
                <div className="divide-y divide-border">
                  {loading ? (
                    <div className="p-8 text-center text-muted-foreground">
                      Đang tải...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      Không có cảnh báo mới
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 hover:bg-muted transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 ${getSeverityColor(
                              notif.severity
                            )}`}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {notif.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {notif.product?.name} - {notif.warehouse?.name}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {getTimeAgo(notif.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
              <span className="text-sm font-medium text-white">
                {getUserInitials()}
              </span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-medical-blue rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {getUserInitials()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {user?.fullName || user?.username || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user?.role === "admin"
                          ? "Quản trị viên"
                          : "Người dùng"}
                      </p>
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
