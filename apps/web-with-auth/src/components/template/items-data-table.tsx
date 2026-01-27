"use client";

import { useAuthClient } from "@repo/better-auth-hook";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { Star } from "lucide-react";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { DataTable } from "@/components/data-table";
import { DataTableHeaderCell } from "@/components/data-table-header-cell";
import { DeleteDialog } from "@/components/delete-dialog";
import { FormDialog } from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import type { Item } from "@/shared/types";
import { orpc } from "@/utils/orpc";

export const ItemsDataTable: FC = () => {
  const authClient = useAuthClient();
  const { data: session } = authClient.useSession();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const debouncedSearchTitle = useDebounce(
    columnFilters.length > 0 ? (columnFilters[0].value as string) : "",
    500,
  );

  const limitForQuery: number = pagination.pageSize;
  const offsetForQuery: number = pagination.pageIndex * pagination.pageSize;
  const sortForQuery: "asc" | "desc" | undefined =
    sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined;
  const sortByForQuery: string | undefined =
    sorting.length > 0 ? sorting[0].id : undefined;
  const searchTitleForQuery: string | undefined =
    debouncedSearchTitle === "" ? undefined : debouncedSearchTitle;

  const queryClient = useQueryClient();

  const { data: itemsData } = useQuery(
    orpc.items.listItemsWithFavorite.queryOptions({
      input: {
        limit: limitForQuery,
        offset: offsetForQuery,
        // sort: sortForQuery,
        // sortBy: sortByForQuery as keyof Item,
        queryTitle: searchTitleForQuery,
      },
    }),
  );

  const { mutate: createItem, isPending: isPendingCreateItem } = useMutation(
    orpc.items.createItem.mutationOptions({
      onSuccess: () => {
        toast.success("Item created successfully");

        queryClient.invalidateQueries({
          queryKey: orpc.items.listItemsWithFavorite.key(),
        });
      },
      onError: () => {
        toast.error("Failed to create item");
      },
    }),
  );

  const { mutate: updateItem, isPending: isPendingUpdateItem } = useMutation(
    orpc.items.updateItem.mutationOptions({
      onSuccess: () => {
        toast.success("Item updated successfully");

        queryClient.invalidateQueries({
          queryKey: orpc.items.listItemsWithFavorite.key(),
        });
      },
      onError: () => {
        toast.error("Failed to update item");
      },
    }),
  );

  const { mutate: deleteItem, isPending: isPendingDeleteItem } = useMutation(
    orpc.items.deleteItem.mutationOptions({
      onSuccess: () => {
        toast.success("Item deleted successfully");

        queryClient.invalidateQueries({
          queryKey: orpc.items.listItemsWithFavorite.key(),
        });
      },
      onError: () => {
        toast.error("Failed to delete item");
      },
    }),
  );

  const { mutate: createFavoriteItem } = useMutation(
    orpc.items.favoriteItem.mutationOptions({
      onSuccess: () => {
        toast.success("Item favorited successfully");

        queryClient.invalidateQueries({
          queryKey: orpc.items.listItemsWithFavorite.key(),
        });
      },
      onError: () => {
        toast.error("Failed to favorite item");
      },
    }),
  );

  const { mutate: deleteFavoriteItem } = useMutation(
    orpc.items.unfavoriteItem.mutationOptions({
      onSuccess: () => {
        toast.success("Item unfavorited successfully");

        queryClient.invalidateQueries({
          queryKey: orpc.items.listItemsWithFavorite.key(),
        });
      },
      onError: () => {
        toast.error("Failed to unfavorited item");
      },
    }),
  );

  const items = itemsData?.items;
  const total = itemsData?.count;

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        addButtonLabel="Add Item"
        columnFilters={columnFilters}
        columns={[
          {
            accessorKey: "title",
            header: ({ column }) => (
              <DataTableHeaderCell column={column} title="Title" />
            ),
          },
          {
            accessorKey: "description",
            header: ({ column }) => (
              <DataTableHeaderCell column={column} title="Description" />
            ),
          },
          {
            accessorKey: "favorited",
            header: "Favorited",
            cell: ({ row }) => {
              const isFavorite = row.original.favorited;

              return (
                <Button
                  aria-label={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }
                  className="h-8 w-8 cursor-pointer p-0"
                  onClick={(e) => {
                    e.stopPropagation();

                    if (isFavorite) {
                      deleteFavoriteItem({ itemId: row.original.id });
                    } else {
                      createFavoriteItem({ itemId: row.original.id });
                    }
                  }}
                  size="icon"
                  variant="ghost"
                >
                  <Star
                    className={`h-4 w-4 ${
                      isFavorite
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </Button>
              );
            },
          },
          {
            accessorKey: "createdAt",
            header: ({ column }) => (
              <DataTableHeaderCell column={column} title="Created At" />
            ),
            cell: ({ row }) => row.original.createdAt.toLocaleString(),
          },
          {
            accessorKey: "updatedAt",
            header: ({ column }) => (
              <DataTableHeaderCell column={column} title="Updated At" />
            ),
            cell: ({ row }) => row.original.updatedAt.toLocaleString(),
          },
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
              <div className="flex gap-2">
                <Button
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();

                    setIsEditDialogOpen(true);
                    setSelectedItem(row.original);
                  }}
                  size="sm"
                >
                  Edit
                </Button>

                <Button
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();

                    setIsDeleteDialogOpen(true);
                    setSelectedItem(row.original);
                  }}
                  size="sm"
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        columnVisibility={columnVisibility}
        data={items || []}
        filterColumn="title"
        filterInputLabel="Search Title"
        onAddClick={() => {
          setIsAddDialogOpen(true);
        }}
        pagination={pagination}
        rowSelection={rowSelection}
        setColumnFilters={setColumnFilters}
        setColumnVisibility={setColumnVisibility}
        setPagination={setPagination}
        setRowSelection={setRowSelection}
        setSorting={setSorting}
        sorting={sorting}
        total={total || 0}
      />

      <FormDialog
        defaultValues={{
          title: "",
          description: "",
        }}
        isLoading={isPendingCreateItem}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={(data) => {
          createItem({
            ...data,
            category: "",
            metadata: {},
          });
          setIsAddDialogOpen(false);
          setSelectedItem(null);
        }}
        open={isAddDialogOpen}
        title="Add Item"
        uiFields={[
          {
            name: "title",
            label: "Title",
            placeholder: "Enter title",
          },
          {
            name: "description",
            label: "Description",
            placeholder: "Enter description",
          },
        ]}
        zodSchema={z.object({
          title: z
            .string()
            .trim()
            .min(1, "Title is required")
            .max(32, "Title is too long"),
          description: z
            .string()
            .trim()
            .min(1, "Description is required")
            .max(256, "Description is too long"),
        })}
      />

      {selectedItem && (
        <FormDialog
          defaultValues={{
            title: selectedItem.title,
            description: selectedItem.description,
          }}
          isLoading={isPendingUpdateItem}
          onOpenChange={setIsEditDialogOpen}
          onSubmit={(data) => {
            updateItem({
              ...data,
              id: selectedItem.id,
            });
            setIsEditDialogOpen(false);
            setSelectedItem(null);
          }}
          open={isEditDialogOpen}
          title="Edit Item"
          uiFields={[
            {
              name: "title",
              label: "Title",
              placeholder: "Enter title",
            },
            {
              name: "description",
              label: "Description",
              placeholder: "Enter description",
            },
          ]}
          zodSchema={z.object({
            title: z
              .string()
              .trim()
              .min(1, "Title is required")
              .max(32, "Title is too long"),
            description: z
              .string()
              .trim()
              .min(1, "Description is required")
              .max(256, "Description is too long"),
          })}
        />
      )}

      {selectedItem && (
        <DeleteDialog
          isLoading={isPendingDeleteItem}
          onOpenChange={setIsDeleteDialogOpen}
          onSubmit={(data) => {
            deleteItem(data);
            setIsDeleteDialogOpen(false);
            setSelectedItem(null);
          }}
          open={isDeleteDialogOpen}
          targetId={selectedItem.id}
          targetName="item"
        />
      )}
    </div>
  );
};
