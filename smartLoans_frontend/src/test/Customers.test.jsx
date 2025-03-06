import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Customers from "../components/Admin/Customers";
import { getCustomers, deactivateCustomer } from "../services/adminService";
import { vi } from "vitest";

// Mock the services
vi.mock("../services/adminService", () => ({
  getCustomers: vi.fn(),
  deactivateCustomer: vi.fn()
}));

// Mock toast notifications
vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => <div />
}));

describe("Customers Component", () => {
  const mockCustomers = [
    { _id: "1", name: "John Doe", email: "john@example.com", phone: "1234567890", active: true },
    { _id: "2", name: "Jane Doe", email: "jane@example.com", phone: "9876543210", active: true }
  ];

  beforeEach(() => {
    getCustomers.mockResolvedValue(mockCustomers);
  });

  it("renders customer list", async () => {
    render(
      <BrowserRouter>
        <Customers />
      </BrowserRouter>
    );

    expect(await screen.findByText("Customer Management")).toBeInTheDocument();
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  it("navigates to add customer page on button click", async () => {
    render(
      <BrowserRouter>
        <Customers />
      </BrowserRouter>
    );

    const addButton = await screen.findByText("Add Customer");
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(window.location.pathname).toBe("/admin-dashboard/create-user");
  });

  it("shows delete confirmation modal when clicking deactivate", async () => {
    render(
      <BrowserRouter>
        <Customers />
      </BrowserRouter>
    );

    const deactivateButton = await screen.findAllByText("Deactivate");
    fireEvent.click(deactivateButton[0]);

    expect(await screen.findByText("Confirm Delete")).toBeInTheDocument();
    expect(screen.getByText("Are you sure you want to delete John Doe?"));
  });

  it("deactivates a customer and updates UI", async () => {
    deactivateCustomer.mockResolvedValueOnce();

    render(
      <BrowserRouter>
        <Customers />
      </BrowserRouter>
    );

    const deactivateButton = await screen.findAllByText("Deactivate");
    fireEvent.click(deactivateButton[0]);
    fireEvent.click(await screen.findByText("Delete"));

    await waitFor(() => expect(deactivateCustomer).toHaveBeenCalledWith("john@example.com"));
  });
});
