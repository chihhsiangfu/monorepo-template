"use client";

import { AppContent } from "@/widgets/layout/app-content";

export default function Home() {
  return (
    <AppContent breadcrumbs={[{ type: "page", label: "Home" }]}>
      <div>Home</div>
    </AppContent>
  );
}
