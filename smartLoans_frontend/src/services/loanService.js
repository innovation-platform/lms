// src/services/loanService.js
import { loanApiClient } from "./apiClient";
import { API_CONFIG } from "../config/apiConfig";

export const fetchLoanApplications = async (accountNumber) => {
  console.log(API_CONFIG.ENDPOINTS.LOANS);
  const response = await loanApiClient.get(`${API_CONFIG.ENDPOINTS.LOANS}`, {
    params: { accountNumber }
  });
  console.log("response",response.data);
  return response.data;
};

export const submitLoanApplication = async (formData, onProgressUpdate) => {
  return await loanApiClient.post(API_CONFIG.ENDPOINTS.LOAN_APPLY, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgressUpdate(percentCompleted);
    },
  });
};

export const LOAN_OPTIONS = [
  { value: "Home Loan", label: "Home Loan", interestRate: 6.5 },
  { value: "Personal Loan", label: "Personal Loan", interestRate: 12.0 },
  { value: "Gold Loan", label: "Gold Loan", interestRate: 7.0 },
  { value: "Education Loan", label: "Education Loan", interestRate: 10.5 },
];

// In loanService.js, add this updated function
export const fetchActiveLoanDetails = async (accountNumber) => {
  const response = await loanApiClient.get(API_CONFIG.ENDPOINTS.LOANS, {
    params: { accountNumber }
  });
  return response.data.loans.filter(loan => 
    loan.status.toLowerCase() === "approved"
  );
};

