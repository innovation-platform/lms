import React from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { FiHome, FiUser, FiFileText, FiCheckCircle, FiPlusSquare, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
 
const Sidebar = ({ isSidebarOpen }) => {
  const { logout, user } = useAuth();
 
  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <h3 className="text-white px-3">{isSidebarOpen ? `Welcome ${user.name}` : "👤"}</h3>
      <Nav className="flex-column w-100 px-3">
        <Nav.Link as={Link} to="/customer-dashboard" className="text-white"><FiHome className="me-2" />{isSidebarOpen && "Dashboard"}</Nav.Link>
        <Nav.Link as={Link} to="/customer-dashboard/profile" className="text-white"><FiUser className="me-2" />{isSidebarOpen && "Profile"}</Nav.Link>
        <Nav.Link as={Link} to="/customer-dashboard/apply-loan" className="text-white"><FiPlusSquare className="me-2" />{isSidebarOpen && "Apply Loan"}</Nav.Link>
        <Nav.Link as={Link} to="/customer-dashboard/loan-details" className="text-white"><FiFileText className="me-2" />{isSidebarOpen && "Loan Details"}</Nav.Link>
        <Nav.Link as={Link} to="/customer-dashboard/application-status" className="text-white"><FiCheckCircle className="me-2" />{isSidebarOpen && "Application Status"}</Nav.Link>
        <Nav.Link as={Link} onClick={logout} className="text-white"><FiLogOut className="me-2" />{isSidebarOpen && "Logout"}</Nav.Link>
      </Nav>
    </div>
  );
};
 
export default Sidebar;