import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Carousel, Row, Col } from "react-bootstrap";
import { FaHome, FaGraduationCap, FaUserTie, FaCoins } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
 
const loans = [
  { title: "Home Loan", description: "Own your dream home with easy EMIs and low interest rates.", icon: <FaHome size={50} color="#2D98A6" /> },
  { title: "Education Loan", description: "Invest in your future with hassle-free education financing.", icon: <FaGraduationCap size={50} color="#F5A623" /> },
  { title: "Personal Loan", description: "Get quick and flexible personal loans for your needs.", icon: <FaUserTie size={50} color="#E27D60" /> },
  { title: "Gold Loan", description: "Unlock the value of your gold with instant cash loans.", icon: <FaCoins size={50} color="#C38D9E" /> },
];
 
// Duplicate loans to allow infinite scrolling
const extendedLoans = [...loans, ...loans, ...loans]; // Makes sure there are enough cards
 
const Home = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const message = "WELCOME TO SMART LOANS";
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
 
  useEffect(() => {
    let i = 0;
    setTypedText("");
    const interval = setInterval(() => {
      if (i <= message.length) {
        setTypedText(message.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);
 
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
 
  const handleApplyNow = () => {
    const isLoggedIn = localStorage.getItem("token");
    navigate(isLoggedIn ? "/loan-application" : "/login");
  };
 
  return (
    <div className={`home-container ${theme}`}>
      {/* Theme Toggle Button */}
      <div className="theme-toggle">
        <Button variant="outline-secondary" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
        </Button>
      </div>
 
      <Container className="mt-5 mb-5 text-center">
        <h1 className="typing-text">{typedText}</h1>
        <h3 className="subline">Find the Perfect Loan for You</h3>
 
        {/* Bootstrap Multi-Item Carousel */}
        <Carousel indicators={false} controls={true} interval={2500} className="mt-4">
          {extendedLoans.map((_, index) => {
            if (index % 3 === 0) {
              return (
                <Carousel.Item key={index}>
                  <Row className="justify-content-center">
                    {extendedLoans.slice(index, index + 3).map((loan, subIndex) => (
                      <Col key={subIndex} md={4} className="d-flex justify-content-center">
                        <Card className="text-center shadow-lg p-4 rounded-custom" style={{ width: "18rem", borderRadius: "15px" }}>
                          <Card.Body>
                            <div className="mb-3">{loan.icon}</div>
                            <Card.Title className="fw-bold">{loan.title}</Card.Title>
                            <Card.Text>{loan.description}</Card.Text>
                            <Button className="authButton" onClick={handleApplyNow}>Apply Now</Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Carousel.Item>
              );
            }
            return null;
          })}
        </Carousel>
 
      </Container>
    </div>
  );
};
 
export default Home;