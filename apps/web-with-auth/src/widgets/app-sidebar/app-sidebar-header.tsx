"use client";

import { OrganizationSwitcher } from "@repo/better-auth-ui";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { SidebarHeader } from "@/components/ui/sidebar";

export const AppSidebarHeader: FC = () => {
  const router = useRouter();

  return (
    <SidebarHeader className="border-b">
      <OrganizationSwitcher
        onSetActiveOrganization={(organizationId) => {
          if (organizationId) {
            router.push(`/organization/${organizationId}`);
          } else {
            router.push("/auth/settings");
          }
        }}
      />
    </SidebarHeader>
  );
};
