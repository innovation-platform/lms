// src/services/preclosureService.js
import { loanApiClient } from "./apiClient";
import { API_CONFIG } from "../config/apiConfig";

export const fetchPreclosureDetails = async (loanId) => {
  const response = await loanApiClient.get(`${API_CONFIG.ENDPOINTS.PRECLOSURE}/${loanId}`);
  return response.data;
};

export const submitPreclosureRequest = async (loanId, preclosureData) => {
  const response = await loanApiClient.post(`${API_CONFIG.ENDPOINTS.PRECLOSURE}/${loanId}`, preclosureData);
  return response.data;
};
