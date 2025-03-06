import { Container, Card, Form, Button, ProgressBar } from "react-bootstrap";


export const FormField = ({ label, type, name, value, onChange, disabled = false, required = true }) => (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      />
    </Form.Group>
  );
  
  export const SelectField = ({ label, name, value, onChange, options, required = true }) => (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Select name={name} value={value} onChange={onChange} required={required}>
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label || option.value}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
  