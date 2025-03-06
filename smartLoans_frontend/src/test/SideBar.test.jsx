import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SideBar from '../components/Banker/SideBar';
import { BrowserRouter as Router } from 'react-router-dom';

// Mocking the useAuth hook
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    user: { name: 'John Doe' }
  })
}));

describe('SideBar', () => {
  it('renders and toggles sidebar', () => {
    const setIsSidebarOpen = vi.fn();
    const darkMode = false;
    const setDarkMode = vi.fn();

    render(
      <Router>
        <SideBar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isSidebarOpen={false}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </Router>
    );

    // Ensure that the sidebar is initially closed
    expect(screen.queryByText('Welcome John Doe')).not.toBeInTheDocument();

    // Click the toggle button
    fireEvent.click(screen.getByRole('button'));

    // Ensure that the setIsSidebarOpen function is called
    expect(setIsSidebarOpen).toHaveBeenCalledWith(true);

    // Re-render with the sidebar open
    render(
      <Router>
        <SideBar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isSidebarOpen={true}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </Router>
    );

    // Ensure that the welcome message is displayed
    expect(screen.getByText('Welcome John Doe')).toBeInTheDocument();
  });

  it('toggles dark mode', () => {
    const setIsSidebarOpen = vi.fn();
    const darkMode = false;
    const setDarkMode = vi.fn();

    render(
      <Router>
        <SideBar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isSidebarOpen={true}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </Router>
    );

    // Click the dark mode toggle button
    fireEvent.click(screen.getByText('Toggle Theme'));

    // Ensure that the setDarkMode function is called with the correct argument
    expect(setDarkMode).toHaveBeenCalledWith(true);
  });

  it('calls logout function when logout button is clicked', () => {
    const setIsSidebarOpen = vi.fn();
    const darkMode = false;
    const setDarkMode = vi.fn();
    const logout = vi.fn();

    render(
      <Router>
        <SideBar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isSidebarOpen={true}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </Router>
    );

    // Mock the logout function
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    // Ensure that the logout function is called
    expect(logout).toHaveBeenCalled();
  });

  it('renders the correct links when the sidebar is open', () => {
    const setIsSidebarOpen = vi.fn();
    const darkMode = false;
    const setDarkMode = vi.fn();

    render(
      <Router>
        <SideBar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isSidebarOpen={true}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </Router>
    );

    // Ensure the sidebar has the expected links
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Loan Applications')).toBeInTheDocument();
    expect(screen.getByText('Reviewed Applications')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Toggle Theme')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
