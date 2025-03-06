const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
    loanId: { type: String, required: true, unique: true, index: true },
    accountNumber: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, index: true },
    panNumber: { type: String, required: true },
    aadharNumber: { type: String, required: true },
    loanAmount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    loanDuration: { type: Number, required: true },
    loanType: { type: String, required: true, enum: ["Home Loan", "Education Loan", "Personal Loan", "Gold Loan"] },
    employmentType: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected", "Completed"], default: "Pending" },
    remainingEmi: { type: Number },
    nextEmiDate: { type: Date },
    active: { type: Boolean, default: true }
});

const Loan = mongoose.model("Loan", LoanSchema);
module.exports = Loan;
