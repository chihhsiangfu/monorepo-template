import { migrate } from "drizzle-orm/pglite/migrator";
import { db } from "../src/db";

export async function applyMigrations() {
  process.env.DB_TYPE = "pglite";

  console.log("🔥 apply migrations");

  await migrate(db, { migrationsFolder: "./src/migrations" });
}
