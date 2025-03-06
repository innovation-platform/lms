import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FiSun, FiMoon, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
 
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
 
  const styles = {
    dashboardContainer: {
      display: 'flex',
      minHeight: '100vh',
    },
    sidebarContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: isSidebarOpen ? '250px' : '60px',
      transition: 'width 0.3s',
      backgroundColor: '#41B3A2',
      zIndex: 1000,
    },
    mainContent: {
      marginLeft: isSidebarOpen ? '250px' : '60px',
      flex: 1,
      transition: 'margin-left 0.3s',
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f9fa',
      minHeight: '100vh',
    },
    topBar: {
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme === 'dark' ? '#2d2d2d' : 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    content: {
      padding: '2rem',
    }
  };
 
  return (
    <div style={styles.dashboardContainer} className={theme}>
       <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div style={styles.sidebarContainer}>
        <Sidebar isSidebarOpen={isSidebarOpen} />
      </div>
 
      <div style={styles.mainContent}>
        <div style={styles.topBar}>
          <Button
            variant="outline-primary"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </Button>
 
          <div>
            <Button
              variant="outline-secondary"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </Button>
          </div>
        </div>
 
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
 
export default AdminLayout;