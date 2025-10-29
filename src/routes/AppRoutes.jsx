import { Route, Routes } from "react-router-dom";
import Login from "../pages/login/login";
import NotFound from "../pages/notFound/NotFound";
import UsersPage from "@/pages/users/UsersPage";
import CategoriesPage from "@/pages/categories/CategoriesPage";
import SuppliersPage from "@/pages/suppliers/SuppliersPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ImportPage from "@/pages/import/ImportPage";
import ExportPage from "@/pages/export/ExportPage";
import HistoryPage from "@/pages/history/HistoryPage";
import AlertsPage from "@/pages/alerts/AlertsPage";
import ReportsPage from "@/pages/reports/ReportsPage";
import InventoryPage from "@/pages/inventory/InventoryPages";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/suppliers" element={<SuppliersPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/import" element={<ImportPage />} />
      <Route path="/export" element={<ExportPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
