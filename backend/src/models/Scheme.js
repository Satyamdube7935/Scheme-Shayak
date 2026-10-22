const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ministry: String,
    category: String,
    description: String,
    benefits: String,
    officialUrl: String,
    documentsRequired: [String],
    tags: [String],
    eligibility: [
      {
        field: String,
        op: String,
        value: mongoose.Schema.Types.Mixed,
        label: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scheme", schemeSchema);
