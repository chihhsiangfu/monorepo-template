import { db } from "../../db";
import { items as itemsTable } from "../../db/schema/item-schema";
import type { InsertItem, Item } from "../../types/types";

export async function createItemFn(params: {
  newData: InsertItem;
}): Promise<{ item: Item }> {
  const items = await db
    .insert(itemsTable)
    .values({
      id: crypto.randomUUID(),
      ...params.newData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  if (items.length === 0) {
    throw new Error("Item not found");
  }

  return {
    item: items[0]!,
  };
}
