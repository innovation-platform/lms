import React from "react";
import Footer from "./Footer";
import { useAuth } from "../../contexts/AuthContext";

const RoleBasedFooter = () => {
  const { role } = useAuth(); // Fetch role from localStorage (or use Context/Redux)
  //const [darkMode, setDarkMode] = useState(false);
  if (role?.includes('user') || role?.includes('banker') || role?.includes('admin')) {
    return null;
  }

  return <Footer />; // Default Navbar
};

export default RoleBasedFooter;
