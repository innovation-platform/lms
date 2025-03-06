
export const FILE_CONSTRAINTS = {
    maxSize: 5 * 1024 * 1024,
    validTypes: ["image/jpeg", "image/png", "application/pdf"]
  };
  
  export const LoanValidator = {
    validateAmount: (amount) => {
      const numericValue = Number(amount);
      
      if (!amount) {
        return "Loan amount is required.";
      }
      
      if (numericValue < 10000 || numericValue > 10000000) {
        return "Loan amount should be between ₹10,000 and ₹1,00,00,000.";
      }
      
      return "";
    },
  
    validateFile: (file) => {
      if (!file) return "File is required";
      
      if (!FILE_CONSTRAINTS.validTypes.includes(file.type)) {
        return "Invalid file type. Only JPG, PNG, and PDF are allowed.";
      }
      
      if (file.size > FILE_CONSTRAINTS.maxSize) {
        return "File size exceeds the 5MB limit.";
      }
      
      return "";
    },
  
    validateRequiredFields: (formData) => {
      const basicFields = [
        'accountNumber', 'customerName', 'phoneNumber', 'email',
        'panNumber', 'aadharNumber', 'loanAmount', 'interestRate',
        'loanDuration', 'loanType', 'employmentType'
      ];
  
      // Basic fields validation
      const hasAllBasicFields = basicFields.every(field => formData[field]);
      if (!hasAllBasicFields) return false;
  
      // Loan-specific validations
      const loanTypeValidations = {
        "Home Loan": () => formData.propertyValue && formData.propertyLocation,
        "Personal Loan": () => formData.purpose,
        "Education Loan": () => formData.courseName && formData.institutionName,
        "Gold Loan": () => formData.goldWeight && formData.goldPurity
      };
  
      const isLoanTypeValid = loanTypeValidations[formData.loanType]?.();
      if (!isLoanTypeValid) return false;
  
      // Guarantor validation for non-government employees
      if (formData.employmentType !== "Govt") {
        const hasGuarantorInfo = formData.guarantorName && 
                                formData.guarantorIncome && 
                                formData.relationship;
        if (!hasGuarantorInfo) return false;
      }
  
      return true;
    }
  };
  
 // src/utils/validators.js
export const PasswordValidator = {
    validate: (password) => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[\W_]/.test(password),
    }),
  };
  
  export const FormValidator = {
    validateRegistrationData: (formData) => {
      let errors = {};
      
      // Name validation
      if (!formData.name.trim()) {
        errors.name = "Full Name is required.";
      } else if (/[^a-zA-Z\s]/.test(formData.name) || 
                 formData.name.length < 2 || 
                 formData.name.length > 50) {
        errors.name = "Name must be 2-50 characters, letters only.";
      }
  
      // Email validation
      if (!formData.email.trim()) {
        errors.email = "Email is required.";
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
        errors.email = "Invalid email format.";
      }
  
      // Phone validation
      if (!formData.phone.trim()) {
        errors.phone = "Phone number is required.";
      } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
        errors.phone = "Must be a valid 10-digit number starting with 6-9.";
      }
  
      // Address validation
      if (!formData.address.trim()) {
        errors.address = "Address is required.";
      } else if (formData.address.length < 5 || formData.address.length > 200) {
        errors.address = "Must be 5-200 characters.";
      }
  
      // Password validation
      const passwordRules = PasswordValidator.validate(formData.password);
      if (!Object.values(passwordRules).every(rule => rule)) {
        errors.password = "Password does not meet requirements";
      }
  
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    },
  };
  