"use client";

import type { FC } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { AdminSidebarContent } from "./admin-sidebar-content";
import { AdminSidebarFooter } from "./admin-sidebar-footer";
import { AdminSidebarHeader } from "./admin-sidebar-header";

export const AdminSidebar: FC = () => {
  return (
    <Sidebar variant="sidebar">
      <AdminSidebarHeader />
      <AdminSidebarContent />
      <AdminSidebarFooter />
    </Sidebar>
  );
};
