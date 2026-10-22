const fs = require("fs");
const path = require("path");
const multer = require("multer");

const dest = path.join(__dirname, "../../uploads");
if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, dest),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^\w.\-]+/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /jpeg|jpg|png|webp|pdf/i.test(path.extname(file.originalname)) ||
      ["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.mimetype);
    if (!ok) return cb(new Error("Upload an image (JPG/PNG) or PDF"));
    cb(null, true);
  }
});

module.exports = { upload, dest };
