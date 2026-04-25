import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor — route-based token selection (SINGLE interceptor only)
API.interceptors.request.use((config) => {
  const isAdminCall =
    config.url?.includes('/analytics/') ||
    config.url?.includes('/cars/create') ||
    config.url?.includes('/update/') ||
    config.url?.includes('/delete/') ||
    config.url?.includes('/mark-sold/') ||
    config.url?.includes('/admin-login/');

  const adminToken = localStorage.getItem('adminToken');
  const userToken = localStorage.getItem('token');

  // Admin routes → admin token | User routes → user token
  const token = isAdminCall ? adminToken : userToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response interceptor — 401 handle
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      if (isAdminRoute) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefresh');
        window.location.href = '/admin';
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ✅ Auth APIs
export const authAPI = {
  login: (data) => API.post('/users/login/', data),
  logout: () => API.post('/users/logout/'),
  getProfile: () => API.get('/users/profile/'),
  adminLogin: (data) => API.post('/users/admin-login/', data),
};

// ✅ Cars APIs
export const carsAPI = {
  getAll: (params) => API.get('/cars/', { params }),
  getById: (id) => API.get(`/cars/${id}/`),
  create: (data) => API.post('/cars/create/', data),
  update: (id, data) => API.patch(`/cars/${id}/update/`, data),
  delete: (id) => API.delete(`/cars/${id}/delete/`),
  markSold: (id) => API.patch(`/cars/${id}/mark-sold/`, {}),
};

// ✅ Favourites APIs
export const favouritesAPI = {
  getAll: () => API.get('/favourites/'),
  toggle: (carId) => API.post('/favourites/toggle/', { car_id: carId }),
};

// ✅ Admin APIs
export const adminAPI = {
  createCar: (data) => API.post('/cars/create/', data),
  updateCar: (id, data) => API.patch(`/cars/${id}/update/`, data),
  deleteCar: (id) => API.delete(`/cars/${id}/delete/`),
  markSold: (id) => API.patch(`/cars/${id}/mark-sold/`, {}),
  getUsers: () => API.get('/analytics/users/'),
  getAnalytics: () => API.get('/analytics/'),
  toggleContacted: (userId) => API.patch(`/users/toggle-contacted/${userId}/`),
  getUserFavourites: (userId) => API.get(`/analytics/user-favourites/${userId}/`),
};

export default API;