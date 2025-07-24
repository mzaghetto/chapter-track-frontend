import axios from 'axios';
import { getNavigate } from '../utils/navigation';

const API_URL = process.env.REACT_APP_API_URL; // Assuming the backend is running on port 5001

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      const navigate = getNavigate();
      if (navigate) {
        navigate('/login');
      }
    }
    return Promise.reject(error);
  }
);

export const register = (data: any) => {
  return api.post('/register', data);
};

export const login = (data: any) => {
  return api.post('/sessions', data);
};

export const googleSSO = (token: string) => {
  return api.post('/sso/google', { token });
};

export const refreshToken = () => {
  return api.patch('/token/refresh');
};

export const getProfile = (token: string) => {
  return api.get('/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProfile = (token: string, data: { username?: string }) => {
  return api.patch('/me', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
