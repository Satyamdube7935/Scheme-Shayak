const express = require("express");
const { auth } = require("../middleware/auth");
const { ageFromDob } = require("../services/documentParser");

const router = express.Router();

router.put("/", auth, async (req, res) => {
  const allowed = [
    "fullName", "dateOfBirth", "age", "gender", "state", "district", "ruralUrban",
    "category", "annualIncome", "occupation", "maritalStatus", "hasDisability",
    "disabilityPercent", "isFarmer", "landHoldingAcres", "isStudent", "educationLevel",
    "hasOwnHouse", "hasLPG", "hasBankAccount", "rationCardType"
  ];
  const next = { ...(req.user.profile?.toObject?.() || req.user.profile || {}) };
  for (const key of allowed) {
    if (req.body[key] !== undefined) next[key] = req.body[key];
  }
  if (next.dateOfBirth && (next.age === null || next.age === undefined || next.age === "")) {
    const age = ageFromDob(next.dateOfBirth);
    if (age !== null) next.age = age;
  }
  if (next.occupation === "farmer") next.isFarmer = true;
  if (next.occupation === "student") next.isStudent = true;
  req.user.profile = next;
  await req.user.save();
  res.json({ profile: req.user.profile });
});

module.exports = router;
