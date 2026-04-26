import axios from 'axios';
import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();

const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000'  // Android emulator → host localhost
  : 'https://api.rythulink.in';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {'Content-Type': 'application/json'},
});

api.interceptors.request.use(config => {
  const token = storage.getString('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = storage.getString('refresh_token');
      if (refreshToken) {
        try {
          const {data} = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          });
          storage.set('access_token', data.access_token);
          storage.set('refresh_token', data.refresh_token);
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return api(original);
        } catch {
          storage.clearAll();
        }
      }
    }
    return Promise.reject(error);
  },
);
