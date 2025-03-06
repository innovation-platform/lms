// Create a new file: src/Customer/constants/formConstants.js
export const EMPLOYMENT_OPTIONS = [
    { value: "Govt", label: "Government" },
    { value: "Private", label: "Private" },
    { value: "Other", label: "Other" }
  ];
  
  export const LOAN_SPECIFIC_FIELDS = {
    "Home Loan": [
      { name: "propertyValue", label: "Property Value", type: "number" },
      { name: "propertyLocation", label: "Property Location", type: "text" }
    ],
    "Personal Loan": [
      { name: "purpose", label: "Purpose of Loan", type: "text" }
    ],
    "Education Loan": [
      { name: "courseName", label: "Course Name", type: "text" },
      { name: "institutionName", label: "Institution Name", type: "text" }
    ],
    "Gold Loan": [
      { name: "goldWeight", label: "Gold Weight (in grams)", type: "number" },
      { name: "goldPurity", label: "Gold Purity (in Karat)", type: "text" }
    ]
  };
  
  export const GUARANTOR_FIELDS = [
    { name: "guarantorName", label: "Guarantor Name", type: "text" },
    { name: "guarantorIncome", label: "Guarantor Income", type: "number" },
    { name: "relationship", label: "Guarantor Relationship", type: "text" }
  ];
  
  export const DOCUMENT_FIELDS = [
    { name: "passportPhoto", label: "Upload Passport Photo" },
    { name: "aadharCard", label: "Upload Aadhar Card" },
    { name: "panCard", label: "Upload PAN Card" },
    { name: "signature", label: "Upload Signature" }
  ];
  