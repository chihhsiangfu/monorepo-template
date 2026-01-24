"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { FC } from "react";
import { Button } from "@/components/ui/button";

export const DataTableHeaderCell: FC<{
  title: string;
  column: Column<any, any>;
}> = ({ title, column }) => {
  return (
    <Button
      className="w-full"
      onClick={() => {
        const currentSort = column.getIsSorted();
        if (currentSort === false) {
          column.toggleSorting(false); // Set to asc
        } else if (currentSort === "asc") {
          column.toggleSorting(true); // Set to desc
        } else {
          column.clearSorting(); // Clear sorting
        }
      }}
      variant="ghost"
    >
      {title}

      <div className="ml-2">
        {(() => {
          const sortedState = column.getIsSorted();
          if (sortedState === "asc") {
            return <ArrowUp className="h-4 w-4" />;
          }
          if (sortedState === "desc") {
            return <ArrowDown className="h-4 w-4" />;
          }
          return <ArrowUpDown className="h-4 w-4 opacity-50" />;
        })()}
      </div>
    </Button>
  );
};
