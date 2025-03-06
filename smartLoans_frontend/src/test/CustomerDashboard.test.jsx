// DONE -100%
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CustomerDashboard from "./CustomerDashboard";
import { vi } from "vitest";

// We'll use a mutable auth object so that tests can override its values.
let authData = {
  token: "dummy-token",
  user: { name: "John Doe" },
};

// Mock react-router-dom
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
  Outlet: () => <div>Outlet Component</div>,
}));

// Mock the AuthContext so we can control the token and user
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => authData,
}));

// Mock the Sidebar component
vi.mock("./Sidebar", () => ({
  default: ({ isSidebarOpen, user }) => (
    <div data-testid="sidebar">
      Sidebar {isSidebarOpen ? "Open" : "Closed"} - {user?.name}
    </div>
  ),
}));

describe("CustomerDashboard", () => {
  beforeEach(() => {
    // Reset auth data and mocks.
    authData = {
      token: "dummy-token",
      user: { name: "John Doe" },
    };
    mockedNavigate.mockClear();
    localStorage.clear();
    // Set default theme in localStorage to "light" and update the body attribute.
    localStorage.setItem("theme", "light");
    document.body.setAttribute("data-theme", "light");
  });

  test("renders sidebar open by default and main content with correct margin", () => {
    const { container } = render(<CustomerDashboard />);
    
    // Sidebar container should have "open" class.
    const sidebarContainer = container.querySelector(".sidebar-container");
    expect(sidebarContainer).toHaveClass("open");

    // Main content should have a left margin of 250px.
    const mainContent = container.querySelector(".main-content");
    expect(mainContent).toHaveStyle("margin-left: 250px");

    // The Sidebar component should render with the user's name.
    expect(screen.getByTestId("sidebar")).toHaveTextContent("Sidebar Open - John Doe");

    // The Outlet (placeholder for nested routes) should render.
    expect(screen.getByText("Outlet Component")).toBeInTheDocument();
  });

  test("toggles sidebar open/closed when toggle button is clicked", () => {
    const { container } = render(<CustomerDashboard />);
    
    const sidebarToggleBtn = container.querySelector("button.sidebar-toggle");
    expect(sidebarToggleBtn).toBeInTheDocument();

    // Initially, sidebar is open.
    let sidebarContainer = container.querySelector(".sidebar-container");
    let mainContent = container.querySelector(".main-content");
    expect(sidebarContainer).toHaveClass("open");
    expect(mainContent).toHaveStyle("margin-left: 250px");

    // Click the toggle button to close the sidebar.
    fireEvent.click(sidebarToggleBtn);
    sidebarContainer = container.querySelector(".sidebar-container");
    mainContent = container.querySelector(".main-content");
    expect(sidebarContainer).toHaveClass("closed");
    expect(mainContent).toHaveStyle("margin-left: 80px");

    // Click again to open the sidebar.
    fireEvent.click(sidebarToggleBtn);
    sidebarContainer = container.querySelector(".sidebar-container");
    mainContent = container.querySelector(".main-content");
    expect(sidebarContainer).toHaveClass("open");
    expect(mainContent).toHaveStyle("margin-left: 250px");
  });

  test("toggles theme between light and dark when theme toggle button is clicked", () => {
    const { container } = render(<CustomerDashboard />);
    
    const themeToggleBtn = container.querySelector(".theme-toggle button");
    expect(themeToggleBtn).toBeInTheDocument();

    // Initial theme should be light.
    expect(document.body.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");

    // Click the theme toggle button to switch to dark theme.
    fireEvent.click(themeToggleBtn);
    expect(document.body.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");

    // Click again to switch back to light theme.
    fireEvent.click(themeToggleBtn);
    expect(document.body.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  test("navigates to /home if token is not present", async () => {
    // Simulate missing token.
    authData.token = null;
    render(<CustomerDashboard />);

    // Wait for the useEffect to trigger navigation.
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/home");
    });
  });

  test("initializes theme from localStorage", () => {
    // Set localStorage theme to dark before rendering.
    localStorage.setItem("theme", "dark");
    document.body.setAttribute("data-theme", "dark");
    render(<CustomerDashboard />);
    expect(document.body.getAttribute("data-theme")).toBe("dark");
  });
});