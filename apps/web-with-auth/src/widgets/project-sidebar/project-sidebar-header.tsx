"use client";

import type { FC } from "react";
import { SidebarHeader } from "@/components/ui/sidebar";

export const ProjectSidebarHeader: FC = () => {
  return (
    <SidebarHeader className="h-[57px] border-b">
      <div className="flex h-full items-center justify-center font-semibold text-lg">
        Project
      </div>
    </SidebarHeader>
  );
};
