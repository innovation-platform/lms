// src/services/profileService.js
import { userApiClient } from "./apiClient";
import { API_CONFIG } from "../config/apiConfig";

export const updateUserProfile = async (userData) => {
  const response = await userApiClient.patch(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, userData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await userApiClient.patch(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, passwordData);
  return response.data;
};
