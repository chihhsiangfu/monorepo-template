import { ORPCError } from "@orpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOrpcMock } from "./orpc-mock";

const mocks = vi.hoisted(() => {
  return {
    getItemByIdFn: vi.fn(),
  };
});

vi.mock("../../../services/items/get-item-by-id", () => ({
  getItemByIdFn: mocks.getItemByIdFn,
}));

vi.mock("../../../lib/orpc", () => createOrpcMock());

import { getItemById as _getItemById } from "../get-item-by-id";

// Cast procedure as callable for testing (mock replaces with callable function)
const getItemById = _getItemById as unknown as (args: {
  input: { id: string };
  context: { session: unknown };
}) => Promise<{ item: { id: string; title: string } }>;

describe("getItemById router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("public access", () => {
    it("should allow unauthenticated requests", async () => {
      const mockItem = {
        id: "item-123",
        title: "Test Item",
        description: "Description",
        category: "test",
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mocks.getItemByIdFn.mockResolvedValue({ item: mockItem });

      const result = await getItemById({
        input: { id: "item-123" },
        context: { session: null },
      });

      expect(result.item).toEqual(mockItem);
    });
  });

  describe("service integration", () => {
    it("should call getItemByIdFn with correct id", async () => {
      const mockItem = {
        id: "item-123",
        title: "Test Item",
        description: "Description",
        category: "test",
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mocks.getItemByIdFn.mockResolvedValue({ item: mockItem });

      await getItemById({
        input: { id: "item-123" },
        context: { session: null },
      });

      expect(mocks.getItemByIdFn).toHaveBeenCalledWith({
        id: "item-123",
      });
    });

    it("should return the item", async () => {
      const mockItem = {
        id: "item-123",
        title: "Found Item",
        description: "Description",
        category: "test",
        metadata: { key: "value" },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mocks.getItemByIdFn.mockResolvedValue({ item: mockItem });

      const result = await getItemById({
        input: { id: "item-123" },
        context: { session: null },
      });

      expect(result.item.id).toBe("item-123");
      expect(result.item.title).toBe("Found Item");
    });
  });

  describe("error handling", () => {
    it("should re-throw ORPCError as-is", async () => {
      const orpcError = new ORPCError("NOT_FOUND", {
        message: "Item not found",
      });
      mocks.getItemByIdFn.mockRejectedValue(orpcError);

      await expect(
        getItemById({
          input: { id: "non-existent" },
          context: { session: null },
        }),
      ).rejects.toThrow(orpcError);
    });

    it("should wrap non-ORPCError in INTERNAL_SERVER_ERROR", async () => {
      mocks.getItemByIdFn.mockRejectedValue(new Error("Database error"));

      await expect(
        getItemById({
          input: { id: "item-123" },
          context: { session: null },
        }),
      ).rejects.toThrow(ORPCError);
    });
  });
});
