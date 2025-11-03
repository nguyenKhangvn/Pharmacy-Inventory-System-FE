import { Route, Routes } from "react-router-dom";
import Login from "../pages/login/login";
import NotFound from "../pages/notFound/NotFound";
import UsersPage from "@/pages/users/UsersPage";
import CategoriesPage from "@/pages/categories/CategoriesPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
