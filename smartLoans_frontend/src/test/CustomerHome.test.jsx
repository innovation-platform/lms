// 1 failing 
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CustomerHome from "./CustomerHome";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// --- Mocks ---
// Mock axios
vi.mock("axios");

// Mock the AuthContext so that useAuth returns a user with an id.
vi.mock("../../contexts/AuthContext", () => ({
  useAuth: () => ({ user: { id: "user1" } }),
}));

// Mock useNavigate from react-router-dom.
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    MemoryRouter: actual.MemoryRouter, // Ensure MemoryRouter is included in the mock
  };
});

describe("CustomerHome Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders initial dashboard and updates with fetched stats", async () => {
    const mockResponse = {
      data: {
        applicationsSubmitted: 5,
        activeLoans: 2,
        upcomingEMI: 1,
        dueDate: "2023-03-15T00:00:00.000Z",
        totalLoanAmount: 100000,
        emiPaid: 50000,
        overduePayments: 0,
      },
    };
    axios.get.mockResolvedValueOnce(mockResponse);

    render(
      <MemoryRouter>
        <CustomerHome />
      </MemoryRouter>
    );

    // Initially, default stats (all zeros) appear in the card values.
    // Cards render a <h4> with the value. The first card is applicationsSubmitted.
    const headings = screen.getAllByRole("heading", { level: 4 });
    // Initially, before axios resolves, the value is "0"
    expect(headings[0].textContent).toBe("0");

    // Wait for the effect to update the stats.
    await waitFor(() => {
      expect(screen.getAllByRole("heading", { level: 4 })[0].textContent).toBe("5");
    });

    // Check that the EMI details card (second card) shows the next EMI date.
    const emiDateText = new Date("2023-03-15T00:00:00.000Z").toLocaleDateString('en-US');
    await waitFor(() => {
      expect(screen.getByText((content, element) => {
        return element.textContent.includes(emiDateText);
      })).toBeInTheDocument();
    });
  });

  test("navigates to correct link when a card is clicked", async () => {
    const mockResponse = {
      data: {
        applicationsSubmitted: 10,
        activeLoans: 3,
        upcomingEMI: 2,
        dueDate: "2023-04-01T00:00:00.000Z",
        totalLoanAmount: 200000,
        emiPaid: 80000,
        overduePayments: 0,
      },
    };
    axios.get.mockResolvedValueOnce(mockResponse);

    render(
      <MemoryRouter>
        <CustomerHome />
      </MemoryRouter>
    );

    // Wait for stats to load.
    await waitFor(() => {
      expect(screen.getAllByRole("heading", { level: 4 })[0].textContent).toBe("10");
    });

    // The first card's link should be "/customer-dashboard/apply-loan".
    // The onClick is set on the Card; we can simulate a click on an element that contains the card value.
    const card = screen.getByText("10").closest("div.card-hover");
    fireEvent.click(card);
    expect(mockNavigate).toHaveBeenCalledWith("/customer-dashboard/apply-loan");
  });

  test("highlights title correctly", async () => {
    // For this test, provide a response so that cardData is built.
    const mockResponse = {
      data: {
        applicationsSubmitted: 1,
        activeLoans: 2,
        upcomingEMI: 3,
        dueDate: "",
        totalLoanAmount: 400000,
        emiPaid: 100000,
        overduePayments: 0,
      },
    };
    axios.get.mockResolvedValueOnce(mockResponse);

    render(
      <MemoryRouter>
        <CustomerHome />
      </MemoryRouter>
    );

    await waitFor(() => {
      // The first card's title is "Submit an Application" and highlightTitle will highlight the letter "S"
      const paragraph = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === "p" && element.innerHTML.includes('<span class="highlight">S</span>');
      });
      expect(paragraph).toBeDefined();
    });
  });

  test("handles error when fetching dashboard stats", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error("Network error"));
    render(
      <MemoryRouter>
        <CustomerHome />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching dashboard stats:", expect.any(Error));
    });
    consoleErrorSpy.mockRestore();
  });
});
