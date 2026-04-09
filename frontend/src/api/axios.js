import axios from 'axios';
import { auth } from '../config/firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the Firebase token
api.interceptors.request.use(async (config) => {
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export const taskApi = {
  getAll: async () => {
    const res = await api.get('/tasks');
    return res.data;
  },
  getOne: async (id) => {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  },
  create: async (taskData) => {
    const res = await api.post('/tasks', taskData);
    return res.data;
  },
  update: async (id, updateData) => {
    const res = await api.put(`/tasks/${id}`, updateData);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },
};

export default api;
