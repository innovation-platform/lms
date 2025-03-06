// src/services/emiService.js
import { loanApiClient } from "./apiClient";
import { API_CONFIG } from "../config/apiConfig";

export const fetchEMIHistory = async (loanId) => {
  const response = await loanApiClient.get(`${API_CONFIG.ENDPOINTS.EMI_HISTORY}/${loanId}`);
  return response.data;
};

export const submitEMIPayment = async (paymentData) => {
  const response = await loanApiClient.patch(API_CONFIG.ENDPOINTS.EMI_PAYMENT, paymentData);
  return response.data;
};
