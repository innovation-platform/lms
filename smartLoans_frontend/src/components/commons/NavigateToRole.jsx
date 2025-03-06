// Component for Redirecting Users Based on Role
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

// src/commons/components/NavigateToRole.jsx
const NavigateToRole = () => {
    const navigate = useNavigate();
    const { role,token } = useAuth();
   
    useEffect(() => {
      console.log("Role:", role);
      console.log("Token:", token);
   
      // Check if user is authenticated
      if (!token || !role) {
        navigate('/home');
        return;
      }
   
      // Single role navigation or active role is already set
        switch(role) {
          case "banker":
            navigate("/banker-dashboard");
            break;
          case "user":
            navigate("/customer-dashboard");
            break;
          case "admin":
            navigate("/admin-dashboard");
            break;
          default:
            navigate("/home");
        }
    }, [navigate, role,token]);
   
    return null;
  };

export default NavigateToRole;