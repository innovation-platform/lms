// src/banker/pages/BankerDashboard.jsx

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoanDetailsModal from "./LoanDetailsModal";
import { BankerProvider } from "../../contexts/BankerContext";
import SideBar from "../../components/Banker/SideBar";

const BankerDashboard = () => {
  const { logout, user, token } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/home');
    }
  }, [token, navigate]);

  useEffect(() => {
    document.body.className = darkMode ? "bg-dark text-light" : "bg-light text-dark";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <BankerProvider token={token} user={user}>
      <div className="d-flex">
        <SideBar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />
        <div 
          className="flex-grow-1 p-4" 
          style={{ 
            marginLeft: isSidebarOpen ? "250px" : "80px", 
            transition: "margin-left 0.3s" 
          }}
        >
          <Outlet />
        </div>
      </div>
      <LoanDetailsModal />
    </BankerProvider>
  );
};

export default BankerDashboard;
