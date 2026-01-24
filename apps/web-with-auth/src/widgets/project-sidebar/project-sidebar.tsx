"use client";

import type { FC } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { ProjectSidebarContent } from "./project-sidebar-content";
import { ProjectSidebarFooter } from "./project-sidebar-footer";
import { ProjectSidebarHeader } from "./project-sidebar-header";

export const ProjectSidebar: FC = () => {
  return (
    <Sidebar variant="sidebar">
      <ProjectSidebarHeader />
      <ProjectSidebarContent />
      <ProjectSidebarFooter />
    </Sidebar>
  );
};
