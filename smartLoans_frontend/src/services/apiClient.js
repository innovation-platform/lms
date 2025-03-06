// src/services/apiClient.js
import axios from "axios";
import { API_CONFIG } from "../config/apiConfig";
import { StorageService } from "../utils/storage";

const createApiClient = (serviceType = 'USER') => {
  const config = API_CONFIG.SERVICES[serviceType];
  
  const instance = axios.create({
    baseURL: config.BASE_URL + config.PREFIX,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = StorageService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        StorageService.clearAuth();
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const userApiClient = createApiClient('USER');
export const loanApiClient = createApiClient('LOAN');
