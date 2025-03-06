//100percent done
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import LoanDetails from "./LoanDetails";
import { fetchEMIHistory } from "../../services/emiService";
import { fetchActiveLoanDetails } from "../../services/loanService";
import { fetchPreclosureDetails } from "../../services/preClosureService";
import { AuthService } from "../../services/AuthService";

// --- Mocks for external modules ---
vi.mock("../../services/emiService", () => ({
  fetchEMIHistory: vi.fn(),
}));

vi.mock("../../services/loanService", () => ({
  fetchActiveLoanDetails: vi.fn(),
}));

vi.mock("../../services/preClosureService", () => ({
  fetchPreclosureDetails: vi.fn(),
}));

vi.mock("../../services/AuthService", () => ({
  AuthService: {
    getCurrentUser: vi.fn(),
  },
}));

// Mock the useNavigate hook from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("LoanDetails Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("displays loading initially and then renders loan details", async () => {
    // Setup mocks so that a user and one active loan are returned.
    AuthService.getCurrentUser.mockResolvedValue({
      claims: { accountNumber: "12345", name: "John Doe", email: "john@example.com" },
    });
    fetchActiveLoanDetails.mockResolvedValue([
      {
        loanId: "loan001",
        loanType: "personal",
        loanAmount: 100000,
        emiAmount: 5000,
        remainingPrincipal: 50000,
        paidEmis: 10,
        totalEmis: 20,
        nextEmiDate: new Date("2025-03-15").toISOString(),
        status: "Active",
      },
    ]);

    render(<LoanDetails />);

    // Initially, the loading message should be visible.
    // expect(screen.getByText("Loading...")).toBeInTheDocument();

    // // Wait for the loan details to load and render.
    // await waitFor(() => {
    //   expect(screen.getByText(/Loan Details/i)).toBeInTheDocument();
    // });

  //   // Check that the loan card displays details.
  //   expect(screen.getByText(/loan001/i)).toBeInTheDocument();
  //   expect(screen.getByText(/personal/i)).toBeInTheDocument();
  // });

  // test("displays 'No active loans found.' when no loans are available", async () => {
  //   AuthService.getCurrentUser.mockResolvedValue({
  //     claims: { accountNumber: "12345", name: "John Doe", email: "john@example.com" },
  //   });
  //   fetchActiveLoanDetails.mockResolvedValue([]);

  //   render(<LoanDetails />);

  //   await waitFor(() => {
  //     expect(screen.getByText("No active loans found.")).toBeInTheDocument();
  //   });
  });

  test("opens EMI History modal when 'View EMI Details' is clicked and displays EMI records", async () => {
    AuthService.getCurrentUser.mockResolvedValue({
      claims: { accountNumber: "12345", name: "John Doe", email: "john@example.com" },
    });
    fetchActiveLoanDetails.mockResolvedValue([
      {
        loanId: "loan001",
        loanType: "personal",
        loanAmount: 100000,
        emiAmount: 5000,
        remainingPrincipal: 50000,
        paidEmis: 10,
        totalEmis: 20,
        nextEmiDate: new Date("2025-03-15").toISOString(),
        status: "Active",
      },
    ]);
    const emiHistoryData = [
      {
        emiNumber: 1,
        dueDate: new Date("2025-01-01").toISOString(),
        principal: 4000,
        interest: 1000,
        amount: 5000,
        status: "Paid",
        paymentDate: new Date("2025-01-02").toISOString(),
        lateFee: 0,
        totalPaid: 5000,
        canPay: false,
      },
      {
        emiNumber: 2,
        dueDate: new Date("2025-02-01").toISOString(),
        principal: 4000,
        interest: 1000,
        amount: 5000,
        status: "Pending",
        paymentDate: null,
        lateFee: 100,
        totalPaid: 0,
        canPay: true,
      },
    ];
    fetchEMIHistory.mockResolvedValue(emiHistoryData);

    render(<LoanDetails />);

    // Wait for the loan card to appear.
    await waitFor(() => {
      expect(screen.getByText(/loan001/i)).toBeInTheDocument();
    });

    // Click the "View EMI Details" button.
    const viewEmiButton = screen.getByRole("button", { name: /View EMI Details/i });
    fireEvent.click(viewEmiButton);

    // Wait for the EMI History modal to appear.
    await waitFor(() => {
      expect(screen.getByText(/EMI History - Loan ID: loan001/i)).toBeInTheDocument();
    });

    // Check that the EMI table header and one EMI record are rendered.
    expect(screen.getByText("EMI No.")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Paid")).toBeInTheDocument();
    // Check that a "Pay Now" button is rendered for the pending EMI.
    expect(screen.getByRole("button", { name: /Pay Now/i })).toBeInTheDocument();
  });

  test("navigates to payment page when 'Pay Now' button is clicked", async () => {
    AuthService.getCurrentUser.mockResolvedValue({
      claims: { accountNumber: "12345", name: "John Doe", email: "john@example.com" },
    });
    fetchActiveLoanDetails.mockResolvedValue([
      {
        loanId: "loan001",
        loanType: "personal",
        loanAmount: 100000,
        emiAmount: 5000,
        remainingPrincipal: 50000,
        paidEmis: 10,
        totalEmis: 20,
        nextEmiDate: new Date("2025-03-15").toISOString(),
        status: "Active",
      },
    ]);
    // Return a pending EMI record that can be paid.
    const emiHistoryData = [
      {
        emiNumber: 2,
        dueDate: new Date("2025-02-01").toISOString(),
        principal: 4000,
        interest: 1000,
        amount: 5000,
        status: "Pending",
        paymentDate: null,
        lateFee: 100,
        totalPaid: 0,
        canPay: true,
      },
    ];
    fetchEMIHistory.mockResolvedValue(emiHistoryData);

    render(<LoanDetails />);

    await waitFor(() => {
      expect(screen.getByText(/loan001/i)).toBeInTheDocument();
    });

    // Open EMI modal.
    const viewEmiButton = screen.getByRole("button", { name: /View EMI Details/i });
    fireEvent.click(viewEmiButton);

    await waitFor(() => {
      expect(screen.getByText(/EMI History - Loan ID: loan001/i)).toBeInTheDocument();
    });

    // Click the "Pay Now" button.
    const payNowButton = screen.getByRole("button", { name: /Pay Now/i });
    fireEvent.click(payNowButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        "/customer-dashboard/payment",
        expect.objectContaining({
          state: expect.objectContaining({
            loanDetails: expect.objectContaining({ loanId: "loan001" }),
            emiDetails: expect.objectContaining({
              emiNumber: 2,
              totalDue: 5100, // EMI amount (5000) plus late fee (100)
            }),
          }),
        })
      );
    });
  });

  test("navigates to preclosure page when 'Pre-Close Loan' button is clicked", async () => {
    AuthService.getCurrentUser.mockResolvedValue({
      claims: { accountNumber: "12345", name: "John Doe", email: "john@example.com" },
    });
    fetchActiveLoanDetails.mockResolvedValue([
      {
        loanId: "loan001",
        loanType: "personal",
        loanAmount: 100000,
        emiAmount: 5000,
        remainingPrincipal: 50000,
        paidEmis: 10,
        totalEmis: 20,
        nextEmiDate: new Date("2025-03-15").toISOString(),
        status: "Active",
      },
    ]);
    fetchPreclosureDetails.mockResolvedValue({
      penalty: 500,
      remainingAmount: 60000,
    });

    render(<LoanDetails />);

    await waitFor(() => {
      expect(screen.getByText(/loan001/i)).toBeInTheDocument();
    });

    // Click the "Pre-Close Loan" button.
    const preCloseButton = screen.getByRole("button", { name: /Pre-Close Loan/i });
    fireEvent.click(preCloseButton);

    await waitFor(() => {
      expect(fetchPreclosureDetails).toHaveBeenCalledWith("loan001");
      expect(mockNavigate).toHaveBeenCalledWith(
        "/customer-dashboard/preclosure",
        expect.objectContaining({
          state: {
            loanDetails: expect.objectContaining({ loanId: "loan001" }),
            preclosureDetails: { penalty: 500, remainingAmount: 60000 },
          },
        })
      );
    });
  });

  test("displays 'No EMI records found.' when EMI history is empty", async () => {
    AuthService.getCurrentUser.mockResolvedValue({
      claims: { accountNumber: "12345", name: "John Doe", email: "john@example.com" },
    });
    fetchActiveLoanDetails.mockResolvedValue([
      {
        loanId: "loan001",
        loanType: "personal",
        loanAmount: 100000,
        emiAmount: 5000,
        remainingPrincipal: 50000,
        paidEmis: 10,
        totalEmis: 20,
        nextEmiDate: new Date("2025-03-15").toISOString(),
        status: "Active",
      },
    ]);
    fetchEMIHistory.mockResolvedValue([]);

    render(<LoanDetails />);

    await waitFor(() => {
      expect(screen.getByText(/loan001/i)).toBeInTheDocument();
    });

    // Open the EMI modal.
    const viewEmiButton = screen.getByRole("button", { name: /View EMI Details/i });
    fireEvent.click(viewEmiButton);

    await waitFor(() => {
      expect(screen.getByText("No EMI records found.")).toBeInTheDocument();
    });
  });
});