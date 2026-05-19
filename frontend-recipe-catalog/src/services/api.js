import axios from "axios";

const API_URL = "http://localhost:8080/api";

// =====================================================
// Axios Instance với interceptor tự động gắn JWT token
// =====================================================
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: tự động gắn token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: tự động xử lý lỗi 401 (token hết hạn)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn -> đăng xuất
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// =====================================================
// AUTH API
// =====================================================
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
  refreshToken: () => api.post("/auth/refresh"),
  logout: () => api.post("/auth/logout"),
};

// =====================================================
// RECIPE API
// =====================================================
export const recipeAPI = {
  // Lấy danh sách có phân trang + tìm kiếm
  getAll: (params = {}) =>
    api.get("/recipes", { params }),

  // Lấy toàn bộ (cho dashboard)
  getAllNoPagination: () => api.get("/recipes/all"),

  // Lấy chi tiết
  getById: (id) => api.get(`/recipes/${id}`),

  // Tạo mới
  create: (data) => api.post("/recipes", data),

  // Cập nhật
  update: (id, data) => api.put(`/recipes/${id}`, data),

  // Xóa
  delete: (id) => api.delete(`/recipes/${id}`),
};

// =====================================================
// CATEGORY API
// =====================================================
export const categoryAPI = {
  getAll: () => api.get("/categories"),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// =====================================================
// COMMENT API
// =====================================================
export const commentAPI = {
  getByRecipe: (recipeId) => api.get(`/comments/recipe/${recipeId}`),
  create: (data) => api.post("/comments", data),
  delete: (id) => api.delete(`/comments/${id}`),
};

// =====================================================
// FAVORITE API
// =====================================================
export const favoriteAPI = {
  getMyFavorites: () => api.get("/favorites"),
  toggle: (recipeId) => api.post(`/favorites/${recipeId}`),
  check: (recipeId) => api.get(`/favorites/check/${recipeId}`),
};

export default api;
