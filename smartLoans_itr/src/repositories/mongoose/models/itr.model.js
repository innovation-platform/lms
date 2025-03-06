const mongoose = require("mongoose");

const ITRSchema = mongoose.Schema({
    customer_id: { type: String, required: true, unique: true },
    annualIncome: { type: Number, required: true },
    updatedOn: { type: Date, default: Date.now },
    status: { type: String, enum: ["verified", "unverified"], default: "verified" }
});

const ITR = mongoose.model("Itr", ITRSchema);
module.exports=ITR;
