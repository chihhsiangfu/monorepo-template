"use client";

import { ItemsDataTable } from "@/components/template/items-data-table";
import { AppContent } from "@/widgets/layout/app-content";

export default function ItemsPage() {
  return (
    <AppContent
      breadcrumbs={[
        { type: "link", label: "Home", url: "/" },
        { type: "page", label: "Template" },
      ]}
    >
      <ItemsDataTable />
    </AppContent>
  );
}
