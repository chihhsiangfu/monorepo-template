import { protectedProcedure, publicProcedure } from "../lib/orpc";
import { createItem } from "./items/create-item";
import { deleteItem } from "./items/delete-item";
import { favoriteItem } from "./items/favorite-item";
import { getItemById } from "./items/get-item-by-id";
import { listItems } from "./items/list-items";
import { listItemsWithFavorite } from "./items/list-items-with-favorite";
import { unfavoriteItem } from "./items/unfavorite-item";
import { updateItem } from "./items/update-item";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  items: {
    listItems,
    listItemsWithFavorite,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    favoriteItem,
    unfavoriteItem,
  },
};

export type AppRouter = typeof appRouter;
