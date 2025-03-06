import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { FiFileText, FiCheckCircle, FiCreditCard, FiTrendingUp, FiAlertTriangle } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa"; // Import FaRupeeSign
import { useAuth } from "../../contexts/AuthContext";
 
const CustomerHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
 
  const [stats, setStats] = useState({
    applicationsSubmitted: 0,
    activeLoans: 0,
    upcomingEMI: 0,
    dueDate: "", // Change nextEMIDate to dueDate
    totalLoanAmount: 0,
    emiPaid: 0,
    overduePayments: 0,
  });
 
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`/api/customers/${user.id}/dashboard-stats`);
        const { applicationsSubmitted, activeLoans, upcomingEMI, nextEMIDate, totalLoanAmount, emiPaid, overduePayments } = response.data;
        setStats({
          applicationsSubmitted,
          activeLoans,
          upcomingEMI,
          dueDate: nextEMIDate, // Ensure dueDate is set correctly
          totalLoanAmount,
          emiPaid,
          overduePayments,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchDashboardStats();
  }, [user.id]);
  const highlightSMART = ["S", "M", "A", "R", "T"];
 
  const cardData = [
    { title: "Submit an Application", value: stats.applicationsSubmitted, icon: <FiFileText size={40} className="text-primary" />, link: "/customer-dashboard/apply-loan" },
    { title: " EMI DETAILS", value: stats.upcomingEMI, icon: <FaRupeeSign size={40} className="text-warning" />, link: "/customer-dashboard/loan-details", extra: stats.dueDate }, // Use FaRupeeSign and rupee symbol
    { title: "Active Loans", value: stats.activeLoans, icon: <FiCheckCircle size={40} className="text-success" />, link: "/customer-dashboard/application-status" },
    { title: "PROFILE", value: stats.emiPaid, icon: <FiTrendingUp size={40} className="text-success" />, link: "/customer-dashboard/profile" }, // Use rupee symbol
    { title: "Total Loan Amount", value: stats.totalLoanAmount, icon: <FiCreditCard size={40} className="text-success" />, link: "/customer-dashboard/payment" }, // Correct the link to payment
    //{ title: "Overdue Payments", value: stats.overduePayments, icon: <FiAlertTriangle size={40} className="text-danger" />, link: "/customer-dashboard/overdue-payments" },
  ];
 
  // Function to highlight letters
  const highlightTitle = (title, index) => {
    if (index >= highlightSMART.length) return title; // No highlight for extra cards
    const letterToHighlight = highlightSMART[index]; // Get S, M, A, R, T
    const parts = title.split(letterToHighlight); // Split the title at the letter
 
    return (
      <>
        {parts[0]}
        <span className="highlight">{letterToHighlight}</span>
        {parts.slice(1).join(letterToHighlight)}
      </>
    );
  };
 
  return (
    <div>
      <h2 className="mb-4">Customer Dashboard</h2>
      <Row>
        {cardData.map((card, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="p-3 shadow card-hover" onClick={() => navigate(card.link)} style={{ cursor: "pointer" }}>
              <Card.Body className="text-center">
                {card.icon}
                <h4 className="mt-2">{card.value}</h4>
                <p>{highlightTitle(card.title, index)}</p>
                {card.extra && <p className="text-muted">Next EMI Date: {new Date(card.extra).toLocaleDateString()}</p>} {/* Display next EMI date if available */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
    </div>
  );
};
 
export default CustomerHome;