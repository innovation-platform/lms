// src/test/components/EmiCalculator.test.jsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmiCalculator from '../components/Home/EmiCalculator';

describe('EmiCalculator', () => {
  it('renders with default values', () => {
    render(<EmiCalculator />);
    
    expect(screen.getByText(/EMI Calculator/i)).toBeInTheDocument();
    expect(screen.getByText(/Loan Amount: ₹500000/i)).toBeInTheDocument();
    expect(screen.getByText(/Interest Rate: 7.5%/i)).toBeInTheDocument();
    expect(screen.getByText(/Tenure: 60 months/i)).toBeInTheDocument();
  });

  it('updates loan amount when slider changes', () => {
    render(<EmiCalculator />);
    
    const slider = screen.getByLabelText(/Loan Amount/i);
    fireEvent.change(slider, { target: { value: '1000000' } });
    
    expect(screen.getByText(/Loan Amount: ₹1000000/i)).toBeInTheDocument();
  });

  it('updates interest rate when slider changes', () => {
    render(<EmiCalculator />);
    
    const slider = screen.getByLabelText(/Interest Rate/i);
    fireEvent.change(slider, { target: { value: '10' } });
    
    expect(screen.getByText(/Interest Rate: 10%/i)).toBeInTheDocument();
  });

  it('updates loan tenure when slider changes', () => {
    render(<EmiCalculator />);
    
    const slider = screen.getByLabelText(/Tenure/i);
    fireEvent.change(slider, { target: { value: '120' } });
    
    expect(screen.getByText(/Tenure: 120 months/i)).toBeInTheDocument();
  });

  it('calculates EMI correctly', () => {
    render(<EmiCalculator />);
    
    // Set known values
    const loanAmountSlider = screen.getByLabelText(/Loan Amount/i);
    const interestRateSlider = screen.getByLabelText(/Interest Rate/i);
    const tenureSlider = screen.getByLabelText(/Tenure/i);
    
    fireEvent.change(loanAmountSlider, { target: { value: '100000' } });
    fireEvent.change(interestRateSlider, { target: { value: '10' } });
    fireEvent.change(tenureSlider, { target: { value: '12' } });
    
    // Calculate expected EMI
    const P = 100000;
    const R = 10 / (12 * 100);
    const N = 12;
    const expectedEMI = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    
    expect(screen.getByText(new RegExp(`EMI: ₹${expectedEMI.toFixed(2)}/month`))).toBeInTheDocument();
  });

  it('displays total payment and interest', () => {
    render(<EmiCalculator />);
    
    // Set known values
    const loanAmountSlider = screen.getByLabelText(/Loan Amount/i);
    const interestRateSlider = screen.getByLabelText(/Interest Rate/i);
    const tenureSlider = screen.getByLabelText(/Tenure/i);
    
    fireEvent.change(loanAmountSlider, { target: { value: '100000' } });
    fireEvent.change(interestRateSlider, { target: { value: '10' } });
    fireEvent.change(tenureSlider, { target: { value: '12' } });
    
    // Calculate expected values
    const P = 100000;
    const R = 10 / (12 * 100);
    const N = 12;
    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = (emi * N).toFixed(2);
    const totalInterest = (totalPayment - P).toFixed(2);
    
    expect(screen.getByText(/Total Payment:\s*₹\d+/)).toBeInTheDocument();

    expect(screen.getByText(/Total Interest:\s*₹\d+/)).toBeInTheDocument();

  });
});
