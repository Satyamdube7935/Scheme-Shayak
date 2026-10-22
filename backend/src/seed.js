require("dotenv").config();
const mongoose = require("mongoose");
const Scheme = require("./models/Scheme");
const seed = require("./data/schemes");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const item of seed) {
    await Scheme.findOneAndUpdate({ code: item.code }, item, { upsert: true, new: true });
  }
  console.log(`Seeded ${seed.length} schemes`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
