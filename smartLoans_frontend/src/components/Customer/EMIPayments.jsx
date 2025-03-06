import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitEMIPayment } from '../../services/emiService';

const EMIPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loanDetails, emiDetails } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loanDetails || !emiDetails) {
      navigate('/customer-dashboard/loans');
    }
  }, [loanDetails, emiDetails, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const paymentData = {
        loanId: loanDetails.loanId,
        emiNumber: emiDetails.emiNumber,
        amount: emiDetails.totalDue,
        paymentMethod,
        paymentDetails: paymentMethod === 'upi' 
          ? { upiId } 
          : { cardNumber, expiryDate, cvv }
      };

      const response = await submitEMIPayment(paymentData);
      if (response.success) {
        alert('Payment Successful!');
        navigate('/customer-dashboard/loan-details');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Payment failed. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (!loanDetails || !emiDetails) return null;

  return (
    <Container className="py-5">
      <Card className="shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Card.Header className="text-white bg">
          <h4 className="mb-0">EMI Payment</h4>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <h5>Payment Details</h5>
            <div className="payment-info">
              <p><strong>Loan ID:</strong> {loanDetails.loanId}</p>
              <p><strong>EMI Number:</strong> {emiDetails.emiNumber}</p>
              <p><strong>Due Date:</strong> {new Date(emiDetails.dueDate).toLocaleDateString()}</p>
              <p><strong>Principal Amount:</strong> {formatCurrency(emiDetails.principal)}</p>
              <p><strong>Interest:</strong> {formatCurrency(emiDetails.interest)}</p>
              <p><strong>EMI Amount:</strong> {formatCurrency(emiDetails.amount)}</p>
              {emiDetails.lateFee > 0 && (
                <p className="text-danger">
                  <strong>Late Fee:</strong> {formatCurrency(emiDetails.lateFee)}
                </p>
              )}
              <p className="h5 mt-3">
                <strong>Total Due:</strong> {formatCurrency(emiDetails.totalDue)}
              </p>
            </div>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="upi">UPI</option>
                <option value="card">Credit/Debit Card</option>
              </Form.Select>
            </Form.Group>

            {paymentMethod === 'upi' ? (
              <Form.Group className="mb-3">
                <Form.Label>UPI ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter UPI ID"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
                <Form.Text className="text-muted">
                  Enter your UPI ID in the format username@bank
                </Form.Text>
              </Form.Group>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    pattern="\d{16}"
                    required
                  />
                </Form.Group>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 4) {
                            setExpiryDate(value.replace(/(\d{2})(\d{2})/, '$1/$2'));
                          }
                        }}
                        pattern="\d{2}/\d{2}"
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        pattern="\d{3}"
                        required
                      />
                    </Form.Group>
                  </div>
                </div>
              </>
            )}

            <div className="d-grid gap-2">
              <Button 
                type="submit" 
                style={{ backgroundColor: '#41B3A2', borderColor: '#41B3A2' }}
              >
                Pay {formatCurrency(emiDetails.totalDue)}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/customer-dashboard/loan-details')}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EMIPayment;
