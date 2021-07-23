import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.15.3:1010',
});

export default api;