import "dotenv/config";

import { db } from "../src/db";
import { auth } from "../src/lib/auth";

async function seedDb() {
  process.env.DB_TYPE = "pglite";

  console.log("🌱 seed database");

  try {
    console.log("🌱 seed users");

    await auth.api.signUpEmail({
      body: {
        name: "test-user",
        email: "test@test.com",
        password: "test1234",
      },
    });

    console.log("🌱 seed users completed");
  } catch (error) {
    console.error("❌ seed failed", error);
    process.exit(1);
  }

  console.log("✅ seed completed");
  process.exit(0);
}

seedDb();
