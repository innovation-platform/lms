import { describe, it, expect, vi } from 'vitest';
import { fetchEMIHistory, submitEMIPayment } from '../services/emiService';
import { loanApiClient } from '../services/apiClient';
import { API_CONFIG } from '../config/apiConfig';

vi.mock('../services/apiClient', () => ({
  loanApiClient: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('emiService', () => {
  const loanId = '12345';
  const paymentData = { loanId: '12345', amount: 5000 };
  
  it('should fetch EMI history successfully', async () => {
    const mockResponse = { data: [{ month: 'Jan', amount: 1000 }, { month: 'Feb', amount: 1000 }] };
    loanApiClient.get.mockResolvedValueOnce(mockResponse);

    const result = await fetchEMIHistory(loanId);

    expect(loanApiClient.get).toHaveBeenCalledWith(`${API_CONFIG.ENDPOINTS.EMI_HISTORY}/${loanId}`);
    expect(result).toEqual(mockResponse.data);
  });

  it('should handle errors when fetching EMI history', async () => {
    const errorMessage = 'Failed to fetch EMI history';
    loanApiClient.get.mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchEMIHistory(loanId)).rejects.toThrow(errorMessage);
    expect(loanApiClient.get).toHaveBeenCalledWith(`${API_CONFIG.ENDPOINTS.EMI_HISTORY}/${loanId}`);
  });

  it('should submit EMI payment successfully', async () => {
    const mockResponse = { data: { message: 'Payment successful' } };
    loanApiClient.patch.mockResolvedValueOnce(mockResponse);

    const result = await submitEMIPayment(paymentData);

    expect(loanApiClient.patch).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.EMI_PAYMENT, paymentData);
    expect(result).toEqual(mockResponse.data);
  });

  it('should handle errors when submitting EMI payment', async () => {
    const errorMessage = 'Payment failed';
    loanApiClient.patch.mockRejectedValueOnce(new Error(errorMessage));

    await expect(submitEMIPayment(paymentData)).rejects.toThrow(errorMessage);
    expect(loanApiClient.patch).toHaveBeenCalledWith(API_CONFIG.ENDPOINTS.EMI_PAYMENT, paymentData);
  });
});
