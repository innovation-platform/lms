// Registration.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router-dom';
import Register from '../components/Home/Registration';
import AuthService from '../services/AuthService';
import { PasswordValidator } from '../utils/validator';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../services/AuthService', () => ({
  default: {
    register: vi.fn(),
  },
}));

vi.mock('../utils/validator', () => ({
  PasswordValidator: {
    validate: vi.fn(),
  },
}));

describe('Register Component', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    PasswordValidator.validate.mockReturnValue({
      length: false,
      uppercase: false,
      number: false,
      specialChar: false,
    });
  });

  it('renders registration form correctly', () => {
    render(<Register />);
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('handles input changes correctly', async () => {
    render(<Register />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    const addressInput = screen.getByLabelText(/address/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(phoneInput, '1234567890');
    await userEvent.type(addressInput, '123 Main St');
    await userEvent.type(passwordInput, 'Password123!');

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(phoneInput.value).toBe('1234567890');
    expect(addressInput.value).toBe('123 Main St');
    expect(passwordInput.value).toBe('Password123!');
  });

  it('shows password validation rules', async () => {
    PasswordValidator.validate.mockReturnValueOnce({
      length: true,
      uppercase: true,
      number: false,
      specialChar: false,
    });

    render(<Register />);
    
    await userEvent.type(screen.getByLabelText(/password/i), 'Password');
    
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/at least one uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/at least one number/i)).toBeInTheDocument();
    expect(screen.getByText(/at least one special character/i)).toBeInTheDocument();
  });

  it('handles successful registration', async () => {
    AuthService.register.mockResolvedValueOnce({ message: 'Registration successful!' });
    
    render(<Register />);
    
    await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');
    await userEvent.type(screen.getByLabelText(/address/i), '123 Main St');
    await userEvent.type(screen.getByLabelText(/password/i), 'Password123!');

    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Registration successful!')).toBeInTheDocument();
    });

    // Wait for navigation
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 2500 });
  });

  it('handles validation errors', async () => {
    const validationErrors = {
      validationErrors: {
        name: 'Name is required',
        email: 'Invalid email',
      },
    };
    AuthService.register.mockRejectedValueOnce(validationErrors);
    
    render(<Register />);
    
    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  it('handles general error', async () => {
    const generalError = new Error('Registration failed');
    AuthService.register.mockRejectedValueOnce(generalError);
    
    render(<Register />);
    
    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });
  });

  it('clears error when user types in field with error', async () => {
    const validationErrors = {
      validationErrors: {
        name: 'Name is required',
      },
    };
    AuthService.register.mockRejectedValueOnce(validationErrors);
    
    render(<Register />);
    
    await userEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/full name/i), 'John');

    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
  });

  it('navigates to login page when clicking login link', () => {
    render(<Register />);
    
    const loginLink = screen.getByText(/already have an account/i);
    expect(loginLink.getAttribute('href')).toBe('/login');
  });
});
