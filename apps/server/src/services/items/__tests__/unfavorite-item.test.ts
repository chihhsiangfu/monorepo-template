import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const mockReturning = vi.fn();
  const mockWhere = vi.fn(() => ({ returning: mockReturning }));
  const mockDelete = vi.fn(() => ({ where: mockWhere }));
  return { mockDelete, mockWhere, mockReturning };
});

vi.mock("../../../db", () => ({
  db: {
    delete: mocks.mockDelete,
  },
}));

import { unfavoriteItemFn } from "../unfavorite-item";

describe("unfavoriteItemFn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should unfavorite an item successfully", async () => {
    const mockFavorite = {
      id: "favorite-id",
      userId: "user-1",
      itemId: "item-1",
      createdAt: new Date(),
    };

    mocks.mockReturning.mockResolvedValue([mockFavorite]);

    const result = await unfavoriteItemFn({
      userId: "user-1",
      itemId: "item-1",
    });

    expect(result.success).toBe(true);
    expect(mocks.mockDelete).toHaveBeenCalled();
    expect(mocks.mockWhere).toHaveBeenCalled();
  });

  it("should throw an error when unfavorite fails", async () => {
    mocks.mockReturning.mockResolvedValue([]);

    await expect(
      unfavoriteItemFn({
        userId: "user-1",
        itemId: "item-1",
      }),
    ).rejects.toThrow("Failed to unfavorite item");
  });

  it("should delete the correct favorite entry", async () => {
    const mockFavorite = {
      id: "favorite-id",
      userId: "user-1",
      itemId: "item-1",
      createdAt: new Date(),
    };

    mocks.mockReturning.mockResolvedValue([mockFavorite]);

    const result = await unfavoriteItemFn({
      userId: "user-1",
      itemId: "item-1",
    });

    expect(result.success).toBe(true);
    expect(mocks.mockDelete).toHaveBeenCalled();
  });

  it("should return success true when item is unfavorited", async () => {
    const mockFavorite = {
      id: "favorite-id",
      userId: "user-2",
      itemId: "item-2",
      createdAt: new Date(),
    };

    mocks.mockReturning.mockResolvedValue([mockFavorite]);

    const result = await unfavoriteItemFn({
      userId: "user-2",
      itemId: "item-2",
    });

    expect(result).toEqual({ success: true });
  });
});
