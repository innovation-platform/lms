import { render, screen, fireEvent, waitFor,within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Bankers from "../components/Admin/Bankers";
import { getBankers, deactivateBanker } from "../services/adminService";

// Mock useNavigate with partial module mocking
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock adminService
vi.mock("../services/adminService", () => ({
  getBankers: vi.fn(),
  deactivateBanker: vi.fn(),
}));

const mockBankers = [
  { _id: "1", name: "John Doe", email: "john@example.com", phone: "1234567890", active: true },
  { _id: "2", name: "Jane Doe", email: "jane@example.com", phone: "9876543210", active: true },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Bankers Component", () => {
  it("renders the component correctly", async () => {
    getBankers.mockResolvedValue(mockBankers);

    render(
      <BrowserRouter>
        <Bankers />
      </BrowserRouter>
    );

    expect(await screen.findByText("Banker Management")).toBeInTheDocument();
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
  });

  it("navigates to add banker page when Add Banker button is clicked", async () => {
    getBankers.mockResolvedValue(mockBankers);

    render(
      <BrowserRouter>
        <Bankers />
      </BrowserRouter>
    );

    const addButton = await screen.findByText("Add Banker");
    fireEvent.click(addButton);

    expect(mockNavigate).toHaveBeenCalledWith("/admin-dashboard/create-user");
  });

  it("opens and closes deactivate confirmation modal", async () => {
    getBankers.mockResolvedValue(mockBankers);

    render(
      <BrowserRouter>
        <Bankers />
      </BrowserRouter>
    );

    const deactivateButtons = await screen.findAllByText("Deactivate");
    fireEvent.click(deactivateButtons[0]);

    expect(await screen.findByText(/Are you sure you want to deactivate John Doe/i)).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText(/Are you sure you want to deactivate John Doe/i)).not.toBeInTheDocument();
    });
  });

  it("deactivates a banker when confirm button is clicked", async () => {
    getBankers.mockResolvedValue(mockBankers);
    deactivateBanker.mockResolvedValue({ success: true });

    render(
      <BrowserRouter>
        <Bankers />
      </BrowserRouter>
    );

    // Open delete confirmation modal
    const deactivateButtons = await screen.findAllByText("Deactivate");
    fireEvent.click(deactivateButtons[0]);

    // Find the modal confirm button specifically
    const modal = await screen.findByRole("dialog"); // Find the modal first
    const confirmButton = within(modal).getByRole("button", { name: "Deactivate" });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deactivateBanker).toHaveBeenCalledWith("john@example.com");
    });
  });
});
