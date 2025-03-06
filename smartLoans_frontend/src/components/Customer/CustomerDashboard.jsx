// src/Customer/components/CustomerDashboard.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FiSun, FiMoon, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Sidebar from "./Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (!token) {
      navigate('/home');
    }
  }, [token, navigate]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className={`dashboard-container ${theme}`}>
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
      {/* Sidebar */}
      <div className={`sidebar-container ${isSidebarOpen ? "open" : "closed"}`}>
        <Sidebar isSidebarOpen={isSidebarOpen} user={user} />
      </div>

      {/* Main Content */}
      <div 
        className="main-content"
        style={{ 
          marginLeft: isSidebarOpen ? "250px" : "80px",
          transition: "margin-left 0.3s"
        }}
      >
        {/* Top Bar */}
        <div className="top-bar d-flex justify-content-between align-items-center p-3">
          <Button 
            variant="outline-primary" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="sidebar-toggle"
          >
            {isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </Button>

          <div className="theme-toggle">
            <Button
              variant="outline-secondary"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </Button>
          </div>
        </div>

        <div className="content p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
