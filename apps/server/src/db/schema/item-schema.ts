import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const items = pgTable("items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  metadata: jsonb("metadata")
    .$type<Record<string, any>>()
    .default({})
    .notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const favoriteItems = pgTable("favorite_items", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  itemId: text("item_id")
    .notNull()
    .references(() => items.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
});
