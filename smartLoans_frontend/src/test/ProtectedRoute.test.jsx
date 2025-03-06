import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import ProtectedRoute from "../components/commons/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

vi.mock("../contexts/AuthContext");

const MockComponent = () => <div>Mock Component</div>;

describe("ProtectedRoute", () => {
  const renderWithRouter = (ui, { route = "/" } = {}) => {
    window.history.pushState({}, "Test page", route);
    return render(ui, { wrapper: MemoryRouter });
  };

  it("redirects to login if no token", () => {
    useAuth.mockReturnValue({ token: null });
    const { getByText } = renderWithRouter(
      <Routes>
        <Route path="/" element={<ProtectedRoute component={MockComponent} allowedRoles={["user"]} />} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );
    expect(getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects to login if no user", () => {
    useAuth.mockReturnValue({ token: "token", user: null });
    const { getByText } = renderWithRouter(
      <Routes>
        <Route path="/" element={<ProtectedRoute component={MockComponent} allowedRoles={["user"]} />} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    );
    expect(getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects to unauthorized if no roles assigned", () => {
    useAuth.mockReturnValue({ token: "token", user: "user", role: [] });
    const { getByText } = renderWithRouter(
      <Routes>
        <Route path="/" element={<ProtectedRoute component={MockComponent} allowedRoles={["user"]} />} />
        <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
      </Routes>
    );
    expect(getByText("Unauthorized Page")).toBeInTheDocument();
  });

  it("redirects to unauthorized if user doesn't have allowed role", () => {
    useAuth.mockReturnValue({ token: "token", user: "user", role: ["admin"], activeRole: "admin" });
    const { getByText } = renderWithRouter(
      <Routes>
        <Route path="/" element={<ProtectedRoute component={MockComponent} allowedRoles={["user"]} />} />
        <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
      </Routes>
    );
    expect(getByText("Unauthorized Page")).toBeInTheDocument();
  });

  it("renders component if user has allowed role", () => {
    useAuth.mockReturnValue({ token: "token", user: "user", role: ["user"], activeRole: "user" });
    const { getByText } = renderWithRouter(
      <Routes>
        <Route path="/" element={<ProtectedRoute component={MockComponent} allowedRoles={["user"]} />} />
      </Routes>
    );
    expect(getByText("Mock Component")).toBeInTheDocument();
  });

  it("handles error rendering component", () => {
    const ErrorComponent = () => {
      throw new Error("Test error");
    };
    useAuth.mockReturnValue({ token: "token", user: "user", role: ["user"], activeRole: "user" });
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { getByText } = renderWithRouter(
      <Routes>
        <Route path="/" element={<ProtectedRoute component={ErrorComponent} allowedRoles={["user"]} />} />
        <Route path="/error" element={<div>Error Page</div>} />
      </Routes>
    );
    expect(getByText("Error Page")).toBeInTheDocument();
    consoleErrorSpy.mockRestore();
  });
});