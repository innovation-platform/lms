//100 percent done
import { render, screen, fireEvent } from "@testing-library/react";
import FormField from "./FormFields";
import { vi } from "vitest";

describe("FormField Component", () => {
  it("renders the FormField component with label and input", () => {
    render(<FormField label="Name" type="text" name="name" value="" onChange={() => {}} />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("updates value on change", () => {
    const handleChange = vi.fn();
    render(<FormField label="Email" type="email" name="email" value="" onChange={handleChange} />);
    
    const input = screen.getByLabelText("Email");
    fireEvent.change(input, { target: { value: "test@example.com" } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it("disables input when disabled prop is true", () => {
    render(<FormField label="Disabled Field" type="text" name="disabled" value="" onChange={() => {}} disabled />);
    
    const input = screen.getByLabelText("Disabled Field");
    expect(input).toBeDisabled();
  });
});
