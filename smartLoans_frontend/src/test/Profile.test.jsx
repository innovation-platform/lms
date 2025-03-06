import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProfilePage from "./Profile";
import { vi } from "vitest";
import { useAuth } from "../../contexts/AuthContext";
import AuthService from "../../services/AuthService";
import { updateUserProfile, changePassword } from "../../services/profileService";

// Mocking useAuth hook
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: vi.fn()
}));

// Mocking API calls
vi.mock("../../services/AuthService", () => ({
  getCurrentUser: vi.fn()
}));

vi.mock("../../services/profileService", () => ({
  updateUserProfile: vi.fn(),
  changePassword: vi.fn()
}));

describe("ProfilePage Component", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { email: "test@example.com" },
      setUser: vi.fn(),
      token: "mockToken",
      setToken: vi.fn()
    });

    AuthService.getCurrentUser.mockResolvedValue({
      claims: {
        accountNumber: "1234567890",
        name: "John Doe",
        email: "test@example.com",
        phone: "9876543210",
        address: "123 Main St"
      }
    });
  });

  it("renders ProfilePage correctly", async () => {
    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText("User Profile")).toBeInTheDocument();
    
    await waitFor(() => expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument());
  });

  it("updates phone and address fields", async () => {
    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByDisplayValue("9876543210")).toBeInTheDocument());
    
    const phoneInput = screen.getByLabelText("Mobile no.");
    fireEvent.change(phoneInput, { target: { value: "9998887776" } });
    expect(phoneInput.value).toBe("9998887776");
  });

  it("saves profile changes successfully", async () => {
    updateUserProfile.mockResolvedValue({ token: "newMockToken" });

    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getByDisplayValue("9876543210")).toBeInTheDocument());
    
    const saveButton = screen.getByText("Save Changes");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalled();
      expect(screen.getByText("Profile updated successfully!")).toBeInTheDocument();
    });
  });

  it("handles password change successfully", async () => {
    changePassword.mockResolvedValue({ message: "Password changed successfully!" });

    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Change Password"));
    
    fireEvent.change(screen.getByLabelText("Current Password"), { target: { value: "oldPass123" } });
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "newPass123" } });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "newPass123" } });
    
    fireEvent.click(screen.getByText("Change Password"));

    await waitFor(() => {
      expect(changePassword).toHaveBeenCalled();
      expect(screen.getByText("Password changed successfully!")).toBeInTheDocument();
    });
  });

  it("shows an error when passwords do not match", async () => {
    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText("Change Password"));
    
    fireEvent.change(screen.getByLabelText("New Password"), { target: { value: "newPass123" } });
    fireEvent.change(screen.getByLabelText("Confirm New Password"), { target: { value: "differentPass" } });
    
    fireEvent.click(screen.getByText("Change Password"));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match!")).toBeInTheDocument();
    });
  });
});
