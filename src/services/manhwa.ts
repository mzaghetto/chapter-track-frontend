import axios from 'axios';

const API_URL = 'http://localhost:5001'; // Assuming the backend is running on port 5001

const api = axios.create({
  baseURL: API_URL,
});

export const getUserManhwas = (token: string, page?: number) => {
  return api.get('/user/manhwas', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
        page
    }
  });
};

export const addManhwaToUser = (token: string, data: any) => {
    return api.post('/user/add-manhwa', data, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
};

export const removeManhwaFromUser = (token: string, manhwa_id: string[]) => {
    return api.delete('/user/remove-manhwa', {
        headers: {
        Authorization: `Bearer ${token}`,
        },
        data: { manhwa_id },
    });
};

export const filterManhwa = (token: string, manhwaName: string) => {
    return api.get('/manhwa/list', {
        headers: {
        Authorization: `Bearer ${token}`,
        },
        params: {
            manhwaName,
        },
    });
};

export const updateUserManhwa = (token: string, manhwaId: string, data: any) => {
    return api.patch(`/user/manhwas/${manhwaId}`, data, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
};
