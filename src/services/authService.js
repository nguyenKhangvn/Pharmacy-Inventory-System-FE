import api from "./api";

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (err) {
      if (err.response?.status === 401) {
        throw new Error("Tên đăng nhập hoặc mật khẩu không chính xác");
      }
      throw err;
    }
  },

  async register(userData) {
    const response = await api.post("/auth/register", userData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  },

  isAdmin() {
    return this.hasRole("admin");
  },
};
