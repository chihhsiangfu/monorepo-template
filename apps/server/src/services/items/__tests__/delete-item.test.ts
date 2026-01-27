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

import { deleteItemFn } from "../delete-item";

describe("deleteItemFn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete an item successfully", async () => {
    const mockItem = {
      id: "test-id",
      title: "Test Item",
      description: "Test Description",
      category: "test-category",
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mocks.mockReturning.mockResolvedValue([mockItem]);

    const result = await deleteItemFn({ id: "test-id" });

    expect(result.item).toEqual(mockItem);
    expect(mocks.mockDelete).toHaveBeenCalled();
    expect(mocks.mockWhere).toHaveBeenCalled();
  });

  it("should throw an error when item is not found", async () => {
    mocks.mockReturning.mockResolvedValue([]);

    await expect(deleteItemFn({ id: "non-existent-id" })).rejects.toThrow(
      "Item not found",
    );
  });

  it("should return the deleted item", async () => {
    const mockItem = {
      id: "test-id",
      title: "Deleted Item",
      description: "This item was deleted",
      category: "deleted",
      metadata: { deleted: true },
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-02"),
    };

    mocks.mockReturning.mockResolvedValue([mockItem]);

    const result = await deleteItemFn({ id: "test-id" });

    expect(result.item.id).toBe("test-id");
    expect(result.item.title).toBe("Deleted Item");
  });
});
