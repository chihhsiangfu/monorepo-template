"use client";

import {
  OrganizationInvitationTable,
  OrganizationMemberTable,
} from "@repo/better-auth-ui";
import { useParams } from "next/navigation";
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
