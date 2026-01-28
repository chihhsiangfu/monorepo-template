import { ORPCError } from "@orpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOrpcMock } from "./orpc-mock";

const mocks = vi.hoisted(() => {
  return {
    updateItemFn: vi.fn(),
  };
});

vi.mock("../../../services/items/update-item", () => ({
  updateItemFn: mocks.updateItemFn,
}));

vi.mock("../../../lib/orpc", () => createOrpcMock());

import { updateItem as _updateItem } from "../update-item";

// Cast procedure as callable for testing (mock replaces with callable function)
const updateItem = _updateItem as unknown as (args: {
  input: {
    id: string;
    title?: string;
    description?: string;
    category?: string;
    metadata?: Record<string, unknown>;
  };
  context: {
    session: { user: { id: string; email: string; name: string } } | null;
  };
}) => Promise<{ item: { id: string; title: string; description: string } }>;

describe("updateItem router", () => {
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

  describe("authentication", () => {
    it("should reject unauthenticated requests", async () => {
      await expect(
        updateItem({
          input: { id: "item-123", title: "Updated" },
          context: { session: null },
        }),
      ).rejects.toThrow(ORPCError);
    });
  });

  describe("input validation", () => {
    it("should accept partial updates", async () => {
      const mockItem = {
        id: "item-123",
        title: "Updated Title",
        description: "Original Description",
        category: "test",
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mocks.updateItemFn.mockResolvedValue({ item: mockItem });

      const result = await updateItem({
        input: { id: "item-123", title: "Updated Title" },
        context: { session: mockSession },
      });

      expect(result.item.title).toBe("Updated Title");
    });

    it("should accept multiple field updates", async () => {
      const mockItem = {
        id: "item-123",
        title: "New Title",
        description: "New Description",
        category: "new-category",
        metadata: { updated: true },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mocks.updateItemFn.mockResolvedValue({ item: mockItem });

      const result = await updateItem({
        input: {
          id: "item-123",
          title: "New Title",
          description: "New Description",
          category: "new-category",
          metadata: { updated: true },
        },
        context: { session: mockSession },
      });

      expect(result.item.title).toBe("New Title");
      expect(result.item.description).toBe("New Description");
    });
  });

  describe("service integration", () => {
    it("should call updateItemFn with correct parameters", async () => {
      const mockItem = {
        id: "item-123",
        title: "Updated",
        description: "Description",
        category: "test",
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mocks.updateItemFn.mockResolvedValue({ item: mockItem });

      await updateItem({
        input: { id: "item-123", title: "Updated" },
        context: { session: mockSession },
      });

      expect(mocks.updateItemFn).toHaveBeenCalledWith({
        id: "item-123",
        updateData: { title: "Updated" },
      });
    });
  });

  describe("error handling", () => {
    it("should re-throw ORPCError as-is", async () => {
      const orpcError = new ORPCError("NOT_FOUND", {
        message: "Item not found",
      });
      mocks.updateItemFn.mockRejectedValue(orpcError);

      await expect(
        updateItem({
          input: { id: "non-existent", title: "Updated" },
          context: { session: mockSession },
        }),
      ).rejects.toThrow(orpcError);
    });

    it("should wrap non-ORPCError in INTERNAL_SERVER_ERROR", async () => {
      mocks.updateItemFn.mockRejectedValue(new Error("Database error"));

      await expect(
        updateItem({
          input: { id: "item-123", title: "Updated" },
          context: { session: mockSession },
        }),
      ).rejects.toThrow(ORPCError);
    });
  });
});
