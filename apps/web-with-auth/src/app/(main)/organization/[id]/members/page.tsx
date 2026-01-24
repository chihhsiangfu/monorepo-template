"use client";

import { useParams } from "next/navigation";
import { OrganizationInvitationTable } from "@/components/organization/organization-invitation-table";
import { OrganizationMemberTable } from "@/components/organization/organization-member-table";
import { AppContent } from "@/widgets/layout/app-content";

export default function OrganizationMembersPage() {
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
        { type: "page", label: "Members" },
      ]}
    >
      <OrganizationMemberTable />

      <OrganizationInvitationTable />
    </AppContent>
  );
}
