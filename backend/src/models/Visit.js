import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  ip: String,
  city: String,
  region: String,
  country: String,
  lat: Number,
  lon: Number,
  userAgent: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Visit", visitSchema);