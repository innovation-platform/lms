import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { userApiClient } from '../../services/apiClient';
import { API_CONFIG } from '../../config/apiConfig';

const ActivateUser = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);

    try {
      const response = await userApiClient.patch(API_CONFIG.ENDPOINTS.ACTIVATE, { email });
      toast.success('User activated successfully!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error activating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Header className="text-white bg">
              <h4 className="mb-0">Activate User</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter user's email address"
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    className='authButton' 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Activating...
                      </>
                    ) : (
                      'Activate User'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ActivateUser;
