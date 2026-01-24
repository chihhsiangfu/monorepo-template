"use client";

import { AppContent } from "@/widgets/layout/app-content";

export default function DebugPage() {
  return (
    <AppContent
      breadcrumbs={[
        { type: "link", label: "Home", url: "/" },
        { type: "page", label: "Debug" },
      ]}
    >
      <div>Debug</div>
    </AppContent>
  );
}
