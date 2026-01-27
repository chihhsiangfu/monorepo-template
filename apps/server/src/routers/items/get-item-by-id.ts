import { ORPCError } from "@orpc/server";
import z from "zod";
import { publicProcedure } from "../../lib/orpc";
import { getItemByIdFn } from "../../services/items/get-item-by-id";

export const getItemById = publicProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const result = await getItemByIdFn({
        id: input.id,
      });

      return result;
    } catch (error) {
      console.error("Error fetching item by ID:", error);

      if (error instanceof ORPCError) {
        throw error;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: `Error fetching item by ID: ${error}`,
      });
    }
  });
