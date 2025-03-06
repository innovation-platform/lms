import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { getLoans, getCustomers, getBankers } from "../../services/adminService";
import { FiUsers, FiFileText, FiUserCheck } from "react-icons/fi";
 
const Dashboard = () => {
  const [totalLoans, setTotalLoans] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [totalBankers, setTotalBankers] = useState(0);
  const [approvedLoans, setApprovedLoans] = useState(0);
  const [rejectedLoans, setRejectedLoans] = useState(0);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const loans = await getLoans();
        const customers = await getCustomers();
        const bankers = await getBankers();
 
        setTotalLoans(loans.length);
        setActiveCustomers(customers.length);
        setPendingApprovals(loans.filter((loan) => loan.status === "Pending").length);
        setTotalBankers(bankers.length);
        setApprovedLoans(loans.filter((loan) => loan.status === "Approved").length);
        setRejectedLoans(loans.filter((loan) => loan.status === "Rejected").length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
 
    fetchData();
  }, []);
 
  const styles = {
    container: {
      padding: '2rem',
    },
    welcomeSection: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    welcomeTitle: {
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    welcomeText: {
      color: '#666',
      marginBottom: '2rem',
    },
    card: {
      padding: '1.5rem',
      borderRadius: '10px',
      border: 'none',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      height: '100%',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
    },
    cardHover: {
      transform: 'translateY(-5px)',
    },
    cardTitle: {
      color: '#666',
      fontSize: '1rem',
      marginBottom: '0.5rem',
    },
    cardValue: {
      color: '#41B3A2',
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    icon: {
      fontSize: '2rem',
      marginBottom: '1rem',
      color: '#41B3A2',
    }
  };
 
  return (
    <Container fluid style={styles.container}>
      <div style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>Welcome to Admin Dashboard</h1>
        <p style={styles.welcomeText}>Here's an overview of your loan management system</p>
      </div>
 
      <Row className="g-4">
        <Col md={4}>
          <Card style={styles.card}>
            <Card.Body>
              <FiUsers style={styles.icon} />
              <h5 style={styles.cardTitle}>Total Customers</h5>
              <h2 style={styles.cardValue}>{activeCustomers}</h2>
            </Card.Body>
          </Card>
        </Col>
 
        <Col md={4}>
          <Card style={styles.card}>
            <Card.Body>
              <FiFileText style={styles.icon} />
              <h5 style={styles.cardTitle}>Total Loans</h5>
              <h2 style={styles.cardValue}>{totalLoans}</h2>
            </Card.Body>
          </Card>
        </Col>
 
        <Col md={4}>
          <Card style={styles.card}>
            <Card.Body>
              <FiUserCheck style={styles.icon} />
              <h5 style={styles.cardTitle}>Total Bankers</h5>
              <h2 style={styles.cardValue}>{totalBankers}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
 
      <Row className="g-4 mt-4">
        <Col md={4}>
          <Card style={styles.card}>
            <Card.Body>
              <h5 style={styles.cardTitle}>Pending Approvals</h5>
              <h2 style={{...styles.cardValue, color: '#ffc107'}}>{pendingApprovals}</h2>
            </Card.Body>
          </Card>
        </Col>
 
        <Col md={4}>
          <Card style={styles.card}>
            <Card.Body>
              <h5 style={styles.cardTitle}>Approved Loans</h5>
              <h2 style={{...styles.cardValue, color: '#28a745'}}>{approvedLoans}</h2>
            </Card.Body>
          </Card>
        </Col>
 
        <Col md={4}>
          <Card style={styles.card}>
            <Card.Body>
              <h5 style={styles.cardTitle}>Rejected Loans</h5>
              <h2 style={{...styles.cardValue, color: '#dc3545'}}>{rejectedLoans}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
 
export default Dashboard;