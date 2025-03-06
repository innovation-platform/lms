import { render, screen, fireEvent } from '@testing-library/react';
import { BankerContext } from '../contexts/BankerContext';
import LoanApplications from '../components/Banker/LoanApplications';
import { vi } from 'vitest';

const mockHandleViewDetails = vi.fn();

const mockLoans = [
  {
    loanId: 1,
    customerName: 'John Doe',
    loanAmount: 50000,
    status: 'pending',
  },
  {
    loanId: 2,
    customerName: 'Jane Doe',
    loanAmount: 100000,
    status: 'approved',
  },
  {
    loanId: 3,
    customerName: 'Sam Smith',
    loanAmount: 75000,
    status: 'pending',
  },
];

describe('LoanApplications', () => {
  test('renders pending loans correctly', () => {
    render(
      <BankerContext.Provider
        value={{
          loans: mockLoans,
          handleViewDetails: mockHandleViewDetails,
        }}
      >
        <LoanApplications />
      </BankerContext.Provider>
    );

    // Check that only the pending loans are rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('₹50000')).toBeInTheDocument();
    expect(screen.getByText('Sam Smith')).toBeInTheDocument();
    expect(screen.getByText('₹75000')).toBeInTheDocument();
    expect(screen.queryByText('Jane Doe')).not.toBeInTheDocument(); // Should not appear because it's approved
  });

  test('shows "No applications to be reviewed at the moment" when no pending loans', () => {
    const emptyLoans = [
      {
        loanId: 1,
        customerName: 'Jane Doe',
        loanAmount: 100000,
        status: 'approved',
      },
    ];

    render(
      <BankerContext.Provider
        value={{
          loans: emptyLoans,
          handleViewDetails: mockHandleViewDetails,
        }}
      >
        <LoanApplications />
      </BankerContext.Provider>
    );

    // Check that the "No applications to be reviewed" message is shown
    expect(screen.getByText('No applications to be reviewed at the moment.')).toBeInTheDocument();
  });

  test('calls handleViewDetails when "Review Application" button is clicked', () => {
    render(
      <BankerContext.Provider
        value={{
          loans: mockLoans,
          handleViewDetails: mockHandleViewDetails,
        }}
      >
        <LoanApplications />
      </BankerContext.Provider>
    );

    // Get the "Review Application" button for the first pending loan
    const reviewButton = screen.getAllByRole('button', { name: /Review Application/i })[0];

    // Simulate a click event
    fireEvent.click(reviewButton);

    // Check if the handleViewDetails function was called with correct parameters
    expect(mockHandleViewDetails).toHaveBeenCalledWith(mockLoans[0], 0);
  });
});
