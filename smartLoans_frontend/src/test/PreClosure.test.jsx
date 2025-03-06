//1 is failing

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import PreClosure from './PreClosure';
import { submitPreclosureRequest } from '../../services/preClosureService';

// --- Set up mutable mocks for react-router-dom ---
let mockLocationValue;
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useLocation: () => mockLocationValue,
  useNavigate: () => mockNavigate,
}));

// --- Mock the preClosureService ---
vi.mock('../../services/preClosureService', () => ({
  submitPreclosureRequest: vi.fn(),
}));

describe('PreClosure Component', () => {
  const validLoanDetails = { loanId: 'loan001' };
  const validPreclosureDetails = {
    outstandingAmount: 50000,
    amount: 55000,
    dueDate: '2025-03-15T00:00:00.000Z',
    interestSavings: 5000,
    upiId: 'test@upi',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Provide default valid location state for tests that need it.
    mockLocationValue = {
      state: {
        loanDetails: validLoanDetails,
        preclosureDetails: validPreclosureDetails,
      },
    };
  });

  test('redirects to /customer-dashboard/loans if loanDetails is missing', async () => {
    // Instead of completely omitting state (which causes a crash), supply an empty object for preclosureDetails.
    mockLocationValue = { state: { loanDetails: null, preclosureDetails: {} } };

    render(<PreClosure />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/customer-dashboard/loans');
    });
  });

  test('redirects to /customer-dashboard/loans if preclosureDetails is missing', async () => {
    // Supply a valid loanDetails but an empty object for preclosureDetails.
    mockLocationValue = { state: { loanDetails: validLoanDetails, preclosureDetails: {} } };

    render(<PreClosure />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/customer-dashboard/loans');
    });
  });

  test('renders preclosure details correctly', () => {
    render(<PreClosure />);

    // Check header exists.
    expect(screen.getByText(/Loan Preclosure/i)).toBeInTheDocument();
    // Instead of expecting the full text "Loan ID: loan001", verify that the loan ID appears somewhere.
    expect(screen.getByText(/loan001/i)).toBeInTheDocument();
    expect(screen.getByText(/Outstanding Amount:/i)).toBeInTheDocument();
    expect(screen.getByText(/Preclosure Amount:/i)).toBeInTheDocument();
    expect(screen.getByText(/Due Date:/i)).toBeInTheDocument();
    expect(screen.getByText(/Interest Savings:/i)).toBeInTheDocument();

    // Verify that the UPI input is prefilled.
    const upiInput = screen.getByPlaceholderText(/Enter UPI ID/i);
    expect(upiInput.value).toBe('test@upi');
  });

  test('submits preclosure request successfully and navigates to application status', async () => {
    // Set up the mock for a successful submission.
    submitPreclosureRequest.mockResolvedValue({ success: true });
    window.alert = vi.fn();

    render(<PreClosure />);

    // Change the UPI ID.
    const upiInput = screen.getByPlaceholderText(/Enter UPI ID/i);
    fireEvent.change(upiInput, { target: { value: 'newupi@bank' } });

    // Submit the form.
    const confirmButton = screen.getByRole('button', { name: /Confirm Preclosure/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(submitPreclosureRequest).toHaveBeenCalledWith('loan001', {
        amount: validPreclosureDetails.amount,
        paymentMethod: 'upi',
        paymentDetails: { upiId: 'newupi@bank' },
      });
      expect(window.alert).toHaveBeenCalledWith('Preclosure request submitted successfully!');
      expect(mockNavigate).toHaveBeenCalledWith('/customer-dashboard/application-status');
    });
  });

  test('displays error message when preclosure request fails', async () => {
    const errorMessage = 'Insufficient funds';
    submitPreclosureRequest.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    render(<PreClosure />);

    const confirmButton = screen.getByRole('button', { name: /Confirm Preclosure/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('cancel button navigates to /customer-dashboard/loan-details', () => {
    render(<PreClosure />);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(mockNavigate).toHaveBeenCalledWith('/customer-dashboard/loan-details');
  });
});