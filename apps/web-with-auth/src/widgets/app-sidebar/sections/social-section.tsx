"use client";

import { MessageCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export const SocialSection = () => {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Social</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="cursor-pointer"
            onClick={() => {
              router.push("/social");
            }}
          >
            <MessageCircleIcon />
            Social
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
