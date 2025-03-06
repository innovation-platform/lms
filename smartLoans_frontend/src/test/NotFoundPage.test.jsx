
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotFoundPage from '../components/commons/NotFoundPage';
import { BrowserRouter as Router } from 'react-router-dom';

describe('NotFoundPage', () => {
  it('renders the 404 heading', () => {
    render(
      <Router>
        <NotFoundPage />
      </Router>
    );
    const heading = screen.getByText('404');
    expect(heading).toBeInTheDocument();
  });

  it('renders the "Oops! Page Not Found" message', () => {
    render(
      <Router>
        <NotFoundPage />
      </Router>
    );
    const message = screen.getByText('Oops! Page Not Found');
    expect(message).toBeInTheDocument();
  });

  it('renders the description message', () => {
    render(
      <Router>
        <NotFoundPage />
      </Router>
    );
    const description = screen.getByText(
      "The page you're looking for might have been removed or is temporarily unavailable."
    );
    expect(description).toBeInTheDocument();
  });

  it('renders the "Go Back Home" button', () => {
    render(
      <Router>
        <NotFoundPage />
      </Router>
    );
    const button = screen.getByRole('button', { name: /Go Back Home/i });
    expect(button).toBeInTheDocument();
  });

  it('button has correct href attribute', () => {
    render(
      <Router>
        <NotFoundPage />
      </Router>
    );
    const button = screen.getByRole('button', { name: /Go Back Home/i });
    expect(button.closest('a')).toHaveAttribute('href', '/');
  });
});