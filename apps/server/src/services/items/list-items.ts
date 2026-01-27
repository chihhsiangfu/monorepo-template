import { and, asc, count, desc, eq, like, type SQL } from "drizzle-orm";
import { db } from "../../db";
import { items as itemsTable } from "../../db/schema/item-schema";
import type { Item } from "../../types/types";

export async function listItemsFn(params: {
  limit?: number;
  offset?: number;
  sort?: "asc" | "desc";
  sortBy?: keyof Item;
  searchCategory?: string;
  searchTitle?: string;
}): Promise<{ items: Item[]; count: number }> {
  const {
    limit = 10,
    offset = 0,
    sort = "desc",
    sortBy = "createdAt",
    searchCategory,
    searchTitle,
  } = params;

  const filters: SQL[] = [];
  if (searchCategory) {
    filters.push(eq(itemsTable.category, searchCategory));
  }
  if (searchTitle) {
    filters.push(like(itemsTable.title, `%${searchTitle}%`));
  }

  const orderBy: SQL =
    sort === "asc" ? asc(itemsTable[sortBy]) : desc(itemsTable[sortBy]);

  const items = await db
    .select({
      id: itemsTable.id,
      title: itemsTable.title,
      description: itemsTable.description,
      category: itemsTable.category,
      metadata: itemsTable.metadata,
      createdAt: itemsTable.createdAt,
      updatedAt: itemsTable.updatedAt,
    })
    .from(itemsTable)
    .where(and(...filters))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: count() })
    .from(itemsTable)
    .where(and(...filters));

  return {
    items,
    count: countResult[0]!.count,
  };
}
