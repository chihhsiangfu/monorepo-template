import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { favoriteItems as favoriteItemsTable } from "../../db/schema/item-schema";

export async function unfavoriteItemFn(params: {
  userId: string;
  itemId: string;
}): Promise<{ success: boolean }> {
  const favoriteItems = await db
    .delete(favoriteItemsTable)
    .where(
      and(
        eq(favoriteItemsTable.userId, params.userId),
        eq(favoriteItemsTable.itemId, params.itemId),
      ),
    )
    .returning();

  if (favoriteItems.length === 0) {
    throw new Error("Failed to unfavorite item");
  }

  return {
    success: true,
  };
}
