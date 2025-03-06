import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitPreclosureRequest } from '../../services/preClosureService';

const PreClosure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loanDetails, preclosureDetails } = location.state || {};
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState(preclosureDetails.upiId || '');

  useEffect(() => {
    if (!loanDetails || !preclosureDetails) {
      navigate('/customer-dashboard/loans');
    }
  }, [loanDetails, preclosureDetails, navigate]);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await submitPreclosureRequest(loanDetails.loanId, {
        amount: preclosureDetails.amount,
        paymentMethod: 'upi',
        paymentDetails: {
          upiId: upiId
        }
      });

      if (response.success) {
        alert('Preclosure request submitted successfully!');
        navigate('/customer-dashboard/application-status');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Preclosure request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (!loanDetails || !preclosureDetails) return null;

  return (
    <Container className="py-5">
      <Card className="shadow-sm" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Card.Header className="text-white bg">
          <h4 className="mb-0">Loan Preclosure</h4>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <h5>Preclosure Details</h5>
            <div className="payment-info">
              <p><strong>Loan ID:</strong> {loanDetails.loanId}</p>
              <p><strong>Outstanding Amount:</strong> {formatCurrency(preclosureDetails.outstandingAmount)}</p>
              <p><strong>Preclosure Amount:</strong> {formatCurrency(preclosureDetails.amount)}</p>
              <p><strong>Due Date:</strong> {new Date(preclosureDetails.dueDate).toLocaleDateString()}</p>
              <p><strong>Interest Savings:</strong> {formatCurrency(preclosureDetails.interestSavings)}</p>
            </div>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleConfirm}>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select
                value="upi"
                onChange={(e) => e.target.value = "upi"}
              >
                <option value="upi">UPI</option>
              </Form.Select>
            </Form.Group>

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

            <div className="d-grid gap-2">
              <Button
                type="submit"
                style={{ backgroundColor: '#41B3A2', borderColor: '#41B3A2' }}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  'Confirm Preclosure'
                )}
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

export default PreClosure;