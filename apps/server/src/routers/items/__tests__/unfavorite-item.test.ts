import { ORPCError } from "@orpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createOrpcMock } from "./orpc-mock";

const mocks = vi.hoisted(() => {
  return {
    unfavoriteItemFn: vi.fn(),
  };
});

vi.mock("../../../services/items/unfavorite-item", () => ({
  unfavoriteItemFn: mocks.unfavoriteItemFn,
}));

vi.mock("../../../lib/orpc", () => createOrpcMock());

import { unfavoriteItem as _unfavoriteItem } from "../unfavorite-item";

// Cast procedure as callable for testing (mock replaces with callable function)
const unfavoriteItem = _unfavoriteItem as unknown as (args: {
  input: { itemId: string };
  context: {
    session: { user: { id: string; email: string; name: string } } | null;
  };
}) => Promise<{ success: boolean }>;

describe("unfavoriteItem router", () => {
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
        unfavoriteItem({
          input: { itemId: "item-123" },
          context: { session: null },
        }),
      ).rejects.toThrow(ORPCError);
    });
  });

  describe("service integration", () => {
    it("should call unfavoriteItemFn with userId from session", async () => {
      mocks.unfavoriteItemFn.mockResolvedValue({ success: true });

      await unfavoriteItem({
        input: { itemId: "item-123" },
        context: { session: mockSession },
      });

      expect(mocks.unfavoriteItemFn).toHaveBeenCalledWith({
        userId: "user-123",
        itemId: "item-123",
      });
    });

    it("should return success", async () => {
      mocks.unfavoriteItemFn.mockResolvedValue({ success: true });

      const result = await unfavoriteItem({
        input: { itemId: "item-123" },
        context: { session: mockSession },
      });

      expect(result.success).toBe(true);
    });
  });

  describe("error handling", () => {
    it("should re-throw ORPCError as-is", async () => {
      const orpcError = new ORPCError("NOT_FOUND", {
        message: "Favorite not found",
      });
      mocks.unfavoriteItemFn.mockRejectedValue(orpcError);

      await expect(
        unfavoriteItem({
          input: { itemId: "non-existent" },
          context: { session: mockSession },
        }),
      ).rejects.toThrow(orpcError);
    });

    it("should wrap non-ORPCError in INTERNAL_SERVER_ERROR", async () => {
      mocks.unfavoriteItemFn.mockRejectedValue(new Error("Database error"));

      await expect(
        unfavoriteItem({
          input: { itemId: "item-123" },
          context: { session: mockSession },
        }),
      ).rejects.toThrow(ORPCError);
    });
  });
});
