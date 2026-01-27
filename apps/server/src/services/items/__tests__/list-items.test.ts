import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const mockOffset = vi.fn();
  const mockLimit = vi.fn(() => ({ offset: mockOffset }));
  const mockOrderBy = vi.fn(() => ({ limit: mockLimit }));
  const mockWhere = vi.fn();
  const mockFrom = vi.fn();
  const mockSelect = vi.fn();

  return {
    mockSelect,
    mockFrom,
    mockWhere,
    mockOrderBy,
    mockLimit,
    mockOffset,
  };
});

vi.mock("../../../db", () => ({
  db: {
    select: mocks.mockSelect,
  },
}));

import { listItemsFn } from "../list-items";

describe("listItemsFn", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.mockSelect.mockImplementation(() => ({
      from: mocks.mockFrom,
    }));

    let callCount = 0;
    mocks.mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { where: mocks.mockWhere };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 0 }]) };
    });

    mocks.mockWhere.mockReturnValue({ orderBy: mocks.mockOrderBy });
    mocks.mockOrderBy.mockReturnValue({ limit: mocks.mockLimit });
    mocks.mockLimit.mockReturnValue({ offset: mocks.mockOffset });
  });

  it("should list items with default parameters", async () => {
    const mockItems = [
      {
        id: "1",
        title: "Item 1",
        description: "Desc 1",
        category: "cat1",
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        title: "Item 2",
        description: "Desc 2",
        category: "cat2",
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mocks.mockOffset.mockResolvedValue(mockItems);

    let callCount = 0;
    mocks.mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { where: mocks.mockWhere };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 2 }]) };
    });

    const result = await listItemsFn({});

    expect(result.items).toEqual(mockItems);
    expect(result.count).toBe(2);
  });

  it("should apply pagination parameters", async () => {
    mocks.mockOffset.mockResolvedValue([]);

    let callCount = 0;
    mocks.mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { where: mocks.mockWhere };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 0 }]) };
    });

    await listItemsFn({ limit: 20, offset: 10 });

    expect(mocks.mockLimit).toHaveBeenCalledWith(20);
    expect(mocks.mockOffset).toHaveBeenCalledWith(10);
  });

  it("should use default limit and offset", async () => {
    mocks.mockOffset.mockResolvedValue([]);

    let callCount = 0;
    mocks.mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { where: mocks.mockWhere };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 0 }]) };
    });

    await listItemsFn({});

    expect(mocks.mockLimit).toHaveBeenCalledWith(10);
    expect(mocks.mockOffset).toHaveBeenCalledWith(0);
  });

  it("should return empty array when no items found", async () => {
    mocks.mockOffset.mockResolvedValue([]);

    let callCount = 0;
    mocks.mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { where: mocks.mockWhere };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 0 }]) };
    });

    const result = await listItemsFn({});

    expect(result.items).toEqual([]);
    expect(result.count).toBe(0);
  });

  it("should handle search parameters", async () => {
    const mockItems = [
      {
        id: "1",
        title: "Searched Item",
        description: "Desc",
        category: "searched-category",
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mocks.mockOffset.mockResolvedValue(mockItems);

    let callCount = 0;
    mocks.mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { where: mocks.mockWhere };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 1 }]) };
    });

    const result = await listItemsFn({
      searchTitle: "Searched",
      searchCategory: "searched-category",
    });

    expect(result.items).toHaveLength(1);
    expect(result.count).toBe(1);
  });

  it("should sort in ascending order when sort is 'asc'", async () => {
    mocks.mockOffset.mockResolvedValue([]);

    let callCount = 0;
    mocks.mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { where: mocks.mockWhere };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 0 }]) };
    });

    await listItemsFn({ sort: "asc" });

    expect(mocks.mockOrderBy).toHaveBeenCalled();
  });

  it("should sort by specified field", async () => {
    mocks.mockOffset.mockResolvedValue([]);

    let callCount = 0;
    mocks.mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { where: mocks.mockWhere };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 0 }]) };
    });

    await listItemsFn({ sortBy: "title", sort: "asc" });

    expect(mocks.mockOrderBy).toHaveBeenCalled();
  });
});
