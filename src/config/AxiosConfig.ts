import axios, { InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default axiosInstance;
