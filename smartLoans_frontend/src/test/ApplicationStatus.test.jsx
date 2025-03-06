//done - 100%
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ApplicationStatus from './ApplicationStatus';
import { useAuth } from '../../contexts/AuthContext';
import { fetchLoanApplications } from '../../services/loanService';

vi.mock('../../contexts/AuthContext');
vi.mock('../../services/loanService');

describe('ApplicationStatus', () => {
  const mockUser = { accountNumber: '12345' };
  const mockApplications = [
    {
      _id: '1',
      loanType: 'Home Loan',
      loanAmount: 50000,
      status: 'Approved',
      submittedOn: '2023-01-01T00:00:00Z',
      approvedOn: '2023-01-05T00:00:00Z',
    },
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({ user: mockUser });
  });

  it('renders loading state initially', () => {
    fetchLoanApplications.mockResolvedValueOnce({ loans: [] });
    render(<ApplicationStatus />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message on fetch failure', async () => {
    fetchLoanApplications.mockRejectedValueOnce(new Error('Failed to fetch'));
    render(<ApplicationStatus />);
    await waitFor(() => expect(screen.getByText('Failed to fetch applications')).toBeInTheDocument());
  });

  it('renders no applications message when there are no applications', async () => {
    fetchLoanApplications.mockResolvedValueOnce({ loans: [] });
    render(<ApplicationStatus />);
    await waitFor(() => expect(screen.getByText('No loan applications found.')).toBeInTheDocument());
  });

  it('renders applications table when there are applications', async () => {
    fetchLoanApplications.mockResolvedValueOnce({ loans: mockApplications });
    render(<ApplicationStatus />);
    await waitFor(() => expect(screen.getByText('Loan Application Status')).toBeInTheDocument());
    expect(screen.getByText('Home Loan')).toBeInTheDocument();
    expect(screen.getByText('$50000')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('1/1/2023')).toBeInTheDocument();
    expect(screen.getByText('1/5/2023')).toBeInTheDocument();
  });
});