import axios from 'axios';
import { getNavigate } from '../utils/navigation';

const API_URL = process.env.REACT_APP_API_URL; // Assuming the backend is running on port 5001

const api = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshToken()
          .then((res) => {
            const newToken = res.data.token;
            localStorage.setItem('token', newToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            processQueue(null, newToken);
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            localStorage.removeItem('token');
            const navigate = getNavigate();
            if (navigate) {
              navigate('/login');
            }
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
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
