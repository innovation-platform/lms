import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../components/Admin/Dashboard";
import { getLoans, getCustomers, getBankers } from "../services/adminService";
import { vi } from "vitest";

// Mock the services
vi.mock("../services/adminService", () => ({
  getLoans: vi.fn(),
  getCustomers: vi.fn(),
  getBankers: vi.fn(),
}));

describe("Dashboard Component", () => {
  const mockLoans = [
    { _id: "1", status: "Approved" },
    { _id: "2", status: "Rejected" },
    { _id: "3", status: "Pending" },
  ];

  const mockCustomers = [
    { _id: "1", name: "John Doe" },
    { _id: "2", name: "Jane Doe" },
  ];

  const mockBankers = [
    { _id: "1", name: "Alice" },
    { _id: "2", name: "Bob" },
  ];

  beforeEach(() => {
    getLoans.mockResolvedValue(mockLoans);
    getCustomers.mockResolvedValue(mockCustomers);
    getBankers.mockResolvedValue(mockBankers);
  });

  it("renders dashboard overview correctly", async () => {
    render(<Dashboard />);

    expect(await screen.findByText("Welcome to Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Here's an overview of your loan management system")).toBeInTheDocument();
  });

  it("displays correct data for total counts using test IDs", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("total-customers")).toHaveTextContent("2"); // Active Customers
      expect(screen.getByTestId("total-loans")).toHaveTextContent("3"); // Total Loans
      expect(screen.getByTestId("total-bankers")).toHaveTextContent("2"); // Total Bankers
      expect(screen.getByTestId("pending-approvals")).toHaveTextContent("1"); // Pending Loans
      expect(screen.getByTestId("approved-loans")).toHaveTextContent("1"); // Approved Loans
      expect(screen.getByTestId("rejected-loans")).toHaveTextContent("1"); // Rejected Loans
    });
  });
});
