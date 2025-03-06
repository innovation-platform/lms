import { render, screen } from '@testing-library/react';
import { BankerContext } from '../contexts/BankerContext';
import BankerHome from '../components/Banker/BankerHome';
import { vi } from 'vitest';

const mockLoans = [
  { loanId: 1, customerName: 'John Doe', status: 'pending', loanAmount: 50000 },
  { loanId: 2, customerName: 'Jane Doe', status: 'approved', loanAmount: 100000 },
  { loanId: 3, customerName: 'Sam Smith', status: 'approved', loanAmount: 75000 },
  { loanId: 4, customerName: 'Alice Cooper', status: 'rejected', loanAmount: 20000 },
];

const mockContextValue = {
  loans: mockLoans,
};

describe('BankerHome', () => {
  test('displays loan statistics correctly', () => {
    render(
      <BankerContext.Provider value={mockContextValue}>
        <BankerHome />
      </BankerContext.Provider>
    );

    // Check if the statistics are displayed correctly
    expect(screen.getByText((content, element) => 
      content.includes('Total Applications:') && element.textContent.includes('4')
    )).toBeInTheDocument();
    expect(screen.getByText('Pending: 1')).toBeInTheDocument();
    expect(screen.getByText('Approved: 2')).toBeInTheDocument();
    expect(screen.getByText('Rejected: 1')).toBeInTheDocument();
  });

  test('renders Bar Chart with correct data', () => {
    render(
      <BankerContext.Provider value={mockContextValue}>
        <BankerHome />
      </BankerContext.Provider>
    );

    // Check if the bar chart is rendered (using a class or something unique to chart.js)
    const chartElement = screen.getByRole('img'); // Chart.js renders as a canvas or img
    expect(chartElement).toBeInTheDocument();
  });

  test('renders circular progress bar with approved loans', () => {
    render(
      <BankerContext.Provider value={mockContextValue}>
        <BankerHome />
      </BankerContext.Provider>
    );

    // Check if the progress circle is displayed by using `svg` tag instead of role
    const progressCircle = screen.getByTagName('svg');
    expect(progressCircle).toBeInTheDocument();

    // Check if the progress text is displaying the correct approved loans vs target
    const progressText = screen.getByText('2/50');
    expect(progressText).toBeInTheDocument();
  });
});
