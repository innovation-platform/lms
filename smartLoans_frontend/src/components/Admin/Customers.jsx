import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Container, Row, Col, Card } from "react-bootstrap";
import { getCustomers,deactivateCustomer } from "../../services/adminService";
import { useNavigate } from "react-router-dom";
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDeactivate] = useState(null);
  const navigate=useNavigate();
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        setError("Error fetching customers");
      }
    };

    fetchCustomers();
  }, [customers]);

  const handleAddCustomer = async () => {
    navigate('/admin-dashboard/create-user');
  };

  const handleDeactivateCustomer = async () => {
    try {
      await deactivateCustomer(customerToDelete.email);
      const updatedCustomers = customers.filter((customer) => customer._id !== customerToDelete._id && customer.active===true);
      setCustomers(updatedCustomers);
      setShowDeleteModal(false);
      toast.success("Customer deactivated successfully!");
    } catch (err) {
      setError("");
    }
  };

  const confirmDeactivateCustomer = (customer) => {
    setCustomerToDeactivate(customer);
    setShowDeleteModal(true);
  };

  return (
    <Container fluid>
      <h1 className="my-4">Customer Management</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Summary Cards */}
      <Row className="mb-4 justify-content-center">
        <Col md={6}>
          <Card className="text-center p-3">
            <h4>Total Customers</h4>
            <h3 style={{ color: "#41B3A2", fontSize: "2.5rem" }}>{customers.length}</h3>
          </Card>
        </Col>
      </Row>

      <Button className="mb-3" onClick={handleAddCustomer}>Add Customer</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>+91 {customer.phone}</td>
              <td>
                <Button variant="danger"  onClick={() => confirmDeactivateCustomer(customer)}>Deactivate</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {customerToDelete?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeactivateCustomer}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Customers;
