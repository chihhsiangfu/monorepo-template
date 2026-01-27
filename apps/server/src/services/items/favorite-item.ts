import { db } from "../../db";
import { favoriteItems as favoriteItemsTable } from "../../db/schema/item-schema";

export async function favoriteItemFn(params: {
  userId: string;
  itemId: string;
}): Promise<{ success: boolean }> {
  const favoriteItems = await db
    .insert(favoriteItemsTable)
    .values({
      id: crypto.randomUUID(),
      itemId: params.itemId,
      userId: params.userId,
      createdAt: new Date(),
    })
    .returning();

  if (favoriteItems.length === 0) {
    throw new Error("Failed to favorite item");
  }

  return {
    success: true,
  };
}
