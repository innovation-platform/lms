import { describe, it, expect, vi } from "vitest";
import AuthService from "../services/AuthService";
import { userApiClient } from "../services/apiClient";
import { API_CONFIG } from "../config/apiConfig";
import { FormValidator } from "../utils/validator";

vi.mock("../services/apiClient", () => ({
  userApiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock("../utils/validator", () => ({
  FormValidator: {
    validateRegistrationData: vi.fn(),
  },
}));

describe("AuthService", () => {
  const mockEmail = "test@example.com";
  const mockPassword = "password123";
  const mockToken = "fake-jwt-token";
  const mockOtp = "123456";
  const mockUserData = { id: "1", email: mockEmail, name: "Test User" };

  describe("login", () => {
    it("should successfully log in", async () => {
      const mockResponse = { data: { token: mockToken, user: mockUserData } };
      userApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.login(mockEmail, mockPassword);

      expect(userApiClient.post).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.SIGNIN, {
        email: mockEmail,
        password: mockPassword,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle login failure", async () => {
      userApiClient.post.mockRejectedValueOnce({ response: { data: { message: "Invalid credentials" } } });

      await expect(AuthService.login(mockEmail, mockPassword)).rejects.toEqual("Invalid credentials");
    });
  });

  describe("register", () => {
    const mockFormData = { email: mockEmail, password: mockPassword, name: "Test User" };

    it("should successfully register a user", async () => {
      FormValidator.validateRegistrationData.mockReturnValueOnce({ isValid: true, errors: {} });
      const mockResponse = { data: { message: "User registered successfully" } };
      userApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.register(mockFormData);

      expect(FormValidator.validateRegistrationData).toHaveBeenCalledWith(mockFormData);
      expect(userApiClient.post).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.REGISTER, mockFormData);
      expect(result).toEqual(mockResponse.data);
    });

    it("should handle validation errors", async () => {
      const validationErrors = { email: "Invalid email format" };
      FormValidator.validateRegistrationData.mockReturnValueOnce({ isValid: false, errors: validationErrors });

      await expect(AuthService.register(mockFormData)).rejects.toEqual({ validationErrors });
    });

    it("should handle email already registered error", async () => {
      FormValidator.validateRegistrationData.mockReturnValueOnce({ isValid: true, errors: {} });
      userApiClient.post.mockRejectedValueOnce({ response: { data: {}, status: 409 } });

      await expect(AuthService.register(mockFormData)).rejects.toEqual({ validationErrors: { email: "Email already registered" } });
    });

    it("should handle general registration errors", async () => {
      FormValidator.validateRegistrationData.mockReturnValueOnce({ isValid: true, errors: {} });
      userApiClient.post.mockRejectedValueOnce({ response: { data: { message: "Registration failed" } } });

      await expect(AuthService.register(mockFormData)).rejects.toEqual({ message: "Registration failed" });
    });
  });

  describe("getCurrentUser", () => {
    it("should successfully fetch current user", async () => {
      userApiClient.get.mockResolvedValueOnce({ data: mockUserData });

      const result = await AuthService.getCurrentUser();

      expect(userApiClient.get).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.CURRENT_USER);
      expect(result).toEqual(mockUserData);
    });

    it("should handle errors when fetching current user", async () => {
      userApiClient.get.mockRejectedValueOnce(new Error("Failed to fetch user"));

      await expect(AuthService.getCurrentUser()).rejects.toThrow("Failed to fetch user");
    });
  });

  describe("resetPassword", () => {
    it("should successfully request a password reset", async () => {
      const mockResponse = { data: { message: "Reset link sent" } };
      userApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.resetPassword.request(mockEmail);

      expect(userApiClient.post).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, { email: mockEmail });
      expect(result).toEqual(mockResponse.data);
    });

    it("should successfully validate OTP", async () => {
      const mockResponse = { data: { valid: true } };
      userApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.resetPassword.validate(mockEmail, mockOtp);

      expect(userApiClient.post).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.VALIDATE_OTP, {
        email: mockEmail,
        enteredOtp: mockOtp,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should successfully resend OTP", async () => {
      const mockResponse = { data: { message: "OTP resent" } };
      userApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.resetPassword.resend(mockEmail);

      expect(userApiClient.post).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.RESEND_OTP, { email: mockEmail });
      expect(result).toEqual(mockResponse.data);
    });

    it("should successfully reset password", async () => {
      const mockResponse = { data: { message: "Password reset successful" } };
      userApiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await AuthService.resetPassword.reset(mockEmail, mockOtp, "newSecurePassword");

      expect(userApiClient.post).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.RESET_PASSWORD, {
        email: mockEmail,
        otp: mockOtp,
        newPassword: "newSecurePassword",
      });
      expect(result).toEqual(mockResponse.data);
    });

    // it("should handle errors in password reset", async () => {
    //   userApiClient.post.mockRejectedValueOnce({ response: { data: { message: "Reset failed" } } });

    //   await expect(AuthService.resetPassword.reset(mockEmail, mockOtp, "newSecurePassword")).rejects.toEqual({
    //     message: "Reset failed",
    //   });
    // });
  });
});
