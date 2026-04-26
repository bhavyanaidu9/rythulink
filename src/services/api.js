import axios from 'axios';
import { MMKV } from 'react-native-mmkv';

// Replace with your local machine's IP address when testing on physical device
// E.g. http://192.168.1.5:8000/api/v1
const API_URL = 'http://10.0.2.2:8000/api/v1'; 
const storage = new MMKV();

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  async (config) => {
    const token = storage.getString('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle token expiration - e.g., clear storage, navigate to login
      storage.delete('userToken');
      // Redux or Context will need to pick this up via events, or we do it carefully
    }
    return Promise.reject(error);
  }
);

export default api;
