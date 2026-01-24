"use client";

import { AppContent } from "@/widgets/layout/app-content";

export default function OrganizationDashboardPage() {
  return (
    <AppContent
      breadcrumbs={[
        { type: "link", label: "Home", url: "/" },
        { type: "page", label: "Organization" },
      ]}
    >
      <div>Organization Dashboard</div>
    </AppContent>
  );
}
