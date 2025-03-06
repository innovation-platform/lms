import React from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { FiHome, FiUsers, FiFileText, FiUserCheck, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
 
const Sidebar = ({ isSidebarOpen }) => {
  const { logout, user } = useAuth();
 
  const styles = {
    sidebar: {
      height: '100%',
      width: '100%',
      color: 'white',
    },
    header: {
      padding: '1rem',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    nav: {
      padding: '1rem',
    },
    navLink: {
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      textDecoration: 'none',
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: 'rgba(255,255,255,0.1)',
      }
    },
    icon: {
      marginRight: '1rem',
    }
  };
 
  return (
    <div style={styles.sidebar}>
      <h3 style={styles.header}>
        {isSidebarOpen ? `Welcome ${user.name}` : ""}
      </h3>
      <Nav className="flex-column" style={styles.nav}>
        <Nav.Link as={Link} to="/admin-dashboard" style={styles.navLink}>
          <FiHome style={styles.icon} />
          <span style={{ display: isSidebarOpen ? "inline" : "none" }}>Dashboard</span>
        </Nav.Link>
        <Nav.Link as={Link} to="/admin-dashboard/create-user" style={styles.navLink}>
          <FiFileText style={styles.icon} />
          <span style={{ display: isSidebarOpen ? "inline" : "none" }}>Create User</span>
        </Nav.Link>
        <Nav.Link as={Link} to="/admin-dashboard/customers" style={styles.navLink}>
          <FiUsers style={styles.icon} />
          <span style={{ display: isSidebarOpen ? "inline" : "none" }}>Customers</span>
        </Nav.Link>
        <Nav.Link as={Link} to="/admin-dashboard/bankers" style={styles.navLink}>
          <FiUserCheck style={styles.icon} />
          <span style={{ display: isSidebarOpen ? "inline" : "none" }}>Bankers</span>
        </Nav.Link>
        <Nav.Link as={Link} to="/admin-dashboard/activate-user" style={styles.navLink}>
          <FiUserCheck style={styles.icon} />
          <span style={{ display: isSidebarOpen ? "inline" : "none" }}>Activate User</span>
        </Nav.Link>
        
        <Nav.Link onClick={logout} style={styles.navLink}>
          <FiLogOut style={styles.icon} />
          <span style={{ display: isSidebarOpen ? "inline" : "none" }}>Logout</span>
        </Nav.Link>
      </Nav>
    </div>
  );
};
 
export default Sidebar;