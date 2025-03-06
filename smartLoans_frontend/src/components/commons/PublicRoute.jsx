// src/commons/components/PublicRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicRoute = ({ component: Component }) => {
  const { token, role } = useAuth();

  if (token) {
    // Redirect to appropriate dashboard based on role
    if (role === 'user') return <Navigate to="/customer-dashboard" />;
    if (role === 'banker') return <Navigate to="/banker-dashboard" />;
    if (role === 'admin') return <Navigate to="/admin-dashboard" />;
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default PublicRoute;
