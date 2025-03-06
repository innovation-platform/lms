const mongoose = require("mongoose");
 
const LoanSchema = new mongoose.Schema({
    loanId: { type: String, required: true, unique: true, index: true },
    accountNumber: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, index: true },
    panNumber: { type: String, required: true },
    aadharNumber: { type: String, required: true},
    loanAmount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    loanDuration: { type: Number, required: true },
    loanType: {
        type: String,
        required: true,
        enum: ["Home Loan", "Education Loan", "Personal Loan", "Gold Loan"]
    },
    employmentType: { type: String, required: true },
 
    // Guarantor details (for non-government employees)
    suretyDetails: {
        guarantorName: { type: String },
        guarantorIncome: { type: Number },
        relationship: { type: String }
    },
 
    // Loan Status
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    remarks: { type: String },
    documentVerification: { type: Boolean, default: false },
 
    // EMI details
    emiAmount: { type: Number },
    dueDate: { type: Date },
    cibilScore: { type: Number },
    itrValue: { type: Number },
    remainingEmi: { type: Number },
 
    // Loan Type Specific Fields
    homeLoanDetails: {
        propertyValue: { type: Number },
        propertyLocation: { type: String }
    },
    educationLoanDetails: {
        courseName: { type: String },
        institutionName: { type: String }
    },
    personalLoanDetails: {
        purpose: { type: String }
    },
    goldLoanDetails: {
        goldWeight: { type: Number },
        goldPurity: { type: String }
    },
 
    // Documents Upload
    documents: [{
        filename: { type: String },
        mimetype: { type: String },
        data: { type: String } // Base64 encoded file
    }],
 
    // // EMI Payment History
    // emiHistory: [{
    //     dueDate: { type: Date },
    //     paymentDate: { type: Date },
    //     lateFee: { type: Number },
    //     principal: { type: Number },
    //     interest: { type: Number },
    //     paid: { type: Boolean, default: false }
    // }],
    totalEmis: { type: Number, required: true },
    paidEmis: { type: Number, default: 0 },
    nextEmiDate: { type: Date },
    emiAmount: { type: Number },
    totalEmis: { type: Number },
    paidEmis: { type: Number, default: 0 },
    nextEmiDate: { type: Date },
    remainingPrincipal: { type: Number },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
        default: 'Pending'
    },
 
    active: { type: Boolean, default: true },
    submittedOn: { type: Date, default: Date.now }, // Add this field to track submission date
    approvedOn: { type: Date },
   
 
});
 
 
// Export the Loan model
const Loan= mongoose.model("Loan", LoanSchema);
module.exports = Loan;