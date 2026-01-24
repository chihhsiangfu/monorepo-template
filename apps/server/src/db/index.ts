import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "../db/schema/auth-schema";

const client = new PGlite("./pglite-db");

export const db = drizzle(client, { schema });
