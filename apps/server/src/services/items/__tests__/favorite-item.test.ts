import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const mockReturning = vi.fn();
  const mockValues = vi.fn(() => ({ returning: mockReturning }));
  const mockInsert = vi.fn(() => ({ values: mockValues }));
  return { mockInsert, mockValues, mockReturning };
});

vi.mock("../../../db", () => ({
  db: {
    insert: mocks.mockInsert,
  },
}));

import { favoriteItemFn } from "../favorite-item";

describe("favoriteItemFn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should favorite an item successfully", async () => {
    const mockFavorite = {
      id: "favorite-id",
      userId: "user-1",
      itemId: "item-1",
      createdAt: new Date(),
    };

    mocks.mockReturning.mockResolvedValue([mockFavorite]);

    const result = await favoriteItemFn({
      userId: "user-1",
      itemId: "item-1",
    });

    expect(result.success).toBe(true);
    expect(mocks.mockInsert).toHaveBeenCalled();
    expect(mocks.mockValues).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        itemId: "item-1",
      }),
    );
  });

  it("should throw an error when favorite fails", async () => {
    mocks.mockReturning.mockResolvedValue([]);

    await expect(
      favoriteItemFn({
        userId: "user-1",
        itemId: "item-1",
      }),
    ).rejects.toThrow("Failed to favorite item");
  });

  it("should generate a UUID for the favorite id", async () => {
    const mockFavorite = {
      id: "generated-uuid",
      userId: "user-1",
      itemId: "item-1",
      createdAt: new Date(),
    };

    mocks.mockReturning.mockResolvedValue([mockFavorite]);

    await favoriteItemFn({
      userId: "user-1",
      itemId: "item-1",
    });

    expect(mocks.mockValues).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it("should set createdAt timestamp", async () => {
    const mockFavorite = {
      id: "favorite-id",
      userId: "user-1",
      itemId: "item-1",
      createdAt: new Date(),
    };

    mocks.mockReturning.mockResolvedValue([mockFavorite]);

    await favoriteItemFn({
      userId: "user-1",
      itemId: "item-1",
    });

    expect(mocks.mockValues).toHaveBeenCalledWith(
      expect.objectContaining({
        createdAt: expect.any(Date),
      }),
    );
  });
});
