"use client";

import type {
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { type FC, useMemo, useState } from "react";
import { DataTable } from "../data-table";
import { DataTableHeaderCell } from "../data-table-header-cell";

export const OrganizationInvitationTable: FC = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const data = useMemo(() => {
    const arr = Array.from({ length: 31 }, (_, i) => ({
      id: crypto.randomUUID(),
      name: `Name ${i}`,
      email: `Email ${i}`,
      role: `Role ${i}`,
    }));

    return arr.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize,
    );
  }, [pagination]);

  return (
    <div className="flex flex-col gap-4">
      <h1>Invitations</h1>

      <DataTable
        columns={[
          {
            accessorKey: "name",
            // header: "Name",
            header: ({ column }) => {
              return <DataTableHeaderCell column={column} title="Name" />;
            },
            enableSorting: true,
          },
          {
            accessorKey: "email",
            header: "Email",
          },
          {
            accessorKey: "role",
            header: "Role",
          },
        ]}
        data={data}
        pagination={pagination}
        rowSelection={rowSelection}
        setPagination={setPagination}
        setRowSelection={setRowSelection}
        setSorting={setSorting}
        sorting={sorting}
        total={31}
      />
    </div>
  );
};
