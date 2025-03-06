import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateUser from "../components/Admin/CreateUser";
import { userApiClient } from "../services/apiClient";
import { toast } from "react-toastify";
import { PasswordValidator, FormValidator } from "../utils/validator";

// Mock API client and validation utilities
vi.mock("../services/apiClient", () => ({
  userApiClient: { post: vi.fn() },
}));
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("../utils/validator", () => ({
  PasswordValidator: { validate: vi.fn(() => ({ length: true, uppercase: true, number: true, specialChar: true })) },
  FormValidator: { validateRegistrationData: vi.fn(() => ({ isValid: true, errors: {} })) },
}));

describe("CreateUser Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Create User form", () => {
    render(
      <BrowserRouter>
        <CreateUser />
      </BrowserRouter>
    );

    expect(screen.getByText("Create New User")).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByText("Create User")).toBeInTheDocument();
  });

  it("handles input changes", () => {
    render(
      <BrowserRouter>
        <CreateUser />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: "John Doe" } });

    expect(nameInput.value).toBe("John Doe");
  });

  it("shows validation errors when form is submitted with invalid data", async () => {
    FormValidator.validateRegistrationData.mockReturnValue({
      isValid: false,
      errors: { email: "Invalid email format" },
    });

    render(
      <BrowserRouter>
        <CreateUser />
      </BrowserRouter>
    );

    fireEvent.submit(screen.getByText("Create User"));

    await waitFor(() => {
      expect(screen.getByText("Invalid email format")).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith("Invalid email format");
    });
  });

  it("submits the form successfully", async () => {
    userApiClient.post.mockResolvedValue({ data: { success: true } });
  
    render(
      <BrowserRouter>
        <CreateUser />
      </BrowserRouter>
    );
  
    // Fill out form fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "Password@123" } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: "123 Street" } });
  
    // Submit form
    fireEvent.submit(screen.getByText("Create User"));
  
    // Ensure API call is made with the correct data
    await waitFor(() => {
      expect(userApiClient.post).toHaveBeenCalledWith("/", expect.objectContaining({
        name: "John Doe",
        email: "john@example.com",
        password: "Password@123",
        phone: "1234567890",
        address: "123 Street",
        roles: ["user"], // Ensure roles is an array
      }));
    });
  
    // Check for success toast
    expect(toast.success).toHaveBeenCalledWith("User created successfully!");
  });
  

  it("handles API failure", async () => {
    userApiClient.post.mockRejectedValue({ response: { data: { message: "Error creating user" } } });

    render(
      <BrowserRouter>
        <CreateUser />
      </BrowserRouter>
    );

    fireEvent.submit(screen.getByText("Create User"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error creating user");
    });
  });
});
