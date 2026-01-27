import { ORPCError } from "@orpc/server";
import z from "zod";
import { protectedProcedure } from "../../lib/orpc";
import { createItemFn } from "../../services/items/create-item";

export const createItem = protectedProcedure
  .input(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      category: z.string(),
      metadata: z.record(z.string(), z.any()),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const result = await createItemFn({
        newData: input,
      });

      return result;
    } catch (error) {
      console.error("Error creating item:", error);

      if (error instanceof ORPCError) {
        throw error;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: `Error creating item: ${error}`,
      });
    }
  });
