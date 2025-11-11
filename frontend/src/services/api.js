import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMe: () => api.get('/auth/me'),
};

// Admin API
export const adminAPI = {
  // Questions
  addQuestion: (data) => api.post('/admin/questions/add', data),
  getAllQuestions: (params) => api.get('/admin/questions/get_all', { params }),
  updateQuestion: (id, data) => api.put(`/admin/questions/update/${id}`, data),
  deleteQuestion: (id) => api.delete(`/admin/questions/delete/${id}`),
  bulkUpload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/admin/questions/bulk_upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  exportPDF: (category) => 
    api.get('/admin/questions/export_pdf', {
      params: category ? { category } : {},
      responseType: 'blob',
    }),
  getCategories: () => api.get('/admin/questions/categories'),
};

// User API
export const userAPI = {
  getQuestions: (params) => api.get('/user/questions', { params }),
  getCategories: () => api.get('/user/categories'),
  addBookmark: (questionId) => api.post('/user/bookmarks/add', { question_id: questionId }),
  removeBookmark: (questionId) => api.delete(`/user/bookmarks/remove/${questionId}`),
  getBookmarks: () => api.get('/user/bookmarks'),
  checkBookmarkStatus: (questionId) => api.get(`/user/bookmarks/check/${questionId}`),
};

// Stats API (we can calculate from questions)
export const statsAPI = {
  getDashboardStats: async () => {
    try {
      const [questionsRes, categoriesRes] = await Promise.all([
        adminAPI.getAllQuestions(),
        adminAPI.getCategories(),
      ]);
      
      const questions = questionsRes.data;
      const categories = categoriesRes.data;
      
      // Calculate stats
      const difficultyCount = questions.reduce((acc, q) => {
        acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
        return acc;
      }, {});
      
      const categoryCount = questions.reduce((acc, q) => {
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
      }, {});
      
      return {
        totalQuestions: questions.length,
        totalCategories: categories.length,
        difficultyBreakdown: difficultyCount,
        categoryBreakdown: categoryCount,
        recentQuestions: questions.slice(-5).reverse(),
      };
    } catch (error) {
      throw error;
    }
  },
};

export default api;
