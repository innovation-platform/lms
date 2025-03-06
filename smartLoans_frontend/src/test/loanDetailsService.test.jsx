import { fetchLoanDetailsService } from "../services/loanDetailsService";
import { loanApiClient } from "../services/apiClient";
import { API_CONFIG } from "../config/apiConfig";
import { vi } from "vitest";

// Mock loanApiClient
vi.mock("../services/apiClient", () => ({
  loanApiClient: {
    get: vi.fn(),
  },
}));

describe("fetchLoanDetailsService", () => {
  const accountNumber = "1234567890";

  afterEach(() => {
    vi.restoreAllMocks(); // Reset mocks after each test
  });

  it("returns totalLoans and typeOfLastLoan for approved/pending loans", async () => {
    loanApiClient.get.mockResolvedValueOnce({
      data: {
        loans: [
          { status: "approved", loanType: "Home Loan" },
          { status: "pending", loanType: "Personal Loan" },
        ],
      },
    });

    const result = await fetchLoanDetailsService(accountNumber);
    expect(result).toEqual({ totalLoans: 2, typeOfLastLoan: null });
  });

  it("returns last loan type if only one approved/pending loan exists", async () => {
    loanApiClient.get.mockResolvedValueOnce({
      data: {
        loans: [{ status: "approved", loanType: "Car Loan" }],
      },
    });

    const result = await fetchLoanDetailsService(accountNumber);
    expect(result).toEqual({ totalLoans: 1, typeOfLastLoan: "Car Loan" });
  });

  it("returns totalLoans as 0 when no loans exist", async () => {
    loanApiClient.get.mockResolvedValueOnce({ data: { loans: [] } });

    const result = await fetchLoanDetailsService(accountNumber);
    expect(result).toEqual({ totalLoans: 0, typeOfLastLoan: null });
  });

  it("returns totalLoans as 0 when API response has no loans key", async () => {
    loanApiClient.get.mockResolvedValueOnce({ data: {} });

    const result = await fetchLoanDetailsService(accountNumber);
    expect(result).toEqual({ totalLoans: 0, typeOfLastLoan: null });
  });

  it("returns totalLoans as 0 when API call fails", async () => {
    loanApiClient.get.mockRejectedValueOnce(new Error("Network Error"));

    const result = await fetchLoanDetailsService(accountNumber);
    expect(result).toEqual({ totalLoans: 0, typeOfLastLoan: null });
  });

  it("ignores loans with statuses other than approved or pending", async () => {
    loanApiClient.get.mockResolvedValueOnce({
      data: {
        loans: [
          { status: "rejected", loanType: "Gold Loan" },
          { status: "approved", loanType: "Education Loan" },
        ],
      },
    });

    const result = await fetchLoanDetailsService(accountNumber);
    expect(result).toEqual({ totalLoans: 1, typeOfLastLoan: "Education Loan" });
  });
});