const mongoose = require("mongoose");

const CibilScoreSchema = mongoose.Schema({
    //customer_id: { type: String, required: true },
    panNumber: { type: String, required: true },
    aadharNumber: { type: String, required: true },
    cibil_score: { type: Number, required: true },
    score_updated_at: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
});

const Cibil= mongoose.model("cibil_scores", CibilScoreSchema,'cibil');
module.exports = Cibil;
