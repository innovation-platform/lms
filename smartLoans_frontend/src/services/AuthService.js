// src/services/authService.js
import { userApiClient } from "./apiClient";
import { FormValidator } from "../utils/validator";
import { API_CONFIG } from "../config/apiConfig";

export const AuthService = {
  login: async (email, password) => {
    try {
      const response = await userApiClient.post(
        API_CONFIG.ENDPOINTS.SIGNIN, 
        { email, password }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  },

  register: async (formData) => {
    try {
      const { isValid, errors } = FormValidator.validateRegistrationData(formData);
      if (!isValid) {
        throw { validationErrors: errors };
      }

      const response = await userApiClient.post(
        API_CONFIG.ENDPOINTS.REGISTER, 
        formData
      );
      return response.data;
    } catch (error) {
      if (error.validationErrors) {
        throw { validationErrors: error.validationErrors };
      }

      const errorResponse = error.response?.data;
      if (errorResponse?.code === 11000 || error.response?.status === 409) {
        throw { validationErrors: { email: "Email already registered" }};
      }

      throw { message: errorResponse?.message || "Registration failed" };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await userApiClient.get(API_CONFIG.ENDPOINTS.CURRENT_USER);
      return response.data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  },

  resetPassword: {
    request: async (email) => {
      const response = await userApiClient.post(
        API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, 
        { email }
      );
      return response.data;
    },

    validate: async (email, enteredOtp) => {
      const response = await userApiClient.post(
        API_CONFIG.ENDPOINTS.VALIDATE_OTP, 
        { email, enteredOtp }
      );
      return response.data;
    },

    resend: async (email) => {
      const response = await userApiClient.post(
        API_CONFIG.ENDPOINTS.RESEND_OTP, 
        { email }
      );
      return response.data;
    },

    reset: async (email, otp, newPassword) => {
      const response = await userApiClient.post(
        API_CONFIG.ENDPOINTS.RESET_PASSWORD, 
        {
          email,
          otp,
          newPassword
        }
      );
      return response.data;
    }
  }
};

export default AuthService;
