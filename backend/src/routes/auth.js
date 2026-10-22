const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { auth, signToken } = require("../middleware/auth");

const router = express.Router();

function publicUser(user) {
  return {
    id: user._id,
    email: user.email,
    profile: user.profile,
    documents: (user.documents || []).map((d) => ({
      id: d._id,
      type: d.type,
      originalName: d.originalName,
      extractedFields: d.extractedFields,
      appliedToProfile: d.appliedToProfile,
      createdAt: d.createdAt
    }))
  };
}

router.post("/register", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "An account with this email already exists" });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash,
      profile: { fullName: fullName || "" }
    });
    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/me", auth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = router;
