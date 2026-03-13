import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (data) => api.post('/api/auth/register', data),
  me: () => api.get('/api/auth/me'),
};

// Bodegas
export const bodegasAPI = {
  list: () => api.get('/api/bodegas/'),
  get: (id) => api.get(`/api/bodegas/${id}`),
  create: (data) => api.post('/api/bodegas/', data),
  update: (id, data) => api.put(`/api/bodegas/${id}`, data),
  delete: (id) => api.delete(`/api/bodegas/${id}`),
};

// Productos
export const productosAPI = {
  list: (search) => api.get('/api/productos/', { params: search ? { search } : {} }),
  get: (id) => api.get(`/api/productos/${id}`),
  create: (data) => api.post('/api/productos/', data),
  update: (id, data) => api.put(`/api/productos/${id}`, data),
  delete: (id) => api.delete(`/api/productos/${id}`),
};

// Inventario
export const inventarioAPI = {
  list: (params) => api.get('/api/inventario/', { params }),
  get: (id) => api.get(`/api/inventario/${id}`),
  create: (data) => api.post('/api/inventario/', data),
  update: (id, data) => api.put(`/api/inventario/${id}`, data),
  ajustar: (data) => api.post('/api/inventario/ajustar', data),
  movimientos: (inventario_id) => api.get('/api/inventario/movimientos/lista', { params: inventario_id ? { inventario_id } : {} }),
};

// Picking
export const pickingAPI = {
  list: (params) => api.get('/api/picking/', { params }),
  get: (id) => api.get(`/api/picking/${id}`),
  create: (data) => api.post('/api/picking/', data),
  update: (id, data) => api.put(`/api/picking/${id}`, data),
  updateItem: (orderId, itemId, data) => api.put(`/api/picking/${orderId}/items/${itemId}`, data),
  stats: () => api.get('/api/picking/stats/resumen'),
};

export default api;
