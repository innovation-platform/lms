// models/transaction.model.js
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
    loanId: { type: String, required: true, index: true },
    emiId: { type: mongoose.Schema.Types.ObjectId, ref: 'EMI' },
    amount: { type: Number, required: true },
    lateFee: { type: Number, default: 0 },
    paymentMethod: { type: String, required: true },
    paymentDetails: { type: Object },
    status: { 
        type: String, 
        enum: ['Success', 'Failed', 'Pending'], 
        default: 'Pending' 
    }
}, { timestamps: true });

const Transactions = mongoose.model("Transaction", TransactionSchema);
module.exports = Transactions;