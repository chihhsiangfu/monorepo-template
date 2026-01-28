import { ORPCError } from "@orpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOrpcMock } from "./orpc-mock";

const mocks = vi.hoisted(() => {
  return {
    createItemFn: vi.fn(),
  };
});

vi.mock("../../../services/items/create-item", () => ({
  createItemFn: mocks.createItemFn,
}));

vi.mock("../../../lib/orpc", () => createOrpcMock());

import { createItem as _createItem } from "../create-item";

// Cast procedure as callable for testing (mock replaces with callable function)
const createItem = _createItem as unknown as (args: {
  input: {
    title: string;
    description: string;
    category: string;
    metadata: Record<string, unknown>;
  };
  context: {
    session: {
      user: { id: string; email: string; name: string } | null;
    } | null;
  };
}) => Promise<{ item: { id: string; title: string } }>;

describe("createItem router", () => {
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

  describe("input validation", () => {
    it("should reject empty title", async () => {
      await expect(
        createItem({
          input: {
            title: "",
            description: "Valid description",
            category: "test",
            metadata: {},
          },
          context: { session: mockSession },
        }),
      ).rejects.toThrow();
    });

    it("should reject empty description", async () => {
      await expect(
        createItem({
          input: {
            title: "Valid title",
            description: "",
            category: "test",
            metadata: {},
          },
          context: { session: mockSession },
        }),
      ).rejects.toThrow();
    });

    it("should accept valid input", async () => {
      const mockItem = {
        id: "item-123",
        title: "Test Item",
        description: "Test Description",
        category: "test",
        metadata: { key: "value" },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mocks.createItemFn.mockResolvedValue({ item: mockItem });

      const result = await createItem({
        input: {
          title: "Test Item",
          description: "Test Description",
          category: "test",
          metadata: { key: "value" },
        },
        context: { session: mockSession },
      });

      expect(result.item).toEqual(mockItem);
    });
  });

  describe("authentication", () => {
    it("should reject unauthenticated requests", async () => {
      await expect(
        createItem({
          input: {
            title: "Test Item",
            description: "Test Description",
            category: "test",
            metadata: {},
          },
          context: { session: null },
        }),
      ).rejects.toThrow(ORPCError);
    });

    it("should reject requests without user", async () => {
      await expect(
        createItem({
          input: {
            title: "Test Item",
            description: "Test Description",
            category: "test",
            metadata: {},
          },
          context: { session: { user: null } },
        }),
      ).rejects.toThrow(ORPCError);
    });
  });

  describe("service integration", () => {
    it("should call createItemFn with correct parameters", async () => {
      const mockItem = {
        id: "item-123",
        title: "Test Item",
        description: "Test Description",
        category: "test",
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mocks.createItemFn.mockResolvedValue({ item: mockItem });

      await createItem({
        input: {
          title: "Test Item",
          description: "Test Description",
          category: "test",
          metadata: {},
        },
        context: { session: mockSession },
      });

      expect(mocks.createItemFn).toHaveBeenCalledWith({
        newData: {
          title: "Test Item",
          description: "Test Description",
          category: "test",
          metadata: {},
        },
      });
    });

    it("should return the created item", async () => {
      const mockItem = {
        id: "item-123",
        title: "Created Item",
        description: "Description",
        category: "category",
        metadata: { created: true },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mocks.createItemFn.mockResolvedValue({ item: mockItem });

      const result = await createItem({
        input: {
          title: "Created Item",
          description: "Description",
          category: "category",
          metadata: { created: true },
        },
        context: { session: mockSession },
      });

      expect(result.item.id).toBe("item-123");
      expect(result.item.title).toBe("Created Item");
    });
  });

  describe("error handling", () => {
    it("should re-throw ORPCError as-is", async () => {
      const orpcError = new ORPCError("NOT_FOUND", {
        message: "Item not found",
      });
      mocks.createItemFn.mockRejectedValue(orpcError);

      await expect(
        createItem({
          input: {
            title: "Test Item",
            description: "Test Description",
            category: "test",
            metadata: {},
          },
          context: { session: mockSession },
        }),
      ).rejects.toThrow(orpcError);
    });

    it("should wrap non-ORPCError in INTERNAL_SERVER_ERROR", async () => {
      mocks.createItemFn.mockRejectedValue(new Error("Database error"));

      await expect(
        createItem({
          input: {
            title: "Test Item",
            description: "Test Description",
            category: "test",
            metadata: {},
          },
          context: { session: mockSession },
        }),
      ).rejects.toThrow(ORPCError);
    });
  });
});
