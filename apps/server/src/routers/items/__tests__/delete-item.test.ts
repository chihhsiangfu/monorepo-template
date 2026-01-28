import { ORPCError } from "@orpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOrpcMock } from "./orpc-mock";

const mocks = vi.hoisted(() => {
  return {
    deleteItemFn: vi.fn(),
  };
});

vi.mock("../../../services/items/delete-item", () => ({
  deleteItemFn: mocks.deleteItemFn,
}));

vi.mock("../../../lib/orpc", () => createOrpcMock());

import { deleteItem as _deleteItem } from "../delete-item";

// Cast procedure as callable for testing (mock replaces with callable function)
const deleteItem = _deleteItem as unknown as (args: {
  input: { id: string };
  context: {
    session: { user: { id: string; email: string; name: string } } | null;
  };
}) => Promise<{ success: boolean }>;

describe("deleteItem router", () => {
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
        deleteItem({
          input: { id: "item-123" },
          context: { session: null },
        }),
      ).rejects.toThrow(ORPCError);
    });
  });

  describe("service integration", () => {
    it("should call deleteItemFn with correct id", async () => {
      mocks.deleteItemFn.mockResolvedValue({ success: true });

      await deleteItem({
        input: { id: "item-123" },
        context: { session: mockSession },
      });

      expect(mocks.deleteItemFn).toHaveBeenCalledWith({
        id: "item-123",
      });
    });

    it("should return success", async () => {
      mocks.deleteItemFn.mockResolvedValue({ success: true });

      const result = await deleteItem({
        input: { id: "item-123" },
        context: { session: mockSession },
      });

      expect(result.success).toBe(true);
    });
  });

  describe("error handling", () => {
    it("should re-throw ORPCError as-is", async () => {
      const orpcError = new ORPCError("NOT_FOUND", {
        message: "Item not found",
      });
      mocks.deleteItemFn.mockRejectedValue(orpcError);

      await expect(
        deleteItem({
          input: { id: "non-existent" },
          context: { session: mockSession },
        }),
      ).rejects.toThrow(orpcError);
    });

    it("should wrap non-ORPCError in INTERNAL_SERVER_ERROR", async () => {
      mocks.deleteItemFn.mockRejectedValue(new Error("Database error"));

      await expect(
        deleteItem({
          input: { id: "item-123" },
          context: { session: mockSession },
        }),
      ).rejects.toThrow(ORPCError);
    });
  });
});
