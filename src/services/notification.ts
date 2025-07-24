import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

export const generateTelegramLinkingToken = (token: string) => {
  return api.post('/user/telegram-linking-token', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const resetTelegramLinking = (token: string) => {
  return api.patch('/user/reset-telegram-linking', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const updateTelegramNotificationStatus = (token: string, activate: boolean) => {
  return api.patch('/user/telegram-notification', { activate }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const registerManhwaNotification = (token: string, manhwaId: number, channel: string, isEnabled: boolean) => {
  return api.post('/user/notifications/register', { manhwaId, channel, isEnabled }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
