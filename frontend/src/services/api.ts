import axios from 'axios';
import { config } from '../config';

const api = axios.create({
  baseURL: config.BASE_URL,
  timeout: 30000, // 30s
  headers: {
    'Accept': 'application/json',
  },
});

// 🆕 دالة إرسال النص واستلام مصفوفة رموزه وإشارته
export const textToSign = async (text: string) => {
  try {
    const response = await api.post('/text-to-sign', { text });
    return response.data;
  } catch (error) {
    console.error('Error fetching sign sequence:', error);
    throw error;
  }
};

export default api;
