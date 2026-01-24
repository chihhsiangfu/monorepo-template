"use client";

import type { FC } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebarContent } from "./app-sidebar-content";
// import { AppSidebarFooter } from "./app-sidebar-footer";
import { AppSidebarHeader } from "./app-sidebar-header";

export const AppSidebar: FC = () => {
  return (
    <Sidebar variant="sidebar">
      <AppSidebarHeader />
      <AppSidebarContent />
      {/* <AppSidebarFooter /> */}
    </Sidebar>
  );
};
