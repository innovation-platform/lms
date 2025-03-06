// src/services/loanDetailsService.js
import { loanApiClient } from "./apiClient";
import { API_CONFIG } from "../config/apiConfig";

export const fetchLoanDetailsService = async (accountNumber) => {
  try {
    const response = await loanApiClient.get(API_CONFIG.ENDPOINTS.LOANS, {
      params: { accountNumber }
    });

    if (!response.data || !response.data.loans) {
      return { totalLoans: 0, typeOfLastLoan: null };
    }

    const filteredLoans = response.data.loans.filter(
      (loan) => loan.status.toLowerCase() === "approved" || loan.status.toLowerCase() === "pending"
    );

    if (filteredLoans.length < 2) {
      const lastLoanType = filteredLoans.length > 0 ? filteredLoans[filteredLoans.length - 1].loanType : null;
      return {
        totalLoans: filteredLoans.length,
        typeOfLastLoan: lastLoanType
      };
    }

    return { totalLoans: filteredLoans.length, typeOfLastLoan: null };

  } catch (error) {
    console.error("Error fetching loan details", error);
    return { totalLoans: 0, typeOfLastLoan: null };
  }
};
