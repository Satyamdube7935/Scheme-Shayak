const express = require("express");
const Scheme = require("../models/Scheme");
const RecommendationRun = require("../models/RecommendationRun");
const { auth } = require("../middleware/auth");
const { recommend } = require("../services/eligibilityEngine");

const router = express.Router();

router.post("/run", auth, async (req, res) => {
  const schemes = await Scheme.find();
  const results = recommend(req.user, schemes);
  const run = await RecommendationRun.create({
    user: req.user._id,
    results: results.map((r) => ({
      scheme: r.schemeId,
      eligible: r.eligible,
      status: r.status,
      score: r.score,
      matchedRules: r.matchedRules,
      failedRules: r.failedRules,
      missingFields: r.missingFields,
      explanation: r.explanation
    }))
  });
  res.json({
    runId: run._id,
    summary: {
      eligible: results.filter((r) => r.status === "eligible").length,
      needsMoreInfo: results.filter((r) => r.status === "needs_more_info").length,
      notEligible: results.filter((r) => r.status === "not_eligible").length
    },
    results
  });
});

router.get("/latest", auth, async (req, res) => {
  const run = await RecommendationRun.findOne({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("results.scheme");
  if (!run) return res.json({ results: [] });
  res.json({ runId: run._id, createdAt: run.createdAt, results: run.results });
});

module.exports = router;
