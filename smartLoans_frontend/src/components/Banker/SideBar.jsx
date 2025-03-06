import React from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaFileAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import { FiSun, FiMoon, FiChevronLeft, FiChevronRight,FiUser,FiHome,FiLogOut } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth
import "bootstrap/dist/css/bootstrap.min.css";
 
const SideBar = ({ darkMode, setDarkMode, isSidebarOpen, setIsSidebarOpen }) => {
    const { logout, user } = useAuth(); // Get logout function from useAuth
 
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
 
    return (
        <div className="d-flex">
            <div className={`sidebar ${isSidebarOpen ? "open" : "closed"} text-white vh-100 p-3`} style={{ width: isSidebarOpen ? "250px" : "80px", transition: "width 0.3s", position: "fixed" }}>
                <button onClick={toggleSidebar} className="btn btn-primary mb-3" style={{ position: "absolute", top: "10px", right: "-20px", zIndex: 1, color: "white", backgroundColor: "#E3735E" }}>
                    {isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
                </button>
                <h3 className="text-center mt-5">{isSidebarOpen ? `Welcome ${user.name}` : "Guest"}</h3>
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/banker-dashboard">
                            <FiHome className="me-2" />{isSidebarOpen && "Dashboard"}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/banker-dashboard/loans">
                            <FaFileAlt className="me-2" />{isSidebarOpen && "Loan Applications"}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/banker-dashboard/reviewed">
                            <FaFileAlt className="me-2" />{isSidebarOpen && "Reviewed Applications"}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/banker-dashboard/profile">
                            <FiUser className="me-2" />{isSidebarOpen && "Profile"}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link text-white btn" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? <FiSun className="me-2" /> : <FiMoon className="me-2" />}{isSidebarOpen && "Toggle Theme"}
                        </button>
                    </li>
                    <li className="nav-item mt-auto">
                        <button className="nav-link text-white btn" onClick={logout}>
                            <FiLogOut className="me-2" />{isSidebarOpen && "Logout"}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};
 
export default SideBar;