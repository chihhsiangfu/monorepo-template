import { ORPCError } from "@orpc/server";
import z from "zod";
import { protectedProcedure } from "../../lib/orpc";
import { updateItemFn } from "../../services/items/update-item";

export const updateItem = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      metadata: z.record(z.string(), z.any()).optional(),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const { id, ...updateData } = input;

      const result = await updateItemFn({
        id,
        updateData,
      });

      return result;
    } catch (error) {
      console.error("Error updating item:", error);

      if (error instanceof ORPCError) {
        throw error;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: `Error updating item: ${error}`,
      });
    }
  });
