import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://geo-data-application-cj6q.onrender.com',
});

export default axiosInstance;
