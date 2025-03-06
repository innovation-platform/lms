import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { BankerContext } from "../../contexts/BankerContext"; 

const ReviewedApplications = () => {
  const { loans, handleViewDetails } = useContext(BankerContext);

  return (
    <div>
      <h2>Reviewed Applications</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Loan Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loans
            .filter((loan) => loan.status.toLowerCase() !== "pending")
            .map((loan) => (
              <tr key={loan.loanId}>
                <td>{loan.customerName}</td>
                <td>₹{loan.loanAmount}</td>
                <td>{loan.status}</td>
                <td>
                  <Button variant="info" onClick={() => handleViewDetails(loan)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewedApplications;