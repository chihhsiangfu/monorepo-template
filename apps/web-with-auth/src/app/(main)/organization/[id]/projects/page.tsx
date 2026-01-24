"use client";

// import { ProjectDashboard } from "@repo/better-auth-ui";
import { useParams } from "next/navigation";
import { AppContent } from "@/widgets/layout/app-content";

export default function OrganizationProjectsPage() {
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
        { type: "page", label: "Projects" },
      ]}
    >
      {/* <ProjectDashboard referenceId={organizationId} /> */}
      <p>Projects</p>
    </AppContent>
  );
}
