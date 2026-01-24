"use client";

import { useParams, useRouter } from "next/navigation";
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

export const ProjectSidebarContent: FC = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Project</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="cursor-pointer"
                onClick={() => {
                  router.push(`/project/${id}`);
                }}
              >
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
