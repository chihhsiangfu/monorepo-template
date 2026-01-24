"use client";

import { HashIcon, LayoutDashboardIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export const AdminSidebarContent: FC = () => {
  const router = useRouter();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Admin</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="cursor-pointer"
                onClick={() => {
                  router.push("/admin");
                }}
              >
                <LayoutDashboardIcon />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="cursor-pointer"
                onClick={() => {
                  router.push("/admin/users-management");
                }}
              >
                <UsersIcon />
                Users Management
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="cursor-pointer"
                onClick={() => {
                  router.push("/admin/posts-management");
                }}
              >
                <HashIcon />
                Posts Management
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
