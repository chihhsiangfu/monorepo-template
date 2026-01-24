import { migrate } from "drizzle-orm/pglite/migrator";
import { db } from "../src/db";

async function migrateDb() {
  process.env.DB_TYPE = "pglite";

  console.log("🔥 apply migrations");

  try {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
  } catch (error) {
    console.error("❌ migrations failed", error);
    process.exit(1);
  }

  console.log("✅ migrations applied");
  process.exit(0);
}

migrateDb();
