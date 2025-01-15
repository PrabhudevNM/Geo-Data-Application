import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://geo-data-application-3j88.onrender.com'
});

export default axiosInstance;
