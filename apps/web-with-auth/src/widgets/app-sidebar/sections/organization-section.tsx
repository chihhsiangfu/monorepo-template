"use client";

import {
  CylinderIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

export const OrganizationSection = () => {
  const router = useRouter();

  const { data: activeOrganization } = authClient.useActiveOrganization();

  const organizationId = activeOrganization?.id ?? "";

  if (!organizationId) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Organization</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="cursor-pointer"
            onClick={() => {
              router.push(`/organization/${organizationId}`);
            }}
          >
            <LayoutDashboardIcon />
            Dashboard
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            className="cursor-pointer"
            onClick={() => {
              router.push(`/organization/${organizationId}/projects`);
            }}
          >
            <LayoutDashboardIcon />
            Projects
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            className="cursor-pointer"
            onClick={() => {
              router.push(`/organization/${organizationId}/storage`);
            }}
          >
            <CylinderIcon />
            Storage
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            className="cursor-pointer"
            onClick={() => {
              router.push(`/organization/${organizationId}/members`);
            }}
          >
            <UsersIcon />
            Members
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            className="cursor-pointer"
            onClick={() => {
              router.push(`/organization/${organizationId}/settings`);
            }}
          >
            <SettingsIcon />
            Settings
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
