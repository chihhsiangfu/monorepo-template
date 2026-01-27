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

import { createItemFn } from "../create-item";

describe("createItemFn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an item successfully", async () => {
    const mockItem = {
      id: "test-id",
      title: "Test Item",
      description: "Test Description",
      category: "test-category",
      metadata: { key: "value" },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mocks.mockReturning.mockResolvedValue([mockItem]);

    const result = await createItemFn({
      newData: {
        title: "Test Item",
        description: "Test Description",
        category: "test-category",
        metadata: { key: "value" },
      },
    });

    expect(result.item).toEqual(mockItem);
    expect(mocks.mockInsert).toHaveBeenCalled();
    expect(mocks.mockValues).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Test Item",
        description: "Test Description",
        category: "test-category",
        metadata: { key: "value" },
      }),
    );
  });

  it("should throw an error when no item is returned", async () => {
    mocks.mockReturning.mockResolvedValue([]);

    await expect(
      createItemFn({
        newData: {
          title: "Test Item",
          description: "Test Description",
          category: "test-category",
          metadata: {},
        },
      }),
    ).rejects.toThrow("Item not found");
  });

  it("should generate a UUID for the item id", async () => {
    const mockItem = {
      id: "generated-uuid",
      title: "Test Item",
      description: "Test Description",
      category: "test-category",
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mocks.mockReturning.mockResolvedValue([mockItem]);

    await createItemFn({
      newData: {
        title: "Test Item",
        description: "Test Description",
        category: "test-category",
        metadata: {},
      },
    });

    expect(mocks.mockValues).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
      }),
    );
  });

  it("should set createdAt and updatedAt timestamps", async () => {
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

    await createItemFn({
      newData: {
        title: "Test Item",
        description: "Test Description",
        category: "test-category",
        metadata: {},
      },
    });

    expect(mocks.mockValues).toHaveBeenCalledWith(
      expect.objectContaining({
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
  });
});
