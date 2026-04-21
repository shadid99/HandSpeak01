import axios from 'axios';
import { config } from '../config';

const api = axios.create({
  baseURL: config.BASE_URL,
  timeout: 30000, // 30s
  headers: {
    'Accept': 'application/json',
  },
});

export default api;
