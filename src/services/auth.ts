import api from './api';

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
