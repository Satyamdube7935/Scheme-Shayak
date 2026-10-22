const express = require("express");
const Scheme = require("../models/Scheme");

const router = express.Router();

router.get("/", async (req, res) => {
  const { q, category } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (q) {
    filter.$or = [
      { name: new RegExp(q, "i") },
      { description: new RegExp(q, "i") },
      { tags: new RegExp(q, "i") },
      { ministry: new RegExp(q, "i") }
    ];
  }
  const schemes = await Scheme.find(filter).sort({ name: 1 });
  res.json({ schemes });
});

router.get("/:id", async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);
  if (!scheme) return res.status(404).json({ message: "Scheme not found" });
  res.json({ scheme });
});

module.exports = router;
