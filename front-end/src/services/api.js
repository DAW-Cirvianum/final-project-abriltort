import axios from 'axios';

// URL base del backend
const API_BASE_URL = 'http://localhost:8085/api';

// Crear instància d'axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Afegir el token a cada crida si existeix
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // guardar el token al fer login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Funcions que criden l'API
const loginUser = async (email, password) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

const getObres = async () => {
  const response = await api.get('/obres');
  return response.data;
};

export { loginUser, getObres };