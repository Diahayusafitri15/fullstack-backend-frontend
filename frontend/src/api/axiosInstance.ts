import axios from 'axios';

const axiosInstance = axios.create({
  // Mengikuti PORT=3000 dari .env backend kamu
  baseURL: 'http://localhost:3000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;