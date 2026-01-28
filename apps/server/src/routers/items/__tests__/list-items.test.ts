import { ORPCError } from "@orpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOrpcMock } from "./orpc-mock";

const mocks = vi.hoisted(() => {
  return {
    listItemsFn: vi.fn(),
  };
});

vi.mock("../../../services/items/list-items", () => ({
  listItemsFn: mocks.listItemsFn,
}));

vi.mock("../../../lib/orpc", () => createOrpcMock());

import { listItems as _listItems } from "../list-items";

// Cast procedure as callable for testing (mock replaces with callable function)
const listItems = _listItems as unknown as (args: {
  input: {
    limit?: number;
    offset?: number;
    sort?: string;
    sortBy?: string;
    searchTitle?: string;
    searchCategory?: string;
  };
  context: { session: unknown };
}) => Promise<{ items: unknown[]; count: number }>;

describe("listItems router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("public access", () => {
    it("should allow unauthenticated requests", async () => {
      mocks.listItemsFn.mockResolvedValue({ items: [], count: 0 });

      const result = await listItems({
        input: {},
        context: { session: null },
      });

      expect(result.items).toEqual([]);
      expect(result.count).toBe(0);
    });
  });

  describe("input validation", () => {
    it("should use default values when no input provided", async () => {
      mocks.listItemsFn.mockResolvedValue({ items: [], count: 0 });

      await listItems({
        input: {},
        context: { session: null },
      });

      expect(mocks.listItemsFn).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
        sort: "desc",
        sortBy: "createdAt",
        searchCategory: undefined,
        searchTitle: undefined,
      });
    });

    it("should accept custom pagination", async () => {
      mocks.listItemsFn.mockResolvedValue({ items: [], count: 0 });

      await listItems({
        input: { limit: 20, offset: 10 },
        context: { session: null },
      });

      expect(mocks.listItemsFn).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 20,
          offset: 10,
        }),
      );
    });

    it("should accept sort parameters", async () => {
      mocks.listItemsFn.mockResolvedValue({ items: [], count: 0 });

      await listItems({
        input: { sort: "asc", sortBy: "title" },
        context: { session: null },
      });

      expect(mocks.listItemsFn).toHaveBeenCalledWith(
        expect.objectContaining({
          sort: "asc",
          sortBy: "title",
        }),
      );
    });

    it("should accept search parameters", async () => {
      mocks.listItemsFn.mockResolvedValue({ items: [], count: 0 });

      await listItems({
        input: { searchTitle: "test", searchCategory: "category" },
        context: { session: null },
      });

      expect(mocks.listItemsFn).toHaveBeenCalledWith(
        expect.objectContaining({
          searchTitle: "test",
          searchCategory: "category",
        }),
      );
    });

    it("should reject limit over 100", async () => {
      await expect(
        listItems({
          input: { limit: 101 },
          context: { session: null },
        }),
      ).rejects.toThrow();
    });

    it("should reject negative offset", async () => {
      await expect(
        listItems({
          input: { offset: -1 },
          context: { session: null },
        }),
      ).rejects.toThrow();
    });
  });

  describe("service integration", () => {
    it("should return items and count", async () => {
      const mockItems = [
        {
          id: "1",
          title: "Item 1",
          description: "Desc 1",
          category: "cat1",
          metadata: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "2",
          title: "Item 2",
          description: "Desc 2",
          category: "cat2",
          metadata: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mocks.listItemsFn.mockResolvedValue({ items: mockItems, count: 2 });

      const result = await listItems({
        input: {},
        context: { session: null },
      });

      expect(result.items).toHaveLength(2);
      expect(result.count).toBe(2);
    });
  });

  describe("error handling", () => {
    it("should re-throw ORPCError as-is", async () => {
      const orpcError = new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Database error",
      });
      mocks.listItemsFn.mockRejectedValue(orpcError);

      await expect(
        listItems({
          input: {},
          context: { session: null },
        }),
      ).rejects.toThrow(orpcError);
    });

    it("should wrap non-ORPCError in INTERNAL_SERVER_ERROR", async () => {
      mocks.listItemsFn.mockRejectedValue(new Error("Database error"));

      await expect(
        listItems({
          input: {},
          context: { session: null },
        }),
      ).rejects.toThrow(ORPCError);
    });
  });
});
