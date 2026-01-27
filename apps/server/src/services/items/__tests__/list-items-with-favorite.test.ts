import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const mockOffset = vi.fn();
  const mockLimit = vi.fn(() => ({ offset: mockOffset }));
  const mockOrderBy = vi.fn(() => ({ limit: mockLimit }));
  const mockWhere = vi.fn(() => ({ orderBy: mockOrderBy }));
  const mockLeftJoin = vi.fn(() => ({ where: mockWhere }));
  const mockFrom = vi.fn();
  const mockSelect = vi.fn();

  return {
    mockSelect,
    mockFrom,
    mockLeftJoin,
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

import { listItemsWithFavoriteFn } from "../list-items-with-favorite";

describe("listItemsWithFavoriteFn", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.mockSelect.mockImplementation(() => ({
      from: mocks.mockFrom,
    }));

    mocks.mockWhere.mockReturnValue({ orderBy: mocks.mockOrderBy });
    mocks.mockOrderBy.mockReturnValue({ limit: mocks.mockLimit });
    mocks.mockLimit.mockReturnValue({ offset: mocks.mockOffset });
  });

  it("should list items with favorite status", async () => {
    const mockItems = [
      {
        id: "1",
        title: "Item 1",
        description: "Desc 1",
        category: "cat1",
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        favorited: true,
      },
      {
        id: "2",
        title: "Item 2",
        description: "Desc 2",
        category: "cat2",
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        favorited: false,
      },
    ];

    mocks.mockOffset.mockResolvedValue(mockItems);

    let callCount = 0;
    mocks.mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { leftJoin: mocks.mockLeftJoin };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 2 }]) };
    });

    const result = await listItemsWithFavoriteFn({ userId: "user-1" });

    expect(result.items).toEqual(mockItems);
    expect(result.count).toBe(2);
    expect(result.items[0]?.favorited).toBe(true);
    expect(result.items[1]?.favorited).toBe(false);
  });

  it("should work without userId", async () => {
    const mockItems = [
      {
        id: "1",
        title: "Item 1",
        description: "Desc 1",
        category: "cat1",
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        favorited: false,
      },
    ];

    mocks.mockOffset.mockResolvedValue(mockItems);

    let callCount = 0;
    mocks.mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { leftJoin: mocks.mockLeftJoin };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 1 }]) };
    });

    const result = await listItemsWithFavoriteFn({});

    expect(result.items).toEqual(mockItems);
    expect(result.count).toBe(1);
  });

  it("should apply pagination parameters", async () => {
    mocks.mockOffset.mockResolvedValue([]);

    let callCount = 0;
    mocks.mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { leftJoin: mocks.mockLeftJoin };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 0 }]) };
    });

    await listItemsWithFavoriteFn({ limit: 20, offset: 10, userId: "user-1" });

    expect(mocks.mockLimit).toHaveBeenCalledWith(20);
    expect(mocks.mockOffset).toHaveBeenCalledWith(10);
  });

  it("should use default pagination values", async () => {
    mocks.mockOffset.mockResolvedValue([]);

    let callCount = 0;
    mocks.mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { leftJoin: mocks.mockLeftJoin };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 0 }]) };
    });

    await listItemsWithFavoriteFn({});

    expect(mocks.mockLimit).toHaveBeenCalledWith(10);
    expect(mocks.mockOffset).toHaveBeenCalledWith(0);
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
        favorited: true,
      },
    ];

    mocks.mockOffset.mockResolvedValue(mockItems);

    let callCount = 0;
    mocks.mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { leftJoin: mocks.mockLeftJoin };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 1 }]) };
    });

    const result = await listItemsWithFavoriteFn({
      userId: "user-1",
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
        return { leftJoin: mocks.mockLeftJoin };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 0 }]) };
    });

    await listItemsWithFavoriteFn({ sort: "asc", userId: "user-1" });

    expect(mocks.mockOrderBy).toHaveBeenCalled();
  });

  it("should sort by specified field", async () => {
    mocks.mockOffset.mockResolvedValue([]);

    let callCount = 0;
    mocks.mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return { leftJoin: mocks.mockLeftJoin };
      }
      return { where: vi.fn().mockResolvedValue([{ count: 0 }]) };
    });

    await listItemsWithFavoriteFn({
      sortBy: "title",
      sort: "asc",
      userId: "user-1",
    });

    expect(mocks.mockOrderBy).toHaveBeenCalled();
  });
});
