"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleXIcon,
  Columns3Icon,
  ListFilterIcon,
} from "lucide-react";
import { type Dispatch, type SetStateAction, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  total,
  pagination,
  setPagination,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
  columnVisibility,
  setColumnVisibility,
  rowSelection,
  setRowSelection,
  onRowClick,
  addButtonLabel = "Add",
  onAddClick,
  filterInputLabel = "Search",
  filterColumn = "name",
}: DataTableProps<TData, TValue> & {
  total: number;
  pagination: PaginationState;
  setPagination: Dispatch<SetStateAction<PaginationState>>;
  sorting?: SortingState;
  setSorting?: Dispatch<SetStateAction<SortingState>>;
  columnFilters?: ColumnFiltersState;
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
  columnVisibility?: VisibilityState;
  setColumnVisibility?: Dispatch<SetStateAction<VisibilityState>>;
  rowSelection?: RowSelectionState;
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
  onRowClick?: (row: TData) => void;
  addButtonLabel?: string;
  onAddClick?: () => void;
  filterInputLabel?: string;
  filterColumn?: string;
}) {
  const id = useId();

  const inputRef = useRef<HTMLInputElement>(null);

  const tableState: Partial<TableState> = {
    pagination,
    sorting,
    columnFilters,
    columnVisibility,
    // rowSelection,
  };
  if (rowSelection) {
    tableState.rowSelection = rowSelection;
  }

  const table = useReactTable({
    data,
    columns: [
      {
        id: "select",
        header: ({ table: headerTable }) => (
          <Checkbox
            aria-label="Select all"
            checked={
              headerTable.getIsAllPageRowsSelected() ||
              (headerTable.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              headerTable.toggleAllPageRowsSelected(!!value)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            aria-label="Select row"
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...columns,
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    rowCount: total,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: tableState,
    debugAll: true,
  });

  return (
    <div>
      <div className="flex items-center gap-2 py-4">
        <div className="relative">
          <Input
            className={cn(
              "min-w-60 ps-9",
              Boolean(table.getColumn(filterColumn)?.getFilterValue()) &&
                "pe-9",
            )}
            onChange={(e) =>
              table.getColumn(filterColumn)?.setFilterValue(e.target.value)
            }
            placeholder={filterInputLabel}
            ref={inputRef}
            value={
              (table.getColumn(filterColumn)?.getFilterValue() ?? "") as string
            }
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <ListFilterIcon aria-hidden="true" size={16} />
          </div>
          {Boolean(table.getColumn(filterColumn)?.getFilterValue()) && (
            <button
              aria-label="Clear filter"
              className="absolute inset-y-0 end-0 flex h-full w-9 cursor-pointer items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                table.getColumn(filterColumn)?.setFilterValue("");
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
              type="button"
            >
              <CircleXIcon aria-hidden="true" size={16} />
            </button>
          )}
        </div>

        <div className="flex-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <Columns3Icon
                aria-hidden="true"
                className="-ms-1 opacity-60"
                size={16}
              />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Toggle columns
            </DropdownMenuLabel>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    checked={column.getIsVisible()}
                    className="capitalize"
                    key={column.id}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex justify-end">
          <Button
            onClick={() => {
              onAddClick?.();
            }}
            size="sm"
          >
            {addButtonLabel}
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="bg-muted/50" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className={onRowClick ? "cursor-pointer hover:bg-muted" : ""}
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label className="max-sm:sr-only" htmlFor={id}>
            Rows per page
          </Label>
          <Select
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            value={table.getState().pagination.pageSize.toString()}
          >
            <SelectTrigger
              className="w-fit whitespace-nowrap"
              id={id}
              size="sm"
            >
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* <div className="flex-1 text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  aria-label="Go to first page"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.firstPage()}
                  size="icon"
                  variant="outline"
                >
                  <ChevronFirstIcon aria-hidden="true" size={16} />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  aria-label="Go to previous page"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  disabled={!table.getCanPreviousPage()}
                  onClick={() => table.previousPage()}
                  size="icon"
                  variant="outline"
                >
                  <ChevronLeftIcon aria-hidden="true" size={16} />
                </Button>
              </PaginationItem>
              {/* Page number */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
              </div>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  aria-label="Go to next page"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.nextPage()}
                  size="icon"
                  variant="outline"
                >
                  <ChevronRightIcon aria-hidden="true" size={16} />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  aria-label="Go to last page"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  disabled={!table.getCanNextPage()}
                  onClick={() => table.lastPage()}
                  size="icon"
                  variant="outline"
                >
                  <ChevronLastIcon aria-hidden="true" size={16} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
