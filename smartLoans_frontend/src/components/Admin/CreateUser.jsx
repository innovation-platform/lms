import React, { useState } from 'react';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { userApiClient } from '../../services/apiClient';
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { PasswordValidator, FormValidator } from "../../utils/validator";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    roles: ['user']
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'roles') {
      setFormData(prevState => ({
        ...prevState,
        roles: [value]
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }

    // Real-time validation
    const { errors } = FormValidator.validateRegistrationData({
      ...formData,
      [name]: value
    });
    
    setErrors(prev => ({
      ...prev,
      [name]: errors[name] || ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const { isValid, errors: validationErrors } = FormValidator.validateRegistrationData(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }

    setLoading(true);

    try {
      const response = await userApiClient.post('/', formData);
      toast.success('User created successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        roles: ['user']
      });
      setErrors({});
    } catch (error) {
      if (error.validationErrors) {
        setErrors(error.validationErrors);
        Object.values(error.validationErrors).forEach(error => {
          toast.error(error.message);
        });
      } else {
        toast.error(error.response?.data?.message || 'Error creating user');
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordRules = PasswordValidator.validate(formData.password);
  const isPasswordValid = Object.values(passwordRules).every(rule => rule);

  return (
    <Container fluid className="p-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header className="text-white bg">
              <h4 className="mb-0">Create New User</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {errors.general && <div className="alert alert-danger">{errors.general}</div>}
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                        placeholder="Enter full name"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        placeholder="Enter email"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        className={`${!isPasswordValid && formData.password ? "border-warning" : ""}`}
                        placeholder="Enter password"
                      />
                      <small className="form-text">
                        <ul className="list-unstyled mt-2">
                          <li className={passwordRules.length ? "text-success" : "text-danger"}>
                            {passwordRules.length ? <MdCheckCircle className="me-1" /> : <MdCancel className="me-1" />}
                            At least 8 characters
                          </li>
                          <li className={passwordRules.uppercase ? "text-success" : "text-danger"}>
                            {passwordRules.uppercase ? <MdCheckCircle className="me-1" /> : <MdCancel className="me-1" />}
                            At least one uppercase letter
                          </li>
                          <li className={passwordRules.number ? "text-success" : "text-danger"}>
                            {passwordRules.number ? <MdCheckCircle className="me-1" /> : <MdCancel className="me-1" />}
                            At least one number
                          </li>
                          <li className={passwordRules.specialChar ? "text-success" : "text-danger"}>
                            {passwordRules.specialChar ? <MdCheckCircle className="me-1" /> : <MdCancel className="me-1" />}
                            At least one special character
                          </li>
                        </ul>
                      </small>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        isInvalid={!!errors.phone}
                        placeholder="Enter phone number"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    isInvalid={!!errors.address}
                    placeholder="Enter address"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Role <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="roles"
                    value={formData.roles[0]}
                    onChange={handleChange}
                  >
                    <option value="user">User</option>
                    <option value="banker">Banker</option>
                  </Form.Select>
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
                        Creating...
                      </>
                    ) : (
                      'Create User'
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

export default CreateUser;
