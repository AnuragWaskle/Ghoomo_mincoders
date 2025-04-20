import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Set auth token for API requests
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

// Clear auth token
const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('authToken');
};

// Auth API calls
const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, name) => api.post('/auth/register', { email, password, name }),
  getCurrentUser: () => api.get('/auth/me')
};

// Quiz API calls
const quiz = {
  getQuestions: () => api.get('/quiz/questions'),
  submitResponses: (responses) => api.post('/quiz/submit', { responses }),
  getUserPersona: () => api.get('/quiz/persona')
};

// Itinerary API calls
const itineraries = {
  generate: (data) => api.post('/itineraries', data),
  getUserItineraries: () => api.get('/itineraries'),
  getItinerary: (id) => api.get(`/itineraries/${id}`),
  updateItinerary: (id, data) => api.put(`/itineraries/${id}`, data),
  deleteItinerary: (id) => api.delete(`/itineraries/${id}`),
  calculateTransport: (data) => api.post('/itineraries/transport/calculate', data),
  getTransportOptions: (city, budget) => api.get(`/itineraries/transport/${city}/${budget || ''}`)
};

// User API calls
const users = {
  updateProfile: (data) => api.put('/users/profile', data),
  getUserProfile: (id) => api.get(`/users/${id}`),
  uploadProfilePhoto: (formData) => api.post('/users/profile-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

// Upload API calls
const uploads = {
  uploadPhoto: (formData) => api.post('/uploads/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getUserUploads: () => api.get('/uploads/user'),
  getUploadsByLocation: (location) => api.get(`/uploads/location/${location}`),
  getFeed: (page = 1, limit = 10) => api.get(`/uploads/feed?page=${page}&limit=${limit}`)
};

// Chatbot API calls
const chatbot = {
  askQuestion: (query, context) => api.post('/chatbot/ask', { query, context }),
  getHistory: () => api.get('/chatbot/history')
};

export default {
  setAuthToken,
  clearAuthToken,
  auth,
  quiz,
  itineraries,
  users,
  uploads,
  chatbot
};