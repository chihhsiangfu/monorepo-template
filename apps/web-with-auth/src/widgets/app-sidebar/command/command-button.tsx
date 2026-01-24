"use client";

import type { FC } from "react";
import { useState } from "react";
import { Command, CommandShortcut } from "@/components/ui/command";
import { SidebarGroup } from "@/components/ui/sidebar";
import { CommandModal } from "./command-modal";

export const CommandButton: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <SidebarGroup>
      <Command>
        <div className="flex items-center gap-2">
          <button
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setOpen(true)}
            type="button"
          >
            <span className="text-muted-foreground">Search</span>
            <CommandShortcut>⌘K</CommandShortcut>
          </button>
        </div>
      </Command>

      <CommandModal open={open} setOpen={setOpen} />
    </SidebarGroup>
  );
};
