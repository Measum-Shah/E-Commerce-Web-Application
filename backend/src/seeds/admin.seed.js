import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: "admin@techshop.com"
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    await User.create({
      fullName: "TechShop Admin",
      email: "admin@techshop.com",
      phone: "03000000000",
      password: "admin123",
      role: "admin"
    });

    console.log("Admin seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedAdmin();