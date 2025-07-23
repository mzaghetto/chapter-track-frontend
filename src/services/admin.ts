import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Manhwa Admin Operations
export const createManhwa = (token: string, data: any) => {
  return api.post('/manhwa/create', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateManhwa = (token: string, manhwaId: string, data: any) => {
  return api.patch(`/manhwa/${manhwaId}/update`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteManhwa = (token: string, manhwaId: string) => {
  return api.delete(`/manhwa/${manhwaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Provider Admin Operations
export const createProvider = (token: string, data: any) => {
  return api.post('/providers/create', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createManhwaProvider = (token: string, data: any) => {
  return api.post('/manhwa-provider/create', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProvider = (token: string, providerId: string, data: any) => {
  return api.patch(`/manhwa-provider/${providerId}/update`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteProvider = (token: string, providerId: string) => {
  return api.delete(`/manhwa-provider/${providerId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getManhwaProviders = (token: string, manhwaName: string, providerId: number | '', page: number, pageSize: number) => {
  const params: any = {
    page,
    pageSize,
  };

  if (manhwaName) {
    params.manhwaName = manhwaName;
  }

  if (providerId) {
    params.providerId = providerId;
  }

  return api.get('/manhwa-providers', {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteManhwaProvider = (token: string, id: string) => {
  return api.delete(`/manhwa-provider/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
