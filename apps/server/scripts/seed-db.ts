import { db } from "../src/db";

async function seedDb() {
  process.env.DB_TYPE = "pglite";

  console.log("🌱 seed database");

  try {
    console.log("🌱 seed users");
  } catch (error) {
    console.error("❌ seed failed", error);
    process.exit(1);
  }

  console.log("✅ seed completed");
  process.exit(0);
}

seedDb();
