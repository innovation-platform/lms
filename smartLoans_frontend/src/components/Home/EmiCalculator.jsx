import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/EmiCalculator.css";

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanTenure, setLoanTenure] = useState(60);

  // EMI Calculation Formula
  const calculateEMI = (P, R, N) => {
    R = R / (12 * 100); // Monthly interest rate
    return (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  };

  const emi = calculateEMI(loanAmount, interestRate, loanTenure).toFixed(2);
  const totalPayment = (emi * loanTenure).toFixed(2);
  const totalInterest = (totalPayment - loanAmount).toFixed(2);

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4" style={{ color: "#0D7C66" }}>EMI Calculator</h2>

        {/* Loan Amount */}
        <div className="mb-4">
          <label htmlFor="loan-amount" className="form-label fw-bold" style={{ color: "#0D7C66" }}>Loan Amount: ₹{loanAmount}</label>
          <input
            id="loan-amount"
            type="range"
            min="100000"
            max="10000000"
            step="10000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="form-range w-100 custom-range"
          />
          <div className="d-flex justify-content-between position-relative">
            <span style={{ position: 'absolute', left: '0%' }}>₹1L</span>
            <span style={{ position: 'absolute', left: '20%' }}>₹20L</span>
            <span style={{ position: 'absolute', left: '40%' }}>₹40L</span>
            <span style={{ position: 'absolute', left: '60%' }}>₹60L</span>
            <span style={{ position: 'absolute', left: '80%' }}>₹80L</span>
            <span style={{ position: 'absolute', right: '0%' }}>₹1Cr</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="mb-4">
          <label htmlFor="interest" className="form-label fw-bold" style={{ color: "#0D7C66" }}>Interest Rate: {interestRate}%</label>
          <input
            id="interest"
            type="range"
            min="1"
            max="20"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="form-range w-100 custom-range"
          />
          <div className="d-flex justify-content-between position-relative">
            <span style={{ position: 'absolute', left: '0%' }}>1%</span>
            <span style={{ position: 'absolute', left: '25%' }}>5%</span>
            <span style={{ position: 'absolute', left: '50%' }}>10%</span>
            <span style={{ position: 'absolute', left: '75%' }}>15%</span>
            <span style={{ position: 'absolute', right: '0%' }}>20%</span>
          </div>
        </div>

        {/* Loan Tenure */}
        <div className="mb-4">
          <label htmlFor="tenure" className="form-label fw-bold" style={{ color: "#0D7C66" }}>Tenure: {loanTenure} months</label>
          <input
            id="tenure"
            type="range"
            min="12"
            max="240"
            step="12"
            value={loanTenure}
            onChange={(e) => setLoanTenure(Number(e.target.value))}
            className="form-range w-100 custom-range"
          />
          <div className="d-flex justify-content-between position-relative">
            <span style={{ position: 'absolute', left: '0%' }}>1 Yr</span>
            <span style={{ position: 'absolute', left: '25%' }}>5 Yrs</span>
            <span style={{ position: 'absolute', left: '50%' }}>10 Yrs</span>
            <span style={{ position: 'absolute', left: '75%' }}>15 Yrs</span>
            <span style={{ position: 'absolute', right: '0%' }}>20 Yrs</span>
          </div>
        </div>

        {/* Results */}
        <div className="p-4 bg-light border rounded text-center">
          <p className="fs-5 fw-bold" style={{ color: "#0D7C66" }}>EMI: ₹{emi}/month</p>
          <p className="text-secondary">Total Interest: ₹{totalInterest}</p>
          <p className="text-secondary">Total Payment: ₹{totalPayment}</p>
        </div>
      </div>
    </div>
  );
}
