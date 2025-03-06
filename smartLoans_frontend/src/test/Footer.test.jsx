import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import { describe, it, expect } from 'vitest';

describe('Footer Component', () => {
  it('renders the footer component', () => {
    render(<Footer />);
    expect(screen.getAllByText(/SMART LOANS/i).length).toBeGreaterThan(0);
  });

  it('renders company info', () => {
    render(<Footer />);
    expect(screen.getByText(/Secure. Reliable. Efficient./i)).toBeInTheDocument();
    expect(screen.getByText(/Take control of your financial future./i)).toBeInTheDocument();
  });

  it('renders quick links', () => {
    render(<Footer />);
    expect(screen.getByText(/🏠 Home/i)).toBeInTheDocument();
    expect(screen.getByText(/📄 Apply for Loan/i)).toBeInTheDocument();
    expect(screen.getByText(/💳 Repayment/i)).toBeInTheDocument();
    expect(screen.getByText(/📞 Contact Us/i)).toBeInTheDocument();
  });

  it('renders contact information', () => {
    render(<Footer />);
    expect(screen.getByText(/Bren Optimus, Bengaluru/i)).toBeInTheDocument();
    expect(screen.getByText(/\+91 9000101234/i)).toBeInTheDocument();
    expect(screen.getByText(/smartloans.app@gmail.com/i)).toBeInTheDocument();
  });

  it('renders social media icons', () => {
    render(<Footer />);
    expect(screen.getAllByRole('link').length).toBeGreaterThanOrEqual(4);
  });

  it('renders copyright information', () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} SMART LOANS`, 'i'))).toBeInTheDocument();
  });
});