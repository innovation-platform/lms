import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoanDetails from "./components/Customer/LoanDetails";
import Profile from "./components/Customer/Profile";
import Login from "./components/Home/Login";
import Registration from "./components/Home/Registration";
import ProtectedRoute from "./components/commons/ProtectedRoute";
import EmiCalculator from "./components/Home/EmiCalculator";
import Home from "./components/Home/Home";
import LoanApplication from "./components/Customer/LoanApplication";
import ForgotPassword from "./components/Home/ForgotPassword";
import NotFoundPage from "./components/commons/NotFoundPage";
import RoleBasedNavBar from "./components/commons/RoleBasedNavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import BankerDashboard from "./components/Banker/BankerDashboard";
import BankerHome from "./components/Banker/BankerHome";
import LoanApplications from "./components/Banker/LoanApplications";
import ReviewedApplications from "./components/Banker/ReviewedApplications";
import RoleBasedFooter from "./components/commons/RoleBasedFooter";
import Dashboard from "./components/Admin/Dashboard";
import Customers from "./components/Admin/Customers";
import Bankers from "./components/Admin/Bankers";
import CustomerDashboard from "./components/Customer/CustomerDashboard";
import ApplicationStatus from "./components/Customer/ApplicationStatus";
import CustomerHome from "./components/Customer/CustomerHome";
// import AdminDashboard from "./Admin/pages/Dashboard";
import EMIPayment from "./components/Customer/EMIPayments";
import PreClosure from "./components/Customer/PreClosure";
import ChatbotComponent from "./components/Home/ChatbotComponent";
import AdminLayout from "./components/Admin/AdminLayout";
import NavigateToRole from "./components/commons/NavigateToRole";
import { useAuth } from "./contexts/AuthContext";
import PublicRoute from "./components/commons/PublicRoute";
import CreateUser from "./components/Admin/CreateUser";
import ActivateUser from "./components/Admin/ActivateUser";
const App = () => {
  const { token, role } = useAuth();

  useEffect(() => {
    const handleBackButton = (event) => {
      // If user is not logged in, allow normal back navigation
      if (!token) return;

      // Get current path
      const currentPath = window.location.pathname;

      // If user has multiple roles and is in a dashboard
      if (currentPath.includes('dashboard') || currentPath.includes('apply-loan')) {
        event.preventDefault();
        window.history.pushState(null, '', currentPath);
      }
    };

    // Add initial history state when component mounts
    if (token) {
      // Clear existing history states
      window.history.replaceState(null, '', window.location.pathname);

      // Add new history state
      window.history.pushState(
        { from: window.location.pathname },
        '',
        window.location.pathname
      );

      window.addEventListener('popstate', handleBackButton);
    }

    return () => {
      if (token) {
        window.removeEventListener('popstate', handleBackButton);
      }
    };
  }, [token, role]);


  return (
    <Router>
      <RoleBasedNavBar />
      <Routes>
        <Route path="/" element={<NavigateToRole />} />
        <Route path="/home" element={<PublicRoute component={Home} />} />
        <Route path="/login" element={<PublicRoute component={Login} />} />
        <Route path="/forgotPassword" element={<PublicRoute component={ForgotPassword} />} />
        <Route path="/register" element={<PublicRoute component={Registration} />} />
        <Route path="/emi-calculator" element={<PublicRoute component={EmiCalculator} />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route path="/banker-dashboard" element={<ProtectedRoute component={BankerDashboard} allowedRoles={["banker"]} />}>
          <Route index element={<BankerHome />} />
          <Route path="loans" element={<LoanApplications />} />
          <Route path="reviewed" element={<ReviewedApplications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/admin-dashboard" element={<ProtectedRoute component={AdminLayout} allowedRoles={["admin"]} />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<ProtectedRoute component={Customers} allowedRoles={["admin"]} />} />
          <Route path="bankers" element={<ProtectedRoute component={Bankers} allowedRoles={["admin"]} />} />
          <Route path="create-user" element={<ProtectedRoute component={CreateUser} allowedRoles={["admin"]} />} />
          <Route path="activate-user" element={<ProtectedRoute component={ActivateUser} allowedRoles={["admin"]}/>}/>
        </Route>

        <Route path="/customer-dashboard" element={<ProtectedRoute component={CustomerDashboard} allowedRoles={["user"]} />}>
          <Route index element={<CustomerHome />} />
          <Route path="apply-loan" element={<ProtectedRoute component={LoanApplication} allowedRoles={["user"]} />} />
          <Route path="loan-details" element={<ProtectedRoute component={LoanDetails} allowedRoles={["user"]} />} />
          <Route path="application-status" element={<ProtectedRoute component={ApplicationStatus} allowedRoles={["user"]} />} />
          <Route path="profile" element={<ProtectedRoute component={Profile} allowedRoles={["user"]} />} />
          <Route path="payment" element={<ProtectedRoute component={EMIPayment} allowedRoles={["user"]} />} />
          <Route path="preclosure" element={<ProtectedRoute component={PreClosure} allowedRoles={["user"]} />} />
        </Route>
      </Routes>
      <RoleBasedFooter />
      <ChatbotComponent />
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
    </Router>
  );
};

export default App;