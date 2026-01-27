import { ORPCError } from "@orpc/server";
import z from "zod";
import { publicProcedure } from "../../lib/orpc";
import { listItemsFn } from "../../services/items/list-items";

export const listItems = publicProcedure
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).optional().default(10),
      offset: z.number().int().min(0).optional().default(0),
      sort: z.enum(["asc", "desc"]).optional().default("desc"),
      sortBy: z
        .enum([
          "id",
          "title",
          "description",
          "category",
          "metadata",
          "createdAt",
          "updatedAt",
        ])
        .optional()
        .default("createdAt"),
      searchCategory: z.string().optional(),
      searchTitle: z.string().optional(),
    }),
  )
  .handler(async ({ input }) => {
    try {
      const result = await listItemsFn({
        limit: input.limit,
        offset: input.offset,
        sort: input.sort,
        sortBy: input.sortBy,
        searchCategory: input.searchCategory,
        searchTitle: input.searchTitle,
      });

      return result;
    } catch (error) {
      console.error("Error fetching items:", error);

      if (error instanceof ORPCError) {
        throw error;
      }

      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: `Error fetching items: ${error}`,
      });
    }
  });
