import axios from 'axios';

export const requests = axios.create({
  baseURL: 'http://192.168.31.135:3000',
  timeout: 30000,
});
