import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Container, Row, Col, Card } from "react-bootstrap";
import { getBankers, deactivateBanker } from "../../services/adminService";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
const Bankers = () => {
  const [bankers, setBankers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [bankerToDelete, setBankerToDelete] = useState(null);
  const [selectedBanker, setSelectedBanker] = useState(null);
  const navigate=useNavigate();
  useEffect(() => {
    const fetchBankers = async () => {
      try {
        const data = await getBankers();
        setBankers(data.filter(banker=>banker.active===true));
      } catch (err) {
        setError("Error fetching bankers");
      }
    };
    fetchBankers();
  }, [bankers]);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setSelectedBanker(null);
  };

  const handleAddBanker = async () => {
    navigate('/admin-dashboard/create-user');
  };

  const openDeleteConfirmation = (banker) => {
    setBankerToDelete(banker);
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmation = () => {
    setBankerToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const handleDeactivateBanker = async () => {
    try {
      await deactivateBanker(bankerToDelete.email);
      setBankers(bankers.filter(b => b._id !== bankerToDelete._id && b.active===true));
      closeDeleteConfirmation();
      toast.success("Banker deleted successfully!");
    } catch (err) {
      console.error("Error deleting banker:", err.response?.data || err.message);
      setError("Error deleting banker");
    }
  };

  const viewBanker = (banker) => {
    setSelectedBanker(banker);
    setShowModal(true);
  };


  return (
    <Container fluid>
      <h1 className="my-4">Banker Management</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Row className="mb-4 justify-content-center">
        <Col md={6}>
          <Card className="text-center p-3">
            <h4>Total Bankers</h4>
            <h3 style={{ color: "#41B3A2", fontSize: "2.5rem" }}>{bankers.length}</h3>
          </Card>
        </Col>
      </Row>
      <Button className="mb-3" onClick={handleAddBanker}>Add Banker</Button>
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
          {bankers.map((banker) => (
            <tr key={banker.banker_id || banker.email}> 
              <td>{banker.name}</td>
              <td>{banker.email}</td>
              <td>+91 {banker.phone}</td>
              <td>
                <Button variant="danger" onClick={() => openDeleteConfirmation(banker)}>Deactivate</Button>
              </td>
            </tr>
          ))}
        </tbody>

      </Table>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirmation} onHide={closeDeleteConfirmation} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to deactivate {bankerToDelete?.name}? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteConfirmation}>Cancel</Button>
          <Button variant="danger" onClick={handleDeactivateBanker}>Deactivate</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Bankers;