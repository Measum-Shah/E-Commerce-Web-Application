import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async () => {
  try {
    if (!env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;