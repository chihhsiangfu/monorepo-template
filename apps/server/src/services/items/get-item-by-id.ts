import { eq } from "drizzle-orm";
import { db } from "../../db";
import { items as itemsTable } from "../../db/schema/item-schema";
import type { Item } from "../../types/types";

export async function getItemByIdFn(params: {
  id: string;
}): Promise<{ item: Item }> {
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
    .where(eq(itemsTable.id, params.id))
    .limit(1);

  if (items.length === 0) {
    throw new Error("Item not found");
  }

  return {
    item: items[0]!,
  };
}
