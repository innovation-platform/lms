import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import AuthService from "../../services/AuthService";
import "bootstrap/dist/css/bootstrap.min.css";
import { PasswordValidator } from "../../utils/validator";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    setLoading(true);

    try {
      await AuthService.register(formData);
      setSuccess("Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      if (error.validationErrors) {
        setErrors(error.validationErrors);
      } else {
        setErrors({ general: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordRules = PasswordValidator.validate(formData.password);
  const isPasswordValid = Object.values(passwordRules).every(rule => rule);
  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100 px-3 mt-5 mb-5">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Register</h2>
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
        {success && <div className="alert alert-success">{success}</div>}
 
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name <span className="text-danger">*</span></label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter your full name"
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
 
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Enter your email address"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
 
          {/* Phone */}
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone <span className="text-danger">*</span></label>
            <input
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              placeholder="Enter your 10-digit phone number"
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>
 
          {/* Address */}
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address <span className="text-danger">*</span></label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              placeholder="Enter your complete address"
            />
            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
          </div>
 
          {/* Password with React Icons */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password <span className="text-danger">*</span></label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control ${!isPasswordValid && formData.password ? "border-warning" : ""}`}
              placeholder="Create a strong password"
            />
            <small className="form-text">
              <ul className="list-unstyled mt-2">
                <li className={passwordRules.length ? "text-success" : "text-danger"}>
                  {passwordRules.length ? <MdCheckCircle className="me-1" /> : <MdCancel className="me-1" />}
                  At least 8 characters
                </li>
                <li className={passwordRules.uppercase ? "text-success" : "text-danger"}>
                  {passwordRules.uppercase ? <MdCheckCircle className="me-1" /> : <MdCancel className="me-1" />}
                  At least one uppercase letter
                </li>
                <li className={passwordRules.number ? "text-success" : "text-danger"}>
                  {passwordRules.number ? <MdCheckCircle className="me-1" /> : <MdCancel className="me-1" />}
                  At least one number
                </li>
                <li className={passwordRules.specialChar ? "text-success" : "text-danger"}>
                  {passwordRules.specialChar ? <MdCheckCircle className="me-1" /> : <MdCancel className="me-1" />}
                  At least one special character
                </li>
              </ul>
            </small>
          </div>
 
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ backgroundColor: "#41B3A2", border: "none" }}
          >
            Register
          </button>
        </form>
 
        <div className="text-center mt-3">
          <a href="/login" className="text-decoration-none">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
};
 
export default Register;