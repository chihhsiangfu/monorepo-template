import { and, asc, count, desc, eq, like, type SQL, sql } from "drizzle-orm";
import { db } from "../../db";
import {
  favoriteItems as favoriteItemsTable,
  items as itemsTable,
} from "../../db/schema/item-schema";
import type { Item, ItemWithFavorite } from "../../types/types";

export async function listItemsWithFavoriteFn(params: {
  userId?: string;
  limit?: number;
  offset?: number;
  sort?: "asc" | "desc";
  sortBy?: keyof Item;
  searchCategory?: string;
  searchTitle?: string;
}): Promise<{ items: ItemWithFavorite[]; count: number }> {
  const {
    userId,
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
      favorited: sql<boolean>`${favoriteItemsTable.id} IS NOT NULL`,
    })
    .from(itemsTable)
    .leftJoin(
      favoriteItemsTable,
      and(
        eq(favoriteItemsTable.itemId, itemsTable.id),
        userId ? eq(favoriteItemsTable.userId, userId) : undefined,
      ),
    )
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
