"use client";

import {
  CylinderIcon,
  FlaskConicalIcon,
  HomeIcon,
  SettingsIcon,
  ShieldUserIcon,
} from "lucide-react";
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
import { CommandButton } from "./command/command-button";
import { OrganizationSection } from "./sections/organization-section";
import { SocialSection } from "./sections/social-section";

export const AppSidebarContent: FC = () => {
  const router = useRouter();

  return (
    <SidebarContent>
      <CommandButton />

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="cursor-pointer"
                onClick={() => {
                  router.push("/");
                }}
              >
                <HomeIcon />
                Home
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <OrganizationSection />

      <SocialSection />

      <SidebarGroup>
        <SidebarGroupLabel>User</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="cursor-pointer"
                onClick={() => {
                  router.push("/personal-storage");
                }}
              >
                <CylinderIcon />
                Personal Storage
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                className="cursor-pointer"
                onClick={() => {
                  router.push("/account-settings");
                }}
              >
                <SettingsIcon />
                Account Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

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
                <ShieldUserIcon />
                Admin
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Template</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="cursor-pointer"
                onClick={() => {
                  router.push("/template");
                }}
              >
                <FlaskConicalIcon />
                Template
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
