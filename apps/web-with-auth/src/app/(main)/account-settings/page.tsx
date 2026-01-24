"use client";

import { AccountSettingsCard } from "@/components/auth/account-settings-card";
import { AppContent } from "@/widgets/layout/app-content";

export default function AccountSettingsPage() {
  return (
    <AppContent
      breadcrumbs={[
        { type: "link", label: "Home", url: "/" },
        { type: "page", label: "Account Settings" },
      ]}
    >
      <AccountSettingsCard />
    </AppContent>
  );
}
