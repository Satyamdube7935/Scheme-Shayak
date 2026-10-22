const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "aadhaar",
        "pan",
        "income_certificate",
        "caste_certificate",
        "disability_certificate",
        "ration_card",
        "land_record",
        "other"
      ],
      required: true
    },
    originalName: String,
    storedName: String,
    mimeType: String,
    extractedText: { type: String, default: "" },
    extractedFields: { type: mongoose.Schema.Types.Mixed, default: {} },
    appliedToProfile: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const profileSchema = new mongoose.Schema({
  fullName: { type: String, default: "" },
  dateOfBirth: { type: String, default: "" },
  age: { type: Number, default: null },
  gender: { type: String, enum: ["", "male", "female", "other"], default: "" },
  state: { type: String, default: "" },
  district: { type: String, default: "" },
  ruralUrban: { type: String, enum: ["", "rural", "urban"], default: "" },
  category: {
    type: String,
    enum: ["", "GEN", "OBC", "SC", "ST", "EWS", "Minority"],
    default: ""
  },
  annualIncome: { type: Number, default: null },
  occupation: { type: String, default: "" },
  maritalStatus: {
    type: String,
    enum: ["", "single", "married", "widow", "divorced"],
    default: ""
  },
  hasDisability: { type: Boolean, default: false },
  disabilityPercent: { type: Number, default: null },
  isFarmer: { type: Boolean, default: false },
  landHoldingAcres: { type: Number, default: null },
  isStudent: { type: Boolean, default: false },
  educationLevel: { type: String, default: "" },
  hasOwnHouse: { type: Boolean, default: false },
  hasLPG: { type: Boolean, default: false },
  hasBankAccount: { type: Boolean, default: true },
  rationCardType: {
    type: String,
    enum: ["", "AAY", "BPL", "PHH", "APL", "none"],
    default: ""
  }
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    profile: { type: profileSchema, default: () => ({}) },
    documents: [documentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
