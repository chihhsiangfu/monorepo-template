import { ORPCError } from "@orpc/server";
import z from "zod";
import { protectedProcedure } from "../../lib/orpc";
import { deleteItemFn } from "../../services/items/delete-item";

export const deleteItem = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const result = await deleteItemFn({
        id: input.id,
      });

      return result;
    } catch (error) {
      console.error("Error deleting item:", error);

      if (error instanceof ORPCError) {
        throw error;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: `Error deleting item: ${error}`,
      });
    }
  });
