import { ORPCError } from "@orpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOrpcMock } from "./orpc-mock";

const mocks = vi.hoisted(() => {
  return {
    listItemsWithFavoriteFn: vi.fn(),
  };
});

vi.mock("../../../services/items/list-items-with-favorite", () => ({
  listItemsWithFavoriteFn: mocks.listItemsWithFavoriteFn,
}));

vi.mock("../../../lib/orpc", () => createOrpcMock());

import { listItemsWithFavorite as _listItemsWithFavorite } from "../list-items-with-favorite";

// Cast procedure as callable for testing (mock replaces with callable function)
const listItemsWithFavorite = _listItemsWithFavorite as unknown as (args: {
  input: {
    limit?: number;
    offset?: number;
    sort?: string;
    sortBy?: string;
    searchTitle?: string;
    searchCategory?: string;
  };
  context: {
    session: { user: { id: string; email: string; name: string } } | null;
  };
}) => Promise<{ items: Array<{ favorited?: boolean }>; count: number }>;

describe("listItemsWithFavorite router", () => {
  const mockSession = {
    user: {
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("public access", () => {
    it("should allow unauthenticated requests", async () => {
      mocks.listItemsWithFavoriteFn.mockResolvedValue({ items: [], count: 0 });

      const result = await listItemsWithFavorite({
        input: {},
        context: { session: null },
      });

      expect(result.items).toEqual([]);
    });

    it("should pass undefined userId when not authenticated", async () => {
      mocks.listItemsWithFavoriteFn.mockResolvedValue({ items: [], count: 0 });

      await listItemsWithFavorite({
        input: {},
        context: { session: null },
      });

      expect(mocks.listItemsWithFavoriteFn).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: undefined,
        }),
      );
    });
  });

  describe("authenticated access", () => {
    it("should pass userId from session when authenticated", async () => {
      mocks.listItemsWithFavoriteFn.mockResolvedValue({ items: [], count: 0 });

      await listItemsWithFavorite({
        input: {},
        context: { session: mockSession },
      });

      expect(mocks.listItemsWithFavoriteFn).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user-123",
        }),
      );
    });
  });

  describe("input validation", () => {
    it("should use default values when no input provided", async () => {
      mocks.listItemsWithFavoriteFn.mockResolvedValue({ items: [], count: 0 });

      await listItemsWithFavorite({
        input: {},
        context: { session: mockSession },
      });

      expect(mocks.listItemsWithFavoriteFn).toHaveBeenCalledWith({
        userId: "user-123",
        limit: 10,
        offset: 0,
        sort: "desc",
        sortBy: "createdAt",
        searchCategory: undefined,
        searchTitle: undefined,
      });
    });

    it("should accept custom pagination", async () => {
      mocks.listItemsWithFavoriteFn.mockResolvedValue({ items: [], count: 0 });

      await listItemsWithFavorite({
        input: { limit: 20, offset: 10 },
        context: { session: mockSession },
      });

      expect(mocks.listItemsWithFavoriteFn).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 20,
          offset: 10,
        }),
      );
    });

    it("should reject limit over 100", async () => {
      await expect(
        listItemsWithFavorite({
          input: { limit: 101 },
          context: { session: mockSession },
        }),
      ).rejects.toThrow();
    });
  });

  describe("service integration", () => {
    it("should return items with favorite status", async () => {
      const mockItems = [
        {
          id: "1",
          title: "Item 1",
          description: "Desc 1",
          category: "cat1",
          metadata: {},
          createdAt: new Date(),
          updatedAt: new Date(),
          favorited: true,
        },
        {
          id: "2",
          title: "Item 2",
          description: "Desc 2",
          category: "cat2",
          metadata: {},
          createdAt: new Date(),
          updatedAt: new Date(),
          favorited: false,
        },
      ];

      mocks.listItemsWithFavoriteFn.mockResolvedValue({
        items: mockItems,
        count: 2,
      });

      const result = await listItemsWithFavorite({
        input: {},
        context: { session: mockSession },
      });

      expect(result.items).toHaveLength(2);
      expect(result.items[0]?.favorited).toBe(true);
      expect(result.items[1]?.favorited).toBe(false);
    });
  });

  describe("error handling", () => {
    it("should re-throw ORPCError as-is", async () => {
      const orpcError = new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Database error",
      });
      mocks.listItemsWithFavoriteFn.mockRejectedValue(orpcError);

      await expect(
        listItemsWithFavorite({
          input: {},
          context: { session: mockSession },
        }),
      ).rejects.toThrow(orpcError);
    });

    it("should wrap non-ORPCError in INTERNAL_SERVER_ERROR", async () => {
      mocks.listItemsWithFavoriteFn.mockRejectedValue(
        new Error("Database error"),
      );

      await expect(
        listItemsWithFavorite({
          input: {},
          context: { session: mockSession },
        }),
      ).rejects.toThrow(ORPCError);
    });
  });
});
