import { eq } from "drizzle-orm";
import { db } from "../../db";
import { items as itemsTable } from "../../db/schema/item-schema";
import type { Item, UpdateItem } from "../../types/types";

export async function updateItemFn(params: {
  id: string;
  updateData: UpdateItem;
}): Promise<{ item: Item }> {
  const items = await db
    .update(itemsTable)
    .set({
      ...params.updateData,
      updatedAt: new Date(),
    })
    .where(eq(itemsTable.id, params.id))
    .returning();

  if (items.length === 0) {
    throw new Error("Item not found");
  }

  return {
    item: items[0]!,
  };
}
