import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "bootstrap/dist/css/bootstrap.min.css";
import { BankerContext } from "../../contexts/BankerContext"; 

const BankerHome = () => {
  const { loans } = useContext(BankerContext);
  const totalLoans = loans.length;
  const pendingLoans = loans.filter(loan => loan.status.toLowerCase() === "pending").length;
  const approvedLoans = loans.filter(loan => loan.status.toLowerCase() === "approved").length;
  const rejectedLoans = loans.filter(loan => loan.status.toLowerCase() === "rejected").length;
  const targetLoans = 50; // Set loan target
  const chartData = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        label: "Loan Applications",
        data: [pendingLoans, approvedLoans, rejectedLoans],
        backgroundColor: ["#ffc107", "#28a745", "#dc3545"],
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Dashboard</h2>
      
      {/* Loan statistics */}
      <div className="row text-center mb-3">
        <div className="col-md-3">
          <p><strong>Total Applications:</strong> {totalLoans}</p>
        </div>
        <div className="col-md-3">
          <p><strong>Pending:</strong> {pendingLoans}</p>
        </div>
        <div className="col-md-3">
          <p><strong>Approved:</strong> {approvedLoans}</p>
        </div>
        <div className="col-md-3">
          <p><strong>Rejected:</strong> {rejectedLoans}</p>
        </div>
      </div>

      <div className="row">
        {/* Bar Chart */}
        <div className="col-md-6 mb-4">
          <Bar data={chartData} />
        </div>

        {/* Circular Progress Bar for Approved Loans */}
        <div className="col-md-6 mb-4">
          <h5>Approved Loans vs Target</h5>
          <div className="d-flex justify-content-center">
            <div className="progress-circle">
              <svg viewBox="0 0 36 36" className="circular-chart green">
                <path className="circle-bg"
                  d="M18 2.084a 15.915 15.915 0 0 1 0 31.832 15.915 15.915 0 0 1 0-31.832" />
                <path className="circle"
                  strokeDasharray={`${(approvedLoans / targetLoans) * 100}, 100`}
                  d="M18 2.084a 15.915 15.915 0 0 1 0 31.832 15.915 15.915 0 0 1 0-31.832" />
              </svg>
              <p className="progress-text">{approvedLoans}/{targetLoans}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankerHome;
