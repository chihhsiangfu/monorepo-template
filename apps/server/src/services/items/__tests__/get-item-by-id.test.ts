import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const mockLimit = vi.fn();
  const mockWhere = vi.fn(() => ({ limit: mockLimit }));
  const mockFrom = vi.fn(() => ({ where: mockWhere }));
  const mockSelect = vi.fn(() => ({ from: mockFrom }));
  return { mockSelect, mockFrom, mockWhere, mockLimit };
});

vi.mock("../../../db", () => ({
  db: {
    select: mocks.mockSelect,
  },
}));

import { getItemByIdFn } from "../get-item-by-id";

describe("getItemByIdFn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get an item by id successfully", async () => {
    const mockItem = {
      id: "test-id",
      title: "Test Item",
      description: "Test Description",
      category: "test-category",
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mocks.mockLimit.mockResolvedValue([mockItem]);

    const result = await getItemByIdFn({ id: "test-id" });

    expect(result.item).toEqual(mockItem);
    expect(mocks.mockSelect).toHaveBeenCalled();
    expect(mocks.mockLimit).toHaveBeenCalledWith(1);
  });

  it("should throw an error when item is not found", async () => {
    mocks.mockLimit.mockResolvedValue([]);

    await expect(getItemByIdFn({ id: "non-existent-id" })).rejects.toThrow(
      "Item not found",
    );
  });

  it("should return item with all fields", async () => {
    const mockItem = {
      id: "test-id",
      title: "Complete Item",
      description: "Full Description",
      category: "full-category",
      metadata: { key: "value", nested: { data: true } },
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-02"),
    };

    mocks.mockLimit.mockResolvedValue([mockItem]);

    const result = await getItemByIdFn({ id: "test-id" });

    expect(result.item.id).toBe("test-id");
    expect(result.item.title).toBe("Complete Item");
    expect(result.item.description).toBe("Full Description");
    expect(result.item.category).toBe("full-category");
    expect(result.item.metadata).toEqual({
      key: "value",
      nested: { data: true },
    });
  });
});
