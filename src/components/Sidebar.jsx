import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/", current: false },
  { name: "Danh mục thuốc", href: "/inventory", current: false },
  { name: "Quản lý danh mục", href: "/categories", current: false },
  { name: "Nhập kho", href: "/import", current: false },
  { name: "Xuất kho", href: "/export", current: false },
  { name: "Lịch sử nhập/xuất", href: "/history", current: false },
  { name: "Cảnh báo tồn kho", href: "/alerts", current: false },
  { name: "Báo cáo", href: "/reports", current: false },
  { name: "Quản lý người dùng", href: "/users", current: false },
  {
    name: "Quản lý nhà cung cấp",
    href: "/suppliers",
    current: false,
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              PharmaCare
            </h2>
            <p className="text-sm text-muted-foreground">Quản lý kho dược</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              location.pathname === item.href
                ? "bg-medical-blue-light text-medical-blue"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">
              DS
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              Dược sĩ Nguyễn Văn A
            </p>
            <p className="text-xs text-muted-foreground truncate">Khoa Dược</p>
          </div>
        </div>
      </div>
    </div>
  );
}
