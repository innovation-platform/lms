import React from "react";
import { Container, Button } from "react-bootstrap";

const NotFoundPage = () => {
  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center text-center vh-100"
    >
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h2 className="mb-3">Oops! Page Not Found</h2>
      <p className="text-muted mb-4">
        The page you're looking for might have been removed or is temporarily unavailable.
      </p>
      <Button variant="primary" href="/">
        Go Back Home
      </Button>
    </Container>
  );
};

export default NotFoundPage;
