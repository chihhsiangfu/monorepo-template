export type Item = {
  id: string;
  title: string;
  description: string;
  category: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertItem = Omit<Item, "id" | "createdAt" | "updatedAt">;
export type UpdateItem = Partial<InsertItem>;
export type ItemWithFavorite = Item & { favorited: boolean };
