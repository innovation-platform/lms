import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EMIPayment from '../EMIPayment';
import { submitEMIPayment } from '../../services/emiService';
import { useLocation, useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', () => {
  const actual = vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
    useNavigate: vi.fn(),
  };
});

vi.mock('../../services/emiService', () => ({
  submitEMIPayment: vi.fn(),
}));

describe('EMIPayment Component', () => {
  const mockNavigate = vi.fn();
  const defaultState = {
    state: {
      loanDetails: { loanId: '1234' },
      emiDetails: {
        emiNumber: 1,
        dueDate: '2023-01-01T00:00:00.000Z',
        principal: 1000,
        interest: 200,
        amount: 1200,
        lateFee: 0,
        totalDue: 1200,
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useLocation.mockReturnValue(defaultState);
    useNavigate.mockReturnValue(mockNavigate);
    global.alert = vi.fn();
  });

  test('redirects if loanDetails or emiDetails are missing', async () => {
    useLocation.mockReturnValue({});
    render(<EMIPayment />);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/customer-dashboard/loans');
    });
  });

  test('renders payment details correctly', () => {
    render(<EMIPayment />);
    expect(screen.getByText(/Loan ID:/)).toHaveTextContent('Loan ID: 1234');
    expect(screen.getByText(/EMI Number:/)).toHaveTextContent('EMI Number: 1');
    expect(screen.getByText(/Principal Amount:/)).toHaveTextContent('Principal Amount:');
    expect(screen.getByText(/Interest:/)).toHaveTextContent('Interest:');
    expect(screen.getByText(/EMI Amount:/)).toHaveTextContent('EMI Amount:');
    expect(screen.getByText(/Total Due:/)).toHaveTextContent('Total Due:');
    expect(screen.getByText(/Due Date:/)).toBeInTheDocument();
  });

  test('renders late fee if applicable', () => {
    const stateWithLateFee = {
      state: {
        loanDetails: { loanId: '1234' },
        emiDetails: {
          emiNumber: 1,
          dueDate: '2023-01-01T00:00:00.000Z',
          principal: 1000,
          interest: 200,
          amount: 1200,
          lateFee: 50,
          totalDue: 1250,
        },
      },
    };
    useLocation.mockReturnValue(stateWithLateFee);
    render(<EMIPayment />);
    expect(screen.getByText(/Late Fee:/)).toHaveTextContent('Late Fee:');
    expect(screen.getByText(/Total Due:/)).toHaveTextContent('Total Due:');
  });

  test('submits UPI payment successfully', async () => {
    submitEMIPayment.mockResolvedValue({ success: true });
    render(<EMIPayment />);
    const upiInput = screen.getByPlaceholderText('Enter UPI ID');
    fireEvent.change(upiInput, { target: { value: 'user@bank' } });
    // Payment method is UPI by default.
    const payButton = screen.getByRole('button', { name: /Pay/ });
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(submitEMIPayment).toHaveBeenCalledWith({
        loanId: '1234',
        emiNumber: 1,
        amount: 1200,
        paymentMethod: 'upi',
        paymentDetails: { upiId: 'user@bank' },
      });
      expect(global.alert).toHaveBeenCalledWith('Payment Successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/customer-dashboard/loan-details');
    });
  });

  test('handles UPI payment error', async () => {
    submitEMIPayment.mockRejectedValue({
      response: { data: { message: 'UPI error' } },
    });
    render(<EMIPayment />);
    const upiInput = screen.getByPlaceholderText('Enter UPI ID');
    fireEvent.change(upiInput, { target: { value: 'user@bank' } });
    const payButton = screen.getByRole('button', { name: /Pay/ });
    fireEvent.click(payButton);
    const errorAlert = await screen.findByText('UPI error');
    expect(errorAlert).toBeInTheDocument();
  });

  test('submits card payment successfully', async () => {
    submitEMIPayment.mockResolvedValue({ success: true });
    render(<EMIPayment />);
    // Switch payment method to card.
    const paymentMethodSelect = screen.getByLabelText('Payment Method');
    fireEvent.change(paymentMethodSelect, { target: { value: 'card' } });
    // Fill card fields.
    const cardNumberInput = screen.getByPlaceholderText('1234 5678 9012 3456');
    fireEvent.change(cardNumberInput, { target: { value: '1234567890123456' } });
    const expiryDateInput = screen.getByPlaceholderText('MM/YY');
    fireEvent.change(expiryDateInput, { target: { value: '1225' } });
    const cvvInput = screen.getByPlaceholderText('123');
    fireEvent.change(cvvInput, { target: { value: '123' } });

    const payButton = screen.getByRole('button', { name: /Pay/ });
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(submitEMIPayment).toHaveBeenCalledWith({
        loanId: '1234',
        emiNumber: 1,
        amount: 1200,
        paymentMethod: 'card',
        paymentDetails: { cardNumber: '1234567890123456', expiryDate: '12/25', cvv: '123' },
      });
      expect(global.alert).toHaveBeenCalledWith('Payment Successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/customer-dashboard/loan-details');
    });
  });

  test('handles card payment error', async () => {
    submitEMIPayment.mockRejectedValue({
      response: { data: { message: 'Card error' } },
    });
    render(<EMIPayment />);
    const paymentMethodSelect = screen.getByLabelText('Payment Method');
    fireEvent.change(paymentMethodSelect, { target: { value: 'card' } });
    const cardNumberInput = screen.getByPlaceholderText('1234 5678 9012 3456');
    fireEvent.change(cardNumberInput, { target: { value: '1234567890123456' } });
    const expiryDateInput = screen.getByPlaceholderText('MM/YY');
    fireEvent.change(expiryDateInput, { target: { value: '1225' } });
    const cvvInput = screen.getByPlaceholderText('123');
    fireEvent.change(cvvInput, { target: { value: '123' } });
    const payButton = screen.getByRole('button', { name: /Pay/ });
    fireEvent.click(payButton);
    const errorAlert = await screen.findByText('Card error');
    expect(errorAlert).toBeInTheDocument();
  });

  test('cancel button navigates to loan details', () => {
    render(<EMIPayment />);
    const cancelButton = screen.getByRole('button', { name: /Cancel/ });
    fireEvent.click(cancelButton);
    expect(mockNavigate).toHaveBeenCalledWith('/customer-dashboard/loan-details');
  });

  test('card number input restricts to 16 digits', () => {
    render(<EMIPayment />);
    // Switch to card payment.
    const paymentMethodSelect = screen.getByLabelText('Payment Method');
    fireEvent.change(paymentMethodSelect, { target: { value: 'card' } });
    const cardNumberInput = screen.getByPlaceholderText('1234 5678 9012 3456');
    fireEvent.change(cardNumberInput, { target: { value: '12345678901234567890' } });
    expect(cardNumberInput.value).toBe('1234567890123456');
  });

  test('CVV input restricts to 3 digits', () => {
    render(<EMIPayment />);
    // Switch to card payment.
    const paymentMethodSelect = screen.getByLabelText('Payment Method');
    fireEvent.change(paymentMethodSelect, { target: { value: 'card' } });
    const cvvInput = screen.getByPlaceholderText('123');
    fireEvent.change(cvvInput, { target: { value: '12345' } });
    expect(cvvInput.value).toBe('123');
  });

  test('expiry date input formats correctly', () => {
    render(<EMIPayment />);
    // Switch to card payment.
    const paymentMethodSelect = screen.getByLabelText('Payment Method');
    fireEvent.change(paymentMethodSelect, { target: { value: 'card' } });
    const expiryDateInput = screen.getByPlaceholderText('MM/YY');
    fireEvent.change(expiryDateInput, { target: { value: '1123' } });
    expect(expiryDateInput.value).toBe('11/23');
  });
});