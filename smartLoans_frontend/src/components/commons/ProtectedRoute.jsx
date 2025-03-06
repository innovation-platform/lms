import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ component: Component, allowedRoles }) => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/home" />;
  }

  return <Component />;
};

export default ProtectedRoute;
