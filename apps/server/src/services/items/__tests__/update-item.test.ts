import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const mockReturning = vi.fn();
  const mockWhere = vi.fn(() => ({ returning: mockReturning }));
  const mockSet = vi.fn(() => ({ where: mockWhere }));
  const mockUpdate = vi.fn(() => ({ set: mockSet }));
  return { mockUpdate, mockSet, mockWhere, mockReturning };
});

vi.mock("../../../db", () => ({
  db: {
    update: mocks.mockUpdate,
  },
}));

import { updateItemFn } from "../update-item";

describe("updateItemFn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update an item successfully", async () => {
    const mockItem = {
      id: "test-id",
      title: "Updated Title",
      description: "Test Description",
      category: "test-category",
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mocks.mockReturning.mockResolvedValue([mockItem]);

    const result = await updateItemFn({
      id: "test-id",
      updateData: { title: "Updated Title" },
    });

    expect(result.item).toEqual(mockItem);
    expect(mocks.mockUpdate).toHaveBeenCalled();
    expect(mocks.mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Updated Title",
        updatedAt: expect.any(Date),
      }),
    );
  });

  it("should throw an error when item is not found", async () => {
    mocks.mockReturning.mockResolvedValue([]);

    await expect(
      updateItemFn({
        id: "non-existent-id",
        updateData: { title: "New Title" },
      }),
    ).rejects.toThrow("Item not found");
  });

  it("should update multiple fields", async () => {
    const mockItem = {
      id: "test-id",
      title: "New Title",
      description: "New Description",
      category: "new-category",
      metadata: { updated: true },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mocks.mockReturning.mockResolvedValue([mockItem]);

    const result = await updateItemFn({
      id: "test-id",
      updateData: {
        title: "New Title",
        description: "New Description",
        category: "new-category",
        metadata: { updated: true },
      },
    });

    expect(result.item.title).toBe("New Title");
    expect(result.item.description).toBe("New Description");
    expect(result.item.category).toBe("new-category");
  });

  it("should always set updatedAt timestamp", async () => {
    const mockItem = {
      id: "test-id",
      title: "Test",
      description: "Test",
      category: "test",
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mocks.mockReturning.mockResolvedValue([mockItem]);

    await updateItemFn({
      id: "test-id",
      updateData: { title: "Test" },
    });

    expect(mocks.mockSet).toHaveBeenCalledWith(
      expect.objectContaining({
        updatedAt: expect.any(Date),
      }),
    );
  });
});
