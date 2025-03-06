import React, { useState, useEffect } from "react";
import { Container, Form, Button, Modal, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { updateUserProfile, changePassword } from "../../services/profileService";
import AuthService from "../../services/AuthService";
import axios from "axios";
const ProfilePage = () => {
  const { user, setUser, token, setToken } = useAuth();
  const [hover, setHover] = useState(false);
  const [formData, setFormData] = useState({
    accountNumber: "",
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Fetch current user data when component mounts
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await AuthService.getCurrentUser();
        if (response && response.claims) {
          setFormData({
            accountNumber: response.claims.accountNumber || "",
            name: response.claims.name || "",
            email: response.claims.email || "",
            phone: response.claims.phone || "",
            address: response.claims.address || ""
          });
        }
      } catch (error) {
        setError("Failed to fetch user details.");
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, []);

  // Handle input change for user details
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await updateUserProfile(formData);
      
      if (response.token) {
        // Update token in session storage and axios defaults
        sessionStorage.setItem("token", response.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.token}`;
        setToken(response.token);
      }
  
      // Fetch updated user details
      const updatedUserData = await AuthService.getCurrentUser();
      if (updatedUserData && updatedUserData.claims) {
        const { accountNumber, phone, address, ...userInfo } = updatedUserData.claims;
        setUser(userInfo);
        sessionStorage.setItem("user", JSON.stringify(userInfo));
      }
  
      setMessage("Profile updated successfully!");
    } catch (error) {
      setError(`Failed to update profile. ${error.message}`);
    }
  };
  

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await changePassword({
        ...passwordData,
        email: formData.email
      });
      setMessage("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setError("Failed to change password.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">User Profile</h2>
      
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Account Number</Form.Label>
          <Form.Control type="text" value={formData.accountNumber} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleInputChange} 
            disabled
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange}
            disabled
          />
        </Form.Group>


        <Form.Group className="mb-3">
          <Form.Label>Mobile no.</Form.Label>
          <Form.Control 
            type="text" 
            name="phone" 
            value={formData.phone} 
            onChange={handleInputChange} 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control 
            type="text" 
            name="address" 
            value={formData.address} 
            onChange={handleInputChange} 
          />
        </Form.Group>

        <Button
      onClick={handleSaveChanges}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        backgroundColor: hover ? "#41B3A2" : "white",
        color: hover ? "white" : "#41B3A2",
        borderColor: "#41B3A2",
      }}
    >
      Save Changes
    </Button>

        <Button variant="secondary" className="ms-2" onClick={() => setShowPasswordModal(true)}>
          Change Password
        </Button>
      </Form>

      {/* Password Change Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control 
                type="password" 
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control 
                type="password" 
                name="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control 
                type="password" 
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value,email:user.email })}
              />
            </Form.Group>

            <Button variant="primary" onClick={handlePasswordChange}>
              Change Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
