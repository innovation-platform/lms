import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import LoanApplication from "../LoanApplication";
import AuthService from "../../services/AuthService";
import { submitLoanApplication } from "../../services/loanService";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

vi.mock("../../services/AuthService", () => ({
  getCurrentUser: vi.fn()
}));

vi.mock("../../services/loanService", () => ({
  submitLoanApplication: vi.fn()
}));

describe("LoanApplication Component", () => {
  beforeEach(() => {
    AuthService.getCurrentUser.mockResolvedValue({
      claims: {
        accountNumber: "1234567890",
        name: "John Doe",
        phone: "9876543210",
        email: "john.doe@example.com"
      }
    });
  });

  it("renders the loan application form", async () => {
    render(
      <MemoryRouter>
        <LoanApplication />
      </MemoryRouter>
    );

    expect(await screen.findByText("Loan Application")).toBeInTheDocument();
    expect(screen.getByLabelText(/Account Number/i)).toHaveValue("1234567890");
    expect(screen.getByLabelText(/Customer Name/i)).toHaveValue("John Doe");
  });

  it("validates loan amount on blur", async () => {
    render(
      <MemoryRouter>
        <LoanApplication />
      </MemoryRouter>
    );

    const loanAmountInput = screen.getByLabelText(/Loan Amount/i);
    fireEvent.change(loanAmountInput, { target: { value: "100" } });
    fireEvent.blur(loanAmountInput);

    await waitFor(() => {
      expect(screen.getByText(/Loan amount must be greater/i)).toBeInTheDocument();
    });
  });

  it("submits the form successfully", async () => {
    submitLoanApplication.mockResolvedValue({ status: 201, data: { success: true } });

    render(
      <MemoryRouter>
        <LoanApplication />
      </MemoryRouter>
    );

    const loanAmountInput = screen.getByLabelText(/Loan Amount/i);
    fireEvent.change(loanAmountInput, { target: { value: "50000" } });

    const submitButton = screen.getByText(/Apply Now/i);
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(submitLoanApplication).toHaveBeenCalled();
    });
  });
});