import { eq } from "drizzle-orm";
import { db } from "../../db";
import { items as itemsTable } from "../../db/schema/item-schema";
import type { Item } from "../../types/types";

export async function deleteItemFn(params: {
  id: string;
}): Promise<{ item: Item }> {
  const items = await db
    .delete(itemsTable)
    .where(eq(itemsTable.id, params.id))
    .returning();

  if (items.length === 0) {
    throw new Error("Item not found");
  }

  return {
    item: items[0]!,
  };
}
