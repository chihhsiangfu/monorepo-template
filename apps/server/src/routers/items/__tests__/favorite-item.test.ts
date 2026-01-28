import { ORPCError } from "@orpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOrpcMock } from "./orpc-mock";

const mocks = vi.hoisted(() => {
  return {
    favoriteItemFn: vi.fn(),
  };
});

vi.mock("../../../services/items/favorite-item", () => ({
  favoriteItemFn: mocks.favoriteItemFn,
}));

vi.mock("../../../lib/orpc", () => createOrpcMock());

import { favoriteItem as _favoriteItem } from "../favorite-item";

// Cast procedure as callable for testing (mock replaces with callable function)
const favoriteItem = _favoriteItem as unknown as (args: {
  input: { itemId: string };
  context: {
    session: { user: { id: string; email: string; name: string } } | null;
  };
}) => Promise<{ success: boolean }>;

describe("favoriteItem router", () => {
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
        favoriteItem({
          input: { itemId: "item-123" },
          context: { session: null },
        }),
      ).rejects.toThrow(ORPCError);
    });
  });

  describe("service integration", () => {
    it("should call favoriteItemFn with userId from session", async () => {
      mocks.favoriteItemFn.mockResolvedValue({ success: true });

      await favoriteItem({
        input: { itemId: "item-123" },
        context: { session: mockSession },
      });

      expect(mocks.favoriteItemFn).toHaveBeenCalledWith({
        userId: "user-123",
        itemId: "item-123",
      });
    });

    it("should return success", async () => {
      mocks.favoriteItemFn.mockResolvedValue({ success: true });

      const result = await favoriteItem({
        input: { itemId: "item-123" },
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
      mocks.favoriteItemFn.mockRejectedValue(orpcError);

      await expect(
        favoriteItem({
          input: { itemId: "non-existent" },
          context: { session: mockSession },
        }),
      ).rejects.toThrow(orpcError);
    });

    it("should wrap non-ORPCError in INTERNAL_SERVER_ERROR", async () => {
      mocks.favoriteItemFn.mockRejectedValue(new Error("Database error"));

      await expect(
        favoriteItem({
          input: { itemId: "item-123" },
          context: { session: mockSession },
        }),
      ).rejects.toThrow(ORPCError);
    });
  });
});
