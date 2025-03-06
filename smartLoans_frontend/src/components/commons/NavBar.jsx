import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navBar">
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">
          <img src={logo} alt="Loan Management" height="50" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <Link className="nav-link text-white" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/emi-calculator">EMI Calculator</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/Register">Sign Up</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/Login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
