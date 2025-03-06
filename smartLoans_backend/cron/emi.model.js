const mongoose = require("mongoose");

const EMISchema = new mongoose.Schema({
    loanId: { type: String, ref: "Loan", required: true, index: true },
    emiNumber: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    principal: { type: Number, required: true },
    interest: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Paid"], default: "Pending" }
}, { timestamps: true });

const EMI = mongoose.model("EMI", EMISchema);
module.exports = EMI;
