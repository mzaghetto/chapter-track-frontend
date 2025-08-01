import api from './api';

export const getUserManhwas = (token: string, page?: number, pageSize?: number, status?: 'ONGOING' | 'COMPLETED' | 'HIATUS', userStatus?: 'READING' | 'PAUSED' | 'DROPPED' | 'COMPLETED', manhwaName?: string) => {
  return api.get('/user/manhwas', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
        page,
        pageSize,
        status,
        userStatus,
        manhwaName
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

export const removeManhwaFromUser = (token: string, manhwaId: string[]) => {
    return api.delete('/user/remove-manhwa', {
        headers: {
        Authorization: `Bearer ${token}`,
        },
        data: { manhwaId },
    });
};

export const filterManhwa = (token: string, manhwaName: string, page: number = 1, limit: number = 8) => {
    return api.get('/manhwa/list', {
        headers: {
        Authorization: `Bearer ${token}`,
        },
        params: {
            manhwaName,
            page,
            limit,
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

export const getProviders = (token: string, searchTerm?: string) => {
    return api.get('/providers', {
        headers: {
        Authorization: `Bearer ${token}`,
        },
        params: {
            searchTerm,
        },
    });
};

export const getManhwaProviders = (token: string, manhwaId: number) => {
    return api.get('/manhwa-providers', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            manhwaId,
        },
    });
};

export const getManhwaById = (token: string, manhwaId: string) => {
    return api.get(`/manhwa/${manhwaId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getRandomManhwas = (count: number = 10) => {
    return api.get('/manhwa/random', {
        params: {
            count,
        },
    });
};
