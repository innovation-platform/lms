// src/config/apiConfig.js
export const API_CONFIG = {
  SERVICES: {
    USER: {
      BASE_URL: "https://localhost:4001/api",
      PREFIX: "/users"
    },
    LOAN: {
      BASE_URL: "http://localhost:2000/api",
      PREFIX: ""
    }
  },
  ENDPOINTS: {
    // User related endpoints
    UPDATE_PROFILE: "/update",
    CHANGE_PASSWORD: "/change-password",
    SIGNIN: "/signin",
    REGISTER: "/",
    CURRENT_USER: "/current",
    FORGOT_PASSWORD: "/forgotPassword",
    VALIDATE_OTP: "/validateOtp",
    RESEND_OTP: "/resendOtp",
    RESET_PASSWORD: "/resetPassword",
    DEACTIVATE:"/deactivate",
    ACTIVATE:"/activate",
    USERS: "/",
    // Loan related endpoints
    LOANS: "/loan",
    LOAN_APPLY: "/loan/apply_loan",
    EMI_HISTORY: "/emi/history",
    EMI_PAYMENT: "/emi/pay",
    PRECLOSURE: "/preclosure",
    ALL_LOANS: "/banker/loans",
  },
  TIMEOUT: 10000,
};
