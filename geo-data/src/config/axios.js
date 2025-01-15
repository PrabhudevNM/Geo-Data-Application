import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9050',
});

export default axiosInstance;
