import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RoleSelection from '../components/commons/RoleSelection';
import { AuthProvider, AuthContext } from '../contexts/AuthContext';

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: vi.fn(),
}));

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: MemoryRouter });
};

describe('RoleSelection Component', () => {
  const mockSetActiveRole = vi.fn();
  const mockLogout = vi.fn();
  const mockNavigate = useNavigate();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (role) => {
    return renderWithRouter(
      <AuthContext.Provider value={{ role, setActiveRole: mockSetActiveRole, logout: mockLogout }}>
        <RoleSelection />
      </AuthContext.Provider>
    );
  };

  it('should render role selection buttons based on roles', () => {
    const { getByText, queryByText } = renderComponent(['user', 'banker', 'admin']);

    expect(getByText('Continue as Customer')).toBeInTheDocument();
    expect(getByText('Continue as Banker')).toBeInTheDocument();
    expect(getByText('Continue as Admin')).toBeInTheDocument();
    expect(queryByText('Continue as Customer')).not.toBeNull();
    expect(queryByText('Continue as Banker')).not.toBeNull();
    expect(queryByText('Continue as Admin')).not.toBeNull();
  });

  it('should navigate to customer dashboard on user role selection', () => {
    const { getByText } = renderComponent(['user']);
    fireEvent.click(getByText('Continue as Customer'));
    expect(mockSetActiveRole).toHaveBeenCalledWith('user');
    expect(mockNavigate).toHaveBeenCalledWith('/customer-dashboard');
  });

  it('should navigate to banker dashboard on banker role selection', () => {
    const { getByText } = renderComponent(['banker']);
    fireEvent.click(getByText('Continue as Banker'));
    expect(mockSetActiveRole).toHaveBeenCalledWith('banker');
    expect(mockNavigate).toHaveBeenCalledWith('/banker-dashboard');
  });

  it('should navigate to admin dashboard on admin role selection', () => {
    const { getByText } = renderComponent(['admin']);
    fireEvent.click(getByText('Continue as Admin'));
    expect(mockSetActiveRole).toHaveBeenCalledWith('admin');
    expect(mockNavigate).toHaveBeenCalledWith('/admin-dashboard');
  });

  it('should call logout function on logout button click', () => {
    const { getByText } = renderComponent(['user']);
    fireEvent.click(getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
  });
});