import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="text-white py-3" style={{ backgroundColor: "#41B3A2", fontSize: "14px" }}>
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-md-4">
            <h6 className="fw-bold mb-2">SMART LOANS</h6>
            <p className="mb-1">Secure. Reliable. Efficient.</p>
            <p className="mb-0">Take control of your financial future.</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4">
            <h6 className="fw-bold mb-2">Quick Links</h6>
            <ul className="list-unstyled mb-0">
              <li><a href="#" className="text-white text-decoration-none d-block">🏠 Home</a></li>
              <li><a href="#" className="text-white text-decoration-none d-block">📄 Apply for Loan</a></li>
              <li><a href="#" className="text-white text-decoration-none d-block">💳 Repayment</a></li>
              <li><a href="#" className="text-white text-decoration-none d-block">📞 Contact Us</a></li>
            </ul>
          </div>

          {/* Contact & Social Media */}
          <div className="col-md-4">
            <h6 className="fw-bold mb-2">Contact Us</h6>
            <p className="d-flex align-items-center gap-2 mb-1">
              <FaMapMarkerAlt size={12} /> Bren Optimus, Bengaluru
            </p>
            <p className="d-flex align-items-center gap-2 mb-1">
              <FaPhoneAlt size={12} /> +91 9000101234
            </p>
            <p className="d-flex align-items-center gap-2 mb-2">
              <FaEnvelope size={12} /> smartloans.app@gmail.com
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="text-white"><FaFacebookF size={16} /></a>
              <a href="#" className="text-white"><FaTwitter size={16} /></a>
              <a href="#" className="text-white"><FaLinkedinIn size={16} /></a>
              <a href="#" className="text-white"><FaInstagram size={16} /></a>
            </div>
          </div>
        </div>

        {/* Copyright & Terms */}
        <div className="text-center mt-2">
          <p className="mb-0">&copy; {new Date().getFullYear()} SMART LOANS</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
