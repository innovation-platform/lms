import { fetchPreclosureDetails, submitPreclosureRequest } from "../services/preClosureService";
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

describe("Preclosure Service", () => {
  const loanId = "12345";
  const preclosureData = { reason: "Early payment", amount: 50000 };
  const mockPreclosureResponse = { success: true, message: "Preclosure request successful" };

  afterEach(() => {
    vi.restoreAllMocks(); // Reset mocks after each test
  });

  it("fetches preclosure details successfully", async () => {
    loanApiClient.get.mockResolvedValueOnce({ data: mockPreclosureResponse });

    const result = await fetchPreclosureDetails(loanId);

    expect(loanApiClient.get).toHaveBeenCalledWith(`${API_CONFIG.ENDPOINTS.PRECLOSURE}/${loanId}`);
    expect(result).toEqual(mockPreclosureResponse);
  });

  it("throws an error when fetching preclosure details fails", async () => {
    const errorMessage = "Failed to fetch preclosure details";
    loanApiClient.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchPreclosureDetails(loanId)).rejects.toThrow(errorMessage);
    expect(loanApiClient.get).toHaveBeenCalledWith(`${API_CONFIG.ENDPOINTS.PRECLOSURE}/${loanId}`);
  });

  it("submits preclosure request successfully", async () => {
    loanApiClient.post.mockResolvedValueOnce({ data: mockPreclosureResponse });

    const result = await submitPreclosureRequest(loanId, preclosureData);

    expect(loanApiClient.post).toHaveBeenCalledWith(`${API_CONFIG.ENDPOINTS.PRECLOSURE}/${loanId}`, preclosureData);
    expect(result).toEqual(mockPreclosureResponse);
  });

  
  it("throws an error when submitting preclosure request fails", async () => {
    const errorMessage = "Failed to submit preclosure request";
    loanApiClient.post.mockRejectedValueOnce(new Error(errorMessage));

    await expect(submitPreclosureRequest(loanId, preclosureData)).rejects.toThrow(errorMessage);
    expect(loanApiClient.post).toHaveBeenCalledWith(`${API_CONFIG.ENDPOINTS.PRECLOSURE}/${loanId}`, preclosureData);
  });
});
