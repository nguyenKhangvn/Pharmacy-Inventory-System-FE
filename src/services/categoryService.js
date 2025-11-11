import api from './api';

export const categoryService = {
  getCategories: async (params = {}) => {
    const { page = 1, limit = 10, search = '', isActive } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) queryParams.append('search', search);
    if (isActive !== undefined) queryParams.append('isActive', isActive.toString());
    
    const response = await api.get(`/categories?${queryParams}`);
    return response.data;
  },

  getAllCategories: async (isActive) => {
    const params = isActive !== undefined ? `?isActive=${isActive}` : '';
    const response = await api.get(`/categories/non-pagination${params}`);
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
