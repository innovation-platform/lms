import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateUserProfile, changePassword } from "../services/profileService";
import { userApiClient } from "../services/apiClient";
import { API_CONFIG } from "../config/apiConfig";

// Mock the userApiClient
vi.mock("../services/apiClient", () => ({
  userApiClient: {
    patch: vi.fn(),
  },
}));

describe("profileService", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mock calls before each test
  });

  describe("updateUserProfile", () => {
    it("should update the user profile successfully", async () => {
      const mockData = { name: "John Doe", email: "john@example.com" };
      const mockResponse = { data: { success: true, user: mockData } };

      userApiClient.patch.mockResolvedValueOnce(mockResponse);

      const result = await updateUserProfile(mockData);

      expect(userApiClient.patch).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, mockData);
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if update fails", async () => {
      const mockData = { name: "Jane Doe", email: "jane@example.com" };
      const mockError = new Error("Profile update failed");

      userApiClient.patch.mockRejectedValueOnce(mockError);

      await expect(updateUserProfile(mockData)).rejects.toThrow("Profile update failed");
      expect(userApiClient.patch).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, mockData);
    });
  });

  describe("changePassword", () => {
    it("should change the password successfully", async () => {
      const passwordData = { oldPassword: "oldpass123", newPassword: "newpass456" };
      const mockResponse = { data: { success: true, message: "Password changed successfully" } };

      userApiClient.patch.mockResolvedValueOnce(mockResponse);

      const result = await changePassword(passwordData);

      expect(userApiClient.patch).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, passwordData);
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if password change fails", async () => {
      const passwordData = { oldPassword: "wrongpass", newPassword: "newpass123" };
      const mockError = new Error("Password change failed");

      userApiClient.patch.mockRejectedValueOnce(mockError);

      await expect(changePassword(passwordData)).rejects.toThrow("Password change failed");
      expect(userApiClient.patch).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, passwordData);
    });
  });
});
