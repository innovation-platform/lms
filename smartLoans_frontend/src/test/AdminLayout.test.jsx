import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminLayout from "../components/Admin/AdminLayout";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FiMoon, FiSun } from "react-icons/fi";

// Mock useAuth
vi.mock("../contexts/AuthContext", () => ({
  useAuth: () => ({
    logout: vi.fn(), // Mock logout function
    user: { name: "Admin User" }, // Mock user data if needed
  }),
}));

// Mock localStorage
beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: vi.fn(() => "light"),
      setItem: vi.fn(),
    },
    writable: true,
  });
});

describe("AdminLayout", () => {
  it("renders sidebar and main content correctly", () => {
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    );
    expect(screen.getByRole("button", { name: /chevron/i })).toBeInTheDocument();
  });

  it("toggles sidebar when button is clicked", () => {
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    );
    
    const toggleButton = screen.getByRole("button", { name: /chevron/i });
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
  });

  it("toggles theme when theme button is clicked", () => {
    render(
      <BrowserRouter>
        <AdminLayout />
      </BrowserRouter>
    );

    // Find the button by checking for the presence of the icon
    const themeButton = screen.getByRole("button", { name: /moon|sun/i });
    expect(themeButton).toBeInTheDocument();

    fireEvent.click(themeButton);
    expect(window.localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
  });
});
