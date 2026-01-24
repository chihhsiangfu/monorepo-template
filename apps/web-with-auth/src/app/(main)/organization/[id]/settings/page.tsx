"use client";

import { useParams } from "next/navigation";
import { OrganizationSettingsCard } from "@/components/organization/organization-settings-card";
import { AppContent } from "@/widgets/layout/app-content";

export default function OrganizationSettingsPage() {
  const { id: organizationId } = useParams<{ id: string }>();

  return (
    <AppContent
      breadcrumbs={[
        { type: "link", label: "Home", url: "/" },
        {
          type: "link",
          label: "Organization",
          url: `/organization/${organizationId}`,
        },
        { type: "page", label: "Settings" },
      ]}
    >
      <OrganizationSettingsCard />
    </AppContent>
  );
}
