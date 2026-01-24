import { migrate } from "drizzle-orm/pglite/migrator";
import { db } from "../src/db";

async function applyMigrations() {
  process.env.DB_TYPE = "pglite";

  console.log("🔥 apply migrations");

  await migrate(db, { migrationsFolder: "./src/db/migrations" });

  console.log("✅ migrations applied");

  process.exit(0);
}

applyMigrations();
