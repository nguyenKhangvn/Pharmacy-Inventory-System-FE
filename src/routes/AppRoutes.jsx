import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/login/login";
import RegisterPage from "@/pages/register/RegisterPage";
import NotFound from "../pages/notFound/NotFound";
import UsersPage from "@/pages/users/UsersPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/categories" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/users"
        element={
          <ProtectedRoute requireAdmin={true}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
