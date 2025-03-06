import { render, screen, fireEvent } from '@testing-library/react';
import { BankerContext } from '../contexts/BankerContext';
import ReviewedApplications from '../components/Banker/ReviewedApplications';

// Mock the BankerContext provider for testing
const mockHandleViewDetails = vi.fn();

const mockLoans = [
  {
    loanId: 1,
    customerName: 'John Doe',
    loanAmount: 50000,
    status: 'approved',
  },
  {
    loanId: 2,
    customerName: 'Jane Smith',
    loanAmount: 100000,
    status: 'rejected',
  },
  {
    loanId: 3,
    customerName: 'Emily Davis',
    loanAmount: 150000,
    status: 'pending',
  },
];

describe('ReviewedApplications', () => {
  test('renders the table with non-pending loans', () => {
    render(
      <BankerContext.Provider value={{ loans: mockLoans, handleViewDetails: mockHandleViewDetails }}>
        <ReviewedApplications />
      </BankerContext.Provider>
    );

    // Check if table headers are present
    expect(screen.getByText(/customer name/i)).toBeInTheDocument();
    expect(screen.getByText(/loan amount/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/action/i)).toBeInTheDocument();

    // Check that only 2 loans are rendered (the "pending" one should be excluded)
    expect(screen.getAllByRole('row')).toHaveLength(3); // 1 header row + 2 data rows

    // Ensure "Emily Davis" loan (status: pending) is not displayed
    expect(screen.queryByText(/Emily Davis/i)).not.toBeInTheDocument();
  });

  test('calls handleViewDetails when "View Details" button is clicked', () => {
    render(
      <BankerContext.Provider value={{ loans: mockLoans, handleViewDetails: mockHandleViewDetails }}>
        <ReviewedApplications />
      </BankerContext.Provider>
    );

    // Click on the "View Details" button for the first loan (John Doe)
    const viewDetailsButton = screen.getAllByRole('button', { name: /view details/i })[0];
    fireEvent.click(viewDetailsButton);

    // Ensure handleViewDetails was called with the correct loan data
    expect(mockHandleViewDetails).toHaveBeenCalledWith(mockLoans[0]);
  });
});
