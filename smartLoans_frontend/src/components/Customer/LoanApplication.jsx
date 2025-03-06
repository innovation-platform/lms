import React, { useState, useEffect } from "react";  // Add useEffect
import { Container, Card, Form, Button, ProgressBar } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { submitLoanApplication, LOAN_OPTIONS } from "../../services/loanService";
import { LoanValidator } from "../../utils/validator";
import { prepareFormData } from "../../services/formService";
import { fetchLoanDetailsService } from "../../services/loanDetailsService";
import { FormField, SelectField } from "./FormFields";
import { LOAN_SPECIFIC_FIELDS, EMPLOYMENT_OPTIONS, GUARANTOR_FIELDS, DOCUMENT_FIELDS } from "../../constants/formConstants";
import AuthService from "../../services/AuthService";  // Add this import

const LoanApplication = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [validationMessage, setValidationMessage] = useState("");
  const [userData, setUserData] = useState(null);  // Add this state
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Form state initialization
  const [formData, setFormData] = useState({
    accountNumber: "",
    customerName: "",
    phoneNumber: "",
    email: "",
    panNumber: "",
    aadharNumber: "",
    loanAmount: "",
    interestRate: "",
    loanDuration: "",
    loanType: "",
    employmentType: "",
    guarantorName: "",
    guarantorIncome: "",
    relationship: "",
    propertyValue: "",
    propertyLocation: "",
    purpose: "",
    courseName: "",
    institutionName: "",
    goldWeight: "",
    goldPurity: "",
  });

  // Fetch user data when component mounts
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await AuthService.getCurrentUser();
        if (response && response.claims) {
          setUserData(response.claims);
          setFormData(prevData => ({
            ...prevData,
            accountNumber: response.claims.accountNumber || "",
            customerName: response.claims.name || "",
            phoneNumber: response.claims.phone || "",
            email: response.claims.email || ""
          }));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, []);
 
  const [files, setFiles] = useState({
    passportPhoto: null,
    aadharCard: null,
    panCard: null,
    signature: null,
  });
  const FILE_CONSTRAINTS = {
    maxSize: 5 * 1024 * 1024,
    validTypes: ["image/jpeg", "image/png", "application/pdf"]
  };
 
  const [fileValidation, setFileValidation] = useState({
    passportPhoto: "",
    aadharCard: "",
    panCard: "",
    signature: "",
  });
 
  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
 
  const handleBlur = () => {
    setValidationMessage(LoanValidator.validateAmount(formData.loanAmount));
  };
 
  const handleLoanTypeChange = (e) => {
    const selectedLoan = LOAN_OPTIONS.find(loan => loan.value === e.target.value);
    setFormData(prev => ({
      ...prev,
      loanType: selectedLoan.value,
      interestRate: selectedLoan.interestRate,
    }));
  };
 
  const handleEmploymentTypeChange = (e) => {
    const employmentType = e.target.value;
    setFormData(prev => ({
      ...prev,
      employmentType,
      ...(employmentType === "Govt" && {
        guarantorName: "",
        guarantorIncome: "",
        relationship: ""
      })
    }));
  };
 
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    const errorMessage = LoanValidator.validateFile(file, FILE_CONSTRAINTS);
    setFileValidation(prev => ({ ...prev, [name]: errorMessage }));
    setFiles(prev => ({ ...prev, [name]: file }));
  };
 
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    // Validate loan amount
    const loanAmountError = LoanValidator.validateAmount(formData.loanAmount);
    if (loanAmountError) {
      setValidationMessage(loanAmountError);
      return;
    }
 
    // Check for file validation errors
    const fileErrors = Object.values(fileValidation).filter(msg => msg !== "");
    if (fileErrors.length > 0) {
      alert("Please upload valid documents.");
      return;
    }
    
    // Validate required fields
    if (!LoanValidator.validateRequiredFields(formData)) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      // Check loan eligibility
      const { totalLoans, typeOfLastLoan } = await fetchLoanDetailsService(formData.accountNumber);
 
      if (totalLoans >= 2) {
        alert("You already have 2 or more active loans. Cannot proceed.");
        return;
      }
 
      if (typeOfLastLoan === formData.loanType) {
        alert(`Your last loan was also a ${typeOfLastLoan}. Please choose a different loan type.`);
        return;
      }
 
      // Prepare and submit form data
      const formDataToSend = prepareFormData(formData, files);
      console.log("Form data to send:", formDataToSend);
      const response = await submitLoanApplication(formDataToSend, (progress) => {
        setProgress(progress);
      });
      console.log("Response:", response);
      if (response.status === 201) {
        localStorage.setItem("loandata", JSON.stringify(response.data));
        alert("Loan Application Submitted Successfully!");
        navigate("/customer-dashboard/application-status");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Loan Application Submission Failed");
    }finally {
      setIsSubmitting(false); // Stop loading
    }
  };
 
  // Conditional form field components
  const renderLoanTypeSpecificFields = () => {
    const fields = LOAN_SPECIFIC_FIELDS[formData.loanType] || [];
    return fields.map(field => (
      <FormField
        key={field.name}
        {...field}
        value={formData[field.name]}
        onChange={handleChange}
      />
    ));
  };
 
  const renderGuarantorFields = () => {
    if (formData.employmentType !== "Govt") {
      return GUARANTOR_FIELDS.map(field => (
        <FormField
          key={field.name}
          {...field}
          value={formData[field.name]}
          onChange={handleChange}
        />
      ));
    }
    return null;
  };
 
  const renderFileUploadField = (name, label) => (
    <Form.Group className="mb-3" key={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control type="file" name={name} onChange={handleFileChange} required />
      {fileValidation[name] && (
        <Form.Text className="text-danger">{fileValidation[name]}</Form.Text>
      )}
    </Form.Group>
  );
 
 
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 mt-5 mb-5">
      <Card className="shadow p-4" style={{ width: "40rem", borderTop: "5px solid #41B3A2" }}>
        <h2 className="text-center mb-4" style={{ color: "#41B3A2" }}>Loan Application</h2>
        <ProgressBar
          now={progress}
          animated
          variant="info"
          className="mb-3"
          style={{ height: "10px", borderRadius: "5px" }}
        />
 
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Basic Information */}
          <FormField
            label="Account Number"
            type="text"
            name="accountNumber"
            value={formData.accountNumber}
            disabled
          />
          <FormField
            label="Customer Name"
            type="text"
            name="customerName"
            value={formData.customerName}
            disabled
          />
 
          {/* Dynamic Fields */}
          {["phoneNumber", "aadharNumber", "panNumber"].map(field => (
            <FormField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
            />
          ))}
 
          {/* Loan Information */}
          <SelectField
            label="Loan Type"
            name="loanType"
            value={formData.loanType}
            onChange={handleLoanTypeChange}
            options={LOAN_OPTIONS}
          />
 
          <FormField
            label="Interest Rate (%)"
            type="number"
            name="interestRate"
            value={formData.interestRate}
            disabled
          />
 
          {/* Add these fields after the Interest Rate field */}
          <FormField
            label="Loan Amount"
            type="number"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {validationMessage && (
            <Form.Text className="text-danger">{validationMessage}</Form.Text>
          )}
 
          <FormField
            label="Loan Duration (Months)"
            type="number"
            name="loanDuration"
            value={formData.loanDuration}
            onChange={handleChange}
            required
          />
 
 
 
          {renderLoanTypeSpecificFields()}
 
          {/* Employment Information */}
          <SelectField
            label="Employment Type"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleEmploymentTypeChange}
            options={EMPLOYMENT_OPTIONS}
          />
 
          {renderGuarantorFields()}
 
          {/* Document Uploads */}
          {DOCUMENT_FIELDS.map(field => renderFileUploadField(field.name, field.label))}
 
          <Button
            type="submit"
            className="w-100"
            style={{ backgroundColor: "#41B3A2", border: "none" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : (
              'Apply Now'
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
export default LoanApplication;