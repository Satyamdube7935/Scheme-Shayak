const express = require("express");
const path = require("path");
const fs = require("fs");
const { auth } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const { extractText, parseByType, applyFieldsToProfile } = require("../services/documentParser");

const router = express.Router();

router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Choose a document to upload" });
    const type = req.body.type || "other";
    let extractedText = "";
    let extractedFields = {};
    try {
      extractedText = await extractText(req.file.path, req.file.mimetype);
      extractedFields = parseByType(type, extractedText);
    } catch (err) {
      extractedText = "";
      extractedFields = { parseError: "Could not read text from this file. You can still fill the profile manually." };
    }

    const apply = req.body.applyToProfile !== "false";
    if (apply) {
      req.user.profile = applyFieldsToProfile(
        req.user.profile?.toObject?.() || req.user.profile || {},
        extractedFields
      );
    }

    req.user.documents.push({
      type,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      extractedText: extractedText.slice(0, 8000),
      extractedFields,
      appliedToProfile: apply
    });
    await req.user.save();
    const doc = req.user.documents[req.user.documents.length - 1];
    res.status(201).json({
      document: {
        id: doc._id,
        type: doc.type,
        originalName: doc.originalName,
        extractedFields: doc.extractedFields,
        extractedPreview: extractedText.slice(0, 600),
        appliedToProfile: doc.appliedToProfile
      },
      profile: req.user.profile
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  const doc = req.user.documents.id(req.params.id);
  if (!doc) return res.status(404).json({ message: "Document not found" });
  const filePath = path.join(__dirname, "../../uploads", doc.storedName || "");
  if (doc.storedName && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  doc.deleteOne();
  await req.user.save();
  res.json({ ok: true });
});

module.exports = router;
