// Login.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../components/Home/Login';
import AuthService from '../services/AuthService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock the dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../services/AuthService', () => ({
  default: {
    login: vi.fn(),
  },
}));

describe('Login Component', () => {
  const mockNavigate = vi.fn();
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({ login: mockLogin });
  });

  it('renders login form correctly', () => {
    render(<Login />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it('handles input changes', async () => {
    render(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('handles successful login for user with single role (user)', async () => {
    const mockUserData = {
      token: 'test-token',
      user: {
        roles: ['user'],
      },
    };

    AuthService.login.mockResolvedValueOnce(mockUserData);

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockLogin).toHaveBeenCalledWith('test-token', mockUserData.user);
      expect(mockNavigate).toHaveBeenCalledWith('/customer-dashboard');
    });
  });

  it('handles successful login for user with single role (banker)', async () => {
    const mockUserData = {
      token: 'test-token',
      user: {
        roles: ['banker'],
      },
    };

    AuthService.login.mockResolvedValueOnce(mockUserData);

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'banker@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/banker-dashboard');
    });
  });

  it('handles successful login for admin', async () => {
    const mockUserData = {
      token: 'test-token',
      user: {
        roles: ['admin'],
      },
    };

    AuthService.login.mockResolvedValueOnce(mockUserData);

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'admin@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
    });
  });

  it('handles successful login for user with multiple roles', async () => {
    const mockUserData = {
      token: 'test-token',
      user: {
        roles: ['user', 'banker'],
      },
    };

    AuthService.login.mockResolvedValueOnce(mockUserData);

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/role-selection');
    });
  });

  it('handles login failure', async () => {
    const errorMessage = 'Invalid credentials';
    AuthService.login.mockRejectedValueOnce(new Error(errorMessage));

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('handles login failure with default error message', async () => {
    AuthService.login.mockRejectedValueOnce(new Error());

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
    });
  });

  it('navigates to forgot password page when clicking the link', () => {
    render(<Login />);
    const forgotPasswordLink = screen.getByText(/forgot password/i);
    expect(forgotPasswordLink.getAttribute('href')).toBe('/forgotPassword');
  });
});
