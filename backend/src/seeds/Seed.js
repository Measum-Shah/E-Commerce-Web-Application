import mongoose from "mongoose";
import dotenv from "dotenv";

import Category from "../models/Category.js";
import Product from "../models/Product.js";

import categories from "./categorySeeder.js";
import productsByCategory from "./productSeeder.js";

dotenv.config();

const MONGO_URI = "mongodb://premiercomputers007_db_user:measum112233@ac-r0kzeu9-shard-00-00.rspbmwm.mongodb.net:27017,ac-r0kzeu9-shard-00-01.rspbmwm.mongodb.net:27017,ac-r0kzeu9-shard-00-02.rspbmwm.mongodb.net:27017/premierstore?ssl=true&replicaSet=atlas-14jw06-shard-0&authSource=admin&appName=Premier-Cluster";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const log = {
  info:    (msg) => console.log(`\n  ℹ️  ${msg}`),
  success: (msg) => console.log(`  ✅  ${msg}`),
  warn:    (msg) => console.log(`  ⚠️  ${msg}`),
  error:   (msg) => console.error(`  ❌  ${msg}`),
  divider: ()    => console.log("\n" + "─".repeat(60))
};

// ─── Main Seeder ─────────────────────────────────────────────────────────────

async function seed() {
  log.divider();
  console.log("  🌱  DATABASE SEEDER");
  log.divider();

  // 1. Connect
  log.info("Connecting to MongoDB…");
  await mongoose.connect(MONGO_URI);
  log.success(`Connected to: ${mongoose.connection.host}`);

  // 2. Clear existing data
  log.info("Clearing existing categories and products…");
  await Category.deleteMany({});
  await Product.deleteMany({});
  log.success("Cleared existing data.");

  // 3. Seed categories
  log.info(`Seeding ${categories.length} categories…`);
  const insertedCategories = await Category.insertMany(categories);
  log.success(`Inserted ${insertedCategories.length} categories.`);

  // Build a slug → ObjectId map for easy product lookup
  const categoryMap = {};
  insertedCategories.forEach((cat) => {
    categoryMap[cat.slug] = cat._id;
  });

  // 4. Seed products
  log.info("Seeding products…");

  const allProducts = [];
  let totalProducts = 0;

  for (const [categorySlug, products] of Object.entries(productsByCategory)) {
    const categoryId = categoryMap[categorySlug];

    if (!categoryId) {
      log.warn(`No category found for slug "${categorySlug}" — skipping its products.`);
      continue;
    }

    const productDocs = products.map((p) => ({
      ...p,
      category: categoryId
    }));

    allProducts.push(...productDocs);
    totalProducts += productDocs.length;

    log.info(`Queued ${productDocs.length} products for category "${categorySlug}"`);
  }

  const insertedProducts = await Product.insertMany(allProducts);
  log.success(`Inserted ${insertedProducts.length} products across all categories.`);

  // 5. Summary
  log.divider();
  console.log("  📊  SEED SUMMARY");
  log.divider();
  console.log(`  Categories : ${insertedCategories.length}`);
  console.log(`  Products   : ${insertedProducts.length}`);

  // Per-category breakdown
  console.log("\n  Products per category:");
  for (const cat of insertedCategories) {
    const count = insertedProducts.filter(
      (p) => p.category.toString() === cat._id.toString()
    ).length;
    console.log(`    • ${cat.name.padEnd(22)} ${count} products`);
  }

  log.divider();
  log.success("Seeding complete! 🎉");
  log.divider();
}

// ─── Run ─────────────────────────────────────────────────────────────────────

seed()
  .catch((err) => {
    log.error("Seeding failed:");
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
    console.log("\n  🔌  Disconnected from MongoDB.\n");
  });