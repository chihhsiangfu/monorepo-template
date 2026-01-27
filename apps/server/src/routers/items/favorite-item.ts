import { ORPCError } from "@orpc/server";
import z from "zod";
import { protectedProcedure } from "../../lib/orpc";
import { favoriteItemFn } from "../../services/items/favorite-item";

export const favoriteItem = protectedProcedure
  .input(
    z.object({
      itemId: z.string(),
    }),
  )
  .handler(async ({ input, context }) => {
    try {
      const { session } = context;
      const userId = session.user.id;

      const result = await favoriteItemFn({
        userId,
        itemId: input.itemId,
      });

      return result;
    } catch (error) {
      console.error("Error favoriting item:", error);

      if (error instanceof ORPCError) {
        throw error;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: `Error favoriting item: ${error}`,
      });
    }
  });
