import { fetchLoanApplications, submitLoanApplication, fetchActiveLoanDetails, LOAN_OPTIONS } from "../services/loanService";
import { loanApiClient } from "../services/apiClient";
import { API_CONFIG } from "../config/apiConfig";
import { vi } from "vitest";

// Mock loanApiClient
vi.mock("../services/apiClient", () => ({
  loanApiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("Loan Service", () => {
  const accountNumber = "1234567890";
  const loanApplicationsMock = { loans: [{ id: 1, status: "approved" }, { id: 2, status: "pending" }] };
  const loanSubmissionMock = { success: true, message: "Loan submitted successfully" };

  afterEach(() => {
    vi.restoreAllMocks(); // Reset mocks after each test
  });

  it("fetches loan applications successfully", async () => {
    loanApiClient.get.mockResolvedValueOnce({ data: loanApplicationsMock });

    const result = await fetchLoanApplications(accountNumber);

    expect(loanApiClient.get).toHaveBeenCalledWith(`${API_CONFIG.ENDPOINTS.LOANS}`, {
      params: { accountNumber },
    });
    expect(result).toEqual(loanApplicationsMock);
  });

  it("throws an error when fetching loan applications fails", async () => {
    const errorMessage = "Failed to fetch loans";
    loanApiClient.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchLoanApplications(accountNumber)).rejects.toThrow(errorMessage);
    expect(loanApiClient.get).toHaveBeenCalledWith(`${API_CONFIG.ENDPOINTS.LOANS}`, {
      params: { accountNumber },
    });
  });

  it("submits loan application successfully and tracks progress", async () => {
    loanApiClient.post.mockResolvedValueOnce({ data: loanSubmissionMock });
    const onProgressUpdate = vi.fn();

    const formData = new FormData();
    formData.append("loanType", "Home Loan");

    const result = await submitLoanApplication(formData, onProgressUpdate);

    expect(loanApiClient.post).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.LOAN_APPLY, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: expect.any(Function),
    });
    expect(result.data).toEqual(loanSubmissionMock);
  });

  it("throws an error when submitting loan application fails", async () => {
    const errorMessage = "Loan submission failed";
    loanApiClient.post.mockRejectedValueOnce(new Error(errorMessage));

    const onProgressUpdate = vi.fn();
    const formData = new FormData();
    formData.append("loanType", "Personal Loan");

    await expect(submitLoanApplication(formData, onProgressUpdate)).rejects.toThrow(errorMessage);
    expect(loanApiClient.post).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.LOAN_APPLY, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: expect.any(Function),
    });
  });

  it("calls onUploadProgress with correct progress", async () => {
    const onProgressUpdate = vi.fn();
    const formData = new FormData();
    formData.append("loanType", "Gold Loan");

    loanApiClient.post.mockImplementation((url, data, config) => {
      config.onUploadProgress({ loaded: 50, total: 100 });
      return Promise.resolve({ data: loanSubmissionMock });
    });

    await submitLoanApplication(formData, onProgressUpdate);
    expect(onProgressUpdate).toHaveBeenCalledWith(50);
  });

  it("fetches only approved active loans", async () => {
    loanApiClient.get.mockResolvedValueOnce({ data: loanApplicationsMock });

    const result = await fetchActiveLoanDetails(accountNumber);

    expect(loanApiClient.get).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.LOANS, {
      params: { accountNumber },
    });
    expect(result).toEqual([{ id: 1, status: "approved" }]);
  });

  it("throws an error when fetching active loans fails", async () => {
    const errorMessage = "Failed to fetch active loans";
    loanApiClient.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchActiveLoanDetails(accountNumber)).rejects.toThrow(errorMessage);
    expect(loanApiClient.get).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.LOANS, {
      params: { accountNumber },
    });
  });

  it("has correct loan options", () => {
    expect(LOAN_OPTIONS).toEqual([
      { value: "Home Loan", label: "Home Loan", interestRate: 6.5 },
      { value: "Personal Loan", label: "Personal Loan", interestRate: 12.0 },
      { value: "Gold Loan", label: "Gold Loan", interestRate: 7.0 },
      { value: "Education Loan", label: "Education Loan", interestRate: 10.5 },
    ]);
  });
});
