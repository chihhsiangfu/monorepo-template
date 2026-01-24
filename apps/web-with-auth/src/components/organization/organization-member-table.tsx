"use client";

import { useAuthClient } from "@repo/better-auth-hook";
import type { PaginationState } from "@tanstack/react-table";
import { type FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "../data-table";

export const OrganizationMemberTable: FC = () => {
  const authClient = useAuthClient();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const members = activeOrganization?.members || [];

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  return (
    <div className="flex flex-col gap-4">
      <h1>Members</h1>

      <DataTable
        columns={[
          {
            accessorKey: "user.name",
            header: "Name",
          },
          {
            accessorKey: "user.email",
            header: "Email",
          },
          {
            accessorKey: "role",
            header: "Role",
          },
          {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => row.original.createdAt.toLocaleString(),
          },
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
              <div className="flex gap-2">
                <Button
                  className="cursor-pointer"
                  onClick={() => {
                    console.log(row.original);
                  }}
                  size="sm"
                >
                  Change Role
                </Button>

                <Button
                  className="cursor-pointer"
                  onClick={() => {
                    console.log(row.original);
                  }}
                  size="sm"
                  variant="destructive"
                >
                  Remove
                </Button>
              </div>
            ),
          },
        ]}
        data={members}
        pagination={pagination}
        setPagination={setPagination}
        total={members.length}
      />
    </div>
  );
};
