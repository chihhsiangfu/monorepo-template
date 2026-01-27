import { ORPCError } from "@orpc/server";
import z from "zod";
import { protectedProcedure } from "../../lib/orpc";
import { unfavoriteItemFn } from "../../services/items/unfavorite-item";

export const unfavoriteItem = protectedProcedure
  .input(
    z.object({
      itemId: z.string(),
    }),
  )
  .handler(async ({ input, context }) => {
    try {
      const { session } = context;
      const userId = session.user.id;

      const result = await unfavoriteItemFn({
        userId,
        itemId: input.itemId,
      });

      return result;
    } catch (error) {
      console.error("Error unfavoriting item:", error);

      if (error instanceof ORPCError) {
        throw error;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: `Error unfavoriting item: ${error}`,
      });
    }
  });
