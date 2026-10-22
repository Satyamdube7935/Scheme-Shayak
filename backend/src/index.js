require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Scheme = require("./models/Scheme");
const seed = require("./data/schemes");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const documentRoutes = require("./routes/documents");
const schemeRoutes = require("./routes/schemes");
const recommendationRoutes = require("./routes/recommendations");

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true, name: "Scheme Sahayak" }));
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/schemes", schemeRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.use((err, _req, res, _next) => {
  res.status(400).json({ message: err.message || "Request failed" });
});

async function ensureSchemes() {
  const count = await Scheme.countDocuments();
  if (count === 0) {
    await Scheme.insertMany(seed);
    console.log(`Inserted ${seed.length} schemes`);
  }
}

const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await ensureSchemes();
    app.listen(port, () => console.log(`Scheme Sahayak API on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
