
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../components/commons/NavBar';
import { describe, it, expect } from 'vitest';

describe('Navbar', () => {
  it('renders the logo', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const logo = screen.getByAltText('Loan Management');
    expect(logo).toBeInTheDocument();
  });

  it('renders Home link', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  it('renders EMI Calculator link', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const emiLink = screen.getByText('EMI Calculator');
    expect(emiLink).toBeInTheDocument();
    expect(emiLink.getAttribute('href')).toBe('/emi-calculator');
  });

  it('renders Sign Up link', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const signUpLink = screen.getByText('Sign Up');
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink.getAttribute('href')).toBe('/Register');
  });

  it('renders Login link', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const loginLink = screen.getByText('Login');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.getAttribute('href')).toBe('/Login');
  });

  it('toggles the navigation menu', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const toggleButton = screen.getByLabelText('Toggle navigation');
    expect(toggleButton).toBeInTheDocument();
  });
});