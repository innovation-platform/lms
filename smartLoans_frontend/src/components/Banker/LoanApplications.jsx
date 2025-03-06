import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { BankerContext } from "../../contexts/BankerContext";
 
const LoanApplications = () => {
  const { loans, handleViewDetails } = useContext(BankerContext);
 
  return (
    <div>
      <h2>Loan Applications</h2>
      {loans.filter((loan) => loan.status.toLowerCase() === "pending").length > 0 ? (
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
              .filter((loan) => loan.status.toLowerCase() === "pending")
              .map((loan, loanIndex) => (
                <tr key={loan.loanId}>
                  <td>{loan.customerName}</td>
                  <td>₹{loan.loanAmount}</td>
                  <td>{loan.status}</td>
                  <td>
                    <Button
                      variant="primary"
                      style={{ backgroundColor: "#E3735E", borderColor: "green" }}
                      onClick={() => handleViewDetails(loan, loanIndex)}
                    >
                      Review Application
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p>No applications to be reviewed at the moment.</p>
      )}
    </div>
  );
};
 
export default LoanApplications;
 