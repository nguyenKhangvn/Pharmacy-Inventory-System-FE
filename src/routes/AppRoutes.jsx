import { Route, Routes } from "react-router-dom";
import Login from "../pages/login/login";
import NotFound from "../pages/notFound/NotFound";
import UsersPage from "@/pages/users/UsersPage";
import CategoriesPage from "@/pages/categories/CategoriesPage";
import SuppliersPage from "@/pages/suppliers/SuppliersPage";
import ImportPage from "@/pages/import/ImportPage";
import ExportPage from "@/pages/export/ExportPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/suppliers" element={<SuppliersPage />} />

      <Route path="/import" element={<ImportPage />} />

      <Route path="/export" element={<ExportPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
