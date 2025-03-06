import React, { useState, useEffect } from "react";
import { Modal, Button, Card, Row, Col, Container, Table, Badge } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { fetchEMIHistory } from "../../services/emiService";
import { fetchActiveLoanDetails } from "../../services/loanService";
import { fetchPreclosureDetails } from "../../services/preClosureService";
import { AuthService } from "../../services/AuthService";
import { useAuth } from "../../contexts/AuthContext";

const LoanDetails = () => {
  const navigate = useNavigate();
  const {user}=useAuth();
  const [loanDetails, setLoanDetails] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [emiHistory, setEmiHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using IIFE (Immediately Invoked Function Expression)
    (async () => {
      try {
        const activeLoans = await fetchActiveLoanDetails(user.accountNumber);
        console.log("activeLoans",activeLoans);
        setLoanDetails(activeLoans);
      } catch (error) {
        console.error("Error fetching loan details", error);
        setLoanDetails([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
 
  useEffect(() => {
    
    getLoanDetails();
  }, []);
 
  useEffect(() => {
    if (selectedLoan) {
      getEMIHistory(selectedLoan.loanId);
    }
  }, [selectedLoan]);
 
  const getLoanDetails = async () => {
    try {
      console.log("user",user);
      setLoading(true);
      const activeLoans = await fetchActiveLoanDetails(user.accountNumber);
      setLoanDetails(activeLoans);
    } catch (error) {
      console.error("Error fetching loan details", error);
      setLoanDetails([]);
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR'
    }) : '₹0';
  };
 
  const handleViewEMI = (loan) => {
    setSelectedLoan(loan);
  };
  const handlePayEMI = async (emi) => {
    navigate('/customer-dashboard/payment', { state: { loanDetails: selectedLoan, emiDetails: {
      emiNumber: emi.emiNumber,
      dueDate: emi.dueDate,
      amount: emi.amount,
      principal: emi.principal,
      interest: emi.interest,
      lateFee: emi.lateFee || 0,
      totalDue: emi.amount + (emi.lateFee || 0)
    } } });
  };
   
  const getEMIHistory = async (loanId) => {
    try {
      const history = await fetchEMIHistory(loanId);
      setEmiHistory(history);
    } catch (error) {
      console.error("Error fetching EMI history:", error);
      setEmiHistory([]);
    }
  };
 
  const handlePreClosure = async (loan) => {
    try {
      const preclosureDetails = await fetchPreclosureDetails(loan.loanId);
      navigate('/customer-dashboard/preclosure', {
        state: {
          loanDetails: loan,
          preclosureDetails
        }
      });
    } catch (error) {
      console.error("Error fetching preclosure details:", error);
    }
  };
 
 
  // const getLoanProgress = (loan) => {
  //   return ((loan.paidEmis || 0) / (loan.totalEmis || 1)) * 100;
  // };
 
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
 
  if (!loanDetails.length) {
    return <div className="text-center mt-5">No active loans found.</div>;
  }
 
  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        {loanDetails.map((loan, index) => (
          <Col key={index} xs={12} sm={8} md={6} lg={5} className="mb-4">
            <Card className="h-100 shadow border-0">
              <Card.Body>
                <Card.Title className="text-center mb-3">Loan Details</Card.Title>
                <Card.Text>
                  <strong>Loan ID:</strong> {loan.loanId}<br />
                  <strong>Type:</strong> {loan.loanType || 'N/A'}<br />
                  <strong>Amount:</strong> {formatCurrency(loan.loanAmount)}<br />
                  <strong>EMI:</strong> {formatCurrency(loan.emiAmount)}<br />
                  <strong>Remaining Principal:</strong> {formatCurrency(loan.remainingPrincipal)}<br />
                  <strong>Progress:</strong> {loan.paidEmis || 0} of {loan.totalEmis || 0} EMIs<br />
                  {loan.nextEmiDate && (
                    <><strong>Next EMI Date:</strong> {new Date(loan.nextEmiDate).toLocaleDateString()}<br /></>
                  )}
                  <div className="progress mt-2">
                    <div
                      className="progress-bar bg-success"
                      style={{ width: `${((loan.paidEmis || 0) / (loan.totalEmis || 1)) * 100}%` }}
                    >
                      {Math.round(((loan.paidEmis || 0) / (loan.totalEmis || 1)) * 100)}%
                    </div>
                  </div>
                </Card.Text>
                <div className="d-flex justify-content-between mt-3">
                  <Button variant="primary"
                    style={{ backgroundColor: '#007BFF', borderColor: '#41B3A2', color: 'black' }}
                    onClick={() => handleViewEMI(loan)}>
                    View EMI Details
                  </Button>
                  {loan.status !== 'Completed' && (
                    <Button variant="warning"
                      style={{ backgroundColor: '#41B3A2', borderColor: '#41B3A2', color: '#fff' }}
                      onClick={() => handlePreClosure(loan)}>
                      Pre-Close Loan
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
 
      {/* EMI History Modal */}
      {selectedLoan && (
        <Modal show={true} onHide={() => setSelectedLoan(null)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>EMI History - Loan ID: {selectedLoan.loanId}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {emiHistory.length > 0 ? (
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>EMI No.</th>
                    <th>Due Date</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>EMI Amount</th>
                    <th>Status</th>
                    <th>Payment Date</th>
                    <th>Late Fee</th>
                    <th>Total Paid</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {emiHistory.map((emi) => (
                    <tr key={emi.emiNumber}>
                      <td>{emi.emiNumber}</td>
                      <td>{new Date(emi.dueDate).toLocaleDateString()}</td>
                      <td>{formatCurrency(emi.principal)}</td>
                      <td>{formatCurrency(emi.interest)}</td>
                      <td>{formatCurrency(emi.amount)}</td>
                      <td>
                        <Badge bg={emi.status === 'Paid' ? 'success' : 'warning'}>
                          {emi.status}
                        </Badge>
                      </td>
                      <td>{emi.paymentDate ? new Date(emi.paymentDate).toLocaleDateString() : '-'}</td>
                      <td>{formatCurrency(emi.lateFee)}</td>
                      <td>{formatCurrency(emi.totalPaid || emi.amount)}</td>
                      <td>
                        {emi.status === 'Pending' && emi.canPay && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handlePayEMI(emi)}
                          >
                            Pay Now
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center p-3">No EMI records found.</div>
            )}
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};
 
export default LoanDetails;
 