const mongoose = require("mongoose");

const recommendationRunSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    results: [
      {
        scheme: { type: mongoose.Schema.Types.ObjectId, ref: "Scheme" },
        eligible: Boolean,
        status: { type: String, enum: ["eligible", "not_eligible", "needs_more_info"] },
        score: Number,
        matchedRules: [String],
        failedRules: [String],
        missingFields: [String],
        explanation: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("RecommendationRun", recommendationRunSchema);
